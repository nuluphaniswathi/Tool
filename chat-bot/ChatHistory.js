import React, { useState, useEffect, useMemo } from "react";
import Select from "../../common/components/select/Select";
import { fetchProjects } from "../../api/projects";
import "./ChatBot.css";

const ChatHistory = ({
  chatHistory,
  handleSubmit,
  lastMessageRef,
  isBotTyping,
  isProjectDropDown,
}) => {
  const [expandedMessages, setExpandedMessages] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [clickedButtons, setClickedButtons] = useState({});
  const [lastProjectDropDownIndex, setLastProjectDropDownIndex] = useState(-1);
  const handleProjectChange = (option) => {
    setSelectedProject(option);
    handleSubmit(null, option.label);
  };
  const handleButtonClick = (e, buttonValue, index) => {
    e.preventDefault();
    setClickedButtons((prevState) => ({
      ...prevState,
      [index]: true,
    }));
    handleSubmit(e, buttonValue);
  };
  const handleViewMoreClick = () => {
    setExpandedMessages(!expandedMessages);
  };

  const formattedProjectsList = useMemo(() => {
    return projectList?.map((project) => ({
      label: project.title,
      value: project.id,
    }));
  }, [projectList]);
  useEffect(() => {
    const getProjectNames = async () => {
      try {
        const projectData = await fetchProjects();
        setProjectList(projectData?.data?.projects || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    getProjectNames();
  }, []);
  useEffect(() => {
    if (isProjectDropDown) {
      const lastIndex = chatHistory.length - 1;
      setLastProjectDropDownIndex(lastIndex);
    }
  }, [isProjectDropDown,chatHistory]);

  return (
    <div className="chatHistory" ref={lastMessageRef}>
      {isBotTyping ? (
        <div className="chatBubble bot">Typing...</div>
      ) : (
        <>
          {chatHistory.length > 0 &&
            chatHistory.map((each, index) => {
              if (!each.messages) return null;
              return each.messages.map((message, msgIndex) => {
                return (
                  <div
                    key={`${index}-${msgIndex}`}
                    className={`chatBubble ${each.isUser ? "user" : "bot"}`}
                  >
                    {!each.projectDetails &&
                      message.contentType === "PlainText" && (
                        <div>{message.content}</div>
                      )}
                    {each.projectDropDown && index === lastProjectDropDownIndex && (
                      <Select
                        options={formattedProjectsList}
                        onSelectChange={handleProjectChange}
                        setSelectedProjects={setSelectedProject}
                        selectedProjects={selectedProject}
                        isSearchable={true}
                      />
                    )}
                    {each.projectDetails && message.content === "Project Details" && (
                      <div className="project-details">
                        <b>Title:</b> {each.projectDetails.title || "-"}
                        <br />
                        <b>Client Name:</b>{" "}
                        {each.projectDetails.client_name || "-"}
                        <br />
                        <b>Delivery Head:</b>{" "}
                        {each.projectDetails.delivery_head || "-"}
                        <br />
                        <b>Project Manager:</b>{" "}
                        {each.projectDetails.p_manager || "-"}
                        <br />
                        <b>Start Date:</b> {each.projectDetails.sd || "-"}
                        <br />
                        <b>End Date:</b> {each.projectDetails.ed || "-"}
                        <br />
                        {expandedMessages && (
                          <>
                            <b>Domain:</b>
                            {each.projectDetails.domain || "-"}
                            <br />
                            <b>Open Risks:</b>
                            {each.projectDetails.openRisks.length > 0 ? (
                              <ul>
                                {each.projectDetails.openRisks.map((risk) => (
                                  <li key={risk.id}>{risk.comments}</li>
                                ))}
                              </ul>
                            ) : (
                              <span>-</span>
                            )}
                            <br />
                            <b>Action Items:</b>
                            {each.projectDetails.actionItems.length > 0 ? (
                              <ul>
                                {each.projectDetails.actionItems.map((item) => (
                                  <li key={item.id}>{item.action_item}</li>
                                ))}
                              </ul>
                            ) : (
                              <span>-</span>
                            )}
                            <br />
                          </>
                        )}
                        <button
                          className="showMore"
                          onClick={handleViewMoreClick}
                        >
                          {!expandedMessages ? "View More" : "View Less"}
                        </button>
                      </div>
                    )}
                    {message.contentType === "ImageResponseCard" && (
                      <div className="imageResponseCard">
                        {/*{message.imageResponseCard.imageUrl && (
                  <img
                    src={message.imageResponseCard.imageUrl}
                    alt={`Response card for ${message.imageResponseCard.title}`}
                  />
               )}*/}
                        <div className="title">
                          {message.imageResponseCard.title}
                        </div>
                        <div className="subtitle">
                          {message.imageResponseCard.subtitle}
                        </div>

                        {!clickedButtons[index] && (
                          <div className="buttonContainer">
                            {message.imageResponseCard.buttons.map(
                              (button, buttonIndex) => (
                                <div key={buttonIndex}>
                                  <button
                                    value={button.value}
                                    onClick={(e) =>
                                      handleButtonClick(e, button.value, index)
                                    }
                                  >
                                    {button.text}
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              });
            })}
        </>
      )}
    </div>
  );
};

export default ChatHistory;
