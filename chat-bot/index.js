import "./index.css";
import Chatbot from "./ChatBot";
import { useState, useEffect } from "react";
import { IoChatboxEllipsesSharp } from "react-icons/io5";

function ChatBotUI() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id
  const [isChatbotClicked, setIsChatbotClicked] = useState(false);
  const [sessionId, setSessionId] = useState(`session_${userId || "guest"}_${Date.now()}`);
  const toggle = () => {
    if(!isChatbotClicked){
      setSessionId(`session_${userId || "guest"}_${Date.now()}`)
    }
    setIsChatbotClicked(!isChatbotClicked);
  };
  useEffect(() => {
    if(isChatbotClicked){
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isChatbotClicked]);
  return (
    <div className="bot-ui">
      {!isChatbotClicked && (
        <button className="chatbot-icon-button" onClick={toggle}>
          <IoChatboxEllipsesSharp size={25}/>
        </button>
      )}
      {isChatbotClicked && (<Chatbot toggle={toggle} sessionId={sessionId}/>)}
    </div>
  );
}

export default ChatBotUI;