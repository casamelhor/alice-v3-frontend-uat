// "use client"
// import { CreatePropertyAPI, OperationManagerPhotoUploadAPI, UpdatePropertyDetailAPI, WizardStepUpdateAPI } from '@/services/provider';
// import { alert_danger } from '@/utils/Alerts/TostifyAlerts';
// import { getItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
// import { propertStepFirstValidation } from '@/utils/validation';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useRef } from 'react'
// import { useEffect, useState } from "react";
// import { Button, Col, Row, Image, Modal } from 'react-bootstrap';
// // import { ToastContainer } from 'react-toastify';
// import usePlacesAutocomplete, {
//     getGeocode,
//     getLatLng,
// } from "use-places-autocomplete";

// // Map Display Component

// // Replace the existing DynamicMap component in Step1.jsx

// const DynamicMap = ({ lat, lng, address, onPinDrag }) => {
//     const mapRef = useRef(null);
//     const mapInstanceRef = useRef(null);
//     const markerRef = useRef(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragCoords, setDragCoords] = useState(null);

//     useEffect(() => {
//         if (!lat || !lng) return;
//         if (!window.google?.maps) return;

//         const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

//         // Initialize map if not already done
//         if (!mapInstanceRef.current) {
//             mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
//                 center: position,
//                 zoom: 15,
//                 mapTypeControl: false,
//                 streetViewControl: false,
//                 fullscreenControl: false,
//                 zoomControlOptions: {
//                     position: window.google.maps.ControlPosition.RIGHT_CENTER,
//                 },
//                 styles: [
//                     { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
//                 ]
//             });
//         }

//         // Initialize or reposition marker
//         if (!markerRef.current) {
//             markerRef.current = new window.google.maps.Marker({
//                 position,
//                 map: mapInstanceRef.current,
//                 draggable: true,
//                 animation: window.google.maps.Animation.DROP,
//                 title: 'Drag to adjust location',
//                 cursor: 'grab',
//             });

//             // Drag start
//             markerRef.current.addListener('dragstart', () => {
//                 setIsDragging(true);
//                 setDragCoords(null);
//             });

//             // Drag (live coordinates while dragging)
//             markerRef.current.addListener('drag', (e) => {
//                 setDragCoords({
//                     lat: e.latLng.lat().toFixed(6),
//                     lng: e.latLng.lng().toFixed(6),
//                 });
//             });

//             // Drag end — emit new coords to parent
//             markerRef.current.addListener('dragend', async (e) => {
//                 setIsDragging(false);
//                 const newLat = e.latLng.lat();
//                 const newLng = e.latLng.lng();
//                 setDragCoords(null);

//                 // Reverse geocode the new position
//                 let newAddress = address; // fallback to existing
//                 try {
//                     const results = await getGeocode({ location: { lat: newLat, lng: newLng } });
//                     if (results?.[0]?.formatted_address) {
//                         newAddress = results[0].formatted_address;
//                     }
//                 } catch (err) {
//                     console.warn('Reverse geocode failed:', err);
//                 }

//                 // Notify parent with updated lat/lng and address
//                 if (onPinDrag) {
//                     onPinDrag({ lat: newLat, lng: newLng, address: newAddress });
//                 }
//             });
//         } else {
//             // Update marker + map center when props change (e.g. new address selected)
//             markerRef.current.setPosition(position);
//             mapInstanceRef.current.panTo(position);
//         }
//     }, [lat, lng]);

//     if (!lat || !lng) {
//         return (
//             <div style={{
//                 width: '100%',
//                 height: '300px',
//                 backgroundColor: '#f5f5f5',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 borderRadius: '8px',
//                 border: '1px dashed #ddd'
//             }}>
//                 <p style={{ color: '#999', fontSize: '14px' }}>
//                     Search for an address to see it on the map
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div style={{ marginBottom: '20px' }}>
//             {/* Hint banner */}
//             <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 marginBottom: '8px',
//                 padding: '8px 12px',
//                 background: '#f5f0eb',
//                 borderRadius: '6px',
//                 border: '1px solid #e0d5cc',
//                 fontSize: '13px',
//                 color: '#6B4F3F'
//             }}>
//                 <span style={{ fontSize: '16px' }}>📍</span>
//                 <span>
//                     {isDragging
//                         ? `Dragging… ${dragCoords ? `${dragCoords.lat}, ${dragCoords.lng}` : ''}`
//                         : 'Drag the pin to fine-tune the exact location'}
//                 </span>
//             </div>

//             {/* Map container */}
//             <div
//                 ref={mapRef}
//                 style={{
//                     width: '100%',
//                     height: '300px',
//                     borderRadius: '8px',
//                     border: '1px solid #ddd',
//                     overflow: 'hidden',
//                     cursor: isDragging ? 'grabbing' : 'default',
//                 }}
//             />

//             {/* Coordinate display */}
//             <div style={{
//                 display: 'flex',
//                 gap: '16px',
//                 marginTop: '8px',
//                 fontSize: '12px',
//                 color: '#999'
//             }}>
//                 <span>Lat: <strong style={{ color: '#463527' }}>{parseFloat(lat).toFixed(6)}</strong></span>
//                 <span>Lng: <strong style={{ color: '#463527' }}>{parseFloat(lng).toFixed(6)}</strong></span>
//             </div>
//         </div>
//     );
// };

// export default function Step1({ step1Data, setStep1Data, propertyRole, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, showManual, setShowManual, draft }) {
//     // State management
//     // const property = JSON.parse(getItemLocalStorage("properyItem"));    
//     const [errors, setErrors] = useState({});
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [showPropertyList, setShowPropertyList] = useState(false);
//     const router = useRouter();

//     // Caretaker state
//     const [caretakers, setCaretakers] = useState([{ id: Date.now(), data: null }]);
//     const [showCaretakerList, setShowCaretakerList] = useState(null);

//     // Manager state
//     const [managers, setManagers] = useState([{ id: Date.now(), data: null }]);
//     const [showManagerList, setShowManagerList] = useState(false);

//     // const [showManual, setShowManual] = useState(false);
//     const [changepicsModal, changepisetShow] = useState(false);
//     const [file, setFile] = useState(null);
//     const [isGoogleReady, setIsGoogleReady] = useState(false);
//     const [googleMapsUrl, setGoogleMapsUrl] = useState('');
//     const [property, setProperty] = useState({});

//     useEffect(() => {
//         try {
//             const propertyItem = getItemLocalStorage("properyItem");
//             if (propertyItem) {
//                 setProperty(JSON.parse(propertyItem));
//             } else if (draft?.uid) {
//                 setProperty(draft)
//             }
//         } catch (error) {
//             console.error("Error loading property data:", error);
//         }
//     }, []);
//     // Check if managers and caretakers are selected
//     const hasManagerData = managers?.some(manager => manager?.data !== null);
//     const hasCaretakerData = caretakers?.some(caretaker => caretaker?.data !== null);

//     // Check Google Maps readiness
//     useEffect(() => {
//         const checkGoogleReady = () => {
//             if (window.google && window.google.maps && window.google.maps.places) {
//                 setIsGoogleReady(true);
//             }
//         };

//         checkGoogleReady();
//         const interval = setInterval(checkGoogleReady, 500);
//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         if (step1Data?.property_caretakers) {
//             const caretakersWithIds = step1Data.property_caretakers.map((obj, index) => ({
//                 id: `${Date.now()}-${index}`,
//                 data: obj
//             }));
//             setCaretakers(caretakersWithIds);
//         }
//     }, [step1Data?.property_caretakers]);

//     useEffect(() => {
//         if (step1Data?.property_managers) {
//             const managersWithIds = step1Data.property_managers.map((obj, index) => ({
//                 id: `${Date.now()}-${index}`,
//                 data: obj
//             }));
//             setManagers(managersWithIds);
//         }
//     }, [step1Data?.property_managers]);

//     // FIXED: Correct image loading logic
//     useEffect(() => {
//         if (step1Data?.contactImage) {
//             setFile(step1Data.contactImage)
//         }
//     }, [step1Data?.contactImage]);

//     // Generate Google Maps URL when coordinates change
//     useEffect(() => {
//         if (step1Data.lat && step1Data.lng) {
//             const url = `https://www.google.com/maps?q=${step1Data.lat},${step1Data.lng}&z=15&output=embed`;
//             setGoogleMapsUrl(url);
//         }
//     }, [step1Data.lat, step1Data.lng]);

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         let newData = { [name]: value }
//         setStep1Data({
//             ...step1Data,
//             [name]: value
//         });
//         const { error } = propertStepFirstValidation(newData, showManual)
//         setErrors({
//             ...errors,
//             ...error
//         })
//     };

//     // Google Places Autocomplete Implementation
//     const {
//         ready,
//         value,
//         suggestions: { status, data },
//         setValue,
//         clearSuggestions,
//     } = usePlacesAutocomplete({
//         debounce: 300,
//         requestOptions: {
//             componentRestrictions: { country: "in" },
//         },
//         initOnMount: isGoogleReady,
//     });

//     const handleSelectLocation = async (description) => {
//         try {
//             console.log('Selecting location:', description);
//             setValue(description, false);
//             clearSuggestions();
//             setShowPropertyList(false);

//             // Get geocode results
//             const results = await getGeocode({ address: description });

//             if (!results || results.length === 0) {
//                 console.error('No results found for the address');
//                 setShowManual(true);
//                 return;
//             }

//             // Get latitude and longitude
//             const { lat, lng } = await getLatLng(results[0]);

//             // Parse address components
//             const address = parseAddress(results[0]);

//             console.log("Google Maps Result:", { address, lat, lng });

//             // Generate Google Maps URL
//             const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
//             setGoogleMapsUrl(mapsUrl);

//             // Update step1Data with all address information
//             setStep1Data(prev => ({
//                 ...prev,
//                 propertyAddress: description,
//                 streetNumber: address.street,
//                 city: address.city,
//                 state: address.state,
//                 country: address.country,
//                 pinCode: address.postalCode,
//                 lat: lat,
//                 lng: lng,
//                 flatNo: address.flatNo || prev.flatNo
//             }));

//             setShowManual(true);

//         } catch (error) {
//             console.error('Error in handleSelectLocation:', error);
//             setShowManual(true);
//         }
//     };

//     // Enhanced address parser for Indian addresses
//     const parseAddress = (result) => {
//         const components = result.address_components;

//         const getComponent = (types) => {
//             const component = components.find(comp =>
//                 types.some(type => comp.types.includes(type))
//             );
//             return component ? component.long_name : '';
//         };

//         // Build street address from multiple possible components
//         const streetComponents = [
//             getComponent(['street_number']),
//             getComponent(['route']),
//             getComponent(['premise']),
//             getComponent(['sublocality_level_1']),
//             getComponent(['sublocality'])
//         ].filter(Boolean);

//         const street = streetComponents.length > 0
//             ? streetComponents.join(', ')
//             : result.formatted_address?.split(',')[0] || '';

//         return {
//             street: street,
//             city: getComponent(['locality']) ||
//                 getComponent(['administrative_area_level_2']) ||
//                 getComponent(['postal_town']),
//             state: getComponent(['administrative_area_level_1']),
//             country: getComponent(['country']),
//             postalCode: getComponent(['postal_code']),
//             flatNo: getComponent(['premise', 'subpremise'])
//         };
//     };

//     // Handle manual address entry toggle
//     const handleManualEntry = () => {
//         setShowManual(true);
//         setShowPropertyList(false);
//     };

//     // Enhanced input change for address field
//     const handleAddressInputChange = (e) => {
//         const value = e.target.value;
//         setValue(value);
//         setStep1Data(prev => ({
//             ...prev,
//             propertyAddress: value
//         }));
//         setShowPropertyList(true);
//     };

//     // Manager Functions
//     const handleManagerSelect = (id, manager) => {
//         setManagers((prev) =>
//             prev.map((m) => (m.id === id ? { ...m, data: manager } : m))
//         );
//         setShowManagerList(null);

//         if (errors.managers) {
//             setErrors(prev => ({
//                 ...prev,
//                 managers: ''
//             }));
//         }
//     };

//     const handleManagerRemove = (id) => {
//         setManagers((prev) => prev.filter((m) => m.id !== id));
//     };

//     const handleAddManager = () => {
//         setManagers([...managers, { id: Date.now(), data: null }]);
//     };

//     // Caretaker Functions
//     const handleCaretakerSelect = (id, caretaker) => {
//         setCaretakers((prev) =>
//             prev.map((c) => (c.id === id ? { ...c, data: caretaker } : c))
//         );
//         setShowCaretakerList(null);

//         if (errors.caretakers) {
//             setErrors(prev => ({
//                 ...prev,
//                 caretakers: ''
//             }));
//         }
//     };

//     const handleCaretakerRemove = (id) => {
//         setCaretakers((prev) => prev.filter((c) => c.id !== id));
//     };

//     const handleAddCaretaker = () => {
//         setCaretakers([...caretakers, { id: Date.now(), data: null }]);
//     };

//     // FIXED: File Upload Functions
//     const changepicClose = () => {
//         changepisetShow(false);
//     };

//     const changepicModal = () => {
//         changepisetShow(true);
//     };

//     const handleFileChange = (e) => {
//         const uploadedFile = e.target.files[0];
//         if (uploadedFile) {
//             // Validate file type
//             if (!uploadedFile.type.startsWith('image/')) {
//                 alert('Please select an image file');
//                 return;
//             }

//             // Validate file size (5MB limit)
//             if (uploadedFile.size > 5 * 1024 * 1024) {
//                 alert('File size should be less than 5MB');
//                 return;
//             }

//             // FIXED: Use consistent field name - operationsManagerPhoto
//             setStep1Data(prev => ({
//                 ...prev,
//                 operationsManagerPhoto: uploadedFile
//             }));

//             // Create object URL for preview
//             const objectUrl = URL.createObjectURL(uploadedFile);
//             setFile(objectUrl);
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         const uploadedFile = e.dataTransfer.files[0];
//         if (uploadedFile) {
//             if (!uploadedFile.type.startsWith('image/')) {
//                 alert('Please drop an image file');
//                 return;
//             }

//             if (uploadedFile.size > 5 * 1024 * 1024) {
//                 alert('File size should be less than 5MB');
//                 return;
//             }

//             // FIXED: Use consistent field name - operationsManagerPhoto
//             setStep1Data(prev => ({
//                 ...prev,
//                 operationsManagerPhoto: uploadedFile
//             }));

//             const objectUrl = URL.createObjectURL(uploadedFile);
//             setFile(objectUrl);
//         }
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//     };

//     const removeFile = () => {
//         // Clean up object URL if it exists
//         if (file && file.startsWith('blob:')) {
//             URL.revokeObjectURL(file);
//         }

//         setFile(null);
//         // FIXED: Use consistent field name - operationsManagerPhoto
//         setStep1Data(prev => ({
//             ...prev,
//             operationsManagerPhoto: null
//         }));
//     };

//     // FIXED: Handle upload confirmation
//     // const handleUploadConfirm = async () => {
//     //     changepicClose();
//     //     // File is already set in state through handleFileChange/handleDrop
//     // };
//     const handleUploadConfirm = async (uid) => {
//         try {
//             if (!property?.uid && !uid) {
//                 changepicClose();
//             } else {
//                 const fieldData = new FormData();
//                 fieldData.append("ops_manager_photo_url", step1Data.operationsManagerPhoto)
//                 const response = await OperationManagerPhotoUploadAPI(property?.uid ? property?.uid : uid, fieldData)
//                 if (response?.data?.success) {
//                     changepicClose();
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     // Handle form submission - FIXED
//     const handleSubmit = async (flag) => {
//         const phoneRegex = /^[0-9]+$/;


//         // Same phone number validation
//         if (
//             step1Data.operationsManagerPhone &&
//             step1Data.operationsManagerAlternatePhone &&
//             step1Data.operationsManagerPhone === step1Data.operationsManagerAlternatePhone
//         ) {
//             alert_danger(
//                 "Contact person's phone number and alternate phone number cannot be the same."
//             );
//             return;
//         }


//         // Required phone number validation
//         if (
//             step1Data.operationsManagerPhone &&
//             !phoneRegex.test(step1Data.operationsManagerPhone)
//         ) {
//             alert_danger("Contact person's phone number: Only numbers are allowed. Symbols like +, -, space are not allowed.");
//             return;
//         }


//         // Optional alternate phone number validation
//         if (
//             step1Data.operationsManagerAlternatePhone &&
//             !phoneRegex.test(step1Data.operationsManagerAlternatePhone)
//         ) {
//             alert_danger("Alternate phone number: Only numbers are allowed. Symbols like +, -, space are not allowed.");
//             return;
//         }





//         // e.preventDefault();
//         setSaveExit(false)
//         assignmentRemoveClose();
//         try {
//             const { isValid, error } = propertStepFirstValidation(
//                 step1Data,
//                 showManual,
//                 hasManagerData,
//                 hasCaretakerData
//             );

//             setErrors(error);

//             if (isValid) {
//                 setIsSubmitted(true);

//                 // Prepare manager and caretaker IDs
//                 const pm = managers
//                     .filter(manager => manager.data !== null)
//                     .map(manager => manager.data.uid);

//                 const cm = caretakers
//                     .filter(caretaker => caretaker.data !== null)
//                     .map(caretaker => caretaker.data.uid);

//                 const fieldData = new FormData();

//                 // Property basic info
//                 fieldData.append("property_name", step1Data.propertyName || '');
//                 fieldData.append("address_search_text", step1Data.propertyAddress || '');
//                 fieldData.append("street_number", step1Data.streetNumber || '');
//                 fieldData.append("flat_house_no", step1Data.flatNo || '');
//                 fieldData.append("city", step1Data.city || '');
//                 fieldData.append("state", step1Data.state || '');
//                 fieldData.append("country", step1Data.country || '');
//                 fieldData.append("pin_code", step1Data.pinCode || '');
//                 fieldData.append("latitude", step1Data.lat || '');
//                 fieldData.append("longitude", step1Data.lng || '');
//                 fieldData.append("nearest_airport", step1Data.addressHelp || '');

//                 // Operations manager info
//                 fieldData.append("ops_manager_name", step1Data.operationsManagerName || '');
//                 fieldData.append("ops_manager_email", step1Data.operationsManagerEmail || '');
//                 fieldData.append("ops_manager_phone", step1Data.operationsManagerPhone || '');
//                 fieldData.append("ops_manager_phone_alt", step1Data.operationsManagerAlternatePhone || '');

//                 // FIXED: Append photo if exists with correct field name
//                 if (step1Data.operationsManagerPhoto) {
//                     fieldData.append("ops_manager_photo_url", step1Data.operationsManagerPhoto);
//                 }

//                 // Append manager and caretaker IDs
//                 if (pm.length > 0) {
//                     if (pm.length > 1) {
//                         fieldData.append("property_manager_ids", JSON.stringify(pm));
//                     } else {
//                         fieldData.append("property_manager_ids", pm[0]);
//                     }
//                 }

//                 if (cm.length > 0) {
//                     if (cm.length > 1) {
//                         fieldData.append("property_caretaker_ids", JSON.stringify(cm));
//                     } else {
//                         fieldData.append("property_caretaker_ids", cm[0]);
//                     }
//                 }

//                 let response;
//                 if (!property?.uid) {
//                     response = await CreatePropertyAPI(fieldData);
//                 } else {
//                     const rawData = {
//                         property_name: step1Data.propertyName || '',
//                         address_search_text: step1Data.propertyAddress || '',
//                         street_number: step1Data.streetNumber || '',
//                         flat_house_no: step1Data.flatNo || '',
//                         city: step1Data.city || '',
//                         state: step1Data.state || '',
//                         country: step1Data.country || '',
//                         pin_code: step1Data.pinCode || '',
//                         latitude: step1Data.lat || '',
//                         longitude: step1Data.lng || '',
//                         nearest_airport: step1Data.addressHelp || '',

//                         ops_manager_name: step1Data.operationsManagerName || '',
//                         ops_manager_email: step1Data.operationsManagerEmail || '',
//                         ops_manager_phone: step1Data.operationsManagerPhone || '',
//                         ops_manager_phone_alt: step1Data.operationsManagerAlternatePhone || '',

//                         property_manager_ids: pm,
//                         property_caretaker_ids: cm
//                     };
//                     response = await UpdatePropertyDetailAPI(property?.uid, rawData);
//                 }

//                 if (response?.data?.success) {
//                     if (!property?.uid) setItemLocalStorage("properyItem", JSON.stringify(response.data.response));
//                     if (response?.data?.response?.uid) handleUploadConfirm(response?.data?.response?.uid)
//                     setIsSubmitted(false);
//                     if (flag == "exit") {
//                         const wizard = new FormData();
//                         wizard.append("wizard_step_completed", activeStep)
//                         await WizardStepUpdateAPI(property?.uid, wizard)
//                         router.push("/PropertyListing");
//                     } else { setActiveStep(activeStep + 1) }
//                     assignmentRemoveClose()
//                 } else {
//                     console.error('API response error:', response);
//                     const dynamicKey = Object.keys(response.data.response)[0];
//                     const message = response.data.response[dynamicKey].join('\n');
//                     alert_danger(message)
//                     setIsSubmitted(false);
//                     assignmentRemoveClose()
//                 }
//             } else {
//                 const firstErrorField = Object.keys(error)[0];
//                 if (firstErrorField) {
//                     const element = document.querySelector(`[name="${firstErrorField}"]`);
//                     if (element) {
//                         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                     }
//                 }
//                 assignmentRemoveClose()
//             }
//         } catch (error) {
//             console.error('Form submission error:', error);
//             setIsSubmitted(false);
//             assignmentRemoveClose()
//         }
//     };
//     useEffect(() => {
//         if (saveExit && activeStep == 1) {
//             handleSubmit('exit')
//         }
//     }, [saveExit])

//     // Sample data for managers and caretakers
//     const managerList = propertyRole?.properyManager || [
//         {
//             uid: "1",
//             first_name: "Shub Leena",
//             last_name: "",
//             email: "Shubancasamelhor@gmail.com",
//             user_role: { role_icon: "/images/icons/manager-img.jpg" },
//             phone_number: "9876543210",
//         },
//         {
//             uid: "2",
//             first_name: "Jenny",
//             last_name: "Shaikh",
//             email: "pradeep@casamelhor.in",
//             user_role: { role_icon: "/images/icons/manager-img.jpg" },
//             phone_number: "8765432109",
//         }
//     ];

//     const caretakerList = propertyRole?.propertyCaretacer || [
//         {
//             uid: "1",
//             first_name: "Shub",
//             last_name: "Leena",
//             email: "Shubancasamelhor@gmail.com",
//             user_role: { role_icon: "/images/icons/caretaker-img.jpg" },
//             phone: "9876543210",
//             you: true
//         },
//         {
//             uid: "2",
//             first_name: "Jenny",
//             last_name: "Shaikh",
//             email: "pradeep@casamelhor.in",
//             user_role: { role_icon: "/images/icons/caretaker-img.jpg" },
//             phone: "8765432109"
//         }
//     ];

//     // console.log(step1Data, file)
//     console.log(saveExit)

//     const getImageUrl = (path) => {
//         if (!path) return '/images/icons/No-Image.svg';
//         if (path.startsWith('media')) {
//             return `https://alicedevapi.casamelhor.in/${path}`;
//         }
//         return path;
//     };




//     return (
//         <>
//             <div className='container'>
//                 {/* <ToastContainer /> */}
//                 <Row>
//                     <Col md={8}>
//                         <div className='box-input'>
//                             <h3 className='page-title mb-4'>{`Let's get you published!`}</h3>

//                             {/* <Form onSubmit={handleSubmit}> */}
//                             {/* Property Name Section */}
//                             <div className='property-list-2'>
//                                 <p className='subheadline-2 mb-3'>What is the name of your property? <span style={{ color: '#f00' }} >*</span> </p>
//                                 <p className='mb-2'>Short titles work best. Have fun with it – you can always change it later.</p>
//                                 <div className='form-group mb-4'>
//                                     <input
//                                         type='text'
//                                         name="propertyName"
//                                         className={`form-control ${errors.propertyName ? 'is-invalid' : ''}`}
//                                         placeholder='e.g. Casa Melhor'
//                                         value={step1Data.propertyName || ''}
//                                         onChange={handleInputChange}
//                                         maxLength={32}
//                                     />
//                                     {errors.propertyName && (
//                                         <div className="invalid-feedback d-block">
//                                             {errors.propertyName}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <span className='text-count'>{(step1Data.propertyName || '').length}/32</span>
//                                 <hr style={{ margin: '50px 0' }}></hr>
//                             </div>

//                             {/* Google Maps Address Search Section */}
//                             <div className='property-list-2 position-relative'>
//                                 <p className='subheadline-2 mb-3'>BR Address search <span style={{ color: '#f00' }} >*</span> </p>
//                                 <p className='mb-2'>{`Where's your property located?`}</p>

//                                 <div className="form-group mb-4" style={{ position: "relative" }}>
//                                     <input
//                                         type="text"
//                                         name="propertyAddress"
//                                         className={`form-control ${errors.propertyAddress ? 'is-invalid' : ''}`}
//                                         placeholder="Search Property Address"
//                                         value={step1Data.propertyAddress || value}
//                                         onChange={handleAddressInputChange}
//                                         disabled={!ready}
//                                         onFocus={() => setShowPropertyList(true)}
//                                         style={{
//                                             fontSize: "14px",
//                                             padding: "12px 16px",
//                                             border: errors.propertyAddress ? "1px solid #dc3545" : "1px solid #6B4F3F",
//                                             borderRadius: "0",
//                                         }}
//                                         onBlur={() => setTimeout(() => { setShowPropertyList(false) }, 200)}
//                                     />
//                                     {errors.propertyAddress && (
//                                         <div className="invalid-feedback d-block">
//                                             {errors.propertyAddress}
//                                         </div>
//                                     )}

//                                     {/* Google Places Suggestions Dropdown */}
//                                     {showPropertyList && status === "OK" && data.length > 0 && (
//                                         <div
//                                             style={{
//                                                 border: "1px solid #6B4F3F",
//                                                 background: "#fff",
//                                                 fontSize: "14px",
//                                                 color: "#463527",
//                                                 marginTop: "4px",
//                                                 position: "absolute",
//                                                 left: 0,
//                                                 right: 0,
//                                                 zIndex: 10,
//                                                 maxHeight: "200px",
//                                                 overflowY: "auto",
//                                                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//                                             }}
//                                         >
//                                             {data.map(({ place_id, description }) => (
//                                                 <div
//                                                     key={place_id}
//                                                     style={{
//                                                         padding: "10px 16px",
//                                                         cursor: "pointer",
//                                                         borderBottom: "1px solid #eee",
//                                                         transition: 'background-color 0.2s'
//                                                     }}
//                                                     onClick={() => handleSelectLocation(description)}
//                                                     onMouseDown={(e) => e.preventDefault()}
//                                                     onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
//                                                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                                 >
//                                                     {description}
//                                                 </div>
//                                             ))}

//                                             <button
//                                                 type="button"
//                                                 style={{
//                                                     color: "#6B4F3F",
//                                                     textDecoration: "none",
//                                                     fontWeight: "500",
//                                                     fontSize: "14px",
//                                                     padding: "10px 16px",
//                                                     width: "100%",
//                                                     textAlign: "left",
//                                                     background: "none",
//                                                     border: "none",
//                                                     borderTop: "1px solid #eee",
//                                                     cursor: "pointer"
//                                                 }}
//                                                 onClick={handleManualEntry}
//                                                 onMouseDown={(e) => e.preventDefault()}
//                                             >
//                                                 Not found? Enter address manually
//                                             </button>
//                                         </div>
//                                     )}

//                                     {/* Show loading or no results states */}
//                                     {!isGoogleReady && (
//                                         <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
//                                             Loading Google Maps...
//                                         </div>
//                                     )}
//                                     {showPropertyList && status === "ZERO_RESULTS" && (
//                                         <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
//                                             No results found. Try a different search or enter manually.
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Manual Address Form with Dynamic Map */}
//                                 {showManual && (
//                                     <div className='mb-3'>
//                                         <p style={{ fontWeight: "500", marginBottom: "12px" }}>Please fill in the missing details</p>

//                                         {/* Dynamic Map Display */}
//                                         {/* <DynamicMap
//                                             lat={step1Data.lat}
//                                             lng={step1Data.lng}
//                                             address={step1Data.propertyAddress}
//                                         /> */}
//                                         {/* Replace the existing <DynamicMap ... /> call with: */}
//                                         <DynamicMap
//                                             lat={step1Data.lat}
//                                             lng={step1Data.lng}
//                                             address={step1Data.propertyAddress}
//                                             onPinDrag={({ lat, lng, address }) => {
//                                                 setStep1Data(prev => ({
//                                                     ...prev,
//                                                     lat,
//                                                     lng,
//                                                     // Optionally update the address field with the reverse-geocoded result:
//                                                     propertyAddress: address || prev.propertyAddress,
//                                                 }));
//                                             }}
//                                         />

//                                         {/* Dynamic Google Maps URL */}
//                                         {/* {googleMapsUrl && (
//                                             <div style={{ marginBottom: "20px", fontSize: "15px", color: "#463527" }}>
//                                                 <Link
//                                                     href={googleMapsUrl}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     style={{
//                                                         color: '#6B4F3F',
//                                                         textDecoration: 'none',
//                                                         fontWeight: '500',
//                                                         wordBreak: 'break-all'
//                                                     }}
//                                                 >
//                                                     {googleMapsUrl}
//                                                 </Link>
//                                             </div>
//                                         )} */}

//                                         <div className="row">
//                                             <div className="col-md-8">
//                                                 <div className='form-group mb-4'>
//                                                     <label>Street and number <span style={{ color: '#f00' }}>*</span></label>
//                                                     <input
//                                                         type="text"
//                                                         name="streetNumber"
//                                                         className={`form-control ${errors.streetNumber ? 'is-invalid' : ''}`}
//                                                         value={step1Data.streetNumber || ''}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Enter street address"
//                                                     />
//                                                     {errors.streetNumber && (
//                                                         <div className="invalid-feedback d-block">
//                                                             {errors.streetNumber}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <div className='form-group mb-4'>
//                                                     <label>Flat/House No.</label>
//                                                     <input
//                                                         type="text"
//                                                         name="flatNo"
//                                                         className="form-control"
//                                                         value={step1Data.flatNo || ''}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Flat/House number"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="row">
//                                             <div className="col-md-6">
//                                                 <div className='form-group mb-4'>
//                                                     <label>City <span style={{ color: '#f00' }}>*</span></label>
//                                                     <input
//                                                         type="text"
//                                                         name="city"
//                                                         className={`form-control ${errors.city ? 'is-invalid' : ''}`}
//                                                         value={step1Data.city || ''}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Enter city"
//                                                     />
//                                                     {errors.city && (
//                                                         <div className="invalid-feedback d-block">
//                                                             {errors.city}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-6">
//                                                 <div className='form-group mb-4'>
//                                                     <label>State <span style={{ color: '#f00' }}>*</span></label>
//                                                     <input
//                                                         type="text"
//                                                         name="state"
//                                                         className={`form-control ${errors.state ? 'is-invalid' : ''}`}
//                                                         value={step1Data.state || ''}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Enter state"
//                                                     />
//                                                     {errors.state && (
//                                                         <div className="invalid-feedback d-block">
//                                                             {errors.state}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="row">
//                                             <div className="col-md-4">
//                                                 <div className='form-group mb-4'>
//                                                     <label>Country <span style={{ color: '#f00' }}>*</span></label>
//                                                     <input
//                                                         type="text"
//                                                         name="country"
//                                                         className={`form-control ${errors.country ? 'is-invalid' : ''}`}
//                                                         value={step1Data.country || ''}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Enter country"
//                                                     />
//                                                     {errors.country && (
//                                                         <div className="invalid-feedback d-block">
//                                                             {errors.country}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-8">
//                                                 <div className='form-group mb-4'>
//                                                     <label>PIN Code <span style={{ color: '#f00' }}>*</span></label>
//                                                     <input
//                                                         type="text"
//                                                         name="pinCode"
//                                                         className={`form-control pincode-flag ${errors.pinCode ? 'is-invalid' : ''}`}
//                                                         value={step1Data.pinCode || ''}
//                                                         onChange={handleInputChange}
//                                                         placeholder="Enter PIN code"
//                                                     />
//                                                     {errors.pinCode && (
//                                                         <div className="invalid-feedback d-block">
//                                                             {errors.pinCode}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <p className='subheadline-2 mb-1'>Address Help</p>
//                                         <div className='form-group mb-4'>
//                                             <label>Give Step by Step Direction to Guest For Reach Property Smoothly</label>
//                                             <textarea
//                                                 name='addressHelp'
//                                                 className='form-control'
//                                                 placeholder="Provide directions, landmarks, or special instructions for guests..."
//                                                 value={step1Data.addressHelp || ''}
//                                                 onChange={handleInputChange}
//                                                 rows={3}
//                                             />
//                                         </div>

//                                         <hr style={{ margin: "50px 0" }} />
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Property Manager Section */}
//                             <div className="property-list-2">
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <p className="subheadline-2 mb-3">Property manager details <span style={{ color: '#f00' }}>*</span></p>
//                                     <Image
//                                         src="./images/icons/add_circle.svg"
//                                         className="img-fluid mb-3"
//                                         alt="add"
//                                         width={24}
//                                         height={24}
//                                         onClick={handleAddManager}
//                                         style={{ cursor: "pointer" }}
//                                     />
//                                 </div>

//                                 {errors.managers && (
//                                     <div className="alert alert-danger" role="alert">
//                                         {errors.managers}
//                                     </div>
//                                 )}

//                                 {managers.map((managerItem) => (
//                                     <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
//                                         {!managerItem.data ? (
//                                             <>
//                                                 <div className='d-flex justify-content-between align-items-center gap-2'>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control user-icn2"
//                                                         placeholder="Add property manager"
//                                                         onFocus={() => setShowManagerList(managerItem.id)}
//                                                         onBlur={() => setTimeout(() => setShowManagerList(null), 200)}
//                                                         style={{ backgroundImage: 'url("./images/icons/user.svg")', backgroundRepeat: 'no-repeat', backgroundPosition: '12px center', backgroundSize: '20px', paddingLeft: '40px' }}
//                                                     />
//                                                     {managers.length > 1 && (
//                                                         <Image
//                                                             src="./images/icons/delete_b.svg"
//                                                             className="img-fluid"
//                                                             alt="remove"
//                                                             width={24}
//                                                             height={24}
//                                                             onClick={() => handleManagerRemove(managerItem.id)}
//                                                             style={{ cursor: "pointer" }}
//                                                         />
//                                                     )}
//                                                 </div>

//                                                 {showManagerList === managerItem.id && (
//                                                     <div
//                                                         style={{
//                                                             position: "absolute",
//                                                             top: "100%",
//                                                             left: 0,
//                                                             right: 0,
//                                                             background: "#f9f6f4",
//                                                             border: "1px solid #6B4F3F",
//                                                             borderRadius: "0px",
//                                                             zIndex: 10,
//                                                             padding: "16px",
//                                                             maxHeight: "300px",
//                                                             overflowY: "auto"
//                                                         }}
//                                                     >
//                                                         {managerList.map((manager, idx) => (
//                                                             <div
//                                                                 key={manager.uid}
//                                                                 style={{
//                                                                     display: "flex",
//                                                                     alignItems: "center",
//                                                                     marginBottom: "18px",
//                                                                     borderBottom: idx < managerList.length - 1 ? "1px solid #ececec" : "none",
//                                                                     paddingBottom: "15px",
//                                                                     cursor: "pointer",
//                                                                 }}
//                                                                 onClick={() => handleManagerSelect(managerItem.id, manager)}
//                                                             >
//                                                                 <Image
//                                                                     src={manager.profile_image ? manager.profile_image : '/images/icons/No-Image.svg'}
//                                                                     // src={getImageUrl(managerItem.data.profile_image)}
//                                                                     alt={manager.first_name}
//                                                                     style={{
//                                                                         width: "48px",
//                                                                         height: "48px",
//                                                                         borderRadius: "0px",
//                                                                         objectFit: "cover",
//                                                                         marginRight: "16px",
//                                                                     }}
//                                                                     onError={(e) => {
//                                                                         e.target.src = "./images/icons/manager-img.jpg";
//                                                                     }}
//                                                                 // onError={(e) => {
//                                                                 //     e.currentTarget.onerror = null; 
//                                                                 //     console.log("Failed image URL:", e.currentTarget.src); // same as manager.profile_image
//                                                                 //     e.currentTarget.src = "/images/icons/manager-img.jpg";
//                                                                 // }}
//                                                                 />
//                                                                 <div>
//                                                                     <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                         {manager.first_name} {manager.last_name}
//                                                                     </div>
//                                                                     <div style={{ fontSize: "14px", color: "#73615F" }}>
//                                                                         {manager.email}
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 )}
//                                             </>
//                                         ) : (
//                                             <div
//                                                 style={{
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     background: "#f9f6f4",
//                                                     border: "1px solid rgb(128 99 75 / 24%)",
//                                                     borderRadius: "0px",
//                                                     padding: "12px 16px",
//                                                     marginBottom: "8px",
//                                                     marginTop: "15px",
//                                                 }}
//                                             >
//                                                 <Image
//                                                     // src={managerItem.data.profile_image ? managerItem.data.profile_image : '/images/icons/No-Image.svg'}
//                                                     src={getImageUrl(managerItem.data.profile_image)}
//                                                     alt={managerItem.data.first_name}
//                                                     style={{
//                                                         width: "48px",
//                                                         height: "48px",
//                                                         borderRadius: "0px",
//                                                         objectFit: "cover",
//                                                         marginRight: "16px",
//                                                     }}
//                                                     // onError={(e) => {
//                                                     //     e.target.src = "./images/icons/manager-img.jpg";
//                                                     // }}

//                                                     onError={(e) => {
//                                                         e.currentTarget.onerror = null;
//                                                         const fallbackUrl = e.currentTarget.src.replace(
//                                                             "http://localhost:3000",
//                                                             "https://alicedevapi.casamelhor.in"
//                                                         );
//                                                         e.currentTarget.src = fallbackUrl;
//                                                     }}
//                                                 />
//                                                 <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
//                                                     <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                         {managerItem.data.first_name} {managerItem.data.last_name} {managerItem?.data?.name ? managerItem?.data?.name : ''}
//                                                     </span>
//                                                     <span style={{ color: "#73615F" }}>|</span>
//                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px" }}>
//                                                         <Image src="./images/icons/call.svg" alt="call" width={18} height={18} style={{ marginRight: '4px' }} />
//                                                         {managerItem.data.phone_number}
//                                                     </span>
//                                                     <span style={{ color: "#73615F" }}>|</span>
//                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px" }}>
//                                                         <Image src="./images/icons/email.svg" alt="email" width={18} height={18} style={{ marginRight: '4px' }} />
//                                                         {managerItem.data.email}
//                                                     </span>
//                                                 </div>
//                                                 <button
//                                                     type="button"
//                                                     className='ms-auto'
//                                                     onClick={() => handleManagerRemove(managerItem.id)}
//                                                     style={{
//                                                         background: "none",
//                                                         border: "none",
//                                                         color: "#6B4F3F",
//                                                         fontSize: "20px",
//                                                         marginLeft: "12px",
//                                                         cursor: "pointer",
//                                                     }}
//                                                     title="Remove"
//                                                 >
//                                                     <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                                 <hr style={{ margin: "50px 0" }} />
//                             </div>

//                             {/* Property Caretaker Section */}
//                             <div className='property-list-2'>
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <p className="subheadline-2 mb-3">Property Caretaker details <span style={{ color: '#f00' }}>*</span></p>
//                                     <Image
//                                         src="./images/icons/add_circle.svg"
//                                         className="img-fluid mb-3"
//                                         alt="add"
//                                         width={24}
//                                         height={24}
//                                         onClick={handleAddCaretaker}
//                                         style={{ cursor: "pointer" }}
//                                     />
//                                 </div>

//                                 {errors.caretakers && (
//                                     <div className="alert alert-danger" role="alert">
//                                         {errors.caretakers}
//                                     </div>
//                                 )}

//                                 {caretakers.map((caretakerItem) => (
//                                     <div key={caretakerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
//                                         {!caretakerItem.data ? (
//                                             <>
//                                                 <div className='d-flex justify-content-between align-items-center gap-2'>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control user-icn2"
//                                                         placeholder="Add property caretaker"
//                                                         onFocus={() => setShowCaretakerList(caretakerItem.id)}
//                                                         onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//                                                         style={{ backgroundImage: 'url("./images/icons/user.svg")', backgroundRepeat: 'no-repeat', backgroundPosition: '12px center', backgroundSize: '20px', paddingLeft: '40px' }}
//                                                     />

//                                                     {caretakers.length > 1 && (
//                                                         <Image
//                                                             src="./images/icons/delete_b.svg"
//                                                             className="img-fluid"
//                                                             alt="remove"
//                                                             width={24}
//                                                             height={24}
//                                                             onClick={() => handleCaretakerRemove(caretakerItem.id)}
//                                                             style={{ cursor: "pointer" }}
//                                                         />
//                                                     )}
//                                                 </div>

//                                                 {showCaretakerList === caretakerItem.id && (
//                                                     <div
//                                                         style={{
//                                                             position: "absolute",
//                                                             top: "100%",
//                                                             left: 0,
//                                                             right: 0,
//                                                             background: "#f9f6f4",
//                                                             border: "1px solid #6B4F3F",
//                                                             borderRadius: "0px",
//                                                             zIndex: 10,
//                                                             padding: "16px",
//                                                             maxHeight: "300px",
//                                                             overflowY: "auto"
//                                                         }}
//                                                     >
//                                                         {caretakerList.map((caretaker, idx) => (
//                                                             <div
//                                                                 key={caretaker.uid}
//                                                                 style={{
//                                                                     display: "flex",
//                                                                     alignItems: "center",
//                                                                     marginBottom: "18px",
//                                                                     borderBottom: idx < caretakerList.length - 1 ? "1px solid #ececec" : "none",
//                                                                     paddingBottom: "15px",
//                                                                     cursor: "pointer",
//                                                                 }}
//                                                                 onClick={() => handleCaretakerSelect(caretakerItem.id, caretaker)}
//                                                             >
//                                                                 <Image
//                                                                     src={caretaker.profile_image ? caretaker.profile_image : '/images/icons/No-Image.svg'}
//                                                                     alt={caretaker.first_name}
//                                                                     width={48}
//                                                                     height={48}
//                                                                     style={{
//                                                                         borderRadius: "0px",
//                                                                         objectFit: "cover",
//                                                                         marginRight: "16px",
//                                                                     }}
//                                                                     onError={(e) => {
//                                                                         e.target.src = "./images/icons/caretaker-img.jpg";
//                                                                     }}
//                                                                 />
//                                                                 <div>
//                                                                     <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                         {caretaker.first_name} {caretaker.last_name}{" "}
//                                                                         {caretaker.you && (
//                                                                             <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                                                 (You)
//                                                                             </span>
//                                                                         )}
//                                                                     </div>
//                                                                     <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 )}
//                                             </>
//                                         ) : (
//                                             <div
//                                                 style={{
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     background: "#f9f6f4",
//                                                     border: "1px solid rgb(128 99 75 / 24%)",
//                                                     borderRadius: "0px",
//                                                     padding: "12px 16px",
//                                                     marginBottom: "8px",
//                                                     marginTop: "15px",
//                                                 }}
//                                             >
//                                                 <Image
//                                                     // src={caretakerItem.data.profile_image ? caretakerItem.data.profile_image : '/images/icons/No-Image.svg'}
//                                                     src={getImageUrl(caretakerItem.data.profile_image)}
//                                                     alt={caretakerItem.data.first_name}
//                                                     width={48}
//                                                     height={48}
//                                                     style={{
//                                                         borderRadius: "0px",
//                                                         objectFit: "cover",
//                                                         marginRight: "16px",
//                                                     }}
//                                                     // onError={(e) => {
//                                                     //     e.target.src = "./images/icons/caretaker-img.jpg";
//                                                     // }}
//                                                     onError={(e) => {
//                                                         e.currentTarget.onerror = null;
//                                                         const fallbackUrl = e.currentTarget.src.replace(
//                                                             "http://localhost:3000",
//                                                             "https://alicedevapi.casamelhor.in"
//                                                         );
//                                                         e.currentTarget.src = fallbackUrl;
//                                                     }}
//                                                 />

//                                                 <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
//                                                     <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                         {caretakerItem.data.first_name} {caretakerItem.data.last_name} {caretakerItem?.data?.name ? caretakerItem?.data?.name : ''}
//                                                         {caretakerItem.data.you && (
//                                                             <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                                 (You)
//                                                             </span>
//                                                         )}
//                                                     </span>
//                                                     <span style={{ color: "#73615F" }}>|</span>
//                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px" }}>
//                                                         <Image src="./images/icons/call.svg" alt="call" width={18} height={18} style={{ marginRight: '4px' }} />
//                                                         {caretakerItem.data.phone || "8390734261"}
//                                                     </span>
//                                                     <span style={{ color: "#73615F" }}>|</span>
//                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px" }}>
//                                                         <Image src="./images/icons/email.svg" alt="email" width={18} height={18} style={{ marginRight: '4px' }} />
//                                                         {caretakerItem.data.email}
//                                                     </span>
//                                                 </div>

//                                                 <button
//                                                     type="button"
//                                                     className='ms-auto'
//                                                     onClick={() => handleCaretakerRemove(caretakerItem.id)}
//                                                     style={{
//                                                         background: "none",
//                                                         border: "none",
//                                                         color: "#6B4F3F",
//                                                         fontSize: "20px",
//                                                         marginLeft: "12px",
//                                                         cursor: "pointer",
//                                                     }}
//                                                     title="Remove"
//                                                 >
//                                                     <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}

//                                 <hr style={{ margin: '50px 0' }}></hr>
//                             </div>

//                             {/* Operations Manager Contact Details - FIXED IMAGE SECTION */}
//                             <div className='property-list-2'>
//                                 <div className='d-flex justify-content-between'>
//                                     <p className='subheadline-2 mb-3'>Operations managers contact details</p>
//                                 </div>

//                                 <div className='form-group mb-4'>
//                                     <label>Name of the person who should contacted in case of emergency <span style={{ color: '#f00' }}>*</span></label>
//                                     <input
//                                         type='text'
//                                         name="operationsManagerName"
//                                         className={`form-control ${errors.operationsManagerName ? 'is-invalid' : ''}`}
//                                         placeholder='Enter name e.x. Priya Sharma'
//                                         value={step1Data.operationsManagerName || ''}
//                                         onChange={handleInputChange}
//                                     />
//                                     {errors.operationsManagerName && (
//                                         <div className="invalid-feedback d-block">
//                                             {errors.operationsManagerName}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className='form-group mb-4'>
//                                     <label>{`Contact person's email`} <span style={{ color: '#f00' }}>*</span></label>
//                                     <input
//                                         type='email'
//                                         name="operationsManagerEmail"
//                                         className={`form-control ${errors.operationsManagerEmail ? 'is-invalid' : ''}`}
//                                         placeholder='e.x. priyasharma@casamelhor.com'
//                                         value={step1Data.operationsManagerEmail || ''}
//                                         onChange={handleInputChange}
//                                     />
//                                     {errors.operationsManagerEmail && (
//                                         <div className="invalid-feedback d-block">
//                                             {errors.operationsManagerEmail}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className='form-group mb-4'>
//                                     <label>{`Contact person's phone number`} <span style={{ color: '#f00' }}>*</span></label>
//                                     <input
//                                         type='tel'
//                                         name="operationsManagerPhone"
//                                         className={`form-control ${errors.operationsManagerPhone ? 'is-invalid' : ''}`}
//                                         placeholder='e.x. +91 5534545278'
//                                         value={step1Data.operationsManagerPhone || ''}
//                                         // onChange={handleInputChange}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             if (/^[0-9]*$/.test(value)) {
//                                                 handleInputChange(e);
//                                             }
//                                         }}
//                                     />
//                                     {errors.operationsManagerPhone && (
//                                         <div className="invalid-feedback d-block">
//                                             {errors.operationsManagerPhone}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className='form-group mb-4'>
//                                     <label>Contact alternate phone number (optional)</label>
//                                     <input
//                                         type='tel'
//                                         name='operationsManagerAlternatePhone'
//                                         // className='form-control'
//                                         className={`form-control ${errors.operationsManagerAlternatePhone ? 'is-invalid' : ''}`}
//                                         placeholder='e.x. +91 4323545464'
//                                         value={step1Data.operationsManagerAlternatePhone || ''}
//                                         onChange={(e) => {
//                                             const value = e.target.value;

//                                             // allow only numbers
//                                             if (!/^[0-9]*$/.test(value)) return;

//                                             handleInputChange(e);

//                                             // 🔥 real-time same number validation
//                                             if (
//                                                 value &&
//                                                 value === step1Data.operationsManagerPhone
//                                             ) {
//                                                 setErrors(prev => ({
//                                                     ...prev,
//                                                     operationsManagerAlternatePhone: 'Please enter a different number'
//                                                 }));
//                                             } else {
//                                                 setErrors(prev => {
//                                                     const newErrors = { ...prev };
//                                                     delete newErrors.operationsManagerAlternatePhone;
//                                                     return newErrors;
//                                                 });
//                                             }
//                                         }}
//                                     // onChange={handleInputChange}
//                                     // onChange={(e) => {
//                                     //     const value = e.target.value;
//                                     //     if (/^[0-9]*$/.test(value)) {
//                                     //         handleInputChange(e);
//                                     //     }
//                                     // }}
//                                     />
//                                     {errors.operationsManagerAlternatePhone && (
//                                         <div className="invalid-feedback d-block">
//                                             {errors.operationsManagerAlternatePhone}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className='form-group mb-4'>
//                                     <label>{`Contact person's photo`}</label>
//                                     {!file && (
//                                         <div
//                                             className='add-upload-photo'
//                                             style={{
//                                                 border: '2px dashed #ddd',
//                                                 padding: '20px',
//                                                 textAlign: 'center',
//                                                 borderRadius: '8px',
//                                                 cursor: 'pointer'
//                                             }}
//                                             onClick={changepicModal}
//                                         >
//                                             <Image
//                                                 src={"./images/icons/photo-camera.svg"}
//                                                 className='img-fluid mb-2'
//                                                 width={50}
//                                                 height={40}
//                                                 alt='add photo'
//                                             />
//                                             <Button
//                                                 variant=''
//                                                 className='add-photo-btn'
//                                                 style={{
//                                                     background: 'none',
//                                                     border: 'none',
//                                                     color: '#6B4F3F'
//                                                 }}
//                                             >
//                                                 {file ? 'Change Photo' : 'Add Photo'}
//                                             </Button>
//                                             {file && (
//                                                 <p className='text-muted mt-2 mb-0' style={{ fontSize: '14px', color: '#73615F' }}>
//                                                     One photo uploaded. Click to change.
//                                                 </p>
//                                             )}
//                                         </div>

//                                     )}
//                                 </div>

//                                 {/* FIXED: Image preview section */}
//                                 {file && (
//                                     <div className="upload-photo mb-4">
//                                         <div className="relative" style={{ position: 'relative', display: 'inline-block' }}>
//                                             <Image
//                                                 src={file}
//                                                 alt="Operations manager photo"
//                                                 width={200}
//                                                 height={150}
//                                                 style={{
//                                                     borderRadius: '8px',
//                                                     width: '200px',
//                                                     height: '150px',
//                                                     objectFit: 'cover'
//                                                 }}
//                                             />
//                                             <button
//                                                 onClick={removeFile}
//                                                 style={{
//                                                     position: 'absolute',
//                                                     top: '8px',
//                                                     right: '8px',
//                                                     background: 'rgba(0,0,0,0.6)',
//                                                     borderRadius: '50%',
//                                                     padding: '4px',
//                                                     border: 'none',
//                                                     width: '24px',
//                                                     height: '24px',
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                     cursor: 'pointer'
//                                                 }}
//                                                 title="Remove photo"
//                                             >
//                                                 <Image
//                                                     src="./images/icons/delete.svg"
//                                                     className='img-fluid'
//                                                     width={14}
//                                                     height={14}
//                                                     alt='delete'
//                                                     style={{ filter: 'brightness(0) invert(1)' }}
//                                                 />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <Button
//                                     variant="success"
//                                     className='complete-form-btn'
//                                     style={{
//                                         padding: '13px 25px',
//                                         borderRadius: '0',
//                                         backgroundColor: '#6B4F3F',
//                                         border: 'none'
//                                     }}
//                                     // type="submit"
//                                     onClick={() => handleSubmit('')}
//                                     disabled={isSubmitted}
//                                 >
//                                     {isSubmitted ? 'Saving...' : 'Save Changes'}
//                                 </Button>
//                             </div>
//                             {/* </Form> */}
//                         </div>
//                     </Col>
//                 </Row>
//             </div>

//             {/* FIXED: Photo Upload Modal */}
//             <Modal
//                 show={changepicsModal}
//                 onHide={changepicClose}
//                 animation={false}
//                 centered
//                 className='custom-theme-modal'
//             >
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-0'>
//                     <Modal.Title>
//                         {file ? 'Change photo' : 'Upload photo'}
//                     </Modal.Title>
//                     <Image
//                         src='/images/icons/close-circle.svg'
//                         width={24}
//                         height={24}
//                         alt='Close'
//                         style={{ cursor: 'pointer' }}
//                         onClick={changepicClose}
//                     />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <p className='border-bottom pb-4'>Please upload Operations managers photo</p>
//                     <div className="drap-drop-box-full">
//                         <label
//                             onDrop={handleDrop}
//                             onDragOver={handleDragOver}
//                             className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
//                             style={{
//                                 borderRadius: '8px',
//                                 background: file ? `url(${file}) center/cover no-repeat` : 'none',
//                                 position: 'relative'
//                             }}
//                         >
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                                 id="file-input"
//                             />
//                             {!file ? (
//                                 <div className="text-center">
//                                     <Image
//                                         src="/images/icons/photo-library.svg"
//                                         alt="Upload"
//                                         width={30}
//                                         height={30}
//                                         className="mx-auto mb-2"
//                                     />
//                                     <p className="font-medium mb-0" style={{ color: '#463527' }}>Drag and drop</p>
//                                     <p className="text-sm text-gray-500 mb-0" style={{ color: '#73615F' }}>
//                                         or click here to choose file.
//                                     </p>
//                                 </div>
//                             ) : (
//                                 <div className="text-center" style={{ background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '4px' }}>
//                                     <p className="font-medium mb-0" style={{ color: '#463527' }}>
//                                         Photo selected. Click to change or drop a new one.
//                                     </p>
//                                 </div>
//                             )}
//                         </label>
//                     </div>
//                     {file && (
//                         <div className="text-center mt-3">
//                             <Button
//                                 variant="link"
//                                 onClick={removeFile}
//                                 style={{ color: '#dc3545', textDecoration: 'none' }}
//                             >
//                                 Remove Photo
//                             </Button>
//                         </div>
//                     )}
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between'>
//                     <Button
//                         variant=""
//                         onClick={changepicClose}
//                         className='btn-company-add'
//                         style={{
//                             padding: '13px 25px',
//                             borderRadius: '0',
//                             border: '1px solid #6B4F3F',
//                             color: '#6B4F3F',
//                             background: 'none'
//                         }}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant=""
//                         onClick={() => handleUploadConfirm('')}
//                         className='search-btn complete-form-btn'
//                         style={{
//                             padding: '13px 25px',
//                             borderRadius: '0',
//                             backgroundColor: '#6B4F3F',
//                             border: 'none'
//                         }}
//                         disabled={!file}
//                     >
//                         {file ? 'Confirm Upload' : 'Upload'}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     )
// }


"use client"
import { CreatePropertyAPI, OperationManagerPhotoUploadAPI, UpdatePropertyDetailAPI, WizardStepUpdateAPI } from '@/services/provider';
import { alert_danger } from '@/utils/Alerts/TostifyAlerts';
import { getItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
import { propertStepFirstValidation } from '@/utils/validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'
import { useEffect, useState } from "react";
import { Button, Col, Row, Image, Modal } from 'react-bootstrap';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

// ─── FIX 1: isMapReady state added ───────────────────────────────────────────
// ─── FIX 2: Polling useEffect added to wait for Google Maps SDK ──────────────
// ─── FIX 3: Main useEffect dependency includes isMapReady ────────────────────
const DynamicMap = ({ lat, lng, address, onPinDrag }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragCoords, setDragCoords] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false); // FIX 1: new state

    // FIX 2: Poll until google.maps SDK is available, then set isMapReady
    useEffect(() => {
        if (window.google?.maps) {
            setIsMapReady(true);
            return;
        }
        const timer = setInterval(() => {
            if (window.google?.maps) {
                setIsMapReady(true);
                clearInterval(timer);
            }
        }, 200);
        return () => clearInterval(timer);
    }, []);

    // FIX 3: isMapReady replaces inline window.google check; added to deps array
    useEffect(() => {
        if (!lat || !lng) return;
        if (!isMapReady) return; // waits until SDK confirmed ready

        const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: position,
                zoom: 15,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControlOptions: {
                    position: window.google.maps.ControlPosition.RIGHT_CENTER,
                },
                styles: [
                    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
                ]
            });
        }

        if (!markerRef.current) {
            markerRef.current = new window.google.maps.Marker({
                position,
                map: mapInstanceRef.current,
                draggable: true,
                animation: window.google.maps.Animation.DROP,
                title: 'Drag to adjust location',
                cursor: 'grab',
            });

            markerRef.current.addListener('dragstart', () => {
                setIsDragging(true);
                setDragCoords(null);
            });

            markerRef.current.addListener('drag', (e) => {
                setDragCoords({
                    lat: e.latLng.lat().toFixed(6),
                    lng: e.latLng.lng().toFixed(6),
                });
            });

            markerRef.current.addListener('dragend', async (e) => {
                setIsDragging(false);
                const newLat = e.latLng.lat().toFixed(6);
                const newLng = e.latLng.lng().toFixed(6);
                setDragCoords(null);

                let newAddress = address;
                try {
                    const results = await getGeocode({ location: { lat: newLat, lng: newLng } });
                    if (results?.[0]?.formatted_address) {
                        newAddress = results[0].formatted_address;
                    }
                } catch (err) {
                    console.warn('Reverse geocode failed:', err);
                }

                if (onPinDrag) {
                    onPinDrag({ lat: newLat, lng: newLng, address: newAddress });
                }
            });
        } else {
            markerRef.current.setPosition(position);
            mapInstanceRef.current.panTo(position);
        }
    }, [lat, lng, isMapReady]); // FIX 3: isMapReady in deps

    if (!lat || !lng) {
        return (
            <div style={{
                width: '100%',
                height: '300px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px dashed #ddd'
            }}>
                <p style={{ color: '#999', fontSize: '14px' }}>
                    Search for an address to see it on the map
                </p>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                padding: '8px 12px',
                background: '#f5f0eb',
                borderRadius: '6px',
                border: '1px solid #e0d5cc',
                fontSize: '13px',
                color: '#6B4F3F'
            }}>
                <span style={{ fontSize: '16px' }}>📍</span>
                <span>
                    {isDragging
                        ? `Dragging… ${dragCoords ? `${dragCoords.lat}, ${dragCoords.lng}` : ''}`
                        : 'Drag the pin to fine-tune the exact location'}
                </span>
            </div>

            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    overflow: 'hidden',
                    cursor: isDragging ? 'grabbing' : 'default',
                }}
            />

            <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '8px',
                fontSize: '12px',
                color: '#999'
            }}>
                <span>Lat: <strong style={{ color: '#463527' }}>{parseFloat(lat).toFixed(6)}</strong></span>
                <span>Lng: <strong style={{ color: '#463527' }}>{parseFloat(lng).toFixed(6)}</strong></span>
            </div>
        </div>
    );
};

export default function Step1({ step1Data, setStep1Data, propertyRole, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, showManual, setShowManual, draft, setSearchMgr, setSearchCaretacker }) {
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPropertyList, setShowPropertyList] = useState(false);
    const router = useRouter();

    const [caretakers, setCaretakers] = useState([{ id: Date.now(), data: null }]);
    const [showCaretakerList, setShowCaretakerList] = useState(null);

    const [managers, setManagers] = useState([{ id: Date.now(), data: null }]);
    const [showManagerList, setShowManagerList] = useState(false);

    const [changepicsModal, changepisetShow] = useState(false);
    const [file, setFile] = useState(null);
    const [isGoogleReady, setIsGoogleReady] = useState(false);
    const [googleMapsUrl, setGoogleMapsUrl] = useState('');
    const [property, setProperty] = useState({});

    useEffect(() => {
        try {
            const propertyItem = getItemLocalStorage("properyItem");
            if (propertyItem) {
                setProperty(JSON.parse(propertyItem));
            } else if (draft?.uid) {
                setProperty(draft)
            }
        } catch (error) {
            console.error("Error loading property data:", error);
        }
    }, []);

    const hasManagerData = managers?.some(manager => manager?.data !== null);
    const hasCaretakerData = caretakers?.some(caretaker => caretaker?.data !== null);

    function limitDecimalPlaces(value) { return Math.trunc(value * 10000000000) / 10000000000;}

    // useEffect(() => {
    //     const checkGoogleReady = () => {
    //         if (window.google && window.google.maps && window.google.maps.places) {
    //             setIsGoogleReady(true);
    //         }
    //     };

    //     checkGoogleReady();
    //     const interval = setInterval(checkGoogleReady, 500);
    //     return () => clearInterval(interval);
    // }, []);
    // useEffect(() => {
    //     const checkGoogleReady = () => {
    //         if (window.google && window.google.maps && window.google.maps.places) {
    //             setIsGoogleReady(true);
    //             clearInterval(interval);
    //         }
    //     };

    //     checkGoogleReady();
    //     const interval = setInterval(checkGoogleReady, 500);
    //     return () => clearInterval(interval);
    // }, []);
    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            setIsGoogleReady(true);
            return;
        }

        const interval = setInterval(() => {
            if (window.google && window.google.maps && window.google.maps.places) {
                setIsGoogleReady(true);
                clearInterval(interval);
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Add this NEW useEffect right after the above one
    useEffect(() => {
        if (isGoogleReady) {
            init();
        }
    }, [isGoogleReady]);

    useEffect(() => {
        if (step1Data?.property_caretakers) {
            const caretakersWithIds = step1Data.property_caretakers.map((obj, index) => ({
                id: `${Date.now()}-${index}`,
                data: obj
            }));
            setCaretakers(caretakersWithIds);
        }
    }, [step1Data?.property_caretakers]);

    useEffect(() => {
        if (step1Data?.property_managers) {
            const managersWithIds = step1Data.property_managers.map((obj, index) => ({
                id: `${Date.now()}-${index}`,
                data: obj
            }));
            setManagers(managersWithIds);
        }
    }, [step1Data?.property_managers]);

    useEffect(() => {
        if (step1Data?.contactImage) {
            setFile(step1Data.contactImage)
        }
    }, [step1Data?.contactImage]);

    useEffect(() => {
        if (step1Data.lat && step1Data.lng) {
            const url = `https://www.google.com/maps?q=${step1Data.lat},${step1Data.lng}&z=15&output=embed`;
            setGoogleMapsUrl(url);
        }
    }, [step1Data.lat, step1Data.lng]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newData = { [name]: value }
        setStep1Data({
            ...step1Data,
            [name]: value
        });
        const { error } = propertStepFirstValidation(newData, showManual)
        setErrors({
            ...errors,
            ...error
        })
    };

    // ─── FIX 4: Removed initOnMount: isGoogleReady ───────────────────────────
    // const {
    //     ready,
    //     value,
    //     suggestions: { status, data },
    //     setValue,
    //     clearSuggestions,
    // } = usePlacesAutocomplete({
    //     debounce: 300,
    //     requestOptions: {
    //         componentRestrictions: { country: "in" },
    //     },
    //     // FIX 4: initOnMount removed — let the library manage its own readiness
    // });

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
        init,
    } = usePlacesAutocomplete({
        debounce: 300,
        requestOptions: {
            componentRestrictions: { country: "in" },
        },
        initOnMount: false,
    });

    const handleSelectLocation = async (description) => {
        try {
            setValue(description, false);
            clearSuggestions();
            setShowPropertyList(false);

            const results = await getGeocode({ address: description });

            if (!results || results.length === 0) {
                setShowManual(true);
                return;
            }

            const { lat, lng } = await getLatLng(results[0]);
            const address = parseAddress(results[0]);

            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
            setGoogleMapsUrl(mapsUrl);

            setStep1Data(prev => ({
                ...prev,
                propertyAddress: description,
                streetNumber: address.street,
                city: address.city,
                state: address.state,
                country: address.country,
                pinCode: address.postalCode,
                lat: limitDecimalPlaces(lat),
                lng: limitDecimalPlaces(lng),
                flatNo: address.flatNo || prev.flatNo
            }));

            setShowManual(true);

        } catch (error) {
            console.error('Error in handleSelectLocation:', error);
            setShowManual(true);
        }
    };

    const parseAddress = (result) => {
        const components = result.address_components;

        const getComponent = (types) => {
            const component = components.find(comp =>
                types.some(type => comp.types.includes(type))
            );
            return component ? component.long_name : '';
        };

        const streetComponents = [
            getComponent(['street_number']),
            getComponent(['route']),
            getComponent(['premise']),
            getComponent(['sublocality_level_1']),
            getComponent(['sublocality'])
        ].filter(Boolean);

        const street = streetComponents.length > 0
            ? streetComponents.join(', ')
            : result.formatted_address?.split(',')[0] || '';

        return {
            street: street,
            city: getComponent(['locality']) ||
                getComponent(['administrative_area_level_2']) ||
                getComponent(['postal_town']),
            state: getComponent(['administrative_area_level_1']),
            country: getComponent(['country']),
            postalCode: getComponent(['postal_code']),
            flatNo: getComponent(['premise', 'subpremise'])
        };
    };

    const handleManualEntry = () => {
        setShowManual(true);
        setShowPropertyList(false);
    };

    // const handleAddressInputChange = (e) => {
    //     const value = e.target.value;
    //     setValue(value);
    //     setStep1Data(prev => ({
    //         ...prev,
    //         propertyAddress: value
    //     }));
    //     setShowPropertyList(true);
    // };
    const handleAddressInputChange = (e) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        setStep1Data(prev => ({
            ...prev,
            propertyAddress: inputValue
        }));
        if (inputValue.length > 0) {
            setShowPropertyList(true);
        } else {
            setShowPropertyList(false);
        }
    };

    // const handleManagerSelect = (id, manager) => {
    //     setManagers((prev) =>
    //         prev.map((m) => (m.id === id ? { ...m, data: manager } : m))
    //     );
    //     setShowManagerList(null);

    //     if (errors.managers) {
    //         setErrors(prev => ({
    //             ...prev,
    //             managers: ''
    //         }));
    //     }
    // };

    const handleManagerSelect = (id, manager) => {
        const alreadySelected = managers.some(m => m.id !== id && m.data?.uid === manager.uid);
        if (alreadySelected) return;

        setManagers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, data: manager } : m))
        );
        setShowManagerList(null);
        if (errors.managers) {
            setErrors(prev => ({
                ...prev,
                managers: ''
            }));
        }
    };

    const handleManagerRemove = (id) => {
        setManagers((prev) => prev.filter((m) => m.id !== id));
    };

    const handleAddManager = () => {
        setManagers([...managers, { id: Date.now(), data: null }]);
    };

    // const handleCaretakerSelect = (id, caretaker) => {
    //     setCaretakers((prev) =>
    //         prev.map((c) => (c.id === id ? { ...c, data: caretaker } : c))
    //     );
    //     setShowCaretakerList(null);

    //     if (errors.caretakers) {
    //         setErrors(prev => ({
    //             ...prev,
    //             caretakers: ''
    //         }));
    //     }
    // };
    const handleCaretakerSelect = (id, caretaker) => {
        const alreadySelected = caretakers.some(c => c.id !== id && c.data?.uid === caretaker.uid);
        if (alreadySelected) return;

        setCaretakers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, data: caretaker } : c))
        );
        setShowCaretakerList(null);
        if (errors.caretakers) {
            setErrors(prev => ({
                ...prev,
                caretakers: ''
            }));
        }
    };

    const handleCaretakerRemove = (id) => {
        setCaretakers((prev) => prev.filter((c) => c.id !== id));
    };

    const handleAddCaretaker = () => {
        setCaretakers([...caretakers, { id: Date.now(), data: null }]);
    };

    const changepicClose = () => {
        changepisetShow(false);
    };

    const changepicModal = () => {
        changepisetShow(true);
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            if (!uploadedFile.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (uploadedFile.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            setStep1Data(prev => ({
                ...prev,
                operationsManagerPhoto: uploadedFile
            }));

            const objectUrl = URL.createObjectURL(uploadedFile);
            setFile(objectUrl);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile) {
            if (!uploadedFile.type.startsWith('image/')) {
                alert('Please drop an image file');
                return;
            }

            if (uploadedFile.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            setStep1Data(prev => ({
                ...prev,
                operationsManagerPhoto: uploadedFile
            }));

            const objectUrl = URL.createObjectURL(uploadedFile);
            setFile(objectUrl);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeFile = () => {
        if (file && file.startsWith('blob:')) {
            URL.revokeObjectURL(file);
        }

        setFile(null);
        setStep1Data(prev => ({
            ...prev,
            operationsManagerPhoto: null
        }));
    };

    const handleUploadConfirm = async (uid) => {
        try {
            if (!property?.uid && !uid) {
                changepicClose();
            } else {
                const fieldData = new FormData();
                fieldData.append("ops_manager_photo_url", step1Data.operationsManagerPhoto)
                const response = await OperationManagerPhotoUploadAPI(property?.uid ? property?.uid : uid, fieldData)
                if (response?.data?.success) {
                    changepicClose();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (flag) => {
        const phoneRegex = /^[0-9]+$/;

        if (
            step1Data.operationsManagerPhone &&
            step1Data.operationsManagerAlternatePhone &&
            step1Data.operationsManagerPhone === step1Data.operationsManagerAlternatePhone
        ) {
            alert_danger(
                "Contact person's phone number and alternate phone number cannot be the same."
            );
            return;
        }

        if (
            step1Data.operationsManagerPhone &&
            !phoneRegex.test(step1Data.operationsManagerPhone)
        ) {
            alert_danger("Contact person's phone number: Only numbers are allowed. Symbols like +, -, space are not allowed.");
            return;
        }

        if (
            step1Data.operationsManagerAlternatePhone &&
            !phoneRegex.test(step1Data.operationsManagerAlternatePhone)
        ) {
            alert_danger("Alternate phone number: Only numbers are allowed. Symbols like +, -, space are not allowed.");
            return;
        }

        setSaveExit(false)
        assignmentRemoveClose();
        try {
            const { isValid, error } = propertStepFirstValidation(
                step1Data,
                showManual,
                hasManagerData,
                hasCaretakerData
            );

            setErrors(error);

            if (isValid) {
                setIsSubmitted(true);

                const pm = managers
                    .filter(manager => manager.data !== null)
                    .map(manager => manager.data.uid);

                const cm = caretakers
                    .filter(caretaker => caretaker.data !== null)
                    .map(caretaker => caretaker.data.uid);

                const fieldData = new FormData();

                fieldData.append("property_name", step1Data.propertyName || '');
                fieldData.append("address_search_text", step1Data.propertyAddress || '');
                fieldData.append("street_number", step1Data.streetNumber || '');
                fieldData.append("flat_house_no", step1Data.flatNo || '');
                fieldData.append("city", step1Data.city || '');
                fieldData.append("state", step1Data.state || '');
                fieldData.append("country", step1Data.country || '');
                fieldData.append("pin_code", step1Data.pinCode || '');
                fieldData.append("latitude", step1Data.lat || '');
                fieldData.append("longitude", step1Data.lng || '');
                fieldData.append("nearest_airport", step1Data.addressHelp || '');

                fieldData.append("ops_manager_name", step1Data.operationsManagerName || '');
                fieldData.append("ops_manager_email", step1Data.operationsManagerEmail || '');
                fieldData.append("ops_manager_phone", step1Data.operationsManagerPhone || '');
                fieldData.append("ops_manager_phone_alt", step1Data.operationsManagerAlternatePhone || '');

                if (step1Data.operationsManagerPhoto) {
                    fieldData.append("ops_manager_photo_url", step1Data.operationsManagerPhoto);
                }

                if (pm.length > 0) {
                    if (pm.length > 1) {
                        fieldData.append("property_manager_ids", JSON.stringify(pm));
                    } else {
                        fieldData.append("property_manager_ids", pm[0]);
                    }
                }

                if (cm.length > 0) {
                    if (cm.length > 1) {
                        fieldData.append("property_caretaker_ids", JSON.stringify(cm));
                    } else {
                        fieldData.append("property_caretaker_ids", cm[0]);
                    }
                }

                let response;
                if (!property?.uid) {
                    response = await CreatePropertyAPI(fieldData);
                } else {
                    const rawData = {
                        property_name: step1Data.propertyName || '',
                        address_search_text: step1Data.propertyAddress || '',
                        street_number: step1Data.streetNumber || '',
                        flat_house_no: step1Data.flatNo || '',
                        city: step1Data.city || '',
                        state: step1Data.state || '',
                        country: step1Data.country || '',
                        pin_code: step1Data.pinCode || '',
                        latitude: step1Data.lat || '',
                        longitude: step1Data.lng || '',
                        nearest_airport: step1Data.addressHelp || '',

                        ops_manager_name: step1Data.operationsManagerName || '',
                        ops_manager_email: step1Data.operationsManagerEmail || '',
                        ops_manager_phone: step1Data.operationsManagerPhone || '',
                        ops_manager_phone_alt: step1Data.operationsManagerAlternatePhone || '',

                        property_manager_ids: pm,
                        property_caretaker_ids: cm
                    };
                    response = await UpdatePropertyDetailAPI(property?.uid, rawData);
                }

                if (response?.data?.success) {
                    if (!property?.uid) setItemLocalStorage("properyItem", JSON.stringify(response.data.response));
                    if (response?.data?.response?.uid) handleUploadConfirm(response?.data?.response?.uid)
                    setIsSubmitted(false);
                    if (flag == "exit") {
                        const wizard = new FormData();
                        wizard.append("wizard_step_completed", activeStep)
                        await WizardStepUpdateAPI(property?.uid, wizard)
                        router.push("/PropertyListing");
                    } else { setActiveStep(activeStep + 1) }
                    assignmentRemoveClose()
                } else {
                    console.error('API response error:', response);
                    const dynamicKey = Object.keys(response.data.response)[0];
                    const message = response.data.response[dynamicKey].join('\n');
                    alert_danger(message)
                    setIsSubmitted(false);
                    assignmentRemoveClose()
                }
            } else {
                const firstErrorField = Object.keys(error)[0];
                if (firstErrorField) {
                    const element = document.querySelector(`[name="${firstErrorField}"]`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
                assignmentRemoveClose()
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setIsSubmitted(false);
            assignmentRemoveClose()
        }
    };

    useEffect(() => {
        if (saveExit && activeStep == 1) {
            handleSubmit('exit')
        }
    }, [saveExit])

    const managerList = propertyRole?.properyManager || [];
    const caretakerList = propertyRole?.propertyCaretacer || [];

    const getImageUrl = (path) => {
        if (!path) return '/images/icons/No-Image.svg';
        if (path.startsWith('media')) {
            return `${path}`;
        }
        return path;
    };

    return (
        <>
            <div className='container'>
                <Row>
                    <Col md={8}>
                        <div className='box-input'>
                            <h3 className='page-title mb-4'>{`Let's get you published!`}</h3>

                            {/* Property Name Section */}
                            <div className='property-list-2'>
                                <p className='subheadline-2 mb-3'>What is the name of your property? <span style={{ color: '#f00' }} >*</span> </p>
                                <p className='mb-2'>Short titles work best. Have fun with it – you can always change it later.</p>
                                <div className='form-group mb-4'>
                                    <input
                                        type='text'
                                        name="propertyName"
                                        className={`form-control ${errors.propertyName ? 'is-invalid' : ''}`}
                                        placeholder='e.g. Casa Melhor'
                                        value={step1Data.propertyName || ''}
                                        onChange={handleInputChange}
                                        maxLength={32}
                                    />
                                    {errors.propertyName && (
                                        <div className="invalid-feedback d-block">
                                            {errors.propertyName}
                                        </div>
                                    )}
                                </div>
                                <span className='text-count'>{(step1Data.propertyName || '').length}/32</span>
                                <hr style={{ margin: '50px 0' }}></hr>
                            </div>

                            {/* Google Maps Address Search Section */}
                            <div className='property-list-2 position-relative'>
                                <p className='subheadline-2 mb-3'>BR Address search <span style={{ color: '#f00' }} >*</span> </p>
                                <p className='mb-2'>{`Where's your property located?`}</p>

                                <div className="form-group mb-4" style={{ position: "relative" }}>
                                    {/* <input
                                        type="text"
                                        name="propertyAddress"
                                        className={`form-control ${errors.propertyAddress ? 'is-invalid' : ''}`}
                                        placeholder="Search Property Address"
                                        value={step1Data.propertyAddress || value}
                                        onChange={handleAddressInputChange}
                                        disabled={!ready}
                                        onFocus={() => setShowPropertyList(true)}
                                        style={{
                                            fontSize: "14px",
                                            padding: "12px 16px",
                                            border: errors.propertyAddress ? "1px solid #dc3545" : "1px solid #6B4F3F",
                                            borderRadius: "0",
                                        }}
                                        onBlur={() => setTimeout(() => { setShowPropertyList(false) }, 200)}
                                    /> */}
                                    <input
                                        type="text"
                                        name="propertyAddress"
                                        className={`form-control ${errors.propertyAddress ? 'is-invalid' : ''}`}
                                        placeholder="Search Property Address"
                                        value={step1Data.propertyAddress || ''}
                                        onChange={handleAddressInputChange}
                                        disabled={false}
                                        onFocus={() => setShowPropertyList(true)}
                                        onBlur={() => setTimeout(() => { setShowPropertyList(false) }, 300)}
                                        style={{
                                            fontSize: "14px",
                                            padding: "12px 16px",
                                            border: errors.propertyAddress ? "1px solid #dc3545" : "1px solid #6B4F3F",
                                            borderRadius: "0",
                                        }}
                                    />
                                    {errors.propertyAddress && (
                                        <div className="invalid-feedback d-block">
                                            {errors.propertyAddress}
                                        </div>
                                    )}

                                    {showPropertyList && status === "OK" && data.length > 0 && (
                                        <div
                                            style={{
                                                border: "1px solid #6B4F3F",
                                                background: "#fff",
                                                fontSize: "14px",
                                                color: "#463527",
                                                marginTop: "4px",
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                zIndex: 10,
                                                maxHeight: "200px",
                                                overflowY: "auto",
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {data.map(({ place_id, description }) => (
                                                <div
                                                    key={place_id}
                                                    style={{
                                                        padding: "10px 16px",
                                                        cursor: "pointer",
                                                        borderBottom: "1px solid #eee",
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onClick={() => handleSelectLocation(description)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                >
                                                    {description}
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                style={{
                                                    color: "#6B4F3F",
                                                    textDecoration: "none",
                                                    fontWeight: "500",
                                                    fontSize: "14px",
                                                    padding: "10px 16px",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    background: "none",
                                                    border: "none",
                                                    borderTop: "1px solid #eee",
                                                    cursor: "pointer"
                                                }}
                                                onClick={handleManualEntry}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                Not found? Enter address manually
                                            </button>
                                        </div>
                                    )}

                                    {/* {!isGoogleReady && (
                                        <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
                                            Loading Google Maps...
                                        </div>
                                    )} */}
                                    {!isGoogleReady && (
                                        <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
                                            ⏳ Loading address search, please wait...
                                        </div>
                                    )}
                                    {isGoogleReady && !ready && (
                                        <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
                                            ⏳ Initializing search...
                                        </div>
                                    )}
                                    {showPropertyList && status === "ZERO_RESULTS" && (
                                        <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
                                            No results found. Try a different search or enter manually.
                                        </div>
                                    )}
                                </div>

                                {/* Manual Address Form with Dynamic Map */}
                                {showManual && (
                                    <div className='mb-3'>
                                        <p style={{ fontWeight: "500", marginBottom: "12px" }}>Please fill in the missing details</p>

                                        {/* ─── FIX 5: key prop added to force remount on coordinate change ─── */}
                                        <DynamicMap
                                            key={`${step1Data.lat}-${step1Data.lng}`}
                                            lat={step1Data.lat}
                                            lng={step1Data.lng}
                                            address={step1Data.propertyAddress}
                                            onPinDrag={({ lat, lng, address }) => {
                                                setStep1Data(prev => ({
                                                    ...prev,
                                                    lat,
                                                    lng,
                                                    propertyAddress: address || prev.propertyAddress,
                                                }));
                                            }}
                                        />

                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className='form-group mb-4'>
                                                    <label>Street and number <span style={{ color: '#f00' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        name="streetNumber"
                                                        className={`form-control ${errors.streetNumber ? 'is-invalid' : ''}`}
                                                        value={step1Data.streetNumber || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter street address"
                                                    />
                                                    {errors.streetNumber && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.streetNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className='form-group mb-4'>
                                                    <label>Flat/House No.</label>
                                                    <input
                                                        type="text"
                                                        name="flatNo"
                                                        className="form-control"
                                                        value={step1Data.flatNo || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Flat/House number"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className='form-group mb-4'>
                                                    <label>City <span style={{ color: '#f00' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                                        value={step1Data.city || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter city"
                                                    />
                                                    {errors.city && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.city}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className='form-group mb-4'>
                                                    <label>State <span style={{ color: '#f00' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                        value={step1Data.state || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter state"
                                                    />
                                                    {errors.state && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.state}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className='form-group mb-4'>
                                                    <label>Country <span style={{ color: '#f00' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        name="country"
                                                        className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                                        value={step1Data.country || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter country"
                                                    />
                                                    {errors.country && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.country}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className='form-group mb-4'>
                                                    <label>PIN Code <span style={{ color: '#f00' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        name="pinCode"
                                                        className={`form-control pincode-flag ${errors.pinCode ? 'is-invalid' : ''}`}
                                                        value={step1Data.pinCode || ''}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter PIN code"
                                                    />
                                                    {errors.pinCode && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.pinCode}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <p className='subheadline-2 mb-1'>Address Help</p>
                                        <div className='form-group mb-4'>
                                            {/* <label>Give Step by Step Direction to Guest For Reach Property Smoothly</label> */}
                                            <label>Give step-by-step directions to help guests reach the property smoothly</label>
                                            <textarea
                                                name='addressHelp'
                                                className='form-control'
                                                placeholder="Provide directions, landmarks, or special instructions for guests..."
                                                value={step1Data.addressHelp || ''}
                                                onChange={handleInputChange}
                                                rows={3}
                                            />
                                        </div>

                                        <hr style={{ margin: "50px 0" }} />
                                    </div>
                                )}
                            </div>

                            {/* Property Manager Section */}
                            <div className="property-list-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="subheadline-2 mb-3">Property manager details <span style={{ color: '#f00' }}>*</span></p>
                                    <Image
                                        src="./images/icons/add_circle.svg"
                                        className="img-fluid mb-3"
                                        alt="add"
                                        width={24}
                                        height={24}
                                        onClick={handleAddManager}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>

                                {errors.managers && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.managers}
                                    </div>
                                )}

                                {managers.map((managerItem) => (
                                    <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
                                        {!managerItem.data ? (
                                            <>
                                                <div className='d-flex justify-content-between align-items-center gap-2'>
                                                    <input
                                                        type="text"
                                                        className="form-control user-icn2"
                                                        placeholder="Add property manager"
                                                        onFocus={() => setShowManagerList(managerItem.id)}
                                                        onBlur={() => setTimeout(() => setShowManagerList(null), 200)}
                                                        onChange={(e) => setSearchMgr(e.target.value)}
                                                        style={{ backgroundImage: 'url("./images/icons/user.svg")', backgroundRepeat: 'no-repeat', backgroundPosition: '12px center', backgroundSize: '20px', paddingLeft: '40px' }}
                                                    />
                                                    {managers.length > 1 && (
                                                        <Image
                                                            src="./images/icons/delete_b.svg"
                                                            className="img-fluid"
                                                            alt="remove"
                                                            width={24}
                                                            height={24}
                                                            onClick={() => handleManagerRemove(managerItem.id)}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    )}
                                                </div>

                                                {showManagerList === managerItem.id && (
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: "100%",
                                                            left: 0,
                                                            right: 0,
                                                            background: "#f9f6f4",
                                                            border: "1px solid #6B4F3F",
                                                            borderRadius: "0px",
                                                            zIndex: 10,
                                                            padding: "16px",
                                                            maxHeight: "300px",
                                                            overflowY: "auto"
                                                        }}
                                                    >



                                                        {managerList
                                                            .filter(manager =>
                                                                !managers.some(m => m.id !== managerItem.id && m.data?.uid === manager.uid)
                                                            )
                                                            .map((manager, idx, arr) => (
                                                                <div
                                                                    key={manager.uid}
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        marginBottom: "18px",
                                                                        borderBottom: idx < arr.length - 1 ? "1px solid #ececec" : "none",
                                                                        paddingBottom: "15px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() => handleManagerSelect(managerItem.id, manager)}
                                                                >
                                                                    <Image
                                                                        src={manager.profile_image ? manager.profile_image : '/images/icons/No-Image.svg'}
                                                                        alt={manager.first_name}
                                                                        style={{
                                                                            width: "48px",
                                                                            height: "48px",
                                                                            borderRadius: "0px",
                                                                            objectFit: "cover",
                                                                            marginRight: "16px",
                                                                        }}
                                                                        onError={(e) => {
                                                                            e.target.src = "./images/icons/manager-img.jpg";
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                            {manager.first_name} {manager.last_name}
                                                                        </div>
                                                                        <div style={{ fontSize: "14px", color: "#73615F" }}>
                                                                            {manager.email}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    background: "#f9f6f4",
                                                    border: "1px solid rgb(128 99 75 / 24%)",
                                                    borderRadius: "0px",
                                                    padding: "12px 16px",
                                                    marginBottom: "8px",
                                                    marginTop: "15px",
                                                }}
                                            >
                                                <Image
                                                    src={getImageUrl(managerItem.data.profile_image)}
                                                    alt={managerItem.data.first_name}
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "0px",
                                                        objectFit: "cover",
                                                        marginRight: "16px",
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        const fallbackUrl = e.currentTarget.src.replace(
                                                            "http://localhost:3000",
                                                            process.env.NEXT_PUBLIC_API_URL
                                                        );
                                                        e.currentTarget.src = fallbackUrl;
                                                    }}
                                                />
                                                <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
                                                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                        {managerItem.data.first_name} {managerItem.data.last_name} {managerItem?.data?.name ? managerItem?.data?.name : ''}
                                                    </span>
                                                    <span style={{ color: "#73615F" }}>|</span>
                                                    <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px" }}>
                                                        <Image src="./images/icons/call.svg" alt="call" width={18} height={18} style={{ marginRight: '4px' }} />
                                                        {managerItem.data.phone_number}
                                                    </span>
                                                    <span style={{ color: "#73615F" }}>|</span>
                                                    <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px" }}>
                                                        <Image src="./images/icons/email.svg" alt="email" width={18} height={18} style={{ marginRight: '4px' }} />
                                                        {managerItem.data.email}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className='ms-auto'
                                                    onClick={() => handleManagerRemove(managerItem.id)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "#6B4F3F",
                                                        fontSize: "20px",
                                                        marginLeft: "12px",
                                                        cursor: "pointer",
                                                    }}
                                                    title="Remove"
                                                >
                                                    <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <hr style={{ margin: "50px 0" }} />
                            </div>

                            {/* Property Caretaker Section */}
                            <div className='property-list-2'>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="subheadline-2 mb-3">Property Caretaker details <span style={{ color: '#f00' }}>*</span></p>
                                    <Image
                                        src="./images/icons/add_circle.svg"
                                        className="img-fluid mb-3"
                                        alt="add"
                                        width={24}
                                        height={24}
                                        onClick={handleAddCaretaker}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>

                                {errors.caretakers && (
                                    <div className="alert alert-danger" role="alert">
                                        {errors.caretakers}
                                    </div>
                                )}

                                {caretakers.map((caretakerItem) => (
                                    <div key={caretakerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
                                        {!caretakerItem.data ? (
                                            <>
                                                <div className='d-flex justify-content-between align-items-center gap-2'>
                                                    <input
                                                        type="text"
                                                        className="form-control user-icn2"
                                                        placeholder="Add property caretaker"
                                                        onFocus={() => setShowCaretakerList(caretakerItem.id)}
                                                        onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
                                                        onChange={(e) => setSearchCaretacker(e.target.value)}
                                                        style={{ backgroundImage: 'url("./images/icons/user.svg")', backgroundRepeat: 'no-repeat', backgroundPosition: '12px center', backgroundSize: '20px', paddingLeft: '40px' }}
                                                    />

                                                    {caretakers.length > 1 && (
                                                        <Image
                                                            src="./images/icons/delete_b.svg"
                                                            className="img-fluid"
                                                            alt="remove"
                                                            width={24}
                                                            height={24}
                                                            onClick={() => handleCaretakerRemove(caretakerItem.id)}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    )}
                                                </div>

                                                {showCaretakerList === caretakerItem.id && (
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: "100%",
                                                            left: 0,
                                                            right: 0,
                                                            background: "#f9f6f4",
                                                            border: "1px solid #6B4F3F",
                                                            borderRadius: "0px",
                                                            zIndex: 10,
                                                            padding: "16px",
                                                            maxHeight: "300px",
                                                            overflowY: "auto"
                                                        }}
                                                    >
                                                        {caretakerList
                                                            .filter(caretaker =>
                                                                !caretakers.some(c => c.id !== caretakerItem.id && c.data?.uid === caretaker.uid)
                                                            )
                                                            .map((caretaker, idx, arr) => (
                                                                <div
                                                                    key={caretaker.uid}
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        marginBottom: "18px",
                                                                        borderBottom: idx < arr.length - 1 ? "1px solid #ececec" : "none",
                                                                        paddingBottom: "15px",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() => handleCaretakerSelect(caretakerItem.id, caretaker)}
                                                                >
                                                                    <Image
                                                                        src={caretaker.profile_image ? caretaker.profile_image : '/images/icons/No-Image.svg'}
                                                                        alt={caretaker.first_name}
                                                                        width={48}
                                                                        height={48}
                                                                        style={{
                                                                            borderRadius: "0px",
                                                                            objectFit: "cover",
                                                                            marginRight: "16px",
                                                                        }}
                                                                        onError={(e) => {
                                                                            e.target.src = "./images/icons/caretaker-img.jpg";
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                            {caretaker.first_name} {caretaker.last_name}{" "}
                                                                            {caretaker.you && (
                                                                                <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
                                                                                    (You)
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    background: "#f9f6f4",
                                                    border: "1px solid rgb(128 99 75 / 24%)",
                                                    borderRadius: "0px",
                                                    padding: "12px 16px",
                                                    marginBottom: "8px",
                                                    marginTop: "15px",
                                                }}
                                            >
                                                <Image
                                                    src={getImageUrl(caretakerItem.data.profile_image)}
                                                    alt={caretakerItem.data.first_name}
                                                    width={48}
                                                    height={48}
                                                    style={{
                                                        borderRadius: "0px",
                                                        objectFit: "cover",
                                                        marginRight: "16px",
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        const fallbackUrl = e.currentTarget.src.replace(
                                                            "http://localhost:3000",
                                                            process.env.NEXT_PUBLIC_API_URL
                                                        );
                                                        e.currentTarget.src = fallbackUrl;
                                                    }}
                                                />

                                                <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
                                                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                        {caretakerItem.data.first_name} {caretakerItem.data.last_name} {caretakerItem?.data?.name ? caretakerItem?.data?.name : ''}
                                                        {caretakerItem.data.you && (
                                                            <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
                                                                (You)
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span style={{ color: "#73615F" }}>|</span>
                                                    <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px" }}>
                                                        <Image src="./images/icons/call.svg" alt="call" width={18} height={18} style={{ marginRight: '4px' }} />
                                                        {caretakerItem.data.phone || "8390734261"}
                                                    </span>
                                                    <span style={{ color: "#73615F" }}>|</span>
                                                    <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px" }}>
                                                        <Image src="./images/icons/email.svg" alt="email" width={18} height={18} style={{ marginRight: '4px' }} />
                                                        {caretakerItem.data.email}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    className='ms-auto'
                                                    onClick={() => handleCaretakerRemove(caretakerItem.id)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "#6B4F3F",
                                                        fontSize: "20px",
                                                        marginLeft: "12px",
                                                        cursor: "pointer",
                                                    }}
                                                    title="Remove"
                                                >
                                                    <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <hr style={{ margin: '50px 0' }}></hr>
                            </div>

                            {/* Operations Manager Contact Details */}
                            <div className='property-list-2'>
                                <div className='d-flex justify-content-between'>
                                    <p className='subheadline-2 mb-3'>Operations managers contact details</p>
                                </div>

                                <div className='form-group mb-4'>
                                    {/* <label>Name of the person who should contacted in case of emergency <span style={{ color: '#f00' }}>*</span></label> */}
                                    <label>Name of the person who should be contacted in case of emergency <span style={{ color: '#f00' }}>*</span></label>
                                    <input
                                        type='text'
                                        name="operationsManagerName"
                                        className={`form-control ${errors.operationsManagerName ? 'is-invalid' : ''}`}
                                        placeholder='Enter name e.x. Priya Sharma'
                                        value={step1Data.operationsManagerName || ''}
                                        onChange={handleInputChange}
                                    />
                                    {errors.operationsManagerName && (
                                        <div className="invalid-feedback d-block">
                                            {errors.operationsManagerName}
                                        </div>
                                    )}
                                </div>

                                <div className='form-group mb-4'>
                                    <label>{`Contact person's email`} <span style={{ color: '#f00' }}>*</span></label>
                                    <input
                                        type='email'
                                        name="operationsManagerEmail"
                                        className={`form-control ${errors.operationsManagerEmail ? 'is-invalid' : ''}`}
                                        placeholder='e.g. priyasharma@casamelhor.com'
                                        value={step1Data.operationsManagerEmail || ''}
                                        onChange={handleInputChange}
                                    />
                                    {errors.operationsManagerEmail && (
                                        <div className="invalid-feedback d-block">
                                            {errors.operationsManagerEmail}
                                        </div>
                                    )}
                                </div>

                                <div className='form-group mb-4'>
                                    <label>{`Contact person's phone number`} <span style={{ color: '#f00' }}>*</span></label>
                                    <input
                                        type='tel'
                                        maxLength={10}
                                        name="operationsManagerPhone"
                                        className={`form-control ${errors.operationsManagerPhone ? 'is-invalid' : ''}`}
                                        // placeholder='e.x. +91 5534545278'
                                        placeholder='e.g. 9876543210'
                                        value={step1Data.operationsManagerPhone || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^[0-9]*$/.test(value)) {
                                                handleInputChange(e);
                                            }
                                        }}
                                    />
                                    {errors.operationsManagerPhone && (
                                        <div className="invalid-feedback d-block">
                                            {errors.operationsManagerPhone}
                                        </div>
                                    )}
                                </div>

                                <div className='form-group mb-4'>
                                    <label>Contact alternate phone number (optional)</label>
                                    <input
                                        type='tel'
                                        maxLength={10}
                                        name='operationsManagerAlternatePhone'
                                        className={`form-control ${errors.operationsManagerAlternatePhone ? 'is-invalid' : ''}`}
                                        // placeholder='e.x. +91 4323545464'
                                        placeholder='e.g. 9876543211'
                                        value={step1Data.operationsManagerAlternatePhone || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!/^[0-9]*$/.test(value)) return;
                                            handleInputChange(e);
                                            if (value && value === step1Data.operationsManagerPhone) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    operationsManagerAlternatePhone: 'Please enter a different number'
                                                }));
                                            } else {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.operationsManagerAlternatePhone;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                    />
                                    {errors.operationsManagerAlternatePhone && (
                                        <div className="invalid-feedback d-block">
                                            {errors.operationsManagerAlternatePhone}
                                        </div>
                                    )}
                                </div>

                                <div className='form-group mb-4'>
                                    <label>{`Contact person's photo`}</label>
                                    {!file && (
                                        <div
                                            className='add-upload-photo'
                                            style={{
                                                border: '2px dashed #ddd',
                                                padding: '20px',
                                                textAlign: 'center',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={changepicModal}
                                        >
                                            <Image
                                                src={"./images/icons/photo-camera.svg"}
                                                className='img-fluid mb-2'
                                                width={50}
                                                height={40}
                                                alt='add photo'
                                            />
                                            <Button
                                                variant=''
                                                className='add-photo-btn'
                                                style={{ background: 'none', border: 'none', color: '#6B4F3F' }}
                                            >
                                                {file ? 'Change Photo' : 'Add Photo'}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {file && (
                                    <div className="upload-photo mb-4">
                                        <div className="relative" style={{ position: 'relative', display: 'inline-block' }}>
                                            <Image
                                                src={file}
                                                alt="Operations manager photo"
                                                width={200}
                                                height={150}
                                                style={{
                                                    borderRadius: '8px',
                                                    width: '200px',
                                                    height: '150px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <button
                                                onClick={removeFile}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    borderRadius: '50%',
                                                    padding: '4px',
                                                    border: 'none',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                }}
                                                title="Remove photo"
                                            >
                                                <Image
                                                    src="./images/icons/delete.svg"
                                                    className='img-fluid'
                                                    width={14}
                                                    height={14}
                                                    alt='delete'
                                                    style={{ filter: 'brightness(0) invert(1)' }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    variant="success"
                                    className='complete-form-btn'
                                    style={{
                                        padding: '13px 25px',
                                        borderRadius: '0',
                                        backgroundColor: '#6B4F3F',
                                        border: 'none'
                                    }}
                                    onClick={() => handleSubmit('')}
                                    disabled={isSubmitted}
                                >
                                    {isSubmitted ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Photo Upload Modal */}
            <Modal
                show={changepicsModal}
                onHide={changepicClose}
                animation={false}
                centered
                className='custom-theme-modal'
            >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0'>
                    <Modal.Title>
                        {file ? 'Change photo' : 'Upload photo'}
                    </Modal.Title>
                    <Image
                        src='/images/icons/close-circle.svg'
                        width={24}
                        height={24}
                        alt='Close'
                        style={{ cursor: 'pointer' }}
                        onClick={changepicClose}
                    />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <p className='border-bottom pb-4'>Please upload Operations managers photo</p>
                    <div className="drap-drop-box-full">
                        <label
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                            style={{
                                borderRadius: '8px',
                                background: file ? `url(${file}) center/cover no-repeat` : 'none',
                                position: 'relative'
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-input"
                            />
                            {!file ? (
                                <div className="text-center">
                                    <Image
                                        src="/images/icons/photo-library.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                    />
                                    <p className="font-medium mb-0" style={{ color: '#463527' }}>Drag and drop</p>
                                    <p className="text-sm text-gray-500 mb-0" style={{ color: '#73615F' }}>
                                        or click here to choose file.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center" style={{ background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '4px' }}>
                                    <p className="font-medium mb-0" style={{ color: '#463527' }}>
                                        Photo selected. Click to change or drop a new one.
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>
                    {file && (
                        <div className="text-center mt-3">
                            <Button
                                variant="link"
                                onClick={removeFile}
                                style={{ color: '#dc3545', textDecoration: 'none' }}
                            >
                                Remove Photo
                            </Button>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between'>
                    <Button
                        variant=""
                        onClick={changepicClose}
                        className='btn-company-add'
                        style={{
                            padding: '13px 25px',
                            borderRadius: '0',
                            border: '1px solid #6B4F3F',
                            color: '#6B4F3F',
                            background: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant=""
                        onClick={() => handleUploadConfirm('')}
                        className='search-btn complete-form-btn'
                        style={{
                            padding: '13px 25px',
                            borderRadius: '0',
                            backgroundColor: '#6B4F3F',
                            border: 'none'
                        }}
                        disabled={!file}
                    >
                        {file ? 'Confirm Upload' : 'Upload'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}