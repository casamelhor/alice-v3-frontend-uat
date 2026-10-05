// "use client"
// import React, { useState, useEffect, useRef } from 'react'
// import Header from '../Header/Header'
// // import { useEffect, useState } from "react";
// import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form, Accordion, Label } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { components } from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import { UserListAPI, validateGender, CreateBookingPost, companyListAPI, PropertyListFullApi } from '@/services/provider';
// import { alert_danger, alert_info, alert_success } from '@/utils/Alerts/TostifyAlerts';
// import { calculateNights, convertTo24Hour, formatDateMonthYear, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
// import { ToastContainer } from 'react-toastify';
// import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
// import toast, { Toaster } from 'react-hot-toast';

// export default function MultiSwitchReserve() {

//     const router = useRouter();

//     const lastValidatedRef = useRef({});
//     const timeOption = generateTimeOptions12Format(30);
//     const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"))
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"))
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
//     const [userListData, setUserListData] = useState()
//     const [current, setCurrent] = useState(0);
//     const [bookingData, setBookingData] = useState(null);
//     const [filtereduserListData, setFilteredUserListData] = useState()
//     const [lastUpdatedIndex, setLastUpdatedIndex] = useState(null);

//     const goToResult = () => {
//         // Close the modal first
//         // removeTravel2(); // This should be your modal close function

//         // Then navigate after a small delay to ensure modal is closed
//         setTimeout(() => {
//             router.push('/MultiRoomsGuestResult');
//         }, 100);
//     };


//     const bedroomPreference = reserveBookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;


//     const [formData, setFormData] = useState({
//         company_id: 2,
//         caretakers: "",
//         traveler_assignments: [],
//         arrival_details: {
//             arrival_time: "",
//             mode_of_arrival: "",
//             transport_number: ""
//         },
//         send_confirmation_email: false,
//         // additional_email_recipients: [],
//         additional_comments: "",
//         company_booking_reference: "",
//     });
//     const [travellers, setTravellers] = useState();

//     const handleCaretakerSelect = (rowIndex, userId) => {
//         if (rowIndex === "") {
//             setFormData({ ...formData, caretakers: userId })
//             setShowCaretakerList(false)
//             return
//         }
//         setTravellers(prev =>
//             prev.map((item, i) =>
//                 i === rowIndex
//                     ? {
//                         ...item,
//                         caretaker: userId,
//                         searchText:
//                             userListData.find(u => u.uid === userId)?.first_name || "",
//                         showList: false
//                     }
//                     : item
//             )
//         );
//         setLastUpdatedIndex(rowIndex);
//     };

//     const handleTravellerTypeChange = (rowIndex, selected) => {
//         setTravellers(prev => {
//             const updated = [...prev];

//             if (!updated[rowIndex]) return prev;

//             updated[rowIndex] = {
//                 ...updated[rowIndex],
//                 traveller_type: selected,
//                 filteredUsers: userListData.filter(
//                     user => user?.user_role?.role_name === selected
//                 ),
//             };
//             return updated;
//         });
//     };


//     const [showPrices, setShowPrices] = useState(false);
//     const [selectedAdult, setSelectedAdult] = useState(1);

//     // const [showManagerList, setShowManagerList] = useState(null);


//     const [addTravels, addTravelsetShow] = useState(false);

//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);



//     // 


//     const [addBreakdowns, addBreakdownsetShow] = useState(false);

//     const removeBreakdown = () => addBreakdownsetShow(false);
//     const addbreakdown = () => addBreakdownsetShow(true);


//     // 


//     const [addReserves, addReservesetShow] = useState(false);

//     const removeReserve = () => addReservesetShow(false);
//     const addReserve = () => addReservesetShow(true);
//     const [addTravels2, addTravel2setShow] = useState(false);
//     const removeTravel2 = () => addTravel2setShow(false);
//     const addTravel2 = () => addTravel2setShow(true);

//     const updateFormData = (key, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [key]: value
//         }));
//     };

//     const updateArrivalDetails = (key, value) => {
//         setFormData(prev => ({
//             ...prev,
//             arrival_details: {
//                 ...prev.arrival_details,
//                 [key]: convertTo24Hour(value)
//             }
//         }));
//     };

//     useEffect(() => {
//         if (reserveBookingData) {
//             setBookingData(reserveBookingData);
//             setTravellers(Array.from({ length: reserveBookingData?.length > 0 ? reserveBookingData?.[0]?.adultCount : 1 }, () => ({
//                 traveller_type: null,
//                 isGenderValidation: "",
//                 caretaker: null,
//                 searchText: "",
//                 showList: false,
//                 filteredUsers: userListData,
//                 selectedBedIndex: reserveBookingData?.[0]?.rooms?.[0]?.bed_index || null
//             })))
//         }
//     }, []);


//     const CompanyOption = [
//         { value: "casamelhor", label: "Casamelhor" },
//         { value: "schlumberger", label: "Schlumberger" },
//         { value: "delhivery", label: "Delhivery" },
//         { value: "picus-Capital", label: "Picus Capital" },
//         { value: "gps-Renewables", label: "GPS Renewables" },


//     ];

//     const travelOption = [
//         {
//             value: "Company Booking Manager",
//             label: "Company employee",
//             icon: "../images/icons/hail.svg"
//         },
//         {
//             value: "External",
//             label: "External",
//             icon: "../images/icons/short_stay.svg"
//         },
//     ];
//     // ✅ Custom option in dropdown
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
//     // ✅ Custom selected value (shows in input box)
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

//     const handleSelectDropdown = (e, name) => {
//         const { value } = e
//         let newVal = { [name]: value }
//         if (name === "traveller_type") {
//             if (value === "External") {
//                 const updatedForm = { ...formData, traveller_type: value };
//                 delete updatedForm.segment;
//                 delete updatedForm.designation;
//                 delete updatedForm.employee_grade;
//                 delete updatedForm.account_unit;
//                 delete updatedForm.account_code;
//                 delete updatedForm.employee_id
//                 setFormData(updatedForm);
//             } else {
//                 setFormData((prev) => ({
//                     ...prev,
//                     traveller_type: value,
//                     segment: "",
//                     designation: "",
//                     employee_grade: "",
//                     account_unit: "",
//                     account_code: "",
//                     employee_id: ""
//                 }));
//             }
//         }
//         // } else {
//         //     setFormData((prev) => ({
//         //         ...prev,
//         //         [name]: value,
//         //     }));
//         // }
//         // const { errors } = travellerValidation(newVal)
//         // setErrorMessages({
//         //     ...errorMessages,
//         //     ...errors
//         // })
//     }

//     const arrivalOption = [
//         { value: "Flight", label: "Flight" },
//         { value: "Train", label: "Train" }
//     ]


//     const CityOption = [
//         { value: "gurugram", label: "Gurugram" },
//         { value: "mumbai", label: "Mumbai" },
//         { value: "navi-mumbai", label: "Navi Mumbai" },
//         { value: "kakinada", label: "Kakinada" },
//         { value: "Bokaro", label: "Bokaro" },
//         { value: "ahmedabad", label: "Ahmedabad" },

//     ]


//     const [rooms, setRooms] = useState([
//         { id: 1, adults: 1 }
//     ]);

//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

//     const handleAdultChange = (roomId, change) => {
//         setRooms(rooms.map(room => {
//             if (room.id === roomId) {
//                 const newValue = room.adults + change;
//                 return { ...room, adults: newValue >= 1 ? newValue : 1 };
//             }
//             return room;
//         }));
//     };

//     const addRoom = () => {
//         const newRoomId = rooms.length + 1;
//         setRooms([...rooms, { id: newRoomId, adults: 1 }]);
//     };

//     const deleteRoom = (roomId) => {
//         if (rooms.length > 1) {
//             setRooms(rooms.filter(room => room.id !== roomId));
//         }
//     };

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

//     // const [selectedDate, setStartDate] = useState(
//     //     new Date("2025/10/1")
//     // );
//     // const [endDate, setEndDate] = useState(
//     //     new Date("2025/10/1")

//     // );

//     // const [caretakers, setCaretakers] = useState([{ id: Date.now(), data: null }]);
//     const [showCaretakerList, setShowCaretakerList] = useState(null);

//     const [chooseBeds, setChooseBeds] = useState([]);

//     // const handleCaretakerRemove = (caretakerId) => {
//     //     // Remove the caretaker data to show input field again
//     //     setCaretakers(caretakers.map(item =>
//     //         item.id === caretakerId ? { ...item, data: null } : item
//     //     ));
//     // };

//     // const handleAddCaretaker = () => {
//     //     setCaretakers([...caretakers, { id: Date.now(), data: null }]);
//     // };

//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([]);
//     const [bookingConfirmedData, setBookingConfirmedData] = useState([])

//     const handleAddReceiver = () => {
//         const newReceiver = {
//             id: Date.now(), // Use timestamp for unique ID
//             email: ''
//         };
//         setReceivers([...receivers, newReceiver]);
//     };

//     const handleRemoveReceiver = (id) => {
//         if (receivers.length > 1) {
//             setReceivers(receivers.filter(receiver => receiver.id !== id));
//         }
//     };

//     const handleEmailChange = (id, email) => {
//         setReceivers(receivers.map(receiver =>
//             receiver.id === id ? { ...receiver, email } : receiver
//         ));
//     };

//     const handleSendEmail = () => {
//         // Validate emails before sending
//         const validReceivers = receivers.filter(receiver =>
//             receiver.email && isValidEmail(receiver.email)
//         );

//         if (validReceivers.length === 0) {
//             alert('Please add at least one valid email address');
//             return;
//         }

//         // Send email logic here
//         console.log('Sending emails to:', validReceivers);
//     };

//     const isValidEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const getUserListData = async () => {
//         try {
//             // const tab = activeTab == "employee" ? "Company-Employee" : "External-Guest";
//             const response = await UserListAPI(
//                 "All"
//             );

//             if (response?.data?.success) {
//                 setUserListData(response.data.response);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         if (reserveBookingData?.[0]?.adultCount === 1) {
//             setSelectedAdult(1);
//         };
//         setChooseBeds(
//             reserveBookingData?.length > 0 && reserveBookingData?.[0]?.rooms?.[0]?.room_type === "Twin-Sharing"
//                 ? reserveBookingData?.[0]?.rooms?.[0]?.beds?.map((bed, index) => ({
//                     label: bed.name,
//                     value: index,
//                 }))
//                 : []
//         );
//         getUserListData();

//     }, [reserveBookingData?.[0]?.adultCount]);

//     useEffect(() => {
//         if (!formData?.traveller_type) {
//             setFilteredUserListData([]);
//             return;
//         }

//         // const filteredData = userListData
//         //     ?.filter(user => {
//         //         const roleName = user.user_role?.role_name;

//         //         // CASE 1: Traveller type is External → only External users
//         //         if (formData.traveller_type === "External") {
//         //             return roleName === "External";
//         //         }

//         //         // CASE 2: Traveller type is NOT External
//         //         return (
//         //             roleName !== "External" && // remove External users
//         //             user?.user_company?.id === bacisSearchDetails?.company_id
//         //         );
//         //     })
//         //     .map(user => ({
//         //         value: user.uid,
//         //         label: `${user.first_name} ${user.last_name}`
//         //     }));

//         const filteredData = userListData
//             ?.filter(user => {
//                 const roleName = user.user_role?.role_name;
//                 let travellerAllowed = false;

//                 // CASE 1: Traveller type is External → only External users
//                 if (formData.traveller_type === "External") {
//                     travellerAllowed = roleName === "External";
//                 } else {
//                     travellerAllowed =
//                         roleName !== "External" &&
//                         user?.user_company?.id === bacisSearchDetails?.company_id;
//                 }

//                 if (!travellerAllowed) return false;

//                 // Bedroom gender filtering
//                 if (bedroomPreference === "FEMALE PREFERRED") {
//                     return user.gender === "Female";
//                 }

//                 if (bedroomPreference === "MALE PREFERRED") {
//                     return user.gender === "Male";
//                 }

//                 return true;

//                 // CASE 2: Traveller type is NOT External
//                 // return (
//                 //     roleName !== "External" && // remove External users
//                 //     user?.user_company?.id === bacisSearchDetails?.company_id
//                 // );
//             })
//             .map(user => ({
//                 value: user.uid,
//                 label: `${user.first_name} ${user.last_name}`,
//                 gender: user.gender
//             }));
//         console.log(filteredData)
//         setFilteredUserListData(filteredData);

//     }, [formData.traveller_type, userListData, bedroomPreference]);

//     const formatStayDates = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);

//         const options = { weekday: "short", day: "numeric", month: "short" };

//         const startFormatted = start.toLocaleDateString("en-US", options);
//         const endFormatted = end.toLocaleDateString("en-US", options);
//         const year = end.getFullYear();

//         const diffTime = end - start;
//         const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));

//         return `${startFormatted} - ${endFormatted}, ${year}, ${nights} night${nights > 1 ? "s" : ""}`;
//     };

//     const formatRoomsAndGuests = (rooms = []) => {
//         const roomCount = rooms.length;
//         const guestCount = rooms.reduce(
//             (sum, room) => sum + (room.adults || 0),
//             0
//         );

//         return `${roomCount} room${roomCount > 1 ? "s" : ""} for ${guestCount} guest${guestCount > 1 ? "s" : ""}`;
//     };

//     const formatDate = (dateTime) => {
//         const date = new Date(dateTime);
//         return date.toLocaleDateString("en-IN", {
//             weekday: "short",
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     const formatTime = (dateTime) => {
//         const date = new Date(dateTime);
//         return date.toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//         });
//     };

//     useEffect(() => {
//         if (lastUpdatedIndex === null) return;

//         const updatedTraveller = travellers[lastUpdatedIndex];
//         if (!updatedTraveller?.caretaker) return;

//         if (
//             lastValidatedRef.current[lastUpdatedIndex] ===
//             updatedTraveller.caretaker
//         ) {
//             return;
//         }

//         const getDateOnly = (dateTime) => dateTime?.split("T")[0];

//         const checkGenderValid = async (val) => {
//             try {
//                 const payload = {
//                     room_uid: val?.room_uid,
//                     traveler_uid: updatedTraveller.caretaker,
//                     check_in_date: getDateOnly(val?.check_in_datetime),
//                     check_out_date: getDateOnly(val?.check_out_datetime),
//                     bed_index: lastUpdatedIndex, // ✅ dynamic
//                 };

//                 const response = await validateGender(payload);

//                 // ✅ mark this caretaker as validated for this row
//                 lastValidatedRef.current[lastUpdatedIndex] =
//                     updatedTraveller.caretaker;

//                 setTravellers(prev =>
//                     prev.map((item, i) =>
//                         i === lastUpdatedIndex
//                             ? {
//                                 ...item,
//                                 isGenderValidation:
//                                     response.data.response.valid ? "Success" : "Error",
//                             }
//                             : item
//                     )
//                 );
//                 if (response.data.response.valid) {
//                     toast.success("Gender Validated Successfully");
//                 }
//             } catch (error) {
//                 console.error("Submission error:", error);
//                 // alert_danger("Failed to do validation");
//                 toast.error("Failed to do validation")
//             }
//         };

//         bookingData?.segments?.map((item)=>{
//             checkGenderValid(item)
//         })
//         // checkGenderValid();

//     }, [lastUpdatedIndex]); // ✅ IMPORTANT: removed `travellers`

//     useEffect(() => {
//         if (formData.caretakers === "") return;
//         const getDateOnly = (dateTime) => dateTime?.split("T")[0];
//         const checkGenderValid = async (val) => {
//             try {
//                 const payload = {
//                     room_uid: val?.room_uid,
//                     traveler_uid: formData.caretakers,
//                     check_in_date: getDateOnly(val?.check_in_datetime),
//                     check_out_date: getDateOnly(val?.check_out_datetime),
//                     bed_index: 0,
//                 };

//                 const response = await validateGender(payload);
//                 if (response.data.response.valid) {
//                     toast.success("Gender Validated Successfully");
//                 }
//             } catch (error) {
//                 console.error("Submission error:", error);
//                 // alert_danger("Failed to do validation");
//                 toast.error("Failed to do validation")
//             }
//         };
//         bookingData?.segments?.map((item)=>{
//             checkGenderValid(item)
//         })
//         // checkGenderValid();
//     }, [formData.caretakers])


//     const [searchFieldData, setSearchFieldData] = useState(
//         {
//             company_id: 0,
//             city: "",
//             check_in_date: "",
//             check_out_date: "",
//             rooms: [],
//             is_available: true
//         }
//     )
//     const handleUpdateSearch = () => {
//         removeItemLocalStorage("reserveRoom")
//         localStorage.setItem(
//             "basicSecrchItemObj",
//             JSON.stringify(searchFieldData)
//         );
//         router.push("./Searchresult")
//     }
//     const [companyList, setCompanyList] = useState([]);
//     const [cityList, setCityList] = useState([]);
//     const getProprtyList = async () => {
//         try {
//             const response = await PropertyListFullApi();
//             if (response?.data?.success) {
//                 //                 const uniqueCities = [
//                 //   ...new Set(response.data.response.map(ele => ele.city))
//                 // ].map(city => ({ city }));
//                 const uniqueCities = [
//                     { city: "Jaipur" },
//                     ...Array.from(
//                         new Set(response.data.response.map(ele => ele.city)),
//                         city => ({ city })
//                     ).filter(item => item.city !== "Jaipur")
//                 ];
//                 setCityList(uniqueCities)
//             }

//         } catch (error) {
//             console.log("Company API Error: ", error);
//         }
//     };
//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 const list = response.data.response.map(item => ({
//                     value: item.id,
//                     label: item.company_name
//                 }));
//                 setCompanyList(list);
//             }
//         } catch (error) {
//             console.log("Company API Error: ", error);
//         }
//     };

//     useEffect(() => {
//         getCompanyList();
//         getProprtyList();
//         if (bacisSearchDetails) {
//             setSearchFieldData({
//                 company_id: bacisSearchDetails.company_id,
//                 city: bacisSearchDetails.city,
//                 check_in_date: bacisSearchDetails.check_in_date,
//                 check_out_date: bacisSearchDetails.check_out_date,
//                 is_available: bacisSearchDetails.is_available,
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
//             })
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })))
//         }
//     }, []);


//     const handleSubmitReserve = async () => {
//         const getDateOnly = (dateTime) => dateTime?.split("T")[0];
//         try {
//             let cartItem = JSON.stringify(bookingData).includes("Private")
//                 ? [
//                     {
//                         property_uid: bookingData?.[0]?.property_uid,
//                         room_uid: bookingData?.[0]?.rooms?.[0]?.room_uid,
//                         bed_index: null,
//                         check_in_date: searchBookingData.check_in_date,
//                         check_out_date: searchBookingData.check_out_date
//                     }
//                 ]
//                 : travellers.map(t => ({
//                     property_uid: bookingData?.[0]?.property_uid,
//                     room_uid: bookingData?.[0]?.rooms?.[0]?.room_uid,
//                     bed_index: t.selectedBedIndex,
//                     check_in_date: searchBookingData.check_in_date,
//                     check_out_date: searchBookingData.check_out_date
//                 }));
//             let objForPrivate = {
//                 cart_item_index: 0,
//                 traveler_id: formData.caretakers,
//                 is_exclusive_booking: false
//             }
//             let arrForPrivate = []
//             arrForPrivate.push(objForPrivate)
//             const payload = {
//                 company_id: searchBookingData.company_id,
//                 cart_items: cartItem,
//                 traveler_assignments: bookingData?.[0]?.rooms[0]?.room_type === "Private" ? arrForPrivate : travellers.map((row, index) => ({
//                     cart_item_index: index,
//                     traveler_id: row.caretaker, // caretaker as traveler_id
//                     is_exclusive_booking: false
//                 })),
//                 arrival_details: {
//                     ...formData.arrival_details,
//                     arrival_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                 },
//                 additional_comments: formData.additional_comments,
//                 company_booking_reference: formData.company_booking_reference,
//                 send_confirmation_email: formData.send_confirmation_email,
//                 additional_email_recipients: receivers.map(r => r.email)
//             };
//             const response = await CreateBookingPost(payload);
//             if (response.data.success) {
//                 setBookingConfirmedData(response.data.response.bookings)
//                 addReserve()
//                 toast.success(" Booking Created Successfully");
//                 removeItemLocalStorage("reserveRoom")
//                 removeItemLocalStorage("searchParam")
//                 removeItemLocalStorage("basicSecrchItemObj")
//             } else {
//                 response.data.response.validation_errors.forEach(element => {
//                     // alert_danger(element.error)
//                     toast.error(element.error)
//                 });
//             }
//         } catch (error) {
//             console.error("Submission error:", error);
//             // alert_danger("Failed to create booking");
//             toast.error("Failed to create booking")
//         }
//     }



//     // const formatDate = (dateString) => {
//     //     const date = new Date(dateString);
//     //     return date.toLocaleDateString("en-US", {
//     //         weekday: "short",
//     //         day: "numeric",
//     //         month: "short",
//     //         year: "numeric",
//     //     });
//     // };

//     // const formatTime = (dateString) => {
//     //     const date = new Date(dateString);
//     //     return date.toLocaleTimeString("en-US", {
//     //         hour: "2-digit",
//     //         minute: "2-digit",
//     //     });
//     // };

//     console.log(reserveBookingData)

//     return (
//         <>
//             <Header />
//             <Toaster position="top-right" />
//             <div className='searching-result-top'>
//                 <Container>
//                     <div className='search-result-header'>
//                         <h4>Schlumberger  |  Navi Mumbai</h4>

//                         <p className='mb-0'><Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />   Sun, 3 Aug - Thu, 7 Aug, 2025, 4 nights  | <Image src='./images/icons/group.svg' alt='calendor' className="img-fluid" width={24} height={24} />   1 room for 1 guest</p>

//                         <Button variant='' onClick={addTravel2} className='edit-details'>Edit Stay Details</Button>
//                     </div>
//                 </Container>
//             </div>


//             <div className='search-result-data'>
//                 <Container>
//                     <Row className='justify-content-between'>

//                         <Col md={12}>
//                             <h4 className='page-title mb-5' > Add Guests & Reserve Your Booking</h4>
//                         </Col>
//                         <Col md={8} className='' >


//                             <h4 className='font-24 mb-4' > Review Your Selected BRs (1)</h4>



//                             {/* <div className="booking-card border bg-white  p-3 mb-4 ">
//                                 <Row>
//                                     <Col md={4}>
//                                         <Image
//                                             src="/images/icons/room-1.jpg"
//                                             alt="Room Image"
//                                             width={300}
//                                             height={200}
//                                             className="img-fluid "
//                                         />
//                                     </Col>

//                                     <Col md={8}>




//                                         <p className="fw-semibold fs-20 mb-2 room-title "  > <span className='fs-20' > 2 night stay in Room 2</span>  <span className='room-type-badge' >Shared Rooms</span></p>
//                                         <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                             <Image
//                                                 src="/images/icons/location_on.svg"
//                                                 alt="Room Image"
//                                                 width={24}
//                                                 height={24}
//                                                 className="img-fluid "
//                                             />
//                                             Casa Melhor Yayati Tulip 17th Floor<br />
//                                             Flat No. 17, 17th Floor, near NRI apartments, Seawoods, Sector 58A,
//                                             Navi Mumbai, Maharashtra, 400706
//                                         </p>


//                                     </Col>

//                                 </Row>

//                                 <Row className="mt-3 mb-3">
//                                     <Col md={3}>
//                                         <div>
//                                             <p className="mb-1 text-secondary small">Check-in:</p>
//                                             <p className="fw-semibold mb-0">Sun, 3 Aug, 2025</p>
//                                             <small>2:00 PM</small>
//                                         </div>
//                                     </Col>
//                                     <Col md={3}>
//                                         <div>
//                                             <p className="mb-1 text-secondary small">Check-out:</p>
//                                             <p className="fw-semibold mb-0">Thu, 5 Aug, 2025</p>
//                                             <small>11:00 AM</small>
//                                         </div>
//                                     </Col>
//                                 </Row>

//                                 <div className="border-top pt-3">
//                                     <p className="mb-1 font-18">Room details</p>
//                                     <div className="room-specs d-flex gap-3 mb-2">
//                                         <span className="spec-item  d-flex gap-2"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span> |
//                                         <span className="spec-item  d-flex gap-2"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span> |
//                                         <span className="spec-item  d-flex gap-2">538 sq ft</span>
//                                     </div>

//                                     <div className="room-specs d-flex gap-3 mb-2 ">

//                                         <span className='female-booked'>
//                                             Female Booked
//                                         </span>

//                                         <span className=" badge-grey" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px', textTransform: 'uppercase' }}>Only 1 bed left!</span>

//                                     </div>

//                                     <hr></hr>


//                                 </div>

//                                 <div className='room-change-info d-flex gap-2 align-items-center mb-3 mt-3 pb-3 border-bottom ' >
//                                     <Image src='./images/icons/switch-pro-vertical.svg' alt='info' width={24} height={100} />
//                                     <div>
//                                         <p className='fs-20 mb-0 ' style={{ color: '#a6a6a6' }} >Property change on</p>
//                                         <p className='mb-0' style={{ color: '#a6a6a6' }}>Wed, 5 Aug, 2025</p>
//                                     </div>
//                                 </div>



//                                 <Row>
//                                     <Col md={4}>
//                                         <Image
//                                             src="/images/icons/property-2.jpg"
//                                             alt="Room Image"
//                                             width={300}
//                                             height={200}
//                                             className="img-fluid "
//                                         />
//                                     </Col>

//                                     <Col md={8}>




//                                         <p className="fw-semibold fs-20 mb-2 room-title "  > <span className='fs-20' > 2 night stay in Room 4</span>  <span className='room-type-badge' >Shared Rooms</span></p>
//                                         <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                             <Image
//                                                 src="/images/icons/location_on.svg"
//                                                 alt="Room Image"
//                                                 width={24}
//                                                 height={24}
//                                                 className="img-fluid "
//                                             />
//                                             Yayati Apartments 6th Floor<br />
//                                             Flat No. 17, 17th Floor, near NRI apartments, Seawoods, Sector 58A,
//                                             Navi Mumbai, Maharashtra, 400706
//                                         </p>


//                                     </Col>

//                                 </Row>

//                                 <Row className="mt-3 mb-3">
//                                     <Col md={3}>
//                                         <div>
//                                             <p className="mb-1 text-secondary small">Check-in:</p>
//                                             <p className="fw-semibold mb-0">Sun, 5 Aug, 2025</p>
//                                             <small>2:00 PM</small>
//                                         </div>
//                                     </Col>
//                                     <Col md={3}>
//                                         <div>
//                                             <p className="mb-1 text-secondary small">Check-out:</p>
//                                             <p className="fw-semibold mb-0">Thu, 7 Aug, 2025</p>
//                                             <small>11:00 AM</small>
//                                         </div>
//                                     </Col>
//                                 </Row>

//                                 <div className="border-top pt-3">
//                                     <p className="mb-1 font-18">Room details</p>
//                                     <div className="room-specs d-flex gap-3 mb-2">
//                                         <span className="spec-item  d-flex gap-2"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span> |
//                                         <span className="spec-item  d-flex gap-2"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span> |
//                                         <span className="spec-item  d-flex gap-2">538 sq ft</span>
//                                     </div>

//                                     <div className="room-specs d-flex gap-3 mb-2 ">

//                                         <span className='female-booked'>
//                                             Female Booked
//                                         </span>

//                                         <span className=" badge-grey" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px', textTransform: 'uppercase' }}>Only 1 bed left!</span>

//                                     </div>

//                                     <hr></hr>


//                                 </div>

//                                 <div className='room-change-info d-flex gap-2 align-items-center mb-3 mt-3 pb-3 border-bottom ' >
//                                     <Image src='./images/icons/switch-pro-vertical.svg' alt='info' width={24} height={100} />
//                                     <div>
//                                         <p className='fs-20 mb-0 ' style={{ color: '#a6a6a6' }} >Property change on</p>
//                                         <p className='mb-0' style={{ color: '#a6a6a6' }}>Wed, 7 Aug, 2025</p>
//                                     </div>
//                                 </div>



//                                 <Row>
//                                     <Col md={4}>
//                                         <Image
//                                             src="/images/icons/property-3.jpg"
//                                             alt="Room Image"
//                                             width={300}
//                                             height={200}
//                                             className="img-fluid "
//                                         />
//                                     </Col>

//                                     <Col md={8}>




//                                         <p className="fw-semibold fs-20 mb-2 room-title "  > <span className='fs-20' > 2 night stay in Room 2</span>  <span className='room-type-badge' >Shared Rooms</span></p>
//                                         <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                             <Image
//                                                 src="/images/icons/location_on.svg"
//                                                 alt="Room Image"
//                                                 width={24}
//                                                 height={24}
//                                                 className="img-fluid "
//                                             />
//                                             Yayati Apartments 6th Floor<br />
//                                             Flat No. 17, 17th Floor, near NRI apartments, Seawoods, Sector 58A,
//                                             Navi Mumbai, Maharashtra, 400706
//                                         </p>


//                                     </Col>

//                                 </Row>

//                                 <Row className="mt-3 mb-3">
//                                     <Col md={3}>
//                                         <div>
//                                             <p className="mb-1 text-secondary small">Check-in:</p>
//                                             <p className="fw-semibold mb-0">Sun, 5 Aug, 2025</p>
//                                             <small>2:00 PM</small>
//                                         </div>
//                                     </Col>
//                                     <Col md={3}>
//                                         <div>
//                                             <p className="mb-1 text-secondary small">Check-out:</p>
//                                             <p className="fw-semibold mb-0">Thu, 7 Aug, 2025</p>
//                                             <small>11:00 AM</small>
//                                         </div>
//                                     </Col>
//                                 </Row>

//                                 <div className="border-top pt-3">
//                                     <p className="mb-1 font-18">Room details</p>
//                                     <div className="room-specs d-flex gap-3 mb-2">
//                                         <span className="spec-item  d-flex gap-2"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span> |
//                                         <span className="spec-item  d-flex gap-2"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span> |
//                                         <span className="spec-item  d-flex gap-2">538 sq ft</span>
//                                     </div>



//                                     <hr></hr>


//                                 </div>



//                                 <div className="traveler-section">
//                                     <p className="mb-2 font-18">Travelers in this room</p>
//                                     <div className=" d-flex gap-3 mb-3">



//                                         <div className='radio-select-box  d-flex gap-2' style={{ background: '#F2F2F2' }}  >
//                                             <label className="form-check-label  d-flex gap-2 mb-0" htmlFor="default-radio">
//                                                 <input type="radio" name='select-question-type' id='default-radio' onChange={() => setSelectedType('text')} />
//                                                 <span className="radio-checkmark"></span>

//                                                 1 Adult
//                                             </label>
//                                         </div>

//                                         <div className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }} >
//                                             <label className="form-check-label  d-flex gap-2 mb-0" htmlFor="default-radio-1">
//                                                 <input type="radio" name='select-question-type' id='default-radio-1' onChange={() => setSelectedType('option')} />
//                                                 <span className="radio-checkmark"></span>

//                                                 2 Adults
//                                             </label>
//                                         </div>

//                                     </div>

//                                     <hr></hr>

//                                     <p className="mb-2 font-18">Traveler details</p>
//                                     <p className='small' >We’ll use this information to book. Make sure the name matches what is on the traveler’s passport or ID.</p>






//                                     <div className='property-list-2'>
//                                         <div className="row">


//                                             <div className="col-md-4">
//                                                 <Select
//                                                     name="traveller_type"
//                                                     options={travelOption}
//                                                     placeholder="Choose Role"
//                                                     className='react_selectbox'
//                                                     isSearchable={false}
//                                                     styles={customStyles}
//                                                     onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                     components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                 />
//                                             </div>
//                                             <div className="col-md-5">
//                                                 {caretakers.map((caretakerItem) => (
//                                                     !caretakerItem.data && (
//                                                         <div key={caretakerItem.id} className="form-group" style={{ position: "relative" }}>
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control user-icn2"
//                                                                 placeholder="Add a traveler"
//                                                                 onFocus={() => setShowCaretakerList(caretakerItem.id)}
//                                                                 onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//                                                             />

//                                                             {showCaretakerList === caretakerItem.id && (
//                                                                 <div
//                                                                     style={{
//                                                                         position: "absolute",
//                                                                         top: "58px",
//                                                                         left: 0,
//                                                                         right: 0,
//                                                                         background: "#f9f6f4",
//                                                                         border: "1px solid #6B4F3F",
//                                                                         borderRadius: "0px",
//                                                                         zIndex: 10,
//                                                                         padding: "16px",
//                                                                         maxHeight: "300px",
//                                                                         overflowY: "auto",
//                                                                     }}
//                                                                 >
//                                                                     {CaretakerList.length > 0 ? (
//                                                                         <>
//                                                                             {CaretakerList.map((caretaker, idx) => (
//                                                                                 <div
//                                                                                     className="managers-data"
//                                                                                     key={idx}
//                                                                                     style={{
//                                                                                         display: "flex",
//                                                                                         alignItems: "center",
//                                                                                         marginBottom: "18px",
//                                                                                         borderBottom: idx < CaretakerList.length - 1 ? "1px solid #ececec" : "none",
//                                                                                         paddingBottom: "15px",
//                                                                                         cursor: "pointer",
//                                                                                     }}
//                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                     onClick={() => handleCaretakerSelect(caretakerItem.id, caretaker)}
//                                                                                 >
//                                                                                     <Image
//                                                                                         src={caretaker.img}
//                                                                                         alt={caretaker.name}
//                                                                                         width={48}
//                                                                                         height={48}
//                                                                                         style={{
//                                                                                             borderRadius: "0px",
//                                                                                             objectFit: "cover",
//                                                                                             marginRight: "16px",
//                                                                                         }}
//                                                                                     />
//                                                                                     <div>
//                                                                                         <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                             {caretaker.name}{" "}
//                                                                                             {caretaker.you && (
//                                                                                                 <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                                                                     (You)
//                                                                                                 </span>
//                                                                                             )}
//                                                                                         </div>
//                                                                                         <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             ))}


//                                                                             <div style={{
//                                                                                 borderTop: "1px solid #ececec",
//                                                                                 paddingTop: "16px",
//                                                                                 marginTop: "8px"
//                                                                             }}>
//                                                                                 <div style={{
//                                                                                     textAlign: "left",
//                                                                                     padding: "0px",
//                                                                                 }}>
//                                                                                     <div style={{
//                                                                                         fontSize: "14px",
//                                                                                         fontWeight: "500",
//                                                                                         marginBottom: "4px",
//                                                                                         color: "#463527"
//                                                                                     }}>
//                                                                                         {`Can't find someone?`} <br></br>

//                                                                                         <Link onClick={addTravel} href='#' style={{ color: '#463527' }} >Register a new traveler</Link>
//                                                                                     </div>

//                                                                                 </div>
//                                                                             </div>
//                                                                         </>
//                                                                     ) : (

//                                                                         <div style={{
//                                                                             textAlign: "center",
//                                                                             padding: "30px 20px",
//                                                                             color: "#73615F"
//                                                                         }}>
//                                                                             <div style={{
//                                                                                 marginBottom: "12px",
//                                                                                 fontSize: "18px",
//                                                                                 color: "#463527"
//                                                                             }}>
//                                                                                 👤
//                                                                             </div>
//                                                                             <div style={{
//                                                                                 fontSize: "16px",
//                                                                                 fontWeight: "500",
//                                                                                 marginBottom: "8px",
//                                                                                 color: "#463527"
//                                                                             }}>
//                                                                                 No caretakers found
//                                                                             </div>
//                                                                             <div style={{
//                                                                                 fontSize: "14px",
//                                                                                 marginBottom: "16px",
//                                                                                 lineHeight: "1.4"
//                                                                             }}>
//                                                                                 {`Can't find the person you're looking for?`}
//                                                                             </div>
//                                                                             <button
//                                                                                 style={{
//                                                                                     background: "#6B4F3F",
//                                                                                     color: "white",
//                                                                                     border: "none",
//                                                                                     padding: "10px 20px",
//                                                                                     borderRadius: "4px",
//                                                                                     fontSize: "14px",
//                                                                                     cursor: "pointer",
//                                                                                     fontWeight: "500",
//                                                                                     width: "100%"
//                                                                                 }}
//                                                                                 onMouseDown={(e) => e.preventDefault()}
//                                                                                 onClick={() => { }}
//                                                                             >
//                                                                                 Invite to Join
//                                                                             </button>
//                                                                         </div>
//                                                                     )}
//                                                                 </div>
//                                                             )}


//                                                         </div>
//                                                     )
//                                                 ))}
//                                             </div>



//                                             <div className="col-md-12">
//                                                 {caretakers.map((caretakerItem) => (
//                                                     caretakerItem.data && (
//                                                         <div key={caretakerItem.id} className="selected-caretaker-container">
//                                                             <div
//                                                                 className='manager-list-full'
//                                                                 style={{
//                                                                     display: "flex",
//                                                                     alignItems: "center",
//                                                                     border: "1px solid rgb(128 99 75 / 24%)",
//                                                                     borderRadius: "0px",
//                                                                     padding: "12px 16px",
//                                                                     // marginBottom: "8px",
//                                                                     marginTop: "15px",
//                                                                     width: "100%",
//                                                                     gap: '4px'
//                                                                 }}
//                                                             >


//                                                                 <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
//                                                                     <Image
//                                                                         src={caretakerItem.data.img}
//                                                                         alt={caretakerItem.data.name}
//                                                                         width={48}
//                                                                         height={48}
//                                                                         style={{
//                                                                             borderRadius: "0px",
//                                                                             objectFit: "cover",
//                                                                             marginRight: "10px",
//                                                                         }}
//                                                                     />
//                                                                     <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                         {caretakerItem.data.name}{" "}
//                                                                         <br></br>
//                                                                         <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                                                                             Emp. id: 00003
//                                                                         </span> <br></br>
//                                                                         <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                                                                             Dept: Sales & Market...
//                                                                         </span>

//                                                                         {caretakerItem.data.you && (
//                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F" }}>
//                                                                                 (You)
//                                                                             </span>
//                                                                         )}
//                                                                     </span>

//                                                                     <span style={{ color: "#73615F" }}>|</span>

//                                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                         <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                         {caretakerItem.data.phone || "8390734261"}
//                                                                     </span>

//                                                                     <span style={{ color: "#73615F" }}>|</span>

//                                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                         <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                         {caretakerItem.data.email}
//                                                                     </span>

//                                                                     <span style={{ color: "#73615F" }}>|</span>

//                                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                         <Image src="./images/icons/Genders.svg" alt="email" width={18} height={18} />
//                                                                         {caretakerItem.data.gender || "Female"}
//                                                                     </span>
//                                                                 </div>

//                                                                 <div className='show-edit-btn'>

//                                                                     <Button variant='' className='edit-btn ms-1 me-1'>Edit details</Button>

//                                                                     <button
//                                                                         type="button"
//                                                                         className='ms-auto'
//                                                                         onClick={() => handleCaretakerRemove(caretakerItem.id)}
//                                                                         style={{
//                                                                             background: "none",
//                                                                             border: "none",
//                                                                             color: "#6B4F3F",
//                                                                             fontSize: "14px",
//                                                                             cursor: "pointer",
//                                                                             flexShrink: 0,
//                                                                         }}
//                                                                         title="Remove"
//                                                                     >
//                                                                         <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />


//                                                                     </button>

//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     )
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div> */}
//                             <div className="booking-card border bg-white p-3 mb-4">
//                                 {reserveBookingData?.segments?.map((segment, index) => {
//                                     const isLast = index === reserveBookingData?.segments.length - 1;
//                                     const nextSegment = reserveBookingData?.segments[index + 1];

//                                     return (
//                                         <React.Fragment key={segment.segment_id}>

//                                             {/* ROOM CARD */}
//                                             <Row>
//                                                 <Col md={4}>
//                                                     <Image
//                                                         src={
//                                                             `https://alicedevapi.casamelhor.in${segment.property_cover_photo}` ||
//                                                             `https://alicedevapi.casamelhor.in${segment.cover_photo}` ||
//                                                             "/images/no-image.png"
//                                                         }
//                                                         alt={segment.room_name}
//                                                         width={300}
//                                                         height={200}
//                                                         className="img-fluid"
//                                                     />
//                                                 </Col>

//                                                 <Col md={8}>
//                                                     <p className="fw-semibold fs-20 mb-2 room-title">
//                                                         <span className="fs-20">
//                                                             {segment.nights} night stay in {segment.room_name}
//                                                         </span>
//                                                         <span className="room-type-badge ms-2">
//                                                             {segment.room_type}
//                                                         </span>
//                                                     </p>

//                                                     <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                         <Image
//                                                             src="/images/icons/location_on.svg"
//                                                             alt="location"
//                                                             width={24}
//                                                             height={24}
//                                                         />
//                                                         {segment.property_name}
//                                                     </p>
//                                                 </Col>
//                                             </Row>

//                                             {/* CHECK-IN / CHECK-OUT */}
//                                             <Row className="mt-3 mb-3">
//                                                 <Col md={3}>
//                                                     <p className="mb-1 text-secondary small">Check-in:</p>
//                                                     <p className="fw-semibold mb-0">
//                                                         {formatDate(segment.check_in_datetime)}
//                                                     </p>
//                                                     <small>{formatTime(segment.check_in_datetime)}</small>
//                                                 </Col>

//                                                 <Col md={3}>
//                                                     <p className="mb-1 text-secondary small">Check-out:</p>
//                                                     <p className="fw-semibold mb-0">
//                                                         {formatDate(segment.check_out_datetime)}
//                                                     </p>
//                                                     <small>{formatTime(segment.check_out_datetime)}</small>
//                                                 </Col>
//                                             </Row>

//                                             <hr />

//                                             {/* PROPERTY CHANGE BLOCK */}
//                                             {!isLast && (
//                                                 <div className="room-change-info d-flex gap-2 align-items-center mb-3 mt-3 pb-3 border-bottom">
//                                                     <Image
//                                                         src="./images/icons/switch-pro-vertical.svg"
//                                                         alt="switch"
//                                                         width={24}
//                                                         height={100}
//                                                     />
//                                                     <div>
//                                                         <p className="fs-20 mb-0" style={{ color: "#a6a6a6" }}>
//                                                             {reserveBookingData?.type=="mixed_room"?'Room':'Property'} change on
//                                                         </p>
//                                                         <p className="mb-0" style={{ color: "#a6a6a6" }}>
//                                                             {formatDate(nextSegment.check_in_datetime)}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             <div className="border-top pt-3">
//                                                 <p className="mb-1 font-18">Room details</p>
//                                                 <div className="room-specs d-flex gap-3 mb-2">
//                                                     <span className="spec-item  d-flex gap-2"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span> |
//                                                     <span className="spec-item  d-flex gap-2"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span> |
//                                                     <span className="spec-item  d-flex gap-2">538 sq ft</span>
//                                                 </div>
//                                                 <hr></hr>
//                                             </div>

//                                             {/* TRAVELER SECTION ONLY ON LAST SEGMENT */}
//                                             {isLast && (
//                                                 <>
//                                                     {/* <div className="traveler-section">
//                                                         <p className="mb-2 font-18">Travelers in this room</p>
//                                                         <div className=" d-flex gap-3 mb-3">
//                                                             <div className='radio-select-box  d-flex gap-2' style={{ background: '#F2F2F2' }}  >
//                                                                 <label className="form-check-label  d-flex gap-2 mb-0" htmlFor="default-radio">
//                                                                     <input type="radio" name='select-question-type' id='default-radio' onChange={() => setSelectedType('text')} />
//                                                                     <span className="radio-checkmark"></span>

//                                                                     1 Adult
//                                                                 </label>
//                                                             </div>

//                                                             <div className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }} >
//                                                                 <label className="form-check-label  d-flex gap-2 mb-0" htmlFor="default-radio-1">
//                                                                     <input type="radio" name='select-question-type' id='default-radio-1' onChange={() => setSelectedType('option')} />
//                                                                     <span className="radio-checkmark"></span>

//                                                                     2 Adults
//                                                                 </label>
//                                                             </div>


//                                                         </div>

//                                                         <hr></hr>

//                                                         <p className="mb-2 font-18">Traveler details</p>
//                                                         <p className='small' >We’ll use this information to book. Make sure the name matches what is on the traveler’s passport or ID.</p>
//                                                         {segment?.room_type=="Private" ? (''):('')}
//                                                         <div className='property-list-2'>
//                                                             <div className="row">


//                                                                 <div className="col-md-4">
//                                                                     <Select
//                                                                         name="traveller_type"
//                                                                         options={travelOption}
//                                                                         placeholder="Choose Role"
//                                                                         className='react_selectbox'
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                     />
//                                                                 </div>
//                                                                 <div className="col-md-5">
//                                                                     {caretakers.map((caretakerItem) => (
//                                                                         !caretakerItem.data && (
//                                                                             <div key={caretakerItem.id} className="form-group" style={{ position: "relative" }}>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className="form-control user-icn2"
//                                                                                     placeholder="Add a traveler"
//                                                                                     onFocus={() => setShowCaretakerList(caretakerItem.id)}
//                                                                                     onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//                                                                                 />

//                                                                                 {showCaretakerList === caretakerItem.id && (
//                                                                                     <div
//                                                                                         style={{
//                                                                                             position: "absolute",
//                                                                                             top: "58px",
//                                                                                             left: 0,
//                                                                                             right: 0,
//                                                                                             background: "#f9f6f4",
//                                                                                             border: "1px solid #6B4F3F",
//                                                                                             borderRadius: "0px",
//                                                                                             zIndex: 10,
//                                                                                             padding: "16px",
//                                                                                             maxHeight: "300px",
//                                                                                             overflowY: "auto",
//                                                                                         }}
//                                                                                     >
//                                                                                         {CaretakerList.length > 0 ? (
//                                                                                             <>
//                                                                                                 {CaretakerList.map((caretaker, idx) => (
//                                                                                                     <div
//                                                                                                         className="managers-data"
//                                                                                                         key={idx}
//                                                                                                         style={{
//                                                                                                             display: "flex",
//                                                                                                             alignItems: "center",
//                                                                                                             marginBottom: "18px",
//                                                                                                             borderBottom: idx < CaretakerList.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                             paddingBottom: "15px",
//                                                                                                             cursor: "pointer",
//                                                                                                         }}
//                                                                                                         onMouseDown={(e) => e.preventDefault()}
//                                                                                                         onClick={() => handleCaretakerSelect(caretakerItem.id, caretaker)}
//                                                                                                     >
//                                                                                                         <Image
//                                                                                                             src={caretaker.img}
//                                                                                                             alt={caretaker.name}
//                                                                                                             width={48}
//                                                                                                             height={48}
//                                                                                                             style={{
//                                                                                                                 borderRadius: "0px",
//                                                                                                                 objectFit: "cover",
//                                                                                                                 marginRight: "16px",
//                                                                                                             }}
//                                                                                                         />
//                                                                                                         <div>
//                                                                                                             <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                                 {caretaker.name}{" "}
//                                                                                                                 {caretaker.you && (
//                                                                                                                     <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                                                                                         (You)
//                                                                                                                     </span>
//                                                                                                                 )}
//                                                                                                             </div>
//                                                                                                             <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                                                                         </div>
//                                                                                                     </div>
//                                                                                                 ))}


//                                                                                                 <div style={{
//                                                                                                     borderTop: "1px solid #ececec",
//                                                                                                     paddingTop: "16px",
//                                                                                                     marginTop: "8px"
//                                                                                                 }}>
//                                                                                                     <div style={{
//                                                                                                         textAlign: "left",
//                                                                                                         padding: "0px",
//                                                                                                     }}>
//                                                                                                         <div style={{
//                                                                                                             fontSize: "14px",
//                                                                                                             fontWeight: "500",
//                                                                                                             marginBottom: "4px",
//                                                                                                             color: "#463527"
//                                                                                                         }}>
//                                                                                                             {`Can't find someone?`} <br></br>

//                                                                                                             <Link onClick={addTravel} href='#' style={{ color: '#463527' }} >Register a new traveler</Link>
//                                                                                                         </div>

//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             </>
//                                                                                         ) : (

//                                                                                             <div style={{
//                                                                                                 textAlign: "center",
//                                                                                                 padding: "30px 20px",
//                                                                                                 color: "#73615F"
//                                                                                             }}>
//                                                                                                 <div style={{
//                                                                                                     marginBottom: "12px",
//                                                                                                     fontSize: "18px",
//                                                                                                     color: "#463527"
//                                                                                                 }}>
//                                                                                                     👤
//                                                                                                 </div>
//                                                                                                 <div style={{
//                                                                                                     fontSize: "16px",
//                                                                                                     fontWeight: "500",
//                                                                                                     marginBottom: "8px",
//                                                                                                     color: "#463527"
//                                                                                                 }}>
//                                                                                                     No caretakers found
//                                                                                                 </div>
//                                                                                                 <div style={{
//                                                                                                     fontSize: "14px",
//                                                                                                     marginBottom: "16px",
//                                                                                                     lineHeight: "1.4"
//                                                                                                 }}>
//                                                                                                     {`Can't find the person you're looking for?`}
//                                                                                                 </div>
//                                                                                                 <button
//                                                                                                     style={{
//                                                                                                         background: "#6B4F3F",
//                                                                                                         color: "white",
//                                                                                                         border: "none",
//                                                                                                         padding: "10px 20px",
//                                                                                                         borderRadius: "4px",
//                                                                                                         fontSize: "14px",
//                                                                                                         cursor: "pointer",
//                                                                                                         fontWeight: "500",
//                                                                                                         width: "100%"
//                                                                                                     }}
//                                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                                     onClick={() => { }}
//                                                                                                 >
//                                                                                                     Invite to Join
//                                                                                                 </button>
//                                                                                             </div>
//                                                                                         )}
//                                                                                     </div>
//                                                                                 )}


//                                                                             </div>
//                                                                         )
//                                                                     ))}
//                                                                 </div>



//                                                                 <div className="col-md-12">
//                                                                     {caretakers.map((caretakerItem) => (
//                                                                         caretakerItem.data && (
//                                                                             <div key={caretakerItem.id} className="selected-caretaker-container">
//                                                                                 <div
//                                                                                     className='manager-list-full'
//                                                                                     style={{
//                                                                                         display: "flex",
//                                                                                         alignItems: "center",
//                                                                                         border: "1px solid rgb(128 99 75 / 24%)",
//                                                                                         borderRadius: "0px",
//                                                                                         padding: "12px 16px",
//                                                                                         // marginBottom: "8px",
//                                                                                         marginTop: "15px",
//                                                                                         width: "100%",
//                                                                                         gap: '4px'
//                                                                                     }}
//                                                                                 >


//                                                                                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
//                                                                                         <Image
//                                                                                             src={caretakerItem.data.img}
//                                                                                             alt={caretakerItem.data.name}
//                                                                                             width={48}
//                                                                                             height={48}
//                                                                                             style={{
//                                                                                                 borderRadius: "0px",
//                                                                                                 objectFit: "cover",
//                                                                                                 marginRight: "10px",
//                                                                                             }}
//                                                                                         />
//                                                                                         <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                             {caretakerItem.data.name}{" "}
//                                                                                             <br></br>
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                                                                                                 Emp. id: 00003
//                                                                                             </span> <br></br>
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                                                                                                 Dept: Sales & Market...
//                                                                                             </span>

//                                                                                             {caretakerItem.data.you && (
//                                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F" }}>
//                                                                                                     (You)
//                                                                                                 </span>
//                                                                                             )}
//                                                                                         </span>

//                                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                             {caretakerItem.data.phone || "8390734261"}
//                                                                                         </span>

//                                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                             {caretakerItem.data.email}
//                                                                                         </span>

//                                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/Genders.svg" alt="email" width={18} height={18} />
//                                                                                             {caretakerItem.data.gender || "Female"}
//                                                                                         </span>
//                                                                                     </div>

//                                                                                     <div className='show-edit-btn'>

//                                                                                         <Button variant='' className='edit-btn ms-1 me-1'>Edit details</Button>

//                                                                                         <button
//                                                                                             type="button"
//                                                                                             className='ms-auto'
//                                                                                             onClick={() => handleCaretakerRemove(caretakerItem.id)}
//                                                                                             style={{
//                                                                                                 background: "none",
//                                                                                                 border: "none",
//                                                                                                 color: "#6B4F3F",
//                                                                                                 fontSize: "14px",
//                                                                                                 cursor: "pointer",
//                                                                                                 flexShrink: 0,
//                                                                                             }}
//                                                                                             title="Remove"
//                                                                                         >
//                                                                                             <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />


//                                                                                         </button>

//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         )
//                                                                     ))}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div> */}
//                                                     <div className="traveler-section">
//                                                         <p className="mb-2 font-18">Travelers in this room</p>
//                                                         <div className="d-flex gap-3 mb-3">
//                                                             {/* {Array.from(
//                                                                 { length: booking?.adultCount > 2 ? booking?.adultCount : 2 },
//                                                                 (_, index) => {
//                                                                     const count = index + 1;
//                                                                     return (
//                                                                         <div
//                                                                             key={count}
//                                                                             className="radio-select-box d-flex gap-2"
//                                                                             style={{ background: "#F2F2F2" }}
//                                                                         >
//                                                                             <label className="form-check-label d-flex gap-2 mb-0">
//                                                                                 <input
//                                                                                     type="radio"
//                                                                                     name="adult-count"
//                                                                                     checked={booking?.adultCount === count}
//                                                                                     onChange={() => {
//                                                                                         const updated =
//                                                                                             index === 0 ? { ...booking, adultCount: count } : booking
//                                                                                             ;
//                                                                                         setBookingData([updated]);
//                                                                                         setTravellers(
//                                                                                             Array.from({ length: updated?.adultCount }, () => ({
//                                                                                                 traveller_type: null,
//                                                                                                 isGenderValidation: "",
//                                                                                                 caretaker: null,
//                                                                                                 searchText: "",
//                                                                                                 showList: false,
//                                                                                                 filteredUsers: userListData,
//                                                                                                 selectedBedIndex: null
//                                                                                             }))
//                                                                                         )
//                                                                                     }}
//                                                                                 />
//                                                                                 <span className="radio-checkmark"></span>
//                                                                                 {count} Adult{count > 1 ? "s" : ""}
//                                                                             </label>
//                                                                         </div>
//                                                                     );
//                                                                 }
//                                                             )} */}
//                                                         </div>
//                                                         {/* <span>{booking.rooms[0].bedroom_preference}</span> */}


//                                                         <hr></hr>

//                                                         <Row className='mb-3' >
//                                                             <Col md={5}>
//                                                                 <label className="mb-0 d-flex gap-2 align-items-center  show-my-booking"><input className="mx-2 custom-checkbox" type="checkbox" />Exclusively book this room for the traveler</label>
//                                                             </Col>
//                                                         </Row>

//                                                         <Row className='mb-2'>
//                                                             <Col md={6}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }} >Since this is a twin bed, one will be available for booking unless you specify it for exclusive use.</p>
//                                                             </Col>
//                                                         </Row>
//                                                         <p className="mb-2 font-18">Traveler details</p>
//                                                         <p className='small' >We’ll use this information to book. Make sure the name matches what is on the traveler’s passport or ID.</p>
//                                                         <Row className='mb-2'>
//                                                             <Col md={7}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }} >As this room has already been booked for a female for your selected dates, only female traveler bookings are allowed</p>
//                                                             </Col>
//                                                         </Row>

//                                                         {segment?.room_type === "Private" ?
//                                                             <div className='property-list-2'>
//                                                                 <div className="row">
//                                                                     {/* Select and Input in col-6 */}

//                                                                     <div className="col-md-4">
//                                                                         <Select
//                                                                             name="traveller_type"
//                                                                             options={travelOption}
//                                                                             placeholder="Choose Role"
//                                                                             className='react_selectbox'
//                                                                             isSearchable={false}
//                                                                             styles={customStyles}
//                                                                             onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                                             components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                         />
//                                                                     </div>
//                                                                     <div className="col-md-5">
//                                                                         <div className="form-group" style={{ position: "relative" }}>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control user-icn2"
//                                                                                 placeholder="Add a traveler"
//                                                                                 value={userListData?.filter(user => user.uid === formData.caretakers)[0]?.first_name ? userListData?.filter(user => user.uid === formData.caretakers)[0]?.first_name : ""}
//                                                                                 onFocus={() => setShowCaretakerList(true)}
//                                                                                 onBlur={() => setTimeout(() => setShowCaretakerList(false), 200)}
//                                                                                 onChange={() => { console.log("true") }}
//                                                                             />

//                                                                             {showCaretakerList && (
//                                                                                 <div
//                                                                                     style={{
//                                                                                         position: "absolute",
//                                                                                         top: "58px",
//                                                                                         left: 0,
//                                                                                         right: 0,
//                                                                                         background: "#f9f6f4",
//                                                                                         border: "1px solid #6B4F3F",
//                                                                                         zIndex: 10,
//                                                                                         padding: "16px",
//                                                                                         maxHeight: "300px",
//                                                                                         overflowY: "auto",
//                                                                                     }}
//                                                                                 >
//                                                                                     {filtereduserListData?.length > 0 ? (
//                                                                                         <>
//                                                                                             {filtereduserListData?.map((user, idx) => (
//                                                                                                 <div
//                                                                                                     key={user.value}
//                                                                                                     className="managers-data"
//                                                                                                     style={{
//                                                                                                         display: "flex",
//                                                                                                         alignItems: "center",
//                                                                                                         marginBottom: "18px",
//                                                                                                         borderBottom:
//                                                                                                             idx < filtereduserListData.length - 1
//                                                                                                                 ? "1px solid #ececec"
//                                                                                                                 : "none",
//                                                                                                         paddingBottom: "15px",
//                                                                                                         cursor: "pointer",
//                                                                                                     }}
//                                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                                     onClick={() => handleCaretakerSelect("", user.value)}
//                                                                                                 >
//                                                                                                     {/* Avatar placeholder */}
//                                                                                                     <div
//                                                                                                         style={{
//                                                                                                             width: "48px",
//                                                                                                             height: "48px",
//                                                                                                             background: "#e0d7d1",
//                                                                                                             marginRight: "16px",
//                                                                                                         }}
//                                                                                                     />

//                                                                                                     <div>
//                                                                                                         <div
//                                                                                                             style={{
//                                                                                                                 fontWeight: 500,
//                                                                                                                 fontSize: "14px",
//                                                                                                                 color: "#463527",
//                                                                                                             }}
//                                                                                                         >
//                                                                                                             {user.label}
//                                                                                                         </div>
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             ))}

//                                                                                             {/* Can't find someone */}
//                                                                                             <div
//                                                                                                 style={{
//                                                                                                     borderTop: "1px solid #ececec",
//                                                                                                     paddingTop: "16px",
//                                                                                                     marginTop: "8px",
//                                                                                                 }}
//                                                                                             >
//                                                                                                 <div
//                                                                                                     style={{
//                                                                                                         fontSize: "14px",
//                                                                                                         fontWeight: "500",
//                                                                                                         color: "#463527",
//                                                                                                     }}
//                                                                                                 >
//                                                                                                     {`Can't find someone?`}
//                                                                                                     <br />
//                                                                                                     <Link onClick={addTravel} href="#" style={{ color: "#463527" }}>
//                                                                                                         Register a new traveler
//                                                                                                     </Link>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </>
//                                                                                     ) : (
//                                                                                         /* No travelers */
//                                                                                         <div
//                                                                                             style={{
//                                                                                                 textAlign: "center",
//                                                                                                 padding: "30px 20px",
//                                                                                                 color: "#73615F",
//                                                                                             }}
//                                                                                         >
//                                                                                             <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                                                                                             <div
//                                                                                                 style={{
//                                                                                                     fontSize: "16px",
//                                                                                                     fontWeight: "500",
//                                                                                                     marginBottom: "8px",
//                                                                                                     color: "#463527",
//                                                                                                 }}
//                                                                                             >
//                                                                                                 No travelers found
//                                                                                             </div>

//                                                                                             <Link href="/People" style={{
//                                                                                                 background: "#6B4F3F",
//                                                                                                 color: "white",
//                                                                                                 padding: "10px 20px",
//                                                                                                 width: "100%",
//                                                                                                 display: "block",
//                                                                                                 textAlign: "center",
//                                                                                                 cursor: "pointer",
//                                                                                                 textDecoration: "none",
//                                                                                             }} >

//                                                                                                 Invite to Join..

//                                                                                             </Link>
//                                                                                         </div>
//                                                                                     )}
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-12">
//                                                                         {/* Show selected caretaker for this specific traveler */}
//                                                                         {formData.caretakers &&
//                                                                             userListData.length > 0 && userListData.filter(ele => ele.uid === formData.caretakers).map((item, index) => (<div key={`selected-caretaker-${index}`} className="selected-caretaker-container">
//                                                                                 <div
//                                                                                     className="manager-list-full"
//                                                                                     style={{
//                                                                                         display: "flex",
//                                                                                         alignItems: "center",
//                                                                                         border: "1px solid rgb(128 99 75 / 24%)",
//                                                                                         borderRadius: "0px",
//                                                                                         padding: "12px 16px",
//                                                                                         marginTop: "15px",
//                                                                                         width: "100%",
//                                                                                         gap: "4px"
//                                                                                     }}
//                                                                                 >
//                                                                                     <div style={{
//                                                                                         display: "flex",
//                                                                                         alignItems: "center",
//                                                                                         flexWrap: "wrap",
//                                                                                         gap: "4px",
//                                                                                         flex: 1
//                                                                                     }}>
//                                                                                         <Image
//                                                                                             src={item?.profile_image}
//                                                                                             alt={item?.first_name}
//                                                                                             width={48}
//                                                                                             height={48}
//                                                                                             style={{
//                                                                                                 borderRadius: "0px",
//                                                                                                 objectFit: "cover",
//                                                                                                 marginRight: "10px",
//                                                                                             }}
//                                                                                         />
//                                                                                         <span style={{
//                                                                                             fontWeight: 500,
//                                                                                             fontSize: "14px",
//                                                                                             color: "#463527"
//                                                                                         }}>
//                                                                                             {item?.first_name} {""}
//                                                                                             {item?.last_name}  {""}
//                                                                                             <br />
//                                                                                             <span style={{
//                                                                                                 fontWeight: 400,
//                                                                                                 fontSize: "12px",
//                                                                                                 color: "#73615F",
//                                                                                                 lineHeight: "10px"
//                                                                                             }}>
//                                                                                                 Emp. id: {item?.employee_id}
//                                                                                             </span>{" "}
//                                                                                             <br />
//                                                                                             <span style={{
//                                                                                                 fontWeight: 400,
//                                                                                                 fontSize: "12px",
//                                                                                                 color: "#73615F",
//                                                                                                 lineHeight: "10px"
//                                                                                             }}>
//                                                                                                 Dept: {item?.segment}
//                                                                                             </span>

//                                                                                             {/* {cart.travelerDetails[travelerIndex].data.you && ( */}
//                                                                                             <span style={{
//                                                                                                 fontWeight: 400,
//                                                                                                 fontSize: "12px",
//                                                                                                 color: "#73615F"
//                                                                                             }}>
//                                                                                                 {/* (You) */} (You)
//                                                                                             </span>
//                                                                                             {/* )} */}
//                                                                                         </span>

//                                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                                         <span style={{
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             color: "#463527",
//                                                                                             fontSize: "14px",
//                                                                                             gap: "5px"
//                                                                                         }}>
//                                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                             {item?.phone_number}
//                                                                                         </span>

//                                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                                         <span style={{
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             color: "#463527",
//                                                                                             fontSize: "14px",
//                                                                                             gap: "5px"
//                                                                                         }}>
//                                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                             {item?.email}
//                                                                                         </span>

//                                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                                         <span style={{
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             color: "#463527",
//                                                                                             fontSize: "14px",
//                                                                                             gap: "5px"
//                                                                                         }}>
//                                                                                             <Image src="./images/icons/Genders.svg" alt="email" width={18} height={18} />
//                                                                                             {item?.gender}
//                                                                                         </span>
//                                                                                     </div>

//                                                                                     <div className="show-edit-btn">
//                                                                                         <Button variant="" className="edit-btn ms-1 me-1" onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
//                                                                                             Edit details
//                                                                                         </Button>
//                                                                                         <button
//                                                                                             type="button"
//                                                                                             className="ms-auto"
//                                                                                             onClick={() => setFormData({ ...formData, caretakers: "" })}
//                                                                                             style={{
//                                                                                                 background: "none",
//                                                                                                 border: "none",
//                                                                                                 color: "#6B4F3F",
//                                                                                                 fontSize: "14px",
//                                                                                                 cursor: "pointer",
//                                                                                                 flexShrink: 0,
//                                                                                             }}
//                                                                                             title="Remove"
//                                                                                         >
//                                                                                             <Image
//                                                                                                 src="./images/icons/delete_b.svg"
//                                                                                                 alt="delete"
//                                                                                                 width={24}
//                                                                                                 height={24}
//                                                                                             />
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>))}
//                                                                     </div>
//                                                                 </div>
//                                                             </div> :
//                                                             travellers?.map((row, index) => (
//                                                                 <div key={index} className="property-list-2">
//                                                                     <div className="row mt-3 mb-3">

//                                                                         {/* Traveller Type */}
//                                                                         <div className="col-md-4">
//                                                                             <Select
//                                                                                 options={travelOption}
//                                                                                 placeholder="Choose Role"
//                                                                                 isSearchable={false}
//                                                                                 styles={customStyles}
//                                                                                 onChange={(e) => handleTravellerTypeChange(index, e.value)}
//                                                                             />
//                                                                         </div>

//                                                                         {/* Beds */}
//                                                                         <div className="col-md-3">
//                                                                             <Select
//                                                                                 options={chooseBeds?.filter(bed => !bed.selected)}
//                                                                                 placeholder="Choose Bed"
//                                                                                 isSearchable={false}
//                                                                                 styles={customStyles}
//                                                                                 value={chooseBeds.find(cv => cv.value == row?.selectedBedIndex)}
//                                                                                 onChange={(e) => {
//                                                                                     const value = e.value;

//                                                                                     // Update travellers data
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) =>
//                                                                                             i === index ? { ...item, selectedBedIndex: value } : item
//                                                                                         )
//                                                                                     );

//                                                                                     // Find all beds selected by any traveller
//                                                                                     const selectedBeds = new Set(
//                                                                                         travellers
//                                                                                             .map(t => t.selectedBedIndex)
//                                                                                             .filter(v => v !== null && v !== undefined)
//                                                                                     );
//                                                                                     selectedBeds.add(value); // ensure latest value gets included

//                                                                                     // Update bed array to mark which bed is selected
//                                                                                     setChooseBeds(prev =>
//                                                                                         prev.map((bed, idx) => ({
//                                                                                             ...bed,
//                                                                                             selected: selectedBeds.has(idx),
//                                                                                         }))
//                                                                                     );
//                                                                                 }}
//                                                                             />
//                                                                         </div>

//                                                                         {/* Caretaker */}
//                                                                         <div className="col-md-5">
//                                                                             <div className="form-group" style={{ position: "relative" }}>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className="form-control"
//                                                                                     placeholder="Add a traveler"
//                                                                                     value={row.searchText}
//                                                                                     onFocus={() => {
//                                                                                         setTravellers(prev =>
//                                                                                             prev.map((item, i) => {
//                                                                                                 if (i !== index) return item;

//                                                                                                 const baseFilteredUsers = userListData.filter(user => {
//                                                                                                     const roleName = user?.user_role?.role_name;

//                                                                                                     // External → role only
//                                                                                                     if (item.traveller_type === "External") {
//                                                                                                         return roleName === "External";
//                                                                                                     }

//                                                                                                     // Non-external → exclude External + company match
//                                                                                                     return (
//                                                                                                         roleName !== "External" &&
//                                                                                                         user?.user_company?.id === bacisSearchDetails?.company_id
//                                                                                                     );
//                                                                                                 });

//                                                                                                 return {
//                                                                                                     ...item,
//                                                                                                     showList: true,
//                                                                                                     filteredUsers: baseFilteredUsers
//                                                                                                 };
//                                                                                             })
//                                                                                         );
//                                                                                     }}

//                                                                                     onChange={(e) => {
//                                                                                         const value = e.target.value.toLowerCase();

//                                                                                         setTravellers(prev =>
//                                                                                             prev.map((item, i) => {
//                                                                                                 if (i !== index) return item;

//                                                                                                 // 1️⃣ Base filter (traveller + company logic)
//                                                                                                 const baseFilteredUsers = userListData.filter(user => {
//                                                                                                     const roleName = user?.user_role?.role_name;

//                                                                                                     if (item.traveller_type === "External") {
//                                                                                                         return roleName === "External";
//                                                                                                     }

//                                                                                                     return (
//                                                                                                         roleName !== "External" &&
//                                                                                                         user?.user_company?.id === bacisSearchDetails?.company_id
//                                                                                                     );
//                                                                                                 });

//                                                                                                 // 2️⃣ Search by name
//                                                                                                 const finalFilteredUsers = value
//                                                                                                     ? baseFilteredUsers.filter(user =>
//                                                                                                         `${user.first_name} ${user.last_name}`
//                                                                                                             .toLowerCase()
//                                                                                                             .includes(value)
//                                                                                                     )
//                                                                                                     : baseFilteredUsers;

//                                                                                                 return {
//                                                                                                     ...item,
//                                                                                                     searchText: value,
//                                                                                                     showList: true,
//                                                                                                     filteredUsers: finalFilteredUsers
//                                                                                                 };
//                                                                                             })
//                                                                                         );
//                                                                                     }}


//                                                                                     onBlur={() => {
//                                                                                         setTimeout(() => {
//                                                                                             setTravellers(prev =>
//                                                                                                 prev.map((item, i) =>
//                                                                                                     i === index ? { ...item, showList: false } : item
//                                                                                                 )
//                                                                                             );
//                                                                                         }, 200);
//                                                                                     }}
//                                                                                 />
//                                                                                 {/* Dropdown opens ONLY for this index */}
//                                                                                 {row.showList && (
//                                                                                     <div
//                                                                                         style={{
//                                                                                             position: "absolute",
//                                                                                             top: "58px",
//                                                                                             left: 0,
//                                                                                             right: 0,
//                                                                                             background: "#f9f6f4",
//                                                                                             border: "1px solid #6B4F3F",
//                                                                                             zIndex: 10,
//                                                                                             padding: "16px",
//                                                                                             maxHeight: "300px",
//                                                                                             overflowY: "auto",
//                                                                                         }}
//                                                                                     >
//                                                                                         {row.filteredUsers && row.filteredUsers?.length > 0 ? (
//                                                                                             <>
//                                                                                                 {row.filteredUsers.map((user, idx) => (
//                                                                                                     <div
//                                                                                                         key={user.uid}
//                                                                                                         className="managers-data"
//                                                                                                         style={{
//                                                                                                             display: "flex",
//                                                                                                             alignItems: "center",
//                                                                                                             marginBottom: "18px",
//                                                                                                             borderBottom:
//                                                                                                                 idx < row.filteredUsers?.length - 1
//                                                                                                                     ? "1px solid #ececec"
//                                                                                                                     : "none",
//                                                                                                             paddingBottom: "15px",
//                                                                                                             cursor: "pointer",
//                                                                                                         }}
//                                                                                                         onMouseDown={(e) => e.preventDefault()} // prevent input blur
//                                                                                                         onClick={() => handleCaretakerSelect(index, user.uid)}
//                                                                                                     >
//                                                                                                         {/* Avatar placeholder */}
//                                                                                                         <div
//                                                                                                             style={{
//                                                                                                                 width: "48px",
//                                                                                                                 height: "48px",
//                                                                                                                 background: "#e0d7d1",
//                                                                                                                 marginRight: "16px",
//                                                                                                             }}
//                                                                                                         />

//                                                                                                         <div>
//                                                                                                             <div
//                                                                                                                 style={{
//                                                                                                                     fontWeight: 500,
//                                                                                                                     fontSize: "14px",
//                                                                                                                     color: "#463527",
//                                                                                                                 }}
//                                                                                                             >
//                                                                                                                 {user.first_name} {user.last_name}
//                                                                                                             </div>
//                                                                                                         </div>
//                                                                                                     </div>
//                                                                                                 ))}

//                                                                                                 {/* Can't find someone */}
//                                                                                                 <div
//                                                                                                     style={{
//                                                                                                         borderTop: "1px solid #ececec",
//                                                                                                         paddingTop: "16px",
//                                                                                                         marginTop: "8px",
//                                                                                                     }}
//                                                                                                 >
//                                                                                                     <div
//                                                                                                         style={{
//                                                                                                             fontSize: "14px",
//                                                                                                             fontWeight: "500",
//                                                                                                             color: "#463527",
//                                                                                                         }}
//                                                                                                     >
//                                                                                                         Can’t find someone?
//                                                                                                         <br />
//                                                                                                         <Link onClick={addTravel} href="#" style={{ color: "#463527" }}>
//                                                                                                             Register a new traveler
//                                                                                                         </Link>
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             </>
//                                                                                         ) : (
//                                                                                             /* No travelers */
//                                                                                             <div
//                                                                                                 style={{
//                                                                                                     textAlign: "center",
//                                                                                                     padding: "30px 20px",
//                                                                                                     color: "#73615F",
//                                                                                                 }}
//                                                                                             >
//                                                                                                 <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>

//                                                                                                 <div
//                                                                                                     style={{
//                                                                                                         fontSize: "16px",
//                                                                                                         fontWeight: "500",
//                                                                                                         marginBottom: "8px",
//                                                                                                         color: "#463527",
//                                                                                                     }}
//                                                                                                 >
//                                                                                                     No travelers found
//                                                                                                 </div>

//                                                                                                 <Link href="/People" style={{
//                                                                                                     background: "#6B4F3F",
//                                                                                                     color: "white",
//                                                                                                     padding: "10px 20px",
//                                                                                                     width: "100%",
//                                                                                                     display: "block",
//                                                                                                     textAlign: "center",
//                                                                                                     cursor: "pointer",
//                                                                                                     textDecoration: "none",
//                                                                                                 }} >

//                                                                                                     Invite to Join

//                                                                                                 </Link>
//                                                                                             </div>
//                                                                                         )}
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="col-md-12">
//                                                                             {/* Show selected caretaker for this specific traveler */}
//                                                                             {row.caretaker &&
//                                                                                 userListData.length > 0 && userListData.filter(ele => ele.uid === row.caretaker).map((item, index) => (<div key={`selected-caretaker-${index}`} className="selected-caretaker-container">
//                                                                                     <div
//                                                                                         className="manager-list-full"
//                                                                                         style={{
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             border: "1px solid rgb(128 99 75 / 24%)",
//                                                                                             borderRadius: "0px",
//                                                                                             padding: "12px 16px",
//                                                                                             marginTop: "15px",
//                                                                                             width: "100%",
//                                                                                             gap: "4px"
//                                                                                         }}
//                                                                                     >
//                                                                                         <div style={{
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             flexWrap: "wrap",
//                                                                                             gap: "4px",
//                                                                                             flex: 1
//                                                                                         }}>
//                                                                                             <Image
//                                                                                                 src={item?.profile_image}
//                                                                                                 alt={item?.first_name}
//                                                                                                 width={48}
//                                                                                                 height={48}
//                                                                                                 style={{
//                                                                                                     borderRadius: "0px",
//                                                                                                     objectFit: "cover",
//                                                                                                     marginRight: "10px",
//                                                                                                 }}
//                                                                                             />
//                                                                                             <span style={{
//                                                                                                 fontWeight: 500,
//                                                                                                 fontSize: "14px",
//                                                                                                 color: "#463527"
//                                                                                             }}>
//                                                                                                 {item?.first_name} {""}
//                                                                                                 {item?.last_name}  {""}
//                                                                                                 <br />
//                                                                                                 <span style={{
//                                                                                                     fontWeight: 400,
//                                                                                                     fontSize: "12px",
//                                                                                                     color: "#73615F",
//                                                                                                     lineHeight: "10px"
//                                                                                                 }}>
//                                                                                                     Emp. id: {item?.employee_id}
//                                                                                                 </span>{" "}
//                                                                                                 <br />
//                                                                                                 <span style={{
//                                                                                                     fontWeight: 400,
//                                                                                                     fontSize: "12px",
//                                                                                                     color: "#73615F",
//                                                                                                     lineHeight: "10px"
//                                                                                                 }}>
//                                                                                                     Dept: {item?.segment}
//                                                                                                 </span>

//                                                                                                 {/* {cart.travelerDetails[travelerIndex].data.you && ( */}
//                                                                                                 <span style={{
//                                                                                                     fontWeight: 400,
//                                                                                                     fontSize: "12px",
//                                                                                                     color: "#73615F"
//                                                                                                 }}>
//                                                                                                     {/* (You) */} (You)
//                                                                                                 </span>
//                                                                                                 {/* )} */}
//                                                                                             </span>

//                                                                                             <span style={{ color: "#73615F" }}>|</span>

//                                                                                             <span style={{
//                                                                                                 display: "flex",
//                                                                                                 alignItems: "center",
//                                                                                                 color: "#463527",
//                                                                                                 fontSize: "14px",
//                                                                                                 gap: "5px"
//                                                                                             }}>
//                                                                                                 <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                                 {item?.phone_number}
//                                                                                             </span>

//                                                                                             <span style={{ color: "#73615F" }}>|</span>

//                                                                                             <span style={{
//                                                                                                 display: "flex",
//                                                                                                 alignItems: "center",
//                                                                                                 color: "#463527",
//                                                                                                 fontSize: "14px",
//                                                                                                 gap: "5px"
//                                                                                             }}>
//                                                                                                 <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                                 {item?.email}
//                                                                                             </span>

//                                                                                             <span style={{ color: "#73615F" }}>|</span>

//                                                                                             <span style={{
//                                                                                                 display: "flex",
//                                                                                                 alignItems: "center",
//                                                                                                 color: "#463527",
//                                                                                                 fontSize: "14px",
//                                                                                                 gap: "5px"
//                                                                                             }}>
//                                                                                                 <Image src="./images/icons/Genders.svg" alt="email" width={18} height={18} />
//                                                                                                 {item?.gender}
//                                                                                             </span>
//                                                                                         </div>

//                                                                                         <div className="show-edit-btn">
//                                                                                             <Button variant="" className="edit-btn ms-1 me-1">
//                                                                                                 Edit details
//                                                                                             </Button>
//                                                                                             <button
//                                                                                                 type="button"
//                                                                                                 className="ms-auto"
//                                                                                                 onClick={() => handleCaretakerSelect(index, "")}
//                                                                                                 style={{
//                                                                                                     background: "none",
//                                                                                                     border: "none",
//                                                                                                     color: "#6B4F3F",
//                                                                                                     fontSize: "14px",
//                                                                                                     cursor: "pointer",
//                                                                                                     flexShrink: 0,
//                                                                                                 }}
//                                                                                                 title="Remove"
//                                                                                             >
//                                                                                                 <Image
//                                                                                                     src="./images/icons/delete_b.svg"
//                                                                                                     alt="delete"
//                                                                                                     width={24}
//                                                                                                     height={24}
//                                                                                                 />
//                                                                                             </button>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>))}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             ))
//                                                         }
//                                                     </div>
//                                                 </>
//                                             )}
//                                         </React.Fragment>
//                                     );
//                                 })}
//                             </div>




//                             <p className='d-flex gap-2 fw-medium justify-content-end' >Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='rihgt-a' width={8} height={8} /> </p>


//                             <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                 <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                 <p className="text-secondary  mb-2">
//                                     This information helps in operational planning, legal compliance, and
//                                     personalized service.
//                                 </p>

//                                 <Form.Group className='mb-4 mt-4' controlid="arrival_time">
//                                     <Form.Label className="mb-2 fw-semibold">
//                                         Est. Time of Arrival In Individual House
//                                     </Form.Label>
//                                     <Select
//                                         name="aria-role-select"
//                                         onChange={(e) => updateArrivalDetails("arrival_time", e.value)}
//                                         options={timeOption}
//                                         placeholder="Select time"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />
//                                     {/* <input
//                                             type="time"
//                                             className="form-control"
//                                             value={formData.arrival_details.arrival_time}
//                                             onChange={(e) =>
//                                                 updateArrivalDetails("arrival_time", e.target.value)
//                                             }
//                                         /> */}
//                                 </Form.Group>


//                                 <Form.Group className='mb-4' controlid="mode_of_arrival">
//                                     <Form.Label className=" mb-2 fw-semibold">
//                                         Mode of Arrival
//                                     </Form.Label>

//                                     <Select
//                                         options={arrivalOption}
//                                         placeholder="Select Mode"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                         value={arrivalOption.find(
//                                             opt => opt.value === formData.arrival_details.mode_of_arrival
//                                         )}
//                                         onChange={(e) =>
//                                             updateArrivalDetails("mode_of_arrival", e.value)
//                                         }
//                                     />
//                                 </Form.Group>

//                                 <div className='mb-4 form-group' controlid="transport_number">
//                                     <Form.Label className=" mb-2 fw-semibold">
//                                         Flight / Train Number
//                                     </Form.Label>

//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Enter number e.g. MADGAON LTT EXP #11100"
//                                         value={formData.arrival_details.transport_number}
//                                         onChange={(e) =>
//                                             updateArrivalDetails("transport_number", e.target.value)
//                                         }
//                                     />
//                                 </div>
//                             </div>

//                             <hr></hr>

//                             <div className="arrival-section  mt-4 pt-4 ">
//                                 <h3 className="font-24 mb-2">Additional Comments</h3>
//                                 {/* <p className="text-secondary  mb-4">
//                                     This information helps validate the booking, allows us to link the reservation to the correct guest, and confirms details like room type, rate, and policies before providing services
//                                 </p> */}

//                                 <div className='mb-5 form-group' controlid="ref_number">
//                                     <Form.Label className=" mb-2 fw-semibold">
//                                         Rreference number
//                                     </Form.Label>

//                                     <input type="text" onChange={(e) => { setFormData({ ...formData, company_booking_reference: e?.target?.value }) }} placeholder='Reference number to be entered for your internal purpose (optional)' className='form-control' />
//                                 </div>

//                             </div>

//                             <hr></hr>

//                             <div className="arrival-section  mt-4 pt-3 mb-5">
//                                 <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                 <p className="text-secondary  mb-4">
//                                     Share any additional details or requests for this booking.
//                                 </p>

//                                 <div className='mb-4 form-group' >
//                                     <textarea className='form-control' onChange={(e) => { setFormData({ ...formData, additional_comments: e?.target?.value }) }} placeholder='Got any thoughts or questions? Add them here! (Optional)' ></textarea>
//                                 </div>
//                             </div>

//                             <hr ></hr>

//                             {/* <div className="confirmation-email-section mt-5 mb-5 pb-5">
//                                 <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking w-auto mb-3' style={{maxWidth:'360px'}} >
//                                     <input type="checkbox" className="mx-2 custom-checkbox" />
//                                     Send Booking Manager a Confirmation Email
//                                 </label>

//                                 <p className='fw-bold' >Add info</p>

//                                 <div className='form-group mb-4'>
//                                     <label>Email</label>
//                                     <div className='row d-flex gap-0'>
//                                         <div className='col-md-4'>
//                                         <input type='email' className='form-control' placeholder='Enter reciever email' />
//                                                     </div>
//                                                      <div className='col-md-1 d-flex align-items-center justify-center'>

//                                                     <Image 
//                                                     src='./images/icons/add_circle.svg'
//                                                     className='img-fluid'
//                                                     alt='plus'
//                                                     width={32}
//                                                     height={32}

//                                                     />
//                                                     </div>
//                                     </div>
//                                 </div>


//                                 <hr></hr>

//                                                      <p className='fw-bold' >Receiver 1</p>

//                                 <div className='form-group'>
//                                     <label>Email</label>
//                                     <div className='row d-flex gap-0'>
//                                         <div className='col-md-4'>
//                                         <input type='email' className='form-control' placeholder='Enter reciever email' />
//                                                     </div>
//                                                      <div className='col-md-1 d-flex align-items-center justify-center'>

//                                                     <Image 
//                                                     src='./images/icons/close-circle.svg'
//                                                     className='img-fluid'
//                                                     alt='plus'
//                                                     width={32}
//                                                     height={32}

//                                                     />
//                                                     </div>
//                                     </div>
//                                 </div>
//                             </div> */}

//                             <div className="confirmation-email-section my-5 pb-5">
//                                 {/* Checkbox Toggle */}
//                                 <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3'
//                                     style={{ maxWidth: '360px', cursor: 'pointer' }}>
//                                     <Form.Check
//                                         type="checkbox"
//                                         label="Send copy of confirmation email"
//                                         checked={formData.send_confirmation_email}
//                                         onChange={(e) => {
//                                             updateFormData("send_confirmation_email", e.target.checked); setIsEmailEnabled(e.target.checked); if (e.target.checked) { setReceivers([{ id: 1, email: '' }]) } else {
//                                                 setReceivers([])
//                                             }
//                                         }
//                                         }
//                                     />
//                                     {/* Send copy of confirmation email */}
//                                 </label>

//                                 {isEmailEnabled && (
//                                     <div className="email-content" style={{ paddingLeft: '0' }}>
//                                         <p className='fw-bold mb-3' style={{ color: '#6B4F3F' }}>Add info</p>

//                                         {/* Receivers List */}
//                                         {receivers.map((receiver, index) => (
//                                             <div key={receiver.id} className="receiver-item">
//                                                 {index > 0 && (
//                                                     <>
//                                                         <hr className="my-4" />
//                                                         <p className='fw-bold mb-3'>Receiver {index + 1}</p>
//                                                     </>
//                                                 )}

//                                                 <div className='form-group mb-4'>
//                                                     <label className="form-label fw-medium">Email</label>
//                                                     <div className='row align-items-center'>
//                                                         <div className='col-md-5'>
//                                                             <input
//                                                                 type='email'
//                                                                 className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
//                                                                 placeholder='Enter receiver email'
//                                                                 value={receiver.email}
//                                                                 onChange={(e) => handleEmailChange(receiver.id, e.target.value)}
//                                                             />
//                                                             {receiver.email && !isValidEmail(receiver.email) && (
//                                                                 <div className="invalid-feedback d-block">
//                                                                     Please enter a valid email address
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                         <div className='col-md-1 d-flex align-items-center justify-center'>
//                                                             {index === 0 ? (
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={handleAddReceiver}
//                                                                     className="btn btn-link p-0"
//                                                                     title="Add another receiver"
//                                                                     disabled={receivers?.length >= 5} // Limit to 5 receivers
//                                                                 >
//                                                                     <Image
//                                                                         src='./images/icons/add_circle.svg'
//                                                                         alt='Add receiver'
//                                                                         width={32}
//                                                                         height={32}
//                                                                         style={{
//                                                                             opacity: receivers?.length >= 5 ? 0.5 : 1
//                                                                         }}
//                                                                     />
//                                                                 </button>
//                                                             ) : (
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() => handleRemoveReceiver(receiver.id)}
//                                                                     className="btn btn-link p-0"
//                                                                     title="Remove receiver"
//                                                                 >
//                                                                     <Image
//                                                                         src='./images/icons/close-circle.svg'
//                                                                         alt='Remove receiver'
//                                                                         width={32}
//                                                                         height={32}
//                                                                     />
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}

//                                         {/* Receiver Limit Message */}
//                                         {receivers?.length >= 5 && (
//                                             <div className="alert alert-info mt-3">
//                                                 Maximum 5 receivers allowed
//                                             </div>
//                                         )}



//                                     </div>
//                                 )}
//                             </div>


//                         </Col>

//                         <Col md={4} className='ps-5' >
//                             <div className='booking-summary-colum'>
//                                 <div className="d-flex align-items-center justify-between mb-4">
//                                     <h4 className='font-24 mb-0' > Booking Summary</h4>
//                                     <label className='mb-0 d-flex gap-2 align-items-center' >
//                                         <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show  prices
//                                     </label>
//                                 </div>

//                                 <div className="booking-summary">


//                                     <div className="summary-details">
//                                         <div className="summary-row">
//                                             <span className="summary-label">BRs Selected</span>
//                                             <span className="summary-value">1</span>
//                                         </div>

//                                         <div className="summary-row">
//                                             <span className="summary-label">Number of Rooms</span>
//                                             <span className="summary-value">1 Room</span>
//                                         </div>

//                                         <div className="summary-row">
//                                             <span className="summary-label">Travelers</span>
//                                             <span className="summary-value">1 Adult</span>
//                                         </div>

//                                         <div className="summary-row detailed">
//                                             <span className="summary-label">Room 4 Pricing</span>
//                                             <div className="summary-value-detailed">
//                                                 <div className="price-desc">1 Guest x 4 nights</div>
//                                                 {showPrices && (
//                                                     <div className="price-amount">₹10,345.00</div>
//                                                 )}
//                                                 <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                             </div>
//                                         </div>

//                                         <div className="summary-row detailed">
//                                             <span className="summary-label">Taxes</span>
//                                             <div className="summary-value-detailed">
//                                                 {showPrices && (
//                                                     <div className="price-amount">₹5,345.00</div>
//                                                 )}
//                                                 <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                             </div>
//                                         </div>

//                                         <div className="total-section">
//                                             <span className="total-label">Total Price</span>
//                                             <div className="total-value-detailed">
//                                                 <div className="total-desc">1 Guest x 4 nights</div>
//                                                 {showPrices && (
//                                                     <div className="total-amount">₹15,690.00</div>
//                                                 )}
//                                                 <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <button onClick={handleSubmitReserve} className="confirm-btn">
//                                         Confirm and Reserve
//                                     </button>
//                                 </div>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div >



//             <Modal
//                 show={addTravels2}
//                 onHide={removeTravel2}
//                 animation={false}
//                 centered
//                 size="xl"
//                 className='custom-theme-modal-2'
//                 aria-labelledby="example-custom-modal-styling-title"
//             >

//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >

//                     <Modal.Title className='d-flex align-items-center gap-3'>
//                         Edit Stay Details
//                     </Modal.Title>

//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel2} />

//                 </Modal.Header>

//                 <Modal.Body className='pt-4 pb-4'>

//                     <div className='booking-filter '>
//                         <Row className='gap-0' >

//                             <Col md={2} className='gap-1' >
//                                 <div className='form-group'>
//                                     <label className='text-black' > Which company?</label>
//                                     <Select
//                                         name="aria-role-select"
//                                         options={companyList}
//                                         placeholder="Select company"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
//                                         onChange={option => { setSearchFieldData({ ...searchFieldData, company_id: option.value }) }}
//                                         styles={customStyles}
//                                     />
//                                 </div>
//                             </Col>

//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black' > Where to?</label>
//                                     <Select
//                                         name="aria-role-select"
//                                         options={cityList}
//                                         placeholder="Select city"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         getOptionLabel={(option) => option.city}
//                                         getOptionValue={(option) => option.city}
//                                         value={cityList?.find(c => c.city === searchFieldData.city) || null}
//                                         onChange={(option) =>
//                                             setSearchFieldData({ ...searchFieldData, city: option.city })
//                                         }
//                                         styles={customStyles}
//                                     />

//                                 </div>
//                             </Col>

//                             <Col md={4} className='gap-2' >
//                                 <div className='d-flex gap-0 '>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black' > Check-in date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_in_date}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
//                                             selectsStart
//                                             minDate={new Date()}
//                                             startDate={new Date()}
//                                             className="form-control  custom-date-picker"
//                                             dateFormat="dd/MM/yyyy"
//                                             placeholderText='dd/MM/yyyy'
//                                         />

//                                     </div>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black' > Checkout date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_out_date ? searchFieldData.check_out_date : searchFieldData.check_in_date}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
//                                             selectsEnd
//                                             startDate={searchFieldData.check_in_date}
//                                             endDate={searchFieldData?.check_out_date ? searchFieldData?.check_out_date : new Date()}
//                                             minDate={new Date()}
//                                             className="form-control  custom-date-picker"
//                                             dateFormat="dd/MM/yyyy"
//                                             placeholderText='dd/MM/yyyy'
//                                         />
//                                     </div>
//                                 </div>
//                             </Col>

//                             <Col md={4} className='gap-1 '>
//                                 <Row>
//                                     <Col md={7}>
//                                         <div className='form-group'>
//                                             <label className='text-black'>No. of Rooms & Guests</label>
//                                             <div
//                                                 className="react_selectbox custom-dropdown"
//                                                 onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
//                                             >
//                                                 <div className="selected-value">
//                                                     {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`}
//                                                 </div>
//                                                 {isRoomDropdownOpen && (
//                                                     <div className="room-dropdown-content">
//                                                         {rooms.map((room) => (
//                                                             <div key={room.id} className="room-section">
//                                                                 <div className="d-flex justify-content-between align-items-center">
//                                                                     <div className="room-header">Room {room.id}</div>
//                                                                     {rooms.length > 1 && (
//                                                                         <button
//                                                                             className="delete-room-btn"
//                                                                             onClick={(e) => {
//                                                                                 e.stopPropagation();
//                                                                                 deleteRoom(room.id);
//                                                                             }}
//                                                                         >

//                                                                             <Image src='./images/icons/delete_b.svg' width={20} height={20} alt="delete" />
//                                                                         </button>
//                                                                     )}
//                                                                 </div>
//                                                                 <div className="guest-counter">
//                                                                     <label>Adults</label>
//                                                                     <div className="counter-controls">
//                                                                         <button
//                                                                             className="counter-btn"
//                                                                             onClick={(e) => {
//                                                                                 e.stopPropagation();
//                                                                                 handleAdultChange(room.id, -1);
//                                                                             }}
//                                                                         >
//                                                                             -
//                                                                         </button>
//                                                                         <span>{room.adults}</span>
//                                                                         <button
//                                                                             className="counter-btn"
//                                                                             onClick={(e) => {
//                                                                                 e.stopPropagation();
//                                                                                 handleAdultChange(room.id, 1);
//                                                                             }}
//                                                                         >
//                                                                             +
//                                                                         </button>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         ))}

//                                                         <div className="d-flex align-items-center justify-between">
//                                                             <button
//                                                                 className="add-room-btn"
//                                                                 onClick={(e) => {
//                                                                     e.stopPropagation();
//                                                                     addRoom();
//                                                                 }}
//                                                             >
//                                                                 <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' width={24} height={24} />   Add a room
//                                                             </button>
//                                                             <button
//                                                                 className="done-btn"
//                                                                 onClick={(e) => {
//                                                                     e.stopPropagation();
//                                                                     setIsRoomDropdownOpen(false);
//                                                                     setSearchFieldData({
//                                                                         ...searchFieldData,
//                                                                         rooms: rooms.map(item => ({ adults: item.adults }))
//                                                                     })
//                                                                 }}
//                                                             >
//                                                                 Done
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </Col>

//                                     <Col md={5}>
//                                         <div className='form-group h-100 align-items-center d-flex pt-1'>

//                                             <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', textAlign: 'center', borderRadius: '0', color: '#fff' }} variant='' onClick={handleUpdateSearch}> Update Search </Button>

//                                         </div>
//                                     </Col>
//                                 </Row>

//                             </Col>
//                         </Row>
//                     </div>

//                 </Modal.Body>
//             </Modal>



//             {/*  */}


//             <AddPersonModel
//                 addTravels={addTravels}
//                 removeTravel={removeTravel}
//             />



//             {/*  */}



//             <Modal
//                 show={addBreakdowns}
//                 onHide={removeBreakdown}
//                 animation={false}
//                 centered
//                 size="md"
//                 className='custom-theme-modal-2 status-height-70'
//                 aria-labelledby="example-custom-modal-styling-title"
//             >

//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>

//                     <Modal.Title className='d-flex align-items-center gap-3' style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>

//                         Total Price breakdown

//                     </Modal.Title>

//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />

//                 </Modal.Header>

//                 <Modal.Body className='pt-4 pb-4'>

//                     <div className='booking-filter '>
//                         <div className='d-flex justify-between  pb-2'>
//                             <span>1 room x 1 guest x 4 nights</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }} >₹4,45,440.00</span>
//                         </div>

//                         <div className='d-flex justify-between  pt-2 pb-2'>
//                             <span>CasaMelhor Service fee</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }} >₹5,440.00</span>
//                         </div>

//                         <div className='d-flex justify-between  pt-2 pb-2'>
//                             <span>Taxes</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }} >₹45,000.00</span>
//                         </div>

//                     </div>

//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <span className='fs-20'>Taxes</span>
//                     <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }} >₹8,70,345.00</span>
//                 </Modal.Footer>

//             </Modal>



//             {/* Reserve  */}

//             <Modal
//                 show={addReserves}
//                 onHide={removeReserve}
//                 animation={false}
//                 centered
//                 size=""
//                 className='custom-theme-modal-2 modal-460'
//                 aria-labelledby="example-custom-modal-styling-title"
//             >
//                 <Modal.Body className="pt-4 pb-4">
//                     {bookingConfirmedData?.length > 0 && (
//                         <div className="flex items-center justify-center gap-6">

//                             {/* Prev Button */}
//                             <button
//                                 onClick={() =>
//                                     setCurrent(
//                                         (current - 1 + bookingConfirmedData.length) %
//                                         bookingConfirmedData.length
//                                     )
//                                 }
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none"
//                             >
//                                 ‹
//                             </button>

//                             {/* Content */}
//                             <div className="text-center min-w-[260px]">
//                                 <p className="text-base font-medium mb-1">
//                                     The booking has been confirmed and updated
//                                 </p>

//                                 <p className="flex items-center justify-center gap-2 text-sm mb-2">
//                                     Booking ID:{" "}
//                                     <span className="font-semibold text-gray-700">
//                                         {bookingConfirmedData[current]?.booking_number}
//                                     </span>
//                                     <Image
//                                         src="./images/icons/content_copy.svg"
//                                         alt="copy"
//                                         width={16}
//                                         height={16}
//                                         className="cursor-pointer"
//                                         onClick={() =>
//                                             navigator.clipboard.writeText(
//                                                 bookingConfirmedData[current]?.booking_number
//                                             )
//                                         }
//                                     />
//                                 </p>

//                                 {/* Dots */}
//                                 <div className="flex justify-center gap-1 mt-2">
//                                     {bookingConfirmedData.map((_, i) => (
//                                         <span
//                                             key={i}
//                                             className={`w-[6px] h-[6px] rounded-full transition-all ${current === i ? "bg-black" : "bg-gray-300"
//                                                 }`}
//                                         ></span>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Next Button */}
//                             <button
//                                 onClick={() =>
//                                     setCurrent((current + 1) % bookingConfirmedData.length)
//                                 }
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none"
//                             >
//                                 ›
//                             </button>
//                         </div>
//                     )}
//                 </Modal.Body>



//                 <Modal.Footer className='d-flex align-items-center justify-content-between flex-col'>
//                     <Link
//                         href={`/BookingDetails/${bookingConfirmedData[current]?.uid}`}
//                         className="p-2 w-100 text-center d-flex align-items-center justify-content-center"
//                         style={{
//                             background: "#2C734A",
//                             borderRadius: "0",
//                             color: "#fff",
//                             minHeight: "58px",
//                             textDecoration: "none"
//                         }}
//                     >
//                         View Booking Details
//                     </Link>

//                     <Link
//                         href="/CreateBooking"
//                         className="text-center justify-center edit-btn w-100 d-flex align-items-center justify-content-center"
//                         style={{
//                             minHeight: "58px",
//                             textDecoration: "none"
//                         }}
//                     >
//                         Create Another Booking
//                     </Link>
//                 </Modal.Footer>







//             </Modal>


//         </>
//     )
// }



// "use client"
// import React, { useState, useEffect, useRef } from 'react'
// import Header from '../Header/Header'
// import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form, Accordion, Label } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { components } from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import { UserListAPI, validateGender, CreateBookingPost, companyListAPI, PropertyListFullApi } from '@/services/provider';
// import { alert_danger, alert_info, alert_success } from '@/utils/Alerts/TostifyAlerts';
// import { calculateNights, convertTo24Hour, formatDateMonthYear, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
// import { ToastContainer } from 'react-toastify';
// import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
// import toast, { Toaster } from 'react-hot-toast';

// export default function MultiSwitchReserve() {

//     const router = useRouter();

//     const lastValidatedRef = useRef({});
//     const timeOption = generateTimeOptions12Format(30);

//     // FIX 1: reserveBookingData is an object (not array) with { segments, total_price, type, ... }
//     const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));

//     const [userListData, setUserListData] = useState([]);
//     const [current, setCurrent] = useState(0);

//     // FIX 2: bookingData holds the full reserveBookingData object (not array)
//     const [bookingData, setBookingData] = useState(null);
//     const [filtereduserListData, setFilteredUserListData] = useState([]);
//     const [lastUpdatedIndex, setLastUpdatedIndex] = useState(null);

//     const goToResult = () => {
//         setTimeout(() => {
//             router.push('/MultiRoomsGuestResult');
//         }, 100);
//     };

//     // FIX 3: bedroomPreference - API response has no bedroom_preference_badge at top level segments
//     // It may come from individual segment or room details; default to null if not present
//     const bedroomPreference = reserveBookingData?.bedroom_preference_badge || null;

//     // FIX 4: adultCount — API response doesn't have adultCount; derive from searchBookingData or default to 1
//     const adultCount = searchBookingData?.rooms?.[0]?.adults || 1;

//     const [formData, setFormData] = useState({
//         company_id: 2,
//         caretakers: "",
//         traveler_assignments: [],
//         arrival_details: {
//             arrival_time: "",
//             mode_of_arrival: "",
//             transport_number: ""
//         },
//         send_confirmation_email: false,
//         additional_comments: "",
//         company_booking_reference: "",
//     });

//     const [travellers, setTravellers] = useState([]);

//     const handleCaretakerSelect = (rowIndex, userId) => {
//         if (rowIndex === "") {
//             setFormData({ ...formData, caretakers: userId });
//             setShowCaretakerList(false);
//             return;
//         }
//         setTravellers(prev =>
//             prev.map((item, i) =>
//                 i === rowIndex
//                     ? {
//                         ...item,
//                         caretaker: userId,
//                         searchText: userListData.find(u => u.uid === userId)?.first_name || "",
//                         showList: false
//                     }
//                     : item
//             )
//         );
//         setLastUpdatedIndex(rowIndex);
//     };

//     const handleTravellerTypeChange = (rowIndex, selected) => {
//         setTravellers(prev => {
//             const updated = [...prev];
//             if (!updated[rowIndex]) return prev;
//             updated[rowIndex] = {
//                 ...updated[rowIndex],
//                 traveller_type: selected,
//                 filteredUsers: userListData.filter(
//                     user => user?.user_role?.role_name === selected
//                 ),
//             };
//             return updated;
//         });
//     };

//     const [showPrices, setShowPrices] = useState(false);
//     const [selectedAdult, setSelectedAdult] = useState(adultCount);

//     const [addTravels, addTravelsetShow] = useState(false);
//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);

//     const [addBreakdowns, addBreakdownsetShow] = useState(false);
//     const removeBreakdown = () => addBreakdownsetShow(false);
//     const addbreakdown = () => addBreakdownsetShow(true);

//     const [addReserves, addReservesetShow] = useState(false);
//     const removeReserve = () => addReservesetShow(false);
//     const addReserve = () => addReservesetShow(true);

//     const [addTravels2, addTravel2setShow] = useState(false);
//     const removeTravel2 = () => addTravel2setShow(false);
//     const addTravel2 = () => addTravel2setShow(true);

//     const updateFormData = (key, value) => {
//         setFormData(prev => ({ ...prev, [key]: value }));
//     };

//     const updateArrivalDetails = (key, value) => {
//         setFormData(prev => ({
//             ...prev,
//             arrival_details: {
//                 ...prev.arrival_details,
//                 [key]: key === "arrival_time" ? convertTo24Hour(value) : value
//             }
//         }));
//     };

//     // FIX 5: Initialize bookingData and travellers correctly from the object structure
//     useEffect(() => {
//         if (reserveBookingData) {
//             setBookingData(reserveBookingData);
//             const count = adultCount;
//             setTravellers(
//                 Array.from({ length: count }, () => ({
//                     traveller_type: null,
//                     isGenderValidation: "",
//                     caretaker: null,
//                     searchText: "",
//                     showList: false,
//                     filteredUsers: [],
//                     selectedBedIndex: null
//                 }))
//             );
//         }
//     }, []);

//     const CompanyOption = [
//         { value: "casamelhor", label: "Casamelhor" },
//         { value: "schlumberger", label: "Schlumberger" },
//         { value: "delhivery", label: "Delhivery" },
//         { value: "picus-Capital", label: "Picus Capital" },
//         { value: "gps-Renewables", label: "GPS Renewables" },
//     ];

//     const travelOption = [
//         { value: "Company Booking Manager", label: "Company employee", icon: "../images/icons/hail.svg" },
//         { value: "External", label: "External", icon: "../images/icons/short_stay.svg" },
//     ];

//     const CustomOption = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
//                     <span>{props.data.label}</span>
//                 </div>
//                 {props.isSelected && <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>}
//             </div>
//         </components.Option>
//     );

//     const CustomSingleValue = (props) => (
//         <components.SingleValue {...props}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
//                 <span>{props.data.label}</span>
//             </div>
//         </components.SingleValue>
//     );

//     const handleSelectDropdown = (e, name) => {
//         const { value } = e;
//         if (name === "traveller_type") {
//             if (value === "External") {
//                 const updatedForm = { ...formData, traveller_type: value };
//                 delete updatedForm.segment;
//                 delete updatedForm.designation;
//                 delete updatedForm.employee_grade;
//                 delete updatedForm.account_unit;
//                 delete updatedForm.account_code;
//                 delete updatedForm.employee_id;
//                 setFormData(updatedForm);
//             } else {
//                 setFormData(prev => ({
//                     ...prev,
//                     traveller_type: value,
//                     segment: "",
//                     designation: "",
//                     employee_grade: "",
//                     account_unit: "",
//                     account_code: "",
//                     employee_id: ""
//                 }));
//             }
//         }
//     };

//     const arrivalOption = [
//         { value: "Flight", label: "Flight" },
//         { value: "Train", label: "Train" }
//     ];

//     const CityOption = [
//         { value: "gurugram", label: "Gurugram" },
//         { value: "mumbai", label: "Mumbai" },
//         { value: "navi-mumbai", label: "Navi Mumbai" },
//         { value: "kakinada", label: "Kakinada" },
//         { value: "Bokaro", label: "Bokaro" },
//         { value: "ahmedabad", label: "Ahmedabad" },
//     ];

//     const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

//     const handleAdultChange = (roomId, change) => {
//         setRooms(rooms.map(room => {
//             if (room.id === roomId) {
//                 const newValue = room.adults + change;
//                 return { ...room, adults: newValue >= 1 ? newValue : 1 };
//             }
//             return room;
//         }));
//     };

//     const addRoom = () => {
//         const newRoomId = rooms.length + 1;
//         setRooms([...rooms, { id: newRoomId, adults: 1 }]);
//     };

//     const deleteRoom = (roomId) => {
//         if (rooms.length > 1) {
//             setRooms(rooms.filter(room => room.id !== roomId));
//         }
//     };

//     const customStyles = {
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected ? "#4635271F" : state.isFocused ? "#4635271F" : "inherit",
//             color: state.isSelected ? "#000" : "black",
//             cursor: "pointer",
//         }),
//     };

//     const [showCaretakerList, setShowCaretakerList] = useState(null);
//     const [chooseBeds, setChooseBeds] = useState([]);
//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([]);
//     const [bookingConfirmedData, setBookingConfirmedData] = useState([]);

//     const handleAddReceiver = () => {
//         const newReceiver = { id: Date.now(), email: '' };
//         setReceivers([...receivers, newReceiver]);
//     };

//     const handleRemoveReceiver = (id) => {
//         if (receivers.length > 1) {
//             setReceivers(receivers.filter(receiver => receiver.id !== id));
//         }
//     };

//     const handleEmailChange = (id, email) => {
//         setReceivers(receivers.map(receiver =>
//             receiver.id === id ? { ...receiver, email } : receiver
//         ));
//     };

//     const isValidEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const getUserListData = async () => {
//         try {
//             const response = await UserListAPI("All");
//             if (response?.data?.success) {
//                 setUserListData(response.data.response);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         // FIX 6: chooseBeds should come from segment bed data if available
//         // Since API response segments don't have beds array, initialize empty
//         setChooseBeds([]);
//         getUserListData();
//     }, []);

//     // FIX 7: Filter users based on traveller_type in formData (for Private rooms)
//     useEffect(() => {
//         if (!formData?.traveller_type) {
//             setFilteredUserListData([]);
//             return;
//         }

//         const filteredData = userListData
//             ?.filter(user => {
//                 const roleName = user.user_role?.role_name;
//                 let travellerAllowed = false;

//                 if (formData.traveller_type === "External") {
//                     travellerAllowed = roleName === "External";
//                 } else {
//                     travellerAllowed =
//                         roleName !== "External" &&
//                         user?.user_company?.id === bacisSearchDetails?.company_id;
//                 }

//                 if (!travellerAllowed) return false;

//                 if (bedroomPreference === "FEMALE PREFERRED") return user.gender === "Female";
//                 if (bedroomPreference === "MALE PREFERRED") return user.gender === "Male";

//                 return true;
//             })
//             .map(user => ({
//                 value: user.uid,
//                 label: `${user.first_name} ${user.last_name}`,
//                 gender: user.gender
//             }));

//         setFilteredUserListData(filteredData);
//     }, [formData.traveller_type, userListData, bedroomPreference]);

//     const formatDate = (dateTime) => {
//         const date = new Date(dateTime);
//         return date.toLocaleDateString("en-IN", {
//             weekday: "short",
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     const formatTime = (dateTime) => {
//         const date = new Date(dateTime);
//         return date.toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//         });
//     };

//     const formatStayDates = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);
//         const options = { weekday: "short", day: "numeric", month: "short" };
//         const startFormatted = start.toLocaleDateString("en-US", options);
//         const endFormatted = end.toLocaleDateString("en-US", options);
//         const year = end.getFullYear();
//         const diffTime = end - start;
//         const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));
//         return `${startFormatted} - ${endFormatted}, ${year}, ${nights} night${nights > 1 ? "s" : ""}`;
//     };

//     // FIX 8: Gender validation — iterate over segments correctly
//     useEffect(() => {
//         if (lastUpdatedIndex === null) return;

//         const updatedTraveller = travellers[lastUpdatedIndex];
//         if (!updatedTraveller?.caretaker) return;

//         if (lastValidatedRef.current[lastUpdatedIndex] === updatedTraveller.caretaker) return;

//         const getDateOnly = (dateTime) => dateTime?.split("T")[0];

//         const checkGenderValid = async (segment) => {
//             try {
//                 const payload = {
//                     room_uid: segment?.room_uid,
//                     traveler_uid: updatedTraveller.caretaker,
//                     check_in_date: getDateOnly(segment?.check_in_datetime),
//                     check_out_date: getDateOnly(segment?.check_out_datetime),
//                     bed_index: lastUpdatedIndex,
//                 };

//                 const response = await validateGender(payload);
//                 lastValidatedRef.current[lastUpdatedIndex] = updatedTraveller.caretaker;

//                 setTravellers(prev =>
//                     prev.map((item, i) =>
//                         i === lastUpdatedIndex
//                             ? { ...item, isGenderValidation: response.data.response.valid ? "Success" : "Error" }
//                             : item
//                     )
//                 );
//                 if (response.data.response.valid) {
//                     toast.success("Gender Validated Successfully");
//                 }
//             } catch (error) {
//                 console.error("Submission error:", error);
//                 toast.error("Failed to do validation");
//             }
//         };

//         // FIX 9: bookingData is the full object; segments is the array
//         bookingData?.segments?.forEach(segment => checkGenderValid(segment));

//     }, [lastUpdatedIndex]);

//     useEffect(() => {
//         if (formData.caretakers === "") return;
//         const getDateOnly = (dateTime) => dateTime?.split("T")[0];

//         const checkGenderValid = async (segment) => {
//             try {
//                 const payload = {
//                     room_uid: segment?.room_uid,
//                     traveler_uid: formData.caretakers,
//                     check_in_date: getDateOnly(segment?.check_in_datetime),
//                     check_out_date: getDateOnly(segment?.check_out_datetime),
//                     bed_index: 0,
//                 };
//                 const response = await validateGender(payload);
//                 if (response.data.response.valid) {
//                     toast.success("Gender Validated Successfully");
//                 }
//             } catch (error) {
//                 console.error("Submission error:", error);
//                 toast.error("Failed to do validation");
//             }
//         };

//         bookingData?.segments?.forEach(segment => checkGenderValid(segment));
//     }, [formData.caretakers]);

//     const [searchFieldData, setSearchFieldData] = useState({
//         company_id: 0,
//         city: "",
//         check_in_date: "",
//         check_out_date: "",
//         rooms: [],
//         is_available: true
//     });

//     const handleUpdateSearch = () => {
//         removeItemLocalStorage("reserveRoom");
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
//         router.push("./Searchresult");
//     };

//     const [companyList, setCompanyList] = useState([]);
//     const [cityList, setCityList] = useState([]);

//     const getProprtyList = async () => {
//         try {
//             const response = await PropertyListFullApi();
//             if (response?.data?.success) {
//                 const uniqueCities = [
//                     { city: "Jaipur" },
//                     ...Array.from(
//                         new Set(response.data.response.map(ele => ele.city)),
//                         city => ({ city })
//                     ).filter(item => item.city !== "Jaipur")
//                 ];
//                 setCityList(uniqueCities);
//             }
//         } catch (error) {
//             console.log("Property API Error: ", error);
//         }
//     };

//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 const list = response.data.response.map(item => ({
//                     value: item.id,
//                     label: item.company_name
//                 }));
//                 setCompanyList(list);
//             }
//         } catch (error) {
//             console.log("Company API Error: ", error);
//         }
//     };

//     useEffect(() => {
//         getCompanyList();
//         getProprtyList();
//         if (bacisSearchDetails) {
//             setSearchFieldData({
//                 company_id: bacisSearchDetails.company_id,
//                 city: bacisSearchDetails.city,
//                 check_in_date: bacisSearchDetails.check_in_date,
//                 check_out_date: bacisSearchDetails.check_out_date,
//                 is_available: bacisSearchDetails.is_available,
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
//             });
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })));
//         }
//     }, []);

//     // FIX 10: handleSubmitReserve — use bookingData.segments properly
//     const handleSubmitReserve = async () => {
//         const getDateOnly = (dateTime) => dateTime?.split("T")[0];
//         try {
//             // FIX 11: Determine room type from first segment (consistent source)
//             const firstSegmentRoomType = bookingData?.segments?.[0]?.room_type;
//             const isPrivate = firstSegmentRoomType === "Private";

//             // Build cart items from all segments
//             let cartItem = bookingData?.segments?.map((segment, idx) => ({
//                 property_uid: segment?.property_uid,
//                 room_uid: segment?.room_uid,
//                 bed_index: isPrivate ? null : (travellers[0]?.selectedBedIndex ?? null),
//                 check_in_date: getDateOnly(segment?.check_in_datetime),
//                 check_out_date: getDateOnly(segment?.check_out_datetime),
//             }));

//             // FIX 12: traveler_assignments — one traveler assigned across all cart items
//             let travelerAssignments = [];
//             if (isPrivate) {
//                 cartItem.forEach((_, idx) => {
//                     travelerAssignments.push({
//                         cart_item_index: idx,
//                         traveler_id: formData.caretakers,
//                         is_exclusive_booking: false
//                     });
//                 });
//             } else {
//                 travellers.forEach((row, index) => {
//                     cartItem.forEach((_, segIdx) => {
//                         travelerAssignments.push({
//                             cart_item_index: segIdx,
//                             traveler_id: row.caretaker,
//                             is_exclusive_booking: false
//                         });
//                     });
//                 });
//             }

//             const payload = {
//                 company_id: searchBookingData?.company_id,
//                 cart_items: cartItem,
//                 traveler_assignments: travelerAssignments,
//                 arrival_details: {
//                     ...formData.arrival_details,
//                     arrival_date: getDateOnly(bookingData?.segments?.[0]?.check_in_datetime),
//                 },
//                 additional_comments: formData.additional_comments,
//                 company_booking_reference: formData.company_booking_reference,
//                 send_confirmation_email: formData.send_confirmation_email,
//                 additional_email_recipients: receivers.map(r => r.email)
//             };

//             const response = await CreateBookingPost(payload);
//             if (response.data.success) {
//                 setBookingConfirmedData(response.data.response.bookings);
//                 addReserve();
//                 toast.success("Booking Created Successfully");
//                 removeItemLocalStorage("reserveRoom");
//                 removeItemLocalStorage("searchParam");
//                 removeItemLocalStorage("basicSecrchItemObj");
//             } else {
//                 response.data.response.validation_errors.forEach(element => {
//                     toast.error(element.error);
//                 });
//             }
//         } catch (error) {
//             console.error("Submission error:", error);
//             toast.error("Failed to create booking");
//         }
//     };

//     // FIX 13: Derive summary values from bookingData.segments
//     const totalNights = bookingData?.total_nights || 0;
//     const totalPrice = bookingData?.total_price || 0;
//     const numSegments = bookingData?.segments?.length || 0;

//     // FIX 14: Header display — derive from searchBookingData / bacisSearchDetails
//     const headerCompany = bacisSearchDetails?.company_name || "Company";
//     const headerCity = bacisSearchDetails?.city || "City";
//     const headerStay = (bookingData?.segments?.length > 0)
//         ? `${formatDate(bookingData.segments[0].check_in_datetime)} - ${formatDate(bookingData.segments[bookingData.segments.length - 1].check_out_datetime)}, ${totalNights} nights`
//         : "";
//     const headerGuests = `1 room for ${adultCount} guest${adultCount > 1 ? "s" : ""}`;

//     return (
//         <>
//             <Header />
//             <Toaster position="top-right" />
//             <div className='searching-result-top'>
//                 <Container>
//                     <div className='search-result-header'>
//                         {/* FIX 15: Display dynamic header from actual search/booking data */}
//                         <h4>{headerCompany} | {headerCity}</h4>
//                         <p className='mb-0'>
//                             <Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />
//                             {headerStay} |
//                             <Image src='./images/icons/group.svg' alt='group' className="img-fluid" width={24} height={24} />
//                             {headerGuests}
//                         </p>
//                         <Button variant='' onClick={addTravel2} className='edit-details'>Edit Stay Details</Button>
//                     </div>
//                 </Container>
//             </div>

//             <div className='search-result-data'>
//                 <Container>
//                     <Row className='justify-content-between'>

//                         <Col md={12}>
//                             <h4 className='page-title mb-5'>Add Guests & Reserve Your Booking</h4>
//                         </Col>

//                         <Col md={8}>
//                             {/* FIX 16: Show count of BRs from segments length */}
//                             <h4 className='font-24 mb-4'>Review Your Selected BRs ({numSegments})</h4>

//                             <div className="booking-card border bg-white p-3 mb-4">
//                                 {/* FIX 17: Iterate over bookingData?.segments (object structure, not array index) */}
//                                 {bookingData?.segments?.map((segment, index) => {
//                                     const isLast = index === bookingData.segments.length - 1;
//                                     const nextSegment = bookingData.segments[index + 1];

//                                     return (
//                                         <React.Fragment key={segment.segment_id}>

//                                             {/* ROOM CARD */}
//                                             <Row>
//                                                 <Col md={4}>
//                                                     <Image
//                                                         src={
//                                                             segment.property_cover_photo
//                                                                 ? `https://alicedevapi.casamelhor.in${segment.property_cover_photo}`
//                                                                 : segment.cover_photo
//                                                                     ? `https://alicedevapi.casamelhor.in${segment.cover_photo}`
//                                                                     : "/images/no-image.png"
//                                                         }
//                                                         alt={segment.room_name}
//                                                         width={300}
//                                                         height={200}
//                                                         className="img-fluid"
//                                                     />
//                                                 </Col>

//                                                 <Col md={8}>
//                                                     <p className="fw-semibold fs-20 mb-2 room-title">
//                                                         <span className="fs-20">
//                                                             {segment.nights} night stay in {segment.room_name}
//                                                         </span>
//                                                         <span className="room-type-badge ms-2">
//                                                             {segment.room_type}
//                                                         </span>
//                                                     </p>
//                                                     <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                         <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} />
//                                                         {segment.property_name}
//                                                     </p>
//                                                 </Col>
//                                             </Row>

//                                             {/* CHECK-IN / CHECK-OUT */}
//                                             <Row className="mt-3 mb-3">
//                                                 <Col md={3}>
//                                                     <p className="mb-1 text-secondary small">Check-in:</p>
//                                                     <p className="fw-semibold mb-0">{formatDate(segment.check_in_datetime)}</p>
//                                                     <small>{formatTime(segment.check_in_datetime)}</small>
//                                                 </Col>
//                                                 <Col md={3}>
//                                                     <p className="mb-1 text-secondary small">Check-out:</p>
//                                                     <p className="fw-semibold mb-0">{formatDate(segment.check_out_datetime)}</p>
//                                                     <small>{formatTime(segment.check_out_datetime)}</small>
//                                                 </Col>
//                                             </Row>

//                                             {/* ROOM DETAILS */}
//                                             <div className="border-top pt-3">
//                                                 <p className="mb-1 font-18">Room details</p>
//                                                 <div className="room-specs d-flex gap-3 mb-2">
//                                                     <span className="spec-item d-flex gap-2">
//                                                         <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps 2
//                                                     </span> |
//                                                     <span className="spec-item d-flex gap-2">
//                                                         <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" /> 1 king bed
//                                                     </span> |
//                                                     <span className="spec-item d-flex gap-2">538 sq ft</span>
//                                                 </div>
//                                                 {/* FIX 18: Show bedroom_preference_badge if present on segment */}
//                                                 {segment?.bedroom_preference_badge && (
//                                                     <div className="room-specs d-flex gap-3 mb-2">
//                                                         <span className='female-booked'>{segment.bedroom_preference_badge}</span>
//                                                     </div>
//                                                 )}
//                                                 <hr />
//                                             </div>

//                                             {/* FIX 19: Property/Room change block between segments */}
//                                             {!isLast && (
//                                                 <div className="room-change-info d-flex gap-2 align-items-center mb-3 mt-3 pb-3 border-bottom">
//                                                     <Image src="./images/icons/switch-pro-vertical.svg" alt="switch" width={24} height={100} />
//                                                     <div>
//                                                         <p className="fs-20 mb-0" style={{ color: "#a6a6a6" }}>
//                                                             {/* FIX 20: Use bookingData.type to determine label */}
//                                                             {bookingData?.type === "mixed_room" ? "Room" : "Property"} change on
//                                                         </p>
//                                                         <p className="mb-0" style={{ color: "#a6a6a6" }}>
//                                                             {formatDate(nextSegment.check_in_datetime)}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             {/* TRAVELER SECTION ONLY ON LAST SEGMENT */}
//                                             {isLast && (
//                                                 <div className="traveler-section">
//                                                     <p className="mb-2 font-18">Travelers in this room</p>

//                                                     {/* FIX 21: Adult count radio buttons — use adultCount from searchBookingData */}
//                                                     <div className="d-flex gap-3 mb-3">
//                                                         {Array.from(
//                                                             { length: Math.max(adultCount, 2) },
//                                                             (_, i) => {
//                                                                 const count = i + 1;
//                                                                 return (
//                                                                     <div key={count} className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }}>
//                                                                         <label className="form-check-label d-flex gap-2 mb-0">
//                                                                             <input
//                                                                                 type="radio"
//                                                                                 name='adult-count'
//                                                                                 checked={selectedAdult === count}
//                                                                                 onChange={() => {
//                                                                                     setSelectedAdult(count);
//                                                                                     setTravellers(
//                                                                                         Array.from({ length: count }, () => ({
//                                                                                             traveller_type: null,
//                                                                                             isGenderValidation: "",
//                                                                                             caretaker: null,
//                                                                                             searchText: "",
//                                                                                             showList: false,
//                                                                                             filteredUsers: [],
//                                                                                             selectedBedIndex: null
//                                                                                         }))
//                                                                                     );
//                                                                                 }}
//                                                                             />
//                                                                             <span className="radio-checkmark"></span>
//                                                                             {count} Adult{count > 1 ? "s" : ""}
//                                                                         </label>
//                                                                     </div>
//                                                                 );
//                                                             }
//                                                         )}
//                                                     </div>

//                                                     <hr />

//                                                     {/* Exclusive booking checkbox */}
//                                                     <Row className='mb-3'>
//                                                         <Col md={5}>
//                                                             <label className="mb-0 d-flex gap-2 align-items-center show-my-booking">
//                                                                 <input className="mx-2 custom-checkbox" type="checkbox" />
//                                                                 Exclusively book this room for the traveler
//                                                             </label>
//                                                         </Col>
//                                                     </Row>

//                                                     {/* Info banners */}
//                                                     {segment?.room_type === "Twin-Sharing" && (
//                                                         <Row className='mb-2'>
//                                                             <Col md={6}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                     Since this is a twin bed, one will be available for booking unless you specify it for exclusive use.
//                                                                 </p>
//                                                             </Col>
//                                                         </Row>
//                                                     )}

//                                                     <p className="mb-2 font-18">Traveler details</p>
//                                                     <p className='small'>We'll use this information to book. Make sure the name matches what is on the traveler's passport or ID.</p>

//                                                     {bedroomPreference && (
//                                                         <Row className='mb-2'>
//                                                             <Col md={7}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                     As this room has already been booked for a {bedroomPreference.toLowerCase().replace(" preferred", "")}, only {bedroomPreference.toLowerCase().replace(" preferred", "")} traveler bookings are allowed
//                                                                 </p>
//                                                             </Col>
//                                                         </Row>
//                                                     )}

//                                                     {/* FIX 22: Check room_type from segment (not from removed rooms[0]) */}
//                                                     {segment?.room_type === "Private" ? (
//                                                         <div className='property-list-2'>
//                                                             <div className="row">
//                                                                 <div className="col-md-4">
//                                                                     <Select
//                                                                         name="traveller_type"
//                                                                         options={travelOption}
//                                                                         placeholder="Choose Role"
//                                                                         className='react_selectbox'
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                     />
//                                                                 </div>
//                                                                 <div className="col-md-5">
//                                                                     <div className="form-group" style={{ position: "relative" }}>
//                                                                         <input
//                                                                             type="text"
//                                                                             className="form-control user-icn2"
//                                                                             placeholder="Add a traveler"
//                                                                             value={
//                                                                                 userListData?.find(user => user.uid === formData.caretakers)?.first_name || ""
//                                                                             }
//                                                                             onFocus={() => setShowCaretakerList(true)}
//                                                                             onBlur={() => setTimeout(() => setShowCaretakerList(false), 200)}
//                                                                             onChange={() => { }}
//                                                                         />
//                                                                         {showCaretakerList && (
//                                                                             <div style={{
//                                                                                 position: "absolute", top: "58px", left: 0, right: 0,
//                                                                                 background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                 zIndex: 10, padding: "16px", maxHeight: "300px", overflowY: "auto",
//                                                                             }}>
//                                                                                 {filtereduserListData?.length > 0 ? (
//                                                                                     <>
//                                                                                         {filtereduserListData?.map((user, idx) => (
//                                                                                             <div
//                                                                                                 key={user.value}
//                                                                                                 className="managers-data"
//                                                                                                 style={{
//                                                                                                     display: "flex", alignItems: "center",
//                                                                                                     marginBottom: "18px",
//                                                                                                     borderBottom: idx < filtereduserListData.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                     paddingBottom: "15px", cursor: "pointer",
//                                                                                                 }}
//                                                                                                 onMouseDown={(e) => e.preventDefault()}
//                                                                                                 onClick={() => handleCaretakerSelect("", user.value)}
//                                                                                             >
//                                                                                                 <div style={{ width: "48px", height: "48px", background: "#e0d7d1", marginRight: "16px" }} />
//                                                                                                 <div>
//                                                                                                     <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>{user.label}</div>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         ))}
//                                                                                         <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
//                                                                                             <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                                                                                 {`Can't find someone?`}<br />
//                                                                                                 <Link onClick={addTravel} href="#" style={{ color: "#463527" }}>Register a new traveler</Link>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </>
//                                                                                 ) : (
//                                                                                     <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                                                                                         <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                                                                                         <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
//                                                                                         <Link href="/People" style={{
//                                                                                             background: "#6B4F3F", color: "white", padding: "10px 20px",
//                                                                                             width: "100%", display: "block", textAlign: "center", cursor: "pointer", textDecoration: "none",
//                                                                                         }}>Invite to Join</Link>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="col-md-12">
//                                                                     {formData.caretakers && userListData.length > 0 &&
//                                                                         userListData.filter(ele => ele.uid === formData.caretakers).map((item, i) => (
//                                                                             <div key={`selected-caretaker-private-${i}`} className="selected-caretaker-container">
//                                                                                 <div className="manager-list-full" style={{
//                                                                                     display: "flex", alignItems: "center",
//                                                                                     border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                     padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                                 }}>
//                                                                                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                         <Image src={item?.profile_image || "/images/icons/user-placeholder.png"} alt={item?.first_name} width={48} height={48} style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }} />
//                                                                                         <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                             {item?.first_name} {item?.last_name}<br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Emp. id: {item?.employee_id}</span><br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Dept: {item?.segment}</span>
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{item?.phone_number}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{item?.email}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{item?.gender}
//                                                                                         </span>
//                                                                                     </div>
//                                                                                     <div className="show-edit-btn">
//                                                                                         <Button variant="" className="edit-btn ms-1 me-1" onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
//                                                                                             Edit details
//                                                                                         </Button>
//                                                                                         <button type="button" className="ms-auto" onClick={() => setFormData({ ...formData, caretakers: "" })}
//                                                                                             style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }} title="Remove">
//                                                                                             <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         ))
//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ) : (
//                                                         // FIX 23: Twin-Sharing / non-private — show per-traveller rows
//                                                         travellers?.map((row, tIdx) => (
//                                                             <div key={tIdx} className="property-list-2">
//                                                                 <div className="row mt-3 mb-3">
//                                                                     <div className="col-md-4">
//                                                                         <Select
//                                                                             options={travelOption}
//                                                                             placeholder="Choose Role"
//                                                                             isSearchable={false}
//                                                                             styles={customStyles}
//                                                                             onChange={(e) => handleTravellerTypeChange(tIdx, e.value)}
//                                                                             components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                         />
//                                                                     </div>

//                                                                     {/* Bed selector only for Twin-Sharing */}
//                                                                     {chooseBeds.length > 0 && (
//                                                                         <div className="col-md-3">
//                                                                             <Select
//                                                                                 options={chooseBeds.filter(bed => !bed.selected || bed.value === row?.selectedBedIndex)}
//                                                                                 placeholder="Choose Bed"
//                                                                                 isSearchable={false}
//                                                                                 styles={customStyles}
//                                                                                 value={chooseBeds.find(cv => cv.value === row?.selectedBedIndex) || null}
//                                                                                 onChange={(e) => {
//                                                                                     const value = e.value;
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) =>
//                                                                                             i === tIdx ? { ...item, selectedBedIndex: value } : item
//                                                                                         )
//                                                                                     );
//                                                                                     setChooseBeds(prev =>
//                                                                                         prev.map((bed, idx) => ({
//                                                                                             ...bed,
//                                                                                             selected: travellers.some((t, ti) => ti !== tIdx && t.selectedBedIndex === idx) || idx === value,
//                                                                                         }))
//                                                                                     );
//                                                                                 }}
//                                                                             />
//                                                                         </div>
//                                                                     )}

//                                                                     <div className={chooseBeds.length > 0 ? "col-md-5" : "col-md-8"}>
//                                                                         <div className="form-group" style={{ position: "relative" }}>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control"
//                                                                                 placeholder="Add a traveler"
//                                                                                 value={row.searchText}
//                                                                                 onFocus={() => {
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) => {
//                                                                                             if (i !== tIdx) return item;
//                                                                                             const baseFiltered = userListData.filter(user => {
//                                                                                                 const roleName = user?.user_role?.role_name;
//                                                                                                 if (item.traveller_type === "External") return roleName === "External";
//                                                                                                 return roleName !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                                                                                             });
//                                                                                             return { ...item, showList: true, filteredUsers: baseFiltered };
//                                                                                         })
//                                                                                     );
//                                                                                 }}
//                                                                                 onChange={(e) => {
//                                                                                     const value = e.target.value.toLowerCase();
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) => {
//                                                                                             if (i !== tIdx) return item;
//                                                                                             const baseFiltered = userListData.filter(user => {
//                                                                                                 const roleName = user?.user_role?.role_name;
//                                                                                                 if (item.traveller_type === "External") return roleName === "External";
//                                                                                                 return roleName !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                                                                                             });
//                                                                                             const finalFiltered = value
//                                                                                                 ? baseFiltered.filter(user =>
//                                                                                                     `${user.first_name} ${user.last_name}`.toLowerCase().includes(value)
//                                                                                                 )
//                                                                                                 : baseFiltered;
//                                                                                             return { ...item, searchText: value, showList: true, filteredUsers: finalFiltered };
//                                                                                         })
//                                                                                     );
//                                                                                 }}
//                                                                                 onBlur={() => {
//                                                                                     setTimeout(() => {
//                                                                                         setTravellers(prev =>
//                                                                                             prev.map((item, i) => i === tIdx ? { ...item, showList: false } : item)
//                                                                                         );
//                                                                                     }, 200);
//                                                                                 }}
//                                                                             />
//                                                                             {row.showList && (
//                                                                                 <div style={{
//                                                                                     position: "absolute", top: "58px", left: 0, right: 0,
//                                                                                     background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                     zIndex: 10, padding: "16px", maxHeight: "300px", overflowY: "auto",
//                                                                                 }}>
//                                                                                     {row.filteredUsers && row.filteredUsers.length > 0 ? (
//                                                                                         <>
//                                                                                             {row.filteredUsers.map((user, idx) => (
//                                                                                                 <div
//                                                                                                     key={user.uid}
//                                                                                                     className="managers-data"
//                                                                                                     style={{
//                                                                                                         display: "flex", alignItems: "center", marginBottom: "18px",
//                                                                                                         borderBottom: idx < row.filteredUsers.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                         paddingBottom: "15px", cursor: "pointer",
//                                                                                                     }}
//                                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                                     onClick={() => handleCaretakerSelect(tIdx, user.uid)}
//                                                                                                 >
//                                                                                                     <div style={{ width: "48px", height: "48px", background: "#e0d7d1", marginRight: "16px" }} />
//                                                                                                     <div>
//                                                                                                         <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                             {user.first_name} {user.last_name}
//                                                                                                         </div>
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             ))}
//                                                                                             <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
//                                                                                                 <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                                                                                     Can't find someone?<br />
//                                                                                                     <Link onClick={addTravel} href="#" style={{ color: "#463527" }}>Register a new traveler</Link>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </>
//                                                                                     ) : (
//                                                                                         <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                                                                                             <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                                                                                             <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
//                                                                                             <Link href="/People" style={{
//                                                                                                 background: "#6B4F3F", color: "white", padding: "10px 20px",
//                                                                                                 width: "100%", display: "block", textAlign: "center", cursor: "pointer", textDecoration: "none",
//                                                                                             }}>Invite to Join</Link>
//                                                                                         </div>
//                                                                                     )}
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>

//                                                                     <div className="col-md-12">
//                                                                         {row.caretaker && userListData.length > 0 &&
//                                                                             userListData.filter(ele => ele.uid === row.caretaker).map((item, i) => (
//                                                                                 <div key={`selected-twin-${tIdx}-${i}`} className="selected-caretaker-container">
//                                                                                     <div className="manager-list-full" style={{
//                                                                                         display: "flex", alignItems: "center",
//                                                                                         border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                         padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                                     }}>
//                                                                                         <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                             <Image src={item?.profile_image || "/images/icons/user-placeholder.png"} alt={item?.first_name} width={48} height={48}
//                                                                                                 style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }} />
//                                                                                             <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                 {item?.first_name} {item?.last_name}<br />
//                                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Emp. id: {item?.employee_id}</span><br />
//                                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Dept: {item?.segment}</span>
//                                                                                                 {/* FIX 24: Remove hardcoded "(You)" — only show if it matches logged in user */}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{item?.phone_number}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{item?.email}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{item?.gender}
//                                                                                             </span>
//                                                                                         </div>
//                                                                                         <div className="show-edit-btn">
//                                                                                             <Button variant="" className="edit-btn ms-1 me-1" onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
//                                                                                                 Edit details
//                                                                                             </Button>
//                                                                                             <button type="button" className="ms-auto" onClick={() => handleCaretakerSelect(tIdx, "")}
//                                                                                                 style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }} title="Remove">
//                                                                                                 <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                             </button>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             ))
//                                                                         }
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         ))
//                                                     )}
//                                                 </div>
//                                             )}

//                                         </React.Fragment>
//                                     );
//                                 })}
//                             </div>

//                             <p className='d-flex gap-2 fw-medium justify-content-end'>
//                                 Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
//                             </p>

//                             {/* ARRIVAL DETAILS */}
//                             <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                 <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                 <p className="text-secondary mb-2">
//                                     This information helps in operational planning, legal compliance, and personalized service.
//                                 </p>

//                                 <Form.Group className='mb-4 mt-4' controlId="arrival_time">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
//                                     <Select
//                                         onChange={(e) => updateArrivalDetails("arrival_time", e.value)}
//                                         options={timeOption}
//                                         placeholder="Select time"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />
//                                 </Form.Group>

//                                 <Form.Group className='mb-4' controlId="mode_of_arrival">
//                                     <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
//                                     <Select
//                                         options={arrivalOption}
//                                         placeholder="Select Mode"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                         value={arrivalOption.find(opt => opt.value === formData.arrival_details.mode_of_arrival) || null}
//                                         onChange={(e) => updateArrivalDetails("mode_of_arrival", e.value)}
//                                     />
//                                 </Form.Group>

//                                 <div className='mb-4 form-group' controlId="transport_number">
//                                     <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Enter number e.g. MADGAON LTT EXP #11100"
//                                         value={formData.arrival_details.transport_number}
//                                         onChange={(e) => updateArrivalDetails("transport_number", e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ADDITIONAL COMMENTS */}
//                             <div className="arrival-section mt-4 pt-4">
//                                 <h3 className="font-24 mb-2">Additional Comments</h3>
//                                 <div className='mb-5 form-group' controlId="ref_number">
//                                     <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
//                                     <input
//                                         type="text"
//                                         onChange={(e) => setFormData({ ...formData, company_booking_reference: e?.target?.value })}
//                                         placeholder='Reference number to be entered for your internal purpose (optional)'
//                                         className='form-control'
//                                     />
//                                 </div>
//                             </div>

//                             <hr />

//                             <div className="arrival-section mt-4 pt-3 mb-5">
//                                 <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                 <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
//                                 <div className='mb-4 form-group'>
//                                     <textarea
//                                         className='form-control'
//                                         onChange={(e) => setFormData({ ...formData, additional_comments: e?.target?.value })}
//                                         placeholder='Got any thoughts or questions? Add them here! (Optional)'
//                                     ></textarea>
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* CONFIRMATION EMAIL */}
//                             <div className="confirmation-email-section my-5 pb-5">
//                                 <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3' style={{ maxWidth: '360px', cursor: 'pointer' }}>
//                                     <Form.Check
//                                         type="checkbox"
//                                         label="Send copy of confirmation email"
//                                         checked={formData.send_confirmation_email}
//                                         onChange={(e) => {
//                                             updateFormData("send_confirmation_email", e.target.checked);
//                                             setIsEmailEnabled(e.target.checked);
//                                             if (e.target.checked) {
//                                                 setReceivers([{ id: 1, email: '' }]);
//                                             } else {
//                                                 setReceivers([]);
//                                             }
//                                         }}
//                                     />
//                                 </label>

//                                 {isEmailEnabled && (
//                                     <div className="email-content">
//                                         <p className='fw-bold' style={{ color: '#6B4F3F' }}>Add info</p>
//                                         {receivers.map((receiver, index) => (
//                                             <div key={receiver.id} className="receiver-item">
//                                                 {index > 0 && (
//                                                     <>
//                                                         <hr className="my-4" />
//                                                         <p className='fw-bold mb-3'>Receiver {index + 1}</p>
//                                                     </>
//                                                 )}
//                                                 <div className='form-group mb-4'>
//                                                     <label className="form-label fw-medium">Email</label>
//                                                     <div className='row align-items-center'>
//                                                         <div className='col-md-5'>
//                                                             <input
//                                                                 type='email'
//                                                                 className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
//                                                                 placeholder='Enter receiver email'
//                                                                 value={receiver.email}
//                                                                 onChange={(e) => handleEmailChange(receiver.id, e.target.value)}
//                                                             />
//                                                             {receiver.email && !isValidEmail(receiver.email) && (
//                                                                 <div className="invalid-feedback d-block">Please enter a valid email address</div>
//                                                             )}
//                                                         </div>
//                                                         <div className='col-md-1 d-flex align-items-center'>
//                                                             {index === 0 ? (
//                                                                 <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0" disabled={receivers?.length >= 5}>
//                                                                     <Image src='./images/icons/add_circle.svg' alt='Add receiver' width={32} height={32} style={{ opacity: receivers?.length >= 5 ? 0.5 : 1 }} />
//                                                                 </button>
//                                                             ) : (
//                                                                 <button type="button" onClick={() => handleRemoveReceiver(receiver.id)} className="btn btn-link p-0">
//                                                                     <Image src='./images/icons/close-circle.svg' alt='Remove receiver' width={32} height={32} />
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         {receivers?.length >= 5 && (
//                                             <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Col>

//                         {/* BOOKING SUMMARY */}
//                         <Col md={4} className='ps-5'>
//                             <div className='booking-summary-colum'>
//                                 <div className="d-flex align-items-center justify-between mb-4">
//                                     <h4 className='font-24 mb-0'>Booking Summary</h4>
//                                     <label className='mb-0 d-flex gap-2 align-items-center'>
//                                         <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show prices
//                                     </label>
//                                 </div>

//                                 <div className="booking-summary">
//                                     <div className="summary-details">
//                                         <div className="summary-row">
//                                             <span className="summary-label">BRs Selected</span>
//                                             {/* FIX 25: Show actual segment count */}
//                                             <span className="summary-value">{numSegments}</span>
//                                         </div>
//                                         <div className="summary-row">
//                                             <span className="summary-label">Number of Rooms</span>
//                                             <span className="summary-value">{numSegments} Room{numSegments > 1 ? "s" : ""}</span>
//                                         </div>
//                                         <div className="summary-row">
//                                             <span className="summary-label">Travelers</span>
//                                             <span className="summary-value">{selectedAdult} Adult{selectedAdult > 1 ? "s" : ""}</span>
//                                         </div>

//                                         {/* FIX 26: Show per-segment pricing */}
//                                         {bookingData?.segments?.map((seg, idx) => (
//                                             <div key={seg.segment_id} className="summary-row detailed">
//                                                 <span className="summary-label">{seg.room_name} Pricing</span>
//                                                 <div className="summary-value-detailed">
//                                                     <div className="price-desc">{selectedAdult} Guest x {seg.nights} nights</div>
//                                                     {showPrices && (
//                                                         <div className="price-amount">₹{(seg.segment_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                                                     )}
//                                                     <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                                 </div>
//                                             </div>
//                                         ))}

//                                         <div className="total-section">
//                                             <span className="total-label">Total Price</span>
//                                             <div className="total-value-detailed">
//                                                 <div className="total-desc">{selectedAdult} Guest x {totalNights} nights</div>
//                                                 {showPrices && (
//                                                     <div className="total-amount">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                                                 )}
//                                                 <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <button onClick={handleSubmitReserve} className="confirm-btn">
//                                         Confirm and Reserve
//                                     </button>
//                                 </div>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             {/* EDIT STAY DETAILS MODAL */}
//             <Modal show={addTravels2} onHide={removeTravel2} animation={false} centered size="xl" className='custom-theme-modal-2' aria-labelledby="edit-stay-modal">
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title className='d-flex align-items-center gap-3'>Edit Stay Details</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel2} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         <Row className='gap-0'>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Which company?</label>
//                                     <Select
//                                         options={companyList}
//                                         placeholder="Select company"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
//                                         onChange={option => setSearchFieldData({ ...searchFieldData, company_id: option.value })}
//                                         styles={customStyles}
//                                     />
//                                 </div>
//                             </Col>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Where to?</label>
//                                     <Select
//                                         options={cityList}
//                                         placeholder="Select city"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         getOptionLabel={(option) => option.city}
//                                         getOptionValue={(option) => option.city}
//                                         value={cityList?.find(c => c.city === searchFieldData.city) || null}
//                                         onChange={(option) => setSearchFieldData({ ...searchFieldData, city: option.city })}
//                                         styles={customStyles}
//                                     />
//                                 </div>
//                             </Col>
//                             <Col md={4} className='gap-2'>
//                                 <div className='d-flex gap-0'>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Check-in date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
//                                             selectsStart
//                                             minDate={new Date()}
//                                             className="form-control custom-date-picker"
//                                             dateFormat="dd/MM/yyyy"
//                                             placeholderText='dd/MM/yyyy'
//                                         />
//                                     </div>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Checkout date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
//                                             selectsEnd
//                                             startDate={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
//                                             endDate={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
//                                             minDate={new Date()}
//                                             className="form-control custom-date-picker"
//                                             dateFormat="dd/MM/yyyy"
//                                             placeholderText='dd/MM/yyyy'
//                                         />
//                                     </div>
//                                 </div>
//                             </Col>
//                             <Col md={4} className='gap-1'>
//                                 <Row>
//                                     <Col md={7}>
//                                         <div className='form-group'>
//                                             <label className='text-black'>No. of Rooms & Guests</label>
//                                             <div className="react_selectbox custom-dropdown" onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}>
//                                                 <div className="selected-value">
//                                                     {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`}
//                                                 </div>
//                                                 {isRoomDropdownOpen && (
//                                                     <div className="room-dropdown-content">
//                                                         {rooms.map((room) => (
//                                                             <div key={room.id} className="room-section">
//                                                                 <div className="d-flex justify-content-between align-items-center">
//                                                                     <div className="room-header">Room {room.id}</div>
//                                                                     {rooms.length > 1 && (
//                                                                         <button className="delete-room-btn" onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }}>
//                                                                             <Image src='./images/icons/delete_b.svg' width={20} height={20} alt="delete" />
//                                                                         </button>
//                                                                     )}
//                                                                 </div>
//                                                                 <div className="guest-counter">
//                                                                     <label>Adults</label>
//                                                                     <div className="counter-controls">
//                                                                         <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleAdultChange(room.id, -1); }}>-</button>
//                                                                         <span>{room.adults}</span>
//                                                                         <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleAdultChange(room.id, 1); }}>+</button>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                         <div className="d-flex align-items-center justify-between">
//                                                             <button className="add-room-btn" onClick={(e) => { e.stopPropagation(); addRoom(); }}>
//                                                                 <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' width={24} height={24} /> Add a room
//                                                             </button>
//                                                             <button className="done-btn" onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 setIsRoomDropdownOpen(false);
//                                                                 setSearchFieldData({ ...searchFieldData, rooms: rooms.map(item => ({ adults: item.adults })) });
//                                                             }}>Done</button>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </Col>
//                                     <Col md={5}>
//                                         <div className='form-group h-100 align-items-center d-flex pt-1'>
//                                             <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', textAlign: 'center', borderRadius: '0', color: '#fff' }} variant='' onClick={handleUpdateSearch}>
//                                                 Update Search
//                                             </Button>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Modal.Body>
//             </Modal>

//             {/* ADD PERSON MODAL */}
//             <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} />

//             {/* PRICE BREAKDOWN MODAL */}
//             <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70' aria-labelledby="breakdown-modal">
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         {/* FIX 27: Show actual segment prices in breakdown */}
//                         {bookingData?.segments?.map((seg) => (
//                             <div key={seg.segment_id} className='d-flex justify-between pt-2 pb-2'>
//                                 <span>{seg.room_name} x {selectedAdult} guest x {seg.nights} nights</span>
//                                 <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{seg.segment_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                             </div>
//                         ))}
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>CasaMelhor Service fee</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹0.00</span>
//                         </div>
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>Taxes</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹0.00</span>
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between'>
//                     <span className='fs-20'>Total</span>
//                     <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                 </Modal.Footer>
//             </Modal>

//             {/* BOOKING CONFIRMED MODAL */}
//             <Modal show={addReserves} onHide={removeReserve} animation={false} centered size="" className='custom-theme-modal-2 modal-460' aria-labelledby="reserve-modal">
//                 <Modal.Body className="pt-4 pb-4">
//                     {bookingConfirmedData?.length > 0 && (
//                         <div className="flex items-center justify-center gap-6">
//                             <button
//                                 onClick={() => setCurrent((current - 1 + bookingConfirmedData.length) % bookingConfirmedData.length)}
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none"
//                             >‹</button>
//                             <div className="text-center min-w-[260px]">
//                                 <p className="text-base font-medium mb-1">The booking has been confirmed and updated</p>
//                                 <p className="flex items-center justify-center gap-2 text-sm mb-2">
//                                     Booking ID: <span className="font-semibold text-gray-700">{bookingConfirmedData[current]?.booking_number}</span>
//                                     <Image src="./images/icons/content_copy.svg" alt="copy" width={16} height={16} className="cursor-pointer"
//                                         onClick={() => navigator.clipboard.writeText(bookingConfirmedData[current]?.booking_number)} />
//                                 </p>
//                                 <div className="flex justify-center gap-1 mt-2">
//                                     {bookingConfirmedData.map((_, i) => (
//                                         <span key={i} className={`w-[6px] h-[6px] rounded-full transition-all ${current === i ? "bg-black" : "bg-gray-300"}`}></span>
//                                     ))}
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setCurrent((current + 1) % bookingConfirmedData.length)}
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none"
//                             >›</button>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between flex-col'>
//                     <Link
//                         href={`/BookingDetails/${bookingConfirmedData[current]?.uid}`}
//                         className="p-2 w-100 text-center d-flex align-items-center justify-content-center"
//                         style={{ background: "#2C734A", borderRadius: "0", color: "#fff", minHeight: "58px", textDecoration: "none" }}
//                     >
//                         View Booking Details
//                     </Link>
//                     <Link
//                         href="/CreateBooking"
//                         className="text-center justify-center edit-btn w-100 d-flex align-items-center justify-content-center"
//                         style={{ minHeight: "58px", textDecoration: "none" }}
//                     >
//                         Create Another Booking
//                     </Link>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }



// "use client"
// import React, { useState, useEffect, useRef } from 'react'
// import Header from '../Header/Header'
// import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form, Accordion, Label } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { components } from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import { UserListAPI, validateGender, CreateBookingPost, companyListAPI, PropertyListFullApi, UserRoleListAPI } from '@/services/provider';
// import { alert_danger, alert_info, alert_success } from '@/utils/Alerts/TostifyAlerts';
// import { calculateNights, convertTo24Hour, formatDateMonthYear, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
// import { ToastContainer } from 'react-toastify';
// import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
// import toast, { Toaster } from 'react-hot-toast';

// export default function MultiSwitchReserve() {

//     const router = useRouter();

//     const lastValidatedRef = useRef({});
//     const timeOption = generateTimeOptions12Format(30);

//     // FIX 1: reserveBookingData is an object (not array) with { segments, total_price, type, ... }
//     const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"));


//     const [userListData, setUserListData] = useState([]);
//     const [current, setCurrent] = useState(0);

//     // FIX 2: bookingData holds the full reserveBookingData object (not array)
//     const [bookingData, setBookingData] = useState(null);
//     const [filtereduserListData, setFilteredUserListData] = useState([]);
//     const [lastUpdatedIndex, setLastUpdatedIndex] = useState(null);
//     const [amount, setAmount] = useState("");
//     const [tax, setTax] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [bookingSummary, setBookingSummary] = useState(null);
//     const goToResult = () => {
//         setTimeout(() => {
//             router.push('/MultiRoomsGuestResult');
//         }, 100);
//     };

//     const calculateBookingTax = (bookingData) => {
//         if (!bookingData?.segments) return null;

//         let subtotal = 0;
//         let totalTax = 0;

//         const updatedSegments = bookingData?.segments?.map((segment) => {
//             subtotal += segment.segment_price;

//             // GST slab based on price_per_night
//             const taxRate = segment.price_per_night <= 7500 ? 0.05 : 0.18;
//             const segmentTax = segment.segment_price * taxRate;

//             totalTax += segmentTax;

//             return {
//                 ...segment,
//                 taxRate,
//                 taxAmount: segmentTax,
//             };
//         });

//         const serviceFee = 0;
//         const grandTotal = subtotal + totalTax + serviceFee;

//         return {
//             segments: updatedSegments,
//             subtotal,
//             totalTax,
//             serviceFee,
//             grandTotal,
//         };
//     };
//     const breakdownText = (rooms) => {
//         const roomCount = rooms.length;
//         const guestCount = rooms.reduce(
//             (sum, room) => sum + (room.adults || 0),
//             0
//         );
//         return `${roomCount} room x ${guestCount} guest x ${searchBookingData?.total_nights} nights`
//     }



//     // FIX 3: bedroomPreference - API response has no bedroom_preference_badge at top level segments
//     // It may come from individual segment or room details; default to null if not present
//     const bedroomPreference = reserveBookingData?.bedroom_preference_badge || null;

//     // FIX 4: adultCount — API response doesn't have adultCount; derive from searchBookingData or default to 1
//     const adultCount = searchBookingData?.rooms?.[0]?.adults || 1;

//     const [formData, setFormData] = useState({
//         company_id: 2,
//         caretakers: "",
//         traveler_assignments: [],
//         arrival_details: {
//             arrival_time: "",
//             mode_of_arrival: "",
//             transport_number: ""
//         },
//         send_confirmation_email: false,
//         additional_comments: "",
//         company_booking_reference: "",
//     });

//     const [travellers, setTravellers] = useState([]);

//     const handleCaretakerSelect = (rowIndex, userId) => {
//         if (rowIndex === "") {
//             setFormData({ ...formData, caretakers: userId });
//             setShowCaretakerList(false);
//             return;
//         }
//         setTravellers(prev =>
//             prev.map((item, i) =>
//                 i === rowIndex
//                     ? {
//                         ...item,
//                         caretaker: userId,
//                         searchText: userListData.find(u => u.uid === userId)?.first_name || "",
//                         showList: false
//                     }
//                     : item
//             )
//         );
//         setLastUpdatedIndex(rowIndex);
//     };

//     const handleTravellerTypeChange = (rowIndex, selected) => {
//         setTravellers(prev => {
//             const updated = [...prev];
//             if (!updated[rowIndex]) return prev;
//             updated[rowIndex] = {
//                 ...updated[rowIndex],
//                 traveller_type: selected,
//                 filteredUsers: userListData.filter(
//                     user => user?.user_role?.role_name === selected
//                 ),
//             };
//             return updated;
//         });
//     };

//     const [showPrices, setShowPrices] = useState(false);
//     const [selectedAdult, setSelectedAdult] = useState(adultCount);

//     const [addTravels, addTravelsetShow] = useState(false);
//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);

//     const [addBreakdowns, addBreakdownsetShow] = useState(false);
//     const removeBreakdown = () => addBreakdownsetShow(false);
//     const addbreakdown = () => addBreakdownsetShow(true);

//     const [addReserves, addReservesetShow] = useState(false);
//     const removeReserve = () => addReservesetShow(false);
//     const addReserve = () => addReservesetShow(true);

//     const [addTravels2, addTravel2setShow] = useState(false);
//     const removeTravel2 = () => addTravel2setShow(false);
//     const addTravel2 = () => addTravel2setShow(true);

//     const updateFormData = (key, value) => {
//         setFormData(prev => ({ ...prev, [key]: value }));
//     };

//     const updateArrivalDetails = (key, value) => {
//         setFormData(prev => ({
//             ...prev,
//             arrival_details: {
//                 ...prev.arrival_details,
//                 [key]: key === "arrival_time" ? convertTo24Hour(value) : value
//             }
//         }));
//     };

//     // FIX 5: Initialize bookingData and travellers correctly from the object structure
//     useEffect(() => {
//         if (reserveBookingData) {
//             setBookingData(reserveBookingData);
//             const calculatedData = calculateBookingTax(reserveBookingData);
//             setBookingSummary(calculatedData);
//             const count = adultCount;
//             setTravellers(
//                 Array.from({ length: count }, () => ({
//                     traveller_type: null,
//                     isGenderValidation: "",
//                     caretaker: null,
//                     searchText: "",
//                     showList: false,
//                     filteredUsers: [],
//                     selectedBedIndex: null
//                 }))
//             );
//         }
//     }, []);

//     const CompanyOption = [
//         { value: "casamelhor", label: "Casamelhor" },
//         { value: "schlumberger", label: "Schlumberger" },
//         { value: "delhivery", label: "Delhivery" },
//         { value: "picus-Capital", label: "Picus Capital" },
//         { value: "gps-Renewables", label: "GPS Renewables" },
//     ];

//     const travelOption = [
//         { value: "Company Booking Manager", label: "Company employee", icon: "../images/icons/hail.svg" },
//         { value: "External", label: "External", icon: "../images/icons/short_stay.svg" },
//     ];

//     const CustomOption = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image src={props.data.icon ? props.data.icon : props.data.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"} alt={props.data.label} width={20} height={20} />
//                     <span>{props.data.label}</span>
//                 </div>
//                 {props.isSelected && <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>}
//             </div>
//         </components.Option>
//     );

//     const CustomSingleValue = (props) => (
//         <components.SingleValue {...props}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
//                 <span>{props.data.label}</span>
//             </div>
//         </components.SingleValue>
//     );

//     const handleSelectDropdown = (e, name) => {
//         const { value } = e;
//         if (name === "traveller_type") {
//             if (value === "External") {
//                 const updatedForm = { ...formData, traveller_type: value };
//                 delete updatedForm.segment;
//                 delete updatedForm.designation;
//                 delete updatedForm.employee_grade;
//                 delete updatedForm.account_unit;
//                 delete updatedForm.account_code;
//                 delete updatedForm.employee_id;
//                 setFormData(updatedForm);
//             } else {
//                 setFormData(prev => ({
//                     ...prev,
//                     traveller_type: value,
//                     segment: "",
//                     designation: "",
//                     employee_grade: "",
//                     account_unit: "",
//                     account_code: "",
//                     employee_id: ""
//                 }));
//             }
//         }
//     };

//     const arrivalOption = [
//         { value: "Flight", label: "Flight" },
//         { value: "Train", label: "Train" }
//     ];

//     const CityOption = [
//         { value: "gurugram", label: "Gurugram" },
//         { value: "mumbai", label: "Mumbai" },
//         { value: "navi-mumbai", label: "Navi Mumbai" },
//         { value: "kakinada", label: "Kakinada" },
//         { value: "Bokaro", label: "Bokaro" },
//         { value: "ahmedabad", label: "Ahmedabad" },
//     ];

//     const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

//     const handleAdultChange = (roomId, change) => {
//         setRooms(rooms.map(room => {
//             if (room.id === roomId) {
//                 const newValue = room.adults + change;
//                 return { ...room, adults: newValue >= 1 ? newValue : 1 };
//             }
//             return room;
//         }));
//     };

//     const addRoom = () => {
//         const newRoomId = rooms.length + 1;
//         setRooms([...rooms, { id: newRoomId, adults: 1 }]);
//     };

//     const deleteRoom = (roomId) => {
//         if (rooms.length > 1) {
//             setRooms(rooms.filter(room => room.id !== roomId));
//         }
//     };

//     const customStyles = {
//         control: (base, state) => ({
//             ...base,
//             borderColor: state.isFocused ? "#6B4F3F" : "#ced4da",
//             boxShadow: state.isFocused ? "0 0 0 1px #6B4F3F" : "none",
//             "&:hover": { borderColor: "#6B4F3F" },
//             borderRadius: "4px",
//             minHeight: "38px",
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isSelected
//                 ? "#6B4F3F"
//                 : state.isFocused
//                     ? "#f0e8e3"
//                     : "transparent",
//             color: state.isSelected ? "white" : "#463527",
//             padding: "10px 16px",
//             cursor: "pointer",
//         }),
//         menu: (base) => ({
//             ...base,
//             background: "#f9f6f4",
//             border: "1px solid #6B4F3F",
//             borderRadius: "0",
//             zIndex: 10,
//         }),
//         menuList: (base) => ({
//             ...base,
//             padding: "8px 0",
//             maxHeight: "260px",
//         }),
//         placeholder: (base) => ({ ...base, color: "#aaa" }),
//         singleValue: (base) => ({ ...base, color: "#463527" }),
//     };

//     const CustomMenuList = ({ children, selectProps }) => {
//         const { inputValue, options } = selectProps;
//         const isEmpty = options?.length === 0;

//         return (
//             <div>
//                 {isEmpty ? (
//                     <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                         <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                         <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px", color: "#463527" }}>
//                             No travelers found
//                         </div>
//                         <Link
//                             href="/People"
//                             style={{
//                                 background: "#6B4F3F",
//                                 color: "white",
//                                 padding: "10px 20px",
//                                 display: "block",
//                                 textAlign: "center",
//                                 textDecoration: "none",
//                             }}
//                         >
//                             Invite to Join
//                         </Link>
//                     </div>
//                 ) : (
//                     <>
//                         {children}
//                         <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
//                             <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                 {"Can't find someone?"}<br />
//                                 <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>
//                                     Register a new traveler
//                                 </Link>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         );
//     };

//     const [showCaretakerList, setShowCaretakerList] = useState(null);
//     const [chooseBeds, setChooseBeds] = useState([]);
//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([]);
//     const [bookingConfirmedData, setBookingConfirmedData] = useState([]);

//     const handleAddReceiver = () => {
//         const newReceiver = { id: Date.now(), email: '' };
//         setReceivers([...receivers, newReceiver]);
//     };

//     const handleRemoveReceiver = (id) => {
//         if (receivers.length > 1) {
//             setReceivers(receivers.filter(receiver => receiver.id !== id));
//         }
//     };

//     const handleEmailChange = (id, email) => {
//         setReceivers(receivers.map(receiver =>
//             receiver.id === id ? { ...receiver, email } : receiver
//         ));
//     };

//     const isValidEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const getUserListData = async () => {
//         try {
//             const response = await UserListAPI("All");
//             if (response?.data?.success) {
//                 setUserListData(response.data.response);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         // FIX 6: chooseBeds should come from segment bed data if available
//         // Since API response segments don't have beds array, initialize empty
//         setChooseBeds([]);
//         getUserListData();
//     }, []);

//     // FIX 7: Filter users based on traveller_type in formData (for Private rooms)
//     useEffect(() => {
//         if (!formData?.traveller_type) {
//             setFilteredUserListData([]);
//             return;
//         }

//         const filteredData = userListData
//             ?.filter(user => {
//                 const roleName = user.user_role?.role_name;
//                 let travellerAllowed = false;

//                 if (formData.traveller_type === "External") {
//                     travellerAllowed = roleName === "External";
//                 } else {
//                     travellerAllowed =
//                         roleName !== "External" &&
//                         user?.user_company?.id === bacisSearchDetails?.company_id;
//                 }

//                 if (!travellerAllowed) return false;

//                 if (bedroomPreference === "FEMALE PREFERRED") return user.gender === "Female";
//                 if (bedroomPreference === "MALE PREFERRED") return user.gender === "Male";

//                 return true;
//             })
//             .map(user => ({
//                 value: user.uid,
//                 label: `${user.first_name} ${user.last_name}`,
//                 gender: user.gender,
//                 icon: user.profile_image
//             }));

//         setFilteredUserListData(filteredData);
//     }, [formData.traveller_type, userListData, bedroomPreference]);

//     const formatDate = (dateTime) => {
//         const date = new Date(dateTime);
//         return date.toLocaleDateString("en-IN", {
//             weekday: "short",
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     const formatTime = (dateTime) => {
//         const date = new Date(dateTime);
//         return date.toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//         });
//     };

//     const formatStayDates = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);
//         const options = { weekday: "short", day: "numeric", month: "short" };
//         const startFormatted = start.toLocaleDateString("en-US", options);
//         const endFormatted = end.toLocaleDateString("en-US", options);
//         const year = end.getFullYear();
//         const diffTime = end - start;
//         const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));
//         return `${startFormatted} - ${endFormatted}, ${year}, ${nights} night${nights > 1 ? "s" : ""}`;
//     };

//     const getDateOnly = (dateTime) => dateTime?.split("T")[0];

//     // ─── Gender validation on traveller select (Twin-Sharing / non-private) ───
//     // Runs automatically when a traveller is picked for a shared-room row.
//     // Validates against ALL segments and stores the result per traveller row.
//     useEffect(() => {
//         if (lastUpdatedIndex === null) return;

//         const updatedTraveller = travellers[lastUpdatedIndex];
//         if (!updatedTraveller?.caretaker) return;

//         // Skip if already validated the same person for this row
//         if (lastValidatedRef.current[lastUpdatedIndex] === updatedTraveller.caretaker) return;

//         const checkGenderValid = async (segment) => {
//             try {
//                 const payload = {
//                     room_uid: segment?.room_uid,
//                     traveler_uid: updatedTraveller.caretaker,
//                     check_in_date: getDateOnly(segment?.check_in_datetime),
//                     check_out_date: getDateOnly(segment?.check_out_datetime),
//                     bed_index: lastUpdatedIndex,
//                 };

//                 const response = await validateGender(payload);
//                 const isValid = response?.data?.response?.valid;

//                 lastValidatedRef.current[lastUpdatedIndex] = updatedTraveller.caretaker;

//                 setTravellers(prev =>
//                     prev.map((item, i) =>
//                         i === lastUpdatedIndex
//                             ? { ...item, isGenderValidation: isValid ? "Success" : "Error" }
//                             : item
//                     )
//                 );

//                 if (isValid) {
//                     toast.success(`Traveler ${lastUpdatedIndex + 1}: Gender validated successfully`);
//                 } else {
//                     toast.error(`Traveler ${lastUpdatedIndex + 1}: Gender validation failed — this traveler is not allowed in this room`);
//                 }
//             } catch (error) {
//                 console.error("Gender validation error:", error);
//                 toast.error(`Traveler ${lastUpdatedIndex + 1}: Gender validation failed`);
//             }
//         };

//         // Validate against the last segment (room assignment) only —
//         // using all segments would fire N duplicate toasts for the same traveller.
//         const lastSegment = bookingData?.segments?.[bookingData.segments.length - 1];
//         if (lastSegment) checkGenderValid(lastSegment);

//     }, [lastUpdatedIndex]);

//     // ─── Gender validation on Private-room traveller select ───
//     // Runs automatically when formData.caretakers changes (Private room flow).
//     useEffect(() => {
//         if (!formData.caretakers) return;

//         const checkGenderValid = async (segment) => {
//             try {
//                 const payload = {
//                     room_uid: segment?.room_uid,
//                     traveler_uid: formData.caretakers,
//                     check_in_date: getDateOnly(segment?.check_in_datetime),
//                     check_out_date: getDateOnly(segment?.check_out_datetime),
//                     bed_index: 0,
//                 };
//                 const response = await validateGender(payload);
//                 const isValid = response?.data?.response?.valid;

//                 // Store validation result on formData so submit can check it
//                 setFormData(prev => ({ ...prev, caretakerGenderValid: isValid }));

//                 if (isValid) {
//                     toast.success("Gender validated successfully");
//                 } else {
//                     toast.error("Gender validation failed — this traveler is not allowed in this room");
//                 }
//             } catch (error) {
//                 console.error("Gender validation error:", error);
//                 toast.error("Gender validation failed");
//             }
//         };

//         const lastSegment = bookingData?.segments?.[bookingData?.segments?.length - 1];
//         if (lastSegment) checkGenderValid(lastSegment);
//     }, [formData.caretakers]);

//     // ─── Pre-submit gender validation for non-private rooms ───
//     // Called explicitly inside handleSubmitReserve to validate ALL travellers
//     // against ALL segments before allowing booking creation.
//     const validateAllTravellersGender = async () => {
//         const segments = bookingData?.segments || [];
//         const validationResults = await Promise.all(
//             travellers.map(async (row, tIdx) => {
//                 if (!row.caretaker) {
//                     toast.error(`Traveler ${tIdx + 1}: No traveler selected`);
//                     return false;
//                 }

//                 // Validate against every segment
//                 const segmentResults = await Promise.all(
//                     segments.map(async (segment) => {
//                         try {
//                             const payload = {
//                                 room_uid: segment?.room_uid,
//                                 traveler_uid: row.caretaker,
//                                 check_in_date: getDateOnly(segment?.check_in_datetime),
//                                 check_out_date: getDateOnly(segment?.check_out_datetime),
//                                 bed_index: tIdx,
//                             };
//                             const response = await validateGender(payload);
//                             return response?.data?.response?.valid === true;
//                         } catch {
//                             return false;
//                         }
//                     })
//                 );

//                 // All segments must pass for this traveller
//                 const allValid = segmentResults.every(Boolean);

//                 // Update UI state so the traveller row shows the result
//                 setTravellers(prev =>
//                     prev.map((item, i) =>
//                         i === tIdx
//                             ? { ...item, isGenderValidation: allValid ? "Success" : "Error" }
//                             : item
//                     )
//                 );

//                 if (!allValid) {
//                     toast.error(`Traveler ${tIdx + 1}: Gender validation failed — booking blocked`);
//                 }

//                 return allValid;
//             })
//         );

//         return validationResults.every(Boolean);
//     };

//     const [searchFieldData, setSearchFieldData] = useState({
//         company_id: 0,
//         city: "",
//         check_in_date: "",
//         check_out_date: "",
//         rooms: [],
//         is_available: true
//     });

//     const handleUpdateSearch = () => {
//         removeItemLocalStorage("reserveRoom");
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
//         router.push("./Searchresult");
//     };

//     const [companyList, setCompanyList] = useState([]);
//     const [role, setRole] = useState([]);
//     const [cityList, setCityList] = useState([]);

//     const getProprtyList = async () => {
//         try {
//             const response = await PropertyListFullApi();
//             if (response?.data?.success) {
//                 const uniqueCities = [
//                     { city: "Jaipur" },
//                     ...Array.from(
//                         new Set(response.data.response.map(ele => ele.city)),
//                         city => ({ city })
//                     ).filter(item => item.city !== "Jaipur")
//                 ];
//                 setCityList(uniqueCities);
//             }
//         } catch (error) {
//             console.log("Property API Error: ", error);
//         }
//     };

//     //role list
//     const getUserListDataAPI = async () => {
//         try {
//             const response = await UserRoleListAPI(loginData?.uid);
//             if (response?.data?.success) {
//                 setRole(
//                     response.data.response.map((val) => ({
//                         value: val?.uid,
//                         label: val?.role_name,
//                         icon: val?.role_icon,
//                     }))
//                 );
//             }
//         } catch (error) {
//             console.error("userListData error:", error);
//         }
//     };

//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 const list = response.data.response.map(item => ({
//                     value: item.id,
//                     label: item.company_name
//                 }));
//                 setCompanyList(list);
//             }
//         } catch (error) {
//             console.log("Company API Error: ", error);
//         }
//     };

//     useEffect(() => {
//         getCompanyList();
//         getProprtyList();
//         getUserListDataAPI();
//         if (bacisSearchDetails) {
//             setSearchFieldData({
//                 company_id: bacisSearchDetails.company_id,
//                 city: bacisSearchDetails.city,
//                 check_in_date: bacisSearchDetails.check_in_date,
//                 check_out_date: bacisSearchDetails.check_out_date,
//                 is_available: bacisSearchDetails.is_available,
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
//             });
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })));
//         }
//     }, []);

//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleSubmitReserve = async () => {
//         const firstSegmentRoomType = bookingData?.segments?.[0]?.room_type;
//         const isPrivate = firstSegmentRoomType === "Private";

//         // ── Validation: ensure traveller(s) are selected ──────────────────────
//         if (isPrivate) {
//             if (!formData.caretakers) {
//                 toast.error("Please select a traveler before confirming");
//                 return;
//             }
//             // For private rooms, block if gender validation already ran and failed
//             if (formData.caretakerGenderValid === false) {
//                 toast.error("Booking blocked: traveler did not pass gender validation");
//                 return;
//             }
//         } else {
//             // Non-private: every traveller row must have someone selected
//             const missingTraveller = travellers.some(row => !row.caretaker);
//             if (missingTraveller) {
//                 toast.error("Please select a traveler for every row before confirming");
//                 return;
//             }

//             // ── Gender validation gate for non-private rooms ──────────────────
//             // Re-validate all travellers against all segments right before submit.
//             // This catches cases where the user skipped traveller selection or
//             // the reactive useEffect validation hasn't completed yet.
//             setIsSubmitting(true);
//             const allGenderValid = await validateAllTravellersGender();
//             setIsSubmitting(false);

//             if (!allGenderValid) {
//                 // validateAllTravellersGender already shows per-row toast errors
//                 toast.error("Booking blocked: one or more travelers failed gender validation");
//                 return;
//             }
//         }

//         // ── Build and submit payload ───────────────────────────────────────────
//         setIsSubmitting(true);
//         try {
//             let cartItem = bookingData?.segments?.map((segment) => ({
//                 property_uid: segment?.property_uid,
//                 room_uid: segment?.room_uid,
//                 bed_index: isPrivate ? null : (travellers[0]?.selectedBedIndex ?? null),
//                 check_in_date: getDateOnly(segment?.check_in_datetime),
//                 check_out_date: getDateOnly(segment?.check_out_datetime),
//             }));

//             let travelerAssignments = [];
//             if (isPrivate) {
//                 cartItem.forEach((_, idx) => {
//                     travelerAssignments.push({
//                         cart_item_index: idx,
//                         traveler_id: formData.caretakers,
//                         is_exclusive_booking: false
//                     });
//                 });
//             } else {
//                 travellers.forEach((row, tIdx) => {
//                     cartItem.forEach((_, segIdx) => {
//                         travelerAssignments.push({
//                             cart_item_index: segIdx,
//                             traveler_id: row.caretaker,
//                             is_exclusive_booking: false
//                         });
//                     });
//                 });
//             }

//             const payload = {
//                 company_id: searchBookingData?.company_id || bacisSearchDetails.company_id,
//                 cart_items: cartItem,
//                 traveler_assignments: travelerAssignments,
//                 arrival_details: {
//                     ...formData.arrival_details,
//                     arrival_date: getDateOnly(bookingData?.segments?.[0]?.check_in_datetime),
//                 },
//                 additional_comments: formData.additional_comments,
//                 company_booking_reference: formData.company_booking_reference,
//                 send_confirmation_email: formData.send_confirmation_email,
//                 additional_email_recipients: receivers.map(r => r.email)
//             };

//             const response = await CreateBookingPost(payload);
//             if (response.data.success) {
//                 setBookingConfirmedData(response.data.response.bookings);
//                 addReserve();
//                 toast.success("Booking Created Successfully");
//                 removeItemLocalStorage("reserveRoom");
//                 removeItemLocalStorage("searchParam");
//                 removeItemLocalStorage("basicSecrchItemObj");
//             } else {
//                 response.data.response.validation_errors.forEach(element => {
//                     toast.error(element.error);
//                 });
//             }
//         } catch (error) {
//             console.error("Submission error:", error);
//             toast.error("Failed to create booking");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // FIX 13: Derive summary values from bookingData.segments
//     const totalNights = bookingData?.total_nights || 0;
//     const totalPrice = bookingData?.total_price || 0;
//     const numSegments = bookingData?.segments?.length || 0;

//     // FIX 14: Header display — derive from searchBookingData / bacisSearchDetails
//     const headerCompany = bacisSearchDetails?.company_name || "Company";
//     const headerCity = bacisSearchDetails?.city || "City";
//     const headerStay = (bookingData?.segments?.length > 0)
//         ? `${formatDate(bookingData.segments[0].check_in_datetime)} - ${formatDate(bookingData.segments[bookingData.segments.length - 1].check_out_datetime)}, ${totalNights} nights`
//         : "";
//     const headerGuests = `1 room for ${adultCount} guest${adultCount > 1 ? "s" : ""}`;

//     console.log(bookingSummary)

//     return (
//         <>
//             <Header />
//             <Toaster position="top-right" />
//             <div className='searching-result-top'>
//                 <Container>
//                     <div className='search-result-header'>
//                         {/* FIX 15: Display dynamic header from actual search/booking data */}
//                         <h4>{headerCompany} | {headerCity}</h4>
//                         <p className='mb-0'>
//                             <Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />
//                             {headerStay} |
//                             <Image src='./images/icons/group.svg' alt='group' className="img-fluid" width={24} height={24} />
//                             {headerGuests}
//                         </p>
//                         <Button variant='' onClick={addTravel2} className='edit-details'>Edit Stay Details</Button>
//                     </div>
//                 </Container>
//             </div>

//             <div className='search-result-data'>
//                 <Container>
//                     <Row className='justify-content-between'>

//                         <Col md={12}>
//                             <h4 className='page-title mb-5'>Add Guests & Reserve Your Booking</h4>
//                         </Col>

//                         <Col md={8}>
//                             {/* FIX 16: Show count of BRs from segments length */}
//                             <h4 className='font-24 mb-4'>Review Your Selected BRs ({numSegments})</h4>

//                             <div className="booking-card border bg-white p-3 mb-4">
//                                 {/* FIX 17: Iterate over bookingData?.segments (object structure, not array index) */}
//                                 {bookingData?.segments?.map((segment, index) => {
//                                     const isLast = index === bookingData.segments.length - 1;
//                                     const nextSegment = bookingData.segments[index + 1];

//                                     return (
//                                         <React.Fragment key={segment.segment_id}>

//                                             {/* ROOM CARD */}
//                                             <Row>
//                                                 <Col md={4}>
//                                                     <Image
//                                                         src={
//                                                             segment.property_cover_photo
//                                                                 ? `https://alicedevapi.casamelhor.in${segment.property_cover_photo}`
//                                                                 : segment.cover_photo
//                                                                     ? `https://alicedevapi.casamelhor.in${segment.cover_photo}`
//                                                                     : "/images/no-image.png"
//                                                         }
//                                                         alt={segment.room_name}
//                                                         width={300}
//                                                         height={200}
//                                                         className="img-fluid"
//                                                     />
//                                                 </Col>

//                                                 <Col md={8}>
//                                                     <p className="fw-semibold fs-20 mb-2 room-title">
//                                                         <span className="fs-20">
//                                                             {segment.nights} night stay in {segment.room_name}
//                                                         </span>
//                                                         <span className="room-type-badge ms-2">
//                                                             {segment.room_type}
//                                                         </span>
//                                                     </p>
//                                                     <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                         <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} />
//                                                         {segment.property_name}
//                                                     </p>
//                                                 </Col>
//                                             </Row>

//                                             {/* CHECK-IN / CHECK-OUT */}
//                                             <Row className="mt-3 mb-3">
//                                                 <Col md={3}>
//                                                     <p className="mb-1 text-secondary small">Check-in:</p>
//                                                     <p className="fw-semibold mb-0">{formatDate(segment.check_in_datetime)}</p>
//                                                     <small>{formatTime(segment.check_in_datetime)}</small>
//                                                 </Col>
//                                                 <Col md={3}>
//                                                     <p className="mb-1 text-secondary small">Check-out:</p>
//                                                     <p className="fw-semibold mb-0">{formatDate(segment.check_out_datetime)}</p>
//                                                     <small>{formatTime(segment.check_out_datetime)}</small>
//                                                 </Col>
//                                             </Row>

//                                             {/* ROOM DETAILS */}
//                                             <div className="border-top pt-3">
//                                                 <p className="mb-1 font-18">Room details</p>
//                                                 <div className="room-specs d-flex gap-3 mb-2">
//                                                     <span className="spec-item d-flex gap-2">
//                                                         <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps 2
//                                                     </span> |
//                                                     <span className="spec-item d-flex gap-2">
//                                                         <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" /> 1 king bed
//                                                     </span> |
//                                                     <span className="spec-item d-flex gap-2">538 sq ft</span>
//                                                 </div>
//                                                 {/* FIX 18: Show bedroom_preference_badge if present on segment */}
//                                                 {segment?.bedroom_preference_badge && (
//                                                     <div className="room-specs d-flex gap-3 mb-2">
//                                                         <span className='female-booked'>{segment.bedroom_preference_badge}</span>
//                                                     </div>
//                                                 )}
//                                                 <hr />
//                                             </div>

//                                             {/* FIX 19: Property/Room change block between segments */}
//                                             {!isLast && (
//                                                 <div className="room-change-info d-flex gap-2 align-items-center mb-3 mt-3 pb-3 border-bottom">
//                                                     <Image src="./images/icons/switch-pro-vertical.svg" alt="switch" width={24} height={100} />
//                                                     <div>
//                                                         <p className="fs-20 mb-0" style={{ color: "#a6a6a6" }}>
//                                                             {/* FIX 20: Use bookingData.type to determine label */}
//                                                             {bookingData?.type === "mixed_room" ? "Room" : "Property"} change on
//                                                         </p>
//                                                         <p className="mb-0" style={{ color: "#a6a6a6" }}>
//                                                             {formatDate(nextSegment.check_in_datetime)}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             {/* TRAVELER SECTION ONLY ON LAST SEGMENT */}
//                                             {isLast && (
//                                                 <div className="traveler-section">
//                                                     <p className="mb-2 font-18">Travelers in this room</p>

//                                                     {/* FIX 21: Adult count radio buttons — use adultCount from searchBookingData */}
//                                                     <div className="d-flex gap-3 mb-3">
//                                                         {Array.from(
//                                                             { length: Math.max(adultCount, 2) },
//                                                             (_, i) => {
//                                                                 const count = i + 1;
//                                                                 return (
//                                                                     <div key={count} className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }}>
//                                                                         <label className="form-check-label d-flex gap-2 mb-0">
//                                                                             <input
//                                                                                 type="radio"
//                                                                                 name='adult-count'
//                                                                                 checked={selectedAdult === count}
//                                                                                 onChange={() => {
//                                                                                     setSelectedAdult(count);
//                                                                                     setTravellers(
//                                                                                         Array.from({ length: count }, () => ({
//                                                                                             traveller_type: null,
//                                                                                             isGenderValidation: "",
//                                                                                             caretaker: null,
//                                                                                             searchText: "",
//                                                                                             showList: false,
//                                                                                             filteredUsers: [],
//                                                                                             selectedBedIndex: null
//                                                                                         }))
//                                                                                     );
//                                                                                 }}
//                                                                             />
//                                                                             <span className="radio-checkmark"></span>
//                                                                             {count} Adult{count > 1 ? "s" : ""}
//                                                                         </label>
//                                                                     </div>
//                                                                 );
//                                                             }
//                                                         )}
//                                                     </div>

//                                                     <hr />

//                                                     {/* Exclusive booking checkbox */}
//                                                     <Row className='mb-3'>
//                                                         <Col md={5}>
//                                                             <label className="mb-0 d-flex gap-2 align-items-center show-my-booking">
//                                                                 <input className="mx-2 custom-checkbox" type="checkbox" />
//                                                                 Exclusively book this room for the traveler
//                                                             </label>
//                                                         </Col>
//                                                     </Row>

//                                                     {/* Info banners */}
//                                                     {segment?.room_type === "Twin-Sharing" && (
//                                                         <Row className='mb-2'>
//                                                             <Col md={6}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                     Since this is a twin bed, one will be available for booking unless you specify it for exclusive use.
//                                                                 </p>
//                                                             </Col>
//                                                         </Row>
//                                                     )}

//                                                     <p className="mb-2 font-18">Traveler details</p>
//                                                     <p className='small'>{`We'll use this information to book. Make sure the name matches what is on the traveler's passport or ID.`}</p>

//                                                     {bedroomPreference && (
//                                                         <Row className='mb-2'>
//                                                             <Col md={7}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                     As this room has already been booked for a {bedroomPreference.toLowerCase().replace(" preferred", "")}, only {bedroomPreference.toLowerCase().replace(" preferred", "")} traveler bookings are allowed
//                                                                 </p>
//                                                             </Col>
//                                                         </Row>
//                                                     )}

//                                                     {/* FIX 22: Check room_type from segment (not from removed rooms[0]) */}
//                                                     {segment?.room_type === "Private" ? (
//                                                         <div className='property-list-2'>
//                                                             <div className="row">
//                                                                 <div className="col-md-4">
//                                                                     <Select
//                                                                         name="traveller_type"
//                                                                         options={travelOption}
//                                                                         placeholder="Choose Role"
//                                                                         className='react_selectbox'
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                     />
//                                                                 </div>
//                                                                 {/* <div className="col-md-5">
//                                                                     <div className="form-group" style={{ position: "relative" }}>
//                                                                         <input
//                                                                             type="text"
//                                                                             className="form-control user-icn2"
//                                                                             placeholder="Add a traveler"
//                                                                             value={
//                                                                                 userListData?.find(user => user.uid === formData.caretakers)?.first_name || ""
//                                                                             }
//                                                                             onFocus={() => setShowCaretakerList(true)}
//                                                                             onBlur={() => setTimeout(() => setShowCaretakerList(false), 200)}
//                                                                             onChange={() => { }}
//                                                                         />
//                                                                         {showCaretakerList && (
//                                                                             <div style={{
//                                                                                 position: "absolute", top: "58px", left: 0, right: 0,
//                                                                                 background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                 zIndex: 10, padding: "16px", maxHeight: "300px", overflowY: "auto",
//                                                                             }}>
//                                                                                 {filtereduserListData?.length > 0 ? (
//                                                                                     <>
//                                                                                         {filtereduserListData?.map((user, idx) => (
//                                                                                             <div
//                                                                                                 key={user.value}
//                                                                                                 className="managers-data"
//                                                                                                 style={{
//                                                                                                     display: "flex", alignItems: "center",
//                                                                                                     marginBottom: "18px",
//                                                                                                     borderBottom: idx < filtereduserListData.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                     paddingBottom: "15px", cursor: "pointer",
//                                                                                                 }}
//                                                                                                 onMouseDown={(e) => e.preventDefault()}
//                                                                                                 onClick={() => handleCaretakerSelect("", user.value)}
//                                                                                             >
//                                                                                                 <div style={{ width: "48px", height: "48px", background: "#e0d7d1", marginRight: "16px" }} />
//                                                                                                 <div>
//                                                                                                     <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>{user.label}</div>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         ))}
//                                                                                         <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
//                                                                                             <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                                                                                 {`Can't find someone?`}<br />
//                                                                                                 <Link onClick={addTravel} href="#" style={{ color: "#463527" }}>Register a new traveler</Link>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </>
//                                                                                 ) : (
//                                                                                     <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                                                                                         <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                                                                                         <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
//                                                                                         <Link href="/People" style={{
//                                                                                             background: "#6B4F3F", color: "white", padding: "10px 20px",
//                                                                                             width: "100%", display: "block", textAlign: "center", cursor: "pointer", textDecoration: "none",
//                                                                                         }}>Invite to Join</Link>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 </div> */}
//                                                                 {/* --- Usage in your JSX --- */}
//                                                                 <div className="col-md-8">
//                                                                     {!formData.caretakers && (
//                                                                         <div className="form-group">
//                                                                             <Select
//                                                                                 options={filtereduserListData}
//                                                                                 styles={customStyles}
//                                                                                 components={{ Option: CustomOption, MenuList: CustomMenuList }}
//                                                                                 placeholder="Add a traveler"
//                                                                                 onChange={(selected) => handleCaretakerSelect("", selected?.value)}
//                                                                                 isClearable
//                                                                                 isSearchable
//                                                                                 value={
//                                                                                     formData.caretakers
//                                                                                         ? filtereduserListData?.find((u) => u.value === formData.caretakers) ?? null
//                                                                                         : null
//                                                                                 }
//                                                                                 noOptionsMessage={() => null} // handled in CustomMenuList
//                                                                             />
//                                                                         </div>
//                                                                     )}
//                                                                 </div>
//                                                                 <div className="col-md-12">
//                                                                     {formData.caretakers && userListData.length > 0 &&
//                                                                         userListData.filter(ele => ele.uid === formData.caretakers).map((item, i) => (
//                                                                             <div key={`selected-caretaker-private-${i}`} className="selected-caretaker-container">
//                                                                                 <div className="manager-list-full" style={{
//                                                                                     display: "flex", alignItems: "center",
//                                                                                     border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                     padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                                 }}>
//                                                                                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                         <Image src={item?.profile_image ? item?.profile_image : item?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"} alt={item?.first_name} width={48} height={48} style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }} />
//                                                                                         <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                             {item?.first_name} {item?.last_name}<br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Emp. id: {item?.employee_id}</span><br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Dept: {item?.segment}</span>
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{item?.phone_number}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{item?.email}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{item?.gender}
//                                                                                         </span>
//                                                                                     </div>
//                                                                                     <div className="show-edit-btn">
//                                                                                         <Button variant="" className="edit-btn ms-1 me-1" onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
//                                                                                             Edit details
//                                                                                         </Button>
//                                                                                         <button type="button" className="ms-auto" onClick={() => setFormData({ ...formData, caretakers: "" })}
//                                                                                             style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }} title="Remove">
//                                                                                             <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         ))
//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ) : (
//                                                         // FIX 23: Twin-Sharing / non-private — show per-traveller rows
//                                                         travellers?.map((row, tIdx) => (
//                                                             <div key={tIdx} className="property-list-2">
//                                                                 <div className="row mt-3 mb-3">
//                                                                     <div className="col-md-4">
//                                                                         <Select
//                                                                             options={travelOption}
//                                                                             placeholder="Choose Role"
//                                                                             isSearchable={false}
//                                                                             styles={customStyles}
//                                                                             onChange={(e) => handleTravellerTypeChange(tIdx, e.value)}
//                                                                             components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                         />
//                                                                     </div>

//                                                                     {/* Bed selector only for Twin-Sharing */}
//                                                                     {chooseBeds.length > 0 && (
//                                                                         <div className="col-md-3">
//                                                                             <Select
//                                                                                 options={chooseBeds.filter(bed => !bed.selected || bed.value === row?.selectedBedIndex)}
//                                                                                 placeholder="Choose Bed"
//                                                                                 isSearchable={false}
//                                                                                 styles={customStyles}
//                                                                                 value={chooseBeds.find(cv => cv.value === row?.selectedBedIndex) || null}
//                                                                                 onChange={(e) => {
//                                                                                     const value = e.value;
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) =>
//                                                                                             i === tIdx ? { ...item, selectedBedIndex: value } : item
//                                                                                         )
//                                                                                     );
//                                                                                     setChooseBeds(prev =>
//                                                                                         prev.map((bed, idx) => ({
//                                                                                             ...bed,
//                                                                                             selected: travellers.some((t, ti) => ti !== tIdx && t.selectedBedIndex === idx) || idx === value,
//                                                                                         }))
//                                                                                     );
//                                                                                 }}
//                                                                             />
//                                                                         </div>
//                                                                     )}

//                                                                     <div className={chooseBeds.length > 0 ? "col-md-5" : "col-md-8"}>
//                                                                         <div className="form-group" style={{ position: "relative" }}>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className={`form-control${row.isGenderValidation === "Error" ? " is-invalid border-danger" : row.isGenderValidation === "Success" ? " border-success" : ""}`}
//                                                                                 placeholder="Add a traveler"
//                                                                                 value={row.searchText}
//                                                                                 onFocus={() => {
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) => {
//                                                                                             if (i !== tIdx) return item;
//                                                                                             const baseFiltered = userListData.filter(user => {
//                                                                                                 const roleName = user?.user_role?.role_name;
//                                                                                                 if (item.traveller_type === "External") return roleName === "External";
//                                                                                                 return roleName !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                                                                                             });
//                                                                                             return { ...item, showList: true, filteredUsers: baseFiltered };
//                                                                                         })
//                                                                                     );
//                                                                                 }}
//                                                                                 onChange={(e) => {
//                                                                                     const value = e.target.value.toLowerCase();
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) => {
//                                                                                             if (i !== tIdx) return item;
//                                                                                             const baseFiltered = userListData.filter(user => {
//                                                                                                 const roleName = user?.user_role?.role_name;
//                                                                                                 if (item.traveller_type === "External") return roleName === "External";
//                                                                                                 return roleName !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                                                                                             });
//                                                                                             const finalFiltered = value
//                                                                                                 ? baseFiltered.filter(user =>
//                                                                                                     `${user.first_name} ${user.last_name}`.toLowerCase().includes(value)
//                                                                                                 )
//                                                                                                 : baseFiltered;
//                                                                                             return { ...item, searchText: value, showList: true, filteredUsers: finalFiltered };
//                                                                                         })
//                                                                                     );
//                                                                                 }}
//                                                                                 onBlur={() => {
//                                                                                     setTimeout(() => {
//                                                                                         setTravellers(prev =>
//                                                                                             prev.map((item, i) => i === tIdx ? { ...item, showList: false } : item)
//                                                                                         );
//                                                                                     }, 200);
//                                                                                 }}
//                                                                             />
//                                                                             {row.showList && (
//                                                                                 <div style={{
//                                                                                     position: "absolute", top: "58px", left: 0, right: 0,
//                                                                                     background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                     zIndex: 10, padding: "16px", maxHeight: "300px", overflowY: "auto",
//                                                                                 }}>
//                                                                                     {row.filteredUsers && row.filteredUsers.length > 0 ? (
//                                                                                         <>
//                                                                                             {row.filteredUsers.map((user, idx) => (
//                                                                                                 <div
//                                                                                                     key={user.uid}
//                                                                                                     className="managers-data"
//                                                                                                     style={{
//                                                                                                         display: "flex", alignItems: "center", marginBottom: "18px",
//                                                                                                         borderBottom: idx < row.filteredUsers.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                         paddingBottom: "15px", cursor: "pointer",
//                                                                                                     }}
//                                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                                     onClick={() => handleCaretakerSelect(tIdx, user.uid)}
//                                                                                                 >
//                                                                                                     <div style={{ width: "48px", height: "48px", background: "#e0d7d1", marginRight: "16px" }} />
//                                                                                                     <div>
//                                                                                                         <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                             {user.first_name} {user.last_name}
//                                                                                                         </div>
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             ))}
//                                                                                             <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
//                                                                                                 <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                                                                                     {`Can't find someone?`}<br />
//                                                                                                     <Link onClick={addTravel} href="#" style={{ color: "#463527" }}>Register a new traveler</Link>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </>
//                                                                                     ) : (
//                                                                                         <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                                                                                             <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                                                                                             <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
//                                                                                             <Link href="/People" style={{
//                                                                                                 background: "#6B4F3F", color: "white", padding: "10px 20px",
//                                                                                                 width: "100%", display: "block", textAlign: "center", cursor: "pointer", textDecoration: "none",
//                                                                                             }}>Invite to Join</Link>
//                                                                                         </div>
//                                                                                     )}
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                         {/* Gender validation status badge */}
//                                                                         {row.isGenderValidation === "Error" && (
//                                                                             <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
//                                                                                 ✕ Gender validation failed — this traveler is not allowed in this room
//                                                                             </p>
//                                                                         )}
//                                                                         {row.isGenderValidation === "Success" && (
//                                                                             <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>
//                                                                                 ✓ Gender validated
//                                                                             </p>
//                                                                         )}
//                                                                     </div>

//                                                                     <div className="col-md-12">
//                                                                         {row.caretaker && userListData.length > 0 &&
//                                                                             userListData.filter(ele => ele.uid === row.caretaker).map((item, i) => (
//                                                                                 <div key={`selected-twin-${tIdx}-${i}`} className="selected-caretaker-container">
//                                                                                     <div className="manager-list-full" style={{
//                                                                                         display: "flex", alignItems: "center",
//                                                                                         border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                         padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                                     }}>
//                                                                                         <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                             <Image src={item?.profile_image || "/images/icons/user-placeholder.png"} alt={item?.first_name} width={48} height={48}
//                                                                                                 style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }} />
//                                                                                             <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                 {item?.first_name} {item?.last_name}<br />
//                                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Emp. id: {item?.employee_id}</span><br />
//                                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Dept: {item?.segment}</span>
//                                                                                                 {/* FIX 24: Remove hardcoded "(You)" — only show if it matches logged in user */}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{item?.phone_number}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{item?.email}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{item?.gender}
//                                                                                             </span>
//                                                                                         </div>
//                                                                                         <div className="show-edit-btn">
//                                                                                             <Button variant="" className="edit-btn ms-1 me-1" onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
//                                                                                                 Edit details
//                                                                                             </Button>
//                                                                                             <button type="button" className="ms-auto" onClick={() => handleCaretakerSelect(tIdx, "")}
//                                                                                                 style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }} title="Remove">
//                                                                                                 <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                             </button>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             ))
//                                                                         }
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         ))
//                                                     )}
//                                                 </div>
//                                             )}

//                                         </React.Fragment>
//                                     );
//                                 })}
//                             </div>

//                             <p className='d-flex gap-2 fw-medium justify-content-end'>
//                                 Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
//                             </p>

//                             {/* ARRIVAL DETAILS */}
//                             <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                 <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                 <p className="text-secondary mb-2">
//                                     This information helps in operational planning, legal compliance, and personalized service.
//                                 </p>

//                                 <Form.Group className='mb-4 mt-4' controlId="arrival_time">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
//                                     <Select
//                                         onChange={(e) => updateArrivalDetails("arrival_time", e.value)}
//                                         options={timeOption}
//                                         placeholder="Select time"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />
//                                 </Form.Group>

//                                 <Form.Group className='mb-4' controlId="mode_of_arrival">
//                                     <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
//                                     <Select
//                                         options={arrivalOption}
//                                         placeholder="Select Mode"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                         value={arrivalOption.find(opt => opt.value === formData.arrival_details.mode_of_arrival) || null}
//                                         onChange={(e) => updateArrivalDetails("mode_of_arrival", e.value)}
//                                     />
//                                 </Form.Group>

//                                 <div className='mb-4 form-group' controlId="transport_number">
//                                     <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Enter number e.g. MADGAON LTT EXP #11100"
//                                         value={formData.arrival_details.transport_number}
//                                         onChange={(e) => updateArrivalDetails("transport_number", e.target.value)}
//                                     />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ADDITIONAL COMMENTS */}
//                             <div className="arrival-section mt-4 pt-4">
//                                 <h3 className="font-24 mb-2">Additional Comments</h3>
//                                 <div className='mb-5 form-group' controlId="ref_number">
//                                     <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
//                                     <input
//                                         type="text"
//                                         onChange={(e) => setFormData({ ...formData, company_booking_reference: e?.target?.value })}
//                                         placeholder='Reference number to be entered for your internal purpose (optional)'
//                                         className='form-control'
//                                     />
//                                 </div>
//                             </div>

//                             <hr />

//                             <div className="arrival-section mt-4 pt-3 mb-5">
//                                 <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                 <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
//                                 <div className='mb-4 form-group'>
//                                     <textarea
//                                         className='form-control'
//                                         onChange={(e) => setFormData({ ...formData, additional_comments: e?.target?.value })}
//                                         placeholder='Got any thoughts or questions? Add them here! (Optional)'
//                                     ></textarea>
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* CONFIRMATION EMAIL */}
//                             <div className="confirmation-email-section my-5 pb-5">
//                                 <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3' style={{ maxWidth: '360px', cursor: 'pointer' }}>
//                                     <Form.Check
//                                         type="checkbox"
//                                         label="Send copy of confirmation email"
//                                         checked={formData.send_confirmation_email}
//                                         onChange={(e) => {
//                                             updateFormData("send_confirmation_email", e.target.checked);
//                                             setIsEmailEnabled(e.target.checked);
//                                             if (e.target.checked) {
//                                                 setReceivers([{ id: 1, email: '' }]);
//                                             } else {
//                                                 setReceivers([]);
//                                             }
//                                         }}
//                                     />
//                                 </label>

//                                 {isEmailEnabled && (
//                                     <div className="email-content">
//                                         <p className='fw-bold' style={{ color: '#6B4F3F' }}>Add info</p>
//                                         {receivers.map((receiver, index) => (
//                                             <div key={receiver.id} className="receiver-item">
//                                                 {index > 0 && (
//                                                     <>
//                                                         <hr className="my-4" />
//                                                         <p className='fw-bold mb-3'>Receiver {index + 1}</p>
//                                                     </>
//                                                 )}
//                                                 <div className='form-group mb-4'>
//                                                     <label className="form-label fw-medium">Email</label>
//                                                     <div className='row align-items-center'>
//                                                         <div className='col-md-5'>
//                                                             <input
//                                                                 type='email'
//                                                                 className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
//                                                                 placeholder='Enter receiver email'
//                                                                 value={receiver.email}
//                                                                 onChange={(e) => handleEmailChange(receiver.id, e.target.value)}
//                                                             />
//                                                             {receiver.email && !isValidEmail(receiver.email) && (
//                                                                 <div className="invalid-feedback d-block">Please enter a valid email address</div>
//                                                             )}
//                                                         </div>
//                                                         <div className='col-md-1 d-flex align-items-center'>
//                                                             {index === 0 ? (
//                                                                 <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0" disabled={receivers?.length >= 5}>
//                                                                     <Image src='./images/icons/add_circle.svg' alt='Add receiver' width={32} height={32} style={{ opacity: receivers?.length >= 5 ? 0.5 : 1 }} />
//                                                                 </button>
//                                                             ) : (
//                                                                 <button type="button" onClick={() => handleRemoveReceiver(receiver.id)} className="btn btn-link p-0">
//                                                                     <Image src='./images/icons/close-circle.svg' alt='Remove receiver' width={32} height={32} />
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         {receivers?.length >= 5 && (
//                                             <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </Col>

//                         {/* BOOKING SUMMARY */}
//                         <Col md={4} className='ps-5'>
//                             <div className='booking-summary-colum'>
//                                 <div className="d-flex align-items-center justify-between mb-4">
//                                     <h4 className='font-24 mb-0'>Booking Summary</h4>
//                                     <label className='mb-0 d-flex gap-2 align-items-center'>
//                                         <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show prices
//                                     </label>
//                                 </div>

//                                 <div className="booking-summary">
//                                     <div className="summary-details">
//                                         <div className="summary-row">
//                                             <span className="summary-label">BRs Selected</span>
//                                             {/* FIX 25: Show actual segment count */}
//                                             <span className="summary-value">{numSegments}</span>
//                                         </div>
//                                         <div className="summary-row">
//                                             <span className="summary-label">Number of Rooms</span>
//                                             <span className="summary-value">{numSegments} Room{numSegments > 1 ? "s" : ""}</span>
//                                         </div>
//                                         <div className="summary-row">
//                                             <span className="summary-label">Travelers</span>
//                                             <span className="summary-value">{selectedAdult} Adult{selectedAdult > 1 ? "s" : ""}</span>
//                                         </div>

//                                         {/* FIX 26: Show per-segment pricing */}
//                                         {bookingData?.segments?.map((seg, idx) => (
//                                             <div key={seg.segment_id} className="summary-row detailed">
//                                                 <span className="summary-label">{seg.room_name} Pricing</span>
//                                                 <div className="summary-value-detailed">
//                                                     <div className="price-desc">{selectedAdult} Guest x {seg.nights} nights</div>
//                                                     {showPrices && (
//                                                         <div className="price-amount">₹{(seg.segment_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                                                     )}
//                                                     <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                                 </div>
//                                             </div>
//                                         ))}

//                                         <div className="total-section">
//                                             <span className="total-label">Total Price</span>
//                                             <div className="total-value-detailed">
//                                                 <div className="total-desc">{selectedAdult} Guest x {totalNights} nights</div>
//                                                 {showPrices && (
//                                                     <div className="total-amount">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                                                 )}
//                                                 <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <button
//                                         onClick={handleSubmitReserve}
//                                         className="confirm-btn"
//                                         disabled={isSubmitting}
//                                         style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
//                                     >
//                                         {isSubmitting ? "Validating & Reserving..." : "Confirm and Reserve"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             {/* EDIT STAY DETAILS MODAL */}
//             <Modal show={addTravels2} onHide={removeTravel2} animation={false} centered size="xl" className='custom-theme-modal-2' aria-labelledby="edit-stay-modal">
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title className='d-flex align-items-center gap-3'>Edit Stay Details</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel2} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         <Row className='gap-0'>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Which company?</label>
//                                     <Select
//                                         options={companyList}
//                                         placeholder="Select company"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
//                                         onChange={option => setSearchFieldData({ ...searchFieldData, company_id: option.value })}
//                                         styles={customStyles}
//                                     />
//                                 </div>
//                             </Col>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Where to?</label>
//                                     <Select
//                                         options={cityList}
//                                         placeholder="Select city"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         getOptionLabel={(option) => option.city}
//                                         getOptionValue={(option) => option.city}
//                                         value={cityList?.find(c => c.city === searchFieldData.city) || null}
//                                         onChange={(option) => setSearchFieldData({ ...searchFieldData, city: option.city })}
//                                         styles={customStyles}
//                                     />
//                                 </div>
//                             </Col>
//                             <Col md={4} className='gap-2'>
//                                 <div className='d-flex gap-0'>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Check-in date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
//                                             selectsStart
//                                             minDate={new Date()}
//                                             className="form-control custom-date-picker"
//                                             dateFormat="dd/MM/yyyy"
//                                             placeholderText='dd/MM/yyyy'
//                                         />
//                                     </div>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Checkout date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
//                                             selectsEnd
//                                             startDate={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
//                                             endDate={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
//                                             minDate={new Date()}
//                                             className="form-control custom-date-picker"
//                                             dateFormat="dd/MM/yyyy"
//                                             placeholderText='dd/MM/yyyy'
//                                         />
//                                     </div>
//                                 </div>
//                             </Col>
//                             <Col md={4} className='gap-1'>
//                                 <Row>
//                                     <Col md={7}>
//                                         <div className='form-group'>
//                                             <label className='text-black'>No. of Rooms & Guests</label>
//                                             <div className="react_selectbox custom-dropdown" onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}>
//                                                 <div className="selected-value">
//                                                     {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`}
//                                                 </div>
//                                                 {isRoomDropdownOpen && (
//                                                     <div className="room-dropdown-content">
//                                                         {rooms.map((room) => (
//                                                             <div key={room.id} className="room-section">
//                                                                 <div className="d-flex justify-content-between align-items-center">
//                                                                     <div className="room-header">Room {room.id}</div>
//                                                                     {rooms.length > 1 && (
//                                                                         <button className="delete-room-btn" onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }}>
//                                                                             <Image src='./images/icons/delete_b.svg' width={20} height={20} alt="delete" />
//                                                                         </button>
//                                                                     )}
//                                                                 </div>
//                                                                 <div className="guest-counter">
//                                                                     <label>Adults</label>
//                                                                     <div className="counter-controls">
//                                                                         <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleAdultChange(room.id, -1); }}>-</button>
//                                                                         <span>{room.adults}</span>
//                                                                         <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleAdultChange(room.id, 1); }}>+</button>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                         <div className="d-flex align-items-center justify-between">
//                                                             <button className="add-room-btn" onClick={(e) => { e.stopPropagation(); addRoom(); }}>
//                                                                 <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' width={24} height={24} /> Add a room
//                                                             </button>
//                                                             <button className="done-btn" onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 setIsRoomDropdownOpen(false);
//                                                                 setSearchFieldData({ ...searchFieldData, rooms: rooms.map(item => ({ adults: item.adults })) });
//                                                             }}>Done</button>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </Col>
//                                     <Col md={5}>
//                                         <div className='form-group h-100 align-items-center d-flex pt-1'>
//                                             <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', textAlign: 'center', borderRadius: '0', color: '#fff' }} variant='' onClick={handleUpdateSearch}>
//                                                 Update Search
//                                             </Button>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Modal.Body>
//             </Modal>

//             {/* ADD PERSON MODAL */}
//             {/* <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} /> */}
//             <AddPersonModel
//                 addTravels={addTravels}
//                 removeTravel={removeTravel}
//                 roleOption={role}
//                 companyList={companyList}
//                 addTravel={addTravel}
//             />

//             {/* PRICE BREAKDOWN MODAL */}
//             <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70' aria-labelledby="breakdown-modal">
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         {/* FIX 27: Show actual segment prices in breakdown */}
//                         {bookingSummary?.segments?.map((seg) => (
//                             <div key={seg.segment_id} className='d-flex justify-between pt-2 pb-2'>
//                                 <span>{seg.room_name} x {selectedAdult} guest x {seg.nights} nights</span>
//                                 <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{seg.segment_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                             </div>
//                         ))}
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>CasaMelhor Service fee</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{bookingSummary?.serviceFee}</span>
//                         </div>
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>Taxes</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{bookingSummary?.totalTax}</span>
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between'>
//                     <span className='fs-20'>Total</span>
//                     {/* <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> */}
//                     <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>₹{bookingSummary?.grandTotal}</span>
//                 </Modal.Footer>
//             </Modal>

//             {/* BOOKING CONFIRMED MODAL */}
//             <Modal show={addReserves} onHide={removeReserve} animation={false} centered size="" className='custom-theme-modal-2 modal-460' aria-labelledby="reserve-modal">
//                 <Modal.Body className="pt-4 pb-4">
//                     {bookingConfirmedData?.length > 0 && (
//                         <div className="flex items-center justify-center gap-6">
//                             <button
//                                 onClick={() => setCurrent((current - 1 + bookingConfirmedData.length) % bookingConfirmedData.length)}
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none"
//                             >‹</button>
//                             <div className="text-center min-w-[260px]">
//                                 <p className="text-base font-medium mb-1">The booking has been confirmed and updated</p>
//                                 <p className="flex items-center justify-center gap-2 text-sm mb-2">
//                                     Booking ID: <span className="font-semibold text-gray-700">{bookingConfirmedData[current]?.booking_number}</span>
//                                     <Image src="./images/icons/content_copy.svg" alt="copy" width={16} height={16} className="cursor-pointer"
//                                         onClick={() => navigator.clipboard.writeText(bookingConfirmedData[current]?.booking_number)} />
//                                 </p>
//                                 <div className="flex justify-center gap-1 mt-2">
//                                     {bookingConfirmedData.map((_, i) => (
//                                         <span key={i} className={`w-[6px] h-[6px] rounded-full transition-all ${current === i ? "bg-black" : "bg-gray-300"}`}></span>
//                                     ))}
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setCurrent((current + 1) % bookingConfirmedData.length)}
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none"
//                             >›</button>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between flex-col'>
//                     <Link
//                         href={`/BookingDetails/${bookingConfirmedData[current]?.uid}`}
//                         className="p-2 w-100 text-center d-flex align-items-center justify-content-center"
//                         style={{ background: "#2C734A", borderRadius: "0", color: "#fff", minHeight: "58px", textDecoration: "none" }}
//                     >
//                         View Booking Details
//                     </Link>
//                     <Link
//                         href="/CreateBooking"
//                         className="text-center justify-center edit-btn w-100 d-flex align-items-center justify-content-center"
//                         style={{ minHeight: "58px", textDecoration: "none" }}
//                     >
//                         Create Another Booking
//                     </Link>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }



"use client"
import React, { useState, useEffect } from 'react'
import Header from '../Header/Header'
import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import Select, { components } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AddPersonModel } from '../commons/AddPersonModel';
import { UserListAPI, validateGender, CreateBookingPost, companyListAPI, PropertyListFullApi, UserRoleListAPI } from '@/services/provider';
import { calculateNights, convertTo24Hour, formatYMD, generateTimeOptions12Format } from '@/utils/formatTime';
import { ToastContainer } from 'react-toastify';
import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
import toast, { Toaster } from 'react-hot-toast';

export default function MultiSwitchReserve() {

    const router = useRouter();
    const timeOption = generateTimeOptions12Format(30);

    const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"));
    const searchBookingData  = JSON.parse(getItemLocalStorage("searchParam"));
    const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
    const loginData          = JSON.parse(getItemLocalStorage("userLogin"));

    const [userListData, setUserListData]             = useState([]);
    const [current, setCurrent]                       = useState(0);
    const [bookingData, setBookingData]               = useState(null);
    const [filtereduserListData, setFilteredUserListData] = useState([]);
    const [bookingSummary, setBookingSummary]          = useState(null);
    const [isSubmitting, setIsSubmitting]             = useState(false);
    const [showPrices, setShowPrices]                 = useState(false);
    const [isEmailEnabled, setIsEmailEnabled]         = useState(false);
    const [receivers, setReceivers]                   = useState([]);
    const [bookingConfirmedData, setBookingConfirmedData] = useState([]);
    const [chooseBeds, setChooseBeds]                 = useState([]);
    const [showCaretakerList, setShowCaretakerList]   = useState(null);
    const [role, setRole]                             = useState([]);
    const [companyList, setCompanyList]               = useState([]);
    const [cityList, setCityList]                     = useState([]);
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
    const [rooms, setRooms]                           = useState([{ id: 1, adults: 1 }]);
    const [travellers, setTravellers]                 = useState([]);

    // ── derived ─────────────────────────────────────────────────────────────
    const bedroomPreference = reserveBookingData?.bedroom_preference_badge || null;
    const adultCount        = searchBookingData?.rooms?.[0]?.adults || 1;
    const totalNights       = bookingData?.total_nights  || 0;
    const totalPrice        = bookingData?.total_price   || 0;
    const numSegments       = bookingData?.segments?.length || 0;
    const headerCompany     = bacisSearchDetails?.company_name || "Company";
    const headerCity        = bacisSearchDetails?.city         || "City";
    const headerStay        = bookingData?.segments?.length > 0
        ? `${formatDate(bookingData.segments[0].check_in_datetime)} - ${formatDate(bookingData.segments[bookingData.segments.length - 1].check_out_datetime)}, ${totalNights} nights`
        : "";
    const headerGuests = `1 room for ${adultCount} guest${adultCount > 1 ? "s" : ""}`;

    const [selectedAdult, setSelectedAdult] = useState(adultCount);

    const [formData, setFormData] = useState({
        company_id: 2,
        caretakers: "",
        caretakerGenderValid: null,
        traveler_assignments: [],
        arrival_details: { arrival_time: "", mode_of_arrival: "", transport_number: "" },
        send_confirmation_email: false,
        additional_comments: "",
        company_booking_reference: "",
    });

    const [searchFieldData, setSearchFieldData] = useState({
        company_id: 0, city: "", check_in_date: "", check_out_date: "", rooms: [], is_available: true
    });

    // ── modal toggles ────────────────────────────────────────────────────────
    const [addTravels,  addTravelsetShow]  = useState(false);
    const removeTravel  = () => addTravelsetShow(false);
    const addTravel     = () => addTravelsetShow(true);

    const [addBreakdowns, addBreakdownsetShow] = useState(false);
    const removeBreakdown = () => addBreakdownsetShow(false);
    const addbreakdown    = () => addBreakdownsetShow(true);

    const [addReserves, addReservesetShow] = useState(false);
    const removeReserve = () => addReservesetShow(false);
    const addReserve    = () => addReservesetShow(true);

    const [addTravels2, addTravel2setShow] = useState(false);
    const removeTravel2 = () => addTravel2setShow(false);
    const addTravel2    = () => addTravel2setShow(true);

    // ── helpers ──────────────────────────────────────────────────────────────
    const updateFormData      = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
    const updateArrivalDetails = (key, value) => setFormData(prev => ({
        ...prev,
        arrival_details: { ...prev.arrival_details, [key]: key === "arrival_time" ? convertTo24Hour(value) : value }
    }));
    const getDateOnly = (dateTime) => dateTime?.split("T")[0];

    function formatDate(dateTime) {
        return new Date(dateTime).toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "short", year: "numeric"
        });
    }
    function formatTime(dateTime) {
        return new Date(dateTime).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    }

    // ── tax calculation ──────────────────────────────────────────────────────
    const calculateBookingTax = (data) => {
        if (!data?.segments) return null;
        let subtotal = 0, totalTax = 0;
        const updatedSegments = data.segments.map((seg) => {
            subtotal += seg.segment_price;
            const taxRate    = seg.price_per_night <= 7500 ? 0.05 : 0.18;
            const taxAmount  = seg.segment_price * taxRate;
            totalTax += taxAmount;
            return { ...seg, taxRate, taxAmount };
        });
        return { segments: updatedSegments, subtotal, totalTax, serviceFee: 0, grandTotal: subtotal + totalTax };
    };

    const breakdownText = (rooms) => {
        const roomCount  = rooms.length;
        const guestCount = rooms.reduce((sum, r) => sum + (r.adults || 0), 0);
        return `${roomCount} room x ${guestCount} guest x ${searchBookingData?.total_nights} nights`;
    };

    // ── init ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (reserveBookingData) {
            setBookingData(reserveBookingData);
            setBookingSummary(calculateBookingTax(reserveBookingData));
            setTravellers(Array.from({ length: adultCount }, () => ({
                traveller_type: null, isGenderValidation: "",
                caretaker: null, searchText: "", showList: false,
                filteredUsers: [], selectedBedIndex: null
            })));
        }
    }, []);

    useEffect(() => { getUserListData(); setChooseBeds([]); }, []);

    useEffect(() => {
        getCompanyList();
        getProprtyList();
        getUserListDataAPI();
        if (bacisSearchDetails) {
            setSearchFieldData({
                company_id:    bacisSearchDetails.company_id,
                city:          bacisSearchDetails.city,
                check_in_date: bacisSearchDetails.check_in_date,
                check_out_date:bacisSearchDetails.check_out_date,
                is_available:  bacisSearchDetails.is_available,
                rooms:         bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
            });
            setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })));
        }
    }, []);

    // ── filtered users for Private room (reacts to traveller_type) ───────────
    useEffect(() => {
        if (!formData?.traveller_type) { setFilteredUserListData([]); return; }
        const filtered = userListData.filter(user => {
            const rn = user.user_role?.role_name;
            let ok = formData.traveller_type === "External"
                ? rn === "External"
                : rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
            if (!ok) return false;
            if (bedroomPreference === "FEMALE PREFERRED") return user.gender === "Female";
            if (bedroomPreference === "MALE PREFERRED")   return user.gender === "Male";
            return true;
        }).map(user => ({
            value: user.uid,
            label: `${user.first_name} ${user.last_name}`,
            gender: user.gender,
            icon: user.profile_image
        }));
        setFilteredUserListData(filtered);
    }, [formData.traveller_type, userListData, bedroomPreference]);

    // ── API calls ────────────────────────────────────────────────────────────
    const getUserListData = async () => {
        try {
            const res = await UserListAPI("All");
            if (res?.data?.success) setUserListData(res.data.response);
        } catch (e) { console.log(e); }
    };

    const getUserListDataAPI = async () => {
        try {
            const res = await UserRoleListAPI(loginData?.uid);
            if (res?.data?.success)
                setRole(res.data.response.map(v => ({ value: v?.uid, label: v?.role_name, icon: v?.role_icon })));
        } catch (e) { console.error(e); }
    };

    const getCompanyList = async () => {
        try {
            const res = await companyListAPI("all");
            if (res?.data?.success)
                setCompanyList(res.data.response.map(item => ({ value: item.id, label: item.company_name })));
        } catch (e) { console.log(e); }
    };

    const getProprtyList = async () => {
        try {
            const res = await PropertyListFullApi();
            if (res?.data?.success) {
                const uniqueCities = [
                    { city: "Jaipur" },
                    ...Array.from(new Set(res.data.response.map(e => e.city)), city => ({ city }))
                        .filter(item => item.city !== "Jaipur")
                ];
                setCityList(uniqueCities);
            }
        } catch (e) { console.log(e); }
    };

    // ── room counter helpers ─────────────────────────────────────────────────
    const handleAdultChange = (roomId, change) =>
        setRooms(rooms.map(r => r.id === roomId ? { ...r, adults: Math.max(1, r.adults + change) } : r));
    const addRoom    = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
    const deleteRoom = (id) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== id)); };

    const handleUpdateSearch = () => {
        removeItemLocalStorage("reserveRoom");
        localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
        router.push("./Searchresult");
    };

    // ── email helpers ────────────────────────────────────────────────────────
    const handleAddReceiver    = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
    const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
    const handleEmailChange    = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
    const isValidEmail         = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // ── Select dropdown options ──────────────────────────────────────────────
    const travelOption = [
        { value: "Company Booking Manager", label: "Company employee", icon: "../images/icons/hail.svg" },
        { value: "External",                label: "External",         icon: "../images/icons/short_stay.svg" },
    ];
    const arrivalOption = [
        { value: "Flight", label: "Flight" },
        { value: "Train",  label: "Train"  },
    ];

    // ── custom Select components ─────────────────────────────────────────────
    const CustomOption = (props) => (
        <components.Option {...props}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <Image
                        src={props.data.icon ? props.data.icon : props.data.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                        alt={props.data.label} width={20} height={20}
                    />
                    <span>{props.data.label}</span>
                </div>
                {props.isSelected && <span style={{ color:"#5a3e85", fontWeight:"bold" }}>✔</span>}
            </div>
        </components.Option>
    );

    const CustomSingleValue = (props) => (
        <components.SingleValue {...props}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
                <span>{props.data.label}</span>
            </div>
        </components.SingleValue>
    );

    const CustomMenuList = ({ children, selectProps }) => {
        const isEmpty = selectProps.options?.length === 0;
        return (
            <div>
                {isEmpty ? (
                    <div style={{ textAlign:"center", padding:"30px 20px", color:"#73615F" }}>
                        <div style={{ fontSize:"18px", marginBottom:"12px" }}>👤</div>
                        <div style={{ fontSize:"16px", fontWeight:"500", marginBottom:"12px", color:"#463527" }}>No travelers found</div>
                        <Link href="/People" style={{ background:"#6B4F3F", color:"white", padding:"10px 20px", display:"block", textAlign:"center", textDecoration:"none" }}>
                            Invite to Join
                        </Link>
                    </div>
                ) : (
                    <>
                        {children}
                        <div style={{ borderTop:"1px solid #ececec", padding:"14px 16px 10px" }}>
                            <div style={{ fontSize:"14px", fontWeight:"500", color:"#463527" }}>
                                {"Can't find someone?"}<br />
                                <Link onClick={addTravel} href="#" style={{ color:"#6B4F3F" }}>Register a new traveler</Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#6B4F3F" : "#ced4da",
            boxShadow:   state.isFocused ? "0 0 0 1px #6B4F3F" : "none",
            "&:hover": { borderColor:"#6B4F3F" },
            borderRadius:"4px", minHeight:"38px",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#6B4F3F" : state.isFocused ? "#f0e8e3" : "transparent",
            color:  state.isSelected ? "white" : "#463527",
            padding:"10px 16px", cursor:"pointer",
        }),
        menu:     (base) => ({ ...base, background:"#f9f6f4", border:"1px solid #6B4F3F", borderRadius:"0", zIndex:10 }),
        menuList: (base) => ({ ...base, padding:"8px 0", maxHeight:"260px" }),
        placeholder: (base) => ({ ...base, color:"#aaa" }),
        singleValue: (base) => ({ ...base, color:"#463527" }),
    };

    // helper: build border colour per validation state
    const validationBorderStyle = (validationState, isFocused) => {
        if (validationState === "Error")      return "#dc3545";
        if (validationState === "Success")    return "#2C734A";
        if (validationState === "Validating") return "#BF9039";
        return isFocused ? "#6B4F3F" : "#ced4da";
    };

    // ── handleTravellerTypeChange ─────────────────────────────────────────────
    // Filters users by role + company + bedroom preference for a given row
    const handleTravellerTypeChange = (rowIndex, selected) => {
        let filtered = userListData.filter(user => {
            const rn = user?.user_role?.role_name;
            let ok = selected === "External"
                ? rn === "External"
                : rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
            if (!ok) return false;
            if (bedroomPreference === "FEMALE PREFERRED") return user.gender === "Female";
            if (bedroomPreference === "MALE PREFERRED")   return user.gender === "Male";
            return true;
        }).map(u => ({
            value: u.uid,
            label: `${u.first_name} ${u.last_name}`,
            gender: u.gender,
            icon: u.profile_image
        }));

        setTravellers(prev =>
            prev.map((item, i) =>
                i === rowIndex
                    ? { ...item, traveller_type: selected, filteredUsers: filtered, caretaker: null, searchText: "", isGenderValidation: "" }
                    : item
            )
        );
    };

    // ── handleSelectDropdown (Private room role picker) ───────────────────────
    const handleSelectDropdown = (e, name) => {
        if (name === "traveller_type") {
            setFormData(prev => ({ ...prev, traveller_type: e.value, caretakers: "", caretakerGenderValid: null }));
        }
    };

    // ── CORE: handleCaretakerSelect — calls gender validation inline ──────────
    // rowIndex === "" → Private room
    // rowIndex = number → Twin-Sharing row
    const handleCaretakerSelect = async (rowIndex, userId) => {

        // ── Private room ──────────────────────────────────────────────────────
        if (rowIndex === "") {
            if (!userId) {
                setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }));
                setShowCaretakerList(false);
                return;
            }
            setFormData(prev => ({ ...prev, caretakers: userId, caretakerGenderValid: null }));
            setShowCaretakerList(false);

            const lastSegment = bookingData?.segments?.[bookingData.segments.length - 1];
            if (!lastSegment) return;

            try {
                const payload = {
                    room_uid:       lastSegment.room_uid,
                    traveler_uid:   userId,
                    check_in_date:  getDateOnly(lastSegment.check_in_datetime),
                    check_out_date: getDateOnly(lastSegment.check_out_datetime),
                    bed_index: 0,
                };
                const response = await validateGender(payload);
                const isValid  = response?.data?.response?.valid;
                setFormData(prev => ({ ...prev, caretakerGenderValid: isValid }));
                isValid
                    ? toast.success("Gender validated successfully")
                    : toast.error("Gender validation failed — this traveler is not allowed in this room");
            } catch (err) {
                console.error("Gender validation error:", err);
                toast.error("Failed to validate gender");
                setFormData(prev => ({ ...prev, caretakerGenderValid: null }));
            }
            return;
        }

        // ── Twin-Sharing row: cleared ─────────────────────────────────────────
        if (!userId) {
            setTravellers(prev =>
                prev.map((item, i) =>
                    i === rowIndex ? { ...item, caretaker: null, searchText: "", isGenderValidation: "" } : item
                )
            );
            return;
        }

        // ── Twin-Sharing row: selected — set Validating immediately ──────────
        const user = userListData.find(u => u.uid === userId);
        setTravellers(prev =>
            prev.map((item, i) =>
                i === rowIndex
                    ? {
                        ...item,
                        caretaker:          userId,
                        searchText:         user ? `${user.first_name} ${user.last_name}` : "",
                        showList:           false,
                        isGenderValidation: "Validating",
                    }
                    : item
            )
        );

        const lastSegment = bookingData?.segments?.[bookingData.segments.length - 1];
        if (!lastSegment) return;

        try {
            const payload = {
                room_uid:       lastSegment.room_uid,
                traveler_uid:   userId,
                check_in_date:  getDateOnly(lastSegment.check_in_datetime),
                check_out_date: getDateOnly(lastSegment.check_out_datetime),
                bed_index:      rowIndex,
            };
            const response = await validateGender(payload);
            const isValid  = response?.data?.response?.valid;

            setTravellers(prev =>
                prev.map((item, i) =>
                    i === rowIndex ? { ...item, isGenderValidation: isValid ? "Success" : "Error" } : item
                )
            );
            isValid
                ? toast.success(`Traveler ${rowIndex + 1}: Gender validated successfully`)
                : toast.error(`Traveler ${rowIndex + 1}: Gender validation failed — not allowed in this room`);
        } catch (err) {
            console.error("Gender validation error:", err);
            toast.error(`Traveler ${rowIndex + 1}: Failed to validate gender`);
            setTravellers(prev =>
                prev.map((item, i) =>
                    i === rowIndex ? { ...item, isGenderValidation: "" } : item
                )
            );
        }
    };

    // ── pre-submit full validation ────────────────────────────────────────────
    const validateAllTravellersGender = async () => {
        const segments = bookingData?.segments || [];
        const results  = await Promise.all(
            travellers.map(async (row, tIdx) => {
                if (!row.caretaker) {
                    toast.error(`Traveler ${tIdx + 1}: No traveler selected`);
                    return false;
                }
                const segResults = await Promise.all(
                    segments.map(async (seg) => {
                        try {
                            const res = await validateGender({
                                room_uid:       seg.room_uid,
                                traveler_uid:   row.caretaker,
                                check_in_date:  getDateOnly(seg.check_in_datetime),
                                check_out_date: getDateOnly(seg.check_out_datetime),
                                bed_index:      tIdx,
                            });
                            return res?.data?.response?.valid === true;
                        } catch { return false; }
                    })
                );
                const allValid = segResults.every(Boolean);
                setTravellers(prev =>
                    prev.map((item, i) =>
                        i === tIdx ? { ...item, isGenderValidation: allValid ? "Success" : "Error" } : item
                    )
                );
                if (!allValid) toast.error(`Traveler ${tIdx + 1}: Gender validation failed — booking blocked`);
                return allValid;
            })
        );
        return results.every(Boolean);
    };

    // ── submit ────────────────────────────────────────────────────────────────
    const handleSubmitReserve = async () => {
        const isPrivate = bookingData?.segments?.[0]?.room_type === "Private";

        if (isPrivate) {
            if (!formData.caretakers) { toast.error("Please select a traveler before confirming"); return; }
            if (formData.caretakerGenderValid === false) { toast.error("Booking blocked: traveler did not pass gender validation"); return; }
        } else {
            if (travellers.some(r => !r.caretaker)) { toast.error("Please select a traveler for every row before confirming"); return; }
            setIsSubmitting(true);
            const allValid = await validateAllTravellersGender();
            setIsSubmitting(false);
            if (!allValid) { toast.error("Booking blocked: one or more travelers failed gender validation"); return; }
        }

        setIsSubmitting(true);
        try {
            const cartItem = bookingData.segments.map((seg) => ({
                property_uid:   seg.property_uid,
                room_uid:       seg.room_uid,
                bed_index:      isPrivate ? null : (travellers[0]?.selectedBedIndex ?? null),
                check_in_date:  getDateOnly(seg.check_in_datetime),
                check_out_date: getDateOnly(seg.check_out_datetime),
            }));

            let travelerAssignments = [];
            if (isPrivate) {
                cartItem.forEach((_, idx) =>
                    travelerAssignments.push({ cart_item_index: idx, traveler_id: formData.caretakers, is_exclusive_booking: false })
                );
            } else {
                travellers.forEach((row, tIdx) =>
                    cartItem.forEach((_, segIdx) =>
                        travelerAssignments.push({ cart_item_index: segIdx, traveler_id: row.caretaker, is_exclusive_booking: false })
                    )
                );
            }

            const payload = {
                company_id:                searchBookingData?.company_id || bacisSearchDetails.company_id,
                cart_items:                cartItem,
                traveler_assignments:      travelerAssignments,
                arrival_details: {
                    ...formData.arrival_details,
                    arrival_date: getDateOnly(bookingData.segments[0].check_in_datetime),
                },
                additional_comments:        formData.additional_comments,
                company_booking_reference:  formData.company_booking_reference,
                send_confirmation_email:    formData.send_confirmation_email,
                additional_email_recipients: receivers.map(r => r.email)
            };

            const response = await CreateBookingPost(payload);
            if (response.data.success) {
                setBookingConfirmedData(response.data.response.bookings);
                addReserve();
                toast.success("Booking Created Successfully");
                removeItemLocalStorage("reserveRoom");
                removeItemLocalStorage("searchParam");
                removeItemLocalStorage("basicSecrchItemObj");
            } else {
                response.data.response.validation_errors.forEach(el => toast.error(el.error));
            }
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("Failed to create booking");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <>
            <Header />
            <Toaster position="top-right" />

            {/* ── top header bar ─────────────────────────────────────────────── */}
            <div className='searching-result-top'>
                <Container>
                    <div className='search-result-header'>
                        <h4>{headerCompany} | {headerCity}</h4>
                        <p className='mb-0'>
                            <Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />
                            {headerStay} |
                            <Image src='./images/icons/group.svg' alt='group' className="img-fluid" width={24} height={24} />
                            {headerGuests}
                        </p>
                        <Button variant='' onClick={addTravel2} className='edit-details'>Edit Stay Details</Button>
                    </div>
                </Container>
            </div>

            <div className='search-result-data'>
                <Container>
                    <Row className='justify-content-between'>
                        <Col md={12}>
                            <h4 className='page-title mb-5'>Add Guests & Reserve Your Booking</h4>
                        </Col>

                        <Col md={8}>
                            <h4 className='font-24 mb-4'>Review Your Selected BRs ({numSegments})</h4>

                            <div className="booking-card border bg-white p-3 mb-4">
                                {bookingData?.segments?.map((segment, index) => {
                                    const isLast      = index === bookingData.segments.length - 1;
                                    const nextSegment = bookingData.segments[index + 1];

                                    return (
                                        <React.Fragment key={segment.segment_id}>

                                            {/* ── room card ─────────────────────────────────────────── */}
                                            <Row>
                                                <Col md={4}>
                                                    <Image
                                                        src={
                                                            segment.property_cover_photo
                                                                ? `${segment.property_cover_photo}`
                                                                : segment.cover_photo
                                                                    ? `${segment.cover_photo}`
                                                                    : "/images/no-image.png"
                                                        }
                                                        alt={segment.room_name} width={300} height={200} className="img-fluid"
                                                    />
                                                </Col>
                                                <Col md={8}>
                                                    <p className="fw-semibold fs-20 mb-2 room-title">
                                                        <span className="fs-20">{segment.nights} night stay in {segment.room_name}</span>
                                                        <span className="room-type-badge ms-2">{segment.room_type}</span>
                                                    </p>
                                                    <p className="text-muted d-flex gap-2 align-items-start small mb-3">
                                                        <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} />
                                                        {segment.property_name}
                                                    </p>
                                                </Col>
                                            </Row>

                                            {/* ── check-in / check-out ──────────────────────────────── */}
                                            <Row className="mt-3 mb-3">
                                                <Col md={3}>
                                                    <p className="mb-1 text-secondary small">Check-in:</p>
                                                    <p className="fw-semibold mb-0">{formatDate(segment.check_in_datetime)}</p>
                                                    <small>{formatTime(segment.check_in_datetime)}</small>
                                                </Col>
                                                <Col md={3}>
                                                    <p className="mb-1 text-secondary small">Check-out:</p>
                                                    <p className="fw-semibold mb-0">{formatDate(segment.check_out_datetime)}</p>
                                                    <small>{formatTime(segment.check_out_datetime)}</small>
                                                </Col>
                                            </Row>

                                            {/* ── room details ──────────────────────────────────────── */}
                                            <div className="border-top pt-3">
                                                <p className="mb-1 font-18">Room details</p>
                                                <div className="room-specs d-flex gap-3 mb-2">
                                                    <span className="spec-item d-flex gap-2">
                                                        <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps 2
                                                    </span> |
                                                    <span className="spec-item d-flex gap-2">
                                                        <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" /> 1 king bed
                                                    </span> |
                                                    <span className="spec-item d-flex gap-2">538 sq ft</span>
                                                </div>
                                                {segment?.bedroom_preference_badge && (
                                                    <div className="room-specs d-flex gap-3 mb-2">
                                                        <span className='female-booked'>{segment.bedroom_preference_badge}</span>
                                                    </div>
                                                )}
                                                <hr />
                                            </div>

                                            {/* ── property/room change divider ──────────────────────── */}
                                            {!isLast && (
                                                <div className="room-change-info d-flex gap-2 align-items-center mb-3 mt-3 pb-3 border-bottom">
                                                    <Image src="./images/icons/switch-pro-vertical.svg" alt="switch" width={24} height={100} />
                                                    <div>
                                                        <p className="fs-20 mb-0" style={{ color:"#a6a6a6" }}>
                                                            {bookingData?.type === "mixed_room" ? "Room" : "Property"} change on
                                                        </p>
                                                        <p className="mb-0" style={{ color:"#a6a6a6" }}>
                                                            {formatDate(nextSegment.check_in_datetime)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* ── traveller section (last segment only) ────────────── */}
                                            {isLast && (
                                                <div className="traveler-section">
                                                    <p className="mb-2 font-18">Travelers in this room</p>

                                                    {/* adult count radios */}
                                                    <div className="d-flex gap-3 mb-3">
                                                        {Array.from({ length: Math.max(adultCount, 2) }, (_, i) => {
                                                            const count = i + 1;
                                                            return (
                                                                <div key={count} className='radio-select-box d-flex gap-2' style={{ background:'#F2F2F2' }}>
                                                                    <label className="form-check-label d-flex gap-2 mb-0">
                                                                        <input
                                                                            type="radio" name='adult-count'
                                                                            checked={selectedAdult === count}
                                                                            onChange={() => {
                                                                                setSelectedAdult(count);
                                                                                setTravellers(Array.from({ length: count }, () => ({
                                                                                    traveller_type: null, isGenderValidation: "",
                                                                                    caretaker: null, searchText: "", showList: false,
                                                                                    filteredUsers: [], selectedBedIndex: null
                                                                                })));
                                                                            }}
                                                                        />
                                                                        <span className="radio-checkmark"></span>
                                                                        {count} Adult{count > 1 ? "s" : ""}
                                                                    </label>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <hr />

                                                    <Row className='mb-3'>
                                                        <Col md={5}>
                                                            <label className="mb-0 d-flex gap-2 align-items-center show-my-booking">
                                                                <input className="mx-2 custom-checkbox" type="checkbox" />
                                                                Exclusively book this room for the traveler
                                                            </label>
                                                        </Col>
                                                    </Row>

                                                    {segment?.room_type === "Twin-Sharing" && (
                                                        <Row className='mb-2'>
                                                            <Col md={6}>
                                                                <p className='mb-0' style={{ background:'#F2EAFA', padding:'12px 4px', fontSize:'12px', color:'#7F32CD', lineHeight:'16px' }}>
                                                                    {/* Since this is a twin bed, one will be available for booking unless you specify it for exclusive use. */}
                                                                    If any beds left available, they can be booked by other guests unless you book the whole room exclusively
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    )}

                                                    <p className="mb-2 font-18">Traveler details</p>
                                                    <p className='small'>{`We'll use this information to book. Make sure the name matches what is on the traveler's passport or ID.`}</p>

                                                    {segment?.room_type === "Twin-Sharing" && bedroomPreference && (
                                                        <Row className='mb-2'>
                                                            <Col md={7}>
                                                                <p className='mb-0' style={{ background:'#F2EAFA', padding:'12px 4px', fontSize:'12px', color:'#7F32CD', lineHeight:'16px' }}>
                                                                    As this room has already been booked for a {bedroomPreference.toLowerCase().replace(" preferred","")}, only {bedroomPreference.toLowerCase().replace(" preferred","")} traveler bookings are allowed
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    )}

                                                    {/* ── PRIVATE ───────────────────────────────────── */}
                                                    {segment?.room_type === "Private" ? (
                                                        <div className='property-list-2'>
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <Select
                                                                        name="traveller_type"
                                                                        options={travelOption}
                                                                        placeholder="Choose Role"
                                                                        className='react_selectbox'
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                        onChange={(e) => handleSelectDropdown(e, "traveller_type")}
                                                                        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                                                    />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    {!formData.caretakers && (
                                                                        <div className="form-group">
                                                                            <Select
                                                                                options={filtereduserListData}
                                                                                styles={customStyles}
                                                                                components={{ Option: CustomOption, MenuList: CustomMenuList }}
                                                                                placeholder="Add a traveler"
                                                                                isSearchable
                                                                                isClearable
                                                                                onChange={(selected) => handleCaretakerSelect("", selected?.value || "")}
                                                                                value={formData.caretakers
                                                                                    ? filtereduserListData.find(u => u.value === formData.caretakers) ?? null
                                                                                    : null
                                                                                }
                                                                                noOptionsMessage={() => null}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* selected private traveller card */}
                                                                <div className="col-md-12">
                                                                    {formData.caretakers && userListData.filter(u => u.uid === formData.caretakers).map((item, i) => (
                                                                        <div key={i} className="selected-caretaker-container">
                                                                            <div className="manager-list-full" style={{
                                                                                display:"flex", alignItems:"center",
                                                                                border:"1px solid rgb(128 99 75 / 24%)", borderRadius:"0px",
                                                                                padding:"12px 16px", marginTop:"15px", width:"100%", gap:"4px"
                                                                            }}>
                                                                                <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:"4px", flex:1 }}>
                                                                                    <Image
                                                                                        src={item?.profile_image || (item?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg")}
                                                                                        alt={item?.first_name} width={48} height={48}
                                                                                        style={{ borderRadius:"0px", objectFit:"cover", marginRight:"10px" }}
                                                                                    />
                                                                                    <span style={{ fontWeight:500, fontSize:"14px", color:"#463527" }}>
                                                                                        {item?.first_name} {item?.last_name}<br />
                                                                                        <span style={{ fontWeight:400, fontSize:"12px", color:"#73615F", lineHeight:"10px" }}>Emp. id: {item?.employee_id}</span><br />
                                                                                        <span style={{ fontWeight:400, fontSize:"12px", color:"#73615F", lineHeight:"10px" }}>Dept: {item?.segment}</span>
                                                                                        {formData.caretakerGenderValid === true  && <span style={{ fontSize:"12px", color:"#2C734A",  marginLeft:"8px" }}>✓ Validated</span>}
                                                                                        {formData.caretakerGenderValid === false && <span style={{ fontSize:"12px", color:"#dc3545",  marginLeft:"8px" }}>✕ Validation failed</span>}
                                                                                        {formData.caretakerGenderValid === null  && <span style={{ fontSize:"12px", color:"#BF9039",  marginLeft:"8px" }}>⏳ Validating...</span>}
                                                                                    </span>
                                                                                    <span style={{ color:"#73615F" }}>|</span>
                                                                                    <span style={{ display:"flex", alignItems:"center", color:"#463527", fontSize:"14px", gap:"5px" }}>
                                                                                        <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{item?.phone_number}
                                                                                    </span>
                                                                                    <span style={{ color:"#73615F" }}>|</span>
                                                                                    <span style={{ display:"flex", alignItems:"center", color:"#463527", fontSize:"14px", gap:"5px" }}>
                                                                                        <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{item?.email}
                                                                                    </span>
                                                                                    <span style={{ color:"#73615F" }}>|</span>
                                                                                    <span style={{ display:"flex", alignItems:"center", color:"#463527", fontSize:"14px", gap:"5px" }}>
                                                                                        <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{item?.gender}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="show-edit-btn">
                                                                                    <Button variant="" className="edit-btn ms-1 me-1"
                                                                                        onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
                                                                                        Edit details
                                                                                    </Button>
                                                                                    <button type="button" className="ms-auto"
                                                                                        onClick={() => setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }))}
                                                                                        style={{ background:"none", border:"none", color:"#6B4F3F", fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
                                                                                        <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ) : (
                                                        /* ── TWIN-SHARING rows ──────────────────────── */
                                                        travellers.map((row, tIdx) => (
                                                            <div key={tIdx} className="property-list-2">
                                                                <div className="row mt-3 mb-3">

                                                                    {/* role picker */}
                                                                    <div className="col-md-4">
                                                                        <Select
                                                                            options={travelOption}
                                                                            placeholder="Choose Role"
                                                                            isSearchable={false}
                                                                            styles={customStyles}
                                                                            onChange={(e) => handleTravellerTypeChange(tIdx, e.value)}
                                                                            components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                                                        />
                                                                    </div>

                                                                    {/* bed picker (only when chooseBeds available) */}
                                                                    {chooseBeds.length > 0 && (
                                                                        <div className="col-md-3">
                                                                            <Select
                                                                                options={chooseBeds.filter(bed =>
                                                                                    !travellers.some((t, i) => i !== tIdx && t.selectedBedIndex === bed.value)
                                                                                )}
                                                                                placeholder="Choose Bed"
                                                                                isSearchable={false}
                                                                                styles={customStyles}
                                                                                value={chooseBeds.find(b => b.value === row?.selectedBedIndex) || null}
                                                                                onChange={(e) =>
                                                                                    setTravellers(prev =>
                                                                                        prev.map((item, i) =>
                                                                                            i === tIdx ? { ...item, selectedBedIndex: e.value } : item
                                                                                        )
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    {/* ── searchable traveller Select ──────────────── */}
                                                                    <div className={chooseBeds.length > 0 ? "col-md-5" : "col-md-8"}>
                                                                        <Select
                                                                            options={row.filteredUsers}
                                                                            placeholder={row.traveller_type ? "Search traveler..." : "Select a role first"}
                                                                            isDisabled={!row.traveller_type}
                                                                            isSearchable
                                                                            isClearable
                                                                            styles={{
                                                                                ...customStyles,
                                                                                control: (base, state) => ({
                                                                                    ...customStyles.control(base, state),
                                                                                    borderColor: validationBorderStyle(row.isGenderValidation, state.isFocused),
                                                                                }),
                                                                            }}
                                                                            value={
                                                                                row.caretaker
                                                                                    ? (() => {
                                                                                        const u = userListData.find(u => u.uid === row.caretaker);
                                                                                        return u ? { value: u.uid, label: `${u.first_name} ${u.last_name}`, gender: u.gender, icon: u.profile_image } : null;
                                                                                    })()
                                                                                    : null
                                                                            }
                                                                            onChange={(selected) => handleCaretakerSelect(tIdx, selected?.value || "")}
                                                                            components={{ Option: CustomOption, MenuList: CustomMenuList }}
                                                                            noOptionsMessage={() => null}
                                                                        />

                                                                        {/* validation feedback */}
                                                                        {row.isGenderValidation === "Validating" && (
                                                                            <p className="mb-0 mt-1" style={{ fontSize:"12px", color:"#BF9039" }}>⏳ Validating gender...</p>
                                                                        )}
                                                                        {row.isGenderValidation === "Error" && (
                                                                            <p className="mb-0 mt-1" style={{ fontSize:"12px", color:"#dc3545" }}>✕ Gender validation failed — this traveler is not allowed in this room</p>
                                                                        )}
                                                                        {row.isGenderValidation === "Success" && row.caretaker && (
                                                                            <p className="mb-0 mt-1" style={{ fontSize:"12px", color:"#2C734A" }}>✓ Gender validated</p>
                                                                        )}
                                                                    </div>

                                                                    {/* selected traveller card */}
                                                                    <div className="col-md-12">
                                                                        {row.caretaker && userListData.filter(u => u.uid === row.caretaker).map((item, i) => (
                                                                            <div key={i} className="selected-caretaker-container">
                                                                                <div className="manager-list-full" style={{
                                                                                    display:"flex", alignItems:"center",
                                                                                    border:"1px solid rgb(128 99 75 / 24%)", borderRadius:"0px",
                                                                                    padding:"12px 16px", marginTop:"15px", width:"100%", gap:"4px"
                                                                                }}>
                                                                                    <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:"4px", flex:1 }}>
                                                                                        <Image
                                                                                            src={item?.profile_image || (item?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg")}
                                                                                            alt={item?.first_name} width={48} height={48}
                                                                                            style={{ borderRadius:"0px", objectFit:"cover", marginRight:"10px" }}
                                                                                        />
                                                                                        <span style={{ fontWeight:500, fontSize:"14px", color:"#463527" }}>
                                                                                            {item?.first_name} {item?.last_name}<br />
                                                                                            <span style={{ fontWeight:400, fontSize:"12px", color:"#73615F", lineHeight:"10px" }}>Emp. id: {item?.employee_id}</span><br />
                                                                                            <span style={{ fontWeight:400, fontSize:"12px", color:"#73615F", lineHeight:"10px" }}>Dept: {item?.segment}</span>
                                                                                            {row.isGenderValidation === "Success"    && <span style={{ fontSize:"12px", color:"#2C734A",  marginLeft:"8px" }}>✓ Validated</span>}
                                                                                            {row.isGenderValidation === "Error"      && <span style={{ fontSize:"12px", color:"#dc3545",  marginLeft:"8px" }}>✕ Validation failed</span>}
                                                                                            {row.isGenderValidation === "Validating" && <span style={{ fontSize:"12px", color:"#BF9039",  marginLeft:"8px" }}>⏳ Validating...</span>}
                                                                                        </span>
                                                                                        <span style={{ color:"#73615F" }}>|</span>
                                                                                        <span style={{ display:"flex", alignItems:"center", color:"#463527", fontSize:"14px", gap:"5px" }}>
                                                                                            <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{item?.phone_number}
                                                                                        </span>
                                                                                        <span style={{ color:"#73615F" }}>|</span>
                                                                                        <span style={{ display:"flex", alignItems:"center", color:"#463527", fontSize:"14px", gap:"5px" }}>
                                                                                            <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{item?.email}
                                                                                        </span>
                                                                                        <span style={{ color:"#73615F" }}>|</span>
                                                                                        <span style={{ display:"flex", alignItems:"center", color:"#463527", fontSize:"14px", gap:"5px" }}>
                                                                                            <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{item?.gender}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="show-edit-btn">
                                                                                        <Button variant="" className="edit-btn ms-1 me-1"
                                                                                            onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
                                                                                            Edit details
                                                                                        </Button>
                                                                                        <button type="button" className="ms-auto"
                                                                                            onClick={() => handleCaretakerSelect(tIdx, "")}
                                                                                            style={{ background:"none", border:"none", color:"#6B4F3F", fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
                                                                                            <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            <p className='d-flex gap-2 fw-medium justify-content-end'>
                                Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
                            </p>

                            {/* ── arrival details ───────────────────────────────────── */}
                            <div className="arrival-section border-top mt-4 pt-5 mb-5">
                                <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
                                <p className="text-secondary mb-2">This information helps in operational planning, legal compliance, and personalized service.</p>
                                <Form.Group className='mb-4 mt-4' controlId="arrival_time">
                                    <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
                                    <Select onChange={(e) => updateArrivalDetails("arrival_time", e.value)} options={timeOption}
                                        placeholder="Select time" className="react_selectbox" isSearchable={false} styles={customStyles} />
                                </Form.Group>
                                <Form.Group className='mb-4' controlId="mode_of_arrival">
                                    <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
                                    <Select options={arrivalOption} placeholder="Select Mode" className="react_selectbox" isSearchable={false}
                                        styles={customStyles}
                                        value={arrivalOption.find(opt => opt.value === formData.arrival_details.mode_of_arrival) || null}
                                        onChange={(e) => updateArrivalDetails("mode_of_arrival", e.value)} />
                                </Form.Group>
                                <div className='mb-4 form-group'>
                                    <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
                                    <input type="text" className="form-control"
                                        placeholder="Enter number e.g. MADGAON LTT EXP #11100"
                                        value={formData.arrival_details.transport_number}
                                        onChange={(e) => updateArrivalDetails("transport_number", e.target.value)} />
                                </div>
                            </div>

                            <hr />

                            {/* ── additional comments ───────────────────────────────── */}
                            <div className="arrival-section mt-4 pt-4">
                                <h3 className="font-24 mb-2">Additional Comments</h3>
                                <div className='mb-5 form-group'>
                                    <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
                                    <input type="text"
                                        onChange={(e) => setFormData(prev => ({ ...prev, company_booking_reference: e.target.value }))}
                                        placeholder='Reference number to be entered for your internal purpose (optional)'
                                        className='form-control' />
                                </div>
                            </div>

                            <hr />

                            {/* ── other essential details ───────────────────────────── */}
                            <div className="arrival-section mt-4 pt-3 mb-5">
                                <h3 className="font-24 mb-2">Other Essential Details</h3>
                                <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
                                <div className='mb-4 form-group'>
                                    <textarea className='form-control'
                                        onChange={(e) => setFormData(prev => ({ ...prev, additional_comments: e.target.value }))}
                                        placeholder='Got any thoughts or questions? Add them here! (Optional)' />
                                </div>
                            </div>

                            <hr />

                            {/* ── confirmation email ────────────────────────────────── */}
                            <div className="confirmation-email-section my-5 pb-5">
                                <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3' style={{ maxWidth:'360px', cursor:'pointer' }}>
                                    <Form.Check type="checkbox" label="Send copy of confirmation email"
                                        checked={formData.send_confirmation_email}
                                        onChange={(e) => {
                                            updateFormData("send_confirmation_email", e.target.checked);
                                            setIsEmailEnabled(e.target.checked);
                                            setReceivers(e.target.checked ? [{ id: 1, email: '' }] : []);
                                        }} />
                                </label>
                                {isEmailEnabled && (
                                    <div className="email-content">
                                        <p className='fw-bold' style={{ color:'#6B4F3F' }}>Add info</p>
                                        {receivers.map((receiver, idx) => (
                                            <div key={receiver.id} className="receiver-item">
                                                {idx > 0 && (<><hr className="my-4" /><p className='fw-bold mb-3'>Receiver {idx + 1}</p></>)}
                                                <div className='form-group mb-4'>
                                                    <label className="form-label fw-medium">Email</label>
                                                    <div className='row align-items-center'>
                                                        <div className='col-md-5'>
                                                            <input type='email'
                                                                className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
                                                                placeholder='Enter receiver email'
                                                                value={receiver.email}
                                                                onChange={(e) => handleEmailChange(receiver.id, e.target.value)} />
                                                            {receiver.email && !isValidEmail(receiver.email) && (
                                                                <div className="invalid-feedback d-block">Please enter a valid email address</div>
                                                            )}
                                                        </div>
                                                        <div className='col-md-1 d-flex align-items-center'>
                                                            {idx === 0 ? (
                                                                <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0" disabled={receivers.length >= 5}>
                                                                    <Image src='./images/icons/add_circle.svg' alt='Add' width={32} height={32} style={{ opacity: receivers.length >= 5 ? 0.5 : 1 }} />
                                                                </button>
                                                            ) : (
                                                                <button type="button" onClick={() => handleRemoveReceiver(receiver.id)} className="btn btn-link p-0">
                                                                    <Image src='./images/icons/close-circle.svg' alt='Remove' width={32} height={32} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {receivers.length >= 5 && <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>}
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* ── booking summary ───────────────────────────────────────── */}
                        <Col md={4} className='ps-5'>
                            <div className='booking-summary-colum'>
                                <div className="d-flex align-items-center justify-between mb-4">
                                    <h4 className='font-24 mb-0'>Booking Summary</h4>
                                    <label className='mb-0 d-flex gap-2 align-items-center'>
                                        <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices}
                                            onChange={(e) => setShowPrices(e.target.checked)} />
                                        Show prices
                                    </label>
                                </div>
                                <div className="booking-summary">
                                    <div className="summary-details">
                                        <div className="summary-row">
                                            <span className="summary-label">BRs Selected</span>
                                            <span className="summary-value">{numSegments}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="summary-label">Number of Rooms</span>
                                            <span className="summary-value">{numSegments} Room{numSegments > 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="summary-label">Travelers</span>
                                            <span className="summary-value">{selectedAdult} Adult{selectedAdult > 1 ? "s" : ""}</span>
                                        </div>
                                        {bookingData?.segments?.map((seg) => (
                                            <div key={seg.segment_id} className="summary-row detailed">
                                                <span className="summary-label">{seg.room_name} Pricing</span>
                                                <div className="summary-value-detailed">
                                                    <div className="price-desc">{selectedAdult} Guest x {seg.nights} nights</div>
                                                    {showPrices && <div className="price-amount">₹{seg.segment_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
                                                    <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="total-section">
                                            <span className="total-label">Total Price</span>
                                            <div className="total-value-detailed">
                                                <div className="total-desc">{selectedAdult} Guest x {totalNights} nights</div>
                                                {showPrices && <div className="total-amount">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
                                                <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={handleSubmitReserve} className="confirm-btn" disabled={isSubmitting}
                                        style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}>
                                        {isSubmitting ? "Validating & Reserving..." : "Confirm and Reserve"}
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* ── Edit Stay Details Modal ───────────────────────────────────────── */}
            <Modal show={addTravels2} onHide={removeTravel2} animation={false} centered size="xl" className='custom-theme-modal-2'>
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
                    <Modal.Title>Edit Stay Details</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor:'pointer' }} onClick={removeTravel2} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='booking-filter'>
                        <Row className='gap-0'>
                            <Col md={2} className='gap-1'>
                                <div className='form-group'>
                                    <label className='text-black'>Which company?</label>
                                    <Select options={companyList} placeholder="Select company" className="react_selectbox" isSearchable={false}
                                        value={companyList.find(c => c.value === searchFieldData.company_id) || null}
                                        onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.value })}
                                        styles={customStyles} />
                                </div>
                            </Col>
                            <Col md={2} className='gap-1'>
                                <div className='form-group'>
                                    <label className='text-black'>Where to?</label>
                                    <Select options={cityList} placeholder="Select city" className="react_selectbox" isSearchable={false}
                                        getOptionLabel={(o) => o.city} getOptionValue={(o) => o.city}
                                        value={cityList.find(c => c.city === searchFieldData.city) || null}
                                        onChange={(o) => setSearchFieldData({ ...searchFieldData, city: o.city })}
                                        styles={customStyles} />
                                </div>
                            </Col>
                            <Col md={4} className='gap-2'>
                                <div className='d-flex gap-0'>
                                    <div className='d-flex form-group flex-col w-50'>
                                        <label className='text-black'>Check-in date</label>
                                        <DatePicker selected={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
                                            onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
                                            minDate={new Date()} className="form-control custom-date-picker" dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
                                    </div>
                                    <div className='d-flex form-group flex-col w-50'>
                                        <label className='text-black'>Checkout date</label>
                                        <DatePicker selected={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
                                            onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
                                            minDate={new Date()} className="form-control custom-date-picker" dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
                                    </div>
                                </div>
                            </Col>
                            <Col md={4} className='gap-1'>
                                <Row>
                                    <Col md={7}>
                                        <div className='form-group'>
                                            <label className='text-black'>No. of Rooms & Guests</label>
                                            <div className="react_selectbox custom-dropdown" onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}>
                                                <div className="selected-value">
                                                    {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((s, r) => s + r.adults, 0)} guest${rooms.reduce((s, r) => s + r.adults, 0) > 1 ? 's' : ''}`}
                                                </div>
                                                {isRoomDropdownOpen && (
                                                    <div className="room-dropdown-content">
                                                        {rooms.map((room) => (
                                                            <div key={room.id} className="room-section">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="room-header">Room {room.id}</div>
                                                                    {rooms.length > 1 && (
                                                                        <button className="delete-room-btn" onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }}>
                                                                            <Image src='./images/icons/delete_b.svg' width={20} height={20} alt="delete" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="guest-counter">
                                                                    <label>Adults</label>
                                                                    <div className="counter-controls">
                                                                        <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleAdultChange(room.id, -1); }}>-</button>
                                                                        <span>{room.adults}</span>
                                                                        <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleAdultChange(room.id, 1); }}>+</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="d-flex align-items-center justify-between">
                                                            <button className="add-room-btn" onClick={(e) => { e.stopPropagation(); addRoom(); }}>
                                                                <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' width={24} height={24} /> Add a room
                                                            </button>
                                                            <button className="done-btn" onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsRoomDropdownOpen(false);
                                                                setSearchFieldData({ ...searchFieldData, rooms: rooms.map(r => ({ adults: r.adults })) });
                                                            }}>Done</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        <div className='form-group h-100 align-items-center d-flex pt-1'>
                                            <Button className="mt-4" style={{ background:'#2C734A', width:'100%', height:'48px', textAlign:'center', borderRadius:'0', color:'#fff' }}
                                                variant='' onClick={handleUpdateSearch}>Update Search</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>

            {/* ── Add Person Modal ─────────────────────────────────────────────── */}
            <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} roleOption={role} companyList={companyList} addTravel={addTravel} />

            {/* ── Price Breakdown Modal ────────────────────────────────────────── */}
            <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
                    <Modal.Title style={{ fontSize:'20px', fontFamily:'Gilroy', fontWeight:'500' }}>Total Price breakdown</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor:'pointer' }} onClick={removeBreakdown} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='booking-filter'>
                        {bookingSummary?.segments?.map((seg) => (
                            <div key={seg.segment_id} className='d-flex justify-between pt-2 pb-2'>
                                <span>{seg.room_name} x {selectedAdult} guest x {seg.nights} nights</span>
                                <span style={{ color:'#BF9039', fontWeight:'500' }}>₹{seg.segment_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                        <div className='d-flex justify-between pt-2 pb-2'>
                            <span>CasaMelhor Service fee</span>
                            <span style={{ color:'#BF9039', fontWeight:'500' }}>₹{bookingSummary?.serviceFee ?? 0}</span>
                        </div>
                        <div className='d-flex justify-between pt-2 pb-2'>
                            <span>Taxes</span>
                            <span style={{ color:'#BF9039', fontWeight:'500' }}>₹{bookingSummary?.totalTax?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? "0.00"}</span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between'>
                    <span className='fs-20'>Total</span>
                    <span className='fs-20' style={{ color:'#BF9039', fontWeight:'500' }}>
                        ₹{bookingSummary?.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? "0.00"}
                    </span>
                </Modal.Footer>
            </Modal>

            {/* ── Booking Confirmed Modal ──────────────────────────────────────── */}
            <Modal show={addReserves} onHide={removeReserve} animation={false} centered className='custom-theme-modal-2 modal-460'>
                <Modal.Body className="pt-4 pb-4">
                    {bookingConfirmedData?.length > 0 && (
                        <div className="flex items-center justify-center gap-6">
                            <button onClick={() => setCurrent((current - 1 + bookingConfirmedData.length) % bookingConfirmedData.length)}
                                className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none">‹</button>
                            <div className="text-center min-w-[260px]">
                                <p className="text-base font-medium mb-1">The booking has been confirmed and updated</p>
                                <p className="flex items-center justify-center gap-2 text-sm mb-2">
                                    Booking ID: <span className="font-semibold text-gray-700">{bookingConfirmedData[current]?.booking_number}</span>
                                    <Image src="./images/icons/content_copy.svg" alt="copy" width={16} height={16} className="cursor-pointer"
                                        onClick={() => navigator.clipboard.writeText(bookingConfirmedData[current]?.booking_number)} />
                                </p>
                                <div className="flex justify-center gap-1 mt-2">
                                    {bookingConfirmedData.map((_, i) => (
                                        <span key={i} className={`w-[6px] h-[6px] rounded-full transition-all ${current === i ? "bg-black" : "bg-gray-300"}`}></span>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setCurrent((current + 1) % bookingConfirmedData.length)}
                                className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none">›</button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between flex-col'>
                    <Link href={`/BookingDetails/${bookingConfirmedData[current]?.uid}`}
                        className="p-2 w-100 text-center d-flex align-items-center justify-content-center"
                        style={{ background:"#2C734A", borderRadius:"0", color:"#fff", minHeight:"58px", textDecoration:"none" }}>
                        View Booking Details
                    </Link>
                    <Link href="/CreateBooking"
                        className="text-center justify-center edit-btn w-100 d-flex align-items-center justify-content-center"
                        style={{ minHeight:"58px", textDecoration:"none" }}>
                        Create Another Booking
                    </Link>
                </Modal.Footer>
            </Modal>
        </>
    );
}