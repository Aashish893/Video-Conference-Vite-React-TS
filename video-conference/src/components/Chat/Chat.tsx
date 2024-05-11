import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { MessageType } from "../../tyeps/chat";

export const  Chat:React.FC = ({}) => {
    
    const messages : MessageType[] =[{
        content : "Message1",
        author : '',
        timestamp :'',
    },
    {
        content : "Message2",
        author : '',
        timestamp :'',
    }];

    return (
        <div className="flex flex-col h-full justify-between">
           <div>
                {messages.map((message) => (
                    <ChatBubble message={message}/>
                ))}
            </div>
            <ChatInput/>
        </div>
        
    );
}