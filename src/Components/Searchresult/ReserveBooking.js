// "use client"
// import React, { useState, useEffect, useRef, useCallback } from 'react'
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
// import { calculateNights, convertTo24Hour, formatDateMonthYear, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
// import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
// import toast, { Toaster } from 'react-hot-toast';

// // ─── Arrival options (moved to module level — no need to recreate on every render) ──
// const arrivalOption = [
//     { value: "Flight", label: "Flight" },
//     { value: "Train", label: "Train" },
// ];

// export default function ReserveBooking() {

//     const router = useRouter();
//     const timeOption = generateTimeOptions12Format(30);

//     // ─── localStorage reads (done once — stable references) ──────────────────
//     const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"));

//     // ─── State ────────────────────────────────────────────────────────────────
//     const [userListData, setUserListData] = useState([]);
//     const [current, setCurrent] = useState(0);
//     const [bookingData, setBookingData] = useState(null);
//     const [filtereduserListData, setFilteredUserListData] = useState([]);
//     const [isExclusiveBooking, setIsExclusiveBooking] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [role, setRole] = useState([]);
//     const [search, setSearch] = useState('');

//     // ─── Per-row search loading state for twin-sharing ────────────────────────
//     const [rowSearchLoading, setRowSearchLoading] = useState({});

//     // ─── Debounce timer refs — one per row index ──────────────────────────────
//     const rowSearchTimers = useRef({});

//     // ─── Cache of selected users by uid — so card renders even after list clears ─
//     const selectedUsersCache = useRef({});

//     // ─── Tax / price helpers ──────────────────────────────────────────────────
//     const [amount, setAmount] = useState(0);
//     const [tax, setTax] = useState(0);
//     const [total, setTotal] = useState(0);

//     const calculateTax = (pricePerNight, checkIn, checkOut) => {
//         const parsed = Number(pricePerNight);
//         if (!parsed || parsed < 0) { setTax(0); setTotal(0); setAmount(0); return; }

//         const nights = calculateNights(checkIn, checkOut);
//         const taxRate = parsed <= 7500 ? 0.05 : 0.18;
//         const roomTotal = parsed * nights;
//         const calcTax = roomTotal * taxRate;
//         setAmount(roomTotal);
//         setTax(calcTax);
//         setTotal(roomTotal + calcTax);
//     };

//     // FIX: breakdownText now uses live bookingData instead of stale bacisSearchDetails rooms
//     const breakdownText = () => {
//         const roomCount = 1;
//         const guestCount = bookingData?.[0]?.adultCount || 1;
//         const nights = calculateNights(
//             bookingData?.[0]?.check_in_datetime,
//             bookingData?.[0]?.check_out_datetime
//         );
//         return `${roomCount} room x ${guestCount} guest x ${nights} nights`;
//     };

//     // FIX: bedroomPreference derived from reactive bookingData state (not stale reserveBookingData)
//     const bedroomPreference = bookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;

//     // ─── formData ─────────────────────────────────────────────────────────────
//     const [formData, setFormData] = useState({
//         company_id: null,
//         caretakers: "",
//         caretakerGenderValid: null,
//         traveller_type: null,         // FIX: added to top-level formData (was missing)
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
//     const [showPrices, setShowPrices] = useState(false);
//     const [selectedAdult, setSelectedAdult] = useState(1);

//     // ─── Modal states ─────────────────────────────────────────────────────────
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

//     // ─── formData helpers ─────────────────────────────────────────────────────
//     const updateFormData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
//     const updateArrivalDetails = (key, value) => setFormData(prev => ({
//         ...prev,
//         arrival_details: { ...prev.arrival_details, [key]: key === "arrival_time" ? convertTo24Hour(value) : value }
//     }));

//     // ─── Role list ────────────────────────────────────────────────────────────
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
//             console.error("UserRoleListAPI error:", error);
//         }
//     };

//     // ─── Init bookingData + travellers from localStorage ─────────────────────
//     useEffect(() => {
//         if (reserveBookingData?.length > 0) {
//             setBookingData(reserveBookingData);
//             calculateTax(
//                 reserveBookingData[0]?.rooms?.[0]?.price_per_night,
//                 reserveBookingData[0]?.check_in_datetime,
//                 reserveBookingData[0]?.check_out_datetime
//             );
//             const count = reserveBookingData[0]?.adultCount || 1;
//             setSelectedAdult(count);
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
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // ─── chooseBeds derived from bookingData state (reactive) ─────────────────
//     const [chooseBeds, setChooseBeds] = useState([]);

//     useEffect(() => {
//         if (!bookingData) return;
//         const room = bookingData?.[0]?.rooms?.[0];
//         if (!room) return;

//         if (room.room_type === "Twin-Sharing") {
//             const availableBedIndices = room.available_beds || [];
//             const beds = room.beds
//                 ?.map((bed, index) => ({ label: bed.name, value: index }))
//                 .filter(bed => availableBedIndices.includes(bed.value));
//             setChooseBeds(beds || []);
//         } else {
//             setChooseBeds([]);
//         }
//     }, [bookingData]); // FIX: depends on bookingData state, not stale closure

//     // ─── Traveller type dropdown options ─────────────────────────────────────
//     const travelOption = [
//         { value: "Company Booking Manager", label: "Company employee", icon: "../images/icons/hail.svg" },
//         { value: "External", label: "External", icon: "../images/icons/short_stay.svg" },
//     ];

//     const CustomOption = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image
//                         src={props.data.icon
//                             ? props.data.icon
//                             : props.data.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                         alt={props.data.label}
//                         width={20} height={20}
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
//             backgroundColor: state.isSelected ? "#6B4F3F" : state.isFocused ? "#f0e8e3" : "transparent",
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

//     // FIX: CustomMenuList receives addTravel via selectProps to avoid stale closure
//     const CustomMenuList = ({ children, selectProps }) => {
//         const { options } = selectProps;
//         const isEmpty = !options || options.length === 0;

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
//                                 background: "#6B4F3F", color: "white",
//                                 padding: "10px 20px", display: "block",
//                                 textAlign: "center", textDecoration: "none",
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

//     // ─── handleSelectDropdown for Private room ────────────────────────────────
//     const handleSelectDropdown = (e, name) => {
//         if (name === "traveller_type") {
//             setFormData(prev => ({ ...prev, traveller_type: e.value }));
//         }
//     };

//     // ─── handleCaretakerSelect ────────────────────────────────────────────────
//     const handleCaretakerSelect = async (rowIndex, userId) => {
//         // ── Private room ──
//         if (rowIndex === "") {
//             if (!userId) {
//                 setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }));
//                 setShowCaretakerList(false);
//                 return;
//             }

//             setFormData(prev => ({ ...prev, caretakers: userId, caretakerGenderValid: null }));
//             setShowCaretakerList(false);

//             try {
//                 const payload = {
//                     room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
//                     traveler_uid: userId,
//                     check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                     check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
//                     bed_index: 0,
//                 };
//                 const response = await validateGender(payload);
//                 const isValid = response?.data?.response?.valid;
//                 setFormData(prev => ({ ...prev, caretakerGenderValid: isValid }));
//                 if (isValid) {
//                     toast.success("Gender validated successfully");
//                 } else {
//                     toast.error("Gender validation failed — this traveler is not allowed in this room");
//                 }
//             } catch (error) {
//                 console.error("Gender validation error:", error);
//                 toast.error("Failed to validate gender");
//             }
//             return;
//         }

//         // ── Twin-Sharing row: cleared ──
//         // FIX: check for falsy (null, undefined, "") consistently
//         if (!userId) {
//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex
//                         ? { ...item, caretaker: null, searchText: "", isGenderValidation: "" }
//                         : item
//                 )
//             );
//             return;
//         }

//         // ── Twin-Sharing row: selected ──
//         // Look up from userListData first, then from row's filteredUsers, then cache it
//         const user = userListData.find(u => u.uid === userId)
//             || travellers[rowIndex]?.filteredUsers?.find(u => u.uid === userId);

//         // Cache so the selected card can render even after filteredUsers is cleared
//         if (user) selectedUsersCache.current[userId] = user;

//         setTravellers(prev =>
//             prev.map((item, i) =>
//                 i === rowIndex
//                     ? {
//                         ...item,
//                         caretaker: userId,
//                         searchText: user ? `${user.first_name} ${user.last_name}` : "",
//                         showList: false,
//                         filteredUsers: [],        // clear dropdown after selection
//                         isGenderValidation: "Validating",
//                     }
//                     : item
//             )
//         );

//         try {
//             const payload = {
//                 room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
//                 traveler_uid: userId,
//                 check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                 check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
//                 bed_index: rowIndex,
//             };
//             const response = await validateGender(payload);
//             const isValid = response?.data?.response?.valid;

//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex
//                         ? { ...item, isGenderValidation: isValid ? "Success" : "Error" }
//                         : item
//                 )
//             );
//             if (isValid) {
//                 toast.success(`Traveler ${rowIndex + 1}: Gender validated successfully`);
//             } else {
//                 toast.error(`Traveler ${rowIndex + 1}: Gender validation failed — not allowed in this room`);
//             }
//         } catch (error) {
//             console.error("Gender validation error:", error);
//             toast.error(`Traveler ${rowIndex + 1}: Failed to validate gender`);
//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex ? { ...item, isGenderValidation: "" } : item
//                 )
//             );
//         }
//     };

//     // ─── handleTravellerTypeChange for Twin-Sharing rows ─────────────────────
//     const handleTravellerTypeChange = (rowIndex, selected) => {
//         // Update traveller_type immediately, then fetch from API
//         setTravellers(prev => {
//             const updated = [...prev];
//             if (!updated[rowIndex]) return prev;
//             updated[rowIndex] = { ...updated[rowIndex], traveller_type: selected, filteredUsers: [] };
//             return updated;
//         });
//         // Fetch fresh results from API with current searchText and new role (immediate, no debounce on role change)
//         const currentSearchText = travellers[rowIndex]?.searchText || '';
//         fetchUsersForRow(rowIndex, currentSearchText, selected);
//     };

//     // ─── Caretaker dropdown visibility ───────────────────────────────────────
//     // FIX: initialized to false (not null) so boolean coercion works correctly
//     const [showCaretakerList, setShowCaretakerList] = useState(false);

//     // ─── Fetch users for Private room (search state drives this) ─────────────
//     const getUserListData = async (searchTerm = '') => {
//         try {
//             const response = await UserListAPI("All",'', searchTerm);
//             if (response?.data?.success) setUserListData(response.data.response);
//         } catch (error) { console.log(error); }
//     };

//     // ─── Fetch users for a specific Twin-Sharing row, then filter & update ────
//     const fetchUsersForRow = async (rowIndex, searchTerm, travellerType) => {
//         setRowSearchLoading(prev => ({ ...prev, [rowIndex]: true }));
//         try {
//             const response = await UserListAPI("All",'', searchTerm);
//             if (response?.data?.success) {
//                 let base = response.data.response.filter(user => {
//                     const rn = user?.user_role?.role_name;
//                     if (travellerType === "External") return rn === "External";
//                     return rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                 });
//                 // Apply gender preference filter
//                 const pref = bookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;
//                 if (pref === "FEMALE PREFERRED") base = base.filter(u => u.gender === "Female");
//                 if (pref === "MALE PREFERRED") base = base.filter(u => u.gender === "Male");

//                 setTravellers(prev =>
//                     prev.map((item, i) =>
//                         i === rowIndex ? { ...item, filteredUsers: base } : item
//                     )
//                 );
//             }
//         } catch (error) {
//             console.log("fetchUsersForRow error:", error);
//         } finally {
//             setRowSearchLoading(prev => ({ ...prev, [rowIndex]: false }));
//         }
//     };

//     // ─── Debounced version — 350ms delay to avoid API call on every keystroke ─
//     const debouncedFetchUsersForRow = (rowIndex, searchTerm, travellerType) => {
//         if (rowSearchTimers.current[rowIndex]) {
//             clearTimeout(rowSearchTimers.current[rowIndex]);
//         }
//         rowSearchTimers.current[rowIndex] = setTimeout(() => {
//             fetchUsersForRow(rowIndex, searchTerm, travellerType);
//         }, 350);
//     };

//     // Private room search: re-fetch whenever `search` changes (empty string on mount = initial load)
//     useEffect(() => {
//         getUserListData(search);
//     }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

//     // ─── Filter users for Private room dropdown ───────────────────────────────
//     useEffect(() => {
//         if (!formData?.traveller_type) { setFilteredUserListData([]); return; }

//         const filtered = userListData
//             ?.filter(user => {
//                 const roleName = user.user_role?.role_name;
//                 let allowed = false;
//                 if (formData.traveller_type === "External") {
//                     allowed = roleName === "External";
//                 } else {
//                     allowed = roleName !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                 }
//                 if (!allowed) return false;
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

//         setFilteredUserListData(filtered || []);
//     }, [formData.traveller_type, userListData, bedroomPreference]);

//     // ─── Date helpers ─────────────────────────────────────────────────────────
//     const getDateOnly = (dateTime) => dateTime?.split("T")[0];

//     const formatDate = (dateTime) => new Date(dateTime).toLocaleDateString("en-IN", {
//         weekday: "short", day: "numeric", month: "short", year: "numeric"
//     });

//     const formatTime = (dateTime) => new Date(dateTime).toLocaleTimeString("en-IN", {
//         hour: "2-digit", minute: "2-digit", hour12: true
//     });

//     const formatStayDates = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);
//         const opts = { weekday: "short", day: "numeric", month: "short" };
//         const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
//         return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}, ${end.getFullYear()}, ${nights} night${nights > 1 ? "s" : ""}`;
//     };
//     const countNights = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);
//         const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
//         return nights;
//     }

//     const formatRoomsAndGuests = (rooms = []) => {
//         const rc = rooms.length;
//         const gc = rooms.reduce((sum, r) => sum + (r.adults || 0), 0);
//         return `${rc} room${rc > 1 ? "s" : ""} for ${gc} guest${gc > 1 ? "s" : ""}`;
//     };

//     // ─── Pre-submit gender validation for ALL Twin-Sharing travellers ─────────
//     const validateAllTravellersGender = async () => {
//         let allValid = true;
//         for (let i = 0; i < travellers.length; i++) {
//             const traveller = travellers[i];
//             if (!traveller.caretaker) {
//                 toast.error(`Traveler ${i + 1}: No traveler selected`);
//                 allValid = false;
//                 continue;
//             }
//             try {
//                 const payload = {
//                     room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
//                     traveler_uid: traveller.caretaker,
//                     check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                     check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
//                     bed_index: i,
//                 };
//                 const response = await validateGender(payload);
//                 const isValid = response?.data?.response?.valid;

//                 setTravellers(prev =>
//                     prev.map((item, idx) =>
//                         idx === i ? { ...item, isGenderValidation: isValid ? "Success" : "Error" } : item
//                     )
//                 );

//                 if (!isValid) {
//                     toast.error(`Traveler ${i + 1}: Gender validation failed — booking blocked`);
//                     allValid = false;
//                 }
//             } catch {
//                 toast.error(`Traveler ${i + 1}: Gender validation error`);
//                 allValid = false;
//             }
//         }
//         return allValid;
//     };

//     // ─── Edit Stay Details state ──────────────────────────────────────────────
//     const [searchFieldData, setSearchFieldData] = useState({
//         company_id: 0, city: "", check_in_date: "", check_out_date: "", rooms: [], is_available: true
//     });
//     const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
//     const [companyList, setCompanyList] = useState([]);
//     const [cityList, setCityList] = useState([]);

//     const handleAdultChange = (roomId, change) => {
//         setRooms(rooms.map(room => {
//             if (room.id === roomId) {
//                 const nv = room.adults + change;
//                 return { ...room, adults: nv >= 1 ? nv : 1 };
//             }
//             return room;
//         }));
//     };
//     const addRoom = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
//     const deleteRoom = (roomId) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== roomId)); };

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

//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 setCompanyList(response.data.response.map(item => ({ value: item.id, label: item.company_name })));
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
//                 is_available: bacisSearchDetails.is_available,
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
//             });
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx + 1, adults: val.adults })));
//         }
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const handleUpdateSearch = () => {
//         removeItemLocalStorage("reserveRoom");
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
//         router.push("./Searchresult");
//     };

//     // ─── Email recipients ─────────────────────────────────────────────────────
//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([]);
//     const [bookingConfirmedData, setBookingConfirmedData] = useState([]);

//     const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
//     const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
//     const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
//     const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//     // ─── Submit booking ───────────────────────────────────────────────────────
//     const handleSubmitReserve = async () => {
//         const isPrivate = bookingData?.[0]?.rooms?.[0]?.room_type === "Private";

//         if (isPrivate) {
//             if (!formData.caretakers) {
//                 toast.error("Please select a traveler before confirming");
//                 return;
//             }
//             if (formData.caretakerGenderValid === false) {
//                 toast.error("Booking blocked: traveler did not pass gender validation");
//                 return;
//             }
//         } else {
//             const missingTraveller = travellers.some(row => !row.caretaker);
//             if (missingTraveller) {
//                 toast.error("Please select a traveler for every row before confirming");
//                 return;
//             }

//             // FIX: setIsSubmitting(true) BEFORE validateAllTravellersGender, then handle result
//             setIsSubmitting(true);
//             const allGenderValid = await validateAllTravellersGender();
//             if (!allGenderValid) {
//                 setIsSubmitting(false);
//                 toast.error("Booking blocked: one or more travelers failed gender validation");
//                 return;
//             }
//             // Keep isSubmitting=true and fall through to CreateBookingPost
//         }

//         // For private rooms we set submitting here; for shared it's already set above
//         if (isPrivate) setIsSubmitting(true);

//         try {
//             const cartItem = isPrivate
//                 ? [{
//                     property_uid: bookingData?.[0]?.property_uid,
//                     room_uid: bookingData?.[0]?.rooms?.[0]?.room_uid,
//                     bed_index: null,
//                     check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                     check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime)
//                 }]
//                 : travellers.map(t => ({
//                     property_uid: bookingData?.[0]?.property_uid,
//                     room_uid: bookingData?.[0]?.rooms?.[0]?.room_uid,
//                     bed_index: t.selectedBedIndex,
//                     check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                     check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime)
//                 }));

//             const travelerAssignments = isPrivate
//                 ? [{ cart_item_index: 0, traveler_id: formData.caretakers, is_exclusive_booking: isExclusiveBooking }]
//                 : travellers.map((row, index) => ({
//                     cart_item_index: index,
//                     traveler_id: row.caretaker,
//                     is_exclusive_booking: isExclusiveBooking
//                 }));

//             const payload = {
//                 company_id: searchBookingData?.company_id,
//                 cart_items: cartItem,
//                 traveler_assignments: travelerAssignments,
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
//                 setBookingConfirmedData(response.data.response.bookings);
//                 setShowReserveModal(true);
//                 toast.success("Booking Created Successfully");
//                 removeItemLocalStorage("reserveRoom");
//                 removeItemLocalStorage("searchParam");
//                 removeItemLocalStorage("basicSecrchItemObj");
//             } else {
//                 response.data.response.validation_errors.forEach(el => toast.error(el.error));
//             }
//         } catch (error) {
//             console.error("Submission error:", error);
//             toast.error("Failed to create booking");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

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

//                         {bookingData?.length > 0 && bookingData?.map((booking, bookingIndex) => (
//                             <React.Fragment key={bookingIndex}>
//                                 <Col md={8}>
//                                     <h4 className='font-24 mb-4'>Review Your Selected BRs (1)</h4>

//                                     <div className="booking-card border bg-white p-3 mb-4">
//                                         {/* Room image + title */}
//                                         <Row>
//                                             <Col md={4}>
//                                                 <Image
//                                                     src={booking?.cover_photo
//                                                         ? `https://alicedevapi.casamelhor.in${booking.cover_photo}`
//                                                         : `/images/icons/No-Image.svg`}
//                                                     alt="Room Image"
//                                                     width={300} height={200}
//                                                     className="img-fluid"
//                                                 />
//                                             </Col>
//                                             <Col md={8}>
//                                                 <p className="fw-semibold fs-20 mb-2 room-title">
//                                                     {countNights(booking.check_in_datetime, booking.check_out_datetime)} night stay in {booking.rooms[0].room_name}
//                                                     <span className='room-type-badge ms-2'>
//                                                         {booking.rooms[0].room_type === "Private" ? "Private Rooms" : "Shared Rooms"}
//                                                     </span>
//                                                 </p>
//                                                 <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                     <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} className="img-fluid" />
//                                                     {booking?.property_name}<br />{booking?.address}
//                                                 </p>
//                                             </Col>
//                                         </Row>

//                                         {/* Check-in / Check-out */}
//                                         <Row className="mt-3 mb-3">
//                                             <Col md={3}>
//                                                 <p className="mb-1 text-secondary small">Check-in:</p>
//                                                 <p className="fw-semibold mb-0">{formatDate(booking.check_in_datetime)}</p>
//                                                 <small>{formatTime(booking.check_in_datetime)}</small>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <p className="mb-1 text-secondary small">Check-out:</p>
//                                                 <p className="fw-semibold mb-0">{formatDate(booking.check_out_datetime)}</p>
//                                                 <small>{formatTime(booking.check_out_datetime)}</small>
//                                             </Col>
//                                         </Row>

//                                         {/* Room details */}
//                                         <div className="border-top pt-3">
//                                             <p className="mb-1 font-18">Room details</p>
//                                             <div className="room-specs d-flex gap-3 mb-2">
//                                                 <span className="spec-item d-flex gap-2">
//                                                     <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps {booking?.rooms[0]?.max_guests}
//                                                 </span> |
//                                                 <span className="spec-item d-flex gap-2">
//                                                     <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" /> {booking?.rooms[0]?.beds?.length} bed
//                                                 </span> |
//                                                 <span className="spec-item d-flex gap-2">{booking.rooms[0].room_size_sqft} sq ft</span>
//                                             </div>

//                                             {/* Preference / gender lock badges */}
//                                             <div className="mt-2">
//                                                 {booking?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && (
//                                                     <p className='female-preferred'>Female PREFERRED</p>
//                                                 )}
//                                                 {booking?.rooms?.[0]?.bedroom_preference_badge === "MALE PREFERRED" && (
//                                                     <span className='male-preferred'>Male PREFERRED</span>
//                                                 )}
//                                                 {booking?.rooms?.[0]?.gender_lock && booking?.rooms?.[0]?.room_type === "Twin-Sharing" && (
//                                                     <>
//                                                         {booking.rooms[0].gender_lock?.badge_text === "MALE BOOKED" && <span className='status-tag male-booked'>Male Booked</span>}
//                                                         {booking.rooms[0].gender_lock?.badge_text === "FEMALE BOOKED" && <span className='status-tag female-booked'>Female Booked</span>}
//                                                     </>
//                                                 )}
//                                                 {booking.rooms[0]?.room_type !== "Private" && (
//                                                     <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>
//                                                         {booking.rooms[0]?.available_beds?.length > 0
//                                                             ? `${booking.rooms[0].available_beds.length} BED LEFT!`
//                                                             : "NO BED LEFT!"}
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             <hr />

//                                             {/* Traveler section */}
//                                             <div className="traveler-section">
//                                                 <p className="mb-2 font-18">Travelers in this room</p>

//                                                 {/* Adult count radio buttons */}
//                                                 <div className="d-flex gap-3 mb-3">
//                                                     {Array.from(
//                                                         { length: booking?.adultCount > 2 ? booking?.adultCount : 2 },
//                                                         (_, idx) => {
//                                                             const count = idx + 1;
//                                                             const isDisabled = booking.rooms[0].room_type === "Private" && count > 1;
//                                                             return (
//                                                                 <div key={count} className="radio-select-box d-flex gap-2"
//                                                                     style={{ background: "#F2F2F2", opacity: isDisabled ? 0.4 : 1 }}>
//                                                                     <label className="form-check-label d-flex gap-2 mb-0">
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`adult-count-${bookingIndex}`}
//                                                                             checked={booking?.adultCount === count}
//                                                                             disabled={isDisabled}
//                                                                             onChange={() => {
//                                                                                 // FIX: always update bookingData regardless of index
//                                                                                 const updated = { ...booking, adultCount: count };
//                                                                                 setBookingData([updated]);
//                                                                                 calculateTax(
//                                                                                     updated?.rooms?.[0]?.price_per_night,
//                                                                                     updated?.check_in_datetime,
//                                                                                     updated?.check_out_datetime
//                                                                                 );
//                                                                                 setTravellers(
//                                                                                     Array.from({ length: count }, () => ({
//                                                                                         traveller_type: null,
//                                                                                         isGenderValidation: "",
//                                                                                         caretaker: null,
//                                                                                         searchText: "",
//                                                                                         showList: false,
//                                                                                         filteredUsers: [],
//                                                                                         selectedBedIndex: null
//                                                                                     }))
//                                                                                 );
//                                                                             }}
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

//                                                 {/* Exclusive booking — only for shared rooms */}
//                                                 {booking?.rooms[0]?.can_book_exclusive && booking.rooms[0].room_type !== "Private" && (
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

//                                                 {/* Bedroom preference banners */}
//                                                 {booking?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                 As this room has already been booked for a female for your selected dates, only female traveler bookings are allowed
//                                                             </p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}
//                                                 {booking?.rooms?.[0]?.bedroom_preference_badge === "MALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                 As this room has already been booked for a male for your selected dates, only male traveler bookings are allowed
//                                                             </p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}

//                                                 {/* ── PRIVATE ROOM TRAVELLER ── */}
//                                                 {booking.rooms[0].room_type === "Private" ? (
//                                                     <div className='property-list-2'>
//                                                         <div className="row">
//                                                             <div className="col-md-4">
//                                                                 <Select
//                                                                     name="traveller_type"
//                                                                     options={travelOption}
//                                                                     placeholder="Choose Role"
//                                                                     className='react_selectbox'
//                                                                     isSearchable={false}
//                                                                     styles={customStyles}
//                                                                     onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                                     components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                 />
//                                                             </div>

//                                                             <div className="col-md-8">
//                                                                 {!formData.caretakers && (
//                                                                     <div className="form-group" style={{ position: "relative" }}>
//                                                                         <input
//                                                                             type="text"
//                                                                             className="form-control user-icn2"
//                                                                             placeholder="Add a traveler"
//                                                                             // FIX: show dropdown on focus (boolean state)
//                                                                             onFocus={() => setShowCaretakerList(true)}
//                                                                             onBlur={() => setTimeout(() => setShowCaretakerList(false), 200)}
//                                                                             onChange={(e) => setSearch(e.target.value)}
//                                                                         />
//                                                                         {/* FIX: showCaretakerList is now boolean, coercion works correctly */}
//                                                                         {showCaretakerList && (
//                                                                             <div style={{
//                                                                                 position: "absolute", top: "58px", left: 0, right: 0,
//                                                                                 background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                 zIndex: 10, padding: "16px", maxHeight: "300px", overflowY: "auto"
//                                                                             }}>
//                                                                                 {filtereduserListData?.length > 0 ? (
//                                                                                     <>
//                                                                                         {filtereduserListData.map((user, idx) => (
//                                                                                             <div key={user.value} className="managers-data"
//                                                                                                 style={{
//                                                                                                     display: "flex", alignItems: "center",
//                                                                                                     marginBottom: "18px",
//                                                                                                     borderBottom: idx < filtereduserListData.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                     paddingBottom: "15px", cursor: "pointer"
//                                                                                                 }}
//                                                                                                 onMouseDown={(e) => e.preventDefault()}
//                                                                                                 onClick={() => handleCaretakerSelect("", user.value)}
//                                                                                             >
//                                                                                                 <Image
//                                                                                                     src={user?.icon ? user?.icon : user?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                                     alt={user?.label}
//                                                                                                     width={48} height={48}
//                                                                                                     style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                                 />
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
//                                                                                         <Link href="/People" style={{ background: "#6B4F3F", color: "white", padding: "10px 20px", width: "100%", display: "block", textAlign: "center", textDecoration: "none" }}>
//                                                                                             Invite to Join
//                                                                                         </Link>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 )}
//                                                             </div>

//                                                             {/* Selected private room traveller card */}
//                                                             <div className="col-md-12">
//                                                                 {formData.caretakers && userListData.filter(u => u.uid === formData.caretakers).map((item, i) => (
//                                                                     <div key={i} className="selected-caretaker-container">
//                                                                         <div className="manager-list-full" style={{
//                                                                             display: "flex", alignItems: "center",
//                                                                             border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                             padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                         }}>
//                                                                             <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                 <Image
//                                                                                     src={item?.profile_image ? item?.profile_image : item?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                     alt={item?.first_name}
//                                                                                     width={48} height={48}
//                                                                                     style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                 />
//                                                                                 <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                     {item?.first_name} {item?.last_name}
//                                                                                     <br />
//                                                                                     {formData.traveller_type !== "External" && (
//                                                                                         <>
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                 Emp. id: {item?.employee_id}
//                                                                                             </span>
//                                                                                             <br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                 Dept: {item?.segment}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                         </>
//                                                                                     )}
//                                                                                     {formData.caretakerGenderValid === true && (
//                                                                                         <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>
//                                                                                     )}
//                                                                                     {formData.caretakerGenderValid === false && (
//                                                                                         <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>
//                                                                                     )}
//                                                                                 </span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                     {item?.phone_number}
//                                                                                 </span>
//                                                                                 <span style={{ color: "#73615F" }}>|</span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                     {item?.email}
//                                                                                 </span>
//                                                                                 <span style={{ color: "#73615F" }}>|</span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
//                                                                                     {item?.gender}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="show-edit-btn">
//                                                                                 <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                     onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
//                                                                                     Edit details
//                                                                                 </Button>
//                                                                                 <button type="button" className="ms-auto"
//                                                                                     onClick={() => setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }))}
//                                                                                     style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
//                                                                                     <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                 </button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     /* ── TWIN-SHARING TRAVELLER ROWS ── */
//                                                     travellers.map((row, rowIndex) => (
//                                                         <div key={rowIndex} className="property-list-2">
//                                                             <div className="row mt-3 mb-3">

//                                                                 <div className="col-md-4">
//                                                                     <Select
//                                                                         options={travelOption}
//                                                                         placeholder="Choose Role"
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         onChange={(e) => handleTravellerTypeChange(rowIndex, e.value)}
//                                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                     />
//                                                                 </div>

//                                                                 <div className="col-md-3">
//                                                                     <Select
//                                                                         options={chooseBeds.filter(bed =>
//                                                                             !travellers.some((t, i) => i !== rowIndex && t.selectedBedIndex === bed.value)
//                                                                         )}
//                                                                         placeholder="Choose Bed"
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         value={chooseBeds.find(b => b.value === row?.selectedBedIndex) || null}
//                                                                         onChange={(e) => {
//                                                                             const value = e.value;
//                                                                             setTravellers(prev =>
//                                                                                 prev.map((item, i) =>
//                                                                                     i === rowIndex ? { ...item, selectedBedIndex: value } : item
//                                                                                 )
//                                                                             );
//                                                                         }}
//                                                                     />
//                                                                 </div>

//                                                                 <div className="col-md-5">
//                                                                     <div className="form-group" style={{ position: "relative" }}>
//                                                                         <input
//                                                                             type="text"
//                                                                             className={`form-control${row.isGenderValidation === "Error" ? " border-danger" : row.isGenderValidation === "Success" ? " border-success" : ""}`}
//                                                                             placeholder="Add a traveler"
//                                                                             value={row.searchText}
//                                                                             onFocus={() => {
//                                                                                 // Open dropdown and fetch immediately (no debounce on focus)
//                                                                                 setTravellers(prev =>
//                                                                                     prev.map((item, i) =>
//                                                                                         i === rowIndex ? { ...item, showList: true } : item
//                                                                                     )
//                                                                                 );
//                                                                                 fetchUsersForRow(rowIndex, row.searchText, row.traveller_type);
//                                                                             }}
//                                                                             onChange={(e) => {
//                                                                                 const val = e.target.value;
//                                                                                 // 1. Update input text immediately (responsive typing)
//                                                                                 setTravellers(prev =>
//                                                                                     prev.map((item, i) =>
//                                                                                         i === rowIndex
//                                                                                             ? { ...item, searchText: val, showList: true }
//                                                                                             : item
//                                                                                     )
//                                                                                 );
//                                                                                 // 2. Debounced API call — fires 350ms after user stops typing
//                                                                                 debouncedFetchUsersForRow(rowIndex, val, row.traveller_type);
//                                                                             }}
//                                                                             onBlur={() => {
//                                                                                 setTimeout(() => {
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) =>
//                                                                                             i === rowIndex ? { ...item, showList: false } : item
//                                                                                         )
//                                                                                     );
//                                                                                 }, 200);
//                                                                             }}
//                                                                         />

//                                                                         {row.showList && (
//                                                                             <div style={{
//                                                                                 position: "absolute", top: "58px", left: 0, right: 0,
//                                                                                 background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                 zIndex: 10, padding: "16px", maxHeight: "300px", overflowY: "auto"
//                                                                             }}>
//                                                                                 {rowSearchLoading[rowIndex] ? (
//                                                                                     <div style={{ textAlign: "center", padding: "20px", color: "#73615F", fontSize: "14px" }}>
//                                                                                         Searching...
//                                                                                     </div>
//                                                                                 ) : row.filteredUsers?.length > 0 ? (
//                                                                                     <>
//                                                                                         {row.filteredUsers.map((user, idx) => (
//                                                                                             <div key={user.uid} className="managers-data"
//                                                                                                 style={{
//                                                                                                     display: "flex", alignItems: "center",
//                                                                                                     marginBottom: "18px",
//                                                                                                     borderBottom: idx < row.filteredUsers.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                     paddingBottom: "15px", cursor: "pointer"
//                                                                                                 }}
//                                                                                                 onMouseDown={(e) => e.preventDefault()}
//                                                                                                 onClick={() => handleCaretakerSelect(rowIndex, user.uid)}
//                                                                                             >
//                                                                                                 <Image
//                                                                                                     src={user?.profile_image ? user?.profile_image : user?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                                     alt={`${user.first_name} ${user.last_name}`}
//                                                                                                     width={48} height={48}
//                                                                                                     style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                                 />
//                                                                                                 <div>
//                                                                                                     <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                         {user.first_name} {user.last_name}
//                                                                                                     </div>
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
//                                                                                         <Link href="/People" style={{ background: "#6B4F3F", color: "white", padding: "10px 20px", width: "100%", display: "block", textAlign: "center", textDecoration: "none" }}>
//                                                                                             Invite to Join
//                                                                                         </Link>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>

//                                                                     {row.isGenderValidation === "Error" && (
//                                                                         <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
//                                                                             ✕ Gender validation failed — this traveler is not allowed in this room
//                                                                         </p>
//                                                                     )}
//                                                                     {row.isGenderValidation === "Success" && !row.caretaker && (
//                                                                         <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>✓ Gender validated</p>
//                                                                     )}
//                                                                 </div>

//                                                                 <div className="col-md-12">
//                                                                     {row.caretaker && (() => {
//                                                                         // Use cache → userListData → row.filteredUsers (in priority order)
//                                                                         const found = selectedUsersCache.current[row.caretaker]
//                                                                             || userListData.find(u => u.uid === row.caretaker)
//                                                                             || row.filteredUsers?.find(u => u.uid === row.caretaker);
//                                                                         if (!found) return null;
//                                                                         return (
//                                                                             <div className="selected-caretaker-container">
//                                                                                 <div className="manager-list-full" style={{
//                                                                                     display: "flex", alignItems: "center",
//                                                                                     border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                                     padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                                 }}>
//                                                                                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                         <Image
//                                                                                             src={found?.profile_image ? found?.profile_image : found.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                             alt={found?.first_name}
//                                                                                             width={48} height={48}
//                                                                                             style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                         />
//                                                                                         <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                             {found?.first_name} {found?.last_name}
//                                                                                             <br />
//                                                                                             {row?.traveller_type !== "External" && (
//                                                                                                 <>
//                                                                                                     <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                         Emp. id: {found?.employee_id}
//                                                                                                     </span>
//                                                                                                     <br />
//                                                                                                     <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                         Dept: {found?.segment}
//                                                                                                     </span>
//                                                                                                 </>
//                                                                                             )}

//                                                                                             {row.isGenderValidation === "Success" && (
//                                                                                                 <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>
//                                                                                             )}
//                                                                                             {row.isGenderValidation === "Error" && (
//                                                                                                 <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>
//                                                                                             )}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                             {found?.phone_number}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                             {found?.email}
//                                                                                         </span>
//                                                                                         <span style={{ color: "#73615F" }}>|</span>
//                                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                             <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
//                                                                                             {found?.gender}
//                                                                                         </span>
//                                                                                     </div>
//                                                                                     <div className="show-edit-btn">
//                                                                                         <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                             onClick={() => router.push(`/People?guest_uid=${found?.uid}&show=true`)}>
//                                                                                             Edit details
//                                                                                         </Button>
//                                                                                         <button type="button" className="ms-auto"
//                                                                                             onClick={() => handleCaretakerSelect(rowIndex, null)}
//                                                                                             style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
//                                                                                             <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         );
//                                                                     })()}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ))
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <p className='d-flex gap-2 fw-medium justify-content-end'>
//                                         Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
//                                     </p>

//                                     {/* ── Arrival Details ── */}
//                                     <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                         <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                         <p className="text-secondary mb-2">
//                                             This information helps in operational planning, legal compliance, and personalized service.
//                                         </p>
//                                         <Form.Group className='mb-4 mt-4' controlId="arrival_time">
//                                             <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
//                                             <Select
//                                                 onChange={(e) => updateArrivalDetails("arrival_time", e.value)}
//                                                 options={timeOption}
//                                                 placeholder="Select time"
//                                                 className="react_selectbox"
//                                                 isSearchable={false}
//                                                 styles={customStyles}
//                                             />
//                                         </Form.Group>
//                                         <Form.Group className='mb-4' controlId="mode_of_arrival">
//                                             <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
//                                             <Select
//                                                 options={arrivalOption}
//                                                 placeholder="Select Mode"
//                                                 className="react_selectbox"
//                                                 isSearchable={false}
//                                                 styles={customStyles}
//                                                 value={arrivalOption.find(opt => opt.value === formData.arrival_details.mode_of_arrival) || null}
//                                                 onChange={(e) => updateArrivalDetails("mode_of_arrival", e.value)}
//                                             />
//                                         </Form.Group>
//                                         <div className='mb-4 form-group'>
//                                             <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
//                                             <input type="text" className="form-control"
//                                                 placeholder="Enter number e.g. MADGAON LTT EXP #11100"
//                                                 value={formData.arrival_details.transport_number}
//                                                 onChange={(e) => updateArrivalDetails("transport_number", e.target.value)} />
//                                         </div>
//                                     </div>

//                                     <hr />

//                                     {/* ── Additional Comments ── */}
//                                     <div className="arrival-section mt-4 pt-4">
//                                         <h3 className="font-24 mb-2">Additional Comments</h3>
//                                         <div className='mb-5 form-group'>
//                                             <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
//                                             <input type="text"
//                                                 onChange={(e) => setFormData(prev => ({ ...prev, company_booking_reference: e.target.value }))}
//                                                 placeholder='Reference number to be entered for your internal purpose (optional)'
//                                                 className='form-control' />
//                                         </div>
//                                     </div>

//                                     <hr />

//                                     {/* ── Other Essential Details ── */}
//                                     <div className="arrival-section mt-4 pt-3 mb-5">
//                                         <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                         <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
//                                         <div className='mb-4 form-group'>
//                                             <textarea className='form-control'
//                                                 onChange={(e) => setFormData(prev => ({ ...prev, additional_comments: e.target.value }))}
//                                                 placeholder='Got any thoughts or questions? Add them here! (Optional)' />
//                                         </div>
//                                     </div>

//                                     <hr />

//                                     {/* ── Confirmation Email ── */}
//                                     <div className="confirmation-email-section my-5 pb-5">
//                                         <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3'
//                                             style={{ maxWidth: '360px', cursor: 'pointer' }}>
//                                             <Form.Check
//                                                 type="checkbox"
//                                                 label="Send copy of confirmation email"
//                                                 checked={formData.send_confirmation_email}
//                                                 onChange={(e) => {
//                                                     updateFormData("send_confirmation_email", e.target.checked);
//                                                     setIsEmailEnabled(e.target.checked);
//                                                     setReceivers(e.target.checked ? [{ id: 1, email: '' }] : []);
//                                                 }}
//                                             />
//                                         </label>

//                                         {isEmailEnabled && (
//                                             <div className="email-content">
//                                                 <p className='fw-bold mb-3' style={{ color: '#6B4F3F' }}>Add info</p>
//                                                 {receivers.map((receiver, idx) => (
//                                                     <div key={receiver.id} className="receiver-item">
//                                                         {idx > 0 && (
//                                                             <>
//                                                                 <hr className="my-4" />
//                                                                 <p className='fw-bold mb-3'>Receiver {idx + 1}</p>
//                                                             </>
//                                                         )}
//                                                         <div className='form-group mb-4'>
//                                                             <label className="form-label fw-medium">Email</label>
//                                                             <div className='row align-items-center'>
//                                                                 <div className='col-md-5'>
//                                                                     <input type='email'
//                                                                         className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
//                                                                         placeholder='Enter receiver email'
//                                                                         value={receiver.email}
//                                                                         onChange={(e) => handleEmailChange(receiver.id, e.target.value)} />
//                                                                     {receiver.email && !isValidEmail(receiver.email) && (
//                                                                         <div className="invalid-feedback d-block">Please enter a valid email address</div>
//                                                                     )}
//                                                                 </div>
//                                                                 <div className='col-md-1 d-flex align-items-center'>
//                                                                     {idx === 0 ? (
//                                                                         <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0"
//                                                                             disabled={receivers.length >= 5}>
//                                                                             <Image src='./images/icons/add_circle.svg' alt='Add' width={32} height={32}
//                                                                                 style={{ opacity: receivers.length >= 5 ? 0.5 : 1 }} />
//                                                                         </button>
//                                                                     ) : (
//                                                                         <button type="button" onClick={() => handleRemoveReceiver(receiver.id)} className="btn btn-link p-0">
//                                                                             <Image src='./images/icons/close-circle.svg' alt='Remove' width={32} height={32} />
//                                                                         </button>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                                 {receivers.length >= 5 && (
//                                                     <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </Col>

//                                 {/* ── Booking Summary ── */}
//                                 <Col md={4} className='ps-5'>
//                                     <div className='booking-summary-colum'>
//                                         <div className="d-flex align-items-center justify-between mb-4">
//                                             <h4 className='font-24 mb-0'>Booking Summary</h4>
//                                             <label className='mb-0 d-flex gap-2 align-items-center'>
//                                                 <input type="checkbox" className="mx-2 custom-checkbox"
//                                                     checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                                 Show prices
//                                             </label>
//                                         </div>
//                                         <div className="booking-summary">
//                                             <div className="summary-details">
//                                                 <div className="summary-row">
//                                                     <span className="summary-label">BRs Selected</span>
//                                                     <span className="summary-value">1</span>
//                                                 </div>
//                                                 <div className="summary-row">
//                                                     <span className="summary-label">Number of Rooms</span>
//                                                     <span className="summary-value">1 Room</span>
//                                                 </div>
//                                                 <div className="summary-row">
//                                                     <span className="summary-label">Travelers</span>
//                                                     <span className="summary-value">{booking?.adultCount || 1} Adult{(booking?.adultCount || 1) > 1 ? "s" : ""}</span>
//                                                 </div>
//                                                 <div className="summary-row detailed">
//                                                     <span className="summary-label">{booking.rooms[0].room_name} Pricing</span>
//                                                     <div className="summary-value-detailed">
//                                                         <div className="price-desc">
//                                                             {booking?.adultCount || 1} Guest x {Math.floor(calculateNights(booking.check_in_datetime, booking.check_out_datetime))} nights
//                                                         </div>
//                                                         {showPrices && <div className="price-amount">₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
//                                                         <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                                     </div>
//                                                 </div>
//                                                 <div className="summary-row detailed">
//                                                     <span className="summary-label">Taxes</span>
//                                                     <div className="summary-value-detailed">
//                                                         {showPrices && <div className="price-amount">₹{tax?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
//                                                         <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                                     </div>
//                                                 </div>
//                                                 <div className="total-section">
//                                                     <span className="total-label">Total Price</span>
//                                                     <div className="total-value-detailed">
//                                                         <div className="total-desc">
//                                                             {booking?.adultCount || 1} Guest x {Math.floor(calculateNights(booking.check_in_datetime, booking.check_out_datetime))} nights
//                                                         </div>
//                                                         {showPrices && <div className="total-amount">₹{total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
//                                                         <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <button
//                                                 onClick={handleSubmitReserve}
//                                                 className="confirm-btn"
//                                                 disabled={isSubmitting}
//                                                 style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
//                                             >
//                                                 {isSubmitting ? "Validating & Reserving..." : "Confirm and Reserve"}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </Col>
//                             </React.Fragment>
//                         ))}
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
//                                     <Select options={companyList} placeholder="Select company" className="react_selectbox"
//                                         isSearchable={false}
//                                         value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
//                                         onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.value })}
//                                         styles={customStyles} />
//                                 </div>
//                             </Col>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Where to?</label>
//                                     <Select options={cityList} placeholder="Select city" className="react_selectbox"
//                                         isSearchable={false}
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

//             {/* ── Add Person Modal ── */}
//             <AddPersonModel
//                 addTravels={addTravels}
//                 removeTravel={removeTravel}
//                 roleOption={role}
//                 companyList={companyList}
//                 addTravel={addTravel}
//             />

//             {/* ── Price Breakdown Modal ── */}
//             <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         <div className='d-flex justify-between pb-2'>
//                             <span>{breakdownText()}</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                         </div>
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>CasaMelhor Service fee</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹0</span>
//                         </div>
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>Taxes</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{tax?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between'>
//                     <span className='fs-20'>Total</span>
//                     <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>₹{total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                 </Modal.Footer>
//             </Modal>

//             {/* ── Booking Confirmed Modal ── */}
//             <Modal show={showReserveModal} onHide={removeReserve} animation={false} backdrop="static" centered className='custom-theme-modal-2 modal-460'>
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
//                     <Link href={`/BookingDetails/${bookingConfirmedData[0]?.booking_uid}`}
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
// import React, { useState, useEffect, useRef, useCallback } from 'react'
// import Header from '../Header/Header'
// import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { components } from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import { UserListAPI, validateGender, CreateBookingPost, companyListAPI, PropertyListFullApi, UserRoleListAPI, getCompanyPropertiesCitiesAPI } from '@/services/provider';
// import { calculateNights, convertTo24Hour, formatDateMonthYear, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
// import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
// import toast, { Toaster } from 'react-hot-toast';

// // ─── Arrival options (moved to module level — no need to recreate on every render) ──
// const arrivalOption = [
//     { value: "Flight", label: "Flight" },
//     { value: "Train", label: "Train" },
// ];

// export default function ReserveBooking() {

//     const router = useRouter();
//     const timeOption = generateTimeOptions12Format(30);

//     // ─── localStorage reads (done once — stable references) ──────────────────
//     const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"));

//     // ─── State ────────────────────────────────────────────────────────────────
//     const [userListData, setUserListData] = useState([]);
//     const [current, setCurrent] = useState(0);
//     const [bookingData, setBookingData] = useState(null);
//     const [filtereduserListData, setFilteredUserListData] = useState([]);
//     const [isExclusiveBooking, setIsExclusiveBooking] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [role, setRole] = useState([]);
//     const [search, setSearch] = useState('');
//     const [searchKey, setSearchKey] = useState("");
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const [lockedGender, setLockedGender] = useState(null);

//     // ─── Per-row search loading state for twin-sharing ────────────────────────
//     const [rowSearchLoading, setRowSearchLoading] = useState({});

//     // ─── Debounce timer refs — one per row index ──────────────────────────────
//     const rowSearchTimers = useRef({});

//     // ─── Cache of selected users by uid — so card renders even after list clears ─
//     const selectedUsersCache = useRef({});

//     // ─── Tax / price helpers ──────────────────────────────────────────────────
//     const [amount, setAmount] = useState(0);
//     const [tax, setTax] = useState(0);
//     const [total, setTotal] = useState(0);

//     const calculateTax = (pricePerNight, checkIn, checkOut) => {
//         const parsed = Number(pricePerNight);
//         if (!parsed || parsed < 0) { setTax(0); setTotal(0); setAmount(0); return; }

//         const nights = calculateNights(checkIn, checkOut);
//         const taxRate = parsed <= 7500 ? 0.05 : 0.18;
//         const roomTotal = parsed * nights;
//         const calcTax = roomTotal * taxRate;
//         setAmount(roomTotal);
//         setTax(calcTax);
//         setTotal(roomTotal + calcTax);
//     };

//     // FIX: breakdownText now uses live bookingData instead of stale bacisSearchDetails rooms
//     const breakdownText = () => {
//         const roomCount = 1;
//         const guestCount = bookingData?.[0]?.adultCount || 1;
//         const nights = calculateNights(
//             bookingData?.[0]?.check_in_datetime,
//             bookingData?.[0]?.check_out_datetime
//         );
//         return `${roomCount} room x ${guestCount} guest x ${nights} nights`;
//     };

//     // FIX: bedroomPreference derived from reactive bookingData state (not stale reserveBookingData)
//     const bedroomPreference = bookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;

//     // ─── formData ─────────────────────────────────────────────────────────────
//     const [formData, setFormData] = useState({
//         company_id: null,
//         caretakers: "",
//         caretakerGenderValid: null,
//         traveller_type: null,         // FIX: added to top-level formData (was missing)
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
//     const [showPrices, setShowPrices] = useState(false);
//     const [selectedAdult, setSelectedAdult] = useState(1);

//     // ─── Modal states ─────────────────────────────────────────────────────────
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

//     // ─── formData helpers ─────────────────────────────────────────────────────
//     const updateFormData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
//     const updateArrivalDetails = (key, value) => setFormData(prev => ({
//         ...prev,
//         arrival_details: { ...prev.arrival_details, [key]: key === "arrival_time" ? convertTo24Hour(value) : value }
//     }));

//     // ─── Role list ────────────────────────────────────────────────────────────
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
//             console.error("UserRoleListAPI error:", error);
//         }
//     };

//     // ─── Init bookingData + travellers from localStorage ─────────────────────
//     useEffect(() => {
//         if (reserveBookingData?.length > 0) {
//             setBookingData(reserveBookingData);
//             calculateTax(
//                 reserveBookingData[0]?.rooms?.[0]?.price_per_night,
//                 reserveBookingData[0]?.check_in_datetime,
//                 reserveBookingData[0]?.check_out_datetime
//             );
//             const count = reserveBookingData[0]?.adultCount || 1;
//             setSelectedAdult(count);
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
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // ─── chooseBeds derived from bookingData state (reactive) ─────────────────
//     const [chooseBeds, setChooseBeds] = useState([]);

//     useEffect(() => {
//         if (!bookingData) return;
//         const room = bookingData?.[0]?.rooms?.[0];
//         if (!room) return;

//         if (room.room_type === "Twin-Sharing") {
//             const availableBedIndices = room.available_beds || [];
//             const beds = room.beds
//                 ?.map((bed, index) => ({ label: bed.name, value: index }))
//                 .filter(bed => availableBedIndices.includes(bed.value));
//             setChooseBeds(beds || []);
//         } else {
//             setChooseBeds([]);
//         }
//     }, [bookingData]); // FIX: depends on bookingData state, not stale closure

//     // ─── Traveller type dropdown options ─────────────────────────────────────
//     const travelOption = [
//         { value: "Company Booking Manager", label: "Company employee", icon: "../images/icons/hail.svg" },
//         { value: "External", label: "External", icon: "../images/icons/short_stay.svg" },
//     ];

//     const CustomOption = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image
//                         src={props.data.icon
//                             ? props.data.icon
//                             : props.data.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                         alt={props.data.label}
//                         width={20} height={20}
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
//             backgroundColor: state.isSelected ? "#6B4F3F" : state.isFocused ? "#f0e8e3" : "transparent",
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

//     // FIX: CustomMenuList receives addTravel via selectProps to avoid stale closure
//     // const CustomMenuList = ({ children, selectProps }) => {
//     //     const { options } = selectProps;
//     //     const isEmpty = !options || options.length === 0;

//     //     return (
//     //         <div>
//     //             {isEmpty ? (
//     //                 <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//     //                     <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//     //                     <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px", color: "#463527" }}>
//     //                         No travelers found
//     //                     </div>
//     //                     <Link
//     //                         href="/People"
//     //                         style={{
//     //                             background: "#6B4F3F", color: "white",
//     //                             padding: "10px 20px", display: "block",
//     //                             textAlign: "center", textDecoration: "none",
//     //                         }}
//     //                     >
//     //                         Invite to Join
//     //                     </Link>
//     //                 </div>
//     //             ) : (
//     //                 <>
//     //                     {children}
//     //                     <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
//     //                         <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//     //                             {"Can't find someone?"}<br />
//     //                             <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>
//     //                                 Register a new traveler
//     //                             </Link>
//     //                         </div>
//     //                     </div>
//     //                 </>
//     //             )}
//     //         </div>
//     //     );
//     // };

//     // const CustomMenuList = (props) => {
//     //     const {
//     //         children,
//     //         innerRef,
//     //         innerProps,
//     //         selectProps
//     //     } = props;
//     //     const { options } = selectProps;
//     //     const isEmpty = !options || options.length === 0;

//     //     return (
//     //         <div
//     //             ref={innerRef}
//     //             {...innerProps}
//     //             style={{
//     //                 maxHeight: 200,
//     //                 overflowY: "auto"
//     //             }}
//     //         >
//     //             {/* {children} */}

//     //             {loading && (
//     //                 <div style={{ padding: 10 }}>
//     //                     Loading...
//     //                 </div>
//     //             )}

//     //             {!hasMore && (
//     //                 <div style={{ padding: 10 }}>
//     //                     No more companies
//     //                 </div>
//     //             )}

//     //             <div>
//     //                 {isEmpty ? (
//     //                     <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//     //                         <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//     //                         <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px", color: "#463527" }}>
//     //                             No travelers found
//     //                         </div>
//     //                         <Link
//     //                             href="/People"
//     //                             style={{
//     //                                 background: "#6B4F3F", color: "white",
//     //                                 padding: "10px 20px", display: "block",
//     //                                 textAlign: "center", textDecoration: "none",
//     //                             }}
//     //                         >
//     //                             Invite to Join
//     //                         </Link>
//     //                     </div>
//     //                 ) : (
//     //                     <>
//     //                         {children}
//     //                         <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
//     //                             <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//     //                                 {"Can't find someone?"}<br />
//     //                                 <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>
//     //                                     Register a new traveler
//     //                                 </Link>
//     //                             </div>
//     //                         </div>
//     //                     </>
//     //                 )}
//     //             </div>
//     //         </div>
//     //     );
//     // };
//     const CustomMenuList = (props) => {
//         const { children, innerRef, innerProps, selectProps } = props;
//         const { options } = selectProps;
//         const isEmpty = !options || options.length === 0;

//         return (
//             <div
//                 ref={innerRef}
//                 {...innerProps}
//                 style={{
//                     maxHeight: 200,
//                     overflowY: "auto",
//                     scrollBehavior: "smooth",          // ✅ smooth scroll
//                     WebkitOverflowScrolling: "touch",  // ✅ smooth on iOS
//                 }}
//             >
//                 {isEmpty ? (
//                     <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                         <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                         <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px", color: "#463527" }}>
//                             No travelers found
//                         </div>
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
//                                 <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>
//                                     Register a new traveler
//                                 </Link>
//                             </div>
//                         </div>
//                     </>
//                 )}

//                 {loading && (
//                     <div style={{ padding: "8px 10px", fontSize: "13px", color: "#73615F", textAlign: "center" }}>
//                         Loading...
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     // ─── handleSelectDropdown for Private room ────────────────────────────────
//     const handleSelectDropdown = (e, name) => {
//         if (name === "traveller_type") {
//             setFormData(prev => ({ ...prev, traveller_type: e.value }));
//         }
//     };

//     // ─── handleCaretakerSelect ────────────────────────────────────────────────
//     const handleCaretakerSelect = async (rowIndex, userId) => {
//         // ── Private room ──
//         if (rowIndex === "") {
//             if (!userId) {
//                 setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }));
//                 setShowCaretakerList(false);
//                 return;
//             }

//             setFormData(prev => ({ ...prev, caretakers: userId, caretakerGenderValid: null }));
//             setShowCaretakerList(false);

//             try {
//                 const payload = {
//                     room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
//                     traveler_uid: userId,
//                     check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                     check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
//                     bed_index: 0,
//                 };
//                 const response = await validateGender(payload);
//                 const isValid = response?.data?.response?.valid;
//                 setFormData(prev => ({ ...prev, caretakerGenderValid: isValid }));
//                 if (isValid) {
//                     toast.success("Gender validated successfully");
//                 } else {
//                     toast.error("Gender validation failed — this traveler is not allowed in this room");
//                 }
//             } catch (error) {
//                 console.error("Gender validation error:", error);
//                 toast.error("Failed to validate gender");
//             }
//             return;
//         }

//         // ── Twin-Sharing row: cleared ──
//         // FIX: check for falsy (null, undefined, "") consistently
//         // if (!userId) {
//         //     setTravellers(prev =>
//         //         prev.map((item, i) =>
//         //             i === rowIndex
//         //                 ? { ...item, caretaker: null, searchText: "", isGenderValidation: "" }
//         //                 : item
//         //         )
//         //     );
//         //     return;
//         // }
//         if (!userId) {
//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex
//                         ? { ...item, caretaker: null, searchText: "", isGenderValidation: "" }
//                         : item
//                 )
//             );

//             // Check if anyone else is still selected — if not, clear the gender lock
//             const othersRemaining = travellers.filter((t, i) => i !== rowIndex && t.caretaker);
//             if (othersRemaining.length === 0) {
//                 setLockedGender(null);
//             } else {
//                 const firstUser = selectedUsersCache.current[othersRemaining[0].caretaker];
//                 if (firstUser?.gender) setLockedGender(firstUser.gender);
//             }

//             return;
//         }

//         // ── Twin-Sharing row: selected ──
//         // Look up from userListData first, then from row's filteredUsers, then cache it
//         const user = userListData.find(u => u.uid === userId)
//             || travellers[rowIndex]?.filteredUsers?.find(u => u.uid === userId);

//         // Cache so the selected card can render even after filteredUsers is cleared
//         if (user) selectedUsersCache.current[userId] = user;

//         // Gender lock check — block before API call
//         if (lockedGender && user?.gender && user.gender !== lockedGender) {
//             toast.error(
//                 `This room is locked to ${lockedGender} travelers. Please select a ${lockedGender} traveler.`
//             );
//             return;
//         }

//         setTravellers(prev =>
//             prev.map((item, i) =>
//                 i === rowIndex
//                     ? {
//                         ...item,
//                         caretaker: userId,
//                         searchText: user ? `${user.first_name} ${user.last_name}` : "",
//                         showList: false,
//                         filteredUsers: [],        // clear dropdown after selection
//                         isGenderValidation: "Validating",
//                     }
//                     : item
//             )
//         );

//         try {
//             const payload = {
//                 room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
//                 traveler_uid: userId,
//                 check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                 check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
//                 bed_index: rowIndex,
//             };
//             const response = await validateGender(payload);
//             const isValid = response?.data?.response?.valid;

//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex
//                         ? { ...item, isGenderValidation: isValid ? "Success" : "Error" }
//                         : item
//                 )
//             );
//             if (isValid) {
//                 if (lockedGender === null && user?.gender) {
//                     setLockedGender(user.gender);
//                 }
//                 toast.success(`Traveler ${rowIndex + 1}: Gender validated successfully`);
//             } else {
//                 toast.error(`Traveler ${rowIndex + 1}: Gender validation failed — not allowed in this room`);
//             }
//         } catch (error) {
//             console.error("Gender validation error:", error);
//             toast.error(`Traveler ${rowIndex + 1}: Failed to validate gender`);
//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex ? { ...item, isGenderValidation: "" } : item
//                 )
//             );
//         }
//     };

//     // ─── handleTravellerTypeChange for Twin-Sharing rows ─────────────────────
//     // const handleTravellerTypeChange = (rowIndex, selected) => {
//     //     // Update traveller_type immediately, then fetch from API
//     //     setTravellers(prev => {
//     //         const updated = [...prev];
//     //         if (!updated[rowIndex]) return prev;
//     //         updated[rowIndex] = { ...updated[rowIndex], traveller_type: selected, filteredUsers: [] };
//     //         return updated;
//     //     });
//     //     // Fetch fresh results from API with current searchText and new role (immediate, no debounce on role change)
//     //     const currentSearchText = travellers[rowIndex]?.searchText || '';
//     //     fetchUsersForRow(rowIndex, currentSearchText, selected);
//     // };

//     const handleTravellerTypeChange = (rowIndex, selected) => {
//         setTravellers(prev => {
//             const updated = [...prev];
//             if (!updated[rowIndex]) return prev;
//             updated[rowIndex] = {
//                 ...updated[rowIndex],
//                 traveller_type: selected,
//                 filteredUsers: [],
//                 page: 1,
//                 hasMore: true,
//             };
//             return updated;
//         });
//         const currentSearchText = travellers[rowIndex]?.searchText || '';
//         fetchUsersForRow(rowIndex, currentSearchText, selected, 1);
//     };

//     // ─── Caretaker dropdown visibility ───────────────────────────────────────
//     // FIX: initialized to false (not null) so boolean coercion works correctly
//     const [showCaretakerList, setShowCaretakerList] = useState(false);

//     // ─── Fetch users for Private room (search state drives this) ─────────────
//     // const getUserListData = async (searchTerm = '', pageNext) => {
//     //     try {
//     //         const response = await UserListAPI("All", '', searchTerm, '', '', '', '', '', '', pageNext);
//     //         if (response?.data?.success) {
//     //             // setUserListData(response.data.response);
//     //             const newData =
//     //                 response.data.response || [];

//     //             setUserListData(prev =>
//     //                 pageNext === 1
//     //                     ? newData
//     //                     : [...prev, ...newData]
//     //             );
//     //         }
//     //     } catch (error) { console.log(error); }
//     // };
//     const getUserListData = async (searchTerm = '', pageNext = 1) => {
//         try {
//             setLoading(true);
//             const user_company = formData.traveller_type === "External" ? "" : searchFieldData.company_name;
//             const response = await UserListAPI("All", '', searchTerm, '', '', '', '', '', user_company, pageNext);
//             if (response?.data?.success) {
//                 const newData = response.data.response || [];
//                 // If returned data is empty, no more pages
//                 setHasMore(newData.length > 0);
//                 setUserListData(prev =>
//                     pageNext === 1 ? newData : [...prev, ...newData]
//                 );
//             }
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ─── Fetch users for a specific Twin-Sharing row, then filter & update ────
//     // const fetchUsersForRow = async (rowIndex, searchTerm, travellerType) => {
//     //     setRowSearchLoading(prev => ({ ...prev, [rowIndex]: true }));
//     //     try {
//     //         const response = await UserListAPI("All", '', searchTerm);
//     //         if (response?.data?.success) {
//     //             let base = response.data.response.filter(user => {
//     //                 const rn = user?.user_role?.role_name;
//     //                 if (travellerType === "External") return rn === "External";
//     //                 return rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//     //             });
//     //             // Apply gender preference filter
//     //             const pref = bookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;
//     //             if (pref === "FEMALE PREFERRED") base = base.filter(u => u.gender === "Female");
//     //             if (pref === "MALE PREFERRED") base = base.filter(u => u.gender === "Male");

//     //             setTravellers(prev =>
//     //                 prev.map((item, i) =>
//     //                     i === rowIndex ? { ...item, filteredUsers: base } : item
//     //                 )
//     //             );
//     //         }
//     //     } catch (error) {
//     //         console.log("fetchUsersForRow error:", error);
//     //     } finally {
//     //         setRowSearchLoading(prev => ({ ...prev, [rowIndex]: false }));
//     //     }
//     // };
//     const fetchUsersForRow = async (rowIndex, searchTerm, travellerType, pageNum = 1) => {
//         // Prevent duplicate calls if already loading or no more data
//         const row = travellers[rowIndex];
//         if (pageNum > 1 && !row?.hasMore) return;

//         setRowSearchLoading(prev => ({ ...prev, [rowIndex]: true }));
//         try {
//             const category = travellerType === "External" ? "" : searchFieldData.company_name
//             const response = await UserListAPI("All", '', searchTerm, '', '', '', '', '', category, pageNum);
//             if (response?.data?.success) {
//                 let base = (response.data.response || []).filter(user => {
//                     // const rn = user?.user_role?.role_name;
//                     // let allowed = false;
//                     // if (travellerType === "External") {
//                     //     allowed = rn === "External";
//                     // } else {
//                     //     allowed = rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                     // }
//                     // if (!allowed) return false;
//                     const pref = bookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;
//                     if (pref === "FEMALE PREFERRED") return user.gender === "Female";
//                     if (pref === "MALE PREFERRED") return user.gender === "Male";
//                     return true;
//                 });

//                 const hasMoreData = (response.data.response || []).length > 0;

//                 setTravellers(prev =>
//                     prev.map((item, i) =>
//                         i === rowIndex
//                             ? {
//                                 ...item,
//                                 filteredUsers: pageNum === 1 ? base : [...item.filteredUsers, ...base],
//                                 page: pageNum,
//                                 hasMore: hasMoreData,
//                             }
//                             : item
//                     )
//                 );
//             }
//         } catch (error) {
//             console.log("fetchUsersForRow error:", error);
//         } finally {
//             setRowSearchLoading(prev => ({ ...prev, [rowIndex]: false }));
//         }
//     };

//     // ─── Debounced version — 350ms delay to avoid API call on every keystroke ─
//     // const debouncedFetchUsersForRow = (rowIndex, searchTerm, travellerType) => {
//     //     if (rowSearchTimers.current[rowIndex]) {
//     //         clearTimeout(rowSearchTimers.current[rowIndex]);
//     //     }
//     //     rowSearchTimers.current[rowIndex] = setTimeout(() => {
//     //         fetchUsersForRow(rowIndex, searchTerm, travellerType);
//     //     }, 350);
//     // };
//     const debouncedFetchUsersForRow = (rowIndex, searchTerm, travellerType) => {
//         if (rowSearchTimers.current[rowIndex]) {
//             clearTimeout(rowSearchTimers.current[rowIndex]);
//         }
//         rowSearchTimers.current[rowIndex] = setTimeout(() => {
//             // Reset page to 1 on new search term
//             setTravellers(prev =>
//                 prev.map((item, i) =>
//                     i === rowIndex ? { ...item, page: 1, hasMore: true, filteredUsers: [] } : item
//                 )
//             );
//             fetchUsersForRow(rowIndex, searchTerm, travellerType, 1);
//         }, 350);
//     };

//     // Private room search: re-fetch whenever `search` changes (empty string on mount = initial load)
//     // useEffect(() => {
//     //     getUserListData(search);
//     // }, [search]); // eslint-disable-line react-hooks/exhaustive-deps
//     // Replace the existing search useEffect
//     useEffect(() => {
//         setPage(1);
//         setHasMore(true);
//         setUserListData([]);
//         getUserListData(search, 1);
//     }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

//     // ─── Filter users for Private room dropdown ───────────────────────────────
//     useEffect(() => {
//         if (!formData?.traveller_type) { setFilteredUserListData([]); return; }

//         const filtered = userListData
//             ?.filter(user => {
//                 const roleName = user.user_role?.role_name;
//                 let allowed = false;
//                 if (formData.traveller_type === "External") {
//                     allowed = roleName === "External";
//                 } else {
//                     allowed = roleName !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
//                 }
//                 if (!allowed) return false;
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

//         setFilteredUserListData(filtered || []);
//     }, [formData.traveller_type, userListData, bedroomPreference]);

//     // ─── Date helpers ─────────────────────────────────────────────────────────
//     const getDateOnly = (dateTime) => dateTime?.split("T")[0];

//     const formatDate = (dateTime) => new Date(dateTime).toLocaleDateString("en-IN", {
//         weekday: "short", day: "numeric", month: "short", year: "numeric"
//     });

//     const formatTime = (dateTime) => new Date(dateTime).toLocaleTimeString("en-IN", {
//         hour: "2-digit", minute: "2-digit", hour12: true
//     });

//     const formatStayDates = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);
//         const opts = { weekday: "short", day: "numeric", month: "short" };
//         const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
//         return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}, ${end.getFullYear()}, ${nights} night${nights > 1 ? "s" : ""}`;
//     };
//     const countNights = (fromDate, toDate) => {
//         const start = new Date(fromDate);
//         const end = new Date(toDate);
//         const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
//         return nights;
//     }

//     const formatRoomsAndGuests = (rooms = []) => {
//         const rc = rooms.length;
//         const gc = rooms.reduce((sum, r) => sum + (r.adults || 0), 0);
//         return `${rc} room${rc > 1 ? "s" : ""} for ${gc} guest${gc > 1 ? "s" : ""}`;
//     };

//     // ─── Pre-submit gender validation for ALL Twin-Sharing travellers ─────────
//     const validateAllTravellersGender = async () => {
//         let allValid = true;
//         for (let i = 0; i < travellers.length; i++) {
//             const traveller = travellers[i];
//             if (!traveller.caretaker) {
//                 toast.error(`Traveler ${i + 1}: No traveler selected`);
//                 allValid = false;
//                 continue;
//             }
//             try {
//                 const payload = {
//                     room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
//                     traveler_uid: traveller.caretaker,
//                     check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                     check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
//                     bed_index: i,
//                 };
//                 const response = await validateGender(payload);
//                 const isValid = response?.data?.response?.valid;

//                 setTravellers(prev =>
//                     prev.map((item, idx) =>
//                         idx === i ? { ...item, isGenderValidation: isValid ? "Success" : "Error" } : item
//                     )
//                 );

//                 if (!isValid) {
//                     toast.error(`Traveler ${i + 1}: Gender validation failed — booking blocked`);
//                     allValid = false;
//                 }
//             } catch {
//                 toast.error(`Traveler ${i + 1}: Gender validation error`);
//                 allValid = false;
//             }
//         }
//         return allValid;
//     };

//     // ─── Edit Stay Details state ──────────────────────────────────────────────
//     const [searchFieldData, setSearchFieldData] = useState({
//         company_id: 0, city: "", check_in_date: "", check_out_date: "", rooms: [], is_available: true, company_name: '', c_uid: ""
//     });
//     const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
//     const [companyList, setCompanyList] = useState([]);
//     const [cityList, setCityList] = useState([]);

//     const handleAdultChange = (roomId, change) => {
//         setRooms(rooms.map(room => {
//             if (room.id === roomId) {
//                 const nv = room.adults + change;
//                 return { ...room, adults: nv >= 1 ? nv : 1 };
//             }
//             return room;
//         }));
//     };
//     const addRoom = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
//     const deleteRoom = (roomId) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== roomId)); };

//     // const getProprtyList = async () => {
//     //     try {
//     //         const response = await PropertyListFullApi();
//     //         if (response?.data?.success) {
//     //             const uniqueCities = [
//     //                 { city: "Jaipur" },
//     //                 ...Array.from(
//     //                     new Set(response.data.response.map(ele => ele.city)),
//     //                     city => ({ city })
//     //                 ).filter(item => item.city !== "Jaipur")
//     //             ];
//     //             setCityList(uniqueCities);
//     //         }
//     //     } catch (error) { console.log(error); }
//     // };

//     const getLocationOfProperty = async (id) => {
//         try {
//             const response = await getCompanyPropertiesCitiesAPI(id);
//             if (response?.success) {
//                 setCityList(response?.response?.cities.map(cv => ({ value: cv, label: cv })))
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 setCompanyList(response.data.response?.filter(item => !item?.is_company_inactive)?.map(item => ({ value: item.id, label: item.company_name, uid: item.uid })));
//             }
//         } catch (error) { console.log(error); }
//     };

//     useEffect(() => {
//         getCompanyList();
//         // getProprtyList();
//         getUserListDataAPI();
//         if (bacisSearchDetails) {
//             setSearchFieldData({
//                 company_id: bacisSearchDetails.company_id,
//                 city: bacisSearchDetails.city,
//                 check_in_date: bacisSearchDetails.check_in_date,
//                 check_out_date: bacisSearchDetails.check_out_date,
//                 is_available: bacisSearchDetails.is_available,
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults })),
//                 company_name: bacisSearchDetails.company_name,
//                 c_uid: bacisSearchDetails.c_uid
//             });
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx + 1, adults: val.adults })));
//         }
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     useEffect(() => {
//         if (companyList.length === 1) {
//             setSearchFieldData({ ...searchFieldData, company_id: companyList?.[0].value, company_name: companyList?.[0]?.label, c_uid: companyList?.[0]?.uid })
//         }
//     }, [companyList]);

//     useEffect(() => {
//         if (searchFieldData.c_uid) {
//             getLocationOfProperty(searchFieldData.c_uid)
//         }
//     }, [searchFieldData.c_uid])

//     useEffect(() => {
//         getUserListData(search, 1)
//     }, [formData.traveller_type])

//     const handleUpdateSearch = () => {
//         removeItemLocalStorage("reserveRoom");
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
//         router.push("./Searchresult");
//     };

//     // ─── Email recipients ─────────────────────────────────────────────────────
//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([]);
//     const [bookingConfirmedData, setBookingConfirmedData] = useState([]);

//     const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
//     const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
//     const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
//     const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
//         const isPrivate = bookingData?.[0]?.rooms?.[0]?.room_type === "Private";

//         if (isPrivate) {
//             if (!formData.caretakers) {
//                 toast.error("Please select a traveler before confirming");
//                 return;
//             }
//             if (formData.caretakerGenderValid === false) {
//                 toast.error("Booking blocked: traveler did not pass gender validation");
//                 return;
//             }
//         } else {
//             const missingTraveller = travellers.some(row => !row.caretaker);
//             if (missingTraveller) {
//                 toast.error("Please select a traveler for every row before confirming");
//                 return;
//             }

//             // FIX: setIsSubmitting(true) BEFORE validateAllTravellersGender, then handle result
//             setIsSubmitting(true);
//             const allGenderValid = await validateAllTravellersGender();
//             if (!allGenderValid) {
//                 setIsSubmitting(false);
//                 toast.error("Booking blocked: one or more travelers failed gender validation");
//                 return;
//             }
//             // Keep isSubmitting=true and fall through to CreateBookingPost
//         }

//         // For private rooms we set submitting here; for shared it's already set above
//         if (isPrivate) setIsSubmitting(true);

//         try {
//             const cartItem = isPrivate
//                 ? [{
//                     property_uid: bookingData?.[0]?.property_uid,
//                     room_uid: bookingData?.[0]?.rooms?.[0]?.room_uid,
//                     bed_index: null,
//                     check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                     check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime)
//                 }]
//                 : travellers.map(t => ({
//                     property_uid: bookingData?.[0]?.property_uid,
//                     room_uid: bookingData?.[0]?.rooms?.[0]?.room_uid,
//                     bed_index: t.selectedBedIndex,
//                     check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                     check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime)
//                 }));

//             const travelerAssignments = isPrivate
//                 ? [{ cart_item_index: 0, traveler_id: formData.caretakers, is_exclusive_booking: isExclusiveBooking }]
//                 : travellers.map((row, index) => ({
//                     cart_item_index: index,
//                     traveler_id: row.caretaker,
//                     is_exclusive_booking: isExclusiveBooking
//                 }));

//             const payload = {
//                 company_id: searchBookingData?.company_id,
//                 cart_items: cartItem,
//                 traveler_assignments: travelerAssignments,
//                 arrival_details: {
//                     ...formData.arrival_details,
//                     arrival_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
//                 },
//                 additional_comments: formData.additional_comments,
//                 company_booking_reference: formData.company_booking_reference,
//                 send_confirmation_email: formData.send_confirmation_email,
//                 additional_email_recipients: receivers.map(r => r.email)
//             };

//             const response = await CreateBookingPost(cleanPayload(payload));
//             if (response.data.success) {
//                 setBookingConfirmedData(response.data.response.bookings);
//                 setShowReserveModal(true);
//                 toast.success("Booking Created Successfully");
//                 removeItemLocalStorage("reserveRoom");
//                 removeItemLocalStorage("searchParam");
//                 removeItemLocalStorage("basicSecrchItemObj");
//             } else {
//                 response.data.response.validation_errors.forEach(el => toast.error(el.error));
//             }
//         } catch (error) {
//             console.error("Submission error:", error);
//             toast.error("Failed to create booking");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

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

//                         {bookingData?.length > 0 && bookingData?.map((booking, bookingIndex) => (
//                             <React.Fragment key={bookingIndex}>
//                                 <Col md={8}>
//                                     <h4 className='font-24 mb-4'>Review Your Selected BRs (1)</h4>

//                                     <div className="booking-card border bg-white p-3 mb-4">
//                                         {/* Room image + title */}
//                                         <Row>
//                                             <Col md={4}>
//                                                 <Image
//                                                     src={booking?.cover_photo
//                                                         ? `https://alicedevapi.casamelhor.in${booking.cover_photo}`
//                                                         : `/images/icons/No-Image.svg`}
//                                                     alt="Room Image"
//                                                     width={300} height={200}
//                                                     className="img-fluid"
//                                                 />
//                                             </Col>
//                                             <Col md={8}>
//                                                 <p className="fw-semibold fs-20 mb-2 room-title">
//                                                     {countNights(booking.check_in_datetime, booking.check_out_datetime)} night stay in {booking.rooms[0].room_name}
//                                                     <span className='room-type-badge ms-2'>
//                                                         {booking.rooms[0].room_type === "Private" ? "Private Rooms" : "Shared Rooms"}
//                                                     </span>
//                                                 </p>
//                                                 <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                     <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} className="img-fluid" />
//                                                     {booking?.property_name}<br />{booking?.address}
//                                                 </p>
//                                             </Col>
//                                         </Row>

//                                         {/* Check-in / Check-out */}
//                                         <Row className="mt-3 mb-3">
//                                             <Col md={3}>
//                                                 <p className="mb-1 text-secondary small">Check-in:</p>
//                                                 <p className="fw-semibold mb-0">{formatDate(booking.check_in_datetime)}</p>
//                                                 <small>{formatTime(booking.check_in_datetime)}</small>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <p className="mb-1 text-secondary small">Check-out:</p>
//                                                 <p className="fw-semibold mb-0">{formatDate(booking.check_out_datetime)}</p>
//                                                 <small>{formatTime(booking.check_out_datetime)}</small>
//                                             </Col>
//                                         </Row>

//                                         {/* Room details */}
//                                         <div className="border-top pt-3">
//                                             <p className="mb-1 font-18">Room details</p>
//                                             <div className="room-specs d-flex gap-3 mb-2">
//                                                 <span className="spec-item d-flex gap-2">
//                                                     <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps {booking?.rooms[0]?.max_guests}
//                                                 </span> |
//                                                 <span className="spec-item d-flex gap-2">
//                                                     <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" /> {booking?.rooms[0]?.beds?.length} bed
//                                                 </span> |
//                                                 <span className="spec-item d-flex gap-2">{booking.rooms[0].room_size_sqft} sq ft</span>
//                                             </div>

//                                             {/* Preference / gender lock badges */}
//                                             <div className="mt-2">
//                                                 {booking?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && (
//                                                     <p className='female-preferred'>Female PREFERRED</p>
//                                                 )}
//                                                 {booking?.rooms?.[0]?.bedroom_preference_badge === "MALE PREFERRED" && (
//                                                     <span className='male-preferred'>Male PREFERRED</span>
//                                                 )}
//                                                 {booking?.rooms?.[0]?.gender_lock && booking?.rooms?.[0]?.room_type === "Twin-Sharing" && (
//                                                     <>
//                                                         {booking.rooms[0].gender_lock?.badge_text === "MALE BOOKED" && <span className='status-tag male-booked'>Male Booked</span>}
//                                                         {booking.rooms[0].gender_lock?.badge_text === "FEMALE BOOKED" && <span className='status-tag female-booked'>Female Booked</span>}
//                                                     </>
//                                                 )}
//                                                 {booking.rooms[0]?.room_type !== "Private" && (
//                                                     <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>
//                                                         {booking.rooms[0]?.available_beds?.length > 0
//                                                             ? `${booking.rooms[0].available_beds.length} BED LEFT!`
//                                                             : "NO BED LEFT!"}
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             <hr />

//                                             {/* Traveler section */}
//                                             <div className="traveler-section">
//                                                 <p className="mb-2 font-18">Travelers in this room</p>

//                                                 {/* Adult count radio buttons */}
//                                                 <div className="d-flex gap-3 mb-3">
//                                                     {Array.from(
//                                                         { length: booking?.adultCount > 2 ? booking?.adultCount : 2 },
//                                                         (_, idx) => {
//                                                             const count = idx + 1;
//                                                             const isDisabled = booking.rooms[0].room_type === "Private" && count > 1;
//                                                             return (
//                                                                 <div key={count} className="radio-select-box d-flex gap-2"
//                                                                     style={{ background: "#F2F2F2", opacity: isDisabled ? 0.4 : 1 }}>
//                                                                     <label className="form-check-label d-flex gap-2 mb-0">
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`adult-count-${bookingIndex}`}
//                                                                             checked={booking?.adultCount === count}
//                                                                             disabled={isDisabled}
//                                                                             onChange={() => {
//                                                                                 // FIX: always update bookingData regardless of index
//                                                                                 const updated = { ...booking, adultCount: count };
//                                                                                 setBookingData([updated]);
//                                                                                 calculateTax(
//                                                                                     updated?.rooms?.[0]?.price_per_night,
//                                                                                     updated?.check_in_datetime,
//                                                                                     updated?.check_out_datetime
//                                                                                 );
//                                                                                 setLockedGender(null);
//                                                                                 setTravellers(
//                                                                                     Array.from({ length: count }, () => ({
//                                                                                         traveller_type: null,
//                                                                                         isGenderValidation: "",
//                                                                                         caretaker: null,
//                                                                                         searchText: "",
//                                                                                         showList: false,
//                                                                                         filteredUsers: [],
//                                                                                         selectedBedIndex: null
//                                                                                     }))
//                                                                                 );
//                                                                             }}
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

//                                                 {/* Exclusive booking — only for shared rooms */}
//                                                 {booking?.rooms[0]?.can_book_exclusive && booking.rooms[0].room_type !== "Private" && (
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

//                                                 {/* Bedroom preference banners */}
//                                                 {booking?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                 As this room has already been booked for a female for your selected dates, only female traveler bookings are allowed
//                                                             </p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}
//                                                 {booking?.rooms?.[0]?.bedroom_preference_badge === "MALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
//                                                                 As this room has already been booked for a male for your selected dates, only male traveler bookings are allowed
//                                                             </p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}

//                                                 {/* ── PRIVATE ROOM TRAVELLER ── */}
//                                                 {booking.rooms[0].room_type === "Private" ? (
//                                                     <div className='property-list-2'>
//                                                         <div className="row">
//                                                             <div className="col-md-4">
//                                                                 <Select
//                                                                     name="traveller_type"
//                                                                     options={travelOption}
//                                                                     placeholder="Choose Role"
//                                                                     className='react_selectbox'
//                                                                     isSearchable={false}
//                                                                     styles={customStyles}
//                                                                     onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                                     components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                 />
//                                                             </div>

//                                                             <div className="col-md-8">
//                                                                 {!formData.caretakers && (
//                                                                     <div className="form-group" style={{ position: "relative" }}>
//                                                                         {/* <input
//                                                                             type="text"
//                                                                             className="form-control user-icn2"
//                                                                             placeholder="Add a traveler"
//                                                                             // FIX: show dropdown on focus (boolean state)
//                                                                             onFocus={() => setShowCaretakerList(true)}
//                                                                             onBlur={() => setTimeout(() => setShowCaretakerList(false), 200)}
//                                                                             onChange={(e) => setSearch(e.target.value)}
//                                                                         /> */}
//                                                                         {/* <Select
//                                                                             options={filtereduserListData}
//                                                                             isSearchable
//                                                                             onMenuScrollToBottom={() => {
//                                                                                 console.log("SCROLLED");
//                                                                                 if (hasMore && !loading) {
//                                                                                     const nextPage = page + 1;
//                                                                                     setPage(nextPage);
//                                                                                     getUserListData(searchKey, nextPage)
//                                                                                 }
//                                                                             }}
//                                                                             onChange={(e) => handleCaretakerSelect("", e.value)}
//                                                                             components={{
//                                                                                 MenuList: CustomMenuList
//                                                                             }}
//                                                                             isLoading={loading}
//                                                                             placeholder="Add a traveler"
//                                                                         /> */}
//                                                                         <Select
//                                                                             options={filtereduserListData}
//                                                                             isDisabled={formData?.traveller_type ? false : true}
//                                                                             isSearchable
//                                                                             onInputChange={(val, { action }) => {
//                                                                                 if (action === "input-change") {
//                                                                                     setSearch(val);
//                                                                                     setSearchKey(val);
//                                                                                 }
//                                                                             }}
//                                                                             onMenuScrollToBottom={() => {
//                                                                                 if (hasMore && !loading) {
//                                                                                     const nextPage = page + 1;
//                                                                                     setPage(nextPage);
//                                                                                     getUserListData(searchKey, nextPage);
//                                                                                 }
//                                                                             }}
//                                                                             onChange={(e) => handleCaretakerSelect("", e.value)}
//                                                                             components={{ MenuList: CustomMenuList }}
//                                                                             isLoading={loading}
//                                                                             placeholder="Add a traveler"
//                                                                         />
//                                                                         {/* FIX: showCaretakerList is now boolean, coercion works correctly */}
//                                                                         {/* {showCaretakerList && (
//                                                                             <div style={{
//                                                                                 position: "absolute", top: "58px", left: 0, right: 0,
//                                                                                 background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                 zIndex: 10, padding: "16px", maxHeight: "300px", overflowY: "auto"
//                                                                             }}>
//                                                                                 {filtereduserListData?.length > 0 ? (
//                                                                                     <>
//                                                                                         {filtereduserListData.map((user, idx) => (
//                                                                                             <div key={user.value} className="managers-data"
//                                                                                                 style={{
//                                                                                                     display: "flex", alignItems: "center",
//                                                                                                     marginBottom: "18px",
//                                                                                                     borderBottom: idx < filtereduserListData.length - 1 ? "1px solid #ececec" : "none",
//                                                                                                     paddingBottom: "15px", cursor: "pointer"
//                                                                                                 }}
//                                                                                                 onMouseDown={(e) => e.preventDefault()}
//                                                                                                 onClick={() => handleCaretakerSelect("", user.value)}
//                                                                                             >
//                                                                                                 <Image
//                                                                                                     src={user?.icon ? user?.icon : user?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                                     alt={user?.label}
//                                                                                                     width={48} height={48}
//                                                                                                     style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                                 />
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
//                                                                                         <Link href="/People" style={{ background: "#6B4F3F", color: "white", padding: "10px 20px", width: "100%", display: "block", textAlign: "center", textDecoration: "none" }}>
//                                                                                             Invite to Join
//                                                                                         </Link>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         )} */}
//                                                                     </div>
//                                                                 )}
//                                                             </div>

//                                                             {/* Selected private room traveller card */}
//                                                             <div className="col-md-12">
//                                                                 {formData.caretakers && userListData.filter(u => u.uid === formData.caretakers).map((item, i) => (
//                                                                     <div key={i} className="selected-caretaker-container">
//                                                                         <div className="manager-list-full" style={{
//                                                                             display: "flex", alignItems: "center",
//                                                                             border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                             padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                         }}>
//                                                                             <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                 <Image
//                                                                                     src={item?.profile_image ? item?.profile_image : item?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
//                                                                                     alt={item?.first_name}
//                                                                                     width={48} height={48}
//                                                                                     style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                 />
//                                                                                 <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                     {item?.first_name} {item?.last_name}
//                                                                                     <br />
//                                                                                     {formData.traveller_type !== "External" && (
//                                                                                         <>
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                 Emp. id: {item?.employee_id}
//                                                                                             </span>
//                                                                                             <br />
//                                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                 Dept: {item?.segment}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                         </>
//                                                                                     )}
//                                                                                     {formData.caretakerGenderValid === true && (
//                                                                                         <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>
//                                                                                     )}
//                                                                                     {formData.caretakerGenderValid === false && (
//                                                                                         <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>
//                                                                                     )}
//                                                                                 </span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                     {item?.phone_number}
//                                                                                 </span>
//                                                                                 <span style={{ color: "#73615F" }}>|</span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                     {item?.email}
//                                                                                 </span>
//                                                                                 <span style={{ color: "#73615F" }}>|</span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
//                                                                                     {item?.gender}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="show-edit-btn">
//                                                                                 <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                     onClick={() => router.push(`/People?guest_uid=${item?.uid}&show=true`)}>
//                                                                                     Edit details
//                                                                                 </Button>
//                                                                                 <button type="button" className="ms-auto"
//                                                                                     onClick={() => setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }))}
//                                                                                     style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>
//                                                                                     <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                 </button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     /* ── TWIN-SHARING TRAVELLER ROWS ── */
//                                                     /* ── TWIN-SHARING TRAVELLER ROWS ── */
//                                                     travellers.map((row, rowIndex) => {
//                                                         // Per-row option list: combine filteredUsers + cached selected user
//                                                         const rowOptions = row.filteredUsers.map(user => ({
//                                                             value: user.uid,
//                                                             label: `${user.first_name} ${user.last_name}`,
//                                                             gender: user.gender,
//                                                             icon: user.profile_image,
//                                                             _raw: user,
//                                                         }));

//                                                         // Page tracking per row
//                                                         // (add `page: 1, hasMore: true` to each traveller object in setTravellers)
//                                                         const selectedOption = row.caretaker
//                                                             ? rowOptions.find(o => o.value === row.caretaker) || (() => {
//                                                                 const cached = selectedUsersCache.current[row.caretaker];
//                                                                 return cached
//                                                                     ? { value: cached.uid, label: `${cached.first_name} ${cached.last_name}`, gender: cached.gender, icon: cached.profile_image, _raw: cached }
//                                                                     : null;
//                                                             })()
//                                                             : null;

//                                                         return (
//                                                             <div key={rowIndex} className="property-list-2">
//                                                                 <div className="row mt-3 mb-3">

//                                                                     <div className="col-md-4">
//                                                                         <Select
//                                                                             options={travelOption}
//                                                                             placeholder="Choose Role"
//                                                                             isSearchable={false}
//                                                                             styles={customStyles}
//                                                                             onChange={(e) => handleTravellerTypeChange(rowIndex, e.value)}
//                                                                             components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                         />
//                                                                     </div>

//                                                                     <div className="col-md-3">
//                                                                         <Select
//                                                                             options={chooseBeds.filter(bed =>
//                                                                                 !travellers.some((t, i) => i !== rowIndex && t.selectedBedIndex === bed.value)
//                                                                             )}
//                                                                             placeholder="Choose Bed"
//                                                                             isSearchable={false}
//                                                                             styles={customStyles}
//                                                                             value={chooseBeds.find(b => b.value === row?.selectedBedIndex) || null}
//                                                                             onChange={(e) => {
//                                                                                 setTravellers(prev =>
//                                                                                     prev.map((item, i) =>
//                                                                                         i === rowIndex ? { ...item, selectedBedIndex: e.value } : item
//                                                                                     )
//                                                                                 );
//                                                                             }}
//                                                                         />
//                                                                     </div>

//                                                                     <div className="col-md-5">
//                                                                         <Select
//                                                                             options={rowOptions}
//                                                                             isDisabled={row?.traveller_type ? false : true}
//                                                                             isSearchable
//                                                                             placeholder="Add a traveler"
//                                                                             styles={{
//                                                                                 ...customStyles,
//                                                                                 control: (base, state) => ({
//                                                                                     ...customStyles.control(base, state),
//                                                                                     borderColor:
//                                                                                         row.isGenderValidation === "Error"
//                                                                                             ? "#dc3545"
//                                                                                             : row.isGenderValidation === "Success"
//                                                                                                 ? "#2C734A"
//                                                                                                 : state.isFocused ? "#6B4F3F" : "#ced4da",
//                                                                                 }),
//                                                                             }}
//                                                                             value={selectedOption}
//                                                                             inputValue={row.searchText}
//                                                                             onInputChange={(val, { action }) => {
//                                                                                 if (action === "input-change") {
//                                                                                     setTravellers(prev =>
//                                                                                         prev.map((item, i) =>
//                                                                                             i === rowIndex ? { ...item, searchText: val } : item
//                                                                                         )
//                                                                                     );
//                                                                                     debouncedFetchUsersForRow(rowIndex, val, row.traveller_type);
//                                                                                 }
//                                                                             }}
//                                                                             onFocus={() => {
//                                                                                 fetchUsersForRow(rowIndex, row.searchText, row.traveller_type);
//                                                                             }}
//                                                                             onChange={(opt) => {
//                                                                                 if (opt) handleCaretakerSelect(rowIndex, opt.value);
//                                                                             }}
//                                                                             isLoading={rowSearchLoading[rowIndex]}
//                                                                             // Inside the Twin-Sharing Select (col-md-5)
//                                                                             onMenuScrollToBottom={() => {
//                                                                                 const currentRow = travellers[rowIndex];
//                                                                                 if (currentRow?.hasMore && !rowSearchLoading[rowIndex]) {
//                                                                                     const nextPage = (currentRow.page || 1) + 1;
//                                                                                     fetchUsersForRow(rowIndex, currentRow.searchText, currentRow.traveller_type, nextPage);
//                                                                                 }
//                                                                             }}
//                                                                             // components={{
//                                                                             //     Option: CustomOption,
//                                                                             //     MenuList: ({ children, innerRef, innerProps }) => (
//                                                                             //         <div
//                                                                             //             ref={innerRef}
//                                                                             //             {...innerProps}
//                                                                             //             style={{ maxHeight: 200, overflowY: "auto" }}
//                                                                             //         >
//                                                                             //             {children}
//                                                                             //             {rowSearchLoading[rowIndex] && (
//                                                                             //                 <div style={{ padding: 10, fontSize: 13, color: "#73615F" }}>Loading...</div>
//                                                                             //             )}
//                                                                             //             <div style={{ padding: "12px", borderTop: "1px solid #eee" }}>
//                                                                             //                 <span style={{ fontSize: 13, color: "#463527" }}>{"Can't find someone?"}</span>
//                                                                             //                 <br />
//                                                                             //                 <Link
//                                                                             //                     href="#"
//                                                                             //                     onClick={addTravel}
//                                                                             //                     style={{ textDecoration: "underline", fontWeight: 500, color: "#6B4F3F", fontSize: 13 }}
//                                                                             //                 >
//                                                                             //                     Register a new traveler
//                                                                             //                 </Link>
//                                                                             //             </div>
//                                                                             //         </div>
//                                                                             //     ),
//                                                                             // }}
//                                                                             components={{
//                                                                                 Option: CustomOption,
//                                                                                 MenuList: ({ children, innerRef, innerProps }) => (
//                                                                                     <div
//                                                                                         ref={innerRef}
//                                                                                         {...innerProps}
//                                                                                         style={{
//                                                                                             maxHeight: 200,
//                                                                                             overflowY: "auto",
//                                                                                             scrollBehavior: "smooth",         // ✅ add this
//                                                                                             WebkitOverflowScrolling: "touch", // ✅ add this
//                                                                                         }}
//                                                                                     >
//                                                                                         {children}
//                                                                                         {rowSearchLoading[rowIndex] && (
//                                                                                             <div style={{ padding: 10, fontSize: 13, color: "#73615F", textAlign: "center" }}>Loading...</div>
//                                                                                         )}
//                                                                                         <div style={{ padding: "12px", borderTop: "1px solid #eee" }}>
//                                                                                             <span style={{ fontSize: 13, color: "#463527" }}>{"Can't find someone?"}</span>
//                                                                                             <br />
//                                                                                             <Link href="#" onClick={addTravel} style={{ textDecoration: "underline", fontWeight: 500, color: "#6B4F3F", fontSize: 13 }}>
//                                                                                                 Register a new traveler
//                                                                                             </Link>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 ),
//                                                                             }}
//                                                                         />

//                                                                         {row.isGenderValidation === "Error" && (
//                                                                             <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
//                                                                                 ✕ Gender validation failed — this traveler is not allowed in this room
//                                                                             </p>
//                                                                         )}
//                                                                         {row.isGenderValidation === "Success" && !row.caretaker && (
//                                                                             <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>✓ Gender validated</p>
//                                                                         )}
//                                                                     </div>

//                                                                     {/* Selected traveller card — unchanged */}
//                                                                     <div className="col-md-12">
//                                                                         {row.caretaker && (() => {
//                                                                             const found =
//                                                                                 selectedUsersCache.current[row.caretaker] ||
//                                                                                 userListData.find(u => u.uid === row.caretaker) ||
//                                                                                 row.filteredUsers?.find(u => u.uid === row.caretaker);
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
//                                                                                                 src={found?.profile_image || (found.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg")}
//                                                                                                 alt={found?.first_name}
//                                                                                                 width={48} height={48}
//                                                                                                 style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                             />
//                                                                                             <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                 {found?.first_name} {found?.last_name}
//                                                                                                 <br />
//                                                                                                 {row?.traveller_type !== "External" && (
//                                                                                                     <>
//                                                                                                         <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                             Emp. id: {found?.employee_id}
//                                                                                                         </span>
//                                                                                                         <br />
//                                                                                                         <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                                             Dept: {found?.segment}
//                                                                                                         </span>
//                                                                                                     </>
//                                                                                                 )}
//                                                                                                 {row.isGenderValidation === "Success" && (
//                                                                                                     <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>
//                                                                                                 )}
//                                                                                                 {row.isGenderValidation === "Error" && (
//                                                                                                     <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>
//                                                                                                 )}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                                 {found?.phone_number}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                                 {found?.email}
//                                                                                             </span>
//                                                                                             <span style={{ color: "#73615F" }}>|</span>
//                                                                                             <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                                 <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
//                                                                                                 {found?.gender}
//                                                                                             </span>
//                                                                                         </div>
//                                                                                         <div className="show-edit-btn">
//                                                                                             <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                                 onClick={() => router.push(`/People?guest_uid=${found?.uid}&show=true`)}>
//                                                                                                 Edit details
//                                                                                             </Button>
//                                                                                             <button type="button" className="ms-auto"
//                                                                                                 onClick={() => handleCaretakerSelect(rowIndex, null)}
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
//                                                         );
//                                                     })
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <p className='d-flex gap-2 fw-medium justify-content-end'>
//                                         Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
//                                     </p>

//                                     {/* ── Arrival Details ── */}
//                                     <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                         <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                         <p className="text-secondary mb-2">
//                                             This information helps in operational planning, legal compliance, and personalized service.
//                                         </p>
//                                         <Form.Group className='mb-4 mt-4' controlId="arrival_time">
//                                             <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
//                                             <Select
//                                                 onChange={(e) => updateArrivalDetails("arrival_time", e.value)}
//                                                 options={timeOption}
//                                                 placeholder="Select time"
//                                                 className="react_selectbox"
//                                                 isSearchable={false}
//                                                 styles={customStyles}
//                                             />
//                                         </Form.Group>
//                                         <Form.Group className='mb-4' controlId="mode_of_arrival">
//                                             <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
//                                             <Select
//                                                 options={arrivalOption}
//                                                 placeholder="Select Mode"
//                                                 className="react_selectbox"
//                                                 isSearchable={false}
//                                                 styles={customStyles}
//                                                 value={arrivalOption.find(opt => opt.value === formData.arrival_details.mode_of_arrival) || null}
//                                                 onChange={(e) => updateArrivalDetails("mode_of_arrival", e.value)}
//                                             />
//                                         </Form.Group>
//                                         <div className='mb-4 form-group'>
//                                             <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label>
//                                             <input type="text" className="form-control"
//                                                 placeholder="Enter number e.g. MADGAON LTT EXP #11100"
//                                                 value={formData.arrival_details.transport_number}
//                                                 onChange={(e) => updateArrivalDetails("transport_number", e.target.value)} />
//                                         </div>
//                                     </div>

//                                     <hr />

//                                     {/* ── Additional Comments ── */}
//                                     <div className="arrival-section mt-4 pt-4">
//                                         <h3 className="font-24 mb-2">Additional Comments</h3>
//                                         <div className='mb-5 form-group'>
//                                             <Form.Label className="mb-2 fw-semibold">Reference number</Form.Label>
//                                             <input type="text"
//                                                 onChange={(e) => setFormData(prev => ({ ...prev, company_booking_reference: e.target.value }))}
//                                                 placeholder='Reference number to be entered for your internal purpose (optional)'
//                                                 className='form-control' />
//                                         </div>
//                                     </div>

//                                     <hr />

//                                     {/* ── Other Essential Details ── */}
//                                     <div className="arrival-section mt-4 pt-3 mb-5">
//                                         <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                         <p className="text-secondary mb-4">Share any additional details or requests for this booking.</p>
//                                         <div className='mb-4 form-group'>
//                                             <textarea className='form-control'
//                                                 onChange={(e) => setFormData(prev => ({ ...prev, additional_comments: e.target.value }))}
//                                                 placeholder='Got any thoughts or questions? Add them here! (Optional)' />
//                                         </div>
//                                     </div>

//                                     <hr />

//                                     {/* ── Confirmation Email ── */}
//                                     <div className="confirmation-email-section my-5 pb-5">
//                                         <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3'
//                                             style={{ maxWidth: '360px', cursor: 'pointer' }}>
//                                             <Form.Check
//                                                 type="checkbox"
//                                                 label="Send copy of confirmation email"
//                                                 checked={formData.send_confirmation_email}
//                                                 onChange={(e) => {
//                                                     updateFormData("send_confirmation_email", e.target.checked);
//                                                     setIsEmailEnabled(e.target.checked);
//                                                     setReceivers(e.target.checked ? [{ id: 1, email: '' }] : []);
//                                                 }}
//                                             />
//                                         </label>

//                                         {isEmailEnabled && (
//                                             <div className="email-content">
//                                                 <p className='fw-bold mb-3' style={{ color: '#6B4F3F' }}>Add info</p>
//                                                 {receivers.map((receiver, idx) => (
//                                                     <div key={receiver.id} className="receiver-item">
//                                                         {idx > 0 && (
//                                                             <>
//                                                                 <hr className="my-4" />
//                                                                 <p className='fw-bold mb-3'>Receiver {idx + 1}</p>
//                                                             </>
//                                                         )}
//                                                         <div className='form-group mb-4'>
//                                                             <label className="form-label fw-medium">Email</label>
//                                                             <div className='row align-items-center'>
//                                                                 <div className='col-md-5'>
//                                                                     <input type='email'
//                                                                         className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
//                                                                         placeholder='Enter receiver email'
//                                                                         value={receiver.email}
//                                                                         onChange={(e) => handleEmailChange(receiver.id, e.target.value)} />
//                                                                     {receiver.email && !isValidEmail(receiver.email) && (
//                                                                         <div className="invalid-feedback d-block">Please enter a valid email address</div>
//                                                                     )}
//                                                                 </div>
//                                                                 <div className='col-md-1 d-flex align-items-center'>
//                                                                     {idx === 0 ? (
//                                                                         <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0"
//                                                                             disabled={receivers.length >= 5}>
//                                                                             <Image src='./images/icons/add_circle.svg' alt='Add' width={32} height={32}
//                                                                                 style={{ opacity: receivers.length >= 5 ? 0.5 : 1 }} />
//                                                                         </button>
//                                                                     ) : (
//                                                                         <button type="button" onClick={() => handleRemoveReceiver(receiver.id)} className="btn btn-link p-0">
//                                                                             <Image src='./images/icons/close-circle.svg' alt='Remove' width={32} height={32} />
//                                                                         </button>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                                 {receivers.length >= 5 && (
//                                                     <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </Col>

//                                 {/* ── Booking Summary ── */}
//                                 <Col md={4} className='ps-5'>
//                                     <div className='booking-summary-colum'>
//                                         <div className="d-flex align-items-center justify-between mb-4">
//                                             <h4 className='font-24 mb-0'>Booking Summary</h4>
//                                             <label className='mb-0 d-flex gap-2 align-items-center'>
//                                                 <input type="checkbox" className="mx-2 custom-checkbox"
//                                                     checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                                 Show prices
//                                             </label>
//                                         </div>
//                                         <div className="booking-summary">
//                                             <div className="summary-details">
//                                                 <div className="summary-row">
//                                                     <span className="summary-label">BRs Selected</span>
//                                                     <span className="summary-value">1</span>
//                                                 </div>
//                                                 <div className="summary-row">
//                                                     <span className="summary-label">Number of Rooms</span>
//                                                     <span className="summary-value">1 Room</span>
//                                                 </div>
//                                                 <div className="summary-row">
//                                                     <span className="summary-label">Travelers</span>
//                                                     <span className="summary-value">{booking?.adultCount || 1} Adult{(booking?.adultCount || 1) > 1 ? "s" : ""}</span>
//                                                 </div>
//                                                 <div className="summary-row detailed">
//                                                     <span className="summary-label">{booking.rooms[0].room_name} Pricing</span>
//                                                     <div className="summary-value-detailed">
//                                                         <div className="price-desc">
//                                                             {booking?.adultCount || 1} Guest x {Math.floor(calculateNights(booking.check_in_datetime, booking.check_out_datetime))} nights
//                                                         </div>
//                                                         {showPrices && <div className="price-amount">₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
//                                                         <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                                     </div>
//                                                 </div>
//                                                 <div className="summary-row detailed">
//                                                     <span className="summary-label">Taxes</span>
//                                                     <div className="summary-value-detailed">
//                                                         {showPrices && <div className="price-amount">₹{tax?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
//                                                         <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
//                                                     </div>
//                                                 </div>
//                                                 <div className="total-section">
//                                                     <span className="total-label">Total Price</span>
//                                                     <div className="total-value-detailed">
//                                                         <div className="total-desc">
//                                                             {booking?.adultCount || 1} Guest x {Math.floor(calculateNights(booking.check_in_datetime, booking.check_out_datetime))} nights
//                                                         </div>
//                                                         {showPrices && <div className="total-amount">₹{total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
//                                                         <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <button
//                                                 onClick={handleSubmitReserve}
//                                                 className="confirm-btn"
//                                                 disabled={isSubmitting}
//                                                 style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
//                                             >
//                                                 {isSubmitting ? "Validating & Reserving..." : "Confirm and Reserve"}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </Col>
//                             </React.Fragment>
//                         ))}
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
//                                     <Select options={companyList} placeholder="Select company" className="react_selectbox"
//                                         isSearchable={false}
//                                         isDisabled={companyList.length > 1 ? false : true}
//                                         value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
//                                         onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.value, company_name: opt.label, c_uid: opt.uid, city: '' })}
//                                         styles={customStyles} />
//                                 </div>
//                             </Col>
//                             <Col md={2} className='gap-1'>
//                                 <div className='form-group'>
//                                     <label className='text-black'>Where to?</label>
//                                     <Select options={cityList} placeholder="Select city" className="react_selectbox"
//                                         isSearchable={false}
//                                         // getOptionLabel={(o) => o.city} getOptionValue={(o) => o.city}
//                                         value={cityList?.find(c => c.value === searchFieldData.city) || null}
//                                         onChange={(o) => setSearchFieldData({ ...searchFieldData, city: o.value })}
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

//             {/* ── Add Person Modal ── */}
//             <AddPersonModel
//                 addTravels={addTravels}
//                 removeTravel={removeTravel}
//                 roleOption={role}
//                 companyList={companyList}
//                 addTravel={addTravel}
//                 getUserListData={getUserListData}
//             />

//             {/* ── Price Breakdown Modal ── */}
//             <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
//                     <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='booking-filter'>
//                         <div className='d-flex justify-between pb-2'>
//                             <span>{breakdownText()}</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                         </div>
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>CasaMelhor Service fee</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹0</span>
//                         </div>
//                         <div className='d-flex justify-between pt-2 pb-2'>
//                             <span>Taxes</span>
//                             <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{tax?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between'>
//                     <span className='fs-20'>Total</span>
//                     <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>₹{total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                 </Modal.Footer>
//             </Modal>

//             {/* ── Booking Confirmed Modal ── */}
//             <Modal show={showReserveModal} onHide={removeReserve} animation={false} backdrop="static" centered className='custom-theme-modal-2 modal-460'>
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
//                     <Link href={`/BookingDetails/${bookingConfirmedData[0]?.booking_uid}`}
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
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../Header/Header'
import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import Select, { components } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AddPersonModel } from '../commons/AddPersonModel';
import { UserListAPI, validateGender, CreateBookingPost, companyListAPI, PropertyListFullApi, UserRoleListAPI, getCompanyPropertiesCitiesAPI } from '@/services/provider';
import { normalizeCity, normalizeSearchContext, hasCompanyAndCity } from '@/utils/searchContext';
import { calculateNights, convertTo24Hour, formatDateMonthYear, formatYMD, generateTimeOptions, generateTimeOptions12Format } from '@/utils/formatTime';
import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
import toast, { Toaster } from 'react-hot-toast';

// ─── Arrival options (moved to module level — no need to recreate on every render) ──
const arrivalOption = [
    { value: "Flight", label: "Flight" },
    { value: "Train", label: "Train" },
];

export default function ReserveBooking() {

    const router = useRouter();
    const timeOption = generateTimeOptions12Format(30);

    // ─── localStorage reads (done once — stable references) ──────────────────
    // const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom"));
    // const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
    // const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
    // const loginData = JSON.parse(getItemLocalStorage("userLogin"));
    const [searchBookingData, setSearchBookingData] = useState(null);
    const [bacisSearchDetails, setBacisSearchDetails] = useState(null);
    const loginData = JSON.parse(typeof window !== "undefined" ? getItemLocalStorage("userLogin") : null);

    // ─── State ────────────────────────────────────────────────────────────────
    const [userListData, setUserListData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [bookingData, setBookingData] = useState(null);
    const [filtereduserListData, setFilteredUserListData] = useState([]);
    const [isExclusiveBooking, setIsExclusiveBooking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [role, setRole] = useState([]);
    const [search, setSearch] = useState('');
    const [searchKey, setSearchKey] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [lockedGender, setLockedGender] = useState(null);

    // ─── Per-row search loading state for twin-sharing ────────────────────────
    const [rowSearchLoading, setRowSearchLoading] = useState({});

    // ─── Debounce timer refs — one per row index ──────────────────────────────
    const rowSearchTimers = useRef({});

    // ─── Cache of selected users by uid — so card renders even after list clears ─
    const selectedUsersCache = useRef({});

    // ─── Tax / price helpers ──────────────────────────────────────────────────
    const [amount, setAmount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const calculateTax = (pricePerNight, checkIn, checkOut) => {
        const parsed = Number(pricePerNight);
        if (!parsed || parsed < 0) { setTax(0); setTotal(0); setAmount(0); return; }

        const nights = calculateNights(checkIn, checkOut);
        const taxRate = parsed <= 7500 ? 0.05 : 0.18;
        const roomTotal = parsed * nights;
        const calcTax = roomTotal * taxRate;
        setAmount(roomTotal);
        setTax(calcTax);
        setTotal(roomTotal + calcTax);
    };

    // FIX: breakdownText now uses live bookingData instead of stale bacisSearchDetails rooms
    const breakdownText = () => {
        const roomCount = 1;
        const guestCount = bookingData?.[0]?.adultCount || 1;
        const nights = calculateNights(
            bookingData?.[0]?.check_in_datetime,
            bookingData?.[0]?.check_out_datetime
        );
        return `${roomCount} room x ${guestCount} guest x ${nights} nights`;
    };

    // FIX: bedroomPreference derived from reactive bookingData state (not stale reserveBookingData)
    const bedroomPreference = bookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;

    // ─── formData ─────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        company_id: null,
        caretakers: "",
        caretakerGenderValid: null,
        traveller_type: null,         // FIX: added to top-level formData (was missing)
        traveler_assignments: [],
        arrival_details: {
            arrival_time: "",
            mode_of_arrival: "",
            transport_number: ""
        },
        send_confirmation_email: false,
        additional_comments: "",
        company_booking_reference: "",
    });

    const [travellers, setTravellers] = useState([]);
    const [showPrices, setShowPrices] = useState(false);
    const [selectedAdult, setSelectedAdult] = useState(1);

    // ─── Modal states ─────────────────────────────────────────────────────────
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

    // ─── formData helpers ─────────────────────────────────────────────────────
    const updateFormData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
    const updateArrivalDetails = (key, value) => setFormData(prev => ({
        ...prev,
        arrival_details: { ...prev.arrival_details, [key]: key === "arrival_time" ? convertTo24Hour(value) : value }
    }));

    // ─── Role list ────────────────────────────────────────────────────────────
    const getUserListDataAPI = async () => {
        try {
            const response = await UserRoleListAPI(loginData?.uid);
            if (response?.data?.success) {
                setRole(
                    response.data.response.map((val) => ({
                        value: val?.uid,
                        label: val?.role_name,
                        icon: val?.role_icon,
                    }))
                );
            }
        } catch (error) {
            console.error("UserRoleListAPI error:", error);
        }
    };

    // ─── Init bookingData + travellers from localStorage ─────────────────────
    // useEffect(() => {
    //     if (reserveBookingData?.length > 0) {
    //         setBookingData(reserveBookingData);
    //         calculateTax(
    //             reserveBookingData[0]?.rooms?.[0]?.price_per_night,
    //             reserveBookingData[0]?.check_in_datetime,
    //             reserveBookingData[0]?.check_out_datetime
    //         );
    //         const count = reserveBookingData[0]?.adultCount || 1;
    //         setSelectedAdult(count);
    //         setTravellers(
    //             Array.from({ length: count }, () => ({
    //                 traveller_type: null,
    //                 isGenderValidation: "",
    //                 caretaker: null,
    //                 searchText: "",
    //                 showList: false,
    //                 filteredUsers: [],
    //                 selectedBedIndex: null
    //             }))
    //         );
    //     }
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        // Read localStorage HERE — inside useEffect runs only in browser, never on server
        const reserveBookingData = JSON.parse(getItemLocalStorage("reserveRoom") || "null");
        const searchData = JSON.parse(getItemLocalStorage("searchParam") || "null");
        const basicSearch = JSON.parse(getItemLocalStorage("basicSecrchItemObj") || "null");

        // Now set them into state so the page can use them
        setSearchBookingData(searchData);
        setBacisSearchDetails(basicSearch);

        if (reserveBookingData?.length > 0) {
            setBookingData(reserveBookingData);
            calculateTax(
                reserveBookingData[0]?.rooms?.[0]?.price_per_night,
                reserveBookingData[0]?.check_in_datetime,
                reserveBookingData[0]?.check_out_datetime
            );
            const count = reserveBookingData[0]?.adultCount || 1;
            setSelectedAdult(count);
            setTravellers(
                Array.from({ length: count }, () => ({
                    traveller_type: null,
                    isGenderValidation: "",
                    caretaker: null,
                    searchText: "",
                    showList: false,
                    filteredUsers: [],
                    selectedBedIndex: null,
                    page: 1,
                    hasMore: true,
                }))
            );
        }

        if (basicSearch) {
            // setSearchFieldData({
            //     company_id: basicSearch.company_id,
            //     city: basicSearch.city,
            //     check_in_date: basicSearch.check_in_date,
            //     check_out_date: basicSearch.check_out_date,
            //     is_available: basicSearch.is_available,
            //     rooms: basicSearch.rooms.map(item => ({ adults: item.adults })),
            //     company_name: basicSearch.company_name,
            //     c_uid: basicSearch.c_uid,
            // });
            const rawCity = normalizeCity(basicSearch.city);
            setSearchFieldData({
                company_id: basicSearch.company_id,
                city: rawCity || reserveBookingData?.[0]?.city || "",
                check_in_date: basicSearch.check_in_date,
                check_out_date: basicSearch.check_out_date,
                is_available: basicSearch.is_available,
                rooms: basicSearch.rooms.map(item => ({ adults: item.adults })),
                company_name: basicSearch.company_name,
                c_uid: basicSearch.c_uid || "",
            });
            setRooms(basicSearch.rooms.map((val, idx) => ({ id: idx + 1, adults: val.adults })));
        }
    }, []);

    // ─── chooseBeds derived from bookingData state (reactive) ─────────────────
    const [chooseBeds, setChooseBeds] = useState([]);

    useEffect(() => {
        if (!bookingData) return;
        const room = bookingData?.[0]?.rooms?.[0];
        if (!room) return;

        if (room.room_type === "Twin-Sharing") {
            const availableBedIndices = room.available_beds || [];
            const beds = room.beds
                ?.map((bed, index) => ({ label: bed.name, value: index }))
                .filter(bed => availableBedIndices.includes(bed.value));
            setChooseBeds(beds || []);
        } else {
            setChooseBeds([]);
        }
    }, [bookingData]); // FIX: depends on bookingData state, not stale closure

    // ─── Traveller type dropdown options ─────────────────────────────────────
    const travelOption = [
        { value: "Company Booking Manager", label: "Company employee", icon: "../images/icons/hail.svg" },
        { value: "External", label: "External", icon: "../images/icons/short_stay.svg" },
    ];

    const CustomOption = (props) => (
        <components.Option {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image
                        src={props.data.icon
                            ? props.data.icon
                            : props.data.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                        alt={props.data.label}
                        width={20} height={20}
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

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? "#6B4F3F" : "#ced4da",
            boxShadow: state.isFocused ? "0 0 0 1px #6B4F3F" : "none",
            "&:hover": { borderColor: "#6B4F3F" },
            borderRadius: "0px",
            minHeight: "48px",
            backgroundColor: "#F2F2F2",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#6B4F3F" : state.isFocused ? "#f0e8e3" : "transparent",
            color: state.isSelected ? "white" : "#463527",
            padding: "10px 16px",
            cursor: "pointer",
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

    // FIX: CustomMenuList receives addTravel via selectProps to avoid stale closure
    // const CustomMenuList = ({ children, selectProps }) => {
    //     const { options } = selectProps;
    //     const isEmpty = !options || options.length === 0;

    //     return (
    //         <div>
    //             {isEmpty ? (
    //                 <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
    //                     <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
    //                     <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px", color: "#463527" }}>
    //                         No travelers found
    //                     </div>
    //                     <Link
    //                         href="/People"
    //                         style={{
    //                             background: "#6B4F3F", color: "white",
    //                             padding: "10px 20px", display: "block",
    //                             textAlign: "center", textDecoration: "none",
    //                         }}
    //                     >
    //                         Invite to Join
    //                     </Link>
    //                 </div>
    //             ) : (
    //                 <>
    //                     {children}
    //                     <div style={{ borderTop: "1px solid #ececec", padding: "14px 16px 10px" }}>
    //                         <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
    //                             {"Can't find someone?"}<br />
    //                             <Link onClick={addTravel} href="#" style={{ color: "#6B4F3F" }}>
    //                                 Register a new traveler
    //                             </Link>
    //                         </div>
    //                     </div>
    //                 </>
    //             )}
    //         </div>
    //     );
    // };

    // const CustomMenuList = (props) => {
    //     const {
    //         children,
    //         innerRef,
    //         innerProps,
    //         selectProps
    //     } = props;
    //     const { options } = selectProps;
    //     const isEmpty = !options || options.length === 0;

    //     return (
    //         <div
    //             ref={innerRef}
    //             {...innerProps}
    //             style={{
    //                 maxHeight: 200,
    //                 overflowY: "auto"
    //             }}
    //         >
    //             {/* {children} */}

    //             {loading && (
    //                 <div style={{ padding: 10 }}>
    //                     Loading...
    //                 </div>
    //             )}

    //             {!hasMore && (
    //                 <div style={{ padding: 10 }}>
    //                     No more companies
    //                 </div>
    //             )}

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
    //                                 background: "#6B4F3F", color: "white",
    //                                 padding: "10px 20px", display: "block",
    //                                 textAlign: "center", textDecoration: "none",
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
    //         </div>
    //     );
    // };
    const CustomMenuList = (props) => {
        const { children, innerRef, innerProps, selectProps } = props;
        const { options } = selectProps;
        const isEmpty = !options || options.length === 0;

        return (
            <div
                ref={innerRef}
                {...innerProps}
                style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    scrollBehavior: "smooth",          // ✅ smooth scroll
                    WebkitOverflowScrolling: "touch",  // ✅ smooth on iOS
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

                {loading && (
                    <div style={{ padding: "8px 10px", fontSize: "13px", color: "#73615F", textAlign: "center" }}>
                        Loading...
                    </div>
                )}
            </div>
        );
    };

    // ─── handleSelectDropdown for Private room ────────────────────────────────
    const handleSelectDropdown = (e, name) => {
        if (name === "traveller_type") {
            setFormData(prev => ({ ...prev, traveller_type: e.value }));
        }
    };

    // ─── handleCaretakerSelect ────────────────────────────────────────────────
    const handleCaretakerSelect = async (rowIndex, userId) => {
        // ── Private room ──
        if (rowIndex === "") {
            if (!userId) {
                setFormData(prev => ({ ...prev, caretakers: "", caretakerGenderValid: null }));
                setShowCaretakerList(false);
                return;
            }

            setFormData(prev => ({ ...prev, caretakers: userId, caretakerGenderValid: null }));
            setShowCaretakerList(false);

            try {
                const payload = {
                    room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
                    traveler_uid: userId,
                    check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
                    check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
                    bed_index: 0,
                };
                const response = await validateGender(payload);
                const isValid = response?.data?.response?.valid;
                setFormData(prev => ({ ...prev, caretakerGenderValid: isValid }));
                if (isValid) {
                    toast.success("Gender validated successfully");
                } else {
                    toast.error("Gender validation failed — this traveler is not allowed in this room");
                }
            } catch (error) {
                console.error("Gender validation error:", error);
                toast.error("Failed to validate gender");
            }
            return;
        }

        // ── Twin-Sharing row: cleared ──
        // FIX: check for falsy (null, undefined, "") consistently
        // if (!userId) {
        //     setTravellers(prev =>
        //         prev.map((item, i) =>
        //             i === rowIndex
        //                 ? { ...item, caretaker: null, searchText: "", isGenderValidation: "" }
        //                 : item
        //         )
        //     );
        //     return;
        // }
        if (!userId) {
            setTravellers(prev =>
                prev.map((item, i) =>
                    i === rowIndex
                        ? { ...item, caretaker: null, searchText: "", isGenderValidation: "" }
                        : item
                )
            );

            // Check if anyone else is still selected — if not, clear the gender lock
            const othersRemaining = travellers.filter((t, i) => i !== rowIndex && t.caretaker);
            if (othersRemaining.length === 0) {
                setLockedGender(null);
            } else {
                const firstUser = selectedUsersCache.current[othersRemaining[0].caretaker];
                if (firstUser?.gender) setLockedGender(firstUser.gender);
            }

            return;
        }

        // ── Twin-Sharing row: selected ──
        // Look up from userListData first, then from row's filteredUsers, then cache it
        const user = userListData.find(u => u.uid === userId)
            || travellers[rowIndex]?.filteredUsers?.find(u => u.uid === userId);

        // Cache so the selected card can render even after filteredUsers is cleared
        if (user) selectedUsersCache.current[userId] = user;

        // Gender lock check — block before API call
        if (lockedGender && user?.gender && user.gender !== lockedGender) {
            toast.error(
                `This room is locked to ${lockedGender} travelers. Please select a ${lockedGender} traveler.`
            );
            return;
        }

        setTravellers(prev =>
            prev.map((item, i) =>
                i === rowIndex
                    ? {
                        ...item,
                        caretaker: userId,
                        searchText: user ? `${user.first_name} ${user.last_name}` : "",
                        showList: false,
                        filteredUsers: [],        // clear dropdown after selection
                        isGenderValidation: "Validating",
                    }
                    : item
            )
        );

        try {
            const payload = {
                room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
                traveler_uid: userId,
                check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
                check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
                bed_index: rowIndex,
            };
            const response = await validateGender(payload);
            const isValid = response?.data?.response?.valid;

            setTravellers(prev =>
                prev.map((item, i) =>
                    i === rowIndex
                        ? { ...item, isGenderValidation: isValid ? "Success" : "Error" }
                        : item
                )
            );
            if (isValid) {
                if (lockedGender === null && user?.gender) {
                    setLockedGender(user.gender);
                }
                toast.success(`Traveler ${rowIndex + 1}: Gender validated successfully`);
            } else {
                toast.error(`Traveler ${rowIndex + 1}: Gender validation failed — not allowed in this room`);
            }
        } catch (error) {
            console.error("Gender validation error:", error);
            toast.error(`Traveler ${rowIndex + 1}: Failed to validate gender`);
            setTravellers(prev =>
                prev.map((item, i) =>
                    i === rowIndex ? { ...item, isGenderValidation: "" } : item
                )
            );
        }
    };

    // ─── handleTravellerTypeChange for Twin-Sharing rows ─────────────────────
    // const handleTravellerTypeChange = (rowIndex, selected) => {
    //     // Update traveller_type immediately, then fetch from API
    //     setTravellers(prev => {
    //         const updated = [...prev];
    //         if (!updated[rowIndex]) return prev;
    //         updated[rowIndex] = { ...updated[rowIndex], traveller_type: selected, filteredUsers: [] };
    //         return updated;
    //     });
    //     // Fetch fresh results from API with current searchText and new role (immediate, no debounce on role change)
    //     const currentSearchText = travellers[rowIndex]?.searchText || '';
    //     fetchUsersForRow(rowIndex, currentSearchText, selected);
    // };

    const handleTravellerTypeChange = (rowIndex, selected) => {
        setTravellers(prev => {
            const updated = [...prev];
            if (!updated[rowIndex]) return prev;
            updated[rowIndex] = {
                ...updated[rowIndex],
                traveller_type: selected,
                filteredUsers: [],
                page: 1,
                hasMore: true,
            };
            return updated;
        });
        const currentSearchText = travellers[rowIndex]?.searchText || '';
        fetchUsersForRow(rowIndex, currentSearchText, selected, 1);
    };

    // ─── Caretaker dropdown visibility ───────────────────────────────────────
    // FIX: initialized to false (not null) so boolean coercion works correctly
    const [showCaretakerList, setShowCaretakerList] = useState(false);

    // ─── Fetch users for Private room (search state drives this) ─────────────
    // const getUserListData = async (searchTerm = '', pageNext) => {
    //     try {
    //         const response = await UserListAPI("All", '', searchTerm, '', '', '', '', '', '', pageNext);
    //         if (response?.data?.success) {
    //             // setUserListData(response.data.response);
    //             const newData =
    //                 response.data.response || [];

    //             setUserListData(prev =>
    //                 pageNext === 1
    //                     ? newData
    //                     : [...prev, ...newData]
    //             );
    //         }
    //     } catch (error) { console.log(error); }
    // };
    const getUserListData = async (searchTerm = '', pageNext = 1) => {
        try {
            setLoading(true);
            const user_company = formData.traveller_type === "External" ? "" : searchFieldData.company_name;
            const response = await UserListAPI("All", '', searchTerm, '', '', '', '', '', user_company, pageNext);
            if (response?.data?.success) {
                const newData = response.data.response || [];
                // If returned data is empty, no more pages
                setHasMore(response.data.next_page);
                setUserListData(prev =>
                    pageNext === 1 ? newData : [...prev, ...newData]
                );
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // ─── Fetch users for a specific Twin-Sharing row, then filter & update ────
    // const fetchUsersForRow = async (rowIndex, searchTerm, travellerType) => {
    //     setRowSearchLoading(prev => ({ ...prev, [rowIndex]: true }));
    //     try {
    //         const response = await UserListAPI("All", '', searchTerm);
    //         if (response?.data?.success) {
    //             let base = response.data.response.filter(user => {
    //                 const rn = user?.user_role?.role_name;
    //                 if (travellerType === "External") return rn === "External";
    //                 return rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
    //             });
    //             // Apply gender preference filter
    //             const pref = bookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;
    //             if (pref === "FEMALE PREFERRED") base = base.filter(u => u.gender === "Female");
    //             if (pref === "MALE PREFERRED") base = base.filter(u => u.gender === "Male");

    //             setTravellers(prev =>
    //                 prev.map((item, i) =>
    //                     i === rowIndex ? { ...item, filteredUsers: base } : item
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.log("fetchUsersForRow error:", error);
    //     } finally {
    //         setRowSearchLoading(prev => ({ ...prev, [rowIndex]: false }));
    //     }
    // };
    const fetchUsersForRow = async (rowIndex, searchTerm, travellerType, pageNum = 1) => {
        // Prevent duplicate calls if already loading or no more data
        const row = travellers[rowIndex];
        if (pageNum > 1 && !row?.hasMore) return;

        setRowSearchLoading(prev => ({ ...prev, [rowIndex]: true }));
        try {
            const category = travellerType === "External" ? "" : searchFieldData.company_name
            const response = await UserListAPI("All", '', searchTerm, '', '', '', '', '', category, pageNum);
            if (response?.data?.success) {
                let base = (response.data.response || []).filter(user => {
                    // const rn = user?.user_role?.role_name;
                    // let allowed = false;
                    // if (travellerType === "External") {
                    //     allowed = rn === "External";
                    // } else {
                    //     allowed = rn !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
                    // }
                    // if (!allowed) return false;
                    const pref = bookingData?.[0]?.rooms?.[0]?.bedroom_preference_badge;
                    if (pref === "FEMALE PREFERRED") return user.gender === "Female";
                    if (pref === "MALE PREFERRED") return user.gender === "Male";
                    return true;
                });

                const hasMoreData = (response.data.response || []).length > 0;

                setTravellers(prev =>
                    prev.map((item, i) =>
                        i === rowIndex
                            ? {
                                ...item,
                                filteredUsers: pageNum === 1 ? base : [...item.filteredUsers, ...base],
                                page: pageNum,
                                hasMore: hasMoreData,
                            }
                            : item
                    )
                );
            }
        } catch (error) {
            console.log("fetchUsersForRow error:", error);
        } finally {
            setRowSearchLoading(prev => ({ ...prev, [rowIndex]: false }));
        }
    };

    // ─── Debounced version — 350ms delay to avoid API call on every keystroke ─
    // const debouncedFetchUsersForRow = (rowIndex, searchTerm, travellerType) => {
    //     if (rowSearchTimers.current[rowIndex]) {
    //         clearTimeout(rowSearchTimers.current[rowIndex]);
    //     }
    //     rowSearchTimers.current[rowIndex] = setTimeout(() => {
    //         fetchUsersForRow(rowIndex, searchTerm, travellerType);
    //     }, 350);
    // };
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
            fetchUsersForRow(rowIndex, searchTerm, travellerType, 1);
        }, 350);
    };

    // Private room search: re-fetch whenever `search` changes (empty string on mount = initial load)
    // useEffect(() => {
    //     getUserListData(search);
    // }, [search]); // eslint-disable-line react-hooks/exhaustive-deps
    // Replace the existing search useEffect
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setUserListData([]);
        getUserListData(search, 1);
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Filter users for Private room dropdown ───────────────────────────────
    useEffect(() => {
        if (!formData?.traveller_type) { setFilteredUserListData([]); return; }

        const filtered = userListData
            ?.filter(user => {
                const roleName = user.user_role?.role_name;
                let allowed = false;
                if (formData.traveller_type === "External") {
                    allowed = roleName === "External";
                } else {
                    allowed = roleName !== "External" && user?.user_company?.id === bacisSearchDetails?.company_id;
                }
                if (!allowed) return false;
                if (bedroomPreference === "FEMALE PREFERRED") return user.gender === "Female";
                if (bedroomPreference === "MALE PREFERRED") return user.gender === "Male";
                return true;
            })
            .map(user => ({
                value: user.uid,
                label: `${user.first_name} ${user.last_name}`,
                gender: user.gender,
                icon: user.profile_image
            }));

        setFilteredUserListData(filtered || []);
    }, [formData.traveller_type, userListData, bedroomPreference]);

    // ─── Date helpers ─────────────────────────────────────────────────────────
    const getDateOnly = (dateTime) => dateTime?.split("T")[0];

    const formatDate = (dateTime) => new Date(dateTime).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
    });

    const formatTime = (dateTime) => new Date(dateTime).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true
    });

    const formatStayDates = (fromDate, toDate) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const opts = { weekday: "short", day: "numeric", month: "short" };
        const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
        return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}, ${end.getFullYear()}, ${nights} night${nights > 1 ? "s" : ""}`;
    };
    const countNights = (fromDate, toDate) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
        return nights;
    }

    const formatRoomsAndGuests = (rooms = []) => {
        const rc = rooms.length;
        const gc = rooms.reduce((sum, r) => sum + (r.adults || 0), 0);
        return `${rc} room${rc > 1 ? "s" : ""} for ${gc} guest${gc > 1 ? "s" : ""}`;
    };

    // ─── Pre-submit gender validation for ALL Twin-Sharing travellers ─────────
    const validateAllTravellersGender = async () => {
        let allValid = true;
        for (let i = 0; i < travellers.length; i++) {
            const traveller = travellers[i];
            if (!traveller.caretaker) {
                toast.error(`Traveler ${i + 1}: No traveler selected`);
                allValid = false;
                continue;
            }
            try {
                const payload = {
                    room_uid: bookingData?.[0]?.rooms[0]?.room_uid,
                    traveler_uid: traveller.caretaker,
                    check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
                    check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime),
                    bed_index: i,
                };
                const response = await validateGender(payload);
                const isValid = response?.data?.response?.valid;

                setTravellers(prev =>
                    prev.map((item, idx) =>
                        idx === i ? { ...item, isGenderValidation: isValid ? "Success" : "Error" } : item
                    )
                );

                if (!isValid) {
                    toast.error(`Traveler ${i + 1}: Gender validation failed — booking blocked`);
                    allValid = false;
                }
            } catch {
                toast.error(`Traveler ${i + 1}: Gender validation error`);
                allValid = false;
            }
        }
        return allValid;
    };

    // ─── Edit Stay Details state ──────────────────────────────────────────────
    const [searchFieldData, setSearchFieldData] = useState({
        company_id: 0, city: "", check_in_date: "", check_out_date: "", rooms: [], is_available: true, company_name: '', c_uid: ""
    });
    const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const handleAdultChange = (roomId, change) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId) {
                const nv = room.adults + change;
                return { ...room, adults: nv >= 1 ? nv : 1 };
            }
            return room;
        }));
    };
    const addRoom = () => setRooms([...rooms, { id: rooms.length + 1, adults: 1 }]);
    const deleteRoom = (roomId) => { if (rooms.length > 1) setRooms(rooms.filter(r => r.id !== roomId)); };

    // const getProprtyList = async () => {
    //     try {
    //         const response = await PropertyListFullApi();
    //         if (response?.data?.success) {
    //             const uniqueCities = [
    //                 { city: "Jaipur" },
    //                 ...Array.from(
    //                     new Set(response.data.response.map(ele => ele.city)),
    //                     city => ({ city })
    //                 ).filter(item => item.city !== "Jaipur")
    //             ];
    //             setCityList(uniqueCities);
    //         }
    //     } catch (error) { console.log(error); }
    // };

    const getLocationOfProperty = async (id) => {
        try {
            const response = await getCompanyPropertiesCitiesAPI(id);
            if (response?.success) {
                setCityList(response?.response?.cities.map(cv => ({ value: cv, label: cv })))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCompanyList = async () => {
        try {
            const response = await companyListAPI("all");
            if (response?.data?.success) {
                setCompanyList(response.data.response?.filter(item => !item?.is_company_inactive)?.map(item => ({ value: item.uid, label: item.company_name, id: item.id })));
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
    // useEffect(() => {
    //     getCompanyList();
    //     // getProprtyList();
    //     getUserListDataAPI();
    //     if (bacisSearchDetails) {
    //         setSearchFieldData({
    //             company_id: bacisSearchDetails.company_id,
    //             city: bacisSearchDetails.city,
    //             check_in_date: bacisSearchDetails.check_in_date,
    //             check_out_date: bacisSearchDetails.check_out_date,
    //             is_available: bacisSearchDetails.is_available,
    //             rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults })),
    //             company_name: bacisSearchDetails.company_name,
    //             c_uid: bacisSearchDetails.c_uid
    //         });
    //         setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx + 1, adults: val.adults })));
    //     }
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        getCompanyList();
        getUserListDataAPI();
    }, []);

    useEffect(() => {
        if (companyList.length === 1) {
            setSearchFieldData({ ...searchFieldData, company_id: companyList?.[0].id, company_name: companyList?.[0]?.label, c_uid: companyList?.[0]?.value })
        }
    }, [companyList]);

    useEffect(() => {
        if (!companyList.length || searchFieldData.c_uid || !searchFieldData.company_id) return;
        const match = companyList.find(c => String(c.id) === String(searchFieldData.company_id));
        if (match) {
            setSearchFieldData(prev => ({
                ...prev,
                c_uid: match.value,
                company_name: prev.company_name || match.label,
            }));
        }
    }, [companyList, searchFieldData.company_id, searchFieldData.c_uid]);

    useEffect(() => {
        if (searchFieldData.c_uid) {
            getLocationOfProperty(searchFieldData.c_uid)
        }
    }, [searchFieldData.c_uid])

    useEffect(() => {
        getUserListData(search, 1)
    }, [formData.traveller_type]);
    useEffect(() => {
        if (searchKey) getCompanyList()
    }, [searchKey])

    const handleUpdateSearch = () => {
        removeItemLocalStorage("reserveRoom");
        localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
        router.push("./Searchresult");
    };

    // ─── Email recipients ─────────────────────────────────────────────────────
    const [isEmailEnabled, setIsEmailEnabled] = useState(false);
    const [receivers, setReceivers] = useState([]);
    const [bookingConfirmedData, setBookingConfirmedData] = useState([]);

    const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
    const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
    const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
        const isPrivate = bookingData?.[0]?.rooms?.[0]?.room_type === "Private";

        if (isPrivate) {
            if (!formData.caretakers) {
                toast.error("Please select a traveler before confirming");
                return;
            }
            if (formData.caretakerGenderValid === false) {
                toast.error("Booking blocked: traveler did not pass gender validation");
                return;
            }
        } else {
            const missingTraveller = travellers.some(row => !row.caretaker);
            if (missingTraveller) {
                toast.error("Please select a traveler for every row before confirming");
                return;
            }

            // FIX: setIsSubmitting(true) BEFORE validateAllTravellersGender, then handle result
            setIsSubmitting(true);
            const allGenderValid = await validateAllTravellersGender();
            if (!allGenderValid) {
                setIsSubmitting(false);
                toast.error("Booking blocked: one or more travelers failed gender validation");
                return;
            }
            // Keep isSubmitting=true and fall through to CreateBookingPost
        }

        // For private rooms we set submitting here; for shared it's already set above
        if (isPrivate) setIsSubmitting(true);

        try {
            const cartItem = isPrivate
                ? [{
                    property_uid: bookingData?.[0]?.property_uid,
                    room_uid: bookingData?.[0]?.rooms?.[0]?.room_uid,
                    bed_index: null,
                    check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
                    check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime)
                }]
                : travellers.map(t => ({
                    property_uid: bookingData?.[0]?.property_uid,
                    room_uid: bookingData?.[0]?.rooms?.[0]?.room_uid,
                    bed_index: t.selectedBedIndex,
                    check_in_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
                    check_out_date: getDateOnly(bookingData?.[0]?.check_out_datetime)
                }));

            const travelerAssignments = isPrivate
                ? [{ cart_item_index: 0, traveler_id: formData.caretakers, is_exclusive_booking: isExclusiveBooking }]
                : travellers.map((row, index) => ({
                    cart_item_index: index,
                    traveler_id: row.caretaker,
                    is_exclusive_booking: isExclusiveBooking
                }));

            const payload = {
                company_id: searchBookingData?.company_id,
                cart_items: cartItem,
                traveler_assignments: travelerAssignments,
                arrival_details: {
                    ...formData.arrival_details,
                    arrival_date: getDateOnly(bookingData?.[0]?.check_in_datetime),
                },
                additional_comments: formData.additional_comments,
                company_booking_reference: formData.company_booking_reference,
                send_confirmation_email: formData.send_confirmation_email,
                additional_email_recipients: receivers.map(r => r.email),
                adults_count: selectedAdult
            };

            const response = await CreateBookingPost(cleanPayload(payload));
            if (response.data.success) {
                setBookingConfirmedData(response.data.response.bookings);
                setShowReserveModal(true);
                toast.success("Booking Created Successfully");
                removeItemLocalStorage("reserveRoom");
                removeItemLocalStorage("searchParam");
                removeItemLocalStorage("basicSecrchItemObj");
            } else {
                response.data.response.validation_errors.forEach(el => toast.error(el.error));
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to create booking");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            <Header />
            <Toaster position="top-right" />
            {!bookingData && (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    Loading booking details...
                </div>
            )}
            {bookingData && (
                <div className='searching-result-top'>
                    <Container>
                        <div className='search-result-header'>
                            <h4>{searchBookingData?.company_name} | {searchBookingData?.city}</h4>
                            <p className='mb-0'>
                                <Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />
                                {formatStayDates(searchBookingData?.check_in_date, searchBookingData?.check_out_date)} |
                                <Image src='./images/icons/group.svg' alt='group' className="img-fluid" width={24} height={24} />
                                {/* {formatRoomsAndGuests(bacisSearchDetails?.rooms)} */}
                                {formatRoomsAndGuests(bacisSearchDetails?.rooms ?? [])}
                            </p>
                            <Button variant='' onClick={addTravel2} className='edit-details'>Edit Stay Details</Button>
                        </div>
                    </Container>
                </div>
            )}



            <div className='search-result-data'>
                <Container>
                    <Row className='justify-content-between'>
                        <Col md={12}>
                            <h4 className='page-title mb-5'>Add Guests & Reserve Your Booking</h4>
                        </Col>

                        {bookingData?.length > 0 && bookingData?.map((booking, bookingIndex) => (
                            <React.Fragment key={bookingIndex}>
                                <Col md={8}>
                                    <h4 className='font-24 mb-4'>Review Your Selected BRs (1)</h4>

                                    <div className="booking-card border bg-white p-3 mb-4">
                                        {/* Room image + title */}
                                        <Row>
                                            <Col md={4}>
                                                <Image
                                                    src={booking?.cover_photo
                                                        ? booking?.cover_photo
                                                        : `/images/icons/No-Image.svg`}
                                                    alt="Room Image"
                                                    width={300} height={200}
                                                    className="img-fluid"
                                                />
                                            </Col>
                                            <Col md={8}>
                                                <p className="fw-semibold fs-20 mb-2 room-title">
                                                    {countNights(booking.check_in_datetime, booking.check_out_datetime)} night stay in {booking.rooms[0].room_name}
                                                    <span className='room-type-badge ms-2'>
                                                        {booking.rooms[0].room_type === "Private" ? "Private Rooms" : "Shared Rooms"}
                                                    </span>
                                                </p>
                                                <p className="text-muted d-flex gap-2 align-items-start small mb-3">
                                                    <Image src="/images/icons/location_on.svg" alt="location" width={24} height={24} className="img-fluid" />
                                                    {booking?.property_name}<br />{booking?.address}
                                                </p>
                                            </Col>
                                        </Row>

                                        {/* Check-in / Check-out */}
                                        <Row className="mt-3 mb-3">
                                            <Col md={3}>
                                                <p className="mb-1 text-secondary small">Check-in:</p>
                                                <p className="fw-semibold mb-0">{formatDate(booking.check_in_datetime)}</p>
                                                <small>{formatTime(booking.check_in_datetime)}</small>
                                            </Col>
                                            <Col md={3}>
                                                <p className="mb-1 text-secondary small">Check-out:</p>
                                                <p className="fw-semibold mb-0">{formatDate(booking.check_out_datetime)}</p>
                                                <small>{formatTime(booking.check_out_datetime)}</small>
                                            </Col>
                                        </Row>

                                        {/* Room details */}
                                        <div className="border-top pt-3">
                                            <p className="mb-1 font-18">Room details</p>
                                            <div className="room-specs d-flex gap-3 mb-2">
                                                <span className="spec-item d-flex gap-2">
                                                    <Image src="./images/icons/person.svg" width={16} height={16} alt="person" /> Sleeps {booking?.rooms[0]?.max_guests}
                                                </span> |
                                                <span className="spec-item d-flex gap-2">
                                                    <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="bed" /> {booking?.rooms[0]?.beds?.length} bed
                                                </span> |
                                                <span className="spec-item d-flex gap-2">{booking.rooms[0].room_size_sqft} sq ft</span>
                                            </div>

                                            {/* Preference / gender lock badges */}
                                            <div className="mt-2">
                                                {booking?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && (
                                                    <p className='female-preferred'>Female PREFERRED</p>
                                                )}
                                                {booking?.rooms?.[0]?.bedroom_preference_badge === "MALE PREFERRED" && (
                                                    <span className='male-preferred'>Male PREFERRED</span>
                                                )}
                                                {booking?.rooms?.[0]?.gender_lock && booking?.rooms?.[0]?.room_type === "Twin-Sharing" && (
                                                    <>
                                                        {booking.rooms[0].gender_lock?.badge_text === "MALE BOOKED" && <span className='status-tag male-booked'>Male Booked</span>}
                                                        {booking.rooms[0].gender_lock?.badge_text === "FEMALE BOOKED" && <span className='status-tag female-booked'>Female Booked</span>}
                                                    </>
                                                )}
                                                {booking.rooms[0]?.room_type !== "Private" && (
                                                    <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>
                                                        {booking.rooms[0]?.available_beds?.length > 0
                                                            ? `${booking.rooms[0].available_beds.length} BED LEFT!`
                                                            : "NO BED LEFT!"}
                                                    </span>
                                                )}
                                            </div>

                                            <hr />

                                            {/* Traveler section */}
                                            <div className="traveler-section">
                                                <p className="mb-2 font-18">Travelers in this room</p>

                                                {/* Adult count radio buttons */}
                                                <div className="d-flex gap-3 mb-3">
                                                    {Array.from(
                                                        { length: booking?.adultCount > 2 ? booking?.adultCount : 2 },
                                                        (_, idx) => {
                                                            const count = idx + 1;
                                                            const isDisabled = booking.rooms[0].room_type === "Private" && count > 1;
                                                            return (
                                                                <div key={count} className="radio-select-box d-flex gap-2"
                                                                    style={{ background: "#F2F2F2", opacity: isDisabled ? 0.4 : 1 }}>
                                                                    <label className="form-check-label d-flex gap-2 mb-0">
                                                                        <input
                                                                            type="radio"
                                                                            name={`adult-count-${bookingIndex}`}
                                                                            checked={booking?.adultCount === count}
                                                                            disabled={isDisabled}
                                                                            onChange={() => {
                                                                                // FIX: always update bookingData regardless of index
                                                                                const updated = { ...booking, adultCount: count };
                                                                                setBookingData([updated]);
                                                                                calculateTax(
                                                                                    updated?.rooms?.[0]?.price_per_night,
                                                                                    updated?.check_in_datetime,
                                                                                    updated?.check_out_datetime
                                                                                );
                                                                                setLockedGender(null);
                                                                                setTravellers(
                                                                                    Array.from({ length: count }, () => ({
                                                                                        traveller_type: null,
                                                                                        isGenderValidation: "",
                                                                                        caretaker: null,
                                                                                        searchText: "",
                                                                                        showList: false,
                                                                                        filteredUsers: [],
                                                                                        selectedBedIndex: null
                                                                                    }))
                                                                                );
                                                                            }}
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

                                                {/* Exclusive booking — only for shared rooms */}
                                                {booking?.rooms[0]?.can_book_exclusive && booking.rooms[0].room_type !== "Private" && (
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

                                                {/* Bedroom preference banners */}
                                                {booking?.rooms[0]?.can_book_exclusive && booking.rooms[0].room_type !== "Private" && (
                                                    <>
                                                        {booking?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && (
                                                            <Row className='mb-2'>
                                                                <Col md={7}>
                                                                    <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }}>
                                                                        As this room has already been booked for a female for your selected dates, only female traveler bookings are allowed
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        )}
                                                        {booking?.rooms?.[0]?.bedroom_preference_badge === "MALE PREFERRED" && (
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

                                                {/* ── PRIVATE ROOM TRAVELLER ── */}
                                                {booking.rooms[0].room_type === "Private" ? (
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
                                                                    <div className="form-group" style={{ position: "relative" }}>
                                                                        {/* <input
                                                                            type="text"
                                                                            className="form-control user-icn2"
                                                                            placeholder="Add a traveler"
                                                                            // FIX: show dropdown on focus (boolean state)
                                                                            onFocus={() => setShowCaretakerList(true)}
                                                                            onBlur={() => setTimeout(() => setShowCaretakerList(false), 200)}
                                                                            onChange={(e) => setSearch(e.target.value)}
                                                                        /> */}
                                                                        {/* <Select
                                                                            options={filtereduserListData}
                                                                            isSearchable
                                                                            onMenuScrollToBottom={() => {
                                                                                console.log("SCROLLED");
                                                                                if (hasMore && !loading) {
                                                                                    const nextPage = page + 1;
                                                                                    setPage(nextPage);
                                                                                    getUserListData(searchKey, nextPage)
                                                                                }
                                                                            }}
                                                                            onChange={(e) => handleCaretakerSelect("", e.value)}
                                                                            components={{
                                                                                MenuList: CustomMenuList
                                                                            }}
                                                                            isLoading={loading}
                                                                            placeholder="Add a traveler"
                                                                        /> */}
                                                                        <Select
                                                                            options={filtereduserListData}
                                                                            className='react_selectbox'
                                                                            isDisabled={formData?.traveller_type ? false : true}
                                                                            isSearchable
                                                                            onInputChange={(val, { action }) => {
                                                                                if (action === "input-change") {
                                                                                    setSearch(val);
                                                                                    setSearchKey(val);
                                                                                }
                                                                            }}
                                                                            onMenuScrollToBottom={() => {
                                                                                if (hasMore && !loading) {
                                                                                    const nextPage = page + 1;
                                                                                    setPage(nextPage);
                                                                                    getUserListData(searchKey, nextPage);
                                                                                }
                                                                            }}
                                                                            onChange={(e) => handleCaretakerSelect("", e.value)}
                                                                            components={{ MenuList: CustomMenuList }}
                                                                            isLoading={loading}
                                                                            placeholder="Add a traveler"
                                                                        />
                                                                        {/* FIX: showCaretakerList is now boolean, coercion works correctly */}
                                                                        {/* {showCaretakerList && (
                                                                            <div style={{
                                                                                position: "absolute", top: "58px", left: 0, right: 0,
                                                                                background: "#f9f6f4", border: "1px solid #6B4F3F",
                                                                                zIndex: 10, padding: "16px", maxHeight: "300px", overflowY: "auto"
                                                                            }}>
                                                                                {filtereduserListData?.length > 0 ? (
                                                                                    <>
                                                                                        {filtereduserListData.map((user, idx) => (
                                                                                            <div key={user.value} className="managers-data"
                                                                                                style={{
                                                                                                    display: "flex", alignItems: "center",
                                                                                                    marginBottom: "18px",
                                                                                                    borderBottom: idx < filtereduserListData.length - 1 ? "1px solid #ececec" : "none",
                                                                                                    paddingBottom: "15px", cursor: "pointer"
                                                                                                }}
                                                                                                onMouseDown={(e) => e.preventDefault()}
                                                                                                onClick={() => handleCaretakerSelect("", user.value)}
                                                                                            >
                                                                                                <Image
                                                                                                    src={user?.icon ? user?.icon : user?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                                                                                                    alt={user?.label}
                                                                                                    width={48} height={48}
                                                                                                    style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
                                                                                                />
                                                                                                <div>
                                                                                                    <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>{user.label}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                        <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
                                                                                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
                                                                                                {`Can't find someone?`}<br />
                                                                                                <Link onClick={addTravel} href="#" style={{ color: "#463527" }}>Register a new traveler</Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                ) : (
                                                                                    <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
                                                                                        <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
                                                                                        <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
                                                                                        <Link href="/People" style={{ background: "#6B4F3F", color: "white", padding: "10px 20px", width: "100%", display: "block", textAlign: "center", textDecoration: "none" }}>
                                                                                            Invite to Join
                                                                                        </Link>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )} */}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Selected private room traveller card */}
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
                                                                                    src={item?.profile_image ? item?.profile_image : item?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                                                                                    alt={item?.first_name}
                                                                                    width={48} height={48}
                                                                                    style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
                                                                                />
                                                                                <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                                    {item?.first_name} {item?.last_name}
                                                                                    <br />
                                                                                    {formData.traveller_type !== "External" && (
                                                                                        <>
                                                                                            <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
                                                                                                Emp. id: {item?.employee_id}
                                                                                            </span>
                                                                                            <br />
                                                                                            <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
                                                                                                Dept: {item?.segment}
                                                                                            </span>
                                                                                            <span style={{ color: "#73615F" }}>|</span>
                                                                                        </>
                                                                                    )}
                                                                                    {formData.caretakerGenderValid === true && (
                                                                                        <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>
                                                                                    )}
                                                                                    {formData.caretakerGenderValid === false && (
                                                                                        <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>
                                                                                    )}
                                                                                </span>
                                                                                <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                    <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
                                                                                    {item?.phone_number}
                                                                                </span>
                                                                                <span style={{ color: "#73615F" }}>|</span>
                                                                                <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                    <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
                                                                                    {item?.email}
                                                                                </span>
                                                                                <span style={{ color: "#73615F" }}>|</span>
                                                                                <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                    <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
                                                                                    {item?.gender}
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
                                                    /* ── TWIN-SHARING TRAVELLER ROWS ── */
                                                    /* ── TWIN-SHARING TRAVELLER ROWS ── */
                                                    travellers.map((row, rowIndex) => {
                                                        // Per-row option list: combine filteredUsers + cached selected user
                                                        const rowOptions = row.filteredUsers.map(user => ({
                                                            value: user.uid,
                                                            label: `${user.first_name} ${user.last_name}`,
                                                            gender: user.gender,
                                                            icon: user.profile_image,
                                                            _raw: user,
                                                        }));

                                                        // Page tracking per row
                                                        // (add `page: 1, hasMore: true` to each traveller object in setTravellers)
                                                        const selectedOption = row.caretaker
                                                            ? rowOptions.find(o => o.value === row.caretaker) || (() => {
                                                                const cached = selectedUsersCache.current[row.caretaker];
                                                                return cached
                                                                    ? { value: cached.uid, label: `${cached.first_name} ${cached.last_name}`, gender: cached.gender, icon: cached.profile_image, _raw: cached }
                                                                    : null;
                                                            })()
                                                            : null;

                                                        return (
                                                            <div key={rowIndex} className="property-list-2">
                                                                <div className="row mt-3 mb-3">

                                                                    <div className="col-md-4">
                                                                        <Select
                                                                            options={travelOption}
                                                                            placeholder="Choose Role"
                                                                            className='react_selectbox'
                                                                            isSearchable={false}
                                                                            styles={customStyles}
                                                                            onChange={(e) => handleTravellerTypeChange(rowIndex, e.value)}
                                                                            components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                                                        />
                                                                    </div>

                                                                    <div className="col-md-3">
                                                                        <Select
                                                                            options={chooseBeds.filter(bed =>
                                                                                !travellers.some((t, i) => i !== rowIndex && t.selectedBedIndex === bed.value)
                                                                            )}
                                                                            placeholder="Choose Bed"
                                                                            isSearchable={false}
                                                                            styles={customStyles}
                                                                            value={chooseBeds.find(b => b.value === row?.selectedBedIndex) || null}
                                                                            onChange={(e) => {
                                                                                setTravellers(prev =>
                                                                                    prev.map((item, i) =>
                                                                                        i === rowIndex ? { ...item, selectedBedIndex: e.value } : item
                                                                                    )
                                                                                );
                                                                            }}
                                                                            className='react_selectbox'
                                                                        />
                                                                    </div>

                                                                    <div className="col-md-5">
                                                                        <Select
                                                                            options={rowOptions}
                                                                            className='react_selectbox'
                                                                            isDisabled={row?.traveller_type ? false : true}
                                                                            isSearchable
                                                                            placeholder="Add a traveler"
                                                                            styles={{
                                                                                ...customStyles,
                                                                                control: (base, state) => ({
                                                                                    ...customStyles.control(base, state),
                                                                                    borderColor:
                                                                                        row.isGenderValidation === "Error"
                                                                                            ? "#dc3545"
                                                                                            : row.isGenderValidation === "Success"
                                                                                                ? "#2C734A"
                                                                                                : state.isFocused ? "#6B4F3F" : "#ced4da",
                                                                                }),
                                                                            }}
                                                                            value={selectedOption}
                                                                            inputValue={row.searchText}
                                                                            onInputChange={(val, { action }) => {
                                                                                if (action === "input-change") {
                                                                                    setTravellers(prev =>
                                                                                        prev.map((item, i) =>
                                                                                            i === rowIndex ? { ...item, searchText: val } : item
                                                                                        )
                                                                                    );
                                                                                    debouncedFetchUsersForRow(rowIndex, val, row.traveller_type);
                                                                                }
                                                                            }}
                                                                            onFocus={() => {
                                                                                fetchUsersForRow(rowIndex, row.searchText, row.traveller_type);
                                                                            }}
                                                                            onChange={(opt) => {
                                                                                if (opt) handleCaretakerSelect(rowIndex, opt.value);
                                                                            }}
                                                                            isLoading={rowSearchLoading[rowIndex]}
                                                                            // Inside the Twin-Sharing Select (col-md-5)
                                                                            onMenuScrollToBottom={() => {
                                                                                const currentRow = travellers[rowIndex];
                                                                                if (currentRow?.hasMore && !rowSearchLoading[rowIndex]) {
                                                                                    const nextPage = (currentRow.page || 1) + 1;
                                                                                    fetchUsersForRow(rowIndex, currentRow.searchText, currentRow.traveller_type, nextPage);
                                                                                }
                                                                            }}
                                                                            // components={{
                                                                            //     Option: CustomOption,
                                                                            //     MenuList: ({ children, innerRef, innerProps }) => (
                                                                            //         <div
                                                                            //             ref={innerRef}
                                                                            //             {...innerProps}
                                                                            //             style={{ maxHeight: 200, overflowY: "auto" }}
                                                                            //         >
                                                                            //             {children}
                                                                            //             {rowSearchLoading[rowIndex] && (
                                                                            //                 <div style={{ padding: 10, fontSize: 13, color: "#73615F" }}>Loading...</div>
                                                                            //             )}
                                                                            //             <div style={{ padding: "12px", borderTop: "1px solid #eee" }}>
                                                                            //                 <span style={{ fontSize: 13, color: "#463527" }}>{"Can't find someone?"}</span>
                                                                            //                 <br />
                                                                            //                 <Link
                                                                            //                     href="#"
                                                                            //                     onClick={addTravel}
                                                                            //                     style={{ textDecoration: "underline", fontWeight: 500, color: "#6B4F3F", fontSize: 13 }}
                                                                            //                 >
                                                                            //                     Register a new traveler
                                                                            //                 </Link>
                                                                            //             </div>
                                                                            //         </div>
                                                                            //     ),
                                                                            // }}
                                                                            components={{
                                                                                Option: CustomOption,
                                                                                MenuList: ({ children, innerRef, innerProps }) => (
                                                                                    <div
                                                                                        ref={innerRef}
                                                                                        {...innerProps}
                                                                                        style={{
                                                                                            maxHeight: 200,
                                                                                            overflowY: "auto",
                                                                                            scrollBehavior: "smooth",         // ✅ add this
                                                                                            WebkitOverflowScrolling: "touch", // ✅ add this
                                                                                        }}
                                                                                    >
                                                                                        {children}
                                                                                        {rowSearchLoading[rowIndex] && (
                                                                                            <div style={{ padding: 10, fontSize: 13, color: "#73615F", textAlign: "center" }}>Loading...</div>
                                                                                        )}
                                                                                        <div style={{ padding: "12px", borderTop: "1px solid #eee" }}>
                                                                                            <span style={{ fontSize: 13, color: "#463527" }}>{"Can't find someone?"}</span>
                                                                                            <br />
                                                                                            <Link href="#" onClick={addTravel} style={{ textDecoration: "underline", fontWeight: 500, color: "#6B4F3F", fontSize: 13 }}>
                                                                                                Register a new traveler
                                                                                            </Link>
                                                                                        </div>
                                                                                    </div>
                                                                                ),
                                                                            }}
                                                                        />

                                                                        {row.isGenderValidation === "Error" && (
                                                                            <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
                                                                                ✕ Gender validation failed — this traveler is not allowed in this room
                                                                            </p>
                                                                        )}
                                                                        {row.isGenderValidation === "Success" && !row.caretaker && (
                                                                            <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>✓ Gender validated</p>
                                                                        )}
                                                                    </div>

                                                                    {/* Selected traveller card — unchanged */}
                                                                    <div className="col-md-12">
                                                                        {row.caretaker && (() => {
                                                                            const found =
                                                                                selectedUsersCache.current[row.caretaker] ||
                                                                                userListData.find(u => u.uid === row.caretaker) ||
                                                                                row.filteredUsers?.find(u => u.uid === row.caretaker);
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
                                                                                                src={found?.profile_image || (found.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg")}
                                                                                                alt={found?.first_name}
                                                                                                width={48} height={48}
                                                                                                style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
                                                                                            />
                                                                                            <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                                                {found?.first_name} {found?.last_name}
                                                                                                <br />
                                                                                                {row?.traveller_type !== "External" && (
                                                                                                    <>
                                                                                                        <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
                                                                                                            Emp. id: {found?.employee_id}
                                                                                                        </span>
                                                                                                        <br />
                                                                                                        <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
                                                                                                            Dept: {found?.segment}
                                                                                                        </span>
                                                                                                    </>
                                                                                                )}
                                                                                                {row.isGenderValidation === "Success" && (
                                                                                                    <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>
                                                                                                )}
                                                                                                {row.isGenderValidation === "Error" && (
                                                                                                    <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>
                                                                                                )}
                                                                                            </span>
                                                                                            <span style={{ color: "#73615F" }}>|</span>
                                                                                            <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                                <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
                                                                                                {found?.phone_number}
                                                                                            </span>
                                                                                            <span style={{ color: "#73615F" }}>|</span>
                                                                                            <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                                <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
                                                                                                {found?.email}
                                                                                            </span>
                                                                                            <span style={{ color: "#73615F" }}>|</span>
                                                                                            <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                                <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
                                                                                                {found?.gender}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="show-edit-btn">
                                                                                            <Button variant="" className="edit-btn ms-1 me-1"
                                                                                                onClick={() => router.push(`/People?guest_uid=${found?.uid}&show=true`)}>
                                                                                                Edit details
                                                                                            </Button>
                                                                                            <button type="button" className="ms-auto"
                                                                                                onClick={() => handleCaretakerSelect(rowIndex, null)}
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
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className='d-flex gap-2 fw-medium justify-content-end'>
                                        Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='right-a' width={8} height={8} />
                                    </p>

                                    {/* ── Arrival Details ── */}
                                    <div className="arrival-section border-top mt-4 pt-5 mb-5">
                                        {/* <h3 className="font-24 mb-2">Arrival Details (Optional)</h3> */}
                                        <h3 className="font-24 mb-2">Arrival Details</h3>
                                        <p className="text-secondary mb-2">
                                            This information helps in operational planning, legal compliance, and personalized service.
                                        </p>
                                        <Form.Group className='mb-4 mt-4' controlId="arrival_time">
                                            {/* <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label> */}
                                            <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House </Form.Label>
                                            <Select
                                                onChange={(e) => updateArrivalDetails("arrival_time", e.value)}
                                                options={timeOption}
                                                placeholder="Select time"
                                                className="react_selectbox"
                                                isSearchable={false}
                                                styles={customStyles}
                                            />
                                        </Form.Group>
                                        <Form.Group className='mb-4' controlId="mode_of_arrival">
                                            {/* <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label> */}
                                            <Form.Label className="mb-2 fw-semibold">Mode of Arrival </Form.Label>
                                            <Select
                                                options={arrivalOption}
                                                placeholder="Select Mode"
                                                className="react_selectbox"
                                                isSearchable={false}
                                                styles={customStyles}
                                                value={arrivalOption.find(opt => opt.value === formData.arrival_details.mode_of_arrival) || null}
                                                onChange={(e) => updateArrivalDetails("mode_of_arrival", e.value)}
                                            />
                                        </Form.Group>
                                        <div className='mb-4 form-group'>
                                            {/* <Form.Label className="mb-2 fw-semibold">Flight / Train Number</Form.Label> */}
                                            <Form.Label className="mb-2 fw-semibold">Flight / Train Number </Form.Label>
                                            <input type="text" className="form-control"
                                                placeholder="Enter number e.g. MADGAON LTT EXP #11100"
                                                value={formData.arrival_details.transport_number}
                                                onChange={(e) => updateArrivalDetails("transport_number", e.target.value)} />
                                        </div>
                                    </div>

                                    <hr />

                                    {/* ── Additional Comments ── */}
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

                                    {/* ── Other Essential Details ── */}
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

                                    {/* ── Confirmation Email ── */}
                                    <div className="confirmation-email-section my-5 pb-5">
                                        <label className='mb-0 d-flex gap-2 align-items-center show-my-booking w-auto mb-3'
                                            style={{ maxWidth: '360px', cursor: 'pointer' }}>
                                            <Form.Check
                                                type="checkbox"
                                                label="Send copy of confirmation email"
                                                checked={formData.send_confirmation_email}
                                                onChange={(e) => {
                                                    updateFormData("send_confirmation_email", e.target.checked);
                                                    setIsEmailEnabled(e.target.checked);
                                                    setReceivers(e.target.checked ? [{ id: 1, email: '' }] : []);
                                                }}
                                            />
                                        </label>

                                        {isEmailEnabled && (
                                            <div className="email-content">
                                                <p className='fw-bold mb-3' style={{ color: '#6B4F3F' }}>Add info</p>
                                                {receivers.map((receiver, idx) => (
                                                    <div key={receiver.id} className="receiver-item">
                                                        {idx > 0 && (
                                                            <>
                                                                <hr className="my-4" />
                                                                <p className='fw-bold mb-3'>Receiver {idx + 1}</p>
                                                            </>
                                                        )}
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
                                                                        <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0"
                                                                            disabled={receivers.length >= 5}>
                                                                            <Image src='./images/icons/add_circle.svg' alt='Add' width={32} height={32}
                                                                                style={{ opacity: receivers.length >= 5 ? 0.5 : 1 }} />
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
                                                {receivers.length >= 5 && (
                                                    <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>
                                                )}
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
                                                    <span className="summary-value">1</span>
                                                </div>
                                                <div className="summary-row">
                                                    <span className="summary-label">Number of Rooms</span>
                                                    <span className="summary-value">1 Room</span>
                                                </div>
                                                <div className="summary-row">
                                                    <span className="summary-label">Travelers</span>
                                                    <span className="summary-value">{booking?.adultCount || 1} Adult{(booking?.adultCount || 1) > 1 ? "s" : ""}</span>
                                                </div>
                                                <div className="summary-row detailed">
                                                    <span className="summary-label">{booking.rooms[0].room_name} Pricing</span>
                                                    <div className="summary-value-detailed">
                                                        <div className="price-desc">
                                                            {/* {booking?.adultCount || 1} Guest x {Math.floor(calculateNights(booking.check_in_datetime, booking.check_out_datetime))} nights */}
                                                            {booking?.adultCount || 1} Guest x {calculateNights(booking.check_in_datetime, booking.check_out_datetime)} nights
                                                        </div>
                                                        {showPrices && <div className="price-amount">₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
                                                        <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
                                                    </div>
                                                </div>
                                                <div className="summary-row detailed">
                                                    <span className="summary-label">Taxes</span>
                                                    <div className="summary-value-detailed">
                                                        {showPrices && <div className="price-amount">₹{tax?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
                                                        <button onClick={addbreakdown} className="breakdown-btn">Price breakdown</button>
                                                    </div>
                                                </div>
                                                <div className="total-section">
                                                    <span className="total-label">Total Price</span>
                                                    <div className="total-value-detailed">
                                                        <div className="total-desc">
                                                            {/* {booking?.adultCount || 1} Guest x {Math.floor(calculateNights(booking.check_in_datetime, booking.check_out_datetime))} nights */}
                                                            {booking?.adultCount || 1} Guest x {calculateNights(booking.check_in_datetime, booking.check_out_datetime)} nights
                                                        </div>
                                                        {showPrices && <div className="total-amount">₹{total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
                                                        <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleSubmitReserve}
                                                className="confirm-btn"
                                                disabled={isSubmitting}
                                                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                                            >
                                                {isSubmitting ? "Validating & Reserving..." : "Confirm and Reserve"}
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </React.Fragment>
                        ))}
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
                                    <Select options={companyList} placeholder="Select company" className="react_selectbox"
                                        isSearchable={false}
                                        isDisabled={companyList.length > 1 ? false : true}
                                        // value={companyList?.find(c => c.value === searchFieldData.c_uid) || null}
                                        value={companyList?.find(c => c.value === searchFieldData.c_uid)
                                            || (searchFieldData.company_name ? { value: searchFieldData.c_uid, label: searchFieldData.company_name } : null)}
                                        onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.id, company_name: opt.label, c_uid: opt.value, city: '' })}
                                        styles={customStyles} />
                                </div>
                            </Col>
                            <Col md={2} className='gap-1'>
                                <div className='form-group'>
                                    <label className='text-black'>Where to?</label>
                                    <Select options={cityList} placeholder="Select city" className="react_selectbox"
                                        isSearchable={false}
                                        // getOptionLabel={(o) => o.city} getOptionValue={(o) => o.city}
                                        // value={cityList?.find(c => c.value === searchFieldData.city) || null}
                                        value={cityList?.find(c => c.value === searchFieldData.city)
                                            || (searchFieldData.city ? { value: searchFieldData.city, label: searchFieldData.city } : null)}
                                        onChange={(o) => setSearchFieldData({ ...searchFieldData, city: o.value })}
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

            {/* ── Add Person Modal ── */}
            <AddPersonModel
                addTravels={addTravels}
                removeTravel={removeTravel}
                roleOption={role}
                companyList={companyList}
                addTravel={addTravel}
                loadMoreCompanies={loadMoreCompanies}
                setSearchComp={setSearchKey}
                getUserListData={getUserListData}
            />

            {/* ── Price Breakdown Modal ── */}
            <Modal show={addBreakdowns} onHide={removeBreakdown} animation={false} centered size="md" className='custom-theme-modal-2 status-height-70'>
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom'>
                    <Modal.Title style={{ fontSize: '20px', fontFamily: 'Gilroy', fontWeight: '500' }}>Total Price breakdown</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeBreakdown} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='booking-filter'>
                        <div className='d-flex justify-between pb-2'>
                            <span>{breakdownText()}</span>
                            <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className='d-flex justify-between pt-2 pb-2'>
                            <span>CasaMelhor Service fee</span>
                            <span style={{ color: '#BF9039', fontWeight: '500' }}>₹0</span>
                        </div>
                        <div className='d-flex justify-between pt-2 pb-2'>
                            <span>Taxes</span>
                            <span style={{ color: '#BF9039', fontWeight: '500' }}>₹{tax?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between'>
                    <span className='fs-20'>Total</span>
                    <span className='fs-20' style={{ color: '#BF9039', fontWeight: '500' }}>₹{total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </Modal.Footer>
            </Modal>

            {/* ── Booking Confirmed Modal ── */}
            {/* <Modal show={showReserveModal} onHide={removeReserve} animation={false} backdrop="static" centered className='custom-theme-modal-2 modal-460'> */}
            <Modal show={showReserveModal} onHide={removeReserve} animation={false} backdrop={true} centered className='custom-theme-modal-2 modal-460'>
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
                    <Link href={`/BookingDetails/${bookingConfirmedData[0]?.booking_uid}`}
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