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

  const navigate = useNavigate();

  const enterRoom = ({roomId}:{roomId: string}) => {
    console.log(roomId);
    navigate(`/room/${roomId}`);
  };

  const getUsers =({participants} : {participants : string[]}) => {
    console.log(participants);
  }

  const removeUser = (userId : string) => {
    dispatch(removeUserAction(userId));
  }

  const handleMessage = (message: any) => {
    console.log(message);
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
      }
    }
    if(message.type === "userLeft"){
      removeUser(message.userID);
    }
  }
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
    ws.onmessage = (event) => {    
        const message = JSON.parse(event.data.toString());
        handleMessage(message);        
      }
  }, []);

  useEffect(() =>{
    if(!user) return 
    if(!stream) return
    console.log('working');
    ws.onmessage = (event) => {    
      const message = JSON.parse(event.data.toString());
      console.log(message);
      handleMessage(message);
    }
    user.on('call', (call) => {
      call.answer(stream)
      call.on('stream', (userStream) => {
        dispatch(addUserAction(call.peer,userStream));
      })
    })

  },[user,stream])

  console.log({allUsers});
  return (<RoomContext.Provider value={{ ws,user,stream, allUsers}}>{children}</RoomContext.Provider>);
};
