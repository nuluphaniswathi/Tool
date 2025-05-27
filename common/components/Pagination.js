import React from "react";
import { primary_color } from "../constants/constant";

const Pagination = ({
  currentPage,
  totalPages,
  paginate,
  maxPageNumbers = 4,
}) => {
  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-20px",
    padding: "10px",
  };

  const pageButtonStyle = {
    border: `1px solid ${primary_color}`,
    padding: "5px 10px",
    margin: "0 5px",
    color: primary_color,
    backgroundColor: "transparent",
  };

  const currentPageNumberStyle = {
    border: `1px solid ${primary_color}`,
    padding: "5px 10px",
    margin: "0 5px",
    color: "white",
    backgroundColor: primary_color,
  };

  const handlePrevClick = () => {
    paginate(Math.max(currentPage - 1, 1));
  };

  const handleNextClick = () => {
    paginate(Math.min(currentPage + 1, totalPages));
  };

  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  if (currentPage <= Math.floor(maxPageNumbers / 2)) {
    startPage = 1;
    endPage = Math.min(totalPages, maxPageNumbers);
  } else if (currentPage >= totalPages - Math.floor(maxPageNumbers / 2)) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - maxPageNumbers + 1);
  }

  return (
    <div style={paginationStyle} className="mb-8">
      <button
        className="btn btn-outline-secondary"
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        style={pageButtonStyle}
      >
        Prev
      </button>
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
      ).map((number) => (
        <button
          key={number}
          className={`btn ${
            number === currentPage ? "btn-primary" : "btn-outline-secondary"
          }`}
          onClick={() => paginate(number)}
          style={
            number === currentPage ? currentPageNumberStyle : pageButtonStyle
          }
        >
          {number}
        </button>
      ))}
      <button
        className="btn btn-outline-secondary"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        style={pageButtonStyle}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
