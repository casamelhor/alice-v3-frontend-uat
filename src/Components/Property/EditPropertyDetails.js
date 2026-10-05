// "use client"
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
// import Image from 'next/image';
// import Link from 'next/link';
// import { propertStepFirstValidation } from "@/utils/validation";
// import { OperationManagerPhotoUploadAPI, UpdatePropertyDetailAPI } from "@/services/provider";
// import { useParams, useSearchParams } from "next/navigation";
// import usePlacesAutocomplete, {
//     getGeocode,
//     getLatLng,
// } from "use-places-autocomplete";
// import { alert_danger, alert_success } from "@/utils/Alerts/TostifyAlerts";
// import toast from "react-hot-toast";

// // Constants
// const GOOGLE_MAPS_ZOOM_LEVEL = 15;
// const GOOGLE_CHECK_INTERVAL = 500;
// const DEBOUNCE_DELAY = 500;
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// // Dynamic Map Component
// // const DynamicMap = ({ lat, lng, address, isLoading = false }) => {
// //     const [mapUrl, setMapUrl] = useState('');
// //     const [mapError, setMapError] = useState(false);

// //     useEffect(() => {
// //         if (lat && lng) {
// //             const dynamicUrl = `https://www.google.com/maps?q=${lat},${lng}&z=${GOOGLE_MAPS_ZOOM_LEVEL}&output=embed`;
// //             setMapUrl(dynamicUrl);
// //             setMapError(false);
// //         }
// //     }, [lat, lng, address]);

// //     if (isLoading) {
// //         return (
// //             <div style={{
// //                 width: '100%',
// //                 height: '300px',
// //                 backgroundColor: '#f5f5f5',
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 justifyContent: 'center',
// //                 borderRadius: '8px',
// //                 border: '1px dashed #ddd'
// //             }}>
// //                 <Spinner animation="border" role="status">
// //                     <span className="visually-hidden">Loading map...</span>
// //                 </Spinner>
// //             </div>
// //         );
// //     }

// //     if (!lat || !lng || mapError) {
// //         return (
// //             <div style={{
// //                 width: '100%',
// //                 height: '300px',
// //                 backgroundColor: '#f5f5f5',
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 justifyContent: 'center',
// //                 borderRadius: '8px',
// //                 border: '1px dashed #ddd',
// //                 flexDirection: 'column'
// //             }}>
// //                 <div style={{ textAlign: 'center', color: '#666' }}>
// //                     <Image
// //                         src='/images/icons/map-placeholder.svg'
// //                         alt="Map placeholder"
// //                         width={50}
// //                         height={50}
// //                     />
// //                     <p className="mt-2 mb-0">Map location not available</p>
// //                     {mapError && (
// //                         <p className="text-danger small mt-1">
// //                             Failed to load map. Please check coordinates.
// //                         </p>
// //                     )}
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div style={{ marginBottom: '20px' }}>
// //             <div style={{ marginBottom: '15px' }}>
// //                 <Link
// //                     href={mapUrl}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     style={{
// //                         color: '#6B4F3F',
// //                         textDecoration: 'none',
// //                         fontSize: '14px',
// //                         fontWeight: '500',
// //                         wordBreak: 'break-all'
// //                     }}
// //                 >
// //                     📍 View on Google Maps
// //                 </Link>
// //             </div>

// //             <div style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
// //                 <iframe
// //                     src={mapUrl}
// //                     width="100%"
// //                     height="100%"
// //                     style={{ border: '1px solid #ddd', borderRadius: '8px' }}
// //                     allowFullScreen
// //                     loading="lazy"
// //                     referrerPolicy="no-referrer-when-downgrade"
// //                     title="Property Location Map"
// //                     onError={() => setMapError(true)}
// //                 />
// //             </div>
// //         </div>
// //     );
// // };
// const DynamicMap = ({ lat, lng, address }) => {
//     const [mapUrl, setMapUrl] = useState('');

//     useEffect(() => {
//         if (lat && lng) {
//             // Dynamic Google Maps URL
//             const dynamicUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
//             setMapUrl(dynamicUrl);
//         }
//     }, [lat, lng, address]);

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
//                 <div style={{ textAlign: 'center', color: '#666' }}>
//                     {/* Map placeholder content */}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={{ marginBottom: '20px' }}>
//             {/* Dynamic Map Link */}
//             <div style={{ marginBottom: '15px' }}>
//                 <Link
//                     href={mapUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                         color: '#6B4F3F',
//                         textDecoration: 'none',
//                         fontSize: '14px',
//                         fontWeight: '500'
//                     }}
//                 >
//                     📍 {mapUrl}
//                 </Link>
//             </div>

//             {/* Embedded Map */}
//             <div style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
//                 <iframe
//                     src={mapUrl}
//                     width="100%"
//                     height="100%"
//                     style={{ border: '1px solid #ddd', borderRadius: '8px' }}
//                     allowFullScreen
//                     loading="lazy"
//                     referrerPolicy="no-referrer-when-downgrade"
//                     title="Property Location Map"
//                 />
//             </div>
//         </div>
//     );
// };

// // Debounce hook
// // const useDebounce = (callback, delay) => {
// //     const timerRef = useRef(null);

// //     return useCallback((...args) => {
// //         if (timerRef.current) {
// //             clearTimeout(timerRef.current);
// //         }
// //         timerRef.current = setTimeout(() => {
// //             callback(...args);
// //         }, delay);
// //     }, [callback, delay]);
// // };

// export default function EditPropertyDetails({
//     setIsEditManage,
//     formData,
//     setFormData,
//     file,
//     setFile,
//     selectedAmenities,
//     setSelectedAmenities,
//     selectedAmenities2,
//     setSelectedAmenities2,
//     propertyRole,
//     getPropertyDetail
// }) {
//     // const param = useParams();
//     // const id = param.id;

//     const searchParams = useSearchParams();
//     const BASE_URL = "https://alicedevapi.casamelhor.in";

//     // const [id, setId] = useState()
//     // useEffect(() => {
//     //     const stateParam = searchParams.get('state');
//     //     if (stateParam) {
//     //         const state = JSON.parse(decodeURIComponent(stateParam));
//     //         setId(state.id)
//     //     }
//     // }, [searchParams]);

//     // const searchParams = useSearchParams();
//     const id = searchParams.get("uid"); // direct uid



//     const [changepicsModal, changepisetShow] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [googleInitError, setGoogleInitError] = useState(false);
//     const [addressSearchLoading, setAddressSearchLoading] = useState(false);
//     const [saveLoading, setSaveLoading] = useState(false);

//     const changepicClose = () => changepisetShow(false);
//     const changepicModal = () => changepisetShow(true);

//     // State variables
//     const [showPropertyList, setShowPropertyList] = useState(false);
//     const [showManual, setShowManual] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [isOpen, setIsOpen] = useState(false);
//     const [isGoogleReady, setIsGoogleReady] = useState(false);
//     const [googleMapsUrl, setGoogleMapsUrl] = useState('');

//     const togglePicOption = () => {
//         setIsOpen((prev) => !prev);
//     };

//     const handleOptionClick = () => {
//         setIsOpen(false);
//     };

//     // Check Google Maps readiness with improved error handling
//     // useEffect(() => {
//     //     const checkGoogleReady = () => {
//     //         try {
//     //             if (window.google && window.google.maps && window.google.maps.places) {
//     //                 setIsGoogleReady(true);
//     //                 setGoogleInitError(false);
//     //                 return true;
//     //             }
//     //             return false;
//     //         } catch (error) {
//     //             console.error('Google Maps initialization error:', error);
//     //             setGoogleInitError(true);
//     //             return false;
//     //         }
//     //     };

//     //     if (!checkGoogleReady()) {
//     //         const interval = setInterval(() => {
//     //             if (checkGoogleReady()) {
//     //                 clearInterval(interval);
//     //             }
//     //         }, GOOGLE_CHECK_INTERVAL);

//     //         return () => clearInterval(interval);
//     //     }
//     // }, []);

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

//     // // Generate Google Maps URL when coordinates change
//     // useEffect(() => {
//     //     if (formData.lat && formData.lng) {
//     //         const url = `https://www.google.com/maps?q=${formData.lat},${formData.lng}&z=${GOOGLE_MAPS_ZOOM_LEVEL}&output=embed`;
//     //         setGoogleMapsUrl(url);
//     //     }
//     // }, [formData.lat, formData.lng]);

//     useEffect(() => {
//         if (formData.lat && formData.lng) {
//             const url = `https://www.google.com/maps?q=${formData.lat},${formData.lng}&z=15&output=embed`;
//             setGoogleMapsUrl(url);
//         }
//     }, [formData.lat, formData.lng]);

//     // Google Places Autocomplete with debouncing
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

//     // Handle location selection with loading state
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
//             setFormData(prev => ({
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

//     // Handle manual address entry
//     const handleManualEntry = () => {
//         setShowManual(true);
//         setShowPropertyList(false);
//     };

//     // Debounced address input change
//     // const debouncedAddressChange = useDebounce((value) => {
//     //     setValue(value);
//     //     setFormData(prev => ({
//     //         ...prev,
//     //         propertyAddress: value
//     //     }));
//     //     setShowPropertyList(true);
//     // }, 300);

//     const handleAddressInputChange = (e) => {
//         // const value = e.target.value;
//         // debouncedAddressChange(value);
//         const value = e.target.value;
//         setValue(value);
//         setFormData(prev => ({
//             ...prev,
//             propertyAddress: value
//         }));
//         setShowPropertyList(true);
//     };

//     // File upload handlers
//     const handleFileChange = (e) => {
//         const uploadedFile = e.target.files[0];
//         if (uploadedFile) {
//             if (uploadedFile.size > MAX_FILE_SIZE) {
//                 alert('File size should be less than 5MB');
//                 return;
//             }
//             const objectUrl = URL.createObjectURL(uploadedFile);
//             setFile(objectUrl);
//             setFormData({
//                 ...formData,
//                 operationManagerPhoto: uploadedFile
//             });
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         const uploadedFile = e.dataTransfer.files[0];
//         if (uploadedFile) {
//             if (uploadedFile.size > MAX_FILE_SIZE) {
//                 alert('File size should be less than 5MB');
//                 return;
//             }
//             const objectUrl = URL.createObjectURL(uploadedFile);
//             setFile(objectUrl);
//         }
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//     };

//     const removeFile = () => {
//         if (file && file.startsWith('blob:')) {
//             URL.revokeObjectURL(file);
//         }
//         setFile(null);
//         setFormData({
//             ...formData,
//             operationManagerPhoto: null
//         });
//     };

//     // Guest count handler
//     const handleGuestChange = (delta) => {
//         const newCount = Math.max(1, (formData?.guestCapacity || 1) + delta);
//         setFormData({
//             ...formData,
//             guestCapacity: newCount
//         });
//     };

//     // Input change handler
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         let newData = { [name]: value };
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//         const { error } = propertStepFirstValidation(newData, showManual);
//         setErrors({
//             ...errors,
//             ...error
//         });
//     };

//     // Manager and caretaker state
//     const [managers, setManagers] = useState([{ id: Date.now(), data: null }]);
//     const [caretakers, setCaretakers] = useState([{ id: Date.now(), data: null }]);
//     const [showManagerList, setShowManagerList] = useState(null);
//     const [showCaretakerList, setShowCaretakerList] = useState(null);

//     // Initialize managers and caretakers from formData
//     useEffect(() => {
//         if (formData?.property_caretakers) {
//             const caretakersWithIds = formData.property_caretakers.map((obj, index) => ({
//                 id: `${Date.now()}-${index}`,
//                 data: obj
//             }));
//             setCaretakers(caretakersWithIds);
//         }
//     }, [formData?.property_caretakers]);

//     useEffect(() => {
//         if (formData?.property_managers) {
//             const managersWithIds = formData.property_managers.map((obj, index) => ({
//                 id: `${Date.now()}-${index}`,
//                 data: obj
//             }));
//             setManagers(managersWithIds);
//         }
//     }, [formData?.property_managers]);

//     // Manager handlers
//     const handleManagerSelect = (id, manager) => {
//         setManagers((prev) =>
//             prev.map((m) => (m.id === id ? { ...m, data: manager } : m))
//         );
//         setShowManagerList(null);
//     };

//     const handleManagerRemove = (id) => {
//         setManagers((prev) => prev.filter((m) => m.id !== id));
//     };

//     const handleAddManager = () => {
//         setManagers([...managers, { id: Date.now(), data: null }]);
//     };

//     // Caretaker handlers
//     const handleCaretakerSelect = (id, caretaker) => {
//         setCaretakers((prev) =>
//             prev.map((c) => (c.id === id ? { ...c, data: caretaker } : c))
//         );
//         setShowCaretakerList(null);
//     };

//     const handleCaretakerRemove = (id) => {
//         setCaretakers((prev) => prev.filter((c) => c.id !== id));
//     };

//     const handleAddCaretaker = () => {
//         setCaretakers([...caretakers, { id: Date.now(), data: null }]);
//     };

//     // Amenities state
//     const [amenitySearch, setAmenitySearch] = useState('');
//     const [showAmenitySearch, setShowAmenitySearch] = useState(false);
//     const [amenitySearch2, setAmenitySearch2] = useState('');
//     const [showAmenitySearch2, setShowAmenitySearch2] = useState(false);

//     // Amenities data
//     const amenities = [
//         { icon: "/images/icons/amenities-icon/Air-Conditioning.svg", label: "Air Conditioning" },
//         { icon: "/images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
//         { icon: "/images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
//         { icon: "/images/icons/amenities-icon/Serves-Breakfast.svg", label: "Serves Breakfast" },
//         { icon: "/images/icons/amenities-icon/Serves-Lunch.svg", label: "Serves Lunch" },
//         { icon: "/images/icons/amenities-icon/Serves-Dinner.svg", label: "Serves Dinner" },
//         { icon: "/images/icons/amenities-icon/BuzzerWireless.svg", label: "Buzzer/Wireless" },
//         { icon: "/images/icons/amenities-icon/intercom.svg", label: "Intercom" },
//         { icon: "/images/icons/amenities-icon/elevator-building.svg", label: "Elevator in Building" },
//         { icon: "/images/icons/amenities-icon/parking.svg", label: "Parking" },
//         { icon: "/images/icons/amenities-icon/laundry.svg", label: "Laundry" },
//         { icon: "/images/icons/amenities-icon/Access-to-kitchen.svg", label: "Access to Kitchen" },
//         { icon: "/images/icons/amenities-icon/Swimming-pool.svg", label: "Swimming Pool" },
//         { icon: "/images/icons/amenities-icon/gym.svg", label: "Gym" },
//     ];

//     const amenities2 = [
//         { icon: "/images/icons/amenities-icon/Air-Conditioning.svg", label: "Air Conditioning" },
//         { icon: "/images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
//         { icon: "/images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
//         { icon: "/images/icons/amenities-icon/heating.svg", label: "Heating" },
//         { icon: "/images/icons/amenities-icon/test.svg", label: "Test" },
//         { icon: "/images/icons/amenities-icon/Workspace.svg", label: "Workspace" },
//         { icon: "/images/icons/amenities-icon/Ensuite-Bathroom.svg", label: "Ensuite Bathroom" },
//         { icon: "/images/icons/amenities-icon/Desk.svg", label: "Desk" },
//         { icon: "/images/icons/amenities-icon/Wardrobe-Hangers.svg", label: "Wardrobe & Hangers" },
//         { icon: "/images/icons/amenities-icon/family-kid-friends.svg", label: "Family/Kid Friendly" },
//         { icon: "/images/icons/amenities-icon/Fire-Extinguisher.svg", label: "Fire Extinguisher" },
//         { icon: "/images/icons/amenities-icon/Frist-Aid-Kit.svg", label: "First Aid Kit" },
//         { icon: "/images/icons/amenities-icon/Emergency-Escape.svg", label: "Emergency Escape" },
//         { icon: "/images/icons/amenities-icon/CCTV.svg", label: "CCTV" },
//         { icon: "/images/icons/amenities-icon/Bathing-kit.svg", label: "Bathing Kit" },
//         { icon: "/images/icons/amenities-icon/Smoking-area.svg", label: "Smoking Allowed in" },
//         { icon: "/images/icons/amenities-icon/Open-Area.svg", label: "Open Area" },
//         { icon: "/images/icons/amenities-icon/Iron-on-request.svg", label: "Iron On Request" },
//     ];

//     // Filtered amenities
//     const filteredAmenities = amenities.filter(a =>
//         a.label.toLowerCase()?.includes(amenitySearch.toLowerCase())
//     );

//     const filteredAmenities2 = amenities2.filter(a =>
//         a.label.toLowerCase()?.includes(amenitySearch2.toLowerCase())
//     );

//     // Amenity selection handlers
//     const handleAmenitySelect = (label) => {
//         setSelectedAmenities((prev) =>
//             prev?.includes(label)
//                 ? prev.filter((l) => l !== label)
//                 : [...prev, label]
//         );
//     };

//     const handleAmenitySelect2 = (label) => {
//         setSelectedAmenities2((prev) =>
//             prev?.includes(label)
//                 ? prev.filter((l) => l !== label)
//                 : [...prev, label]
//         );
//     };

//     // Manager and caretaker lists
//     const managerList = propertyRole?.properyManager || [
//         {
//             name: "Shub Leena",
//             email: "Shubancasamelhor@gmail.com",
//             img: "/images/icons/manager-img.jpg",
//             you: true,
//             phone: "9876543210",
//         },
//         {
//             name: "Jenny Shaikh",
//             email: "pradeep@casamelhor.in",
//             img: "/images/icons/manager-img.jpg",
//             phone: "8765432109",
//         },
//         {
//             name: "Rahman",
//             email: "slb.residences@casamelhor.in",
//             img: "/images/icons/manager-img.jpg",
//             phone: "9876543210",
//         }
//     ];

//     const CaretakerList = propertyRole?.propertyCaretacer || [
//         { name: "Shub Leena", email: "Shubancasamelhor@gmail.com", img: "/images/icons/caretaker-img.jpg", you: true },
//         { name: "Jenny Shaikh", email: "pradeep@casamelhor.in", img: "/images/icons/caretaker-img.jpg" },
//         { name: "Rahman", email: "slb.residences@casamelhor.in", img: "/images/icons/caretaker-img.jpg" },
//     ];

//     // API functions
//     const uploadOperationManagerImage = async () => {
//         try {
//             if (!formData.operationManagerPhoto) {
//                 alert('Please select a photo first');
//                 return;
//             }

//             const fieldData = new FormData();
//             fieldData.append("ops_manager_photo_url", formData.operationManagerPhoto);
//             const response = await OperationManagerPhotoUploadAPI(id, fieldData);

//             if (response?.data?.success) {
//                 changepicClose();
//                 alert('Photo uploaded successfully');
//             } else {
//                 alert('Failed to upload photo');
//             }
//         } catch (error) {
//             console.log(error);
//             alert('Error uploading photo');
//         }
//     };

//     const handleUpload = async () => {
//         try {
//             if (!id) {
//                 toast.error("Property UID not found");
//                 return;
//             }
//             setSaveLoading(true);

//             // Prepare manager and caretaker IDs
//             const pm = managers
//                 .filter(manager => manager.data !== null)
//                 .map(manager => manager.data.uid);

//             const cm = caretakers
//                 .filter(caretaker => caretaker.data !== null)
//                 .map(caretaker => caretaker.data.uid);

//             // Prepare data for API
//             const rawData = {
//                 property_name: formData.propertyName || '',
//                 address_search_text: formData.propertyAddress || '',
//                 street_number: formData.streetNumber || '',
//                 flat_house_no: formData.flatNo || '',
//                 city: formData.city || '',
//                 state: formData.state || '',
//                 country: formData.country || '',
//                 pin_code: formData.pinCode || '',
//                 latitude: formData.lat || '',
//                 longitude: formData.lng || '',
//                 nearest_airport: formData.addressHelp || '',

//                 ops_manager_name: formData.operationsManagerName || '',
//                 ops_manager_email: formData.operationsManagerEmail || '',
//                 ops_manager_phone: formData.operationsManagerPhone || '',
//                 ops_manager_phone_alt: formData.operationsManagerAlternatePhone || '',

//                 max_capacity: formData.guestCapacity || 1,
//                 property_description: formData.brDescription || '',
//                 property_amenities: selectedAmenities ? selectedAmenities : [],
//                 key_features: selectedAmenities2 ? selectedAmenities2 : [],

//                 gst_number: formData?.gst_number || '',
//                 pan_number: formData?.pan_number || '',

//                 property_manager_ids: pm,
//                 property_caretaker_ids: cm
//             };

//             // Validate required fields
//             if (!rawData.property_name || !rawData.address_search_text) {
//                 alert('Please fill in all required fields');
//                 return;
//             }

//             const response = await UpdatePropertyDetailAPI(id, rawData);

//             if (response?.data?.success) {
//                 setIsEditManage(false);
//                 getPropertyDetail()
//                 toast.success('Property details updated successfully');
//             } else {
//                 toast.error('Failed to update property details');
//             }
//         } catch (error) {
//             console.error('Update error:', error);
//             alert('Error updating property details');
//         } finally {
//             setSaveLoading(false);
//         }
//     };

//     return (
//         <>
//             <Row>
//                 <Col md={6} className="relative active-box-fadein">
//                     <div className='d-flex align-items-start justify-content-between mb-5'>
//                         <div className='general-info'>
//                             <h2 className='page-title'>General information</h2>
//                             <p className='mb-0'>Change or edit all company related general information from here</p>
//                         </div>
//                         <Button
//                             variant=""
//                             className='edit-btn'
//                             style={{ padding: '13px 25px', borderRadius: '0' }}
//                             onClick={() => setIsEditManage(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Link
//                             href=""
//                             className='Save-company-btn'
//                             style={{ textDecoration: 'none' }}
//                             onClick={(e) => {
//                                 e.preventDefault();
//                                 handleUpload();
//                             }}
//                         >
//                             Done
//                         </Link>
//                     </div>

//                     {/* Property Level Information */}
//                     <div className='comapny-information-box'>
//                         <h4 className='mb-4'>Property level information</h4>

//                         <p style={{ paddingBottom: '10px' }}>
//                             <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Name</span>
//                             <br />
//                             <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
//                                 Short titles work best. Have fun with it – you can always change it later.
//                             </span>
//                         </p>

//                         <div className='form-group mb-3'>
//                             <label>Property Name</label>
//                             <input
//                                 type='text'
//                                 name="propertyName"
//                                 value={formData?.propertyName || ''}
//                                 onChange={handleInputChange}
//                                 className='form-control'
//                                 placeholder='e.g. Casa Melhor'
//                             />
//                         </div>

//                         <hr />

//                         <div className='form-group mb-3'>
//                             <p className="mb-0" style={{ paddingBottom: '10px' }}>
//                                 <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>
//                                     {`What's the maximum guest capacity for booking this BR?`}
//                                 </span>
//                             </p>

//                             <div className='form-group mt-2 mb-4'>
//                                 <label>Guests (Adults)</label>
//                                 <div className='form-group'>
//                                     <div
//                                         style={{
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "space-between",
//                                             border: "2px solid #d3ccc5",
//                                             borderRadius: "2px",
//                                             background: "#f2f2f2",
//                                             padding: "13px 0",
//                                             width: "100%",
//                                             maxWidth: "228px",
//                                             fontSize: "14px",
//                                             marginTop: "8px"
//                                         }}
//                                     >
//                                         <button
//                                             type="button"
//                                             onClick={() => handleGuestChange(-1)}
//                                             style={{
//                                                 background: "none",
//                                                 border: "none",
//                                                 textAlign: 'center',
//                                                 width: "20%",
//                                                 cursor: (formData?.guestCapacity || 1) > 1 ? "pointer" : "not-allowed"
//                                             }}
//                                             disabled={(formData?.guestCapacity || 1) === 1}
//                                         >
//                                             <Image src='/images/icons/minus.svg' className='img-fluid ms-auto me-auto' alt='minus' width={20} height={20} />
//                                         </button>
//                                         <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>
//                                             {formData?.guestCapacity || 1}
//                                         </span>
//                                         <button
//                                             type="button"
//                                             onClick={() => handleGuestChange(1)}
//                                             style={{
//                                                 background: "none",
//                                                 border: "none",
//                                                 color: "#463527",
//                                                 width: "20%",
//                                                 cursor: "pointer",
//                                                 textAlign: 'center'
//                                             }}
//                                         >
//                                             <Image src='/images/icons/Plus.svg' className='img-fluid ms-auto me-auto' alt='plus' width={20} height={20} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                             <hr />
//                         </div>

//                         <div className='form-group mb-3'>
//                             <p className="mb-0" style={{ paddingBottom: '10px' }}>
//                                 <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>
//                                     What makes this BR ideal for corporate booking?
//                                 </span>
//                             </p>

//                             <label>Share what makes your place special.</label>

//                             <textarea
//                                 name="brDescription"
//                                 className='form-control mb-3'
//                                 value={formData?.brDescription || ''}
//                                 onChange={handleInputChange}
//                                 rows={6}
//                                 placeholder='e.g. Mountain views, dedicated meeting spaces, and customizable meal options'
//                                 maxLength={1500}
//                             />
//                             <span className='text-count mt-2'>
//                                 {(formData?.brDescription?.length || 0)}/1500
//                             </span>
//                             <hr />
//                         </div>
//                     </div>

//                     {/* Property Location with Improved Google Search */}
//                     <div className='property-list-2 position-relative'>
//                         <p className='subheadline-2 mb-3'>BR Address search <span style={{ color: '#f00' }}>*</span></p>
//                         <p className='mb-2'>{`Where's your property located?`}</p>

//                         {googleInitError && (
//                             <div className="alert alert-warning mb-3">
//                                 <strong>Google Maps Error:</strong> Please ensure Google Maps API is properly configured.
//                             </div>
//                         )}

//                         <div className="form-group mb-4" style={{ position: "relative" }}>
//                             <input
//                                 type="text"
//                                 name="propertyAddress"
//                                 className={`form-control ${errors.propertyAddress ? 'is-invalid' : ''}`}
//                                 placeholder="Search Property Address"
//                                 value={formData?.propertyAddress || value}
//                                 onChange={handleAddressInputChange}
//                                 disabled={!ready}
//                                 onFocus={() => setShowPropertyList(true)}
//                                 style={{
//                                     fontSize: "14px",
//                                     padding: "12px 16px",
//                                     border: errors.propertyAddress ? "1px solid #dc3545" : "1px solid #6B4F3F",
//                                     borderRadius: "0",
//                                 }}
//                                 onBlur={() => setTimeout(() => { setShowPropertyList(false) }, 200)}
//                             />

//                             {addressSearchLoading && (
//                                 <div style={{
//                                     position: "absolute",
//                                     right: "12px",
//                                     top: "50%",
//                                     transform: "translateY(-50%)"
//                                 }}>
//                                     <Spinner animation="border" size="sm" />
//                                 </div>
//                             )}

//                             {errors.propertyAddress && (
//                                 <div className="invalid-feedback d-block">
//                                     {errors.propertyAddress}
//                                 </div>
//                             )}

//                             {/* Google Places Suggestions Dropdown */}
//                             {/* {showPropertyList && (
//                                 <div
//                                     style={{
//                                         border: "1px solid #6B4F3F",
//                                         background: "#fff",
//                                         fontSize: "14px",
//                                         color: "#463527",
//                                         marginTop: "4px",
//                                         position: "absolute",
//                                         left: 0,
//                                         right: 0,
//                                         zIndex: 10,
//                                         maxHeight: "250px",
//                                         overflowY: "auto",
//                                         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//                                     }}
//                                 >
//                                     {suggestionsLoading ? (
//                                         <div className="text-center p-3">
//                                             <Spinner animation="border" size="sm" />
//                                             <p className="mt-2 mb-0">Loading suggestions...</p>
//                                         </div>
//                                     ) : status === "OK" && data.length > 0 ? (
//                                         <>
//                                             {data.slice(0, 8).map(({ place_id, description }) => (
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
//                                         </>
//                                     ) : status === "ZERO_RESULTS" ? (
//                                         <div className="p-3 text-center">
//                                             <p className="mb-2">No results found. Try a different search or enter manually.</p>
//                                             <button
//                                                 type="button"
//                                                 style={{
//                                                     color: "#6B4F3F",
//                                                     textDecoration: "underline",
//                                                     background: "none",
//                                                     border: "none",
//                                                     cursor: "pointer"
//                                                 }}
//                                                 onClick={handleManualEntry}
//                                             >
//                                                 Enter address manually
//                                             </button>
//                                         </div>
//                                     ) : null}
//                                 </div>
//                             )} */}

//                             {/* {!isGoogleReady && !googleInitError && (
//                                 <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
//                                     Loading Google Maps...
//                                 </div>
//                             )} */}

//                             {showPropertyList && status === "OK" && data.length > 0 && (
//                                 <div
//                                     style={{
//                                         border: "1px solid #6B4F3F",
//                                         background: "#fff",
//                                         fontSize: "14px",
//                                         color: "#463527",
//                                         marginTop: "4px",
//                                         position: "absolute",
//                                         left: 0,
//                                         right: 0,
//                                         zIndex: 10,
//                                         maxHeight: "200px",
//                                         overflowY: "auto",
//                                         boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//                                     }}
//                                 >
//                                     {data.map(({ place_id, description }) => (
//                                         <div
//                                             key={place_id}
//                                             style={{
//                                                 padding: "10px 16px",
//                                                 cursor: "pointer",
//                                                 borderBottom: "1px solid #eee",
//                                                 transition: 'background-color 0.2s'
//                                             }}
//                                             onClick={() => handleSelectLocation(description)}
//                                             onMouseDown={(e) => e.preventDefault()}
//                                             onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
//                                             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                         >
//                                             {description}
//                                         </div>
//                                     ))}

//                                     <button
//                                         type="button"
//                                         style={{
//                                             color: "#6B4F3F",
//                                             textDecoration: "none",
//                                             fontWeight: "500",
//                                             fontSize: "14px",
//                                             padding: "10px 16px",
//                                             width: "100%",
//                                             textAlign: "left",
//                                             background: "none",
//                                             border: "none",
//                                             borderTop: "1px solid #eee",
//                                             cursor: "pointer"
//                                         }}
//                                         onClick={handleManualEntry}
//                                         onMouseDown={(e) => e.preventDefault()}
//                                     >
//                                         Not found? Enter address manually
//                                     </button>
//                                 </div>
//                             )}

//                             {/* Show loading or no results states */}
//                             {!isGoogleReady && (
//                                 <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
//                                     Loading Google Maps...
//                                 </div>
//                             )}
//                             {showPropertyList && status === "ZERO_RESULTS" && (
//                                 <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
//                                     No results found. Try a different search or enter manually.
//                                 </div>
//                             )}
//                         </div>

//                         {/* Manual Address Form with Dynamic Map */}

//                         <div className='mb-3'>
//                             <p style={{ fontWeight: "500", marginBottom: "12px" }}>Please fill in the missing details</p>

//                             {/* Dynamic Map Display */}
//                             <DynamicMap
//                                 lat={formData?.lat}
//                                 lng={formData?.lng}
//                                 address={formData?.propertyAddress}
//                                 isLoading={addressSearchLoading}
//                             />

//                             {/* Address Form */}
//                             <div className="row">
//                                 <div className="col-md-8">
//                                     <div className='form-group mb-4'>
//                                         <label>Street and number <span style={{ color: '#f00' }}>*</span></label>
//                                         <input
//                                             type="text"
//                                             name="streetNumber"
//                                             className={`form-control ${errors.streetNumber ? 'is-invalid' : ''}`}
//                                             value={formData?.streetNumber || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="Enter street address"
//                                         />
//                                         {errors.streetNumber && (
//                                             <div className="invalid-feedback d-block">
//                                                 {errors.streetNumber}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className='form-group mb-4'>
//                                         <label>Flat/House No.</label>
//                                         <input
//                                             type="text"
//                                             name="flatNo"
//                                             className="form-control"
//                                             value={formData?.flatNo || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="Flat/House number"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="row">
//                                 <div className="col-md-6">
//                                     <div className='form-group mb-4'>
//                                         <label>Headoffice city <span style={{ color: '#f00' }}>*</span></label>
//                                         <input
//                                             type="text"
//                                             name="city"
//                                             className={`form-control ${errors.city ? 'is-invalid' : ''}`}
//                                             value={formData?.city || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="Enter city"
//                                         />
//                                         {errors.city && (
//                                             <div className="invalid-feedback d-block">
//                                                 {errors.city}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div className='form-group mb-4'>
//                                         <label>Headoffice state <span style={{ color: '#f00' }}>*</span></label>
//                                         <input
//                                             type="text"
//                                             name="state"
//                                             className={`form-control ${errors.state ? 'is-invalid' : ''}`}
//                                             value={formData?.state || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="Enter state"
//                                         />
//                                         {errors.state && (
//                                             <div className="invalid-feedback d-block">
//                                                 {errors.state}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="row">
//                                 <div className="col-md-4">
//                                     <div className='form-group mb-4'>
//                                         <label>Headoffice Country <span style={{ color: '#f00' }}>*</span></label>
//                                         <input
//                                             type="text"
//                                             name="country"
//                                             className={`form-control ${errors.country ? 'is-invalid' : ''}`}
//                                             value={formData?.country || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="Enter country"
//                                         />
//                                         {errors.country && (
//                                             <div className="invalid-feedback d-block">
//                                                 {errors.country}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-8">
//                                     <div className='form-group mb-4'>
//                                         <label>Headoffice PIN Code <span style={{ color: '#f00' }}>*</span></label>
//                                         <input
//                                             type="text"
//                                             name="pinCode"
//                                             className={`form-control pincode-flag ${errors.pinCode ? 'is-invalid' : ''}`}
//                                             value={formData?.pinCode || ''}
//                                             onChange={handleInputChange}
//                                             placeholder="Enter PIN code"
//                                         />
//                                         {errors.pinCode && (
//                                             <div className="invalid-feedback d-block">
//                                                 {errors.pinCode}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <p className='subheadline-2 mb-1'>{"What's the nearest airport to this BR / property?"}</p>

//                                 <div className='form-group mb-4'>
//                                     <label>Help corporate guests plan their travel by sharing the closest airport.</label>
//                                     {/* <input type='text' name='addressHelp' value={formData?.addressHelp} onChange={handleInputChange} className='form-control' placeholder='e.x. Mumbai International Airport (45 minutes drive)' /> */}
//                                     <textarea
//                                         name='addressHelp'
//                                         className='form-control'
//                                         placeholder="Provide directions, landmarks, or special instructions for guests..."
//                                         value={formData?.addressHelp || ''}
//                                         onChange={handleInputChange}
//                                         rows={3}
//                                     />
//                                 </div>
//                             </div>
//                             <hr style={{ margin: "50px 0" }} />

//                         </div>
//                     </div>

//                     {/* Amenities */}
//                     <div className='comapny-information-box property-list-2'>
//                         <h4 className='mb-3'>Amenities</h4>

//                         <div className='search-box mb-3' style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                             <div style={{ flex: 1, position: "relative" }}>
//                                 <input
//                                     type='text'
//                                     placeholder='Search'
//                                     className='form-control'
//                                     value={amenitySearch}
//                                     onFocus={() => setShowAmenitySearch(true)}
//                                     onChange={e => setAmenitySearch(e.target.value)}
//                                     style={{
//                                         paddingLeft: "40px",
//                                         fontSize: "16px",
//                                         border: "2px solid #d3ccc5",
//                                         borderRadius: "2px",
//                                         background: "#f2f2f2"
//                                     }}
//                                 />
//                                 <Image
//                                     src='/images/icons/search.svg'
//                                     width={20}
//                                     height={20}
//                                     alt='Search'
//                                     style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
//                                 />
//                                 {amenitySearch && (
//                                     <button
//                                         type="button"
//                                         onClick={() => setAmenitySearch('')}
//                                         style={{
//                                             position: "absolute",
//                                             right: "12px",
//                                             top: "50%",
//                                             transform: "translateY(-50%)",
//                                             background: "none",
//                                             border: "none",
//                                             fontSize: "20px",
//                                             color: "#6B4F3F",
//                                             cursor: "pointer"
//                                         }}
//                                         aria-label="Clear"
//                                     >
//                                         <Image
//                                             src='/images/icons/close-circle.svg'
//                                             className='img-fluid'
//                                             width={24}
//                                             height={24}
//                                             alt='close'
//                                         />
//                                     </button>
//                                 )}
//                             </div>
//                             {showAmenitySearch && (
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setAmenitySearch('');
//                                         setShowAmenitySearch(false);
//                                     }}
//                                     style={{
//                                         background: "none",
//                                         border: "none",
//                                         color: "#6B4F3F",
//                                         fontWeight: "500",
//                                         fontSize: "16px",
//                                         cursor: "pointer"
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>
//                             )}
//                         </div>
//                         <dl className='br-list-data'>
//                             {filteredAmenities.slice(0, 6).map((a, idx) => {
//                                 const isSelected = selectedAmenities?.includes(a.label);
//                                 return (
//                                     <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
//                                         <span className='br-list gap-2'>
//                                             <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
//                                             {a.label}
//                                         </span>
//                                         <span
//                                             className='add-plus-icn'
//                                             style={{ cursor: "pointer" }}
//                                             onClick={() => handleAmenitySelect(a.label)}
//                                         >
//                                             <Image
//                                                 src={
//                                                     isSelected
//                                                         ? "/images/icons/check_circle.svg"
//                                                         : "/images/icons/add_circle.svg"
//                                                 }
//                                                 className='img-fluid'
//                                                 width={24}
//                                                 height={24}
//                                                 alt={isSelected ? 'selected' : 'add circle'}
//                                             />
//                                         </span>
//                                     </li>
//                                 );
//                             })}
//                             {filteredAmenities.length === 0 && (
//                                 <li style={{ color: "#73615F", padding: "0px 0" }}>No amenities found.</li>
//                             )}
//                         </dl>
//                         <hr />
//                     </div>

//                     {/* Key Features */}
//                     <div className='comapny-information-box property-list-2'>
//                         <h4 className='mb-3'>Key features or standout amenities</h4>

//                         <div className='search-box mb-3' style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                             <div style={{ flex: 1, position: "relative" }}>
//                                 <input
//                                     type='text'
//                                     placeholder='Search'
//                                     className='form-control'
//                                     value={amenitySearch2}
//                                     onFocus={() => setShowAmenitySearch2(true)}
//                                     onChange={e => setAmenitySearch2(e.target.value)}
//                                     style={{
//                                         paddingLeft: "40px",
//                                         fontSize: "16px",
//                                         border: "2px solid #d3ccc5",
//                                         borderRadius: "2px",
//                                         background: "#f2f2f2"
//                                     }}
//                                 />
//                                 <Image
//                                     src='/images/icons/search.svg'
//                                     width={20}
//                                     height={20}
//                                     alt='Search'
//                                     style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
//                                 />
//                                 {amenitySearch2 && (
//                                     <button
//                                         type="button"
//                                         onClick={() => setAmenitySearch2('')}
//                                         style={{
//                                             position: "absolute",
//                                             right: "12px",
//                                             top: "50%",
//                                             transform: "translateY(-50%)",
//                                             background: "none",
//                                             border: "none",
//                                             fontSize: "20px",
//                                             color: "#6B4F3F",
//                                             cursor: "pointer"
//                                         }}
//                                         aria-label="Clear"
//                                     >
//                                         <Image
//                                             src='/images/icons/close-circle.svg'
//                                             className='img-fluid'
//                                             width={24}
//                                             height={24}
//                                             alt='close'
//                                         />
//                                     </button>
//                                 )}
//                             </div>
//                             {showAmenitySearch2 && (
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setAmenitySearch2('');
//                                         setShowAmenitySearch2(false);
//                                     }}
//                                     style={{
//                                         background: "none",
//                                         border: "none",
//                                         color: "#6B4F3F",
//                                         fontWeight: "500",
//                                         fontSize: "16px",
//                                         cursor: "pointer"
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>
//                             )}
//                         </div>
//                         <dl className='br-list-data'>
//                             {filteredAmenities2.slice(0, 6).map((a, idx) => {
//                                 const isSelected = selectedAmenities2?.includes(a.label);
//                                 return (
//                                     <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
//                                         <span className='br-list gap-2'>
//                                             <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
//                                             {a.label}
//                                         </span>
//                                         <span
//                                             className='add-plus-icn'
//                                             style={{ cursor: "pointer" }}
//                                             onClick={() => handleAmenitySelect2(a.label)}
//                                         >
//                                             <Image
//                                                 src={
//                                                     isSelected
//                                                         ? "/images/icons/check_circle.svg"
//                                                         : "/images/icons/add_circle.svg"
//                                                 }
//                                                 className='img-fluid'
//                                                 width={24}
//                                                 height={24}
//                                                 alt={isSelected ? 'selected' : 'add circle'}
//                                             />
//                                         </span>
//                                     </li>
//                                 );
//                             })}
//                             {filteredAmenities2.length === 0 && (
//                                 <li style={{ color: "#73615F", padding: "0px 0" }}>No amenities found.</li>
//                             )}
//                         </dl>
//                         <hr />
//                     </div>

//                     {/* Tax Information */}
//                     <div className='comapny-information-box'>
//                         <h4 className='mb-4'>Additional regional information</h4>

//                         <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
//                             <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Tax Information</span>
//                             <br />
//                             <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
//                                 {`To comply with country's regulations regarding property listings, we require the following information.`}
//                             </span>
//                         </p>

//                         <div className='form-group mb-3'>
//                             <label>GST Number (optional)</label>
//                             <input
//                                 type='text'
//                                 name="gst_number"
//                                 value={formData?.gst_number || ''}
//                                 onChange={handleInputChange}
//                                 className='form-control'
//                                 placeholder='Enter GST number'
//                             />
//                         </div>

//                         <div className='form-group mb-3'>
//                             <label>Permanent Account Number (PAN)</label>
//                             <input
//                                 type='text'
//                                 name="pan_number"
//                                 value={formData?.pan_number || ''}
//                                 onChange={handleInputChange}
//                                 className='form-control'
//                                 placeholder='Enter PAN number'
//                             />
//                         </div>
//                     </div>

//                     {/* Property Manager */}
//                     <div className='comapny-information-box'>
//                         <div className="d-flex justify-content-between align-items-center">
//                             <h4 className='mb-4'>Property manager</h4>
//                             <Image
//                                 src="/images/icons/add_circle.svg"
//                                 className="img-fluid mb-3"
//                                 alt="add"
//                                 width={24}
//                                 height={24}
//                                 onClick={handleAddManager}
//                                 style={{ cursor: "pointer" }}
//                             />
//                         </div>

//                         {managers.map((managerItem) => (
//                             <div key={managerItem.id} className="form-group mb-2" style={{ position: "relative" }}>
//                                 {!managerItem.data ? (
//                                     <>
//                                         <input
//                                             type="text"
//                                             className="form-control user-icn2"
//                                             placeholder="Add property manager"
//                                             onFocus={() => setShowManagerList(managerItem.id)}
//                                             onBlur={() => setTimeout(() => setShowManagerList(null), 200)}
//                                         />

//                                         {showManagerList === managerItem.id && (
//                                             <div
//                                                 style={{
//                                                     position: "absolute",
//                                                     top: "58px",
//                                                     left: 0,
//                                                     right: 0,
//                                                     background: "#f9f6f4",
//                                                     border: "1px solid #6B4F3F",
//                                                     borderRadius: "0px",
//                                                     zIndex: 10,
//                                                     padding: "16px",
//                                                 }}
//                                             >
//                                                 {managerList.map((manager, idx) => (

//                                                     <div
//                                                         className="managers-data"
//                                                         key={idx}
//                                                         style={{
//                                                             display: "flex",
//                                                             alignItems: "center",
//                                                             marginBottom: "18px",
//                                                             borderBottom: idx < managerList.length - 1 ? "1px solid #ececec" : "none",
//                                                             paddingBottom: "15px",
//                                                             cursor: "pointer",
//                                                         }}
//                                                         onClick={() => handleManagerSelect(managerItem.id, manager)}
//                                                     >
//                                                         <Image
//                                                             src={manager.profile_image}
//                                                             // src={`${manager.profile_image}`}
//                                                             // src={
//                                                             //     manager.profile_image
//                                                             //         ? `${BASE_URL}${manager.profile_image}`
//                                                             //         : "/images/icons/No-Image.svg"
//                                                             // }
//                                                             alt={manager.name}
//                                                             width={48}
//                                                             height={48}
//                                                             style={{
//                                                                 width: "48px",
//                                                                 height: "48px",
//                                                                 borderRadius: "0px",
//                                                                 objectFit: "cover",
//                                                                 marginRight: "16px",
//                                                             }

//                                                             }

//                                                         />
//                                                         <div>
//                                                             <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                 {manager.name}
//                                                             </div>
//                                                             <div style={{ fontSize: "14px", color: "#73615F" }}>
//                                                                 {manager.email}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </>
//                                 ) : (
//                                     <div
//                                         style={{
//                                             display: "flex",
//                                             alignItems: "center",
//                                             background: "#f9f6f4",
//                                             border: "1px solid rgb(128 99 75 / 24%)",
//                                             borderRadius: "0px",
//                                             padding: "12px 16px",
//                                             marginBottom: "8px",
//                                             marginTop: "15px",
//                                         }}
//                                     >
//                                         <Image
//                                             // src={managerItem.data.img}
//                                             //  src={`${BASE_URL}${managerItem.data.profile_image}`}
//                                           src={
//                                                 managerItem.data.profile_image
//                                                     ? managerItem.data.profile_image.startsWith("http")
//                                                         ? managerItem.data.profile_image
//                                                         : `${BASE_URL}${managerItem.data.profile_image}`
//                                                     : "/images/icons/No-Image.svg"
//                                             }
//                                             alt={managerItem.data.name}
//                                             width={48}
//                                             height={48}
//                                             style={{
//                                                 width: "48px",
//                                                 height: "48px",
//                                                 borderRadius: "0px",
//                                                 objectFit: "cover",
//                                                 marginRight: "16px",
//                                             }}
//                                         />
//                                         <div style={{ display: "flex", alignItems: "center" }}>
//                                             <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                 {managerItem.data.name}
//                                             </span>
//                                             <span style={{ margin: "0 12px", color: "#73615F" }}>|</span>
//                                             <span style={{ display: "flex", color: "#463527", fontSize: "14px", marginRight: "12px" }}>
//                                                 <Image src="/images/icons/call.svg" alt="call" width={18} height={18} />&nbsp;
//                                                 {managerItem.data.phone_number || managerItem.data.phone}
//                                             </span>
//                                             <span className='gap-2' style={{ margin: "0 12px", color: "#73615F" }}>|</span>
//                                             <span className='gap-2' style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
//                                                 <Image src="/images/icons/email.svg" alt="email" width={18} height={18} /> &nbsp;
//                                                 {managerItem.data.email}
//                                             </span>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             className='ms-auto me-0'
//                                             onClick={() => handleManagerRemove(managerItem.id)}
//                                             style={{
//                                                 background: "none",
//                                                 border: "none",
//                                                 color: "#6B4F3F",
//                                                 fontSize: "20px",
//                                                 marginLeft: "12px",
//                                                 cursor: "pointer",
//                                             }}
//                                             title="Remove"
//                                         >
//                                             <Image src="/images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                         <hr />
//                     </div>

//                     {/* Property Caretaker */}
//                     <div className='comapny-information-box'>
//                         <div className="d-flex justify-content-between align-items-center">
//                             <h4 className='mb-4'>Property caretaker</h4>
//                             <Image
//                                 src="/images/icons/add_circle.svg"
//                                 className="img-fluid mb-3"
//                                 alt="add"
//                                 width={24}
//                                 height={24}
//                                 onClick={handleAddCaretaker}
//                                 style={{ cursor: "pointer" }}
//                             />
//                         </div>

//                         {caretakers.map((caretakerItem) => (
//                             <div key={caretakerItem.id} className="form-group mb-2" style={{ position: "relative" }}>
//                                 {!caretakerItem.data ? (
//                                     <>
//                                         <input
//                                             type="text"
//                                             className="form-control user-icn2"
//                                             placeholder="Add property caretaker"
//                                             onFocus={() => setShowCaretakerList(caretakerItem.id)}
//                                             onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//                                         />

//                                         {showCaretakerList === caretakerItem.id && (
//                                             <div
//                                                 style={{
//                                                     position: "absolute",
//                                                     top: "58px",
//                                                     left: 0,
//                                                     right: 0,
//                                                     background: "#f9f6f4",
//                                                     border: "1px solid #6B4F3F",
//                                                     borderRadius: "0px",
//                                                     zIndex: 10,
//                                                     padding: "16px",
//                                                 }}
//                                             >
//                                                 {CaretakerList.map((caretaker, idx) => (
//                                                     <div
//                                                         className="managers-data"
//                                                         key={idx}
//                                                         style={{
//                                                             display: "flex",
//                                                             alignItems: "center",
//                                                             marginBottom: "18px",
//                                                             borderBottom: idx < CaretakerList.length - 1 ? "1px solid #ececec" : "none",
//                                                             paddingBottom: "15px",
//                                                             cursor: "pointer",
//                                                         }}
//                                                         onClick={() => handleCaretakerSelect(caretakerItem.id, caretaker)}
//                                                     >
//                                                         <Image
//                                                             src={caretaker.profile_image}
//                                                             alt={caretaker.name}
//                                                             width={48}
//                                                             height={48}
//                                                             style={{
//                                                                 borderRadius: "0px",
//                                                                 objectFit: "cover",
//                                                                 marginRight: "16px",
//                                                             }}
//                                                         />
//                                                         <div>
//                                                             <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                 {caretaker.name}{" "}
//                                                                 {caretaker.you && (
//                                                                     <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                                         (You)
//                                                                     </span>
//                                                                 )}
//                                                             </div>
//                                                             <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </>
//                                 ) : (
//                                     <div
//                                         style={{
//                                             display: "flex",
//                                             alignItems: "center",
//                                             background: "#f9f6f4",
//                                             border: "1px solid rgb(128 99 75 / 24%)",
//                                             borderRadius: "0px",
//                                             padding: "12px 16px",
//                                             marginBottom: "8px",
//                                             marginTop: "15px",
//                                         }}
//                                     >
//                                         <Image
//                                             // src={caretakerItem.data.img}
//                                            src={
//                                                 caretakerItem.data.profile_image
//                                                     ? caretakerItem.data.profile_image.startsWith("http")
//                                                         ? caretakerItem.data.profile_image
//                                                         : `${BASE_URL}${caretakerItem.data.profile_image}`
//                                                     : "/images/icons/No-Image.svg"
//                                             }
//                                             alt={caretakerItem.data.name}
//                                             width={48}
//                                             height={48}
//                                             style={{
//                                                 borderRadius: "0px",
//                                                 objectFit: "cover",
//                                                 marginRight: "16px",
//                                             }}
//                                         />

//                                         <div style={{ display: "flex", alignItems: "center" }}>
//                                             <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                 {caretakerItem.data.name}{" "}
//                                                 {caretakerItem.data.you && (
//                                                     <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                         (You)
//                                                     </span>
//                                                 )}
//                                             </span>
//                                             <span style={{ margin: "0 12px", color: "#73615F" }}>|</span>
//                                             <span style={{ display: "flex", color: "#463527", fontSize: "14px", marginRight: "12px" }}>
//                                                 <Image src="/images/icons/call.svg" alt="call" width={18} height={18} />
//                                                 {caretakerItem.data.phone_number || "8390734261"}
//                                             </span>
//                                             <span style={{ margin: "0 12px", color: "#73615F" }}>|</span>
//                                             <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
//                                                 <Image src="/images/icons/email.svg" alt="email" width={18} height={18} />
//                                                 {caretakerItem.data.email}
//                                             </span>
//                                         </div>

//                                         <button
//                                             type="button"
//                                             className='ms-auto me-0'
//                                             onClick={() => handleCaretakerRemove(caretakerItem.id)}
//                                             style={{
//                                                 background: "none",
//                                                 border: "none",
//                                                 color: "#6B4F3F",
//                                                 fontSize: "20px",
//                                                 marginLeft: "12px",
//                                                 cursor: "pointer",
//                                             }}
//                                             title="Remove"
//                                         >
//                                             <Image src="/images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                         <hr />
//                     </div>

//                     {/* Operations Manager */}
//                     <div className='comapny-information-box'>
//                         <h4 className='mb-4'>Operations manager</h4>
//                         <p>Operations managers contact details</p>

//                         <div className='form-group mb-3'>
//                             <label>Name of the person who should contacted in case of emergency</label>
//                             <input
//                                 type='text'
//                                 name="operationsManagerName"
//                                 value={formData?.operationsManagerName || ''}
//                                 onChange={handleInputChange}
//                                 className='form-control'
//                                 placeholder='Rahman'
//                             />
//                         </div>

//                         <div className='form-group mb-3'>
//                             <label>{`Contact person's email`}</label>
//                             <input
//                                 type='email'
//                                 name="operationsManagerEmail"
//                                 value={formData?.operationsManagerEmail || ''}
//                                 onChange={handleInputChange}
//                                 className='form-control'
//                                 placeholder='slb.residences@casamelhor.in'
//                             />
//                         </div>

//                         <div className='form-group mb-3'>
//                             <label>{`Contact person's phone number`}</label>
//                             <input
//                                 type='tel'
//                                 name="operationsManagerPhone"
//                                 value={formData?.operationsManagerPhone || ''}
//                                 onChange={handleInputChange}
//                                 className='form-control'
//                                 placeholder='7002957749'
//                             />
//                         </div>

//                         <div className='form-group mb-3'>
//                             <label>Contact alternate phone number (optional)</label>
//                             <input
//                                 type='tel'
//                                 name="operationsManagerAlternatePhone"
//                                 value={formData?.operationsManagerAlternatePhone || ''}
//                                 onChange={handleInputChange}
//                                 className='form-control'
//                                 placeholder='e.x. +91 4323545464'
//                             />
//                         </div>

//                         <div className="manager-pic">
//                             <label className="mb-2">{`Contact person's photo`}</label>
//                             <div className='upload-photo' style={{ maxWidth: '214px', position: 'relative' }}>
//                                 <Image
//                                     src={file ? file : '/images/icons/No-Image.svg'}
//                                     className='img-fluid'
//                                     alt='profile'
//                                     width={214}
//                                     height={214}
//                                     style={{ objectFit: 'cover' }}
//                                 />

//                                 <span className='more-action' onClick={togglePicOption}>
//                                     <Image src='/images/icons/more-dots-3.svg' className='img-fluid' alt='more' width={24} height={24} />
//                                 </span>

//                                 <ul className={`picoption ${isOpen ? "active" : ""}`}>
//                                     <li onClick={changepicModal}>
//                                         <Link href={''}>Change Photo</Link>
//                                     </li>
//                                     <li onClick={removeFile}>
//                                         <Link href='#'>Delete</Link>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className='d-flex mt-2 gap-3'>
//                             <Button
//                                 variant=""
//                                 className='edit-btn'
//                                 style={{ padding: '13px 35px', borderRadius: '0' }}
//                                 onClick={() => setIsEditManage(false)}
//                             >
//                                 Cancel
//                             </Button>

//                             <Button
//                                 variant=""
//                                 className='complete-form-btn'
//                                 style={{ padding: '13px 35px', borderRadius: '0' }}
//                                 onClick={handleUpload}
//                                 disabled={saveLoading}
//                             >
//                                 {saveLoading ? (
//                                     <>
//                                         <Spinner animation="border" size="sm" className="me-2" />
//                                         Saving...
//                                     </>
//                                 ) : (
//                                     'Save Changes'
//                                 )}
//                             </Button>
//                         </div>
//                     </div>
//                 </Col>
//             </Row>

//             {/* Change Photo Modal */}
//             <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-0'>
//                     <Modal.Title>Upload photo</Modal.Title>
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
//                         {!file ? (
//                             <label
//                                 onDrop={handleDrop}
//                                 onDragOver={handleDragOver}
//                                 className="border-2 border-dashed border-gray-300 rounded-md h-48 flex flex-col items-center justify-center cursor-pointer"
//                                 style={{ borderColor: '#6B4F3F' }}
//                             >
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleFileChange}
//                                     className="hidden"
//                                 />
//                                 <div className="text-center">
//                                     <Image
//                                         src="/images/icons/photo-library.svg"
//                                         alt="Upload"
//                                         width={30}
//                                         height={30}
//                                         className="mx-auto mb-2"
//                                     />
//                                     <p className="font-medium mb-0" style={{ color: '#463527' }}>Drag and drop</p>
//                                     <p className="text-sm mb-0" style={{ color: '#73615F' }}>
//                                         or click here to choose file.
//                                     </p>
//                                     <p className="text-xs mt-2" style={{ color: '#999' }}>
//                                         Max file size: 5MB
//                                     </p>
//                                 </div>
//                             </label>
//                         ) : (
//                             <div className="relative inline-block">
//                                 <Image
//                                     src={file}
//                                     alt="Uploaded preview"
//                                     width={250}
//                                     height={250}
//                                     className="rounded-md object-cover"
//                                 />
//                                 <button
//                                     onClick={removeFile}
//                                     className="absolute delete-icn"
//                                     style={{ top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '5px' }}
//                                 >
//                                     <Image src="/images/icons/delete.svg" className='img-fluid' width={20} height={20} alt='delete' />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between'>
//                     <Button
//                         variant=""
//                         onClick={changepicClose}
//                         className='btn-company-add'
//                         style={{ padding: '13px 25px', borderRadius: '0' }}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant=""
//                         onClick={uploadOperationManagerImage}
//                         className='search-btn complete-form-btn'
//                         style={{ padding: '13px 25px', borderRadius: '0' }}
//                         disabled={!file}
//                     >
//                         Upload
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }



"use client"
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { propertStepFirstValidation } from "@/utils/validation";
import { OperationManagerPhotoUploadAPI, UpdatePropertyDetailAPI } from "@/services/provider";
import { useParams, useSearchParams } from "next/navigation";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { alert_danger, alert_success } from "@/utils/Alerts/TostifyAlerts";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ─────────────────────────────────────────────────────────────────────────────
// FIX 1: Replaced static iframe map with interactive draggable-pin Google Map
// FIX 2: Added isMapReady polling so map never silently bails on first render
// FIX 3: key prop on DynamicMap forces remount when coords first arrive
// ─────────────────────────────────────────────────────────────────────────────
const DynamicMap = ({ lat, lng, address, onPinDrag }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragCoords, setDragCoords] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false); // FIX: wait for SDK

    // FIX: Poll until google.maps SDK is confirmed available
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

    // FIX: isMapReady in dep array — map initializes only after SDK ready
    useEffect(() => {
        if (!lat || !lng) return;
        if (!isMapReady) return;

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
                const newLat = e.latLng.lat();
                const newLng = e.latLng.lng();
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
    }, [lat, lng, isMapReady]); // FIX: isMapReady in deps

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
            {/* Drag hint banner */}
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

            {/* Map container */}
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

            {/* Coordinate display */}
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

export default function EditPropertyDetails({
    setIsEditManage,
    formData,
    setFormData,
    file,
    setFile,
    selectedAmenities,
    setSelectedAmenities,
    selectedAmenities2,
    setSelectedAmenities2,
    propertyRole,
    getPropertyDetail,
    setSearchMgr, setSearchCaretacker
}) {
    const searchParams = useSearchParams();
    const id = searchParams.get("uid");

    const [changepicsModal, changepisetShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [googleInitError, setGoogleInitError] = useState(false);
    const [addressSearchLoading, setAddressSearchLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const changepicClose = () => changepisetShow(false);
    const changepicModal = () => changepisetShow(true);

    const [showPropertyList, setShowPropertyList] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [errors, setErrors] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isGoogleReady, setIsGoogleReady] = useState(false);
    const [googleMapsUrl, setGoogleMapsUrl] = useState('');

    const togglePicOption = () => setIsOpen((prev) => !prev);
    const handleOptionClick = () => setIsOpen(false);

    useEffect(() => {
        const checkGoogleReady = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                setIsGoogleReady(true);
            }
        };
        checkGoogleReady();
        const interval = setInterval(checkGoogleReady, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (formData.lat && formData.lng) {
            const url = `https://www.google.com/maps?q=${formData.lat},${formData.lng}&z=15&output=embed`;
            setGoogleMapsUrl(url);
        }
    }, [formData.lat, formData.lng]);

    // FIX 4: Removed initOnMount: isGoogleReady — let library manage readiness
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
        requestOptions: {
            componentRestrictions: { country: "in" },
        },
        // initOnMount removed
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

            setFormData(prev => ({
                ...prev,
                propertyAddress: description,
                streetNumber: address.street,
                city: address.city,
                state: address.state,
                country: address.country,
                pinCode: address.postalCode,
                lat: lat,
                lng: lng,
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
            street,
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

    const handleAddressInputChange = (e) => {
        const value = e.target.value;
        setValue(value);
        setFormData(prev => ({
            ...prev,
            propertyAddress: value
        }));
        setShowPropertyList(true);
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            if (uploadedFile.size > MAX_FILE_SIZE) {
                alert('File size should be less than 5MB');
                return;
            }
            const objectUrl = URL.createObjectURL(uploadedFile);
            setFile(objectUrl);
            setFormData({
                ...formData,
                operationManagerPhoto: uploadedFile
            });
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile) {
            if (uploadedFile.size > MAX_FILE_SIZE) {
                alert('File size should be less than 5MB');
                return;
            }
            const objectUrl = URL.createObjectURL(uploadedFile);
            setFile(objectUrl);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const removeFile = () => {
        if (file && file.startsWith('blob:')) {
            URL.revokeObjectURL(file);
        }
        setFile(null);
        setFormData({ ...formData, operationManagerPhoto: null });
    };

    const handleGuestChange = (delta) => {
        const newCount = Math.max(1, (formData?.guestCapacity || 1) + delta);
        setFormData({ ...formData, guestCapacity: newCount });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        const { error } = propertStepFirstValidation({ [name]: value }, showManual);
        setErrors({ ...errors, ...error });
    };

    const [managers, setManagers] = useState([{ id: Date.now(), data: null }]);
    const [caretakers, setCaretakers] = useState([{ id: Date.now(), data: null }]);
    const [showManagerList, setShowManagerList] = useState(null);
    const [showCaretakerList, setShowCaretakerList] = useState(null);

    useEffect(() => {
        if (formData?.property_caretakers) {
            setCaretakers(formData.property_caretakers.map((obj, index) => ({
                id: `${Date.now()}-${index}`,
                data: obj
            })));
        }
    }, [formData?.property_caretakers]);

    useEffect(() => {
        if (formData?.property_managers) {
            setManagers(formData.property_managers.map((obj, index) => ({
                id: `${Date.now()}-${index}`,
                data: obj
            })));
        }
    }, [formData?.property_managers]);

    // const handleManagerSelect = (id, manager) => {
    //     setManagers(prev => prev.map(m => m.id === id ? { ...m, data: manager } : m));
    //     setShowManagerList(null);
    // };
    const handleManagerSelect = (id, manager) => {
        const alreadySelected = managers.some(m => m.id !== id && m.data?.uid === manager.uid);
        if (alreadySelected) return;

        setManagers(prev => prev.map(m => m.id === id ? { ...m, data: manager } : m));
        setShowManagerList(null);
    };
    const handleManagerRemove = (id) => setManagers(prev => prev.filter(m => m.id !== id));
    const handleAddManager = () => setManagers([...managers, { id: Date.now(), data: null }]);

    // const handleCaretakerSelect = (id, caretaker) => {
    //     setCaretakers(prev => prev.map(c => c.id === id ? { ...c, data: caretaker } : c));
    //     setShowCaretakerList(null);
    // };
    const handleCaretakerSelect = (id, caretaker) => {
        const alreadySelected = caretakers.some(c => c.id !== id && c.data?.uid === caretaker.uid);
        if (alreadySelected) return;

        setCaretakers(prev => prev.map(c => c.id === id ? { ...c, data: caretaker } : c));
        setShowCaretakerList(null);
    };
    const handleCaretakerRemove = (id) => setCaretakers(prev => prev.filter(c => c.id !== id));
    const handleAddCaretaker = () => setCaretakers([...caretakers, { id: Date.now(), data: null }]);

    const [amenitySearch, setAmenitySearch] = useState('');
    const [showAmenitySearch, setShowAmenitySearch] = useState(false);
    const [amenitySearch2, setAmenitySearch2] = useState('');
    const [showAmenitySearch2, setShowAmenitySearch2] = useState(false);

    const amenities = [
        { icon: "/images/icons/amenities-icon/Air-Conditioning.svg", label: "Air Conditioning" },
        { icon: "/images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
        { icon: "/images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
        { icon: "/images/icons/amenities-icon/Serves-Breakfast.svg", label: "Serves Breakfast" },
        { icon: "/images/icons/amenities-icon/Serves-Lunch.svg", label: "Serves Lunch" },
        { icon: "/images/icons/amenities-icon/Serves-Dinner.svg", label: "Serves Dinner" },
        { icon: "/images/icons/amenities-icon/BuzzerWireless.svg", label: "Buzzer/Wireless" },
        { icon: "/images/icons/amenities-icon/intercom.svg", label: "Intercom" },
        { icon: "/images/icons/amenities-icon/elevator-building.svg", label: "Elevator in Building" },
        { icon: "/images/icons/amenities-icon/parking.svg", label: "Parking" },
        { icon: "/images/icons/amenities-icon/laundry.svg", label: "Laundry" },
        { icon: "/images/icons/amenities-icon/Access-to-kitchen.svg", label: "Access to Kitchen" },
        { icon: "/images/icons/amenities-icon/Swimming-pool.svg", label: "Swimming Pool" },
        { icon: "/images/icons/amenities-icon/gym.svg", label: "Gym" },
    ];

    const amenities2 = [
        { icon: "/images/icons/amenities-icon/Air-Conditioning.svg", label: "Air Conditioning" },
        { icon: "/images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
        { icon: "/images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
        { icon: "/images/icons/amenities-icon/heating.svg", label: "Heating" },
        { icon: "/images/icons/amenities-icon/test.svg", label: "Test" },
        { icon: "/images/icons/amenities-icon/Workspace.svg", label: "Workspace" },
        { icon: "/images/icons/amenities-icon/Ensuite-Bathroom.svg", label: "Ensuite Bathroom" },
        { icon: "/images/icons/amenities-icon/Desk.svg", label: "Desk" },
        { icon: "/images/icons/amenities-icon/Wardrobe-Hangers.svg", label: "Wardrobe & Hangers" },
        { icon: "/images/icons/amenities-icon/family-kid-friends.svg", label: "Family/Kid Friendly" },
        { icon: "/images/icons/amenities-icon/Fire-Extinguisher.svg", label: "Fire Extinguisher" },
        { icon: "/images/icons/amenities-icon/Frist-Aid-Kit.svg", label: "First Aid Kit" },
        { icon: "/images/icons/amenities-icon/Emergency-Escape.svg", label: "Emergency Escape" },
        { icon: "/images/icons/amenities-icon/CCTV.svg", label: "CCTV" },
        { icon: "/images/icons/amenities-icon/Bathing-kit.svg", label: "Bathing Kit" },
        { icon: "/images/icons/amenities-icon/Smoking-area.svg", label: "Smoking Allowed in" },
        { icon: "/images/icons/amenities-icon/Open-Area.svg", label: "Open Area" },
        { icon: "/images/icons/amenities-icon/Iron-on-request.svg", label: "Iron On Request" },
    ];

    const filteredAmenities = amenities.filter(a =>
        a.label.toLowerCase().includes(amenitySearch.toLowerCase())
    );

    const filteredAmenities2 = amenities2.filter(a =>
        a.label.toLowerCase().includes(amenitySearch2.toLowerCase())
    );

    const handleAmenitySelect = (label) => {
        setSelectedAmenities(prev =>
            prev?.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    const handleAmenitySelect2 = (label) => {
        setSelectedAmenities2(prev =>
            prev?.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    const managerList = propertyRole?.properyManager || [];
    const CaretakerList = propertyRole?.propertyCaretacer || [];

    const uploadOperationManagerImage = async () => {
        try {
            if (!formData.operationManagerPhoto) {
                alert('Please select a photo first');
                return;
            }
            const fieldData = new FormData();
            fieldData.append("ops_manager_photo_url", formData.operationManagerPhoto);
            const response = await OperationManagerPhotoUploadAPI(id, fieldData);
            if (response?.data?.success) {
                changepicClose();
            } else {
                alert('Failed to upload photo');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpload = async () => {
        try {
            if (!id) {
                toast.error("Property UID not found");
                return;
            }
            setSaveLoading(true);

            const pm = managers.filter(m => m.data !== null).map(m => m.data.uid);
            const cm = caretakers.filter(c => c.data !== null).map(c => c.data.uid);

            const rawData = {
                property_name: formData.propertyName || '',
                address_search_text: formData.propertyAddress || '',
                street_number: formData.streetNumber || '',
                flat_house_no: formData.flatNo || '',
                city: formData.city || '',
                state: formData.state || '',
                country: formData.country || '',
                pin_code: formData.pinCode || '',
                latitude: formData.lat || '',
                longitude: formData.lng || '',
                nearest_airport: formData.addressHelp || '',
                ops_manager_name: formData.operationsManagerName || '',
                ops_manager_email: formData.operationsManagerEmail || '',
                ops_manager_phone: formData.operationsManagerPhone || '',
                ops_manager_phone_alt: formData.operationsManagerAlternatePhone || '',
                max_capacity: formData.guestCapacity || 1,
                property_description: formData.brDescription || '',
                property_amenities: selectedAmenities || [],
                key_features: selectedAmenities2 || [],
                gst_number: formData?.gst_number || '',
                pan_number: formData?.pan_number || '',
                property_manager_ids: pm,
                property_caretaker_ids: cm
            };

            const response = await UpdatePropertyDetailAPI(id, rawData);

            if (response?.data?.success) {
                setIsEditManage(false);
                getPropertyDetail();
                toast.success('Property details updated successfully');
            } else {
                Object.entries(response?.data?.response).forEach(([field, messages]) => {
                    messages?.forEach((message) => {
                        toast.error(`${message}`);
                    });
                });
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Error updating property details');
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <>
            <Row>
                <Col md={6} className="relative active-box-fadein">
                    <div className='d-flex align-items-start justify-content-between mb-5'>
                        <div className='general-info'>
                            <h2 className='page-title'>General information</h2>
                            <p className='mb-0'>Change or edit all company related general information from here</p>
                        </div>
                        <Button
                            variant=""
                            className='edit-btn'
                            style={{ padding: '13px 25px', borderRadius: '0' }}
                            onClick={() => setIsEditManage(false)}
                        >
                            Cancel
                        </Button>
                        <Link
                            href=""
                            className='Save-company-btn'
                            style={{ textDecoration: 'none' }}
                            onClick={(e) => { e.preventDefault(); handleUpload(); }}
                        >
                            Done
                        </Link>
                    </div>

                    {/* Property Level Information */}
                    <div className='comapny-information-box'>
                        <h4 className='mb-4'>Property level information</h4>

                        <p style={{ paddingBottom: '10px' }}>
                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Name</span>
                            <br />
                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                Short titles work best. Have fun with it – you can always change it later.
                            </span>
                        </p>

                        <div className='form-group mb-3'>
                            <label>Property Name</label>
                            <input
                                type='text'
                                name="propertyName"
                                value={formData?.propertyName || ''}
                                onChange={handleInputChange}
                                className='form-control'
                                placeholder='e.g. Casa Melhor'
                            />
                        </div>

                        <hr />

                        <div className='form-group mb-3'>
                            <p className="mb-0" style={{ paddingBottom: '10px' }}>
                                <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>
                                    {`What's the maximum guest capacity for booking this BR?`}
                                </span>
                            </p>

                            <div className='form-group mt-2 mb-4'>
                                <label>Guests (Adults)</label>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        border: "2px solid #d3ccc5",
                                        borderRadius: "2px",
                                        background: "#f2f2f2",
                                        padding: "13px 0",
                                        width: "100%",
                                        maxWidth: "228px",
                                        fontSize: "14px",
                                        marginTop: "8px"
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleGuestChange(-1)}
                                        style={{
                                            background: "none", border: "none", textAlign: 'center',
                                            width: "20%", cursor: (formData?.guestCapacity || 1) > 1 ? "pointer" : "not-allowed"
                                        }}
                                        disabled={(formData?.guestCapacity || 1) === 1}
                                    >
                                        <Image src='/images/icons/minus.svg' className='img-fluid ms-auto me-auto' alt='minus' width={20} height={20} />
                                    </button>
                                    <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>
                                        {formData?.guestCapacity || 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleGuestChange(1)}
                                        style={{ background: "none", border: "none", color: "#463527", width: "20%", cursor: "pointer", textAlign: 'center' }}
                                    >
                                        <Image src='/images/icons/Plus.svg' className='img-fluid ms-auto me-auto' alt='plus' width={20} height={20} />
                                    </button>
                                </div>
                            </div>
                            <hr />
                        </div>

                        <div className='form-group mb-3'>
                            <p className="mb-0" style={{ paddingBottom: '10px' }}>
                                <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>
                                    What makes this BR ideal for corporate booking?
                                </span>
                            </p>
                            <label>Share what makes your place special.</label>
                            <textarea
                                name="brDescription"
                                className='form-control mb-3'
                                value={formData?.brDescription || ''}
                                onChange={handleInputChange}
                                rows={6}
                                placeholder='e.g. Mountain views, dedicated meeting spaces, and customizable meal options'
                                maxLength={1500}
                            />
                            <span className='text-count mt-2'>{(formData?.brDescription?.length || 0)}/1500</span>
                            <hr />
                        </div>
                    </div>

                    {/* Address Search Section */}
                    <div className='property-list-2 position-relative'>
                        <p className='subheadline-2 mb-3'>BR Address search <span style={{ color: '#f00' }}>*</span></p>
                        <p className='mb-2'>{`Where's your property located?`}</p>

                        <div className="form-group mb-4" style={{ position: "relative" }}>
                            <input
                                type="text"
                                name="propertyAddress"
                                className={`form-control ${errors.propertyAddress ? 'is-invalid' : ''}`}
                                placeholder="Search Property Address"
                                value={formData?.propertyAddress || value}
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
                            />

                            {errors.propertyAddress && (
                                <div className="invalid-feedback d-block">{errors.propertyAddress}</div>
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
                                            color: "#6B4F3F", fontWeight: "500", fontSize: "14px",
                                            padding: "10px 16px", width: "100%", textAlign: "left",
                                            background: "none", border: "none", borderTop: "1px solid #eee", cursor: "pointer"
                                        }}
                                        onClick={handleManualEntry}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        Not found? Enter address manually
                                    </button>
                                </div>
                            )}

                            {!isGoogleReady && (
                                <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
                                    Loading Google Maps...
                                </div>
                            )}
                            {showPropertyList && status === "ZERO_RESULTS" && (
                                <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
                                    No results found. Try a different search or enter manually.
                                </div>
                            )}
                        </div>

                        {/* Address details + Draggable Map */}
                        <div className='mb-3'>
                            <p style={{ fontWeight: "500", marginBottom: "12px" }}>Please fill in the missing details</p>

                            {/* FIX 3: key prop forces clean remount when coords first arrive */}
                            <DynamicMap
                                key={`${formData?.lat}-${formData?.lng}`}
                                lat={formData?.lat}
                                lng={formData?.lng}
                                address={formData?.propertyAddress}
                                onPinDrag={({ lat, lng, address }) => {
                                    setFormData(prev => ({
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
                                            value={formData?.streetNumber || ''}
                                            onChange={handleInputChange}
                                            placeholder="Enter street address"
                                        />
                                        {errors.streetNumber && <div className="invalid-feedback d-block">{errors.streetNumber}</div>}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className='form-group mb-4'>
                                        <label>Flat/House No.</label>
                                        <input
                                            type="text"
                                            name="flatNo"
                                            className="form-control"
                                            value={formData?.flatNo || ''}
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
                                            value={formData?.city || ''}
                                            onChange={handleInputChange}
                                            placeholder="Enter city"
                                        />
                                        {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className='form-group mb-4'>
                                        <label>State <span style={{ color: '#f00' }}>*</span></label>
                                        <input
                                            type="text"
                                            name="state"
                                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                            value={formData?.state || ''}
                                            onChange={handleInputChange}
                                            placeholder="Enter state"
                                        />
                                        {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
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
                                            value={formData?.country || ''}
                                            onChange={handleInputChange}
                                            placeholder="Enter country"
                                        />
                                        {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className='form-group mb-4'>
                                        <label>PIN Code <span style={{ color: '#f00' }}>*</span></label>
                                        <input
                                            type="text"
                                            name="pinCode"
                                            className={`form-control pincode-flag ${errors.pinCode ? 'is-invalid' : ''}`}
                                            value={formData?.pinCode || ''}
                                            onChange={handleInputChange}
                                            placeholder="Enter PIN code"
                                        />
                                        {errors.pinCode && <div className="invalid-feedback d-block">{errors.pinCode}</div>}
                                    </div>
                                </div>

                                <p className='subheadline-2 mb-1'>{"What's the nearest airport to this BR / property?"}</p>
                                <div className='form-group mb-4'>
                                    <label>Help corporate guests plan their travel by sharing the closest airport.</label>
                                    <textarea
                                        name='addressHelp'
                                        className='form-control'
                                        placeholder="Provide directions, landmarks, or special instructions for guests..."
                                        value={formData?.addressHelp || ''}
                                        onChange={handleInputChange}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <hr style={{ margin: "50px 0" }} />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className='comapny-information-box property-list-2'>
                        <h4 className='mb-3'>Amenities</h4>

                        <div className='search-box mb-3' style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ flex: 1, position: "relative" }}>
                                <input
                                    type='text'
                                    placeholder='Search'
                                    className='form-control'
                                    value={amenitySearch}
                                    onFocus={() => setShowAmenitySearch(true)}
                                    onChange={e => setAmenitySearch(e.target.value)}
                                    style={{ paddingLeft: "40px", fontSize: "16px", border: "2px solid #d3ccc5", borderRadius: "2px", background: "#f2f2f2" }}
                                />
                                <Image src='/images/icons/search.svg' width={20} height={20} alt='Search'
                                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                                {amenitySearch && (
                                    <button type="button" onClick={() => setAmenitySearch('')}
                                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                                        <Image src='/images/icons/close-circle.svg' className='img-fluid' width={24} height={24} alt='close' />
                                    </button>
                                )}
                            </div>
                            {showAmenitySearch && (
                                <button type="button"
                                    onClick={() => { setAmenitySearch(''); setShowAmenitySearch(false); }}
                                    style={{ background: "none", border: "none", color: "#6B4F3F", fontWeight: "500", fontSize: "16px", cursor: "pointer" }}>
                                    Cancel
                                </button>
                            )}
                        </div>

                        <dl className='br-list-data'>
                            {filteredAmenities.slice(0, 6).map((a, idx) => {
                                const isSelected = selectedAmenities?.includes(a.label);
                                return (
                                    <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
                                        <span className='br-list gap-2'>
                                            <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
                                            {a.label}
                                        </span>
                                        <span className='add-plus-icn' style={{ cursor: "pointer" }} onClick={() => handleAmenitySelect(a.label)}>
                                            <Image
                                                src={isSelected ? "/images/icons/check_circle.svg" : "/images/icons/add_circle.svg"}
                                                className='img-fluid' width={24} height={24}
                                                alt={isSelected ? 'selected' : 'add circle'}
                                            />
                                        </span>
                                    </li>
                                );
                            })}
                            {filteredAmenities.length === 0 && (
                                <li style={{ color: "#73615F", padding: "0px 0" }}>No amenities found.</li>
                            )}
                        </dl>
                        <hr />
                    </div>

                    {/* Key Features */}
                    <div className='comapny-information-box property-list-2'>
                        <h4 className='mb-3'>Key features or standout amenities</h4>

                        <div className='search-box mb-3' style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ flex: 1, position: "relative" }}>
                                <input
                                    type='text'
                                    placeholder='Search'
                                    className='form-control'
                                    value={amenitySearch2}
                                    onFocus={() => setShowAmenitySearch2(true)}
                                    onChange={e => setAmenitySearch2(e.target.value)}
                                    style={{ paddingLeft: "40px", fontSize: "16px", border: "2px solid #d3ccc5", borderRadius: "2px", background: "#f2f2f2" }}
                                />
                                <Image src='/images/icons/search.svg' width={20} height={20} alt='Search'
                                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                                {amenitySearch2 && (
                                    <button type="button" onClick={() => setAmenitySearch2('')}
                                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                                        <Image src='/images/icons/close-circle.svg' className='img-fluid' width={24} height={24} alt='close' />
                                    </button>
                                )}
                            </div>
                            {showAmenitySearch2 && (
                                <button type="button"
                                    onClick={() => { setAmenitySearch2(''); setShowAmenitySearch2(false); }}
                                    style={{ background: "none", border: "none", color: "#6B4F3F", fontWeight: "500", fontSize: "16px", cursor: "pointer" }}>
                                    Cancel
                                </button>
                            )}
                        </div>

                        <dl className='br-list-data'>
                            {filteredAmenities2.slice(0, 6).map((a, idx) => {
                                const isSelected = selectedAmenities2?.includes(a.label);
                                return (
                                    <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
                                        <span className='br-list gap-2'>
                                            <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
                                            {a.label}
                                        </span>
                                        <span className='add-plus-icn' style={{ cursor: "pointer" }} onClick={() => handleAmenitySelect2(a.label)}>
                                            <Image
                                                src={isSelected ? "/images/icons/check_circle.svg" : "/images/icons/add_circle.svg"}
                                                className='img-fluid' width={24} height={24}
                                                alt={isSelected ? 'selected' : 'add circle'}
                                            />
                                        </span>
                                    </li>
                                );
                            })}
                            {filteredAmenities2.length === 0 && (
                                <li style={{ color: "#73615F", padding: "0px 0" }}>No amenities found.</li>
                            )}
                        </dl>
                        <hr />
                    </div>

                    {/* Tax Information */}
                    <div className='comapny-information-box'>
                        <h4 className='mb-4'>Additional regional information</h4>

                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Tax Information</span>
                            <br />
                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                {`To comply with country's regulations regarding property listings, we require the following information.`}
                            </span>
                        </p>

                        <div className='form-group mb-3'>
                            <label>GST Number (optional)</label>
                            <input type='text' name="gst_number" value={formData?.gst_number || ''} onChange={handleInputChange} className='form-control' placeholder='Enter GST number' />
                        </div>

                        <div className='form-group mb-3'>
                            <label>Permanent Account Number (PAN)</label>
                            <input type='text' name="pan_number" value={formData?.pan_number || ''} onChange={handleInputChange} className='form-control' placeholder='Enter PAN number' />
                        </div>
                    </div>

                    {/* Property Manager */}
                    <div className='comapny-information-box'>
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className='mb-4'>Property manager</h4>
                            <Image src="/images/icons/add_circle.svg" className="img-fluid mb-3" alt="add" width={24} height={24} onClick={handleAddManager} style={{ cursor: "pointer" }} />
                        </div>

                        {managers.map((managerItem) => (
                            <div key={managerItem.id} className="form-group mb-2" style={{ position: "relative" }}>
                                {!managerItem.data ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control user-icn2"
                                            placeholder="Add property manager"
                                            onFocus={() => setShowManagerList(managerItem.id)}
                                            onBlur={() => setTimeout(() => setShowManagerList(null), 200)}
                                            onChange={(e) => setSearchMgr(e.target.value)}
                                        />
                                        {showManagerList === managerItem.id && (
                                            <div style={{ position: "absolute", top: "58px", left: 0, right: 0, background: "#f9f6f4", border: "1px solid #6B4F3F", borderRadius: "0px", zIndex: 10, padding: "16px" }}>
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
                                                                src={manager.profile_image ? (manager.profile_image.startsWith("http") ? manager.profile_image : `${manager.profile_image}`) : '/images/icons/No-Image.svg'}
                                                                alt={manager.first_name || manager.name || ''}
                                                                width={48} height={48}
                                                                style={{ width: "48px", height: "48px", borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
                                                                onError={(e) => { e.target.src = '/images/icons/No-Image.svg'; }}
                                                            />
                                                            <div>
                                                                <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>{manager.first_name} {manager.last_name}</div>
                                                                <div style={{ fontSize: "14px", color: "#73615F" }}>{manager.email}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ display: "flex", alignItems: "center", background: "#f9f6f4", border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px", padding: "12px 16px", marginBottom: "8px", marginTop: "15px" }}>
                                        <Image
                                            src={managerItem.data.profile_image ? (managerItem.data.profile_image.startsWith("http") ? managerItem.data.profile_image : `${managerItem.data.profile_image}`) : '/images/icons/No-Image.svg'}
                                            alt={managerItem.data.first_name || managerItem.data.name || ''}
                                            width={48} height={48}
                                            style={{ width: "48px", height: "48px", borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
                                        />
                                        <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
                                            <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>{managerItem.data.first_name} {managerItem.data.last_name}</span>
                                            <span style={{ color: "#73615F" }}>|</span>
                                            <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                                                <Image src="/images/icons/call.svg" alt="call" width={18} height={18} />&nbsp;{managerItem.data.phone_number || managerItem.data.phone}
                                            </span>
                                            <span style={{ color: "#73615F" }}>|</span>
                                            <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                                                <Image src="/images/icons/email.svg" alt="email" width={18} height={18} />&nbsp;{managerItem.data.email}
                                            </span>
                                        </div>
                                        <button type="button" className='ms-auto' onClick={() => handleManagerRemove(managerItem.id)}
                                            style={{ background: "none", border: "none", marginLeft: "12px", cursor: "pointer" }}>
                                            <Image src="/images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <hr />
                    </div>

                    {/* Property Caretaker */}
                    <div className='comapny-information-box'>
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className='mb-4'>Property caretaker</h4>
                            <Image src="/images/icons/add_circle.svg" className="img-fluid mb-3" alt="add" width={24} height={24} onClick={handleAddCaretaker} style={{ cursor: "pointer" }} />
                        </div>

                        {caretakers.map((caretakerItem) => (
                            <div key={caretakerItem.id} className="form-group mb-2" style={{ position: "relative" }}>
                                {!caretakerItem.data ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control user-icn2"
                                            placeholder="Add property caretaker"
                                            onFocus={() => setShowCaretakerList(caretakerItem.id)}
                                            onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
                                            onChange={(e) => setSearchCaretacker(e.target.value)}
                                        />
                                        {showCaretakerList === caretakerItem.id && (
                                            <div style={{ position: "absolute", top: "58px", left: 0, right: 0, background: "#f9f6f4", border: "1px solid #6B4F3F", borderRadius: "0px", zIndex: 10, padding: "16px" }}>
                                                {CaretakerList
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
                                                                src={caretaker.profile_image ? (caretaker.profile_image.startsWith("http") ? caretaker.profile_image : `${caretaker.profile_image}`) : '/images/icons/No-Image.svg'}
                                                                alt={caretaker.first_name || caretaker.name || ''}
                                                                width={48} height={48}
                                                                style={{ borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
                                                                onError={(e) => { e.target.src = '/images/icons/No-Image.svg'; }}
                                                            />
                                                            <div>
                                                                <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                    {caretaker.first_name} {caretaker.last_name}
                                                                    {caretaker.you && <span style={{ fontWeight: 400, color: "#73615F" }}> (You)</span>}
                                                                </div>
                                                                <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ display: "flex", alignItems: "center", background: "#f9f6f4", border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px", padding: "12px 16px", marginBottom: "8px", marginTop: "15px" }}>
                                        <Image
                                            src={caretakerItem.data.profile_image ? (caretakerItem.data.profile_image.startsWith("http") ? caretakerItem.data.profile_image : `${caretakerItem.data.profile_image}`) : '/images/icons/No-Image.svg'}
                                            alt={caretakerItem.data.first_name || caretakerItem.data.name || ''}
                                            width={48} height={48}
                                            style={{ borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
                                        />
                                        <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
                                            <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                {caretakerItem.data.first_name} {caretakerItem.data.last_name}
                                                {caretakerItem.data.you && <span style={{ fontWeight: 400, color: "#73615F" }}> (You)</span>}
                                            </span>
                                            <span style={{ color: "#73615F" }}>|</span>
                                            <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                                                <Image src="/images/icons/call.svg" alt="call" width={18} height={18} />{caretakerItem.data.phone_number || caretakerItem.data.phone || ''}
                                            </span>
                                            <span style={{ color: "#73615F" }}>|</span>
                                            <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                                                <Image src="/images/icons/email.svg" alt="email" width={18} height={18} />{caretakerItem.data.email}
                                            </span>
                                        </div>
                                        <button type="button" className='ms-auto' onClick={() => handleCaretakerRemove(caretakerItem.id)}
                                            style={{ background: "none", border: "none", marginLeft: "12px", cursor: "pointer" }}>
                                            <Image src="/images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <hr />
                    </div>

                    {/* Operations Manager */}
                    <div className='comapny-information-box'>
                        <h4 className='mb-4'>Operations manager</h4>
                        <p>Operations managers contact details</p>

                        <div className='form-group mb-3'>
                            <label>Name of the person who should contacted in case of emergency</label>
                            <input type='text' name="operationsManagerName" value={formData?.operationsManagerName || ''} onChange={handleInputChange} className='form-control' placeholder='Rahman' />
                        </div>

                        <div className='form-group mb-3'>
                            <label>{`Contact person's email`}</label>
                            <input type='email' name="operationsManagerEmail" value={formData?.operationsManagerEmail || ''} onChange={handleInputChange} className='form-control' placeholder='slb.residences@casamelhor.in' />
                        </div>

                        <div className='form-group mb-3'>
                            <label>{`Contact person's phone number`}</label>
                            <input type='tel' name="operationsManagerPhone" value={formData?.operationsManagerPhone || ''} onChange={handleInputChange} className='form-control' placeholder='7002957749' />
                        </div>

                        <div className='form-group mb-3'>
                            <label>Contact alternate phone number (optional)</label>
                            <input type='tel' name="operationsManagerAlternatePhone" value={formData?.operationsManagerAlternatePhone || ''} onChange={handleInputChange} className='form-control' placeholder='e.x. +91 4323545464' />
                        </div>

                        <div className="manager-pic">
                            <label className="mb-2">{`Contact person's photo`}</label>
                            <div className='upload-photo' style={{ maxWidth: '214px', position: 'relative' }}>
                                <Image
                                    src={file ? file : '/images/icons/No-Image.svg'}
                                    className='img-fluid'
                                    alt='profile'
                                    width={214}
                                    height={214}
                                    style={{ objectFit: 'cover' }}
                                />
                                <span className='more-action' onClick={togglePicOption}>
                                    <Image src='/images/icons/more-dots-3.svg' className='img-fluid' alt='more' width={24} height={24} />
                                </span>
                                <ul className={`picoption ${isOpen ? "active" : ""}`}>
                                    <li onClick={changepicModal}><Link href={''}>Change Photo</Link></li>
                                    <li onClick={removeFile}><Link href='#'>Delete</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className='d-flex mt-2 gap-3'>
                            <Button variant="" className='edit-btn' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={() => setIsEditManage(false)}>
                                Cancel
                            </Button>
                            <Button variant="" className='complete-form-btn' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={handleUpload} disabled={saveLoading}>
                                {saveLoading ? (<><Spinner animation="border" size="sm" className="me-2" />Saving...</>) : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Change Photo Modal */}
            <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal'>
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0'>
                    <Modal.Title>Upload photo</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <p className='border-bottom pb-4'>Please upload Operations managers photo</p>
                    <div className="drap-drop-box-full">
                        {!file ? (
                            <label onDrop={handleDrop} onDragOver={handleDragOver}
                                className="border-2 border-dashed border-gray-300 rounded-md h-48 flex flex-col items-center justify-center cursor-pointer"
                                style={{ borderColor: '#6B4F3F' }}>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                <div className="text-center">
                                    <Image src="/images/icons/photo-library.svg" alt="Upload" width={30} height={30} className="mx-auto mb-2" />
                                    <p className="font-medium mb-0" style={{ color: '#463527' }}>Drag and drop</p>
                                    <p className="text-sm mb-0" style={{ color: '#73615F' }}>or click here to choose file.</p>
                                    <p className="text-xs mt-2" style={{ color: '#999' }}>Max file size: 5MB</p>
                                </div>
                            </label>
                        ) : (
                            <div className="relative inline-block">
                                <Image src={file} alt="Uploaded preview" width={250} height={250} className="rounded-md object-cover" />
                                <button onClick={removeFile} className="absolute delete-icn"
                                    style={{ top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '5px' }}>
                                    <Image src="/images/icons/delete.svg" className='img-fluid' width={20} height={20} alt='delete' />
                                </button>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between'>
                    <Button variant="" onClick={changepicClose} className='btn-company-add' style={{ padding: '13px 25px', borderRadius: '0' }}>Cancel</Button>
                    <Button variant="" onClick={uploadOperationManagerImage} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }} disabled={!file}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}