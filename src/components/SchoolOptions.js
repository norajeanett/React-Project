import React, { useState, useEffect } from 'react';
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import { useDataQuery } from '@dhis2/app-runtime';
import { schoolSearchQueryJambalaya } from '../api/api';


/**
 * 
 * @param handleInputChange - Handler to change value of a input
 * @param formData - A state containing a dictionary with the different inputs
 * @param displayName - Get display name to place it in name input
 * @param activeNameHandler - handler for setting state of current school name
 * @param id - Get id of the selected school
 * @param activeIdHandler - handler for setting state of current school id
 * 
 * @constant schools - Get array of the schools fetched
 * 
 * @returns - select input field with a possible schools
 */
const SchoolOptions = ({ handleInputChange, formData, displayName, activeNameHandler, id, activeIdHandler }) => {
    const { loading, error, data, refetch } = useDataQuery(schoolSearchQueryJambalaya, {
        variables: {noPaging: true},
    });
    const schools = data ? data.organisationUnits.organisationUnits : [];

    useEffect(() => {
        if (displayName && schools.some(school => school.name === displayName)) {
            handleInputChange('schoolName')(displayName);
            handleInputChange('id')(id);
        }
    }, [displayName, schools]);

    //handler to select school in input of school
    const handleSelectOption = (e) => {
        const selectedName = e.selected
        const selectedSchool = schools.find(school => school.name === selectedName)
        const selectedId = selectedSchool ? selectedSchool.id : '';
        if (selectedName && selectedId) {
            activeNameHandler(selectedName);
            activeIdHandler(selectedId);
            handleInputChange('schoolName')(selectedName);
            handleInputChange('id')(selectedId);
        } else {
            console.error("selected name: " + selectedName + " not found in shcools!");
        }
    }

    let placeholder = 'Search and select a school';
    
    if (loading) {
        placeholder = 'Loading...';
    }

    if (error) {
        placeholder = error.message;
    }

    if (!Array.isArray(schools) || schools.length === 0) {
        placeholder = 'No schools found!'
    }

    return (
        <>
            <SingleSelectField 
                filterable
                onChange={handleSelectOption}
                filterPlaceholder={placeholder}
                selected={formData['schoolName']}
            >
                {schools.map(school => { // how can we access school.id?
                    return <SingleSelectOption
                        key={school.id} 
                        label={school.name}
                        value={school.name} 
                    />
                })}
            </SingleSelectField>
        </>
    );
}

export default SchoolOptions;