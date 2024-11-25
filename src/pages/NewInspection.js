import React, { useState, useEffect } from 'react';
import { Button, Input, NoticeBox, Modal, ModalTitle, ModalContent, ModalActions} from '@dhis2/ui';
import { useDataMutation } from '@dhis2/app-runtime';
import SchoolOptions from '../components/SchoolOptions';
import styles from './styles/NewInspection.module.css';
import { createInspectionMutation, createInspectionPayload, DHIS2_CONFIG } from '../api/api';
import { CalculateCondition } from '../hooks/CalculateCondition';

// Form fields configuration
const FORM_FIELDS = [
    { id: 'seatsForStudents', label: 'Seats for students', dataElement: DHIS2_CONFIG.dataElements.seatsForStudents },
    { id: 'numberOfStudents', label: 'Number of students', dataElement: DHIS2_CONFIG.dataElements.numberOfStudents },
    { id: 'numberOfTextbooks', label: 'Number of textbooks', dataElement: DHIS2_CONFIG.dataElements.numberOfTextbooks},
    { id: 'numberOfClassrooms', label: 'Number of classrooms', dataElement: DHIS2_CONFIG.dataElements.numberOfClassrooms },
    { id: 'numberOfTeachers', label: 'Number of teachers', dataElement: DHIS2_CONFIG.dataElements.numberOfTeachers },
    { id: 'toiletsForTeachers', label: 'Toilets for teachers', dataElement: DHIS2_CONFIG.dataElements.toiletsForTeachers },
    { id: 'toiletsForStudents', label: 'Toilets for students', dataElement: DHIS2_CONFIG.dataElements.toiletsForStudents },
];

// Initial state for the inspection form
const INITIAL_FORM_STATE = {
    schoolName: '',
    id: '',
    inspectionDate: '',
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
 * @param displayName - Current school name
 * @param activeNameHandler - Handler to set active school name
 * @param id - Current school ID
 * @param activeIdHandler - Handler to set active school ID
 * 
 * @returns Form for adding a school inspection
 */
function NewInspection({ displayName, activeNameHandler, id, activeIdHandler }) {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [validationErrors, setValidationErrors] = useState({});
    const [mutate, { loading, error }] = useDataMutation(createInspectionMutation);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [generalError, setGeneralError] = useState('');


        
    useEffect(() => {
        let check = true;
        for (const [key, value] of Object.entries(formData)) {
            if (key != 'condition' && !value) check = false;
        }
        if (check && !formData.condition) handleInputChange('condition')(CalculateCondition(formData));
    }, [formData]);


    // Handle input changes and reset validation errors 
    const handleInputChange = (field) => (value) => {
        setFormData(prevData => ({ ...prevData, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }
		setGeneralError('');
    };


    // Reset form to add another inspection
	const handleAddAnotherInspection = () => {
		setSubmitted(false);
		handleDiscardChanges();
        setShowConfirmation(false);
    };
    
    // Confirmation form for submissions 
	const confirmSubmission = async () => {
		try {
            // Use the createInspectionPayload from api.js instead
            const payload = createInspectionPayload(formData);
            console.log('Submitting payload:', payload); // For debugging
            
            const response = await mutate(payload);
            console.log('Response:', response); // For debugging
			setShowConfirmation(false);
			setSubmitted(true);
        } catch (err) {
			setShowConfirmation(false);
            console.error('Error creating inspection:', err);
        }
        setShowConfirmation(false);
    };

    // Validates form fields and updates error messages for invalid fields
    const validateForm = () => {
        const errors = {};
        
        if (!formData.schoolName) {
            errors.schoolName = 'Please select a school';
        }
        if (!formData.inspectionDate) {
            errors.inspectionDate = 'Inspection date is required';
        }
        
        // Validate numeric fields
        FORM_FIELDS.forEach(({ id }) => {
            if(!formData[id]){
				errors[id] = `Please enter a value for ${id.replace(/([A-Z])/g, ' $1')}`;
			} else if (isNaN(formData[id]) || Number(formData[id]) < 0) {
				errors[id] = "Must be a positive number";
			}
        });

        setValidationErrors(errors);
		if(Object.keys(errors).length > 0){
			setGeneralError("All fields must be filled out correctly before submitting!");
		}
        return Object.keys(errors).length === 0;
    };


    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

		setShowConfirmation(true);

        console.log(formData);

    };


    // Resets all form fields and state to initial values
    const handleDiscardChanges = () => {
        setFormData(INITIAL_FORM_STATE);
        setValidationErrors({});
		setGeneralError('');
    };

	if(submitted){
		return (
			<div className={styles.confirmationContainer}>
				<h1>
					School inspection submitted
				</h1>
				<p>Your new school inspection has been successfully submitted for further processing.</p>
				<Button onClick={handleAddAnotherInspection} primary>
					Add Another School
				</Button>
			</div>
		)
	}

    return (
        <div>
            <form onSubmit={handleSubmit} noValidate>
                <div className={styles.formContainer}>
                    <h1>Create new inspection</h1>
                    
                    {error && (
                        <NoticeBox error title="Error creating inspection">
                            {error.details?.message || 'An unexpected error occurred. Please try again.'}
                        </NoticeBox>
                    )}

                    <div className={styles.gridForm}>
                        <div className={styles.formItem}>
                            <label>School name</label>
                            <SchoolOptions 
                                handleInputChange={handleInputChange} 
                                formData={formData} 
                                displayName={displayName} 
                                activeNameHandler={activeNameHandler} 
                                id={id} 
                                activeIdHandler={activeIdHandler}
								error={!!validationErrors.schoolName}
                            />
                            {validationErrors.schoolName && (
                                <span className={styles.errorText}>{validationErrors.schoolName}</span>
                            )}
                        </div>

                        <div className={styles.formItem}>
                            <label>Inspection date</label>
                            <Input 
                                type="date"
                                value={formData.inspectionDate}
                                onChange={({ value }) => handleInputChange('inspectionDate')(value)}
                                error={!!validationErrors.inspectionDate}
                            />
                        </div>

                        {FORM_FIELDS.map(({ id, label }) => (
                            <div key={id} className={styles.formItem}>
                                <label>{label}</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData[id]}
                                    onChange={({ value }) => handleInputChange(id)(value)}
                                    error={!!validationErrors[id]}
                                />
                                
                            </div>
                        ))}
                    </div>

					{generalError && (
						<div>
							<NoticeBox error>{generalError}</NoticeBox>
						</div>
					)}

                    <div className={styles.buttonContainer}>
						<Button onClick={handleDiscardChanges} destructive>
                            Discard changes
                        </Button>
                        <Button type="submit" disabled={loading} primary>
                            {loading ? 'Creating...' : 'Create inspection'}
                        </Button>
                    </div>

					{showConfirmation && (
						<Modal onClose={() => setShowConfirmation(false)}>
							<ModalTitle>Confirm submission</ModalTitle>
							<ModalContent>Are you sure you want to submit the school inspection?</ModalContent>
							<ModalActions>
								<Button onClick={() => setShowConfirmation(false)} destructive secondary>
									No
								</Button>
								<Button onClick={confirmSubmission} primary>
									Yes
								</Button>
							</ModalActions>
						</Modal>
					)}
                </div>
            </form>
        </div>
    );
}

export default NewInspection;