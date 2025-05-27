import React from "react";
import { dateFilterForDeliveryGovernance } from "../../common/constants/risk-constants";
import Select from "../../common/components/select/Select";
import MultiSelectGDOFilter from "../../common/components/filter/MultiSelectGDOFilter";
import { primary_color } from "../../common/constants/constant";
import { FaDownload } from "react-icons/fa";
import CSGuidelines from "./csGuidelines";



const CustomerSentimentHeader = ({
  gdoFilters,
  setGDOFilters,
  selectedDate,
  setSelectedDate,
  showReset,
  setShowReset,
  selectedProjects,
  setSelectedProjects,
  selectedDFilter,
  setSelectedDFilter,
  selectedGDO,
  setSelectedGDO,
  resetData,
  fetchFilteredData,
  downloadReport
}) => {
  const handleDateFilterChange = (e) => {
    setSelectedDate(e);
  };

  return (
    <div className="d-flex p-2 align-items-center flex-wrap justify-content-between mb-2">
      <div className="d-flex">
        <div className="me-2">
          <label>
            <Select
              options={dateFilterForDeliveryGovernance}
              onSelectChange={handleDateFilterChange}
              selectedValue={selectedDate}
              placeholder={"Filter By Date"}
              isMultiple={false}
              closeMenuOnSelect={true}
            />
          </label>
        </div>
        <div>
          <MultiSelectGDOFilter
            gdoFilters={gdoFilters}
            setGDOFilters={setGDOFilters}
            selectedGDO={selectedGDO}
            setSelectedGDO={setSelectedGDO}
            setShowReset={setShowReset}
            setSelectedProjects={setSelectedProjects}
            selectedProjects={selectedProjects}
            isDeliveryGovernanceSection={true}
            selectedDFilter={selectedDFilter}
            setSelectedDFilter={setSelectedDFilter}
          />
        </div>
        <div className="d-flex align-actions-center">
          <button
            className="btn primary-color btn-s risk-button"
            onClick={() => {
              fetchFilteredData();
              setShowReset(true);
            }}
            disabled={
              !(
                selectedProjects?.length > 0 ||
                selectedDate ||
                selectedGDO.length > 0 ||
                selectedDFilter.length > 0
              )
            }
          >
            Search
          </button>
          {showReset && (
            <button
              className="btn btn-s reset-button mr-3"
              onClick={() => {
                resetData();
              }}
            >
              Reset
            </button>
          )}
          </div>
          </div>
          <div className="d-flex justify-content-end p-2">
          {(selectedProjects?.length > 0 ||
            selectedGDO.length > 0 ||
            selectedDFilter.length > 0) && (
            <button className="btn download-icon pe-2" >
              <FaDownload size={26} color={primary_color}  onClick={downloadReport}/>
            </button>
          )}
          <CSGuidelines/>
         </div>
      </div>
  );
};

export default CustomerSentimentHeader;
