// "use client"
// import React, { useEffect, useRef, useState } from 'react'
// import Header from '../Header/Header'
// import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { components } from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
// import { calculateNights, convertTo24Hour, formatDateMonthYear, formatRoomsAndGuests, formatStayDates, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
// import { companyListAPI, CreateBookingPost, PropertyListFullApi, UserListAPI, UserRoleListAPI, validateGender } from '@/services/provider';
// import { ArrivalDetailValidation } from '@/utils/validation';
// import toast, { Toaster } from 'react-hot-toast';

// export default function MultiRoomsReserve() {
//     // ─── Local storage ────────────────────────────────────────────────────────
//     const multiroomsSelected = JSON.parse(getItemLocalStorage("multiroomreserve"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"));

//     const router = useRouter();
//     const [current, setCurrent] = useState(0);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // ─── Debounce timers: rowSearchTimers.current[cartIndex][travelerIndex] ───
//     const rowSearchTimers = useRef({});
//     // ─── User object cache by uid so selected card always renders ─────────────
//     const selectedUsersCache = useRef({});

//     // ─── Search edit modal state ──────────────────────────────────────────────
//     const [searchFieldData, setSearchFieldData] = useState({
//         company_id: 0,
//         city: "",
//         check_in_date: "",
//         check_out_date: "",
//         rooms: [],
//     });

//     // ─── Arrival / comment form ───────────────────────────────────────────────
//     const [formData, setFormData] = useState({
//         dateArrival: "",
//         timeArrival: "",
//         modeArrival: "",
//         FlightTrainNumber: "",
//         refnumber: "",
//         essentialDetails: ""
//     });
//     const [errorMessages, setErrorMessages] = useState({});

//     // ─── Cart: one entry per selected room, each enriched with travelerDetails ─
//     const [cartItem, setCartItem] = useState([]);

//     const [showPrices, setShowPrices] = useState(false);
//     const [bookingConfirmedData, setBookingConfirmedData] = useState([]);
//     const [isExclusiveBooking, setIsExclusiveBooking] = useState(false);

//     // ─── Modal visibility ─────────────────────────────────────────────────────
//     const [addTravels, addTravelsetShow] = useState(false);
//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);

//     const [addBreakdowns, addBreakdownsetShow] = useState(false);
//     const removeBreakdown = () => addBreakdownsetShow(false);
//     const addbreakdown = () => addBreakdownsetShow(true);

//     const [showReserveModal, setShowReserveModal] = useState(false);
//     const removeReserve = () => setShowReserveModal(false);

//     const [addTravels2, addTravel2setShow] = useState(false);
//     const removeTravel2 = () => addTravel2setShow(false);
//     const addTravel2 = () => addTravel2setShow(true);

//     const countNights = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);
//         const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
//         return nights;
//     }

//     // ─── Per-slot search state ────────────────────────────────────────────────
//     // rowSearchLoading[cartIndex][travelerIndex] = true/false
//     const [rowSearchLoading, setRowSearchLoading] = useState({});

//     // ─── Initialise cartItem from localStorage ────────────────────────────────
//     useEffect(() => {
//         if (Array.isArray(multiroomsSelected) && multiroomsSelected.length) {
//             const initialCart = multiroomsSelected.map(item => ({
//                 ...item,
//                 travelerDetails: Array.from(
//                     { length: item.room_type === "Private" ? 1 : item.adults },
//                     (_, i) => ({
//                         id: `${item.room_id}-${i}`,
//                         data: null,
//                         bedIndex: null,
//                         isGenderValidation: "",
//                         // per-slot search text and dropdown list
//                         searchText: "",
//                         showList: false,
//                         filteredUsers: [],
//                     })
//                 )
//             }));
//             setCartItem(initialCart);
//         }
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // ─── Helpers: set/read nested loading flag ────────────────────────────────
//     const setSlotLoading = (cartIndex, travelerIndex, val) => {
//         setRowSearchLoading(prev => ({
//             ...prev,
//             [cartIndex]: { ...(prev[cartIndex] || {}), [travelerIndex]: val }
//         }));
//     };
//     const isSlotLoading = (cartIndex, travelerIndex) =>
//         !!rowSearchLoading?.[cartIndex]?.[travelerIndex];

//     // ─── Core API fetch for one slot ─────────────────────────────────────────
//     // Calls UserListAPI, applies role + gender-preference filters, pushes into
//     // cartItem[cartIndex].travelerDetails[travelerIndex].filteredUsers
//     const fetchUsersForSlot = async (cartIndex, travelerIndex, searchTerm, travellerType) => {
//         setSlotLoading(cartIndex, travelerIndex, true);
//         try {
//             const response = await UserListAPI("All", '', searchTerm);
//             if (response?.data?.success) {
//                 let result = response.data.response;

//                 // Role filter — mirror MultiSwitchReserve logic
//                 if (travellerType === "External-Guest") {
//                     result = result.filter(u => u?.user_role?.role_name === "External");
//                 } else if (travellerType === "Company-Employee") {
//                     result = result.filter(u =>
//                         u?.user_role?.role_name !== "External" &&
//                         u?.user_company?.id === bacisSearchDetails?.company_id
//                     );
//                 }

//                 // Gender preference filter
//                 const badge = cartItem[cartIndex]?.bedroom_preference_badge;
//                 if (badge === "FEMALE PREFERRED") result = result.filter(u => u.gender === "Female");
//                 if (badge === "MALE PREFERRED") result = result.filter(u => u.gender === "Male");

//                 setCartItem(prev =>
//                     prev.map((room, cIdx) =>
//                         cIdx !== cartIndex ? room : {
//                             ...room,
//                             travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                                 tIdx !== travelerIndex ? t : { ...t, filteredUsers: result }
//                             )
//                         }
//                     )
//                 );
//             }
//         } catch (err) {
//             console.error("fetchUsersForSlot error:", err);
//         } finally {
//             setSlotLoading(cartIndex, travelerIndex, false);
//         }
//     };

//     // ─── Debounced wrapper — 350 ms per slot ─────────────────────────────────
//     const debouncedFetchUsersForSlot = (cartIndex, travelerIndex, searchTerm, travellerType) => {
//         const key = `${cartIndex}-${travelerIndex}`;
//         if (rowSearchTimers.current[key]) clearTimeout(rowSearchTimers.current[key]);
//         rowSearchTimers.current[key] = setTimeout(() => {
//             fetchUsersForSlot(cartIndex, travelerIndex, searchTerm, travellerType);
//         }, 350);
//     };

//     // ─── Dropdown helpers ─────────────────────────────────────────────────────
//     const travelOption = [
//         { value: "Company-Employee", label: "Company employee", icon: "../images/icons/hail.svg" },
//         { value: "External-Guest", label: "External", icon: "../images/icons/short_stay.svg" },
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

//     // ─── Role picker change: clear slot, immediately fetch from API ───────────
//     const handleSelectDropdown = (e, cartIndex, travelerIndex) => {
//         const travellerType = e.value;

//         // 1. Store the selected role on the traveller slot, clear any previous data
//         setCartItem(prev =>
//             prev.map((room, cIdx) =>
//                 cIdx !== cartIndex ? room : {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                         tIdx !== travelerIndex ? t : {
//                             ...t,
//                             traveller_type: travellerType,
//                             data: null,
//                             searchText: "",
//                             filteredUsers: [],
//                             isGenderValidation: "",
//                         }
//                     )
//                 }
//             )
//         );

//         // 2. Immediate fetch (no debounce — role just changed)
//         fetchUsersForSlot(cartIndex, travelerIndex, "", travellerType);
//     };

//     // ─── Arrival form handlers ────────────────────────────────────────────────
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         const { error } = ArrivalDetailValidation({ [name]: value });
//         setErrorMessages(prev => ({ ...prev, ...error }));
//     };

//     const handleSelectChange = (value, name) => {
//         setFormData(prev => ({ ...prev, [name]: name === "timeArrival" ? convertTo24Hour(value) : value }));
//         const { error } = ArrivalDetailValidation({ [name]: value });
//         setErrorMessages(prev => ({ ...prev, ...error }));
//     };

//     const timeOption = generateTimeOptions12Format(30);
//     const arrivalOption = [
//         { value: "Flight", label: "Flight" },
//         { value: "Train", label: "Train" }
//     ];

//     // ─── Edit stay details ────────────────────────────────────────────────────
//     const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
//     const [companyList, setCompanyList] = useState([]);
//     const [role, setRole] = useState([]);
//     const [cityList, setCityList] = useState([]);
//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

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
//         } catch (error) { console.log(error); }
//     };

//     const getUserListDataAPI = async () => {
//         try {
//             const response = await UserRoleListAPI(loginData?.uid);
//             if (response?.data?.success) {
//                 setRole(response.data.response.map(val => ({
//                     value: val?.uid,
//                     label: val?.role_name,
//                     icon: val?.role_icon,
//                 })));
//             }
//         } catch (error) { console.error("userListData error:", error); }
//     };

//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 setCompanyList(response.data.response.map(item => ({
//                     value: item.id,
//                     label: item.company_name
//                 })));
//             }
//         } catch (error) { console.log(error); }
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
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
//             });
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })));
//         }
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const handleUpdateSearch = () => {
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
//         setTimeout(() => {
//             removeItemLocalStorage("multiroomreserve");
//             router.push('/Searchresult');
//         }, 0);
//     };

//     // Adult count change — rebuilds travelerDetails for that room
//     const handleAdultChange = (e, roomData) => {
//         const newCount = Number(e.target.value);
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid !== roomData.room_uid ? room : {
//                     ...room,
//                     adults: newCount,
//                     travelerDetails: Array.from({ length: newCount }, (_, i) => ({
//                         id: `${room.room_id}-${i}`,
//                         data: null,
//                         bedIndex: null,
//                         isGenderValidation: "",
//                         searchText: "",
//                         showList: false,
//                         filteredUsers: [],
//                         traveller_type: null,
//                     }))
//                 }
//             )
//         );
//     };

//     // Modal room counter (Edit Stay modal only)
//     const handleModalAdultChange = (roomId, change) => {
//         setRooms(rooms.map(r => {
//             if (r.id === roomId) {
//                 const nv = r.adults + change;
//                 return { ...r, adults: nv >= 1 ? nv : 1 };
//             }
//             return r;
//         }));
//     };

//     const addRoom = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
//     const deleteRoom = (roomId) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== roomId)); };

//     const handleBedBookIndex = (e, roomData, travelerIndex) => {
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid !== roomData.room_uid ? room : {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map((t, i) =>
//                         i === travelerIndex ? { ...t, bedIndex: e.value } : t
//                     )
//                 }
//             )
//         );
//     };

//     const customStyles = {
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected ? "#4635271F" : state.isFocused ? "#4635271F" : "inherit",
//             color: "black",
//             cursor: "pointer",
//         }),
//     };

//     // ─── Caretaker remove ─────────────────────────────────────────────────────
//     const handleCaretakerRemove = (roomData, travelerId) => {
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid !== roomData.room_uid ? room : {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map(t =>
//                         t.id !== travelerId ? t : {
//                             ...t,
//                             data: null,
//                             searchText: "",
//                             filteredUsers: [],
//                             isGenderValidation: "",
//                         }
//                     )
//                 }
//             )
//         );
//     };

//     // ─── Email recipients ─────────────────────────────────────────────────────
//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([{ id: 1, email: '' }]);

//     const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
//     const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
//     const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
//     const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//     // ─── Gender validation ────────────────────────────────────────────────────
//     const validateTravellerGender = async (roomData, travelerUid, bedIndex) => {
//         try {
//             const payload = {
//                 room_uid: roomData.room_uid,
//                 traveler_uid: travelerUid,
//                 check_in_date: roomData.check_in_date,
//                 check_out_date: roomData.check_out_date,
//                 bed_index: bedIndex,
//             };
//             const response = await validateGender(payload);
//             return response?.data?.response?.valid === true;
//         } catch {
//             return false;
//         }
//     };

//     // ─── Caretaker selected from dropdown ────────────────────────────────────
//     const handleCaretakerSelectWithValidation = async (
//         roomData, cartIndex, travelerIndex, caretaker
//     ) => {
//         // Cache user object so card survives filteredUsers being cleared
//         if (caretaker?.uid) selectedUsersCache.current[caretaker.uid] = caretaker;

//         const displayName = `${caretaker.first_name} ${caretaker.last_name}`;

//         // Set data + clear dropdown list immediately
//         setCartItem(prev =>
//             prev.map((room, cIdx) =>
//                 cIdx !== cartIndex ? room : {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                         tIdx !== travelerIndex ? t : {
//                             ...t,
//                             data: caretaker,
//                             searchText: displayName,
//                             showList: false,
//                             filteredUsers: [],   // clear after selection
//                             isGenderValidation: roomData.room_type !== "Private" ? "Validating" : "",
//                         }
//                     )
//                 }
//             )
//         );

//         // Only validate for non-private rooms
//         if (roomData.room_type !== "Private") {
//             const isValid = await validateTravellerGender(roomData, caretaker.uid, travelerIndex);

//             setCartItem(prev =>
//                 prev.map((room, cIdx) =>
//                     cIdx !== cartIndex ? room : {
//                         ...room,
//                         travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                             tIdx !== travelerIndex ? t : {
//                                 ...t,
//                                 isGenderValidation: isValid ? "Success" : "Error"
//                             }
//                         )
//                     }
//                 )
//             );

//             isValid
//                 ? toast.success(`Traveler ${travelerIndex + 1}: Gender validated successfully`)
//                 : toast.error(`Traveler ${travelerIndex + 1}: Gender validation failed — this traveler is not allowed in this room`);
//         }
//     };

//     // ─── Pre-submit full gender validation ───────────────────────────────────
//     const validateAllTravellersGender = async () => {
//         let allValid = true;

//         for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
//             const room = cartItem[cartIndex];
//             if (room.room_type === "Private") continue;

//             for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
//                 const traveler = room.travelerDetails[tIdx];
//                 if (!traveler.data) {
//                     toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: No traveler selected`);
//                     allValid = false;
//                     continue;
//                 }
//                 const isValid = await validateTravellerGender(room, traveler.data.uid, tIdx);

//                 setCartItem(prev =>
//                     prev.map((r, cIdx) =>
//                         cIdx !== cartIndex ? r : {
//                             ...r,
//                             travelerDetails: r.travelerDetails.map((t, i) =>
//                                 i !== tIdx ? t : { ...t, isGenderValidation: isValid ? "Success" : "Error" }
//                             )
//                         }
//                     )
//                 );

//                 if (!isValid) {
//                     toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: Gender validation failed — booking blocked`);
//                     allValid = false;
//                 }
//             }
//         }
//         return allValid;
//     };

//     // ─── Submit booking ───────────────────────────────────────────────────────
//     const cleanPayload = (obj) => {
//         if (Array.isArray(obj)) {
//             return obj.map(cleanPayload);
//         } else if (obj !== null && typeof obj === "object") {
//             return Object.fromEntries(
//                 Object.entries(obj)
//                     .filter(([_, v]) => v !== null && v !== undefined && v !== "")
//                     .map(([k, v]) => [k, cleanPayload(v)])
//             );
//         }
//         return obj;
//     };
//     const handleSubmitReserve = async () => {
//         const { error, isValid } = ArrivalDetailValidation(formData);
//         setErrorMessages(error);
//         if (!isValid) return;

//         for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
//             const room = cartItem[cartIndex];
//             for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
//                 if (!room.travelerDetails[tIdx].data) {
//                     toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: Please select a traveler`);
//                     return;
//                 }
//             }
//         }

//         setIsSubmitting(true);
//         const allGenderValid = await validateAllTravellersGender();
//         if (!allGenderValid) {
//             toast.error("Booking blocked: one or more travelers failed gender validation");
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const cartData = cartItem.map(item => ({
//                 property_uid: item.property_uid,
//                 room_uid: item.room_uid,
//                 bed_index: item.room_type === "Private" ? null : (item.travelerDetails[0]?.bedIndex ?? null),
//                 check_in_date: item.check_in_date,
//                 check_out_date: item.check_out_date
//             }));

//             const travelerAssignments = cartItem.flatMap((item, cartIndex) =>
//                 item.travelerDetails.map(() => ({
//                     cart_item_index: cartIndex,
//                     traveler_id: item.travelerDetails[0]?.data?.uid,
//                     is_exclusive_booking: isExclusiveBooking
//                 }))
//             ).filter(a => a.traveler_id);

//             // Rebuild properly: one assignment per traveller
//             const travelerAssignmentsFull = cartItem.flatMap((item, cartIndex) =>
//                 item.travelerDetails.map((traveler) => ({
//                     cart_item_index: cartIndex,
//                     traveler_id: traveler.data?.uid,
//                     is_exclusive_booking: isExclusiveBooking
//                 }))
//             ).filter(a => a.traveler_id);

//             const payload = {
//                 company_id: searchFieldData.company_id || bacisSearchDetails?.company_id,
//                 cart_items: cartData,
//                 traveler_assignments: travelerAssignmentsFull,
//                 arrival_details: {
//                     arrival_date: formatYMD(formData.dateArrival),
//                     arrival_time: formData.timeArrival,
//                     mode_of_arrival: formData.modeArrival,
//                     transport_number: formData.FlightTrainNumber
//                 },
//                 additional_comments: formData.essentialDetails,
//                 company_booking_reference: formData.refnumber,
//                 send_confirmation_email: isEmailEnabled,
//                 additional_email_recipients: receivers.map(r => r.email)
//             };

//             const response = await CreateBookingPost(cleanPayload(payload));
//             if (response.data.success) {
//                 setBookingConfirmedData(response.data.response.bookings);
//                 setShowReserveModal(true);
//                 toast.success("Booking Created Successfully");
//                 removeItemLocalStorage("multiroomreserve");
//                 removeItemLocalStorage("searchParam");
//                 removeItemLocalStorage("basicSecrchItemObj");
//             } else {
//                 response.data.response.validation_errors.forEach(el => toast.error(el.error));
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to create booking");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // ─── Booking summary computed values ─────────────────────────────────────
//     const totalNights = cartItem.length > 0
//         ? calculateNights(cartItem[0]?.check_in_date, cartItem[0]?.check_out_date)
//         : 0;
//     const totalPrice = cartItem.reduce((sum, item) =>
//         sum + (item.price_per_night || 0) * calculateNights(item.check_in_date, item.check_out_date), 0
//     );
//     const totalTravelers = cartItem.reduce((sum, item) =>
//         sum + (item.travelerDetails?.length || 0), 0
//     );

//     // ─── Render ───────────────────────────────────────────────────────────────
//     return (
//         <>
//             <Header />
//             <Toaster position="top-right" />

//             <div className='searching-result-top'>
//                 <Container>
//                     <div className='search-result-header'>
//                         <h4>{searchBookingData?.company_name} | {searchBookingData?.city}</h4>
//                         <p className='mb-0'>
//                             <Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />
//                             {formatStayDates(searchBookingData?.check_in_date, searchBookingData?.check_out_date)} |
//                             <Image src='./images/icons/group.svg' alt='group' className="img-fluid" width={24} height={24} />
//                             {formatRoomsAndGuests(bacisSearchDetails?.rooms)}
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
//                             <h4 className='font-24 mb-4'>Review Your Selected BRs ({cartItem.length})</h4>

//                             {cartItem.map((cart, cartIndex) => (
//                                 <div key={`cart-${cart.room_uid}`}>
//                                     {/* Bedroom header */}
//                                     <div className='d-flex align-items-center gap-3 mb-3'>
//                                         <Image src='./images/icons/down-vector.svg' className='img-fluid' alt='down' width={32} height={32} />
//                                         <h4 className='font-24 mb-0'>Bedroom {cart?.bedroom_index}</h4>
//                                         <span style={{ color: '#463527' }}>{cart?.adults} Adult{cart?.adults > 1 ? "s" : ""}</span>
//                                     </div>

//                                     <div className="booking-card border bg-white p-3 mb-4">
//                                         {/* Room image + title */}
//                                         <Row>
//                                             <Col md={4}>
//                                                 <Image
//                                                     src={cart.cover_photo ? `https://alicedevapi.casamelhor.in${cart.cover_photo}` : "/images/icons/room-1.jpg"}
//                                                     alt="Room Image" width={300} height={200} className="img-fluid"
//                                                 />
//                                             </Col>
//                                             <Col md={8}>
//                                                 <p className="fw-semibold fs-20 mb-2 room-title">
//                                                     {calculateNights(cart.check_in_date, cart.check_out_date)} night stay in {cart?.room_name}
//                                                     <span className='room-type-badge ms-2'>{cart?.room_type}</span>
//                                                 </p>
//                                                 <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                     <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} className="img-fluid" />
//                                                     {cart.property_name}<br />
//                                                     {cart?.property_address}, {cart?.city}, {cart?.state}
//                                                 </p>
//                                             </Col>
//                                         </Row>

//                                         {/* Check-in / Check-out */}
//                                         <Row className="mt-3 mb-3">
//                                             <Col md={3}>
//                                                 <p className="mb-1 text-secondary small">Check-in:</p>
//                                                 <p className="fw-semibold mb-0">{formatDateMonthYear(cart?.check_in_date)}</p>
//                                                 <small>2:00 PM</small>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <p className="mb-1 text-secondary small">Check-out:</p>
//                                                 <p className="fw-semibold mb-0">{formatDateMonthYear(cart?.check_out_date)}</p>
//                                                 <small>11:00 AM</small>
//                                             </Col>
//                                         </Row>

//                                         {/* Room details */}
//                                         <div className="border-top pt-3">
//                                             <p className="mb-1 font-18">Room details</p>
//                                             <div className="room-specs d-flex gap-3 mb-2">
//                                                 <span className="spec-item d-flex gap-2">
//                                                     <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps {cart?.max_guests}
//                                                 </span> |
//                                                 <span className="spec-item d-flex gap-2">
//                                                     <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" />
//                                                     {cart?.beds?.length} {cart?.beds?.map((b, bi) => <span key={bi}>{b.bed_type} </span>)}
//                                                 </span> |
//                                                 <span className="spec-item d-flex gap-2">{cart?.room_size_sqft} sq ft</span>
//                                             </div>
//                                             <hr />

//                                             {/* Traveler section */}
//                                             <div className="traveler-section">
//                                                 <p className="mb-2 font-18">Travelers in this room</p>

//                                                 {/* Adult count radios */}
//                                                 <div className="d-flex gap-3 mb-3">
//                                                     {Array.from(
//                                                         { length: cart.max_guests > 2 ? cart.max_guests : 2 },
//                                                         (_, ind) => {
//                                                             const count = ind + 1;
//                                                             const isDisabled = cart.room_type === "Private" && count > 1;
//                                                             return (
//                                                                 <div key={count} className="radio-select-box d-flex gap-2"
//                                                                     style={{ background: "#F2F2F2", opacity: isDisabled ? 0.4 : 1 }}>
//                                                                     <label className="form-check-label d-flex gap-2 mb-0">
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`adult-count-${cart.room_uid}`}
//                                                                             value={count}
//                                                                             checked={cart.adults === count}
//                                                                             disabled={isDisabled}
//                                                                             onChange={(e) => handleAdultChange(e, cart)}
//                                                                         />
//                                                                         <span className="radio-checkmark"></span>
//                                                                         {count} Adult{count > 1 ? "s" : ""}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         }
//                                                     )}
//                                                 </div>

//                                                 <hr />

//                                                 {/* Exclusive booking toggle */}
//                                                 {cart?.room_type !== "Private" && (
//                                                     <>
//                                                         <Row className='mb-3'>
//                                                             <Col md={5}>
//                                                                 <label className="mb-0 d-flex gap-2 align-items-center show-my-booking">
//                                                                     <input className="mx-2 custom-checkbox" type="checkbox"
//                                                                         onChange={(e) => setIsExclusiveBooking(e.target.checked)} />
//                                                                     Exclusively book this room for the traveler
//                                                                 </label>
//                                                             </Col>
//                                                         </Row>
//                                                         <Row className='mb-2'>
//                                                             <Col md={6}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                     Since this is a twin bed, one will be available for booking unless you specify it for exclusive use.
//                                                                 </p>
//                                                             </Col>
//                                                         </Row>
//                                                     </>
//                                                 )}

//                                                 <p className="mb-2 font-18">Traveler details</p>
//                                                 <p className='small'>{`We'll use this information to book. Make sure the name matches what is on the traveler's passport or ID.`}</p>

//                                                 {/* Gender preference banners */}
//                                                 {cart?.bedroom_preference_badge === "FEMALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                 As this room has already been booked for a female for your selected dates, only female traveler bookings are allowed
//                                                             </p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}
//                                                 {cart?.bedroom_preference_badge === "MALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                 As this room has already been booked for a male for your selected dates, only male traveler bookings are allowed
//                                                             </p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}

//                                                 {/* Traveller rows */}
//                                                 <div className='property-list-2'>
//                                                     {Array.from({ length: cart.room_type === "Private" ? 1 : cart.adults }).map((_, travelerIndex) => {
//                                                         const slot = cart.travelerDetails?.[travelerIndex];
//                                                         if (!slot) return null;

//                                                         return (
//                                                             <div className="row mb-3" key={`traveler-${cart.room_uid}-${travelerIndex}`}>

//                                                                 {/* Role dropdown */}
//                                                                 <div className="col-md-4">
//                                                                     <Select
//                                                                         name="traveller_type"
//                                                                         options={travelOption}
//                                                                         placeholder="Choose Role"
//                                                                         className="react_selectbox"
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         onChange={(e) => handleSelectDropdown(e, cartIndex, travelerIndex)}
//                                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                     />
//                                                                 </div>

//                                                                 {/* Bed selector — Twin-Sharing only */}
//                                                                 {cart?.room_type === "Twin-Sharing" && (
//                                                                     <div className="col-md-3">
//                                                                         <Select
//                                                                             name="bed_index"
//                                                                             options={cart?.beds
//                                                                                 ?.map((b, i) => ({ value: i, label: b.name, type: b.bed_type }))
//                                                                                 .filter(opt => {
//                                                                                     if (Array.isArray(cart?.available_beds) && !cart.available_beds.includes(opt.value)) return false;
//                                                                                     return !cart.travelerDetails.some((t, i) => i !== travelerIndex && t.bedIndex === opt.value);
//                                                                                 })}
//                                                                             placeholder="Choose bed"
//                                                                             className="react_selectbox"
//                                                                             isSearchable={false}
//                                                                             styles={customStyles}
//                                                                             value={slot?.bedIndex !== null
//                                                                                 ? cart?.beds?.map((b, i) => ({ value: i, label: b.name }))[slot?.bedIndex] ?? null
//                                                                                 : null}
//                                                                             onChange={(e) => handleBedBookIndex(e, cart, travelerIndex)}
//                                                                         />
//                                                                     </div>
//                                                                 )}

//                                                                 {/* ── Searchable traveller input (API-driven) ── */}
//                                                                 <div className={cart?.room_type === "Twin-Sharing" ? "col-md-5" : "col-md-8"}>
//                                                                     {!slot?.data && (
//                                                                         <div className="form-group" style={{ position: "relative" }}>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className={`form-control user-icn2${slot?.isGenderValidation === "Error" ? " border-danger" : slot?.isGenderValidation === "Success" ? " border-success" : ""}`}
//                                                                                 placeholder={slot?.traveller_type ? "Search traveler..." : "Select a role first"}
//                                                                                 disabled={!slot?.traveller_type}
//                                                                                 value={slot?.searchText || ""}
//                                                                                 onFocus={() => {
//                                                                                     // Open dropdown, fetch immediately on focus
//                                                                                     setCartItem(prev =>
//                                                                                         prev.map((room, cIdx) =>
//                                                                                             cIdx !== cartIndex ? room : {
//                                                                                                 ...room,
//                                                                                                 travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                                                                                                     tIdx !== travelerIndex ? t : { ...t, showList: true }
//                                                                                                 )
//                                                                                             }
//                                                                                         )
//                                                                                     );
//                                                                                     fetchUsersForSlot(cartIndex, travelerIndex, slot?.searchText || "", slot?.traveller_type);
//                                                                                 }}
//                                                                                 onChange={(e) => {
//                                                                                     const val = e.target.value;
//                                                                                     // 1. Update input text immediately (responsive typing)
//                                                                                     setCartItem(prev =>
//                                                                                         prev.map((room, cIdx) =>
//                                                                                             cIdx !== cartIndex ? room : {
//                                                                                                 ...room,
//                                                                                                 travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                                                                                                     tIdx !== travelerIndex ? t : { ...t, searchText: val, showList: true }
//                                                                                                 )
//                                                                                             }
//                                                                                         )
//                                                                                     );
//                                                                                     // 2. Debounced API call
//                                                                                     debouncedFetchUsersForSlot(cartIndex, travelerIndex, val, slot?.traveller_type);
//                                                                                 }}
//                                                                                 onBlur={() => {
//                                                                                     setTimeout(() => {
//                                                                                         setCartItem(prev =>
//                                                                                             prev.map((room, cIdx) =>
//                                                                                                 cIdx !== cartIndex ? room : {
//                                                                                                     ...room,
//                                                                                                     travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                                                                                                         tIdx !== travelerIndex ? t : { ...t, showList: false }
//                                                                                                     )
//                                                                                                 }
//                                                                                             )
//                                                                                         );
//                                                                                     }, 200);
//                                                                                 }}
//                                                                             />

//                                                                             {/* Dropdown */}
//                                                                             {slot?.showList && (
//                                                                                 <div style={{
//                                                                                     position: "absolute", top: "46px", left: 0, right: 0,
//                                                                                     background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                     borderRadius: "0px", zIndex: 10, padding: "16px",
//                                                                                     maxHeight: "300px", overflowY: "auto",
//                                                                                 }}>
//                                                                                     {isSlotLoading(cartIndex, travelerIndex) ? (
//                                                                                         <div style={{ textAlign: "center", padding: "20px", color: "#73615F", fontSize: "14px" }}>
//                                                                                             Searching...
//                                                                                         </div>
//                                                                                     ) : slot?.filteredUsers?.length > 0 ? (
//                                                                                         <>
//                                                                                             {slot.filteredUsers.map((caretaker, idx) => (
//                                                                                                 <div
//                                                                                                     key={`c-${caretaker.uid || idx}`}
//                                                                                                     className="managers-data"
//                                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                                     onClick={() => handleCaretakerSelectWithValidation(
//                                                                                                         cart, cartIndex, travelerIndex, caretaker
//                                                                                                     )}
//                                                                                                     style={{
//                                                                                                         display: "flex", alignItems: "center",
//                                                                                                         marginBottom: "18px",
//                                                                                                         borderBottom: idx < slot.filteredUsers.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                         paddingBottom: "15px", cursor: "pointer",
//                                                                                                     }}
//                                                                                                 >
//                                                                                                     <Image
//                                                                                                         src={caretaker.profile_image
//                                                                                                             ? caretaker.profile_image
//                                                                                                             : caretaker?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                                         alt={caretaker.first_name}
//                                                                                                         width={48} height={48}
//                                                                                                         style={{ borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
//                                                                                                     />
//                                                                                                     <div>
//                                                                                                         <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                             {caretaker.first_name} {caretaker.last_name}
//                                                                                                         </div>
//                                                                                                         <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             ))}
//                                                                                             <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
//                                                                                                 <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                                                                                     {`Can't find someone?`}<br />
//                                                                                                     <Link onClick={addTravel} href='#' style={{ color: '#463527' }}>Register a new traveler</Link>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </>
//                                                                                     ) : (
//                                                                                         <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                                                                                             <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                                                                                             <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
//                                                                                             <div style={{ fontSize: "14px", marginBottom: "16px", lineHeight: "1.4" }}>
//                                                                                                 {`Can't find the person you're looking for?`}
//                                                                                             </div>
//                                                                                             <Link href="/People" style={{
//                                                                                                 background: "#6B4F3F", color: "white", padding: "10px 20px",
//                                                                                                 width: "100%", display: "block", textAlign: "center", textDecoration: "none"
//                                                                                             }}>Invite to Join</Link>
//                                                                                         </div>
//                                                                                     )}
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     )}

//                                                                     {/* Validation feedback */}
//                                                                     {slot?.isGenderValidation === "Validating" && (
//                                                                         <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#BF9039" }}>⏳ Validating gender...</p>
//                                                                     )}
//                                                                     {slot?.isGenderValidation === "Error" && (
//                                                                         <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
//                                                                             ✕ Gender validation failed — this traveler is not allowed in this room
//                                                                         </p>
//                                                                     )}
//                                                                     {slot?.isGenderValidation === "Success" && !slot?.data && (
//                                                                         <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>✓ Gender validated</p>
//                                                                     )}
//                                                                 </div>

//                                                                 {/* Selected traveller card */}
//                                                                 <div className="col-md-12">
//                                                                     {slot?.data && (() => {
//                                                                         // Cache-first lookup so card survives filteredUsers being cleared
//                                                                         const found = selectedUsersCache.current[slot.data.uid] || slot.data;
//                                                                         return (
//                                                                             <div className="selected-caretaker-container">
//                                                                                 <div className="manager-list-full" style={{
//                                                                                     display: "flex", alignItems: "center",
//                                                                                     border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                     padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                                 }}>
//                                                                                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                         <Image
//                                                                                             src={found.profile_image
//                                                                                                 ? found.profile_image
//                                                                                                 : found?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                             alt={found.first_name}
//                                                                                             width={48} height={48}
//                                                                                             style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                         />
//                                                                                         <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                             {found.first_name} {found.last_name}
//                                                                                             <br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                 Emp. id: {found.employee_id}
//                                                                                             </span>
//                                                                                             <br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                 Dept: {found.segment}
//                                                                                             </span>
//                                                                                             {slot.isGenderValidation === "Success" && <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>}
//                                                                                             {slot.isGenderValidation === "Error" && <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>}
//                                                                                             {slot.isGenderValidation === "Validating" && <span style={{ fontSize: "12px", color: "#BF9039", marginLeft: "8px" }}>⏳ Validating...</span>}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                             {found.phone_number}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                             {found.email}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
//                                                                                             {found.gender}
//                                                                                         </span>
//                                                                                     </div>
//                                                                                     <div className="show-edit-btn">
//                                                                                         <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                             onClick={() => router.push(`/People?guest_uid=${found.uid}&show=true`)}>
//                                                                                             Edit details
//                                                                                         </Button>
//                                                                                         <button type="button" className="ms-auto"
//                                                                                             onClick={() => handleCaretakerRemove(cart, slot.id)}
//                                                                                             style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}
//                                                                                             title="Remove">
//                                                                                             <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         );
//                                                                     })()}
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <p className='d-flex gap-2 fw-medium justify-content-end'>
//                                         Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
//                                     </p>
//                                 </div>
//                             ))}

//                             {/* ── Arrival Details ── */}
//                             <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                 <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                 <p className="text-secondary mb-2">This information helps in operational planning, legal compliance, and personalized service.</p>

//                                 <Form.Group className='mb-4 mt-4' controlId="dateArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Date of Arrival In Individual House</Form.Label>
//                                     <DatePicker
//                                         selected={formData.dateArrival}
//                                         onChange={(e) => handleSelectChange(e, "dateArrival")}
//                                         selectsStart minDate={new Date()}
//                                         className="form-control custom-date-picker"
//                                         dateFormat="dd/MM/yyyy" placeholderText='DD/MM/YYYY'
//                                     />
//                                     <span className='text-danger'>{errorMessages.dateArrival}</span>
//                                 </Form.Group>

//                                 <Form.Group className='mb-4 mt-4' controlId="timeArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
//                                     <Select onChange={(e) => handleSelectChange(e.value, "timeArrival")} options={timeOption}
//                                         placeholder="Select time" className="react_selectbox" isSearchable={false} styles={customStyles} />
//                                     <span className='text-danger'>{errorMessages.timeArrival}</span>
//                                 </Form.Group>

//                                 <Form.Group className='mb-4' controlId="modeArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
//                                     <Select onChange={(e) => handleSelectChange(e.value, "modeArrival")} options={arrivalOption}
//                                         placeholder="Select mode" className="react_selectbox" isSearchable={false} styles={customStyles} />
//                                     <span className='text-danger'>{errorMessages.modeArrival}</span>
//                                 </Form.Group>

//                                 <div className='mb-4 form-group'>
//                                     <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
//                                     <input type="text" name="FlightTrainNumber" onChange={handleInputChange}
//                                         placeholder='Enter number e.g. MADGAON LTT EXP #11100' className='form-control' />
//                                     <span className='text-danger'>{errorMessages.FlightTrainNumber}</span>
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── Additional Comments ── */}
//                             <div className="arrival-section mt-4 pt-4">
//                                 <h3 className="font-24 mb-2">Additional Comments</h3>
//                                 <div className='mb-5 form-group'>
//                                     <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
//                                     <input type="text" name="refnumber" onChange={handleInputChange}
//                                         placeholder='Reference number to be entered for your internal purpose (optional)' className='form-control' />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── Other Essential Details ── */}
//                             <div className="arrival-section mt-4 pt-3 mb-5">
//                                 <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                 <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
//                                 <div className='mb-4 form-group'>
//                                     <textarea className='form-control' name="essentialDetails" onChange={handleInputChange}
//                                         placeholder='Got any thoughts or questions? Add them here! (Optional)' />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── Confirmation email ── */}
//                             <div className="confirmation-email-section my-5 pb-5">
//                                 <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3'
//                                     style={{ maxWidth: '360px', cursor: 'pointer' }}>
//                                     <input type="checkbox" className="mx-2 custom-checkbox"
//                                         checked={isEmailEnabled}
//                                         onChange={(e) => setIsEmailEnabled(e.target.checked)} />
//                                     Send copy of confirmation email
//                                 </label>

//                                 {isEmailEnabled && (
//                                     <div className="email-content">
//                                         <p className='fw-bold mb-3' style={{ color: '#6B4F3F' }}>Add info</p>
//                                         {receivers.map((receiver, index) => (
//                                             <div key={receiver.id} className="receiver-item">
//                                                 {index > 0 && (<><hr className="my-4" /><p className='fw-bold mb-3'>Receiver {index + 1}</p></>)}
//                                                 <div className='form-group mb-4'>
//                                                     <label className="form-label fw-medium">Email</label>
//                                                     <div className='row align-items-center'>
//                                                         <div className='col-md-5'>
//                                                             <input type='email'
//                                                                 className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
//                                                                 placeholder='Enter receiver email'
//                                                                 value={receiver.email}
//                                                                 onChange={(e) => handleEmailChange(receiver.id, e.target.value)} />
//                                                             {receiver.email && !isValidEmail(receiver.email) && (
//                                                                 <div className="invalid-feedback d-block">Please enter a valid email address</div>
//                                                             )}
//                                                         </div>
//                                                         <div className='col-md-1 d-flex align-items-center'>
//                                                             {index === 0 ? (
//                                                                 <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0" disabled={receivers.length >= 5}>
//                                                                     <Image src='./images/icons/add_circle.svg' alt='Add' width={32} height={32} style={{ opacity: receivers.length >= 5 ? 0.5 : 1 }} />
//                                                                 </button>
//                                                             ) : (
//                                                                 <button type="button" onClick={() => handleRemoveReceiver(receiver.id)} className="btn btn-link p-0">
//                                                                     <Image src='./images/icons/close-circle.svg' alt='Remove' width={32} height={32} />
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         {receivers.length >= 5 && <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>}
//                                     </div>
//                                 )}
//                             </div>
//                         </Col>

//                         {/* ── Booking Summary ── */}
//                         <Col md={4} className='ps-5'>
//                             <div className='booking-summary-colum'>
//                                 <div className="d-flex align-items-center justify-between mb-4">
//                                     <h4 className='font-24 mb-0'>Booking Summary</h4>
//                                     <label className='mb-0 d-flex gap-2 align-items-center'>
//                                         <input type="checkbox" className="mx-2 custom-checkbox"
//                                             checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show prices
//                                     </label>
//                                 </div>

//                                 <div className="booking-summary">
//                                     <div className="summary-details">
//                                         <div className="summary-row">
//                                             <span className="summary-label">BRs Selected</span>
//                                             <span className="summary-value">{cartItem.length}</span>
//                                         </div>
//                                         <div className="summary-row">
//                                             <span className="summary-label">Number of Rooms</span>
//                                             <span className="summary-value">{cartItem.length} Room{cartItem.length > 1 ? "s" : ""}</span>
//                                         </div>
//                                         <div className="summary-row">
//                                             <span className="summary-label">Travelers</span>
//                                             <span className="summary-value">{totalTravelers} Adult{totalTravelers > 1 ? "s" : ""}</span>
//                                         </div>

//                                         {cartItem.map((item) => {
//                                             const nights = calculateNights(item.check_in_date, item.check_out_date);
//                                             const roomPrice = (item.price_per_night || 0) * nights;
//                                             return (
//                                                 <div key={item.room_uid} className="summary-row detailed">
//                                                     <span className="summary-label">{item.room_name} Pricing</span>
//                                                     <div className="summary-value-detailed">
//                                                         <div className="price-desc">{item.adults} Guest x {nights} nights</div>
//                                                         {showPrices && (
//                                                             <div className="price-amount">₹{roomPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                                                         )}
//                                                         <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}

//                                         <div className="total-section">
//                                             <span className="total-label">Total Price</span>
//                                             <div className="total-value-detailed">
//                                                 <div className="total-desc">{totalTravelers} Guest x {totalNights} nights</div>
//                                                 {showPrices && (
//                                                     <div className="total-amount">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                                                 )}
//                                                 <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <button onClick={handleSubmitReserve} className="confirm-btn" disabled={isSubmitting}
//                                         style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}>
//                                         {isSubmitting ? "Validating & Reserving..." : "Confirm and Reserve"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             {/* ── Edit Stay Details Modal ── */}
//             <Modal show={addTravels2} onHide={removeTravel2} animation={false} centered size="xl" className='custom-theme-modal-2'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title>Edit Stay Details</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel2} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         <Row className='gap-0'>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Which company?</label>
//                                     <Select options={companyList} placeholder="Select company" className="react_selectbox" isSearchable={false}
//                                         value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
//                                         onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.value })}
//                                         styles={customStyles} />
//                                 </div>
//                             </Col>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Where to?</label>
//                                     <Select options={cityList} placeholder="Select city" className="react_selectbox" isSearchable={false}
//                                         getOptionLabel={(o) => o.city} getOptionValue={(o) => o.city}
//                                         value={cityList?.find(c => c.city === searchFieldData.city) || null}
//                                         onChange={(o) => setSearchFieldData({ ...searchFieldData, city: o.city })}
//                                         styles={customStyles} />
//                                 </div>
//                             </Col>
//                             <Col md={4} className='gap-2'>
//                                 <div className='d-flex gap-0'>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Check-in date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
//                                             minDate={new Date()} className="form-control custom-date-picker"
//                                             dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
//                                     </div>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Checkout date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
//                                             minDate={new Date()} className="form-control custom-date-picker"
//                                             dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
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
//                                                     {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((s, r) => s + r.adults, 0)} guest${rooms.reduce((s, r) => s + r.adults, 0) > 1 ? 's' : ''}`}
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
//                                                                         <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleModalAdultChange(room.id, -1); }}>-</button>
//                                                                         <span>{room.adults}</span>
//                                                                         <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleModalAdultChange(room.id, 1); }}>+</button>
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
//                                                                 setSearchFieldData({ ...searchFieldData, rooms: rooms.map(r => ({ adults: r.adults })) });
//                                                             }}>Done</button>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </Col>
//                                     <Col md={5}>
//                                         <div className='form-group h-100 align-items-center d-flex pt-1'>
//                                             <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', borderRadius: '0', color: '#fff' }}
//                                                 variant='' onClick={handleUpdateSearch}>Update Search</Button>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Modal.Body>
//             </Modal>

//             {/* ── Add Person Modal ── */}
//             <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} roleOption={role} companyList={companyList} addTravel={addTravel} />

//             {/* ── Price Breakdown Modal ── */}
//             <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         {cartItem.map(item => {
//                             const nights = calculateNights(item.check_in_date, item.check_out_date);
//                             return (
//                                 <div key={item.room_uid} className='d-flex justify-between pt-2 pb-2'>
//                                     <span>{item.room_name} x {item.adults} guest x {nights} nights</span>
//                                     <span style={{ color: '#BF9039', fontWeight: '500' }}>
//                                         ₹{((item.price_per_night || 0) * nights).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                     </span>
//                                 </div>
//                             );
//                         })}
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
//                     <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>
//                         ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                     </span>
//                 </Modal.Footer>
//             </Modal>

//             {/* ── Booking Confirmed Modal ── */}
//             <Modal show={showReserveModal} onHide={removeReserve} animation={false} centered className='custom-theme-modal-2 modal-460'>
//                 <Modal.Body className='pt-4 pb-4'>
//                     {bookingConfirmedData?.length > 0 && (
//                         <div className="flex items-center justify-center gap-6">
//                             <button onClick={() => setCurrent((current - 1 + bookingConfirmedData.length) % bookingConfirmedData.length)}
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none">‹</button>
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
//                             <button onClick={() => setCurrent((current + 1) % bookingConfirmedData.length)}
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none">›</button>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between flex-col'>
//                     <Link href={`/BookingDetails/${bookingConfirmedData[0]?.uid}`}
//                         className="p-2 w-100 text-center d-flex align-items-center justify-content-center"
//                         style={{ background: "#2C734A", borderRadius: "0", color: "#fff", minHeight: "58px", textDecoration: "none" }}>
//                         View Booking Details
//                     </Link>
//                     <Link href="/CreateBooking"
//                         className="text-center justify-center edit-btn w-100 d-flex align-items-center justify-content-center"
//                         style={{ minHeight: "58px", textDecoration: "none" }}>
//                         Create Another Booking
//                     </Link>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }

// "use client"
// import React, { useEffect, useRef, useState } from 'react'
// import Header from '../Header/Header'
// import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { components } from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
// import { calculateNights, convertTo24Hour, formatDateMonthYear, formatRoomsAndGuests, formatStayDates, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
// import { companyListAPI, CreateBookingPost, PropertyListFullApi, UserListAPI, UserRoleListAPI, validateGender } from '@/services/provider';
// import { ArrivalDetailValidation } from '@/utils/validation';
// import toast, { Toaster } from 'react-hot-toast';

// export default function MultiRoomsReserve() {
//     // ─── Local storage ────────────────────────────────────────────────────────
//     const multiroomsSelected = JSON.parse(getItemLocalStorage("multiroomreserve"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"));

//     const router = useRouter();
//     const [current, setCurrent] = useState(0);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // ─── Debounce timers: rowSearchTimers.current[`${cartIndex}-${travelerIndex}`] ──
//     const rowSearchTimers = useRef({});
//     // ─── User object cache by uid so selected card always renders ─────────────
//     const selectedUsersCache = useRef({});
//     // ─── Refs for each slot's dropdown div — used for scroll detection ─────────
//     const dropdownRefs = useRef({});

//     // ─── Search edit modal state ──────────────────────────────────────────────
//     const [searchFieldData, setSearchFieldData] = useState({
//         company_id: 0,
//         city: "",
//         check_in_date: "",
//         check_out_date: "",
//         rooms: [],
//     });

//     // ─── Arrival / comment form ───────────────────────────────────────────────
//     const [formData, setFormData] = useState({
//         dateArrival: "",
//         timeArrival: "",
//         modeArrival: "",
//         FlightTrainNumber: "",
//         refnumber: "",
//         essentialDetails: ""
//     });
//     const [errorMessages, setErrorMessages] = useState({});

//     // ─── Cart: one entry per selected room, each enriched with travelerDetails ─
//     const [cartItem, setCartItem] = useState([]);

//     const [showPrices, setShowPrices] = useState(false);
//     const [bookingConfirmedData, setBookingConfirmedData] = useState([]);
//     const [isExclusiveBooking, setIsExclusiveBooking] = useState(false);

//     // ─── Modal visibility ─────────────────────────────────────────────────────
//     const [addTravels, addTravelsetShow] = useState(false);
//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);

//     const [addBreakdowns, addBreakdownsetShow] = useState(false);
//     const removeBreakdown = () => addBreakdownsetShow(false);
//     const addbreakdown = () => addBreakdownsetShow(true);

//     const [showReserveModal, setShowReserveModal] = useState(false);
//     const removeReserve = () => setShowReserveModal(false);

//     const [addTravels2, addTravel2setShow] = useState(false);
//     const removeTravel2 = () => addTravel2setShow(false);
//     const addTravel2 = () => addTravel2setShow(true);

//     const countNights = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);
//         const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
//         return nights;
//     }

//     // ─── Per-slot search loading state ───────────────────────────────────────
//     // rowSearchLoading[cartIndex][travelerIndex] = true/false
//     const [rowSearchLoading, setRowSearchLoading] = useState({});

//     // ─── Initialise cartItem from localStorage ────────────────────────────────
//     useEffect(() => {
//         if (Array.isArray(multiroomsSelected) && multiroomsSelected.length) {
//             const initialCart = multiroomsSelected.map(item => ({
//                 ...item,
//                 travelerDetails: Array.from(
//                     { length: item.room_type === "Private" ? 1 : item.adults },
//                     (_, i) => ({
//                         id: `${item.room_id}-${i}`,
//                         data: null,
//                         bedIndex: null,
//                         isGenderValidation: "",
//                         // per-slot search text and dropdown list
//                         searchText: "",
//                         showList: false,
//                         filteredUsers: [],
//                         // ─── pagination per slot ───
//                         page: 1,
//                         hasMore: true,
//                     })
//                 )
//             }));
//             setCartItem(initialCart);
//         }
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // ─── Helpers: set/read nested loading flag ────────────────────────────────
//     const setSlotLoading = (cartIndex, travelerIndex, val) => {
//         setRowSearchLoading(prev => ({
//             ...prev,
//             [cartIndex]: { ...(prev[cartIndex] || {}), [travelerIndex]: val }
//         }));
//     };
//     const isSlotLoading = (cartIndex, travelerIndex) =>
//         !!rowSearchLoading?.[cartIndex]?.[travelerIndex];

//     // ─── Core API fetch for one slot ─────────────────────────────────────────
//     // pageNum=1  → replaces filteredUsers list (new search / role change)
//     // pageNum>1  → appends to filteredUsers (infinite scroll)
//     const fetchUsersForSlot = async (cartIndex, travelerIndex, searchTerm, travellerType, pageNum = 1) => {
//         // Guard: don't fetch next page if slot already says no more data
//         if (pageNum > 1) {
//             const slot = cartItem[cartIndex]?.travelerDetails?.[travelerIndex];
//             if (!slot?.hasMore) return;
//         }

//         setSlotLoading(cartIndex, travelerIndex, true);
//         try {
//             const response = await UserListAPI("All", '', searchTerm, '', '', '', '', '', '', pageNum);
//             if (response?.data?.success) {
//                 const raw = response.data.response || [];
//                 const hasMoreData = raw.length > 0;

//                 let result = [...raw];

//                 // Role filter
//                 if (travellerType === "External-Guest") {
//                     result = result.filter(u => u?.user_role?.role_name === "External");
//                 } else if (travellerType === "Company-Employee") {
//                     result = result.filter(u =>
//                         u?.user_role?.role_name !== "External" &&
//                         u?.user_company?.id === bacisSearchDetails?.company_id
//                     );
//                 }

//                 // Gender preference filter
//                 const badge = cartItem[cartIndex]?.bedroom_preference_badge;
//                 if (badge === "FEMALE PREFERRED") result = result.filter(u => u.gender === "Female");
//                 if (badge === "MALE PREFERRED") result = result.filter(u => u.gender === "Male");

//                 setCartItem(prev =>
//                     prev.map((room, cIdx) =>
//                         cIdx !== cartIndex ? room : {
//                             ...room,
//                             travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                                 tIdx !== travelerIndex ? t : {
//                                     ...t,
//                                     // page 1 → replace; page 2+ → append
//                                     filteredUsers: pageNum === 1 ? result : [...t.filteredUsers, ...result],
//                                     page: pageNum,
//                                     hasMore: hasMoreData,
//                                 }
//                             )
//                         }
//                     )
//                 );
//             }
//         } catch (err) {
//             console.error("fetchUsersForSlot error:", err);
//         } finally {
//             setSlotLoading(cartIndex, travelerIndex, false);
//         }
//     };

//     // ─── Debounced wrapper — resets page to 1 on every new search ────────────
//     const debouncedFetchUsersForSlot = (cartIndex, travelerIndex, searchTerm, travellerType) => {
//         const key = `${cartIndex}-${travelerIndex}`;
//         if (rowSearchTimers.current[key]) clearTimeout(rowSearchTimers.current[key]);
//         rowSearchTimers.current[key] = setTimeout(() => {
//             // Reset pagination state before the API call
//             setCartItem(prev =>
//                 prev.map((room, cIdx) =>
//                     cIdx !== cartIndex ? room : {
//                         ...room,
//                         travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                             tIdx !== travelerIndex
//                                 ? t
//                                 : { ...t, page: 1, hasMore: true, filteredUsers: [] }
//                         )
//                     }
//                 )
//             );
//             fetchUsersForSlot(cartIndex, travelerIndex, searchTerm, travellerType, 1);
//         }, 350);
//     };

//     // ─── Dropdown helpers ─────────────────────────────────────────────────────
//     const travelOption = [
//         { value: "Company-Employee", label: "Company employee", icon: "../images/icons/hail.svg" },
//         { value: "External-Guest", label: "External", icon: "../images/icons/short_stay.svg" },
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

//     // ─── Role picker change: clear slot, immediately fetch page 1 from API ────
//     const handleSelectDropdown = (e, cartIndex, travelerIndex) => {
//         const travellerType = e.value;

//         setCartItem(prev =>
//             prev.map((room, cIdx) =>
//                 cIdx !== cartIndex ? room : {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                         tIdx !== travelerIndex ? t : {
//                             ...t,
//                             traveller_type: travellerType,
//                             data: null,
//                             searchText: "",
//                             filteredUsers: [],
//                             isGenderValidation: "",
//                             page: 1,
//                             hasMore: true,
//                         }
//                     )
//                 }
//             )
//         );

//         // Immediate fetch (no debounce — role just changed)
//         fetchUsersForSlot(cartIndex, travelerIndex, "", travellerType, 1);
//     };

//     // ─── Arrival form handlers ────────────────────────────────────────────────
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         const { error } = ArrivalDetailValidation({ [name]: value });
//         setErrorMessages(prev => ({ ...prev, ...error }));
//     };

//     const handleSelectChange = (value, name) => {
//         setFormData(prev => ({ ...prev, [name]: name === "timeArrival" ? convertTo24Hour(value) : value }));
//         const { error } = ArrivalDetailValidation({ [name]: value });
//         setErrorMessages(prev => ({ ...prev, ...error }));
//     };

//     const timeOption = generateTimeOptions12Format(30);
//     const arrivalOption = [
//         { value: "Flight", label: "Flight" },
//         { value: "Train", label: "Train" }
//     ];

//     // ─── Edit stay details ────────────────────────────────────────────────────
//     const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
//     const [companyList, setCompanyList] = useState([]);
//     const [role, setRole] = useState([]);
//     const [cityList, setCityList] = useState([]);
//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

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
//         } catch (error) { console.log(error); }
//     };

//     const getUserListDataAPI = async () => {
//         try {
//             const response = await UserRoleListAPI(loginData?.uid);
//             if (response?.data?.success) {
//                 setRole(response.data.response.map(val => ({
//                     value: val?.uid,
//                     label: val?.role_name,
//                     icon: val?.role_icon,
//                 })));
//             }
//         } catch (error) { console.error("userListData error:", error); }
//     };

//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 setCompanyList(response.data.response.map(item => ({
//                     value: item.id,
//                     label: item.company_name
//                 })));
//             }
//         } catch (error) { console.log(error); }
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
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
//             });
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })));
//         }
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const handleUpdateSearch = () => {
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
//         setTimeout(() => {
//             removeItemLocalStorage("multiroomreserve");
//             router.push('/Searchresult');
//         }, 0);
//     };

//     // Adult count change — rebuilds travelerDetails for that room
//     const handleAdultChange = (e, roomData) => {
//         const newCount = Number(e.target.value);
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid !== roomData.room_uid ? room : {
//                     ...room,
//                     adults: newCount,
//                     travelerDetails: Array.from({ length: newCount }, (_, i) => ({
//                         id: `${room.room_id}-${i}`,
//                         data: null,
//                         bedIndex: null,
//                         isGenderValidation: "",
//                         searchText: "",
//                         showList: false,
//                         filteredUsers: [],
//                         traveller_type: null,
//                         page: 1,
//                         hasMore: true,
//                     }))
//                 }
//             )
//         );
//     };

//     // Modal room counter (Edit Stay modal only)
//     const handleModalAdultChange = (roomId, change) => {
//         setRooms(rooms.map(r => {
//             if (r.id === roomId) {
//                 const nv = r.adults + change;
//                 return { ...r, adults: nv >= 1 ? nv : 1 };
//             }
//             return r;
//         }));
//     };

//     const addRoom = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
//     const deleteRoom = (roomId) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== roomId)); };

//     const handleBedBookIndex = (e, roomData, travelerIndex) => {
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid !== roomData.room_uid ? room : {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map((t, i) =>
//                         i === travelerIndex ? { ...t, bedIndex: e.value } : t
//                     )
//                 }
//             )
//         );
//     };

//     const customStyles = {
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected ? "#4635271F" : state.isFocused ? "#4635271F" : "inherit",
//             color: "black",
//             cursor: "pointer",
//         }),
//     };

//     // ─── Caretaker remove ─────────────────────────────────────────────────────
//     const handleCaretakerRemove = (roomData, travelerId) => {
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid !== roomData.room_uid ? room : {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map(t =>
//                         t.id !== travelerId ? t : {
//                             ...t,
//                             data: null,
//                             searchText: "",
//                             filteredUsers: [],
//                             isGenderValidation: "",
//                             page: 1,
//                             hasMore: true,
//                         }
//                     )
//                 }
//             )
//         );
//     };

//     // ─── Email recipients ─────────────────────────────────────────────────────
//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([{ id: 1, email: '' }]);

//     const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
//     const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
//     const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
//     const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//     // ─── Gender validation ────────────────────────────────────────────────────
//     const validateTravellerGender = async (roomData, travelerUid, bedIndex) => {
//         try {
//             const payload = {
//                 room_uid: roomData.room_uid,
//                 traveler_uid: travelerUid,
//                 check_in_date: roomData.check_in_date,
//                 check_out_date: roomData.check_out_date,
//                 bed_index: bedIndex,
//             };
//             const response = await validateGender(payload);
//             return response?.data?.response?.valid === true;
//         } catch {
//             return false;
//         }
//     };

//     // ─── Caretaker selected from dropdown ────────────────────────────────────
//     const handleCaretakerSelectWithValidation = async (
//         roomData, cartIndex, travelerIndex, caretaker
//     ) => {
//         // Cache user object so card survives filteredUsers being cleared
//         if (caretaker?.uid) selectedUsersCache.current[caretaker.uid] = caretaker;

//         const displayName = `${caretaker.first_name} ${caretaker.last_name}`;

//         // Set data + clear dropdown list immediately
//         setCartItem(prev =>
//             prev.map((room, cIdx) =>
//                 cIdx !== cartIndex ? room : {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                         tIdx !== travelerIndex ? t : {
//                             ...t,
//                             data: caretaker,
//                             searchText: displayName,
//                             showList: false,
//                             filteredUsers: [],   // clear after selection
//                             isGenderValidation: roomData.room_type !== "Private" ? "Validating" : "",
//                         }
//                     )
//                 }
//             )
//         );

//         // Only validate for non-private rooms
//         if (roomData.room_type !== "Private") {
//             const isValid = await validateTravellerGender(roomData, caretaker.uid, travelerIndex);

//             setCartItem(prev =>
//                 prev.map((room, cIdx) =>
//                     cIdx !== cartIndex ? room : {
//                         ...room,
//                         travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                             tIdx !== travelerIndex ? t : {
//                                 ...t,
//                                 isGenderValidation: isValid ? "Success" : "Error"
//                             }
//                         )
//                     }
//                 )
//             );

//             isValid
//                 ? toast.success(`Traveler ${travelerIndex + 1}: Gender validated successfully`)
//                 : toast.error(`Traveler ${travelerIndex + 1}: Gender validation failed — this traveler is not allowed in this room`);
//         }
//     };

//     // ─── Pre-submit full gender validation ───────────────────────────────────
//     const validateAllTravellersGender = async () => {
//         let allValid = true;

//         for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
//             const room = cartItem[cartIndex];
//             if (room.room_type === "Private") continue;

//             for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
//                 const traveler = room.travelerDetails[tIdx];
//                 if (!traveler.data) {
//                     toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: No traveler selected`);
//                     allValid = false;
//                     continue;
//                 }
//                 const isValid = await validateTravellerGender(room, traveler.data.uid, tIdx);

//                 setCartItem(prev =>
//                     prev.map((r, cIdx) =>
//                         cIdx !== cartIndex ? r : {
//                             ...r,
//                             travelerDetails: r.travelerDetails.map((t, i) =>
//                                 i !== tIdx ? t : { ...t, isGenderValidation: isValid ? "Success" : "Error" }
//                             )
//                         }
//                     )
//                 );

//                 if (!isValid) {
//                     toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: Gender validation failed — booking blocked`);
//                     allValid = false;
//                 }
//             }
//         }
//         return allValid;
//     };

//     // ─── Submit booking ───────────────────────────────────────────────────────
//     const cleanPayload = (obj) => {
//         if (Array.isArray(obj)) {
//             return obj.map(cleanPayload);
//         } else if (obj !== null && typeof obj === "object") {
//             return Object.fromEntries(
//                 Object.entries(obj)
//                     .filter(([_, v]) => v !== null && v !== undefined && v !== "")
//                     .map(([k, v]) => [k, cleanPayload(v)])
//             );
//         }
//         return obj;
//     };

//     const handleSubmitReserve = async () => {
//         const { error, isValid } = ArrivalDetailValidation(formData);
//         setErrorMessages(error);
//         if (!isValid) return;

//         for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
//             const room = cartItem[cartIndex];
//             for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
//                 if (!room.travelerDetails[tIdx].data) {
//                     toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: Please select a traveler`);
//                     return;
//                 }
//             }
//         }

//         setIsSubmitting(true);
//         const allGenderValid = await validateAllTravellersGender();
//         if (!allGenderValid) {
//             toast.error("Booking blocked: one or more travelers failed gender validation");
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             const cartData = cartItem.map(item => ({
//                 property_uid: item.property_uid,
//                 room_uid: item.room_uid,
//                 bed_index: item.room_type === "Private" ? null : (item.travelerDetails[0]?.bedIndex ?? null),
//                 check_in_date: item.check_in_date,
//                 check_out_date: item.check_out_date
//             }));

//             // Rebuild properly: one assignment per traveller
//             const travelerAssignmentsFull = cartItem.flatMap((item, cartIndex) =>
//                 item.travelerDetails.map((traveler) => ({
//                     cart_item_index: cartIndex,
//                     traveler_id: traveler.data?.uid,
//                     is_exclusive_booking: isExclusiveBooking
//                 }))
//             ).filter(a => a.traveler_id);

//             const payload = {
//                 company_id: searchFieldData.company_id || bacisSearchDetails?.company_id,
//                 cart_items: cartData,
//                 traveler_assignments: travelerAssignmentsFull,
//                 arrival_details: {
//                     arrival_date: formatYMD(formData.dateArrival),
//                     arrival_time: formData.timeArrival,
//                     mode_of_arrival: formData.modeArrival,
//                     transport_number: formData.FlightTrainNumber
//                 },
//                 additional_comments: formData.essentialDetails,
//                 company_booking_reference: formData.refnumber,
//                 send_confirmation_email: isEmailEnabled,
//                 additional_email_recipients: receivers.map(r => r.email)
//             };

//             const response = await CreateBookingPost(cleanPayload(payload));
//             if (response.data.success) {
//                 setBookingConfirmedData(response.data.response.bookings);
//                 setShowReserveModal(true);
//                 toast.success("Booking Created Successfully");
//                 removeItemLocalStorage("multiroomreserve");
//                 removeItemLocalStorage("searchParam");
//                 removeItemLocalStorage("basicSecrchItemObj");
//             } else {
//                 response.data.response.validation_errors.forEach(el => toast.error(el.error));
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to create booking");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // ─── Booking summary computed values ─────────────────────────────────────
//     const totalNights = cartItem.length > 0
//         ? calculateNights(cartItem[0]?.check_in_date, cartItem[0]?.check_out_date)
//         : 0;
//     const totalPrice = cartItem.reduce((sum, item) =>
//         sum + (item.price_per_night || 0) * calculateNights(item.check_in_date, item.check_out_date), 0
//     );
//     const totalTravelers = cartItem.reduce((sum, item) =>
//         sum + (item.travelerDetails?.length || 0), 0
//     );

//     // ─── Render ───────────────────────────────────────────────────────────────
//     return (
//         <>
//             <Header />
//             <Toaster position="top-right" />

//             <div className='searching-result-top'>
//                 <Container>
//                     <div className='search-result-header'>
//                         <h4>{searchBookingData?.company_name} | {searchBookingData?.city}</h4>
//                         <p className='mb-0'>
//                             <Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />
//                             {formatStayDates(searchBookingData?.check_in_date, searchBookingData?.check_out_date)} |
//                             <Image src='./images/icons/group.svg' alt='group' className="img-fluid" width={24} height={24} />
//                             {formatRoomsAndGuests(bacisSearchDetails?.rooms)}
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
//                             <h4 className='font-24 mb-4'>Review Your Selected BRs ({cartItem.length})</h4>

//                             {cartItem.map((cart, cartIndex) => (
//                                 <div key={`cart-${cart.room_uid}`}>
//                                     {/* Bedroom header */}
//                                     <div className='d-flex align-items-center gap-3 mb-3'>
//                                         <Image src='./images/icons/down-vector.svg' className='img-fluid' alt='down' width={32} height={32} />
//                                         <h4 className='font-24 mb-0'>Bedroom {cart?.bedroom_index}</h4>
//                                         <span style={{ color: '#463527' }}>{cart?.adults} Adult{cart?.adults > 1 ? "s" : ""}</span>
//                                     </div>

//                                     <div className="booking-card border bg-white p-3 mb-4">
//                                         {/* Room image + title */}
//                                         <Row>
//                                             <Col md={4}>
//                                                 <Image
//                                                     src={cart.cover_photo ? `https://alicedevapi.casamelhor.in${cart.cover_photo}` : "/images/icons/room-1.jpg"}
//                                                     alt="Room Image" width={300} height={200} className="img-fluid"
//                                                 />
//                                             </Col>
//                                             <Col md={8}>
//                                                 <p className="fw-semibold fs-20 mb-2 room-title">
//                                                     {calculateNights(cart.check_in_date, cart.check_out_date)} night stay in {cart?.room_name}
//                                                     <span className='room-type-badge ms-2'>{cart?.room_type}</span>
//                                                 </p>
//                                                 <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                     <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} className="img-fluid" />
//                                                     {cart.property_name}<br />
//                                                     {cart?.property_address}, {cart?.city}, {cart?.state}
//                                                 </p>
//                                             </Col>
//                                         </Row>

//                                         {/* Check-in / Check-out */}
//                                         <Row className="mt-3 mb-3">
//                                             <Col md={3}>
//                                                 <p className="mb-1 text-secondary small">Check-in:</p>
//                                                 <p className="fw-semibold mb-0">{formatDateMonthYear(cart?.check_in_date)}</p>
//                                                 <small>2:00 PM</small>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <p className="mb-1 text-secondary small">Check-out:</p>
//                                                 <p className="fw-semibold mb-0">{formatDateMonthYear(cart?.check_out_date)}</p>
//                                                 <small>11:00 AM</small>
//                                             </Col>
//                                         </Row>

//                                         {/* Room details */}
//                                         <div className="border-top pt-3">
//                                             <p className="mb-1 font-18">Room details</p>
//                                             <div className="room-specs d-flex gap-3 mb-2">
//                                                 <span className="spec-item d-flex gap-2">
//                                                     <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps {cart?.max_guests}
//                                                 </span> |
//                                                 <span className="spec-item d-flex gap-2">
//                                                     <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" />
//                                                     {cart?.beds?.length} {cart?.beds?.map((b, bi) => <span key={bi}>{b.bed_type} </span>)}
//                                                 </span> |
//                                                 <span className="spec-item d-flex gap-2">{cart?.room_size_sqft} sq ft</span>
//                                             </div>
//                                             <hr />

//                                             {/* Traveler section */}
//                                             <div className="traveler-section">
//                                                 <p className="mb-2 font-18">Travelers in this room</p>

//                                                 {/* Adult count radios */}
//                                                 <div className="d-flex gap-3 mb-3">
//                                                     {Array.from(
//                                                         { length: cart.max_guests > 2 ? cart.max_guests : 2 },
//                                                         (_, ind) => {
//                                                             const count = ind + 1;
//                                                             const isDisabled = cart.room_type === "Private" && count > 1;
//                                                             return (
//                                                                 <div key={count} className="radio-select-box d-flex gap-2"
//                                                                     style={{ background: "#F2F2F2", opacity: isDisabled ? 0.4 : 1 }}>
//                                                                     <label className="form-check-label d-flex gap-2 mb-0">
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`adult-count-${cart.room_uid}`}
//                                                                             value={count}
//                                                                             checked={cart.adults === count}
//                                                                             disabled={isDisabled}
//                                                                             onChange={(e) => handleAdultChange(e, cart)}
//                                                                         />
//                                                                         <span className="radio-checkmark"></span>
//                                                                         {count} Adult{count > 1 ? "s" : ""}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         }
//                                                     )}
//                                                 </div>

//                                                 <hr />

//                                                 {/* Exclusive booking toggle */}
//                                                 {cart?.room_type !== "Private" && (
//                                                     <>
//                                                         <Row className='mb-3'>
//                                                             <Col md={5}>
//                                                                 <label className="mb-0 d-flex gap-2 align-items-center show-my-booking">
//                                                                     <input className="mx-2 custom-checkbox" type="checkbox"
//                                                                         onChange={(e) => setIsExclusiveBooking(e.target.checked)} />
//                                                                     Exclusively book this room for the traveler
//                                                                 </label>
//                                                             </Col>
//                                                         </Row>
//                                                         <Row className='mb-2'>
//                                                             <Col md={6}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                     Since this is a twin bed, one will be available for booking unless you specify it for exclusive use.
//                                                                 </p>
//                                                             </Col>
//                                                         </Row>
//                                                     </>
//                                                 )}

//                                                 <p className="mb-2 font-18">Traveler details</p>
//                                                 <p className='small'>{`We'll use this information to book. Make sure the name matches what is on the traveler's passport or ID.`}</p>

//                                                 {/* Gender preference banners */}
//                                                 {cart?.bedroom_preference_badge === "FEMALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                 As this room has already been booked for a female for your selected dates, only female traveler bookings are allowed
//                                                             </p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}
//                                                 {cart?.bedroom_preference_badge === "MALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                 As this room has already been booked for a male for your selected dates, only male traveler bookings are allowed
//                                                             </p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}

//                                                 {/* Traveller rows */}
//                                                 <div className='property-list-2'>
//                                                     {Array.from({ length: cart.room_type === "Private" ? 1 : cart.adults }).map((_, travelerIndex) => {
//                                                         const slot = cart.travelerDetails?.[travelerIndex];
//                                                         if (!slot) return null;

//                                                         // Unique key for the dropdown ref
//                                                         const dropdownRefKey = `${cartIndex}-${travelerIndex}`;

//                                                         return (
//                                                             <div className="row mb-3" key={`traveler-${cart.room_uid}-${travelerIndex}`}>

//                                                                 {/* Role dropdown */}
//                                                                 <div className="col-md-4">
//                                                                     <Select
//                                                                         name="traveller_type"
//                                                                         options={travelOption}
//                                                                         placeholder="Choose Role"
//                                                                         className="react_selectbox"
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         onChange={(e) => handleSelectDropdown(e, cartIndex, travelerIndex)}
//                                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                     />
//                                                                 </div>

//                                                                 {/* Bed selector — Twin-Sharing only */}
//                                                                 {cart?.room_type === "Twin-Sharing" && (
//                                                                     <div className="col-md-3">
//                                                                         <Select
//                                                                             name="bed_index"
//                                                                             options={cart?.beds
//                                                                                 ?.map((b, i) => ({ value: i, label: b.name, type: b.bed_type }))
//                                                                                 .filter(opt => {
//                                                                                     if (Array.isArray(cart?.available_beds) && !cart.available_beds.includes(opt.value)) return false;
//                                                                                     return !cart.travelerDetails.some((t, i) => i !== travelerIndex && t.bedIndex === opt.value);
//                                                                                 })}
//                                                                             placeholder="Choose bed"
//                                                                             className="react_selectbox"
//                                                                             isSearchable={false}
//                                                                             styles={customStyles}
//                                                                             value={slot?.bedIndex !== null
//                                                                                 ? cart?.beds?.map((b, i) => ({ value: i, label: b.name }))[slot?.bedIndex] ?? null
//                                                                                 : null}
//                                                                             onChange={(e) => handleBedBookIndex(e, cart, travelerIndex)}
//                                                                         />
//                                                                     </div>
//                                                                 )}

//                                                                 {/* ── Searchable traveller input (API-driven, with scroll pagination) ── */}
//                                                                 <div className={cart?.room_type === "Twin-Sharing" ? "col-md-5" : "col-md-8"}>
//                                                                     {!slot?.data && (
//                                                                         <div className="form-group" style={{ position: "relative" }}>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className={`form-control user-icn2${slot?.isGenderValidation === "Error" ? " border-danger" : slot?.isGenderValidation === "Success" ? " border-success" : ""}`}
//                                                                                 placeholder={slot?.traveller_type ? "Search traveler..." : "Select a role first"}
//                                                                                 disabled={!slot?.traveller_type}
//                                                                                 value={slot?.searchText || ""}
//                                                                                 onFocus={() => {
//                                                                                     setCartItem(prev =>
//                                                                                         prev.map((room, cIdx) =>
//                                                                                             cIdx !== cartIndex ? room : {
//                                                                                                 ...room,
//                                                                                                 travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                                                                                                     tIdx !== travelerIndex ? t : { ...t, showList: true }
//                                                                                                 )
//                                                                                             }
//                                                                                         )
//                                                                                     );
//                                                                                     // Fetch page 1 on focus (only if list is empty to avoid re-fetching)
//                                                                                     if (!slot?.filteredUsers?.length) {
//                                                                                         fetchUsersForSlot(cartIndex, travelerIndex, slot?.searchText || "", slot?.traveller_type, 1);
//                                                                                     }
//                                                                                 }}
//                                                                                 onChange={(e) => {
//                                                                                     const val = e.target.value;
//                                                                                     setCartItem(prev =>
//                                                                                         prev.map((room, cIdx) =>
//                                                                                             cIdx !== cartIndex ? room : {
//                                                                                                 ...room,
//                                                                                                 travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                                                                                                     tIdx !== travelerIndex ? t : { ...t, searchText: val, showList: true }
//                                                                                                 )
//                                                                                             }
//                                                                                         )
//                                                                                     );
//                                                                                     // Debounced API call — resets to page 1 internally
//                                                                                     debouncedFetchUsersForSlot(cartIndex, travelerIndex, val, slot?.traveller_type);
//                                                                                 }}
//                                                                                 onBlur={() => {
//                                                                                     setTimeout(() => {
//                                                                                         setCartItem(prev =>
//                                                                                             prev.map((room, cIdx) =>
//                                                                                                 cIdx !== cartIndex ? room : {
//                                                                                                     ...room,
//                                                                                                     travelerDetails: room.travelerDetails.map((t, tIdx) =>
//                                                                                                         tIdx !== travelerIndex ? t : { ...t, showList: false }
//                                                                                                     )
//                                                                                                 }
//                                                                                             )
//                                                                                         );
//                                                                                     }, 200);
//                                                                                 }}
//                                                                             />

//                                                                             {/* Dropdown with infinite scroll */}
//                                                                             {slot?.showList && (
//                                                                                 <div
//                                                                                     ref={el => { dropdownRefs.current[dropdownRefKey] = el; }}
//                                                                                     onScroll={(e) => {
//                                                                                         const el = e.currentTarget;
//                                                                                         const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
//                                                                                         if (nearBottom && slot?.hasMore && !isSlotLoading(cartIndex, travelerIndex)) {
//                                                                                             const nextPage = (slot?.page || 1) + 1;
//                                                                                             fetchUsersForSlot(cartIndex, travelerIndex, slot?.searchText || "", slot?.traveller_type, nextPage);
//                                                                                         }
//                                                                                     }}
//                                                                                     style={{
//                                                                                         position: "absolute", top: "46px", left: 0, right: 0,
//                                                                                         background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                         borderRadius: "0px", zIndex: 10, padding: "16px",
//                                                                                         maxHeight: "300px", overflowY: "auto",
//                                                                                     }}
//                                                                                 >
//                                                                                     {isSlotLoading(cartIndex, travelerIndex) && slot?.filteredUsers?.length === 0 ? (
//                                                                                         // Initial loading state (no results yet)
//                                                                                         <div style={{ textAlign: "center", padding: "20px", color: "#73615F", fontSize: "14px" }}>
//                                                                                             Searching...
//                                                                                         </div>
//                                                                                     ) : slot?.filteredUsers?.length > 0 ? (
//                                                                                         <>
//                                                                                             {slot.filteredUsers.map((caretaker, idx) => (
//                                                                                                 <div
//                                                                                                     key={`c-${caretaker.uid || idx}`}
//                                                                                                     className="managers-data"
//                                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                                     onClick={() => handleCaretakerSelectWithValidation(
//                                                                                                         cart, cartIndex, travelerIndex, caretaker
//                                                                                                     )}
//                                                                                                     style={{
//                                                                                                         display: "flex", alignItems: "center",
//                                                                                                         marginBottom: "18px",
//                                                                                                         borderBottom: idx < slot.filteredUsers.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                         paddingBottom: "15px", cursor: "pointer",
//                                                                                                     }}
//                                                                                                 >
//                                                                                                     <Image
//                                                                                                         src={caretaker.profile_image
//                                                                                                             ? caretaker.profile_image
//                                                                                                             : caretaker?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                                         alt={caretaker.first_name}
//                                                                                                         width={48} height={48}
//                                                                                                         style={{ borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
//                                                                                                     />
//                                                                                                     <div>
//                                                                                                         <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                             {caretaker.first_name} {caretaker.last_name}
//                                                                                                         </div>
//                                                                                                         <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             ))}

//                                                                                             {/* Scroll loader — shows while fetching the next page */}
//                                                                                             {isSlotLoading(cartIndex, travelerIndex) && (
//                                                                                                 <div style={{ textAlign: "center", padding: "10px 0", fontSize: "13px", color: "#73615F" }}>
//                                                                                                     Loading more...
//                                                                                                 </div>
//                                                                                             )}

//                                                                                             {/* End of list indicator */}
//                                                                                             {!slot?.hasMore && !isSlotLoading(cartIndex, travelerIndex) && (
//                                                                                                 <div style={{ textAlign: "center", padding: "6px 0", fontSize: "12px", color: "#aaa" }}>
//                                                                                                     No more travelers
//                                                                                                 </div>
//                                                                                             )}

//                                                                                             <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
//                                                                                                 <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                                                                                     {`Can't find someone?`}<br />
//                                                                                                     <Link onClick={addTravel} href='#' style={{ color: '#463527' }}>Register a new traveler</Link>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </>
//                                                                                     ) : (
//                                                                                         <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                                                                                             <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                                                                                             <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
//                                                                                             <div style={{ fontSize: "14px", marginBottom: "16px", lineHeight: "1.4" }}>
//                                                                                                 {`Can't find the person you're looking for?`}
//                                                                                             </div>
//                                                                                             <Link href="/People" style={{
//                                                                                                 background: "#6B4F3F", color: "white", padding: "10px 20px",
//                                                                                                 width: "100%", display: "block", textAlign: "center", textDecoration: "none"
//                                                                                             }}>Invite to Join</Link>
//                                                                                         </div>
//                                                                                     )}
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     )}

//                                                                     {/* Validation feedback */}
//                                                                     {slot?.isGenderValidation === "Validating" && (
//                                                                         <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#BF9039" }}>⏳ Validating gender...</p>
//                                                                     )}
//                                                                     {slot?.isGenderValidation === "Error" && (
//                                                                         <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
//                                                                             ✕ Gender validation failed — this traveler is not allowed in this room
//                                                                         </p>
//                                                                     )}
//                                                                     {slot?.isGenderValidation === "Success" && !slot?.data && (
//                                                                         <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>✓ Gender validated</p>
//                                                                     )}
//                                                                 </div>

//                                                                 {/* Selected traveller card */}
//                                                                 <div className="col-md-12">
//                                                                     {slot?.data && (() => {
//                                                                         const found = selectedUsersCache.current[slot.data.uid] || slot.data;
//                                                                         return (
//                                                                             <div className="selected-caretaker-container">
//                                                                                 <div className="manager-list-full" style={{
//                                                                                     display: "flex", alignItems: "center",
//                                                                                     border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                     padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                                 }}>
//                                                                                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                         <Image
//                                                                                             src={found.profile_image
//                                                                                                 ? found.profile_image
//                                                                                                 : found?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                             alt={found.first_name}
//                                                                                             width={48} height={48}
//                                                                                             style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                         />
//                                                                                         <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                             {found.first_name} {found.last_name}
//                                                                                             <br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                 Emp. id: {found.employee_id}
//                                                                                             </span>
//                                                                                             <br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                 Dept: {found.segment}
//                                                                                             </span>
//                                                                                             {slot.isGenderValidation === "Success" && <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>}
//                                                                                             {slot.isGenderValidation === "Error" && <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>}
//                                                                                             {slot.isGenderValidation === "Validating" && <span style={{ fontSize: "12px", color: "#BF9039", marginLeft: "8px" }}>⏳ Validating...</span>}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                             {found.phone_number}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                             {found.email}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
//                                                                                             {found.gender}
//                                                                                         </span>
//                                                                                     </div>
//                                                                                     <div className="show-edit-btn">
//                                                                                         <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                             onClick={() => router.push(`/People?guest_uid=${found.uid}&show=true`)}>
//                                                                                             Edit details
//                                                                                         </Button>
//                                                                                         <button type="button" className="ms-auto"
//                                                                                             onClick={() => handleCaretakerRemove(cart, slot.id)}
//                                                                                             style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}
//                                                                                             title="Remove">
//                                                                                             <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         );
//                                                                     })()}
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <p className='d-flex gap-2 fw-medium justify-content-end'>
//                                         Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
//                                     </p>
//                                 </div>
//                             ))}

//                             {/* ── Arrival Details ── */}
//                             <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                 <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                 <p className="text-secondary mb-2">This information helps in operational planning, legal compliance, and personalized service.</p>

//                                 <Form.Group className='mb-4 mt-4' controlId="dateArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Date of Arrival In Individual House</Form.Label>
//                                     <DatePicker
//                                         selected={formData.dateArrival}
//                                         onChange={(e) => handleSelectChange(e, "dateArrival")}
//                                         selectsStart minDate={new Date()}
//                                         className="form-control custom-date-picker"
//                                         dateFormat="dd/MM/yyyy" placeholderText='DD/MM/YYYY'
//                                     />
//                                     <span className='text-danger'>{errorMessages.dateArrival}</span>
//                                 </Form.Group>

//                                 <Form.Group className='mb-4 mt-4' controlId="timeArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
//                                     <Select onChange={(e) => handleSelectChange(e.value, "timeArrival")} options={timeOption}
//                                         placeholder="Select time" className="react_selectbox" isSearchable={false} styles={customStyles} />
//                                     <span className='text-danger'>{errorMessages.timeArrival}</span>
//                                 </Form.Group>

//                                 <Form.Group className='mb-4' controlId="modeArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
//                                     <Select onChange={(e) => handleSelectChange(e.value, "modeArrival")} options={arrivalOption}
//                                         placeholder="Select mode" className="react_selectbox" isSearchable={false} styles={customStyles} />
//                                     <span className='text-danger'>{errorMessages.modeArrival}</span>
//                                 </Form.Group>

//                                 <div className='mb-4 form-group'>
//                                     <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
//                                     <input type="text" name="FlightTrainNumber" onChange={handleInputChange}
//                                         placeholder='Enter number e.g. MADGAON LTT EXP #11100' className='form-control' />
//                                     <span className='text-danger'>{errorMessages.FlightTrainNumber}</span>
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── Additional Comments ── */}
//                             <div className="arrival-section mt-4 pt-4">
//                                 <h3 className="font-24 mb-2">Additional Comments</h3>
//                                 <div className='mb-5 form-group'>
//                                     <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
//                                     <input type="text" name="refnumber" onChange={handleInputChange}
//                                         placeholder='Reference number to be entered for your internal purpose (optional)' className='form-control' />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── Other Essential Details ── */}
//                             <div className="arrival-section mt-4 pt-3 mb-5">
//                                 <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                 <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
//                                 <div className='mb-4 form-group'>
//                                     <textarea className='form-control' name="essentialDetails" onChange={handleInputChange}
//                                         placeholder='Got any thoughts or questions? Add them here! (Optional)' />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── Confirmation email ── */}
//                             <div className="confirmation-email-section my-5 pb-5">
//                                 <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3'
//                                     style={{ maxWidth: '360px', cursor: 'pointer' }}>
//                                     <input type="checkbox" className="mx-2 custom-checkbox"
//                                         checked={isEmailEnabled}
//                                         onChange={(e) => setIsEmailEnabled(e.target.checked)} />
//                                     Send copy of confirmation email
//                                 </label>

//                                 {isEmailEnabled && (
//                                     <div className="email-content">
//                                         <p className='fw-bold mb-3' style={{ color: '#6B4F3F' }}>Add info</p>
//                                         {receivers.map((receiver, index) => (
//                                             <div key={receiver.id} className="receiver-item">
//                                                 {index > 0 && (<><hr className="my-4" /><p className='fw-bold mb-3'>Receiver {index + 1}</p></>)}
//                                                 <div className='form-group mb-4'>
//                                                     <label className="form-label fw-medium">Email</label>
//                                                     <div className='row align-items-center'>
//                                                         <div className='col-md-5'>
//                                                             <input type='email'
//                                                                 className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
//                                                                 placeholder='Enter receiver email'
//                                                                 value={receiver.email}
//                                                                 onChange={(e) => handleEmailChange(receiver.id, e.target.value)} />
//                                                             {receiver.email && !isValidEmail(receiver.email) && (
//                                                                 <div className="invalid-feedback d-block">Please enter a valid email address</div>
//                                                             )}
//                                                         </div>
//                                                         <div className='col-md-1 d-flex align-items-center'>
//                                                             {index === 0 ? (
//                                                                 <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0" disabled={receivers.length >= 5}>
//                                                                     <Image src='./images/icons/add_circle.svg' alt='Add' width={32} height={32} style={{ opacity: receivers.length >= 5 ? 0.5 : 1 }} />
//                                                                 </button>
//                                                             ) : (
//                                                                 <button type="button" onClick={() => handleRemoveReceiver(receiver.id)} className="btn btn-link p-0">
//                                                                     <Image src='./images/icons/close-circle.svg' alt='Remove' width={32} height={32} />
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         {receivers.length >= 5 && <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>}
//                                     </div>
//                                 )}
//                             </div>
//                         </Col>

//                         {/* ── Booking Summary ── */}
//                         <Col md={4} className='ps-5'>
//                             <div className='booking-summary-colum'>
//                                 <div className="d-flex align-items-center justify-between mb-4">
//                                     <h4 className='font-24 mb-0'>Booking Summary</h4>
//                                     <label className='mb-0 d-flex gap-2 align-items-center'>
//                                         <input type="checkbox" className="mx-2 custom-checkbox"
//                                             checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show prices
//                                     </label>
//                                 </div>

//                                 <div className="booking-summary">
//                                     <div className="summary-details">
//                                         <div className="summary-row">
//                                             <span className="summary-label">BRs Selected</span>
//                                             <span className="summary-value">{cartItem.length}</span>
//                                         </div>
//                                         <div className="summary-row">
//                                             <span className="summary-label">Number of Rooms</span>
//                                             <span className="summary-value">{cartItem.length} Room{cartItem.length > 1 ? "s" : ""}</span>
//                                         </div>
//                                         <div className="summary-row">
//                                             <span className="summary-label">Travelers</span>
//                                             <span className="summary-value">{totalTravelers} Adult{totalTravelers > 1 ? "s" : ""}</span>
//                                         </div>

//                                         {cartItem.map((item) => {
//                                             const nights = calculateNights(item.check_in_date, item.check_out_date);
//                                             const roomPrice = (item.price_per_night || 0) * nights;
//                                             return (
//                                                 <div key={item.room_uid} className="summary-row detailed">
//                                                     <span className="summary-label">{item.room_name} Pricing</span>
//                                                     <div className="summary-value-detailed">
//                                                         <div className="price-desc">{item.adults} Guest x {nights} nights</div>
//                                                         {showPrices && (
//                                                             <div className="price-amount">₹{roomPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                                                         )}
//                                                         <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}

//                                         <div className="total-section">
//                                             <span className="total-label">Total Price</span>
//                                             <div className="total-value-detailed">
//                                                 <div className="total-desc">{totalTravelers} Guest x {totalNights} nights</div>
//                                                 {showPrices && (
//                                                     <div className="total-amount">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
//                                                 )}
//                                                 <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <button onClick={handleSubmitReserve} className="confirm-btn" disabled={isSubmitting}
//                                         style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}>
//                                         {isSubmitting ? "Validating & Reserving..." : "Confirm and Reserve"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             {/* ── Edit Stay Details Modal ── */}
//             <Modal show={addTravels2} onHide={removeTravel2} animation={false} centered size="xl" className='custom-theme-modal-2'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title>Edit Stay Details</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel2} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         <Row className='gap-0'>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Which company?</label>
//                                     <Select options={companyList} placeholder="Select company" className="react_selectbox" isSearchable={false}
//                                         value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
//                                         onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.value })}
//                                         styles={customStyles} />
//                                 </div>
//                             </Col>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Where to?</label>
//                                     <Select options={cityList} placeholder="Select city" className="react_selectbox" isSearchable={false}
//                                         getOptionLabel={(o) => o.city} getOptionValue={(o) => o.city}
//                                         value={cityList?.find(c => c.city === searchFieldData.city) || null}
//                                         onChange={(o) => setSearchFieldData({ ...searchFieldData, city: o.city })}
//                                         styles={customStyles} />
//                                 </div>
//                             </Col>
//                             <Col md={4} className='gap-2'>
//                                 <div className='d-flex gap-0'>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Check-in date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
//                                             minDate={new Date()} className="form-control custom-date-picker"
//                                             dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
//                                     </div>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Checkout date</label>
//                                         <DatePicker
//                                             selected={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
//                                             minDate={new Date()} className="form-control custom-date-picker"
//                                             dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
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
//                                                     {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((s, r) => s + r.adults, 0)} guest${rooms.reduce((s, r) => s + r.adults, 0) > 1 ? 's' : ''}`}
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
//                                                                         <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleModalAdultChange(room.id, -1); }}>-</button>
//                                                                         <span>{room.adults}</span>
//                                                                         <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleModalAdultChange(room.id, 1); }}>+</button>
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
//                                                                 setSearchFieldData({ ...searchFieldData, rooms: rooms.map(r => ({ adults: r.adults })) });
//                                                             }}>Done</button>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </Col>
//                                     <Col md={5}>
//                                         <div className='form-group h-100 align-items-center d-flex pt-1'>
//                                             <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', borderRadius: '0', color: '#fff' }}
//                                                 variant='' onClick={handleUpdateSearch}>Update Search</Button>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Modal.Body>
//             </Modal>

//             {/* ── Add Person Modal ── */}
//             <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} roleOption={role} companyList={companyList} addTravel={addTravel} />

//             {/* ── Price Breakdown Modal ── */}
//             <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         {cartItem.map(item => {
//                             const nights = calculateNights(item.check_in_date, item.check_out_date);
//                             return (
//                                 <div key={item.room_uid} className='d-flex justify-between pt-2 pb-2'>
//                                     <span>{item.room_name} x {item.adults} guest x {nights} nights</span>
//                                     <span style={{ color: '#BF9039', fontWeight: '500' }}>
//                                         ₹{((item.price_per_night || 0) * nights).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                     </span>
//                                 </div>
//                             );
//                         })}
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
//                     <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>
//                         ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                     </span>
//                 </Modal.Footer>
//             </Modal>

//             {/* ── Booking Confirmed Modal ── */}
//             <Modal show={showReserveModal} onHide={removeReserve} animation={false} centered className='custom-theme-modal-2 modal-460'>
//                 <Modal.Body className='pt-4 pb-4'>
//                     {bookingConfirmedData?.length > 0 && (
//                         <div className="flex items-center justify-center gap-6">
//                             <button onClick={() => setCurrent((current - 1 + bookingConfirmedData.length) % bookingConfirmedData.length)}
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none">‹</button>
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
//                             <button onClick={() => setCurrent((current + 1) % bookingConfirmedData.length)}
//                                 className="text-gray-500 hover:text-black text-lg font-semibold cursor-pointer select-none">›</button>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between flex-col'>
//                     <Link href={`/BookingDetails/${bookingConfirmedData[0]?.uid}`}
//                         className="p-2 w-100 text-center d-flex align-items-center justify-content-center"
//                         style={{ background: "#2C734A", borderRadius: "0", color: "#fff", minHeight: "58px", textDecoration: "none" }}>
//                         View Booking Details
//                     </Link>
//                     <Link href="/CreateBooking"
//                         className="text-center justify-center edit-btn w-100 d-flex align-items-center justify-content-center"
//                         style={{ minHeight: "58px", textDecoration: "none" }}>
//                         Create Another Booking
//                     </Link>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }


"use client"
import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header/Header'
import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import Select, { components } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AddPersonModel } from '../commons/AddPersonModel';
import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
import { calculateNights, convertTo24Hour, formatDateMonthYear, formatRoomsAndGuests, formatStayDates, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
import { companyListAPI, CreateBookingPost, PropertyListFullApi, UserListAPI, UserRoleListAPI, validateGender } from '@/services/provider';
import { ArrivalDetailValidation } from '@/utils/validation';
import toast, { Toaster } from 'react-hot-toast';

export default function MultiRoomsReserve() {
    // ─── Local storage ────────────────────────────────────────────────────────
    const multiroomsSelected = JSON.parse(getItemLocalStorage("multiroomreserve"));
    const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
    const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
    const loginData = JSON.parse(getItemLocalStorage("userLogin"));

    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ─── Debounce timers: rowSearchTimers.current[`${cartIndex}-${travelerIndex}`] ──
    const rowSearchTimers = useRef({});
    // ─── User object cache by uid so selected card always renders ─────────────
    const selectedUsersCache = useRef({});
    // ─── Refs for each slot's dropdown div — used for scroll detection ─────────
    const dropdownRefs = useRef({});

    // ─── Search edit modal state ──────────────────────────────────────────────
    const [searchFieldData, setSearchFieldData] = useState({
        company_id: 0,
        city: "",
        check_in_date: "",
        check_out_date: "",
        rooms: [],
        is_available: true,
        company_name: '',
        c_uid: ""
    });

    // ─── Arrival / comment form ───────────────────────────────────────────────
    const [formData, setFormData] = useState({
        dateArrival: "",
        timeArrival: "",
        modeArrival: "",
        FlightTrainNumber: "",
        refnumber: "",
        essentialDetails: ""
    });
    const [errorMessages, setErrorMessages] = useState({});

    // ─── Cart: one entry per selected room, each enriched with travelerDetails ─
    const [cartItem, setCartItem] = useState([]);

    const [showPrices, setShowPrices] = useState(false);
    const [bookingConfirmedData, setBookingConfirmedData] = useState([]);
    const [isExclusiveBooking, setIsExclusiveBooking] = useState(false);

    // ─── Modal visibility ─────────────────────────────────────────────────────
    const [addTravels, addTravelsetShow] = useState(false);
    const removeTravel = () => addTravelsetShow(false);
    const addTravel = () => addTravelsetShow(true);

    const [addBreakdowns, addBreakdownsetShow] = useState(false);
    const removeBreakdown = () => addBreakdownsetShow(false);
    const addbreakdown = () => addBreakdownsetShow(true);

    const [showReserveModal, setShowReserveModal] = useState(false);
    // const removeReserve = () => setShowReserveModal(false);
    const removeReserve = () => {
        setShowReserveModal(false);
        router.push(`/BookingDetails/${bookingConfirmedData[0]?.booking_uid}`);
    };

    const [addTravels2, addTravel2setShow] = useState(false);
    const removeTravel2 = () => addTravel2setShow(false);
    const addTravel2 = () => addTravel2setShow(true);

    const countNights = (fromDate, toDate) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
        return nights;
    }

    // ─── Per-slot search loading state ───────────────────────────────────────
    const [rowSearchLoading, setRowSearchLoading] = useState({});

    // ─── Initialise cartItem from localStorage ────────────────────────────────
    useEffect(() => {
        if (Array.isArray(multiroomsSelected) && multiroomsSelected.length) {
            const initialCart = multiroomsSelected.map(item => ({
                ...item,
                lockedGender: null,
                travelerDetails: Array.from(
                    { length: item.room_type === "Private" ? 1 : item.adults },
                    (_, i) => ({
                        id: `${item.room_id}-${i}`,
                        data: null,
                        bedIndex: null,
                        isGenderValidation: "",
                        searchText: "",
                        showList: false,
                        filteredUsers: [],
                        traveller_type: null,
                        page: 1,
                        hasMore: true,
                    })
                )
            }));
            setCartItem(initialCart);
        }
    }, []);

    // ─── Helpers: set/read nested loading flag ────────────────────────────────
    const getDateOnly = (dateTime) => dateTime?.split("T")[0];

    const setSlotLoading = (cartIndex, travelerIndex, val) => {
        setRowSearchLoading(prev => ({
            ...prev,
            [cartIndex]: { ...(prev[cartIndex] || {}), [travelerIndex]: val }
        }));
    };
    const isSlotLoading = (cartIndex, travelerIndex) =>
        !!rowSearchLoading?.[cartIndex]?.[travelerIndex];

    // ─── Core API fetch for one slot with pagination ─────────────────────────
    const fetchUsersForSlot = async (cartIndex, travelerIndex, searchTerm, travellerType, pageNum = 1) => {
        // Guard: don't fetch next page if slot already says no more data
        if (pageNum > 1) {
            const slot = cartItem[cartIndex]?.travelerDetails?.[travelerIndex];
            if (!slot?.hasMore) return;
        }

        setSlotLoading(cartIndex, travelerIndex, true);
        try {
            const category = travellerType === "External-Guest" ? "" : searchFieldData.company_name
            const response = await UserListAPI("All", '', searchTerm, '', '', '', '', '', category, pageNum);
            if (response?.data?.success) {
                const raw = response.data.response || [];
                const hasMoreData = raw.length > 0;

                let result = [...raw];

                // // Role filter
                if (travellerType === "External-Guest") {
                    result = result.filter(u => u?.user_role?.role_name === "External");
                }
                // else if (travellerType === "Company-Employee") {
                //     result = result.filter(u =>
                //         u?.user_role?.role_name !== "External" &&
                //         u?.user_company?.id === bacisSearchDetails?.company_id
                //     );
                // }

                // Gender preference filter
                const badge = cartItem[cartIndex]?.bedroom_preference_badge;
                if (badge === "FEMALE PREFERRED") result = result.filter(u => u.gender === "Female");
                if (badge === "MALE PREFERRED") result = result.filter(u => u.gender === "Male");

                setCartItem(prev =>
                    prev.map((room, cIdx) =>
                        cIdx !== cartIndex ? room : {
                            ...room,
                            travelerDetails: room.travelerDetails.map((t, tIdx) =>
                                tIdx !== travelerIndex ? t : {
                                    ...t,
                                    filteredUsers: pageNum === 1 ? result : [...t.filteredUsers, ...result],
                                    page: pageNum,
                                    hasMore: hasMoreData,
                                }
                            )
                        }
                    )
                );
            }
        } catch (err) {
            console.error("fetchUsersForSlot error:", err);
        } finally {
            setSlotLoading(cartIndex, travelerIndex, false);
        }
    };

    // ─── Debounced wrapper — resets page to 1 on every new search ────────────
    const debouncedFetchUsersForSlot = (cartIndex, travelerIndex, searchTerm, travellerType) => {
        const key = `${cartIndex}-${travelerIndex}`;
        if (rowSearchTimers.current[key]) clearTimeout(rowSearchTimers.current[key]);
        rowSearchTimers.current[key] = setTimeout(() => {
            // Reset pagination state before the API call
            setCartItem(prev =>
                prev.map((room, cIdx) =>
                    cIdx !== cartIndex ? room : {
                        ...room,
                        travelerDetails: room.travelerDetails.map((t, tIdx) =>
                            tIdx !== travelerIndex
                                ? t
                                : { ...t, page: 1, hasMore: true, filteredUsers: [] }
                        )
                    }
                )
            );
            fetchUsersForSlot(cartIndex, travelerIndex, searchTerm, travellerType, 1);
        }, 350);
    };

    // ─── Dropdown helpers ─────────────────────────────────────────────────────
    const travelOption = [
        { value: "Company-Employee", label: "Company employee", icon: "../images/icons/hail.svg" },
        { value: "External-Guest", label: "External", icon: "../images/icons/short_stay.svg" },
    ];

    const CustomOption = (props) => (
        <components.Option {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image
                        src={props.data.icon
                            ? props.data.icon
                            : props.data.gender === "Male"
                                ? "/images/icons/young-boy.jpg"
                                : "/images/icons/young-girl.jpg"
                        }
                        alt={props.data.label}
                        width={20}
                        height={20}
                    />
                    <span>{props.data.label}</span>
                </div>
                {props.isSelected && <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>}
            </div>
        </components.Option>
    );

    const CustomSingleValue = (props) => (
        <components.SingleValue {...props}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
                <span>{props.data.label}</span>
            </div>
        </components.SingleValue>
    );

    // ─── Role picker change: clear slot, immediately fetch page 1 from API ────
    const handleSelectDropdown = (e, cartIndex, travelerIndex) => {
        const travellerType = e.value;

        setCartItem(prev =>
            prev.map((room, cIdx) =>
                cIdx !== cartIndex ? room : {
                    ...room,
                    travelerDetails: room.travelerDetails.map((t, tIdx) =>
                        tIdx !== travelerIndex ? t : {
                            ...t,
                            traveller_type: travellerType,
                            data: null,
                            searchText: "",
                            filteredUsers: [],
                            isGenderValidation: "",
                            page: 1,
                            hasMore: true,
                        }
                    )
                }
            )
        );

        // Immediate fetch (no debounce — role just changed)
        fetchUsersForSlot(cartIndex, travelerIndex, "", travellerType, 1);
    };

    // ─── Arrival form handlers ────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const { error } = ArrivalDetailValidation({ [name]: value });
        setErrorMessages(prev => ({ ...prev, ...error }));
    };

    const handleSelectChange = (value, name) => {
        setFormData(prev => ({ ...prev, [name]: name === "timeArrival" ? convertTo24Hour(value) : value }));
        const { error } = ArrivalDetailValidation({ [name]: value });
        setErrorMessages(prev => ({ ...prev, ...error }));
    };

    const timeOption = generateTimeOptions12Format(30);
    const arrivalOption = [
        { value: "Flight", label: "Flight" },
        { value: "Train", label: "Train" }
    ];

    // ─── Edit stay details ────────────────────────────────────────────────────
    const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
    const [companyList, setCompanyList] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [role, setRole] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

    const getProprtyList = async () => {
        try {
            const response = await PropertyListFullApi();
            if (response?.data?.success) {
                const uniqueCities = [
                    { city: "Jaipur" },
                    ...Array.from(
                        new Set(response.data.response.map(ele => ele.city)),
                        city => ({ city })
                    ).filter(item => item.city !== "Jaipur")
                ];
                setCityList(uniqueCities);
            }
        } catch (error) { console.log(error); }
    };

    const getUserListDataAPI = async () => {
        try {
            const response = await UserRoleListAPI(loginData?.uid);
            if (response?.data?.success) {
                setRole(response.data.response.map(val => ({
                    value: val?.uid,
                    label: val?.role_name,
                    icon: val?.role_icon,
                })));
            }
        } catch (error) { console.error("userListData error:", error); }
    };

    const getCompanyList = async () => {
        try {
            const response = await companyListAPI("all");
            if (response?.data?.success) {
                setCompanyList(response.data.response.map(item => ({
                    value: item.id,
                    label: item.company_name
                })));
            }
        } catch (error) { console.log(error); }
    };

    const loadMoreCompanies = async () => {
        try {
            const nextPage = page + 1;

            const response = await companyListAPI(searchKey, nextPage);

            if (response?.data?.success) {

                const list = response?.data?.response?.map((Val) => ({
                    value: Val?.uid,
                    label: Val?.company_name
                }));

                // Append new data
                setCompanyList(prev => [...prev, ...list]);

                setPage(nextPage);

                // If less than 10 returned → no more data
                if (list.length < 10) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCompanyList();
        getProprtyList();
        getUserListDataAPI();
        if (bacisSearchDetails) {
            setSearchFieldData({
                company_id: bacisSearchDetails.company_id,
                city: bacisSearchDetails.city,
                check_in_date: bacisSearchDetails.check_in_date,
                check_out_date: bacisSearchDetails.check_out_date,
                rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults })),
                company_name: bacisSearchDetails.company_name,
                c_uid: bacisSearchDetails.c_uid
            });
            setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })));
        }
    }, []);

    useEffect(() => {
        if (searchKey) getCompanyList()
    }, [searchKey])

    const handleUpdateSearch = () => {
        localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
        setTimeout(() => {
            removeItemLocalStorage("multiroomreserve");
            router.push('/Searchresult');
        }, 0);
    };

    // Adult count change — rebuilds travelerDetails for that room
    const handleAdultChange = (e, roomData) => {
        const newCount = Number(e.target.value);
        setCartItem(prev =>
            prev.map(room =>
                room.room_uid !== roomData.room_uid ? room : {
                    ...room,
                    adults: newCount,
                    lockedGender: null,
                    travelerDetails: Array.from({ length: newCount }, (_, i) => ({
                        id: `${room.room_id}-${i}`,
                        data: null,
                        bedIndex: null,
                        isGenderValidation: "",
                        searchText: "",
                        showList: false,
                        filteredUsers: [],
                        traveller_type: null,
                        page: 1,
                        hasMore: true,
                    }))
                }
            )
        );
    };

    // Modal room counter (Edit Stay modal only)
    const handleModalAdultChange = (roomId, change) => {
        setRooms(rooms.map(r => {
            if (r.id === roomId) {
                const nv = r.adults + change;
                return { ...r, adults: nv >= 1 ? nv : 1 };
            }
            return r;
        }));
    };

    const addRoom = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
    const deleteRoom = (roomId) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== roomId)); };

    const handleBedBookIndex = (e, roomData, travelerIndex) => {
        setCartItem(prev =>
            prev.map(room =>
                room.room_uid !== roomData.room_uid ? room : {
                    ...room,
                    travelerDetails: room.travelerDetails.map((t, i) =>
                        i === travelerIndex ? { ...t, bedIndex: e.value } : t
                    )
                }
            )
        );
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#6B4F3F" : "#ced4da",
            boxShadow: state.isFocused ? "0 0 0 1px #6B4F3F" : "none",
            "&:hover": { borderColor: "#6B4F3F" },
            borderRadius: "0px",
            minHeight: "48px",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#6B4F3F" : state.isFocused ? "#f0e8e3" : "transparent",
            color: state.isSelected ? "white" : "#463527",
            cursor: "pointer",
            padding: "10px 16px",
        }),
        menu: (base) => ({
            ...base,
            background: "#f9f6f4",
            border: "1px solid #6B4F3F",
            borderRadius: "0",
            zIndex: 10,
        }),
        menuList: (base) => ({
            ...base,
            padding: "8px 0",
            maxHeight: "260px",
        }),
        placeholder: (base) => ({ ...base, color: "#aaa" }),
        singleValue: (base) => ({ ...base, color: "#463527" }),
    };

    // ─── Caretaker remove ─────────────────────────────────────────────────────
    // const handleCaretakerRemove = (roomData, travelerId) => {
    //     setCartItem(prev =>
    //         prev.map(room =>
    //             room.room_uid !== roomData.room_uid ? room : {
    //                 ...room,
    //                 travelerDetails: room.travelerDetails.map(t =>
    //                     t.id !== travelerId ? t : {
    //                         ...t,
    //                         data: null,
    //                         searchText: "",
    //                         filteredUsers: [],
    //                         isGenderValidation: "",
    //                         page: 1,
    //                         hasMore: true,
    //                     }
    //                 )
    //             }
    //         )
    //     );
    // };
    const handleCaretakerRemove = (roomData, travelerId) => {
        setCartItem(prev =>
            prev.map(room => {
                if (room.room_uid !== roomData.room_uid) return room;

                const updatedDetails = room.travelerDetails.map(t =>
                    t.id !== travelerId ? t : {
                        ...t,
                        data: null,
                        searchText: "",
                        filteredUsers: [],
                        isGenderValidation: "",
                        page: 1,
                        hasMore: true,
                    }
                );

                // Recalculate lock — find first remaining selected traveler
                const remaining = updatedDetails.filter(t => t.data);
                const newLock = remaining.length > 0
                    ? (selectedUsersCache.current[remaining[0].data.uid]?.gender || remaining[0].data.gender)
                    : null;

                return {
                    ...room,
                    travelerDetails: updatedDetails,
                    lockedGender: newLock,   // ← recalculate or clear
                };
            })
        );
    };

    // ─── Email recipients ─────────────────────────────────────────────────────
    const [isEmailEnabled, setIsEmailEnabled] = useState(false);
    const [receivers, setReceivers] = useState([{ id: 1, email: '' }]);

    const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
    const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
    const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // ─── Gender validation ────────────────────────────────────────────────────
    const validateTravellerGender = async (roomData, travelerUid, bedIndex) => {
        try {
            const payload = {
                room_uid: roomData.room_uid,
                traveler_uid: travelerUid,
                check_in_date: roomData.check_in_date,
                check_out_date: roomData.check_out_date,
                bed_index: bedIndex,
            };
            const response = await validateGender(payload);
            return response?.data?.response?.valid === true;
        } catch {
            return false;
        }
    };

    // ─── Caretaker selected from dropdown ────────────────────────────────────
    const handleCaretakerSelectWithValidation = async (
        roomData, cartIndex, travelerIndex, caretaker
    ) => {
        // Cache user object so card survives filteredUsers being cleared
        if (caretaker?.uid) selectedUsersCache.current[caretaker.uid] = caretaker;

        // ── Gender lock check ──────────────────────────────────────
        const currentRoom = cartItem[cartIndex];
        if (
            currentRoom?.lockedGender &&
            caretaker?.gender &&
            caretaker.gender !== currentRoom.lockedGender
        ) {
            toast.error(
                `This room is locked to ${currentRoom.lockedGender} travelers. Please select a ${currentRoom.lockedGender} traveler.`
            );
            return;  // stop here — no API call, no state update
        }

        const displayName = `${caretaker.first_name} ${caretaker.last_name}`;

        // Set data + clear dropdown list immediately
        setCartItem(prev =>
            prev.map((room, cIdx) =>
                cIdx !== cartIndex ? room : {
                    ...room,
                    travelerDetails: room.travelerDetails.map((t, tIdx) =>
                        tIdx !== travelerIndex ? t : {
                            ...t,
                            data: caretaker,
                            searchText: displayName,
                            showList: false,
                            filteredUsers: [],
                            isGenderValidation: roomData.room_type !== "Private" ? "Validating" : "",
                        }
                    )
                }
            )
        );

        // Only validate for non-private rooms
        if (roomData.room_type !== "Private") {
            const isValid = await validateTravellerGender(roomData, caretaker.uid, travelerIndex);

            setCartItem(prev =>
                prev.map((room, cIdx) =>
                    cIdx !== cartIndex ? room : {
                        ...room,
                        travelerDetails: room.travelerDetails.map((t, tIdx) =>
                            tIdx !== travelerIndex ? t : {
                                ...t,
                                isGenderValidation: isValid ? "Success" : "Error"
                            }
                        )
                    }
                )
            );

            // isValid
            //     ? toast.success(`Traveler ${travelerIndex + 1}: Gender validated successfully`)
            //     : toast.error(`Traveler ${travelerIndex + 1}: Gender validation failed — this traveler is not allowed in this room`);
            if (isValid) {
                // Set gender lock on this room if not already locked
                setCartItem(prev =>
                    prev.map((room, cIdx) =>
                        cIdx !== cartIndex ? room : {
                            ...room,
                            lockedGender: room.lockedGender ?? caretaker.gender,
                        }
                    )
                );
                toast.success(`Traveler ${travelerIndex + 1}: Gender validated successfully`);
            } else {
                toast.error(`Traveler ${travelerIndex + 1}: Gender validation failed — this traveler is not allowed in this room`);
            }
        }
    };

    // ─── Pre-submit full gender validation ───────────────────────────────────
    const validateAllTravellersGender = async () => {
        let allValid = true;

        for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
            const room = cartItem[cartIndex];
            if (room.room_type === "Private") continue;

            for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
                const traveler = room.travelerDetails[tIdx];
                if (!traveler.data) {
                    toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: No traveler selected`);
                    allValid = false;
                    continue;
                }
                const isValid = await validateTravellerGender(room, traveler.data.uid, tIdx);

                setCartItem(prev =>
                    prev.map((r, cIdx) =>
                        cIdx !== cartIndex ? r : {
                            ...r,
                            travelerDetails: r.travelerDetails.map((t, i) =>
                                i !== tIdx ? t : { ...t, isGenderValidation: isValid ? "Success" : "Error" }
                            )
                        }
                    )
                );

                if (!isValid) {
                    toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: Gender validation failed — booking blocked`);
                    allValid = false;
                }
            }
        }
        return allValid;
    };

    // ─── Submit booking ───────────────────────────────────────────────────────
    const cleanPayload = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(cleanPayload);
        } else if (obj !== null && typeof obj === "object") {
            return Object.fromEntries(
                Object.entries(obj)
                    .filter(([_, v]) => v !== null && v !== undefined && v !== "")
                    .map(([k, v]) => [k, cleanPayload(v)])
            );
        }
        return obj;
    };

    const handleSubmitReserve = async () => {
        // const { error, isValid } = ArrivalDetailValidation(formData);
        // setErrorMessages(error);
        // if (!isValid) return;

        for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
            const room = cartItem[cartIndex];
            for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
                if (!room.travelerDetails[tIdx].data) {
                    toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: Please select a traveler`);
                    return;
                }
            }
        }

        setIsSubmitting(true);
        const allGenderValid = await validateAllTravellersGender();
        if (!allGenderValid) {
            toast.error("Booking blocked: one or more travelers failed gender validation");
            setIsSubmitting(false);
            return;
        }

        try {
            const cartData = cartItem.map(item => ({
                property_uid: item.property_uid,
                room_uid: item.room_uid,
                bed_index: item.room_type === "Private" ? null : (item.travelerDetails[0]?.bedIndex ?? null),
                check_in_date: item.check_in_date,
                check_out_date: item.check_out_date
            }));

            const travelerAssignmentsFull = cartItem.flatMap((item, cartIndex) =>
                item.travelerDetails.map((traveler) => ({
                    cart_item_index: cartIndex,
                    traveler_id: traveler.data?.uid,
                    is_exclusive_booking: isExclusiveBooking
                }))
            ).filter(a => a.traveler_id);

            const payload = {
                company_id: searchFieldData.company_id || bacisSearchDetails?.company_id,
                cart_items: cartData,
                traveler_assignments: travelerAssignmentsFull,
                arrival_details: {
                    arrival_date: formData.dateArrival ? formatYMD(formData.dateArrival) : '',
                    arrival_time: formData.timeArrival,
                    mode_of_arrival: formData.modeArrival,
                    transport_number: formData.FlightTrainNumber
                },
                additional_comments: formData.essentialDetails,
                company_booking_reference: formData.refnumber,
                send_confirmation_email: isEmailEnabled,
                additional_email_recipients: receivers.some(i => !i.email) ? [] : receivers.map(r => r.email),
                adults_count: totalTravelers
            };

            const response = await CreateBookingPost(cleanPayload(payload));
            if (response.data.success) {
                setBookingConfirmedData(response.data.response.bookings);
                setShowReserveModal(true);
                toast.success("Booking Created Successfully");
                removeItemLocalStorage("multiroomreserve");
                removeItemLocalStorage("searchParam");
                removeItemLocalStorage("basicSecrchItemObj");
            } else {
                response.data.response.validation_errors.forEach(el => toast.error(el.error));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to create booking");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Booking summary computed values ─────────────────────────────────────
    const totalNights = cartItem.length > 0
        ? calculateNights(cartItem[0]?.check_in_date, cartItem[0]?.check_out_date)
        : 0;
    const totalPrice = cartItem.reduce((sum, item) =>
        sum + (item.price_per_night || 0) * calculateNights(item.check_in_date, item.check_out_date), 0
    );
    const totalTravelers = cartItem.reduce((sum, item) =>
        sum + (item.travelerDetails?.length || 0), 0
    );

    // Custom MenuList component with scroll handling
    const CustomMenuList = (props) => {
        const { children, innerRef, innerProps, selectProps } = props;
        const { options, cartIndex, travelerIndex } = selectProps;
        const isEmpty = !options || options.length === 0;

        return (
            <div
                ref={innerRef}
                {...innerProps}
                style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                }}
                onScroll={(e) => {
                    const el = e.currentTarget;
                    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
                    if (nearBottom && cartIndex !== undefined && travelerIndex !== undefined) {
                        const slot = cartItem[cartIndex]?.travelerDetails?.[travelerIndex];
                        if (slot?.hasMore && !isSlotLoading(cartIndex, travelerIndex)) {
                            const nextPage = (slot?.page || 1) + 1;
                            fetchUsersForSlot(cartIndex, travelerIndex, slot?.searchText || "", slot?.traveller_type, nextPage);
                        }
                    }
                }}
            >
                {isEmpty ? (
                    <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
                            {"Can't find someone?"}<br />
                            <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>
                                Register a new traveler
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {children}
                        <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
                                {"Can't find someone?"}<br />
                                <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>
                                    Register a new traveler
                                </Link>
                            </div>
                        </div>
                    </>
                )}
                {isSlotLoading(cartIndex, travelerIndex) && (
                    <div style={{ padding: "8px 10px", fontSize: "13px", color: "#73615F", textAlign: "center" }}>
                        Loading...
                    </div>
                )}
            </div>
        );
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            <Header />
            <Toaster position="top-right" />

            <div className='searching-result-top'>
                <Container>
                    <div className='search-result-header'>
                        <h4>{searchBookingData?.company_name} | {searchBookingData?.city}</h4>
                        <p className='mb-0'>
                            <Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />
                            {formatStayDates(searchBookingData?.check_in_date, searchBookingData?.check_out_date)} |
                            <Image src='./images/icons/group.svg' alt='group' className="img-fluid" width={24} height={24} />
                            {formatRoomsAndGuests(bacisSearchDetails?.rooms)}
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
                            <h4 className='font-24 mb-4'>Review Your Selected BRs ({cartItem.length})</h4>

                            {cartItem.map((cart, cartIndex) => (
                                <div key={`cart-${cart.room_uid}`}>
                                    {/* Bedroom header */}
                                    <div className='d-flex align-items-center gap-3 mb-3'>
                                        <Image src='./images/icons/down-vector.svg' className='img-fluid' alt='down' width={32} height={32} />
                                        <h4 className='font-24 mb-0'>Bedroom {cart?.bedroom_index}</h4>
                                        <span style={{ color: '#463527' }}>{cart?.adults} Adult{cart?.adults > 1 ? "s" : ""}</span>
                                    </div>

                                    <div className="booking-card border bg-white p-3 mb-4">
                                        {/* Room image + title */}
                                        <Row>
                                            <Col md={4}>
                                                <Image
                                                    src={cart.cover_photo ? cart.cover_photo : "/images/icons/room-1.jpg"}
                                                    alt="Room Image" width={300} height={200} className="img-fluid"
                                                />
                                            </Col>
                                            <Col md={8}>
                                                <p className="fw-semibold fs-20 mb-2 room-title">
                                                    {calculateNights(cart.check_in_date, cart.check_out_date)} night stay in {cart?.room_name}
                                                    <span className='room-type-badge ms-2'>{cart?.room_type}</span>
                                                </p>
                                                <p className="text-muted d-flex gap-2 align-items-start small mb-3">
                                                    <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} className="img-fluid" />
                                                    {cart.property_name}<br />
                                                    {cart?.property_address}, {cart?.city}, {cart?.state}
                                                </p>
                                            </Col>
                                        </Row>

                                        {/* Check-in / Check-out */}
                                        <Row className="mt-3 mb-3">
                                            <Col md={3}>
                                                <p className="mb-1 text-secondary small">Check-in:</p>
                                                <p className="fw-semibold mb-0">{formatDateMonthYear(cart?.check_in_date)}</p>
                                                <small>2:00 PM</small>
                                            </Col>
                                            <Col md={3}>
                                                <p className="mb-1 text-secondary small">Check-out:</p>
                                                <p className="fw-semibold mb-0">{formatDateMonthYear(cart?.check_out_date)}</p>
                                                <small>11:00 AM</small>
                                            </Col>
                                        </Row>

                                        {/* Room details */}
                                        <div className="border-top pt-3">
                                            <p className="mb-1 font-18">Room details</p>
                                            <div className="room-specs d-flex gap-3 mb-2">
                                                <span className="spec-item d-flex gap-2">
                                                    <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps {cart?.max_guests}
                                                </span> |
                                                <span className="spec-item d-flex gap-2">
                                                    <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" />
                                                    {cart?.beds?.length} {cart?.beds?.map((b, bi) => <span key={bi}>{b.bed_type} </span>)}
                                                </span> |
                                                <span className="spec-item d-flex gap-2">{cart?.room_size_sqft} sq ft</span>
                                            </div>
                                            <hr />

                                            {/* Traveler section */}
                                            <div className="traveler-section">
                                                <p className="mb-2 font-18">Travelers in this room</p>

                                                {/* Adult count radios */}
                                                <div className="d-flex gap-3 mb-3">
                                                    {Array.from(
                                                        { length: cart.max_guests > 2 ? cart.max_guests : 2 },
                                                        (_, ind) => {
                                                            const count = ind + 1;
                                                            const isDisabled = cart.room_type === "Private" && count > 1;
                                                            return (
                                                                <div key={count} className="radio-select-box d-flex gap-2"
                                                                    style={{ background: "#F2F2F2", opacity: isDisabled ? 0.4 : 1 }}>
                                                                    <label className="form-check-label d-flex gap-2 mb-0">
                                                                        <input
                                                                            type="radio"
                                                                            name={`adult-count-${cart.room_uid}`}
                                                                            value={count}
                                                                            checked={cart.adults === count}
                                                                            disabled={isDisabled}
                                                                            onChange={(e) => handleAdultChange(e, cart)}
                                                                        />
                                                                        <span className="radio-checkmark"></span>
                                                                        {count} Adult{count > 1 ? "s" : ""}
                                                                    </label>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>

                                                <hr />

                                                {/* Exclusive booking toggle */}
                                                {cart?.room_type !== "Private" && (
                                                    <>
                                                        <Row className='mb-3'>
                                                            <Col md={5}>
                                                                <label className="mb-0 d-flex gap-2 align-items-center show-my-booking">
                                                                    <input className="mx-2 custom-checkbox" type="checkbox"
                                                                        onChange={(e) => setIsExclusiveBooking(e.target.checked)} />
                                                                    Exclusively book this room for the traveler
                                                                </label>
                                                            </Col>
                                                        </Row>
                                                        <Row className='mb-2'>
                                                            <Col md={6}>
                                                                <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
                                                                    {/* Since this is a twin bed, one will be available for booking unless you specify it for exclusive use. */}
                                                                    If any beds left available, they can be booked by other guests unless you book the whole room exclusively
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}

                                                <p className="mb-2 font-18">Traveler details</p>
                                                <p className='small'>{`We'll use this information to book. Make sure the name matches what is on the traveler's passport or ID.`}</p>

                                                {/* Gender preference banners */}
                                                {cart?.room_type !== "Private" && (
                                                    <>
                                                        {cart?.bedroom_preference_badge === "FEMALE PREFERRED" && (
                                                            <Row className='mb-2'>
                                                                <Col md={7}>
                                                                    <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
                                                                        As this room has already been booked for a female for your selected dates, only female traveler bookings are allowed
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        )}
                                                        {cart?.bedroom_preference_badge === "MALE PREFERRED" && (
                                                            <Row className='mb-2'>
                                                                <Col md={7}>
                                                                    <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
                                                                        As this room has already been booked for a male for your selected dates, only male traveler bookings are allowed
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        )}
                                                    </>
                                                )}
                                                {/* Traveller rows */}
                                                <div className='property-list-2'>
                                                    {Array.from({ length: cart.room_type === "Private" ? 1 : cart.adults }).map((_, travelerIndex) => {
                                                        const slot = cart.travelerDetails?.[travelerIndex];
                                                        if (!slot) return null;

                                                        // Prepare options for react-select
                                                        const rowOptions = (slot.filteredUsers || []).map(user => ({
                                                            value: user.uid,
                                                            label: `${user.first_name} ${user.last_name}`,
                                                            gender: user.gender,
                                                            icon: user.profile_image,
                                                            _raw: user,
                                                        }));

                                                        const selectedOption = slot.data
                                                            ? {
                                                                value: slot.data.uid,
                                                                label: `${slot.data.first_name} ${slot.data.last_name}`,
                                                                gender: slot.data.gender,
                                                                icon: slot.data.profile_image,
                                                                _raw: slot.data
                                                            }
                                                            : null;

                                                        return (
                                                            <div className="row mb-3" key={`traveler-${cart.room_uid}-${travelerIndex}`}>
                                                                {/* Role dropdown */}
                                                                <div className="col-md-4">
                                                                    <Select
                                                                        name="traveller_type"
                                                                        options={travelOption}
                                                                        placeholder="Choose Role"
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                        onChange={(e) => handleSelectDropdown(e, cartIndex, travelerIndex)}
                                                                        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                                                    />
                                                                </div>

                                                                {/* Bed selector — Twin-Sharing only */}
                                                                {cart?.room_type === "Twin-Sharing" && (
                                                                    <div className="col-md-3">
                                                                        <Select
                                                                            name="bed_index"
                                                                            options={cart?.beds
                                                                                ?.map((b, i) => ({ value: i, label: b.name, type: b.bed_type }))
                                                                                .filter(opt => {
                                                                                    if (Array.isArray(cart?.available_beds) && !cart.available_beds.includes(opt.value)) return false;
                                                                                    return !cart.travelerDetails.some((t, i) => i !== travelerIndex && t.bedIndex === opt.value);
                                                                                })}
                                                                            placeholder="Choose bed"
                                                                            className="react_selectbox"
                                                                            isSearchable={false}
                                                                            styles={customStyles}
                                                                            value={slot?.bedIndex !== null
                                                                                ? cart?.beds?.map((b, i) => ({ value: i, label: b.name }))[slot?.bedIndex] ?? null
                                                                                : null}
                                                                            onChange={(e) => handleBedBookIndex(e, cart, travelerIndex)}
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* ── Searchable traveller input using react-select (API-driven, with scroll pagination) ── */}
                                                                <div className={cart?.room_type === "Twin-Sharing" ? "col-md-5" : "col-md-8"}>
                                                                    <Select
                                                                        options={rowOptions}
                                                                        isDisabled={!slot?.traveller_type}
                                                                        isSearchable
                                                                        placeholder={slot?.traveller_type ? "Add a traveler" : "Select a role first"}
                                                                        styles={{
                                                                            ...customStyles,
                                                                            control: (base, state) => ({
                                                                                ...customStyles.control(base, state),
                                                                                borderColor: slot.isGenderValidation === "Error"
                                                                                    ? "#dc3545"
                                                                                    : slot.isGenderValidation === "Success"
                                                                                        ? "#2C734A"
                                                                                        : state.isFocused ? "#6B4F3F" : "#ced4da",
                                                                            }),
                                                                        }}
                                                                        value={selectedOption}
                                                                        inputValue={slot.searchText}
                                                                        onInputChange={(val, { action }) => {
                                                                            if (action === "input-change") {
                                                                                setCartItem(prev =>
                                                                                    prev.map((room, cIdx) =>
                                                                                        cIdx !== cartIndex ? room : {
                                                                                            ...room,
                                                                                            travelerDetails: room.travelerDetails.map((t, tIdx) =>
                                                                                                tIdx !== travelerIndex ? t : { ...t, searchText: val, showList: true }
                                                                                            )
                                                                                        }
                                                                                    )
                                                                                );
                                                                                debouncedFetchUsersForSlot(cartIndex, travelerIndex, val, slot.traveller_type);
                                                                            }
                                                                        }}
                                                                        onFocus={() => {
                                                                            if (!slot.filteredUsers?.length && slot.traveller_type) {
                                                                                fetchUsersForSlot(cartIndex, travelerIndex, slot.searchText || "", slot.traveller_type, 1);
                                                                            }
                                                                        }}
                                                                        onChange={(opt) => {
                                                                            if (opt && opt._raw) {
                                                                                handleCaretakerSelectWithValidation(cart, cartIndex, travelerIndex, opt._raw);
                                                                            }
                                                                        }}
                                                                        isLoading={isSlotLoading(cartIndex, travelerIndex)}
                                                                        components={{
                                                                            Option: CustomOption,
                                                                            MenuList: (props) => (
                                                                                <CustomMenuList
                                                                                    {...props}
                                                                                    selectProps={{
                                                                                        ...props.selectProps,
                                                                                        cartIndex,
                                                                                        travelerIndex
                                                                                    }}
                                                                                />
                                                                            ),
                                                                        }}
                                                                    />

                                                                    {/* Validation feedback */}
                                                                    {slot.isGenderValidation === "Validating" && (
                                                                        <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#BF9039" }}>⏳ Validating gender...</p>
                                                                    )}
                                                                    {slot.isGenderValidation === "Error" && (
                                                                        <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
                                                                            ✕ Gender validation failed — this traveler is not allowed in this room
                                                                        </p>
                                                                    )}
                                                                    {slot.isGenderValidation === "Success" && !slot?.data && (
                                                                        <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>✓ Gender validated</p>
                                                                    )}
                                                                </div>

                                                                {/* Selected traveller card */}
                                                                <div className="col-md-12">
                                                                    {slot?.data && (() => {
                                                                        const found = selectedUsersCache.current[slot.data.uid] || slot.data;
                                                                        return (
                                                                            <div className="selected-caretaker-container">
                                                                                <div className="manager-list-full" style={{
                                                                                    display: "flex", alignItems: "center",
                                                                                    border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
                                                                                    padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
                                                                                }}>
                                                                                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
                                                                                        <Image
                                                                                            src={found.profile_image
                                                                                                ? found.profile_image
                                                                                                : found?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                                                                                            alt={found.first_name}
                                                                                            width={48} height={48}
                                                                                            style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
                                                                                        />
                                                                                        <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                                            {found.first_name} {found.last_name}
                                                                                            <br />
                                                                                            <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
                                                                                                Emp. id: {found.employee_id}
                                                                                            </span>
                                                                                            <br />
                                                                                            <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
                                                                                                Dept: {found.segment}
                                                                                            </span>
                                                                                            {slot.isGenderValidation === "Success" && <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>}
                                                                                            {slot.isGenderValidation === "Error" && <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>}
                                                                                            {slot.isGenderValidation === "Validating" && <span style={{ fontSize: "12px", color: "#BF9039", marginLeft: "8px" }}>⏳ Validating...</span>}
                                                                                        </span>
                                                                                        <span style={{ color: "#73615F" }}>|</span>
                                                                                        <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                            <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
                                                                                            {found.phone_number}
                                                                                        </span>
                                                                                        <span style={{ color: "#73615F" }}>|</span>
                                                                                        <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                            <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
                                                                                            {found.email}
                                                                                        </span>
                                                                                        <span style={{ color: "#73615F" }}>|</span>
                                                                                        <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                            <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
                                                                                            {found.gender}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="show-edit-btn">
                                                                                        <Button variant="" className="edit-btn ms-1 me-1"
                                                                                            onClick={() => router.push(`/People?guest_uid=${found.uid}&show=true`)}>
                                                                                            Edit details
                                                                                        </Button>
                                                                                        <button type="button" className="ms-auto"
                                                                                            onClick={() => handleCaretakerRemove(cart, slot.id)}
                                                                                            style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}
                                                                                            title="Remove">
                                                                                            <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className='d-flex gap-2 fw-medium justify-content-end'>
                                        Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
                                    </p>
                                </div>
                            ))}

                            {/* ── Arrival Details ── */}
                            <div className="arrival-section border-top mt-4 pt-5 mb-5">
                                <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
                                <p className="text-secondary mb-2">This information helps in operational planning, legal compliance, and personalized service.</p>

                                <Form.Group className='mb-4 mt-4' controlId="dateArrival">
                                    <Form.Label className="mb-2 fw-semibold">Est. Date of Arrival In Individual House</Form.Label>
                                    <DatePicker
                                        selected={formData.dateArrival}
                                        onChange={(e) => handleSelectChange(e, "dateArrival")}
                                        selectsStart minDate={new Date()}
                                        className="form-control custom-date-picker"
                                        dateFormat="dd/MM/yyyy" placeholderText='DD/MM/YYYY'
                                    />
                                    <span className='text-danger'>{errorMessages.dateArrival}</span>
                                </Form.Group>

                                <Form.Group className='mb-4 mt-4' controlId="timeArrival">
                                    <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
                                    <Select onChange={(e) => handleSelectChange(e.value, "timeArrival")} options={timeOption}
                                        placeholder="Select time" className="react_selectbox" isSearchable={false} styles={customStyles} />
                                    <span className='text-danger'>{errorMessages.timeArrival}</span>
                                </Form.Group>

                                <Form.Group className='mb-4' controlId="modeArrival">
                                    <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
                                    <Select onChange={(e) => handleSelectChange(e.value, "modeArrival")} options={arrivalOption}
                                        placeholder="Select mode" className="react_selectbox" isSearchable={false} styles={customStyles} />
                                    <span className='text-danger'>{errorMessages.modeArrival}</span>
                                </Form.Group>

                                <div className='mb-4 form-group'>
                                    <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
                                    <input type="text" name="FlightTrainNumber" onChange={handleInputChange}
                                        placeholder='Enter number e.g. MADGAON LTT EXP #11100' className='form-control' />
                                    <span className='text-danger'>{errorMessages.FlightTrainNumber}</span>
                                </div>
                            </div>

                            <hr />

                            {/* ── Additional Comments ── */}
                            <div className="arrival-section mt-4 pt-4">
                                <h3 className="font-24 mb-2">Additional Comments</h3>
                                <div className='mb-5 form-group'>
                                    <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
                                    <input type="text" name="refnumber" onChange={handleInputChange}
                                        placeholder='Reference number to be entered for your internal purpose (optional)' className='form-control' />
                                </div>
                            </div>

                            <hr />

                            {/* ── Other Essential Details ── */}
                            <div className="arrival-section mt-4 pt-3 mb-5">
                                <h3 className="font-24 mb-2">Other Essential Details</h3>
                                <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
                                <div className='mb-4 form-group'>
                                    <textarea className='form-control' name="essentialDetails" onChange={handleInputChange}
                                        placeholder='Got any thoughts or questions? Add them here! (Optional)' />
                                </div>
                            </div>

                            <hr />

                            {/* ── Confirmation email ── */}
                            <div className="confirmation-email-section my-5 pb-5">
                                <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3'
                                    style={{ maxWidth: '360px', cursor: 'pointer' }}>
                                    <input type="checkbox" className="mx-2 custom-checkbox"
                                        checked={isEmailEnabled}
                                        onChange={(e) => setIsEmailEnabled(e.target.checked)} />
                                    Send copy of confirmation email
                                </label>

                                {isEmailEnabled && (
                                    <div className="email-content">
                                        <p className='fw-bold mb-3' style={{ color: '#6B4F3F' }}>Add info</p>
                                        {receivers.map((receiver, index) => (
                                            <div key={receiver.id} className="receiver-item">
                                                {index > 0 && (<><hr className="my-4" /><p className='fw-bold mb-3'>Receiver {index + 1}</p></>)}
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
                                                            {index === 0 ? (
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

                        {/* ── Booking Summary ── */}
                        <Col md={4} className='ps-5'>
                            <div className='booking-summary-colum'>
                                <div className="d-flex align-items-center justify-between mb-4">
                                    <h4 className='font-24 mb-0'>Booking Summary</h4>
                                    <label className='mb-0 d-flex gap-2 align-items-center'>
                                        <input type="checkbox" className="mx-2 custom-checkbox"
                                            checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
                                        Show prices
                                    </label>
                                </div>

                                <div className="booking-summary">
                                    <div className="summary-details">
                                        <div className="summary-row">
                                            <span className="summary-label">BRs Selected</span>
                                            <span className="summary-value">{cartItem.length}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="summary-label">Number of Rooms</span>
                                            <span className="summary-value">{cartItem.length} Room{cartItem.length > 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="summary-label">Travelers</span>
                                            <span className="summary-value">{totalTravelers} Adult{totalTravelers > 1 ? "s" : ""}</span>
                                        </div>

                                        {cartItem.map((item) => {
                                            const nights = calculateNights(item.check_in_date, item.check_out_date);
                                            const roomPrice = (item.price_per_night || 0) * nights;
                                            return (
                                                <div key={item.room_uid} className="summary-row detailed">
                                                    <span className="summary-label">{item.room_name} Pricing</span>
                                                    <div className="summary-value-detailed">
                                                        <div className="price-desc">{item.adults} Guest x {nights} nights</div>
                                                        {showPrices && (
                                                            <div className="price-amount">₹{roomPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                                        )}
                                                        <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div className="total-section">
                                            <span className="total-label">Total Price</span>
                                            <div className="total-value-detailed">
                                                <div className="total-desc">{totalTravelers} Guest x {totalNights} nights</div>
                                                {showPrices && (
                                                    <div className="total-amount">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                                )}
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

            {/* ── Edit Stay Details Modal ── */}
            <Modal show={addTravels2} onHide={removeTravel2} animation={false} centered size="xl" className='custom-theme-modal-2'>
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
                    <Modal.Title>Edit Stay Details</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel2} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='booking-filter'>
                        <Row className='gap-0'>
                            <Col md={2} className='gap-1'>
                                <div className='form-group'>
                                    <label className='text-black'>Which company?</label>
                                    <Select options={companyList} placeholder="Select company" className="react_selectbox" isSearchable={false}
                                        value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
                                        onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.value })}
                                        styles={customStyles} />
                                </div>
                            </Col>
                            <Col md={2} className='gap-1'>
                                <div className='form-group'>
                                    <label className='text-black'>Where to?</label>
                                    <Select options={cityList} placeholder="Select city" className="react_selectbox" isSearchable={false}
                                        getOptionLabel={(o) => o.city} getOptionValue={(o) => o.city}
                                        value={cityList?.find(c => c.city === searchFieldData.city) || null}
                                        onChange={(o) => setSearchFieldData({ ...searchFieldData, city: o.city })}
                                        styles={customStyles} />
                                </div>
                            </Col>
                            <Col md={4} className='gap-2'>
                                <div className='d-flex gap-0'>
                                    <div className='d-flex form-group flex-col w-50'>
                                        <label className='text-black'>Check-in date</label>
                                        <DatePicker
                                            selected={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
                                            onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
                                            minDate={new Date()} className="form-control custom-date-picker"
                                            dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
                                    </div>
                                    <div className='d-flex form-group flex-col w-50'>
                                        <label className='text-black'>Checkout date</label>
                                        <DatePicker
                                            selected={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
                                            onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
                                            minDate={new Date()} className="form-control custom-date-picker"
                                            dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
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
                                                                        <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleModalAdultChange(room.id, -1); }}>-</button>
                                                                        <span>{room.adults}</span>
                                                                        <button className="counter-btn" onClick={(e) => { e.stopPropagation(); handleModalAdultChange(room.id, 1); }}>+</button>
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
                                            <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', borderRadius: '0', color: '#fff' }}
                                                variant='' onClick={handleUpdateSearch}>Update Search</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>

            {/* ── Add Person Modal ── */}
            <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} roleOption={role} companyList={companyList} addTravel={addTravel} loadMoreCompanies={loadMoreCompanies}
                setSearchComp={setSearchKey} getUserListData={() => { }} />

            {/* ── Price Breakdown Modal ── */}
            <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
                    <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='booking-filter'>
                        {cartItem.map(item => {
                            const nights = calculateNights(item.check_in_date, item.check_out_date);
                            return (
                                <div key={item.room_uid} className='d-flex justify-between pt-2 pb-2'>
                                    <span>{item.room_name} x {item.adults} guest x {nights} nights</span>
                                    <span style={{ color: '#BF9039', fontWeight: '500' }}>
                                        ₹{((item.price_per_night || 0) * nights).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            );
                        })}
                        <div className='d-flex justify-between pt-2 pb-2'>
                            <span>CasaMelhor Service fee</span>
                            <span style={{ color: '#BF9039', fontWeight: '500' }}>₹0.00</span>
                        </div>
                        <div className='d-flex justify-between pt-2 pb-2'>
                            <span>Taxes</span>
                            <span style={{ color: '#BF9039', fontWeight: '500' }}>₹0.00</span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between'>
                    <span className='fs-20'>Total</span>
                    <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>
                        ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                </Modal.Footer>
            </Modal>

            {/* ── Booking Confirmed Modal ── */}
            <Modal show={showReserveModal} onHide={removeReserve} animation={false} backdrop={true} centered className='custom-theme-modal-2 modal-460'>
                <Modal.Body className='pt-4 pb-4'>
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
                    <Link href={`/BookingDetails/${bookingConfirmedData[0]?.uid}`}
                        className="p-2 w-100 text-center d-flex align-items-center justify-content-center"
                        style={{ background: "#2C734A", borderRadius: "0", color: "#fff", minHeight: "58px", textDecoration: "none" }}>
                        View Booking Details
                    </Link>
                    <Link href="/CreateBooking"
                        className="text-center justify-center edit-btn w-100 d-flex align-items-center justify-content-center"
                        style={{ minHeight: "58px", textDecoration: "none" }}>
                        Create Another Booking
                    </Link>
                </Modal.Footer>
            </Modal>
        </>
    );
}