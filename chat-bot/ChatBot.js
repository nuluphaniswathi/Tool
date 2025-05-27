import React, { useState, useEffect, useRef, useCallback } from "react";
import lexRuntimeV2 from "./aws-config";
import { LuSendHorizonal } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";
import favicon from "../images/favicon copy.ico";
import "./ChatBot.css";
import ChatHistory from "./ChatHistory";

const Chatbot = ({ toggle, sessionId }) => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isChatbotInitialized, setIsChatbotInitialized] = useState(false);
  const lastMessageRef = useRef(null);
  const [isProjectDropDown, setIsProjectDropDown] = useState(false);

  const handleSubmit = useCallback(
    async (e, inputMessage = input, skipUserMsg = false) => {
      e?.preventDefault();
      if (inputMessage.trim() === "") return;
      if (!skipUserMsg) {
        const newUserMessage = {
          messages: [
            {
              contentType: "PlainText",
              content: inputMessage,
            },
          ],
          isUser: true,
        };
        setChatHistory((prevHistory) => [...prevHistory, newUserMessage]);
      }
      setInput("");
      try {
        setIsBotTyping(true);
        const botResponse = await lexRuntimeV2
          .recognizeText({
            botId: process.env.REACT_APP_BOT_ID,
            botAliasId: process.env.REACT_APP_BOT_ALIAS_ID,
            localeId: process.env.REACT_APP_LOCALE_ID,
            sessionId: sessionId,
            text: inputMessage,
          })
          .promise();
        const intentName = botResponse.sessionState?.intent?.name;
        const intentState = botResponse.sessionState?.intent?.state;
        let projectDetails = null;
        if (
          intentName === "projects_specifics" &&
          intentState === "Fulfilled"
        ) {
          
          projectDetails = botResponse.sessionState?.sessionAttributes
            ?.project_details
            ? JSON.parse(
                botResponse.sessionState.sessionAttributes.project_details
              )
            : null;
        }
        const isProjectDropDown =
          intentName === "projects_specifics" &&
          botResponse.sessionState?.dialogAction?.type === "ElicitSlot" &&
          botResponse.sessionState?.dialogAction?.slotToElicit === "project";
        setIsProjectDropDown(isProjectDropDown);
        const botResponseMessage = {
          messages: botResponse.messages,
          projectDetails: projectDetails,
          projectDropDown: isProjectDropDown,
          isUser: false,
        };
        setIsBotTyping(false);
        setChatHistory((prevHistory) => [...prevHistory, botResponseMessage]);
        setInput("");
      } catch (error) {
        setIsBotTyping(false);
        console.error("Error sending message to Lex:", error);
      }
    },
    [input, sessionId]
  );
  const handleClose = () => {
    setChatHistory([]);
    toggle();
  };

  useEffect(() => {
    if (!isChatbotInitialized) {
      setIsChatbotInitialized(true);
      handleSubmit(null, "Hi", true);
    }
  }, [isChatbotInitialized, handleSubmit]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollTop = lastMessageRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="chatBot">
      <div className="chatBotHeader">
        <img src={favicon} className="veltris-logo" alt="veltris" />
        <span size={25}>VeltriZ</span>
        <button onClick={handleClose}>
          <FaAngleDown size={25} />
        </button>
      </div>
      <ChatHistory
        chatHistory={chatHistory}
        handleSubmit={handleSubmit}
        lastMessageRef={lastMessageRef}
        isBotTyping={isBotTyping}
        isProjectDropDown={isProjectDropDown}
      />
      <form className="chatForm" onSubmit={handleSubmit}>
        <input
          placeholder="Type a message"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        ></input>
        <button type="submit">
          <LuSendHorizonal size={25} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
