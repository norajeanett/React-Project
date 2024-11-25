import React from 'react';
import { useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { inspections, DHIS2_CONFIG } from '../api/api';
import classes from '../App.module.css';
import InspectionInfo from '../components/InspectionInfo';
import { Button, CircularLoader } from '@dhis2/ui';
import { Table, TableHead, TableRowHead, TableCellHead, TableBody, TableRow, TableCell } from '@dhis2/ui';
import Pagination from '../components/Pagination';
import style from './styles/SchoolInfo.module.css';

const inspectionDataTemplate = {
    id: '',
    schoolName: '',
    date: '',
    seatsForStudents: '',
    numberOfStudents: '',
    numberOfTextbooks: '',
    numberOfClassrooms: '',
    numberOfTeachers: '',
    toiletsForTeachers: '',
    toiletsForStudents: '',
    condition: '',
};

/**
 * 
 * @param id - School ID
 * @param displayName - School name
 * @param activePage - Current active page
 * @param activePageHandler - Handler to change active page
 * @param activeNameHandler - Handler to set active school name
 * @param activeIdHandler - Handler to set active school ID
 * 
 * @returns A table of inspections 
 */
const SchoolInfo = ({ id, displayName, activePage, activePageHandler, activeNameHandler, activeIdHandler }) => {
    const [inspectionDataValues, setInspectionDataValues] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(0);
    const { loading, error, data, refetch } = useDataQuery(inspections, {
        variables: { id: id, pageNumber: page },
    });
    console.log(data)
    
    // Loading state
    if (loading) return <div><CircularLoader large /></div>;
    
    // Error state
    if (error) return <div>Error: {error.message}</div>;
    
    // Filtered data
    const inspectionList = (data?.events.events || []).filter(unit => unit.program === 'UxK2o06ScIe');

    const totalItems = data?.eventsCount?.events?.length || 0;
    let totalPages = Math.ceil(totalItems / (pageSize ? pageSize : 10));
    console.log(totalItems)

    // go to previous page
    const handlePreviousPage = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            refetch({ pageNumber: newPage, pageSize: pageSize });
        }
    };

    // go to next page 
    const handleNextPage = () => {
        if (page < totalPages) {
            const newPage = page + 1;
            setPage(newPage);
            refetch({ pageNumber: newPage, pageSize: pageSize });
        }
    };

    // Function to populate inspection data
    const fillInspectionData = (schoolName, date, dataValues, id) => {
        console.log(dataValues, id)
        const updatedData = { ...inspectionDataTemplate, id, schoolName, date };
        dataValues.map(dataValue => {
            switch(dataValue.dataElement) {
                case DHIS2_CONFIG.dataElements.seatsForStudents:
                    updatedData.seatsForStudents = dataValue.value;
                    break;
                case DHIS2_CONFIG.dataElements.numberOfStudents:
                    updatedData.numberOfStudents = dataValue.value;
                    break;
                case DHIS2_CONFIG.dataElements.numberOfTextbooks:
                    updatedData.numberOfTextbooks = dataValue.value;
                    break;
                case DHIS2_CONFIG.dataElements.numberOfClassrooms:
                    updatedData.numberOfClassrooms = dataValue.value;
                    break;
                case DHIS2_CONFIG.dataElements.numberOfTeachers:
                    updatedData.numberOfTeachers = dataValue.value;
                    break;
                case DHIS2_CONFIG.dataElements.toiletsForTeachers:
                    updatedData.toiletsForTeachers = dataValue.value;
                    break;
                case DHIS2_CONFIG.dataElements.toiletsForStudents:
                    updatedData.toiletsForStudents = dataValue.value;
                    break;
                case DHIS2_CONFIG.dataElements.condition:
                    updatedData.condition = dataValue.value;
                default:
                    break;
            }
        })
        setInspectionDataValues(updatedData);
    };

    // Clear inspection data
    const emptyInspectionData = () => setInspectionDataValues(null);

    return (
        <div>
            <Button
                label="Schools"
                active={activePage === "Schools"}
                onClick={() => activePageHandler("Schools")}
            >
				<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#000000"><path d="M384-109.85 13.85-480 384-850.15l53.77 53.77L121.38-480l316.39 316.38L384-109.85Z"/></svg>
                Back to view schools and inspections 
            </Button>
            <div className={style.inspectionData}>
                <h1>{displayName}</h1>
            </div>
            <Button
                primary
                className={style.inspectionButton}
                label="New Inspection"
                onClick={() => {
                    activePageHandler("NewInspection");
                    activeNameHandler(displayName);
                    activeIdHandler(id);
                }}
            >
                New inspection
				<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg>
            </Button>
            {inspectionDataValues && (
                <InspectionInfo
                    className={style.inspectionCard}
                    inspectionData={inspectionDataValues}
                    emptyInspection={emptyInspectionData}
                />
            )}
            <Table suppressZebraStriping>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Inspection ID</TableCellHead>
                        <TableCellHead>Report date</TableCellHead>
                        <TableCellHead>Status</TableCellHead>
                        <TableCellHead>Condition</TableCellHead>
                        <TableCellHead></TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {inspectionList.length > 0 ? (
                        inspectionList.map(inspection => {
                            const currentCondition = inspection && Array.isArray(inspection.dataValues) 
                            ? inspection.dataValues.find(item => item.dataElement === "MP1D4UZbbBE")
                            : null;
                            
                            return (
                                <TableRow className={classes.tableRowHover} key={inspection.id}>
                                <TableCell>{inspection.event}</TableCell>
                                <TableCell>{inspection.eventDate.substring(0,10)}</TableCell>
                                <TableCell>{inspection.status}</TableCell>
                                <TableCell>{currentCondition ? currentCondition.value : "Not defined"}</TableCell>
                                <TableCell>
                                    <Button
                                        secondary
                                        onClick={() =>
                                            fillInspectionData(
                                                inspection.orgUnitName,
                                                inspection.eventDate,
                                                inspection.dataValues,
                                                inspection.event
                                            )
                                        }
                                    >
                                        View inspection
                                    </Button>
                                </TableCell>
                            </TableRow>
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan="4">No available inspections</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
            />
        </div>
    );
};

export default SchoolInfo;