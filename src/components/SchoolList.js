import React from 'react';
import classes from '../App.module.css';
import { Table, TableHead, TableRowHead, TableCellHead, TableBody, TableRow, TableCell } from '@dhis2/ui';
import { useDataQuery } from '@dhis2/app-runtime';
import { inspections } from '../api/api';
import { CircularLoader } from '@dhis2/ui'

/**
 * 
 * @param schools - Array containing every school and the data of the school
 * @param loading - Get loading state from useDataQuery
 * @param error - Get error state from useDataQuery
 * @param activePage - state of active page selected
 * @param activePageHandler - handler for setting state of active page
 * @param activeIdHandler - handler for setting state of current school id
 * @param activeNameHandler - handler for setting state of current school name
 * 
 * @constant organisationUnits - Get array of the schools fetched
 * @constant inspectionList - List of school inspection of a specific school
 * 
 * @returns - A table of every school with name, lastest inspection and condition of that inspection. Every school is clickable to get more info. 
 * 
 */
const SchoolList = ({ schools, loading, error, activePage, activePageHandler, activeIdHandler, activeNameHandler }) => {

    const organisationUnits = schools?.organisationUnits || [];

    if (loading) {
        return <div><CircularLoader large /></div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!Array.isArray(organisationUnits) || organisationUnits.length === 0) {
        return <div>No schools found</div>;
    }

    // Fetch all inspection of a specific school and return the lastest inspection by date
    const getLatestInspection = (id) => {
        const { loading, error, data } = useDataQuery(inspections, {
            variables: { id: id },
        });

        if (loading) return <div><CircularLoader large /></div>;

        if (error) return <div>Error: {error.message}</div>;

        const inspectionsList = (data?.events.events || []).filter(unit => unit.program === 'UxK2o06ScIe');

        if (inspectionsList.length > 0) {
            const latestInspection = inspectionsList.reduce((latest, current) => 
                new Date(current.eventDate) > new Date(latest.eventDate) ? current : latest
            );
            return latestInspection
        } else {
            console.log("No inspection")
            return null
        }
    }

    return (
        <Table suppressZebraStriping>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>School name</TableCellHead>
                    <TableCellHead>Latest inspection</TableCellHead>
                    <TableCellHead>Current condition</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
				{organisationUnits.map(school => {
                    const latestInspection = getLatestInspection(school.id);
                    const specificDataElement = latestInspection && Array.isArray(latestInspection.dataValues) 
                    ? latestInspection.dataValues.find(item => item.dataElement === "MP1D4UZbbBE")
                    : null;

					return (
						<TableRow 
                            className={classes.tableRowHover}
							key={school.id}
							label="SchoolInfo"
        					active={(activePage === "SchoolInfo").toString()} // Use strict equality
        					onClick={() => {activePageHandler("SchoolInfo"), activeIdHandler(school.id), activeNameHandler(school.name)}}>
							<TableCell>{school.name}</TableCell>
                            <TableCell>{latestInspection && typeof latestInspection.eventDate === 'string' 
                                            ? latestInspection.eventDate.substring(0, 10) 
                                            : "No inspection"}</TableCell>
                            <TableCell>{specificDataElement ? specificDataElement.value : "Not defined"}</TableCell>
						</TableRow>
					)
				})}
            </TableBody>
        </Table>
    );
};

export default SchoolList;