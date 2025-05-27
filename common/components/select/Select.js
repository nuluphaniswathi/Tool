import React from "react";
import { MdArrowDropDown } from "react-icons/md";
import { default as ReactSelect, components } from "react-select";
import "./multi-select.css";
import { primary_color } from "../../constants/constant";

const selectStyles = (customFontSize) => ({
  control: (provided, state) => ({
    ...provided,
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    borderColor: "lightgrey",
    color: "black",
    fontSize: customFontSize || "14px",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: 1,
    boxShadow: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minHeight: "36px",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    "&:hover": {
      borderColor: "lightgrey",
      boxShadow: "none",
    },
  }),
  option: (styles, state) => ({
    ...styles,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "black",
    backgroundColor: "white",
    borderBottom: "1px solid rgba(0, 0, 0, 0.125)",
    cursor: "pointer",
    "&:hover": {
      color: "black",
      backgroundColor: "#DADADA",
    },
    ...(state.isSelected && {
      backgroundColor: primary_color,
      color: "white",
    }),
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "0 !important",
    cursor: "pointer",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0px !important",
    color: "rgb(153, 153, 153) !important",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "grey" : "black",
    fontSize: customFontSize || "14px",
  }),
});

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <MdArrowDropDown style={{ width: "26px", height: "36px" }} />
    </components.DropdownIndicator>
  );
};

const Option = (props) => {
  return (
    <components.Option {...props}>
      <div
        className="ellipsis-tooltip"
        data-tooltip={props.data.label}
        title={props.data.label}
      >
        {props.data.label}
      </div>
    </components.Option>
  );
};

const Select = (props) => {
  const {
    options,
    onSelectChange,
    selectedValue,
    placeholder,
    isMultiple = false,
    closeMenuOnSelect = false,
    disabled = false,
    isHeatMap = false,
    isSearchable = false,
    fullWidth,
    customFontSize,
  } = props;

  return (
    <div
      className={`${disabled ? "disable-select" : ""} ${
        isHeatMap ? "select-wrap" : "multi-select-wrap"
      } ${fullWidth ? "full-width-select" : ""}`}
    >
      <ReactSelect
        options={options}
        hideSelectedOptions={false}
        closeMenuOnSelect={closeMenuOnSelect}
        isClearable={false}
        tabSelectsValue={false}
        isSearchable={isSearchable}
        components={{
          DropdownIndicator,
          IndicatorSeparator: null,
          Option,
        }}
        onChange={(e) => onSelectChange(e)}
        styles={selectStyles(customFontSize)}
        placeholder={placeholder}
        value={selectedValue}
        isMulti={isMultiple}
        isDisabled={disabled}
      />
    </div>
  );
};

export default Select;
