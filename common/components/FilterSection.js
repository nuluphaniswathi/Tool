import React from "react";

function FilterSection({ title, options, onChange }) {
  const handleOptionChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="me-1">
      <h6 className="pt-1">{title}</h6>
      <label htmlFor="filter" className="form-label pt-2">
        <select
          name="filter"
          id="filter"
          className="form-select"
          onChange={handleOptionChange}
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FilterSection;
