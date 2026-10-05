// "use client"
// import React, { useEffect, useState } from 'react'
// import { Row, Col, Button, Modal } from 'react-bootstrap';
// import Select from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { getFormalityById, postCheckInById } from '@/services/provider';
// import Image from 'next/image';
// import toast from 'react-hot-toast';
// import { Toaster } from "react-hot-toast";


// export const CheckInModal = ({ showCheckInModal, checkInModalClose, docTypeImage, visaImage, passImage, setPassImage, setVisaImage, setDocTypeImage, handleDrop1, handleDragOver1, handleFileChange1, selectedBookingData, removePhoto,fetchDataFunction }) => {
//     const [formData, setFormData] = useState({
//         id_document_type: "Aadhaar",
//         nationality_type: "Indian",
//         personal_details: {
//             first_name: "",
//             last_name: "",
//             gender: "",
//             nationality: "",
//             date_of_birth: null,
//             special_category: ""
//         },

//         accommodation_details: {
//             name: "",
//             street_no: "",
//             flat_no: "",
//             city: "",
//             state: "",
//             pin_code: "",
//             phone: ""
//         },

//         passport_details: {
//             passport_number: "",
//             issuing_country: "",
//             date_of_birth: null,
//             expiry_date: null
//         },

//         visa_details: {
//             issuing_country: "",
//             visa_number: "",
//             date_of_issue: null,
//             valid_till: null,
//             visa_type: "",
//             visa_subtype: ""
//         },

//         arrival_details: {
//             arrived_from: "",
//             date_of_arrival_india: null,
//             date_of_arrival_property: null,
//             time_of_arrival_property: "",
//             intended_duration: ""
//         },

//         permanent_address: {
//             street_no: "",
//             flat_no: "",
//             city: "",
//             state: "",
//             pin_code: ""
//         },

//         reference_in_india: {
//             street_no: "",
//             flat_no: "",
//             city: "",
//             state: "",
//             pin_code: ""
//         },

//         employment: {
//             emplpyed_in_india: false,
//             purpose_of_visit: ""
//         },

//         next_destination: {
//             place: "",
//             street_no: "",
//             flat_no: "",
//             city: "",
//             state: "",
//             pin_code: "",
//             phone: ""
//         },

//         remarks: ""
//     });
//     const [formalityData, setFormalityData] = useState(null);

//     /* ================== HELPERS ================== */

//     const handleChange = (section, field, value) => {
//         let finalValue;

//         // 1️⃣ DatePicker
//         if (value instanceof Date) {
//             finalValue = value;
//         }
//         // 2️⃣ React-Select (object with value)
//         else if (typeof value === "object" && value !== null && "value" in value) {
//             finalValue = value.value;
//         }
//         // 3️⃣ Normal input event
//         else if (value?.target) {
//             finalValue = value.target.value;
//         }
//         // 4️⃣ Custom Select / direct value
//         else {
//             finalValue = value;
//         }

//         setFormData(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [field]: finalValue
//             }
//         }));
//     };
//     const MAX_PHOTOS = 3;

//     const formatDate = d => (d ? d.toISOString().split("T")[0] : "");

//     /* ================== SUBMIT ================== */

//     // const handleSubmit = async () => {
//     //     try {
//     //         const payload = {
//     //             ...formData,
//     //             personal_details: {
//     //                 ...formData.personal_details,
//     //                 date_of_birth: formatDate(formData.personal_details.date_of_birth)
//     //             },
//     //             passport_details: {
//     //                 ...formData.passport_details,
//     //                 date_of_birth: formatDate(formData.passport_details.date_of_birth),
//     //                 expiry_date: formatDate(formData.passport_details.expiry_date)
//     //             },
//     //             visa_details: {
//     //                 ...formData.visa_details,
//     //                 date_of_issue: formatDate(formData.visa_details.date_of_issue),
//     //                 valid_till: formatDate(formData.visa_details.valid_till)
//     //             },
//     //             arrival_details: {
//     //                 ...formData.arrival_details,
//     //                 date_of_arrival_india: formatDate(formData.arrival_details.date_of_arrival_india),
//     //                 date_of_arrival_property: formatDate(formData.arrival_details.date_of_arrival_property)
//     //             }
//     //         };
//     //         const formDataPayload = new FormData();

//     //         // 👈 data must be sent as STRING
//     //         formDataPayload.append("data", JSON.stringify(payload));

//     //         // 👈 passport image (take first file)
//     //         if (passImage?.length > 0) {
//     //             const passportFile = passImage[0].file; // ✅ File object

//     //             formDataPayload.append("passport_front_image_url", passportFile);
//     //         };

//     //         // 👈 visa image
//     //         if (visaImage?.length > 0) {
//     //             const visaFile = visaImage[0].file; // ✅ File object

//     //             formDataPayload.append("visa_image_url", visaFile);
//     //         };

//     //         // 👈 optional ID document images
//     //         if (docTypeImage?.length > 0) {
//     //             formDataPayload.append("id_document_front_url", docTypeImage[0].file);
//     //             if (docTypeImage[1]) {
//     //                 formDataPayload.append("id_document_back_url", docTypeImage[1].file);
//     //             }
//     //         }
//     //         const response = await postCheckInById(selectedBookingData.uid, formDataPayload)
//     //         if (response.data.success) {
//     //             toast.success(response.data.message)
//     //             CheckInFormalitiesClose();
//     //         }else{
//     //             toast.error(response.data)
//     //         }
//     //         // console.log("FINAL PAYLOAD 👉", formDataPayload);
//     //         // console.log("PASSPORT DOCS 👉", passImage);
//     //         // console.log("VISA DOCS 👉", visaImage);

//     //     }
//     //     catch (error) {
//     //         CheckInFormalitiesClose();
//     //          toast.error(error)
//     //     }



//     // };

//     // Utility: removes empty/null/undefined values recursively
//     const removeEmptyFields = (obj) => {
//         if (Array.isArray(obj)) {
//             return obj
//                 .map(removeEmptyFields)
//                 .filter(v => v !== null && v !== undefined && v !== "");
//         } else if (typeof obj === "object" && obj !== null) {
//             return Object.fromEntries(
//                 Object.entries(obj)
//                     .map(([k, v]) => [k, removeEmptyFields(v)])
//                     .filter(([_, v]) =>
//                         v !== null &&
//                         v !== undefined &&
//                         v !== "" &&
//                         !(typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0)
//                     )
//             );
//         }
//         return obj;
//     };

//     const handleSubmit = async () => {
//         try {
//             const rawPayload = {
//                 ...formData,
//                 personal_details: {
//                     ...formData.personal_details,
//                     date_of_birth: formatDate(formData.personal_details.date_of_birth)
//                 },
//                 passport_details: {
//                     ...formData.passport_details,
//                     date_of_birth: formatDate(formData.passport_details.date_of_birth),
//                     expiry_date: formatDate(formData.passport_details.expiry_date)
//                 },
//                 visa_details: {
//                     ...formData.visa_details,
//                     date_of_issue: formatDate(formData.visa_details.date_of_issue),
//                     valid_till: formatDate(formData.visa_details.valid_till)
//                 },
//                 arrival_details: {
//                     ...formData.arrival_details,
//                     date_of_arrival_india: formatDate(formData.arrival_details.date_of_arrival_india),
//                     date_of_arrival_property: formatDate(formData.arrival_details.date_of_arrival_property)
//                 }
//             };

//             const cleanedPayload = removeEmptyFields(rawPayload);

//             const formDataPayload = new FormData();

//             // 👈 data must be sent as STRING
//             formDataPayload.append("data", JSON.stringify(cleanedPayload));

//             // 👈 passport image (take first file)
//             if (passImage?.length > 0) {
//                 formDataPayload.append("passport_front_image_url", passImage[0].file);
//             }

//             // 👈 visa image
//             if (visaImage?.length > 0) {
//                 formDataPayload.append("visa_image_url", visaImage[0].file);
//             }

//             // 👈 optional ID document images
//             if (docTypeImage?.length > 0) {
//                 formDataPayload.append("id_document_front_url", docTypeImage[0].file);
//                 if (docTypeImage[1]) {
//                     formDataPayload.append("id_document_back_url", docTypeImage[1].file);
//                 }
//             }

//             const response = await postCheckInById(selectedBookingData.uid, formDataPayload);

//             if (response.data.success) {
//                 checkInModalClose();
//                 fetchDataFunction()
//                 CheckInFormalitiesClose();
//                 toast.success(response.data.response.message);                
//             } else {
//                if(response.data.response.message) toast.error(response.data.response.message);
//                if(response.data.response.booking_status) toast.error(response.data.response.booking_status);
//             }

//         } catch (error) {
//             CheckInFormalitiesClose();
//             toast.error("Something went wrong");
//         }
//     };

//     const sortoption = [
//         { value: "United States", label: "US" },
//         { value: "India", label: "India" },
//         { value: "United Kingdom", label: "UK" },
//     ]
//     const customStyles = {
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected
//                 ? "#4635271F"
//                 : state.isFocused
//                     ? "#4635271F" // Color on hover
//                     : "inherit",
//             color: state.isSelected ? "#000" : "black",
//             cursor: "pointer", // Optional: improves UX on hover
//         }),
//     };

//     const getMimeTypeFromUrl = (url) => {
//         const extension = url.split(".").pop().toLowerCase().split("?")[0];

//         const mimeMap = {
//             jpg: "image/jpeg",
//             jpeg: "image/jpeg",
//             png: "image/png",
//         };

//         return mimeMap[extension] || "application/octet-stream";
//     };

//     const formatBookingDates = (checkIn, checkOut) => {
//         if (!checkIn || !checkOut) return null;

//         const startDate = new Date(checkIn);
//         const endDate = new Date(checkOut);

//         const diffTime =
//             endDate.setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0);
//         const totalNights = Math.max(diffTime / (1000 * 60 * 60 * 24), 0);

//         const startDay = startDate.getDate();
//         const startMonth = startDate.toLocaleString("en-US", { month: "short" });
//         const startYear = startDate.getFullYear();

//         const endDay = endDate.getDate();
//         const endMonth = endDate.toLocaleString("en-US", { month: "short" });
//         const endYear = endDate.getFullYear();

//         let dateText = "";

//         if (
//             startDate.getMonth() === endDate.getMonth() &&
//             startDate.getFullYear() === endDate.getFullYear()
//         ) {
//             dateText = `${startDay} - ${endDay} ${startMonth}, ${startYear}`;
//         } else {
//             dateText = `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`;
//         }

//         return (
//             <>
//                 {dateText}
//                 <br />
//                 {totalNights} night{totalNights !== 1 ? "s" : ""}
//             </>
//         );
//     };
//     const urlToFile = async (url, filename) => {
//         const response = await fetch(url);
//         const blob = await response.blob();

//         const mimeType = getMimeTypeFromUrl(url);

//         return new File([blob], filename, {
//             type: mimeType,
//             lastModified: Date.now(),
//         });
//     };

//     const getFormalityData = async () => {
//         const parseDate = (date) => (date ? new Date(date) : null);
//         try {
//             const response = await getFormalityById(selectedBookingData.uid)
//             if (response.data.success) {
//                 const apiData = response.data.response.formalities_data.data;
//                 setFormalityData(response.data.response || {})
//                 setFormData({
//                     nationality_type: apiData?.nationality_type ?? "Indian",

//                     personal_details: {
//                         first_name: apiData.personal_details?.first_name || "",
//                         last_name: apiData.personal_details?.last_name || "",
//                         gender: apiData.personal_details?.gender || "",
//                         nationality: apiData.personal_details?.nationality || "",
//                         date_of_birth: parseDate(apiData.personal_details?.date_of_birth),
//                         special_category: apiData.personal_details?.special_category || ""
//                     },

//                     accommodation_details: {
//                         name: apiData.accommodation_details?.name || "",
//                         street_no: apiData.accommodation_details?.street_no || "",
//                         flat_no: apiData.accommodation_details?.flat_no || "",
//                         city: apiData.accommodation_details?.city || "",
//                         state: apiData.accommodation_details?.state || "",
//                         pin_code: apiData.accommodation_details?.pin_code || "",
//                         phone: apiData.accommodation_details?.phone || ""
//                     },

//                     passport_details: {
//                         passport_number: apiData.passport_details?.passport_number || "",
//                         issuing_country: apiData.passport_details?.issuing_country || "",
//                         date_of_birth: parseDate(apiData.passport_details?.date_of_birth),
//                         expiry_date: parseDate(apiData.passport_details?.expiry_date)
//                     },

//                     visa_details: {
//                         issuing_country: apiData.visa_details?.issuing_country || "",
//                         visa_number: apiData.visa_details?.visa_number || "",
//                         visa_type: apiData.visa_details?.visa_type || "",
//                         visa_subtype: apiData.visa_details?.visa_subtype || "",
//                         date_of_issue: parseDate(apiData.visa_details?.date_of_issue),
//                         valid_till: parseDate(apiData.visa_details?.valid_till)
//                     },

//                     arrival_details: {
//                         arrived_from: apiData.arrival_details?.arrived_from || "",
//                         intended_duration: apiData.arrival_details?.intended_duration || "",
//                         date_of_arrival_india: parseDate(apiData.arrival_details?.date_of_arrival_india),
//                         date_of_arrival_property: parseDate(apiData.arrival_details?.date_of_arrival_property),
//                         time_of_arrival_property: apiData.arrival_details?.time_of_arrival_property || ""
//                     },

//                     permanent_address: {
//                         street_no: apiData.permanent_address?.street_no || "",
//                         flat_no: apiData.permanent_address?.flat_no || "",
//                         city: apiData.permanent_address?.city || "",
//                         state: apiData.permanent_address?.state || "",
//                         pin_code: apiData.permanent_address?.pin_code || ""
//                     },

//                     reference_in_india: {
//                         street_no: apiData.reference_in_india?.street_no || "",
//                         flat_no: apiData.reference_in_india?.flat_no || "",
//                         city: apiData.reference_in_india?.city || "",
//                         state: apiData.reference_in_india?.state || "",
//                         pin_code: apiData.reference_in_india?.pin_code || ""
//                     },

//                     employment: {
//                         emplpyed_in_india: apiData.employment?.employed_in_india ?? false,
//                         purpose_of_visit: apiData.employment?.purpose_of_visit || ""
//                     },

//                     next_destination: {
//                         place: apiData.next_destination?.place || "",
//                         street_no: apiData.next_destination?.street_no || "",
//                         flat_no: apiData.next_destination?.flat_no || "",
//                         city: apiData.next_destination?.city || "",
//                         state: apiData.next_destination?.state || "",
//                         pin_code: apiData.next_destination?.pin_code || "",
//                         phone: apiData.next_destination?.phone || ""
//                     },

//                     remarks: apiData.remarks || ""
//                 });
//                 if (apiData?.passport_details?.passport_front_image_url) {
//                     const passportFile = await urlToFile(
//                         apiData.passport_details.passport_front_image_url,
//                         "passport.jpg"
//                     );

//                     setPassImage([
//                         {
//                             apiImageRes: apiData.passport_details.passport_front_image_url,
//                             file: passportFile,
//                             preview: apiData.passport_details.passport_front_image_url,
//                         },
//                     ]);
//                 }
//                 if (apiData?.visa_details?.visa_image_url) {
//                     const visaFile = await urlToFile(
//                         apiData.visa_details.visa_image_url,
//                         "visa.jpg"
//                     );

//                     setVisaImage([
//                         {
//                             apiImageRes: apiData.visa_details.visa_image_url,
//                             file: visaFile,
//                             preview: apiData.visa_details.visa_image_url,
//                         },
//                     ]);
//                 }

//             }
//         } catch (error) {
//             console.log("Error feching booking filters:", error);
//         }
//     }

//     useEffect(() => {
//         getFormalityData()
//     }, [selectedBookingData])

//     const handleCopy = () => {
//         navigator.clipboard.writeText(formalityData?.booking_number);
//         toast.success("Booking ID copied");
//     };


//     return (
//         <Modal show={showCheckInModal} onHide={checkInModalClose} animation={false} centered className='custom-theme-modal ' >
//             <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

//                 <Modal.Title>
//                     Check-in Formalities
//                 </Modal.Title>

//                 <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={checkInModalClose} />
//             </Modal.Header>
//             <Modal.Body className='pt-4 pb-4'>

//                 <div className='update-step-1'>
//                     <div className='booking-details-br'>

//                         <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for {formalityData?.traveler?.name} </p>

//                         {/* <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p> */}
//                         <p className='d-flex align-items-center gap-2' style={{ lineHeight: 'auto', fontSize: '14px' }} >

//                             {formalityData?.room_name}  &nbsp;|
//                             <Image src='/images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> Bed A | &nbsp; <span style={{ lineHeight: '18px' }} className={

//                                 formalityData?.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
//                                     formalityData?.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
//                                         formalityData?.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
//                                             formalityData?.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
//                                                 formalityData?.booking_status === "Checked In" ? 'badge-Checked-in' :
//                                                     formalityData?.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
//                                                         formalityData?.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
//                                                             formalityData?.booking_status === 'Cancelled' ? 'badge-Cancel' :
//                                                                 formalityData?.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
//                             }>{formalityData?.booking_status}</span>  </p>

//                         <hr></hr>
//                         <div className='bm-contact mt-4'>

//                             <ul className='room-list'>


//                                 <li>
//                                     {formatBookingDates(
//                                         formalityData?.check_in_date,
//                                         formalityData?.check_out_date
//                                     )}
//                                 </li>
//                                 <li>    <Toaster position="top-right" /> <span>Booking Id </span> {formalityData?.booking_number} <Image src='/images/icons/content_copy.svg' className='img-fluid' alt='clone' width={20} height={20} style={{ cursor: "pointer" }}
//                                     onClick={handleCopy} /> </li>
//                             </ul>


//                         </div>


//                     </div>

//                     <div className='booking-details-br mt-3'>
//                         <p className='font-18 fw-medium'>Guest Nationality</p>

//                         <Row>
//                             <Col md={12} className='d-flex justify-content-start gap-2' >
//                                 <div className="radio-select-box d-flex gap-2">
//                                     <label className="form-check-label d-flex gap-2" htmlFor="nationality-indian">
//                                         <input
//                                             type="radio"
//                                             name="select-nationality"
//                                             id="nationality-indian"
//                                             checked={formData?.nationality_type === "Indian"}
//                                             onChange={() => { setFormData({ ...formData, nationality_type: "Indian", id_document_type: "Aadhaar" }); }}
//                                         />
//                                         <span className="radio-checkmark"></span>
//                                         Indian
//                                     </label>
//                                 </div>

//                                 <div className="radio-select-box d-flex gap-2">
//                                     <label className="form-check-label d-flex gap-2" htmlFor="nationality-foreign">
//                                         <input
//                                             type="radio"
//                                             name="select-nationality"
//                                             id="nationality-foreign"
//                                             checked={formData?.nationality_type === "Foreign-National"}
//                                             onChange={() => setFormData({ ...formData, nationality_type: "Foreign-National" })}
//                                         />
//                                         <span className="radio-checkmark"></span>
//                                         Foreign National
//                                     </label>
//                                 </div>
//                             </Col>
//                         </Row>

//                     </div>



//                     {formData.nationality_type === "Indian" && (

//                         <>
//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Choose an ID type to add</p>

//                                 <Row>
//                                     <Col md={12} className='d-flex justify-content-start gap-2' >
//                                         <div className="radio-select-box d-flex gap-2">
//                                             <label className="form-check-label d-flex gap-2" htmlFor="id-type-passport">
//                                                 <input
//                                                     type="radio"
//                                                     name="select-id-type"
//                                                     id="id-type-passport"
//                                                     checked={formData.id_document_type === "Passport"}
//                                                     onChange={() => setFormData({ ...formData, id_document_type: "Passport" })}
//                                                 />
//                                                 <span className="radio-checkmark"></span>
//                                                 Passport
//                                             </label>
//                                         </div>

//                                         <div className="radio-select-box d-flex gap-2">
//                                             <label className="form-check-label d-flex gap-2" htmlFor="id-type-aadhaar">
//                                                 <input
//                                                     type="radio"
//                                                     name="select-id-type"
//                                                     id="id-type-aadhaar"
//                                                     checked={formData.id_document_type === "Aadhaar"}
//                                                     onChange={() => setFormData({ ...formData, id_document_type: "Aadhaar" })}
//                                                 />
//                                                 <span className="radio-checkmark"></span>
//                                                 Aadhaar card
//                                             </label>
//                                         </div>

//                                         <div className="radio-select-box d-flex gap-2">
//                                             <label className="form-check-label d-flex gap-2" htmlFor="id-type-driving">
//                                                 <input
//                                                     type="radio"
//                                                     name="select-id-type"
//                                                     id="id-type-driving"
//                                                     checked={formData.id_document_type === "Driving-Licence"}
//                                                     onChange={() => setFormData({ ...formData, id_document_type: "Driving-Licence" })}
//                                                 />
//                                                 <span className="radio-checkmark"></span>
//                                                 Driving licence
//                                             </label>
//                                         </div>
//                                     </Col>
//                                 </Row>



//                                 <hr />

//                                 {/* Conditional fields for ID type */}
//                                 {formData?.id_document_type === "Passport" && (
//                                     <>
//                                         <div className='drap-drop-box-full flex-column  align-items-start'>
//                                             <p className='font-18 fw-medium'>Upload an image of Guest passport</p>
//                                             <p>Make sure the photo of guest passport isn’t blurry and that it clearly shows the guests face.</p>
//                                             <label className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer drag-box-img-upload " style={{ minHeight: '156px' }}>
//                                                 <input
//                                                     type="file"
//                                                     accept="image/*"
//                                                     multiple
//                                                     onChange={(e) =>
//                                                         handleFileChange1(e, docTypeImage, setDocTypeImage)
//                                                     }
//                                                     className="hidden"
//                                                 />
//                                                 {docTypeImage.length > 0 ? (
//                                                     <div className='relative flex item-center justify-center' >
//                                                         {docTypeImage.map((photo, index) => (
//                                                             <div key={index}>
//                                                                 <Image src={photo?.apiImageRes
//                                                                     ? `https://alicedevapi.casamelhor.in/media/${photo?.apiImageRes}`
//                                                                     : photo?.localImageRes || ""} width={300} height={200} alt="" />
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 ) : (
//                                                     <>
//                                                         <div className="w-10 h-10 flex items-center justify-center ">
//                                                             <Image src='/images/icons/menu_book.svg' width={24} height={24} alt='upload' />
//                                                         </div>

//                                                         <p className="text-sm font-medium text-gray-700 mb-0">
//                                                             Upload passport
//                                                         </p>

//                                                         <p className="text-xs text-gray-400 mt-1">
//                                                             JPEG or PNG only
//                                                         </p>
//                                                     </>
//                                                 )}
//                                             </label>
//                                         </div>
//                                     </>
//                                 )}
//                                 {formData?.id_document_type === "Aadhaar" && (
//                                     <div className=''>
//                                         <p className='font-18 fw-medium'>Upload images of Guest Aadhaar card</p>
//                                         <p>Make sure the photos aren’t blurry and the front of the Aadhaar card clearly shows the guests face.</p>
//                                         <Row className="mt-4">
//                                             {console.log(docTypeImage)}
//                                             {/* {[0, 1].map((side) => ( */}
//                                             <Col md="6" >
//                                                 <div className='drap-drop-box-full flex-column  align-items-start'>
//                                                     <label className="w-full relative flex flex-col items-center justify-center h-48 border-2 border-dashed  cursor-pointer transition
//         border-gray-300  drag-box-img-upload" style={{ minHeight: '156px' }}>

//                                                         <input
//                                                             type="file"
//                                                             accept="image/*"
//                                                             className='hidden'
//                                                             onChange={e =>
//                                                                 handleFileChange1(e, docTypeImage, setDocTypeImage, "front")
//                                                             }

//                                                         />

//                                                         {/* Preview */}
//                                                         {!!docTypeImage?.[0] ? (
//                                                             <Image
//                                                                 // src={docTypeImage[side]?.preview}
//                                                                 src={docTypeImage?.[0]?.apiImageRes
//                                                                     ? `https://alicedevapi.casamelhor.in/media/${docTypeImage?.[0]?.apiImageRes}`
//                                                                     : docTypeImage?.[0]?.localImageRes || ""}
//                                                                 alt={"Front Image"}
//                                                                 className="absolute inset-0 w-full h-full object-cover rounded-lg"
//                                                             />
//                                                         ) : (
//                                                             <>
//                                                                 <div className="w-10 h-10 flex items-center justify-center  text-gray-400 mb-2 text-xl">
//                                                                     <Image src='/images/icons/id_card.svg' width={24} height={24} alt='upload' />
//                                                                 </div>

//                                                                 <p className="text-sm font-medium text-gray-700 mb-1">
//                                                                     Upload Front Image
//                                                                 </p>

//                                                                 <p className="text-xs text-gray-400 mt-1">
//                                                                     Click to upload
//                                                                 </p>
//                                                             </>
//                                                         )}
//                                                     </label>
//                                                 </div>
//                                             </Col>
//                                             <Col md="6">
//                                                 <div className='drap-drop-box-full flex-column  align-items-start'>
//                                                     <label className="w-full relative flex flex-col items-center justify-center h-48 border-2 border-dashed  cursor-pointer transition
//         border-gray-300 drag-box-img-upload" style={{ minHeight: '156px' }}>

//                                                         <input
//                                                             type="file"
//                                                             accept="image/*"
//                                                             className='hidden'
//                                                             onChange={e =>
//                                                                 handleFileChange1(e, docTypeImage, setDocTypeImage, "back")
//                                                             }

//                                                         />

//                                                         {/* Preview */}
//                                                         {!!docTypeImage?.[1] ? (
//                                                             <Image
//                                                                 // src={docTypeImage[side]?.preview}
//                                                                 src={docTypeImage?.[1]?.apiImageRes
//                                                                     ? `https://alicedevapi.casamelhor.in/media/${docTypeImage?.[1]?.apiImageRes}`
//                                                                     : docTypeImage?.[1]?.localImageRes || ""}
//                                                                 alt={"Back Image"}
//                                                                 className="absolute inset-0 w-full h-full object-cover rounded-lg"
//                                                             />
//                                                         ) : (
//                                                             <>
//                                                                 <div className="w-10 h-10 flex items-center justify-center   text-gray-400 mb-2 text-xl">
//                                                                     <Image src='/images/icons/bank-card-line1.svg' width={24} height={24} alt='upload' />
//                                                                 </div>

//                                                                 <p className="text-sm font-medium text-gray-700  mb-1">
//                                                                     Upload Back Image
//                                                                 </p>

//                                                                 <p className="text-xs text-gray-400 mt-1">
//                                                                     Click to upload
//                                                                 </p>
//                                                             </>
//                                                         )}
//                                                     </label>
//                                                 </div>
//                                             </Col>
//                                             {/* ))} */}
//                                         </Row>

//                                     </div>

//                                 )}
//                                 {formData?.id_document_type === "Driving-Licence" && (
//                                     <>
//                                         <div className='drap-drop-box-full flex-column  align-items-start'>
//                                             <p className='font-18 fw-medium'>Upload an image of Guest Driving Licence</p>
//                                             <p>Make sure the photo of guest driving licence isn’t blurry and that it clearly shows the guests face.</p>

//                                             <label className="w-[450px] drag-box-img-upload relative flex flex-col items-center justify-center h-50 border-2 border-dashed  cursor-pointer transition
//         border-gray-300 drag-box-img-upload" style={{ minHeight: '156px' }}>
//                                                 <input
//                                                     type="file"
//                                                     accept="image/*"
//                                                     multiple
//                                                     onChange={(e) =>
//                                                         handleFileChange1(e, docTypeImage, setDocTypeImage)
//                                                     }
//                                                     className="hidden"
//                                                 />
//                                                 {docTypeImage.length > 0 ? (
//                                                     <div className='relative flex item-center justify-center' >
//                                                         {docTypeImage.map((photo, index) => (
//                                                             <div key={index}>
//                                                                 <Image src={photo.apiImageRes
//                                                                     ? `https://alicedevapi.casamelhor.in/media/${photo.apiImageRes}`
//                                                                     : photo.localImageRes || ""} width={300} height={200} alt="" />
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 ) : (
//                                                     <>
//                                                         <div className="w-10 h-10 flex items-center justify-center  text-gray-400 mb-2 text-xl">
//                                                             <Image src='/images/icons/id_card.svg' width={24} height={24} alt='upload' />
//                                                         </div>

//                                                         <p className="text-sm font-medium text-gray-700 mb-1">
//                                                             Upload Front Image
//                                                         </p>

//                                                         <p className="text-xs text-gray-400 mt-1">
//                                                             Click to upload
//                                                         </p>
//                                                     </>
//                                                 )}
//                                             </label>
//                                         </div>

//                                     </>
//                                 )}
//                             </div>
//                         </>
//                     )}


//                     {formData.nationality_type === "Foreign-National" && (
//                         <>
//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Personal Details</p>

//                                 <p>Enter the following information exactly the same as it appears on the traveler’s passport or ID.</p>


//                                 <Row className='g-3'>
//                                     <Col md={12}>
//                                         <label className='form-label'>First name</label>
//                                         <div className='d-flex align-items-center form-group'>
//                                             <input className='form-control' value={formData.personal_details.first_name}
//                                                 onChange={v => handleChange("personal_details", "first_name", v)} />
//                                             <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
//                                                 <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
//                                             </button>
//                                         </div>
//                                     </Col>

//                                     <Col md={12}>
//                                         <label className='form-label'>Last name</label>
//                                         <div className='d-flex align-items-center form-group'>
//                                             <input className='form-control' value={formData.personal_details.last_name}
//                                                 onChange={v => handleChange("personal_details", "last_name", v)} />
//                                             <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
//                                                 <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
//                                             </button>
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Gender</label>
//                                             <select className='form-control' value={formData.personal_details.gender}
//                                                 onChange={v => handleChange("personal_details", "gender", v)}>
//                                                 <option>Female</option>
//                                                 <option>Male</option>
//                                                 <option>Other</option>
//                                             </select>
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Nationality</label>
//                                             <select className='form-control' value={formData.personal_details.nationality}
//                                                 onChange={v => handleChange("personal_details", "nationality", v)}>
//                                                 <option value=''>Select</option>
//                                                 <option value='India'>India</option>
//                                                 <option value='United States'>USA</option>
//                                                 <option value='United Kingdom'>UK</option>
//                                             </select>
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Date of birth</label>
//                                             <DatePicker className="form-control" selected={formData.personal_details.date_of_birth} onChange={(date) => { handleChange("personal_details", "date_of_birth", date) }} />
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Special Category</label>
//                                             <input className='form-control' value={formData.personal_details.special_category}
//                                                 onChange={v => handleChange("personal_details", "special_category", v)} />
//                                         </div>
//                                     </Col>
//                                 </Row>

//                             </div>


//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Accommodation Details</p>


//                                 <div className='form-group mb-4'>
//                                     <label>Name</label>
//                                     {/* <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.x. GQJ8+V2H Calangute, Goa' /> */}
//                                     <input className='form-control' value={formData.accommodation_details.name}
//                                         onChange={v => handleChange("accommodation_details", "name", v)} />
//                                     {/* <span className='text-danger'>{errorMessages.headOfficeLocation}</span> */}
//                                 </div>
//                                 <Row>
//                                     <Col md={8}>
//                                         <div className='form-group mb-4'>
//                                             <label>Street and number</label>
//                                             <input className='form-control' value={formData.accommodation_details.street_no}
//                                                 onChange={v => handleChange("accommodation_details", "street_no", v)} />
//                                             {/* <span className='text-danger'>{errorMessages.street}</span> */}
//                                         </div>
//                                     </Col>
//                                     <Col md={4}>
//                                         <div className='form-group mb-4'>
//                                             <label>Flat/House No.</label>
//                                             <input className='form-control' value={formData.accommodation_details.flat_no}
//                                                 onChange={v => handleChange("accommodation_details", "flat_no", v)} />
//                                             {/* <span className='text-danger'>{errorMessages.flatNo}</span> */}
//                                         </div>
//                                     </Col>
//                                 </Row>
//                                 <div className='form-group mb-4'>
//                                     <label>City</label>
//                                     <input className='form-control' value={formData.accommodation_details.city}
//                                         onChange={v => handleChange("accommodation_details", "city", v)} />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>
//                                 <Row>
//                                     <Col md={4}>
//                                         <div className='form-group mb-4'>
//                                             <label>State</label>
//                                             {/* <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' /> */}
//                                             <input className='form-control' value={formData.accommodation_details.state}
//                                                 onChange={v => handleChange("accommodation_details", "state", v)} />
//                                             {/* <span className='text-danger'>{errorMessages.state}</span> */}
//                                         </div>
//                                     </Col>
//                                     <Col md={8}>
//                                         <div className='form-group mb-4'>
//                                             <label>PIN code</label>
//                                             <input className='form-control' type='number' value={formData.accommodation_details.pin_code}
//                                                 onChange={v => handleChange("accommodation_details", "pin_code", v)} />
//                                             {/* <span className='text-danger'>{errorMessages.pinCode}</span> */}
//                                         </div>
//                                     </Col>
//                                 </Row>


//                                 <div className='form-group mb-4'>
//                                     <label>Mobile number</label>
//                                     <input type='number' name='city' className='form-control' value={formData.accommodation_details.phone}
//                                         onChange={v => handleChange("accommodation_details", "phone", v)} placeholder='--' />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>


//                             </div>


//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Arrival Details</p>


//                                 <div className='form-group mb-4'>
//                                     <label>Arrived From</label>
//                                     {/* <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='Enter' /> */}
//                                     <input className='form-control' value={formData.arrival_details.arrived_from}
//                                         onChange={v => handleChange("arrival_details", "arrived_from", v)} />
//                                     {/* <span className='text-danger'>{errorMessages.headOfficeLocation}</span> */}
//                                 </div>
//                                 <Row>
//                                     <Col md={6}>
//                                         <div className='form-group mb-4'>
//                                             <label>Date of arrival in India</label>
//                                             <DatePicker
//                                                 selected={formData.arrival_details.date_of_arrival_india}
//                                                 onChange={d => handleChange("arrival_details", "date_of_arrival_india", d)}
//                                                 placeholderText="Select date"
//                                                 className="form-control  custom-date-picker"
//                                                 dateFormat="dd/MM/yyyy"

//                                             />
//                                         </div>
//                                     </Col>
//                                     <Col md={6}>
//                                         <div className='form-group mb-4'>
//                                             <label>Date of Arrival in Individual House</label>
//                                             <DatePicker
//                                                 selected={formData.arrival_details.date_of_arrival_property}
//                                                 onChange={d => handleChange("arrival_details", "date_of_arrival_property", d)}
//                                                 placeholderText="Select date"
//                                                 className="form-control  custom-date-picker"
//                                                 dateFormat="dd/MM/yyyy"

//                                             />                                            </div>
//                                     </Col>
//                                 </Row>
//                                 <div className='form-group mb-4'>
//                                     <label>Time of Arrival in Individual House</label>
//                                     <input type='time' className='form-control' value={formData.arrival_details.time_of_arrival_property}
//                                         onChange={v => handleChange("arrival_details", "time_of_arrival_property", v)} />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>



//                                 <div className='form-group mb-0'>
//                                     <label>Intended Duration of Stay in Individual House</label>
//                                     <input className='form-control' value={formData.arrival_details.intended_duration}
//                                         onChange={v => handleChange("arrival_details", "intended_duration", v)} />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>


//                             </div>



//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Upload an image of Guest passport</p>

//                                 <p>EnMake sure the photo of the guest passport isn’t blurry and that it clearly shows the guests face.</p>


//                                 <Row className='g-3'>
//                                     <Col md={12}>
//                                         <div className="d-flex align-items-center justify-content-start mb-3">
//                                             {passImage.length < MAX_PHOTOS && (
//                                                 <label className="cursor-pointer d-flex align-items-center gap-2">
//                                                     <Image
//                                                         src="/images/icons/add_circle.svg"
//                                                         width={24}
//                                                         height={24}
//                                                         alt="Add more photos"
//                                                     />
//                                                     <span>Add more photos</span>
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         multiple
//                                                         onChange={(e) => { handleFileChange1(e, passImage, setPassImage) }}
//                                                         className="hidden"
//                                                     />
//                                                 </label>
//                                             )}
//                                         </div>
//                                         <div className="drap-drop-box-full">
//                                             {passImage.length === 0 ? (
//                                                 <label
//                                                     onDrop={handleDrop1}
//                                                     onDragOver={handleDragOver1}
//                                                     style={{ minHeight: '156px' }}
//                                                     className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
//                                                 >
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         multiple
//                                                         onChange={(e) => { handleFileChange1(e, passImage, setPassImage) }}
//                                                         className="hidden"
//                                                     />
//                                                     <div className="text-center">
//                                                         <Image
//                                                             src="/images/icons/menu_book.svg"
//                                                             alt="Upload"
//                                                             width={30}
//                                                             height={30}
//                                                             className="mx-auto mb-2"
//                                                         />
//                                                         <p className="font-medium mb-0" style={{ color: "#463527" }}>
//                                                             Upload passport
//                                                         </p>
//                                                         <p
//                                                             className="text-sm text-gray-500 mb-0"
//                                                             style={{ color: "#73615F" }}
//                                                         >
//                                                             JPEG or PNG only
//                                                         </p>
//                                                     </div>
//                                                 </label>
//                                             ) : (
//                                                 <div>
//                                                     <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//                                                         {passImage.map((photo, index) => (
//                                                             <div key={index} className="relative inline-block">
//                                                                 <Image
//                                                                     src={photo.apiImageRes
//                                                                         ? `https://alicedevapi.casamelhor.in/media/${photo.apiImageRes}`
//                                                                         : photo.localImageRes || ""}
//                                                                     alt={`Uploaded preview ${index + 1}`}
//                                                                     width={156}
//                                                                     height={156}
//                                                                     className="object-cover"
//                                                                     style={{ width: '100%', height: '156px' }}
//                                                                 />
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() => removePhoto(index, setPassImage)}
//                                                                     className="absolute top-1 right-1 delete-icn"
//                                                                 >
//                                                                     <Image
//                                                                         src="/images/icons/delete.svg"
//                                                                         width={20}
//                                                                         height={20}
//                                                                         alt="delete"
//                                                                     />
//                                                                 </button>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <p className='mt-4' >Re-Upload Image</p>
//                                     </Col>



//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Issuing country/region</label>
//                                             <Select
//                                                 name="aria-role-select"
//                                                 options={sortoption}
//                                                 placeholder="Name"
//                                                 className="react_selectbox"
//                                                 value={sortoption.find(
//                                                     opt => opt.value === formData.passport_details.issuing_country
//                                                 )}
//                                                 onChange={v => handleChange("visa_details", "issuing_country", v)}
//                                                 isSearchable={false}
//                                                 styles={customStyles}
//                                             />
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Passport No.</label>
//                                             <input className='form-control' value={formData.passport_details.passport_number}
//                                                 onChange={v => handleChange("passport_details", "passport_number", v)} />
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Date of birth</label>
//                                             <DatePicker
//                                                 selected={formData.passport_details.date_of_birth}
//                                                 onChange={d => handleChange("passport_details", "date_of_birth", d)}
//                                                 placeholderText="Select date"
//                                                 className="form-control  custom-date-picker"
//                                                 dateFormat="dd/MM/yyyy"

//                                             />
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Expiry Date</label>

//                                             <DatePicker
//                                                 selected={formData.passport_details.expiry_date}
//                                                 onChange={d => handleChange("passport_details", "expiry_date", d)}
//                                                 placeholderText="Select date"
//                                                 className="form-control  custom-date-picker"
//                                                 dateFormat="dd/MM/yyyy"

//                                             />

//                                         </div>
//                                     </Col>
//                                 </Row>

//                             </div>


//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Upload an image of Guest Visa document</p>

//                                 <p>Make sure the photo of guest visa document isn’t blurry and that it clearly shows the guests face.</p>


//                                 <Row className='g-3'>
//                                     <Col md={12}>
//                                         <div className="d-flex align-items-center justify-content-start mb-3">
//                                             {visaImage.length > 0 && visaImage.length < MAX_PHOTOS && (
//                                                 <label className="cursor-pointer d-flex align-items-center gap-2">
//                                                     <Image
//                                                         src="/images/icons/add_circle.svg"
//                                                         width={24}
//                                                         height={24}
//                                                         alt="Add more photos"
//                                                     />
//                                                     <span>Add more photos</span>
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         multiple
//                                                         onChange={(e) => { handleFileChange1(e, visaImage, setVisaImage) }}
//                                                         className="hidden"
//                                                     />
//                                                 </label>
//                                             )}
//                                         </div>
//                                         <div className="drap-drop-box-full">
//                                             {visaImage.length === 0 ? (
//                                                 <label
//                                                     onDrop={handleDrop1}
//                                                     onDragOver={handleDragOver1}
//                                                     style={{ minHeight: '156px' }}
//                                                     className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
//                                                 >
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         multiple
//                                                         onChange={(e) => { handleFileChange1(e, visaImage, setVisaImage) }}
//                                                         className="hidden"
//                                                     />
//                                                     <div className="text-center">
//                                                         <Image
//                                                             src="/images/icons/article_person.svg"
//                                                             alt="Upload"
//                                                             width={30}
//                                                             height={30}
//                                                             className="mx-auto mb-2"
//                                                         />
//                                                         <p className="font-medium mb-0" style={{ color: "#463527" }}>
//                                                             Upload visa
//                                                         </p>
//                                                         <p
//                                                             className="text-sm text-gray-500 mb-0"
//                                                             style={{ color: "#73615F" }}
//                                                         >
//                                                             JPEG or PNG only
//                                                         </p>
//                                                     </div>
//                                                 </label>
//                                             ) : (
//                                                 <div>
//                                                     <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//                                                         {visaImage.map((photo, index) => (
//                                                             <div key={index} className="relative inline-block">
//                                                                 <Image
//                                                                     src={photo.apiImageRes
//                                                                         ? `https://alicedevapi.casamelhor.in/media/${photo.apiImageRes}`
//                                                                         : photo.localImageRes || ""}
//                                                                     alt={`Uploaded preview ${index + 1}`}
//                                                                     width={156}
//                                                                     height={156}
//                                                                     className="object-cover"
//                                                                     style={{ width: '100%', height: '156px' }}
//                                                                 />
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() => removePhoto(index, setVisaImage)}
//                                                                     className="absolute top-1 right-1 delete-icn"
//                                                                 >
//                                                                     <Image
//                                                                         src="/images/icons/delete.svg"
//                                                                         width={20}
//                                                                         height={20}
//                                                                         alt="delete"
//                                                                     />
//                                                                 </button>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>

//                                     </Col>



//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Issuing country/region</label>
//                                             <Select
//                                                 name="aria-role-select"
//                                                 options={sortoption}
//                                                 placeholder="Name"
//                                                 className="react_selectbox"
//                                                 value={sortoption.find(
//                                                     opt => opt.value === formData.visa_details.issuing_country
//                                                 )}
//                                                 onChange={v => handleChange("visa_details", "issuing_country", v)}
//                                                 isSearchable={false}
//                                                 styles={customStyles}
//                                             />
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Visa Number</label>
//                                             <input className='form-control' value={formData.visa_details.visa_number} onChange={v => handleChange("visa_details", "visa_number", v)} placeholder='Enter' />
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Date of Issue</label>
//                                             <DatePicker
//                                                 selected={formData.visa_details.date_of_issue}
//                                                 onChange={v => handleChange("visa_details", "date_of_issue", v)}
//                                                 placeholderText="Select"
//                                                 className="form-control  custom-date-picker"
//                                                 dateFormat="dd/MM/yyyy"

//                                             />
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Valid Till</label>

//                                             <DatePicker
//                                                 selected={formData.visa_details.valid_till}
//                                                 onChange={v => handleChange("visa_details", "valid_till", v)}
//                                                 placeholderText="Select"
//                                                 className="form-control  custom-date-picker"
//                                                 dateFormat="dd/MM/yyyy"

//                                             />

//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Visa Type</label>
//                                             <input className='form-control' value={formData.visa_details.visa_type} onChange={v => handleChange("visa_details", "visa_type", v)} placeholder='Enter' />
//                                         </div>
//                                     </Col>


//                                     <Col md={6}>
//                                         <div className='form-group'>
//                                             <label className='form-label'>Visa Subtype</label>
//                                             <input className='form-control' value={formData.visa_details.visa_subtype} onChange={v => handleChange("visa_details", "visa_subtype", v)} placeholder='Enter' />
//                                         </div>
//                                     </Col>
//                                 </Row>

//                             </div>


//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Address in country where residing permanently</p>



//                                 <Row>
//                                     <Col md={8}>
//                                         <div className='form-group mb-4'>
//                                             <label>Street and number</label>
//                                             <input type='text' value={formData.permanent_address.street_no} onChange={(v) => handleChange("permanent_address", "street_no", v)}
//                                                 name='street' className='form-control' placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.street}</span> */}
//                                         </div>
//                                     </Col>
//                                     <Col md={4}>
//                                         <div className='form-group mb-4'>
//                                             <label>Flat/House No.</label>
//                                             <input type='text' name='flatNo' className='form-control' value={formData.permanent_address.flat_no} onChange={(v) => handleChange("permanent_address", "flat_no", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.flatNo}</span> */}
//                                         </div>
//                                     </Col>
//                                 </Row>
//                                 <div className='form-group mb-4'>
//                                     <label>City</label>
//                                     <input type='text' name='city' className='form-control' value={formData.permanent_address.city} onChange={(v) => handleChange("permanent_address", "city", v)} placeholder='--' />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>
//                                 <Row>
//                                     <Col md={4}>
//                                         <div className='form-group mb-4'>
//                                             <label>State</label>
//                                             <input type='text' name='state' className='form-control' value={formData.permanent_address.state} onChange={(v) => handleChange("permanent_address", "state", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.state}</span> */}
//                                         </div>
//                                     </Col>
//                                     <Col md={8}>
//                                         <div className='form-group mb-4'>
//                                             <label>PIN code</label>
//                                             <input type='number' name='pinCode' className='form-control pincode-flag' value={formData.permanent_address.pin_code} onChange={(v) => handleChange("permanent_address", "pin_code", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.pinCode}</span> */}
//                                         </div>
//                                     </Col>
//                                 </Row>





//                             </div>



//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Address/Reference in India</p>



//                                 <Row>
//                                     <Col md={8}>
//                                         <div className='form-group mb-4'>
//                                             <label>Street and number</label>
//                                             <input type='text' name='street' value={formData.reference_in_india.street_no} onChange={(v) => handleChange("reference_in_india", "street_no", v)} className='form-control' placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.street}</span> */}
//                                         </div>
//                                     </Col>
//                                     <Col md={4}>
//                                         <div className='form-group mb-4'>
//                                             <label>Flat/House No.</label>
//                                             <input type='text' name='flatNo' className='form-control' value={formData.reference_in_india.flat_no} onChange={(v) => handleChange("reference_in_india", "flat_no", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.flatNo}</span> */}
//                                         </div>
//                                     </Col>
//                                 </Row>
//                                 <div className='form-group mb-4'>
//                                     <label>City</label>
//                                     <input type='text' name='city' className='form-control' value={formData.reference_in_india.city} onChange={(v) => handleChange("reference_in_india", "city", v)} placeholder='--' />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>
//                                 <Row>
//                                     <Col md={4}>
//                                         <div className='form-group mb-4'>
//                                             <label>State</label>
//                                             <input type='text' name='state' className='form-control' value={formData.reference_in_india.state} onChange={(v) => handleChange("reference_in_india", "state", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.state}</span> */}
//                                         </div>
//                                     </Col>
//                                     <Col md={8}>
//                                         <div className='form-group mb-4'>
//                                             <label>PIN code</label>
//                                             <input type='number' name='pinCode' className='form-control pincode-flag' value={formData.reference_in_india.pin_code} onChange={(v) => handleChange("reference_in_india", "pin_code", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.pinCode}</span> */}
//                                         </div>
//                                     </Col>
//                                 </Row>





//                             </div>


//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Whether Employed in India</p>

//                                 <Row>
//                                     <Col md={12} className='d-flex justify-content-start gap-2' >
//                                         <div className="radio-select-box d-flex gap-2">
//                                             <label className="form-check-label d-flex gap-2">
//                                                 <input
//                                                     type="radio"
//                                                     name="select-employed"
//                                                     id="WhetherEmployed-no"
//                                                     checked={!formData.employment.emplpyed_in_india}
//                                                     onChange={() => handleChange("employment", "emplpyed_in_india", false)}
//                                                 />
//                                                 <span className="radio-checkmark"></span>
//                                                 No
//                                             </label>
//                                         </div>

//                                         <div className="radio-select-box d-flex gap-2">
//                                             <label className="form-check-label d-flex gap-2" >
//                                                 <input
//                                                     type="radio"
//                                                     name="select-employed"
//                                                     id="WhetherEmployed-yes"
//                                                     cked={formData.employment.emplpyed_in_india}
//                                                     onChange={() => handleChange("employment", "emplpyed_in_india", true)}
//                                                 />
//                                                 <span className="radio-checkmark"></span>
//                                                 Yes
//                                             </label>
//                                         </div>
//                                     </Col>
//                                 </Row>

//                             </div>



//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Purpose of Visit</p>

//                                 <div className='form-group '>

//                                     <input type='text' name='city' className='form-control' value={formData.employment.purpose_of_visit}
//                                         onChange={v => handleChange("employment", "purpose_of_visit", v)} placeholder='Enter reason' />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>

//                             </div>



//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Next Destination</p>


//                                 <div className='form-group mb-4'>
//                                     <label>Place Name</label>
//                                     <input type='text' name='headOfficeLocation' className='form-control' value={formData.next_destination.place}
//                                         onChange={v => handleChange("next_destination", "place", v)} placeholder='e.g. Grand hyatt' />
//                                     {/* <span className='text-danger'>{errorMessages.headOfficeLocation}</span> */}
//                                 </div>
//                                 <Row>
//                                     <Col md={8}>
//                                         <div className='form-group mb-4'>
//                                             <label>Street and number</label>
//                                             <input type='text' name='street' className='form-control' value={formData.next_destination.street_no}
//                                                 onChange={v => handleChange("next_destination", "street_no", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.street}</span> */}
//                                         </div>
//                                     </Col>
//                                     <Col md={4}>
//                                         <div className='form-group mb-4'>
//                                             <label>Flat/House No.</label>
//                                             <input type='text' name='flatNo' className='form-control' value={formData.next_destination.flat_no}
//                                                 onChange={v => handleChange("next_destination", "flat_no", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.flatNo}</span> */}
//                                         </div>
//                                     </Col>
//                                 </Row>
//                                 <div className='form-group mb-4'>
//                                     <label>City</label>
//                                     <input type='text' name='city' className='form-control' value={formData.next_destination.city}
//                                         onChange={v => handleChange("next_destination", "city", v)} placeholder='--' />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>
//                                 <Row>
//                                     <Col md={4}>
//                                         <div className='form-group mb-4'>
//                                             <label>State</label>
//                                             <input type='text' name='state' className='form-control' value={formData.next_destination.state}
//                                                 onChange={v => handleChange("next_destination", "state", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.state}</span> */}
//                                         </div>
//                                     </Col>
//                                     <Col md={8}>
//                                         <div className='form-group mb-4'>
//                                             <label>PIN code</label>
//                                             <input type='number' name='pinCode' className='form-control pincode-flag' value={formData.next_destination.pin_code}
//                                                 onChange={v => handleChange("next_destination", "pin_code", v)} placeholder='--' />
//                                             {/* <span className='text-danger'>{errorMessages.pinCode}</span> */}
//                                         </div>
//                                     </Col>
//                                 </Row>


//                                 <div className='form-group mb-4'>
//                                     <label>Mobile number</label>
//                                     <input type='number' className='form-control' value={formData.next_destination.phone}
//                                         onChange={v => handleChange("next_destination", "phone", v)} placeholder='--' />
//                                     {/* <span className='text-danger'>{errorMessages.city}</span> */}
//                                 </div>


//                             </div>


//                             <div className='booking-details-br mt-3'>
//                                 <p className='font-18 fw-medium'>Additional comments/ remarks</p>

//                                 <div className='form-group '>

//                                     <textarea className='form-control' value={formData.remarks}
//                                         onChange={e => setFormData({ ...formData, remarks: e.target.value })} placeholder="Add your message here"></textarea>
//                                 </div>

//                             </div>



//                         </>

//                     )}

//                 </div>
//             </Modal.Body>
//             <Modal.Footer className='d-flex align-items-center justify-content-between modern-footer'>
//                 <Button variant=""
//                     onClick={() => { checkInModalClose() }}
//                     className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
//                     Cancel
//                 </Button>
//                 <Button variant="" onClick={() => {
//                     handleSubmit();
//                 }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
//                     Complete
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     )
// }




"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getFormalityById, postCheckInById } from '@/services/provider';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Toaster } from "react-hot-toast";
import { extractErrors } from '@/utils/Alerts/TostifyAlerts';

export const CheckInModal = ({
    showCheckInModal,
    checkInModalClose,
    docTypeImage,
    visaImage,
    passImage,
    setPassImage,
    setVisaImage,
    setDocTypeImage,
    handleDrop1,
    handleDragOver1,
    // FIX: handleFileChange1 removed from props — defined locally below
    //      so the Aadhaar slot-mode signature always matches the call-sites
    selectedBookingData,
    removePhoto,
    fetchDataFunction
}) => {

    const [formData, setFormData] = useState({
        id_document_type: "Aadhaar",
        document_type_fetch: "",
        nationality_type: "Indian",
        personal_details: {
            first_name: "",
            last_name: "",
            gender: "",
            nationality: "",
            date_of_birth: null,
            special_category: ""
        },
        accommodation_details: {
            name: "",
            street_no: "",
            flat_no: "",
            city: "",
            state: "",
            pin_code: "",
            phone: ""
        },
        passport_details: {
            passport_number: "",
            issuing_country: "",
            date_of_birth: null,
            expiry_date: null
        },
        visa_details: {
            issuing_country: "",
            visa_number: "",
            date_of_issue: null,
            valid_till: null,
            visa_type: "",
            visa_subtype: ""
        },
        arrival_details: {
            arrived_from: "",
            date_of_arrival_india: null,
            date_of_arrival_property: null,
            time_of_arrival_property: "",
            intended_duration: ""
        },
        permanent_address: {
            street_no: "",
            flat_no: "",
            city: "",
            state: "",
            pin_code: ""
        },
        reference_in_india: {
            street_no: "",
            flat_no: "",
            city: "",
            state: "",
            pin_code: ""
        },
        employment: {
            emplpyed_in_india: false,
            purpose_of_visit: ""
        },
        next_destination: {
            place: "",
            street_no: "",
            flat_no: "",
            city: "",
            state: "",
            pin_code: "",
            phone: ""
        },
        remarks: ""
    });

    const [formalityData, setFormalityData] = useState(null);

    /* ================== HELPERS ================== */

    const handleChange = (section, field, value) => {
        let finalValue;

        if (value instanceof Date) {
            finalValue = value;
        } else if (typeof value === "object" && value !== null && "value" in value) {
            // React-Select
            finalValue = value.value;
        } else if (value?.target) {
            // Normal input / select / textarea
            finalValue = value.target.type === "checkbox"
                ? value.target.checked
                : value.target.value;
        } else {
            finalValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: finalValue
            }
        }));
    };

    const MAX_PHOTOS = 3;
    const formatDate = d => (d ? d.toISOString().split("T")[0] : "");

    // -----------------------------------------------------------------------
    // FIX: unified file handler supporting two modes:
    //   Slot mode   (Aadhaar front/back): handleFileChange1(e, setDocTypeImage, "front"|"back")
    //   Append mode (passport / visa):    handleFileChange1(e, currentArray, setArray)
    // -----------------------------------------------------------------------
    const handleFileChange1 = (e, arg2, arg3) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (arg3 === "front" || arg3 === "back") {
            // Slot mode — arg2 is the setter, arg3 is the slot name
            const setFn = arg2;
            const slot = arg3 === "front" ? 0 : 1;
            const file = files[0];
            const preview = URL.createObjectURL(file);

            setFn(prev => {
                const next = [...(prev || [])];
                next[slot] = { file, preview, apiImageRes: null };
                return next;
            });
            return;
        }

        // Append mode — arg2 is the current array, arg3 is the setter
        const currentArray = arg2;
        const setFn = arg3;
        const newEntries = files
            .slice(0, MAX_PHOTOS - (currentArray?.length || 0))
            .map(file => ({ file, preview: URL.createObjectURL(file), apiImageRes: null }));

        setFn(prev => [...(prev || []), ...newEntries]);
    };

    /* ================== SUBMIT ================== */

    const removeEmptyFields = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(removeEmptyFields).filter(v => v !== null && v !== undefined && v !== "");
        } else if (typeof obj === "object" && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj)
                    .map(([k, v]) => [k, removeEmptyFields(v)])
                    .filter(([_, v]) =>
                        v !== null &&
                        v !== undefined &&
                        v !== "" &&
                        !(typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0)
                    )
            );
        }
        return obj;
    };

    const handleSubmit = async () => {
        try {
            const rawPayload = {
                ...formData,
                personal_details: {
                    ...formData.personal_details,
                    date_of_birth: formatDate(formData.personal_details.date_of_birth)
                },
                passport_details: {
                    ...formData.passport_details,
                    date_of_birth: formatDate(formData.passport_details.date_of_birth),
                    expiry_date: formatDate(formData.passport_details.expiry_date)
                },
                visa_details: {
                    ...formData.visa_details,
                    date_of_issue: formatDate(formData.visa_details.date_of_issue),
                    valid_till: formatDate(formData.visa_details.valid_till)
                },
                arrival_details: {
                    ...formData.arrival_details,
                    date_of_arrival_india: formatDate(formData.arrival_details.date_of_arrival_india),
                    date_of_arrival_property: formatDate(formData.arrival_details.date_of_arrival_property)
                }
            };

            const cleanedPayload = removeEmptyFields(rawPayload);
            const formDataPayload = new FormData();

            formDataPayload.append("data", JSON.stringify(cleanedPayload));

            if (passImage?.length > 0) {
                if (passImage[0]?.file != null) {
                    formDataPayload.append("passport_front_image_url", passImage[0].file);                    
                }else{
                     if(formalityData.prefilled_from_vault) formDataPayload.append("prefilled_from_vault", true);
                }
            }
            if (visaImage?.length > 0) {
                if (visaImage[0]?.file != null) {
                    formDataPayload.append("visa_image_url", visaImage[0].file);                    
                }else{
                    if(formalityData.prefilled_from_vault) formDataPayload.append("prefilled_from_vault", true);
                }
            }
            if (docTypeImage?.length > 0) {
                if (docTypeImage[0]?.file != null) formDataPayload.append("id_document_front_url", docTypeImage[0].file);
                if (docTypeImage[1]?.file != null) formDataPayload.append("id_document_back_url", docTypeImage[1].file);
                if(docTypeImage[0]?.file == null && docTypeImage[0]?.file == null && formalityData.prefilled_from_vault) formDataPayload.append("prefilled_from_vault", true);
            }

            const response = await postCheckInById(selectedBookingData.uid, formDataPayload);

            if (response.data.success) {
                fetchDataFunction();
                checkInModalClose();
                toast.success(response.data.response.message);
            } else {
                // FIX: removed call to undefined CheckInFormalitiesClose()
                // if (response.data.response.message)        toast.error(response.data.response.message);
                // if (response.data.response.booking_status) toast.error(response.data.response.booking_status);
                const errors = extractErrors(response.data.response);
                errors.forEach((message) => {
                    toast.error(message);
                });
            }

        } catch (error) {
            checkInModalClose();   // FIX: was calling undefined CheckInFormalitiesClose()
            toast.error("Something went wrong");
        }
    };

    /* ================== STATIC OPTIONS ================== */

    const sortoption = [
        { value: "United States", label: "US" },
        { value: "India", label: "India" },
        { value: "United Kingdom", label: "UK" },
    ];

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected || state.isFocused ? "#4635271F" : "inherit",
            color: "black",
            cursor: "pointer",
        }),
    };

    /* ================== IMAGE HELPERS ================== */

    const getMimeTypeFromUrl = (url) => {
        const ext = url.split(".").pop().toLowerCase().split("?")[0];
        return ({ jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" })[ext] || "application/octet-stream";
    };

    const urlToFile = async (url, filename) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: getMimeTypeFromUrl(url), lastModified: Date.now() });
    };

    // FIX: centralised preview-src helper — new uploads store blob URL in
    //      `photo.preview`, NOT `photo.localImageRes` which was never set.
    const imgSrc = (photo) =>
        photo?.apiImageRes
            ? `${photo.apiImageRes}`
            : photo?.preview || "";

    /* ================== DATE FORMAT HELPER ================== */

    const formatBookingDates = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return null;

        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);

        const diffTime =
            new Date(endDate).setHours(0, 0, 0, 0) -
            new Date(startDate).setHours(0, 0, 0, 0);
        const totalNights = Math.max(diffTime / (1000 * 60 * 60 * 24), 0);

        const fmt = d => ({
            day: d.getDate(),
            month: d.toLocaleString("en-US", { month: "short" }),
            year: d.getFullYear(),
        });
        const s = fmt(startDate);
        const e = fmt(endDate);

        const dateText =
            startDate.getMonth() === endDate.getMonth() && s.year === e.year
                ? `${s.day} - ${e.day} ${s.month}, ${s.year}`
                : `${s.day} ${s.month}, ${s.year} - ${e.day} ${e.month}, ${e.year}`;

        return (
            <>
                {dateText}<br />
                {totalNights} night{totalNights !== 1 ? "s" : ""}
            </>
        );
    };

    /* ================== FETCH EXISTING DATA ================== */

    const getFormalityData = async () => {
        const parseDate = d => (d ? new Date(d) : null);
        try {
            const response = await getFormalityById(selectedBookingData.uid);
            if (response.data.success) {
                const apiData = response.data.response.formalities_data;
                setFormalityData(response.data.response || {});

                setFormData({
                    nationality_type: apiData?.nationality_type ?? "Indian",
                    id_document_type: response.data.response?.id_document_type ?? "Aadhaar",
                    document_type_fetch: response.data.response?.id_document_type ?? "Aadhaar",

                    personal_details: {
                        first_name: apiData.personal_details?.first_name || "",
                        last_name: apiData.personal_details?.last_name || "",
                        gender: apiData.personal_details?.gender || "",
                        nationality: apiData.personal_details?.nationality || "",
                        date_of_birth: parseDate(apiData.personal_details?.date_of_birth),
                        special_category: apiData.personal_details?.special_category || ""
                    },
                    accommodation_details: {
                        name: apiData.accommodation_details?.name || "",
                        street_no: apiData.accommodation_details?.street_no || "",
                        flat_no: apiData.accommodation_details?.flat_no || "",
                        city: apiData.accommodation_details?.city || "",
                        state: apiData.accommodation_details?.state || "",
                        pin_code: apiData.accommodation_details?.pin_code || "",
                        phone: apiData.accommodation_details?.phone || ""
                    },
                    passport_details: {
                        passport_number: apiData.passport_details?.passport_number || "",
                        issuing_country: apiData.passport_details?.issuing_country || "",
                        date_of_birth: parseDate(apiData.passport_details?.date_of_birth),
                        expiry_date: parseDate(apiData.passport_details?.expiry_date)
                    },
                    visa_details: {
                        issuing_country: apiData.visa_details?.issuing_country || "",
                        visa_number: apiData.visa_details?.visa_number || "",
                        visa_type: apiData.visa_details?.visa_type || "",
                        visa_subtype: apiData.visa_details?.visa_subtype || "",
                        date_of_issue: parseDate(apiData.visa_details?.date_of_issue),
                        valid_till: parseDate(apiData.visa_details?.valid_till)
                    },
                    arrival_details: {
                        arrived_from: apiData.arrival_details?.arrived_from || "",
                        intended_duration: apiData.arrival_details?.intended_duration || "",
                        date_of_arrival_india: parseDate(apiData.arrival_details?.date_of_arrival_india),
                        date_of_arrival_property: parseDate(apiData.arrival_details?.date_of_arrival_property),
                        time_of_arrival_property: apiData.arrival_details?.time_of_arrival_property || ""
                    },
                    permanent_address: {
                        street_no: apiData.permanent_address?.street_no || "",
                        flat_no: apiData.permanent_address?.flat_no || "",
                        city: apiData.permanent_address?.city || "",
                        state: apiData.permanent_address?.state || "",
                        pin_code: apiData.permanent_address?.pin_code || ""
                    },
                    reference_in_india: {
                        street_no: apiData.reference_in_india?.street_no || "",
                        flat_no: apiData.reference_in_india?.flat_no || "",
                        city: apiData.reference_in_india?.city || "",
                        state: apiData.reference_in_india?.state || "",
                        pin_code: apiData.reference_in_india?.pin_code || ""
                    },
                    employment: {
                        emplpyed_in_india: apiData.employment?.employed_in_india ?? false,
                        purpose_of_visit: apiData.employment?.purpose_of_visit || ""
                    },
                    next_destination: {
                        place: apiData.next_destination?.place || "",
                        street_no: apiData.next_destination?.street_no || "",
                        flat_no: apiData.next_destination?.flat_no || "",
                        city: apiData.next_destination?.city || "",
                        state: apiData.next_destination?.state || "",
                        pin_code: apiData.next_destination?.pin_code || "",
                        phone: apiData.next_destination?.phone || ""
                    },
                    remarks: apiData.remarks || ""
                });

                // Restore passport image
                if (apiData?.passport_details?.passport_front_image_url) {
                    // const file = await urlToFile(apiData.passport_details.passport_front_image_url, "passport.jpg");
                    setPassImage([{
                        apiImageRes: apiData.passport_details.passport_front_image_url,
                        file: null,
                        preview: apiData.passport_details.passport_front_image_url,
                    }]);
                }

                // Restore visa image
                if (apiData?.visa_details?.visa_image_url) {
                    // const file = await urlToFile(apiData.visa_details.visa_image_url, "visa.jpg");
                    setVisaImage([{
                        apiImageRes: apiData.visa_details.visa_image_url,
                        file: null,
                        preview: apiData.visa_details.visa_image_url,
                    }]);
                }

                // Restore ID document images (Aadhaar front/back)
                // if (apiData?.id_document_front_url || apiData?.id_document_back_url) {
                //     const entries = [];
                //     if (apiData.id_document_front_url) {
                //         const file = await urlToFile(apiData.id_document_front_url, "id_front.jpg");
                //         entries[0] = { apiImageRes: apiData.id_document_front_url, file, preview: apiData.id_document_front_url };
                //     }
                //     if (apiData.id_document_back_url) {
                //         const file = await urlToFile(apiData.id_document_back_url, "id_back.jpg");
                //         entries[1] = { apiImageRes: apiData.id_document_back_url, file, preview: apiData.id_document_back_url };
                //     }
                //     setDocTypeImage(entries);
                // }                

                if (response.data.response.prefilled_from_vault) {
                    if (apiData?.id_document_front_url || apiData?.id_document_back_url) {
                        const entries = [];
                        if (apiData.id_document_front_url) {
                            entries[0] = { apiImageRes: apiData.id_document_front_url, file: null, preview: apiData.id_document_front_url };
                        }
                        if (apiData.id_document_back_url) {
                            entries[1] = { apiImageRes: apiData.id_document_back_url, file: null, preview: apiData.id_document_back_url };
                        }
                        setDocTypeImage(entries);
                    }
                } else {
                    if (apiData.guest_id_document_front_url || apiData.guest_id_document_back_url) {
                        const entries = [];
                        if (apiData.guest_id_document_front_url) {
                            entries[0] = { apiImageRes: apiData.guest_id_document_front_url, file: null, preview: apiData.guest_id_document_front_url };
                        }
                        if (apiData.guest_id_document_back_url) {
                            entries[1] = { apiImageRes: apiData.guest_id_document_back_url, file: null, preview: apiData.guest_id_document_back_url };
                        }
                        setDocTypeImage(entries);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching formality data:", error);
        }
    };

    useEffect(() => {
        getFormalityData();
    }, [selectedBookingData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(formalityData?.booking_number);
        toast.success("Booking ID copied");
    };

    /* ================== BADGE HELPER ================== */

    const statusBadgeClass = (status) => {
        const map = {
            "Checked-Out": "badge-Checked-Out",
            "No-Show-Auto": "badge-cancelled",
            "Check-in-Upcoming": "badge-Check-In-upcoming",
            "Check-in-Pending": "badge-Check-In-pending",
            "Checked In": "badge-Checked-in",
            "Checkout upcoming": "badge-Checked-out-upcoming",
            "No-Show-Manual": "badge-cancelled",
            "Cancelled": "badge-Cancel",
            "Check-out-Pending": "badge-Checkout-pending",
        };
        return map[status] || "";
    };

    /* ================== RENDER ================== */
    useEffect(() => {
        if (formData.id_document_type == formData.document_type_fetch) {
            getFormalityData()
        } else {
            setDocTypeImage([])
        }
    }, [formData.id_document_type])

    return (
        <Modal show={showCheckInModal} onHide={checkInModalClose} animation={false} centered className='custom-theme-modal'>
            <Modal.Header className='d-flex align-items-center justify-content-between pb-0'>
                <Modal.Title>Check-in Formalities</Modal.Title>
                <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close'
                    style={{ cursor: 'pointer' }} onClick={checkInModalClose} />
            </Modal.Header>

            <Modal.Body className='pt-4 pb-4'>
                <div className='update-step-1'>

                    {/* ── Booking summary ── */}
                    <div className='booking-details-br'>
                        <p className='mb-2 fs-20' style={{ fontWeight: '500' }}>
                            Booking for {formalityData?.traveler?.name}
                        </p>

                        <p className='d-flex align-items-center gap-2' style={{ lineHeight: 'auto', fontSize: '14px' }}>
                            {formalityData?.room_name}&nbsp;|
                            <Image src='/images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} />
                            Bed A |&nbsp;
                            <span style={{ lineHeight: '18px' }} className={statusBadgeClass(formalityData?.booking_status)}>
                                {formalityData?.booking_status}
                            </span>
                        </p>

                        <hr />

                        <div className='bm-contact mt-4'>
                            <ul className='room-list'>
                                <li>{formatBookingDates(formalityData?.check_in_date, formalityData?.check_out_date)}</li>
                                <li>
                                    <Toaster position="top-right" />
                                    <span>Booking Id </span>{formalityData?.booking_number}
                                    <Image src='/images/icons/content_copy.svg' className='img-fluid' alt='clone'
                                        width={20} height={20} style={{ cursor: "pointer" }} onClick={handleCopy} />
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* ── Nationality ── */}
                    <div className='booking-details-br mt-3'>
                        <p className='font-18 fw-medium'>Guest Nationality</p>
                        <Row>
                            <Col md={12} className='d-flex justify-content-start gap-2'>
                                {[
                                    { id: "nationality-indian", value: "Indian", label: "Indian" },
                                    { id: "nationality-foreign", value: "Foreign-National", label: "Foreign National" },
                                ].map(({ id, value, label }) => (
                                    <div key={id} className="radio-select-box d-flex gap-2">
                                        <label className="form-check-label d-flex gap-2" htmlFor={id}>
                                            <input
                                                type="radio"
                                                name="select-nationality"
                                                id={id}
                                                checked={formData?.nationality_type === value}
                                                onChange={() =>
                                                    setFormData({
                                                        ...formData,
                                                        nationality_type: value,
                                                        ...(value === "Indian" ? { id_document_type: "Aadhaar" } : {})
                                                    })
                                                }
                                            />
                                            <span className="radio-checkmark"></span>
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    </div>

                    {/* ════════════ INDIAN ════════════ */}
                    {formData.nationality_type === "Indian" && (
                        <div className='booking-details-br mt-3'>
                            <p className='font-18 fw-medium'>Choose an ID type to add</p>

                            <Row>
                                <Col md={12} className='d-flex justify-content-start gap-2'>
                                    {[
                                        { id: "id-type-passport", value: "Passport", label: "Passport" },
                                        { id: "id-type-aadhaar", value: "Aadhaar", label: "Aadhaar card" },
                                        { id: "id-type-driving", value: "Driving-Licence", label: "Driving licence" },
                                    ].map(({ id, value, label }) => (
                                        <div key={id} className="radio-select-box d-flex gap-2">
                                            <label className="form-check-label d-flex gap-2" htmlFor={id}>
                                                <input
                                                    type="radio"
                                                    name="select-id-type"
                                                    id={id}
                                                    checked={formData.id_document_type === value}
                                                    onChange={() => setFormData({ ...formData, id_document_type: value })}
                                                />
                                                <span className="radio-checkmark"></span>
                                                {label}
                                            </label>
                                        </div>
                                    ))}
                                </Col>
                            </Row>

                            <hr />

                            {/* ── Passport (single image) ── */}
                            {formData.id_document_type === "Passport" && (
                                <div className='drap-drop-box-full flex-column align-items-start'>
                                    <p className='font-18 fw-medium'>Upload an image of Guest passport</p>
                                    <p>{`Make sure the photo of guest passport isn't blurry and that it clearly shows the guest's face.`}</p>
                                    <label className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer drag-box-img-upload"
                                        style={{ minHeight: '156px', width: '100%' }}>
                                        <input type="file" accept="image/*"
                                            // FIX: use slot-mode so index 0 is set correctly
                                            onChange={e => handleFileChange1(e, setDocTypeImage, "front")}
                                            className="hidden" />
                                        {/* FIX: use imgSrc() — preview was never shown because localImageRes doesn't exist */}
                                        {docTypeImage?.[0] ? (
                                            <img src={imgSrc(docTypeImage[0])} alt="Passport"
                                                style={{ width: '100%', height: '156px', objectFit: 'cover' }} />
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                    <Image src='/images/icons/menu_book.svg' width={24} height={24} alt='upload' />
                                                </div>
                                                <p className="text-sm font-medium text-gray-700 mb-0">Upload passport</p>
                                                <p className="text-xs text-gray-400 mt-1">JPEG or PNG only</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            )}

                            {/* ── Aadhaar (front + back) ── */}
                            {formData.id_document_type === "Aadhaar" && (
                                <div>
                                    <p className='font-18 fw-medium'>Upload images of Guest Aadhaar card</p>
                                    <p>{`Make sure the photos aren't blurry and the front of the Aadhaar card clearly shows the guest's face.`}</p>
                                    <Row className="mt-4">
                                        {/* Front */}
                                        <Col md="6">
                                            <div className='drap-drop-box-full flex-column align-items-start'>
                                                <label className="w-full relative flex flex-col items-center justify-center h-48 border-2 border-dashed cursor-pointer transition border-gray-300 drag-box-img-upload"
                                                    style={{ minHeight: '156px' }}>
                                                    <input type="file" accept="image/*" className='hidden'
                                                        // FIX: pass (setter, "front") — NOT (currentArray, setter, "front")
                                                        onChange={e => handleFileChange1(e, setDocTypeImage, "front")} />
                                                    {/* FIX: use imgSrc() instead of localImageRes */}
                                                    {docTypeImage?.[0] ? (
                                                        <img src={imgSrc(docTypeImage[0])} alt="Front Image"
                                                            className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <>
                                                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 mb-2 text-xl">
                                                                <Image src='/images/icons/id_card.svg' width={24} height={24} alt='upload' />
                                                            </div>
                                                            <p className="text-sm font-medium text-gray-700 mb-1">Upload Front Image</p>
                                                            <p className="text-xs text-gray-400 mt-1">Click to upload</p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </Col>

                                        {/* Back */}
                                        <Col md="6">
                                            <div className='drap-drop-box-full flex-column align-items-start'>
                                                <label className="w-full relative flex flex-col items-center justify-center h-48 border-2 border-dashed cursor-pointer transition border-gray-300 drag-box-img-upload"
                                                    style={{ minHeight: '156px' }}>
                                                    <input type="file" accept="image/*" className='hidden'
                                                        // FIX: pass (setter, "back") — NOT (currentArray, setter, "back")
                                                        onChange={e => handleFileChange1(e, setDocTypeImage, "back")} />
                                                    {/* FIX: use imgSrc() instead of localImageRes */}
                                                    {docTypeImage?.[1] ? (
                                                        <img src={imgSrc(docTypeImage[1])} alt="Back Image"
                                                            className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <>
                                                            <div className="w-10 h-10 flex items-center justify-center text-gray-400 mb-2 text-xl">
                                                                <Image src='/images/icons/bank-card-line1.svg' width={24} height={24} alt='upload' />
                                                            </div>
                                                            <p className="text-sm font-medium text-gray-700 mb-1">Upload Back Image</p>
                                                            <p className="text-xs text-gray-400 mt-1">Click to upload</p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            {/* ── Driving Licence (single image) ── */}
                            {formData.id_document_type === "Driving-Licence" && (
                                <div className='drap-drop-box-full flex-column align-items-start'>
                                    <p className='font-18 fw-medium'>Upload an image of Guest Driving Licence</p>
                                    <p>{`Make sure the photo of guest driving licence isn't blurry and that it clearly shows the guest's face.`}</p>
                                    <label className="w-full drag-box-img-upload relative flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition border-gray-300"
                                        style={{ minHeight: '156px' }}>
                                        <input type="file" accept="image/*"
                                            onChange={e => handleFileChange1(e, setDocTypeImage, "front")}
                                            className="hidden" />
                                        {/* FIX: use imgSrc() instead of localImageRes */}
                                        {docTypeImage?.[0] ? (
                                            <img src={imgSrc(docTypeImage[0])} alt="Driving Licence"
                                                style={{ width: '100%', height: '156px', objectFit: 'cover' }} />
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 flex items-center justify-center text-gray-400 mb-2 text-xl">
                                                    <Image src='/images/icons/id_card.svg' width={24} height={24} alt='upload' />
                                                </div>
                                                <p className="text-sm font-medium text-gray-700 mb-1">Upload Front Image</p>
                                                <p className="text-xs text-gray-400 mt-1">Click to upload</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ════════════ FOREIGN NATIONAL ════════════ */}
                    {formData.nationality_type === "Foreign-National" && (
                        <>
                            {/* Personal Details */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Personal Details</p>
                                <p>{`Enter the following information exactly the same as it appears on the traveler's passport or ID.`}</p>

                                <Row className='g-3'>
                                    {["first_name", "last_name"].map(field => (
                                        <Col md={12} key={field}>
                                            <label className='form-label'>{field === "first_name" ? "First name" : "Last name"}</label>
                                            <div className='d-flex align-items-center form-group'>
                                                <input className='form-control'
                                                    value={formData.personal_details[field]}
                                                    onChange={v => handleChange("personal_details", field, v)} />
                                                <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center'
                                                    style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                                                    <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                                                </button>
                                            </div>
                                        </Col>
                                    ))}

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Gender</label>
                                            <select className='form-control' value={formData.personal_details.gender}
                                                onChange={v => handleChange("personal_details", "gender", v)}>
                                                <option value="">Select</option>
                                                <option>Female</option>
                                                <option>Male</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Nationality</label>
                                            <select className='form-control' value={formData.personal_details.nationality}
                                                onChange={v => handleChange("personal_details", "nationality", v)}>
                                                <option value=''>Select</option>
                                                <option value='India'>India</option>
                                                <option value='United States'>USA</option>
                                                <option value='United Kingdom'>UK</option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Date of birth</label>
                                            <DatePicker className="form-control"
                                                selected={formData.personal_details.date_of_birth}
                                                onChange={d => handleChange("personal_details", "date_of_birth", d)}
                                                dateFormat="dd/MM/yyyy" placeholderText="Select date" />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Special Category</label>
                                            <input className='form-control' value={formData.personal_details.special_category}
                                                onChange={v => handleChange("personal_details", "special_category", v)} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Accommodation Details */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Accommodation Details</p>

                                <div className='form-group mb-4'>
                                    <label>Name</label>
                                    <input className='form-control' value={formData.accommodation_details.name}
                                        onChange={v => handleChange("accommodation_details", "name", v)} />
                                </div>
                                <Row>
                                    <Col md={8}>
                                        <div className='form-group mb-4'>
                                            <label>Street and number</label>
                                            <input className='form-control' value={formData.accommodation_details.street_no}
                                                onChange={v => handleChange("accommodation_details", "street_no", v)} />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className='form-group mb-4'>
                                            <label>Flat/House No.</label>
                                            <input className='form-control' value={formData.accommodation_details.flat_no}
                                                onChange={v => handleChange("accommodation_details", "flat_no", v)} />
                                        </div>
                                    </Col>
                                </Row>
                                <div className='form-group mb-4'>
                                    <label>City</label>
                                    <input className='form-control' value={formData.accommodation_details.city}
                                        onChange={v => handleChange("accommodation_details", "city", v)} />
                                </div>
                                <Row>
                                    <Col md={4}>
                                        <div className='form-group mb-4'>
                                            <label>State</label>
                                            <input className='form-control' value={formData.accommodation_details.state}
                                                onChange={v => handleChange("accommodation_details", "state", v)} />
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div className='form-group mb-4'>
                                            <label>PIN code</label>
                                            <input className='form-control' type='number' value={formData.accommodation_details.pin_code}
                                                onChange={v => handleChange("accommodation_details", "pin_code", v)} />
                                        </div>
                                    </Col>
                                </Row>
                                <div className='form-group mb-4'>
                                    <label>Mobile number</label>
                                    <input type='number' className='form-control' value={formData.accommodation_details.phone}
                                        onChange={v => handleChange("accommodation_details", "phone", v)} placeholder='--' />
                                </div>
                            </div>

                            {/* Arrival Details */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Arrival Details</p>

                                <div className='form-group mb-4'>
                                    <label>Arrived From</label>
                                    <input className='form-control' value={formData.arrival_details.arrived_from}
                                        onChange={v => handleChange("arrival_details", "arrived_from", v)} />
                                </div>
                                <Row>
                                    <Col md={6}>
                                        <div className='form-group mb-4'>
                                            <label>Date of arrival in India</label>
                                            <DatePicker
                                                selected={formData.arrival_details.date_of_arrival_india}
                                                onChange={d => handleChange("arrival_details", "date_of_arrival_india", d)}
                                                placeholderText="Select date"
                                                className="form-control custom-date-picker"
                                                dateFormat="dd/MM/yyyy" />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className='form-group mb-4'>
                                            <label>Date of Arrival in Individual House</label>
                                            <DatePicker
                                                selected={formData.arrival_details.date_of_arrival_property}
                                                onChange={d => handleChange("arrival_details", "date_of_arrival_property", d)}
                                                placeholderText="Select date"
                                                className="form-control custom-date-picker"
                                                dateFormat="dd/MM/yyyy" />
                                        </div>
                                    </Col>
                                </Row>
                                <div className='form-group mb-4'>
                                    <label>Time of Arrival in Individual House</label>
                                    <input type='time' className='form-control' value={formData.arrival_details.time_of_arrival_property}
                                        onChange={v => handleChange("arrival_details", "time_of_arrival_property", v)} />
                                </div>
                                <div className='form-group mb-0'>
                                    <label>Intended Duration of Stay in Individual House</label>
                                    <input className='form-control' value={formData.arrival_details.intended_duration}
                                        onChange={v => handleChange("arrival_details", "intended_duration", v)} />
                                </div>
                            </div>

                            {/* Passport Upload */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Upload an image of Guest passport</p>
                                <p>{`Make sure the photo of the guest passport isn't blurry and that it clearly shows the guest's face.`}</p>

                                <Row className='g-3'>
                                    <Col md={12}>
                                        {passImage?.length < MAX_PHOTOS && (
                                            <div className="d-flex align-items-center justify-content-start mb-3">
                                                <label className="cursor-pointer d-flex align-items-center gap-2">
                                                    <Image src="/images/icons/add_circle.svg" width={24} height={24} alt="Add more photos" />
                                                    <span>Add more photos</span>
                                                    <input type="file" accept="image/*" multiple
                                                        onChange={e => handleFileChange1(e, passImage, setPassImage)}
                                                        className="hidden" />
                                                </label>
                                            </div>
                                        )}

                                        <div className="drap-drop-box-full">
                                            {passImage?.length === 0 ? (
                                                <label onDrop={handleDrop1} onDragOver={handleDragOver1}
                                                    style={{ minHeight: '156px' }}
                                                    className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer">
                                                    <input type="file" accept="image/*" multiple
                                                        onChange={e => handleFileChange1(e, passImage, setPassImage)}
                                                        className="hidden" />
                                                    <div className="text-center">
                                                        <Image src="/images/icons/menu_book.svg" alt="Upload" width={30} height={30} className="mx-auto mb-2" />
                                                        <p className="font-medium mb-0" style={{ color: "#463527" }}>Upload passport</p>
                                                        <p className="text-sm text-gray-500 mb-0" style={{ color: "#73615F" }}>JPEG or PNG only</p>
                                                    </div>
                                                </label>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4">
                                                    {passImage.map((photo, index) => (
                                                        <div key={index} className="relative inline-block">
                                                            {/* FIX: use imgSrc() — photo.localImageRes was never populated */}
                                                            <img src={imgSrc(photo)} alt={`Passport preview ${index + 1}`}
                                                                style={{ width: '100%', height: '156px', objectFit: 'cover' }} />
                                                            <button type="button" onClick={() => removePhoto(index, setPassImage)}
                                                                className="absolute top-1 right-1 delete-icn">
                                                                <Image src="/images/icons/delete.svg" width={20} height={20} alt="delete" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className='mt-4'>Re-Upload Image</p>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Issuing country/region</label>
                                            <Select
                                                options={sortoption}
                                                placeholder="Select"
                                                className="react_selectbox"
                                                // FIX: was writing to visa_details.issuing_country by mistake
                                                value={sortoption.find(opt => opt.value === formData.passport_details.issuing_country) || null}
                                                onChange={v => handleChange("passport_details", "issuing_country", v)}
                                                isSearchable={false}
                                                styles={customStyles}
                                            />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Passport No.</label>
                                            <input className='form-control' value={formData.passport_details.passport_number}
                                                onChange={v => handleChange("passport_details", "passport_number", v)} />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Date of birth</label>
                                            <DatePicker
                                                selected={formData.passport_details.date_of_birth}
                                                onChange={d => handleChange("passport_details", "date_of_birth", d)}
                                                placeholderText="Select date"
                                                className="form-control custom-date-picker"
                                                dateFormat="dd/MM/yyyy" />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Expiry Date</label>
                                            <DatePicker
                                                selected={formData.passport_details.expiry_date}
                                                onChange={d => handleChange("passport_details", "expiry_date", d)}
                                                placeholderText="Select date"
                                                className="form-control custom-date-picker"
                                                dateFormat="dd/MM/yyyy" />
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Visa Upload */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Upload an image of Guest Visa document</p>
                                <p>{`Make sure the photo of guest visa document isn't blurry and that it clearly shows the guest's face.`}</p>

                                <Row className='g-3'>
                                    <Col md={12}>
                                        {visaImage?.length > 0 && visaImage?.length < MAX_PHOTOS && (
                                            <div className="d-flex align-items-center justify-content-start mb-3">
                                                <label className="cursor-pointer d-flex align-items-center gap-2">
                                                    <Image src="/images/icons/add_circle.svg" width={24} height={24} alt="Add more photos" />
                                                    <span>Add more photos</span>
                                                    <input type="file" accept="image/*" multiple
                                                        onChange={e => handleFileChange1(e, visaImage, setVisaImage)}
                                                        className="hidden" />
                                                </label>
                                            </div>
                                        )}

                                        <div className="drap-drop-box-full">
                                            {visaImage?.length === 0 ? (
                                                <label onDrop={handleDrop1} onDragOver={handleDragOver1}
                                                    style={{ minHeight: '156px' }}
                                                    className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer">
                                                    <input type="file" accept="image/*" multiple
                                                        onChange={e => handleFileChange1(e, visaImage, setVisaImage)}
                                                        className="hidden" />
                                                    <div className="text-center">
                                                        <Image src="/images/icons/article_person.svg" alt="Upload" width={30} height={30} className="mx-auto mb-2" />
                                                        <p className="font-medium mb-0" style={{ color: "#463527" }}>Upload visa</p>
                                                        <p className="text-sm text-gray-500 mb-0" style={{ color: "#73615F" }}>JPEG or PNG only</p>
                                                    </div>
                                                </label>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4">
                                                    {visaImage.map((photo, index) => (
                                                        <div key={index} className="relative inline-block">
                                                            {/* FIX: use imgSrc() */}
                                                            <img src={imgSrc(photo)} alt={`Visa preview ${index + 1}`}
                                                                style={{ width: '100%', height: '156px', objectFit: 'cover' }} />
                                                            <button type="button" onClick={() => removePhoto(index, setVisaImage)}
                                                                className="absolute top-1 right-1 delete-icn">
                                                                <Image src="/images/icons/delete.svg" width={20} height={20} alt="delete" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Issuing country/region</label>
                                            <Select
                                                options={sortoption}
                                                placeholder="Select"
                                                className="react_selectbox"
                                                value={sortoption.find(opt => opt.value === formData.visa_details.issuing_country) || null}
                                                onChange={v => handleChange("visa_details", "issuing_country", v)}
                                                isSearchable={false}
                                                styles={customStyles}
                                            />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Visa Number</label>
                                            <input className='form-control' value={formData.visa_details.visa_number}
                                                onChange={v => handleChange("visa_details", "visa_number", v)} placeholder='Enter' />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Date of Issue</label>
                                            <DatePicker selected={formData.visa_details.date_of_issue}
                                                onChange={v => handleChange("visa_details", "date_of_issue", v)}
                                                placeholderText="Select"
                                                className="form-control custom-date-picker" dateFormat="dd/MM/yyyy" />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Valid Till</label>
                                            <DatePicker selected={formData.visa_details.valid_till}
                                                onChange={v => handleChange("visa_details", "valid_till", v)}
                                                placeholderText="Select"
                                                className="form-control custom-date-picker" dateFormat="dd/MM/yyyy" />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Visa Type</label>
                                            <input className='form-control' value={formData.visa_details.visa_type}
                                                onChange={v => handleChange("visa_details", "visa_type", v)} placeholder='Enter' />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group'>
                                            <label className='form-label'>Visa Subtype</label>
                                            <input className='form-control' value={formData.visa_details.visa_subtype}
                                                onChange={v => handleChange("visa_details", "visa_subtype", v)} placeholder='Enter' />
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Permanent Address */}
                            <AddressBlock title="Address in country where residing permanently"
                                section="permanent_address" data={formData.permanent_address} handleChange={handleChange} />

                            {/* Reference in India */}
                            <AddressBlock title="Address/Reference in India"
                                section="reference_in_india" data={formData.reference_in_india} handleChange={handleChange} />

                            {/* Employment */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Whether Employed in India</p>
                                <Row>
                                    <Col md={12} className='d-flex justify-content-start gap-2'>
                                        {[
                                            { id: "WhetherEmployed-no", value: false, label: "No" },
                                            { id: "WhetherEmployed-yes", value: true, label: "Yes" },
                                        ].map(({ id, value, label }) => (
                                            <div key={id} className="radio-select-box d-flex gap-2">
                                                <label className="form-check-label d-flex gap-2" htmlFor={id}>
                                                    <input
                                                        type="radio"
                                                        name="select-employed"
                                                        id={id}
                                                        // FIX: "Yes" radio had typo `cked=` instead of `checked=`
                                                        checked={formData.employment.emplpyed_in_india === value}
                                                        onChange={() => handleChange("employment", "emplpyed_in_india", value)}
                                                    />
                                                    <span className="radio-checkmark"></span>
                                                    {label}
                                                </label>
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                            </div>

                            {/* Purpose of Visit */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Purpose of Visit</p>
                                <div className='form-group'>
                                    <input type='text' className='form-control' value={formData.employment.purpose_of_visit}
                                        onChange={v => handleChange("employment", "purpose_of_visit", v)} placeholder='Enter reason' />
                                </div>
                            </div>

                            {/* Next Destination */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Next Destination</p>

                                <div className='form-group mb-4'>
                                    <label>Place Name</label>
                                    <input type='text' className='form-control' value={formData.next_destination.place}
                                        onChange={v => handleChange("next_destination", "place", v)} placeholder='e.g. Grand Hyatt' />
                                </div>
                                <Row>
                                    <Col md={8}>
                                        <div className='form-group mb-4'>
                                            <label>Street and number</label>
                                            <input type='text' className='form-control' value={formData.next_destination.street_no}
                                                onChange={v => handleChange("next_destination", "street_no", v)} placeholder='--' />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className='form-group mb-4'>
                                            <label>Flat/House No.</label>
                                            <input type='text' className='form-control' value={formData.next_destination.flat_no}
                                                onChange={v => handleChange("next_destination", "flat_no", v)} placeholder='--' />
                                        </div>
                                    </Col>
                                </Row>
                                <div className='form-group mb-4'>
                                    <label>City</label>
                                    <input type='text' className='form-control' value={formData.next_destination.city}
                                        onChange={v => handleChange("next_destination", "city", v)} placeholder='--' />
                                </div>
                                <Row>
                                    <Col md={4}>
                                        <div className='form-group mb-4'>
                                            <label>State</label>
                                            <input type='text' className='form-control' value={formData.next_destination.state}
                                                onChange={v => handleChange("next_destination", "state", v)} placeholder='--' />
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div className='form-group mb-4'>
                                            <label>PIN code</label>
                                            <input type='number' className='form-control' value={formData.next_destination.pin_code}
                                                onChange={v => handleChange("next_destination", "pin_code", v)} placeholder='--' />
                                        </div>
                                    </Col>
                                </Row>
                                <div className='form-group mb-4'>
                                    <label>Mobile number</label>
                                    <input type='number' className='form-control' value={formData.next_destination.phone}
                                        onChange={v => handleChange("next_destination", "phone", v)} placeholder='--' />
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className='booking-details-br mt-3'>
                                <p className='font-18 fw-medium'>Additional comments / remarks</p>
                                <div className='form-group'>
                                    <textarea className='form-control' value={formData.remarks}
                                        onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                                        placeholder="Add your message here" />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer className='d-flex align-items-center justify-content-between modern-footer'>
                <Button variant="" onClick={checkInModalClose}
                    style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                    Cancel
                </Button>
                <Button variant="" onClick={handleSubmit}
                    className='search-btn complete-form-btn'
                    style={{ padding: '13px 25px', borderRadius: '0' }}>
                    Complete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

/* ══════════════════════════════════════════════════════════════
   Reusable address block — shared by permanent + reference sections
══════════════════════════════════════════════════════════════ */
function AddressBlock({ title, section, data, handleChange }) {
    return (
        <div className='booking-details-br mt-3'>
            <p className='font-18 fw-medium'>{title}</p>
            <Row>
                <Col md={8}>
                    <div className='form-group mb-4'>
                        <label>Street and number</label>
                        <input type='text' className='form-control' value={data.street_no}
                            onChange={v => handleChange(section, "street_no", v)} placeholder='--' />
                    </div>
                </Col>
                <Col md={4}>
                    <div className='form-group mb-4'>
                        <label>Flat/House No.</label>
                        <input type='text' className='form-control' value={data.flat_no}
                            onChange={v => handleChange(section, "flat_no", v)} placeholder='--' />
                    </div>
                </Col>
            </Row>
            <div className='form-group mb-4'>
                <label>City</label>
                <input type='text' className='form-control' value={data.city}
                    onChange={v => handleChange(section, "city", v)} placeholder='--' />
            </div>
            <Row>
                <Col md={4}>
                    <div className='form-group mb-4'>
                        <label>State</label>
                        <input type='text' className='form-control' value={data.state}
                            onChange={v => handleChange(section, "state", v)} placeholder='--' />
                    </div>
                </Col>
                <Col md={8}>
                    <div className='form-group mb-4'>
                        <label>PIN code</label>
                        <input type='number' className='form-control' value={data.pin_code}
                            onChange={v => handleChange(section, "pin_code", v)} placeholder='--' />
                    </div>
                </Col>
            </Row>
        </div>
    );
}