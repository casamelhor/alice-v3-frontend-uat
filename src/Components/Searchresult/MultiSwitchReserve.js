// "use client"
// import React, { useState, useEffect, useRef } from 'react'
// import Header from '../Header/Header'
// import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { components } from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import { UserListAPI, validateGender, CreateBookingPost, companyListAPI, PropertyListFullApi, UserRoleListAPI } from '@/services/provider';
// import { calculateNights, convertTo24Hour, formatYMD, generateTimeOptions12Format } from '@/utils/formatTime';
// import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
// import toast, { Toaster } from 'react-hot-toast';

// export default function MultiSwitchReserve() {

//     const router = useRouter();
//     const timeOption = generateTimeOptions12Format(30);

//     // ── localStorage (stable, read once) ─────────────────────────────────────
//     const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"));

//     // ── state ─────────────────────────────────────────────────────────────────
//     const [userListData, setUserListData] = useState([]);
//     const [current, setCurrent] = useState(0);
//     const [bookingData, setBookingData] = useState(null);
//     const [filtereduserListData, setFilteredUserListData] = useState([]);
//     const [bookingSummary, setBookingSummary] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [showPrices, setShowPrices] = useState(false);
//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([]);
//     const [bookingConfirmedData, setBookingConfirmedData] = useState([]);
//     const [chooseBeds, setChooseBeds] = useState([]);
//     // FIX: false instead of null so boolean gating works
//     const [showCaretakerList, setShowCaretakerList] = useState(false);
//     const [role, setRole] = useState([]);
//     const [companyList, setCompanyList] = useState([]);
//     const [cityList, setCityList] = useState([]);
//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
//     const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
//     const [travellers, setTravellers] = useState([]);

//     // ── per-row API search state ──────────────────────────────────────────────
//     const [rowSearchLoading, setRowSearchLoading] = useState({});

//     // ── debounce timer per row & selected-user cache ──────────────────────────
//     const rowSearchTimers = useRef({});
//     const selectedUsersCache = useRef({});   // uid → full raw user object

//     // ── private-room search driven by this state ──────────────────────────────
//     const [privateSearch, setPrivateSearch] = useState('');

//     // ── derived ───────────────────────────────────────────────────────────────
//     const bedroomPreference = reserveBookingData?.bedroom_preference_badge || null;
//     const adultCount = searchBookingData?.rooms?.[0]?.adults || 1;
//     const totalNights = bookingData?.total_nights || 0;
//     const totalPrice = bookingData?.total_price || 0;
//     const numSegments = bookingData?.segments?.length || 0;
//     const headerCompany = bacisSearchDetails?.company_name || "Company";
//     const headerCity = bacisSearchDetails?.city || "City";
//     const headerStay = bookingData?.segments?.length > 0
//         ? `${formatDate(bookingData.segments[0].check_in_datetime)} - ${formatDate(bookingData.segments[bookingData.segments.length - 1].check_out_datetime)}, ${totalNights} nights`
//         : "";
//     const headerGuests = `1 room for ${adultCount} guest${adultCount > 1 ? "s" : ""}`;

//     const [selectedAdult, setSelectedAdult] = useState(adultCount);

//     // ── formData ──────────────────────────────────────────────────────────────
//     const [formData, setFormData] = useState({
//         company_id: 2,
//         caretakers: "",
//         caretakerGenderValid: null,
//         traveller_type: null,   // FIX: added so Private-room role gating is consistent
//         traveler_assignments: [],
//         arrival_details: { arrival_time: "", mode_of_arrival: "", transport_number: "" },
//         send_confirmation_email: false,
//         additional_comments: "",
//         company_booking_reference: "",
//     });

//     const [searchFieldData, setSearchFieldData] = useState({
//         company_id: 0, city: "", check_in_date: "", check_out_date: "", rooms: [], is_available: true
//     });

//     // ── modal toggles ─────────────────────────────────────────────────────────
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

//     // ── helpers ───────────────────────────────────────────────────────────────
//     const updateFormData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
//     const updateArrivalDetails = (key, value) => setFormData(prev => ({
//         ...prev,
//         arrival_details: { ...prev.arrival_details, [key]: key === "arrival_time" ? convertTo24Hour(value) : value }
//     }));
//     const getDateOnly = (dateTime) => dateTime?.split("T")[0];

//     function formatDate(dateTime) {
//         return new Date(dateTime).toLocaleDateString("en-IN", {
//             weekday: "short", day: "numeric", month: "short", year: "numeric"
//         });
//     }
//     function formatTime(dateTime) {
//         return new Date(dateTime).toLocaleTimeString("en-IN", {
//             hour: "2-digit", minute: "2-digit", hour12: true
//         });
//     }

//     // ── tax calculation ───────────────────────────────────────────────────────
//     const calculateBookingTax = (data) => {
//         if (!data?.segments) return null;
//         let subtotal = 0, totalTax = 0;
//         const updatedSegments = data.segments.map((seg) => {
//             subtotal += seg.segment_price;
//             const taxRate = seg.price_per_night <= 7500 ? 0.05 : 0.18;
//             const taxAmount = seg.segment_price * taxRate;
//             totalTax += taxAmount;
//             return { ...seg, taxRate, taxAmount };
//         });
//         return { segments: updatedSegments, subtotal, totalTax, serviceFee: 0, grandTotal: subtotal + totalTax };
//     };

//     // ── init ──────────────────────────────────────────────────────────────────
//     useEffect(() => {
//         if (reserveBookingData) {
//             setBookingData(reserveBookingData);
//             setBookingSummary(calculateBookingTax(reserveBookingData));
//             setTravellers(Array.from({ length: adultCount }, () => ({
//                 traveller_type: null, isGenderValidation: "",
//                 caretaker: null, searchText: "", showList: false,
//                 filteredUsers: [], selectedBedIndex: null,
//                 inputValue: "",   // tracks the text typed inside the Select
//             })));
//         }
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
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // ── private-room: re-fetch whenever privateSearch changes ─────────────────
//     useEffect(() => {
//         getUserListData(privateSearch);
//     }, [privateSearch]); // eslint-disable-line react-hooks/exhaustive-deps

//     // ── private-room: rebuild filteredUserListData on role / data changes ─────
//     useEffect(() => {
//         if (!formData?.traveller_type) { setFilteredUserListData([]); return; }
//         const filtered = userListData
//             .filter(user => {
//                 const rn = user.user_role?.role_name;
//                 let ok = formData.traveller_type === "External"
//                     ? rn === "External"
//                     : rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                 if (!ok) return false;
//                 if (bedroomPreference === "FEMALE PREFERRED") return user.gender === "Female";
//                 if (bedroomPreference === "MALE PREFERRED") return user.gender === "Male";
//                 return true;
//             })
//             .map(user => ({
//                 value: user.uid,
//                 label: `${user.first_name} ${user.last_name}`,
//                 gender: user.gender,
//                 icon: user.profile_image,
//             }));
//         setFilteredUserListData(filtered);
//     }, [formData.traveller_type, userListData, bedroomPreference]);

//     // ── API calls ─────────────────────────────────────────────────────────────

//     // Private room — driven by privateSearch state via useEffect
//     const getUserListData = async (searchTerm = '') => {
//         try {
//             const res = await UserListAPI("All", '', searchTerm);
//             if (res?.data?.success) setUserListData(res.data.response);
//         } catch (e) { console.log(e); }
//     };

//     // Twin-sharing — fetch, role-filter, gender-filter, map to Select options, push into row
//     const fetchUsersForRow = async (rowIndex, searchTerm, travellerType) => {
//         setRowSearchLoading(prev => ({ ...prev, [rowIndex]: true }));
//         try {
//             const res = await UserListAPI("All", '', searchTerm);
//             if (res?.data?.success) {
//                 let base = res.data.response.filter(user => {
//                     const rn = user?.user_role?.role_name;
//                     if (travellerType === "External") return rn === "External";
//                     return rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                 });
//                 const pref = bookingData?.segments?.[bookingData.segments.length - 1]?.bedroom_preference_badge
//                     || bedroomPreference;
//                 if (pref === "FEMALE PREFERRED") base = base.filter(u => u.gender === "Female");
//                 if (pref === "MALE PREFERRED") base = base.filter(u => u.gender === "Male");

//                 // Map to Select option shape; attach _raw so we can cache the full object on select
//                 const options = base.map(u => ({
//                     value: u.uid,
//                     label: `${u.first_name} ${u.last_name}`,
//                     gender: u.gender,
//                     icon: u.profile_image,
//                     _raw: u,
//                 }));

//                 setTravellers(prev =>
//                     prev.map((item, i) =>
//                         i === rowIndex ? { ...item, filteredUsers: options } : item
//                     )
//                 );
//             }
//         } catch (error) {
//             console.log("fetchUsersForRow error:", error);
//         } finally {
//             setRowSearchLoading(prev => ({ ...prev, [rowIndex]: false }));
//         }
//     };

//     // Debounced wrapper — 350 ms per row so the API is not called on every keystroke
//     const debouncedFetchUsersForRow = (rowIndex, searchTerm, travellerType) => {
//         if (rowSearchTimers.current[rowIndex]) {
//             clearTimeout(rowSearchTimers.current[rowIndex]);
//         }
//         rowSearchTimers.current[rowIndex] = setTimeout(() => {
//             fetchUsersForRow(rowIndex, searchTerm, travellerType);
//         }, 350);
//     };

//     const getUserListDataAPI = async () => {
//         try {
//             const res = await UserRoleListAPI(loginData?.uid);
//             if (res?.data?.success)
//                 setRole(res.data.response.map(v => ({ value: v?.uid, label: v?.role_name, icon: v?.role_icon })));
//         } catch (e) { console.error(e); }
//     };

//     const getCompanyList = async () => {
//         try {
//             const res = await companyListAPI("all");
//             if (res?.data?.success)
//                 setCompanyList(res.data.response.map(item => ({ value: item.id, label: item.company_name })));
//         } catch (e) { console.log(e); }
//     };

//     const getProprtyList = async () => {
//         try {
//             const res = await PropertyListFullApi();
//             if (res?.data?.success) {
//                 const uniqueCities = [
//                     { city: "Jaipur" },
//                     ...Array.from(new Set(res.data.response.map(e => e.city)), city => ({ city }))
//                         .filter(item => item.city !== "Jaipur")
//                 ];
//                 setCityList(uniqueCities);
//             }
//         } catch (e) { console.log(e); }
//     };

//     // ── room counter helpers ──────────────────────────────────────────────────
//     const handleAdultChange = (roomId, change) =>
//         setRooms(rooms.map(r => r.id === roomId ? { ...r, adults: Math.max(1, r.adults + change) } : r));
//     const addRoom = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
//     const deleteRoom = (id) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== id)); };

//     const handleUpdateSearch = () => {
//         removeItemLocalStorage("reserveRoom");
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
//         router.push("./Searchresult");
//     };

//     // ── email helpers ─────────────────────────────────────────────────────────
//     const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
//     const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
//     const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
//     const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//     // ── Select options ────────────────────────────────────────────────────────
//     const travelOption = [
//         { value: "Company Booking Manager", label: "Company employee", icon: "../images/icons/hail.svg" },
//         { value: "External", label: "External", icon: "../images/icons/short_stay.svg" },
//     ];
//     const arrivalOption = [
//         { value: "Flight", label: "Flight" },
//         { value: "Train", label: "Train" },
//     ];

//     // ── custom Select sub-components ──────────────────────────────────────────
//     const CustomOption = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image
//                         src={props.data.icon ? props.data.icon : props.data.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                         alt={props.data.label} width={20} height={20}
//                     />
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

//     const CustomMenuList = ({ children, selectProps }) => {
//         const isEmpty = !selectProps.options || selectProps.options.length === 0;
//         return (
//             <div>
//                 {isEmpty ? (
//                     <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                         <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                         <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px", color: "#463527" }}>No travelers found</div>
//                         <Link href="/People" style={{ background: "#6B4F3F", color: "white", padding: "10px 20px", display: "block", textAlign: "center", textDecoration: "none" }}>
//                             Invite to Join
//                         </Link>
//                     </div>
//                 ) : (
//                     <>
//                         {children}
//                         <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
//                             <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                 {"Can't find someone?"}<br />
//                                 <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>Register a new traveler</Link>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         );
//     };

//     // Shown inside the twin-sharing Select while the API call is in-flight
//     const LoadingMessage = () => (
//         <div style={{ textAlign: "center", padding: "12px", color: "#73615F", fontSize: "14px" }}>
//             Searching...
//         </div>
//     );

//     const customStyles = {
//         control: (base, state) => ({
//             ...base,
//             borderColor: state.isFocused ? "#6B4F3F" : "#ced4da",
//             boxShadow: state.isFocused ? "0 0 0 1px #6B4F3F" : "none",
//             "&:hover": { borderColor: "#6B4F3F" },
//             borderRadius: "4px", minHeight: "38px",
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isSelected ? "#6B4F3F" : state.isFocused ? "#f0e8e3" : "transparent",
//             color: state.isSelected ? "white" : "#463527",
//             padding: "10px 16px", cursor: "pointer",
//         }),
//         menu: (base) => ({ ...base, background: "#f9f6f4", border: "1px solid #6B4F3F", borderRadius: "0", zIndex: 10 }),
//         menuList: (base) => ({ ...base, padding: "8px 0", maxHeight: "260px" }),
//         placeholder: (base) => ({ ...base, color: "#aaa" }),
//         singleValue: (base) => ({ ...base, color: "#463527" }),
//     };

//     const validationBorderStyle = (validationState, isFocused) => {
//         if (validationState === "Error") return "#dc3545";
//         if (validationState === "Success") return "#2C734A";
//         if (validationState === "Validating") return "#BF9039";
//         return isFocused ? "#6B4F3F" : "#ced4da";
//     };

//     // ── handleTravellerTypeChange ─────────────────────────────────────────────
//     // Role changed → clear row, immediately fetch from API (no debounce on role change)
//     const handleTravellerTypeChange = (rowIndex, selected) => {
//         setTravellers(prev =>
//             prev.map((item, i) =>
//                 i === rowIndex
//                     ? {
//                         ...item,
//                         traveller_type: selected,
//                         filteredUsers: [],
//                         caretaker: null,
//                         searchText: "",
//                         inputValue: "",
//                         isGenderValidation: "",
//                     }
//                     : item
//             )
//         );
//         // Immediate fetch with current inputValue and the new role
//         fetchUsersForRow(rowIndex, travellers[rowIndex]?.inputValue || '', selected);
//     };

//     // ── handleSelectDropdown (Private room role picker) ───────────────────────
//     const handleSelectDropdown = (e, name) => {
//         if (name === "traveller_type") {
//             setFormData(prev => ({ ...prev, traveller_type: e.value, caretakers: "", caretakerGenderValid: null }));
//         }
//     };

//     // ── handleCaretakerSelect ─────────────────────────────────────────────────
//     // rowIndex === "" → Private room | rowIndex = number → Twin-Sharing row
//     // selectedOption is the full react-select option object (or null when cleared)
//     const handleCaretakerSelect = async (rowIndex, selectedOption) => {
//         const userId = selectedOption?.value || null;

//         // ── Private room ──────────────────────────────────────────────────────
//         if (rowIndex === "") {
//             if (!userId) {
//                 setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }));
//                 setShowCaretakerList(false);
//                 return;
//             }
//             setFormData(prev => ({ ...prev, caretakers: userId, caretakerGenderValid: null }));
//             setShowCaretakerList(false);

//             const lastSegment = bookingData?.segments?.[bookingData.segments.length - 1];
//             if (!lastSegment) return;

//             try {
//                 const payload = {
//                     room_uid: lastSegment.room_uid,
//                     traveler_uid: userId,
//                     check_in_date: getDateOnly(lastSegment.check_in_datetime),
//                     check_out_date: getDateOnly(lastSegment.check_out_datetime),
//                     bed_index: 0,
//                 };
//                 const response = await validateGender(payload);
//                 const isValid = response?.data?.response?.valid;
//                 setFormData(prev => ({ ...prev, caretakerGenderValid: isValid }));
//                 isValid
//                     ? toast.success("Gender validated successfully")
//                     : toast.error("Gender validation failed — this traveler is not allowed in this room");
//             } catch (err) {
//                 console.error("Gender validation error:", err);
//                 toast.error("Failed to validate gender");
//                 setFormData(prev => ({ ...prev, caretakerGenderValid: null }));
//             }
//             return;
//         }

//         // ── Twin-Sharing row: cleared ─────────────────────────────────────────
//         if (!userId) {
//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex
//                         ? { ...item, caretaker: null, searchText: "", inputValue: "", isGenderValidation: "" }
//                         : item
//                 )
//             );
//             return;
//         }

//         // ── Twin-Sharing row: selected ────────────────────────────────────────
//         // Cache the raw user from the option's _raw field, or fall back to userListData
//         const rawUser = selectedOption?._raw
//             || userListData.find(u => u.uid === userId)
//             || travellers[rowIndex]?.filteredUsers?.find(o => o.value === userId)?._raw;

//         if (rawUser) selectedUsersCache.current[userId] = rawUser;

//         const displayName = selectedOption?.label || (rawUser ? `${rawUser.first_name} ${rawUser.last_name}` : "");

//         setTravellers(prev =>
//             prev.map((item, i) =>
//                 i === rowIndex
//                     ? {
//                         ...item,
//                         caretaker: userId,
//                         searchText: displayName,
//                         inputValue: displayName,
//                         showList: false,
//                         filteredUsers: [],         // clear list after selection
//                         isGenderValidation: "Validating",
//                     }
//                     : item
//             )
//         );

//         const lastSegment = bookingData?.segments?.[bookingData.segments.length - 1];
//         if (!lastSegment) return;

//         try {
//             const payload = {
//                 room_uid: lastSegment.room_uid,
//                 traveler_uid: userId,
//                 check_in_date: getDateOnly(lastSegment.check_in_datetime),
//                 check_out_date: getDateOnly(lastSegment.check_out_datetime),
//                 bed_index: rowIndex,
//             };
//             const response = await validateGender(payload);
//             const isValid = response?.data?.response?.valid;

//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex ? { ...item, isGenderValidation: isValid ? "Success" : "Error" } : item
//                 )
//             );
//             isValid
//                 ? toast.success(`Traveler ${rowIndex + 1}: Gender validated successfully`)
//                 : toast.error(`Traveler ${rowIndex + 1}: Gender validation failed — not allowed in this room`);
//         } catch (err) {
//             console.error("Gender validation error:", err);
//             toast.error(`Traveler ${rowIndex + 1}: Failed to validate gender`);
//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex ? { ...item, isGenderValidation: "" } : item
//                 )
//             );
//         }
//     };

//     // ── pre-submit full gender validation ─────────────────────────────────────
//     const validateAllTravellersGender = async () => {
//         const segments = bookingData?.segments || [];
//         const results = await Promise.all(
//             travellers.map(async (row, tIdx) => {
//                 if (!row.caretaker) {
//                     toast.error(`Traveler ${tIdx + 1}: No traveler selected`);
//                     return false;
//                 }
//                 const segResults = await Promise.all(
//                     segments.map(async (seg) => {
//                         try {
//                             const res = await validateGender({
//                                 room_uid: seg.room_uid,
//                                 traveler_uid: row.caretaker,
//                                 check_in_date: getDateOnly(seg.check_in_datetime),
//                                 check_out_date: getDateOnly(seg.check_out_datetime),
//                                 bed_index: tIdx,
//                             });
//                             return res?.data?.response?.valid === true;
//                         } catch { return false; }
//                     })
//                 );
//                 const allValid = segResults.every(Boolean);
//                 setTravellers(prev =>
//                     prev.map((item, i) =>
//                         i === tIdx ? { ...item, isGenderValidation: allValid ? "Success" : "Error" } : item
//                     )
//                 );
//                 if (!allValid) toast.error(`Traveler ${tIdx + 1}: Gender validation failed — booking blocked`);
//                 return allValid;
//             })
//         );
//         return results.every(Boolean);
//     };

//     // ── submit ────────────────────────────────────────────────────────────────
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
//         const isPrivate = bookingData?.segments?.[0]?.room_type === "Private";

//         if (isPrivate) {
//             if (!formData.caretakers) { toast.error("Please select a traveler before confirming"); return; }
//             if (formData.caretakerGenderValid === false) { toast.error("Booking blocked: traveler did not pass gender validation"); return; }
//         } else {
//             if (travellers.some(r => !r.caretaker)) { toast.error("Please select a traveler for every row before confirming"); return; }
//             setIsSubmitting(true);
//             const allValid = await validateAllTravellersGender();
//             if (!allValid) {
//                 setIsSubmitting(false);
//                 toast.error("Booking blocked: one or more travelers failed gender validation");
//                 return;
//             }
//             // keep isSubmitting=true, fall through to CreateBookingPost
//         }

//         if (isPrivate) setIsSubmitting(true);

//         try {
//             const cartItem = bookingData.segments.map((seg) => ({
//                 property_uid: seg.property_uid,
//                 room_uid: seg.room_uid,
//                 bed_index: isPrivate ? null : (travellers[0]?.selectedBedIndex ?? null),
//                 check_in_date: getDateOnly(seg.check_in_datetime),
//                 check_out_date: getDateOnly(seg.check_out_datetime),
//             }));

//             let travelerAssignments = [];
//             if (isPrivate) {
//                 cartItem.forEach((_, idx) =>
//                     travelerAssignments.push({ cart_item_index: idx, traveler_id: formData.caretakers, is_exclusive_booking: false })
//                 );
//             } else {
//                 travellers.forEach((row, tIdx) =>
//                     cartItem.forEach((_, segIdx) =>
//                         travelerAssignments.push({ cart_item_index: segIdx, traveler_id: row.caretaker, is_exclusive_booking: false })
//                     )
//                 );
//             }

//             const payload = {
//                 company_id: searchBookingData?.company_id || bacisSearchDetails.company_id,
//                 cart_items: cartItem,
//                 traveler_assignments: travelerAssignments,
//                 arrival_details: {
//                     ...formData.arrival_details,
//                     arrival_date: getDateOnly(bookingData.segments[0].check_in_datetime),
//                 },
//                 additional_comments: formData.additional_comments,
//                 company_booking_reference: formData.company_booking_reference,
//                 send_confirmation_email: formData.send_confirmation_email,
//                 additional_email_recipients: receivers.map(r => r.email)
//             };

//             const response = await CreateBookingPost(cleanPayload(payload));
//             if (response.data.success) {
//                 setBookingConfirmedData(response.data.response.bookings);
//                 addReserve();
//                 toast.success("Booking Created Successfully");
//                 removeItemLocalStorage("reserveRoom");
//                 removeItemLocalStorage("searchParam");
//                 removeItemLocalStorage("basicSecrchItemObj");
//             } else {
//                 response.data.response.validation_errors.forEach(el => toast.error(el.error));
//             }
//         } catch (err) {
//             console.error("Submission error:", err);
//             toast.error("Failed to create booking");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // ── render ────────────────────────────────────────────────────────────────
//     return (
//         <>
//             <Header />
//             <Toaster position="top-right" />

//             {/* ── top header bar ─────────────────────────────────────────────── */}
//             <div className='searching-result-top'>
//                 <Container>
//                     <div className='search-result-header'>
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
//                             <h4 className='font-24 mb-4'>Review Your Selected BRs ({numSegments})</h4>

//                             <div className="booking-card border bg-white p-3 mb-4">
//                                 {bookingData?.segments?.map((segment, index) => {
//                                     const isLast = index === bookingData.segments.length - 1;
//                                     const nextSegment = bookingData.segments[index + 1];

//                                     return (
//                                         <React.Fragment key={segment.segment_id}>

//                                             {/* ── room card ──────────────────────────────────────── */}
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
//                                                         alt={segment.room_name} width={300} height={200} className="img-fluid"
//                                                     />
//                                                 </Col>
//                                                 <Col md={8}>
//                                                     <p className="fw-semibold fs-20 mb-2 room-title">
//                                                         <span className="fs-20">{segment.nights} night stay in {segment.room_name}</span>
//                                                         <span className="room-type-badge ms-2">{segment.room_type}</span>
//                                                     </p>
//                                                     <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                         <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} />
//                                                         {segment.property_name}
//                                                     </p>
//                                                 </Col>
//                                             </Row>

//                                             {/* ── check-in / check-out ───────────────────────────── */}
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

//                                             {/* ── room details ───────────────────────────────────── */}
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
//                                                 {segment?.bedroom_preference_badge && (
//                                                     <div className="room-specs d-flex gap-3 mb-2">
//                                                         <span className='female-booked'>{segment.bedroom_preference_badge}</span>
//                                                     </div>
//                                                 )}
//                                                 <hr />
//                                             </div>

//                                             {/* ── property/room change divider ───────────────────── */}
//                                             {!isLast && (
//                                                 <div className="room-change-info d-flex gap-2 align-items-center mb-3 mt-3 pb-3 border-bottom">
//                                                     <Image src="./images/icons/switch-pro-vertical.svg" alt="switch" width={24} height={100} />
//                                                     <div>
//                                                         <p className="fs-20 mb-0" style={{ color: "#a6a6a6" }}>
//                                                             {bookingData?.type === "mixed_room" ? "Room" : "Property"} change on
//                                                         </p>
//                                                         <p className="mb-0" style={{ color: "#a6a6a6" }}>
//                                                             {formatDate(nextSegment.check_in_datetime)}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             {/* ── traveller section (last segment only) ──────────── */}
//                                             {isLast && (
//                                                 <div className="traveler-section">
//                                                     <p className="mb-2 font-18">Travelers in this room</p>

//                                                     {/* adult count radios */}
//                                                     <div className="d-flex gap-3 mb-3">
//                                                         {Array.from({ length: Math.max(adultCount, 2) }, (_, i) => {
//                                                             const count = i + 1;
//                                                             return (
//                                                                 <div key={count} className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }}>
//                                                                     <label className="form-check-label d-flex gap-2 mb-0">
//                                                                         <input
//                                                                             type="radio" name='adult-count'
//                                                                             checked={selectedAdult === count}
//                                                                             onChange={() => {
//                                                                                 setSelectedAdult(count);
//                                                                                 setTravellers(Array.from({ length: count }, () => ({
//                                                                                     traveller_type: null, isGenderValidation: "",
//                                                                                     caretaker: null, searchText: "", showList: false,
//                                                                                     filteredUsers: [], selectedBedIndex: null, inputValue: "",
//                                                                                 })));
//                                                                             }}
//                                                                         />
//                                                                         <span className="radio-checkmark"></span>
//                                                                         {count} Adult{count > 1 ? "s" : ""}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         })}
//                                                     </div>

//                                                     <hr />

//                                                     <Row className='mb-3'>
//                                                         <Col md={5}>
//                                                             <label className="mb-0 d-flex gap-2 align-items-center show-my-booking">
//                                                                 <input className="mx-2 custom-checkbox" type="checkbox" />
//                                                                 Exclusively book this room for the traveler
//                                                             </label>
//                                                         </Col>
//                                                     </Row>

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

//                                                     {/* ── PRIVATE ──────────────────────────────────── */}
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
//                                                                 <div className="col-md-8">
//                                                                     {!formData.caretakers && (
//                                                                         <div className="form-group">
//                                                                             <Select
//                                                                                 options={filtereduserListData}
//                                                                                 styles={customStyles}
//                                                                                 components={{ Option: CustomOption, MenuList: CustomMenuList }}
//                                                                                 placeholder="Add a traveler"
//                                                                                 isSearchable
//                                                                                 isClearable
//                                                                                 // onInputChange drives privateSearch → getUserListData via useEffect
//                                                                                 onInputChange={(val) => setPrivateSearch(val)}
//                                                                                 onChange={(selected) => handleCaretakerSelect("", selected)}
//                                                                                 value={formData.caretakers
//                                                                                     ? filtereduserListData.find(u => u.value === formData.caretakers) ?? null
//                                                                                     : null
//                                                                                 }
//                                                                                 noOptionsMessage={() => null}
//                                                                             />
//                                                                         </div>
//                                                                     )}
//                                                                 </div>

//                                                                 {/* selected private traveller card */}
//                                                                 <div className="col-md-12">
//                                                                     {formData.caretakers && userListData.filter(u => u.uid === formData.caretakers).map((item, i) => (
//                                                                         <div key={i} className="selected-caretaker-container">
//                                                                             <div className="manager-list-full" style={{
//                                                                                 display: "flex", alignItems: "center",
//                                                                                 border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                 padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                             }}>
//                                                                                 <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                     <Image
//                                                                                         src={item?.profile_image || (item?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg")}
//                                                                                         alt={item?.first_name} width={48} height={48}
//                                                                                         style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                     />
//                                                                                     <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                         {item?.first_name} {item?.last_name}<br />
//                                                                                         <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Emp. id: {item?.employee_id}</span><br />
//                                                                                         <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Dept: {item?.segment}</span>
//                                                                                         {formData.caretakerGenderValid === true && <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>}
//                                                                                         {formData.caretakerGenderValid === false && <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>}
//                                                                                         {formData.caretakerGenderValid === null && <span style={{ fontSize: "12px", color: "#BF9039", marginLeft: "8px" }}>⏳ Validating...</span>}
//                                                                                     </span>
//                                                                                     <span style={{ color: "#73615F" }}>|</span>
//                                                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                         <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{item?.phone_number}
//                                                                                     </span>
//                                                                                     <span style={{ color: "#73615F" }}>|</span>
//                                                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                         <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{item?.email}
//                                                                                     </span>
//                                                                                     <span style={{ color: "#73615F" }}>|</span>
//                                                                                     <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                         <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{item?.gender}
//                                                                                     </span>
//                                                                                 </div>
//                                                                                 <div className="show-edit-btn">
//                                                                                     <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                         onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
//                                                                                         Edit details
//                                                                                     </Button>
//                                                                                     <button type="button" className="ms-auto"
//                                                                                         onClick={() => setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }))}
//                                                                                         style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
//                                                                                         <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                     </button>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     ))}
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                     ) : (
//                                                         /* ── TWIN-SHARING rows ─────────────────────── */
//                                                         travellers.map((row, tIdx) => (
//                                                             <div key={tIdx} className="property-list-2">
//                                                                 <div className="row mt-3 mb-3">

//                                                                     {/* role picker */}
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

//                                                                     {/* bed picker */}
//                                                                     {chooseBeds.length > 0 && (
//                                                                         <div className="col-md-3">
//                                                                             <Select
//                                                                                 options={chooseBeds.filter(bed =>
//                                                                                     !travellers.some((t, i) => i !== tIdx && t.selectedBedIndex === bed.value)
//                                                                                 )}
//                                                                                 placeholder="Choose Bed"
//                                                                                 isSearchable={false}
//                                                                                 styles={customStyles}
//                                                                                 value={chooseBeds.find(b => b.value === row?.selectedBedIndex) || null}
//                                                                                 onChange={(e) =>
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) =>
//                                                                                             i === tIdx ? { ...item, selectedBedIndex: e.value } : item
//                                                                                         )
//                                                                                     )
//                                                                                 }
//                                                                             />
//                                                                         </div>
//                                                                     )}

//                                                                     {/* ── traveller Select — API-driven ─────────────── */}
//                                                                     <div className={chooseBeds.length > 0 ? "col-md-5" : "col-md-8"}>
//                                                                         <Select
//                                                                             /*
//                                                                              * KEY CHANGES vs original file:
//                                                                              * 1. options = row.filteredUsers (API results per row, not global userListData)
//                                                                              * 2. isLoading shows built-in spinner while API is in flight
//                                                                              * 3. filterOption={() => true} disables client-side filtering — API does it
//                                                                              * 4. inputValue is controlled per-row so we can debounce per row
//                                                                              * 5. onInputChange fires debouncedFetchUsersForRow (350 ms)
//                                                                              * 6. onMenuOpen fires fetchUsersForRow immediately (no debounce)
//                                                                              * 7. value resolves from selectedUsersCache first, guaranteeing the
//                                                                              *    selected display survives filteredUsers being cleared post-select
//                                                                              * 8. onChange passes the full option object so _raw is available for caching
//                                                                              */
//                                                                             options={row.filteredUsers}
//                                                                             isLoading={!!rowSearchLoading[tIdx]}
//                                                                             filterOption={() => true}
//                                                                             placeholder={row.traveller_type ? "Search traveler..." : "Select a role first"}
//                                                                             isDisabled={!row.traveller_type}
//                                                                             isSearchable
//                                                                             isClearable
//                                                                             inputValue={row.inputValue ?? ""}
//                                                                             onInputChange={(val, { action }) => {
//                                                                                 // Only react to real user input (not blur/menu-close clearing)
//                                                                                 if (action !== "input-change") return;
//                                                                                 // 1. Update typed text immediately (responsive UI)
//                                                                                 setTravellers(prev =>
//                                                                                     prev.map((item, i) =>
//                                                                                         i === tIdx ? { ...item, inputValue: val } : item
//                                                                                     )
//                                                                                 );
//                                                                                 // 2. Debounced API call
//                                                                                 debouncedFetchUsersForRow(tIdx, val, row.traveller_type);
//                                                                             }}
//                                                                             onMenuOpen={() => {
//                                                                                 // Fetch immediately when the dropdown opens
//                                                                                 fetchUsersForRow(tIdx, row.inputValue || "", row.traveller_type);
//                                                                             }}
//                                                                             styles={{
//                                                                                 ...customStyles,
//                                                                                 control: (base, state) => ({
//                                                                                     ...customStyles.control(base, state),
//                                                                                     borderColor: validationBorderStyle(row.isGenderValidation, state.isFocused),
//                                                                                 }),
//                                                                             }}
//                                                                             // Resolve value from cache → userListData → filteredUsers
//                                                                             value={
//                                                                                 row.caretaker
//                                                                                     ? (() => {
//                                                                                         const cached = selectedUsersCache.current[row.caretaker];
//                                                                                         const raw = cached || userListData.find(u => u.uid === row.caretaker);
//                                                                                         if (raw) return { value: raw.uid, label: `${raw.first_name} ${raw.last_name}`, gender: raw.gender, icon: raw.profile_image, _raw: raw };
//                                                                                         return row.filteredUsers?.find(o => o.value === row.caretaker) ?? null;
//                                                                                     })()
//                                                                                     : null
//                                                                             }
//                                                                             onChange={(selected) => handleCaretakerSelect(tIdx, selected)}
//                                                                             components={{
//                                                                                 Option: CustomOption,
//                                                                                 MenuList: CustomMenuList,
//                                                                                 LoadingMessage,
//                                                                             }}
//                                                                             noOptionsMessage={() =>
//                                                                                 rowSearchLoading[tIdx] ? null : "No travelers found"
//                                                                             }
//                                                                         />

//                                                                         {/* validation feedback */}
//                                                                         {row.isGenderValidation === "Validating" && (
//                                                                             <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#BF9039" }}>⏳ Validating gender...</p>
//                                                                         )}
//                                                                         {row.isGenderValidation === "Error" && (
//                                                                             <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>✕ Gender validation failed — this traveler is not allowed in this room</p>
//                                                                         )}
//                                                                         {row.isGenderValidation === "Success" && row.caretaker && (
//                                                                             <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>✓ Gender validated</p>
//                                                                         )}
//                                                                     </div>

//                                                                     {/* selected traveller card */}
//                                                                     <div className="col-md-12">
//                                                                         {row.caretaker && (() => {
//                                                                             // Priority: cache → userListData → filteredUsers._raw
//                                                                             const cached = selectedUsersCache.current[row.caretaker];
//                                                                             const found = cached
//                                                                                 || userListData.find(u => u.uid === row.caretaker)
//                                                                                 || row.filteredUsers?.find(o => o.value === row.caretaker)?._raw;
//                                                                             if (!found) return null;
//                                                                             return (
//                                                                                 <div className="selected-caretaker-container">
//                                                                                     <div className="manager-list-full" style={{
//                                                                                         display: "flex", alignItems: "center",
//                                                                                         border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                         padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                                     }}>
//                                                                                         <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                             <Image
//                                                                                                 src={found?.profile_image || (found?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg")}
//                                                                                                 alt={found?.first_name} width={48} height={48}
//                                                                                                 style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                             />
//                                                                                             <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                 {found?.first_name} {found?.last_name}<br />
//                                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Emp. id: {found?.employee_id}</span><br />
//                                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Dept: {found?.segment}</span>
//                                                                                                 {row.isGenderValidation === "Success" && <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>}
//                                                                                                 {row.isGenderValidation === "Error" && <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>}
//                                                                                                 {row.isGenderValidation === "Validating" && <span style={{ fontSize: "12px", color: "#BF9039", marginLeft: "8px" }}>⏳ Validating...</span>}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{found?.phone_number}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{found?.email}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{found?.gender}
//                                                                                             </span>
//                                                                                         </div>
//                                                                                         <div className="show-edit-btn">
//                                                                                             <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                                 onClick={() => router.push(`/People?guest_uid=${found?.uid}&show=true`)}>
//                                                                                                 Edit details
//                                                                                             </Button>
//                                                                                             <button type="button" className="ms-auto"
//                                                                                                 onClick={() => handleCaretakerSelect(tIdx, null)}
//                                                                                                 style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
//                                                                                                 <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                             </button>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             );
//                                                                         })()}
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

//                             {/* ── arrival details ───────────────────────────────────── */}
//                             <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                 <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                 <p className="text-secondary mb-2">This information helps in operational planning, legal compliance, and personalized service.</p>
//                                 <Form.Group className='mb-4 mt-4' controlId="arrival_time">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
//                                     <Select onChange={(e) => updateArrivalDetails("arrival_time", e.value)} options={timeOption}
//                                         placeholder="Select time" className="react_selectbox" isSearchable={false} styles={customStyles} />
//                                 </Form.Group>
//                                 <Form.Group className='mb-4' controlId="mode_of_arrival">
//                                     <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
//                                     <Select options={arrivalOption} placeholder="Select Mode" className="react_selectbox" isSearchable={false}
//                                         styles={customStyles}
//                                         value={arrivalOption.find(opt => opt.value === formData.arrival_details.mode_of_arrival) || null}
//                                         onChange={(e) => updateArrivalDetails("mode_of_arrival", e.value)} />
//                                 </Form.Group>
//                                 <div className='mb-4 form-group'>
//                                     <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
//                                     <input type="text" className="form-control"
//                                         placeholder="Enter number e.g. MADGAON LTT EXP #11100"
//                                         value={formData.arrival_details.transport_number}
//                                         onChange={(e) => updateArrivalDetails("transport_number", e.target.value)} />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── additional comments ───────────────────────────────── */}
//                             <div className="arrival-section mt-4 pt-4">
//                                 <h3 className="font-24 mb-2">Additional Comments</h3>
//                                 <div className='mb-5 form-group'>
//                                     <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
//                                     <input type="text"
//                                         onChange={(e) => setFormData(prev => ({ ...prev, company_booking_reference: e.target.value }))}
//                                         placeholder='Reference number to be entered for your internal purpose (optional)'
//                                         className='form-control' />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── other essential details ───────────────────────────── */}
//                             <div className="arrival-section mt-4 pt-3 mb-5">
//                                 <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                 <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
//                                 <div className='mb-4 form-group'>
//                                     <textarea className='form-control'
//                                         onChange={(e) => setFormData(prev => ({ ...prev, additional_comments: e.target.value }))}
//                                         placeholder='Got any thoughts or questions? Add them here! (Optional)' />
//                                 </div>
//                             </div>

//                             <hr />

//                             {/* ── confirmation email ────────────────────────────────── */}
//                             <div className="confirmation-email-section my-5 pb-5">
//                                 <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3' style={{ maxWidth: '360px', cursor: 'pointer' }}>
//                                     <Form.Check type="checkbox" label="Send copy of confirmation email"
//                                         checked={formData.send_confirmation_email}
//                                         onChange={(e) => {
//                                             updateFormData("send_confirmation_email", e.target.checked);
//                                             setIsEmailEnabled(e.target.checked);
//                                             setReceivers(e.target.checked ? [{ id: 1, email: '' }] : []);
//                                         }} />
//                                 </label>
//                                 {isEmailEnabled && (
//                                     <div className="email-content">
//                                         <p className='fw-bold' style={{ color: '#6B4F3F' }}>Add info</p>
//                                         {receivers.map((receiver, idx) => (
//                                             <div key={receiver.id} className="receiver-item">
//                                                 {idx > 0 && (<><hr className="my-4" /><p className='fw-bold mb-3'>Receiver {idx + 1}</p></>)}
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
//                                                             {idx === 0 ? (
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

//                         {/* ── booking summary ───────────────────────────────────────── */}
//                         <Col md={4} className='ps-5'>
//                             <div className='booking-summary-colum'>
//                                 <div className="d-flex align-items-center justify-between mb-4">
//                                     <h4 className='font-24 mb-0'>Booking Summary</h4>
//                                     <label className='mb-0 d-flex gap-2 align-items-center'>
//                                         <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices}
//                                             onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show prices
//                                     </label>
//                                 </div>
//                                 <div className="booking-summary">
//                                     <div className="summary-details">
//                                         <div className="summary-row">
//                                             <span className="summary-label">BRs Selected</span>
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
//                                         {bookingData?.segments?.map((seg) => (
//                                             <div key={seg.segment_id} className="summary-row detailed">
//                                                 <span className="summary-label">{seg.room_name} Pricing</span>
//                                                 <div className="summary-value-detailed">
//                                                     <div className="price-desc">{selectedAdult} Guest x {seg.nights} nights</div>
//                                                     {showPrices && <div className="price-amount">₹{seg.segment_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
//                                                     <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         <div className="total-section">
//                                             <span className="total-label">Total Price</span>
//                                             <div className="total-value-detailed">
//                                                 <div className="total-desc">{selectedAdult} Guest x {totalNights} nights</div>
//                                                 {showPrices && <div className="total-amount">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
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

//             {/* ── Edit Stay Details Modal ───────────────────────────────────────── */}
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
//                                         value={companyList.find(c => c.value === searchFieldData.company_id) || null}
//                                         onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.value })}
//                                         styles={customStyles} />
//                                 </div>
//                             </Col>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Where to?</label>
//                                     <Select options={cityList} placeholder="Select city" className="react_selectbox" isSearchable={false}
//                                         getOptionLabel={(o) => o.city} getOptionValue={(o) => o.city}
//                                         value={cityList.find(c => c.city === searchFieldData.city) || null}
//                                         onChange={(o) => setSearchFieldData({ ...searchFieldData, city: o.city })}
//                                         styles={customStyles} />
//                                 </div>
//                             </Col>
//                             <Col md={4} className='gap-2'>
//                                 <div className='d-flex gap-0'>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Check-in date</label>
//                                         <DatePicker selected={searchFieldData.check_in_date ? new Date(searchFieldData.check_in_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
//                                             minDate={new Date()} className="form-control custom-date-picker" dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
//                                     </div>
//                                     <div className='d-flex form-group flex-col w-50'>
//                                         <label className='text-black'>Checkout date</label>
//                                         <DatePicker selected={searchFieldData.check_out_date ? new Date(searchFieldData.check_out_date) : null}
//                                             onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
//                                             minDate={new Date()} className="form-control custom-date-picker" dateFormat="dd/MM/yyyy" placeholderText='dd/MM/yyyy' />
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
//                                             <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', textAlign: 'center', borderRadius: '0', color: '#fff' }}
//                                                 variant='' onClick={handleUpdateSearch}>Update Search</Button>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Modal.Body>
//             </Modal>

//             {/* ── Add Person Modal ─────────────────────────────────────────────── */}
//             <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} roleOption={role} companyList={companyList} addTravel={addTravel} />

//             {/* ── Price Breakdown Modal ────────────────────────────────────────── */}
//             <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         {bookingSummary?.segments?.map((seg) => (
//                             <div key={seg.segment_id} className='d-flex justify-between pt-2 pb-2'>
//                                 <span>{seg.room_name} x {selectedAdult} guest x {seg.nights} nights</span>
//                                 <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{seg.segment_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                             </div>
//                         ))}
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>CasaMelhor Service fee</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{bookingSummary?.serviceFee ?? 0}</span>
//                         </div>
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>Taxes</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{bookingSummary?.totalTax?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? "0.00"}</span>
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between'>
//                     <span className='fs-20'>Total</span>
//                     <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>
//                         ₹{bookingSummary?.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? "0.00"}
//                     </span>
//                 </Modal.Footer>
//             </Modal>

//             {/* ── Booking Confirmed Modal ──────────────────────────────────────── */}
//             <Modal show={addReserves} onHide={removeReserve} animation={false} centered className='custom-theme-modal-2 modal-460'>
//                 <Modal.Body className="pt-4 pb-4">
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
import React, { useState, useEffect, useRef } from 'react'
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
import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
import toast, { Toaster } from 'react-hot-toast';

export default function MultiSwitchReserve() {

    const router = useRouter();
    const timeOption = generateTimeOptions12Format(30);

    // ── localStorage (stable, read once) ─────────────────────────────────────
    const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"));
    const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
    const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
    const loginData = JSON.parse(getItemLocalStorage("userLogin"));

    // ── Pagination state for Private room ────────────────────────────────────
    const [privatePage, setPrivatePage] = useState(1);
    const [privateHasMore, setPrivateHasMore] = useState(true);
    const [privateLoading, setPrivateLoading] = useState(false);
    const [privateSearchKey, setPrivateSearchKey] = useState('');

    // ── state ─────────────────────────────────────────────────────────────────
    const [userListData, setUserListData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [bookingData, setBookingData] = useState(null);
    const [filtereduserListData, setFilteredUserListData] = useState([]);
    const [bookingSummary, setBookingSummary] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPrices, setShowPrices] = useState(false);
    const [isEmailEnabled, setIsEmailEnabled] = useState(false);
    const [receivers, setReceivers] = useState([]);
    const [bookingConfirmedData, setBookingConfirmedData] = useState([]);
    const [chooseBeds, setChooseBeds] = useState([]);
    const [showCaretakerList, setShowCaretakerList] = useState(false);
    const [role, setRole] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [cityList, setCityList] = useState([]);
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
    const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
    const [travellers, setTravellers] = useState([]);
    const [lockedGender, setLockedGender] = useState(null);

    // ── per-row API search state (Twin-sharing) ──────────────────────────────
    const [rowSearchLoading, setRowSearchLoading] = useState({});
    // Per-row pagination state for Twin-sharing
    const [rowPage, setRowPage] = useState({});
    const [rowHasMore, setRowHasMore] = useState({});

    // ── debounce timer per row & selected-user cache ──────────────────────────
    const rowSearchTimers = useRef({});
    const selectedUsersCache = useRef({});

    // ── private-room search driven by this state ──────────────────────────────
    const [privateSearch, setPrivateSearch] = useState('');

    // ── derived ───────────────────────────────────────────────────────────────
    const bedroomPreference = reserveBookingData?.bedroom_preference_badge || null;
    const adultCount = searchBookingData?.rooms?.[0]?.adults || 1;
    const totalNights = bookingData?.total_nights || 0;
    const totalPrice = bookingData?.total_price || 0;
    const numSegments = bookingData?.segments?.length || 0;
    const headerCompany = bacisSearchDetails?.company_name || "Company";
    const headerCity = bacisSearchDetails?.city || "City";
    const headerStay = bookingData?.segments?.length > 0
        ? `${formatDate(bookingData.segments[0].check_in_datetime)} - ${formatDate(bookingData.segments[bookingData.segments.length - 1].check_out_datetime)}, ${totalNights} nights`
        : "";
    const headerGuests = `1 room for ${adultCount} guest${adultCount > 1 ? "s" : ""}`;

    const [selectedAdult, setSelectedAdult] = useState(adultCount);

    // ── formData ──────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        company_id: 2,
        caretakers: "",
        caretakerGenderValid: null,
        traveller_type: null,
        traveler_assignments: [],
        arrival_details: { arrival_time: "", mode_of_arrival: "", transport_number: "" },
        send_confirmation_email: false,
        additional_comments: "",
        company_booking_reference: "",
    });

    const [searchFieldData, setSearchFieldData] = useState({
        company_id: 0, city: "", check_in_date: "", check_out_date: "", rooms: [], is_available: true, company_name: '', c_uid: ""
    });

    // ── modal toggles ─────────────────────────────────────────────────────────
    const [addTravels, addTravelsetShow] = useState(false);
    const removeTravel = () => addTravelsetShow(false);
    const addTravel = () => addTravelsetShow(true);

    const [addBreakdowns, addBreakdownsetShow] = useState(false);
    const removeBreakdown = () => addBreakdownsetShow(false);
    const addbreakdown = () => addBreakdownsetShow(true);

    const [addReserves, addReservesetShow] = useState(false);
    // const removeReserve = () => addReservesetShow(false);
    const removeReserve = () => {
        addReservesetShow(false);
        router.push(`/BookingDetails/${bookingConfirmedData[0]?.booking_uid}`);
    };
    const addReserve = () => addReservesetShow(true);

    const [addTravels2, addTravel2setShow] = useState(false);
    const removeTravel2 = () => addTravel2setShow(false);
    const addTravel2 = () => addTravel2setShow(true);

    // ── helpers ───────────────────────────────────────────────────────────────
    const updateFormData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
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

    // ── tax calculation ───────────────────────────────────────────────────────
    const calculateBookingTax = (data) => {
        if (!data?.segments) return null;
        let subtotal = 0, totalTax = 0;
        const updatedSegments = data.segments.map((seg) => {
            subtotal += seg.segment_price;
            const taxRate = seg.price_per_night <= 7500 ? 0.05 : 0.18;
            const taxAmount = seg.segment_price * taxRate;
            totalTax += taxAmount;
            return { ...seg, taxRate, taxAmount };
        });
        return { segments: updatedSegments, subtotal, totalTax, serviceFee: 0, grandTotal: subtotal + totalTax };
    };

    // ── init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (reserveBookingData) {
            setBookingData(reserveBookingData);
            setBookingSummary(calculateBookingTax(reserveBookingData));
            setTravellers(Array.from({ length: adultCount }, () => ({
                traveller_type: null, isGenderValidation: "",
                caretaker: null, searchText: "", showList: false,
                filteredUsers: [], selectedBedIndex: null,
                inputValue: "",
                page: 1,           // Pagination for this row
                hasMore: true,     // Has more data for this row
            })));
        }
        getCompanyList();
        getProprtyList();
        getUserListDataAPI();
        if (bacisSearchDetails) {
            setSearchFieldData({
                company_id: bacisSearchDetails.company_id,
                city: bacisSearchDetails.city,
                check_in_date: bacisSearchDetails.check_in_date,
                check_out_date: bacisSearchDetails.check_out_date,
                is_available: bacisSearchDetails.is_available,
                rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults })),
                company_name: bacisSearchDetails.company_name,
                c_uid: bacisSearchDetails.c_uid
            });
            setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })));
        }
    }, []);

    // ── private-room: re-fetch whenever privateSearch or privatePage changes ───
    useEffect(() => {
        if (formData?.traveller_type) {
            getUserListData(privateSearch, privatePage);
        }
    }, [privateSearch, privatePage, formData?.traveller_type]);

    useEffect(() => {
        if (searchKey) getCompanyList()
    }, [searchKey])

    // ── private-room: rebuild filteredUserListData on role / data changes ─────
    useEffect(() => {
        if (!formData?.traveller_type) { setFilteredUserListData([]); return; }
        const filtered = userListData
            .filter(user => {
                const rn = user.user_role?.role_name;
                let ok = formData.traveller_type === "External"
                    ? rn === "External"
                    : rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
                if (!ok) return false;
                if (bedroomPreference === "FEMALE PREFERRED") return user.gender === "Female";
                if (bedroomPreference === "MALE PREFERRED") return user.gender === "Male";
                return true;
            })
            .map(user => ({
                value: user.uid,
                label: `${user.first_name} ${user.last_name}`,
                gender: user.gender,
                icon: user.profile_image,
            }));
        setFilteredUserListData(filtered);
    }, [formData.traveller_type, userListData, bedroomPreference]);

    // ── API calls ─────────────────────────────────────────────────────────────

    // Private room — with pagination
    const getUserListData = async (searchTerm = '', pageNum = 1) => {
        if (privateLoading) return;
        if (pageNum > 1 && !privateHasMore) return;

        setPrivateLoading(true);
        try {
            const user_company = formData.traveller_type === "External" ? "" : searchFieldData.company_name;
            const res = await UserListAPI("All", '', searchTerm, '', '', '', '', '', user_company, pageNum);
            if (res?.data?.success) {
                const newData = res.data.response || [];
                setUserListData(prev => pageNum === 1 ? newData : [...prev, ...newData]);
                setPrivateHasMore(newData.length > 0);
                setPrivatePage(pageNum);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setPrivateLoading(false);
        }
    };

    // Twin-sharing — fetch with pagination
    const fetchUsersForRow = async (rowIndex, searchTerm, travellerType, pageNum = 1) => {
        // Prevent duplicate calls
        if (rowSearchLoading[rowIndex]) return;
        if (pageNum > 1 && !rowHasMore[rowIndex]) return;

        setRowSearchLoading(prev => ({ ...prev, [rowIndex]: true }));
        try {
            const category = travellerType === "External" ? "" : searchFieldData.company_name
            const res = await UserListAPI("All", '', searchTerm, '', '', '', '', '', category, pageNum);
            if (res?.data?.success) {
                const apiData = res.data.response || [];
                let base = apiData.filter(user => {
                    const rn = user?.user_role?.role_name;
                    if (travellerType === "External") return rn === "External";
                    // return rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
                });
                const pref = bookingData?.segments?.[bookingData.segments.length - 1]?.bedroom_preference_badge
                    || bedroomPreference;
                if (pref === "FEMALE PREFERRED") base = base.filter(u => u.gender === "Female");
                if (pref === "MALE PREFERRED") base = base.filter(u => u.gender === "Male");

                // Map to Select option shape; attach _raw so we can cache the full object on select
                const options = base.map(u => ({
                    value: u.uid,
                    label: `${u.first_name} ${u.last_name}`,
                    gender: u.gender,
                    icon: u.profile_image,
                    _raw: u,
                }));

                setTravellers(prev =>
                    prev.map((item, i) =>
                        i === rowIndex
                            ? {
                                ...item,
                                filteredUsers: pageNum === 1 ? options : [...item.filteredUsers, ...options],
                                page: pageNum,
                                hasMore: apiData.length > 0,
                            }
                            : item
                    )
                );
                setRowHasMore(prev => ({ ...prev, [rowIndex]: apiData.length > 0 }));
                setRowPage(prev => ({ ...prev, [rowIndex]: pageNum }));
            }
        } catch (error) {
            console.log("fetchUsersForRow error:", error);
        } finally {
            setRowSearchLoading(prev => ({ ...prev, [rowIndex]: false }));
        }
    };

    // Debounced wrapper — 350 ms per row so the API is not called on every keystroke
    const debouncedFetchUsersForRow = (rowIndex, searchTerm, travellerType) => {
        if (rowSearchTimers.current[rowIndex]) {
            clearTimeout(rowSearchTimers.current[rowIndex]);
        }
        rowSearchTimers.current[rowIndex] = setTimeout(() => {
            // Reset page to 1 on new search term
            setTravellers(prev =>
                prev.map((item, i) =>
                    i === rowIndex ? { ...item, page: 1, hasMore: true, filteredUsers: [] } : item
                )
            );
            setRowHasMore(prev => ({ ...prev, [rowIndex]: true }));
            fetchUsersForRow(rowIndex, searchTerm, travellerType, 1);
        }, 350);
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

    // ── room counter helpers ──────────────────────────────────────────────────
    const handleAdultChange = (roomId, change) =>
        setRooms(rooms.map(r => r.id === roomId ? { ...r, adults: Math.max(1, r.adults + change) } : r));
    const addRoom = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
    const deleteRoom = (id) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== id)); };

    const handleUpdateSearch = () => {
        removeItemLocalStorage("reserveRoom");
        localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
        router.push("./Searchresult");
    };

    // ── email helpers ─────────────────────────────────────────────────────────
    const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
    const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
    const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // ── Select options ────────────────────────────────────────────────────────
    const travelOption = [
        { value: "Company Booking Manager", label: "Company employee", icon: "../images/icons/hail.svg" },
        { value: "External", label: "External", icon: "../images/icons/short_stay.svg" },
    ];
    const arrivalOption = [
        { value: "Flight", label: "Flight" },
        { value: "Train", label: "Train" },
    ];

    // ── custom Select sub-components ──────────────────────────────────────────
    const CustomOption = (props) => (
        <components.Option {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image
                        src={props.data.icon ? props.data.icon : props.data.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                        alt={props.data.label} width={20} height={20}
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

    // Custom MenuList with scroll detection for Private room
    const PrivateMenuList = ({ children, innerRef, innerProps, selectProps }) => {
        const { options } = selectProps;
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
                    const target = e.target;
                    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
                    if (isBottom && privateHasMore && !privateLoading && formData?.traveller_type) {
                        getUserListData(privateSearch, privatePage + 1);
                    }
                }}
            >
                {isEmpty ? (
                    <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
                            {"Can't find someone?"}<br />
                            <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>Register a new traveler</Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {children}
                        <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
                                {"Can't find someone?"}<br />
                                <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>Register a new traveler</Link>
                            </div>
                        </div>
                    </>
                )}
                {privateLoading && (
                    <div style={{ padding: "8px 10px", fontSize: "13px", color: "#73615F", textAlign: "center" }}>
                        Loading more...
                    </div>
                )}
            </div>
        );
    };

    // Custom MenuList for Twin-sharing rows with scroll detection
    const TwinMenuList = ({ children, innerRef, innerProps, selectProps }) => {
        const { options, rowIndex } = selectProps;
        const isEmpty = !options || options.length === 0;
        const isLoading = rowSearchLoading[rowIndex];
        const hasMoreData = rowHasMore[rowIndex];

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
                    const target = e.target;
                    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
                    if (isBottom && hasMoreData && !isLoading && selectProps.travellerType) {
                        const currentRow = travellers[rowIndex];
                        const nextPage = (currentRow?.page || 1) + 1;
                        fetchUsersForRow(rowIndex, currentRow?.inputValue || '', currentRow?.traveller_type, nextPage);
                    }
                }}
            >
                {isEmpty ? (
                    <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
                        <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
                        <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px", color: "#463527" }}>
                            No travelers found
                        </div>
                        <Link href="/People" style={{ background: "#6B4F3F", color: "white", padding: "10px 20px", display: "block", textAlign: "center", textDecoration: "none" }}>
                            Invite to Join
                        </Link>
                    </div>
                ) : (
                    <>
                        {children}
                        <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
                                {"Can't find someone?"}<br />
                                <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>Register a new traveler</Link>
                            </div>
                        </div>
                    </>
                )}
                {isLoading && (
                    <div style={{ padding: "8px 10px", fontSize: "13px", color: "#73615F", textAlign: "center" }}>
                        Loading more...
                    </div>
                )}
            </div>
        );
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#6B4F3F" : "#ced4da",
            boxShadow: state.isFocused ? "0 0 0 1px #6B4F3F" : "none",
            "&:hover": { borderColor: "#6B4F3F" },
            borderRadius: "0px", minHeight: "48px",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#6B4F3F" : state.isFocused ? "#f0e8e3" : "transparent",
            color: state.isSelected ? "white" : "#463527",
            padding: "10px 16px", cursor: "pointer",
        }),
        menu: (base) => ({ ...base, background: "#f9f6f4", border: "1px solid #6B4F3F", borderRadius: "0", zIndex: 10 }),
        menuList: (base) => ({ ...base, padding: "8px 0", maxHeight: "260px" }),
        placeholder: (base) => ({ ...base, color: "#aaa" }),
        singleValue: (base) => ({ ...base, color: "#463527" }),
    };

    const validationBorderStyle = (validationState, isFocused) => {
        if (validationState === "Error") return "#dc3545";
        if (validationState === "Success") return "#2C734A";
        if (validationState === "Validating") return "#BF9039";
        return isFocused ? "#6B4F3F" : "#ced4da";
    };

    // ── handleTravellerTypeChange ─────────────────────────────────────────────
    const handleTravellerTypeChange = (rowIndex, selected) => {
        setTravellers(prev =>
            prev.map((item, i) =>
                i === rowIndex
                    ? {
                        ...item,
                        traveller_type: selected,
                        filteredUsers: [],
                        caretaker: null,
                        searchText: "",
                        inputValue: "",
                        isGenderValidation: "",
                        page: 1,
                        hasMore: true,
                    }
                    : item
            )
        );
        setRowHasMore(prev => ({ ...prev, [rowIndex]: true }));
        fetchUsersForRow(rowIndex, travellers[rowIndex]?.inputValue || '', selected, 1);
    };

    // ── handleSelectDropdown (Private room role picker) ───────────────────────
    const handleSelectDropdown = (e, name) => {
        if (name === "traveller_type") {
            setFormData(prev => ({ ...prev, traveller_type: e.value, caretakers: "", caretakerGenderValid: null }));
            // Reset private pagination when role changes
            setPrivatePage(1);
            setPrivateHasMore(true);
            setUserListData([]);
        }
    };

    // ── handleCaretakerSelect ─────────────────────────────────────────────────
    const handleCaretakerSelect = async (rowIndex, selectedOption) => {
        const userId = selectedOption?.value || null;

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
                    room_uid: lastSegment.room_uid,
                    traveler_uid: userId,
                    check_in_date: getDateOnly(lastSegment.check_in_datetime),
                    check_out_date: getDateOnly(lastSegment.check_out_datetime),
                    bed_index: 0,
                };
                const response = await validateGender(payload);
                const isValid = response?.data?.response?.valid;
                setFormData(prev => ({ ...prev, caretakerGenderValid: isValid }));
                // isValid
                //     ? toast.success("Gender validated successfully")
                //     : toast.error("Gender validation failed — this traveler is not allowed in this room");
                if (isValid) {
                    if (lockedGender === null && rawUser?.gender) {
                        setLockedGender(rawUser.gender);
                    }
                    toast.success(`Traveler ${rowIndex + 1}: Gender validated successfully`);
                } else {
                    toast.error(`Traveler ${rowIndex + 1}: Gender validation failed — not allowed in this room`);
                }
            } catch (err) {
                console.error("Gender validation error:", err);
                toast.error("Failed to validate gender");
                setFormData(prev => ({ ...prev, caretakerGenderValid: null }));
            }
            return;
        }

        // ── Twin-Sharing row: cleared ─────────────────────────────────────────
        // if (!userId) {
        //     setTravellers(prev =>
        //         prev.map((item, i) =>
        //             i === rowIndex
        //                 ? { ...item, caretaker: null, searchText: "", inputValue: "", isGenderValidation: "" }
        //                 : item
        //         )
        //     );
        //     return;
        // }
        if (!userId) {
            setTravellers(prev =>
                prev.map((item, i) =>
                    i === rowIndex
                        ? { ...item, caretaker: null, searchText: "", inputValue: "", isGenderValidation: "" }
                        : item
                )
            );

            // Recalculate the lock from whoever is still selected
            const othersRemaining = travellers.filter((t, i) => i !== rowIndex && t.caretaker);
            if (othersRemaining.length === 0) {
                setLockedGender(null);
            } else {
                const firstUser = selectedUsersCache.current[othersRemaining[0].caretaker];
                if (firstUser?.gender) setLockedGender(firstUser.gender);
            }

            return;
        }

        // ── Twin-Sharing row: selected ────────────────────────────────────────
        const rawUser = selectedOption?._raw
            || userListData.find(u => u.uid === userId)
            || travellers[rowIndex]?.filteredUsers?.find(o => o.value === userId)?._raw;

        if (rawUser) selectedUsersCache.current[userId] = rawUser;

        if (lockedGender && rawUser?.gender && rawUser.gender !== lockedGender) {
            toast.error(
                `This room is locked to ${lockedGender} travelers. Please select a ${lockedGender} traveler.`
            );
            return;  // stop here — no API call, no state update
        }

        const displayName = selectedOption?.label || (rawUser ? `${rawUser.first_name} ${rawUser.last_name}` : "");

        setTravellers(prev =>
            prev.map((item, i) =>
                i === rowIndex
                    ? {
                        ...item,
                        caretaker: userId,
                        searchText: displayName,
                        inputValue: displayName,
                        showList: false,
                        filteredUsers: [],
                        isGenderValidation: "Validating",
                    }
                    : item
            )
        );

        const lastSegment = bookingData?.segments?.[bookingData.segments.length - 1];
        if (!lastSegment) return;

        try {
            const payload = {
                room_uid: lastSegment.room_uid,
                traveler_uid: userId,
                check_in_date: getDateOnly(lastSegment.check_in_datetime),
                check_out_date: getDateOnly(lastSegment.check_out_datetime),
                bed_index: rowIndex,
            };
            const response = await validateGender(payload);
            const isValid = response?.data?.response?.valid;

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

    // ── pre-submit full gender validation ─────────────────────────────────────
    const validateAllTravellersGender = async () => {
        const segments = bookingData?.segments || [];
        const results = await Promise.all(
            travellers.map(async (row, tIdx) => {
                if (!row.caretaker) {
                    toast.error(`Traveler ${tIdx + 1}: No traveler selected`);
                    return false;
                }
                const segResults = await Promise.all(
                    segments.map(async (seg) => {
                        try {
                            const res = await validateGender({
                                room_uid: seg.room_uid,
                                traveler_uid: row.caretaker,
                                check_in_date: getDateOnly(seg.check_in_datetime),
                                check_out_date: getDateOnly(seg.check_out_datetime),
                                bed_index: tIdx,
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
        const isPrivate = bookingData?.segments?.[0]?.room_type === "Private";

        if (isPrivate) {
            if (!formData.caretakers) { toast.error("Please select a traveler before confirming"); return; }
            if (formData.caretakerGenderValid === false) { toast.error("Booking blocked: traveler did not pass gender validation"); return; }
        } else {
            if (travellers.some(r => !r.caretaker)) { toast.error("Please select a traveler for every row before confirming"); return; }
            setIsSubmitting(true);
            const allValid = await validateAllTravellersGender();
            if (!allValid) {
                setIsSubmitting(false);
                toast.error("Booking blocked: one or more travelers failed gender validation");
                return;
            }
        }

        if (isPrivate) setIsSubmitting(true);

        try {
            const cartItem = bookingData.segments.map((seg) => ({
                property_uid: seg.property_uid,
                room_uid: seg.room_uid,
                bed_index: isPrivate ? null : (travellers[0]?.selectedBedIndex ?? null),
                check_in_date: getDateOnly(seg.check_in_datetime),
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
                company_id: searchBookingData?.company_id || bacisSearchDetails.company_id,
                cart_items: cartItem,
                traveler_assignments: travelerAssignments,
                arrival_details: {
                    ...formData.arrival_details,
                    arrival_date: getDateOnly(bookingData.segments[0].check_in_datetime),
                },
                additional_comments: formData.additional_comments,
                company_booking_reference: formData.company_booking_reference,
                send_confirmation_email: formData.send_confirmation_email,
                additional_email_recipients: receivers.map(r => r.email)
            };

            const response = await CreateBookingPost(cleanPayload(payload));
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
                                    const isLast = index === bookingData.segments.length - 1;
                                    const nextSegment = bookingData.segments[index + 1];

                                    return (
                                        <React.Fragment key={segment.segment_id}>

                                            {/* ── room card ──────────────────────────────────────── */}
                                            <Row>
                                                <Col md={4}>
                                                    <Image
                                                        src={
                                                            segment.property_cover_photo
                                                                ? segment.property_cover_photo
                                                                : segment.cover_photo
                                                                    ? segment.cover_photo
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

                                            {/* ── check-in / check-out ───────────────────────────── */}
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

                                            {/* ── room details ───────────────────────────────────── */}
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

                                            {/* ── property/room change divider ───────────────────── */}
                                            {!isLast && (
                                                <div className="room-change-info d-flex gap-2 align-items-center mb-3 mt-3 pb-3 border-bottom">
                                                    <Image src="./images/icons/switch-pro-vertical.svg" alt="switch" width={24} height={100} />
                                                    <div>
                                                        <p className="fs-20 mb-0" style={{ color: "#a6a6a6" }}>
                                                            {bookingData?.type === "mixed_room" ? "Room" : "Property"} change on
                                                        </p>
                                                        <p className="mb-0" style={{ color: "#a6a6a6" }}>
                                                            {formatDate(nextSegment.check_in_datetime)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* ── traveller section (last segment only) ──────────── */}
                                            {isLast && (
                                                <div className="traveler-section">
                                                    <p className="mb-2 font-18">Travelers in this room</p>

                                                    {/* adult count radios */}
                                                    <div className="d-flex gap-3 mb-3">
                                                        {Array.from({ length: Math.max(adultCount, 2) }, (_, i) => {
                                                            const count = i + 1;
                                                            return (
                                                                <div key={count} className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }}>
                                                                    <label className="form-check-label d-flex gap-2 mb-0">
                                                                        <input
                                                                            type="radio" name='adult-count'
                                                                            checked={selectedAdult === count}
                                                                            onChange={() => {
                                                                                setSelectedAdult(count);
                                                                                setLockedGender(null);
                                                                                setTravellers(Array.from({ length: count }, () => ({
                                                                                    traveller_type: null, isGenderValidation: "",
                                                                                    caretaker: null, searchText: "", showList: false,
                                                                                    filteredUsers: [], selectedBedIndex: null, inputValue: "",
                                                                                    page: 1, hasMore: true,
                                                                                })));
                                                                                // Reset row pagination states
                                                                                setRowHasMore({});
                                                                                setRowPage({});
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
                                                                <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
                                                                    {/* Since this is a twin bed, one will be available for booking unless you specify it for exclusive use. */}
                                                                    If any beds left available, they can be booked by other guests unless you book the whole room exclusively
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    )}

                                                    <p className="mb-2 font-18">Traveler details</p>
                                                    <p className='small'>{`We'll use this information to book. Make sure the name matches what is on the traveler's passport or ID.`}</p>

                                                    {bedroomPreference && (
                                                        <Row className='mb-2'>
                                                            <Col md={7}>
                                                                <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
                                                                    As this room has already been booked for a {bedroomPreference.toLowerCase().replace(" preferred", "")}, only {bedroomPreference.toLowerCase().replace(" preferred", "")} traveler bookings are allowed
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    )}

                                                    {/* ── PRIVATE ──────────────────────────────────── */}
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
                                                                                className='react_selectbox'
                                                                                styles={customStyles}
                                                                                components={{ Option: CustomOption, MenuList: PrivateMenuList }}
                                                                                placeholder="Add a traveler"
                                                                                isSearchable
                                                                                isClearable
                                                                                isLoading={privateLoading}
                                                                                onInputChange={(val, { action }) => {
                                                                                    if (action === "input-change") {
                                                                                        setPrivateSearch(val);
                                                                                        setPrivateSearchKey(val);
                                                                                        // Reset pagination on new search
                                                                                        setPrivatePage(1);
                                                                                        setPrivateHasMore(true);
                                                                                        setUserListData([]);
                                                                                    }
                                                                                }}
                                                                                onChange={(selected) => handleCaretakerSelect("", selected)}
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
                                                                                display: "flex", alignItems: "center",
                                                                                border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
                                                                                padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
                                                                            }}>
                                                                                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
                                                                                    <Image
                                                                                        src={item?.profile_image || (item?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg")}
                                                                                        alt={item?.first_name} width={48} height={48}
                                                                                        style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
                                                                                    />
                                                                                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                                        {item?.first_name} {item?.last_name}<br />
                                                                                        <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Emp. id: {item?.employee_id}</span><br />
                                                                                        <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Dept: {item?.segment}</span>
                                                                                        {formData.caretakerGenderValid === true && <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>}
                                                                                        {formData.caretakerGenderValid === false && <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>}
                                                                                        {formData.caretakerGenderValid === null && <span style={{ fontSize: "12px", color: "#BF9039", marginLeft: "8px" }}>⏳ Validating...</span>}
                                                                                    </span>
                                                                                    <span style={{ color: "#73615F" }}>|</span>
                                                                                    <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                        <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{item?.phone_number}
                                                                                    </span>
                                                                                    <span style={{ color: "#73615F" }}>|</span>
                                                                                    <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                        <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{item?.email}
                                                                                    </span>
                                                                                    <span style={{ color: "#73615F" }}>|</span>
                                                                                    <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
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
                                                                                        style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
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
                                                        /* ── TWIN-SHARING rows ─────────────────────── */
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

                                                                    {/* bed picker */}
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

                                                                    {/* ── traveller Select with pagination ─────────────────────────────── */}
                                                                    <div className={chooseBeds.length > 0 ? "col-md-5" : "col-md-8"}>
                                                                        <Select
                                                                            options={row.filteredUsers}
                                                                            isLoading={!!rowSearchLoading[tIdx]}
                                                                            filterOption={() => true}
                                                                            placeholder={row.traveller_type ? "Search traveler..." : "Select a role first"}
                                                                            isDisabled={!row.traveller_type}
                                                                            isSearchable
                                                                            isClearable
                                                                            inputValue={row.inputValue ?? ""}
                                                                            onInputChange={(val, { action }) => {
                                                                                if (action !== "input-change") return;
                                                                                setTravellers(prev =>
                                                                                    prev.map((item, i) =>
                                                                                        i === tIdx ? { ...item, inputValue: val } : item
                                                                                    )
                                                                                );
                                                                                debouncedFetchUsersForRow(tIdx, val, row.traveller_type);
                                                                            }}
                                                                            onMenuOpen={() => {
                                                                                // Fetch immediately when the dropdown opens
                                                                                if (row.filteredUsers.length === 0 && row.traveller_type) {
                                                                                    fetchUsersForRow(tIdx, row.inputValue || "", row.traveller_type, 1);
                                                                                }
                                                                            }}
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
                                                                                        const cached = selectedUsersCache.current[row.caretaker];
                                                                                        const raw = cached || userListData.find(u => u.uid === row.caretaker);
                                                                                        if (raw) return { value: raw.uid, label: `${raw.first_name} ${raw.last_name}`, gender: raw.gender, icon: raw.profile_image, _raw: raw };
                                                                                        return row.filteredUsers?.find(o => o.value === row.caretaker) ?? null;
                                                                                    })()
                                                                                    : null
                                                                            }
                                                                            onChange={(selected) => handleCaretakerSelect(tIdx, selected)}
                                                                            components={{
                                                                                Option: CustomOption,
                                                                                MenuList: (props) => (
                                                                                    <TwinMenuList
                                                                                        {...props}
                                                                                        rowIndex={tIdx}
                                                                                        travellerType={row.traveller_type}
                                                                                    />
                                                                                ),
                                                                            }}
                                                                            noOptionsMessage={() =>
                                                                                rowSearchLoading[tIdx] ? null : "No travelers found"
                                                                            }
                                                                        />

                                                                        {/* validation feedback */}
                                                                        {row.isGenderValidation === "Validating" && (
                                                                            <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#BF9039" }}>⏳ Validating gender...</p>
                                                                        )}
                                                                        {row.isGenderValidation === "Error" && (
                                                                            <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>✕ Gender validation failed — this traveler is not allowed in this room</p>
                                                                        )}
                                                                        {row.isGenderValidation === "Success" && row.caretaker && (
                                                                            <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>✓ Gender validated</p>
                                                                        )}
                                                                    </div>

                                                                    {/* selected traveller card */}
                                                                    <div className="col-md-12">
                                                                        {row.caretaker && (() => {
                                                                            const cached = selectedUsersCache.current[row.caretaker];
                                                                            const found = cached
                                                                                || userListData.find(u => u.uid === row.caretaker)
                                                                                || row.filteredUsers?.find(o => o.value === row.caretaker)?._raw;
                                                                            if (!found) return null;
                                                                            return (
                                                                                <div className="selected-caretaker-container">
                                                                                    <div className="manager-list-full" style={{
                                                                                        display: "flex", alignItems: "center",
                                                                                        border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
                                                                                        padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
                                                                                    }}>
                                                                                        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
                                                                                            <Image
                                                                                                src={found?.profile_image || (found?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg")}
                                                                                                alt={found?.first_name} width={48} height={48}
                                                                                                style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
                                                                                            />
                                                                                            <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                                                {found?.first_name} {found?.last_name}<br />
                                                                                                <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Emp. id: {found?.employee_id}</span><br />
                                                                                                <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>Dept: {found?.segment}</span>
                                                                                                {row.isGenderValidation === "Success" && <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>}
                                                                                                {row.isGenderValidation === "Error" && <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>}
                                                                                                {row.isGenderValidation === "Validating" && <span style={{ fontSize: "12px", color: "#BF9039", marginLeft: "8px" }}>⏳ Validating...</span>}
                                                                                            </span>
                                                                                            <span style={{ color: "#73615F" }}>|</span>
                                                                                            <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                                <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />{found?.phone_number}
                                                                                            </span>
                                                                                            <span style={{ color: "#73615F" }}>|</span>
                                                                                            <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                                <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />{found?.email}
                                                                                            </span>
                                                                                            <span style={{ color: "#73615F" }}>|</span>
                                                                                            <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                                <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />{found?.gender}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="show-edit-btn">
                                                                                            <Button variant="" className="edit-btn ms-1 me-1"
                                                                                                onClick={() => router.push(`/People?guest_uid=${found?.uid}&show=true`)}>
                                                                                                Edit details
                                                                                            </Button>
                                                                                            <button type="button" className="ms-auto"
                                                                                                onClick={() => handleCaretakerSelect(tIdx, null)}
                                                                                                style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
                                                                                                <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })()}
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
                                <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3' style={{ maxWidth: '360px', cursor: 'pointer' }}>
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
                                        <p className='fw-bold' style={{ color: '#6B4F3F' }}>Add info</p>
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
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel2} />
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
                                            <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', textAlign: 'center', borderRadius: '0', color: '#fff' }}
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
            <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} roleOption={role} companyList={companyList} addTravel={addTravel} loadMoreCompanies={loadMoreCompanies}
                setSearchComp={setSearchKey} />

            {/* ── Price Breakdown Modal ────────────────────────────────────────── */}
            <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
                    <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='booking-filter'>
                        {bookingSummary?.segments?.map((seg) => (
                            <div key={seg.segment_id} className='d-flex justify-between pt-2 pb-2'>
                                <span>{seg.room_name} x {selectedAdult} guest x {seg.nights} nights</span>
                                <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{seg.segment_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                        <div className='d-flex justify-between pt-2 pb-2'>
                            <span>CasaMelhor Service fee</span>
                            <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{bookingSummary?.serviceFee ?? 0}</span>
                        </div>
                        <div className='d-flex justify-between pt-2 pb-2'>
                            <span>Taxes</span>
                            <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{bookingSummary?.totalTax?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? "0.00"}</span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between'>
                    <span className='fs-20'>Total</span>
                    <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>
                        ₹{bookingSummary?.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? "0.00"}
                    </span>
                </Modal.Footer>
            </Modal>

            {/* ── Booking Confirmed Modal ──────────────────────────────────────── */}
            <Modal show={addReserves} onHide={removeReserve} animation={false} backdrop={true} centered className='custom-theme-modal-2 modal-460'>
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