import Peer from "peerjs";
import { ReactNode, createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { userReducer } from "../Reducers/userReducer";
import { addUserAction, removeUserAction } from "./userActions";

const WS_Url = "ws://localhost:8080";

const ws = new WebSocket(WS_Url);


export const RoomContext = createContext<null | any>(null);

interface Props {
  children: ReactNode;
}

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [user, setUser] = useState<Peer>();
  const [stream,setStream] = useState<MediaStream>();
  const [allUsers, dispatch] = useReducer(userReducer, {});
  const [sharedScreenID, setSharedScreenID] = useState<String>();
  const [connections, setConnections] = useState<any[]>([]);

  const navigate = useNavigate();

  const enterRoom = ({roomId}:{roomId: string}) => {
    navigate(`/room/${roomId}`);
  };

  const getUsers =({participants} : {participants : string[]}) => {
    console.log(participants);
  }

  const removeUser = (userId : string) => {
    dispatch(removeUserAction(userId));
    setConnections(prevConnections => prevConnections.filter(conn => conn.peer !== userId));
  }

  const handleMessage = (message: any) => {

    if (message.type === "createRoomSuccess") {
      enterRoom({roomId : message.roomID});
    }
    if(message.type === 'getUsers'){
      getUsers({participants : message.participants});
    }
    if (message.type === "userJoined"){
      console.log("This user Joined", message.userID);
      if(user && stream) {
        const call = user.call(message.userID,stream);
        call.on('stream', (userStream) => {
          dispatch(addUserAction(message.userID,userStream));
        })
        setConnections(prevConnections => [...prevConnections, call]);
      }
    }
    if(message.type === "userLeft"){
      removeUser(message.userID);
    }
  }
  const switchStream = (stream: MediaStream) =>{
    setStream(stream);
    setSharedScreenID(user?.id || "" );
    
    Object.keys(connections).forEach((user:any) => {
      const videoStream = stream?.getTracks().find(track => track.kind==='video')
      user[0].peerConnection.getSeners()[1].replaceTrack(videoStream).catch((err: any) => console.log(err));      
    })
  }

  const screenShare = () => {
    if(sharedScreenID){
      navigator.mediaDevices.getUserMedia({video:true, audio:true}).then(switchStream)
    }else{
      navigator.mediaDevices.getDisplayMedia({}).then(switchStream)
    }
  };



  useEffect(() => {
    const userId = uuidV4();
    const newUser = new Peer(userId);
    setUser(newUser);
    try {
      navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream) => {
        setStream(stream);
      })
    } catch (error) {
      console.error(error);
    }
    console.log(userId)
    ws.onmessage = (event) => {    
        const message = JSON.parse(event.data.toString());
        
        handleMessage(message);        
      }
  }, []);


  useEffect(() =>{
    if(!user) return 
    if(!stream) return

    ws.onmessage = (event) => {    
      const message = JSON.parse(event.data.toString());

      handleMessage(message);
    }
    user.on('call', (call) => {
      call.answer(stream)
      call.on('stream', (userStream) => {
        dispatch(addUserAction(call.peer,userStream));
      })
    })

  },[user,stream])

  return (
  <RoomContext.Provider value={{ ws,user,stream, allUsers, screenShare}}>
    {children}
  </RoomContext.Provider>);
};
