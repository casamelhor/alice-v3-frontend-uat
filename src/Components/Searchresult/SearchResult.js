// "use client"
// import React, { useEffect, useState } from 'react'
// import Header from '../Header/Header'
// // import { useEffect, useState } from "react";
// import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form, Accordion, Label } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { AriaOnFocus } from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { BasicBookingSearch, CartValidationPost, companyListAPI, getCompanyPropertiesCitiesAPI, PropertyListFullApi, SmartBookingSearch } from '@/services/provider';
// import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
// import { alert_danger, showErrorMsg } from '@/utils/Alerts/TostifyAlerts';
// import { ToastContainer } from 'react-toastify';
// import { calculateNights, formatDateMonthYear, formatYMD } from '@/utils/formatTime';
// import dynamic from "next/dynamic";
// import toast, { Toaster } from 'react-hot-toast';

// export default function SearchResult() {


//     const PropertyMap = dynamic(
//         () => import("../PropertyMap"),
//         {
//             ssr: false,
//         }
//     );

//     const fullText =
//         "The Room 3 is part of the Luxuriously furnished 6 bed apartment with Panoramic Sea View next to the palm beach road. Presenting beautiful and mesmerizing views of sunsets from each room and glittering views of Palm beach road in the night.";

//     const shortText =
//         "The Room 3 is part of the Luxuriously furnished 6 bed apartment with Panoramic Sea View next to the palm beach road...";

//     const [showFull, setShowFull] = useState(false);
//     const [showAll, setShowAll] = useState(false);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));


//     const [isSmartSearchEnabled, setIsSmartSearchEnabled] = useState(false);
//     const [optionSearch, setOptionSearch] = useState({ gender: 'Female', budget: '' })
//     const [SmartSearchResult, setSmartSearchResult] = useState({});
//     const [selectedPropertyUID, setSelectedPropertyUID] = useState(null);
//     const [selectedPropertyName, setSelectedPropertyName] = useState("");
//     const [selectedRoomName, setSelectedRoomName] = useState("");
//     const [selectedRoomPeriods, setSelectedRoomPeriods] = useState([]);
//     // const [selectedDate, setStartDate] = useState(null);
//     const [selectsRange, setSelectsRange] = useState(null);



//     const router = useRouter();

//     // const Detailurl = () => {
//     //     router.push('/ViewDetailsResult');
//     // };

//     const handleChangeDatesClick = (property, room) => {
//         setSelectedRoomPeriods(room?.booking_info?.booked_periods || []);
//         setSelectedPropertyName(property?.property_name || "");
//         setSelectedRoomName(room?.room_name || "");
//         setSelectedPropertyUID(property?.property_uid);

//         const bookedRanges = room?.booking_info?.booked_periods?.map(cv => ({
//             start: new Date(cv?.check_in_datetime),
//             end: new Date(cv?.check_out_datetime)
//         })) || [];

//         setBookedRangeDates(bookedRanges);


//         marknoShowsetShow(true);


//     };


//     const formatDateForApi = (date) => {
//         if (!date) return null;

//         const d = new Date(date);
//         const year = d.getFullYear();
//         const month = String(d.getMonth() + 1).padStart(2, "0");
//         const day = String(d.getDate()).padStart(2, "0");

//         return `${year}-${month}-${day}`;
//     };



//     // const Detailurl = async () => {

//     //     if (!startDate || !endDate) {
//     //         alert("Please select check-in and check-out dates");
//     //         return;
//     //     }

//     //     const payload = {
//     //         ...bacisSearchDetails,

//     //         check_in_date: formatDateForApi(startDate),
//     //         check_out_date: formatDateForApi(endDate),

//     //         property_uid: selectedPropertyUID
//     //     };

//     //     console.log("Final Payload:", payload);

//     //     try {

//     //         const response = await BasicBookingSearch(payload);

//     //         if (response?.data?.success) {


//     //             localStorage.setItem(
//     //                 "basicSecrchItemObj",
//     //                 JSON.stringify(payload)
//     //             );

//     //             router.push(
//     //                 `/ViewDetailsResult?property_uid=${selectedPropertyUID}`
//     //             );
//     //         }

//     //     } catch (err) {

//     //         console.log("API error:", err);

//     //     }
//     // };


//     const Detailurl = async () => {

//         const payload = {
//             ...bacisSearchDetails,
//             check_in_date: formatDateForApi(startDate),
//             check_out_date: formatDateForApi(endDate),
//             property_uid: selectedPropertyUID
//         };

//         console.log("Payload:", payload);

//         try {
//             const response = await BasicBookingSearch(payload);

//             if (response?.data?.success) {
//                 setItemLocalStorage("basicSecrchItemObj", JSON.stringify(payload));
//                 // redirect with property_uid
//                 router.push(`/ViewDetailsResult?property_uid=${selectedPropertyUID}`);

//             }

//         } catch (err) {
//             console.log("API error:", err);
//         }
//     };





//     const sortoption = [
//         { value: "lowest-price", label: "Lowest Price" },
//         { value: "highest-price", label: "Highest Price" }
//     ]

//     const [addTravels, addTravelsetShow] = useState(false);

//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);



//     const roomoption = [
//         { value: "Male", label: "Male" },
//         { value: "Female", label: "Female" },
//         { value: "Any", label: "Any" }
//     ]


//     // 


//     const budgetoption = [
//         { value: "0-1000", label: "0 - 1000 " },
//         { value: "1000-50001", label: "1000 to 5000 " },
//         { value: "5000", label: "5000+" }
//     ]



//     // 

//     const [filtermShow, setFiltersetShow] = useState(false);
//     const [seletedRoomData, setSelectedRoomData] = useState(null)

//     const filterClose = () => { setFiltersetShow(false); setSelectedRoomData(null) };
//     const filterShow = (room, adults) => {
//         setFiltersetShow(true);
//         const filteredData =
//             bookingRoomsData?.[0]?.properties
//                 ?.map(prop => {
//                     const selectedRooms = prop.rooms.filter(
//                         selectedRoom => selectedRoom.room_uid === room.room_uid
//                     );

//                     // Skip property if no matching room
//                     if (!selectedRooms.length) return null;

//                     return {
//                         ...prop,
//                         rooms: selectedRooms,
//                         adultCount: adults,
//                     };
//                 })
//                 .filter(Boolean) || [];

//         setSelectedRoomData(filteredData);
//     };


//     // 


//     const [marknoShowsModal, marknoShowsetShow] = useState(false);

//     const marknoShowClose = () => marknoShowsetShow(false);
//     const marknoShowModal = () => marknoShowsetShow(true);


//     // 


//     const [filtermShow1, filtersetShow1] = useState(false);

//     const filterClose1 = () => filtersetShow1(false);
//     const filterShow1 = () => filtersetShow1(true);


//     const [filtermShow2, filtersetShow2] = useState(false);

//     const filterClose2 = () => filtersetShow2(false);
//     const filterShow2 = () => filtersetShow2(true);



//     const [filtermShow3, filtersetShow3] = useState(false);

//     const filterClose3 = () => filtersetShow3(false);
//     const filterShow3 = () => filtersetShow3(true);


//     // 


//     const [showPrices, setShowPrices] = useState(false);
//     const [roomType, setRoomType] = useState("Private")

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

//     const [searchFieldData, setSearchFieldData] = useState(
//         {
//             company_id: 0,
//             city: "",
//             check_in_date: "",
//             check_out_date: "",
//             rooms: [],
//             c_uid: "",
//             // room_type_preference: "Any",
//             // budget_range: {
//             //     min: 0,
//             //     max: 0
//             // },
//             availability: Boolean,
//             company_name: "",
//             // sort_by: "availability",
//             // gender_filter: "Male"
//         }
//     )

//     const [companyList, setCompanyList] = useState([]);
//     const [cityList, setCityList] = useState([]);
//     // const getProprtyList = async () => {
//     //     try {
//     //         const response = await PropertyListFullApi("all");
//     //         if (response?.data?.success) {
//     //             //                 const uniqueCities = [
//     //             //   ...new Set(response.data.response.map(ele => ele.city))
//     //             // ].map(city => ({ city }));
//     //             const uniqueCities = [
//     //                 { city: "Jaipur" },
//     //                 ...Array.from(
//     //                     new Set(response.data.response.map(ele => ele.city)),
//     //                     city => ({ city })
//     //                 ).filter(item => item.city !== "Jaipur")
//     //             ];
//     //             setCityList(uniqueCities)
//     //         }

//     //     } catch (error) {
//     //         console.log("Company API Error: ", error);
//     //     }
//     // };
//     // const getProprtyList = async () => {
//     //     try {
//     //         const response = await PropertyListFullApi("all");
//     //         if (response?.data?.success) {
//     //             //                 const uniqueCities = [
//     //             //   ...new Set(response.data.response.map(ele => ele.city))
//     //             // ].map(city => ({ city }));
//     //             // const uniqueCities = [
//     //             //     { city: "Jaipur" },
//     //             //     ...Array.from(
//     //             //         new Set(response.data.response.map(ele => ele.city)),
//     //             //         city => ({ city })
//     //             //     ).filter(item => item.city !== "Jaipur")
//     //             // ];
//     //             // setCityList(uniqueCities)
//     //             setAllListCity(response.data.response)
//     //         }

//     //     } catch (error) {
//     //         console.log("Company API Error: ", error);
//     //     }
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
//                 const list = response.data.response?.filter(item => !item?.is_company_inactive)?.map(item => ({
//                     value: item.id,
//                     label: item.company_name,
//                     uid: item.uid
//                 }));
//                 setCompanyList(list);
//             }
//         } catch (error) {
//             console.log("Company API Error: ", error);
//         }
//     };

//     useEffect(() => {
//         getCompanyList();
//         // getProprtyList();
//         if (bacisSearchDetails) {
//             setSearchFieldData({
//                 company_id: bacisSearchDetails.company_id,
//                 city: bacisSearchDetails.city,
//                 check_in_date: bacisSearchDetails.check_in_date,
//                 check_out_date: bacisSearchDetails.check_out_date,
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults })),
//                 availability: bacisSearchDetails?.availability,
//                 company_name: bacisSearchDetails.company_name,
//                 c_uid: bacisSearchDetails.c_uid
//             })
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: rooms.length, adults: val.adults })))
//         }
//     }, []);

//     useEffect(() => {
//         if (companyList.length === 1) {
//             setSearchFieldData({ ...searchFieldData, company_id: companyList?.[0].value,company_name:companyList?.[0]?.label,c_uid:companyList?.[0]?.uid })
//         }
//     }, [companyList]);

//     useEffect(() => {
//         if (searchFieldData.c_uid) {
//             getLocationOfProperty(searchFieldData.c_uid)
//         }
//     }, [searchFieldData.c_uid])

//     // useEffect(() => {
//     //     if (searchFieldData.company_name) {
//     //         const filteredProperties = AllListCity.filter(property =>
//     //             property.assigned_companies?.some(
//     //                 company => company.company_name === searchFieldData.company_name
//     //             )
//     //         );
//     //         const uniqueCities = [
//     //             ...Array.from(
//     //                 new Set(filteredProperties.map(ele => ele.city)),
//     //                 city => ({ city })
//     //             ).filter(item => item.city !== "Jaipur")
//     //         ];
//     //         setCityList(uniqueCities)
//     //     }

//     // }, [searchFieldData.company_name, AllListCity])


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


//     // 


//     // const [selectedDate, setStartDate] = useState(
//     //     new Date("2025/10/1")
//     // );
//     // const [endDate, setEndDate] = useState(
//     //     new Date("2025/10/1")

//     // );

//     const [dateRange, setDateRange] = useState([null, null]);
//     const [startDate, endDate] = dateRange;
//     const [bookedRangeDates, setBookedRangeDates] = useState([]);
//     const isDateAvailable = (date) => {
//         return !bookedRangeDates.some(
//             (range) =>
//                 date >= range.start && date <= range.end
//         );
//     };


//     const amenities = [
//         { icon: "/images/icons/work.svg", label: "Business services" },
//         { icon: "/images/icons/concierge.svg", label: "Concierge" },
//         { icon: "/images/icons/qr_code.svg", label: "Digital check-in" },
//         { icon: "/images/icons/fitness_center.svg", label: "Fitness center" },
//         { icon: "/images/icons/wifi.svg", label: "Free internet access" },
//         { icon: "/images/icons/local_parking.svg", label: "Free parking" },
//         { icon: "/images/icons/laundry.svg", label: "Laundry" },
//         { icon: "/images/icons/interpreter_mode.svg", label: "Meeting facilities" },
//         { icon: "/images/icons/pool.svg", label: "Pool" },
//         { icon: "/images/icons/in_home_mode.svg", label: "Resort property" },
//         { icon: "/images/icons/room_service.svg", label: "Room service" },

//         { icon: "./images/icons/amenities-icon/Air-Conditioning.svg", label: "Air conditioning" },
//         { icon: "./images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
//         { icon: "./images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
//         { icon: "./images/icons/amenities-icon/Serves-Breakfast.svg", label: "Serves Breakfast" },
//         { icon: "./images/icons/amenities-icon/Serves-Lunch.svg", label: "Serves Lunch" },
//         { icon: "./images/icons/amenities-icon/Serves-Dinner.svg", label: "Serves Dinner" },
//         { icon: "./images/icons/amenities-icon/BuzzerWireless.svg", label: "Buzzer/Wireless" },
//         { icon: "./images/icons/amenities-icon/intercom.svg", label: "Intercom" },
//         { icon: "./images/icons/amenities-icon/elevator-building.svg", label: "Elevator in Building" },
//         { icon: "./images/icons/amenities-icon/parking.svg", label: "Parking  " },
//         { icon: "./images/icons/amenities-icon/laundry.svg", label: "Laundry" },
//         { icon: "./images/icons/amenities-icon/Access-to-kitchen.svg", label: "Access to Kitchen" },
//         // { icon: "./images/icons/amenities-icon/Swimming-pool.svg", label: "Swimming Pool" },
//         { icon: "./images/icons/amenities-icon/Air-Conditioning.svg", label: "Gym" },
//         // { icon: "./images/icons/amenities-icon/gym.svg", label: "Air Conditioning" },
//     ];

//     // Show only first 6 amenities initially
//     const visibleAmenities = showAll ? amenities?.filter(item => seletedRoomData?.[0]?.rooms?.[0]?.room_amenities?.includes(item.label)) : amenities?.filter(item => seletedRoomData?.[0]?.rooms?.[0]?.room_amenities?.includes(item.label))?.slice(0, 4);
//     const [bookingRoomsData, setBookingRoomsData] = useState([])
//     const [responseSearchData, setResponseSearchData] = useState(null)
//     const [roomsCountForOption, setRoomCountForOption] = useState(0)
//     const [bookingMultiRoomsData, setBookingMultiRoomsData] = useState([]);
//     const [bookingRoomsDataUnfilterd, setBookingRoomsDataUnfilterd] = useState([])
//     const [mapDataArr, setMapDataArr] = useState([])

//     const fetchSearchResult = async (payload) => {
//         try {
//             const response = await BasicBookingSearch(payload);
//             if (response?.data?.success) {
//                 setResponseSearchData(response?.data?.response?.search_params)
//                 setBookingMultiRoomsData(response?.data?.response?.bedrooms)
//                 const totalRooms = response?.data?.response?.bedrooms.reduce(
//                     (sum, item) =>
//                         sum +
//                         item.properties.reduce(
//                             (pSum, p) => pSum + (p.rooms?.length || 0),
//                             0
//                         ),
//                     0
//                 );
//                 setRoomCountForOption(totalRooms)
//                 setBookingRoomsDataUnfilterd(response?.data?.response?.bedrooms)
//                 setBookingRoomsData(response?.data?.response?.bedrooms.map(bed => ({
//                     ...bed,
//                     properties: bed.properties
//                         .map(property => ({
//                             ...property,
//                             rooms: property.rooms.filter(room => room.room_type === roomType)
//                         }))
//                         .filter(property => property.rooms.length > 0)
//                 }))
//                     .filter(bed => bed.properties.length > 0))
//                 setMapDataArr(response?.data?.response?.bedrooms.flatMap(item =>
//                     item.properties.map(prop => ({
//                         lat: prop?.latitude,
//                         lng: prop?.longitude,
//                         address: prop?.address
//                     }))
//                 ))
//                 removeItemLocalStorage("searchForm")
//                 localStorage.setItem("basicSecrchItemObj", JSON.stringify(payload))
//                 removeTravel()
//             } else {
//                 setItemLocalStorage("bacisSearchApiError", JSON.stringify(response.data.response))
//                 router.push('/CreateBooking');
//             }

//         } catch (error) {
//             console.log("Company API Error: ", error);
//             router.push('/CreateBooking');
//         }
//     }

//     useEffect(() => {
//         setBookingRoomsData(bookingRoomsDataUnfilterd
//             .map(bed => ({
//                 ...bed,
//                 properties: bed.properties
//                     .map(property => ({
//                         ...property,
//                         rooms: property.rooms.filter(room => room.room_type === roomType)
//                     }))
//                     .filter(property => property.rooms.length > 0)
//             }))
//             .filter(bed => bed.properties.length > 0))
//     }, [roomType])

//     useEffect(() => {
//         if (!!bacisSearchDetails) {
//             fetchSearchResult(bacisSearchDetails)
//         }
//     }, [])

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

//     const handleUpdateSearch = () => {
//         if (isSmartSearchEnabled) {
//             getSmartSearchData()
//         } else {
//             fetchSearchResult(searchFieldData)
//         }
//     }

//     const getSmartSearchData = async () => {
//         try {
//             const payload = {
//                 company_id: searchFieldData.company_id,
//                 city: searchFieldData.city,
//                 check_in_date: searchFieldData.check_in_date,
//                 check_out_date: searchFieldData.check_out_date,
//                 guest_count: rooms.reduce((sum, room) => sum + room.adults, 0),
//                 gender_filter: optionSearch.gender
//             }
//             const response = await SmartBookingSearch(payload)
//             if (response?.data?.success) {
//                 setSmartSearchResult(response.data.response)
//                 removeTravel();
//             } else {
//                 const errorMsg = showErrorMsg(response.data.response)
//                 toast.error(errorMsg)
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => {
//         if (isSmartSearchEnabled) {
//             getSmartSearchData()
//         }
//     }, [isSmartSearchEnabled, optionSearch])

//     //<--------------------------------------------------------cart-funcationality------------------------------------>
//     const [bedRoomIdx, setBedRoomIdx] = useState([])
//     const [cartBox, setCartBox] = useState([])
//     const handleCartAdd = (bedroom, property, room) => {
//         if (!bedRoomIdx.includes(bedroom.bedroom_index)) {
//             room.bedroom_index = bedroom.bedroom_index;
//             room.property_name = property.property_name;
//             room.property_photo = property.cover_photo;
//             room.property_uid = property.property_uid;
//             room.check_in_date = searchFieldData.check_in_date;
//             room.check_out_date = searchFieldData.check_out_date;
//             room.property_address = property.address;
//             room.city = property.city;
//             room.state = property.state;
//             room.pin_code = property?.pin_code;
//             room.adults = bedroom.adults;
//             setCartBox(prevCart => {
//                 const isExist = prevCart.some(
//                     item => item.room_uid === room.room_uid
//                 );

//                 if (isExist) {
//                     return prevCart; // already exists → do nothing
//                 }

//                 return [...prevCart, room]; // add new item
//             });
//             setBedRoomIdx([...bedRoomIdx, bedroom.bedroom_index])
//         } else {
//         }
//     }
//     const handleCartData = (Val) => {
//         setBedRoomIdx(bedRoomIdx.filter((cv) => cv != Val.bedroom_index))
//         setCartBox(cartBox.filter((item) => item.room_uid != Val.room_uid))
//     }

//     // const totalPrice = cartBox.reduce((sum, room) => sum + room.price_per_night, 0);
//     const totalPrice = cartBox.reduce((sum, room) => {
//         if (room.room_type === "Private") {
//             return sum + room.price_per_night;
//         } else if (room.room_type === "Twin-Sharing") {
//             const bedCount = room.beds?.length || room.beds || 1;
//             return sum + ((room.price_per_night / bedCount) * room.adults);
//         }
//         return sum;
//     }, 0);



//     const handleGuests = async () => {
//         try {
//             const payload = {
//                 cart_items: cartBox.map((val) => ({
//                     property_uid: val.property_uid,
//                     room_uid: val.room_uid,
//                     // bed_index: null,
//                     check_in_date: searchFieldData.check_in_date,
//                     check_out_date: searchFieldData.check_out_date
//                 }))
//             }
//             console.log(payload)
//             const response = await CartValidationPost(JSON.stringify(payload));
//             if (response?.data?.success) {
//                 router.push('/MultiRoomsReserve');
//                 setItemLocalStorage('multiroomreserve', JSON.stringify(cartBox))
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const availableBeds = (totalBeds, avlBeds) => {
//         return totalBeds - avlBeds;
//     }

//     const roomDescription = seletedRoomData?.[0]?.rooms?.[0]?.room_description;
//     const truncatedDescription =
//         roomDescription?.split(" ")?.slice(0, 100)?.join(" ") + "..."; // Truncate after 100 words

//     useEffect(() => {
//         if (searchFieldData.rooms.length > 1) {
//             setIsSmartSearchEnabled(false)
//         }
//     }, [searchFieldData.rooms])

//     return (
//         <>
//             <ToastContainer />
//             <Header />
//             <Toaster position="top-right" />

//             <div className='searching-result-top'>
//                 <Container>
//                     <div className='search-result-header'>
//                         <h4>{responseSearchData?.company_name}  |  {responseSearchData?.city}</h4>

//                         <p className='mb-0'><Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} /> {formatStayDates(responseSearchData?.check_in_date, responseSearchData?.check_out_date)}    | <Image src='./images/icons/group.svg' alt='calendor' className="img-fluid" width={24} height={24} /> {formatRoomsAndGuests(bacisSearchDetails?.rooms)}</p>

//                         <Button variant='' onClick={addTravel} className='edit-details'>Edit Stay Details</Button>
//                     </div>
//                 </Container>
//             </div>



//             <div className='Breadcrumb'>
//                 <Container>
//                     <Row>
//                         <Col md={12} >
//                             <ul className='d-flex align-items-center breadcrumb-list2'>
//                                 {/* <li><a href=''>Home</a></li> */}
//                                 <li className='ms-0' >
//                                     <Select
//                                         name="aria-role-select"
//                                         options={roomoption}
//                                         placeholder="Room preference"
//                                         className=""
//                                         onChange={(val) => { setOptionSearch({ ...optionSearch, gender: val.value }) }}
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />

//                                 </li>
//                                 <li>
//                                     <Select
//                                         name="aria-role-select"
//                                         options={budgetoption}
//                                         placeholder="Budget"
//                                         className=""
//                                         onChange={(val) => { setOptionSearch({ ...optionSearch, budget: val.value }) }}
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />
//                                 </li>
//                                 <li>More filters <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='bott' width={14} height={14} /></li>
//                                 <li>
//                                     <div className='custom-switch'>
//                                         <Form.Check // prettier-ignore
//                                             type="switch"
//                                             id="custom-switch1"
//                                             label="Show only available rooms"
//                                             checked={responseSearchData?.availability_filter}
//                                             onChange={(e) => {
//                                                 setSearchFieldData({ ...searchFieldData, availability: e.target.checked });
//                                                 let newObj = { ...searchFieldData, availability: e.target.checked }
//                                                 fetchSearchResult(newObj);
//                                             }}
//                                         />
//                                     </div>
//                                 </li>
//                                 {bookingMultiRoomsData.length == 1 && (
//                                     <li>
//                                         <div className='custom-switch'>
//                                             <Form.Check
//                                                 type="switch"
//                                                 id="custom-switch2"
//                                                 label="Smart search"
//                                                 checked={isSmartSearchEnabled}
//                                                 onChange={(e) => setIsSmartSearchEnabled(e.target.checked)}
//                                             />
//                                         </div>
//                                     </li>
//                                 )}
//                             </ul>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             <div className='search-result-data'>
//                 <Container>
//                     <Row className='justify-content-between'>

//                         <Col md={7} className='pe-5 multilist-scroll' >
//                             <h4 className='page-subheading mb-4' > {responseSearchData?.city} ({roomsCountForOption} options)</h4>
//                             {bookingMultiRoomsData.length > 1 && (
//                                 <Tabs
//                                     defaultActiveKey="bed-Rooms1"
//                                     id="uncontrolled-tab-example2"
//                                     className="mb-3 mt-3 search-result-list-tab"
//                                 >
//                                     {bookingMultiRoomsData.map((bedroomData, bedroomIndex) => (
//                                         <Tab
//                                             key={`bedroom-${bedroomIndex}`}
//                                             eventKey={`bed-Rooms${bedroomIndex + 1}`}
//                                             title={
//                                                 <div className="d-flex align-items-start flex-col">

//                                                     <h4 className="fw-normal font-24">Bedroom {bedroomIndex + 1}</h4>
//                                                     <small className="fw-medium">{bedroomData.adults} Adult{bedroomData.adults > 1 ? 's' : ''} </small>
//                                                     <small>
//                                                         {cartBox?.some(item => item.bedroom_index === bedroomData?.bedroom_index)
//                                                             ? cartBox?.find(item => item.bedroom_index === bedroomData?.bedroom_index)?.room_name
//                                                             : 'Select Room Type'
//                                                         }
//                                                     </small>
//                                                 </div>
//                                             }
//                                             tabClassName="custom-tab"
//                                         >
//                                             <Tabs
//                                                 defaultActiveKey="private-Rooms"
//                                                 id={`uncontrolled-tab-example-${bedroomIndex}`}
//                                                 className="mb-3 mt-3 compnay-detail-tabs tab-50-50"
//                                             >
//                                                 {/* Private Rooms Tab */}
//                                                 <Tab eventKey="private-Rooms" title="Private Rooms">
//                                                     {!isSmartSearchEnabled ? (
//                                                         <>
//                                                             <div className="property-results">
//                                                                 <div className="property-card mb-4">
//                                                                     <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                                                         <label className='mb-0 d-flex gap-2 align-items-center' >
//                                                                             <input
//                                                                                 type="checkbox"
//                                                                                 className="mx-2 custom-checkbox"
//                                                                                 checked={showPrices}
//                                                                                 onChange={(e) => setShowPrices(e.target.checked)}
//                                                                             />
//                                                                             Show room prices
//                                                                         </label>
//                                                                         <div className='filter-right-option d-flex gap-3'>
//                                                                             <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                                                 <Button variant="" className='btn-sort'> Sort by :
//                                                                                     <Select
//                                                                                         name="aria-role-select"
//                                                                                         options={sortoption}
//                                                                                         placeholder="Name"
//                                                                                         className="react_selectbox"
//                                                                                         isSearchable={false}
//                                                                                         styles={customStyles}
//                                                                                     />
//                                                                                 </Button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>

//                                                                     {bedroomData.properties.length > 0 ? (
//                                                                         bedroomData.properties.map((property, propIndex) => (
//                                                                             <div key={property.property_id} className="room-card mt-2">
//                                                                                 <p className='text-right p-title position-relative'>
//                                                                                     <span>Property {propIndex + 1}</span>
//                                                                                 </p>

//                                                                                 <Link href={`/propertyDetails?uid=${property?.property_uid}`} className='text-black text-decoration-none' >
//                                                                                     <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
//                                                                                         <Image
//                                                                                             src={property?.cover_photo ? `${property.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                                             alt={property.property_name}
//                                                                                             width={56}
//                                                                                             height={56}
//                                                                                             className="img-fluid"
//                                                                                             style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                                                                         />
//                                                                                         <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
//                                                                                             {property.property_name}
//                                                                                         </p>
//                                                                                     </div>
//                                                                                 </Link>

//                                                                                 {/* Filter rooms by room_type (Private) */}
//                                                                                 {property.rooms
//                                                                                     .filter(room => room.room_type === "Private" || room.room_type === "Private")
//                                                                                     .map((room, roomIndex) => (
//                                                                                         <div key={room.room_id} className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
//                                                                                             <Row className="align-items-center">
//                                                                                                 <Col md={9}>
//                                                                                                     <div className='d-flex gap-3 room-booking-card'>
//                                                                                                         <div className="room-image position-relative">
//                                                                                                             <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", property?.property_uid) }} >
//                                                                                                                 <Image
//                                                                                                                     src={room?.cover_photo ? `${room.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                                                                     alt={room.room_name}
//                                                                                                                     width={104}
//                                                                                                                     height={192}
//                                                                                                                     className="img-fluid"
//                                                                                                                 />
//                                                                                                             </Link>
//                                                                                                             <span className="image-count">
//                                                                                                                 <Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />
//                                                                                                                 {room?.room_photos?.length}
//                                                                                                             </span>
//                                                                                                         </div>
//                                                                                                         <div className="room-details">
//                                                                                                             <div className='r-detail-1'>
//                                                                                                                 <h4 className='room-title'>
//                                                                                                                     {room.room_name}
//                                                                                                                     <span className='room-type-badge'>Private Room</span>
//                                                                                                                 </h4>
//                                                                                                                 <div className="room-specs mb-2">
//                                                                                                                     <span className="spec-item">
//                                                                                                                         <Image src="./images/icons/person.svg" width={16} height={16} alt="bed" />
//                                                                                                                         Sleeps {room.max_guests}
//                                                                                                                     </span>
//                                                                                                                     <span className="spec-item">
//                                                                                                                         <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" />
//                                                                                                                         {room.beds.length} bed
//                                                                                                                     </span>
//                                                                                                                     <span className="spec-item">{room.room_size_sqft} sq ft</span>
//                                                                                                                 </div>
//                                                                                                                 <div className="amenities mb-2">
//                                                                                                                     {room.room_amenities.map((amenity, amenityIndex) => (
//                                                                                                                         <span key={amenityIndex} className="amenity-item">{amenity}</span>
//                                                                                                                     ))}
//                                                                                                                 </div>
//                                                                                                                 <Link href="#" onClick={() => filterShow(room)} className="room-details-link">
//                                                                                                                     Room Details
//                                                                                                                 </Link>
//                                                                                                             </div>
//                                                                                                             {room.bedroom_preference === "Female" && (
//                                                                                                                 <p className='female-preferred'>FEMALE PREFERRED</p>
//                                                                                                             )}
//                                                                                                             {room.bedroom_preference === "Male" && (
//                                                                                                                 <span className='male-preferred'>MALE PREFERRED</span>
//                                                                                                             )}
//                                                                                                         </div>
//                                                                                                     </div>
//                                                                                                 </Col>
//                                                                                                 {room.is_available ? (
//                                                                                                     <Col md={3}>
//                                                                                                         <div className="booking-section text-end">
//                                                                                                             {showPrices && (
//                                                                                                                 <p className='room-price'>
//                                                                                                                     From <br />
//                                                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>
//                                                                                                                         ₹{room.price_per_night}
//                                                                                                                     </span><br />
//                                                                                                                     / night
//                                                                                                                 </p>
//                                                                                                             )}
//                                                                                                             {cartBox.some(item => item.room_uid === room.room_uid) ? (
//                                                                                                                 <Link href='#' onClick={() => handleCartData(room)} className={`${cartBox?.some(item => item.bedroom_index === bedroomData?.bedroom_index && item.room_uid == room.room_uid) ? "" : 'pointer-events-none opacity-50'} reserve-btn-add`}>
//                                                                                                                     {/* <Image src="./images/icons/Minus.svg" className="img-fluid" alt="add" width={16} height={16} /> */}
//                                                                                                                     Remove
//                                                                                                                 </Link>
//                                                                                                             ) : (
//                                                                                                                 <Link onClick={() => handleCartAdd(bedroomData, property, room)} href='#' className={`${bedRoomIdx.includes(bedroomData.bedroom_index) ? 'pointer-events-none opacity-50' : ''} reserve-btn-add`}>
//                                                                                                                     <Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                                                                                     Add
//                                                                                                                 </Link>
//                                                                                                             )}
//                                                                                                         </div>
//                                                                                                     </Col>
//                                                                                                 ) : (
//                                                                                                     <Col md={3} className='h-100'>
//                                                                                                         <div className="booking-section text-end">
//                                                                                                             <p className='mb-0'>Adjust your dates for availability.</p>
//                                                                                                             <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
//                                                                                                                 Change Dates
//                                                                                                             </Button>
//                                                                                                             <p className='mb-0'>or</p>
//                                                                                                             <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
//                                                                                                                 Book Hotel
//                                                                                                                 <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                                                             </Button>
//                                                                                                         </div>
//                                                                                                     </Col>
//                                                                                                 )}
//                                                                                             </Row>
//                                                                                         </div>
//                                                                                     ))
//                                                                                 }
//                                                                             </div>
//                                                                         ))
//                                                                     ) : (
//                                                                         <div className="text-center py-5">
//                                                                             <p className='fs-20 mb-1'>No properties available for this bedroom.</p>
//                                                                         </div>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         </>
//                                                     ) : (
//                                                         // Your existing Smart Search enabled code here
//                                                         <>{/* Smart Search UI */}</>
//                                                     )}
//                                                 </Tab>

//                                                 {/* Shared Rooms Tab */}
//                                                 <Tab eventKey="twin-sharing-rooms" title="Shared Rooms">
//                                                     <div className="property-results">
//                                                         <div className="property-card mb-4">
//                                                             <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                                                 <label className='mb-0 d-flex gap-2 align-items-center' >
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         className="mx-2 custom-checkbox"
//                                                                         checked={showPrices}
//                                                                         onChange={(e) => setShowPrices(e.target.checked)}
//                                                                     />
//                                                                     Show room prices
//                                                                 </label>
//                                                                 <div className='filter-right-option d-flex gap-3'>
//                                                                     <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                                         <Button variant="" className='btn-sort'> Sort by :
//                                                                             <Select
//                                                                                 name="aria-role-select"
//                                                                                 options={sortoption}
//                                                                                 placeholder="Name"
//                                                                                 className="react_selectbox"
//                                                                                 isSearchable={false}
//                                                                                 styles={customStyles}
//                                                                             />
//                                                                         </Button>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                             {bedroomData.properties.length > 0 ? (
//                                                                 bedroomData.properties.map((property, propIndex) => (
//                                                                     <div key={property.property_id}>
//                                                                         <p className='text-right p-title position-relative'>
//                                                                             <span>Property {propIndex + 1}</span>
//                                                                         </p>

//                                                                         <div className="room-card mt-2">
//                                                                             <Link href={`/propertyDetails?uid=${property?.property_uid}`} className='text-black text-decoration-none' >
//                                                                                 <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
//                                                                                     <Image
//                                                                                         src={property?.cover_photo ? `${property.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                                         alt={property.property_name}
//                                                                                         width={56}
//                                                                                         height={56}
//                                                                                         className="img-fluid"
//                                                                                         style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                                                                     />
//                                                                                     <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
//                                                                                         {property.property_name}
//                                                                                     </p>
//                                                                                 </div>
//                                                                             </Link>

//                                                                             {/* Filter rooms by room_type (Twin-Sharing/Shared) */}
//                                                                             {property.rooms
//                                                                                 .filter(room => room.room_type === "Twin-Sharing" || room.room_type === "Shared")
//                                                                                 .map((room, roomIndex) => (
//                                                                                     <div key={room.room_id} className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
//                                                                                         <Row className="align-items-center">
//                                                                                             <Col md={9}>
//                                                                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                                                                     <div className="room-image position-relative">
//                                                                                                         <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", property?.property_uid) }}>
//                                                                                                             <Image
//                                                                                                                 src={room?.cover_photo ? `${room.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                                                                 alt={room.room_name}
//                                                                                                                 width={104}
//                                                                                                                 height={192}
//                                                                                                                 className="img-fluid"
//                                                                                                             />
//                                                                                                         </Link>
//                                                                                                         <span className="image-count">
//                                                                                                             <Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />
//                                                                                                             {room?.room_photos?.length}
//                                                                                                         </span>
//                                                                                                     </div>
//                                                                                                     <div className="room-details">
//                                                                                                         <div className='r-detail-1'>
//                                                                                                             <h4 className='room-title'>
//                                                                                                                 {room.room_name}
//                                                                                                                 <span className='room-type-badge'>Shared Room</span>
//                                                                                                             </h4>
//                                                                                                             <div className="room-specs mb-2">
//                                                                                                                 <span className="spec-item">
//                                                                                                                     <Image src="./images/icons/person.svg" width={16} height={16} alt="bed" />
//                                                                                                                     Sleeps {room.max_guests}
//                                                                                                                 </span>
//                                                                                                                 <span className="spec-item">
//                                                                                                                     <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" />
//                                                                                                                     {room.beds.length} bed
//                                                                                                                 </span>
//                                                                                                                 <span className="spec-item">{room.room_size_sqft} sq ft</span>
//                                                                                                             </div>
//                                                                                                             <div className="amenities mb-2">
//                                                                                                                 {room.room_amenities.map((amenity, amenityIndex) => (
//                                                                                                                     <span key={amenityIndex} className="amenity-item">{amenity}</span>
//                                                                                                                 ))}
//                                                                                                             </div>
//                                                                                                             <Link href="#" onClick={() => filterShow(room)} className="room-details-link">
//                                                                                                                 Room Details
//                                                                                                             </Link>
//                                                                                                         </div>
//                                                                                                         <div className="room-specs mb-2">
//                                                                                                             {room.bedroom_preference === "Female" && (
//                                                                                                                 <span className='female-preferred'>FEMALE PREFERRED</span>
//                                                                                                             )}
//                                                                                                             {room.bedroom_preference === "Male" && (
//                                                                                                                 <span className='male-preferred'>MALE PREFERRED</span>
//                                                                                                             )}
//                                                                                                             {room.available_beds && room.available_beds.length === 1 && (
//                                                                                                                 <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>
//                                                                                                                     Only 1 bed left!
//                                                                                                                 </span>
//                                                                                                             )}
//                                                                                                         </div>
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             </Col>
//                                                                                             {room.is_available ? (
//                                                                                                 <Col md={3}>
//                                                                                                     <div className="booking-section text-end">
//                                                                                                         {showPrices && (
//                                                                                                             <p className='room-price'>
//                                                                                                                 From <br />
//                                                                                                                 <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>
//                                                                                                                     ₹{room.price_per_night}
//                                                                                                                 </span><br />
//                                                                                                                 / night
//                                                                                                             </p>
//                                                                                                         )}
//                                                                                                         {/* <Link href='./ReserveBooking' className="reserve-btn">
//                                                                                                             Reserve
//                                                                                                         </Link> */}
//                                                                                                         {cartBox.some(item => item.room_uid === room.room_uid) ? (
//                                                                                                             <Link href='#' onClick={() => handleCartData(room)} className={`${cartBox?.some(item => item.bedroom_index === bedroomData?.bedroom_index && item.room_uid == room.room_uid) ? "" : 'pointer-events-none opacity-50'} reserve-btn-add`}>
//                                                                                                                 {/* <Image src="./images/icons/Minus.svg" className="img-fluid" alt="add" width={16} height={16} /> */}
//                                                                                                                 Remove
//                                                                                                             </Link>
//                                                                                                         ) : (
//                                                                                                             <Link onClick={() => handleCartAdd(bedroomData, property, room)} href='#' className={`${bedRoomIdx.includes(bedroomData.bedroom_index) ? 'pointer-events-none opacity-50' : ''} reserve-btn-add`}>
//                                                                                                                 <Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                                                                                 Add
//                                                                                                             </Link>
//                                                                                                         )}
//                                                                                                     </div>
//                                                                                                 </Col>
//                                                                                             ) : (
//                                                                                                 <Col md={3} className='h-100'>
//                                                                                                     <div className="booking-section text-end">
//                                                                                                         <p className='mb-0'>Adjust your dates for availability.</p>
//                                                                                                         <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
//                                                                                                             Change Dates
//                                                                                                         </Button>
//                                                                                                         <p className='mb-0'>or</p>
//                                                                                                         <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
//                                                                                                             Book Hotel
//                                                                                                             <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                                                         </Button>
//                                                                                                     </div>
//                                                                                                 </Col>
//                                                                                             )}
//                                                                                         </Row>
//                                                                                     </div>
//                                                                                 ))
//                                                                             }
//                                                                         </div>
//                                                                     </div>
//                                                                 ))
//                                                             ) : (
//                                                                 <div className="text-center py-5">
//                                                                     <p className='fs-20 mb-1'>No shared rooms available for this bedroom.</p>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </Tab>

//                                             </Tabs>
//                                         </Tab>
//                                     ))}
//                                 </Tabs>
//                             )}
//                             {bookingMultiRoomsData.length == 1 && (
//                                 <Tabs
//                                     defaultActiveKey="private-Rooms"
//                                     id="uncontrolled-tab-example"
//                                     className="mb-3 mt-3 compnay-detail-tabs tab-50-50"
//                                     onSelect={(k) => {
//                                         if (k === "private-Rooms") {
//                                             setRoomType("Private");
//                                         }
//                                         if (k === "twin-sharing-rooms") {
//                                             setRoomType("Twin-Sharing");
//                                         }
//                                     }}
//                                 >
//                                     <Tab eventKey="private-Rooms" title="Private Rooms">
//                                         {!isSmartSearchEnabled && (
//                                             <>
//                                                 <div className="property-results">
//                                                     <div className="property-card mb-4">
//                                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                                             <label className='mb-0 d-flex gap-2 align-items-center' >
//                                                                 <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                                                 Show room prices
//                                                             </label>

//                                                             <div className='filter-right-option d-flex gap-3'>
//                                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


//                                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                                         <Select
//                                                                             name="aria-role-select"
//                                                                             options={sortoption}
//                                                                             placeholder="Name"
//                                                                             className="react_selectbox"
//                                                                             isSearchable={false}
//                                                                             styles={customStyles}
//                                                                         />

//                                                                     </Button>

//                                                                 </div>

//                                                             </div>

//                                                         </div>
//                                                         {bookingRoomsData?.length > 0 ? bookingRoomsData?.map((item, i) => (<div key={i}>
//                                                             <p className='text-right p-title position-relative' >
//                                                                 <span>Property {i + 1} </span>
//                                                             </p>
//                                                             {item?.properties.map((prop, ind) => (<div key={ind} className="room-card mt-2">
//                                                                 <Link href={`/propertyDetails?uid=${prop?.property_uid}`} className='text-black text-decoration-none' >
//                                                                     <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                                                         <Image
//                                                                             src={prop?.cover_photo ? `${prop?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                             alt="Room"
//                                                                             width={56}
//                                                                             height={56}
//                                                                             className="img-fluid"
//                                                                             style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                                                         />
//                                                                         <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >{prop?.property_name}</p>
//                                                                     </div>
//                                                                 </Link>
//                                                                 {prop.rooms.length > 0 && prop.rooms.map((room, index) => (<div key={index} className={room.is_available ? "border-bottom-custom1 mb-3 pb-3" : "border-bottom-custom1 disabled-room mb-3  pb-3"} style={{ borderColor: '#463527' }} >
//                                                                     {/* <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} > */}
//                                                                     <Row className="align-items-center">

//                                                                         <Col md={9}>
//                                                                             <div className='d-flex gap-3 room-booking-card'>
//                                                                                 <div className="room-image position-relative">

//                                                                                     <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", prop?.property_uid) }}>
//                                                                                         <Image
//                                                                                             src={room?.cover_photo ? `${room?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                                             alt="Room"
//                                                                                             width={104}
//                                                                                             height={192}
//                                                                                             className="img-fluid"
//                                                                                         />
//                                                                                         {!room.is_available && <p>Booked on your dates</p>}
//                                                                                     </Link>

//                                                                                     <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> {room?.room_photos?.length}</span>
//                                                                                 </div>
//                                                                                 <div className="room-details">
//                                                                                     <div className='r-detail-1'>
//                                                                                         <h4 className='room-title'> {room?.room_name}   {room?.room_type === roomType && <span className='room-type-badge' >Private Room</span>} </h4>
//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps {room?.max_guests}</span>
//                                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> {room.beds.length} bed</span>
//                                                                                             <span className="spec-item">{room?.room_size_sqft} sq ft</span>
//                                                                                         </div>
//                                                                                         <div className="amenities mb-2">
//                                                                                             {room?.room_amenities.map((amenity, inde) => (<span key={inde} className="amenity-item">{amenity}</span>))}
//                                                                                         </div>

//                                                                                         <Link href="#" onClick={() => { filterShow(room, item.adults) }} className="room-details-link ">Room Details</Link>

//                                                                                     </div>

//                                                                                     {room?.bedroom_preference === "Female" && <p className='female-preferred'>
//                                                                                         Female PREFERRED
//                                                                                     </p>}
//                                                                                     {room?.bedroom_preference === "Male" && <span className='male-preferred'>
//                                                                                         Male PREFERRED
//                                                                                     </span>}
//                                                                                 </div>
//                                                                             </div>
//                                                                         </Col>
//                                                                         {room.is_available ? <Col md={3}>
//                                                                             <div className="booking-section  text-end">
//                                                                                 {showPrices && (
//                                                                                     <p className='room-price' >From <br />
//                                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹{room.price_per_night}</span> <br />
//                                                                                         / night
//                                                                                     </p>
//                                                                                 )}
//                                                                                 <Link href='./ReserveBooking' onClick={() => {
//                                                                                     setItemLocalStorage("reserveRoom", JSON.stringify(item?.properties.map(prop => {
//                                                                                         const selectedRooms = prop.rooms.filter(
//                                                                                             selecedRoom => selecedRoom.room_uid === room.room_uid
//                                                                                         );

//                                                                                         // only return prop if the selected room exists
//                                                                                         if (!selectedRooms.length) return null;

//                                                                                         return {
//                                                                                             ...prop,
//                                                                                             rooms: selectedRooms, adultCount: item.adults
//                                                                                         };
//                                                                                     }).filter(Boolean))); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData))
//                                                                                 }} className="reserve-btn">Reserve</Link>

//                                                                             </div>
//                                                                         </Col>
//                                                                             :
//                                                                             <Col md={3} className='h-100' >
//                                                                                 <div className="booking-section text-end">
//                                                                                     <p className='mb-0' >{room?.booking_info?.message}</p>
//                                                                                     <Button onClick={() => handleChangeDatesClick(prop, room)}

//                                                                                         // onClick={() => {
//                                                                                         //     const bookedRanges = room?.booking_info?.booked_periods?.map(cv => ({
//                                                                                         //         start: new Date(cv?.check_in_datetime), end: new Date(cv?.check_out_datetime)
//                                                                                         //     }));
//                                                                                         //     setBookedRangeDates(bookedRanges);
//                                                                                         //     marknoShowModal()
//                                                                                         // }}
//                                                                                         variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                                                     <p className='mb-0' >or</p>
//                                                                                     <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                                                         <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                                     </Button>


//                                                                                 </div>
//                                                                             </Col>}
//                                                                     </Row>
//                                                                 </div>))}
//                                                                 <>
//                                                                     {/* <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                               <Col md={9}>
//                                 <div className='d-flex gap-3 room-booking-card'>
//                                   <div className="room-image position-relative">
//                                     <Link href="./ViewDetailsResult">
//                                       <Image
//                                         src="/images/icons/room-img1.jpg"
//                                         alt="Room"
//                                         width={104}
//                                         height={192}
//                                         className="img-fluid"
//                                       />


//                                       <p>Booked on your dates</p>
//                                     </Link>
//                                     <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                   </div>
//                                   <div className="room-details">
//                                     <div className='r-detail-1'>
//                                       <h4 className='room-title'> Room 4   <span className='room-type-badge' >Private Room</span> </h4>
//                                       <div className="room-specs mb-2">
//                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                         <span className="spec-item">538 sq ft</span>
//                                       </div>
//                                       <div className="amenities mb-2">
//                                         <span className="amenity-item">36&quot; flat-screen TV</span>
//                                         <span className="amenity-item">Ceiling fans</span>
//                                         <span className="amenity-item">Coffee maker</span>
//                                         <span className="amenity-item">Robes</span>
//                                         <span className="amenity-item">Hair dryer</span>
//                                         <span className="amenity-item">Iron and ironing board</span>
//                                       </div>

//                                       <Link href="#" className="room-details-link ">Room Details</Link>
//                                     </div>

                                    
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col md={3} className='h-100' >
//                                 <div className="booking-section text-end">
//                                   {showPrices && (
//                                     <p className='room-price' >From <br />
//                                       <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                       / night
//                                     </p>
//                                   )}
//                                   <p className='mb-0' >This room is already booked for your selected dates.</p>
//                                   <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                   <p className='mb-0' >or</p>
//                                   <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                     <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                   </Button>

//                                 </div>
//                               </Col>
//                             </Row>
//                           </div> */}
//                                                                 </>

//                                                             </div>))}
//                                                         </div>)) : <p className='fs-20 mb-1'>Selected room type is not available for your dates.</p>}

//                                                         <>

//                                                             {/* <p className='text-right p-title position-relative' >
//                           <span>Property 2 </span>  </p>


//                         <div className="room-card mt-2">
//                           <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                             <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                               <Image
//                                 src="/images/icons/amentiy.jpg"
//                                 alt="Room"
//                                 width={56}
//                                 height={56}
//                                 className="img-fluid"
//                               />

//                               <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                             </div>
//                           </Link>


//                           <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                               <Col md={9}>
//                                 <div className='d-flex gap-3 room-booking-card'>
//                                   <div className="room-image position-relative">
//                                     <Link href="./ViewDetailsResult">
//                                       <Image
//                                         src="/images/icons/room-img1.jpg"
//                                         alt="Room"
//                                         width={104}
//                                         height={192}
//                                         className="img-fluid"
//                                       />

//                                     </Link>

//                                     <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                   </div>
//                                   <div className="room-details">
//                                     <div className='r-detail-1'>
//                                       <h4 className='room-title'> Room 1   <span className='room-type-badge' >Private Room</span> </h4>
//                                       <div className="room-specs mb-2">
//                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                         <span className="spec-item">538 sq ft</span>
//                                       </div>
//                                       <div className="amenities mb-2">
//                                         <span className="amenity-item">36&quot; flat-screen TV</span>
//                                         <span className="amenity-item">Ceiling fans</span>
//                                         <span className="amenity-item">Coffee maker</span>
//                                         <span className="amenity-item">Robes</span>
//                                         <span className="amenity-item">Hair dryer</span>
//                                         <span className="amenity-item">Iron and ironing board</span>
//                                       </div>

//                                       <Link href="#" className="room-details-link ">Room Details</Link>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col md={3}>
//                                 <div className="booking-section text-end">
//                                   {showPrices && (
//                                     <p className='room-price' >From <br />
//                                       <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
//                                       / night
//                                     </p>
//                                   )}
//                                   <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>


//                           <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                               <Col md={9}>
//                                 <div className='d-flex gap-3 room-booking-card'>
//                                   <div className="room-image position-relative">
//                                     <Link href="./ViewDetailsResult">
//                                       <Image
//                                         src="/images/icons/room-img1.jpg"
//                                         alt="Room"
//                                         width={104}
//                                         height={192}
//                                         className="img-fluid"
//                                       />

//                                     </Link>

//                                     <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                   </div>
//                                   <div className="room-details">
//                                     <div className='r-detail-1'>
//                                       <h4 className='room-title'> Room 2   <span className='room-type-badge' >Private Room</span> </h4>
//                                       <div className="room-specs mb-2">
//                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                         <span className="spec-item">538 sq ft</span>
//                                       </div>
//                                       <div className="amenities mb-2">
//                                         <span className="amenity-item">36&quot; flat-screen TV</span>
//                                         <span className="amenity-item">Ceiling fans</span>
//                                         <span className="amenity-item">Coffee maker</span>
//                                         <span className="amenity-item">Robes</span>
//                                         <span className="amenity-item">Hair dryer</span>
//                                         <span className="amenity-item">Iron and ironing board</span>
//                                       </div>

//                                       <Link href="#" className="room-details-link ">Room Details</Link>
//                                     </div>
//                                     <p className='male-preferred'>
//                                       Male PREFERRED
//                                     </p>

//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col md={3}>
//                                 <div className="booking-section text-end">
//                                   {showPrices && (
//                                     <p className='room-price' >From <br />
//                                       <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
//                                       / night
//                                     </p>
//                                   )}
//                                   <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>


//                           <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                               <Col md={9}>
//                                 <div className='d-flex gap-3 room-booking-card'>
//                                   <div className="room-image position-relative">
//                                     <Link href="./ViewDetailsResult">
//                                       <Image
//                                         src="/images/icons/room-img1.jpg"
//                                         alt="Room"
//                                         width={104}
//                                         height={192}
//                                         className="img-fluid"
//                                       />

//                                     </Link>

//                                     <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                   </div>
//                                   <div className="room-details">
//                                     <div className='r-detail-1'>
//                                       <h4>Room 3</h4>
//                                       <div className="room-specs mb-2">
//                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                         <span className="spec-item">538 sq ft</span>
//                                       </div>
//                                       <div className="amenities mb-2">
//                                         <span className="amenity-item">36&quot; flat-screen TV</span>
//                                         <span className="amenity-item">Ceiling fans</span>
//                                         <span className="amenity-item">Coffee maker</span>
//                                         <span className="amenity-item">Robes</span>
//                                         <span className="amenity-item">Hair dryer</span>
//                                         <span className="amenity-item">Iron and ironing board</span>
//                                       </div>

//                                       <Link href="#" className="room-details-link ">Room Details</Link>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col md={3}>
//                                 <div className="booking-section text-end">
//                                   {showPrices && (
//                                     <p className='room-price' >From <br />
//                                       <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
//                                       / night
//                                     </p>
//                                   )}
//                                   <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>

//                           <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                               <Col md={9}>
//                                 <div className='d-flex gap-3 room-booking-card'>
//                                   <div className="room-image position-relative">
//                                     <Link href="./ViewDetailsResult">
//                                       <Image
//                                         src="/images/icons/room-img1.jpg"
//                                         alt="Room"
//                                         width={104}
//                                         height={192}
//                                         className="img-fluid"
//                                       />

//                                     </Link>

//                                     <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                   </div>
//                                   <div className="room-details">
//                                     <div className='r-detail-1'>
//                                       <h4>Room 4</h4>
//                                       <div className="room-specs mb-2">
//                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                         <span className="spec-item">538 sq ft</span>
//                                       </div>
//                                       <div className="amenities mb-2">
//                                         <span className="amenity-item">36&quot; flat-screen TV</span>
//                                         <span className="amenity-item">Ceiling fans</span>
//                                         <span className="amenity-item">Coffee maker</span>
//                                         <span className="amenity-item">Robes</span>
//                                         <span className="amenity-item">Hair dryer</span>
//                                         <span className="amenity-item">Iron and ironing board</span>
//                                       </div>

//                                       <Link href="#" className="room-details-link ">Room Details</Link>


//                                     </div>

//                                     <p className='female-preferred'>
//                                       Female PREFERRED
//                                     </p>
//                                   </div>

//                                 </div>
//                               </Col>
//                               <Col md={3}>
//                                 <div className="booking-section text-end">
//                                   {showPrices && (
//                                     <p className='room-price' >From <br />
//                                       <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
//                                       / night
//                                     </p>
//                                   )}
//                                   <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

//                                 </div>
//                               </Col>
//                             </Row>
//                           </div>



//                         </div> */}



//                                                             {/* <p className='text-right p-title position-relative' >
//                                                                 <span>Property 3 </span>  </p>


//                                                             <div className="room-card mt-2">
//                                                                 <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                                     <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                                                         <Image
//                                                                             src="/images/icons/amentiy.jpg"
//                                                                             alt="Room"
//                                                                             width={56}
//                                                                             height={56}
//                                                                             className="img-fluid"
//                                                                         />

//                                                                         <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                     </div>
//                                                                 </Link>



//                                                                 <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                                                                     <Row className="align-items-center">

//                                                                         <Col md={9}>
//                                                                             <div className='d-flex gap-3 room-booking-card'>
//                                                                                 <p className='fs-20' >No rooms available</p>
//                                                                             </div>
//                                                                         </Col>
//                                                                         <Col md={3} className='h-100' >
//                                                                             <div className="booking-section text-end">
//                                                                                 <p className='mb-0' >Adjust your dates for availability.</p>
//                                                                                 <Button variant="" onClick={marknoShowModal} className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                                                 <p className='mb-0' >or</p>
//                                                                                 <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                                                     <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                                 </Button>


//                                                                             </div>
//                                                                         </Col>
//                                                                     </Row>
//                                                                 </div>




//                                                             </div> */}
//                                                         </>

//                                                     </div>
//                                                 </div>
//                                                 <p className='mb-3' >Adjust your dates for availability or enable smart search for our suggestions.</p>

//                                                 <Button variant='' disabled={isSmartSearchEnabled}
//                                                     onClick={() => setIsSmartSearchEnabled(true)} className='edit-btn py-2 px-4'>Enable Smart Search</Button>

//                                             </>
//                                         )}
//                                         <>
//                                             {isSmartSearchEnabled && (
//                                                 <>
//                                                     <div className="property-results">
//                                                         <div className="property-card mb-4">
//                                                             <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                                                 <label className='mb-0 d-flex gap-2 align-items-center' >
//                                                                     <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                                                     Show room prices
//                                                                 </label>

//                                                                 <div className='filter-right-option d-flex gap-3'>
//                                                                     <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


//                                                                         <Button variant="" className='btn-sort'> Sort by :
//                                                                             <Select
//                                                                                 name="aria-role-select"
//                                                                                 options={sortoption}
//                                                                                 placeholder="Name"
//                                                                                 className="react_selectbox"
//                                                                                 isSearchable={false}
//                                                                                 styles={customStyles}
//                                                                             />

//                                                                         </Button>

//                                                                     </div>

//                                                                 </div>

//                                                             </div>

//                                                             {/* <p className='text-right p-title position-relative' >
//                                                             <span>Property 1 </span>
//                                                         </p> */}


//                                                             {(() => {
//                                                                 {/* const groupedByProperty = SmartSearchResult?.smart_results?.perfect_match?.length > 0 && SmartSearchResult?.smart_results?.perfect_match?.reduce((acc, match) => {
//                                                                     const propertyId = match?.segments[0]?.property_id;
//                                                                     const roomType = match?.segments[0]?.room_type;
//                                                                     if (!acc[propertyId] && roomType==="Private") {
//                                                                         acc[propertyId] = {
//                                                                             property_info: {
//                                                                                 property_id: match?.segments[0]?.property_id,
//                                                                                 property_uid: match?.segments[0]?.property_uid,
//                                                                                 property_name: match?.segments[0]?.property_name,
//                                                                                 property_cover_photo: match?.segments[0]?.property_cover_photo
//                                                                             },
//                                                                             matches: []
//                                                                         };
//                                                                     }
//                                                                     acc[propertyId].matches.push(match);
//                                                                     return acc;
//                                                                 }, {}); */}
//                                                                 const groupedByProperty = SmartSearchResult?.smart_results?.perfect_match?.length > 0 &&
//                                                                     SmartSearchResult?.smart_results?.perfect_match?.reduce((acc, match) => {
//                                                                         const propertyId = match?.segments[0]?.property_id;
//                                                                         const roomType = match?.segments[0]?.room_type;

//                                                                         if (roomType === "Private") {
//                                                                             if (!acc[propertyId]) {
//                                                                                 acc[propertyId] = {
//                                                                                     property_info: {
//                                                                                         property_id: match?.segments[0]?.property_id,
//                                                                                         property_uid: match?.segments[0]?.property_uid,
//                                                                                         property_name: match?.segments[0]?.property_name,
//                                                                                         property_cover_photo: match?.segments[0]?.property_cover_photo
//                                                                                     },
//                                                                                     matches: []
//                                                                                 };
//                                                                             }
//                                                                             acc[propertyId].matches.push(match);
//                                                                         }

//                                                                         return acc;
//                                                                     }, {});


//                                                                 return Object.values(groupedByProperty)?.map((propertyGroup, propIndex) => {
//                                                                     const property = propertyGroup.property_info;

//                                                                     return (
//                                                                         <>
//                                                                             <p className='text-right p-title position-relative'>
//                                                                                 <span>Property {propIndex + 1}</span>
//                                                                             </p>

//                                                                             <div className="room-card mt-2">

//                                                                                 <div key={property.property_id} className="property-section">


//                                                                                     <Link href={`/propertyDetails?uid=${property?.property_uid}`} className='text-black text-decoration-none' >
//                                                                                         <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
//                                                                                             <Image
//                                                                                                 src={`${property.property_cover_photo}` || `/images/icons/No-Image.svg`}
//                                                                                                 alt={property.property_name}
//                                                                                                 width={56}
//                                                                                                 height={56}
//                                                                                                 className="img-fluid"
//                                                                                                 style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                                                                             />
//                                                                                             <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
//                                                                                                 {property.property_name}
//                                                                                             </p>
//                                                                                         </div>
//                                                                                     </Link>

//                                                                                     {propertyGroup.matches.map((match) => {
//                                                                                         const room = match.segments[0];
//                                                                                         const room_photos_length = room.rooms_photo ? room.rooms_photo.length : 0;
//                                                                                         const room_is_available = true;

//                                                                                         return (
//                                                                                             <div key={room.room_id} className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
//                                                                                                 <Row className="align-items-center">
//                                                                                                     <Col md={9}>
//                                                                                                         <div className='d-flex gap-3 room-booking-card'>
//                                                                                                             <div className="room-image position-relative">
//                                                                                                                 <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", property?.property_uid) }}>
//                                                                                                                     <Image
//                                                                                                                         src={`${room.cover_photo}` || `/images/icons/No-Image.svg`}
//                                                                                                                         alt={room.room_name}
//                                                                                                                         width={104}
//                                                                                                                         height={192}
//                                                                                                                         className="img-fluid"
//                                                                                                                     />
//                                                                                                                 </Link>
//                                                                                                                 <span className="image-count">
//                                                                                                                     <Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />
//                                                                                                                     {room_photos_length}
//                                                                                                                 </span>
//                                                                                                             </div>
//                                                                                                             <div className="room-details">
//                                                                                                                 <div className='r-detail-1'>
//                                                                                                                     <h4 className='room-title'>
//                                                                                                                         {room.room_name}
//                                                                                                                         <span className='room-type-badge'>{room.room_type}</span>
//                                                                                                                     </h4>
//                                                                                                                     <div className="room-specs mb-2">
//                                                                                                                         <span className="spec-item">
//                                                                                                                             <Image src="./images/icons/person.svg" width={16} height={16} alt="bed" />

//                                                                                                                             Sleeps 2
//                                                                                                                         </span>
//                                                                                                                         <span className="spec-item">
//                                                                                                                             <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" />

//                                                                                                                             2 bed
//                                                                                                                         </span>
//                                                                                                                         {/* <span className="spec-item">{room.room_size_sqft} sq ft</span> */}
//                                                                                                                     </div>
//                                                                                                                     <div className="amenities mb-2">
//                                                                                                                         {/* Add amenities mapping when you have the data */}
//                                                                                                                         {/* <span className="amenity-item">WiFi</span>
//                                                                                                                         <span className="amenity-item">AC</span> */}
//                                                                                                                         {room?.room_amenities.map((amenity, inde) => (<span key={inde} className="amenity-item">{amenity}</span>))}
//                                                                                                                     </div>
//                                                                                                                     <Link href="#" onClick={() => filterShow(room)} className="room-details-link">
//                                                                                                                         Room Details
//                                                                                                                     </Link>
//                                                                                                                 </div>
//                                                                                                                 {/* Add bedroom_preference logic when available */}
//                                                                                                                 {/* {bedroom_preference === "Female" && (
//                                                                                                             <p className='female-preferred'>FEMALE PREFERRED</p>
//                                                                                                         )}
//                                                                                                         {bedroom_preference === "Male" && (
//                                                                                                             <span className='male-preferred'>MALE PREFERRED</span>
//                                                                                                         )} */}
//                                                                                                             </div>
//                                                                                                         </div>
//                                                                                                     </Col>
//                                                                                                     {room_is_available ? (
//                                                                                                         <Col md={3}>
//                                                                                                             <div className="booking-section text-end">
//                                                                                                                 {showPrices && (
//                                                                                                                     <p className='room-price'>
//                                                                                                                         From <br />
//                                                                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>
//                                                                                                                             ₹{room.price_per_night}
//                                                                                                                         </span><br />
//                                                                                                                         / night
//                                                                                                                     </p>
//                                                                                                                 )}
//                                                                                                                 {/* Add cart functionality when implemented */}
//                                                                                                                 {/* {cartBox?.some(item => item.room_uid === room.room_uid) ? (
//                                                                                                             <Link href='#' onClick={() => handleCartData(room)} className={`reserve-btn-add`}>
//                                                                                                                 Remove
//                                                                                                             </Link>
//                                                                                                         ) : (
//                                                                                                             <Link onClick={() => handleCartAdd(room)} href='#' className={`reserve-btn-add`}>
//                                                                                                                 <Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                                                                                 Add
//                                                                                                             </Link>
//                                                                                                         )} */}
//                                                                                                                 {/* <Link href='./ReserveBooking' onClick={() => {
//                                                                                                                 setItemLocalStorage("reserveRoom", JSON.stringify(item?.properties.map(prop => {
//                                                                                                                     const selectedRooms = prop.rooms.filter(
//                                                                                                                         selecedRoom => selecedRoom.room_uid === room.room_uid
//                                                                                                                     );

//                                                                                                                     // only return prop if the selected room exists
//                                                                                                                     if (!selectedRooms.length) return null;

//                                                                                                                     return {
//                                                                                                                         ...prop,
//                                                                                                                         rooms: selectedRooms, adultCount: item.adults
//                                                                                                                     };
//                                                                                                                 }).filter(Boolean))); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData))
//                                                                                                             }} className="reserve-btn">Reserve</Link> */}
//                                                                                                                 <Link href='./Multiswitchreserve' className="reserve-btn" onClick={() => setItemLocalStorage("reserveRoom", JSON.stringify(match))}>
//                                                                                                                     Reserve
//                                                                                                                 </Link>
//                                                                                                             </div>
//                                                                                                         </Col>
//                                                                                                     ) : (
//                                                                                                         <Col md={3} className='h-100'>
//                                                                                                             <div className="booking-section text-end">
//                                                                                                                 <p className='mb-0'>Adjust your dates for availability.</p>
//                                                                                                                 <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
//                                                                                                                     Change Dates
//                                                                                                                 </Button>
//                                                                                                                 <p className='mb-0'>or</p>
//                                                                                                                 <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
//                                                                                                                     Book Hotel
//                                                                                                                     <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                                                                 </Button>
//                                                                                                             </div>
//                                                                                                         </Col>
//                                                                                                     )}
//                                                                                                 </Row>
//                                                                                             </div>
//                                                                                         );
//                                                                                     })}
//                                                                                 </div>
//                                                                             </div>
//                                                                         </>
//                                                                     );
//                                                                 });
//                                                             })()}



//                                                             <p className='fs-20 mb-0' >Mixed room options</p>
//                                                             <p>A twin room option is available on one of your rooms.</p>


//                                                             {/* Room Card 1 */}
//                                                             {/* <div className="room-card mt-2">
//                                                             <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                                 <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                                                     <Image
//                                                                         src="/images/icons/amentiy.jpg"
//                                                                         alt="Room"
//                                                                         width={56}
//                                                                         height={56}
//                                                                         className="img-fluid"
//                                                                     />

//                                                                     <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                 </div>
//                                                             </Link>


//                                                             <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                                 <Row className="align-items-center">

//                                                                     <Col md={9}>
//                                                                         <div className=' room-booking-card w-100 pe-3'>

//                                                                             <div className="room-details">

//                                                                                 <div className='d-flex justify-between W-100 mb-3 '>
//                                                                                     <div className='r2'>
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                                         <h4>Room 4</h4>
//                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                                                         <br></br>

//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
//                                                                                     </div>

//                                                                                     <div className='r2 text-center'>
//                                                                                         <Image src='./images/icons/swicth-acess.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                                         Room change on <br></br>
//                                                                                         Tue, 5 Aug, 2025
//                                                                                     </div>


//                                                                                     <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }} >
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
//                                                                                         <h4>Room 3</h4>
//                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
//                                                                                         <br></br>
//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
//                                                                                     </div>

//                                                                                 </div>

//                                                                                 <div className='d-flex justify-between align-items-start'>
//                                                                                     <div className='colum-1'>

//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 3</span>
//                                                                                             <span className="spec-item "><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 twin bed</span>

//                                                                                         </div>

//                                                                                         <div className="room-specs mb-2 ">

//                                                                                             <span className='female-preferred'>
//                                                                                                 Female Preferred
//                                                                                             </span>

                                                                                            
//                                                                                         </div>

//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 2</span>
//                                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                                         </div>



//                                                                                         <p className='mb-0' >Rooms in the same property</p>

//                                                                                     </div>

//                                                                                     <div className='colum-2'>

//                                                                                         <Link href="#" className='edit-btn py-2 px-4' onClick={filterShow2}  >View Details</Link>

//                                                                                     </div>

//                                                                                 </div>




//                                                                             </div>
//                                                                         </div>
//                                                                     </Col>
//                                                                     <Col md={3}>
//                                                                         <div className="booking-section  text-end">
//                                                                             {showPrices && (
//                                                                                 <>

//                                                                                     <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                                         / night
//                                                                                     </p>


//                                                                                     <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                                         / night
//                                                                                     </p>
//                                                                                 </>

//                                                                             )}
//                                                                             <Link href='./SmartSearchResult' className="reserve-btn">Reserve</Link>

//                                                                         </div>
//                                                                     </Col>
//                                                                 </Row>
//                                                             </div>
//                                                         </div> */}

//                                                             {SmartSearchResult?.smart_results?.mixed_room_options?.map((option, optionIndex) => (
//                                                                 <div className="room-card mt-2" key={optionIndex}>
//                                                                     <Link href="#" className='text-black text-decoration-none'>
//                                                                         <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
//                                                                             <Image
//                                                                                 src={`${option.segments[0]?.property_cover_photo}` || "/images/icons/amentiy.jpg"}
//                                                                                 alt="Property"
//                                                                                 width={56}
//                                                                                 height={56}
//                                                                                 className="img-fluid"
//                                                                                 style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                                                             />
//                                                                             <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
//                                                                                 {option.segments[0]?.property_name || "Property Name"}
//                                                                             </p>
//                                                                         </div>
//                                                                     </Link>

//                                                                     <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
//                                                                         <Row className="align-items-center">
//                                                                             <Col md={9}>
//                                                                                 <div className='room-booking-card w-100 pe-3'>
//                                                                                     <div className="room-details">
//                                                                                         <div className='d-flex justify-between W-100 mb-3'>
//                                                                                             {/* First Segment */}
//                                                                                             <div className='r2'>
//                                                                                                 <span style={{ color: '#73615F' }}>
//                                                                                                     {new Date(option.segments[0]?.check_in_datetime).toLocaleDateString('en-US', {
//                                                                                                         weekday: 'short',
//                                                                                                         day: 'numeric',
//                                                                                                         month: 'short',
//                                                                                                         year: 'numeric'
//                                                                                                     })}
//                                                                                                 </span>
//                                                                                                 <h4>{option.segments[0]?.room_name || "Room"}</h4>
//                                                                                                 <span style={{ color: '#463527', lineHeight: '20px' }}>Check-in</span>
//                                                                                                 <br />
//                                                                                                 <Link href="#" onClick={filterShow} className="room-details-link">
//                                                                                                     Room Details
//                                                                                                 </Link>
//                                                                                             </div>

//                                                                                             {/* Room Switch Info - only show if there are multiple segments */}
//                                                                                             {option.segments.length > 1 && (
//                                                                                                 <div className='r2 text-center'>
//                                                                                                     <Image
//                                                                                                         src='./images/icons/swicth-acess.svg'
//                                                                                                         className='img-fluid mb-2'
//                                                                                                         alt="switch"
//                                                                                                         width={200}
//                                                                                                         height={40}
//                                                                                                     />
//                                                                                                     Room change on <br />
//                                                                                                     {new Date(option.segments[0]?.check_out_datetime).toLocaleDateString('en-US', {
//                                                                                                         weekday: 'short',
//                                                                                                         day: 'numeric',
//                                                                                                         month: 'short',
//                                                                                                         year: 'numeric'
//                                                                                                     })}
//                                                                                                 </div>
//                                                                                             )}

//                                                                                             {/* Last Segment */}
//                                                                                             <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }}>
//                                                                                                 <span style={{ color: '#73615F' }}>
//                                                                                                     {new Date(option.segments[option.segments.length - 1]?.check_out_datetime).toLocaleDateString('en-US', {
//                                                                                                         weekday: 'short',
//                                                                                                         day: 'numeric',
//                                                                                                         month: 'short',
//                                                                                                         year: 'numeric'
//                                                                                                     })}
//                                                                                                 </span>
//                                                                                                 <h4>{option.segments[option.segments.length - 1]?.room_name || "Room"}</h4>
//                                                                                                 <span style={{ color: '#463527', lineHeight: '20px' }}>Checkout</span>
//                                                                                                 <br />
//                                                                                                 <Link href="#" onClick={filterShow} className="room-details-link">
//                                                                                                     Room Details
//                                                                                                 </Link>
//                                                                                             </div>
//                                                                                         </div>

//                                                                                         <div className='d-flex justify-between align-items-start'>
//                                                                                             <div className='colum-1'>
//                                                                                                 {/* Map through all segments */}
//                                                                                                 {option.segments.map((segment, segmentIndex) => (
//                                                                                                     <div key={segment.segment_id || segmentIndex}>
//                                                                                                         <div className="room-specs mb-2">
//                                                                                                             <span className="spec-item">{segment.room_name}</span>
//                                                                                                             <span className="spec-item">
//                                                                                                                 <Image
//                                                                                                                     src="./images/icons/single_bed.svg"
//                                                                                                                     width={16}
//                                                                                                                     height={16}
//                                                                                                                     alt="bed"
//                                                                                                                 />
//                                                                                                                 {segment.room_type}
//                                                                                                             </span>
//                                                                                                         </div>

//                                                                                                         {/* Add Female Preferred badge conditionally if needed */}
//                                                                                                         {segment.room_type === "Twin-Sharing" && (
//                                                                                                             <div className="room-specs mb-2">
//                                                                                                                 <span className='female-preferred'>
//                                                                                                                     Female Preferred
//                                                                                                                 </span>
//                                                                                                             </div>
//                                                                                                         )}
//                                                                                                     </div>
//                                                                                                 ))}

//                                                                                                 <p className='mb-0'>Rooms in the same property</p>
//                                                                                             </div>

//                                                                                             <div className='colum-2'>
//                                                                                                 <Link href="#" className='edit-btn py-2 px-4' onClick={filterShow2}>
//                                                                                                     View Details
//                                                                                                 </Link>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </Col>

//                                                                             <Col md={3}>
//                                                                                 <div className="booking-section text-end">
//                                                                                     {/* Show price for each segment */}
//                                                                                     {showPrices && option.segments.map((segment, segmentIndex) => (
//                                                                                         <p key={segmentIndex} className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }}>
//                                                                                             From <br />
//                                                                                             <span style={{
//                                                                                                 fontSize: '2rem',
//                                                                                                 fontWeight: '500',
//                                                                                                 color: '#BF9039',
//                                                                                                 fontFamily: 'Felgine',
//                                                                                                 lineHeight: 'auto'
//                                                                                             }}>
//                                                                                                 ₹{segment.price_per_night?.toLocaleString('en-IN') || "0"}
//                                                                                             </span> <br />
//                                                                                             / night
//                                                                                         </p>
//                                                                                     ))}

//                                                                                     <Link href='./Multiswitchreserve' className="reserve-btn" onClick={() => setItemLocalStorage("reserveRoom", JSON.stringify(option))}>
//                                                                                         Reserve
//                                                                                     </Link>

//                                                                                     {/* Optional: Show total nights and switches */}
//                                                                                     <div className="mt-2" style={{ fontSize: '0.8rem', color: '#73615F' }}>
//                                                                                         {option.total_nights} nights • {option.num_switches} switch{option.num_switches !== 1 ? 'es' : ''}
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </Col>
//                                                                         </Row>
//                                                                     </div>
//                                                                 </div>
//                                                             ))}



//                                                             {/* <div className="multiswitch-room room-card mt-2">
//                                                             <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                                 <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                                                     <Image
//                                                                         src="/images/icons/amentiy.jpg"
//                                                                         alt="Room"
//                                                                         width={56}
//                                                                         height={56}
//                                                                         className="img-fluid"
//                                                                     />

//                                                                     <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                 </div>
//                                                             </Link>

//                                                             <div className=' border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                                 <Row className="align-items-center">

//                                                                     <Col md={12}>
//                                                                         <div className=' room-booking-card w-100 pe-3'>

//                                                                             <div className="room-details">

//                                                                                 <div className='d-flex justify-between W-100 mb-3 '>
//                                                                                     <div className='r2 mwid20'>
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                                         <h4>Room 4</h4>
//                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                                                         <br></br>

//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                                                         {showPrices && (
//                                                                                             <>

//                                                                                                 <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                                                     / night
//                                                                                                 </p>
//                                                                                             </>

//                                                                                         )}
//                                                                                     </div>

//                                                                                     <div className='r2  mwid20 text-center'>
//                                                                                         <Image src='./images/icons/swicth-acess.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                                         Room change on <br></br>
//                                                                                         Tue, 5 Aug, 2025
//                                                                                     </div>


//                                                                                     <div className='r2  mwid20 text-center'  >
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
//                                                                                         <h4>Room 3</h4>                                                                                        
//                                                                                         <br></br>
//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                                                         {showPrices && (
//                                                                                             <>
//                                                                                                 <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                                                     / night
//                                                                                                 </p>
//                                                                                             </>

//                                                                                         )}
//                                                                                     </div>

//                                                                                     <div className='r2  mwid20 text-center'>
//                                                                                         <Image src='./images/icons/swicth-acess.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                                         Room change on <br></br>
//                                                                                         Tue, 9 Aug, 2025
//                                                                                     </div>


//                                                                                     <div className='r2  mwid20' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }} >
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 10 Aug, 2025</span>
//                                                                                         <h4>Room 3</h4>
//                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
//                                                                                         <br></br>
//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                                                         {showPrices && (
//                                                                                             <>

//                                                                                                 <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                                                     / night
//                                                                                                 </p>
//                                                                                             </>

//                                                                                         )}
//                                                                                     </div>

//                                                                                 </div>

//                                                                                 <div className='d-flex justify-between align-items-start'>
//                                                                                     <div className='colum-1'>

//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 3</span>
//                                                                                             <span className="spec-item "><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 twin bed</span>

//                                                                                         </div>

//                                                                                         <div className="room-specs mb-2 ">

//                                                                                             <span className='female-preferred'>
//                                                                                                 Female Preferred
//                                                                                             </span>
                                                                                            
//                                                                                         </div>

//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 2</span>
//                                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                                         </div>
//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 4</span>
//                                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                                         </div>

//                                                                                     </div>

//                                                                                     <div className='colum-2'>


//                                                                                         <Link href="#" className='edit-btn py-2 px-4 mb-3' onClick={filterShow2}  >View Details</Link>
//                                                                                         <div className="booking-section  text-end">

//                                                                                             <Link href='./Multiswitchreserve' className="reserve-btn">Reserve</Link>

//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </Col>

//                                                                 </Row>
//                                                             </div>
//                                                         </div> */}

//                                                             {/* {SmartSearchResult?.smart_results?.mixed_room_options?.map((option, optionIndex) => (
//                                                             <div className="multiswitch-room room-card mt-2" key={optionIndex}>
                                                                
//                                                                 <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none'>
//                                                                     <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
//                                                                         <Image
//                                                                             src={option.segments[0]?.property_cover_photo || "/images/icons/amentiy.jpg"}
//                                                                             alt="Property"
//                                                                             width={56}
//                                                                             height={56}
//                                                                             className="img-fluid"
//                                                                             onError={(e) => {
//                                                                                 e.target.onerror = null;
//                                                                                 e.target.src = "/images/icons/amentiy.jpg";
//                                                                             }}
//                                                                         />
//                                                                         <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
//                                                                             {option.segments[0]?.property_name || "Property Name"}
//                                                                         </p>
//                                                                     </div>
//                                                                 </Link>

//                                                                 <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
//                                                                     <Row className="align-items-center">
//                                                                         <Col md={12}>
//                                                                             <div className='room-booking-card w-100 pe-3'>
//                                                                                 <div className="room-details">
                                                                                    
//                                                                                     <div className='d-flex justify-between W-100 mb-3'>
                                                                                        
//                                                                                         {option.segments.map((segment, segmentIndex) => (
//                                                                                             <React.Fragment key={segment.segment_id}>
                                                                                                
//                                                                                                 <div className='r2 mwid20'>
                                                                                                    
//                                                                                                     <span style={{ color: '#73615F' }}>
//                                                                                                         {new Date(segment.check_in_datetime).toLocaleDateString('en-US', {
//                                                                                                             weekday: 'short',
//                                                                                                             day: 'numeric',
//                                                                                                             month: 'short',
//                                                                                                             year: 'numeric'
//                                                                                                         })}
//                                                                                                     </span>

                                                                                                    
//                                                                                                     <h4>{segment.room_name}</h4>

                                                                                                    
//                                                                                                     {segmentIndex === 0 ? (
//                                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }}>Check-in</span>
//                                                                                                     ) : segmentIndex === option.segments.length - 1 ? (
//                                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }}>Checkout</span>
//                                                                                                     ) : (
//                                                                                                         <br />
//                                                                                                     )}
//                                                                                                     <br />

                                                                                                    
//                                                                                                     <Link href="#" onClick={filterShow} className="room-details-link">
//                                                                                                         Room Details
//                                                                                                     </Link>

                                                                                                    
//                                                                                                     {showPrices && (
//                                                                                                         <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }}>
//                                                                                                             From <br />
//                                                                                                             <span style={{
//                                                                                                                 fontSize: '2rem',
//                                                                                                                 fontWeight: '500',
//                                                                                                                 color: '#BF9039',
//                                                                                                                 fontFamily: 'Felgine',
//                                                                                                                 lineHeight: 'auto'
//                                                                                                             }}>
//                                                                                                                 ₹{segment.price_per_night?.toLocaleString('en-IN') || "0"}
//                                                                                                             </span> <br />
//                                                                                                             / night
//                                                                                                         </p>
//                                                                                                     )}
//                                                                                                 </div>

//                                                                                                 {segmentIndex < option.segments.length - 1 && (
//                                                                                                     <div className='r2 mwid20 text-center'>
//                                                                                                         <Image
//                                                                                                             src='./images/icons/swicth-acess.svg'
//                                                                                                             className='img-fluid mb-2'
//                                                                                                             alt="switch"
//                                                                                                             width={200}
//                                                                                                             height={40}
//                                                                                                         />
//                                                                                                         Room change on <br />
//                                                                                                         {new Date(segment.check_out_datetime).toLocaleDateString('en-US', {
//                                                                                                             weekday: 'short',
//                                                                                                             day: 'numeric',
//                                                                                                             month: 'short',
//                                                                                                             year: 'numeric'
//                                                                                                         })}
//                                                                                                     </div>
//                                                                                                 )}
//                                                                                             </React.Fragment>
//                                                                                         ))}
//                                                                                     </div>

//                                                                                     <div className='d-flex justify-between align-items-start'>
//                                                                                         <div className='colum-1'>
//                                                                                             {option.segments.map((segment, segmentIndex) => (
//                                                                                                 <div key={segment.segment_id} className="room-specs mb-2">
//                                                                                                     <span className="spec-item">{segment.room_name}</span>
//                                                                                                     <span className="spec-item">
//                                                                                                         <Image
//                                                                                                             src="./images/icons/single_bed.svg"
//                                                                                                             width={16}
//                                                                                                             height={16}
//                                                                                                             alt="bed type"
//                                                                                                         />
//                                                                                                         {segment.room_type}
//                                                                                                     </span>

//                                                                                                      {segment.room_type === "Twin-Sharing" && (
//                                                                                                         <div className="room-specs mb-2">
//                                                                                                             <span className='female-preferred'>
//                                                                                                                 Female Preferred
//                                                                                                             </span>
//                                                                                                         </div>
//                                                                                                     )}
//                                                                                                 </div>
//                                                                                             ))}
//                                                                                         </div>

//                                                                                         <div className='colum-2'>
//                                                                                             <Link href="#" className='edit-btn py-2 px-4 mb-3' onClick={filterShow2}>
//                                                                                                 View Details
//                                                                                             </Link>
//                                                                                             <div className="booking-section text-end">
//                                                                                                 <Link href='./Multiswitchreserve' className="reserve-btn">
//                                                                                                     Reserve - ₹{option.total_price?.toLocaleString('en-IN') || "0"}
//                                                                                                 </Link>

//                                                                                                 <div className="mt-2" style={{ fontSize: '0.85rem', color: '#73615F' }}>
//                                                                                                     {option.total_nights} nights • {option.num_switches} switch{option.num_switches !== 1 ? 'es' : ''} • Score: {option.score}
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </Col>
//                                                                     </Row>
//                                                                 </div>
//                                                             </div>
//                                                         ))} */}

//                                                             <hr style={{ margin: '40px 0' }} ></hr>


//                                                             <p className='fs-20 mb-0' >Mixed BR options</p>
//                                                             <p>Single room option is available on one of your rooms upon BR Switch.</p>


//                                                             {/* Room Card 1 */}
//                                                             {/* <div className="room-card mt-2">
//                                                             <div className='border-bottom-custom1 pb-3 mb-3'>
//                                                                 <Row>
//                                                                     <Col md={5}>
//                                                                         <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                                             <div className='d-flex gap-2 align-items-center '>

//                                                                                 <Image
//                                                                                     src="/images/icons/amentiy.jpg"
//                                                                                     alt="Room"
//                                                                                     width={56}
//                                                                                     height={56}
//                                                                                     className="img-fluid"
//                                                                                 />

//                                                                                 <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                             </div>
//                                                                         </Link>

//                                                                     </Col>

//                                                                     <Col md={5}>
//                                                                         <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                                             <div className='d-flex gap-2 align-items-center '>

//                                                                                 <Image
//                                                                                     src="/images/icons/amentiy.jpg"
//                                                                                     alt="Room"
//                                                                                     width={56}
//                                                                                     height={56}
//                                                                                     className="img-fluid"
//                                                                                 />

//                                                                                 <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Yayati Apartments 6th Floor</p>
//                                                                             </div>
//                                                                         </Link>

//                                                                     </Col>
//                                                                 </Row>

//                                                             </div>


//                                                             <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                                 <Row className="align-items-center">

//                                                                     <Col md={9}>
//                                                                         <div className=' room-booking-card w-100 pe-3'>

//                                                                             <div className="room-details">

//                                                                                 <div className='d-flex align-items-center justify-between W-100 mb-3 '>
//                                                                                     <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                                         <h4>Room 2</h4>
//                                                                                         <p className='mb-0'>Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>

//                                                                                         <br></br>
//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                                                     </div>

//                                                                                     <div className='r2 text-center'>
//                                                                                         <Image src='./images/icons/move-mistry.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                                         Room change on <br></br>
//                                                                                         Tue, 5 Aug, 2025
//                                                                                     </div>


//                                                                                     <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
//                                                                                         <h4>Room 4</h4>
//                                                                                         <p className='mb-0'>Yayati Apartments 6th Floor</p>
//                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>

//                                                                                         <br></br>
//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
//                                                                                     </div>

//                                                                                 </div>

//                                                                                 <div className='d-flex justify-between align-items-start'>
//                                                                                     <div className='colum-1'>

//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 3</span> |
//                                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                                         </div>                                                                                        

//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 2</span> |
//                                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                                         </div>
//                                                                                         <p className='mb-0' >Rooms in the same property</p>

//                                                                                     </div>

//                                                                                     <div className='colum-2'>

//                                                                                         <Link href="#" onClick={filterShow3} className='edit-btn py-2 px-4' >View Details</Link>

//                                                                                     </div>

//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </Col>
//                                                                     <Col md={3}>
//                                                                         <div className="booking-section  text-end">
//                                                                             {showPrices && (
//                                                                                 <p className='room-price' >From <br />
//                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                                     / night
//                                                                                 </p>
//                                                                             )}
//                                                                             <Link href='./SmartSearchResult2' className="reserve-btn">Reserve</Link>

//                                                                         </div>
//                                                                     </Col>
//                                                                 </Row>
//                                                             </div>
//                                                         </div> */}


//                                                             {SmartSearchResult?.smart_results?.mixed_property_options?.map((option, optionIndex) => (
//                                                                 <div className="room-card mt-2" key={optionIndex}>
//                                                                     <div key={optionIndex}>
//                                                                         <div className='border-bottom-custom1 pb-3 mb-3'>
//                                                                             <Row>
//                                                                                 {option.segments.map((segment, segmentIndex) => (
//                                                                                     <Col md={5} key={segment.property_id}>
//                                                                                         <Link href={`/propertyDetails?uid=${segment?.property_uid}`} className='text-black text-decoration-none' >
//                                                                                             <div className='d-flex gap-2 align-items-center'>
//                                                                                                 <Image
//                                                                                                     src={`${segment.property_cover_photo}` || "/images/default-property.jpg"}
//                                                                                                     alt={segment.property_name}
//                                                                                                     width={56}
//                                                                                                     height={56}
//                                                                                                     className="img-fluid"
//                                                                                                     style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                                                                                 />
//                                                                                                 <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
//                                                                                                     {segment.property_name}
//                                                                                                 </p>
//                                                                                             </div>
//                                                                                         </Link>
//                                                                                     </Col>
//                                                                                 ))}
//                                                                             </Row>
//                                                                         </div>

//                                                                         <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
//                                                                             <Row className="align-items-center">
//                                                                                 <Col md={9}>
//                                                                                     <div className='room-booking-card w-100 pe-3'>
//                                                                                         <div className="room-details">
//                                                                                             <div className='d-flex align-items-center justify-between w-100 mb-3'>
//                                                                                                 {/* First Segment */}
//                                                                                                 {option.segments.length > 0 && (
//                                                                                                     <div className='r2' style={{ maxWidth: '130px' }}>
//                                                                                                         <span style={{ color: '#73615F' }}>
//                                                                                                             {new Date(option.segments[0].check_in_datetime).toLocaleDateString('en-US', {
//                                                                                                                 weekday: 'short',
//                                                                                                                 day: 'numeric',
//                                                                                                                 month: 'short',
//                                                                                                                 year: 'numeric'
//                                                                                                             })}
//                                                                                                         </span>
//                                                                                                         <h4>{option.segments[0].room_name}</h4>
//                                                                                                         <p className='mb-0'>{option.segments[0].property_name}</p>
//                                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }}>Check-in</span>
//                                                                                                         <br />
//                                                                                                         <Link href="#" onClick={filterShow} className="room-details-link">Room Details</Link>
//                                                                                                     </div>
//                                                                                                 )}

//                                                                                                 {/* Switch Indicator (only show if more than 1 segment) */}
//                                                                                                 {option.segments.length > 1 && (
//                                                                                                     <div className='r2 text-center'>
//                                                                                                         <Image
//                                                                                                             src='./images/icons/move-mistry.svg'
//                                                                                                             className='img-fluid mb-2'
//                                                                                                             alt="switch"
//                                                                                                             width={200}
//                                                                                                             height={40}
//                                                                                                         />
//                                                                                                         Room change on <br />
//                                                                                                         {new Date(option.segments[0].check_out_datetime).toLocaleDateString('en-US', {
//                                                                                                             weekday: 'short',
//                                                                                                             day: 'numeric',
//                                                                                                             month: 'short',
//                                                                                                             year: 'numeric'
//                                                                                                         })}
//                                                                                                     </div>
//                                                                                                 )}

//                                                                                                 {/* Last Segment */}
//                                                                                                 {option.segments.length > 0 && (
//                                                                                                     <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }}>
//                                                                                                         <span style={{ color: '#73615F' }}>
//                                                                                                             {new Date(option.segments[option.segments.length - 1].check_out_datetime).toLocaleDateString('en-US', {
//                                                                                                                 weekday: 'short',
//                                                                                                                 day: 'numeric',
//                                                                                                                 month: 'short',
//                                                                                                                 year: 'numeric'
//                                                                                                             })}
//                                                                                                         </span>
//                                                                                                         <h4>{option.segments[option.segments.length - 1].room_name}</h4>
//                                                                                                         <p className='mb-0'>{option.segments[option.segments.length - 1].property_name}</p>
//                                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }}>Checkout</span>
//                                                                                                         <br />
//                                                                                                         <Link href="#" onClick={filterShow} className="room-details-link">Room Details</Link>
//                                                                                                     </div>
//                                                                                                 )}
//                                                                                             </div>

//                                                                                             <div className='d-flex justify-between align-items-start'>
//                                                                                                 <div className='colum-1'>
//                                                                                                     {/* Render room specs for all segments */}
//                                                                                                     {option.segments.map((segment, index) => (
//                                                                                                         <div className="room-specs mb-2" key={index}>
//                                                                                                             <span className="spec-item">{segment.room_name}</span> |
//                                                                                                             <span className="spec-item">
//                                                                                                                 <Image
//                                                                                                                     src="./images/icons/single_bed.svg"
//                                                                                                                     width={16}
//                                                                                                                     height={16}
//                                                                                                                     alt="bed"
//                                                                                                                 /> {segment.room_type}
//                                                                                                             </span> |
//                                                                                                             <span className="spec-item">{segment.nights} night(s)</span>
//                                                                                                         </div>
//                                                                                                     ))}

//                                                                                                     <p className='mb-0'>Total: {option.total_nights} nights across {option.segments.length} properties</p>
//                                                                                                 </div>

//                                                                                                 <div className='colum-2'>
//                                                                                                     <Link href="#" onClick={filterShow3} className='edit-btn py-2 px-4'>View Details</Link>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </Col>

//                                                                                 <Col md={3}>
//                                                                                     <div className="booking-section text-end">
//                                                                                         {showPrices && (
//                                                                                             <p className='room-price'>
//                                                                                                 From <br />
//                                                                                                 <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>
//                                                                                                     ₹{option.total_price.toLocaleString('en-IN')}
//                                                                                                 </span> <br />
//                                                                                                 / {option.total_nights} nights
//                                                                                             </p>
//                                                                                         )}
//                                                                                         <Link
//                                                                                             href='./Multiswitchreserve'
//                                                                                             className="reserve-btn"
//                                                                                             // onClick={() => handleReserve(option)}
//                                                                                             onClick={() => setItemLocalStorage("reserveRoom", JSON.stringify(option))}
//                                                                                         >
//                                                                                             Reserve
//                                                                                         </Link>
//                                                                                     </div>
//                                                                                 </Col>
//                                                                             </Row>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             ))}



//                                                             {/* <div className="multiswitch-room room-card mt-2">
//                                                             <div className='d-flex gap-2 align-items-center border-bottom-custom1 pb-3 mb-3'>
//                                                                 <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                                     <div className='d-flex gap-2 align-items-center '>

//                                                                         <Image
//                                                                             src="/images/icons/amentiy.jpg"
//                                                                             alt="Room"
//                                                                             width={56}
//                                                                             height={56}
//                                                                             className="img-fluid"
//                                                                         />

//                                                                         <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                     </div>
//                                                                 </Link>

//                                                                 <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                                     <div className='d-flex gap-2 align-items-center '>

//                                                                         <Image
//                                                                             src="/images/icons/proprty.jpg"
//                                                                             alt="Room"
//                                                                             width={56}
//                                                                             height={56}
//                                                                             className="img-fluid"
//                                                                         />

//                                                                         <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Yayati Apartments 6th Floor</p>
//                                                                     </div>
//                                                                 </Link>

//                                                                 <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                                     <div className='d-flex gap-2 align-items-center '>

//                                                                         <Image
//                                                                             src="/images/icons/amentiy.jpg"
//                                                                             alt="Room"
//                                                                             width={56}
//                                                                             height={56}
//                                                                             className="img-fluid"
//                                                                         />

//                                                                         <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                     </div>
//                                                                 </Link>
//                                                             </div>

//                                                             <div className=' border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                                 <Row className="align-items-center">

//                                                                     <Col md={12}>
//                                                                         <div className=' room-booking-card w-100 pe-3'>

//                                                                             <div className="room-details">

//                                                                                 <div className='d-flex justify-between W-100 mb-3 '>
//                                                                                     <div className='r2 mwid20'>
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                                         <h4>Room 4</h4>
//                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                                                         <br></br>

//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                                                         {showPrices && (
//                                                                                             <>

//                                                                                                 <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                                                     / night
//                                                                                                 </p>



//                                                                                             </>

//                                                                                         )}
//                                                                                     </div>

//                                                                                     <div className='r2  mwid20 text-center'>
//                                                                                         <Image src='./images/icons/move-property.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                                         Property change on <br></br>
//                                                                                         Tue, 5 Aug, 2025
//                                                                                     </div>


//                                                                                     <div className='r2  mwid20 text-center'  >
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
//                                                                                         <h4>Room 3</h4>

//                                                                                         <br></br>
//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                                                         {showPrices && (
//                                                                                             <>

//                                                                                                 <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                                                     / night
//                                                                                                 </p>



//                                                                                             </>

//                                                                                         )}
//                                                                                     </div>

//                                                                                     <div className='r2  mwid20 text-center'>
//                                                                                         <Image src='./images/icons/move-property.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                                         Property change on <br></br>
//                                                                                         Tue, 9 Aug, 2025
//                                                                                     </div>


//                                                                                     <div className='r2  mwid20' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }} >
//                                                                                         <span style={{ color: '#73615F' }} >Sun, 10 Aug, 2025</span>
//                                                                                         <h4>Room 3</h4>
//                                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
//                                                                                         <br></br>
//                                                                                         <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                                                         {showPrices && (
//                                                                                             <>

//                                                                                                 <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                                                     / night
//                                                                                                 </p>



//                                                                                             </>

//                                                                                         )}
//                                                                                     </div>

//                                                                                 </div>

//                                                                                 <div className='d-flex justify-between align-items-start'>
//                                                                                     <div className='colum-1'>

//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 3</span>
//                                                                                             <span className="spec-item "><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 twin bed</span>

//                                                                                         </div>

//                                                                                         <div className="room-specs mb-2 ">

//                                                                                             <span className='female-preferred'>
//                                                                                                 Female Preferred
//                                                                                             </span>

                                                                                            
//                                                                                         </div>

//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 2</span>
//                                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                                         </div>



//                                                                                         <div className="room-specs mb-2">
//                                                                                             <span className="spec-item">Room 4</span>
//                                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                                         </div>

//                                                                                     </div>

//                                                                                     <div className='colum-2'>


//                                                                                         <Link href="#" className='edit-btn py-2 px-4 mb-3' onClick={filterShow2}  >View Details</Link>
//                                                                                         <div className="booking-section  text-end">

//                                                                                             <Link href='./Multiswitchreserve' className="reserve-btn">Reserve</Link>

//                                                                                         </div>
//                                                                                     </div>

//                                                                                 </div>




//                                                                             </div>
//                                                                         </div>
//                                                                     </Col>

//                                                                 </Row>
//                                                             </div>


//                                                         </div> */}
//                                                             {/* <hr style={{ margin: '40px 0' }} ></hr>
//                                                             <p className='fs-20 mb-0' >Other options</p>
//                                                             <p>Single room option is partially available on one of your rooms.</p> */}

//                                                             {/* Room Card 1 */}
//                                                             {/* <div className="room-card mt-2">
//                                                                 <Row>
//                                                                     <Col md={5}>
//                                                                         <div className='d-flex gap-2 align-items-center mb-3'>
//                                                                             <Image
//                                                                                 src="/images/icons/amentiy.jpg"
//                                                                                 alt="Room"
//                                                                                 width={56}
//                                                                                 height={56}
//                                                                                 className="img-fluid"
//                                                                             />
//                                                                             <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                         </div>
//                                                                     </Col>


//                                                                 </Row>


//                                                                 <div className='border-bottom-custom1  mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                                                                     <Row className="align-items-center">

//                                                                         <Col md={9}>
//                                                                             <div className=' room-booking-card w-100 pe-3'>

//                                                                                 <div className="room-details">

//                                                                                     <div className='d-flex align-items-center justify-between W-100 mb-3 '>
//                                                                                         <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                                                             <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                                             <h4>N/A</h4>


//                                                                                         </div>

//                                                                                         <div className='r2 text-center'>
//                                                                                             <Image src='./images/icons/no-avaible.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                                             No availability
//                                                                                         </div>


//                                                                                         <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                                                             <span style={{ color: '#73615F' }} >Tue, 5 Aug, 2025</span>
//                                                                                             <h4>N/A</h4>


//                                                                                         </div>

//                                                                                     </div>






//                                                                                 </div>
//                                                                             </div>
//                                                                         </Col>
//                                                                         <Col md={3} className='h-100' >
//                                                                             <div className="booking-section text-end">
//                                                                                 {showPrices && (
//                                                                                     <p className='room-price' >From <br />
//                                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                                         / night
//                                                                                     </p>
//                                                                                 )}
//                                                                                 <p className='mb-0' >This room is already booked for your selected dates.</p>
//                                                                                 <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                                                 <p className='mb-0' >or</p>
//                                                                                 <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                                                     <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                                 </Button>

//                                                                             </div>
//                                                                         </Col>
//                                                                     </Row>
//                                                                 </div>


//                                                                 <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                                     <Row className="align-items-center">

//                                                                         <Col md={9}>
//                                                                             <div className=' room-booking-card w-100 pe-3'>

//                                                                                 <div className="room-details">

//                                                                                     <div className='d-flex align-items-center justify-between W-100 mb-3 '>
//                                                                                         <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                                                             <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                                             <h4>Room 4</h4>

//                                                                                             <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                                                         </div>

//                                                                                         <div className='r2 text-center'>
//                                                                                             <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />

//                                                                                         </div>


//                                                                                         <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                                                             <span style={{ color: '#73615F' }} >Thu, 7 Aug, 2025</span>
//                                                                                             <h4>Room 4</h4>

//                                                                                             <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
//                                                                                         </div>

//                                                                                     </div>

//                                                                                     <div className='d-flex justify-between align-items-start'>
//                                                                                         <div className='colum-1'>

//                                                                                             <div className="room-specs mb-2">
//                                                                                                 <span className="spec-item">Room 3</span>
//                                                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                                             </div>







//                                                                                         </div>

//                                                                                         <div className='colum-2'>

//                                                                                             <Link href="#" onClick={filterShow1} className='edit-btn py-2 px-4' >View Details</Link>

//                                                                                         </div>

//                                                                                     </div>




//                                                                                 </div>
//                                                                             </div>
//                                                                         </Col>
//                                                                         <Col md={3}>
//                                                                             <div className="booking-section  text-end">
//                                                                                 {showPrices && (
//                                                                                     <p className='room-price' >From <br />
//                                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                                         / night
//                                                                                     </p>
//                                                                                 )}
//                                                                                 <Link href='./TwinBedroomReserve2' className="reserve-btn">Reserve</Link>

//                                                                             </div>
//                                                                         </Col>
//                                                                     </Row>
//                                                                 </div>



//                                                             </div> */}
//                                                         </div>
//                                                     </div>
//                                                 </>
//                                             )}
//                                         </>
//                                     </Tab>
//                                     {!isSmartSearchEnabled && (
//                                         <Tab eventKey="twin-sharing-rooms" title="Shared Rooms">
//                                             <div className="property-results">
//                                                 <div className="property-card mb-4">
//                                                     <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                                         <label className='mb-0 d-flex gap-2 align-items-center' >
//                                                             <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                                             Show room prices
//                                                         </label>

//                                                         <div className='filter-right-option d-flex gap-3'>
//                                                             <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                                 <Button variant="" className='btn-sort'> Sort by :
//                                                                     <Select
//                                                                         name="aria-role-select"
//                                                                         options={sortoption}
//                                                                         placeholder="Name"
//                                                                         className="react_selectbox"
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                     />
//                                                                 </Button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     {bookingRoomsData.length > 0 ? bookingRoomsData.map((item, i) => (<div key={i}>
//                                                         <p className='text-right p-title position-relative' >
//                                                             <span>Property {i + 1} </span>  </p>
//                                                         {/* Room Card 1 */}
//                                                         {item?.properties.map((prop, ind) => (<div key={ind} className="room-card mt-2">
//                                                             <Link href={`/propertyDetails?uid=${prop?.property_uid}`} className='text-black text-decoration-none' >
//                                                                 <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
//                                                                     <Image
//                                                                         src={prop?.cover_photo ? `${prop?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                         alt="Room"
//                                                                         width={56}
//                                                                         height={56}
//                                                                         className="img-fluid"
//                                                                         style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                                                     />
//                                                                     <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >{prop?.property_name}</p>
//                                                                 </div>
//                                                             </Link>

//                                                             {prop.rooms.length > 0 && prop.rooms.map((room, index) => (<div key={index} className={room.is_available ? "border-bottom-custom1 mb-3 pb-3" : "border-bottom-custom1 disabled-room mb-3  pb-3"} style={{ borderColor: '#463527' }} >
//                                                                 <Row className="align-items-center">

//                                                                     <Col md={9}>
//                                                                         <div className='d-flex gap-3 room-booking-card'>
//                                                                             <div className="room-image position-relative">
//                                                                                 <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", prop?.property_uid) }}>
//                                                                                     <Image
//                                                                                         src={room?.cover_photo ? `${room?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                                         alt="Room"
//                                                                                         width={104}
//                                                                                         height={192}
//                                                                                         className="img-fluid"
//                                                                                     />

//                                                                                 </Link>

//                                                                                 <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />{room?.room_photos?.length}</span>
//                                                                             </div>
//                                                                             <div className="room-details">
//                                                                                 <div className='r-detail-1'>
//                                                                                     <h4 className='room-title'> {room?.room_name}   {room?.room_type === roomType && <span className='room-type-badge' >Shared Room</span>} </h4>
//                                                                                     <div className="room-specs mb-2">
//                                                                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps {room?.max_guests}</span>
//                                                                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> {room.beds.length} bed</span>
//                                                                                         <span className="spec-item">{room?.room_size_sqft} sq ft</span>
//                                                                                     </div>
//                                                                                     <div className="amenities mb-2">
//                                                                                         {room?.room_amenities.map((amenity, inde) => (<span key={inde} className="amenity-item">{amenity}</span>))}
//                                                                                     </div>

//                                                                                     <Link href="#" onClick={() => { filterShow(room, item.adults) }} className="room-details-link ">Room Details</Link>
//                                                                                 </div>
//                                                                                 <div className="room-specs mb-2">
//                                                                                     {room?.gender_lock && room?.room_type === "Twin-Sharing" &&
//                                                                                         <>
//                                                                                             {room?.gender_lock?.locked_gender === "Male" && (
//                                                                                                 <span className='status-tag male-booked'>
//                                                                                                     Male Booked
//                                                                                                 </span>
//                                                                                             )}
//                                                                                             {room?.gender_lock?.locked_gender === "Female" && (
//                                                                                                 <span className='status-tag female-booked'>
//                                                                                                     Female Booked
//                                                                                                 </span>
//                                                                                             )}
//                                                                                         </>
//                                                                                     }

//                                                                                     {room?.bedroom_preference === "Female" && <span className='female-preferred'>
//                                                                                         Female PREFERRED
//                                                                                     </span>}
//                                                                                     {room?.bedroom_preference === "Male" && <span className='male-preferred'>
//                                                                                         Male PREFERRED
//                                                                                     </span>}
//                                                                                     {room?.available_beds?.length > 0 ? <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>{room?.available_beds?.length} BED LEFT!</span> : <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>NO BED LEFT!</span>}
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </Col>
//                                                                     {room.is_available ? <Col md={3}>
//                                                                         <div className="booking-section  text-end">
//                                                                             {showPrices && (
//                                                                                 <p className='room-price' >From <br />
//                                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹{room.price_per_night}</span> <br />
//                                                                                     / night
//                                                                                 </p>
//                                                                             )}
//                                                                             <Link href='./ReserveBooking' onClick={() => {
//                                                                                 setItemLocalStorage("reserveRoom", JSON.stringify(item?.properties.map(prop => {
//                                                                                     const selectedRooms = prop.rooms.filter(
//                                                                                         selecedRoom => selecedRoom.room_uid === room.room_uid
//                                                                                     );

//                                                                                     // only return prop if the selected room exists
//                                                                                     if (!selectedRooms.length) return null;

//                                                                                     return {
//                                                                                         ...prop,
//                                                                                         rooms: selectedRooms, adultCount: item.adults
//                                                                                     };
//                                                                                 }).filter(Boolean))); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData))
//                                                                             }} className="reserve-btn">Reserve</Link>

//                                                                         </div>
//                                                                     </Col>
//                                                                         :
//                                                                         <Col md={3} className='h-100' >
//                                                                             <div className="booking-section text-end">
//                                                                                 <p className='mb-0' >{room?.booking_info?.message}</p>
//                                                                                 <Button variant="" onClick={marknoShowModal} className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                                                 <p className='mb-0' >or</p>
//                                                                                 <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                                                     <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                                 </Button>


//                                                                             </div>
//                                                                         </Col>}
//                                                                 </Row>
//                                                             </div>))}
//                                                             <>
//                                                                 {/* <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                               <Col md={9}>
//                                 <div className='d-flex gap-3 room-booking-card'>
//                                   <div className="room-image position-relative">
//                                     <Link href="./ViewDetailsResult">
//                                       <Image
//                                         src="/images/icons/room-img1.jpg"
//                                         alt="Room"
//                                         width={104}
//                                         height={192}
//                                         className="img-fluid"
//                                       />
//                                       <p>Booked on your dates</p>

//                                     </Link>

//                                     <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                   </div>
//                                   <div className="room-details">
//                                     <div className='r-detail-1'>
//                                       <h4 className='room-title'> Room 4   <span className='room-type-badge' >Shared Room</span> </h4>
//                                       <div className="room-specs mb-2">
//                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                         <span className="spec-item">538 sq ft</span>
//                                       </div>
//                                       <div className="amenities mb-2">
//                                         <span className="amenity-item">36&quot; flat-screen TV</span>
//                                         <span className="amenity-item">Ceiling fans</span>
//                                         <span className="amenity-item">Coffee maker</span>
//                                         <span className="amenity-item">Robes</span>
//                                         <span className="amenity-item">Hair dryer</span>
//                                         <span className="amenity-item">Iron and ironing board</span>
//                                       </div>

//                                       <Link href="#" className="room-details-link ">Room Details</Link>
//                                     </div>

//                                     <div className="room-specs mb-2 ">

//                                         <span className='status-tag female-booked'>
//                                       Female Booked
//                                       </span>

//                                       <span className='status-tag female-preferred'>
//                                       Female preferred
//                                       </span>

//                                       <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>No bed left!</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </Col>
//                               <Col md={3} className='h-100' >
//                                 <div className="booking-section text-end">
//                                   {showPrices && (
//                                     <p className='room-price' >From <br />
//                                       <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                       / night
//                                     </p>
//                                   )}
//                                   <p className='mb-0' >This room is already booked for your selected dates.</p>
//                                   <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                   <p className='mb-0' >or</p>
//                                   <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                     <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                   </Button>

//                                 </div>
//                               </Col>
//                             </Row>
//                           </div> */}
//                                                             </>

//                                                         </div>))}
//                                                     </div>)) : <>
//                                                         <p className='fs-20 mb-1'>Selected room type is not available for your dates.</p>
//                                                         <p className='mb-3' >Adjust your dates for availability or enable smart search for our suggestions.</p>

//                                                         {/* <Button variant='' className='edit-btn py-2 px-4'>Enable Smart Search</Button> */}
//                                                     </>}
//                                                     <>
//                                                         {/*  <p className='text-right p-title position-relative' >
//                                                         <span>Property 2 </span>  </p>


//                                                     <div className="room-card mt-2">
//                                                         <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
//                                                             <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                                                 <Image
//                                                                     src="/images/icons/amentiy.jpg"
//                                                                     alt="Room"
//                                                                     width={56}
//                                                                     height={56}
//                                                                     className="img-fluid"
//                                                                 />

//                                                                 <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                                             </div>
//                                                         </Link>

//                                                         <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                             <Row className="align-items-center">

//                                                                 <Col md={9}>
//                                                                     <div className='d-flex gap-3 room-booking-card'>
//                                                                         <div className="room-image position-relative">
//                                                                             <Link href="./ViewDetailsResult">
//                                                                                 <Image
//                                                                                     src="/images/icons/room-img1.jpg"
//                                                                                     alt="Room"
//                                                                                     width={104}
//                                                                                     height={192}
//                                                                                     className="img-fluid"
//                                                                                 />

//                                                                             </Link>

//                                                                             <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                                         </div>
//                                                                         <div className="room-details">
//                                                                             <div className='r-detail-1'>
//                                                                                 <h4 className='room-title'> Room 4   <span className='room-type-badge' >Shared Room</span> </h4>
//                                                                                 <div className="room-specs mb-2">
//                                                                                     <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 4 </span>
//                                                                                     <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 4 twin bed</span>
//                                                                                     <span className="spec-item">538 sq ft</span>
//                                                                                 </div>
//                                                                                 <div className="amenities mb-2">
//                                                                                     <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                                     <span className="amenity-item">Ceiling fans</span>
//                                                                                     <span className="amenity-item">Coffee maker</span>
//                                                                                     <span className="amenity-item">Robes</span>
//                                                                                     <span className="amenity-item">Hair dryer</span>
//                                                                                     <span className="amenity-item">Iron and ironing board</span>
//                                                                                 </div>

//                                                                                 <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
//                                                                             </div>
//                                                                             <div className="room-specs mb-2 ">

//                                                                                 <span className='status-tag male-booked'>
//                                                                                     Male Booked
//                                                                                 </span>

//                                                                                 <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>Only 1 bed left!</span>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </Col>
//                                                                 <Col md={3}>
//                                                                     <div className="booking-section  text-end">
//                                                                         {showPrices && (
//                                                                             <p className='room-price' >From <br />
//                                                                                 <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                                 / night
//                                                                             </p>
//                                                                         )}
//                                                                         <Link href='./TwinBedroomReserve' className="reserve-btn">Reserve</Link>

//                                                                     </div>
//                                                                 </Col>
//                                                             </Row>
//                                                         </div>

//                                                         <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                             <Row className="align-items-center">

//                                                                 <Col md={9}>
//                                                                     <div className='d-flex gap-3 room-booking-card'>
//                                                                         <div className="room-image position-relative">
//                                                                             <Link href="./ViewDetailsResult">
//                                                                                 <Image
//                                                                                     src="/images/icons/room-img1.jpg"
//                                                                                     alt="Room"
//                                                                                     width={104}
//                                                                                     height={192}
//                                                                                     className="img-fluid"
//                                                                                 />

//                                                                             </Link>

//                                                                             <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                                         </div>
//                                                                         <div className="room-details">
//                                                                             <div className='r-detail-1'>
//                                                                                 <h4 className='room-title'> Room 2   <span className='room-type-badge' >Shared Room</span> </h4>
//                                                                                 <div className="room-specs mb-2">
//                                                                                     <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                                     <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 twin bed</span>
//                                                                                     <span className="spec-item">538 sq ft</span>
//                                                                                 </div>
//                                                                                 <div className="amenities mb-2">
//                                                                                     <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                                     <span className="amenity-item">Ceiling fans</span>
//                                                                                     <span className="amenity-item">Coffee maker</span>
//                                                                                     <span className="amenity-item">Robes</span>
//                                                                                     <span className="amenity-item">Hair dryer</span>
//                                                                                     <span className="amenity-item">Iron and ironing board</span>
//                                                                                 </div>

//                                                                                 <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
//                                                                             </div>
//                                                                             <div className="room-specs mb-2 ">

//                                                                                 <span className='status-tag female-booked'>
//                                                                                     Female Booked
//                                                                                 </span>

//                                                                                 <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>Only 2 bed left!</span>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </Col>
//                                                                 <Col md={3}>
//                                                                     <div className="booking-section  text-end">
//                                                                         {showPrices && (
//                                                                             <p className='room-price' >From <br />
//                                                                                 <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                                 / night
//                                                                             </p>
//                                                                         )}
//                                                                         <Link href='./SingleRoomBr' className="reserve-btn">Reserve</Link>

//                                                                     </div>
//                                                                 </Col>
//                                                             </Row>
//                                                         </div>



//                                                     </div> */}
//                                                     </>
//                                                 </div>
//                                             </div>

//                                         </Tab>
//                                     )}

//                                 </Tabs>
//                             )}
//                         </Col>
//                         <Col md={5}>
//                             <div className='br-property-maps' style={{
//                                 height: "600px",
//                                 width: "100%",
//                                 borderRadius: "12px",
//                                 overflow: "hidden",
//                             }}>
//                                 <PropertyMap properties={bookingRoomsData[0]?.properties} />
//                                 {/* <DynamicMap
//                                     locations={mapDataArr}
//                                 /> */}
//                                 {/* <Image
//                                     src='/images/icons/br-proerty-map.jpg'
//                                     className='img-fluid w-100'
//                                     alt='property-map'
//                                     width={500}
//                                     height={600}
//                                 /> */}
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//             <Modal
//                 show={addTravels}
//                 onHide={removeTravel}
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

//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel} />
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
//                                         isDisabled={companyList.length > 1 ? false : true}
//                                         value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
//                                         // onChange={option => { setSearchFieldData({ ...searchFieldData, company_id: option.value }) }}
//                                         onChange={option => { setSearchFieldData({ ...searchFieldData, company_id: option.value, company_name: option.label, c_uid: option.uid,city:'' }); }}
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
//                                         // getOptionLabel={(option) => option.city}
//                                         // getOptionValue={(option) => option.city}
//                                         value={cityList?.find(c => c.value === searchFieldData.city) || null}
//                                         onChange={(option) =>
//                                             setSearchFieldData({ ...searchFieldData, city: option.value })
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

//             {/* <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
//                     <Modal.Title className='d-flex align-items-center gap-3'>
//                         Casa Melhor Yayati Tulip 17th Floor <br></br> Room 3
//                     </Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className="room-details-modal">
//                         <div className="room-image-gallery mb-4">
//                             <Row>
//                                 <Col md={12}>
//                                     <div className="main-image-container position-relative">
//                                         <Image
//                                             src="/images/icons/slide-image.jpg"
//                                             alt="Room"
//                                             width={1000}
//                                             height={500}
//                                             className="img-fluid w-100"
//                                         />
//                                         <div className="image-navigation">
//                                             <Button variant="" className="nav-btn prev">
//                                                 <Image src="/images/icons/left-a.svg" width={12} height={20} alt="Previous" />
//                                             </Button>
//                                             <Button variant="" className="nav-btn next">
//                                                 <Image src="/images/icons/right-a.svg" width={12} height={20} alt="Next" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>

//                         <div className="room-info mb-4">
//                             <Row>
//                                 <Col md={12}>
//                                     <div className="room-specs d-flex align-items-center gap-3 mb-3">
//                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={24} height={24} alt="bed" /> Sleeps 2</span> |
//                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={24} height={24} alt="area" /> 2 twin beds</span> |
//                                         <span className="spec-item">538 sq ft</span>
//                                     </div>
//                                     <div className="booking-status d-flex gap-3 mb-3">
//                                         <span className="status-tag female-booked">FEMALE BOOKED</span>
//                                         <p className="only-left mt-2">ONLY 1 BED LEFT!</p>
//                                     </div>
//                                     <p className="room-description">
//                                         {showFull ? fullText : shortText}
//                                     </p>
//                                     <Button
//                                         variant="link"
//                                         className="read-more-btn-full mt-3"
//                                         onClick={() => setShowFull(!showFull)}
//                                     >
//                                         {showFull ? "Hide full description" : "Read full description"}
//                                         <Image
//                                             src="./images/icons/double-arrows.svg"
//                                             className="img-fluid ms-2"
//                                             alt="d-arrow"
//                                             width={16}
//                                             height={16}
//                                             style={{
//                                                 transform: showFull ? "rotate(90deg)" : "rotate(-90deg)",
//                                                 transition: "0.2s",
//                                             }}
//                                         />
//                                     </Button>
//                                 </Col>

//                             </Row>
//                         </div>

//                         <hr style={{ margin: '40px 0' }} ></hr>

//                         <div className="room-amenities">
//                             <h5 className="section-title mb-4 mt-3">Room amenities</h5>

//                             <Row className="g-4">
//                                 {visibleAmenities.map((item, index) => (
//                                     <Col xs={6} key={index}>
//                                         <div className="amenity-item d-flex align-items-center gap-2">
//                                             <Image src={item.icon} width={24} height={24} alt={item.label} />
//                                             <span>{item.label}</span>
//                                         </div>
//                                     </Col>
//                                 ))}
//                             </Row>

//                             <Button
//                                 variant="link"
//                                 className="read-more-btn-full mt-3"
//                                 onClick={() => setShowAll(!showAll)}
//                             >
//                                 {showAll
//                                     ? "Hide amenities"
//                                     : `Show all ${amenities.length} amenities`}

//                                 <Image
//                                     src="./images/icons/double-arrows.svg"
//                                     className="img-fluid ms-2"
//                                     alt='arrow'
//                                     width={16}
//                                     height={16}
//                                     style={{
//                                         transform: showAll ? "rotate(90deg)" : "rotate(-90deg)",
//                                         transition: "0.2s",
//                                     }}
//                                 />
//                             </Button>
//                         </div>
//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>

//                     <Link href="./SingleRoomBr" variant="" className='search-btn complete-form-btn w-100 text-center' style={{ padding: '13px 25px', borderRadius: '0' }} >
//                         Reserve
//                     </Link>
//                 </Modal.Footer>

//             </Modal> */}
//             {/* room details */}
//             {filtermShow && <Modal show={filtermShow && !!seletedRoomData} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
//                     <Modal.Title className='d-flex align-items-center gap-3'>
//                         {seletedRoomData?.[0]?.property_name} <br></br> {seletedRoomData?.[0]?.rooms?.[0]?.room_name}
//                     </Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className="room-details-modal">
//                         <div className="room-image-gallery mb-4">
//                             <Row>
//                                 <Col md={12}>
//                                     {seletedRoomData?.[0]?.rooms?.[0]?.room_photos?.length > 0 ? <div className="main-image-container position-relative">
//                                         <Image
//                                             src={seletedRoomData?.[0]?.rooms?.[0]?.room_photos[currentIndex]?.room_photo_url ? `${seletedRoomData?.[0]?.rooms?.[0]?.room_photos[currentIndex]?.room_photo_url}` : `/images/icons/No-Image.svg`}
//                                             alt="Room"
//                                             width={1000}
//                                             height={500}
//                                             className="img-fluid w-100"
//                                         />
//                                         <div className="image-navigation">
//                                             <Button variant="" onClick={() => {
//                                                 setCurrentIndex((prev) =>
//                                                     prev === 0 ? seletedRoomData?.[0]?.rooms?.[0]?.room_photos.length - 1 : prev - 1
//                                                 );
//                                             }} className="nav-btn prev">
//                                                 <Image src="/images/icons/left-a.svg" width={12} height={20} alt="Previous" />
//                                             </Button>
//                                             <Button variant="" disabled={seletedRoomData?.[0]?.rooms?.[0]?.room_photos.length === 1} onClick={() => {
//                                                 setCurrentIndex((prev) =>
//                                                     prev === seletedRoomData?.[0]?.rooms?.[0]?.room_photos.length - 1 ? 0 : prev + 1
//                                                 );
//                                             }} className="nav-btn next">
//                                                 <Image src="/images/icons/right-a.svg" width={12} height={20} alt="Next" />
//                                             </Button>
//                                         </div>
//                                     </div> : <div className="main-image-container position-relative">
//                                         <Image
//                                             src={seletedRoomData?.[0]?.rooms?.[0]?.cover_photo ? `${seletedRoomData?.[0]?.rooms?.[0]?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                             alt="Room"
//                                             width={1000}
//                                             height={500}
//                                             className="img-fluid w-100"
//                                         />
//                                     </div>}
//                                 </Col>
//                             </Row>
//                         </div>

//                         <div className="room-info mb-4">
//                             <Row>
//                                 <Col md={12}>
//                                     <div className="room-specs d-flex align-items-center gap-3 mb-3">
//                                         <span className="spec-item"><Image src="./images/icons/person.svg" width={24} height={24} alt="bed" /> Sleeps {seletedRoomData?.[0]?.rooms?.[0]?.max_guests}</span> |
//                                         <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={24} height={24} alt="area" /> {seletedRoomData?.[0]?.rooms?.[0]?.beds?.length} beds</span> |
//                                         <span className="spec-item">{seletedRoomData?.[0]?.rooms?.[0]?.room_size_sqft} sq ft</span>
//                                     </div>
//                                     <div className="booking-status d-flex gap-3 mb-3">
//                                         {seletedRoomData?.[0]?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && <span className="status-tag female-booked">FEMALE BOOKED</span>}
//                                         {seletedRoomData?.[0]?.rooms?.[0]?.room_type === "Twin-Sharing" && (seletedRoomData?.[0]?.rooms?.[0]?.available_beds?.length > 0 ? <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>{seletedRoomData?.[0]?.rooms?.[0]?.available_beds?.length} BED LEFT!</span> : <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>NO BED LEFT!</span>)}
//                                     </div>
//                                     <p className="room-description">
//                                         {/* {showFull ? seletedRoomData?.[0]?.rooms?.[0]?.room_description : seletedRoomData?.[0]?.rooms?.[0]?.room_description?.split(" ")?.slice(0, 10)?.join(" ") + "..."} */}
//                                         {showFull ? roomDescription : truncatedDescription}
//                                     </p>
//                                     {/* <Button
//                                         variant="link"
//                                         className="read-more-btn-full mt-3"
//                                         onClick={() => setShowFull(!showFull)}
//                                     >
//                                         {showFull ? "Hide full description" : "Read full description"}
//                                         <Image
//                                             src="./images/icons/double-arrows.svg"
//                                             className="img-fluid ms-2"
//                                             alt="d-arrow"
//                                             width={16}
//                                             height={16}
//                                             style={{
//                                                 transform: showFull ? "rotate(90deg)" : "rotate(-90deg)",
//                                                 transition: "0.2s",
//                                             }}
//                                         />
//                                     </Button> */}
//                                     {roomDescription && roomDescription.split(" ").length > 100 && (
//                                         <Button
//                                             variant="link"
//                                             className="read-more-btn-full mt-3"
//                                             onClick={() => setShowFull(!showFull)}
//                                         >
//                                             {showFull ? "Hide full description" : "Read full description"}
//                                             <Image
//                                                 src="./images/icons/double-arrows.svg"
//                                                 className="img-fluid ms-2"
//                                                 alt="d-arrow"
//                                                 width={16}
//                                                 height={16}
//                                                 style={{
//                                                     transform: showFull ? "rotate(90deg)" : "rotate(-90deg)",
//                                                     transition: "0.2s",
//                                                 }}
//                                             />
//                                         </Button>
//                                     )}
//                                 </Col>

//                             </Row>
//                         </div>

//                         <hr style={{ margin: '40px 0' }} ></hr>

//                         <div className="room-amenities">
//                             <h5 className="section-title mb-4 mt-3">Room amenities</h5>

//                             <Row className="g-4">
//                                 {visibleAmenities?.map((item, index) => (
//                                     <Col xs={6} key={index}>
//                                         <div className="amenity-item d-flex align-items-center gap-2">
//                                             <Image src={item.icon} width={24} height={24} alt={item.label} />
//                                             <span>{item.label}</span>
//                                         </div>
//                                     </Col>
//                                 ))}
//                             </Row>
//                             {seletedRoomData?.[0]?.rooms?.[0]?.room_amenities?.length > 4 && (
//                                 <Button
//                                     variant="link"
//                                     className="read-more-btn-full mt-3"
//                                     onClick={() => setShowAll(!showAll)}
//                                 >
//                                     {showAll
//                                         ? "Hide amenities"
//                                         : `Show all ${seletedRoomData?.[0]?.rooms?.[0]?.room_amenities?.length - visibleAmenities.length} amenities`}

//                                     <Image
//                                         src="./images/icons/double-arrows.svg"
//                                         className="img-fluid ms-2"
//                                         alt='arrow'
//                                         width={16}
//                                         height={16}
//                                         style={{
//                                             transform: showAll ? "rotate(90deg)" : "rotate(-90deg)",
//                                             transition: "0.2s",
//                                         }}
//                                     />
//                                 </Button>
//                             )}
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <Link href='./ReserveBooking' onClick={() => { setItemLocalStorage("reserveRoom", JSON.stringify(seletedRoomData)); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData)) }} variant="" className='search-btn complete-form-btn w-100 text-center' style={{ padding: '13px 25px', borderRadius: '0' }} >

//                         Reserve

//                     </Link>
//                     {/* <Link href="./SingleRoomBr" variant="" className='search-btn complete-form-btn w-100 text-center' style={{ padding: '13px 25px', borderRadius: '0' }} >
//                         Reserve
//                     </Link> */}
//                 </Modal.Footer>

//             </Modal>}
//             <Modal show={marknoShowsModal} onHide={marknoShowClose} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

//                     <Modal.Title>
//                         {/* Casa Melhor Yayati Tulip 17th Floor / Room 3 */}
//                         {selectedPropertyName} / {selectedRoomName}
//                     </Modal.Title>

//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={marknoShowClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>

//                     <p>Room Availability</p>


//                     <div className="calendar-section ">
//                         <div className="custom-calendar-wrapper">
//                             <DatePicker
//                                 selectsRange
//                                 // selected={selectedDate}
//                                 // onChange={date => setStartDate(date)}
//                                 startDate={startDate}
//                                 endDate={endDate}
//                                 onChange={(update) => {
//                                     setDateRange(update);
//                                 }}
//                                 inline
//                                 showMonthYearPicker={false}
//                                 monthsShown={1}
//                                 minDate={startDate || new Date()}
//                                 // maxDate={new Date("2025/08/31")}
//                                 showDisabledMonthNavigation
//                                 fixedHeight
//                                 dateFormat="MMMM yyyy"
//                                 // defaultValue={new Date("2025/08/01")}
//                                 // excludeDates={}
//                                 filterDate={isDateAvailable}
//                                 renderCustomHeader={({
//                                     date,
//                                     decreaseMonth,
//                                     increaseMonth,
//                                     //prevMonthButtonDisabled,
//                                     // nextMonthButtonDisabled
//                                 }) => (
//                                     <div className="custom-header">
//                                         <span className="month-year">
//                                             {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                                         </span>
//                                         <div className="navigation-buttons">
//                                             {/* <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
//                         <Image src="/images/icons/left-a.svg" width={12} height={20} alt="Previous" />
//                       </button> */}
//                                             <button onClick={increaseMonth} >
//                                                 <Image src="/images/icons/right-a.svg" width={12} height={20} alt="Next" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                                 dayClassName={date => {
//                                     if (date.getDate() >= 17 && date.getDate() <= 21) {
//                                         return 'highlighted-date'
//                                     }
//                                     return 'normal-date'
//                                 }}
//                             />
//                         </div>
//                     </div>

//                 </Modal.Body>



//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     {/* <Button variant="" className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
//             Cancel
//           </Button> */}
//                     <Button variant="" onClick={Detailurl} className='search-btn complete-form-btn ms-auto' style={{ padding: '13px 25px', borderRadius: '0' }}  >
//                         View Details
//                     </Button>
//                 </Modal.Footer>



//             </Modal>


//             {/*  */}


//             <Modal show={filtermShow1} size="lg" onHide={filterClose1} animation={false} centered className='custom-theme-modal2' >
//                 <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
//                     <Modal.Title className='d-flex align-items-center gap-3'>
//                         Stay details
//                     </Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose1} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className="room-card px-3 py-3" style={{ background: '#fff' }}>
//                         <Row>
//                             <Col md={5}>
//                                 <div className='d-flex gap-2 align-items-center '>
//                                     <Image
//                                         src="/images/icons/amentiy.jpg"
//                                         alt="Room"
//                                         width={56}
//                                         height={56}
//                                         className="img-fluid"
//                                         style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                     />
//                                     <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                 </div>
//                             </Col>


//                         </Row>

//                         <hr></hr>




//                         <div className='  ' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                                 <Col md={8}>
//                                     <div className=' room-booking-card w-100 pe-3'>

//                                         <div className="room-details">

//                                             <div className='d-flex align-items-center justify-between W-100  '>
//                                                 <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>

//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                                 <div className='r2 text-center'>
//                                                     <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                     2 Nights
//                                                 </div>


//                                                 <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                             </div>

//                                             <div className='d-flex justify-between align-items-start'>
//                                                 <div className='colum-1'>
//                                                 </div>



//                                             </div>




//                                         </div>
//                                     </div>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="booking-sections  ">
//                                         <div className="room-specs d-flex gap-2 mb-2 justify-end">

//                                             <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                         </div>

//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>



//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>

//                     <Button variant="" className='search-btn complete-form-btn w-100' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={filterClose1}>
//                         Reserve
//                     </Button>
//                 </Modal.Footer>

//             </Modal>



//             {/*  */}


//             <Modal show={filtermShow2} size="lg" onHide={filterClose2} animation={false} centered className='custom-theme-modal2' >
//                 <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
//                     <Modal.Title className='d-flex align-items-center gap-3'>
//                         Stay details
//                     </Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose2} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>

//                     <div className='room-light-card px-3 py-3 mb-4' style={{ background: '#F2EEEB' }} >
//                         <div className='  ' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                                 <Col md={8}>
//                                     <div className=' room-booking-cards no-border w-100 pe-3'>

//                                         <div className="room-details">

//                                             <div className='d-flex align-items-center justify-between W-100  '>
//                                                 <div className='r2'   >

//                                                     <h4>Room 4</h4>
//                                                     <p> Casa Melhor Yayati Tulip 17th Floor</p>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >2 nights</span>
//                                                 </div>

//                                                 <div className='r2 text-center'>
//                                                     <Image src='./images/icons/Arrow1.svg' className='img-fluid mb-2' alt="switch" width={50} height={40} />

//                                                 </div>


//                                                 <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '' }} >

//                                                     <h4>Room 4</h4>
//                                                     <p> Casa Melhor Yayati Tulip 17th Floor</p>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >2 nights</span>
//                                                 </div>

//                                             </div>

//                                             <div className='d-flex justify-between align-items-start'>
//                                                 <div className='colum-1'>
//                                                 </div>
//                                             </div>
//                                         </div>


//                                     </div>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="booking-sections  ">
//                                         <div className="room-specs d-flex gap-2 mb-0 justify-end">
//                                             4 nights in total
//                                             {/* <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span> */}

//                                         </div>

//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>
//                     </div>
//                     <div className="room-card border px-3 py-3 mb-4" style={{ background: '#fff' }}>
//                         <Row>
//                             <Col md={5}>
//                                 <div className='d-flex gap-2 align-items-center '>
//                                     <Image
//                                         src="/images/icons/amentiy.jpg"
//                                         alt="Room"
//                                         width={56}
//                                         height={56}
//                                         className="img-fluid"
//                                         style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                     />
//                                     <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                 </div>
//                             </Col>


//                         </Row>

//                         <hr></hr>




//                         <div className='  ' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                                 <Col md={8}>
//                                     <div className=' room-booking-card w-100 pe-3'>

//                                         <div className="room-details">

//                                             <div className='d-flex align-items-center justify-between W-100  '>
//                                                 <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>

//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                                 <div className='r2 text-center'>
//                                                     <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                     2 Nights
//                                                 </div>


//                                                 <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                             </div>

//                                             <div className='d-flex justify-between align-items-start'>
//                                                 <div className='colum-1'>
//                                                 </div>
//                                             </div>
//                                         </div>


//                                     </div>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="booking-sections  ">
//                                         <div className="room-specs d-flex gap-2 mb-2 justify-end">

//                                             <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                         </div>

//                                         <p className='female-preferred py-1 px-1 text-uppercase mb-0 d-table ms-auto me-0' style={{ color: '#E83E8C', background: '#E83E8C1F', borderRadius: '4px', fontSize: '12px' }} >
//                                             Female PREFERRED
//                                         </p>

//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>
//                     </div>


//                     <div className='mb-4' style={{ borderColor: '#463527' }} >
//                         <Row className="align-items-center">

//                             <Col md={8}>
//                                 <div className=' room-booking-cards no-border w-100 pe-3'>

//                                     <div className="room-details">

//                                         <div className='d-flex align-items-center  W-100 gap-3  '>
//                                             <Image src='/images/icons/room-vertical.svg' width={24} height={98} alt='room' />
//                                             <div className='romm-1'>
//                                                 <p className='fs-18 mb-1'>Room change on Tue, 5 Aug, 2025</p>
//                                                 <p className='mb-2 fw-medium' >Rooms in the same property</p>

//                                                 <p className='mb-0 ' >Guests change room when checking out</p>

//                                             </div>
//                                         </div>

//                                         <div className='d-flex justify-between align-items-start'>
//                                             <div className='colum-1'>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>
//                             </Col>

//                         </Row>
//                     </div>



//                     <div className="room-card border px-3 py-3 mb-4" style={{ background: '#fff' }}>
//                         <Row>
//                             <Col md={5}>
//                                 <div className='d-flex gap-2 align-items-center '>
//                                     <Image
//                                         src="/images/icons/amentiy.jpg"
//                                         alt="Room"
//                                         width={56}
//                                         height={56}
//                                         className="img-fluid"
//                                         style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                     />
//                                     <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                 </div>
//                             </Col>
//                         </Row>

//                         <hr></hr>




//                         <div className='  ' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                                 <Col md={8}>
//                                     <div className=' room-booking-card w-100 pe-3'>

//                                         <div className="room-details">

//                                             <div className='d-flex align-items-center justify-between W-100  '>
//                                                 <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>

//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                                 <div className='r2 text-center'>
//                                                     <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                     2 Nights
//                                                 </div>


//                                                 <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                             </div>

//                                             <div className='d-flex justify-between align-items-start'>
//                                                 <div className='colum-1'>
//                                                 </div>
//                                             </div>

//                                         </div>


//                                     </div>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="booking-sections  ">
//                                         <div className="room-specs d-flex gap-2 mb-2 justify-end">

//                                             <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                         </div>

//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>

//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>

//                     <Button variant="" className='search-btn complete-form-btn w-100' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={filterClose1}>
//                         Reserve
//                     </Button>
//                 </Modal.Footer>

//             </Modal>


//             {/* view */}

//             <Modal show={filtermShow3} size="lg" onHide={filterClose3} animation={false} centered className='custom-theme-modal2' >
//                 <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
//                     <Modal.Title className='d-flex align-items-center gap-3'>
//                         Stay details
//                     </Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose3} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>

//                     <div className='room-light-card px-3 py-3 mb-4' style={{ background: '#F2EEEB' }} >
//                         <div className='  ' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                                 <Col md={8}>
//                                     <div className=' room-booking-cards no-border w-100 pe-3'>

//                                         <div className="room-details">

//                                             <div className='d-flex align-items-center justify-between W-100  '>
//                                                 <div className='r2'   >

//                                                     <h4>Room 4</h4>
//                                                     <p> Casa Melhor Yayati Tulip 17th Floor</p>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >2 nights</span>
//                                                 </div>

//                                                 <div className='r2 text-center'>
//                                                     <Image src='./images/icons/Arrow1.svg' className='img-fluid mb-2' alt="switch" width={50} height={40} />

//                                                 </div>


//                                                 <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '' }} >

//                                                     <h4>Room 4</h4>
//                                                     <p> Casa Melhor Yayati Tulip 17th Floor</p>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >2 nights</span>
//                                                 </div>

//                                             </div>

//                                             <div className='d-flex justify-between align-items-start'>
//                                                 <div className='colum-1'>
//                                                 </div>
//                                             </div>

//                                         </div>


//                                     </div>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="booking-sections  ">
//                                         <div className="room-specs d-flex gap-2 mb-0 justify-end">
//                                             4 nights in total
//                                             {/* <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span> */}

//                                         </div>

//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>
//                     </div>
//                     <div className="room-card border px-3 py-3 mb-4" style={{ background: '#fff' }}>
//                         <Row>
//                             <Col md={5}>
//                                 <div className='d-flex gap-2 align-items-center '>
//                                     <Image
//                                         src="/images/icons/amentiy.jpg"
//                                         alt="Room"
//                                         width={56}
//                                         height={56}
//                                         className="img-fluid"
//                                         style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                     />
//                                     <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                 </div>
//                             </Col>


//                         </Row>

//                         <hr></hr>




//                         <div className='  ' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                                 <Col md={8}>
//                                     <div className=' room-booking-card w-100 pe-3'>

//                                         <div className="room-details">

//                                             <div className='d-flex align-items-center justify-between W-100  '>
//                                                 <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>

//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                                 <div className='r2 text-center'>
//                                                     <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                     2 Nights
//                                                 </div>


//                                                 <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                     <span style={{ color: '#73615F' }} >Tue, 5 Aug, 2025</span>
//                                                     <h4>Room 4</h4>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
//                                                 </div>

//                                             </div>

//                                             <div className='d-flex justify-between align-items-start'>
//                                                 <div className='colum-1'>









//                                                 </div>



//                                             </div>




//                                         </div>


//                                     </div>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="booking-sections  ">
//                                         <div className="room-specs d-flex gap-2 mb-2 justify-end">

//                                             <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 king bed</span>

//                                         </div>

//                                         <p className='female-preferred py-1 px-1 text-uppercase mb-0 d-table ms-auto me-0' style={{ color: '#E83E8C', background: '#E83E8C1F', borderRadius: '4px', fontSize: '12px' }} >
//                                             Female PREFERRED
//                                         </p>

//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>
//                     </div>


//                     <div className='mb-4' style={{ borderColor: '#463527' }} >
//                         <Row className="align-items-center">

//                             <Col md={8}>
//                                 <div className=' room-booking-cards no-border w-100 pe-3'>

//                                     <div className="room-details">

//                                         <div className='d-flex align-items-center  W-100 gap-3  '>
//                                             <Image src='/images/icons/room-vertical.svg' width={24} height={98} alt='room' />
//                                             <div className='romm-1'>
//                                                 <p className='fs-18 mb-1'>Room change on Tue, 5 Aug, 2025</p>
//                                                 <p className='mb-2 fw-medium' >Rooms in the same property</p>

//                                                 <p className='mb-0 ' >Guests change room when checking out</p>

//                                             </div>
//                                         </div>

//                                         <div className='d-flex justify-between align-items-start'>
//                                             <div className='colum-1'>
//                                             </div>

//                                         </div>

//                                     </div>


//                                 </div>
//                             </Col>

//                         </Row>
//                     </div>



//                     <div className="room-card border px-3 py-3 mb-4" style={{ background: '#fff' }}>
//                         <Row>
//                             <Col md={5}>
//                                 <div className='d-flex gap-2 align-items-center '>
//                                     <Image
//                                         src="/images/icons/amentiy.jpg"
//                                         alt="Room"
//                                         width={56}
//                                         height={56}
//                                         className="img-fluid"
//                                         style={{ objectFit: 'cover', aspectRatio: '1/1' }}
//                                     />
//                                     <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                 </div>
//                             </Col>


//                         </Row>

//                         <hr></hr>




//                         <div className='  ' style={{ borderColor: '#463527' }} >
//                             <Row className="align-items-center">

//                                 <Col md={8}>
//                                     <div className=' room-booking-card w-100 pe-3'>

//                                         <div className="room-details">

//                                             <div className='d-flex align-items-center justify-between W-100  '>
//                                                 <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>

//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                                 <div className='r2 text-center'>
//                                                     <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                     2 Nights
//                                                 </div>
//                                                 <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                     <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                     <h4>Room 4</h4>
//                                                     <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                 </div>

//                                             </div>

//                                             <div className='d-flex justify-between align-items-start'>
//                                                 <div className='colum-1'>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </Col>
//                                 <Col md={4}>
//                                     <div className="booking-sections  ">
//                                         <div className="room-specs d-flex gap-2 mb-2 justify-end">

//                                             <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                         </div>



//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>
//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>

//                     <Button variant="" className='search-btn complete-form-btn w-100' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={filterClose1}>
//                         Reserve
//                     </Button>
//                 </Modal.Footer>

//             </Modal>


//             {/* cart design */}

//             {cartBox.length && (
//                 <div className="cart-overlay">
//                     <Container>
//                         <Row>
//                             <Col md={4}>
//                                 <div className='total-paid'>
//                                     <div className="d-flex align-items-center gap-2"> <p className='fs-18 mb-0' >Total to be paid  </p><h3 className='font-24 mb-0' style={{ color: '#BF9039' }} >₹{Math.round(calculateNights(searchFieldData.check_in_date, searchFieldData.check_out_date) * totalPrice)}</h3></div>
//                                     Total for {calculateNights(searchFieldData.check_in_date, searchFieldData.check_out_date)} nights, {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`} (Inclusive of taxes, fees and property imposed charges)
//                                 </div>
//                             </Col>
//                             <Col md={8}>
//                                 <div className='d-flex justify-end align-items-center select-twin-rooms h-100'>
//                                     <Row className='justify-end h-100' >
//                                         {bookingMultiRoomsData.length != cartBox.length && (
//                                             <Col md={4} className='d-flex h-100 align-items-center' >
//                                                 <p className="mb-0 fs-12" style={{ fontSize: '14px' }}  >Please select one more bed/room to meet your requirement</p>
//                                             </Col>
//                                         )}


//                                         {cartBox.map((item, index) => (
//                                             <Col md={3} className='d-flex h-100 align-items-center' key={index}>
//                                                 <div className='room-info d-flex gap-2 align-items-center relative'>
//                                                     <Image src={item.property_photo ? `${item.property_photo}` : "./images/icons/proprty.jpg"}
//                                                         className='img-fluid'
//                                                         width={48}
//                                                         height={48}
//                                                         alt='rooms' />

//                                                     <span className='remove-room'>
//                                                         <Image onClick={() => handleCartData(item)} src="./images/icons/minus.svg"
//                                                             className='img-fluid'
//                                                             width={16}
//                                                             height={16}
//                                                             alt='rooms' />
//                                                     </span>

//                                                     <div className='room-name'>
//                                                         <p className="mb-0 fw-medium" style={{ fontSize: '12px', lineHeight: '16px', color: '#463527' }}>{item?.room_name}</p>
//                                                         <p className="mb-0" style={{ fontSize: '12px', lineHeight: '16px' }}>{item?.property_name}</p>
//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                         ))}

//                                         <Col md={4} className='d-flex h-100 align-items-center justify-end'>

//                                             <Button onClick={handleGuests} variant='success' className='submit-btn' style={{ borderRadius: '0', background: '#2C734A', padding: '12px 24px' }} disabled={bookingMultiRoomsData.length != cartBox.length}>  Continue to Guests</Button>
//                                         </Col>
//                                     </Row>


//                                 </div>


//                             </Col>
//                         </Row>
//                     </Container>
//                 </div>
//             )}



//             {/* smart search cart */}

//             {/* {showCart2 && (
//                 <div className="cart-overlay">
//                     <Container>
//                         <Row>
//                             <Col md={4}>
//                                 <div className='total-paid'>
//                                     <div className="d-flex align-items-center gap-2"> <p className='fs-18 mb-0' >Total to be paid  </p><h3 className='font-24 mb-0' style={{ color: '#BF9039' }} >₹15,756</h3></div>
//                                     Total for 4 nights, 2 rooms for 3 guests (Inclusive of taxes, fees and property imposed charges)
//                                 </div>
//                             </Col>
//                             <Col md={8}>
//                                 <div className='d-flex justify-end align-items-center select-twin-rooms h-100'>
//                                     <Row className='justify-end h-100' >
                                        
//                                         <Col md={9} className='d-flex h-100 align-items-center gap-4 justify-end'>
//                                             <div className='d-flex gap-2 relative' style={{ border: ' 1px solid #4635277A', padding: '5px' }} >
//                                                 <span className='remove-room'>
//                                                     <Image onClick={() => setShowCart2(false)} src="./images/icons/minus.svg"
//                                                         className='img-fluid'
//                                                         width={16}
//                                                         height={16}
//                                                         alt='rooms' />
//                                                 </span>
//                                                 <div className='room-info d-flex gap-2 align-items-center relative'>
//                                                     <Image src="./images/icons/proprty.jpg"
//                                                         className='img-fluid'
//                                                         width={48}
//                                                         height={48}
//                                                         alt='rooms' />



//                                                     <div className='room-name'>
//                                                         <p className="mb-0 fw-medium" style={{ fontSize: '12px', lineHeight: '16px', color: '#463527' }}>Room 4</p>
//                                                         <p className="mb-0" style={{ fontSize: '12px', lineHeight: '16px' }}>Casa Melhor Yayati Tulip 17th Floor</p>
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                             <div className='d-flex gap-2 relative' style={{ border: ' 1px solid #4635277A', padding: '5px' }} >
//                                                 <span className='remove-room'>
//                                                     <Image onClick={() => setShowCart2(false)} src="./images/icons/minus.svg"
//                                                         className='img-fluid'
//                                                         width={16}
//                                                         height={16}
//                                                         alt='rooms' />
//                                                 </span>
//                                                 <div className='room-info d-flex gap-2 align-items-center relative'>
//                                                     <Image src="./images/icons/proprty.jpg"
//                                                         className='img-fluid'
//                                                         width={48}
//                                                         height={48}
//                                                         alt='rooms' />



//                                                     <div className='room-name'>
//                                                         <p className="mb-0 fw-medium" style={{ fontSize: '12px', lineHeight: '16px', color: '#463527' }}>Room 4</p>
//                                                         <p className="mb-0" style={{ fontSize: '12px', lineHeight: '16px' }}>Casa Melhor Yayati Tulip 17th Floor</p>
//                                                     </div>
//                                                 </div>

//                                                 <div className='room-info d-flex gap-2 align-items-center relative'>
//                                                     <Image src="./images/icons/proprty.jpg"
//                                                         className='img-fluid'
//                                                         width={48}
//                                                         height={48}
//                                                         alt='rooms' />

                                                    

//                                                     <div className='room-name'>
//                                                         <p className="mb-0 fw-medium" style={{ fontSize: '12px', lineHeight: '16px', color: '#463527' }}>Room 4</p>
//                                                         <p className="mb-0" style={{ fontSize: '12px', lineHeight: '16px' }}>Casa Melhor Yayati Tulip 17th Floor</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </Col>
//                                         <Col md={3} className='d-flex h-100 align-items-center justify-end'>

//                                             <Button onClick={Detailurl3} variant='success' className='submit-btn' style={{ borderRadius: '0', background: '#2C734A', padding: '12px 24px' }} >  Continue to Guests</Button>
//                                         </Col>
//                                     </Row>


//                                 </div>


//                             </Col>
//                         </Row>
//                     </Container>
//                 </div>
//             )} */}
//         </>
//     )
// }

"use client"
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
// import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form, Accordion, Label } from 'react-bootstrap';
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BasicBookingSearch, CartValidationPost, companyListAPI, getCompanyPropertiesCitiesAPI, PropertyListFullApi, SmartBookingSearch } from '@/services/provider';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
import { alert_danger, showErrorMsg } from '@/utils/Alerts/TostifyAlerts';
import { ToastContainer } from 'react-toastify';
import { calculateNights, formatDateMonthYear, formatYMD } from '@/utils/formatTime';
import dynamic from "next/dynamic";
import toast, { Toaster } from 'react-hot-toast';

export default function SearchResult() {


    const PropertyMap = dynamic(
        () => import("../PropertyMap"),
        {
            ssr: false,
        }
    );

    const fullText =
        "The Room 3 is part of the Luxuriously furnished 6 bed apartment with Panoramic Sea View next to the palm beach road. Presenting beautiful and mesmerizing views of sunsets from each room and glittering views of Palm beach road in the night.";

    const shortText =
        "The Room 3 is part of the Luxuriously furnished 6 bed apartment with Panoramic Sea View next to the palm beach road...";

    const [showFull, setShowFull] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));


    const [isSmartSearchEnabled, setIsSmartSearchEnabled] = useState(false);
    const [optionSearch, setOptionSearch] = useState({ gender: 'Female', budget: '' })
    const [SmartSearchResult, setSmartSearchResult] = useState({});
    const [selectedPropertyUID, setSelectedPropertyUID] = useState(null);
    const [selectedPropertyName, setSelectedPropertyName] = useState("");
    const [selectedRoomName, setSelectedRoomName] = useState("");
    const [selectedRoomPeriods, setSelectedRoomPeriods] = useState([]);
    // const [selectedDate, setStartDate] = useState(null);
    const [selectsRange, setSelectsRange] = useState(null);



    const router = useRouter();

    // const Detailurl = () => {
    //     router.push('/ViewDetailsResult');
    // };

    const handleChangeDatesClick = (property, room) => {
        setSelectedRoomPeriods(room?.booking_info?.booked_periods || []);
        setSelectedPropertyName(property?.property_name || "");
        setSelectedRoomName(room?.room_name || "");
        setSelectedPropertyUID(property?.property_uid);

        const bookedRanges = room?.booking_info?.booked_periods?.map(cv => ({
            start: new Date(cv?.check_in_datetime),
            end: new Date(cv?.check_out_datetime)
        })) || [];

        setBookedRangeDates(bookedRanges);


        marknoShowsetShow(true);


    };


    const formatDateForApi = (date) => {
        if (!date) return null;

        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    



    // const Detailurl = async () => {

    //     if (!startDate || !endDate) {
    //         alert("Please select check-in and check-out dates");
    //         return;
    //     }

    //     const payload = {
    //         ...bacisSearchDetails,

    //         check_in_date: formatDateForApi(startDate),
    //         check_out_date: formatDateForApi(endDate),

    //         property_uid: selectedPropertyUID
    //     };

    //     console.log("Final Payload:", payload);

    //     try {

    //         const response = await BasicBookingSearch(payload);

    //         if (response?.data?.success) {


    //             localStorage.setItem(
    //                 "basicSecrchItemObj",
    //                 JSON.stringify(payload)
    //             );

    //             router.push(
    //                 `/ViewDetailsResult?property_uid=${selectedPropertyUID}`
    //             );
    //         }

    //     } catch (err) {

    //         console.log("API error:", err);

    //     }
    // };


    const Detailurl = async () => {

        const payload = {
            ...bacisSearchDetails,
            check_in_date: formatDateForApi(startDate),
            check_out_date: formatDateForApi(endDate),
            property_uid: selectedPropertyUID
        };

        console.log("Payload:", payload);

        try {
            const response = await BasicBookingSearch(payload);

            if (response?.data?.success) {
                setItemLocalStorage("basicSecrchItemObj", JSON.stringify(payload));
                // redirect with property_uid
                router.push(`/ViewDetailsResult?property_uid=${selectedPropertyUID}`);

            }

        } catch (err) {
            console.log("API error:", err);
        }
    };





    const sortoption = [
        { value: "lowest-price", label: "Lowest Price" },
        { value: "highest-price", label: "Highest Price" }
    ]

    const [addTravels, addTravelsetShow] = useState(false);

    const removeTravel = () => addTravelsetShow(false);
    const addTravel = () => addTravelsetShow(true);



    const roomoption = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Any", label: "Any" }
    ]


    // 


    const budgetoption = [
        { value: "0-1000", label: "0 - 1000 " },
        { value: "1000-50001", label: "1000 to 5000 " },
        { value: "5000", label: "5000+" }
    ]



    // 

    const [filtermShow, setFiltersetShow] = useState(false);
    const [seletedRoomData, setSelectedRoomData] = useState(null)

    const filterClose = () => { setFiltersetShow(false); setSelectedRoomData(null) };
    const filterShow = (room, adults) => {
        setFiltersetShow(true);
        const filteredData =
            bookingRoomsData?.[0]?.properties
                ?.map(prop => {
                    const selectedRooms = prop.rooms.filter(
                        selectedRoom => selectedRoom.room_uid === room.room_uid
                    );

                    // Skip property if no matching room
                    if (!selectedRooms.length) return null;

                    return {
                        ...prop,
                        rooms: selectedRooms,
                        adultCount: adults,
                    };
                })
                .filter(Boolean) || [];

        setSelectedRoomData(filteredData);
    };


    // 


    const [marknoShowsModal, marknoShowsetShow] = useState(false);

    const marknoShowClose = () => marknoShowsetShow(false);
    const marknoShowModal = () => marknoShowsetShow(true);


    // 


    const [filtermShow1, filtersetShow1] = useState(false);

    const filterClose1 = () => filtersetShow1(false);
    const filterShow1 = () => filtersetShow1(true);


    const [filtermShow2, filtersetShow2] = useState(false);

    const filterClose2 = () => filtersetShow2(false);
    const filterShow2 = () => filtersetShow2(true);



    const [filtermShow3, filtersetShow3] = useState(false);

    const filterClose3 = () => filtersetShow3(false);
    const filterShow3 = () => filtersetShow3(true);


    // 


    const [showPrices, setShowPrices] = useState(false);
    const [roomType, setRoomType] = useState("Private")

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#4635271F"
                : state.isFocused
                    ? "#4635271F" // Color on hover
                    : "inherit",
            color: state.isSelected ? "#000" : "black",
            cursor: "pointer", // Optional: improves UX on hover
        }),
    };

    const [searchFieldData, setSearchFieldData] = useState(
        {
            company_id: 0,
            city: "",
            check_in_date: "",
            check_out_date: "",
            rooms: [],
            c_uid: "",
            // room_type_preference: "Any",
            // budget_range: {
            //     min: 0,
            //     max: 0
            // },
            availability: Boolean,
            company_name: "",
            // sort_by: "availability",
            // gender_filter: "Male"
        }
    )

    const [companyList, setCompanyList] = useState([]);
    const [cityList, setCityList] = useState([]);
    // const getProprtyList = async () => {
    //     try {
    //         const response = await PropertyListFullApi("all");
    //         if (response?.data?.success) {
    //             //                 const uniqueCities = [
    //             //   ...new Set(response.data.response.map(ele => ele.city))
    //             // ].map(city => ({ city }));
    //             const uniqueCities = [
    //                 { city: "Jaipur" },
    //                 ...Array.from(
    //                     new Set(response.data.response.map(ele => ele.city)),
    //                     city => ({ city })
    //                 ).filter(item => item.city !== "Jaipur")
    //             ];
    //             setCityList(uniqueCities)
    //         }

    //     } catch (error) {
    //         console.log("Company API Error: ", error);
    //     }
    // };
    // const getProprtyList = async () => {
    //     try {
    //         const response = await PropertyListFullApi("all");
    //         if (response?.data?.success) {
    //             //                 const uniqueCities = [
    //             //   ...new Set(response.data.response.map(ele => ele.city))
    //             // ].map(city => ({ city }));
    //             // const uniqueCities = [
    //             //     { city: "Jaipur" },
    //             //     ...Array.from(
    //             //         new Set(response.data.response.map(ele => ele.city)),
    //             //         city => ({ city })
    //             //     ).filter(item => item.city !== "Jaipur")
    //             // ];
    //             // setCityList(uniqueCities)
    //             setAllListCity(response.data.response)
    //         }

    //     } catch (error) {
    //         console.log("Company API Error: ", error);
    //     }
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
                const list = response.data.response?.filter(item => !item?.is_company_inactive)?.map(item => ({
                    value: item.id,
                    label: item.company_name,
                    uid: item.uid
                }));
                setCompanyList(list);
            }
        } catch (error) {
            console.log("Company API Error: ", error);
        }
    };

    useEffect(() => {
        getCompanyList();
        // getProprtyList();
        if (bacisSearchDetails) {
            setSearchFieldData({
                company_id: bacisSearchDetails.company_id,
                city: bacisSearchDetails.city,
                check_in_date: bacisSearchDetails.check_in_date,
                check_out_date: bacisSearchDetails.check_out_date,
                rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults })),
                availability: bacisSearchDetails?.availability,
                company_name: bacisSearchDetails.company_name,
                c_uid: bacisSearchDetails.c_uid
            })
            setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: rooms.length, adults: val.adults })))
        }
    }, []);

    useEffect(() => {
        if (companyList.length === 1) {
            setSearchFieldData({ ...searchFieldData, company_id: companyList?.[0].value,company_name:companyList?.[0]?.label,c_uid:companyList?.[0]?.uid })
        }
    }, [companyList]);

    useEffect(() => {
        if (searchFieldData.c_uid) {
            getLocationOfProperty(searchFieldData.c_uid)
        }
    }, [searchFieldData.c_uid])

    // useEffect(() => {
    //     if (searchFieldData.company_name) {
    //         const filteredProperties = AllListCity.filter(property =>
    //             property.assigned_companies?.some(
    //                 company => company.company_name === searchFieldData.company_name
    //             )
    //         );
    //         const uniqueCities = [
    //             ...Array.from(
    //                 new Set(filteredProperties.map(ele => ele.city)),
    //                 city => ({ city })
    //             ).filter(item => item.city !== "Jaipur")
    //         ];
    //         setCityList(uniqueCities)
    //     }

    // }, [searchFieldData.company_name, AllListCity])


    const [rooms, setRooms] = useState([
        { id: 1, adults: 1 }
    ]);
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

    const handleAdultChange = (roomId, change) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId) {
                const newValue = room.adults + change;
                return { ...room, adults: newValue >= 1 ? newValue : 1 };
            }
            return room;
        }));
    };

    const addRoom = () => {
        const newRoomId = rooms.length + 1;
        setRooms([...rooms, { id: newRoomId, adults: 1 }]);
    };

    const deleteRoom = (roomId) => {
        if (rooms.length > 1) {
            setRooms(rooms.filter(room => room.id !== roomId));
        }
    };


    // 


    // const [selectedDate, setStartDate] = useState(
    //     new Date("2025/10/1")
    // );
    // const [endDate, setEndDate] = useState(
    //     new Date("2025/10/1")

    // );

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [bookedRangeDates, setBookedRangeDates] = useState([]);
    const isDateAvailable = (date) => {
        return !bookedRangeDates.some(
            (range) =>
                date >= range.start && date <= range.end
        );
    };


    const amenities = [
        { icon: "/images/icons/work.svg", label: "Business services" },
        { icon: "/images/icons/concierge.svg", label: "Concierge" },
        { icon: "/images/icons/qr_code.svg", label: "Digital check-in" },
        { icon: "/images/icons/fitness_center.svg", label: "Fitness center" },
        { icon: "/images/icons/wifi.svg", label: "Free internet access" },
        { icon: "/images/icons/local_parking.svg", label: "Free parking" },
        { icon: "/images/icons/laundry.svg", label: "Laundry" },
        { icon: "/images/icons/interpreter_mode.svg", label: "Meeting facilities" },
        { icon: "/images/icons/pool.svg", label: "Pool" },
        { icon: "/images/icons/in_home_mode.svg", label: "Resort property" },
        { icon: "/images/icons/room_service.svg", label: "Room service" },

        { icon: "./images/icons/amenities-icon/Air-Conditioning.svg", label: "Air conditioning" },
        { icon: "./images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
        { icon: "./images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
        { icon: "./images/icons/amenities-icon/Serves-Breakfast.svg", label: "Serves Breakfast" },
        { icon: "./images/icons/amenities-icon/Serves-Lunch.svg", label: "Serves Lunch" },
        { icon: "./images/icons/amenities-icon/Serves-Dinner.svg", label: "Serves Dinner" },
        { icon: "./images/icons/amenities-icon/BuzzerWireless.svg", label: "Buzzer/Wireless" },
        { icon: "./images/icons/amenities-icon/intercom.svg", label: "Intercom" },
        { icon: "./images/icons/amenities-icon/elevator-building.svg", label: "Elevator in Building" },
        { icon: "./images/icons/amenities-icon/parking.svg", label: "Parking  " },
        { icon: "./images/icons/amenities-icon/laundry.svg", label: "Laundry" },
        { icon: "./images/icons/amenities-icon/Access-to-kitchen.svg", label: "Access to Kitchen" },
        // { icon: "./images/icons/amenities-icon/Swimming-pool.svg", label: "Swimming Pool" },
        { icon: "./images/icons/amenities-icon/Air-Conditioning.svg", label: "Gym" },
        // { icon: "./images/icons/amenities-icon/gym.svg", label: "Air Conditioning" },
    ];

    // Show only first 6 amenities initially
    const visibleAmenities = showAll ? amenities?.filter(item => seletedRoomData?.[0]?.rooms?.[0]?.room_amenities?.includes(item.label)) : amenities?.filter(item => seletedRoomData?.[0]?.rooms?.[0]?.room_amenities?.includes(item.label))?.slice(0, 4);
    const [bookingRoomsData, setBookingRoomsData] = useState([])
    const [responseSearchData, setResponseSearchData] = useState(null)
    const [roomsCountForOption, setRoomCountForOption] = useState(0)
    const [bookingMultiRoomsData, setBookingMultiRoomsData] = useState([]);
    const [bookingRoomsDataUnfilterd, setBookingRoomsDataUnfilterd] = useState([])
    const [mapDataArr, setMapDataArr] = useState([])

    const fetchSearchResult = async (payload) => {
        try {
            const response = await BasicBookingSearch(payload);
            if (response?.data?.success) {
                setResponseSearchData(response?.data?.response?.search_params)
                setBookingMultiRoomsData(response?.data?.response?.bedrooms)
                const totalRooms = response?.data?.response?.bedrooms.reduce(
                    (sum, item) =>
                        sum +
                        item.properties.reduce(
                            (pSum, p) => pSum + (p.rooms?.length || 0),
                            0
                        ),
                    0
                );
                setRoomCountForOption(totalRooms)
                setBookingRoomsDataUnfilterd(response?.data?.response?.bedrooms)
                setBookingRoomsData(response?.data?.response?.bedrooms.map(bed => ({
                    ...bed,
                    properties: bed.properties
                        .map(property => ({
                            ...property,
                            rooms: property.rooms.sort((a,b)=>a.room_id-b.room_id).filter(room => room.room_type === roomType)
                        }))
                        .filter(property => property.rooms.length > 0)
                }))
                    .filter(bed => bed.properties.length > 0))
                setMapDataArr(response?.data?.response?.bedrooms.flatMap(item =>
                    item.properties.map(prop => ({
                        lat: prop?.latitude,
                        lng: prop?.longitude,
                        address: prop?.address
                    }))
                ))
                removeItemLocalStorage("searchForm")
                localStorage.setItem("basicSecrchItemObj", JSON.stringify(payload))
                removeTravel()
            } else {
                setItemLocalStorage("bacisSearchApiError", JSON.stringify(response.data.response))
                router.push('/CreateBooking');
            }

        } catch (error) {
            console.log("Company API Error: ", error);
            router.push('/CreateBooking');
        }
    }

    useEffect(() => {
        setBookingRoomsData(bookingRoomsDataUnfilterd
            .map(bed => ({
                ...bed,
                properties: bed.properties
                    .map(property => ({
                        ...property,
                        rooms: property.rooms.filter(room => room.room_type === roomType)
                    }))
                    .filter(property => property.rooms.length > 0)
            }))
            .filter(bed => bed.properties.length > 0))
    }, [roomType])

    useEffect(() => {
        if (!!bacisSearchDetails) {
            fetchSearchResult(bacisSearchDetails)
        }
    }, [])

    const formatStayDates = (fromDate, toDate) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);

        const options = { weekday: "short", day: "numeric", month: "short" };

        const startFormatted = start.toLocaleDateString("en-US", options);
        const endFormatted = end.toLocaleDateString("en-US", options);
        const year = end.getFullYear();

        const diffTime = end - start;
        const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));

        return `${startFormatted} - ${endFormatted}, ${year}, ${nights} night${nights > 1 ? "s" : ""}`;
    };

    const formatRoomsAndGuests = (rooms = []) => {
        const roomCount = rooms.length;
        const guestCount = rooms.reduce(
            (sum, room) => sum + (room.adults || 0),
            0
        );

        return `${roomCount} room${roomCount > 1 ? "s" : ""} for ${guestCount} guest${guestCount > 1 ? "s" : ""}`;
    };

    const handleUpdateSearch = () => {
        if (isSmartSearchEnabled) {
            getSmartSearchData()
        } else {
            fetchSearchResult(searchFieldData)
        }
    }

    const getSmartSearchData = async () => {
        try {
            const payload = {
                company_id: searchFieldData.company_id,
                city: searchFieldData.city,
                check_in_date: searchFieldData.check_in_date,
                check_out_date: searchFieldData.check_out_date,
                guest_count: rooms.reduce((sum, room) => sum + room.adults, 0),
                gender_filter: optionSearch.gender
            }
            const response = await SmartBookingSearch(payload)
            if (response?.data?.success) {
                setSmartSearchResult(response.data.response)
                removeTravel();
            } else {
                const errorMsg = showErrorMsg(response.data.response)
                toast.error(errorMsg)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isSmartSearchEnabled) {
            getSmartSearchData()
        }
    }, [isSmartSearchEnabled, optionSearch])

    //<--------------------------------------------------------cart-funcationality------------------------------------>
    const [bedRoomIdx, setBedRoomIdx] = useState([])
    const [cartBox, setCartBox] = useState([])
    const handleCartAdd = (bedroom, property, room) => {
        if (!bedRoomIdx.includes(bedroom.bedroom_index)) {
            room.bedroom_index = bedroom.bedroom_index;
            room.property_name = property.property_name;
            room.property_photo = property.cover_photo;
            room.property_uid = property.property_uid;
            room.check_in_date = searchFieldData.check_in_date;
            room.check_out_date = searchFieldData.check_out_date;
            room.property_address = property.address;
            room.city = property.city;
            room.state = property.state;
            room.pin_code = property?.pin_code;
            room.adults = bedroom.adults;
            setCartBox(prevCart => {
                const isExist = prevCart.some(
                    item => item.room_uid === room.room_uid
                );

                if (isExist) {
                    return prevCart; // already exists → do nothing
                }

                return [...prevCart, room]; // add new item
            });
            setBedRoomIdx([...bedRoomIdx, bedroom.bedroom_index])
        } else {
        }
    }
    const handleCartData = (Val) => {
        setBedRoomIdx(bedRoomIdx.filter((cv) => cv != Val.bedroom_index))
        setCartBox(cartBox.filter((item) => item.room_uid != Val.room_uid))
    }

    // const totalPrice = cartBox.reduce((sum, room) => sum + room.price_per_night, 0);
    const totalPrice = cartBox.reduce((sum, room) => {
        if (room.room_type === "Private") {
            return sum + room.price_per_night;
        } else if (room.room_type === "Twin-Sharing") {
            const bedCount = room.beds?.length || room.beds || 1;
            return sum + ((room.price_per_night / bedCount) * room.adults);
        }
        return sum;
    }, 0);



    const handleGuests = async () => {
        try {
            const payload = {
                cart_items: cartBox.map((val) => ({
                    property_uid: val.property_uid,
                    room_uid: val.room_uid,
                    // bed_index: null,
                    check_in_date: searchFieldData.check_in_date,
                    check_out_date: searchFieldData.check_out_date
                }))
            }
            console.log(payload)
            const response = await CartValidationPost(JSON.stringify(payload));
            if (response?.data?.success) {
                router.push('/MultiRoomsReserve');
                setItemLocalStorage('multiroomreserve', JSON.stringify(cartBox))
            }
        } catch (error) {
            console.log(error);
        }
    };

    const availableBeds = (totalBeds, avlBeds) => {
        return totalBeds - avlBeds;
    }

    const roomDescription = seletedRoomData?.[0]?.rooms?.[0]?.room_description;
    const truncatedDescription =
        roomDescription?.split(" ")?.slice(0, 100)?.join(" ") + "..."; // Truncate after 100 words

    useEffect(() => {
        if (searchFieldData.rooms.length > 1) {
            setIsSmartSearchEnabled(false)
        }
    }, [searchFieldData.rooms])

    return (
        <>
            <ToastContainer />
            <Header />
            <Toaster position="top-right" />

            <div className='searching-result-top'>
                <Container>
                    <div className='search-result-header'>
                        <h4>{responseSearchData?.company_name}  |  {responseSearchData?.city}</h4>

                        <p className='mb-0'><Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} /> {formatStayDates(responseSearchData?.check_in_date, responseSearchData?.check_out_date)}    | <Image src='./images/icons/group.svg' alt='calendor' className="img-fluid" width={24} height={24} /> {formatRoomsAndGuests(bacisSearchDetails?.rooms)}</p>

                        <Button variant='' onClick={addTravel} className='edit-details'>Edit Stay Details</Button>
                    </div>
                </Container>
            </div>



            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list2'>
                                {/* <li><a href=''>Home</a></li> */}
                                <li className='ms-0' >
                                    <Select
                                        name="aria-role-select"
                                        options={roomoption}
                                        placeholder="Room preference"
                                        className=""
                                        onChange={(val) => { setOptionSearch({ ...optionSearch, gender: val.value }) }}
                                        isSearchable={false}
                                        styles={customStyles}
                                    />

                                </li>
                                <li>
                                    <Select
                                        name="aria-role-select"
                                        options={budgetoption}
                                        placeholder="Budget"
                                        className=""
                                        onChange={(val) => { setOptionSearch({ ...optionSearch, budget: val.value }) }}
                                        isSearchable={false}
                                        styles={customStyles}
                                    />
                                </li>
                                <li>More filters <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='bott' width={14} height={14} /></li>
                                <li>
                                    <div className='custom-switch'>
                                        <Form.Check // prettier-ignore
                                            type="switch"
                                            id="custom-switch1"
                                            label="Show only available rooms"
                                            checked={responseSearchData?.availability_filter}
                                            onChange={(e) => {
                                                setSearchFieldData({ ...searchFieldData, availability: e.target.checked });
                                                let newObj = { ...searchFieldData, availability: e.target.checked }
                                                fetchSearchResult(newObj);
                                            }}
                                        />
                                    </div>
                                </li>
                                {bookingMultiRoomsData.length == 1 && (
                                    <li>
                                        <div className='custom-switch'>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch2"
                                                label="Smart search"
                                                checked={isSmartSearchEnabled}
                                                onChange={(e) => setIsSmartSearchEnabled(e.target.checked)}
                                            />
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='search-result-data'>
                <Container>
                    <Row className='justify-content-between'>

                        <Col md={7} className='pe-5 multilist-scroll' >
                            <h4 className='page-subheading mb-0' > {responseSearchData?.city} ({roomsCountForOption} options)</h4>
                            {bookingMultiRoomsData.length > 1 && (
                                <Tabs
                                    defaultActiveKey="bed-Rooms1"
                                    id="uncontrolled-tab-example2"
                                    className=" search-result-list-tab"
                                >
                                    {bookingMultiRoomsData.map((bedroomData, bedroomIndex) => (
                                        <Tab
                                            key={`bedroom-${bedroomIndex}`}
                                            eventKey={`bed-Rooms${bedroomIndex + 1}`}
                                            title={
                                                <div className="d-flex align-items-start flex-col">

                                                    <h4 className="fw-normal font-24">Bedroom {bedroomIndex + 1}</h4>
                                                    <small className="fw-medium">{bedroomData.adults} Adult{bedroomData.adults > 1 ? 's' : ''} </small>
                                                    <small>
                                                        {cartBox?.some(item => item.bedroom_index === bedroomData?.bedroom_index)
                                                            ? cartBox?.find(item => item.bedroom_index === bedroomData?.bedroom_index)?.room_name
                                                            : 'Select Room Type'
                                                        }
                                                    </small>
                                                </div>
                                            }
                                            tabClassName="custom-tab"
                                        >
                                            <Tabs
                                                defaultActiveKey="private-Rooms"
                                                id={`uncontrolled-tab-example-${bedroomIndex}`}
                                                className=" compnay-detail-tabs tab-50-50"
                                            >
                                                {/* Private Rooms Tab */}
                                                <Tab eventKey="private-Rooms" title="Private Rooms">
                                                    {!isSmartSearchEnabled ? (
                                                        <>
                                                            <div className="property-results">
                                                                <div className="property-card mb-4">
                                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-2 pt-2'>
                                                                        <label className='mb-0 d-flex gap-2 align-items-center' >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="mx-2 custom-checkbox"
                                                                                checked={showPrices}
                                                                                onChange={(e) => setShowPrices(e.target.checked)}
                                                                            />
                                                                            Show room prices
                                                                        </label>
                                                                        <div className='filter-right-option d-flex gap-3'>
                                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                                    <Select
                                                                                        name="aria-role-select"
                                                                                        options={sortoption}
                                                                                        placeholder="Name"
                                                                                        className="react_selectbox"
                                                                                        isSearchable={false}
                                                                                        styles={customStyles}
                                                                                    />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {bedroomData.properties.length > 0 ? (
                                                                        bedroomData.properties.map((property, propIndex) => (
                                                                            <>
                                                                              <p className='text-right p-title position-relative'>
                                                                                    <span>Property {propIndex + 1}</span>
                                                                                </p>
                                                                            <div key={property.property_id} className="room-card mt-2">
                                                                              

                                                                                <Link href={`/propertyDetails?uid=${property?.property_uid}`} target="_blank" className='text-black text-decoration-none' >
                                                                                    <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
                                                                                        <Image
                                                                                            src={property?.cover_photo ? `${property.cover_photo}` : `/images/icons/No-Image.svg`}
                                                                                            alt={property.property_name}
                                                                                            width={56}
                                                                                            height={56}
                                                                                            className="img-fluid"
                                                                                            style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                                                                        />
                                                                                        <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
                                                                                            {property.property_name}
                                                                                        </p>
                                                                                    </div>
                                                                                </Link>

                                                                                {/* Filter rooms by room_type (Private) */}
                                                                                {property.rooms
                                                                                    .filter(room => room.room_type === "Private" || room.room_type === "Private")
                                                                                    .map((room, roomIndex) => (
                                                                                        <div key={room.room_id} className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
                                                                                            <Row className="align-items-center">
                                                                                                <Col md={9}>
                                                                                                    <div className='d-flex gap-3 room-booking-card'>
                                                                                                        <div className="room-image position-relative">
                                                                                                            <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", property?.property_uid) }} >
                                                                                                                <Image
                                                                                                                    src={room?.cover_photo ? `${room.cover_photo}` : `/images/icons/No-Image.svg`}
                                                                                                                    alt={room.room_name}
                                                                                                                    width={104}
                                                                                                                    height={192}
                                                                                                                    className="img-fluid"
                                                                                                                />
                                                                                                            </Link>
                                                                                                            <span className="image-count">
                                                                                                                <Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />
                                                                                                                {room?.room_photos?.length}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        <div className="room-details">
                                                                                                            <div className='r-detail-1'>
                                                                                                                <h4 className='room-title'>
                                                                                                                    {room.room_name}
                                                                                                                    <span className='room-type-badge'>Private Room</span>
                                                                                                                </h4>
                                                                                                                <div className="room-specs mb-2">
                                                                                                                    <span className="spec-item">
                                                                                                                        <Image src="./images/icons/person.svg" width={16} height={16} alt="bed" />
                                                                                                                        Sleeps {room.max_guests}
                                                                                                                    </span>
                                                                                                                    <span className="spec-item">
                                                                                                                        <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" />
                                                                                                                        {room.beds.length} bed
                                                                                                                    </span>
                                                                                                                    <span className="spec-item">{room.room_size_sqft} sq ft</span>
                                                                                                                </div>
                                                                                                                <div className="amenities mb-2">
                                                                                                                    {room.room_amenities.map((amenity, amenityIndex) => (
                                                                                                                        <span key={amenityIndex} className="amenity-item">{amenity}</span>
                                                                                                                    ))}
                                                                                                                </div>
                                                                                                                <Link href="#" onClick={() => filterShow(room)} className="room-details-link">
                                                                                                                    Room Details
                                                                                                                </Link>
                                                                                                            </div>
                                                                                                            {room.bedroom_preference === "Female" && (
                                                                                                                <p className='female-preferred'>FEMALE PREFERRED</p>
                                                                                                            )}
                                                                                                            {room.bedroom_preference === "Male" && (
                                                                                                                <span className='male-preferred'>MALE PREFERRED</span>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </Col>
                                                                                                {room.is_available ? (
                                                                                                    <Col md={3}>
                                                                                                        <div className="booking-section text-end">
                                                                                                            {showPrices && (
                                                                                                                <p className='room-price'>
                                                                                                                    From <br />
                                                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>
                                                                                                                        ₹{room.price_per_night}
                                                                                                                    </span><br />
                                                                                                                    / night
                                                                                                                </p>
                                                                                                            )}
                                                                                                            {cartBox.some(item => item.room_uid === room.room_uid) ? (
                                                                                                                <Link href='#' onClick={() => handleCartData(room)} className={`${cartBox?.some(item => item.bedroom_index === bedroomData?.bedroom_index && item.room_uid == room.room_uid) ? "" : 'pointer-events-none opacity-50'} reserve-btn-add`}>
                                                                                                                    {/* <Image src="./images/icons/Minus.svg" className="img-fluid" alt="add" width={16} height={16} /> */}
                                                                                                                    Remove
                                                                                                                </Link>
                                                                                                            ) : (
                                                                                                                <Link onClick={() => handleCartAdd(bedroomData, property, room)} href='#' className={`${bedRoomIdx.includes(bedroomData.bedroom_index) ? 'pointer-events-none opacity-50' : ''} reserve-btn-add`}>
                                                                                                                    <Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
                                                                                                                    Add
                                                                                                                </Link>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                ) : (
                                                                                                    <Col md={3} className='h-100'>
                                                                                                        <div className="booking-section text-end">
                                                                                                            <p className='mb-0'>Adjust your dates for availability.</p>
                                                                                                            <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
                                                                                                                Change Dates
                                                                                                            </Button>
                                                                                                            <p className='mb-0'>or</p>
                                                                                                            <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
                                                                                                                Book Hotel
                                                                                                                <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                                                                                            </Button>
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                )}
                                                                                            </Row>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                            </>
                                                                        ))
                                                                    ) : (
                                                                        <div className="text-center py-5">
                                                                            <p className='fs-20 mb-1'>No properties available for this bedroom.</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        // Your existing Smart Search enabled code here
                                                        <>{/* Smart Search UI */}</>
                                                    )}
                                                </Tab>

                                                {/* Shared Rooms Tab */}
                                                <Tab eventKey="twin-sharing-rooms" title="Shared Rooms">
                                                    <div className="property-results">
                                                        <div className="property-card mb-4">
                                                            <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-2 pt-2'>
                                                                <label className='mb-0 d-flex gap-2 align-items-center' >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="mx-2 custom-checkbox"
                                                                        checked={showPrices}
                                                                        onChange={(e) => setShowPrices(e.target.checked)}
                                                                    />
                                                                    Show room prices
                                                                </label>
                                                                <div className='filter-right-option d-flex gap-3'>
                                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                                        <Button variant="" className='btn-sort'> Sort by :
                                                                            <Select
                                                                                name="aria-role-select"
                                                                                options={sortoption}
                                                                                placeholder="Name"
                                                                                className="react_selectbox"
                                                                                isSearchable={false}
                                                                                styles={customStyles}
                                                                            />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {bedroomData.properties.length > 0 ? (
                                                                bedroomData.properties.map((property, propIndex) => (
                                                                    <>
                                                                     <p className='text-right p-title position-relative'>
                                                                            <span>Property {propIndex + 1}</span>
                                                                        </p>
                                                                    <div key={property.property_id}>
                                                                       

                                                                        <div className="room-card mt-2">
                                                                            <Link href={`/propertyDetails?uid=${property?.property_uid}`} target="_blank" className='text-black text-decoration-none' >
                                                                                <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
                                                                                    <Image
                                                                                        src={property?.cover_photo ? `${property.cover_photo}` : `/images/icons/No-Image.svg`}
                                                                                        alt={property.property_name}
                                                                                        width={56}
                                                                                        height={56}
                                                                                        className="img-fluid"
                                                                                        style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                                                                    />
                                                                                    <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
                                                                                        {property.property_name}
                                                                                    </p>
                                                                                </div>
                                                                            </Link>

                                                                            {/* Filter rooms by room_type (Twin-Sharing/Shared) */}
                                                                            {property.rooms
                                                                                .filter(room => room.room_type === "Twin-Sharing" || room.room_type === "Shared")
                                                                                .map((room, roomIndex) => (
                                                                                    <div key={room.room_id} className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
                                                                                        <Row className="align-items-center">
                                                                                            <Col md={9}>
                                                                                                <div className='d-flex gap-3 room-booking-card'>
                                                                                                    <div className="room-image position-relative">
                                                                                                        <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", property?.property_uid) }}>
                                                                                                            <Image
                                                                                                                src={room?.cover_photo ? `${room.cover_photo}` : `/images/icons/No-Image.svg`}
                                                                                                                alt={room.room_name}
                                                                                                                width={104}
                                                                                                                height={192}
                                                                                                                className="img-fluid"
                                                                                                            />
                                                                                                        </Link>
                                                                                                        <span className="image-count">
                                                                                                            <Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />
                                                                                                            {room?.room_photos?.length}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <div className="room-details">
                                                                                                        <div className='r-detail-1'>
                                                                                                            <h4 className='room-title'>
                                                                                                                {room.room_name}
                                                                                                                <span className='room-type-badge'>Shared Room</span>
                                                                                                            </h4>
                                                                                                            <div className="room-specs mb-2">
                                                                                                                <span className="spec-item">
                                                                                                                    <Image src="./images/icons/person.svg" width={16} height={16} alt="bed" />
                                                                                                                    Sleeps {room.max_guests}
                                                                                                                </span>
                                                                                                                <span className="spec-item">
                                                                                                                    <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" />
                                                                                                                    {room.beds.length} bed
                                                                                                                </span>
                                                                                                                <span className="spec-item">{room.room_size_sqft} sq ft</span>
                                                                                                            </div>
                                                                                                            <div className="amenities mb-2">
                                                                                                                {room.room_amenities.map((amenity, amenityIndex) => (
                                                                                                                    <span key={amenityIndex} className="amenity-item">{amenity}</span>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                            <Link href="#" onClick={() => filterShow(room)} className="room-details-link">
                                                                                                                Room Details
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                        <div className="room-specs mb-2">
                                                                                                            {room.bedroom_preference === "Female" && (
                                                                                                                <span className='female-preferred'>FEMALE PREFERRED</span>
                                                                                                            )}
                                                                                                            {room.bedroom_preference === "Male" && (
                                                                                                                <span className='male-preferred'>MALE PREFERRED</span>
                                                                                                            )}
                                                                                                            {room.available_beds && room.available_beds.length === 1 && (
                                                                                                                <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>
                                                                                                                    Only 1 bed left!
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Col>
                                                                                            {room.is_available ? (
                                                                                                <Col md={3}>
                                                                                                    <div className="booking-section text-end">
                                                                                                        {showPrices && (
                                                                                                            <p className='room-price'>
                                                                                                                From <br />
                                                                                                                <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>
                                                                                                                    ₹{room.price_per_night}
                                                                                                                </span><br />
                                                                                                                / night
                                                                                                            </p>
                                                                                                        )}
                                                                                                        {/* <Link href='./ReserveBooking' className="reserve-btn">
                                                                                                            Reserve
                                                                                                        </Link> */}
                                                                                                        {cartBox.some(item => item.room_uid === room.room_uid) ? (
                                                                                                            <Link href='#' onClick={() => handleCartData(room)} className={`${cartBox?.some(item => item.bedroom_index === bedroomData?.bedroom_index && item.room_uid == room.room_uid) ? "" : 'pointer-events-none opacity-50'} reserve-btn-add`}>
                                                                                                                {/* <Image src="./images/icons/Minus.svg" className="img-fluid" alt="add" width={16} height={16} /> */}
                                                                                                                Remove
                                                                                                            </Link>
                                                                                                        ) : (
                                                                                                            <Link onClick={() => handleCartAdd(bedroomData, property, room)} href='#' className={`${bedRoomIdx.includes(bedroomData.bedroom_index) ? 'pointer-events-none opacity-50' : ''} reserve-btn-add`}>
                                                                                                                <Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
                                                                                                                Add
                                                                                                            </Link>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </Col>
                                                                                            ) : (
                                                                                                <Col md={3} className='h-100'>
                                                                                                    <div className="booking-section text-end">
                                                                                                        <p className='mb-0'>Adjust your dates for availability.</p>
                                                                                                        <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
                                                                                                            Change Dates
                                                                                                        </Button>
                                                                                                        <p className='mb-0'>or</p>
                                                                                                        <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
                                                                                                            Book Hotel
                                                                                                            <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                </Col>
                                                                                            )}
                                                                                        </Row>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    </>
                                                                ))
                                                            ) : (
                                                                <div className="text-center py-5">
                                                                    <p className='fs-20 mb-1'>No shared rooms available for this bedroom.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Tab>

                                            </Tabs>
                                        </Tab>
                                    ))}
                                </Tabs>
                            )}
                            {bookingMultiRoomsData.length == 1 && (
                                <Tabs
                                    defaultActiveKey="private-Rooms"
                                    id="uncontrolled-tab-example"
                                    className=" compnay-detail-tabs tab-50-50"
                                    onSelect={(k) => {
                                        if (k === "private-Rooms") {
                                            setRoomType("Private");
                                        }
                                        if (k === "twin-sharing-rooms") {
                                            setRoomType("Twin-Sharing");
                                        }
                                    }}
                                >
                                    <Tab eventKey="private-Rooms" title="Private Rooms">
                                        {!isSmartSearchEnabled && (
                                            <>
                                                <div className="property-results">
                                                    <div className="property-card mb-4">
                                                        <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-2 pt-2'>
                                                            <label className='mb-0 d-flex gap-2 align-items-center' >
                                                                <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
                                                                Show room prices
                                                            </label>

                                                            <div className='filter-right-option d-flex gap-3'>
                                                                <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


                                                                    <Button variant="" className='btn-sort'> Sort by :
                                                                        <Select
                                                                            name="aria-role-select"
                                                                            options={sortoption}
                                                                            placeholder="Name"
                                                                            className="react_selectbox"
                                                                            isSearchable={false}
                                                                            styles={customStyles}
                                                                        />

                                                                    </Button>

                                                                </div>

                                                            </div>

                                                        </div>
                                                        {bookingRoomsData?.length > 0 ? bookingRoomsData?.map((item, i) => (<div key={i}>
                                                            <p className='text-right p-title position-relative' >
                                                                <span>Property {i + 1} </span>
                                                            </p>
                                                            {item?.properties.map((prop, ind) => (<div key={ind} className="room-card mt-2">
                                                                <Link href={`/propertyDetails?uid=${prop?.property_uid}`} target="_blank" className='text-black text-decoration-none' >
                                                                    <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

                                                                        <Image
                                                                            src={prop?.cover_photo ? `${prop?.cover_photo}` : `/images/icons/No-Image.svg`}
                                                                            alt="Room"
                                                                            width={56}
                                                                            height={56}
                                                                            className="img-fluid"
                                                                            style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                                                        />
                                                                        <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >{prop?.property_name}</p>
                                                                    </div>
                                                                </Link>
                                                                {prop.rooms.length > 0 && prop.rooms.map((room, index) => (<div key={index} className={room.is_available ? "border-bottom-custom1 mb-3 pb-3" : "border-bottom-custom1 disabled-room mb-3  pb-3"} style={{ borderColor: '#463527' }} >
                                                                    {/* <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} > */}
                                                                    <Row className="align-items-center">

                                                                        <Col md={9}>
                                                                            <div className='d-flex gap-3 room-booking-card'>
                                                                                <div className="room-image position-relative">

                                                                                    <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", prop?.property_uid) }}>
                                                                                        <Image
                                                                                            src={room?.cover_photo ? `${room?.cover_photo}` : `/images/icons/No-Image.svg`}
                                                                                            alt="Room"
                                                                                            width={104}
                                                                                            height={192}
                                                                                            className="img-fluid"
                                                                                        />
                                                                                        {!room.is_available && <p>Booked on your dates</p>}
                                                                                    </Link>

                                                                                    <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> {room?.room_photos?.length}</span>
                                                                                </div>
                                                                                <div className="room-details">
                                                                                    <div className='r-detail-1'>
                                                                                        <h4 className='room-title'> {room?.room_name}   {room?.room_type === roomType && <span className='room-type-badge' >Private Room</span>} </h4>
                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps {room?.max_guests}</span>
                                                                                            <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> {room.beds.length} bed</span>
                                                                                            <span className="spec-item">{room?.room_size_sqft} sq ft</span>
                                                                                        </div>
                                                                                        <div className="amenities mb-2">
                                                                                            {room?.room_amenities.map((amenity, inde) => (<span key={inde} className="amenity-item">{amenity}</span>))}
                                                                                        </div>

                                                                                        <Link href="#" onClick={() => { filterShow(room, item.adults) }} className="room-details-link ">Room Details</Link>

                                                                                    </div>

                                                                                    {room?.bedroom_preference === "Female" && <p className='female-preferred'>
                                                                                        Female PREFERRED
                                                                                    </p>}
                                                                                    {room?.bedroom_preference === "Male" && <span className='male-preferred'>
                                                                                        Male PREFERRED
                                                                                    </span>}
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        {room.is_available ? <Col md={3}>
                                                                            <div className="booking-section  text-end">
                                                                                {showPrices && (
                                                                                    <p className='room-price' >From <br />
                                                                                        <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹{room.price_per_night}</span> <br />
                                                                                        / night
                                                                                    </p>
                                                                                )}
                                                                                <Link href='#' onClick={() => {
                                                                                    setItemLocalStorage("reserveRoom", JSON.stringify(item?.properties.map(prop => {
                                                                                        const selectedRooms = prop.rooms.filter(
                                                                                            selecedRoom => selecedRoom.room_uid === room.room_uid
                                                                                        );

                                                                                        // only return prop if the selected room exists
                                                                                        if (!selectedRooms.length) return null;

                                                                                        return {
                                                                                            ...prop,
                                                                                            rooms: selectedRooms, adultCount: item.adults
                                                                                        };
                                                                                    }).filter(Boolean))); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData))
                                                                                    window.location.href = "/ReserveBooking";
                                                                                }} className="reserve-btn">Reserve</Link>

                                                                            </div>
                                                                        </Col>
                                                                            :
                                                                            <Col md={3} className='h-100' >
                                                                                <div className="booking-section text-end">
                                                                                    <p className='mb-0' >{room?.booking_info?.message}</p>
                                                                                    <Button onClick={() => handleChangeDatesClick(prop, room)}

                                                                                        // onClick={() => {
                                                                                        //     const bookedRanges = room?.booking_info?.booked_periods?.map(cv => ({
                                                                                        //         start: new Date(cv?.check_in_datetime), end: new Date(cv?.check_out_datetime)
                                                                                        //     }));
                                                                                        //     setBookedRangeDates(bookedRanges);
                                                                                        //     marknoShowModal()
                                                                                        // }}
                                                                                        variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
                                                                                    <p className='mb-0' >or</p>
                                                                                    <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
                                                                                        <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                                                                    </Button>


                                                                                </div>
                                                                            </Col>}
                                                                    </Row>
                                                                </div>))}
                                                                <>
                                                                    {/* <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                              <Col md={9}>
                                <div className='d-flex gap-3 room-booking-card'>
                                  <div className="room-image position-relative">
                                    <Link href="./ViewDetailsResult">
                                      <Image
                                        src="/images/icons/room-img1.jpg"
                                        alt="Room"
                                        width={104}
                                        height={192}
                                        className="img-fluid"
                                      />


                                      <p>Booked on your dates</p>
                                    </Link>
                                    <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
                                  </div>
                                  <div className="room-details">
                                    <div className='r-detail-1'>
                                      <h4 className='room-title'> Room 4   <span className='room-type-badge' >Private Room</span> </h4>
                                      <div className="room-specs mb-2">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
                                        <span className="spec-item">538 sq ft</span>
                                      </div>
                                      <div className="amenities mb-2">
                                        <span className="amenity-item">36&quot; flat-screen TV</span>
                                        <span className="amenity-item">Ceiling fans</span>
                                        <span className="amenity-item">Coffee maker</span>
                                        <span className="amenity-item">Robes</span>
                                        <span className="amenity-item">Hair dryer</span>
                                        <span className="amenity-item">Iron and ironing board</span>
                                      </div>

                                      <Link href="#" className="room-details-link ">Room Details</Link>
                                    </div>

                                    
                                  </div>
                                </div>
                              </Col>
                              <Col md={3} className='h-100' >
                                <div className="booking-section text-end">
                                  {showPrices && (
                                    <p className='room-price' >From <br />
                                      <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
                                      / night
                                    </p>
                                  )}
                                  <p className='mb-0' >This room is already booked for your selected dates.</p>
                                  <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
                                  <p className='mb-0' >or</p>
                                  <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
                                    <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                  </Button>

                                </div>
                              </Col>
                            </Row>
                          </div> */}
                                                                </>

                                                            </div>))}
                                                        </div>)) : <p className='fs-20 mb-1'>Selected room type is not available for your dates.</p>}

                                                        <>

                                                            {/* <p className='text-right p-title position-relative' >
                          <span>Property 2 </span>  </p>


                        <div className="room-card mt-2">
                          <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                            <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

                              <Image
                                src="/images/icons/amentiy.jpg"
                                alt="Room"
                                width={56}
                                height={56}
                                className="img-fluid"
                              />

                              <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
                            </div>
                          </Link>


                          <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                              <Col md={9}>
                                <div className='d-flex gap-3 room-booking-card'>
                                  <div className="room-image position-relative">
                                    <Link href="./ViewDetailsResult">
                                      <Image
                                        src="/images/icons/room-img1.jpg"
                                        alt="Room"
                                        width={104}
                                        height={192}
                                        className="img-fluid"
                                      />

                                    </Link>

                                    <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
                                  </div>
                                  <div className="room-details">
                                    <div className='r-detail-1'>
                                      <h4 className='room-title'> Room 1   <span className='room-type-badge' >Private Room</span> </h4>
                                      <div className="room-specs mb-2">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
                                        <span className="spec-item">538 sq ft</span>
                                      </div>
                                      <div className="amenities mb-2">
                                        <span className="amenity-item">36&quot; flat-screen TV</span>
                                        <span className="amenity-item">Ceiling fans</span>
                                        <span className="amenity-item">Coffee maker</span>
                                        <span className="amenity-item">Robes</span>
                                        <span className="amenity-item">Hair dryer</span>
                                        <span className="amenity-item">Iron and ironing board</span>
                                      </div>

                                      <Link href="#" className="room-details-link ">Room Details</Link>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="booking-section text-end">
                                  {showPrices && (
                                    <p className='room-price' >From <br />
                                      <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
                                      / night
                                    </p>
                                  )}
                                  <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

                                </div>
                              </Col>
                            </Row>
                          </div>


                          <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                              <Col md={9}>
                                <div className='d-flex gap-3 room-booking-card'>
                                  <div className="room-image position-relative">
                                    <Link href="./ViewDetailsResult">
                                      <Image
                                        src="/images/icons/room-img1.jpg"
                                        alt="Room"
                                        width={104}
                                        height={192}
                                        className="img-fluid"
                                      />

                                    </Link>

                                    <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
                                  </div>
                                  <div className="room-details">
                                    <div className='r-detail-1'>
                                      <h4 className='room-title'> Room 2   <span className='room-type-badge' >Private Room</span> </h4>
                                      <div className="room-specs mb-2">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
                                        <span className="spec-item">538 sq ft</span>
                                      </div>
                                      <div className="amenities mb-2">
                                        <span className="amenity-item">36&quot; flat-screen TV</span>
                                        <span className="amenity-item">Ceiling fans</span>
                                        <span className="amenity-item">Coffee maker</span>
                                        <span className="amenity-item">Robes</span>
                                        <span className="amenity-item">Hair dryer</span>
                                        <span className="amenity-item">Iron and ironing board</span>
                                      </div>

                                      <Link href="#" className="room-details-link ">Room Details</Link>
                                    </div>
                                    <p className='male-preferred'>
                                      Male PREFERRED
                                    </p>

                                  </div>
                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="booking-section text-end">
                                  {showPrices && (
                                    <p className='room-price' >From <br />
                                      <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
                                      / night
                                    </p>
                                  )}
                                  <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

                                </div>
                              </Col>
                            </Row>
                          </div>


                          <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                              <Col md={9}>
                                <div className='d-flex gap-3 room-booking-card'>
                                  <div className="room-image position-relative">
                                    <Link href="./ViewDetailsResult">
                                      <Image
                                        src="/images/icons/room-img1.jpg"
                                        alt="Room"
                                        width={104}
                                        height={192}
                                        className="img-fluid"
                                      />

                                    </Link>

                                    <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
                                  </div>
                                  <div className="room-details">
                                    <div className='r-detail-1'>
                                      <h4>Room 3</h4>
                                      <div className="room-specs mb-2">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
                                        <span className="spec-item">538 sq ft</span>
                                      </div>
                                      <div className="amenities mb-2">
                                        <span className="amenity-item">36&quot; flat-screen TV</span>
                                        <span className="amenity-item">Ceiling fans</span>
                                        <span className="amenity-item">Coffee maker</span>
                                        <span className="amenity-item">Robes</span>
                                        <span className="amenity-item">Hair dryer</span>
                                        <span className="amenity-item">Iron and ironing board</span>
                                      </div>

                                      <Link href="#" className="room-details-link ">Room Details</Link>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="booking-section text-end">
                                  {showPrices && (
                                    <p className='room-price' >From <br />
                                      <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
                                      / night
                                    </p>
                                  )}
                                  <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                              <Col md={9}>
                                <div className='d-flex gap-3 room-booking-card'>
                                  <div className="room-image position-relative">
                                    <Link href="./ViewDetailsResult">
                                      <Image
                                        src="/images/icons/room-img1.jpg"
                                        alt="Room"
                                        width={104}
                                        height={192}
                                        className="img-fluid"
                                      />

                                    </Link>

                                    <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
                                  </div>
                                  <div className="room-details">
                                    <div className='r-detail-1'>
                                      <h4>Room 4</h4>
                                      <div className="room-specs mb-2">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
                                        <span className="spec-item">538 sq ft</span>
                                      </div>
                                      <div className="amenities mb-2">
                                        <span className="amenity-item">36&quot; flat-screen TV</span>
                                        <span className="amenity-item">Ceiling fans</span>
                                        <span className="amenity-item">Coffee maker</span>
                                        <span className="amenity-item">Robes</span>
                                        <span className="amenity-item">Hair dryer</span>
                                        <span className="amenity-item">Iron and ironing board</span>
                                      </div>

                                      <Link href="#" className="room-details-link ">Room Details</Link>


                                    </div>

                                    <p className='female-preferred'>
                                      Female PREFERRED
                                    </p>
                                  </div>

                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="booking-section text-end">
                                  {showPrices && (
                                    <p className='room-price' >From <br />
                                      <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
                                      / night
                                    </p>
                                  )}
                                  <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

                                </div>
                              </Col>
                            </Row>
                          </div>



                        </div> */}



                                                            {/* <p className='text-right p-title position-relative' >
                                                                <span>Property 3 </span>  </p>


                                                            <div className="room-card mt-2">
                                                                <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                                    <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

                                                                        <Image
                                                                            src="/images/icons/amentiy.jpg"
                                                                            alt="Room"
                                                                            width={56}
                                                                            height={56}
                                                                            className="img-fluid"
                                                                        />

                                                                        <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
                                                                    </div>
                                                                </Link>



                                                                <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
                                                                    <Row className="align-items-center">

                                                                        <Col md={9}>
                                                                            <div className='d-flex gap-3 room-booking-card'>
                                                                                <p className='fs-20' >No rooms available</p>
                                                                            </div>
                                                                        </Col>
                                                                        <Col md={3} className='h-100' >
                                                                            <div className="booking-section text-end">
                                                                                <p className='mb-0' >Adjust your dates for availability.</p>
                                                                                <Button variant="" onClick={marknoShowModal} className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
                                                                                <p className='mb-0' >or</p>
                                                                                <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
                                                                                    <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                                                                </Button>


                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>




                                                            </div> */}
                                                        </>

                                                    </div>
                                                </div>
                                                <p className='mb-3' >Adjust your dates for availability or enable smart search for our suggestions.</p>

                                                <Button variant='' disabled={isSmartSearchEnabled}
                                                    onClick={() => setIsSmartSearchEnabled(true)} className='edit-btn py-2 px-4'>Enable Smart Search</Button>

                                            </>
                                        )}
                                        <>
                                            {isSmartSearchEnabled && (
                                                <>
                                                    <div className="property-results">
                                                        <div className="property-card mb-4">
                                                            <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-2 pt-2'>
                                                                <label className='mb-0 d-flex gap-2 align-items-center' >
                                                                    <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
                                                                    Show room prices
                                                                </label>

                                                                <div className='filter-right-option d-flex gap-3'>
                                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


                                                                        <Button variant="" className='btn-sort'> Sort by :
                                                                            <Select
                                                                                name="aria-role-select"
                                                                                options={sortoption}
                                                                                placeholder="Name"
                                                                                className="react_selectbox"
                                                                                isSearchable={false}
                                                                                styles={customStyles}
                                                                            />

                                                                        </Button>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                            {/* <p className='text-right p-title position-relative' >
                                                            <span>Property 1 </span>
                                                        </p> */}


                                                            {(() => {
                                                                {/* const groupedByProperty = SmartSearchResult?.smart_results?.perfect_match?.length > 0 && SmartSearchResult?.smart_results?.perfect_match?.reduce((acc, match) => {
                                                                    const propertyId = match?.segments[0]?.property_id;
                                                                    const roomType = match?.segments[0]?.room_type;
                                                                    if (!acc[propertyId] && roomType==="Private") {
                                                                        acc[propertyId] = {
                                                                            property_info: {
                                                                                property_id: match?.segments[0]?.property_id,
                                                                                property_uid: match?.segments[0]?.property_uid,
                                                                                property_name: match?.segments[0]?.property_name,
                                                                                property_cover_photo: match?.segments[0]?.property_cover_photo
                                                                            },
                                                                            matches: []
                                                                        };
                                                                    }
                                                                    acc[propertyId].matches.push(match);
                                                                    return acc;
                                                                }, {}); */}
                                                                const groupedByProperty = SmartSearchResult?.smart_results?.perfect_match?.length > 0 &&
                                                                    SmartSearchResult?.smart_results?.perfect_match?.reduce((acc, match) => {
                                                                        const propertyId = match?.segments[0]?.property_id;
                                                                        const roomType = match?.segments[0]?.room_type;

                                                                        if (roomType === "Private") {
                                                                            if (!acc[propertyId]) {
                                                                                acc[propertyId] = {
                                                                                    property_info: {
                                                                                        property_id: match?.segments[0]?.property_id,
                                                                                        property_uid: match?.segments[0]?.property_uid,
                                                                                        property_name: match?.segments[0]?.property_name,
                                                                                        property_cover_photo: match?.segments[0]?.property_cover_photo
                                                                                    },
                                                                                    matches: []
                                                                                };
                                                                            }
                                                                            acc[propertyId].matches.push(match);
                                                                        }

                                                                        return acc;
                                                                    }, {});


                                                                return Object.values(groupedByProperty)?.map((propertyGroup, propIndex) => {
                                                                    const property = propertyGroup.property_info;

                                                                    return (
                                                                        <>
                                                                            <p className='text-right p-title position-relative'>
                                                                                <span>Property {propIndex + 1}</span>
                                                                            </p>

                                                                            <div className="room-card mt-2">

                                                                                <div key={property.property_id} className="property-section">


                                                                                    <Link href={`/propertyDetails?uid=${property?.property_uid}`} target="_blank" className='text-black text-decoration-none' >
                                                                                        <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
                                                                                            <Image
                                                                                                src={`${property.property_cover_photo}` || `/images/icons/No-Image.svg`}
                                                                                                alt={property.property_name}
                                                                                                width={56}
                                                                                                height={56}
                                                                                                className="img-fluid"
                                                                                                style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                                                                            />
                                                                                            <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
                                                                                                {property.property_name}
                                                                                            </p>
                                                                                        </div>
                                                                                    </Link>

                                                                                    {propertyGroup.matches.map((match) => {
                                                                                        const room = match.segments[0];
                                                                                        const room_photos_length = room.rooms_photo ? room.rooms_photo.length : 0;
                                                                                        const room_is_available = true;

                                                                                        return (
                                                                                            <div key={room.room_id} className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
                                                                                                <Row className="align-items-center">
                                                                                                    <Col md={9}>
                                                                                                        <div className='d-flex gap-3 room-booking-card'>
                                                                                                            <div className="room-image position-relative">
                                                                                                                <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", property?.property_uid) }}>
                                                                                                                    <Image
                                                                                                                        src={`${room.cover_photo}` || `/images/icons/No-Image.svg`}
                                                                                                                        alt={room.room_name}
                                                                                                                        width={104}
                                                                                                                        height={192}
                                                                                                                        className="img-fluid"
                                                                                                                    />
                                                                                                                </Link>
                                                                                                                <span className="image-count">
                                                                                                                    <Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />
                                                                                                                    {room_photos_length}
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div className="room-details">
                                                                                                                <div className='r-detail-1'>
                                                                                                                    <h4 className='room-title'>
                                                                                                                        {room.room_name}
                                                                                                                        <span className='room-type-badge'>{room.room_type}</span>
                                                                                                                    </h4>
                                                                                                                    <div className="room-specs mb-2">
                                                                                                                        <span className="spec-item">
                                                                                                                            <Image src="./images/icons/person.svg" width={16} height={16} alt="bed" />

                                                                                                                            Sleeps 2
                                                                                                                        </span>
                                                                                                                        <span className="spec-item">
                                                                                                                            <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" />

                                                                                                                            2 bed
                                                                                                                        </span>
                                                                                                                        {/* <span className="spec-item">{room.room_size_sqft} sq ft</span> */}
                                                                                                                    </div>
                                                                                                                    <div className="amenities mb-2">
                                                                                                                        {/* Add amenities mapping when you have the data */}
                                                                                                                        {/* <span className="amenity-item">WiFi</span>
                                                                                                                        <span className="amenity-item">AC</span> */}
                                                                                                                        {room?.room_amenities.map((amenity, inde) => (<span key={inde} className="amenity-item">{amenity}</span>))}
                                                                                                                    </div>
                                                                                                                    <Link href="#" onClick={() => filterShow(room)} className="room-details-link">
                                                                                                                        Room Details
                                                                                                                    </Link>
                                                                                                                </div>
                                                                                                                {/* Add bedroom_preference logic when available */}
                                                                                                                {/* {bedroom_preference === "Female" && (
                                                                                                            <p className='female-preferred'>FEMALE PREFERRED</p>
                                                                                                        )}
                                                                                                        {bedroom_preference === "Male" && (
                                                                                                            <span className='male-preferred'>MALE PREFERRED</span>
                                                                                                        )} */}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                    {room_is_available ? (
                                                                                                        <Col md={3}>
                                                                                                            <div className="booking-section text-end">
                                                                                                                {showPrices && (
                                                                                                                    <p className='room-price'>
                                                                                                                        From <br />
                                                                                                                        <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>
                                                                                                                            ₹{room.price_per_night}
                                                                                                                        </span><br />
                                                                                                                        / night
                                                                                                                    </p>
                                                                                                                )}
                                                                                                                {/* Add cart functionality when implemented */}
                                                                                                                {/* {cartBox?.some(item => item.room_uid === room.room_uid) ? (
                                                                                                            <Link href='#' onClick={() => handleCartData(room)} className={`reserve-btn-add`}>
                                                                                                                Remove
                                                                                                            </Link>
                                                                                                        ) : (
                                                                                                            <Link onClick={() => handleCartAdd(room)} href='#' className={`reserve-btn-add`}>
                                                                                                                <Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
                                                                                                                Add
                                                                                                            </Link>
                                                                                                        )} */}
                                                                                                                {/* <Link href='./ReserveBooking' onClick={() => {
                                                                                                                setItemLocalStorage("reserveRoom", JSON.stringify(item?.properties.map(prop => {
                                                                                                                    const selectedRooms = prop.rooms.filter(
                                                                                                                        selecedRoom => selecedRoom.room_uid === room.room_uid
                                                                                                                    );

                                                                                                                    // only return prop if the selected room exists
                                                                                                                    if (!selectedRooms.length) return null;

                                                                                                                    return {
                                                                                                                        ...prop,
                                                                                                                        rooms: selectedRooms, adultCount: item.adults
                                                                                                                    };
                                                                                                                }).filter(Boolean))); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData))
                                                                                                            }} className="reserve-btn">Reserve</Link> */}
                                                                                                                <Link href='./Multiswitchreserve' className="reserve-btn" onClick={() => setItemLocalStorage("reserveRoom", JSON.stringify(match))}>
                                                                                                                    Reserve
                                                                                                                </Link>
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                    ) : (
                                                                                                        <Col md={3} className='h-100'>
                                                                                                            <div className="booking-section text-end">
                                                                                                                <p className='mb-0'>Adjust your dates for availability.</p>
                                                                                                                <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
                                                                                                                    Change Dates
                                                                                                                </Button>
                                                                                                                <p className='mb-0'>or</p>
                                                                                                                <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }}>
                                                                                                                    Book Hotel
                                                                                                                    <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                                                                                                </Button>
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                    )}
                                                                                                </Row>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                });
                                                            })()}



                                                            <p className='fs-20 mb-0' >Mixed room options</p>
                                                            <p>A twin room option is available on one of your rooms.</p>


                                                            {/* Room Card 1 */}
                                                            {/* <div className="room-card mt-2">
                                                            <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                                <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

                                                                    <Image
                                                                        src="/images/icons/amentiy.jpg"
                                                                        alt="Room"
                                                                        width={56}
                                                                        height={56}
                                                                        className="img-fluid"
                                                                    />

                                                                    <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
                                                                </div>
                                                            </Link>


                                                            <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                                                                <Row className="align-items-center">

                                                                    <Col md={9}>
                                                                        <div className=' room-booking-card w-100 pe-3'>

                                                                            <div className="room-details">

                                                                                <div className='d-flex justify-between W-100 mb-3 '>
                                                                                    <div className='r2'>
                                                                                        <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                                                        <h4>Room 4</h4>
                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                                                        <br></br>

                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
                                                                                    </div>

                                                                                    <div className='r2 text-center'>
                                                                                        <Image src='./images/icons/swicth-acess.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                                                        Room change on <br></br>
                                                                                        Tue, 5 Aug, 2025
                                                                                    </div>


                                                                                    <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }} >
                                                                                        <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
                                                                                        <h4>Room 3</h4>
                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
                                                                                        <br></br>
                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
                                                                                    </div>

                                                                                </div>

                                                                                <div className='d-flex justify-between align-items-start'>
                                                                                    <div className='colum-1'>

                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 3</span>
                                                                                            <span className="spec-item "><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 twin bed</span>

                                                                                        </div>

                                                                                        <div className="room-specs mb-2 ">

                                                                                            <span className='female-preferred'>
                                                                                                Female Preferred
                                                                                            </span>

                                                                                            
                                                                                        </div>

                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 2</span>
                                                                                            <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                                                                        </div>



                                                                                        <p className='mb-0' >Rooms in the same property</p>

                                                                                    </div>

                                                                                    <div className='colum-2'>

                                                                                        <Link href="#" className='edit-btn py-2 px-4' onClick={filterShow2}  >View Details</Link>

                                                                                    </div>

                                                                                </div>




                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <div className="booking-section  text-end">
                                                                            {showPrices && (
                                                                                <>

                                                                                    <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
                                                                                        <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
                                                                                        / night
                                                                                    </p>


                                                                                    <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
                                                                                        <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
                                                                                        / night
                                                                                    </p>
                                                                                </>

                                                                            )}
                                                                            <Link href='./SmartSearchResult' className="reserve-btn">Reserve</Link>

                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </div> */}

                                                            {SmartSearchResult?.smart_results?.mixed_room_options?.map((option, optionIndex) => (
                                                                <div className="room-card mt-2" key={optionIndex}>
                                                                    <Link href="#" target="_blank" className='text-black text-decoration-none'>
                                                                        <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
                                                                            <Image
                                                                                src={`${option.segments[0]?.property_cover_photo}` || "/images/icons/amentiy.jpg"}
                                                                                alt="Property"
                                                                                width={56}
                                                                                height={56}
                                                                                className="img-fluid"
                                                                                style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                                                            />
                                                                            <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
                                                                                {option.segments[0]?.property_name || "Property Name"}
                                                                            </p>
                                                                        </div>
                                                                    </Link>

                                                                    <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
                                                                        <Row className="align-items-center">
                                                                            <Col md={9}>
                                                                                <div className='room-booking-card w-100 pe-3'>
                                                                                    <div className="room-details">
                                                                                        <div className='d-flex justify-between W-100 mb-3'>
                                                                                            {/* First Segment */}
                                                                                            <div className='r2'>
                                                                                                <span style={{ color: '#73615F' }}>
                                                                                                    {new Date(option.segments[0]?.check_in_datetime).toLocaleDateString('en-US', {
                                                                                                        weekday: 'short',
                                                                                                        day: 'numeric',
                                                                                                        month: 'short',
                                                                                                        year: 'numeric'
                                                                                                    })}
                                                                                                </span>
                                                                                                <h4>{option.segments[0]?.room_name || "Room"}</h4>
                                                                                                <span style={{ color: '#463527', lineHeight: '20px' }}>Check-in</span>
                                                                                                <br />
                                                                                                <Link href="#" onClick={filterShow} className="room-details-link">
                                                                                                    Room Details
                                                                                                </Link>
                                                                                            </div>

                                                                                            {/* Room Switch Info - only show if there are multiple segments */}
                                                                                            {option.segments.length > 1 && (
                                                                                                <div className='r2 text-center'>
                                                                                                    <Image
                                                                                                        src='./images/icons/swicth-acess.svg'
                                                                                                        className='img-fluid mb-2'
                                                                                                        alt="switch"
                                                                                                        width={200}
                                                                                                        height={40}
                                                                                                    />
                                                                                                    Room change on <br />
                                                                                                    {new Date(option.segments[0]?.check_out_datetime).toLocaleDateString('en-US', {
                                                                                                        weekday: 'short',
                                                                                                        day: 'numeric',
                                                                                                        month: 'short',
                                                                                                        year: 'numeric'
                                                                                                    })}
                                                                                                </div>
                                                                                            )}

                                                                                            {/* Last Segment */}
                                                                                            <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }}>
                                                                                                <span style={{ color: '#73615F' }}>
                                                                                                    {new Date(option.segments[option.segments.length - 1]?.check_out_datetime).toLocaleDateString('en-US', {
                                                                                                        weekday: 'short',
                                                                                                        day: 'numeric',
                                                                                                        month: 'short',
                                                                                                        year: 'numeric'
                                                                                                    })}
                                                                                                </span>
                                                                                                <h4>{option.segments[option.segments.length - 1]?.room_name || "Room"}</h4>
                                                                                                <span style={{ color: '#463527', lineHeight: '20px' }}>Checkout</span>
                                                                                                <br />
                                                                                                <Link href="#" onClick={filterShow} className="room-details-link">
                                                                                                    Room Details
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className='d-flex justify-between align-items-start'>
                                                                                            <div className='colum-1'>
                                                                                                {/* Map through all segments */}
                                                                                                {option.segments.map((segment, segmentIndex) => (
                                                                                                    <div key={segment.segment_id || segmentIndex}>
                                                                                                        <div className="room-specs mb-2">
                                                                                                            <span className="spec-item">{segment.room_name}</span>
                                                                                                            <span className="spec-item">
                                                                                                                <Image
                                                                                                                    src="./images/icons/single_bed.svg"
                                                                                                                    width={16}
                                                                                                                    height={16}
                                                                                                                    alt="bed"
                                                                                                                />
                                                                                                                {segment.room_type}
                                                                                                            </span>
                                                                                                        </div>

                                                                                                        {/* Add Female Preferred badge conditionally if needed */}
                                                                                                        {segment.room_type === "Twin-Sharing" && (
                                                                                                            <div className="room-specs mb-2">
                                                                                                                <span className='female-preferred'>
                                                                                                                    Female Preferred
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                ))}

                                                                                                <p className='mb-0'>Rooms in the same property</p>
                                                                                            </div>

                                                                                            <div className='colum-2'>
                                                                                                <Link href="#" className='edit-btn py-2 px-4' onClick={filterShow2}>
                                                                                                    View Details
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>

                                                                            <Col md={3}>
                                                                                <div className="booking-section text-end">
                                                                                    {/* Show price for each segment */}
                                                                                    {showPrices && option.segments.map((segment, segmentIndex) => (
                                                                                        <p key={segmentIndex} className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }}>
                                                                                            From <br />
                                                                                            <span style={{
                                                                                                fontSize: '2rem',
                                                                                                fontWeight: '500',
                                                                                                color: '#BF9039',
                                                                                                fontFamily: 'Felgine',
                                                                                                lineHeight: 'auto'
                                                                                            }}>
                                                                                                ₹{segment.price_per_night?.toLocaleString('en-IN') || "0"}
                                                                                            </span> <br />
                                                                                            / night
                                                                                        </p>
                                                                                    ))}

                                                                                    <Link href='./Multiswitchreserve' className="reserve-btn" onClick={() => setItemLocalStorage("reserveRoom", JSON.stringify(option))}>
                                                                                        Reserve
                                                                                    </Link>

                                                                                    {/* Optional: Show total nights and switches */}
                                                                                    <div className="mt-2" style={{ fontSize: '0.8rem', color: '#73615F' }}>
                                                                                        {option.total_nights} nights • {option.num_switches} switch{option.num_switches !== 1 ? 'es' : ''}
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                </div>
                                                            ))}



                                                            {/* <div className="multiswitch-room room-card mt-2">
                                                            <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                                <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

                                                                    <Image
                                                                        src="/images/icons/amentiy.jpg"
                                                                        alt="Room"
                                                                        width={56}
                                                                        height={56}
                                                                        className="img-fluid"
                                                                    />

                                                                    <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
                                                                </div>
                                                            </Link>

                                                            <div className=' border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                                                                <Row className="align-items-center">

                                                                    <Col md={12}>
                                                                        <div className=' room-booking-card w-100 pe-3'>

                                                                            <div className="room-details">

                                                                                <div className='d-flex justify-between W-100 mb-3 '>
                                                                                    <div className='r2 mwid20'>
                                                                                        <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                                                        <h4>Room 4</h4>
                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                                                        <br></br>

                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

                                                                                        {showPrices && (
                                                                                            <>

                                                                                                <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
                                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
                                                                                                    / night
                                                                                                </p>
                                                                                            </>

                                                                                        )}
                                                                                    </div>

                                                                                    <div className='r2  mwid20 text-center'>
                                                                                        <Image src='./images/icons/swicth-acess.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                                                        Room change on <br></br>
                                                                                        Tue, 5 Aug, 2025
                                                                                    </div>


                                                                                    <div className='r2  mwid20 text-center'  >
                                                                                        <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
                                                                                        <h4>Room 3</h4>                                                                                        
                                                                                        <br></br>
                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

                                                                                        {showPrices && (
                                                                                            <>
                                                                                                <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
                                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
                                                                                                    / night
                                                                                                </p>
                                                                                            </>

                                                                                        )}
                                                                                    </div>

                                                                                    <div className='r2  mwid20 text-center'>
                                                                                        <Image src='./images/icons/swicth-acess.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                                                        Room change on <br></br>
                                                                                        Tue, 9 Aug, 2025
                                                                                    </div>


                                                                                    <div className='r2  mwid20' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }} >
                                                                                        <span style={{ color: '#73615F' }} >Sun, 10 Aug, 2025</span>
                                                                                        <h4>Room 3</h4>
                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
                                                                                        <br></br>
                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

                                                                                        {showPrices && (
                                                                                            <>

                                                                                                <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
                                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
                                                                                                    / night
                                                                                                </p>
                                                                                            </>

                                                                                        )}
                                                                                    </div>

                                                                                </div>

                                                                                <div className='d-flex justify-between align-items-start'>
                                                                                    <div className='colum-1'>

                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 3</span>
                                                                                            <span className="spec-item "><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 twin bed</span>

                                                                                        </div>

                                                                                        <div className="room-specs mb-2 ">

                                                                                            <span className='female-preferred'>
                                                                                                Female Preferred
                                                                                            </span>
                                                                                            
                                                                                        </div>

                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 2</span>
                                                                                            <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                                                                        </div>
                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 4</span>
                                                                                            <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                                                                        </div>

                                                                                    </div>

                                                                                    <div className='colum-2'>


                                                                                        <Link href="#" className='edit-btn py-2 px-4 mb-3' onClick={filterShow2}  >View Details</Link>
                                                                                        <div className="booking-section  text-end">

                                                                                            <Link href='./Multiswitchreserve' className="reserve-btn">Reserve</Link>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                            </div>
                                                        </div> */}

                                                            {/* {SmartSearchResult?.smart_results?.mixed_room_options?.map((option, optionIndex) => (
                                                            <div className="multiswitch-room room-card mt-2" key={optionIndex}>
                                                                
                                                                <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none'>
                                                                    <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
                                                                        <Image
                                                                            src={option.segments[0]?.property_cover_photo || "/images/icons/amentiy.jpg"}
                                                                            alt="Property"
                                                                            width={56}
                                                                            height={56}
                                                                            className="img-fluid"
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = "/images/icons/amentiy.jpg";
                                                                            }}
                                                                        />
                                                                        <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
                                                                            {option.segments[0]?.property_name || "Property Name"}
                                                                        </p>
                                                                    </div>
                                                                </Link>

                                                                <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
                                                                    <Row className="align-items-center">
                                                                        <Col md={12}>
                                                                            <div className='room-booking-card w-100 pe-3'>
                                                                                <div className="room-details">
                                                                                    
                                                                                    <div className='d-flex justify-between W-100 mb-3'>
                                                                                        
                                                                                        {option.segments.map((segment, segmentIndex) => (
                                                                                            <React.Fragment key={segment.segment_id}>
                                                                                                
                                                                                                <div className='r2 mwid20'>
                                                                                                    
                                                                                                    <span style={{ color: '#73615F' }}>
                                                                                                        {new Date(segment.check_in_datetime).toLocaleDateString('en-US', {
                                                                                                            weekday: 'short',
                                                                                                            day: 'numeric',
                                                                                                            month: 'short',
                                                                                                            year: 'numeric'
                                                                                                        })}
                                                                                                    </span>

                                                                                                    
                                                                                                    <h4>{segment.room_name}</h4>

                                                                                                    
                                                                                                    {segmentIndex === 0 ? (
                                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }}>Check-in</span>
                                                                                                    ) : segmentIndex === option.segments.length - 1 ? (
                                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }}>Checkout</span>
                                                                                                    ) : (
                                                                                                        <br />
                                                                                                    )}
                                                                                                    <br />

                                                                                                    
                                                                                                    <Link href="#" onClick={filterShow} className="room-details-link">
                                                                                                        Room Details
                                                                                                    </Link>

                                                                                                    
                                                                                                    {showPrices && (
                                                                                                        <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }}>
                                                                                                            From <br />
                                                                                                            <span style={{
                                                                                                                fontSize: '2rem',
                                                                                                                fontWeight: '500',
                                                                                                                color: '#BF9039',
                                                                                                                fontFamily: 'Felgine',
                                                                                                                lineHeight: 'auto'
                                                                                                            }}>
                                                                                                                ₹{segment.price_per_night?.toLocaleString('en-IN') || "0"}
                                                                                                            </span> <br />
                                                                                                            / night
                                                                                                        </p>
                                                                                                    )}
                                                                                                </div>

                                                                                                {segmentIndex < option.segments.length - 1 && (
                                                                                                    <div className='r2 mwid20 text-center'>
                                                                                                        <Image
                                                                                                            src='./images/icons/swicth-acess.svg'
                                                                                                            className='img-fluid mb-2'
                                                                                                            alt="switch"
                                                                                                            width={200}
                                                                                                            height={40}
                                                                                                        />
                                                                                                        Room change on <br />
                                                                                                        {new Date(segment.check_out_datetime).toLocaleDateString('en-US', {
                                                                                                            weekday: 'short',
                                                                                                            day: 'numeric',
                                                                                                            month: 'short',
                                                                                                            year: 'numeric'
                                                                                                        })}
                                                                                                    </div>
                                                                                                )}
                                                                                            </React.Fragment>
                                                                                        ))}
                                                                                    </div>

                                                                                    <div className='d-flex justify-between align-items-start'>
                                                                                        <div className='colum-1'>
                                                                                            {option.segments.map((segment, segmentIndex) => (
                                                                                                <div key={segment.segment_id} className="room-specs mb-2">
                                                                                                    <span className="spec-item">{segment.room_name}</span>
                                                                                                    <span className="spec-item">
                                                                                                        <Image
                                                                                                            src="./images/icons/single_bed.svg"
                                                                                                            width={16}
                                                                                                            height={16}
                                                                                                            alt="bed type"
                                                                                                        />
                                                                                                        {segment.room_type}
                                                                                                    </span>

                                                                                                     {segment.room_type === "Twin-Sharing" && (
                                                                                                        <div className="room-specs mb-2">
                                                                                                            <span className='female-preferred'>
                                                                                                                Female Preferred
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>

                                                                                        <div className='colum-2'>
                                                                                            <Link href="#" className='edit-btn py-2 px-4 mb-3' onClick={filterShow2}>
                                                                                                View Details
                                                                                            </Link>
                                                                                            <div className="booking-section text-end">
                                                                                                <Link href='./Multiswitchreserve' className="reserve-btn">
                                                                                                    Reserve - ₹{option.total_price?.toLocaleString('en-IN') || "0"}
                                                                                                </Link>

                                                                                                <div className="mt-2" style={{ fontSize: '0.85rem', color: '#73615F' }}>
                                                                                                    {option.total_nights} nights • {option.num_switches} switch{option.num_switches !== 1 ? 'es' : ''} • Score: {option.score}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </div>
                                                        ))} */}

                                                            <hr style={{ margin: '40px 0' }} ></hr>


                                                            <p className='fs-20 mb-0' >Mixed BR options</p>
                                                            <p>Single room option is available on one of your rooms upon BR Switch.</p>


                                                            {/* Room Card 1 */}
                                                            {/* <div className="room-card mt-2">
                                                            <div className='border-bottom-custom1 pb-3 mb-3'>
                                                                <Row>
                                                                    <Col md={5}>
                                                                        <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                                            <div className='d-flex gap-2 align-items-center '>

                                                                                <Image
                                                                                    src="/images/icons/amentiy.jpg"
                                                                                    alt="Room"
                                                                                    width={56}
                                                                                    height={56}
                                                                                    className="img-fluid"
                                                                                />

                                                                                <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
                                                                            </div>
                                                                        </Link>

                                                                    </Col>

                                                                    <Col md={5}>
                                                                        <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                                            <div className='d-flex gap-2 align-items-center '>

                                                                                <Image
                                                                                    src="/images/icons/amentiy.jpg"
                                                                                    alt="Room"
                                                                                    width={56}
                                                                                    height={56}
                                                                                    className="img-fluid"
                                                                                />

                                                                                <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Yayati Apartments 6th Floor</p>
                                                                            </div>
                                                                        </Link>

                                                                    </Col>
                                                                </Row>

                                                            </div>


                                                            <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                                                                <Row className="align-items-center">

                                                                    <Col md={9}>
                                                                        <div className=' room-booking-card w-100 pe-3'>

                                                                            <div className="room-details">

                                                                                <div className='d-flex align-items-center justify-between W-100 mb-3 '>
                                                                                    <div className='r2' style={{ maxWidth: '130px' }}  >
                                                                                        <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                                                        <h4>Room 2</h4>
                                                                                        <p className='mb-0'>Casa Melhor Yayati Tulip 17th Floor</p>
                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>

                                                                                        <br></br>
                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

                                                                                    </div>

                                                                                    <div className='r2 text-center'>
                                                                                        <Image src='./images/icons/move-mistry.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                                                        Room change on <br></br>
                                                                                        Tue, 5 Aug, 2025
                                                                                    </div>


                                                                                    <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
                                                                                        <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
                                                                                        <h4>Room 4</h4>
                                                                                        <p className='mb-0'>Yayati Apartments 6th Floor</p>
                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>

                                                                                        <br></br>
                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
                                                                                    </div>

                                                                                </div>

                                                                                <div className='d-flex justify-between align-items-start'>
                                                                                    <div className='colum-1'>

                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 3</span> |
                                                                                            <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                                                                        </div>                                                                                        

                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 2</span> |
                                                                                            <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                                                                        </div>
                                                                                        <p className='mb-0' >Rooms in the same property</p>

                                                                                    </div>

                                                                                    <div className='colum-2'>

                                                                                        <Link href="#" onClick={filterShow3} className='edit-btn py-2 px-4' >View Details</Link>

                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <div className="booking-section  text-end">
                                                                            {showPrices && (
                                                                                <p className='room-price' >From <br />
                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
                                                                                    / night
                                                                                </p>
                                                                            )}
                                                                            <Link href='./SmartSearchResult2' className="reserve-btn">Reserve</Link>

                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </div> */}


                                                            {SmartSearchResult?.smart_results?.mixed_property_options?.map((option, optionIndex) => (
                                                                <div className="room-card mt-2" key={optionIndex}>
                                                                    <div key={optionIndex}>
                                                                        <div className='border-bottom-custom1 pb-3 mb-3'>
                                                                            <Row>
                                                                                {option.segments.map((segment, segmentIndex) => (
                                                                                    <Col md={5} key={segment.property_id}>
                                                                                        <Link href={`/propertyDetails?uid=${segment?.property_uid}`} className='text-black text-decoration-none' >
                                                                                            <div className='d-flex gap-2 align-items-center'>
                                                                                                <Image
                                                                                                    src={`${segment.property_cover_photo}` || "/images/default-property.jpg"}
                                                                                                    alt={segment.property_name}
                                                                                                    width={56}
                                                                                                    height={56}
                                                                                                    className="img-fluid"
                                                                                                    style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                                                                                />
                                                                                                <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }}>
                                                                                                    {segment.property_name}
                                                                                                </p>
                                                                                            </div>
                                                                                        </Link>
                                                                                    </Col>
                                                                                ))}
                                                                            </Row>
                                                                        </div>

                                                                        <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }}>
                                                                            <Row className="align-items-center">
                                                                                <Col md={9}>
                                                                                    <div className='room-booking-card w-100 pe-3'>
                                                                                        <div className="room-details">
                                                                                            <div className='d-flex align-items-center justify-between w-100 mb-3'>
                                                                                                {/* First Segment */}
                                                                                                {option.segments.length > 0 && (
                                                                                                    <div className='r2' style={{ maxWidth: '130px' }}>
                                                                                                        <span style={{ color: '#73615F' }}>
                                                                                                            {new Date(option.segments[0].check_in_datetime).toLocaleDateString('en-US', {
                                                                                                                weekday: 'short',
                                                                                                                day: 'numeric',
                                                                                                                month: 'short',
                                                                                                                year: 'numeric'
                                                                                                            })}
                                                                                                        </span>
                                                                                                        <h4>{option.segments[0].room_name}</h4>
                                                                                                        <p className='mb-0'>{option.segments[0].property_name}</p>
                                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }}>Check-in</span>
                                                                                                        <br />
                                                                                                        <Link href="#" onClick={filterShow} className="room-details-link">Room Details</Link>
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Switch Indicator (only show if more than 1 segment) */}
                                                                                                {option.segments.length > 1 && (
                                                                                                    <div className='r2 text-center'>
                                                                                                        <Image
                                                                                                            src='./images/icons/move-mistry.svg'
                                                                                                            className='img-fluid mb-2'
                                                                                                            alt="switch"
                                                                                                            width={200}
                                                                                                            height={40}
                                                                                                        />
                                                                                                        Room change on <br />
                                                                                                        {new Date(option.segments[0].check_out_datetime).toLocaleDateString('en-US', {
                                                                                                            weekday: 'short',
                                                                                                            day: 'numeric',
                                                                                                            month: 'short',
                                                                                                            year: 'numeric'
                                                                                                        })}
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Last Segment */}
                                                                                                {option.segments.length > 0 && (
                                                                                                    <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }}>
                                                                                                        <span style={{ color: '#73615F' }}>
                                                                                                            {new Date(option.segments[option.segments.length - 1].check_out_datetime).toLocaleDateString('en-US', {
                                                                                                                weekday: 'short',
                                                                                                                day: 'numeric',
                                                                                                                month: 'short',
                                                                                                                year: 'numeric'
                                                                                                            })}
                                                                                                        </span>
                                                                                                        <h4>{option.segments[option.segments.length - 1].room_name}</h4>
                                                                                                        <p className='mb-0'>{option.segments[option.segments.length - 1].property_name}</p>
                                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }}>Checkout</span>
                                                                                                        <br />
                                                                                                        <Link href="#" onClick={filterShow} className="room-details-link">Room Details</Link>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>

                                                                                            <div className='d-flex justify-between align-items-start'>
                                                                                                <div className='colum-1'>
                                                                                                    {/* Render room specs for all segments */}
                                                                                                    {option.segments.map((segment, index) => (
                                                                                                        <div className="room-specs mb-2" key={index}>
                                                                                                            <span className="spec-item">{segment.room_name}</span> |
                                                                                                            <span className="spec-item">
                                                                                                                <Image
                                                                                                                    src="./images/icons/single_bed.svg"
                                                                                                                    width={16}
                                                                                                                    height={16}
                                                                                                                    alt="bed"
                                                                                                                /> {segment.room_type}
                                                                                                            </span> |
                                                                                                            <span className="spec-item">{segment.nights} night(s)</span>
                                                                                                        </div>
                                                                                                    ))}

                                                                                                    <p className='mb-0'>Total: {option.total_nights} nights across {option.segments.length} properties</p>
                                                                                                </div>

                                                                                                <div className='colum-2'>
                                                                                                    <Link href="#" onClick={filterShow3} className='edit-btn py-2 px-4'>View Details</Link>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </Col>

                                                                                <Col md={3}>
                                                                                    <div className="booking-section text-end">
                                                                                        {showPrices && (
                                                                                            <p className='room-price'>
                                                                                                From <br />
                                                                                                <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>
                                                                                                    ₹{option.total_price.toLocaleString('en-IN')}
                                                                                                </span> <br />
                                                                                                / {option.total_nights} nights
                                                                                            </p>
                                                                                        )}
                                                                                        <Link
                                                                                            href='./Multiswitchreserve'
                                                                                            className="reserve-btn"
                                                                                            // onClick={() => handleReserve(option)}
                                                                                            onClick={() => setItemLocalStorage("reserveRoom", JSON.stringify(option))}
                                                                                        >
                                                                                            Reserve
                                                                                        </Link>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}



                                                            {/* <div className="multiswitch-room room-card mt-2">
                                                            <div className='d-flex gap-2 align-items-center border-bottom-custom1 pb-3 mb-3'>
                                                                <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                                    <div className='d-flex gap-2 align-items-center '>

                                                                        <Image
                                                                            src="/images/icons/amentiy.jpg"
                                                                            alt="Room"
                                                                            width={56}
                                                                            height={56}
                                                                            className="img-fluid"
                                                                        />

                                                                        <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
                                                                    </div>
                                                                </Link>

                                                                <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                                    <div className='d-flex gap-2 align-items-center '>

                                                                        <Image
                                                                            src="/images/icons/proprty.jpg"
                                                                            alt="Room"
                                                                            width={56}
                                                                            height={56}
                                                                            className="img-fluid"
                                                                        />

                                                                        <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Yayati Apartments 6th Floor</p>
                                                                    </div>
                                                                </Link>

                                                                <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                                    <div className='d-flex gap-2 align-items-center '>

                                                                        <Image
                                                                            src="/images/icons/amentiy.jpg"
                                                                            alt="Room"
                                                                            width={56}
                                                                            height={56}
                                                                            className="img-fluid"
                                                                        />

                                                                        <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
                                                                    </div>
                                                                </Link>
                                                            </div>

                                                            <div className=' border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                                                                <Row className="align-items-center">

                                                                    <Col md={12}>
                                                                        <div className=' room-booking-card w-100 pe-3'>

                                                                            <div className="room-details">

                                                                                <div className='d-flex justify-between W-100 mb-3 '>
                                                                                    <div className='r2 mwid20'>
                                                                                        <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                                                        <h4>Room 4</h4>
                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                                                        <br></br>

                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

                                                                                        {showPrices && (
                                                                                            <>

                                                                                                <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
                                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
                                                                                                    / night
                                                                                                </p>



                                                                                            </>

                                                                                        )}
                                                                                    </div>

                                                                                    <div className='r2  mwid20 text-center'>
                                                                                        <Image src='./images/icons/move-property.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                                                        Property change on <br></br>
                                                                                        Tue, 5 Aug, 2025
                                                                                    </div>


                                                                                    <div className='r2  mwid20 text-center'  >
                                                                                        <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
                                                                                        <h4>Room 3</h4>

                                                                                        <br></br>
                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

                                                                                        {showPrices && (
                                                                                            <>

                                                                                                <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
                                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
                                                                                                    / night
                                                                                                </p>



                                                                                            </>

                                                                                        )}
                                                                                    </div>

                                                                                    <div className='r2  mwid20 text-center'>
                                                                                        <Image src='./images/icons/move-property.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                                                        Property change on <br></br>
                                                                                        Tue, 9 Aug, 2025
                                                                                    </div>


                                                                                    <div className='r2  mwid20' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }} >
                                                                                        <span style={{ color: '#73615F' }} >Sun, 10 Aug, 2025</span>
                                                                                        <h4>Room 3</h4>
                                                                                        <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
                                                                                        <br></br>
                                                                                        <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

                                                                                        {showPrices && (
                                                                                            <>

                                                                                                <p className='room-price border-bottom-custom1 pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
                                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
                                                                                                    / night
                                                                                                </p>



                                                                                            </>

                                                                                        )}
                                                                                    </div>

                                                                                </div>

                                                                                <div className='d-flex justify-between align-items-start'>
                                                                                    <div className='colum-1'>

                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 3</span>
                                                                                            <span className="spec-item "><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 twin bed</span>

                                                                                        </div>

                                                                                        <div className="room-specs mb-2 ">

                                                                                            <span className='female-preferred'>
                                                                                                Female Preferred
                                                                                            </span>

                                                                                            
                                                                                        </div>

                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 2</span>
                                                                                            <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                                                                        </div>



                                                                                        <div className="room-specs mb-2">
                                                                                            <span className="spec-item">Room 4</span>
                                                                                            <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                                                                        </div>

                                                                                    </div>

                                                                                    <div className='colum-2'>


                                                                                        <Link href="#" className='edit-btn py-2 px-4 mb-3' onClick={filterShow2}  >View Details</Link>
                                                                                        <div className="booking-section  text-end">

                                                                                            <Link href='./Multiswitchreserve' className="reserve-btn">Reserve</Link>

                                                                                        </div>
                                                                                    </div>

                                                                                </div>




                                                                            </div>
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                            </div>


                                                        </div> */}
                                                            {/* <hr style={{ margin: '40px 0' }} ></hr>
                                                            <p className='fs-20 mb-0' >Other options</p>
                                                            <p>Single room option is partially available on one of your rooms.</p> */}

                                                            {/* Room Card 1 */}
                                                            {/* <div className="room-card mt-2">
                                                                <Row>
                                                                    <Col md={5}>
                                                                        <div className='d-flex gap-2 align-items-center mb-3'>
                                                                            <Image
                                                                                src="/images/icons/amentiy.jpg"
                                                                                alt="Room"
                                                                                width={56}
                                                                                height={56}
                                                                                className="img-fluid"
                                                                            />
                                                                            <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
                                                                        </div>
                                                                    </Col>


                                                                </Row>


                                                                <div className='border-bottom-custom1  mb-3  pb-3' style={{ borderColor: '#463527' }} >
                                                                    <Row className="align-items-center">

                                                                        <Col md={9}>
                                                                            <div className=' room-booking-card w-100 pe-3'>

                                                                                <div className="room-details">

                                                                                    <div className='d-flex align-items-center justify-between W-100 mb-3 '>
                                                                                        <div className='r2' style={{ maxWidth: '130px' }}  >
                                                                                            <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                                                            <h4>N/A</h4>


                                                                                        </div>

                                                                                        <div className='r2 text-center'>
                                                                                            <Image src='./images/icons/no-avaible.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                                                            No availability
                                                                                        </div>


                                                                                        <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
                                                                                            <span style={{ color: '#73615F' }} >Tue, 5 Aug, 2025</span>
                                                                                            <h4>N/A</h4>


                                                                                        </div>

                                                                                    </div>






                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col md={3} className='h-100' >
                                                                            <div className="booking-section text-end">
                                                                                {showPrices && (
                                                                                    <p className='room-price' >From <br />
                                                                                        <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
                                                                                        / night
                                                                                    </p>
                                                                                )}
                                                                                <p className='mb-0' >This room is already booked for your selected dates.</p>
                                                                                <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
                                                                                <p className='mb-0' >or</p>
                                                                                <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
                                                                                    <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                                                                </Button>

                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>


                                                                <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                                                                    <Row className="align-items-center">

                                                                        <Col md={9}>
                                                                            <div className=' room-booking-card w-100 pe-3'>

                                                                                <div className="room-details">

                                                                                    <div className='d-flex align-items-center justify-between W-100 mb-3 '>
                                                                                        <div className='r2' style={{ maxWidth: '130px' }}  >
                                                                                            <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                                                            <h4>Room 4</h4>

                                                                                            <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                                                        </div>

                                                                                        <div className='r2 text-center'>
                                                                                            <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />

                                                                                        </div>


                                                                                        <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
                                                                                            <span style={{ color: '#73615F' }} >Thu, 7 Aug, 2025</span>
                                                                                            <h4>Room 4</h4>

                                                                                            <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
                                                                                        </div>

                                                                                    </div>

                                                                                    <div className='d-flex justify-between align-items-start'>
                                                                                        <div className='colum-1'>

                                                                                            <div className="room-specs mb-2">
                                                                                                <span className="spec-item">Room 3</span>
                                                                                                <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                                                                            </div>







                                                                                        </div>

                                                                                        <div className='colum-2'>

                                                                                            <Link href="#" onClick={filterShow1} className='edit-btn py-2 px-4' >View Details</Link>

                                                                                        </div>

                                                                                    </div>




                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col md={3}>
                                                                            <div className="booking-section  text-end">
                                                                                {showPrices && (
                                                                                    <p className='room-price' >From <br />
                                                                                        <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
                                                                                        / night
                                                                                    </p>
                                                                                )}
                                                                                <Link href='./TwinBedroomReserve2' className="reserve-btn">Reserve</Link>

                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>



                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    </Tab>
                                    {!isSmartSearchEnabled && (
                                        <Tab eventKey="twin-sharing-rooms" title="Shared Rooms">
                                            <div className="property-results">
                                                <div className="property-card mb-4">
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-2 pt-2'>
                                                        <label className='mb-0 d-flex gap-2 align-items-center' >
                                                            <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
                                                            Show room prices
                                                        </label>

                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Name"
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {bookingRoomsData.length > 0 ? bookingRoomsData.map((item, i) => (<div key={i}>
                                                        <p className='text-right p-title position-relative' >
                                                            <span>Property {i + 1} </span>  </p>
                                                        {/* Room Card 1 */}
                                                        {item?.properties.map((prop, ind) => (<div key={ind} className="room-card mt-2">
                                                            <Link href={`/propertyDetails?uid=${prop?.property_uid}`} target="_blank" className='text-black text-decoration-none' >
                                                                <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
                                                                    <Image
                                                                        src={prop?.cover_photo ? `${prop?.cover_photo}` : `/images/icons/No-Image.svg`}
                                                                        alt="Room"
                                                                        width={56}
                                                                        height={56}
                                                                        className="img-fluid"
                                                                        style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                                                    />
                                                                    <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >{prop?.property_name}</p>
                                                                </div>
                                                            </Link>

                                                            {prop.rooms.length > 0 && prop.rooms.map((room, index) => (<div key={index} className={room.is_available ? "border-bottom-custom1 mb-3 pb-3" : "border-bottom-custom1 disabled-room mb-3  pb-3"} style={{ borderColor: '#463527' }} >
                                                                <Row className="align-items-center">

                                                                    <Col md={9}>
                                                                        <div className='d-flex gap-3 room-booking-card'>
                                                                            <div className="room-image position-relative">
                                                                                <Link href="./ViewDetailsResult" onClick={(e) => { setItemLocalStorage("selectedpropId", prop?.property_uid) }}>
                                                                                    <Image
                                                                                        src={room?.cover_photo ? `${room?.cover_photo}` : `/images/icons/No-Image.svg`}
                                                                                        alt="Room"
                                                                                        width={104}
                                                                                        height={192}
                                                                                        className="img-fluid"
                                                                                    />

                                                                                </Link>

                                                                                <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />{room?.room_photos?.length}</span>
                                                                            </div>
                                                                            <div className="room-details">
                                                                                <div className='r-detail-1'>
                                                                                    <h4 className='room-title'> {room?.room_name}   {room?.room_type === roomType && <span className='room-type-badge' >Shared Room</span>} </h4>
                                                                                    <div className="room-specs mb-2">
                                                                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps {room?.max_guests}</span>
                                                                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> {room.beds.length} bed</span>
                                                                                        <span className="spec-item">{room?.room_size_sqft} sq ft</span>
                                                                                    </div>
                                                                                    <div className="amenities mb-2">
                                                                                        {room?.room_amenities.map((amenity, inde) => (<span key={inde} className="amenity-item">{amenity}</span>))}
                                                                                    </div>

                                                                                    <Link href="#" onClick={() => { filterShow(room, item.adults) }} className="room-details-link ">Room Details</Link>
                                                                                </div>
                                                                                <div className="room-specs mb-2">
                                                                                    {room?.gender_lock && room?.room_type === "Twin-Sharing" &&
                                                                                        <>
                                                                                            {room?.gender_lock?.locked_gender === "Male" && (
                                                                                                <span className='status-tag male-booked'>
                                                                                                    Male Booked
                                                                                                </span>
                                                                                            )}
                                                                                            {room?.gender_lock?.locked_gender === "Female" && (
                                                                                                <span className='status-tag female-booked'>
                                                                                                    Female Booked
                                                                                                </span>
                                                                                            )}
                                                                                        </>
                                                                                    }

                                                                                    {room?.bedroom_preference === "Female" && <span className='female-preferred'>
                                                                                        Female PREFERRED
                                                                                    </span>}
                                                                                    {room?.bedroom_preference === "Male" && <span className='male-preferred'>
                                                                                        Male PREFERRED
                                                                                    </span>}
                                                                                    {room?.available_beds?.length > 0 ? <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>{room?.available_beds?.length} BED LEFT!</span> : <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>NO BED LEFT!</span>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                    {room.is_available ? <Col md={3}>
                                                                        <div className="booking-section  text-end">
                                                                            {showPrices && (
                                                                                <p className='room-price' >From <br />
                                                                                    <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹{room.price_per_night}</span> <br />
                                                                                    / night
                                                                                </p>
                                                                            )}
                                                                            <Link href='#' onClick={() => {
                                                                                setItemLocalStorage("reserveRoom", JSON.stringify(item?.properties.map(prop => {
                                                                                    const selectedRooms = prop.rooms.filter(
                                                                                        selecedRoom => selecedRoom.room_uid === room.room_uid
                                                                                    );

                                                                                    // only return prop if the selected room exists
                                                                                    if (!selectedRooms.length) return null;

                                                                                    return {
                                                                                        ...prop,
                                                                                        rooms: selectedRooms, adultCount: item.adults
                                                                                    };
                                                                                }).filter(Boolean))); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData))
                                                                                window.location.href = "/ReserveBooking";
                                                                            }} className="reserve-btn">Reserve</Link>

                                                                        </div>
                                                                    </Col>
                                                                        :
                                                                        <Col md={3} className='h-100' >
                                                                            <div className="booking-section text-end">
                                                                                <p className='mb-0' >{room?.booking_info?.message}</p>
                                                                                <Button variant="" onClick={marknoShowModal} className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
                                                                                <p className='mb-0' >or</p>
                                                                                <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
                                                                                    <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                                                                </Button>


                                                                            </div>
                                                                        </Col>}
                                                                </Row>
                                                            </div>))}
                                                            <>
                                                                {/* <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                              <Col md={9}>
                                <div className='d-flex gap-3 room-booking-card'>
                                  <div className="room-image position-relative">
                                    <Link href="./ViewDetailsResult">
                                      <Image
                                        src="/images/icons/room-img1.jpg"
                                        alt="Room"
                                        width={104}
                                        height={192}
                                        className="img-fluid"
                                      />
                                      <p>Booked on your dates</p>

                                    </Link>

                                    <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
                                  </div>
                                  <div className="room-details">
                                    <div className='r-detail-1'>
                                      <h4 className='room-title'> Room 4   <span className='room-type-badge' >Shared Room</span> </h4>
                                      <div className="room-specs mb-2">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
                                        <span className="spec-item">538 sq ft</span>
                                      </div>
                                      <div className="amenities mb-2">
                                        <span className="amenity-item">36&quot; flat-screen TV</span>
                                        <span className="amenity-item">Ceiling fans</span>
                                        <span className="amenity-item">Coffee maker</span>
                                        <span className="amenity-item">Robes</span>
                                        <span className="amenity-item">Hair dryer</span>
                                        <span className="amenity-item">Iron and ironing board</span>
                                      </div>

                                      <Link href="#" className="room-details-link ">Room Details</Link>
                                    </div>

                                    <div className="room-specs mb-2 ">

                                        <span className='status-tag female-booked'>
                                      Female Booked
                                      </span>

                                      <span className='status-tag female-preferred'>
                                      Female preferred
                                      </span>

                                      <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>No bed left!</span>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col md={3} className='h-100' >
                                <div className="booking-section text-end">
                                  {showPrices && (
                                    <p className='room-price' >From <br />
                                      <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
                                      / night
                                    </p>
                                  )}
                                  <p className='mb-0' >This room is already booked for your selected dates.</p>
                                  <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
                                  <p className='mb-0' >or</p>
                                  <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
                                    <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
                                  </Button>

                                </div>
                              </Col>
                            </Row>
                          </div> */}
                                                            </>

                                                        </div>))}
                                                    </div>)) : <>
                                                        <p className='fs-20 mb-1'>Selected room type is not available for your dates.</p>
                                                        <p className='mb-3' >Adjust your dates for availability or enable smart search for our suggestions.</p>

                                                        {/* <Button variant='' className='edit-btn py-2 px-4'>Enable Smart Search</Button> */}
                                                    </>}
                                                    <>
                                                        {/*  <p className='text-right p-title position-relative' >
                                                        <span>Property 2 </span>  </p>


                                                    <div className="room-card mt-2">
                                                        <Link href={`/PropertyDetails/${prop?.uid}`} className='text-black text-decoration-none' >
                                                            <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

                                                                <Image
                                                                    src="/images/icons/amentiy.jpg"
                                                                    alt="Room"
                                                                    width={56}
                                                                    height={56}
                                                                    className="img-fluid"
                                                                />

                                                                <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
                                                            </div>
                                                        </Link>

                                                        <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                                                            <Row className="align-items-center">

                                                                <Col md={9}>
                                                                    <div className='d-flex gap-3 room-booking-card'>
                                                                        <div className="room-image position-relative">
                                                                            <Link href="./ViewDetailsResult">
                                                                                <Image
                                                                                    src="/images/icons/room-img1.jpg"
                                                                                    alt="Room"
                                                                                    width={104}
                                                                                    height={192}
                                                                                    className="img-fluid"
                                                                                />

                                                                            </Link>

                                                                            <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
                                                                        </div>
                                                                        <div className="room-details">
                                                                            <div className='r-detail-1'>
                                                                                <h4 className='room-title'> Room 4   <span className='room-type-badge' >Shared Room</span> </h4>
                                                                                <div className="room-specs mb-2">
                                                                                    <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 4 </span>
                                                                                    <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 4 twin bed</span>
                                                                                    <span className="spec-item">538 sq ft</span>
                                                                                </div>
                                                                                <div className="amenities mb-2">
                                                                                    <span className="amenity-item">36&quot; flat-screen TV</span>
                                                                                    <span className="amenity-item">Ceiling fans</span>
                                                                                    <span className="amenity-item">Coffee maker</span>
                                                                                    <span className="amenity-item">Robes</span>
                                                                                    <span className="amenity-item">Hair dryer</span>
                                                                                    <span className="amenity-item">Iron and ironing board</span>
                                                                                </div>

                                                                                <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
                                                                            </div>
                                                                            <div className="room-specs mb-2 ">

                                                                                <span className='status-tag male-booked'>
                                                                                    Male Booked
                                                                                </span>

                                                                                <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>Only 1 bed left!</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <div className="booking-section  text-end">
                                                                        {showPrices && (
                                                                            <p className='room-price' >From <br />
                                                                                <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
                                                                                / night
                                                                            </p>
                                                                        )}
                                                                        <Link href='./TwinBedroomReserve' className="reserve-btn">Reserve</Link>

                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                        <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
                                                            <Row className="align-items-center">

                                                                <Col md={9}>
                                                                    <div className='d-flex gap-3 room-booking-card'>
                                                                        <div className="room-image position-relative">
                                                                            <Link href="./ViewDetailsResult">
                                                                                <Image
                                                                                    src="/images/icons/room-img1.jpg"
                                                                                    alt="Room"
                                                                                    width={104}
                                                                                    height={192}
                                                                                    className="img-fluid"
                                                                                />

                                                                            </Link>

                                                                            <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
                                                                        </div>
                                                                        <div className="room-details">
                                                                            <div className='r-detail-1'>
                                                                                <h4 className='room-title'> Room 2   <span className='room-type-badge' >Shared Room</span> </h4>
                                                                                <div className="room-specs mb-2">
                                                                                    <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
                                                                                    <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 twin bed</span>
                                                                                    <span className="spec-item">538 sq ft</span>
                                                                                </div>
                                                                                <div className="amenities mb-2">
                                                                                    <span className="amenity-item">36&quot; flat-screen TV</span>
                                                                                    <span className="amenity-item">Ceiling fans</span>
                                                                                    <span className="amenity-item">Coffee maker</span>
                                                                                    <span className="amenity-item">Robes</span>
                                                                                    <span className="amenity-item">Hair dryer</span>
                                                                                    <span className="amenity-item">Iron and ironing board</span>
                                                                                </div>

                                                                                <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>
                                                                            </div>
                                                                            <div className="room-specs mb-2 ">

                                                                                <span className='status-tag female-booked'>
                                                                                    Female Booked
                                                                                </span>

                                                                                <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>Only 2 bed left!</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <div className="booking-section  text-end">
                                                                        {showPrices && (
                                                                            <p className='room-price' >From <br />
                                                                                <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
                                                                                / night
                                                                            </p>
                                                                        )}
                                                                        <Link href='./SingleRoomBr' className="reserve-btn">Reserve</Link>

                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>



                                                    </div> */}
                                                    </>
                                                </div>
                                            </div>

                                        </Tab>
                                    )}

                                </Tabs>
                            )}
                        </Col>
                        <Col md={5}>
                            <div className='br-property-maps' style={{
                                height: "calc(100vh - 120px)",
                                width: "100%",
                                borderRadius: "12px",
                                overflow: "hidden",
                            }}>
                                <PropertyMap properties={bookingRoomsData[0]?.properties} />
                                {/* <DynamicMap
                                    locations={mapDataArr}
                                /> */}
                                {/* <Image
                                    src='/images/icons/br-proerty-map.jpg'
                                    className='img-fluid w-100'
                                    alt='property-map'
                                    width={500}
                                    height={600}
                                /> */}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal
                show={addTravels}
                onHide={removeTravel}
                animation={false}
                centered
                size="xl"
                className='custom-theme-modal-2'
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        Edit Stay Details
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <div className='booking-filter '>
                        <Row className='gap-0' >
                            <Col md={2} className='gap-1' >
                                <div className='form-group'>
                                    <label className='text-black' > Which company?</label>
                                    <Select
                                        name="aria-role-select"
                                        options={companyList}
                                        placeholder="Select company"
                                        className="react_selectbox"
                                        isSearchable={false}
                                        isDisabled={companyList.length > 1 ? false : true}
                                        value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
                                        // onChange={option => { setSearchFieldData({ ...searchFieldData, company_id: option.value }) }}
                                        onChange={option => { setSearchFieldData({ ...searchFieldData, company_id: option.value, company_name: option.label, c_uid: option.uid,city:'' }); }}
                                        styles={customStyles}
                                    />
                                </div>
                            </Col>


                            <Col md={2} className='gap-1'>
                                <div className='form-group'>
                                    <label className='text-black' > Where to?</label>
                                    <Select
                                        name="aria-role-select"
                                        options={cityList}
                                        placeholder="Select city"
                                        className="react_selectbox"
                                        isSearchable={false}
                                        // getOptionLabel={(option) => option.city}
                                        // getOptionValue={(option) => option.city}
                                        value={cityList?.find(c => c.value === searchFieldData.city) || null}
                                        onChange={(option) =>
                                            setSearchFieldData({ ...searchFieldData, city: option.value })
                                        }
                                        styles={customStyles}
                                    />

                                </div>
                            </Col>

                            <Col md={4} className='gap-2' >
                                <div className='d-flex gap-0 '>
                                    <div className='d-flex form-group flex-col w-50'>
                                        <label className='text-black' > Check-in date</label>
                                        <DatePicker
                                            selected={searchFieldData.check_in_date}
                                            onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
                                            selectsStart
                                            minDate={new Date()}
                                            startDate={new Date()}
                                            className="form-control  custom-date-picker"
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText='dd/MM/yyyy'
                                        />

                                    </div>
                                    <div className='d-flex form-group flex-col w-50'>
                                        <label className='text-black' > Checkout date</label>
                                        <DatePicker
                                            selected={searchFieldData.check_out_date ? searchFieldData.check_out_date : searchFieldData.check_in_date}
                                            onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
                                            selectsEnd
                                            startDate={searchFieldData.check_in_date}
                                            endDate={searchFieldData?.check_out_date ? searchFieldData?.check_out_date : new Date()}
                                            minDate={new Date()}
                                            className="form-control  custom-date-picker"
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText='dd/MM/yyyy'
                                        />
                                    </div>
                                </div>
                            </Col>


                            <Col md={4} className='gap-1 '>
                                <Row>
                                    <Col md={7}>
                                        <div className='form-group'>
                                            <label className='text-black'>No. of Rooms & Guests</label>
                                            <div
                                                className="react_selectbox custom-dropdown"
                                                onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                                            >
                                                <div className="selected-value">
                                                    {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`}
                                                </div>
                                                {isRoomDropdownOpen && (
                                                    <div className="room-dropdown-content">
                                                        {rooms.map((room) => (
                                                            <div key={room.id} className="room-section">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="room-header">Room {room.id}</div>
                                                                    {rooms.length > 1 && (
                                                                        <button
                                                                            className="delete-room-btn"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                deleteRoom(room.id);
                                                                            }}
                                                                        >

                                                                            <Image src='./images/icons/delete_b.svg' width={20} height={20} alt="delete" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="guest-counter">
                                                                    <label>Adults</label>
                                                                    <div className="counter-controls">
                                                                        <button
                                                                            className="counter-btn"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleAdultChange(room.id, -1);
                                                                            }}
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <span>{room.adults}</span>
                                                                        <button
                                                                            className="counter-btn"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleAdultChange(room.id, 1);
                                                                            }}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="d-flex align-items-center justify-between">
                                                            <button
                                                                className="add-room-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    addRoom();
                                                                }}
                                                            >
                                                                <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' width={24} height={24} />   Add a room
                                                            </button>
                                                            <button
                                                                className="done-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsRoomDropdownOpen(false);
                                                                    setSearchFieldData({
                                                                        ...searchFieldData,
                                                                        rooms: rooms.map(item => ({ adults: item.adults }))
                                                                    })
                                                                }}
                                                            >
                                                                Done
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md={5}>
                                        <div className='form-group h-100 align-items-center d-flex pt-1'>

                                            <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', textAlign: 'center', borderRadius: '0', color: '#fff' }} variant='' onClick={handleUpdateSearch}> Update Search </Button>

                                        </div>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>

            {/* <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        Casa Melhor Yayati Tulip 17th Floor <br></br> Room 3
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className="room-details-modal">
                        <div className="room-image-gallery mb-4">
                            <Row>
                                <Col md={12}>
                                    <div className="main-image-container position-relative">
                                        <Image
                                            src="/images/icons/slide-image.jpg"
                                            alt="Room"
                                            width={1000}
                                            height={500}
                                            className="img-fluid w-100"
                                        />
                                        <div className="image-navigation">
                                            <Button variant="" className="nav-btn prev">
                                                <Image src="/images/icons/left-a.svg" width={12} height={20} alt="Previous" />
                                            </Button>
                                            <Button variant="" className="nav-btn next">
                                                <Image src="/images/icons/right-a.svg" width={12} height={20} alt="Next" />
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className="room-info mb-4">
                            <Row>
                                <Col md={12}>
                                    <div className="room-specs d-flex align-items-center gap-3 mb-3">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={24} height={24} alt="bed" /> Sleeps 2</span> |
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={24} height={24} alt="area" /> 2 twin beds</span> |
                                        <span className="spec-item">538 sq ft</span>
                                    </div>
                                    <div className="booking-status d-flex gap-3 mb-3">
                                        <span className="status-tag female-booked">FEMALE BOOKED</span>
                                        <p className="only-left mt-2">ONLY 1 BED LEFT!</p>
                                    </div>
                                    <p className="room-description">
                                        {showFull ? fullText : shortText}
                                    </p>
                                    <Button
                                        variant="link"
                                        className="read-more-btn-full mt-3"
                                        onClick={() => setShowFull(!showFull)}
                                    >
                                        {showFull ? "Hide full description" : "Read full description"}
                                        <Image
                                            src="./images/icons/double-arrows.svg"
                                            className="img-fluid ms-2"
                                            alt="d-arrow"
                                            width={16}
                                            height={16}
                                            style={{
                                                transform: showFull ? "rotate(90deg)" : "rotate(-90deg)",
                                                transition: "0.2s",
                                            }}
                                        />
                                    </Button>
                                </Col>

                            </Row>
                        </div>

                        <hr style={{ margin: '40px 0' }} ></hr>

                        <div className="room-amenities">
                            <h5 className="section-title mb-4 mt-3">Room amenities</h5>

                            <Row className="g-4">
                                {visibleAmenities.map((item, index) => (
                                    <Col xs={6} key={index}>
                                        <div className="amenity-item d-flex align-items-center gap-2">
                                            <Image src={item.icon} width={24} height={24} alt={item.label} />
                                            <span>{item.label}</span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            <Button
                                variant="link"
                                className="read-more-btn-full mt-3"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll
                                    ? "Hide amenities"
                                    : `Show all ${amenities.length} amenities`}

                                <Image
                                    src="./images/icons/double-arrows.svg"
                                    className="img-fluid ms-2"
                                    alt='arrow'
                                    width={16}
                                    height={16}
                                    style={{
                                        transform: showAll ? "rotate(90deg)" : "rotate(-90deg)",
                                        transition: "0.2s",
                                    }}
                                />
                            </Button>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>

                    <Link href="./SingleRoomBr" variant="" className='search-btn complete-form-btn w-100 text-center' style={{ padding: '13px 25px', borderRadius: '0' }} >
                        Reserve
                    </Link>
                </Modal.Footer>

            </Modal> */}
            {/* room details */}

           <Modal 
    show={filtermShow && !!seletedRoomData && seletedRoomData.length > 0} 
    onHide={() => {
        filterClose();
        setSelectedRoomData(null); // Clear data when closing
        setCurrentIndex(0); // Reset image index
    }} 
    animation={false} 
    centered 
    className='custom-theme-modal status-height-70'
>
                
                <Modal.Header className='d-flex align-items-start justify-content-between border-bottom'>
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        {seletedRoomData?.[0]?.property_name || "Room Details"} <br /> 
                        {seletedRoomData?.[0]?.rooms?.[0]?.room_name || ""}
                    </Modal.Title>
                    <Image 
                        src='/images/icons/close-circle.svg' 
                        width={24} 
                        height={24} 
                        alt='Close' 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => {
                            filterClose();
                            setSelectedRoomData(null);
                            setCurrentIndex(0);
                        }} 
                    />
                </Modal.Header>


                <Modal.Body className='pt-4 pb-4'>
                    <div className="room-details-modal">
                        <div className="room-image-gallery mb-4">
                            <Row>
                                <Col md={12}>
                                    {seletedRoomData?.[0]?.rooms?.[0]?.room_photos?.length > 0 ? <div className="main-image-container position-relative">
                                        <Image
                                            src={seletedRoomData?.[0]?.rooms?.[0]?.room_photos[currentIndex]?.room_photo_url ? `${seletedRoomData?.[0]?.rooms?.[0]?.room_photos[currentIndex]?.room_photo_url}` : `/images/icons/No-Image.svg`}
                                            alt="Room"
                                            width={1000}
                                            height={500}
                                            className="img-fluid w-100"
                                        />
                                        <div className="image-navigation">
                                            <Button variant="" onClick={() => {
                                                setCurrentIndex((prev) =>
                                                    prev === 0 ? seletedRoomData?.[0]?.rooms?.[0]?.room_photos.length - 1 : prev - 1
                                                );
                                            }} className="nav-btn prev">
                                                <Image src="/images/icons/left-a.svg" width={12} height={20} alt="Previous" />
                                            </Button>
                                            <Button variant="" disabled={seletedRoomData?.[0]?.rooms?.[0]?.room_photos.length === 1} onClick={() => {
                                                setCurrentIndex((prev) =>
                                                    prev === seletedRoomData?.[0]?.rooms?.[0]?.room_photos.length - 1 ? 0 : prev + 1
                                                );
                                            }} className="nav-btn next">
                                                <Image src="/images/icons/right-a.svg" width={12} height={20} alt="Next" />
                                            </Button>
                                        </div>
                                    </div> : <div className="main-image-container position-relative">
                                        <Image
                                            src={seletedRoomData?.[0]?.rooms?.[0]?.cover_photo ? `${seletedRoomData?.[0]?.rooms?.[0]?.cover_photo}` : `/images/icons/No-Image.svg`}
                                            alt="Room"
                                            width={1000}
                                            height={500}
                                            className="img-fluid w-100"
                                        />
                                    </div>}
                                </Col>
                            </Row>
                        </div>

                        <div className="room-info mb-4">
                            <Row>
                                <Col md={12}>
                                    <div className="room-specs d-flex align-items-center gap-3 mb-3">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={24} height={24} alt="bed" /> Sleeps {seletedRoomData?.[0]?.rooms?.[0]?.max_guests}</span> |
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={24} height={24} alt="area" /> {seletedRoomData?.[0]?.rooms?.[0]?.beds?.length} beds</span> |
                                        <span className="spec-item">{seletedRoomData?.[0]?.rooms?.[0]?.room_size_sqft} sq ft</span>
                                    </div>
                                    <div className="booking-status d-flex gap-3 mb-3">
                                        {seletedRoomData?.[0]?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && <span className="status-tag female-booked">FEMALE BOOKED</span>}
                                        {seletedRoomData?.[0]?.rooms?.[0]?.room_type === "Twin-Sharing" && (seletedRoomData?.[0]?.rooms?.[0]?.available_beds?.length > 0 ? <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>{seletedRoomData?.[0]?.rooms?.[0]?.available_beds?.length} BED LEFT!</span> : <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>NO BED LEFT!</span>)}
                                    </div>
                                    <p className="room-description">
                                        {/* {showFull ? seletedRoomData?.[0]?.rooms?.[0]?.room_description : seletedRoomData?.[0]?.rooms?.[0]?.room_description?.split(" ")?.slice(0, 10)?.join(" ") + "..."} */}
                                        {showFull ? roomDescription : truncatedDescription}
                                    </p>
                                    {/* <Button
                                        variant="link"
                                        className="read-more-btn-full mt-3"
                                        onClick={() => setShowFull(!showFull)}
                                    >
                                        {showFull ? "Hide full description" : "Read full description"}
                                        <Image
                                            src="./images/icons/double-arrows.svg"
                                            className="img-fluid ms-2"
                                            alt="d-arrow"
                                            width={16}
                                            height={16}
                                            style={{
                                                transform: showFull ? "rotate(90deg)" : "rotate(-90deg)",
                                                transition: "0.2s",
                                            }}
                                        />
                                    </Button> */}
                                    {roomDescription && roomDescription.split(" ").length > 100 && (
                                        <Button
                                            variant="link"
                                            className="read-more-btn-full mt-3"
                                            onClick={() => setShowFull(!showFull)}
                                        >
                                            {showFull ? "Hide full description" : "Read full description"}
                                            <Image
                                                src="./images/icons/double-arrows.svg"
                                                className="img-fluid ms-2"
                                                alt="d-arrow"
                                                width={16}
                                                height={16}
                                                style={{
                                                    transform: showFull ? "rotate(90deg)" : "rotate(-90deg)",
                                                    transition: "0.2s",
                                                }}
                                            />
                                        </Button>
                                    )}
                                </Col>

                            </Row>
                        </div>

                        <hr style={{ margin: '40px 0' }} ></hr>

                        <div className="room-amenities">
                            <h5 className="section-title mb-4 mt-3">Room amenities</h5>

                            <Row className="g-4">
                                {visibleAmenities?.map((item, index) => (
                                    <Col xs={6} key={index}>
                                        <div className="amenity-item d-flex align-items-center gap-2">
                                            <Image src={item.icon} width={24} height={24} alt={item.label} />
                                            <span>{item.label}</span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                            {seletedRoomData?.[0]?.rooms?.[0]?.room_amenities?.length > 4 && (
                                <Button
                                    variant="link"
                                    className="read-more-btn-full mt-3"
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll
                                        ? "Hide amenities"
                                        : `Show all ${seletedRoomData?.[0]?.rooms?.[0]?.room_amenities?.length - visibleAmenities.length} amenities`}

                                    <Image
                                        src="./images/icons/double-arrows.svg"
                                        className="img-fluid ms-2"
                                        alt='arrow'
                                        width={16}
                                        height={16}
                                        style={{
                                            transform: showAll ? "rotate(90deg)" : "rotate(-90deg)",
                                            transition: "0.2s",
                                        }}
                                    />
                                </Button>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between'>
        <Link 
            href='#' 
            onClick={() => { 
                if(seletedRoomData && seletedRoomData.length > 0) {
                    setItemLocalStorage("reserveRoom", JSON.stringify(seletedRoomData)); 
                    setItemLocalStorage("searchParam", JSON.stringify(responseSearchData));
                }
                window.location.href = "/ReserveBooking";
            }} 
            variant="" 
            className='search-btn complete-form-btn w-100 text-center' 
            style={{ padding: '13px 25px', borderRadius: '0' }}
        >
            Reserve
        </Link>
    </Modal.Footer>
</Modal>



            <Modal show={marknoShowsModal} onHide={marknoShowClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        {/* Casa Melhor Yayati Tulip 17th Floor / Room 3 */}
                        {selectedPropertyName} / {selectedRoomName}
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={marknoShowClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <p>Room Availability</p>


                    <div className="calendar-section ">
                        <div className="custom-calendar-wrapper">
                            <DatePicker
                                selectsRange
                                // selected={selectedDate}
                                // onChange={date => setStartDate(date)}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                inline
                                showMonthYearPicker={false}
                                monthsShown={1}
                                minDate={startDate || new Date()}
                                // maxDate={new Date("2025/08/31")}
                                showDisabledMonthNavigation
                                fixedHeight
                                dateFormat="MMMM yyyy"
                                // defaultValue={new Date("2025/08/01")}
                                // excludeDates={}
                                filterDate={isDateAvailable}
                                renderCustomHeader={({
                                    date,
                                    decreaseMonth,
                                    increaseMonth,
                                    //prevMonthButtonDisabled,
                                    // nextMonthButtonDisabled
                                }) => (
                                    <div className="custom-header">
                                        <span className="month-year">
                                            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <div className="navigation-buttons">
                                            {/* <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                        <Image src="/images/icons/left-a.svg" width={12} height={20} alt="Previous" />
                      </button> */}
                                            <button onClick={increaseMonth} >
                                                <Image src="/images/icons/right-a.svg" width={12} height={20} alt="Next" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                dayClassName={date => {
                                    if (date.getDate() >= 17 && date.getDate() <= 21) {
                                        return 'highlighted-date'
                                    }
                                    return 'normal-date'
                                }}
                            />
                        </div>
                    </div>

                </Modal.Body>



                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    {/* <Button variant="" className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
            Cancel
          </Button> */}
                    <Button variant="" onClick={Detailurl} className='search-btn complete-form-btn ms-auto' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        View Details
                    </Button>
                </Modal.Footer>



            </Modal>


            {/*  */}


            <Modal show={filtermShow1} size="lg" onHide={filterClose1} animation={false} centered className='custom-theme-modal2' >
                <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        Stay details
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose1} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className="room-card px-3 py-3" style={{ background: '#fff' }}>
                        <Row>
                            <Col md={5}>
                                <div className='d-flex gap-2 align-items-center '>
                                    <Image
                                        src="/images/icons/amentiy.jpg"
                                        alt="Room"
                                        width={56}
                                        height={56}
                                        className="img-fluid"
                                        style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                    />
                                    <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
                                </div>
                            </Col>


                        </Row>

                        <hr></hr>




                        <div className='  ' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                                <Col md={8}>
                                    <div className=' room-booking-card w-100 pe-3'>

                                        <div className="room-details">

                                            <div className='d-flex align-items-center justify-between W-100  '>
                                                <div className='r2' style={{ maxWidth: '130px' }}  >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>

                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                                <div className='r2 text-center'>
                                                    <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                    2 Nights
                                                </div>


                                                <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                            </div>

                                            <div className='d-flex justify-between align-items-start'>
                                                <div className='colum-1'>
                                                </div>



                                            </div>




                                        </div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="booking-sections  ">
                                        <div className="room-specs d-flex gap-2 mb-2 justify-end">

                                            <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </div>



                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>

                    <Button variant="" className='search-btn complete-form-btn w-100' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={filterClose1}>
                        Reserve
                    </Button>
                </Modal.Footer>

            </Modal>



            {/*  */}


            <Modal show={filtermShow2} size="lg" onHide={filterClose2} animation={false} centered className='custom-theme-modal2' >
                <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        Stay details
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose2} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <div className='room-light-card px-3 py-3 mb-4' style={{ background: '#F2EEEB' }} >
                        <div className='  ' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                                <Col md={8}>
                                    <div className=' room-booking-cards no-border w-100 pe-3'>

                                        <div className="room-details">

                                            <div className='d-flex align-items-center justify-between W-100  '>
                                                <div className='r2'   >

                                                    <h4>Room 4</h4>
                                                    <p> Casa Melhor Yayati Tulip 17th Floor</p>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >2 nights</span>
                                                </div>

                                                <div className='r2 text-center'>
                                                    <Image src='./images/icons/Arrow1.svg' className='img-fluid mb-2' alt="switch" width={50} height={40} />

                                                </div>


                                                <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '' }} >

                                                    <h4>Room 4</h4>
                                                    <p> Casa Melhor Yayati Tulip 17th Floor</p>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >2 nights</span>
                                                </div>

                                            </div>

                                            <div className='d-flex justify-between align-items-start'>
                                                <div className='colum-1'>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="booking-sections  ">
                                        <div className="room-specs d-flex gap-2 mb-0 justify-end">
                                            4 nights in total
                                            {/* <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span> */}

                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="room-card border px-3 py-3 mb-4" style={{ background: '#fff' }}>
                        <Row>
                            <Col md={5}>
                                <div className='d-flex gap-2 align-items-center '>
                                    <Image
                                        src="/images/icons/amentiy.jpg"
                                        alt="Room"
                                        width={56}
                                        height={56}
                                        className="img-fluid"
                                        style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                    />
                                    <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
                                </div>
                            </Col>


                        </Row>

                        <hr></hr>




                        <div className='  ' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                                <Col md={8}>
                                    <div className=' room-booking-card w-100 pe-3'>

                                        <div className="room-details">

                                            <div className='d-flex align-items-center justify-between W-100  '>
                                                <div className='r2' style={{ maxWidth: '130px' }}  >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>

                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                                <div className='r2 text-center'>
                                                    <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                    2 Nights
                                                </div>


                                                <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                            </div>

                                            <div className='d-flex justify-between align-items-start'>
                                                <div className='colum-1'>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="booking-sections  ">
                                        <div className="room-specs d-flex gap-2 mb-2 justify-end">

                                            <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                        </div>

                                        <p className='female-preferred py-1 px-1 text-uppercase mb-0 d-table ms-auto me-0' style={{ color: '#E83E8C', background: '#E83E8C1F', borderRadius: '4px', fontSize: '12px' }} >
                                            Female PREFERRED
                                        </p>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>


                    <div className='mb-4' style={{ borderColor: '#463527' }} >
                        <Row className="align-items-center">

                            <Col md={8}>
                                <div className=' room-booking-cards no-border w-100 pe-3'>

                                    <div className="room-details">

                                        <div className='d-flex align-items-center  W-100 gap-3  '>
                                            <Image src='/images/icons/room-vertical.svg' width={24} height={98} alt='room' />
                                            <div className='romm-1'>
                                                <p className='fs-18 mb-1'>Room change on Tue, 5 Aug, 2025</p>
                                                <p className='mb-2 fw-medium' >Rooms in the same property</p>

                                                <p className='mb-0 ' >Guests change room when checking out</p>

                                            </div>
                                        </div>

                                        <div className='d-flex justify-between align-items-start'>
                                            <div className='colum-1'>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Col>

                        </Row>
                    </div>



                    <div className="room-card border px-3 py-3 mb-4" style={{ background: '#fff' }}>
                        <Row>
                            <Col md={5}>
                                <div className='d-flex gap-2 align-items-center '>
                                    <Image
                                        src="/images/icons/amentiy.jpg"
                                        alt="Room"
                                        width={56}
                                        height={56}
                                        className="img-fluid"
                                        style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                    />
                                    <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
                                </div>
                            </Col>
                        </Row>

                        <hr></hr>




                        <div className='  ' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                                <Col md={8}>
                                    <div className=' room-booking-card w-100 pe-3'>

                                        <div className="room-details">

                                            <div className='d-flex align-items-center justify-between W-100  '>
                                                <div className='r2' style={{ maxWidth: '130px' }}  >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>

                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                                <div className='r2 text-center'>
                                                    <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                    2 Nights
                                                </div>


                                                <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                            </div>

                                            <div className='d-flex justify-between align-items-start'>
                                                <div className='colum-1'>
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="booking-sections  ">
                                        <div className="room-specs d-flex gap-2 mb-2 justify-end">

                                            <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </div>

                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>

                    <Button variant="" className='search-btn complete-form-btn w-100' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={filterClose1}>
                        Reserve
                    </Button>
                </Modal.Footer>

            </Modal>


            {/* view */}

            <Modal show={filtermShow3} size="lg" onHide={filterClose3} animation={false} centered className='custom-theme-modal2' >
                <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        Stay details
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose3} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <div className='room-light-card px-3 py-3 mb-4' style={{ background: '#F2EEEB' }} >
                        <div className='  ' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                                <Col md={8}>
                                    <div className=' room-booking-cards no-border w-100 pe-3'>

                                        <div className="room-details">

                                            <div className='d-flex align-items-center justify-between W-100  '>
                                                <div className='r2'   >

                                                    <h4>Room 4</h4>
                                                    <p> Casa Melhor Yayati Tulip 17th Floor</p>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >2 nights</span>
                                                </div>

                                                <div className='r2 text-center'>
                                                    <Image src='./images/icons/Arrow1.svg' className='img-fluid mb-2' alt="switch" width={50} height={40} />

                                                </div>


                                                <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '' }} >

                                                    <h4>Room 4</h4>
                                                    <p> Casa Melhor Yayati Tulip 17th Floor</p>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >2 nights</span>
                                                </div>

                                            </div>

                                            <div className='d-flex justify-between align-items-start'>
                                                <div className='colum-1'>
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="booking-sections  ">
                                        <div className="room-specs d-flex gap-2 mb-0 justify-end">
                                            4 nights in total
                                            {/* <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span> */}

                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="room-card border px-3 py-3 mb-4" style={{ background: '#fff' }}>
                        <Row>
                            <Col md={5}>
                                <div className='d-flex gap-2 align-items-center '>
                                    <Image
                                        src="/images/icons/amentiy.jpg"
                                        alt="Room"
                                        width={56}
                                        height={56}
                                        className="img-fluid"
                                        style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                    />
                                    <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
                                </div>
                            </Col>


                        </Row>

                        <hr></hr>




                        <div className='  ' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                                <Col md={8}>
                                    <div className=' room-booking-card w-100 pe-3'>

                                        <div className="room-details">

                                            <div className='d-flex align-items-center justify-between W-100  '>
                                                <div className='r2' style={{ maxWidth: '130px' }}  >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>

                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                                <div className='r2 text-center'>
                                                    <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                    2 Nights
                                                </div>


                                                <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
                                                    <span style={{ color: '#73615F' }} >Tue, 5 Aug, 2025</span>
                                                    <h4>Room 4</h4>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
                                                </div>

                                            </div>

                                            <div className='d-flex justify-between align-items-start'>
                                                <div className='colum-1'>









                                                </div>



                                            </div>




                                        </div>


                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="booking-sections  ">
                                        <div className="room-specs d-flex gap-2 mb-2 justify-end">

                                            <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 2 king bed</span>

                                        </div>

                                        <p className='female-preferred py-1 px-1 text-uppercase mb-0 d-table ms-auto me-0' style={{ color: '#E83E8C', background: '#E83E8C1F', borderRadius: '4px', fontSize: '12px' }} >
                                            Female PREFERRED
                                        </p>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>


                    <div className='mb-4' style={{ borderColor: '#463527' }} >
                        <Row className="align-items-center">

                            <Col md={8}>
                                <div className=' room-booking-cards no-border w-100 pe-3'>

                                    <div className="room-details">

                                        <div className='d-flex align-items-center  W-100 gap-3  '>
                                            <Image src='/images/icons/room-vertical.svg' width={24} height={98} alt='room' />
                                            <div className='romm-1'>
                                                <p className='fs-18 mb-1'>Room change on Tue, 5 Aug, 2025</p>
                                                <p className='mb-2 fw-medium' >Rooms in the same property</p>

                                                <p className='mb-0 ' >Guests change room when checking out</p>

                                            </div>
                                        </div>

                                        <div className='d-flex justify-between align-items-start'>
                                            <div className='colum-1'>
                                            </div>

                                        </div>

                                    </div>


                                </div>
                            </Col>

                        </Row>
                    </div>



                    <div className="room-card border px-3 py-3 mb-4" style={{ background: '#fff' }}>
                        <Row>
                            <Col md={5}>
                                <div className='d-flex gap-2 align-items-center '>
                                    <Image
                                        src="/images/icons/amentiy.jpg"
                                        alt="Room"
                                        width={56}
                                        height={56}
                                        className="img-fluid"
                                        style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                                    />
                                    <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
                                </div>
                            </Col>


                        </Row>

                        <hr></hr>




                        <div className='  ' style={{ borderColor: '#463527' }} >
                            <Row className="align-items-center">

                                <Col md={8}>
                                    <div className=' room-booking-card w-100 pe-3'>

                                        <div className="room-details">

                                            <div className='d-flex align-items-center justify-between W-100  '>
                                                <div className='r2' style={{ maxWidth: '130px' }}  >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>

                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                                <div className='r2 text-center'>
                                                    <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
                                                    2 Nights
                                                </div>
                                                <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
                                                    <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
                                                    <h4>Room 4</h4>
                                                    <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
                                                </div>

                                            </div>

                                            <div className='d-flex justify-between align-items-start'>
                                                <div className='colum-1'>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="booking-sections  ">
                                        <div className="room-specs d-flex gap-2 mb-2 justify-end">

                                            <span className="spec-item  d-flex gap-1 "><Image src="./images/icons/person.svg" width={16} height={16} alt="area" /> 2 Sleeps  ,  <Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

                                        </div>



                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>

                    <Button variant="" className='search-btn complete-form-btn w-100' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={filterClose1}>
                        Reserve
                    </Button>
                </Modal.Footer>

            </Modal>


            {/* cart design */}

            {cartBox.length && (
                <div className="cart-overlay">
                    <Container>
                        <Row>
                            <Col md={4}>
                                <div className='total-paid'>
                                    <div className="d-flex align-items-center gap-2"> <p className='fs-18 mb-0' >Total to be paid  </p><h3 className='font-24 mb-0' style={{ color: '#BF9039' }} >₹{Math.round(calculateNights(searchFieldData.check_in_date, searchFieldData.check_out_date) * totalPrice)}</h3></div>
                                    Total for {calculateNights(searchFieldData.check_in_date, searchFieldData.check_out_date)} nights, {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`} (Inclusive of taxes, fees and property imposed charges)
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className='d-flex justify-end align-items-center select-twin-rooms w-100 h-100'>
                                    <Row className='justify-end h-100 w-100' >
                                        {bookingMultiRoomsData.length != cartBox.length && (
                                            <Col md={4} className='d-flex h-100 align-items-center' >
                                                <p className="mb-0 fs-12" style={{ fontSize: '14px' }}  >Please select one more bed/room to meet your requirement</p>
                                            </Col>
                                        )}


                                        {cartBox.map((item, index) => (
                                            <Col md={3} className='d-flex h-100 align-items-center' key={index}>
                                                <div className='room-info d-flex gap-2 align-items-center relative'>
                                                    <Image src={item.property_photo ? `${item.property_photo}` : "./images/icons/proprty.jpg"}
                                                        className='img-fluid'
                                                        width={48}
                                                        height={48}
                                                        alt='rooms' />

                                                    <span className='remove-room'>
                                                        <Image onClick={() => handleCartData(item)} src="./images/icons/minus.svg"
                                                            className='img-fluid'
                                                            width={16}
                                                            height={16}
                                                            alt='rooms' />
                                                    </span>

                                                    <div className='room-name'>
                                                        <p className="mb-0 fw-medium" style={{ fontSize: '12px', lineHeight: '16px', color: '#463527' }}>{item?.room_name}</p>
                                                        <p className="mb-0" style={{ fontSize: '12px', lineHeight: '16px' }}>{item?.property_name}</p>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}

                                        <Col md={4} className='d-flex h-100 align-items-center justify-end'>

                                            <Button onClick={handleGuests} variant='success' className='submit-btn' style={{ borderRadius: '0', background: '#2C734A', padding: '12px 24px' }} disabled={bookingMultiRoomsData.length != cartBox.length}>  Continue to Guests</Button>
                                        </Col>
                                    </Row>


                                </div>


                            </Col>
                        </Row>
                    </Container>
                </div>
            )}



            {/* smart search cart */}

            {/* {showCart2 && (
                <div className="cart-overlay">
                    <Container>
                        <Row>
                            <Col md={4}>
                                <div className='total-paid'>
                                    <div className="d-flex align-items-center gap-2"> <p className='fs-18 mb-0' >Total to be paid  </p><h3 className='font-24 mb-0' style={{ color: '#BF9039' }} >₹15,756</h3></div>
                                    Total for 4 nights, 2 rooms for 3 guests (Inclusive of taxes, fees and property imposed charges)
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className='d-flex justify-end align-items-center select-twin-rooms h-100'>
                                    <Row className='justify-end h-100' >
                                        
                                        <Col md={9} className='d-flex h-100 align-items-center gap-4 justify-end'>
                                            <div className='d-flex gap-2 relative' style={{ border: ' 1px solid #4635277A', padding: '5px' }} >
                                                <span className='remove-room'>
                                                    <Image onClick={() => setShowCart2(false)} src="./images/icons/minus.svg"
                                                        className='img-fluid'
                                                        width={16}
                                                        height={16}
                                                        alt='rooms' />
                                                </span>
                                                <div className='room-info d-flex gap-2 align-items-center relative'>
                                                    <Image src="./images/icons/proprty.jpg"
                                                        className='img-fluid'
                                                        width={48}
                                                        height={48}
                                                        alt='rooms' />



                                                    <div className='room-name'>
                                                        <p className="mb-0 fw-medium" style={{ fontSize: '12px', lineHeight: '16px', color: '#463527' }}>Room 4</p>
                                                        <p className="mb-0" style={{ fontSize: '12px', lineHeight: '16px' }}>Casa Melhor Yayati Tulip 17th Floor</p>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='d-flex gap-2 relative' style={{ border: ' 1px solid #4635277A', padding: '5px' }} >
                                                <span className='remove-room'>
                                                    <Image onClick={() => setShowCart2(false)} src="./images/icons/minus.svg"
                                                        className='img-fluid'
                                                        width={16}
                                                        height={16}
                                                        alt='rooms' />
                                                </span>
                                                <div className='room-info d-flex gap-2 align-items-center relative'>
                                                    <Image src="./images/icons/proprty.jpg"
                                                        className='img-fluid'
                                                        width={48}
                                                        height={48}
                                                        alt='rooms' />



                                                    <div className='room-name'>
                                                        <p className="mb-0 fw-medium" style={{ fontSize: '12px', lineHeight: '16px', color: '#463527' }}>Room 4</p>
                                                        <p className="mb-0" style={{ fontSize: '12px', lineHeight: '16px' }}>Casa Melhor Yayati Tulip 17th Floor</p>
                                                    </div>
                                                </div>

                                                <div className='room-info d-flex gap-2 align-items-center relative'>
                                                    <Image src="./images/icons/proprty.jpg"
                                                        className='img-fluid'
                                                        width={48}
                                                        height={48}
                                                        alt='rooms' />

                                                    

                                                    <div className='room-name'>
                                                        <p className="mb-0 fw-medium" style={{ fontSize: '12px', lineHeight: '16px', color: '#463527' }}>Room 4</p>
                                                        <p className="mb-0" style={{ fontSize: '12px', lineHeight: '16px' }}>Casa Melhor Yayati Tulip 17th Floor</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={3} className='d-flex h-100 align-items-center justify-end'>

                                            <Button onClick={Detailurl3} variant='success' className='submit-btn' style={{ borderRadius: '0', background: '#2C734A', padding: '12px 24px' }} >  Continue to Guests</Button>
                                        </Col>
                                    </Row>


                                </div>


                            </Col>
                        </Row>
                    </Container>
                </div>
            )} */}
        </>
    )
}