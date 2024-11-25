import React, { useState, useEffect } from 'react';
import { Button, Input, Label, NoticeBox, Modal, ModalTitle, ModalContent, ModalActions, Switch } from '@dhis2/ui';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './styles/NewSchool.module.css';

// Default marker icon fix for React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


/**
 * 
 * @constant schoolData - state containing school information 
 * @constant validationErrors - state for storing form validation errors
 * @constant submitted - tracking form submission state
 * @constant error - error message for issues
 * @constant showConfirmation - flag to show/hide confirmation modal
 * @constant useCurrentLocation - use of current coordinate location
 * @constant showMap - show/hide the map
 * @constant currentLocation - state for storing current coordinates
 * 
 * @returns a form to add a new school. 
 */
const NewSchool = () => {
    const [schoolData, setSchoolData] = useState({
        schoolName: '',
        geoCoordinates: '',
        schoolImage: null,
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null); 

    // Fetch and update the user's current locatio
    useEffect(() => {
        if (useCurrentLocation && navigator.geolocation) {
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setCurrentLocation([latitude, longitude]);
                    setSchoolData((prevData) => ({
                        ...prevData,
                        geoCoordinates: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° W`,
                    }));
                },
                (error) => console.error('Error fetching geolocation:', error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );

            return () => navigator.geolocation.clearWatch(id);
        } else if (!useCurrentLocation) {
            setSchoolData((prevData) => ({
                ...prevData,
                geoCoordinates: '',
            }));
        }
    }, [useCurrentLocation]);


    //Validates form fields and updates error messages for invalid fields
    const validateForm = () => {
        const errors = {};

        if (!schoolData.schoolName) {
            errors.schoolName = 'School Name is required';
        }
        if (!schoolData.geoCoordinates) {
            errors.geoCoordinates = 'Geo-Coordinates are required';
        }

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            setError('All fields must be filled out correctly before submitting.');
        }
        return Object.keys(errors).length === 0;
        };



    // Handles file input change for uploading school images
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSchoolData((prevData) => ({ ...prevData, schoolImage: file }));
    };


    // Handle adding new schools 
    // Validates form inputs 
    const handleAddNewSchool = () => {
        if (!validateForm()) {
            return;
        }
        setError('');
        setShowConfirmation(true);
    };


    // Confirms the submission of school data
    const confirmSubmission = () => {
        setSubmitted(true);
        setError('');
        setShowConfirmation(false);
    };

    // Resets all form fields and state to initial values
    const handleDiscardChanges = () => {
        setSchoolData({
            schoolName: '',
            geoCoordinates: '',
            schoolImage: null,
        });
        setError('');
        setSubmitted(false);
        setUseCurrentLocation(false);
        setShowMap(false);
        setValidationErrors({});
    };

    // Resets all form fields and state to initial values
    const handleAddAnotherSchool = () => {
        setSchoolData({
            schoolName: '',
            geoCoordinates: '',
            schoolImage: null,
        });
        setSubmitted(false);
        setUseCurrentLocation(false);
        setValidationErrors({});
    };

    // Fetches current location for the first time, and map visibility
    const handleShowMap = () => {
        if (!currentLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setCurrentLocation([latitude, longitude]);
                    setSchoolData((prevData) => ({
                        ...prevData,
                        geoCoordinates: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° W`,
                    }));
                    setShowMap(true); 
                },
                (error) => console.error('Error fetching geolocation:', error)
            );
        } else {
            setShowMap(!showMap); 
        }
    };

    

    if (submitted) {
        return (
            <div className={styles.confirmationContainer}>
                <h1>
                    
                    School report submitted
                </h1>
                <p>Your report for the new school has been successfully submitted for further processing.</p>
                <Button onClick={handleAddAnotherSchool} primary>
                    Add another school inspection
                </Button>
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            <h1>Create new school</h1>

            <div className={styles.gridForm}>
                <div className={styles.formItem}>
                    <label>School name</label>
                    <Input
                        value={schoolData.schoolName}
                        onChange={(e) => setSchoolData({ ...schoolData, schoolName: e.value })}
                        error={!!validationErrors.schoolName}
                    />
                    
                </div>

                <div className={styles.formItem}>
                    <label>Geo-coordinates</label>
                    <div className={styles.geoInputContainer}>
                        <Input
                            value={schoolData.geoCoordinates}
                            onChange={(e) =>
                                setSchoolData({ ...schoolData, geoCoordinates: e.value })
                            }
                            placeholder="Such as 34.0522° N, 118.2437° W"
                            readOnly={useCurrentLocation}
                            className={styles.geoInput}
                            error={!!validationErrors.geoCoordinates}
                        />
                        <Button
                            onClick={handleShowMap}
                            secondary
                            className={styles.showMapButton}
                        >
                            {showMap ? 'Hide Map' : 'Show map'}
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00000"><path d="m600-144-240-72-153 51q-23 8-43-6t-20-40v-498q0-16 9.5-28.5T177-755l183-61 240 72 153-51q23-10 43 5t20 41v498q0 16-9 29t-24 17l-183 61Zm-36-86v-450l-168-50v450l168 50Zm72-2 108-36v-448l-108 36v448Zm-420-12 108-36v-448l-108 36v448Zm420-436v448-448Zm-312-48v448-448Z"/></svg>
                        </Button>
                    </div>
                    <Switch
                        label="Use current location"
                        checked={useCurrentLocation}
                        onChange={() => setUseCurrentLocation(!useCurrentLocation)}
                        className={styles.geoSwitch}
                    />
                </div>

                {showMap && currentLocation && (
                    <MapContainer
                        center={currentLocation}
                        zoom={15}
                        className={styles.mapContainer}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={currentLocation}
                            draggable={true}
                            eventHandlers={{
                                dragend: (e) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    setCurrentLocation([lat, lng]);
                                    setSchoolData((prevData) => ({
                                        ...prevData,
                                        geoCoordinates: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° W`,
                                    }));
                                },
                            }}
                        />
                    </MapContainer>
                )}

                <div className={styles.formItem}>
                    <label>Upload school image</label>

                    <div className={styles.buttonContainer}>
                        <button className={styles.customButton} onClick={() => document.getElementById('school-image-input').click()}
                        >
                        <span>Upload image</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-240h72v-150l57 57 51-51-144-144-144 144 51 51 57-57v150ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z"/></svg>
                        </button>

                        <input
                            id="school-image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        {schoolData.schoolImage && (
							<span style={{ marginLeft:'10px', color:'black'}}>
								{schoolData.schoolImage.name}
							</span>
						)}
                </div>
            </div>

            {error && (
                <div >
                    <NoticeBox error>{error}</NoticeBox>
                </div>
            )}
            
            <div className={styles.buttonContainer}>
				<Button 
					onClick={handleDiscardChanges} 
					destructive
				>
                    Discard changes
                </Button>
                <Button onClick={handleAddNewSchool} primary>
                    Add school
                </Button>
            </div>


            
            {showConfirmation && (
                <Modal onClose={() => setShowConfirmation(false)}>
                    <ModalTitle>Confirm submission</ModalTitle>
                    <ModalContent>Are you sure you want to submit the school report?</ModalContent>
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
    </div>
    );
};

export default NewSchool;