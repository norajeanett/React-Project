import React from 'react';
import './styles/Pagination.css';

/**
 * 
 * @param currentPage - The current page in the api pager
 * @param totalPages - The total number of pages in api pager
 * @param onPrevious - handler to set the previous page
 * @param onNext - handler to set the next page 
 * 
 * @returns - Buttons to selects previous and next page
 */
const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
    return (
        <div className="pagination-container">
            <button 
                className="pagination-button" 
                onClick={onPrevious} 
                disabled={currentPage <= 1}
            >
                Previous
            </button>

            <span className="pagination-info">
                Page {currentPage} of {totalPages}
            </span>

            <button 
                className="pagination-button" 
                onClick={onNext} 
                disabled={currentPage >= totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;


