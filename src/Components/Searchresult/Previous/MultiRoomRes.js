// "use client"
// import React, { useEffect, useState } from 'react'
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
// import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
// import { calculateNights, formatDateMonthYear, formatRoomsAndGuests, formatStayDates, formatYMD, generateTimeOptions } from '@/utils/formatTime';
// import { companyListAPI, CreateBookingPost, PropertyListFullApi, UserListAPI } from '@/services/provider';
// import { ArrivalDetailValidation } from '@/utils/validation';
// import toast, { Toaster } from 'react-hot-toast';

// export default function MultiRoomsReserve() {
//     const multiroomsSelected = JSON.parse(getItemLocalStorage("multiroomreserve"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"))
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
//     const router = useRouter();
//     const [current, setCurrent] = useState(0);
//     const [isExclusiveBooking, setIsExclusiveBooking] = useState()

//     const [searchFieldData, setSearchFieldData] = useState(
//         {
//             company_id: 0,
//             city: "",
//             check_in_date: "",
//             check_out_date: "",
//             rooms: [],
//             // room_type_preference: "Any",
//             // budget_range: {
//             //     min: 0,
//             //     max: 0
//             // },
//             // availability: false,
//             // sort_by: "availability",
//             // gender_filter: "Male"
//         }
//     )

//     const [formData, setFormData] = useState({
//         dateArrival: "",
//         timeArrival: "",
//         modeArrival: "",
//         FlightTrainNumber: "",
//         refnumber: "",
//         essentialDetails: ""
//     });
//     const [errorMessages, setErrorMessages] = useState({});
//     const [cartItem, setCartItem] = useState([]);

//     const [showPrices, setShowPrices] = useState(false);

//     const [addTravels, addTravelsetShow] = useState(false);

//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);


//     const [addBreakdowns, addBreakdownsetShow] = useState(false);

//     const removeBreakdown = () => addBreakdownsetShow(false);
//     const addbreakdown = () => addBreakdownsetShow(true);

//     const [addReserves, addReservesetShow] = useState(false);

//     const removeReserve = () => addReservesetShow(false);

//     const [addTravels2, addTravel2setShow] = useState(false);

//     const removeTravel2 = () => addTravel2setShow(false);
//     const addTravel2 = () => addTravel2setShow(true);


//     const handleMouseDown = (e) => {
//         e.preventDefault();
//     };

//     const travelOption = [
//         {
//             value: "Company-Employee",
//             label: "Company employee",
//             icon: "../images/icons/hail.svg"
//         },
//         {
//             value: "External-Guest",
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
//     // <---------------------------------------------Fetch cart items-------------------------------------->

//     const [CaretakerList, setCaretakerList] = useState([])
//     useEffect(() => {
//         if (Array.isArray(multiroomsSelected) && multiroomsSelected.length) {
//             const setArray = multiroomsSelected.map(item => ({
//                 ...item,
//                 // travelerDetails: [{
//                 //     id: item?.room_id,
//                 //     data: null
//                 // }]
//                 booking_Bed: item?.room_type == "Private" ? null : [],
//                 travelerDetails: Array.from({ length: item?.room_type == "Private" ? 1 : item?.max_guests }).map((_, index) => ({ id: item?.room_id + index, data: null, bedIndex: null }))
//             }))
//             setCartItem(setArray)
//             const list = multiroomsSelected.map(item =>
//                 Array.from({ length: item?.room_type == "Private" ? 1 : item?.max_guests }).map((_, index) => ({}))
//             )
//             setCaretakerList(list)
//         }
//     }, [])
//     // useEffect(() => {
//     //     const list = cartItem.map(item =>
//     //         Array.from({ length: item?.room_type == "Private" ? 1 : item?.max_guests }).map((_, index) => ({}))
//     //     )
//     //     setCaretakerList(list)
//     // }, [cartItem])
//     useEffect(() => {
//         setCaretakerList(prevList => {
//             const shouldUpdate = cartItem.some((item, index) => {
//                 if (!item) return false;
//                 const guestCount = item.room_type === "Private" ? 1 : (item.max_guests || 0);
//                 return guestCount !== (prevList[index]?.length || 0);
//             });

//             if (!shouldUpdate) return prevList;

//             return cartItem.map((item, itemIndex) => {
//                 if (!item) return [];

//                 const guestCount = item.room_type === "Private" ? 1 : (item.max_guests || 0);
//                 const prevGuests = prevList[itemIndex] || [];

//                 return Array.from({ length: guestCount }).map((_, index) => {
//                     return index < prevGuests.length
//                         ? { ...prevGuests[index] }
//                         : {}; // Default structure
//                 });
//             });
//         });
//     }, [cartItem]); // You could use a more specific dependency like cartItem.map(item => item.max_guests)
//     //<----------------------------------------------xxxxxxxxxxxxxxxx-------------------------------------->
//     // const [travelerType, setTravelerType] = useState('');
//     // const CaretakerList = [
//     //     { name: "Shub Leena", email: "Shubancasamelhor@gmail.com", img: "./images/icons/manager-img.jpg", gender: "female" },
//     //     { name: "Jenny Shaikh", email: "pradeep@casamelhor.in", img: "./images/icons/manager-img.jpg", gender: "female" },
//     //     { name: "Rahman", email: "slb.residences@casamelhor.in", img: "./images/icons/manager-img.jpg", gender: "female" },
//     // ];

//     const handleSelectDropdown = async (e, cartIndex, itemIndex) => {
//         const { value } = e;
//         // setTravelerType(value);        
//         const response = await UserListAPI(value, '', '', '', '', '', '', '');
//         if (response?.data?.success) {
//             const result = response.data.response;

//             setCaretakerList(prev =>
//                 prev.map((cart, cIndex) =>
//                     cIndex === cartIndex
//                         ? cart.map((item, iIndex) =>
//                             iIndex === itemIndex ? result : item
//                         )
//                         : cart
//                 )
//             );
//             // setCaretakerList(response?.data?.response)
//         }
//     }

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         let newData = { [name]: value }
//         setFormData({
//             ...formData,
//             [name]: value
//         })
//         const { error } = ArrivalDetailValidation(newData)
//         setErrorMessages({
//             ...errorMessages,
//             ...error
//         })
//     }
//     const handleSelectChange = (value, name) => {
//         let newData = { [name]: value }
//         setFormData({
//             ...formData,
//             [name]: value
//         })
//         const { error } = ArrivalDetailValidation(newData)
//         setErrorMessages({
//             ...errorMessages,
//             ...error
//         })
//     }

//     // const timeOption = [
//     //     { value: "2pm", label: "2.00 P.M." },
//     //     { value: "3pm", label: "3.00 P.M." },
//     //     { value: "4pm", label: "4.00 P.M." },
//     // ]
//     const timeOption = generateTimeOptions(30);


//     const arrivalOption = [
//         { value: "Flight", label: "Flight" },
//         { value: "Train", label: "Train" }
//     ]

//     const [rooms, setRooms] = useState([
//         { id: 1, adults: 1 }
//     ]);
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
//         getCompanyList()
//         getProprtyList()
//         if (bacisSearchDetails) {
//             setSearchFieldData({
//                 company_id: bacisSearchDetails.company_id,
//                 city: bacisSearchDetails.city,
//                 check_in_date: bacisSearchDetails.check_in_date,
//                 check_out_date: bacisSearchDetails.check_out_date,
//                 rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
//             })
//             setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })))
//         }
//     }, []);

//     const handleUpdateSearch = () => {
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData))
//         setTimeout(() => {
//             removeItemLocalStorage("multiroomreserve")
//             router.push('/Searchresult')
//         }, 0)
//     }

//     const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

//     const handleAdultChange = (e, roomData, ind) => {
//         setCartItem(cartItem.map(room =>
//             room.room_uid === roomData?.room_uid
//                 ? {
//                     ...room,
//                     max_guests: Number(e.target.value),
//                     travelerDetails: Array.from({ length: room?.room_type == "Private" ? 1 : Number(e.target.value) }).map((_, index) => ({ id: room?.room_id + index, data: null, bedIndex: null }))
//                 }
//                 : room
//         ))
//     };

//     const handleBedBookIndex = (e, roomData, ind) => {
//         setCartItem(cartItem.map(room =>
//             room.room_uid === roomData?.room_uid
//                 ? {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map((t, i) =>
//                         i === ind
//                             ? { ...t, bedIndex: e.value }
//                             : t
//                     )
//                 }
//                 : room
//         ))
//     }

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

//     const handleCaretakerSelect = (roomData, id, caretaker) => {
//         setCartItem(cartItem.map(room =>
//             room.room_uid === roomData?.room_uid
//                 ? {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map(t =>
//                         t.id === id
//                             ? { ...t, data: caretaker }
//                             : t
//                     )
//                 }
//                 : room
//         )
//         )
//         setShowCaretakerList(null);
//     };

//     const handleCaretakerRemove = (roomData, id) => {
//         setCartItem(cartItem.map(room =>
//             room.room_uid === roomData?.room_uid
//                 ? {
//                     ...room,
//                     travelerDetails: room.travelerDetails.map(t =>
//                         t.id === id
//                             ? { ...t, data: null }
//                             : t
//                     )
//                 }
//                 : room
//         )
//         )
//     };


//     const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//     const [receivers, setReceivers] = useState([{ id: 1, email: '' }]);
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

//     const addReserve = async () => {
//         try {
//             const { error, isValid } = ArrivalDetailValidation(formData);
//             setErrorMessages(error)
//             if (isValid) {
//                 // const cartData = cartItem.map((cv) => ({
//                 //     property_uid: cv.property_uid,
//                 //     room_uid: cv.room_uid,
//                 //     check_in_date: cv.check_in_date,
//                 //     check_out_date: cv.check_out_date
//                 // }))
//                 const cartData = cartItem.flatMap((item, cartIndex) =>
//                     item.travelerDetails.map(traveler => ({
//                         property_uid: item.property_uid,
//                         room_uid: item.room_uid,
//                         bed_index: traveler.bedIndex,
//                         check_in_date: item.check_in_date,
//                         check_out_date: item.check_out_date
//                     }))
//                 );
//                 const travelers = cartItem.flatMap((item, cartIndex) =>
//                     item.travelerDetails.map(traveler => ({
//                         cart_item_index: cartIndex,
//                         traveler_id: traveler.data.uid,
//                         is_exclusive_booking: false
//                     }))
//                 );
//                 const travler_ass = travelers.map((item, i) => ({
//                     cart_item_index: i,
//                     traveler_id: item.traveler_id,
//                     is_exclusive_booking: isExclusiveBooking
//                 }))
//                 const payload = {
//                     company_id: searchFieldData.company_id,
//                     cart_items: cartData,
//                     traveler_assignments: travler_ass,
//                     arrival_details: {
//                         arrival_date: formatYMD(formData.dateArrival),
//                         arrival_time: formData.timeArrival,
//                         mode_of_arrival: formData.modeArrival,
//                         transport_number: formData.FlightTrainNumber
//                     },
//                     additional_comments: formData.essentialDetails,
//                     company_booking_reference: formData.refnumber,
//                     send_confirmation_email: isEmailEnabled,
//                     additional_email_recipients: receivers.map((cv) => cv.email)
//                 }
//                 const response = await CreateBookingPost(payload);
//                 if (response.data.success) {
//                     setBookingConfirmedData(response.data.response.bookings)
//                     addReservesetShow(true);
//                     toast.success(" Booking Created Successfully");
//                     removeItemLocalStorage("multiroomreserve")
//                     removeItemLocalStorage("searchParam")
//                     removeItemLocalStorage("basicSecrchItemObj")
//                 } else {
//                     response.data.response.validation_errors.forEach(element => {
//                         toast.error(element.error)
//                     });
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     console.log(cartItem)
//     console.log(CaretakerList)


//     return (
//         <>
//             <Header />
//             <Toaster position="top-right" />
//             <div className='searching-result-top'>
//                 <Container>
//                     <div className='search-result-header'>
//                         <h4>{searchBookingData?.company_name}  |  {searchBookingData?.city}</h4>

//                         {/* <p className='mb-0'><Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} />   {formatDateMonthYear(searchFieldData.check_in_date)} - {formatDateMonthYear(searchFieldData.check_out_date)}, {calculateNights(searchFieldData.check_in_date, searchFieldData.check_out_date)} nights  | <Image src='./images/icons/group.svg' alt='calendor' className="img-fluid" width={24} height={24} />
//                             {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`}
//                         </p> */}
//                         <p className='mb-0'><Image src='./images/icons/calendor.svg' alt='calendor' className="img-fluid" width={24} height={24} /> {formatStayDates(searchBookingData?.check_in_date, searchBookingData?.check_out_date)}    | <Image src='./images/icons/group.svg' alt='calendor' className="img-fluid" width={24} height={24} /> {formatRoomsAndGuests(bacisSearchDetails?.rooms)}</p>

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
//                             <h4 className='font-24 mb-4' > Review Your Selected BRs (2)</h4>
//                             {cartItem.map((cart, index) => (
//                                 <div key={index}>
//                                     <div className='d-flex align-items-center gap-3 mb-3'>

//                                         <Image src='./images/icons/down-vector.svg' className='img-fluid' alt='down' width={32} height={32} />
//                                         <h4 className='font-24 mb-0' > Bedroom {cart?.bedroom_index} </h4> <span style={{ color: '#463527' }} >{cart?.max_guests} Adult</span>
//                                     </div>

//                                     <div className="booking-card border bg-white  p-3 mb-4 ">
//                                         <Row>
//                                             <Col md={4}>
//                                                 <Image
//                                                     src={cart.cover_photo ? `https://alicedevapi.casamelhor.in${cart?.cover_photo}` : "/images/icons/room-1.jpg"}
//                                                     alt="Room Image"
//                                                     width={300}
//                                                     height={200}
//                                                     className="img-fluid "
//                                                 />
//                                             </Col>

//                                             <Col md={8}>
//                                                 <p className="fw-semibold fs-20 mb-2 room-title ">{calculateNights(cart.check_in_date, cart.check_out_date)} night stay in {cart?.room_name} <span className='room-type-badge' >{cart?.room_type} Rooms</span></p>
//                                                 <p className="text-muted d-flex gap-2 align-items-start small mb-3">
//                                                     <Image
//                                                         src="/images/icons/location_on.svg"
//                                                         alt="Room Image"
//                                                         width={24}
//                                                         height={24}
//                                                         className="img-fluid "
//                                                     />
//                                                     {cart.property_name}<br />
//                                                     {/* Flat No. 17, 17th Floor, near NRI apartments, Seawoods, Sector 58A,
//                                                     Navi Mumbai, Maharashtra, 400706 */}
//                                                     {cart?.property_address},
//                                                     {cart?.city}, {cart?.state}, {cart?.pin_code ? cart?.pin_code : '458118'}
//                                                 </p>
//                                             </Col>
//                                         </Row>

//                                         <Row className="mt-3 mb-3">
//                                             <Col md={3}>
//                                                 <div>
//                                                     <p className="mb-1 text-secondary small">Check-in:</p>
//                                                     <p className="fw-semibold mb-0">{formatDateMonthYear(cart?.check_in_date)}</p>
//                                                     <small>2:00 PM</small>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <div>
//                                                     <p className="mb-1 text-secondary small">Check-out:</p>
//                                                     <p className="fw-semibold mb-0">{formatDateMonthYear(cart?.check_out_date)}</p>
//                                                     <small>11:00 AM</small>
//                                                 </div>
//                                             </Col>
//                                         </Row>

//                                         <div className="border-top pt-3">
//                                             <p className="mb-1 font-18">Room details</p>
//                                             <div className="room-specs d-flex gap-3 mb-2">
//                                                 <span className="spec-item  d-flex gap-2"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps {cart?.max_guests}</span> |
//                                                 <span className="spec-item  d-flex gap-2"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> {cart?.beds?.length} {cart?.beds?.map((cv) => (<>{cv.bed_type}</>))}</span> |
//                                                 <span className="spec-item  d-flex gap-2">{cart?.room_size_sqft} sq ft</span>
//                                             </div>
//                                             <hr></hr>

//                                             <div className="traveler-section">
//                                                 <p className="mb-2 font-18">Travelers in this room</p>
//                                                 <div className=" d-flex gap-3 mb-3">
//                                                     {/* {cart?.max_guests <= 2 && (
//                                                         <>
//                                                             {Array.from({ length: 2 }).map((_, ind) => (
//                                                                 <div className='radio-select-box  d-flex gap-2' style={{ background: '#F2F2F2' }} key={ind}>
//                                                                     <label className="form-check-label  d-flex gap-2 mb-0" htmlFor={`default-radio-${cart?.bedroom_index}-${ind}`}>
//                                                                         <input type="radio" name={`select-question-type-${cart.bedroom_index}`} value={ind + 1} id={`default-radio-${cart?.bedroom_index}-${ind}`} onChange={(e) => handleAdultChange(e, cart, index)} />
//                                                                         <span className="radio-checkmark"></span>

//                                                                         {ind + 1} Adult
//                                                                     </label>
//                                                                 </div>
//                                                             ))}
//                                                         </>
//                                                     )}
//                                                     {cart?.max_guests > 2 && (<>
//                                                         {Array.from({ length: cart?.max_guests }).map((_, ind) => (
//                                                             <div className='radio-select-box  d-flex gap-2' style={{ background: '#F2F2F2' }} key={index}>
//                                                                 <label className="form-check-label  d-flex gap-2 mb-0" htmlFor={`default-radio-${cart?.bedroom_index}-${ind}`}>
//                                                                     <input type="radio" name={`select-question-type-${cart.bedroom_index}`} value={ind + 1} id={`default-radio-${cart?.bedroom_index}-${ind}`} onChange={(e) => handleAdultChange(e, cart, index)} />
//                                                                     <span className="radio-checkmark"></span>

//                                                                     {ind + 1} Adult
//                                                                 </label>
//                                                             </div>
//                                                         ))}
//                                                     </>)} */}
//                                                     {Array.from(
//                                                         { length: cart?.max_guests > 2 ? cart?.max_guests : 2 },
//                                                         (_, ind) => {
//                                                             const count = ind + 1;
//                                                             return (
//                                                                 <div
//                                                                     key={count}
//                                                                     className="radio-select-box d-flex gap-2"
//                                                                     style={{ background: "#F2F2F2" }}
//                                                                 >
//                                                                     <label className="form-check-label d-flex gap-2 mb-0" htmlFor={`default-radio-${cart?.bedroom_index}-${ind}`}>
//                                                                         <input
//                                                                             type="radio"
//                                                                             name={`select-question-type-${cart.bedroom_index}`}
//                                                                             checked={cart?.max_guests === count}
//                                                                             value={ind + 1}
//                                                                             // onChange={() => {
//                                                                             //     const updated = {
//                                                                             //         ...booking,
//                                                                             //         rooms: booking.rooms.map((room, i) =>
//                                                                             //             i === 0 ? { ...room, max_guests: count } : room
//                                                                             //         )
//                                                                             //     };
//                                                                             //     setBookingData([updated]);
//                                                                             //     setTravellers(
//                                                                             //         Array.from({ length: updated?.rooms[0]?.max_guests }, () => ({
//                                                                             //             traveller_type: null,
//                                                                             //             isGenderValidation: "",
//                                                                             //             caretaker: null,
//                                                                             //             searchText: "",
//                                                                             //             showList: false,
//                                                                             //             filteredUsers: userListData,
//                                                                             //             selectedBedIndex: null
//                                                                             //         }))
//                                                                             //     )
//                                                                             // }}
//                                                                             id={`default-radio-${cart?.bedroom_index}-${ind}`}
//                                                                             onChange={(e) => handleAdultChange(e, cart, index)}
//                                                                         />
//                                                                         <span className="radio-checkmark"></span>
//                                                                         {count} Adult{count > 1 ? "s" : ""}
//                                                                     </label>
//                                                                 </div>
//                                                             );
//                                                         }
//                                                     )}
//                                                 </div>
//                                                 <hr></hr>

//                                                 {cart?.can_book_exclusive && (
//                                                     <>
//                                                         <Row className='mb-3' >
//                                                             <Col md={5}>
//                                                                 <label className="mb-0 d-flex gap-2 align-items-center  show-my-booking"><input className="mx-2 custom-checkbox" type="checkbox" onClick={(e) => setIsExclusiveBooking(e.target.checked)} />Exclusively book this room for the traveler</label>
//                                                             </Col>
//                                                         </Row>

//                                                         <Row className='mb-2'>
//                                                             <Col md={6}>
//                                                                 <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }} >Since this is a twin bed, one will be available for booking unless you specify it for exclusive use.</p>
//                                                             </Col>
//                                                         </Row>
//                                                     </>
//                                                 )}

//                                                 <p className="mb-2 font-18">Traveler details</p>
//                                                 <p className='small' >We’ll use this information to book. Make sure the name matches what is on the traveler’s passport or ID.</p>

//                                                 {cart?.bedroom_preference_badge === "FEMALE PREFERRED" && (
//                                                     <Row className='mb-2'>
//                                                         <Col md={7}>
//                                                             <p className='mb-0' style={{ background: '#F2EAFA', padding: '12px 4px', fontSize: '12px', color: '#7F32CD', lineHeight: '16px' }} >As this room has already been booked for a female for your selected dates, only female traveler bookings are allowed</p>
//                                                         </Col>
//                                                     </Row>
//                                                 )}


//                                                 <div className='property-list-2'>
//                                                     {Array.from({ length: cart?.room_type === "Private" ? 1 : cart?.max_guests }).map((_, travelerIndex) => (
//                                                         <div className="row" key={`traveler-${travelerIndex}`}>
//                                                             <div className="col-md-4">
//                                                                 <Select
//                                                                     key={`traveller-type-${travelerIndex}`}
//                                                                     name="traveller_type"
//                                                                     options={travelOption}
//                                                                     placeholder="Choose Role"
//                                                                     className="react_selectbox"
//                                                                     isSearchable={false}
//                                                                     styles={customStyles}
//                                                                     onChange={(e) => handleSelectDropdown(e, index, travelerIndex)}
//                                                                     components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                 />
//                                                             </div>

//                                                             {cart?.room_type === "Twin-Sharing" && (
//                                                                 <div className="col-md-3">
//                                                                     <Select
//                                                                         key={`bed-select-${travelerIndex}`}
//                                                                         name="bed_index"
//                                                                         options={cart?.beds
//                                                                             ?.filter((_, bedIndex) => cart?.available_beds?.includes(bedIndex))
//                                                                             ?.map((cv, i) => ({
//                                                                                 value: i,
//                                                                                 label: cv.name,
//                                                                                 type: cv.type
//                                                                             }))}
//                                                                         placeholder="Choose bed"
//                                                                         className="react_selectbox"
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         onChange={(e) => handleBedBookIndex(e, cart, travelerIndex)}
//                                                                     />
//                                                                 </div>
//                                                             )}

//                                                             <div className="col-md-5">
//                                                                 {/* Assuming each traveler should have their own travelerDetails entry */}
//                                                                 {cart?.travelerDetails?.[travelerIndex] && !cart.travelerDetails[travelerIndex].data ? (
//                                                                     <div className="form-group" style={{ position: "relative" }}>
//                                                                         <input
//                                                                             type="text"
//                                                                             className="form-control user-icn2"
//                                                                             placeholder="Add a traveler"
//                                                                             onFocus={() => setShowCaretakerList(cart.travelerDetails[travelerIndex].id)}
//                                                                             onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//                                                                         />

//                                                                         {showCaretakerList === cart.travelerDetails[travelerIndex].id && (
//                                                                             <div
//                                                                                 style={{
//                                                                                     position: "absolute",
//                                                                                     top: "58px",
//                                                                                     left: 0,
//                                                                                     right: 0,
//                                                                                     background: "#f9f6f4",
//                                                                                     border: "1px solid #6B4F3F",
//                                                                                     borderRadius: "0px",
//                                                                                     zIndex: 10,
//                                                                                     padding: "16px",
//                                                                                     maxHeight: "300px",
//                                                                                     overflowY: "auto",
//                                                                                 }}
//                                                                             >
//                                                                                 {CaretakerList?.[index]?.[travelerIndex]?.length > 0 ? (
//                                                                                     <>
//                                                                                         {CaretakerList[index][travelerIndex].map((caretaker, idx) => (
//                                                                                             <div
//                                                                                                 className="managers-data"
//                                                                                                 key={`caretaker-${idx}`}
//                                                                                                 onMouseDown={(e) => e.preventDefault()}
//                                                                                                 onClick={() => handleCaretakerSelect(cart, cart.travelerDetails[travelerIndex].id, caretaker)}
//                                                                                                 style={{
//                                                                                                     display: "flex",
//                                                                                                     alignItems: "center",
//                                                                                                     marginBottom: "18px",
//                                                                                                     borderBottom: idx < CaretakerList[index][travelerIndex].length - 1
//                                                                                                         ? "1px solid #ececec"
//                                                                                                         : "none",
//                                                                                                     paddingBottom: "15px",
//                                                                                                     cursor: "pointer",
//                                                                                                 }}
//                                                                                             >
//                                                                                                 <Image
//                                                                                                     src={caretaker.profile_image}
//                                                                                                     alt={caretaker.name}
//                                                                                                     width={48}
//                                                                                                     height={48}
//                                                                                                     style={{
//                                                                                                         borderRadius: "0px",
//                                                                                                         objectFit: "cover",
//                                                                                                         marginRight: "16px",
//                                                                                                     }}
//                                                                                                 />
//                                                                                                 <div>
//                                                                                                     <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                         {caretaker.first_name} {caretaker.last_name}{" "}
//                                                                                                         {caretaker.you && (
//                                                                                                             <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                                                                                 (You)
//                                                                                                             </span>
//                                                                                                         )}
//                                                                                                     </div>
//                                                                                                     <div style={{ fontSize: "14px", color: "#73615F" }}>
//                                                                                                         {caretaker.email}
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         ))}

//                                                                                         <div style={{
//                                                                                             borderTop: "1px solid #ececec",
//                                                                                             paddingTop: "16px",
//                                                                                             marginTop: "8px"
//                                                                                         }}>
//                                                                                             <div style={{ textAlign: "left", padding: "0px" }}>
//                                                                                                 <div style={{
//                                                                                                     fontSize: "14px",
//                                                                                                     fontWeight: "500",
//                                                                                                     marginBottom: "4px",
//                                                                                                     color: "#463527"
//                                                                                                 }}>
//                                                                                                     {`Can't find someone?`} <br />
//                                                                                                     <Link
//                                                                                                         onClick={addTravel}
//                                                                                                         href='#'
//                                                                                                         style={{ color: '#463527' }}
//                                                                                                     >
//                                                                                                         Register a new traveler
//                                                                                                     </Link>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </>
//                                                                                 ) : (
//                                                                                     <div style={{
//                                                                                         textAlign: "center",
//                                                                                         padding: "30px 20px",
//                                                                                         color: "#73615F"
//                                                                                     }}>
//                                                                                         <div style={{
//                                                                                             marginBottom: "12px",
//                                                                                             fontSize: "18px",
//                                                                                             color: "#463527"
//                                                                                         }}>
//                                                                                             👤
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             fontSize: "16px",
//                                                                                             fontWeight: "500",
//                                                                                             marginBottom: "8px",
//                                                                                             color: "#463527"
//                                                                                         }}>
//                                                                                             No caretakers found
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             fontSize: "14px",
//                                                                                             marginBottom: "16px",
//                                                                                             lineHeight: "1.4"
//                                                                                         }}>
//                                                                                             {`Can't find the person you're looking for?`}
//                                                                                         </div>
//                                                                                         <button
//                                                                                             style={{
//                                                                                                 background: "#6B4F3F",
//                                                                                                 color: "white",
//                                                                                                 border: "none",
//                                                                                                 padding: "10px 20px",
//                                                                                                 borderRadius: "4px",
//                                                                                                 fontSize: "14px",
//                                                                                                 cursor: "pointer",
//                                                                                                 fontWeight: "500",
//                                                                                                 width: "100%"
//                                                                                             }}
//                                                                                             onMouseDown={(e) => e.preventDefault()}
//                                                                                             onClick={() => {/* Add your invite logic here */ }}
//                                                                                         >
//                                                                                             Invite to Join
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 ) : null}
//                                                             </div>

//                                                             <div className="col-md-12">
//                                                                 {/* Show selected caretaker for this specific traveler */}
//                                                                 {cart?.travelerDetails?.[travelerIndex]?.data && (
//                                                                     <div key={`selected-caretaker-${travelerIndex}`} className="selected-caretaker-container">
//                                                                         <div
//                                                                             className="manager-list-full"
//                                                                             style={{
//                                                                                 display: "flex",
//                                                                                 alignItems: "center",
//                                                                                 border: "1px solid rgb(128 99 75 / 24%)",
//                                                                                 borderRadius: "0px",
//                                                                                 padding: "12px 16px",
//                                                                                 marginTop: "15px",
//                                                                                 width: "100%",
//                                                                                 gap: "4px"
//                                                                             }}
//                                                                         >
//                                                                             <div style={{
//                                                                                 display: "flex",
//                                                                                 alignItems: "center",
//                                                                                 flexWrap: "wrap",
//                                                                                 gap: "4px",
//                                                                                 flex: 1
//                                                                             }}>
//                                                                                 <Image
//                                                                                     src={cart.travelerDetails[travelerIndex].data.profile_image}
//                                                                                     alt={cart.travelerDetails[travelerIndex].data.first_name}
//                                                                                     width={48}
//                                                                                     height={48}
//                                                                                     style={{
//                                                                                         borderRadius: "0px",
//                                                                                         objectFit: "cover",
//                                                                                         marginRight: "10px",
//                                                                                     }}
//                                                                                 />
//                                                                                 <span style={{
//                                                                                     fontWeight: 500,
//                                                                                     fontSize: "14px",
//                                                                                     color: "#463527"
//                                                                                 }}>
//                                                                                     {cart.travelerDetails[travelerIndex].data.first_name}{" "}
//                                                                                     {cart.travelerDetails[travelerIndex].data.last_name}{" "}
//                                                                                     <br />
//                                                                                     <span style={{
//                                                                                         fontWeight: 400,
//                                                                                         fontSize: "12px",
//                                                                                         color: "#73615F",
//                                                                                         lineHeight: "10px"
//                                                                                     }}>
//                                                                                         Emp. id: {cart.travelerDetails[travelerIndex].data.employee_id}
//                                                                                     </span>{" "}
//                                                                                     <br />
//                                                                                     <span style={{
//                                                                                         fontWeight: 400,
//                                                                                         fontSize: "12px",
//                                                                                         color: "#73615F",
//                                                                                         lineHeight: "10px"
//                                                                                     }}>
//                                                                                         Dept: {cart.travelerDetails[travelerIndex].data.segment}
//                                                                                     </span>

//                                                                                     {cart.travelerDetails[travelerIndex].data.you && (
//                                                                                         <span style={{
//                                                                                             fontWeight: 400,
//                                                                                             fontSize: "12px",
//                                                                                             color: "#73615F"
//                                                                                         }}>
//                                                                                             (You)
//                                                                                         </span>
//                                                                                     )}
//                                                                                 </span>

//                                                                                 <span style={{ color: "#73615F" }}>|</span>

//                                                                                 <span style={{
//                                                                                     display: "flex",
//                                                                                     alignItems: "center",
//                                                                                     color: "#463527",
//                                                                                     fontSize: "14px",
//                                                                                     gap: "5px"
//                                                                                 }}>
//                                                                                     <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                     {cart.travelerDetails[travelerIndex].data.phone_number}
//                                                                                 </span>

//                                                                                 <span style={{ color: "#73615F" }}>|</span>

//                                                                                 <span style={{
//                                                                                     display: "flex",
//                                                                                     alignItems: "center",
//                                                                                     color: "#463527",
//                                                                                     fontSize: "14px",
//                                                                                     gap: "5px"
//                                                                                 }}>
//                                                                                     <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                     {cart.travelerDetails[travelerIndex].data.email}
//                                                                                 </span>

//                                                                                 <span style={{ color: "#73615F" }}>|</span>

//                                                                                 <span style={{
//                                                                                     display: "flex",
//                                                                                     alignItems: "center",
//                                                                                     color: "#463527",
//                                                                                     fontSize: "14px",
//                                                                                     gap: "5px"
//                                                                                 }}>
//                                                                                     <Image src="./images/icons/Genders.svg" alt="email" width={18} height={18} />
//                                                                                     {cart.travelerDetails[travelerIndex].data.gender}
//                                                                                 </span>
//                                                                             </div>

//                                                                             <div className="show-edit-btn">
//                                                                                 <Button variant="" className="edit-btn ms-1 me-1">
//                                                                                     Edit details
//                                                                                 </Button>
//                                                                                 <button
//                                                                                     type="button"
//                                                                                     className="ms-auto"
//                                                                                     onClick={() => handleCaretakerRemove(cart, cart.travelerDetails[travelerIndex].id)}
//                                                                                     style={{
//                                                                                         background: "none",
//                                                                                         border: "none",
//                                                                                         color: "#6B4F3F",
//                                                                                         fontSize: "14px",
//                                                                                         cursor: "pointer",
//                                                                                         flexShrink: 0,
//                                                                                     }}
//                                                                                     title="Remove"
//                                                                                 >
//                                                                                     <Image
//                                                                                         src="./images/icons/delete_b.svg"
//                                                                                         alt="delete"
//                                                                                         width={24}
//                                                                                         height={24}
//                                                                                     />
//                                                                                 </button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <p className='d-flex gap-2 fw-medium justify-content-end' >Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='rihgt-a' width={8} height={8} /> </p>
//                                 </div>
//                             ))}


//                             {/* <div className='d-flex align-items-center gap-3 mb-3'>

//                                 <Image src='./images/icons/down-vector.svg' className='img-fluid' alt='down' width={32} height={32} />
//                                 <h4 className='font-24 mb-0' > Bedroom 2 </h4> <span style={{ color: '#463527' }} >2 Adult</span>
//                             </div>

//                             <div className="booking-card border bg-white  p-3 mb-4 ">
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
//                                         <p className="fw-semibold fs-20 mb-2 room-title ">4 night stay in Room 2 <span className='room-type-badge' >Shared Rooms</span></p>
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

//                                     <div className="traveler-section">
//                                         <p className="mb-2 font-18">Travelers in this room</p>
//                                         <div className=" d-flex gap-3 mb-3">



//                                             <div className='radio-select-box  d-flex gap-2' style={{ background: '#F2F2F2' }}  >
//                                                 <label className="form-check-label  d-flex gap-2 mb-0" htmlFor="default-radio2">
//                                                     <input type="radio" name='select-question-type' id='default-radio2' onChange={() => setSelectedType('text')} />
//                                                     <span className="radio-checkmark"></span>

//                                                     1 Adult
//                                                 </label>
//                                             </div>

//                                             <div className='radio-select-box d-flex gap-2' style={{ background: '#F2F2F2' }} >
//                                                 <label className="form-check-label  d-flex gap-2 mb-0" htmlFor="default-radio-3">
//                                                     <input type="radio" name='select-question-type' id='default-radio-3' onChange={() => setSelectedType('option')} />
//                                                     <span className="radio-checkmark"></span>

//                                                     2 Adults
//                                                 </label>
//                                             </div>

//                                         </div>

//                                         <hr></hr>

//                                         <p className="mb-2 font-18">Traveler details</p>
//                                         <p className='small' >{`We’ll use this information to book. Make sure the name matches what is on the traveler’s passport or ID.`}</p>






//                                         <div className='property-list-2'>
//                                             <div className="row ">


//                                                 <div className="col-md-4">
//                                                     <Select
//                                                         name="traveller_type"
//                                                         options={travelOption}
//                                                         placeholder="Choose Role"
//                                                         className='react_selectbox'
//                                                         isSearchable={false}
//                                                         styles={customStyles}
//                                                          onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                     />
//                                                 </div>
//                                                 <div className="col-md-5">
//                                                     {caretakers.map((caretakerItem) => (
//                                                         !caretakerItem.data && (
//                                                             <div key={caretakerItem.id} className="form-group" style={{ position: "relative" }}>
//                                                                 <input
//                                                                     type="text"
//                                                                     className="form-control user-icn2"
//                                                                     placeholder="Add a traveler"
//                                                                     onFocus={() => setShowCaretakerList(caretakerItem.id)}
//                                                                     onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//                                                                 />

//                                                                 {showCaretakerList === caretakerItem.id && (
//                                                                     <div
//                                                                         style={{
//                                                                             position: "absolute",
//                                                                             top: "58px",
//                                                                             left: 0,
//                                                                             right: 0,
//                                                                             background: "#f9f6f4",
//                                                                             border: "1px solid #6B4F3F",
//                                                                             borderRadius: "0px",
//                                                                             zIndex: 10,
//                                                                             padding: "16px",
//                                                                             maxHeight: "300px",
//                                                                             overflowY: "auto",
//                                                                         }}
//                                                                     >
//                                                                         {CaretakerList.length > 0 ? (
//                                                                             <>
//                                                                                 {CaretakerList.map((caretaker, idx) => (
//                                                                                     <div
//                                                                                         className="managers-data"
//                                                                                         key={idx}
//                                                                                         style={{
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             marginBottom: "18px",
//                                                                                             borderBottom: idx < CaretakerList.length - 1 ? "1px solid #ececec" : "none",
//                                                                                             paddingBottom: "15px",
//                                                                                             cursor: "pointer",
//                                                                                         }}
//                                                                                         onMouseDown={(e) => e.preventDefault()}
//                                                                                         onClick={() => handleCaretakerSelect(caretakerItem.id, caretaker)}
//                                                                                     >
//                                                                                         <Image
//                                                                                             src={caretaker.img}
//                                                                                             alt={caretaker.name}
//                                                                                             width={48}
//                                                                                             height={48}
//                                                                                             style={{
//                                                                                                 borderRadius: "0px",
//                                                                                                 objectFit: "cover",
//                                                                                                 marginRight: "16px",
//                                                                                             }}
//                                                                                         />
//                                                                                         <div>
//                                                                                             <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                 {caretaker.name}{" "}
//                                                                                                 {caretaker.you && (
//                                                                                                     <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                                                                         (You)
//                                                                                                     </span>
//                                                                                                 )}
//                                                                                             </div>
//                                                                                             <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 ))}


//                                                                                 <div style={{
//                                                                                     borderTop: "1px solid #ececec",
//                                                                                     paddingTop: "16px",
//                                                                                     marginTop: "8px"
//                                                                                 }}>
//                                                                                     <div style={{
//                                                                                         textAlign: "left",
//                                                                                         padding: "0px",
//                                                                                     }}>
//                                                                                         <div style={{
//                                                                                             fontSize: "14px",
//                                                                                             fontWeight: "500",
//                                                                                             marginBottom: "4px",
//                                                                                             color: "#463527"
//                                                                                         }}>
//                                                                                             {`Can't find someone?`} <br></br>

//                                                                                             <Link onClick={addTravel} href='#' style={{ color: '#463527' }} >Register a new traveler</Link>
//                                                                                         </div>

//                                                                                     </div>
//                                                                                 </div>
//                                                                             </>
//                                                                         ) : (

//                                                                             <div style={{
//                                                                                 textAlign: "center",
//                                                                                 padding: "30px 20px",
//                                                                                 color: "#73615F"
//                                                                             }}>
//                                                                                 <div style={{
//                                                                                     marginBottom: "12px",
//                                                                                     fontSize: "18px",
//                                                                                     color: "#463527"
//                                                                                 }}>
//                                                                                     👤
//                                                                                 </div>
//                                                                                 <div style={{
//                                                                                     fontSize: "16px",
//                                                                                     fontWeight: "500",
//                                                                                     marginBottom: "8px",
//                                                                                     color: "#463527"
//                                                                                 }}>
//                                                                                     No caretakers found
//                                                                                 </div>
//                                                                                 <div style={{
//                                                                                     fontSize: "14px",
//                                                                                     marginBottom: "16px",
//                                                                                     lineHeight: "1.4"
//                                                                                 }}>
//                                                                                     {`Can't find the person you're looking for?`}
//                                                                                 </div>
//                                                                                 <button
//                                                                                     style={{
//                                                                                         background: "#6B4F3F",
//                                                                                         color: "white",
//                                                                                         border: "none",
//                                                                                         padding: "10px 20px",
//                                                                                         borderRadius: "4px",
//                                                                                         fontSize: "14px",
//                                                                                         cursor: "pointer",
//                                                                                         fontWeight: "500",
//                                                                                         width: "100%"
//                                                                                     }}
//                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                     onClick={() => { }}
//                                                                                 >
//                                                                                     Invite to Join
//                                                                                 </button>
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 )}


//                                                             </div>
//                                                         )
//                                                     ))}
//                                                 </div>



//                                                 <div className="col-md-12">
//                                                     {caretakers.map((caretakerItem) => (
//                                                         caretakerItem.data && (
//                                                             <div key={caretakerItem.id} className="selected-caretaker-container">
//                                                                 <div
//                                                                     className='manager-list-full'
//                                                                     style={{
//                                                                         display: "flex",
//                                                                         alignItems: "center",
//                                                                         border: "1px solid rgb(128 99 75 / 24%)",
//                                                                         borderRadius: "0px",
//                                                                         padding: "12px 16px",                                                                        
//                                                                         marginTop: "15px",
//                                                                         width: "100%",
//                                                                         gap: '4px'
//                                                                     }}
//                                                                 >


//                                                                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
//                                                                         <Image
//                                                                             src={caretakerItem.data.img}
//                                                                             alt={caretakerItem.data.name}
//                                                                             width={48}
//                                                                             height={48}
//                                                                             style={{
//                                                                                 borderRadius: "0px",
//                                                                                 objectFit: "cover",
//                                                                                 marginRight: "10px",
//                                                                             }}
//                                                                         />
//                                                                         <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                             {caretakerItem.data.name}{" "}
//                                                                             <br></br>
//                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                                                                                 Emp. id: 00003
//                                                                             </span> <br></br>
//                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                                                                                 Dept: Sales & Market...
//                                                                             </span>

//                                                                             {caretakerItem.data.you && (
//                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F" }}>
//                                                                                     (You)
//                                                                                 </span>
//                                                                             )}
//                                                                         </span>

//                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                             {caretakerItem.data.phone || "8390734261"}
//                                                                         </span>

//                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                             {caretakerItem.data.email}
//                                                                         </span>

//                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                             <Image src="./images/icons/Genders.svg" alt="email" width={18} height={18} />
//                                                                             {caretakerItem.data.gender || "Female"}
//                                                                         </span>
//                                                                     </div>

//                                                                     <div className='show-edit-btn'>

//                                                                         <Button variant='' className='edit-btn ms-1 me-1'>Edit details</Button>

//                                                                         <button
//                                                                             type="button"
//                                                                             className='ms-auto'
//                                                                             onClick={() => handleCaretakerRemove(caretakerItem.id)}
//                                                                             style={{
//                                                                                 background: "none",
//                                                                                 border: "none",
//                                                                                 color: "#6B4F3F",
//                                                                                 fontSize: "14px",
//                                                                                 cursor: "pointer",
//                                                                                 flexShrink: 0,
//                                                                             }}
//                                                                             title="Remove"
//                                                                         >
//                                                                             <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />


//                                                                         </button>

//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         )
//                                                     ))}
//                                                 </div>
//                                             </div>

//                                             <div className="row mt-3">


//                                                 <div className="col-md-4">
//                                                     <Select
//                                                         name="traveller_type"
//                                                         options={travelOption}
//                                                         placeholder="Choose Role"
//                                                         className='react_selectbox'
//                                                         isSearchable={false}
//                                                         styles={customStyles}
//                                                          onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                                         components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                     />
//                                                 </div>
//                                                 <div className="col-md-5">
//                                                     {caretakers.map((caretakerItem) => (
//                                                         !caretakerItem.data && (
//                                                             <div key={caretakerItem.id} className="form-group" style={{ position: "relative" }}>
//                                                                 <input
//                                                                     type="text"
//                                                                     className="form-control user-icn2"
//                                                                     placeholder="Add a traveler"
//                                                                     onFocus={() => setShowCaretakerList(caretakerItem.id)}
//                                                                     onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//                                                                 />

//                                                                 {showCaretakerList === caretakerItem.id && (
//                                                                     <div
//                                                                         style={{
//                                                                             position: "absolute",
//                                                                             top: "58px",
//                                                                             left: 0,
//                                                                             right: 0,
//                                                                             background: "#f9f6f4",
//                                                                             border: "1px solid #6B4F3F",
//                                                                             borderRadius: "0px",
//                                                                             zIndex: 10,
//                                                                             padding: "16px",
//                                                                             maxHeight: "300px",
//                                                                             overflowY: "auto",
//                                                                         }}
//                                                                     >
//                                                                         {CaretakerList.length > 0 ? (
//                                                                             <>
//                                                                                 {CaretakerList.map((caretaker, idx) => (
//                                                                                     <div
//                                                                                         className="managers-data"
//                                                                                         key={idx}
//                                                                                         style={{
//                                                                                             display: "flex",
//                                                                                             alignItems: "center",
//                                                                                             marginBottom: "18px",
//                                                                                             borderBottom: idx < CaretakerList.length - 1 ? "1px solid #ececec" : "none",
//                                                                                             paddingBottom: "15px",
//                                                                                             cursor: "pointer",
//                                                                                         }}
//                                                                                         onMouseDown={(e) => e.preventDefault()}
//                                                                                         onClick={() => handleCaretakerSelect(caretakerItem.id, caretaker)}
//                                                                                     >
//                                                                                         <Image
//                                                                                             src={caretaker.img}
//                                                                                             alt={caretaker.name}
//                                                                                             width={48}
//                                                                                             height={48}
//                                                                                             style={{
//                                                                                                 borderRadius: "0px",
//                                                                                                 objectFit: "cover",
//                                                                                                 marginRight: "16px",
//                                                                                             }}
//                                                                                         />
//                                                                                         <div>
//                                                                                             <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                 {caretaker.name}{" "}
//                                                                                                 {caretaker.you && (
//                                                                                                     <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                                                                                         (You)
//                                                                                                     </span>
//                                                                                                 )}
//                                                                                             </div>
//                                                                                             <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 ))}


//                                                                                 <div style={{
//                                                                                     borderTop: "1px solid #ececec",
//                                                                                     paddingTop: "16px",
//                                                                                     marginTop: "8px"
//                                                                                 }}>
//                                                                                     <div style={{
//                                                                                         textAlign: "left",
//                                                                                         padding: "0px",
//                                                                                     }}>
//                                                                                         <div style={{
//                                                                                             fontSize: "14px",
//                                                                                             fontWeight: "500",
//                                                                                             marginBottom: "4px",
//                                                                                             color: "#463527"
//                                                                                         }}>
//                                                                                             {`Can't find someone?`} <br></br>

//                                                                                             <Link onClick={addTravel} href='#' style={{ color: '#463527' }} >Register a new traveler</Link>
//                                                                                         </div>

//                                                                                     </div>
//                                                                                 </div>
//                                                                             </>
//                                                                         ) : (

//                                                                             <div style={{
//                                                                                 textAlign: "center",
//                                                                                 padding: "30px 20px",
//                                                                                 color: "#73615F"
//                                                                             }}>
//                                                                                 <div style={{
//                                                                                     marginBottom: "12px",
//                                                                                     fontSize: "18px",
//                                                                                     color: "#463527"
//                                                                                 }}>
//                                                                                     👤
//                                                                                 </div>
//                                                                                 <div style={{
//                                                                                     fontSize: "16px",
//                                                                                     fontWeight: "500",
//                                                                                     marginBottom: "8px",
//                                                                                     color: "#463527"
//                                                                                 }}>
//                                                                                     No caretakers found
//                                                                                 </div>
//                                                                                 <div style={{
//                                                                                     fontSize: "14px",
//                                                                                     marginBottom: "16px",
//                                                                                     lineHeight: "1.4"
//                                                                                 }}>
//                                                                                     {`Can't find the person you're looking for?`}
//                                                                                 </div>
//                                                                                 <button
//                                                                                     style={{
//                                                                                         background: "#6B4F3F",
//                                                                                         color: "white",
//                                                                                         border: "none",
//                                                                                         padding: "10px 20px",
//                                                                                         borderRadius: "4px",
//                                                                                         fontSize: "14px",
//                                                                                         cursor: "pointer",
//                                                                                         fontWeight: "500",
//                                                                                         width: "100%"
//                                                                                     }}
//                                                                                     onMouseDown={(e) => e.preventDefault()}
//                                                                                     onClick={() => {}}
//                                                                                 >
//                                                                                     Invite to Join
//                                                                                 </button>
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 )}


//                                                             </div>
//                                                         )
//                                                     ))}
//                                                 </div>



//                                                 <div className="col-md-12">
//                                                     {caretakers.map((caretakerItem) => (
//                                                         caretakerItem.data && (
//                                                             <div key={caretakerItem.id} className="selected-caretaker-container">
//                                                                 <div
//                                                                     className='manager-list-full'
//                                                                     style={{
//                                                                         display: "flex",
//                                                                         alignItems: "center",
//                                                                         border: "1px solid rgb(128 99 75 / 24%)",
//                                                                         borderRadius: "0px",
//                                                                         padding: "12px 16px",

//                                                                         marginTop: "15px",
//                                                                         width: "100%",
//                                                                         gap: '4px'
//                                                                     }}
//                                                                 >


//                                                                     <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
//                                                                         <Image
//                                                                             src={caretakerItem.data.img}
//                                                                             alt={caretakerItem.data.name}
//                                                                             width={48}
//                                                                             height={48}
//                                                                             style={{
//                                                                                 borderRadius: "0px",
//                                                                                 objectFit: "cover",
//                                                                                 marginRight: "10px",
//                                                                             }}
//                                                                         />
//                                                                         <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                             {caretakerItem.data.name}{" "}
//                                                                             <br></br>
//                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                                                                                 Emp. id: 00003
//                                                                             </span> <br></br>
//                                                                             <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                                                                                 Dept: Sales & Market...
//                                                                             </span>

//                                                                             {caretakerItem.data.you && (
//                                                                                 <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F" }}>
//                                                                                     (You)
//                                                                                 </span>
//                                                                             )}
//                                                                         </span>

//                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                             <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                             {caretakerItem.data.phone || "8390734261"}
//                                                                         </span>

//                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                             <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                             {caretakerItem.data.email}
//                                                                         </span>

//                                                                         <span style={{ color: "#73615F" }}>|</span>

//                                                                         <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                             <Image src="./images/icons/Genders.svg" alt="email" width={18} height={18} />
//                                                                             {caretakerItem.data.gender || "Female"}
//                                                                         </span>
//                                                                     </div>

//                                                                     <div className='show-edit-btn'>

//                                                                         <Button variant='' className='edit-btn ms-1 me-1'>Edit details</Button>

//                                                                         <button
//                                                                             type="button"
//                                                                             className='ms-auto'
//                                                                             onClick={() => handleCaretakerRemove(caretakerItem.id)}
//                                                                             style={{
//                                                                                 background: "none",
//                                                                                 border: "none",
//                                                                                 color: "#6B4F3F",
//                                                                                 fontSize: "14px",
//                                                                                 cursor: "pointer",
//                                                                                 flexShrink: 0,
//                                                                             }}
//                                                                             title="Remove"
//                                                                         >
//                                                                             <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />


//                                                                         </button>

//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         )
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <p className='d-flex gap-2 fw-medium justify-content-end' >Change Selection <Image src='./images/icons/right-a.svg' className='img-fluid' alt='rihgt-a' width={8} height={8} /> </p> */}



//                             <div className="arrival-section border-top mt-4 pt-5 mb-5">
//                                 <h3 className="font-24 mb-2">Arrival Details (Optional)</h3>
//                                 <p className="text-secondary  mb-2">
//                                     This information helps in operational planning, legal compliance, and
//                                     personalized service.
//                                 </p>

//                                 <Form.Group className='mb-4 mt-4' controlId="arrivalTime">
//                                     <Form.Label className="mb-2 fw-semibold">
//                                         Est. Date of Arrival In Individual House
//                                     </Form.Label>

//                                     <DatePicker
//                                         selected={formData.dateArrival}
//                                         onChange={(e) => handleSelectChange(e, "dateArrival")}
//                                         selectsStart
//                                         minDate={new Date()}
//                                         startDate={new Date()}
//                                         className="form-control  custom-date-picker"
//                                         dateFormat="dd/MM/yyyy"
//                                         placeholderText='DD/MM/YYYY'
//                                     />
//                                     <span className='text-danger'>{errorMessages.dateArrival}</span>
//                                 </Form.Group>

//                                 <Form.Group className='mb-4 mt-4' controlId="arrivalTime">
//                                     <Form.Label className="mb-2 fw-semibold">
//                                         Est. Time of Arrival In Individual House
//                                     </Form.Label>

//                                     <Select
//                                         name="aria-role-select"
//                                         onChange={(e) => handleSelectChange(e.value, "timeArrival")}
//                                         options={timeOption}
//                                         placeholder="Select time"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />
//                                     <span className='text-danger'>{errorMessages.timeArrival}</span>
//                                 </Form.Group>


//                                 <Form.Group className='mb-4' controlId="arrivalTime">
//                                     <Form.Label className=" mb-2 fw-semibold">
//                                         Mode of Arrival
//                                     </Form.Label>

//                                     <Select
//                                         name="aria-role-select"
//                                         onChange={(e) => handleSelectChange(e.value, "modeArrival")}
//                                         options={arrivalOption}
//                                         placeholder="Select company"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />
//                                     <span className='text-danger'>{errorMessages.modeArrival}</span>
//                                 </Form.Group>

//                                 <div className='mb-4 form-group' controlId="arrivalTime">
//                                     <Form.Label className=" mb-2 fw-semibold">
//                                         Flight / Train Number
//                                     </Form.Label>

//                                     <input type="text" name="FlightTrainNumber" onChange={handleInputChange} placeholder='Enter number e.g. MADGAON LTT EXP #11100' className='form-control' />
//                                     <span className='text-danger'>{errorMessages.FlightTrainNumber}</span>
//                                 </div>
//                             </div>

//                             <hr></hr>

//                             <div className="arrival-section  mt-4 pt-4 ">
//                                 <h3 className="font-24 mb-2">Additional Comments</h3>
//                                 {/* <p className="text-secondary  mb-4">
//                                     This information helps validate the booking, allows us to link the reservation to the correct guest, and confirms details like room type, rate, and policies before providing services
//                                 </p> */}




//                                 <div className='mb-5 form-group' controlId="arrivalTime">
//                                     <Form.Label className=" mb-2 fw-semibold">
//                                         Reference number
//                                     </Form.Label>

//                                     <input type="text" name="refnumber" onChange={handleInputChange} placeholder='Reference number to be entered for your internal purpose (optional)' className='form-control' />
//                                 </div>




//                             </div>

//                             <hr></hr>


//                             <div className="arrival-section  mt-4 pt-3 mb-5">
//                                 <h3 className="font-24 mb-2">Other Essential Details</h3>
//                                 <p className="text-secondary  mb-4">
//                                     Share any additional details or requests for this booking.
//                                 </p>

//                                 <div className='mb-4 form-group' >
//                                     <textarea className='form-control' name="essentialDetails" onChange={handleInputChange} placeholder='Got any thoughts or questions? Add them here! (Optional)' >

//                                     </textarea>
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
//                                     <input
//                                         type="checkbox"
//                                         className="mx-2 custom-checkbox"
//                                         checked={isEmailEnabled}
//                                         onChange={(e) => setIsEmailEnabled(e.target.checked)}
//                                     />
//                                     Send copy of confirmation email
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
//                                                                     disabled={receivers.length >= 5} // Limit to 5 receivers
//                                                                 >
//                                                                     <Image
//                                                                         src='./images/icons/add_circle.svg'
//                                                                         alt='Add receiver'
//                                                                         width={32}
//                                                                         height={32}
//                                                                         style={{
//                                                                             opacity: receivers.length >= 5 ? 0.5 : 1
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
//                                         {receivers.length >= 5 && (
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
//                                                 <button className="breakdown-btn">Price breakdown</button>
//                                             </div>
//                                         </div>

//                                         <div className="summary-row detailed">
//                                             <span className="summary-label">Taxes</span>
//                                             <div className="summary-value-detailed">
//                                                 {showPrices && (
//                                                     <div className="price-amount">₹5,345.00</div>
//                                                 )}
//                                                 <button className="breakdown-btn">Price breakdown</button>
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

//                                     <button onClick={addReserve} className="confirm-btn">
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
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
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

//                 <Modal.Body className='pt-4 pb-4'>
//                     {/* <p className='text-center' >The booking have been confirmed and updated</p>
//                     <p className='d-flex gap-2 text-center justify-center' >Booking ID: 35435 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='copy' width={18} height={18} /> </p> */}
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
//                     {/* <Button variant='' className='p-2 w-100' style={{ background: '#2C734A', borderRadius: '0', color: '#fff', minHeight: '58px' }} >View Booing Details</Button>
//                     <Button variant='' onClick={removeReserve} className='text-center justify-center edit-btn w-100' style={{ minHeight: '58px' }} >Create  Another Booking</Button> */}
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
// import { calculateNights, formatDateMonthYear, formatRoomsAndGuests, formatStayDates, formatYMD, generateTimeOptions } from '@/utils/formatTime';
// import { companyListAPI, CreateBookingPost, PropertyListFullApi, UserListAPI, validateGender } from '@/services/provider';
// import { ArrivalDetailValidation } from '@/utils/validation';
// import toast, { Toaster } from 'react-hot-toast';

// export default function MultiRoomsReserve() {
//     // ─── Local storage ────────────────────────────────────────────────────────
//     // FIX 1: multiroomsSelected is an array of room objects (not nested).
//     const multiroomsSelected = JSON.parse(getItemLocalStorage("multiroomreserve"));
//     const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
//     const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));

//     const router = useRouter();
//     const [current, setCurrent] = useState(0);
//     const [isSubmitting, setIsSubmitting] = useState(false);

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

//     // ─── Cart: one entry per selected room ────────────────────────────────────
//     // FIX 2: cartItem is the working copy of multiroomsSelected enriched with
//     //   travelerDetails, genderValidation per traveller slot.
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

//     // FIX 3: Renamed to avoid collision with addReserve submit function
//     const [showReserveModal, setShowReserveModal] = useState(false);
//     const removeReserve = () => setShowReserveModal(false);

//     const [addTravels2, addTravel2setShow] = useState(false);
//     const removeTravel2 = () => addTravel2setShow(false);
//     const addTravel2 = () => addTravel2setShow(true);

//     // ─── User list for traveller dropdown ────────────────────────────────────
//     // FIX 4: caretakerList[cartIndex][travelerIndex] = array of user objects
//     //   fetched from API after role is selected.
//     const [CaretakerList, setCaretakerList] = useState([]);

//     // ─── Initialise cartItem from localStorage data ───────────────────────────
//     useEffect(() => {
//         if (Array.isArray(multiroomsSelected) && multiroomsSelected.length) {
//             const initialCart = multiroomsSelected.map(item => ({
//                 ...item,
//                 // FIX 5: Private rooms → 1 traveller slot; others → max_guests slots
//                 travelerDetails: Array.from(
//                     { length: item.room_type === "Private" ? 1 : item.adults },
//                     (_, i) => ({
//                         id: `${item.room_id}-${i}`,
//                         data: null,
//                         bedIndex: null,
//                         isGenderValidation: "" // "Success" | "Error" | ""
//                     })
//                 )
//             }));
//             setCartItem(initialCart);

//             // Initialise caretakerList with matching shape
//             setCaretakerList(
//                 initialCart.map(item =>
//                     Array.from({ length: item.travelerDetails.length }, () => [])
//                 )
//             );
//         }
//     }, []);

//     // ─── Sync caretakerList shape when travelerDetails length changes ─────────
//     useEffect(() => {
//         setCaretakerList(prev =>
//             cartItem.map((item, cartIndex) => {
//                 const needed = item.travelerDetails?.length || 0;
//                 const existing = prev[cartIndex] || [];
//                 return Array.from({ length: needed }, (_, i) =>
//                     i < existing.length ? existing[i] : []
//                 );
//             })
//         );
//     }, [cartItem.map(c => c.travelerDetails?.length).join(",")]);

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

//     // ─── Fetch user list when role is selected ────────────────────────────────
//     // FIX 6: Filter by bedroom_preference_badge just like MultiSwitchReserve
//     const handleSelectDropdown = async (e, cartIndex, travelerIndex) => {
//         const { value } = e;
//         try {
//             const response = await UserListAPI(value, '', '', '', '', '', '', '');
//             if (response?.data?.success) {
//                 let result = response.data.response;

//                 // FIX 7: Apply gender filter from bedroom_preference_badge
//                 const badge = cartItem[cartIndex]?.bedroom_preference_badge;
//                 if (badge === "FEMALE PREFERRED") {
//                     result = result.filter(u => u.gender === "Female");
//                 } else if (badge === "MALE PREFERRED") {
//                     result = result.filter(u => u.gender === "Male");
//                 }

//                 setCaretakerList(prev =>
//                     prev.map((cart, cIdx) =>
//                         cIdx === cartIndex
//                             ? cart.map((item, iIdx) =>
//                                 iIdx === travelerIndex ? result : item
//                             )
//                             : cart
//                     )
//                 );
//             }
//         } catch (err) {
//             console.error("UserListAPI error:", err);
//         }
//     };

//     // ─── Arrival form handlers ────────────────────────────────────────────────
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         const { error } = ArrivalDetailValidation({ [name]: value });
//         setErrorMessages(prev => ({ ...prev, ...error }));
//     };

//     const handleSelectChange = (value, name) => {
//         setFormData(prev => ({ ...prev, [name]: value }));
//         const { error } = ArrivalDetailValidation({ [name]: value });
//         setErrorMessages(prev => ({ ...prev, ...error }));
//     };

//     const timeOption = generateTimeOptions(30);
//     const arrivalOption = [
//         { value: "Flight", label: "Flight" },
//         { value: "Train", label: "Train" }
//     ];

//     // ─── Edit stay details ────────────────────────────────────────────────────
//     const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
//     const [companyList, setCompanyList] = useState([]);
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
//     }, []);

//     const handleUpdateSearch = () => {
//         localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
//         setTimeout(() => {
//             removeItemLocalStorage("multiroomreserve");
//             router.push('/Searchresult');
//         }, 0);
//     };

//     // FIX 8: handleAdultChange — updates the cart's adults count and rebuilds travelerDetails
//     const handleAdultChange = (e, roomData) => {
//         const newCount = Number(e.target.value);
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid === roomData.room_uid
//                     ? {
//                         ...room,
//                         adults: newCount,
//                         travelerDetails: Array.from({ length: newCount }, (_, i) => ({
//                             id: `${room.room_id}-${i}`,
//                             data: null,
//                             bedIndex: null,
//                             isGenderValidation: ""
//                         }))
//                     }
//                     : room
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
//                 room.room_uid === roomData.room_uid
//                     ? {
//                         ...room,
//                         travelerDetails: room.travelerDetails.map((t, i) =>
//                             i === travelerIndex ? { ...t, bedIndex: e.value } : t
//                         )
//                     }
//                     : room
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

//     // ─── Traveller selection ──────────────────────────────────────────────────
//     const [showCaretakerList, setShowCaretakerList] = useState(null);

//     const handleCaretakerSelect = (roomData, travelerId, caretaker) => {
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid === roomData.room_uid
//                     ? {
//                         ...room,
//                         travelerDetails: room.travelerDetails.map(t =>
//                             t.id === travelerId ? { ...t, data: caretaker, isGenderValidation: "" } : t
//                         )
//                     }
//                     : room
//             )
//         );
//         setShowCaretakerList(null);
//     };

//     const handleCaretakerRemove = (roomData, travelerId) => {
//         setCartItem(prev =>
//             prev.map(room =>
//                 room.room_uid === roomData.room_uid
//                     ? {
//                         ...room,
//                         travelerDetails: room.travelerDetails.map(t =>
//                             t.id === travelerId ? { ...t, data: null, isGenderValidation: "" } : t
//                         )
//                     }
//                     : room
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

//     // ─── Gender validation (mirrors MultiSwitchReserve) ───────────────────────
//     // FIX 9: Per-traveller gender validation called on caretaker select
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

//     // Called when user selects a caretaker — validate immediately and update state
//     const handleCaretakerSelectWithValidation = async (roomData, travelerId, caretaker, travelerIndex) => {
//         // Set the traveller data first so UI shows the card
//         handleCaretakerSelect(roomData, travelerId, caretaker);

//         // Only validate gender for non-private rooms
//         if (roomData.room_type !== "Private") {
//             const isValid = await validateTravellerGender(roomData, caretaker.uid, travelerIndex);

//             setCartItem(prev =>
//                 prev.map(room =>
//                     room.room_uid === roomData.room_uid
//                         ? {
//                             ...room,
//                             travelerDetails: room.travelerDetails.map(t =>
//                                 t.id === travelerId
//                                     ? { ...t, isGenderValidation: isValid ? "Success" : "Error" }
//                                     : t
//                             )
//                         }
//                         : room
//                 )
//             );

//             if (isValid) {
//                 toast.success(`Traveler ${travelerIndex + 1}: Gender validated successfully`);
//             } else {
//                 toast.error(`Traveler ${travelerIndex + 1}: Gender validation failed — this traveler is not allowed in this room`);
//             }
//         }
//     };

//     // FIX 10: Pre-submit gender validation for ALL non-private rooms / travellers
//     const validateAllTravellersGender = async () => {
//         let allValid = true;

//         for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
//             const room = cartItem[cartIndex];
//             if (room.room_type === "Private") continue; // Skip private rooms

//             for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
//                 const traveler = room.travelerDetails[tIdx];
//                 if (!traveler.data) {
//                     toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: No traveler selected`);
//                     allValid = false;
//                     continue;
//                 }

//                 const isValid = await validateTravellerGender(room, traveler.data.uid, tIdx);

//                 // Update UI state
//                 setCartItem(prev =>
//                     prev.map((r, cIdx) =>
//                         cIdx === cartIndex
//                             ? {
//                                 ...r,
//                                 travelerDetails: r.travelerDetails.map((t, i) =>
//                                     i === tIdx
//                                         ? { ...t, isGenderValidation: isValid ? "Success" : "Error" }
//                                         : t
//                                 )
//                             }
//                             : r
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
//     // FIX 11: Renamed to handleSubmitReserve to avoid collision with addReservesetShow
//     const handleSubmitReserve = async () => {
//         // Validate arrival form
//         const { error, isValid } = ArrivalDetailValidation(formData);
//         setErrorMessages(error);
//         if (!isValid) return;

//         // Check all travellers are selected
//         for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
//             const room = cartItem[cartIndex];
//             for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
//                 if (!room.travelerDetails[tIdx].data) {
//                     toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: Please select a traveler`);
//                     return;
//                 }
//             }
//         }

//         // FIX 12: Gender validation gate for non-private rooms
//         setIsSubmitting(true);
//         const allGenderValid = await validateAllTravellersGender();
//         if (!allGenderValid) {
//             toast.error("Booking blocked: one or more travelers failed gender validation");
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             // FIX 13: Build cart_items — one entry per room (not per traveller)
//             const cartData = cartItem.map(item => ({
//                 property_uid: item.property_uid,
//                 room_uid: item.room_uid,
//                 bed_index: item.room_type === "Private" ? null : (item.travelerDetails[0]?.bedIndex ?? null),
//                 check_in_date: item.check_in_date,
//                 check_out_date: item.check_out_date
//             }));

//             // FIX 14: traveler_assignments — one entry per traveller, cart_item_index = room index
//             const travelerAssignments = cartItem.flatMap((item, cartIndex) =>
//                 item.travelerDetails.map((traveler, tIdx) => ({
//                     cart_item_index: cartIndex,
//                     traveler_id: traveler.data.uid,
//                     is_exclusive_booking: isExclusiveBooking
//                 }))
//             );

//             const payload = {
//                 company_id: searchFieldData.company_id || bacisSearchDetails?.company_id,
//                 cart_items: cartData,
//                 traveler_assignments: travelerAssignments,
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

//             const response = await CreateBookingPost(payload);
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
//     // FIX 15: Derive real totals from cartItem
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
//                         {/* FIX 16: Use formatStayDates with correct fields */}
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
//                             {/* FIX 17: Show actual count */}
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
//                                                     alt="Room Image"
//                                                     width={300}
//                                                     height={200}
//                                                     className="img-fluid"
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

//                                                 {/* FIX 18: Adult count radio — for Private rooms show 1 & 2,
//                                                     for others show up to max_guests (min 2) */}
//                                                 <div className="d-flex gap-3 mb-3">
//                                                     {Array.from(
//                                                         { length: cart.max_guests > 2 ? cart.max_guests : 2 },
//                                                         (_, ind) => {
//                                                             const count = ind + 1;
//                                                             // FIX 19: Private rooms only ever have 1 traveller slot —
//                                                             //   disable radio options > 1 for Private
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

//                                                 {/* Exclusive booking toggle — only for non-private / shared */}
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
//                                                 <p className='small'>We'll use this information to book. Make sure the name matches what is on the traveler's passport or ID.</p>

//                                                 {/* FIX 20: Gender preference banner for both MALE and FEMALE */}
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
//                                                     {Array.from({ length: cart.room_type === "Private" ? 1 : cart.adults }).map((_, travelerIndex) => (
//                                                         <div className="row mb-3" key={`traveler-${cart.room_uid}-${travelerIndex}`}>

//                                                             {/* Role dropdown */}
//                                                             <div className="col-md-4">
//                                                                 <Select
//                                                                     name="traveller_type"
//                                                                     options={travelOption}
//                                                                     placeholder="Choose Role"
//                                                                     className="react_selectbox"
//                                                                     isSearchable={false}
//                                                                     styles={customStyles}
//                                                                     onChange={(e) => handleSelectDropdown(e, cartIndex, travelerIndex)}
//                                                                     components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                                                 />
//                                                             </div>

//                                                             {/* FIX 21: Bed selector only for Twin-Sharing */}
//                                                             {cart?.room_type === "Twin-Sharing" && (
//                                                                 <div className="col-md-3">
//                                                                     <Select
//                                                                         name="bed_index"
//                                                                         options={cart?.beds?.map((b, i) => ({
//                                                                             value: i,
//                                                                             label: b.name,
//                                                                             type: b.bed_type
//                                                                         }))}
//                                                                         placeholder="Choose bed"
//                                                                         className="react_selectbox"
//                                                                         isSearchable={false}
//                                                                         styles={customStyles}
//                                                                         value={cart.travelerDetails[travelerIndex]?.bedIndex !== null
//                                                                             ? cart?.beds?.map((b, i) => ({ value: i, label: b.name }))[cart.travelerDetails[travelerIndex]?.bedIndex]
//                                                                             : null}
//                                                                         onChange={(e) => handleBedBookIndex(e, cart, travelerIndex)}
//                                                                     />
//                                                                 </div>
//                                                             )}

//                                                             {/* Traveller input */}
//                                                             <div className={cart?.room_type === "Twin-Sharing" ? "col-md-5" : "col-md-8"}>
//                                                                 {/* FIX 22: Show input only if no traveller selected yet */}
//                                                                 {!cart.travelerDetails?.[travelerIndex]?.data && (
//                                                                     <div className="form-group" style={{ position: "relative" }}>
//                                                                         <input
//                                                                             type="text"
//                                                                             className={`form-control user-icn2${cart.travelerDetails?.[travelerIndex]?.isGenderValidation === "Error" ? " border-danger" : ""}`}
//                                                                             placeholder="Add a traveler"
//                                                                             onFocus={() => setShowCaretakerList(`${cart.room_uid}-${travelerIndex}`)}
//                                                                             onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//                                                                             readOnly
//                                                                         />

//                                                                         {/* Dropdown list */}
//                                                                         {showCaretakerList === `${cart.room_uid}-${travelerIndex}` && (
//                                                                             <div style={{
//                                                                                 position: "absolute", top: "58px", left: 0, right: 0,
//                                                                                 background: "#f9f6f4", border: "1px solid #6B4F3F",
//                                                                                 borderRadius: "0px", zIndex: 10, padding: "16px",
//                                                                                 maxHeight: "300px", overflowY: "auto",
//                                                                             }}>
//                                                                                 {CaretakerList?.[cartIndex]?.[travelerIndex]?.length > 0 ? (
//                                                                                     <>
//                                                                                         {CaretakerList[cartIndex][travelerIndex].map((caretaker, idx) => (
//                                                                                             <div
//                                                                                                 key={`c-${idx}`}
//                                                                                                 className="managers-data"
//                                                                                                 onMouseDown={(e) => e.preventDefault()}
//                                                                                                 onClick={() => handleCaretakerSelectWithValidation(
//                                                                                                     cart,
//                                                                                                     cart.travelerDetails[travelerIndex].id,
//                                                                                                     caretaker,
//                                                                                                     travelerIndex
//                                                                                                 )}
//                                                                                                 style={{
//                                                                                                     display: "flex", alignItems: "center",
//                                                                                                     marginBottom: "18px",
//                                                                                                     borderBottom: idx < CaretakerList[cartIndex][travelerIndex].length - 1 ? "1px solid #ececec" : "none",
//                                                                                                     paddingBottom: "15px", cursor: "pointer",
//                                                                                                 }}
//                                                                                             >
//                                                                                                 <Image
//                                                                                                     src={caretaker.profile_image || "/images/icons/user-placeholder.png"}
//                                                                                                     alt={caretaker.first_name}
//                                                                                                     width={48} height={48}
//                                                                                                     style={{ borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
//                                                                                                 />
//                                                                                                 <div>
//                                                                                                     <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                                         {caretaker.first_name} {caretaker.last_name}
//                                                                                                     </div>
//                                                                                                     <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         ))}
//                                                                                         <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
//                                                                                             <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
//                                                                                                 {`Can't find someone?`}<br />
//                                                                                                 <Link onClick={addTravel} href='#' style={{ color: '#463527' }}>Register a new traveler</Link>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </>
//                                                                                 ) : (
//                                                                                     <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
//                                                                                         <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
//                                                                                         <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
//                                                                                         <div style={{ fontSize: "14px", marginBottom: "16px", lineHeight: "1.4" }}>
//                                                                                             {`Can't find the person you're looking for?`}
//                                                                                         </div>
//                                                                                         <Link href="/People" style={{
//                                                                                             background: "#6B4F3F", color: "white", padding: "10px 20px",
//                                                                                             width: "100%", display: "block", textAlign: "center", textDecoration: "none"
//                                                                                         }}>Invite to Join</Link>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 )}

//                                                                 {/* Gender validation status badge (shown below input) */}
//                                                                 {cart.travelerDetails?.[travelerIndex]?.isGenderValidation === "Error" && (
//                                                                     <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
//                                                                         ✕ Gender validation failed — this traveler is not allowed in this room
//                                                                     </p>
//                                                                 )}
//                                                                 {cart.travelerDetails?.[travelerIndex]?.isGenderValidation === "Success" && !cart.travelerDetails?.[travelerIndex]?.data && (
//                                                                     <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>
//                                                                         ✓ Gender validated
//                                                                     </p>
//                                                                 )}
//                                                             </div>

//                                                             {/* Selected traveller card */}
//                                                             <div className="col-md-12">
//                                                                 {cart?.travelerDetails?.[travelerIndex]?.data && (
//                                                                     <div className="selected-caretaker-container">
//                                                                         <div className="manager-list-full" style={{
//                                                                             display: "flex", alignItems: "center",
//                                                                             border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
//                                                                             padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
//                                                                         }}>
//                                                                             <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
//                                                                                 <Image
//                                                                                     src={cart.travelerDetails[travelerIndex].data.profile_image || "/images/icons/user-placeholder.png"}
//                                                                                     alt={cart.travelerDetails[travelerIndex].data.first_name}
//                                                                                     width={48} height={48}
//                                                                                     style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
//                                                                                 />
//                                                                                 <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                                                                     {cart.travelerDetails[travelerIndex].data.first_name} {cart.travelerDetails[travelerIndex].data.last_name}
//                                                                                     <br />
//                                                                                     <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                         Emp. id: {cart.travelerDetails[travelerIndex].data.employee_id}
//                                                                                     </span>
//                                                                                     <br />
//                                                                                     <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
//                                                                                         Dept: {cart.travelerDetails[travelerIndex].data.segment}
//                                                                                     </span>
//                                                                                 </span>
//                                                                                 <span style={{ color: "#73615F" }}>|</span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                                                                                     {cart.travelerDetails[travelerIndex].data.phone_number}
//                                                                                 </span>
//                                                                                 <span style={{ color: "#73615F" }}>|</span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                                                                                     {cart.travelerDetails[travelerIndex].data.email}
//                                                                                 </span>
//                                                                                 <span style={{ color: "#73615F" }}>|</span>
//                                                                                 <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                                                                                     <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
//                                                                                     {cart.travelerDetails[travelerIndex].data.gender}
//                                                                                 </span>
//                                                                                 {/* Gender validation badge on card */}
//                                                                                 {cart.travelerDetails[travelerIndex].isGenderValidation === "Success" && (
//                                                                                     <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>
//                                                                                 )}
//                                                                                 {cart.travelerDetails[travelerIndex].isGenderValidation === "Error" && (
//                                                                                     <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>
//                                                                                 )}
//                                                                             </div>
//                                                                             <div className="show-edit-btn">
//                                                                                 <Button variant="" className="edit-btn ms-1 me-1"
//                                                                                     onClick={() => router.push(`/People?guest_uid=${cart.travelerDetails[travelerIndex].data.uid}&show=true`)}>
//                                                                                     Edit details
//                                                                                 </Button>
//                                                                                 <button type="button" className="ms-auto"
//                                                                                     onClick={() => handleCaretakerRemove(cart, cart.travelerDetails[travelerIndex].id)}
//                                                                                     style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}
//                                                                                     title="Remove">
//                                                                                     <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                                                                                 </button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     ))}
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
//                                 <p className="text-secondary mb-2">
//                                     This information helps in operational planning, legal compliance, and personalized service.
//                                 </p>

//                                 <Form.Group className='mb-4 mt-4' controlId="dateArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Date of Arrival In Individual House</Form.Label>
//                                     <DatePicker
//                                         selected={formData.dateArrival}
//                                         onChange={(e) => handleSelectChange(e, "dateArrival")}
//                                         selectsStart
//                                         minDate={new Date()}
//                                         className="form-control custom-date-picker"
//                                         dateFormat="dd/MM/yyyy"
//                                         placeholderText='DD/MM/YYYY'
//                                     />
//                                     <span className='text-danger'>{errorMessages.dateArrival}</span>
//                                 </Form.Group>

//                                 <Form.Group className='mb-4 mt-4' controlId="timeArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
//                                     <Select
//                                         onChange={(e) => handleSelectChange(e.value, "timeArrival")}
//                                         options={timeOption}
//                                         placeholder="Select time"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />
//                                     <span className='text-danger'>{errorMessages.timeArrival}</span>
//                                 </Form.Group>

//                                 <Form.Group className='mb-4' controlId="modeArrival">
//                                     <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
//                                     <Select
//                                         onChange={(e) => handleSelectChange(e.value, "modeArrival")}
//                                         options={arrivalOption}
//                                         placeholder="Select mode"
//                                         className="react_selectbox"
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                     />
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
//                                                                 <button type="button" onClick={handleAddReceiver} className="btn btn-link p-0"
//                                                                     disabled={receivers.length >= 5}>
//                                                                     <Image src='./images/icons/add_circle.svg' alt='Add' width={32} height={32}
//                                                                         style={{ opacity: receivers.length >= 5 ? 0.5 : 1 }} />
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
//                                         {receivers.length >= 5 && (
//                                             <div className="alert alert-info mt-3">Maximum 5 receivers allowed</div>
//                                         )}
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
//                                         {/* FIX 23: Real values from cartItem */}
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

//                                         {cartItem.map((item, idx) => {
//                                             const nights = calculateNights(item.check_in_date, item.check_out_date);
//                                             const roomPrice = (item.price_per_night || 0) * nights;
//                                             return (
//                                                 <div key={item.room_uid} className="summary-row detailed">
//                                                     <span className="summary-label">{item.room_name} Pricing</span>
//                                                     <div className="summary-value-detailed">
//                                                         <div className="price-desc">{item.adults} Guest x {nights} nights</div>
//                                                         {showPrices && (
//                                                             <div className="price-amount">
//                                                                 ₹{roomPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                                             </div>
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
//                                                     <div className="total-amount">
//                                                         ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                                     </div>
//                                                 )}
//                                                 <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* FIX 24: Calls handleSubmitReserve (not addReserve modal toggle) */}
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
//                                             <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', borderRadius: '0', color: '#fff' }} variant='' onClick={handleUpdateSearch}>
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

//             {/* ── Add Person Modal ── */}
//             <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} />

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
//             <Modal show={showReserveModal} onHide={removeReserve} animation={false} centered size="" className='custom-theme-modal-2 modal-460'>
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
//                     <Link href={`/BookingDetails/${bookingConfirmedData[current]?.uid}`}
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
import { calculateNights, formatDateMonthYear, formatRoomsAndGuests, formatStayDates, formatYMD, generateTimeOptions } from '@/utils/formatTime';
import { companyListAPI, CreateBookingPost, PropertyListFullApi, UserListAPI, UserRoleListAPI, validateGender } from '@/services/provider';
import { ArrivalDetailValidation } from '@/utils/validation';
import toast, { Toaster } from 'react-hot-toast';

export default function MultiRoomsReserve() {
    // ─── Local storage ────────────────────────────────────────────────────────
    // FIX 1: multiroomsSelected is an array of room objects (not nested).
    const multiroomsSelected = JSON.parse(getItemLocalStorage("multiroomreserve"));
    const searchBookingData = JSON.parse(getItemLocalStorage("searchParam"));
    const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
    const loginData = JSON.parse(getItemLocalStorage("userLogin"));
    

    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ─── Search edit modal state ──────────────────────────────────────────────
    const [searchFieldData, setSearchFieldData] = useState({
        company_id: 0,
        city: "",
        check_in_date: "",
        check_out_date: "",
        rooms: [],
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

    // ─── Cart: one entry per selected room ────────────────────────────────────
    // FIX 2: cartItem is the working copy of multiroomsSelected enriched with
    //   travelerDetails, genderValidation per traveller slot.
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

    // FIX 3: Renamed to avoid collision with addReserve submit function
    const [showReserveModal, setShowReserveModal] = useState(false);
    const removeReserve = () => setShowReserveModal(false);

    const [addTravels2, addTravel2setShow] = useState(false);
    const removeTravel2 = () => addTravel2setShow(false);
    const addTravel2 = () => addTravel2setShow(true);

    // ─── User list for traveller dropdown ────────────────────────────────────
    // FIX 4: caretakerList[cartIndex][travelerIndex] = array of user objects
    //   fetched from API after role is selected.
    const [CaretakerList, setCaretakerList] = useState([]);

    // ─── Initialise cartItem from localStorage data ───────────────────────────
    useEffect(() => {
        if (Array.isArray(multiroomsSelected) && multiroomsSelected.length) {
            const initialCart = multiroomsSelected.map(item => ({
                ...item,
                // FIX 5: Private rooms → 1 traveller slot; others → max_guests slots
                travelerDetails: Array.from(
                    { length: item.room_type === "Private" ? 1 : item.adults },
                    (_, i) => ({
                        id: `${item.room_id}-${i}`,
                        data: null,
                        bedIndex: null,
                        isGenderValidation: "" // "Success" | "Error" | ""
                    })
                )
            }));
            setCartItem(initialCart);

            // Initialise caretakerList with matching shape
            setCaretakerList(
                initialCart.map(item =>
                    Array.from({ length: item.travelerDetails.length }, () => [])
                )
            );
        }
    }, []);

    // ─── Sync caretakerList shape when travelerDetails length changes ─────────
    useEffect(() => {
        setCaretakerList(prev =>
            cartItem.map((item, cartIndex) => {
                const needed = item.travelerDetails?.length || 0;
                const existing = prev[cartIndex] || [];
                return Array.from({ length: needed }, (_, i) =>
                    i < existing.length ? existing[i] : []
                );
            })
        );
    }, [cartItem.map(c => c.travelerDetails?.length).join(",")]);

    // ─── Dropdown helpers ─────────────────────────────────────────────────────
    const travelOption = [
        { value: "Company-Employee", label: "Company employee", icon: "../images/icons/hail.svg" },
        { value: "External-Guest", label: "External", icon: "../images/icons/short_stay.svg" },
    ];

    const CustomOption = (props) => (
        <components.Option {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
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

    // ─── Fetch user list when role is selected ────────────────────────────────
    // FIX 6: Filter by bedroom_preference_badge just like MultiSwitchReserve
    const handleSelectDropdown = async (e, cartIndex, travelerIndex) => {
        const { value } = e;
        try {
            const response = await UserListAPI(value, '', '', '', '', '', '', '');
            if (response?.data?.success) {
                let result = response.data.response;

                // FIX 7: Apply gender filter from bedroom_preference_badge
                const badge = cartItem[cartIndex]?.bedroom_preference_badge;
                if (badge === "FEMALE PREFERRED") {
                    result = result.filter(u => u.gender === "Female");
                } else if (badge === "MALE PREFERRED") {
                    result = result.filter(u => u.gender === "Male");
                }

                setCaretakerList(prev =>
                    prev.map((cart, cIdx) =>
                        cIdx === cartIndex
                            ? cart.map((item, iIdx) =>
                                iIdx === travelerIndex ? result : item
                            )
                            : cart
                    )
                );
            }
        } catch (err) {
            console.error("UserListAPI error:", err);
        }
    };

    // ─── Arrival form handlers ────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const { error } = ArrivalDetailValidation({ [name]: value });
        setErrorMessages(prev => ({ ...prev, ...error }));
    };

    const handleSelectChange = (value, name) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        const { error } = ArrivalDetailValidation({ [name]: value });
        setErrorMessages(prev => ({ ...prev, ...error }));
    };

    const timeOption = generateTimeOptions(30);
    const arrivalOption = [
        { value: "Flight", label: "Flight" },
        { value: "Train", label: "Train" }
    ];

    // ─── Edit stay details ────────────────────────────────────────────────────
    const [rooms, setRooms] = useState([{ id: 1, adults: 1 }]);
    const [companyList, setCompanyList] = useState([]);
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

    //role list
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
            console.error("userListData error:", error);
        }
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
                rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
            });
            setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: idx, adults: val.adults })));
        }
    }, []);

    const handleUpdateSearch = () => {
        localStorage.setItem("basicSecrchItemObj", JSON.stringify(searchFieldData));
        setTimeout(() => {
            removeItemLocalStorage("multiroomreserve");
            router.push('/Searchresult');
        }, 0);
    };

    // FIX 8: handleAdultChange — updates the cart's adults count and rebuilds travelerDetails
    const handleAdultChange = (e, roomData) => {
        const newCount = Number(e.target.value);
        setCartItem(prev =>
            prev.map(room =>
                room.room_uid === roomData.room_uid
                    ? {
                        ...room,
                        adults: newCount,
                        travelerDetails: Array.from({ length: newCount }, (_, i) => ({
                            id: `${room.room_id}-${i}`,
                            data: null,
                            bedIndex: null,
                            isGenderValidation: ""
                        }))
                    }
                    : room
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
                room.room_uid === roomData.room_uid
                    ? {
                        ...room,
                        travelerDetails: room.travelerDetails.map((t, i) =>
                            i === travelerIndex ? { ...t, bedIndex: e.value } : t
                        )
                    }
                    : room
            )
        );
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#4635271F" : state.isFocused ? "#4635271F" : "inherit",
            color: "black",
            cursor: "pointer",
        }),
    };

    // ─── Traveller selection ──────────────────────────────────────────────────
    const [showCaretakerList, setShowCaretakerList] = useState(null);

    const handleCaretakerSelect = (roomData, travelerId, caretaker) => {
        setCartItem(prev =>
            prev.map(room =>
                room.room_uid === roomData.room_uid
                    ? {
                        ...room,
                        travelerDetails: room.travelerDetails.map(t =>
                            t.id === travelerId ? { ...t, data: caretaker, isGenderValidation: "" } : t
                        )
                    }
                    : room
            )
        );
        setShowCaretakerList(null);
    };

    const handleCaretakerRemove = (roomData, travelerId) => {
        setCartItem(prev =>
            prev.map(room =>
                room.room_uid === roomData.room_uid
                    ? {
                        ...room,
                        travelerDetails: room.travelerDetails.map(t =>
                            t.id === travelerId ? { ...t, data: null, isGenderValidation: "" } : t
                        )
                    }
                    : room
            )
        );
    };

    // ─── Email recipients ─────────────────────────────────────────────────────
    const [isEmailEnabled, setIsEmailEnabled] = useState(false);
    const [receivers, setReceivers] = useState([{ id: 1, email: '' }]);

    const handleAddReceiver = () => setReceivers([...receivers, { id: Date.now(), email: '' }]);
    const handleRemoveReceiver = (id) => { if (receivers.length > 1) setReceivers(receivers.filter(r => r.id !== id)); };
    const handleEmailChange = (id, email) => setReceivers(receivers.map(r => r.id === id ? { ...r, email } : r));
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // ─── Gender validation (mirrors MultiSwitchReserve) ───────────────────────
    // FIX 9: Per-traveller gender validation called on caretaker select
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

    // Called when user selects a caretaker — validate immediately and update state
    const handleCaretakerSelectWithValidation = async (roomData, travelerId, caretaker, travelerIndex) => {
        // Set the traveller data first so UI shows the card
        handleCaretakerSelect(roomData, travelerId, caretaker);

        // Only validate gender for non-private rooms
        if (roomData.room_type !== "Private") {
            const isValid = await validateTravellerGender(roomData, caretaker.uid, travelerIndex);

            setCartItem(prev =>
                prev.map(room =>
                    room.room_uid === roomData.room_uid
                        ? {
                            ...room,
                            travelerDetails: room.travelerDetails.map(t =>
                                t.id === travelerId
                                    ? { ...t, isGenderValidation: isValid ? "Success" : "Error" }
                                    : t
                            )
                        }
                        : room
                )
            );

            if (isValid) {
                toast.success(`Traveler ${travelerIndex + 1}: Gender validated successfully`);
            } else {
                toast.error(`Traveler ${travelerIndex + 1}: Gender validation failed — this traveler is not allowed in this room`);
            }
        }
    };

    // FIX 10: Pre-submit gender validation for ALL non-private rooms / travellers
    const validateAllTravellersGender = async () => {
        let allValid = true;

        for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
            const room = cartItem[cartIndex];
            if (room.room_type === "Private") continue; // Skip private rooms

            for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
                const traveler = room.travelerDetails[tIdx];
                if (!traveler.data) {
                    toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: No traveler selected`);
                    allValid = false;
                    continue;
                }

                const isValid = await validateTravellerGender(room, traveler.data.uid, tIdx);

                // Update UI state
                setCartItem(prev =>
                    prev.map((r, cIdx) =>
                        cIdx === cartIndex
                            ? {
                                ...r,
                                travelerDetails: r.travelerDetails.map((t, i) =>
                                    i === tIdx
                                        ? { ...t, isGenderValidation: isValid ? "Success" : "Error" }
                                        : t
                                )
                            }
                            : r
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
    // FIX 11: Renamed to handleSubmitReserve to avoid collision with addReservesetShow
    const handleSubmitReserve = async () => {
        // Validate arrival form
        const { error, isValid } = ArrivalDetailValidation(formData);
        setErrorMessages(error);
        if (!isValid) return;

        // Check all travellers are selected
        for (let cartIndex = 0; cartIndex < cartItem.length; cartIndex++) {
            const room = cartItem[cartIndex];
            for (let tIdx = 0; tIdx < room.travelerDetails.length; tIdx++) {
                if (!room.travelerDetails[tIdx].data) {
                    toast.error(`Bedroom ${room.bedroom_index}, Traveler ${tIdx + 1}: Please select a traveler`);
                    return;
                }
            }
        }

        // FIX 12: Gender validation gate for non-private rooms
        setIsSubmitting(true);
        const allGenderValid = await validateAllTravellersGender();
        if (!allGenderValid) {
            toast.error("Booking blocked: one or more travelers failed gender validation");
            setIsSubmitting(false);
            return;
        }

        try {
            // FIX 13: Build cart_items — one entry per room (not per traveller)
            const cartData = cartItem.map(item => ({
                property_uid: item.property_uid,
                room_uid: item.room_uid,
                bed_index: item.room_type === "Private" ? null : (item.travelerDetails[0]?.bedIndex ?? null),
                check_in_date: item.check_in_date,
                check_out_date: item.check_out_date
            }));

            // FIX 14: traveler_assignments — one entry per traveller, cart_item_index = room index
            const travelerAssignments = cartItem.flatMap((item, cartIndex) =>
                item.travelerDetails.map((traveler, tIdx) => ({
                    cart_item_index: cartIndex,
                    traveler_id: traveler.data.uid,
                    is_exclusive_booking: isExclusiveBooking
                }))
            );

            const payload = {
                company_id: searchFieldData.company_id || bacisSearchDetails?.company_id,
                cart_items: cartData,
                traveler_assignments: travelerAssignments,
                arrival_details: {
                    arrival_date: formatYMD(formData.dateArrival),
                    arrival_time: formData.timeArrival,
                    mode_of_arrival: formData.modeArrival,
                    transport_number: formData.FlightTrainNumber
                },
                additional_comments: formData.essentialDetails,
                company_booking_reference: formData.refnumber,
                send_confirmation_email: isEmailEnabled,
                additional_email_recipients: receivers.map(r => r.email)
            };

            const response = await CreateBookingPost(payload);
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
    // FIX 15: Derive real totals from cartItem
    const totalNights = cartItem.length > 0
        ? calculateNights(cartItem[0]?.check_in_date, cartItem[0]?.check_out_date)
        : 0;
    const totalPrice = cartItem.reduce((sum, item) =>
        sum + (item.price_per_night || 0) * calculateNights(item.check_in_date, item.check_out_date), 0
    );
    const totalTravelers = cartItem.reduce((sum, item) =>
        sum + (item.travelerDetails?.length || 0), 0
    );

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            <Header />
            <Toaster position="top-right" />

            <div className='searching-result-top'>
                <Container>
                    <div className='search-result-header'>
                        <h4>{searchBookingData?.company_name} | {searchBookingData?.city}</h4>
                        {/* FIX 16: Use formatStayDates with correct fields */}
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
                            {/* FIX 17: Show actual count */}
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
                                                    src={cart.cover_photo ? `${cart.cover_photo}` : "/images/icons/room-1.jpg"}
                                                    alt="Room Image"
                                                    width={300}
                                                    height={200}
                                                    className="img-fluid"
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

                                                {/* FIX 18: Adult count radio — for Private rooms show 1 & 2,
                                                    for others show up to max_guests (min 2) */}
                                                <div className="d-flex gap-3 mb-3">
                                                    {Array.from(
                                                        { length: cart.max_guests > 2 ? cart.max_guests : 2 },
                                                        (_, ind) => {
                                                            const count = ind + 1;
                                                            // FIX 19: Private rooms only ever have 1 traveller slot —
                                                            //   disable radio options > 1 for Private
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

                                                {/* Exclusive booking toggle — only for non-private / shared */}
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

                                                {/* FIX 20: Gender preference banner for both MALE and FEMALE */}
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

                                                {/* Traveller rows */}
                                                <div className='property-list-2'>
                                                    {Array.from({ length: cart.room_type === "Private" ? 1 : cart.adults }).map((_, travelerIndex) => (
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

                                                            {/* FIX 21: Bed selector only for Twin-Sharing */}
                                                            {cart?.room_type === "Twin-Sharing" && (
                                                                <div className="col-md-3">
                                                                    <Select
                                                                        name="bed_index"
                                                                        options={cart?.beds
                                                                            ?.map((b, i) => ({ value: i, label: b.name, type: b.bed_type }))
                                                                            .filter(opt => {
                                                                                // 1. Remove beds the API says are already occupied (not in available_beds)
                                                                                if (Array.isArray(cart?.available_beds) && !cart.available_beds.includes(opt.value)) {
                                                                                    return false;
                                                                                }
                                                                                // 2. Remove beds already picked by OTHER travellers in this same room
                                                                                const pickedByOther = cart.travelerDetails.some(
                                                                                    (t, i) => i !== travelerIndex && t.bedIndex === opt.value
                                                                                );
                                                                                return !pickedByOther;
                                                                            })}
                                                                        placeholder="Choose bed"
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                        value={cart.travelerDetails[travelerIndex]?.bedIndex !== null
                                                                            ? cart?.beds?.map((b, i) => ({ value: i, label: b.name }))[cart.travelerDetails[travelerIndex]?.bedIndex] ?? null
                                                                            : null}
                                                                        onChange={(e) => handleBedBookIndex(e, cart, travelerIndex)}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Traveller input */}
                                                            <div className={cart?.room_type === "Twin-Sharing" ? "col-md-5" : "col-md-8"}>
                                                                {/* FIX 22: Show input only if no traveller selected yet */}
                                                                {!cart.travelerDetails?.[travelerIndex]?.data && (
                                                                    <div className="form-group" style={{ position: "relative" }}>
                                                                        <input
                                                                            type="text"
                                                                            className={`form-control user-icn2${cart.travelerDetails?.[travelerIndex]?.isGenderValidation === "Error" ? " border-danger" : ""}`}
                                                                            placeholder="Add a traveler"
                                                                            onFocus={() => setShowCaretakerList(`${cart.room_uid}-${travelerIndex}`)}
                                                                            onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
                                                                            readOnly
                                                                        />

                                                                        {/* Dropdown list */}
                                                                        {showCaretakerList === `${cart.room_uid}-${travelerIndex}` && (
                                                                            <div style={{
                                                                                position: "absolute", top: "58px", left: 0, right: 0,
                                                                                background: "#f9f6f4", border: "1px solid #6B4F3F",
                                                                                borderRadius: "0px", zIndex: 10, padding: "16px",
                                                                                maxHeight: "300px", overflowY: "auto",
                                                                            }}>
                                                                                {CaretakerList?.[cartIndex]?.[travelerIndex]?.length > 0 ? (
                                                                                    <>
                                                                                        {CaretakerList[cartIndex][travelerIndex].map((caretaker, idx) => (
                                                                                            <div
                                                                                                key={`c-${idx}`}
                                                                                                className="managers-data"
                                                                                                onMouseDown={(e) => e.preventDefault()}
                                                                                                onClick={() => handleCaretakerSelectWithValidation(
                                                                                                    cart,
                                                                                                    cart.travelerDetails[travelerIndex].id,
                                                                                                    caretaker,
                                                                                                    travelerIndex
                                                                                                )}
                                                                                                style={{
                                                                                                    display: "flex", alignItems: "center",
                                                                                                    marginBottom: "18px",
                                                                                                    borderBottom: idx < CaretakerList[cartIndex][travelerIndex].length - 1 ? "1px solid #ececec" : "none",
                                                                                                    paddingBottom: "15px", cursor: "pointer",
                                                                                                }}
                                                                                            >
                                                                                                <Image
                                                                                                    src={caretaker.profile_image ? caretaker.profile_image : caretaker?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                                                                                                    alt={caretaker.first_name}
                                                                                                    width={48} height={48}
                                                                                                    style={{ borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
                                                                                                />
                                                                                                <div>
                                                                                                    <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                                                        {caretaker.first_name} {caretaker.last_name}
                                                                                                    </div>
                                                                                                    <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                        <div style={{ borderTop: "1px solid #ececec", paddingTop: "16px", marginTop: "8px" }}>
                                                                                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#463527" }}>
                                                                                                {`Can't find someone?`}<br />
                                                                                                <Link onClick={addTravel} href='#' style={{ color: '#463527' }}>Register a new traveler</Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                ) : (
                                                                                    <div style={{ textAlign: "center", padding: "30px 20px", color: "#73615F" }}>
                                                                                        <div style={{ fontSize: "18px", marginBottom: "12px" }}>👤</div>
                                                                                        <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px", color: "#463527" }}>No travelers found</div>
                                                                                        <div style={{ fontSize: "14px", marginBottom: "16px", lineHeight: "1.4" }}>
                                                                                            {`Can't find the person you're looking for?`}
                                                                                        </div>
                                                                                        <Link href="/People" style={{
                                                                                            background: "#6B4F3F", color: "white", padding: "10px 20px",
                                                                                            width: "100%", display: "block", textAlign: "center", textDecoration: "none"
                                                                                        }}>Invite to Join</Link>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Gender validation status badge (shown below input) */}
                                                                {cart.travelerDetails?.[travelerIndex]?.isGenderValidation === "Error" && (
                                                                    <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#dc3545" }}>
                                                                        ✕ Gender validation failed — this traveler is not allowed in this room
                                                                    </p>
                                                                )}
                                                                {cart.travelerDetails?.[travelerIndex]?.isGenderValidation === "Success" && !cart.travelerDetails?.[travelerIndex]?.data && (
                                                                    <p className="mb-0 mt-1" style={{ fontSize: "12px", color: "#2C734A" }}>
                                                                        ✓ Gender validated
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Selected traveller card */}
                                                            <div className="col-md-12">
                                                                {cart?.travelerDetails?.[travelerIndex]?.data && (
                                                                    <div className="selected-caretaker-container">
                                                                        <div className="manager-list-full" style={{
                                                                            display: "flex", alignItems: "center",
                                                                            border: "1px solid rgb(128 99 75 / 24%)", borderRadius: "0px",
                                                                            padding: "12px 16px", marginTop: "15px", width: "100%", gap: "4px"
                                                                        }}>
                                                                            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", flex: 1 }}>
                                                                                <Image
                                                                                    // src={cart.travelerDetails[travelerIndex].data.profile_image || "/images/icons/user-placeholder.png"}
                                                                                    src={cart.travelerDetails[travelerIndex].data.profile_image ? cart.travelerDetails[travelerIndex].data.profile_image : cart.travelerDetails[travelerIndex].data?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                                                                                    alt={cart.travelerDetails[travelerIndex].data.first_name}
                                                                                    width={48} height={48}
                                                                                    style={{ borderRadius: "0px", objectFit: "cover", marginRight: "10px" }}
                                                                                />
                                                                                <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                                                                    {cart.travelerDetails[travelerIndex].data.first_name} {cart.travelerDetails[travelerIndex].data.last_name}
                                                                                    <br />
                                                                                    <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
                                                                                        Emp. id: {cart.travelerDetails[travelerIndex].data.employee_id}
                                                                                    </span>
                                                                                    <br />
                                                                                    <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: "10px" }}>
                                                                                        Dept: {cart.travelerDetails[travelerIndex].data.segment}
                                                                                    </span>
                                                                                </span>
                                                                                <span style={{ color: "#73615F" }}>|</span>
                                                                                <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                    <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
                                                                                    {cart.travelerDetails[travelerIndex].data.phone_number}
                                                                                </span>
                                                                                <span style={{ color: "#73615F" }}>|</span>
                                                                                <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                    <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
                                                                                    {cart.travelerDetails[travelerIndex].data.email}
                                                                                </span>
                                                                                <span style={{ color: "#73615F" }}>|</span>
                                                                                <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
                                                                                    <Image src="./images/icons/Genders.svg" alt="gender" width={18} height={18} />
                                                                                    {cart.travelerDetails[travelerIndex].data.gender}
                                                                                </span>
                                                                                {/* Gender validation badge on card */}
                                                                                {cart.travelerDetails[travelerIndex].isGenderValidation === "Success" && (
                                                                                    <span style={{ fontSize: "12px", color: "#2C734A", marginLeft: "8px" }}>✓ Validated</span>
                                                                                )}
                                                                                {cart.travelerDetails[travelerIndex].isGenderValidation === "Error" && (
                                                                                    <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px" }}>✕ Validation failed</span>
                                                                                )}
                                                                            </div>
                                                                            <div className="show-edit-btn">
                                                                                <Button variant="" className="edit-btn ms-1 me-1"
                                                                                    onClick={() => router.push(`/People?guest_uid=${cart.travelerDetails[travelerIndex].data.uid}&show=true`)}>
                                                                                    Edit details
                                                                                </Button>
                                                                                <button type="button" className="ms-auto"
                                                                                    onClick={() => handleCaretakerRemove(cart, cart.travelerDetails[travelerIndex].id)}
                                                                                    style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "14px", cursor: "pointer", flexShrink: 0 }}
                                                                                    title="Remove">
                                                                                    <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
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
                                <p className="text-secondary mb-2">
                                    This information helps in operational planning, legal compliance, and personalized service.
                                </p>

                                <Form.Group className='mb-4 mt-4' controlId="dateArrival">
                                    <Form.Label className="mb-2 fw-semibold">Est. Date of Arrival In Individual House</Form.Label>
                                    <DatePicker
                                        selected={formData.dateArrival}
                                        onChange={(e) => handleSelectChange(e, "dateArrival")}
                                        selectsStart
                                        minDate={new Date()}
                                        className="form-control custom-date-picker"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText='DD/MM/YYYY'
                                    />
                                    <span className='text-danger'>{errorMessages.dateArrival}</span>
                                </Form.Group>

                                <Form.Group className='mb-4 mt-4' controlId="timeArrival">
                                    <Form.Label className="mb-2 fw-semibold">Est. Time of Arrival In Individual House</Form.Label>
                                    <Select
                                        onChange={(e) => handleSelectChange(e.value, "timeArrival")}
                                        options={timeOption}
                                        placeholder="Select time"
                                        className="react_selectbox"
                                        isSearchable={false}
                                        styles={customStyles}
                                    />
                                    <span className='text-danger'>{errorMessages.timeArrival}</span>
                                </Form.Group>

                                <Form.Group className='mb-4' controlId="modeArrival">
                                    <Form.Label className="mb-2 fw-semibold">Mode of Arrival</Form.Label>
                                    <Select
                                        onChange={(e) => handleSelectChange(e.value, "modeArrival")}
                                        options={arrivalOption}
                                        placeholder="Select mode"
                                        className="react_selectbox"
                                        isSearchable={false}
                                        styles={customStyles}
                                    />
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
                                                {index > 0 && (
                                                    <>
                                                        <hr className="my-4" />
                                                        <p className='fw-bold mb-3'>Receiver {index + 1}</p>
                                                    </>
                                                )}
                                                <div className='form-group mb-4'>
                                                    <label className="form-label fw-medium">Email</label>
                                                    <div className='row align-items-center'>
                                                        <div className='col-md-5'>
                                                            <input
                                                                type='email'
                                                                className={`form-control ${receiver.email && !isValidEmail(receiver.email) ? 'is-invalid' : ''}`}
                                                                placeholder='Enter receiver email'
                                                                value={receiver.email}
                                                                onChange={(e) => handleEmailChange(receiver.id, e.target.value)}
                                                            />
                                                            {receiver.email && !isValidEmail(receiver.email) && (
                                                                <div className="invalid-feedback d-block">Please enter a valid email address</div>
                                                            )}
                                                        </div>
                                                        <div className='col-md-1 d-flex align-items-center'>
                                                            {index === 0 ? (
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
                                        {/* FIX 23: Real values from cartItem */}
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

                                        {cartItem.map((item, idx) => {
                                            const nights = calculateNights(item.check_in_date, item.check_out_date);
                                            const roomPrice = (item.price_per_night || 0) * nights;
                                            return (
                                                <div key={item.room_uid} className="summary-row detailed">
                                                    <span className="summary-label">{item.room_name} Pricing</span>
                                                    <div className="summary-value-detailed">
                                                        <div className="price-desc">{item.adults} Guest x {nights} nights</div>
                                                        {showPrices && (
                                                            <div className="price-amount">
                                                                ₹{roomPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            </div>
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
                                                    <div className="total-amount">
                                                        ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </div>
                                                )}
                                                <button className="breakdown-btn" onClick={addbreakdown}>Price breakdown</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FIX 24: Calls handleSubmitReserve (not addReserve modal toggle) */}
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
                                        value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
                                        onChange={opt => setSearchFieldData({ ...searchFieldData, company_id: opt.value })}
                                        styles={customStyles} />
                                </div>
                            </Col>
                            <Col md={2} className='gap-1'>
                                <div className='form-group'>
                                    <label className='text-black'>Where to?</label>
                                    <Select options={cityList} placeholder="Select city" className="react_selectbox"
                                        isSearchable={false}
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
                                            <Button className="mt-4" style={{ background: '#2C734A', width: '100%', height: '48px', borderRadius: '0', color: '#fff' }} variant='' onClick={handleUpdateSearch}>
                                                Update Search
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>

            {/* ── Add Person Modal ── */}
            {/* <AddPersonModel addTravels={addTravels} removeTravel={removeTravel} /> */}
            <AddPersonModel
                addTravels={addTravels}
                removeTravel={removeTravel}
                roleOption={role}
                companyList={companyList}
                addTravel={addTravel}
            />

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
            <Modal show={showReserveModal} onHide={removeReserve} animation={false} centered size="" className='custom-theme-modal-2 modal-460'>
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
                    <Link href={`/BookingDetails/${bookingConfirmedData[current]?.uid}`}
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