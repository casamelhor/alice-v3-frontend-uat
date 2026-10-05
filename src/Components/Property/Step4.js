// "use client"
// import { CreateRoomAPI, CreateRoomPhotosAPI, UpdateRoomDetailAPI, PropertyRoomDetailAPI, PropertyRoomListAPI, RoomsPhotoListAPI, SetRoomCoverPhotoAPI, DeleteRoomPhotoAPI, WizardStepUpdateAPI } from '@/services/provider';
// import { alert_danger, alert_info, alert_success } from '@/utils/Alerts/TostifyAlerts';
// import { getItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
// import { useRouter } from 'next/navigation';
// import React from 'react'
// import { useEffect, useState } from "react";
// import { Button, Col, Container, Row, Image, Modal, Form } from 'react-bootstrap'
// import Select, { components } from 'react-select';
// // import { ToastContainer } from 'react-toastify';

// export default function Step4({ step4Data, setStep4Data, propertyRole, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, draft }) {
//     // const property = JSON.parse(getItemLocalStorage("properyItem"));
//     const router = useRouter();
//     const [errors, setErrors] = useState({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [existingRooms, setExistingRooms] = useState([]);
//     const [mode, setMode] = useState('create');
//     const [photoFile, setPhotoFile] = useState([]);
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
//     }, [activeStep]);


//     const chooseBeds = [
//         {
//             value: "single-bed",
//             label: "Single Bed",
//             icon: "./images/icons/single_bed.svg"
//         },
//         {
//             value: "double-bed",
//             label: "Double Bed",
//             icon: "./images/icons/double-bed.svg"
//         },
//         {
//             value: "Queen-bed",
//             label: "Queen Bed",
//             icon: "./images/icons/double-bed.svg"
//         },
//         {
//             value: "King-bed",
//             label: "King Bed",
//             icon: "./images/icons/king_bed.svg"
//         },
//         {
//             value: "super-king-bed",
//             label: "Super King Bed",
//             icon: "./images/icons/king_bed.svg"
//         },
//         {
//             value: "Sofa Bed",
//             label: "Sofa Bed",
//             icon: "./images/icons/sofa-bed.svg"
//         },
//     ];

//     const chooseBedprefrence = [
//         { value: "Male", label: "Male" },
//         { value: "Female", label: "Female" },
//         { value: "None", label: "None" },
//     ];

//     const amenities = [
//         { icon: "./images/icons/ac.svg", label: "Air conditioning" },
//         { icon: "./images/icons/concierge.svg", label: "Concierge" },
//         { icon: "./images/icons/fitness_center.svg", label: "Fitness center" },
//         { icon: "./images/icons/wifi.svg", label: "Free internet access" },
//         { icon: "./images/icons/local_parking.svg", label: "Free parking" },
//         { icon: "./images/icons/interpreter.svg", label: "Meeting facilities" }
//     ];


//     const [selectedType, setSelectedType] = useState(null);
//     const [amenitySearch, setAmenitySearch] = useState('');
//     const [showAmenitySearch, setShowAmenitySearch] = useState(false);
//     const [changepicsModal1, changepisetShow1] = useState(false);
//     const [photoIndex, setPhotoIndex] = useState(null);


//     useEffect(() => {
//         const initializeData = async () => {
//             if (property?.uid) {
//                 await fetchExistingRooms();
//             } else if (step4Data.length === 0) {
//                 setStep4Data([getDefaultRoomData()]);
//             }
//         };
//         initializeData();
//     }, [mode, property?.uid]);


//     // const fetchRoomPhotosList = async (id) => {
//     //     try {
//     //         const response = await RoomsPhotoListAPI(id);
//     //         if (response?.data?.success) {
//     //             const photos = response.data.response.sort((a, b) => a.id - b.id).map(item => ({
//     //                 uid: item.uid,
//     //                 is_room_cover_photo: item.is_room_cover_photo,                    
//     //                 room_photo_display_order: item.room_photo_display_order,
//     //                 room_photo_url: item.room_photo_url
//     //             }));
//     //             setPhotoFile(photos)
//     //         }
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // }

//     // const fetchExistingRooms = async () => {
//     //     try {
//     //         setIsLoading(true);
//     //         const response = await PropertyRoomListAPI(property?.uid);
//     //         if (response?.data?.success) {
//     //             setMode(response.data.response.length > 0 ? 'edit' : 'create')
//     //             const rooms = response.data.response.sort((a, b) => a.id - b.id).map(room => ({
//     //                 uid: room.uid,
//     //                 room_name: room.room_name || '',
//     //                 room_type: room.room_type || '',
//     //                 room_size_sqft: room.room_size_sqft || '',
//     //                 beds: room.beds?.length > 0
//     //                     ? room.beds.map(bed => ({
//     //                         type: chooseBeds.find(b => b.value === bed.type) || chooseBeds[0],
//     //                         name: bed.name || ''
//     //                     }))
//     //                     : [{ type: chooseBeds[0], name: '' }],
//     //                 bathrooms: room.bathrooms || 1,
//     //                 bedroom_preference: room.bedroom_preference || '',
//     //                 max_guests: room.max_guests || 1,
//     //                 avg_base_price_per_night: room.avg_base_price_per_night || '',
//     //                 room_description: room.room_description || '',
//     //                 room_amenities: room.room_amenities || [],
//     //                 roomPhotos: room.room_photos?.map(photo => ({
//     //                     file: null,
//     //                     preview: photo.room_photo_url,
//     //                     name: `existing_${photo.uid}`,
//     //                     size: 0,
//     //                     isExisting: true,
//     //                     uid: photo.uid
//     //                 })) || [],
//     //                 collapsed: false
//     //             }));
//     //             response.data.response.sort((a, b) => a.id - b.id).map((item) => {
//     //                 fetchRoomPhotosList(item?.uid)
//     //             })
//     //             setStep4Data(rooms);
//     //             setExistingRooms(rooms);
//     //         } else {
//     //             if (step4Data.length === 0) {
//     //                 setStep4Data([getDefaultRoomData()]);
//     //             }
//     //         }
//     //     } catch (error) {
//     //         console.error("Error fetching rooms:", error);
//     //         alert_danger("Failed to load existing rooms");
//     //         if (step4Data.length === 0) {
//     //             setStep4Data([getDefaultRoomData()]);
//     //         }
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // };

//     const fetchRoomPhotosList = async (id) => {
//         try {
//             const response = await RoomsPhotoListAPI(id);
//             if (response?.data?.success) {
//                 const photos = response.data.response
//                     .sort((a, b) => a.id - b.id)
//                     .map(item => ({
//                         uid: item.uid,
//                         is_room_cover_photo: item.is_room_cover_photo,
//                         room_photo_display_order: item.room_photo_display_order,
//                         room_photo_url: item.room_photo_url
//                     }));
//                 return { roomId: id, photos }; // Return object with roomId and photos
//             }
//             return { roomId: id, photos: [] };
//         } catch (error) {
//             console.log(`Error fetching photos for room ${id}:`, error);
//             return { roomId: id, photos: [] };
//         }
//     };

//     // const fetchExistingRooms = async () => {
//     //     try {
//     //         setIsLoading(true);
//     //         const response = await PropertyRoomListAPI(property?.uid);

//     //         if (response?.data?.success) {
//     //             if (response.data.response.length > 0) {
//     //                 setMode('edit');
//     //                 const sortedRooms = response.data.response.sort((a, b) => a.id - b.id);
//     //                 // Map rooms data
//     //                 const rooms = sortedRooms.map(room => ({
//     //                     uid: room.uid,
//     //                     room_name: room.room_name || '',
//     //                     room_type: room.room_type || '',
//     //                     room_size_sqft: room.room_size_sqft || '',
//     //                     beds: room.beds?.length > 0
//     //                         ? room.beds.map(bed => ({
//     //                             type: chooseBeds.find(b => b.value === bed.type) || chooseBeds[0],
//     //                             name: bed.name || ''
//     //                         }))
//     //                         : [{ type: chooseBeds[0], name: '' }],
//     //                     bathrooms: room.bathrooms || 1,
//     //                     bedroom_preference: room.bedroom_preference || '',
//     //                     max_guests: room.max_guests || 1,
//     //                     avg_base_price_per_night: room.avg_base_price_per_night || '',
//     //                     room_description: room.room_description || '',
//     //                     room_amenities: room.room_amenities || [],
//     //                     roomPhotos: room.room_photos?.map(photo => ({
//     //                         file: null,
//     //                         preview: photo.room_photo_url,
//     //                         name: `existing_${photo.uid}`,
//     //                         size: 0,
//     //                         isExisting: true,
//     //                         uid: photo.uid
//     //                     })) || [],
//     //                     collapsed: false
//     //                 }));

//     //                 // Fetch photos for all rooms in parallel
//     //                 const photoPromises = sortedRooms.map(room => fetchRoomPhotosList(room.uid));
//     //                 const photosResults = await Promise.all(photoPromises);

//     //                 // Format as requested: [{photos: [...]}, {photos: [...]}]
//     //                 const formattedPhotos = photosResults.map(result => ({
//     //                     photos: result.photos
//     //                 }));

//     //                 // Set the aggregated photos
//     //                 setPhotoFile(formattedPhotos);

//     //                 // Set the rooms data
//     //                 setStep4Data(rooms);
//     //                 setExistingRooms(rooms);
//     //             } else {
//     //                 setMode('create');
//     //                 setStep4Data([getDefaultRoomData()]);
//     //                 setExistingRooms([getDefaultRoomData()]);
//     //             }
//     //             // setMode(response.data.response.length > 0 ? 'edit' : 'create');
//     //         } else {
//     //             if (step4Data.length === 0) {
//     //                 setStep4Data([getDefaultRoomData()]);
//     //             }
//     //         }
//     //     } catch (error) {
//     //         console.error("Error fetching rooms:", error);
//     //         alert_danger("Failed to load existing rooms");
//     //         if (step4Data.length === 0) {
//     //             setStep4Data([getDefaultRoomData()]);
//     //         }
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // };

//     const fetchExistingRooms = async () => {
//         try {
//             setIsLoading(true);
//             const response = await PropertyRoomListAPI(property?.uid);

//             if (response?.data?.success) {
//                 if (response.data.response.length > 0) {
//                     setMode('edit');
//                     const sortedRooms = response.data.response.sort((a, b) => a.id - b.id);

//                     // Fetch photos for all rooms in parallel BEFORE mapping rooms
//                     const photoPromises = sortedRooms.map(room => fetchRoomPhotosList(room.uid));
//                     const photosResults = await Promise.all(photoPromises);

//                     // Format photos as requested: [{photos: [...]}, {photos: [...]}]
//                     const formattedPhotos = photosResults.map(result => ({
//                         photos: result.photos
//                     }));

//                     // Set the aggregated photos
//                     setPhotoFile(formattedPhotos);

//                     // Map rooms data with photos from the parallel fetch
//                     const rooms = sortedRooms.map((room, index) => ({
//                         uid: room.uid,
//                         room_name: room.room_name || '',
//                         room_type: room.room_type || '',
//                         room_size_sqft: room.room_size_sqft || '',
//                         beds: room.beds?.length > 0
//                             ? room.beds.map(bed => ({
//                                 bed_type: chooseBeds.find(b => b.value === bed.bed_type) || chooseBeds[0],
//                                 name: bed.name || ''
//                             }))
//                             : [{ bed_type: chooseBeds[0], name: '' }],
//                         bathrooms: room.bathrooms || 1,
//                         bedroom_preference: room.bedroom_preference || '',
//                         max_guests: room.max_guests || 1,
//                         avg_base_price_per_night: room.avg_base_price_per_night || '',
//                         room_description: room.room_description || '',
//                         room_amenities: room.room_amenities || [],
//                         roomPhotos: photosResults[index]?.photos?.map(photo => ({
//                             file: null,
//                             preview: photo.room_photo_url,
//                             name: `existing_${photo.uid}`,
//                             is_room_cover_photo: photo.is_room_cover_photo,
//                             size: 0,
//                             isExisting: true,
//                             uid: photo.uid
//                         })) || [],
//                         collapsed: false
//                     }));

//                     // Set the rooms data
//                     setStep4Data(rooms);
//                     setExistingRooms(rooms);
//                 } else {
//                     setMode('create');
//                     setStep4Data([getDefaultRoomData()]);
//                     setExistingRooms([getDefaultRoomData()]);
//                 }
//             } else {
//                 if (step4Data.length === 0) {
//                     setStep4Data([getDefaultRoomData()]);
//                 }
//             }
//         } catch (error) {
//             console.error("Error fetching rooms:", error);
//             alert_danger("Failed to load existing rooms");
//             if (step4Data.length === 0) {
//                 setStep4Data([getDefaultRoomData()]);
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getDefaultRoomData = () => ({
//         room_name: '',
//         room_type: '',
//         room_size_sqft: '',
//         beds: [{ bed_type: chooseBeds[0], name: '' }],
//         bathrooms: 1,
//         bedroom_preference: '',
//         max_guests: 1,
//         avg_base_price_per_night: '',
//         room_description: '',
//         room_amenities: [],
//         roomPhotos: [],
//         collapsed: false
//     });

//     const handleInputChange = (idx, field, value) => {
//         setStep4Data(prev => {
//             const updated = [...prev];
//             updated[idx] = {
//                 ...updated[idx],
//                 [field]: value
//             };
//             return updated;
//         });
//     };

//     const validate = () => {
//         const newErrors = {};

//         step4Data.forEach((room, idx) => {
//             const roomErr = {};

//             if (!room.room_name?.trim()) roomErr.room_name = "Room name is required";
//             if (!room.room_type) roomErr.room_type = "Room type is required";
//             if (!room.room_size_sqft) roomErr.room_size_sqft = "Room size is required";
//             if (!room.avg_base_price_per_night) roomErr.avg_base_price_per_night = "Nightly price is required";
//             if (!room.room_description?.trim()) roomErr.room_description = "Room description is required";

//             if (Object.keys(roomErr).length > 0) newErrors[idx] = roomErr;
//         });

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };


//     const CustomOption = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image
//                         src={props.data.icon}
//                         alt={props.data.label}
//                         width={20}
//                         height={20}
//                     />
//                     <span>{props.data.label}</span>
//                 </div>
//                 {props.isSelected && (
//                     <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
//                 )}
//             </div>
//         </components.Option>
//     );

//     const CustomSingleValue = (props) => (
//         <components.SingleValue {...props}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <Image
//                     src={props.data.icon}
//                     alt={props.data.label}
//                     width={20}
//                     height={20}
//                 />
//                 <span>{props.data.label}</span>
//             </div>
//         </components.SingleValue>
//     );

//     const customStyles = {
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected
//                 ? "#4635271F"
//                 : state.isFocused
//                     ? "#4635271F"
//                     : "inherit",
//             color: state.isSelected ? "#000" : "black",
//             cursor: "pointer",
//         }),
//     };


//     const handleAddProperty = () => {
//         setStep4Data(prev => [
//             ...prev,
//             getDefaultRoomData()
//         ]);
//     };

//     const handleDeleteProperty = async (idx) => {
//         if (step4Data.length > 1) {
//             const roomToDelete = step4Data[idx];

//             if (mode === 'edit' && roomToDelete.uid) {
//                 if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
//                     try {
//                         setStep4Data(prev => prev.filter((_, i) => i !== idx));
//                         alert_info("Room removed successfully");
//                     } catch (error) {
//                         alert_danger("Failed to delete room");
//                         return;
//                     }
//                 }
//             } else {
//                 setStep4Data(prev => prev.filter((_, i) => i !== idx));
//             }
//         } else {
//             alert_danger("At least one room is required");
//         }
//     };

//     const handleCollapseProperty = (idx) => {
//         setStep4Data(prev => prev.map((prop, i) =>
//             i === idx ? { ...prop, collapsed: !prop.collapsed } : prop
//         ));
//     };


//     const handleGuestChange = (idx, delta) => {
//         const newCount = Math.max(1, (step4Data[idx]?.bathrooms || 1) + delta);
//         handleInputChange(idx, 'bathrooms', newCount);
//     };

//     const handleGuestChange1 = (idx, delta) => {
//         const newCount = Math.max(1, (step4Data[idx]?.max_guests || 1) + delta);
//         handleInputChange(idx, 'max_guests', newCount);
//     };


//     const handleAmenitySelect = (idx, label) => {
//         const currentAmenities = step4Data[idx]?.room_amenities || [];
//         const newAmenities = currentAmenities.includes(label)
//             ? currentAmenities.filter(l => l !== label)
//             : [...currentAmenities, label];

//         handleInputChange(idx, 'room_amenities', newAmenities);
//     };

//     const filteredAmenities = amenities.filter(a =>
//         a.label.toLowerCase().includes(amenitySearch.toLowerCase())
//     );


//     const changepicClose1 = () => {
//         changepisetShow1(false);
//         setPhotoIndex(null);
//     };

//     const changepicModal1 = (idx) => {
//         setPhotoIndex(idx);
//         changepisetShow1(true);
//     };

//     const MAX_PHOTOS = 5;

//     // const handleFileChange1 = (idx, e) => {
//     //     const newFiles = Array.from(e.target.files);

//     //     setStep4Data(prev => {
//     //         const updated = [...prev];
//     //         const existing = updated[idx]?.roomPhotos || [];
//     //         const existingFiles = existing.filter(photo => !photo.isExisting);
//     //         const existingPhotos = existing.filter(photo => photo.isExisting);

//     //         const uniqueFiles = newFiles.filter(newFile =>
//     //             !existingFiles.some(existingFile =>
//     //                 existingFile.name === newFile.name && existingFile.size === newFile.size
//     //             )
//     //         ).slice(0, MAX_PHOTOS - existing.length);


//     //         const filesWithPreview = uniqueFiles.map(file => ({
//     //             file,
//     //             preview: URL.createObjectURL(file),
//     //             name: file.name,
//     //             size: file.size,
//     //             isExisting: false
//     //         }));

//     //         updated[idx].roomPhotos = [...existingPhotos, ...filesWithPreview];
//     //         return updated;
//     //     });
//     // };
//     const handleFileChange1 = (idx, e) => {
//         const newFiles = Array.from(e.target.files);

//         setStep4Data(prev => {
//             const updated = [...prev];

//             if (!updated[idx]) {
//                 return prev;
//             }


//             updated[idx] = { ...updated[idx] };


//             updated[idx].roomPhotos = updated[idx].roomPhotos || [];

//             const existing = updated[idx].roomPhotos;
//             const existingFiles = existing.filter(photo => !photo.isExisting);
//             const existingPhotos = existing.filter(photo => photo.isExisting);


//             const availableSlots = MAX_PHOTOS - existing.length;

//             if (availableSlots <= 0) {
//                 return updated;
//             }


//             const uniqueFiles = newFiles.filter(newFile => {

//                 return !existingFiles.some(existingFile => {

//                     return existingFile.name === newFile.name &&
//                         existingFile.size === newFile.size;
//                 });
//             }).slice(0, availableSlots);


//             const filesWithPreview = uniqueFiles.map(file => ({
//                 file,
//                 preview: URL.createObjectURL(file),
//                 name: file.name,
//                 size: file.size,
//                 isExisting: false,
//                 is_room_cover_photo: false,
//                 id: Date.now() + Math.random()
//             }));


//             updated[idx].roomPhotos = [...existingPhotos, ...existingFiles, ...filesWithPreview];

//             return updated;
//         });


//         e.target.value = '';
//     };

//     const handleDragOver1 = (e) => e.preventDefault();

//     const removePhoto = async (id) => {
//         // setStep4Data(prev => {
//         //     const updated = [...prev];
//         //     const photoToRemove = updated[roomIdx].roomPhotos[photoIdx];


//         //     if (photoToRemove.isExisting) {
//         //         updated[roomIdx].roomPhotos = updated[roomIdx].roomPhotos.map((photo, idx) =>
//         //             idx === photoIdx ? { ...photo, markedForDeletion: true } : photo
//         //         );
//         //     } else {

//         //         if (photoToRemove.preview) {
//         //             URL.revokeObjectURL(photoToRemove.preview);
//         //         }
//         //         updated[roomIdx].roomPhotos = updated[roomIdx].roomPhotos.filter((_, i) => i !== photoIdx);
//         //     }
//         //     return updated;
//         // });
//         try {
//             const response = await DeleteRoomPhotoAPI(id);
//             if (response?.data?.success) {
//                 alert_success(response.data.response.message)
//                 fetchExistingRooms();
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const makeCoverPhoto = async (id) => {
//         try {
//             const response = await SetRoomCoverPhotoAPI(id);
//             if (response?.data?.success) {
//                 alert_success(response.data.response.message)
//                 fetchExistingRooms();
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     const makeCoverPhotoLocal = (roomIdx, photoIndex) => {        
//         setStep4Data(prev => {
//             const updated = [...prev];
//             const updatedPhotos = updated[roomIdx].roomPhotos.map((photo, idx) => ({
//                 ...photo,
//                 is_room_cover_photo: idx === photoIndex
//             }));
//             updated[roomIdx].roomPhotos = updatedPhotos;
//             return updated;
//         });
//     }


//     const handleBedChange = (roomIdx, bedIdx, field, value) => {
//         setStep4Data(prev => {
//             const updated = [...prev];
//             const updatedBeds = [...updated[roomIdx].beds];
//             updatedBeds[bedIdx] = { ...updatedBeds[bedIdx], [field]: value };
//             updated[roomIdx].beds = updatedBeds;
//             return updated;
//         });
//     };

//     const handleAddBed = (roomIdx) => {
//         setStep4Data(prev => {
//             const updated = [...prev];
//             updated[roomIdx].beds = [...updated[roomIdx].beds, { bed_type: chooseBeds[0], name: '' }];
//             return updated;
//         });
//     };

//     const handleRemoveBed = (roomIdx, bedIdx) => {
//         if (step4Data[roomIdx]?.beds.length > 1) {
//             setStep4Data(prev => {
//                 const updated = [...prev];
//                 updated[roomIdx].beds = updated[roomIdx].beds.filter((_, i) => i !== bedIdx);
//                 return updated;
//             });
//         }
//     };


//     const handleRoomPhotos = async (roomId, index) => {
//         try {
//             const room = step4Data[index];
//             const newPhotos = room.roomPhotos.filter(photo => !photo.isExisting && !photo.markedForDeletion);
//             const photosToDelete = room.roomPhotos.filter(photo => photo.isExisting && photo.markedForDeletion);


//             if (newPhotos.length > 0) {
//                 const fieldData = new FormData();
//                 fieldData.append("room", roomId);

//                 newPhotos.forEach((fileObj, fileIndex) => {
//                     fieldData.append(`room_photo_url[${fileIndex}]`, fileObj.file);
//                 });

//                 const response = await CreateRoomPhotosAPI(fieldData);
//                 if (!response?.data?.success) {
//                     throw new Error("Failed to upload room photos");
//                 } else {
//                     const isCoverPhoto = room?.roomPhotos?.some(photo => photo.is_room_cover_photo === true);
//                     if (!isCoverPhoto) {
//                         makeCoverPhoto(response?.data?.response?.[0]?.uid)
//                     }
//                 }
//             }


//             // if (photosToDelete.length > 0) {
//             //   for (const photo of photosToDelete) {
//             //     await DeleteRoomPhotoAPI(photo.uid);
//             //   }
//             // }

//             return true;
//         } catch (error) {
//             console.log(error);
//             alert_danger("Failed to upload room photos");
//             throw error;
//         }
//     };


//     const handleSubmit = async (flag) => {
//         // e.preventDefault();
//         setSaveExit(false)
//         assignmentRemoveClose();
//         setIsLoading(true);

//         if (validate()) {
//             try {
//                 if (mode === 'create') {
//                     const payload = {
//                         property: property?.uid,
//                         rooms: step4Data.map(room => ({
//                             room_name: room.room_name,
//                             room_type: room.room_type,
//                             room_size_sqft: room.room_size_sqft,
//                             beds: room.beds.map(bed => ({
//                                 bed_type: bed.bed_type?.value,
//                                 name: bed.name
//                             })),
//                             bathrooms: room.bathrooms,
//                             bedroom_preference: room.bedroom_preference,
//                             max_guests: room.max_guests,
//                             avg_base_price_per_night: room.avg_base_price_per_night,
//                             room_description: room.room_description,
//                             room_amenities: room.room_amenities
//                         }))
//                     };

//                     const response = await CreateRoomAPI(JSON.stringify(payload));

//                     if (response?.data?.success) {
//                         setItemLocalStorage("roomItem", JSON.stringify(response.data.response));

//                         const uploadPromises = response.data.response.map((item, index) =>
//                             handleRoomPhotos(item?.uid, index)
//                         );

//                         await Promise.all(uploadPromises);
//                         alert_success("Rooms created successfully!");
//                         setActiveStep(activeStep + 1);
//                     } else {
//                         if (response.data.response) {
//                             const dynamicKey = Object.keys(response.data.response)[0];
//                             const message = response.data.response[dynamicKey].join('\n');
//                             alert_danger(message)
//                         } else {
//                             const dynamicKey = Object.keys(response.data.response)[0];
//                             const message = response.data.response[dynamicKey].join('\n');
//                             alert_danger(message)
//                         }
//                     }
//                 } else {
//                     const updatePromises = step4Data.map(async (room, index) => {
//                         const roomPayload = {
//                             room_name: room.room_name,
//                             room_type: room.room_type,
//                             room_size_sqft: room.room_size_sqft,
//                             beds: room.beds.map(bed => ({
//                                bed_type: bed.bed_type?.value,
//                                 name: bed.name
//                             })),
//                             bathrooms: room.bathrooms,
//                             bedroom_preference: room.bedroom_preference,
//                             max_guests: room.max_guests,
//                             avg_base_price_per_night: room.avg_base_price_per_night,
//                             room_description: room.room_description,
//                             room_amenities: room.room_amenities
//                         };

//                         if (room.uid) {
//                             const response = await UpdateRoomDetailAPI(room.uid, JSON.stringify(roomPayload));
//                             if (response?.data?.success) {
//                                 await handleRoomPhotos(room.uid, index);
//                                 return response.data.response;
//                             } else {
//                                 // throw new Error(`Failed to update room ${index + 1}`);
//                                 const dynamicKey = Object.keys(response.data.response)[0];
//                                 const message = response.data.response[dynamicKey].join('\n');
//                                 alert_danger(message)
//                             }
//                         } else {
//                             const createResponse = await CreateRoomAPI(JSON.stringify({
//                                 property: property?.uid,
//                                 rooms: [roomPayload]
//                             }));
//                             if (createResponse?.data?.success) {
//                                 const newRoom = createResponse.data.response[0];
//                                 await handleRoomPhotos(newRoom.uid, index);
//                                 return newRoom;
//                             } else {
//                                 throw new Error(`Failed to create new room ${index + 1}`);
//                             }
//                         }
//                     });

//                     const updatedRooms = await Promise.all(updatePromises);
//                     setItemLocalStorage("roomItem", JSON.stringify(updatedRooms));
//                     alert_success("Rooms updated successfully!");
//                     if (flag == "exit") {
//                         const wizard = new FormData();
//                         wizard.append("wizard_step_completed", activeStep)
//                         await WizardStepUpdateAPI(property?.uid, wizard)
//                         router.push("/PropertyListing")
//                     } else {
//                         setActiveStep(activeStep + 1);
//                     }
//                 }
//             } catch (error) {
//                 console.error("Submission error:", error);
//                 alert_danger(mode === 'create' ? "Failed to create rooms" : "Failed to update rooms");
//             }
//         } else {
//             const firstErrorIndex = Object.keys(errors)[0];
//             if (firstErrorIndex) {
//                 const element = document.querySelector(`[data-room-index="${firstErrorIndex}"]`);
//                 if (element) {
//                     element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                 }
//             }
//         }
//         setIsLoading(false);
//     };

//     useEffect(() => {
//         if (saveExit && activeStep == 4) {
//             handleSubmit('exit')
//         }
//     }, [saveExit])

//     if (isLoading && mode === 'edit' && step4Data.length === 0) {
//         return (
//             <Container>
//                 <div className="text-center py-5">
//                     <div>Loading rooms...</div>
//                 </div>
//             </Container>
//         );
//     }

//     console.log(step4Data, photoFile)
//     return (
//         <>
//             <Container>
//                 {/* <ToastContainer /> */}
//                 <Row>
//                     <Col md={8}>
//                         <div className='box-input'>
//                             <h3 className='page-title mb-4'>
//                                 {mode === 'create' ? 'Set up your rooms' : 'Update your rooms'}
//                                 <small className="ms-2" style={{ fontSize: '14px', color: '#666' }}>
//                                     ({mode === 'create' ? 'Create Mode' : 'Edit Mode'})
//                                 </small>
//                             </h3>

//                             {/* <Form onSubmit={handleSubmit}> */}
//                             {step4Data.map((property, idx) => (
//                                 <div className='assign-property-box mt-5' key={property.uid || idx} data-room-index={idx}>
//                                     {/* Room Header */}
//                                     <div className='pb-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                         <p style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }}>
//                                             {`Bedroom ${idx + 1}`}
//                                             {property.uid && <small style={{ color: '#666', marginLeft: '10px' }}>(Existing)</small>}
//                                         </p>
//                                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                                             <span
//                                                 className="d-flex align-items-center me-4"
//                                                 style={{ cursor: 'pointer', color: '#463527', fontWeight: 500 }}
//                                                 onClick={() => handleCollapseProperty(idx)}
//                                             >
//                                                 {property.collapsed ? 'Expand' : 'Collapse'}
//                                                 <Image
//                                                     src='/images/icons/top-arrow.svg'
//                                                     width={18}
//                                                     height={18}
//                                                     alt={property.collapsed ? 'Expand' : 'Collapse'}
//                                                     style={{ transform: property.collapsed ? 'rotate(180deg)' : 'none', marginLeft: '6px' }}
//                                                 />
//                                             </span>
//                                             {step4Data.length > 1 && (
//                                                 <Button
//                                                     variant="outline"
//                                                     style={{ border: '1px solid #463527', background: 'none', padding: '8px', borderRadius: '0', width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//                                                     onClick={() => handleDeleteProperty(idx)}
//                                                 >
//                                                     <Image src='/images/icons/delete_b.svg' width={20} height={20} alt='Delete' />
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <p className="mt-2 mb-2" style={{ border: '1px solid rgb(70, 53, 39)' }}> </p>

//                                     {!property.collapsed && (
//                                         <div className='add-propertu-assign mt-4 p-4' style={{ border: '1px solid #4635271F' }}>
//                                             <Row>
//                                                 <Col md={12}>
//                                                     {/* Room Name */}
//                                                     <div className='form-group mb-4'>
//                                                         <p className='font-18' style={{ color: '#73615F' }}>Room name <span style={{ color: '#f00' }}>*</span></p>
//                                                         <input
//                                                             type='text'
//                                                             name="room_name"
//                                                             className={`form-control ${errors[idx]?.room_name ? 'is-invalid' : ''}`}
//                                                             placeholder='e.g 1 King bed with balcony bay view'
//                                                             value={property.room_name || ''}
//                                                             onChange={(e) => handleInputChange(idx, 'room_name', e.target.value)}
//                                                         />
//                                                         {errors[idx]?.room_name && (
//                                                             <div className="invalid-feedback d-block">
//                                                                 {errors[idx]?.room_name}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     <hr />

//                                                     {/* Room Type */}
//                                                     <div className='form-group mb-4'>
//                                                         <p className='font-18' style={{ color: '#73615F' }}>Classify room type <span style={{ color: '#f00' }}>*</span></p>
//                                                         <Row className='mb-2'>
//                                                             <Col md={6}>
//                                                                 <div className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }}>
//                                                                     <label className="form-check-label d-flex gap-2 mb-0" htmlFor={`shared-radio-${idx}`}>
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`room_type_${idx}`}
//                                                                             id={`shared-radio-${idx}`}
//                                                                             checked={property.room_type === 'Twin-Sharing'}
//                                                                             onChange={(e) => handleInputChange(idx, "room_type", 'Twin-Sharing')}
//                                                                         />
//                                                                         <span className="radio-checkmark"></span>
//                                                                         <Image src='./images/icons/groups.svg' className='img-fluid' width={24} height={24} alt='shared' />
//                                                                         Shared Room
//                                                                     </label>
//                                                                 </div>
//                                                             </Col>
//                                                             <Col md={6}>
//                                                                 <div className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }}>
//                                                                     <label className="form-check-label d-flex gap-2 mb-0" htmlFor={`private-radio-${idx}`}>
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`room_type_${idx}`}
//                                                                             id={`private-radio-${idx}`}
//                                                                             checked={property.room_type === 'Private'}
//                                                                             onChange={(e) => handleInputChange(idx, "room_type", 'Private')}
//                                                                         />
//                                                                         <span className="radio-checkmark"></span>
//                                                                         <Image src='./images/icons/group.svg' className='img-fluid' width={24} height={24} alt='private' />
//                                                                         Private Room
//                                                                     </label>
//                                                                 </div>
//                                                             </Col>
//                                                         </Row>
//                                                         {errors[idx]?.room_type && (
//                                                             <div className="invalid-feedback d-block">
//                                                                 {errors[idx]?.room_type}
//                                                             </div>
//                                                         )}
//                                                         <p className='font-500'>A private room is a single-occupancy space where you have exclusive use of the bed, desk, and other amenities, offering maximum privacy.</p>
//                                                     </div>

//                                                     <hr />

//                                                     {/* Room Size */}
//                                                     <div className='form-group relative mb-4'>
//                                                         <p className='font-18' style={{ color: '#73615F' }}>Room size(sq ft) <span style={{ color: '#f00' }}>*</span></p>
//                                                         <input
//                                                             type='text'
//                                                             name='room_size_sqft'
//                                                             className={`form-control ${errors[idx]?.room_size_sqft ? 'is-invalid' : ''}`}
//                                                             placeholder='e.g. 538'
//                                                             value={property.room_size_sqft || ''}
//                                                             onChange={(e) => handleInputChange(idx, 'room_size_sqft', e.target.value)}
//                                                         />
//                                                         <span className='absolute right-2 bottom-3'>sq ft</span>
//                                                         {errors[idx]?.room_size_sqft && (
//                                                             <div className="invalid-feedback d-block">
//                                                                 {errors[idx]?.room_size_sqft}
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                     <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}> </p>

//                                                     {/* Beds */}
//                                                     {property.beds?.map((bed, bedIdx) => (
//                                                         <Row className='mb-2' key={bedIdx}>
//                                                             <Col md={6}>
//                                                                 <div className='form-group mb-4'>
//                                                                     <p className='font-18' style={{ color: '#73615F' }}>Bed type</p>
//                                                                     <Select
//                                                                         name={`bed-type-${idx}-${bedIdx}`}
//                                                                         options={chooseBeds}
//                                                                         placeholder="Choose Bed Type"
//                                                                         className='react_selectbox'
//                                                                         isSearchable={false}
//                                                                         value={bed.bed_type}
//                                                                         onChange={option => handleBedChange(idx, bedIdx, 'bed_type', option)}
//                                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                         styles={customStyles}
//                                                                     />
//                                                                 </div>
//                                                             </Col>
//                                                             <Col md={6}>
//                                                                 <div style={{ display: 'flex', alignItems: 'flex-end' }}>
//                                                                     <div className='form-group mb-4' style={{ flex: 1 }}>
//                                                                         <p className='font-18' style={{ color: '#73615F' }}>Bed Name</p>
//                                                                         <input
//                                                                             type='text'
//                                                                             className='form-control'
//                                                                             placeholder='e.g. Bed A'
//                                                                             value={bed.name || ''}
//                                                                             onChange={e => handleBedChange(idx, bedIdx, 'name', e.target.value)}
//                                                                         />
//                                                                     </div>
//                                                                     {property.beds.length > 1 && (
//                                                                         <Button
//                                                                             variant=""
//                                                                             className='mb-4 ms-3 d-flex align-items-center justify-content-center'
//                                                                             style={{
//                                                                                 background: "#f7f2ee",
//                                                                                 border: "1px solid #463527",
//                                                                                 borderRadius: "0px",
//                                                                                 height: "40px",
//                                                                                 marginLeft: "8px",
//                                                                                 width: '40px',
//                                                                                 padding: '0',
//                                                                                 textAlign: 'center'
//                                                                             }}
//                                                                             onClick={() => handleRemoveBed(idx, bedIdx)}
//                                                                         >
//                                                                             <Image src='/images/icons/delete_b.svg' width={20} height={20} alt='Delete' />
//                                                                         </Button>
//                                                                     )}
//                                                                 </div>
//                                                             </Col>
//                                                             <Col md={12}>
//                                                                 <hr style={{ margin: "0 0 16px 0" }} />
//                                                             </Col>
//                                                         </Row>
//                                                     ))}
//                                                     <Button
//                                                         style={{ color: '#2C734A', fontWeight: '500', marginBottom: "16px" }}
//                                                         className='d-flex p-0 gap-2'
//                                                         variant=''
//                                                         onClick={() => handleAddBed(idx)}
//                                                     >
//                                                         <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' /> Add bed type
//                                                     </Button>

//                                                     <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}> </p>

//                                                     {/* Bathrooms */}
//                                                     <Row className='mb-3'>
//                                                         <Col md={6}>
//                                                             <div className='d-flex align-items-center h-100'>
//                                                                 <p className='font-18 mb-0' style={{ color: '#73615F' }}>Bathrooms</p>
//                                                             </div>
//                                                         </Col>
//                                                         <Col md={6}>
//                                                             <div className='form-group'>
//                                                                 <div style={{
//                                                                     display: "flex",
//                                                                     alignItems: "center",
//                                                                     justifyContent: "space-between",
//                                                                     border: "2px solid #d3ccc5",
//                                                                     borderRadius: "2px",
//                                                                     background: "#f2f2f2",
//                                                                     padding: "13px 0",
//                                                                     width: "100%",
//                                                                     maxWidth: "100%",
//                                                                     fontSize: "14px",
//                                                                     marginTop: "8px"
//                                                                 }}>
//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={() => handleGuestChange(idx, -1)}
//                                                                         style={{
//                                                                             background: "none",
//                                                                             border: "none",
//                                                                             textAlign: 'center',
//                                                                             width: "20%",
//                                                                             cursor: property.bathrooms > 1 ? "pointer" : "not-allowed"
//                                                                         }}
//                                                                         disabled={property.bathrooms === 1}
//                                                                     >
//                                                                         <Image src='./images/icons/minus.svg' className='img-fluid ms-auto me-auto' alt='minus' />
//                                                                     </button>
//                                                                     <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>
//                                                                         {property.bathrooms || 1}
//                                                                     </span>
//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={() => handleGuestChange(idx, 1)}
//                                                                         style={{
//                                                                             background: "none",
//                                                                             border: "none",
//                                                                             color: "#463527",
//                                                                             width: "20%",
//                                                                             cursor: "pointer",
//                                                                             textAlign: 'center'
//                                                                         }}
//                                                                     >
//                                                                         <Image src='./images/icons/Plus.svg' className='img-fluid ms-auto me-auto' alt='plus' />
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         </Col>
//                                                     </Row>

//                                                     <hr style={{ margin: '20px 0' }} />

//                                                     {/* Bedroom Preference */}
//                                                     <Row className='mb-3'>
//                                                         <Col md={6}>
//                                                             <div className='d-flex align-items-center h-100'>
//                                                                 <p className='font-18 mb-0' style={{ color: '#73615F' }}>Bedroom preference</p>
//                                                             </div>
//                                                         </Col>
//                                                         <Col md={6}>
//                                                             <div className='form-group'>
//                                                                 <Select
//                                                                     name={`bedroom-preference-${idx}`}
//                                                                     options={chooseBedprefrence}
//                                                                     placeholder="Please select an option"
//                                                                     className='react_selectbox'
//                                                                     isSearchable={false}
//                                                                     value={chooseBedprefrence.find(opt => opt.value === property.bedroom_preference)}
//                                                                     onChange={(option) => handleInputChange(idx, 'bedroom_preference', option?.value || '')}
//                                                                     styles={customStyles}
//                                                                 />
//                                                             </div>
//                                                         </Col>
//                                                     </Row>

//                                                     <hr style={{ margin: '20px 0' }} />

//                                                     {/* Max Guests */}
//                                                     <Row className='mb-3'>
//                                                         <Col md={6}>
//                                                             <div className='d-flex align-items-center h-100'>
//                                                                 <p className='font-18 mb-0' style={{ color: '#73615F' }}>Max guests allowed</p>
//                                                             </div>
//                                                         </Col>
//                                                         <Col md={6}>
//                                                             <div className='form-group'>
//                                                                 <div style={{
//                                                                     display: "flex",
//                                                                     alignItems: "center",
//                                                                     justifyContent: "space-between",
//                                                                     border: "2px solid #d3ccc5",
//                                                                     borderRadius: "2px",
//                                                                     background: "#f2f2f2",
//                                                                     padding: "13px 0",
//                                                                     width: "100%",
//                                                                     maxWidth: "100%",
//                                                                     fontSize: "14px",
//                                                                     marginTop: "0px"
//                                                                 }}>
//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={() => handleGuestChange1(idx, -1)}
//                                                                         style={{
//                                                                             background: "none",
//                                                                             border: "none",
//                                                                             textAlign: 'center',
//                                                                             width: "20%",
//                                                                             cursor: property.max_guests > 1 ? "pointer" : "not-allowed"
//                                                                         }}
//                                                                         disabled={property.max_guests === 1}
//                                                                     >
//                                                                         <Image src='./images/icons/minus.svg' className='img-fluid ms-auto me-auto' alt='minus' />
//                                                                     </button>
//                                                                     <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>
//                                                                         {property.max_guests || 1}
//                                                                     </span>
//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={() => handleGuestChange1(idx, 1)}
//                                                                         style={{
//                                                                             background: "none",
//                                                                             border: "none",
//                                                                             color: "#463527",
//                                                                             width: "20%",
//                                                                             cursor: "pointer",
//                                                                             textAlign: 'center'
//                                                                         }}
//                                                                     >
//                                                                         <Image src='./images/icons/Plus.svg' className='img-fluid ms-auto me-auto' alt='plus' />
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         </Col>
//                                                     </Row>

//                                                     <hr style={{ margin: '20px 0' }} />

//                                                     {/* Nightly Rate */}
//                                                     <div className='form-group relative mb-4'>
//                                                         <p className='font-18' style={{ color: '#73615F' }}>Set your rate(Nightly rate) <span style={{ color: '#f00' }}>*</span></p>
//                                                         <p>The lowest possible rate for this room, not including promotions, taxes, or other fees.</p>
//                                                         <input
//                                                             type='text'
//                                                             name="avg_base_price_per_night"
//                                                             className={`form-control ${errors[idx]?.avg_base_price_per_night ? 'is-invalid' : ''}`}
//                                                             placeholder='₹ | 0'
//                                                             value={property.avg_base_price_per_night || ''}
//                                                             onChange={(e) => handleInputChange(idx, 'avg_base_price_per_night', e.target.value)}
//                                                         />
//                                                         {errors[idx]?.avg_base_price_per_night && (
//                                                             <div className="invalid-feedback d-block">
//                                                                 {errors[idx]?.avg_base_price_per_night}
//                                                             </div>
//                                                         )}
//                                                         <span className='absolute right-2 bottom-3'>/night</span>
//                                                     </div>

//                                                     <hr style={{ margin: '20px 0' }} />

//                                                     {/* Room Description */}
//                                                     <p className='subheadline-2 mb-3'>Room description <span style={{ color: '#f00' }}>*</span></p>
//                                                     <div className='form-group mb-4'>
//                                                         <textarea
//                                                             className={`form-control ${errors[idx]?.room_description ? 'is-invalid' : ''}`}
//                                                             rows={15}
//                                                             name="room_description"
//                                                             placeholder='e.x Mountain views, dedicated meeting spaces, and customizable meal options'
//                                                             value={property.room_description || ''}
//                                                             onChange={(e) => handleInputChange(idx, 'room_description', e.target.value)}
//                                                         />
//                                                         {errors[idx]?.room_description && (
//                                                             <div className="invalid-feedback d-block">
//                                                                 {errors[idx]?.room_description}
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                     <hr style={{ margin: '20px 0' }} />

//                                                     {/* Room Amenities */}
//                                                     <div className='property-list-2'>
//                                                         <p className='subheadline-2 mb-3'>Room amenities</p>
//                                                         <div className='search-box mb-3' style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                                                             <div style={{ flex: 1, position: "relative" }}>
//                                                                 <input
//                                                                     type='text'
//                                                                     placeholder='Search'
//                                                                     className='form-control'
//                                                                     value={amenitySearch}
//                                                                     onFocus={() => setShowAmenitySearch(true)}
//                                                                     onChange={e => setAmenitySearch(e.target.value)}
//                                                                     style={{
//                                                                         paddingLeft: "40px",
//                                                                         fontSize: "16px",
//                                                                         border: "2px solid #d3ccc5",
//                                                                         borderRadius: "2px",
//                                                                         background: "#f2f2f2"
//                                                                     }}
//                                                                 />
//                                                                 <Image
//                                                                     src='/images/icons/search.svg'
//                                                                     width={20}
//                                                                     height={20}
//                                                                     alt='Search'
//                                                                     style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
//                                                                 />
//                                                                 {amenitySearch && (
//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={() => setAmenitySearch('')}
//                                                                         style={{
//                                                                             position: "absolute",
//                                                                             right: "12px",
//                                                                             top: "50%",
//                                                                             transform: "translateY(-50%)",
//                                                                             background: "none",
//                                                                             border: "none",
//                                                                             fontSize: "20px",
//                                                                             color: "#6B4F3F",
//                                                                             cursor: "pointer"
//                                                                         }}
//                                                                         aria-label="Clear"
//                                                                     >
//                                                                         <Image
//                                                                             src='./images/icons/close-circle.svg'
//                                                                             className='img-fluid'
//                                                                             width={24}
//                                                                             height={24}
//                                                                             alt='close'
//                                                                         />
//                                                                     </button>
//                                                                 )}
//                                                             </div>
//                                                             {showAmenitySearch && (
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() => {
//                                                                         setAmenitySearch('');
//                                                                         setShowAmenitySearch(false);
//                                                                     }}
//                                                                     style={{
//                                                                         background: "none",
//                                                                         border: "none",
//                                                                         color: "#6B4F3F",
//                                                                         fontWeight: "500",
//                                                                         fontSize: "16px",
//                                                                         cursor: "pointer"
//                                                                     }}
//                                                                 >
//                                                                     Cancel
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                         <dl className='br-list-data'>
//                                                             {filteredAmenities.map((a, inx) => {
//                                                                 const isSelected = property.room_amenities?.includes(a.label);
//                                                                 return (
//                                                                     <li key={inx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
//                                                                         <span className='br-list gap-2'>
//                                                                             <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
//                                                                             {a.label}
//                                                                         </span>
//                                                                         <span
//                                                                             className='add-plus-icn'
//                                                                             style={{ cursor: "pointer" }}
//                                                                             onClick={() => handleAmenitySelect(idx, a.label)}
//                                                                         >
//                                                                             <Image
//                                                                                 src={isSelected ? "./images/icons/check_circle.svg" : "./images/icons/add_circle.svg"}
//                                                                                 className='img-fluid'
//                                                                                 width={24}
//                                                                                 height={24}
//                                                                                 alt={isSelected ? 'selected' : 'add circle'}
//                                                                             />
//                                                                         </span>
//                                                                     </li>
//                                                                 );
//                                                             })}
//                                                             {filteredAmenities.length === 0 && (
//                                                                 <li style={{ color: "#73615F", padding: "0px 0" }}>No amenities found.</li>
//                                                             )}
//                                                         </dl>
//                                                         <hr style={{ margin: '20px 0' }} />
//                                                     </div>

//                                                     <div className='box-input'>
//                                                         {(!step4Data[idx]?.roomPhotos || step4Data[idx].roomPhotos.length === 0) ? (
//                                                             <div className='property-list-2'>
//                                                                 <p className='subheadline-2 mb-1'>Add some photos of your flat/apartment</p>
//                                                                 <div className='form-group mb-5'>
//                                                                     <label>You can add more or make changes later.</label>
//                                                                     <div className='add-upload-photo'>
//                                                                         <Image
//                                                                             src="./images/icons/photo-camera.svg"
//                                                                             className='img-fluid mb-2'
//                                                                             width={50}
//                                                                             height={40}
//                                                                             alt='add photo'
//                                                                         />
//                                                                         <Button
//                                                                             onClick={() => changepicModal1(idx)}
//                                                                             variant=''
//                                                                             className='add-photo-btn'
//                                                                         >
//                                                                             Add Photo
//                                                                         </Button>
//                                                                     </div>
//                                                                 </div>
//                                                                 {/* <hr style={{ margin: '50px 0' }} /> */}
//                                                             </div>
//                                                         ) : (
//                                                             <>
//                                                                 <div className='d-flex justify-content-between align-items-start'>
//                                                                     <p className='subheadline-2 mb-4'>Photos of your flat / apartment</p>
//                                                                     <Button
//                                                                         variant=""
//                                                                         onClick={() => changepicModal1(idx)}
//                                                                     >
//                                                                         <Image
//                                                                             src='./images/icons/add_circle.svg'
//                                                                             className='img-fluid'
//                                                                             alt='circle'
//                                                                         />
//                                                                     </Button>
//                                                                 </div>
//                                                                 <div className="photo-gallery">
//                                                                     <div className="grid upload-photo grid-cols-2 gap-4">
//                                                                         {/* Render existing photos from photoFile */}
//                                                                         {photoFile?.[idx]?.photos?.map((photo, photoIndex) => (
//                                                                             <div key={`photo-${photoIndex}`} className="relative group">
//                                                                                 <Image
//                                                                                     src={photo.room_photo_url?.startsWith('http')
//                                                                                         ? photo.room_photo_url
//                                                                                         : `https://alicedevapi.casamelhor.in${photo.room_photo_url}`}
//                                                                                     alt={`Room photo ${photoIndex + 1}`}
//                                                                                     width={300}
//                                                                                     height={200}
//                                                                                     className="object-cover w-full h-[200px]"
//                                                                                 />
//                                                                                 {photo.markedForDeletion && (
//                                                                                     <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
//                                                                                         <span className="text-white font-bold">To be deleted</span>
//                                                                                     </div>
//                                                                                 )}
//                                                                                 <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
//                                                                                     <li>
//                                                                                         <button
//                                                                                             onClick={() => makeCoverPhoto(photo?.uid)}
//                                                                                             className="block text-sm w-full text-left px-3 py-2 hover:bg-gray-100"
//                                                                                         >
//                                                                                             Make cover photo
//                                                                                         </button>
//                                                                                     </li>
//                                                                                     <li>
//                                                                                         <button
//                                                                                             onClick={() => removePhoto(photo?.uid)}
//                                                                                             className="block text-sm w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
//                                                                                         >
//                                                                                             Delete
//                                                                                         </button>
//                                                                                     </li>
//                                                                                 </ul>
//                                                                                 <div className="more-action absolute top-2 right-2 cursor-pointer">
//                                                                                     <Image
//                                                                                         src="./images/icons/more-dots-3.svg"
//                                                                                         className="img-fluid"
//                                                                                         alt="options"
//                                                                                         width={20}
//                                                                                         height={20}
//                                                                                     />
//                                                                                 </div>
//                                                                                 {photo.is_room_cover_photo && (
//                                                                                     <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
//                                                                                         Cover Photo
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         ))}

//                                                                         {/* Render newly uploaded photos from roomPhotos */}
//                                                                         {step4Data?.[idx]?.roomPhotos?.filter(photo => !photo.isExisting).map((newPhoto, newIndex) => (
//                                                                             <div key={`new-photo-${newIndex}`} className="relative group">
//                                                                                 <Image
//                                                                                     src={newPhoto.preview || newPhoto.room_photo_url}
//                                                                                     alt={`New photo ${newIndex + 1}`}
//                                                                                     width={300}
//                                                                                     height={200}
//                                                                                     className="object-cover w-full h-[200px]"
//                                                                                 />
//                                                                                 <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
//                                                                                     <li>
//                                                                                         <button
//                                                                                             onClick={() => makeCoverPhotoLocal(idx, newIndex)}
//                                                                                             className="block text-sm w-full text-left px-3 py-2 hover:bg-gray-100"
//                                                                                         >
//                                                                                             Make cover photo
//                                                                                         </button>
//                                                                                     </li>
//                                                                                     <li>
//                                                                                         <button
//                                                                                             onClick={() => removeNewPhoto(idx, newIndex)}
//                                                                                             className="block text-sm w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
//                                                                                         >
//                                                                                             Delete
//                                                                                         </button>
//                                                                                     </li>
//                                                                                 </ul>
//                                                                                 <div className="more-action absolute top-2 right-2 cursor-pointer">
//                                                                                     <Image
//                                                                                         src="./images/icons/more-dots-3.svg"
//                                                                                         className="img-fluid"
//                                                                                         alt="options"
//                                                                                         width={20}
//                                                                                         height={20}
//                                                                                     />
//                                                                                 </div>
//                                                                             </div>
//                                                                         ))}

//                                                                         {/* Add photo button - check total photos */}
//                                                                         {((photoFile?.[idx]?.photos?.length || 0) + (step4Data?.[idx]?.roomPhotos?.filter(p => !p.isExisting)?.length || 0)) < MAX_PHOTOS && (
//                                                                             <div
//                                                                                 className="flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer"
//                                                                                 style={{ minHeight: '200px' }}
//                                                                                 onClick={() => changepicModal1(idx)}
//                                                                             >
//                                                                                 <div className="flex flex-col items-center cursor-pointer">
//                                                                                     <Image
//                                                                                         src="/images/icons/photo-camera.svg"
//                                                                                         alt="Add"
//                                                                                         width={50}
//                                                                                         height={40}
//                                                                                         className="mb-3 ms-auto me-auto"
//                                                                                     />
//                                                                                     <span
//                                                                                         style={{ border: '1px solid #000', padding: '10px 20px' }}
//                                                                                         className="text-sm"
//                                                                                     >
//                                                                                         Add Photo
//                                                                                     </span>
//                                                                                 </div>
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 </div>
//                                                                 <hr style={{ margin: "50px 0" }} />
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </Col>
//                                             </Row>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}

//                             <Button variant="" className="btn-company-add mt-5 mb-5" onClick={handleAddProperty}>
//                                 <span style={{ fontSize: '24px' }}>+</span> Add Bedroom
//                             </Button>

//                             <hr className='mb-4' />

//                             <div className='d-flex mt-5'>
//                                 <Button
//                                     variant=""
//                                     className='btn-white-transparent d-flex gap-2 me-3'
//                                     style={{ padding: '13px 35px', borderRadius: '0' }}
//                                     type="button"
//                                     onClick={() => setActiveStep(activeStep - 1)}
//                                     disabled={isLoading}
//                                 >
//                                     <Image src="./images/icons/double-arrows.svg" className='img-fluid' alt='arrow' /> Back
//                                 </Button>

//                                 <Button
//                                     variant=""
//                                     className='complete-form-btn'
//                                     style={{ padding: '13px 35px', borderRadius: '0' }}
//                                     // type="submit"
//                                     onClick={() => handleSubmit('')}
//                                     disabled={isLoading}
//                                 >
//                                     {isLoading ? 'Processing...' : mode === 'create' ? 'Create Rooms' : 'Update Rooms'}
//                                 </Button>
//                             </div>
//                             {/* </Form> */}
//                         </div>
//                     </Col>
//                 </Row>
//             </Container>

//             {/* Photo Upload Modal */}
//             <Modal show={changepicsModal1} onHide={changepicClose1} animation={false} centered className='custom-theme-modal'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-0'>
//                     <Modal.Title>Upload photo</Modal.Title>
//                     <Image
//                         src='/images/icons/close-circle.svg'
//                         width={24}
//                         height={24}
//                         alt='Close'
//                         style={{ cursor: 'pointer' }}
//                         onClick={changepicClose1}
//                     />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                         <span>
//                             {photoIndex !== null && step4Data[photoIndex]?.roomPhotos?.length || 0} items selected
//                         </span>
//                         {photoIndex !== null && step4Data[photoIndex]?.roomPhotos?.length < MAX_PHOTOS && (
//                             <label className="cursor-pointer d-flex align-items-center gap-2">
//                                 <Image
//                                     src="/images/icons/add_circle.svg"
//                                     width={24}
//                                     height={24}
//                                     alt="Add more photos"
//                                 />
//                                 <span>Add more photos</span>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     onChange={(e) => handleFileChange1(photoIndex, e)}
//                                     className="hidden"
//                                 />
//                             </label>
//                         )}
//                     </div>
//                     <div className="drap-drop-box-full">
//                         {photoIndex !== null && (!step4Data[photoIndex]?.roomPhotos || step4Data[photoIndex].roomPhotos.length === 0) ? (
//                             <label
//                                 onDrop={(e) => {
//                                     e.preventDefault();
//                                     handleFileChange1(photoIndex, { target: { files: e.dataTransfer.files } });
//                                 }}
//                                 onDragOver={handleDragOver1}
//                                 className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
//                             >
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     onChange={(e) => handleFileChange1(photoIndex, e)}
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
//                                     <p className="font-medium mb-0" style={{ color: "#463527" }}>
//                                         Drag and drop
//                                     </p>
//                                     <p className="text-sm text-gray-500 mb-0" style={{ color: "#73615F" }}>
//                                         or click here to choose files (max 5).
//                                     </p>
//                                 </div>
//                             </label>
//                         ) : (
//                             <div>
//                                 <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
//                                     {photoIndex !== null && step4Data[photoIndex]?.roomPhotos?.map((photo, index) => (
//                                         <div key={index} className="relative inline-block">
//                                             <Image
//                                                 src={photo.preview}
//                                                 alt={`Uploaded preview ${index + 1}`}
//                                                 width={250}
//                                                 height={250}
//                                                 className="object-cover"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removePhoto(photoIndex, index)}
//                                                 className="absolute top-1 right-1 delete-icn"
//                                             >
//                                                 <Image
//                                                     src="/images/icons/delete.svg"
//                                                     width={20}
//                                                     height={20}
//                                                     alt="delete"
//                                                 />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between'>
//                     <Button variant="" onClick={changepicClose1} className='btn-company-add' style={{ padding: '13px 25px', borderRadius: '0' }}>
//                         Cancel
//                     </Button>
//                     <Button
//                         variant=""
//                         onClick={changepicClose1}
//                         className='search-btn complete-form-btn'
//                         style={{ padding: '13px 25px', borderRadius: '0' }}
//                     >
//                         Upload
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     )
// }



"use client"
import { CreateRoomAPI, CreateRoomPhotosAPI, UpdateRoomDetailAPI, PropertyRoomDetailAPI, PropertyRoomListAPI, RoomsPhotoListAPI, SetRoomCoverPhotoAPI, DeleteRoomPhotoAPI, WizardStepUpdateAPI } from '@/services/provider';
import { alert_danger, alert_info, alert_success } from '@/utils/Alerts/TostifyAlerts';
import { getItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image, Modal, Form } from 'react-bootstrap'
import Select, { components } from 'react-select';

export default function Step4({ step4Data, setStep4Data, propertyRole, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, draft }) {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [existingRooms, setExistingRooms] = useState([]);
    const [mode, setMode] = useState('create');
    const [photoFile, setPhotoFile] = useState([]);
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
    }, [activeStep]);


    const chooseBeds = [
        {
            value: "single-bed",
            label: "Single Bed",
            icon: "./images/icons/single_bed.svg"
        },
        {
            value: "double-bed",
            label: "Double Bed",
            icon: "./images/icons/double-bed.svg"
        },
        {
            value: "Queen-bed",
            label: "Queen Bed",
            icon: "./images/icons/double-bed.svg"
        },
        {
            value: "King-bed",
            label: "King Bed",
            icon: "./images/icons/king_bed.svg"
        },
        {
            value: "super-king-bed",
            label: "Super King Bed",
            icon: "./images/icons/king_bed.svg"
        },
        {
            value: "Sofa Bed",
            label: "Sofa Bed",
            icon: "./images/icons/sofa-bed.svg"
        },
    ];

    const chooseBedprefrence = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "None", label: "None" },
    ];

    const amenities = [
        { icon: "./images/icons/ac.svg", label: "Air conditioning" },
        { icon: "./images/icons/concierge.svg", label: "Concierge" },
        { icon: "./images/icons/fitness_center.svg", label: "Fitness center" },
        { icon: "./images/icons/wifi.svg", label: "Free internet access" },
        { icon: "./images/icons/local_parking.svg", label: "Free parking" },
        { icon: "./images/icons/interpreter.svg", label: "Meeting facilities" }
    ];


    const [selectedType, setSelectedType] = useState(null);
    const [amenitySearch, setAmenitySearch] = useState('');
    const [showAmenitySearch, setShowAmenitySearch] = useState(false);
    const [changepicsModal1, changepisetShow1] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(null);


    useEffect(() => {
        const initializeData = async () => {
            if (property?.uid) {
                await fetchExistingRooms();
            } else if (step4Data.length === 0) {
                setStep4Data([getDefaultRoomData()]);
            }
        };
        initializeData();
    }, [mode, property?.uid]);


    const fetchRoomPhotosList = async (id) => {
        try {
            const response = await RoomsPhotoListAPI(id);
            if (response?.data?.success) {
                const photos = response.data.response
                    .sort((a, b) => a.id - b.id)
                    .map(item => ({
                        uid: item.uid,
                        is_room_cover_photo: item.is_room_cover_photo,
                        room_photo_display_order: item.room_photo_display_order,
                        room_photo_url: item.room_photo_url
                    }));
                return { roomId: id, photos };
            }
            return { roomId: id, photos: [] };
        } catch (error) {
            console.log(`Error fetching photos for room ${id}:`, error);
            return { roomId: id, photos: [] };
        }
    };

    const fetchExistingRooms = async () => {
        try {
            setIsLoading(true);
            const response = await PropertyRoomListAPI(property?.uid);

            if (response?.data?.success) {
                if (response.data.response.length > 0) {
                    setMode('edit');
                    const sortedRooms = response.data.response.sort((a, b) => a.id - b.id);

                    // Fetch photos for all rooms in parallel BEFORE mapping rooms
                    const photoPromises = sortedRooms.map(room => fetchRoomPhotosList(room.uid));
                    const photosResults = await Promise.all(photoPromises);

                    // Format photos as: [{photos: [...]}, {photos: [...]}]
                    const formattedPhotos = photosResults.map(result => ({
                        photos: result.photos
                    }));

                    setPhotoFile(formattedPhotos);

                    // Map rooms data with photos from the parallel fetch
                    const rooms = sortedRooms.map((room, index) => ({
                        uid: room.uid,
                        room_name: room.room_name || '',
                        room_type: room.room_type || '',
                        room_size_sqft: room.room_size_sqft || '',
                        beds: room.beds?.length > 0
                            ? room.beds.map(bed => ({
                                bed_type: chooseBeds.find(b => b.value === bed.bed_type) || chooseBeds[0],
                                name: bed.name || ''
                            }))
                            : [{ bed_type: chooseBeds[0], name: '' }],
                        bathrooms: room.bathrooms || 1,
                        bedroom_preference: room.bedroom_preference || '',
                        max_guests: room.max_guests || 1,
                        avg_base_price_per_night: room.avg_base_price_per_night || '',
                        room_description: room.room_description || '',
                        room_amenities: room.room_amenities || [],
                        roomPhotos: photosResults[index]?.photos?.map(photo => ({
                            file: null,
                            preview: photo.room_photo_url,
                            name: `existing_${photo.uid}`,
                            is_room_cover_photo: photo.is_room_cover_photo,
                            size: 0,
                            isExisting: true,
                            uid: photo.uid
                        })) || [],
                        collapsed: false
                    }));

                    setStep4Data(rooms);
                    setExistingRooms(rooms);
                } else {
                    setMode('create');
                    setStep4Data([getDefaultRoomData()]);
                    setExistingRooms([getDefaultRoomData()]);
                }
            } else {
                if (step4Data.length === 0) {
                    setStep4Data([getDefaultRoomData()]);
                }
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
            alert_danger("Failed to load existing rooms");
            if (step4Data.length === 0) {
                setStep4Data([getDefaultRoomData()]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getDefaultRoomData = () => ({
        room_name: '',
        room_type: '',
        room_size_sqft: '',
        beds: [{ bed_type: chooseBeds[0], name: '' }],
        bathrooms: 1,
        bedroom_preference: '',
        max_guests: 1,
        avg_base_price_per_night: '',
        room_description: '',
        room_amenities: [],
        roomPhotos: [],
        collapsed: false
    });

    const handleInputChange = (idx, field, value) => {
        setStep4Data(prev => {
            const updated = [...prev];
            updated[idx] = {
                ...updated[idx],
                [field]: value
            };
            return updated;
        });
    };

    const validate = () => {
        const newErrors = {};

        step4Data.forEach((room, idx) => {
            const roomErr = {};

            if (!room.room_name?.trim()) roomErr.room_name = "Room name is required";
            if (!room.room_type) roomErr.room_type = "Room type is required";
            if (!room.room_size_sqft) roomErr.room_size_sqft = "Room size is required";
            if (!room.avg_base_price_per_night) roomErr.avg_base_price_per_night = "Nightly price is required";
            if (!room.room_description?.trim()) roomErr.room_description = "Room description is required";

            if (Object.keys(roomErr).length > 0) newErrors[idx] = roomErr;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const CustomOption = (props) => (
        <components.Option {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image
                        src={props.data.icon}
                        alt={props.data.label}
                        width={20}
                        height={20}
                    />
                    <span>{props.data.label}</span>
                </div>
                {props.isSelected && (
                    <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
                )}
            </div>
        </components.Option>
    );

    const CustomSingleValue = (props) => (
        <components.SingleValue {...props}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image
                    src={props.data.icon}
                    alt={props.data.label}
                    width={20}
                    height={20}
                />
                <span>{props.data.label}</span>
            </div>
        </components.SingleValue>
    );

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#4635271F"
                : state.isFocused
                    ? "#4635271F"
                    : "inherit",
            color: state.isSelected ? "#000" : "black",
            cursor: "pointer",
        }),
    };


    const handleAddProperty = () => {
        setStep4Data(prev => [
            ...prev,
            getDefaultRoomData()
        ]);
    };

    const handleDeleteProperty = async (idx) => {
        if (step4Data.length > 1) {
            const roomToDelete = step4Data[idx];

            if (mode === 'edit' && roomToDelete.uid) {
                if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
                    try {
                        setStep4Data(prev => prev.filter((_, i) => i !== idx));
                        alert_info("Room removed successfully");
                    } catch (error) {
                        alert_danger("Failed to delete room");
                        return;
                    }
                }
            } else {
                setStep4Data(prev => prev.filter((_, i) => i !== idx));
            }
        } else {
            alert_danger("At least one room is required");
        }
    };

    const handleCollapseProperty = (idx) => {
        setStep4Data(prev => prev.map((prop, i) =>
            i === idx ? { ...prop, collapsed: !prop.collapsed } : prop
        ));
    };


    const handleGuestChange = (idx, delta) => {
        const newCount = Math.max(1, (step4Data[idx]?.bathrooms || 1) + delta);
        handleInputChange(idx, 'bathrooms', newCount);
    };

    const handleGuestChange1 = (idx, delta) => {
        const newCount = Math.max(1, (step4Data[idx]?.max_guests || 1) + delta);
        handleInputChange(idx, 'max_guests', newCount);
    };


    const handleAmenitySelect = (idx, label) => {
        const currentAmenities = step4Data[idx]?.room_amenities || [];
        const newAmenities = currentAmenities.includes(label)
            ? currentAmenities.filter(l => l !== label)
            : [...currentAmenities, label];

        handleInputChange(idx, 'room_amenities', newAmenities);
    };

    const filteredAmenities = amenities.filter(a =>
        a.label.toLowerCase().includes(amenitySearch.toLowerCase())
    );


    const changepicClose1 = () => {
        changepisetShow1(false);
        setPhotoIndex(null);
    };

    const changepicModal1 = (idx) => {
        setPhotoIndex(idx);
        changepisetShow1(true);
    };

    const MAX_PHOTOS = 5;

    const handleFileChange1 = (idx, e) => {
        const newFiles = Array.from(e.target.files);

        setStep4Data(prev => {
            const updated = [...prev];

            if (!updated[idx]) {
                return prev;
            }

            updated[idx] = { ...updated[idx] };
            updated[idx].roomPhotos = updated[idx].roomPhotos || [];

            const existing = updated[idx].roomPhotos;
            const existingFiles = existing.filter(photo => !photo.isExisting);
            const existingPhotos = existing.filter(photo => photo.isExisting);

            // Also count photoFile (already-saved) photos against the limit
            const savedPhotosCount = photoFile?.[idx]?.photos?.length || 0;
            const availableSlots = MAX_PHOTOS - existingPhotos.length - existingFiles.length - savedPhotosCount;

            if (availableSlots <= 0) {
                return updated;
            }

            const uniqueFiles = newFiles.filter(newFile => {
                return !existingFiles.some(existingFile => {
                    return existingFile.name === newFile.name &&
                        existingFile.size === newFile.size;
                });
            }).slice(0, availableSlots);

            const filesWithPreview = uniqueFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                isExisting: false,
                is_room_cover_photo: false,
                id: Date.now() + Math.random()
            }));

            updated[idx].roomPhotos = [...existingPhotos, ...existingFiles, ...filesWithPreview];

            return updated;
        });

        e.target.value = '';
    };

    const handleDragOver1 = (e) => e.preventDefault();

    // ─── FIX: Delete existing photo via API ───────────────────────────────────
    const removePhoto = async (uid) => {
        try {
            const response = await DeleteRoomPhotoAPI(uid);
            if (response?.data?.success) {
                alert_success(response.data.response.message);
                fetchExistingRooms();
            }
        } catch (error) {
            console.log(error);
            alert_danger("Failed to delete photo");
        }
    };

    // ─── FIX: Delete newly uploaded (not yet saved) photo ────────────────────
    const removeNewPhoto = (roomIdx, newPhotoIndex) => {
        setStep4Data(prev => {
            const updated = [...prev];
            // newPhotoIndex is index among non-existing photos only
            const newPhotos = updated[roomIdx].roomPhotos.filter(p => !p.isExisting);
            const targetPhoto = newPhotos[newPhotoIndex];
            if (targetPhoto?.preview) {
                URL.revokeObjectURL(targetPhoto.preview);
            }
            updated[roomIdx].roomPhotos = updated[roomIdx].roomPhotos.filter(
                p => p !== targetPhoto
            );
            return updated;
        });
    };

    const makeCoverPhoto = async (id) => {
        try {
            const response = await SetRoomCoverPhotoAPI(id);
            if (response?.data?.success) {
                alert_success(response.data.response.message);
                fetchExistingRooms();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ─── FIX: makeCoverPhotoLocal — use object reference, not raw index ───────
    const makeCoverPhotoLocal = (roomIdx, newPhotoIndex) => {
        setStep4Data(prev => {
            const updated = [...prev];
            // newPhotoIndex is index among non-existing photos only
            const newPhotos = updated[roomIdx].roomPhotos.filter(p => !p.isExisting);
            const targetPhoto = newPhotos[newPhotoIndex];
            const updatedPhotos = updated[roomIdx].roomPhotos.map(photo => ({
                ...photo,
                is_room_cover_photo: photo === targetPhoto
            }));
            updated[roomIdx].roomPhotos = updatedPhotos;
            return updated;
        });
    };


    const handleBedChange = (roomIdx, bedIdx, field, value) => {
        setStep4Data(prev => {
            const updated = [...prev];
            const updatedBeds = [...updated[roomIdx].beds];
            updatedBeds[bedIdx] = { ...updatedBeds[bedIdx], [field]: value };
            updated[roomIdx].beds = updatedBeds;
            return updated;
        });
    };

    const handleAddBed = (roomIdx) => {
        setStep4Data(prev => {
            const updated = [...prev];
            updated[roomIdx].beds = [...updated[roomIdx].beds, { bed_type: chooseBeds[0], name: '' }];
            return updated;
        });
    };

    const handleRemoveBed = (roomIdx, bedIdx) => {
        if (step4Data[roomIdx]?.beds.length > 1) {
            setStep4Data(prev => {
                const updated = [...prev];
                updated[roomIdx].beds = updated[roomIdx].beds.filter((_, i) => i !== bedIdx);
                return updated;
            });
        }
    };


    const handleRoomPhotos = async (roomId, index) => {
        try {
            const room = step4Data[index];
            const newPhotos = room.roomPhotos.filter(photo => !photo.isExisting && !photo.markedForDeletion);

            if (newPhotos.length > 0) {
                const fieldData = new FormData();
                fieldData.append("room", roomId);

                newPhotos.forEach((fileObj, fileIndex) => {
                    fieldData.append(`room_photo_url[${fileIndex}]`, fileObj.file);
                });

                const response = await CreateRoomPhotosAPI(fieldData);
                if (!response?.data?.success) {
                    throw new Error("Failed to upload room photos");
                } else {
                    const isCoverPhoto = room?.roomPhotos?.some(photo => photo.is_room_cover_photo === true);
                    if (!isCoverPhoto) {
                        makeCoverPhoto(response?.data?.response?.[0]?.uid);
                    }
                }
            }

            return true;
        } catch (error) {
            console.log(error);
            alert_danger("Failed to upload room photos");
            throw error;
        }
    };


    const handleSubmit = async (flag) => {
        setSaveExit(false);
        assignmentRemoveClose();
        setIsLoading(true);

        if (validate()) {
            try {
                if (mode === 'create') {
                    const payload = {
                        property: property?.uid,
                        rooms: step4Data.map(room => ({
                            room_name: room.room_name,
                            room_type: room.room_type,
                            room_size_sqft: room.room_size_sqft,
                            beds: room.beds.map(bed => ({
                                bed_type: bed.bed_type?.value,
                                name: bed.name
                            })),
                            bathrooms: room.bathrooms,
                            bedroom_preference: room.bedroom_preference,
                            max_guests: room.max_guests,
                            avg_base_price_per_night: room.avg_base_price_per_night,
                            room_description: room.room_description,
                            room_amenities: room.room_amenities
                        }))
                    };

                    const response = await CreateRoomAPI(JSON.stringify(payload));

                    if (response?.data?.success) {
                        setItemLocalStorage("roomItem", JSON.stringify(response.data.response));

                        const uploadPromises = response.data.response.map((item, index) =>
                            handleRoomPhotos(item?.uid, index)
                        );

                        await Promise.all(uploadPromises);
                        alert_success("Rooms created successfully!");
                        setActiveStep(activeStep + 1);
                    } else {
                        if (response.data.response) {
                            const dynamicKey = Object.keys(response.data.response)[0];
                            const message = response.data.response[dynamicKey].join('\n');
                            alert_danger(message);
                        }
                    }
                } else {
                    const updatePromises = step4Data.map(async (room, index) => {
                        const roomPayload = {
                            room_name: room.room_name,
                            room_type: room.room_type,
                            room_size_sqft: room.room_size_sqft,
                            beds: room.beds.map(bed => ({
                                bed_type: bed.bed_type?.value,
                                name: bed.name
                            })),
                            bathrooms: room.bathrooms,
                            bedroom_preference: room.bedroom_preference,
                            max_guests: room.max_guests,
                            avg_base_price_per_night: room.avg_base_price_per_night,
                            room_description: room.room_description,
                            room_amenities: room.room_amenities
                        };

                        if (room.uid) {
                            const response = await UpdateRoomDetailAPI(room.uid, JSON.stringify(roomPayload));
                            if (response?.data?.success) {
                                await handleRoomPhotos(room.uid, index);
                                return response.data.response;
                            } else {
                                const dynamicKey = Object.keys(response.data.response)[0];
                                const message = response.data.response[dynamicKey].join('\n');
                                alert_danger(message);
                            }
                        } else {
                            const createResponse = await CreateRoomAPI(JSON.stringify({
                                property: property?.uid,
                                rooms: [roomPayload]
                            }));
                            if (createResponse?.data?.success) {
                                const newRoom = createResponse.data.response[0];
                                await handleRoomPhotos(newRoom.uid, index);
                                return newRoom;
                            } else {
                                throw new Error(`Failed to create new room ${index + 1}`);
                            }
                        }
                    });

                    const updatedRooms = await Promise.all(updatePromises);
                    setItemLocalStorage("roomItem", JSON.stringify(updatedRooms));
                    alert_success("Rooms updated successfully!");
                    if (flag == "exit") {
                        const wizard = new FormData();
                        wizard.append("wizard_step_completed", activeStep);
                        await WizardStepUpdateAPI(property?.uid, wizard);
                        router.push("/PropertyListing");
                    } else {
                        setActiveStep(activeStep + 1);
                    }
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert_danger(mode === 'create' ? "Failed to create rooms" : "Failed to update rooms");
            }
        } else {
            const firstErrorIndex = Object.keys(errors)[0];
            if (firstErrorIndex) {
                const element = document.querySelector(`[data-room-index="${firstErrorIndex}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (saveExit && activeStep == 4) {
            handleSubmit('exit');
        }
    }, [saveExit]);

    if (isLoading && mode === 'edit' && step4Data.length === 0) {
        return (
            <Container>
                <div className="text-center py-5">
                    <div>Loading rooms...</div>
                </div>
            </Container>
        );
    }

    return (
        <>
            <Container>
                <Row>
                    <Col md={8}>
                        <div className='box-input'>
                            <h3 className='page-title mb-4'>
                                {mode === 'create' ? 'Set up your rooms' : 'Update your rooms'}
                                <small className="ms-2" style={{ fontSize: '14px', color: '#666' }}>
                                    ({mode === 'create' ? 'Create Mode' : 'Edit Mode'})
                                </small>
                            </h3>

                            {step4Data.map((property, idx) => (
                                <div className='assign-property-box mt-5' key={property.uid || idx} data-room-index={idx}>
                                    {/* Room Header */}
                                    <div className='pb-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }}>
                                            {`Bedroom ${idx + 1}`}
                                            {property.uid && <small style={{ color: '#666', marginLeft: '10px' }}>(Existing)</small>}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span
                                                className="d-flex align-items-center me-4"
                                                style={{ cursor: 'pointer', color: '#463527', fontWeight: 500 }}
                                                onClick={() => handleCollapseProperty(idx)}
                                            >
                                                {property.collapsed ? 'Expand' : 'Collapse'}
                                                <Image
                                                    src='/images/icons/top-arrow.svg'
                                                    width={18}
                                                    height={18}
                                                    alt={property.collapsed ? 'Expand' : 'Collapse'}
                                                    style={{ transform: property.collapsed ? 'rotate(180deg)' : 'none', marginLeft: '6px' }}
                                                />
                                            </span>
                                            {step4Data.length > 1 && (
                                                <Button
                                                    variant="outline"
                                                    style={{ border: '1px solid #463527', background: 'none', padding: '8px', borderRadius: '0', width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    onClick={() => handleDeleteProperty(idx)}
                                                >
                                                    <Image src='/images/icons/delete_b.svg' width={20} height={20} alt='Delete' />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-2 mb-2" style={{ border: '1px solid rgb(70, 53, 39)' }}> </p>

                                    {!property.collapsed && (
                                        <div className='add-propertu-assign mt-4 p-4' style={{ border: '1px solid #4635271F' }}>
                                            <Row>
                                                <Col md={12}>
                                                    {/* Room Name */}
                                                    <div className='form-group mb-4'>
                                                        <p className='font-18' style={{ color: '#73615F' }}>Room name <span style={{ color: '#f00' }}>*</span></p>
                                                        <input
                                                            type='text'
                                                            name="room_name"
                                                            className={`form-control ${errors[idx]?.room_name ? 'is-invalid' : ''}`}
                                                            placeholder='e.g 1 King bed with balcony bay view'
                                                            value={property.room_name || ''}
                                                            onChange={(e) => handleInputChange(idx, 'room_name', e.target.value)}
                                                        />
                                                        {errors[idx]?.room_name && (
                                                            <div className="invalid-feedback d-block">
                                                                {errors[idx]?.room_name}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <hr />

                                                    {/* Room Type */}
                                                    <div className='form-group mb-4'>
                                                        <p className='font-18' style={{ color: '#73615F' }}>Classify room type <span style={{ color: '#f00' }}>*</span></p>
                                                        <Row className='mb-2'>
                                                            <Col md={6}>
                                                                <div className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }}>
                                                                    <label className="form-check-label d-flex gap-2 mb-0" htmlFor={`shared-radio-${idx}`}>
                                                                        <input
                                                                            type="radio"
                                                                            name={`room_type_${idx}`}
                                                                            id={`shared-radio-${idx}`}
                                                                            checked={property.room_type === 'Twin-Sharing'}
                                                                            onChange={(e) => handleInputChange(idx, "room_type", 'Twin-Sharing')}
                                                                        />
                                                                        <span className="radio-checkmark"></span>
                                                                        <Image src='./images/icons/groups.svg' className='img-fluid' width={24} height={24} alt='shared' />
                                                                        Shared Room
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                            <Col md={6}>
                                                                <div className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }}>
                                                                    <label className="form-check-label d-flex gap-2 mb-0" htmlFor={`private-radio-${idx}`}>
                                                                        <input
                                                                            type="radio"
                                                                            name={`room_type_${idx}`}
                                                                            id={`private-radio-${idx}`}
                                                                            checked={property.room_type === 'Private'}
                                                                            onChange={(e) => handleInputChange(idx, "room_type", 'Private')}
                                                                        />
                                                                        <span className="radio-checkmark"></span>
                                                                        <Image src='./images/icons/group.svg' className='img-fluid' width={24} height={24} alt='private' />
                                                                        Private Room
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        {errors[idx]?.room_type && (
                                                            <div className="invalid-feedback d-block">
                                                                {errors[idx]?.room_type}
                                                            </div>
                                                        )}
                                                        <p className='font-500'>A private room is a single-occupancy space where you have exclusive use of the bed, desk, and other amenities, offering maximum privacy.</p>
                                                    </div>

                                                    <hr />

                                                    {/* Room Size */}
                                                    <div className='form-group relative mb-4'>
                                                        <p className='font-18' style={{ color: '#73615F' }}>Room size(sq ft) <span style={{ color: '#f00' }}>*</span></p>
                                                        <input
                                                            type='text'
                                                            name='room_size_sqft'
                                                            className={`form-control ${errors[idx]?.room_size_sqft ? 'is-invalid' : ''}`}
                                                            placeholder='e.g. 538'
                                                            value={property.room_size_sqft || ''}
                                                            onChange={(e) => handleInputChange(idx, 'room_size_sqft', e.target.value)}
                                                        />
                                                        <span className='absolute right-2 bottom-3'>sq ft</span>
                                                        {errors[idx]?.room_size_sqft && (
                                                            <div className="invalid-feedback d-block">
                                                                {errors[idx]?.room_size_sqft}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}> </p>

                                                    {/* Beds */}
                                                    {property.beds?.map((bed, bedIdx) => (
                                                        <Row className='mb-2' key={bedIdx}>
                                                            <Col md={6}>
                                                                <div className='form-group mb-4'>
                                                                    <p className='font-18' style={{ color: '#73615F' }}>Bed type</p>
                                                                    <Select
                                                                        name={`bed-type-${idx}-${bedIdx}`}
                                                                        options={chooseBeds}
                                                                        placeholder="Choose Bed Type"
                                                                        className='react_selectbox'
                                                                        isSearchable={false}
                                                                        value={bed.bed_type}
                                                                        onChange={option => handleBedChange(idx, bedIdx, 'bed_type', option)}
                                                                        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                                                        styles={customStyles}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col md={6}>
                                                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                                    <div className='form-group mb-4' style={{ flex: 1 }}>
                                                                        <p className='font-18' style={{ color: '#73615F' }}>Bed Name</p>
                                                                        <input
                                                                            type='text'
                                                                            className='form-control'
                                                                            placeholder='e.g. Bed A'
                                                                            value={bed.name || ''}
                                                                            onChange={e => handleBedChange(idx, bedIdx, 'name', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    {property.beds.length > 1 && (
                                                                        <Button
                                                                            variant=""
                                                                            className='mb-4 ms-3 d-flex align-items-center justify-content-center'
                                                                            style={{
                                                                                background: "#f7f2ee",
                                                                                border: "1px solid #463527",
                                                                                borderRadius: "0px",
                                                                                height: "40px",
                                                                                marginLeft: "8px",
                                                                                width: '40px',
                                                                                padding: '0',
                                                                                textAlign: 'center'
                                                                            }}
                                                                            onClick={() => handleRemoveBed(idx, bedIdx)}
                                                                        >
                                                                            <Image src='/images/icons/delete_b.svg' width={20} height={20} alt='Delete' />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            <Col md={12}>
                                                                <hr style={{ margin: "0 0 16px 0" }} />
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                    <Button
                                                        style={{ color: '#2C734A', fontWeight: '500', marginBottom: "16px" }}
                                                        className='d-flex p-0 gap-2'
                                                        variant=''
                                                        onClick={() => handleAddBed(idx)}
                                                    >
                                                        <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' /> Add bed type
                                                    </Button>

                                                    <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}> </p>

                                                    {/* Bathrooms */}
                                                    <Row className='mb-3'>
                                                        <Col md={6}>
                                                            <div className='d-flex align-items-center h-100'>
                                                                <p className='font-18 mb-0' style={{ color: '#73615F' }}>Bathrooms</p>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className='form-group'>
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    border: "2px solid #d3ccc5",
                                                                    borderRadius: "2px",
                                                                    background: "#f2f2f2",
                                                                    padding: "13px 0",
                                                                    width: "100%",
                                                                    maxWidth: "100%",
                                                                    fontSize: "14px",
                                                                    marginTop: "8px"
                                                                }}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleGuestChange(idx, -1)}
                                                                        style={{
                                                                            background: "none",
                                                                            border: "none",
                                                                            textAlign: 'center',
                                                                            width: "20%",
                                                                            cursor: property.bathrooms > 1 ? "pointer" : "not-allowed"
                                                                        }}
                                                                        disabled={property.bathrooms === 1}
                                                                    >
                                                                        <Image src='./images/icons/minus.svg' className='img-fluid ms-auto me-auto' alt='minus' />
                                                                    </button>
                                                                    <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>
                                                                        {property.bathrooms || 1}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleGuestChange(idx, 1)}
                                                                        style={{
                                                                            background: "none",
                                                                            border: "none",
                                                                            color: "#463527",
                                                                            width: "20%",
                                                                            cursor: "pointer",
                                                                            textAlign: 'center'
                                                                        }}
                                                                    >
                                                                        <Image src='./images/icons/Plus.svg' className='img-fluid ms-auto me-auto' alt='plus' />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <hr style={{ margin: '20px 0' }} />

                                                    {/* Bedroom Preference */}
                                                    <Row className='mb-3'>
                                                        <Col md={6}>
                                                            <div className='d-flex align-items-center h-100'>
                                                                <p className='font-18 mb-0' style={{ color: '#73615F' }}>Bedroom preference</p>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className='form-group'>
                                                                <Select
                                                                    name={`bedroom-preference-${idx}`}
                                                                    options={chooseBedprefrence}
                                                                    placeholder="Please select an option"
                                                                    className='react_selectbox'
                                                                    isSearchable={false}
                                                                    value={chooseBedprefrence.find(opt => opt.value === property.bedroom_preference)}
                                                                    onChange={(option) => handleInputChange(idx, 'bedroom_preference', option?.value || '')}
                                                                    styles={customStyles}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <hr style={{ margin: '20px 0' }} />

                                                    {/* Max Guests */}
                                                    <Row className='mb-3'>
                                                        <Col md={6}>
                                                            <div className='d-flex align-items-center h-100'>
                                                                <p className='font-18 mb-0' style={{ color: '#73615F' }}>Max guests allowed</p>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className='form-group'>
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    border: "2px solid #d3ccc5",
                                                                    borderRadius: "2px",
                                                                    background: "#f2f2f2",
                                                                    padding: "13px 0",
                                                                    width: "100%",
                                                                    maxWidth: "100%",
                                                                    fontSize: "14px",
                                                                    marginTop: "0px"
                                                                }}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleGuestChange1(idx, -1)}
                                                                        style={{
                                                                            background: "none",
                                                                            border: "none",
                                                                            textAlign: 'center',
                                                                            width: "20%",
                                                                            cursor: property.max_guests > 1 ? "pointer" : "not-allowed"
                                                                        }}
                                                                        disabled={property.max_guests === 1}
                                                                    >
                                                                        <Image src='./images/icons/minus.svg' className='img-fluid ms-auto me-auto' alt='minus' />
                                                                    </button>
                                                                    <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>
                                                                        {property.max_guests || 1}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleGuestChange1(idx, 1)}
                                                                        style={{
                                                                            background: "none",
                                                                            border: "none",
                                                                            color: "#463527",
                                                                            width: "20%",
                                                                            cursor: "pointer",
                                                                            textAlign: 'center'
                                                                        }}
                                                                    >
                                                                        <Image src='./images/icons/Plus.svg' className='img-fluid ms-auto me-auto' alt='plus' />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <hr style={{ margin: '20px 0' }} />

                                                    {/* Nightly Rate */}
                                                    <div className='form-group relative mb-4'>
                                                        <p className='font-18' style={{ color: '#73615F' }}>Set your rate(Nightly rate) <span style={{ color: '#f00' }}>*</span></p>
                                                        <p>The lowest possible rate for this room, not including promotions, taxes, or other fees.</p>
                                                        <input
                                                            type='text'
                                                            name="avg_base_price_per_night"
                                                            className={`form-control ${errors[idx]?.avg_base_price_per_night ? 'is-invalid' : ''}`}
                                                            placeholder='₹ | 0'
                                                            value={property.avg_base_price_per_night || ''}
                                                            onChange={(e) => handleInputChange(idx, 'avg_base_price_per_night', e.target.value)}
                                                        />
                                                        {errors[idx]?.avg_base_price_per_night && (
                                                            <div className="invalid-feedback d-block">
                                                                {errors[idx]?.avg_base_price_per_night}
                                                            </div>
                                                        )}
                                                        <span className='absolute right-2 bottom-3'>/night</span>
                                                    </div>

                                                    <hr style={{ margin: '20px 0' }} />

                                                    {/* Room Description */}
                                                    <p className='subheadline-2 mb-3'>Room description <span style={{ color: '#f00' }}>*</span></p>
                                                    <div className='form-group mb-4'>
                                                        <textarea
                                                            className={`form-control ${errors[idx]?.room_description ? 'is-invalid' : ''}`}
                                                            rows={15}
                                                            name="room_description"
                                                            placeholder='e.x Mountain views, dedicated meeting spaces, and customizable meal options'
                                                            value={property.room_description || ''}
                                                            onChange={(e) => handleInputChange(idx, 'room_description', e.target.value)}
                                                        />
                                                        {errors[idx]?.room_description && (
                                                            <div className="invalid-feedback d-block">
                                                                {errors[idx]?.room_description}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <hr style={{ margin: '20px 0' }} />

                                                    {/* Room Amenities */}
                                                    <div className='property-list-2'>
                                                        <p className='subheadline-2 mb-3'>Room amenities</p>
                                                        <div className='search-box mb-3' style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                            <div style={{ flex: 1, position: "relative" }}>
                                                                <input
                                                                    type='text'
                                                                    placeholder='Search'
                                                                    className='form-control'
                                                                    value={amenitySearch}
                                                                    onFocus={() => setShowAmenitySearch(true)}
                                                                    onChange={e => setAmenitySearch(e.target.value)}
                                                                    style={{
                                                                        paddingLeft: "40px",
                                                                        fontSize: "16px",
                                                                        border: "2px solid #d3ccc5",
                                                                        borderRadius: "2px",
                                                                        background: "#f2f2f2"
                                                                    }}
                                                                />
                                                                <Image
                                                                    src='/images/icons/search.svg'
                                                                    width={20}
                                                                    height={20}
                                                                    alt='Search'
                                                                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                                                                />
                                                                {amenitySearch && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setAmenitySearch('')}
                                                                        style={{
                                                                            position: "absolute",
                                                                            right: "12px",
                                                                            top: "50%",
                                                                            transform: "translateY(-50%)",
                                                                            background: "none",
                                                                            border: "none",
                                                                            fontSize: "20px",
                                                                            color: "#6B4F3F",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        aria-label="Clear"
                                                                    >
                                                                        <Image
                                                                            src='./images/icons/close-circle.svg'
                                                                            className='img-fluid'
                                                                            width={24}
                                                                            height={24}
                                                                            alt='close'
                                                                        />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {showAmenitySearch && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setAmenitySearch('');
                                                                        setShowAmenitySearch(false);
                                                                    }}
                                                                    style={{
                                                                        background: "none",
                                                                        border: "none",
                                                                        color: "#6B4F3F",
                                                                        fontWeight: "500",
                                                                        fontSize: "16px",
                                                                        cursor: "pointer"
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                        <dl className='br-list-data'>
                                                            {filteredAmenities.map((a, inx) => {
                                                                const isSelected = property.room_amenities?.includes(a.label);
                                                                return (
                                                                    <li key={inx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
                                                                        <span className='br-list gap-2'>
                                                                            <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
                                                                            {a.label}
                                                                        </span>
                                                                        <span
                                                                            className='add-plus-icn'
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => handleAmenitySelect(idx, a.label)}
                                                                        >
                                                                            <Image
                                                                                src={isSelected ? "./images/icons/check_circle.svg" : "./images/icons/add_circle.svg"}
                                                                                className='img-fluid'
                                                                                width={24}
                                                                                height={24}
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
                                                        <hr style={{ margin: '20px 0' }} />
                                                    </div>

                                                    {/* ── Photos Section ─────────────────────────────────────────── */}
                                                    <div className='box-input'>
                                                        {/* Count total photos: saved (photoFile) + newly uploaded (roomPhotos non-existing) */}
                                                        {(() => {
                                                            const savedCount = photoFile?.[idx]?.photos?.length || 0;
                                                            const newCount = step4Data[idx]?.roomPhotos?.filter(p => !p.isExisting)?.length || 0;
                                                            const totalCount = savedCount + newCount;

                                                            return totalCount === 0 ? (
                                                                // Empty state — show upload prompt
                                                                <div className='property-list-2'>
                                                                    <p className='subheadline-2 mb-1'>Add some photos of your flat/apartment</p>
                                                                    <div className='form-group mb-5'>
                                                                        <label>You can add more or make changes later.</label>
                                                                        <div className='add-upload-photo'>
                                                                            <Image
                                                                                src="./images/icons/photo-camera.svg"
                                                                                className='img-fluid mb-2'
                                                                                width={50}
                                                                                height={40}
                                                                                alt='add photo'
                                                                            />
                                                                            <Button
                                                                                onClick={() => changepicModal1(idx)}
                                                                                variant=''
                                                                                className='add-photo-btn'
                                                                            >
                                                                                Add Photo
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                // Has photos — show gallery
                                                                <>
                                                                    <div className='d-flex justify-content-between align-items-start'>
                                                                        <p className='subheadline-2 mb-4'>Photos of your flat / apartment</p>
                                                                        {totalCount < MAX_PHOTOS && (
                                                                            <Button
                                                                                variant=""
                                                                                onClick={() => changepicModal1(idx)}
                                                                            >
                                                                                <Image
                                                                                    src='./images/icons/add_circle.svg'
                                                                                    className='img-fluid'
                                                                                    alt='circle'
                                                                                />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                    <div className="photo-gallery">
                                                                        <div className="grid upload-photo grid-cols-2 gap-4">

                                                                            {/* Saved/existing photos from API (photoFile) */}
                                                                            {photoFile?.[idx]?.photos?.map((photo, photoIndex) => (
                                                                                <div key={`existing-${photoIndex}`} className="relative group">
                                                                                    <Image
                                                                                        src={photo.room_photo_url?.startsWith('http')
                                                                                            ? photo.room_photo_url
                                                                                            : `${photo.room_photo_url}`}
                                                                                        alt={`Room photo ${photoIndex + 1}`}
                                                                                        width={300}
                                                                                        height={200}
                                                                                        className="object-cover w-full h-[200px]"
                                                                                    />
                                                                                    <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                                                        <li>
                                                                                            <button
                                                                                                onClick={() => makeCoverPhoto(photo?.uid)}
                                                                                                className="block text-sm w-full text-left px-3 py-2 hover:bg-gray-100"
                                                                                            >
                                                                                                Make cover photo
                                                                                            </button>
                                                                                        </li>
                                                                                        <li>
                                                                                            {/* ─── FIX: was removePhoto(roomIdx, photoIdx) — now correctly passes uid ─── */}
                                                                                            <button
                                                                                                onClick={() => removePhoto(photo?.uid)}
                                                                                                className="block text-sm w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                                                                            >
                                                                                                Delete
                                                                                            </button>
                                                                                        </li>
                                                                                    </ul>
                                                                                    <div className="more-action absolute top-2 right-2 cursor-pointer">
                                                                                        <Image
                                                                                            src="./images/icons/more-dots-3.svg"
                                                                                            className="img-fluid"
                                                                                            alt="options"
                                                                                            width={20}
                                                                                            height={20}
                                                                                        />
                                                                                    </div>
                                                                                    {photo.is_room_cover_photo && (
                                                                                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                                                                                            Cover Photo
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}

                                                                            {/* Newly uploaded photos (not yet saved) */}
                                                                            {step4Data?.[idx]?.roomPhotos?.filter(p => !p.isExisting).map((newPhoto, newIndex) => (
                                                                                <div key={`new-${newIndex}`} className="relative group">
                                                                                    <Image
                                                                                        src={newPhoto.preview || newPhoto.room_photo_url}
                                                                                        alt={`New photo ${newIndex + 1}`}
                                                                                        width={300}
                                                                                        height={200}
                                                                                        className="object-cover w-full h-[200px]"
                                                                                    />
                                                                                    <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                                                        <li>
                                                                                            {/* ─── FIX: makeCoverPhotoLocal now uses object reference correctly ─── */}
                                                                                            <button
                                                                                                onClick={() => makeCoverPhotoLocal(idx, newIndex)}
                                                                                                className="block text-sm w-full text-left px-3 py-2 hover:bg-gray-100"
                                                                                            >
                                                                                                Make cover photo
                                                                                            </button>
                                                                                        </li>
                                                                                        <li>
                                                                                            {/* ─── FIX: was undefined removeNewPhoto — now defined and called correctly ─── */}
                                                                                            <button
                                                                                                onClick={() => removeNewPhoto(idx, newIndex)}
                                                                                                className="block text-sm w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                                                                            >
                                                                                                Delete
                                                                                            </button>
                                                                                        </li>
                                                                                    </ul>
                                                                                    <div className="more-action absolute top-2 right-2 cursor-pointer">
                                                                                        <Image
                                                                                            src="./images/icons/more-dots-3.svg"
                                                                                            className="img-fluid"
                                                                                            alt="options"
                                                                                            width={20}
                                                                                            height={20}
                                                                                        />
                                                                                    </div>
                                                                                    {newPhoto.is_room_cover_photo && (
                                                                                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                                                                                            Cover Photo
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}

                                                                            {/* Add more placeholder tile */}
                                                                            {totalCount < MAX_PHOTOS && (
                                                                                <div
                                                                                    className="flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer"
                                                                                    style={{ minHeight: '200px' }}
                                                                                    onClick={() => changepicModal1(idx)}
                                                                                >
                                                                                    <div className="flex flex-col items-center cursor-pointer">
                                                                                        <Image
                                                                                            src="/images/icons/photo-camera.svg"
                                                                                            alt="Add"
                                                                                            width={50}
                                                                                            height={40}
                                                                                            className="mb-3 ms-auto me-auto"
                                                                                        />
                                                                                        <span
                                                                                            style={{ border: '1px solid #000', padding: '10px 20px' }}
                                                                                            className="text-sm"
                                                                                        >
                                                                                            Add Photo
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{ margin: "50px 0" }} />
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                    {/* ── End Photos Section ──────────────────────────────────── */}

                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Button variant="" className="btn-company-add mt-5 mb-5" onClick={handleAddProperty}>
                                <span style={{ fontSize: '24px' }}>+</span> Add Bedroom
                            </Button>

                            <hr className='mb-4' />

                            <div className='d-flex mt-5'>
                                <Button
                                    variant=""
                                    className='btn-white-transparent d-flex gap-2 me-3'
                                    style={{ padding: '13px 35px', borderRadius: '0' }}
                                    type="button"
                                    onClick={() => setActiveStep(activeStep - 1)}
                                    disabled={isLoading}
                                >
                                    <Image src="./images/icons/double-arrows.svg" className='img-fluid' alt='arrow' /> Back
                                </Button>

                                <Button
                                    variant=""
                                    className='complete-form-btn'
                                    style={{ padding: '13px 35px', borderRadius: '0' }}
                                    onClick={() => handleSubmit('')}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Processing...' : mode === 'create' ? 'Create Rooms' : 'Update Rooms'}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* ── Photo Upload Modal ──────────────────────────────────────────────── */}
            <Modal show={changepicsModal1} onHide={changepicClose1} animation={false} centered className='custom-theme-modal'>
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0'>
                    <Modal.Title>Upload photo</Modal.Title>
                    <Image
                        src='/images/icons/close-circle.svg'
                        width={24}
                        height={24}
                        alt='Close'
                        style={{ cursor: 'pointer' }}
                        onClick={changepicClose1}
                    />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    {/* ─── FIX: count = saved photos + new photos (not just roomPhotos.length) ─── */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <span>
                            {photoIndex !== null
                                ? (photoFile?.[photoIndex]?.photos?.length || 0) +
                                  (step4Data[photoIndex]?.roomPhotos?.filter(p => !p.isExisting)?.length || 0)
                                : 0} items selected
                        </span>
                        {/* ─── FIX: add-more guard uses total (saved + new) ─── */}
                        {photoIndex !== null &&
                            ((photoFile?.[photoIndex]?.photos?.length || 0) +
                             (step4Data[photoIndex]?.roomPhotos?.filter(p => !p.isExisting)?.length || 0)) < MAX_PHOTOS && (
                            <label className="cursor-pointer d-flex align-items-center gap-2">
                                <Image
                                    src="/images/icons/add_circle.svg"
                                    width={24}
                                    height={24}
                                    alt="Add more photos"
                                />
                                <span>Add more photos</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange1(photoIndex, e)}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <div className="drap-drop-box-full">
                        {photoIndex !== null &&
                            (photoFile?.[photoIndex]?.photos?.length || 0) +
                            (step4Data[photoIndex]?.roomPhotos?.filter(p => !p.isExisting)?.length || 0) === 0 ? (
                            // Empty state — drag & drop
                            <label
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleFileChange1(photoIndex, { target: { files: e.dataTransfer.files } });
                                }}
                                onDragOver={handleDragOver1}
                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange1(photoIndex, e)}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <Image
                                        src="/images/icons/photo-library.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                    />
                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500 mb-0" style={{ color: "#73615F" }}>
                                        or click here to choose files (max 5).
                                    </p>
                                </div>
                            </label>
                        ) : (
                            // Has photos — show grid inside modal
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    {/* Newly uploaded photos in modal */}
                                    {photoIndex !== null && step4Data[photoIndex]?.roomPhotos
                                        ?.filter(p => !p.isExisting)
                                        .map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                                <Image
                                                    src={photo.preview}
                                                    alt={`Uploaded preview ${index + 1}`}
                                                    width={250}
                                                    height={250}
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewPhoto(photoIndex, index)}
                                                    className="absolute top-1 right-1 delete-icn"
                                                >
                                                    <Image
                                                        src="/images/icons/delete.svg"
                                                        width={20}
                                                        height={20}
                                                        alt="delete"
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between'>
                    <Button variant="" onClick={changepicClose1} className='btn-company-add' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Cancel
                    </Button>
                    <Button
                        variant=""
                        onClick={changepicClose1}
                        className='search-btn complete-form-btn'
                        style={{ padding: '13px 25px', borderRadius: '0' }}
                    >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}