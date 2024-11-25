import React, { useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import Search from '../components/Search';
import SchoolList from '../components/SchoolList';
import Pagination from '../components/Pagination';
import SchoolListSize from '../components/SchoolListSize';
import { schoolSearchQueryJambalaya } from '../api/api';

/**
 * @param activePage - state of active page selected
 * @param activePageHandler - handler for setting state of active page
 * @param activeIdHandler - handler for setting state of current school id
 * @param activeNameHandler - handler for setting state of current school name
 * 
 * @constant searchTerm - state conatining search query
 * @constant page - state conatining current page from the api call
 * @constant pageSize - state containing size of page from api call
 * @constant schools - school data
 * @constant totalItems - total count of items
 * 
 * @returns components: Search, SchoolListSize, SchoolList and Pagination
 */
const Schools = ( {activePage, activePageHandler, activeIdHandler, activeNameHandler} ) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(0); 

    // dhis2 runtime hook for requesting data from api
    const { loading, error, data, refetch } = useDataQuery(schoolSearchQueryJambalaya, {
        variables: { searchWord: searchTerm, pageNumber: page, pageSize: pageSize },
    });

    // Extract schools data and total count of items
    const schools = data?.organisationUnits || [];
    
    const totalItems = data?.organisationUnitsCount?.organisationUnits?.length || 0;
    let totalPages = Math.ceil(totalItems / (pageSize ? pageSize : 10));

    // handle search input
    const handleSearch = (term) => {
        setSearchTerm(term);
        setPage(1); 
        refetch({ searchWord: term, pageNumber: 1, pageSize: pageSize }).then((response) => {
            // Extract the count from the response after refetching
            const totalItems = response?.data?.organisationUnitsCount?.length || 0;
            totalPages = Math.ceil(totalItems / pageSize);  
        });
    };

    // go to previous page
    const handlePreviousPage = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            refetch({ searchWord: searchTerm, pageNumber: newPage, pageSize: pageSize });
        }
    };

    // go to next page
    const handleNextPage = () => {
        if (page < totalPages) {
            const newPage = page + 1;
            setPage(newPage);
            refetch({ searchWord: searchTerm, pageNumber: newPage, pageSize: pageSize });
        }
    };

    // set page size
    const handlePageSize = (size) => {
        setPageSize(size);
        refetch( { pageSize: size });
    }

    return (
        <div>
            <Search onSearch={handleSearch} />
            <SchoolListSize handler={handlePageSize} />
            <SchoolList schools={schools} loading={loading} error={error} activePage={activePage} activePageHandler={activePageHandler} activeIdHandler={activeIdHandler} activeNameHandler={activeNameHandler}/>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
            />
        </div>
    );
};

export default Schools;