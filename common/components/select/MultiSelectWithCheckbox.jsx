import React, {useEffect} from 'react';
import MultiSelect from '@khanacademy/react-multi-select';
import cx from 'classnames';
import './multi-select.css'
 
const MultiSelectWithCheckbox = (props) => {

  const {options, loadingMsg, onSelectChange, selectedValue=[], placeholder, disabled, type } = props

  // if (!Array.isArray(options) || options.length === 0 || !options[0].hasOwnProperty('value') || !options[0].hasOwnProperty('label')) {
  //   return null; // or handle the case when options is undefined, empty, or not in the correct format
  // }
  useEffect(() => {
    const inputs = document.querySelectorAll('.multi-select-search'); 
    inputs.forEach(input => {
      input.addEventListener('keydown', handleKeyDown);
    });
 
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('keydown', handleKeyDown);
      });
    };
  },[]);
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };
 
  return (
    <div
      className={cx("multi-select-wrap","multi-select-search",{
        "dropdown-disabled": disabled,
        "no-options": options.length === 0,
      },
      type === "gdo" && "gdo-filter")}
    >
      <MultiSelect
        overrideStrings={{
          selectSomeItems: placeholder ? (<div data-tooltip={placeholder} title={placeholder}>{placeholder.length > 15
            ? `${placeholder.slice(0, 15)}...`
            : placeholder}</div>) : ("Select"),
          allItemsAreSelected: "All",
          selectAll:
            options.length > 0
              ? "All"
              : loadingMsg
              ? "Loading..."
              : "No Options",
          search: "Search",
        }}
        options={options}
        selected={selectedValue}
        onSelectedChanged={onSelectChange}
        disableSearch={options.length > 0 ? false : true}
        searchable={false}
        disabled={disabled}
      />
    </div>
  );
};
 
export default MultiSelectWithCheckbox;