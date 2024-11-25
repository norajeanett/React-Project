
/**
 * structure to fetch data from the api
 * Here we only want to fetch data from schools in the Jambalaya cluster
 */
export const schoolSearchQueryJambalaya = {
    organisationUnits: {
        resource: 'organisationUnits',
        params: ({ searchWord, pageNumber , pageSize }) => ({
            fields: ['name', 'id'],
            page: pageNumber,
            pageSize: pageSize > 0 ? pageSize : 10,
            paging: 'true',
            filter: [
                'parent.id:eq:Jj1IUjjPaWf',
                ...(searchWord ? [`name:ilike:${searchWord}`] : [])
            ]
                
        }),
    },
    organisationUnitsCount: {
        resource: 'organisationUnits',
        params: ({ searchWord }) => ({
            fields: ['id'],
            paging: 'true', // Return all items to determine total count
            filter: [
                'parent.id:eq:Jj1IUjjPaWf',
                ...(searchWord ? [`name:ilike:${searchWord}`] : [])
            ]
        }),
    },
};


/**
 * object conatins id for all dataElements that is posted/requested from the API
 */
export const DHIS2_CONFIG = {
    program: 'UxK2o06ScIe',
    programStage: 'eJiBjm9Rl7E',
    dataElements: {
        seatsForStudents: 'txJa0dnZI04',
        numberOfStudents: 'CnukMdcvvZ2',
        numberOfTextbooks: 'BqiFdo8xCZ9',
        numberOfClassrooms: 'ya5SyA5hej4',
        numberOfTeachers: 'NcXpc3aYUch',
        toiletsForTeachers: 'I13NTyLrHBm',
        toiletsForStudents: 'gsXT75jgFE5',
        condition: 'MP1D4UZbbBE'
    }
};

/**
 * Posts new inspection
 */
export const createInspectionMutation = {
    resource: 'events',
    type: 'create',
    data: (data) => data // Pass the data directly without transformation
};

/**
 * 
 * @param formData object that contains parameters from the new inspection form
 * 
 * @constant dataValues array that conatins touples of dataElement id and value
 * 
 * @returns fills all data from the form data object into the dataValues array and returns it in a structure for the api
 */
export const createInspectionPayload = (formData) => {
    // Only include dataValues that have actual values
    const dataValues = [];
    
    // Add values only if they exist
    if (formData.seatsForStudents) {
        dataValues.push({
            dataElement: DHIS2_CONFIG.dataElements.seatsForStudents,
            value: formData.seatsForStudents.toString()
        });
    }
    
    if (formData.numberOfStudents) {
        dataValues.push({
            dataElement: DHIS2_CONFIG.dataElements.numberOfStudents,
            value: formData.numberOfStudents.toString()
        });
    }

    if (formData.numberOfTextbooks) {
        dataValues.push({
            dataElement: DHIS2_CONFIG.dataElements.numberOfTextbooks,
            value: formData.numberOfTextbooks.toString()
        });
    }
    
    if (formData.numberOfClassrooms) {
        dataValues.push({
            dataElement: DHIS2_CONFIG.dataElements.numberOfClassrooms,
            value: formData.numberOfClassrooms.toString()
        });
    }
    
    if (formData.numberOfTeachers) {
        dataValues.push({
            dataElement: DHIS2_CONFIG.dataElements.numberOfTeachers,
            value: formData.numberOfTeachers.toString()
        });
    }
    
    if (formData.toiletsForTeachers) {
        dataValues.push({
            dataElement: DHIS2_CONFIG.dataElements.toiletsForTeachers,
            value: formData.toiletsForTeachers.toString()
        });
    }

    if (formData.toiletsForStudents) {
        dataValues.push({
            dataElement: DHIS2_CONFIG.dataElements.toiletsForStudents,
            value: formData.toiletsForStudents.toString()
        });
    }

    if (formData.condition) {
        dataValues.push({
            dataElement: DHIS2_CONFIG.dataElements.condition,
            value: formData.condition
        });
    }

    return {
        events: [
            {
                program: DHIS2_CONFIG.program,
                programStage: DHIS2_CONFIG.programStage,
                orgUnit: formData.id,
                eventDate: formData.inspectionDate,
                status: 'COMPLETED',
                dataValues: dataValues
            }
        ]
    };
};

/**
 * Structure for fetching events with inspections from the api
 */
export const inspections = {
    events: {
        resource: 'events',
        params: ({ id, pageNumber , pageSize }) => ({
            fields: [
				'orgUnit',
				'orgUnitName',
                'status',
                'eventDate',
				'program',
                'dataValues[dataElement,value]',
                'event'
			],
            page: pageNumber,
            pageSize: pageSize > 0 ? pageSize : 10,
            orgUnit: id,
        }),
    },
    eventsCount: {
        resource: 'events',
        params: ({ id }) => ({
            fields: [
                'event'
			],
            paging: true,
            orgUnit: id,
        }),
    },
};
