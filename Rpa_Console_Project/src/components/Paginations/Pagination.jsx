import React from "react";

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const goToNextPage = (event) => {
    event.preventDefault();
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = (event) => {
    event.preventDefault();
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (pageNumber, event) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  return (
    <nav>
      <ul className="pagination inline-flex -space-x-px text-sm">
        <li className="page-item">
          <a
            className="page-link flex items-center justify-center px-3 h-8 ms-0 leading-tight  border border-e-0  rounded-s-lg   bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700 text-gray-400 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white"
            onClick={goToPrevPage}
            href="#"
          >
            Previous
          </a>
        </li>
        {pageNumbers.map((pgNumber) => (
          <li
            key={pgNumber}
            className={`page-item ${currentPage == pgNumber ? "active" : ""} `}
          >
            <a
              onClick={(event) => goToPage(pgNumber, event)}
              className="page-link flex items-center justify-center px-3 h-8 leading-tight border bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700 text-gray-400 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white"
              href="#"
            >
              {pgNumber}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a
            className="page-link   flex items-center justify-center px-3 h-8 leading-tight  border  rounded-e-lg  bg-gray-800 dark:bg-gray-800 border-gray-700 dark:border-gray-700 text-gray-400 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white"
            onClick={goToNextPage}
            href="#"
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
