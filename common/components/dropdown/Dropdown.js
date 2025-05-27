import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdCheckmark } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { FaTrashCan } from "react-icons/fa6";
import "./Dropdown.css";

const CustomDropdown = ({
  placeholder,
  options,
  selectedOptions,
  handleOptionSelection,
  handleRemoveOption,
  setIsDropdownOpen,
  isDropdownOpen,
  noOptions,
}) => {
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={placeholder === "Select a Risk" ? "p-2" : ""}>
      <div className="placeholder" onClick={toggleDropdown} style={{paddingLeft:"12px"}}>
        {placeholder} <IoIosArrowDown />
      </div>
      {isDropdownOpen && (
        <ul className="options">
          {options?.length === 0 ? (
            <li>{noOptions}</li>
          ) : (
            options?.map((option, index) => (
              <li key={index}>
                <span>{option.label}</span>
                <div onClick={(e) => e.stopPropagation()}>
                  {selectedOptions?.find(
                    (item) => item.value === option.value
                  ) ? (
                    <IoMdCheckmark
                      className="toggle"
                      onClick={() => handleOptionSelection(option)}
                    />
                  ) : (
                    <LuPlus
                      className="toggle"
                      onClick={() => handleOptionSelection(option)}
                    />
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
      {selectedOptions?.length > 0 && (
        <div className="p-2">
          {selectedOptions.map((option, index) => (
            <div key={index} className="selected-option">
              <span className="selected-option-text">{option.label}</span>
              <button
                className="remove-option-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveOption(index);
                }}
              >
                <FaTrashCan />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
