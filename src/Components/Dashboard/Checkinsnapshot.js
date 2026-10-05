// "use client"
// import React, { useMemo } from 'react'
// import { useEffect, useState } from "react";
// import Header from '../Header/Header'
// import { Col, Container, Row, Button, Tabs, Tab, Table } from "react-bootstrap";
// import Select from "react-select";
// import Link from 'next/link';
// import Image from "next/image";
// import { companyListAPI, PropertyListFullApi, SnapshotCheckInCheckoutAPI } from '@/services/provider';
// import { calculateNights, convertDatewithNotComma, extractDates, formatDateRangeDashboard, formatYMD, getNextDate, getPreviousDate } from '@/utils/formatTime';
// export default function Checkinsnapshot() {
//     const [activeDay, setActiveDay] = useState(formatYMD(new Date()));
//     const [activeTab, setActiveTab] = useState("all");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(10);
//     const [snapshotData, setSnapshotData] = useState({})
//     const [propertyList, setPropertyList] = useState([]);
//     const [cityList, setCityList] = useState([]);
//     const [CompanyListData, setCompanyListData] = useState([]);
//     const [filterKeyHome, setFilterKeyHome] = useState({
//         property: '', location: '', company: '', sort_by: ''
//     })

//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 const companyList = response.data.response?.filter(item => !item?.is_company_inactive)?.map(company => ({
//                     value: company.uid,
//                     label: company.company_name
//                 }));
//                 setCompanyListData(companyList);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     const getPropertiesList = async () => {
//         try {
//             const response = await PropertyListFullApi();
//             if (response?.data?.success) {
//                 setPropertyList(response.data.response?.filter(val=>val?.property_status !== "Draft" && val?.property_status !== "Inactive")?.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url })))
//                 const uniqueCities = [
//                     { city: "Jaipur" },
//                     ...Array.from(
//                         new Set(response.data.response.map(ele => ele.city)),
//                         city => ({ city })
//                     ).filter(item => item.city !== "Jaipur")
//                 ];
//                 setCityList(uniqueCities.map((cv) => ({ value: cv.city, label: cv.city })))
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const getSnapshotCheckinCheckoutData = async () => {
//         try {
//             const response = await SnapshotCheckInCheckoutAPI(activeDay, activeTab, currentPage, totalPages, filterKeyHome.property, filterKeyHome.location, filterKeyHome.company, filterKeyHome.sort_by);
//             if (response?.data?.success) {
//                 setSnapshotData(response.data.response)
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => { getCompanyList(); getPropertiesList(); }, [])
//     useEffect(() => {
//         getSnapshotCheckinCheckoutData();
//     }, [activeDay, activeTab, filterKeyHome.property, filterKeyHome.location, filterKeyHome.company, filterKeyHome.sort_by])

//     const handleTabSelect = (e) => {
//         if (e == "yesterday") {
//             setActiveDay(formatYMD(getPreviousDate(new Date())))
//         } else if (e == "today") {
//             setActiveDay(formatYMD(new Date()))
//         } else if (e == "tomorrow") {
//             setActiveDay(formatYMD(getNextDate(new Date())))
//         }
//     }

//     const handleStatusSelect = (e) => {
//         setActiveTab(e)
//     }
//     const getDiffDate = (dates) => {
//         const { checkIn, checkOut } = extractDates(dates);
//         const result = formatDateRangeDashboard(checkIn, checkOut)
//         return result;
//     }
//     const getDifwithNight = (dates) => {
//         const { checkIn, checkOut } = extractDates(dates);
//         const result = calculateNights(checkIn, checkOut);
//         return result;
//     }
//     // -----------------------------
//     const reasonsOption = [
//         { value: "status1", label: "Status 1" },
//         { value: "status2", label: "Status 2" }
//     ];

//     const monthOption = [
//         { value: "1-month", label: "Last 1 Months" },
//         { value: "3-month", label: "Last 3 Months" },
//         { value: "6-month", label: "Last 6 Months" }
//     ];

//     const customStyles = {
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected
//                 ? "#4635271F"
//                 : state.isFocused
//                     ? "#4635271F"
//                     : "inherit",
//             color: "#000",
//             cursor: "pointer"
//         })
//     };

//     const sortoption = [
//         { value: "booking-Status", label: "Booking Status" },
//         { value: "Less-trips", label: "Less Trips" }
//     ]

//     const getBookingProgress = (assignment) => {
//         if (!assignment?.booking_status) return "";

//         const now = new Date();
//         const checkIn = assignment?.check_in_date
//             ? new Date(assignment.check_in_date)
//             : null;
//         const checkOut = assignment?.check_out
//             ? new Date(assignment.check_out)
//             : null;

//         const getDiff = (from, to) => {
//             const diffMs = Math.abs(to - from);
//             const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
//             const days = Math.floor(totalHours / 24);
//             const hours = totalHours % 24;
//             return { days, hours };
//         };

//         switch (assignment.booking_status) {

//             case "Check-in-Upcoming": {
//                 if (!checkIn) return "";
//                 const diffMs = checkIn - now;
//                 if (diffMs <= 0) return "Arrived";

//                 const { days, hours } = getDiff(now, checkIn);
//                 return `Arriving in ${days}d ${hours}h`;
//             }


//             case "Check-in-Pending": {
//                 if (!checkIn) return "";
//                 const nextDayCheckIn = new Date(checkIn);
//                 nextDayCheckIn.setDate(nextDayCheckIn.getDate() + 1);

//                 const diffMs = nextDayCheckIn - now;
//                 if (diffMs <= 0) return "No-show";

//                 const { days, hours } = getDiff(now, nextDayCheckIn);
//                 return `No-show in ${days}d ${hours}h`;
//             }


//             case "Checked In":
//                 return "Active";


//             case "Check-out-Pending": {
//                 if (!checkOut) return "";
//                 const diffMs = now - checkOut;
//                 if (diffMs <= 0) return "On time";

//                 const { days, hours } = getDiff(checkOut, now);
//                 return `Overdue for ${days}d ${hours}h`;
//             }

//             case "Checked-Out":
//                 return "Completed";

//             case "Cancelled":
//             case "No-Show-Manual":
//             case "No-Show-Auto":
//                 return "Cancelled";

//             default:
//                 return "N/A";
//         }
//     };

//     const Occupancyreport = ({ title }) => {
//         return (
//             <div className="stats-record-dashboard">
//                 <Row>
//                     <Col md={3}>
//                         <div className="prev-days">
//                             <h3>{snapshotData?.occupancy?.occupancy_percentage}%</h3>
//                             <p className="font-20 mb-4" >{title} Occupancy</p>
//                             <div className="rating-row">
//                                 <span>Guests at the property</span>
//                                 <div className="rating-value">
//                                     <span>{snapshotData?.occupancy?.guests_at_property}</span>
//                                 </div>
//                             </div>
//                             <div className="rating-row">
//                                 <span>Rooms occupied</span>
//                                 <div className="rating-value">
//                                     <span>{snapshotData?.occupancy?.rooms_occupied}</span>
//                                 </div>
//                             </div>
//                             <div className="rating-row">
//                                 <span>Rooms available</span>
//                                 <div className="rating-value">
//                                     <span>{snapshotData?.occupancy?.rooms_available}</span>
//                                 </div>
//                             </div>
//                             <div className="rating-row">
//                                 <span>Rooms blocked</span>
//                                 <div className="rating-value">
//                                     <span>{snapshotData?.occupancy?.rooms_blocked}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </Col>
//                     <Col md={9}>
//                         <div className="today-calendor">
//                             <Row>
//                                 <Col md={6}>
//                                     <div className="today-checkin">
//                                         <h3 style={{ textDecoration: 'underline' }} >{snapshotData?.stats?.check_ins?.total}</h3>
//                                         <p className="d-flex align-items-center gap-2" >{title} Check-ins  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>
//                                         <Row>
//                                             <Col md={6}>
//                                                 <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                     <span className="d-flex align-items-center gap-2">
//                                                         Checked-in
//                                                         <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                     </span>
//                                                     <span className="font-18 mb-0" >
//                                                         {snapshotData?.stats?.check_ins?.checked_in}
//                                                     </span>
//                                                 </p>
//                                             </Col>
//                                             <Col md={6}>
//                                                 <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                     <span className="d-flex align-items-center gap-2">
//                                                         Check-in pending
//                                                         <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                     </span>
//                                                     <span className="font-18 mb-0" >
//                                                         {snapshotData?.stats?.check_ins?.pending}
//                                                     </span>
//                                                 </p>
//                                             </Col>
//                                             <Col md={12}>
//                                                 <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                     <span className="d-flex align-items-center gap-2">
//                                                         No Show
//                                                         <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                     </span>
//                                                     <span className="font-18 mb-0" >
//                                                         {snapshotData?.stats?.check_ins?.no_show}
//                                                     </span>
//                                                 </p>
//                                             </Col>
//                                         </Row>
//                                     </div>
//                                 </Col>
//                                 <Col md={6}>
//                                     <div className="today-checkin">
//                                         <h3 style={{ textDecoration: 'underline' }} >{snapshotData?.stats?.check_outs?.total}</h3>
//                                         <p className="d-flex align-items-center gap-2" >{title} Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>
//                                         <Row>
//                                             <Col md={12}>
//                                                 <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                     <span className="d-flex align-items-center gap-2">
//                                                         Checked out
//                                                         <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                     </span>
//                                                     <span className="font-18 mb-0" >
//                                                         {snapshotData?.stats?.check_outs?.checked_out}
//                                                     </span>
//                                                 </p>
//                                             </Col>
//                                             <Col md={12}>
//                                                 <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                     <span className="d-flex align-items-center gap-2">
//                                                         Checkout pending
//                                                         <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                     </span>
//                                                     <span className="font-18 mb-0" >
//                                                         {snapshotData?.stats?.check_outs?.pending}
//                                                     </span>
//                                                 </p>
//                                             </Col>
//                                         </Row>
//                                     </div>
//                                 </Col>
//                             </Row>
//                         </div>
//                     </Col>
//                 </Row>
//             </div>
//         )
//     }

//     const [search, setSearch] = useState("");
//     const filteredBookings = useMemo(() => {
//         return snapshotData?.bookings?.filter((booking) =>
//             booking.location.toLowerCase().includes(search.toLowerCase())
//         );
//     }, [search, snapshotData?.bookings]);

//     const [assignmentremoShow, assignmentremovesetShow] = useState(false);

//     const assignmentRemoveClose = () => assignmentremovesetShow(false);
//     const assignmentRemoveShow = () => assignmentremovesetShow(true);


//     const [openPicIndex, setOpenPicIndex] = useState(null);

//     const togglePicOption1 = (e, idx) => {
//         e.preventDefault();
//         setOpenPicIndex(openPicIndex === idx ? null : idx);
//         if (typeof toggleoptio1 === 'function') {
//             toggleoptio1();
//         }
//     }

//     // 

//     const [filtermShow, filtersetShow] = useState(false);

//     const filterClose = () => filtersetShow(false);
//     const filterShow = () => filtersetShow(true);

//     // const [selected, setSelected] = useState("email");
//     const [showEmailInput, setShowEmailInput] = useState(false);




//     const [selectedSegment, setSelectedSegment] = useState([]);
//     const [emailError, setEmailError] = useState("");


//     const toggleDropdown1 = () => setOpen(!open);

//     const handleSegmentDep = (option) => {
//         if (selectedSegment.includes(option)) {
//             setSelectedSegment(selectedSegment.filter((item) => item !== option));
//         } else {
//             setSelectedSegment([...selectedSegment, option]);
//         }
//         // setOpen(false); // Add this line to close dropdown after selection
//     };

//     const handleRemove = (option) => {
//         setSelectedSegment(selectedSegment.filter((item) => item !== option));
//     };    // 

//     const [selected, setSelected] = useState("pdf");

//     const validateEmail = (email) => {
//         // Simple regex for email validation
//         return /^\S+@\S+\.[A-Za-z]{2,}$/.test(email);
//     };

//     const handleOptionKeyDown = (e) => {
//         // Accept Enter, Tab, comma, or space as delimiters
//         if ((e.key === "Enter" || e.key === "Tab" || e.key === "," || e.key === " ") && search.trim()) {
//             e.preventDefault();
//             // Split input by comma or space, filter out empty, trim, and deduplicate
//             const emails = search
//                 .split(/[ ,]+/)
//                 .map(s => s.trim())
//                 .filter(s => s.length > 0 && !selectedSegment.includes(s));
//             if (emails.length > 0) {
//                 const validEmails = emails.filter(validateEmail);
//                 const invalidEmails = emails.filter(e => !validateEmail(e));
//                 if (validEmails.length > 0) {
//                     setSelectedSegment([...selectedSegment, ...validEmails]);
//                 }
//                 if (invalidEmails.length > 0) {
//                     setEmailError(`Invalid email: ${invalidEmails.join(", ")}`);
//                 } else {
//                     setEmailError("");
//                 }
//             }
//             setSearch("");
//         }
//     };

//     console.log(snapshotData)

//     return (

//         <>
//             <Header />
//             <div className='Breadcrumb'>
//                 <Container>
//                     <Row>
//                         <Col md={12} >
//                             <ul className='d-flex align-items-center breadcrumb-list'>
//                                 {/* <li><a href=''>Home</a></li> */}
//                                 <li><Link href='./Home'>Home</Link></li>
//                                 <li> Check-in checkout snapshot</li>
//                             </ul>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>


//             <div className='page-body  pt-4 pb-4'>
//                 <Container>
//                     <Row>
//                         <Col md={12} >
//                             <Link href="./Home" className='back-page'>
//                                 <Image src='../images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
//                                 Back</Link>
//                         </Col>
//                         <Col md={12} className=' mb-4' >
//                             <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
//                                 <h2 className='page-title'>Check-in Checkout Snapshot</h2>

//                                 <div className="d-flex align-items-center gap-3">
//                                     <Select className="react_selectbox" placeholder="All Properties" options={propertyList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, property: e.value })} styles={customStyles} />
//                                     <Select className="react_selectbox" placeholder="Location" options={cityList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, location: e.value })} styles={customStyles} />
//                                     <Select className="react_selectbox" placeholder="Company" options={CompanyListData} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, company: e.value })} styles={customStyles} />

//                                 </div>
//                             </div>
//                         </Col>


//                         <Col md={12}>
//                             <div className="occ-block">

//                                 <div className="occ-header">

//                                     <div className="occ-tab-box">

//                                         <Tabs
//                                             defaultActiveKey="today"
//                                             id="occ-tabs"
//                                             className="tab-buttons tabs-btn-3"
//                                             onSelect={handleTabSelect}
//                                         >
//                                             <Tab eventKey="yesterday" title={
//                                                 <div className="tab-title-box">
//                                                     <p className="label">Yesterday</p>
//                                                     <p className="date">{convertDatewithNotComma(getPreviousDate(new Date()))}</p>
//                                                 </div>
//                                             }>
//                                                 <Occupancyreport title={`Yesterday's`} />
//                                                 {/* <div className="stats-record-dashboard">

//                                                     <Row>
//                                                         <Col md={3}>
//                                                             <div className="prev-days">



//                                                                 <h3>{snapshotData?.occupancy?.occupancy_percentage}%</h3>
//                                                                 <p className="font-20 mb-4" >Occupancy</p>
//                                                                 <div className="rating-row">
//                                                                     <span>Guests at the property</span>
//                                                                     <div className="rating-value">

//                                                                         <span>49</span>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="rating-row">
//                                                                     <span>Rooms occupied</span>
//                                                                     <div className="rating-value">

//                                                                         <span>53</span>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="rating-row">
//                                                                     <span>Rooms available</span>
//                                                                     <div className="rating-value">

//                                                                         <span>7</span>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="rating-row">
//                                                                     <span>Rooms blocked</span>
//                                                                     <div className="rating-value">

//                                                                         <span>1</span>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                         </Col>

//                                                         <Col md={9}>
//                                                             <div className="today-calendor">

//                                                                 <Row>
//                                                                     <Col md={6}>
//                                                                         <div className="today-checkin">
//                                                                             <h3 style={{ textDecoration: 'underline' }} >10</h3>
//                                                                             <p className="d-flex align-items-center gap-2" >{`Today's Check-ins`}  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

//                                                                             <Row>
//                                                                                 <Col md={6}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checked-in
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             0
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                                 <Col md={6}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Check-in pending
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             3
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>

//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             No Show
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             0
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                             </Row>

//                                                                         </div>
//                                                                     </Col>


//                                                                     <Col md={6}>
//                                                                         <div className="today-checkin">
//                                                                             <h3 style={{ textDecoration: 'underline' }} >5</h3>
//                                                                             <p className="d-flex align-items-center gap-2" >Today’s Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

//                                                                             <Row>
//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checked out
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             4
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>


//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checkout pending
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             1
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                             </Row>

//                                                                         </div>
//                                                                     </Col>
//                                                                 </Row>

//                                                             </div>

//                                                         </Col>

//                                                     </Row>



//                                                 </div> */}
//                                             </Tab>

//                                             <Tab eventKey="today" title={
//                                                 <div className="tab-title-box">
//                                                     <p className="label">Today</p>
//                                                     <p className="date">{convertDatewithNotComma(new Date())}</p>
//                                                 </div>
//                                             }>
//                                                 <Occupancyreport title={`Today's`} />
//                                                 {/* <div className="stats-record-dashboard    ">

//                                                     <Row>
//                                                         <Col md={3}>
//                                                             <div className="prev-days">



//                                                                 <h3>{snapshotData?.occupancy?.occupancy_percentage}%</h3>
//                                                                 <p className="font-20 mb-4" >Today’s Occupancy</p>
//                                                                 <div className="rating-row">
//                                                                     <span>Guests at the property</span>
//                                                                     <div className="rating-value">

//                                                                         <span>{snapshotData?.occupancy?.guests_at_property}</span>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="rating-row">
//                                                                     <span>Rooms occupied</span>
//                                                                     <div className="rating-value">

//                                                                         <span>{snapshotData?.occupancy?.rooms_occupied}</span>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="rating-row">
//                                                                     <span>Rooms available</span>
//                                                                     <div className="rating-value">

//                                                                         <span>{snapshotData?.occupancy?.rooms_available}</span>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="rating-row">
//                                                                     <span>Rooms blocked</span>
//                                                                     <div className="rating-value">

//                                                                         <span>{snapshotData?.occupancy?.rooms_blocked}</span>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                         </Col>

//                                                         <Col md={9}>
//                                                             <div className="today-calendor">

//                                                                 <Row>
//                                                                     <Col md={6}>
//                                                                         <div className="today-checkin">
//                                                                             <h3 style={{ textDecoration: 'underline' }} >{snapshotData?.stats?.check_ins?.total}</h3>
//                                                                             <p className="d-flex align-items-center gap-2" >{`Today's Check-ins`}  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

//                                                                             <Row>
//                                                                                 <Col md={6}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checked-in
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             {snapshotData?.stats?.check_ins?.checked_in}
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                                 <Col md={6}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Check-in pending
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             {snapshotData?.stats?.check_ins?.pending}
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>

//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             No Show
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             {snapshotData?.stats?.check_ins?.no_show}
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                             </Row>

//                                                                         </div>
//                                                                     </Col>


//                                                                     <Col md={6}>
//                                                                         <div className="today-checkin">
//                                                                             <h3 style={{ textDecoration: 'underline' }} >{snapshotData?.stats?.check_outs?.total}</h3>
//                                                                             <p className="d-flex align-items-center gap-2" >Today’s Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

//                                                                             <Row>
//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checked out
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             {snapshotData?.stats?.check_outs?.checked_out}
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>


//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checkout pending
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             {snapshotData?.stats?.check_outs?.pending}
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                             </Row>

//                                                                         </div>
//                                                                     </Col>
//                                                                 </Row>

//                                                             </div>

//                                                         </Col>

//                                                     </Row>



//                                                 </div> */}
//                                             </Tab>

//                                             <Tab eventKey="tomorrow" title={
//                                                 <div className="tab-title-box">
//                                                     <p className="label">Tomorrow</p>
//                                                     <p className="date">{convertDatewithNotComma(getNextDate(new Date()))}</p>
//                                                 </div>
//                                             }>

//                                                 <Occupancyreport title={`Tomorrow's`} />
//                                                 {/* <div className="stats-record-dashboard    ">

//                                                     <Row>
//                                                         <Col md={3}>
//                                                             <div className="prev-days">



//                                                                 <h3>78%</h3>
//                                                                 <p className="font-20 mb-4" >Occupancy</p>
//                                                                 <div className="rating-row">
//                                                                     <span>Guests at the property</span>
//                                                                     <div className="rating-value">

//                                                                         <span>48</span>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="rating-row">
//                                                                     <span>Rooms occupied</span>
//                                                                     <div className="rating-value">

//                                                                         <span>53</span>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="rating-row">
//                                                                     <span>Rooms available</span>
//                                                                     <div className="rating-value">

//                                                                         <span>7</span>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="rating-row">
//                                                                     <span>Rooms blocked</span>
//                                                                     <div className="rating-value">

//                                                                         <span>1</span>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                         </Col>

//                                                         <Col md={9}>
//                                                             <div className="today-calendor">

//                                                                 <Row>
//                                                                     <Col md={6}>
//                                                                         <div className="today-checkin">
//                                                                             <h3 style={{ textDecoration: 'underline' }} >10</h3>
//                                                                             <p className="d-flex align-items-center gap-2" >{`Today's Check-ins`}  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

//                                                                             <Row>
//                                                                                 <Col md={6}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checked-in
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             0
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                                 <Col md={6}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Check-in pending
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             3
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>

//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             No Show
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             0
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                             </Row>

//                                                                         </div>
//                                                                     </Col>


//                                                                     <Col md={6}>
//                                                                         <div className="today-checkin">
//                                                                             <h3 style={{ textDecoration: 'underline' }} >5</h3>
//                                                                             <p className="d-flex align-items-center gap-2" >Today’s Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

//                                                                             <Row>
//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checked out
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             4
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>


//                                                                                 <Col md={12}>
//                                                                                     <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                                                                         <span className="d-flex align-items-center gap-2">
//                                                                                             Checkout pending
//                                                                                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                                                                         </span>

//                                                                                         <span className="font-18 mb-0" >
//                                                                                             1
//                                                                                         </span>
//                                                                                     </p>
//                                                                                 </Col>
//                                                                             </Row>

//                                                                         </div>
//                                                                     </Col>
//                                                                 </Row>

//                                                             </div>

//                                                         </Col>

//                                                     </Row>



//                                                 </div> */}


//                                             </Tab>
//                                         </Tabs>


//                                     </div>


//                                 </div>
//                             </div>



//                             <hr style={{ margin: '40px 0 ' }} ></hr>
//                         </Col>


//                         <Col md={12}>
//                             <div className='search-box mb-4'>
//                                 <input type='text' placeholder='Search by company name, or location' onChange={(e) => setSearch(e.target.value)} className='form-control' />
//                                 <button className='btn btn-search' >
//                                     <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
//                                 </button>
//                             </div>
//                         </Col>


//                         <Col md={12} >

//                             <Tabs
//                                 defaultActiveKey="all"
//                                 id="uncontrolled-tab-example"
//                                 className="mb-3 employee-tabs"
//                                 onSelect={handleStatusSelect}
//                             >
//                                 <Tab eventKey="all" title="All">
//                                     <div className="property-listview" >
//                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                             <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                 <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{snapshotData?.bookings?.length}</strong>  Bookings  </p>
//                                             </div>
//                                             <div className='filter-right-option d-flex gap-3'>
//                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <Table className='desktop-emp  snapshot-table' responsive>
//                                             <thead>
//                                                 <tr>
//                                                     <th  > <div className="mwid-20">BKG ID</div> </th>
//                                                     <th  ><div className="mwid-20">Guests</div></th>
//                                                     <th  ><div className="mwid-20">Stay dates</div></th>
//                                                     <th  ><div className="mwid-20">Booked </div> </th>
//                                                     <th ><div className="">BR </div> </th>

//                                                     <th ><div className="">Room & Bed Name </div> </th>
//                                                     <th><div className="mwid-25">Status</div></th>
//                                                     <th><div className="mwid-20">Progress</div></th>


//                                                     <th style={{ width: '10%', textAlign: 'right' }} >
//                                                         <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

//                                                         </div>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {filteredBookings?.map((assignment, idx) => (
//                                                     <tr key={idx}>

//                                                         {/* BKG ID */}
//                                                         <td className="col-booking-id">{assignment.booking_id}</td>

//                                                         {/* Guests */}
//                                                         <td className="col-guests">
//                                                             <span className="guest-name">{assignment?.guest_name}</span>
//                                                             <small className="guest-info">{"assignment?.Guestsinfo"}</small>
//                                                         </td>

//                                                         {/* Stay Dates */}
//                                                         <td className="col-staydates">
//                                                             <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
//                                                             <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
//                                                         </td>

//                                                         {/* Location */}
//                                                         <td className="col-location">{assignment.location || "Ahmedabad"}</td>

//                                                         {/* BR Room Names */}
//                                                         <td className="col-br">
//                                                             <div className="truncate-2">{assignment.property_name}</div>
//                                                         </td>

//                                                         {/* Room & Bed Name */}
//                                                         <td className="col-room">
//                                                             {assignment.room_name}, {assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
//                                                         </td>

//                                                         {/* Status */}
//                                                         <td className="col-status">
//                                                             {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                                 {assignment.booking_status}
//                                                             </span> */}
//                                                             <span style={{ lineHeight: '18px' }} className={
//                                                                 assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
//                                                                     assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
//                                                                         assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
//                                                                             assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
//                                                                                 assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
//                                                                                     assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
//                                                                                         assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
//                                                                                             assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
//                                                                                                 assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
//                                                             }>
//                                                                 {assignment.booking_status}
//                                                             </span>
//                                                         </td>

//                                                         {/* Progress */}
//                                                         <td className="col-progress">
//                                                             {/* {assignment?.progress?.type?.includes("completed") ? (
//                                                                 <span className="noshow-badge">{assignment.progress.type}</span>
//                                                             ) : (
//                                                                 assignment.progress ? (
//                                                                     <span className="progress-box">{assignment.progress.type}</span>
//                                                                 ) : null
//                                                             )} */}
//                                                             <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
//                                                                 {getBookingProgress(assignment)}
//                                                             </p>
//                                                         </td>

//                                                         {/* Action Button */}
//                                                         <td className="col-action">
//                                                             {assignment.booking_status === "Check-In-pending" ||
//                                                                 assignment.booking_status === "Check-In-Upcoming" ? (
//                                                                 <button className="btn-checkin">Check-in</button>
//                                                             ) : (
//                                                                 <Link href={`/BookingDetails/${assignment?.booking_uid
//                                                                     }`} className="btn-view-details">
//                                                                     View Details
//                                                                 </Link>
//                                                             )}
//                                                         </td>

//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </Table>
//                                     </div>
//                                 </Tab>
//                                 <Tab eventKey="checkins" title=" Check-ins">

//                                     <div className="property-listview" >
//                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                             <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                 <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
//                                             </div>
//                                             <div className='filter-right-option d-flex gap-3'>
//                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <Table className='desktop-emp  snapshot-table' responsive>
//                                             <thead>
//                                                 <tr>
//                                                     <th  > <div className="mwid-20">BKG ID</div> </th>
//                                                     <th  ><div className="mwid-20">Guests</div></th>
//                                                     <th  ><div className="mwid-20">Stay dates</div></th>
//                                                     <th  ><div className="mwid-20">Booked </div> </th>
//                                                     <th ><div className="">BR </div> </th>

//                                                     <th ><div className="">Room & Bed Name </div> </th>
//                                                     <th><div className="mwid-25">Status</div></th>
//                                                     <th><div className="mwid-20">Progress</div></th>


//                                                     <th style={{ width: '10%', textAlign: 'right' }} >
//                                                         <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

//                                                         </div>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {filteredBookings?.map((assignment, idx) => (
//                                                     <tr key={idx}>

//                                                         {/* BKG ID */}
//                                                         <td className="col-booking-id">{assignment.booking_id}</td>

//                                                         {/* Guests */}
//                                                         <td className="col-guests">
//                                                             <span className="guest-name">{assignment?.guest_name}</span>
//                                                             <small className="guest-info">{"assignment?.Guestsinfo"}</small>
//                                                         </td>

//                                                         {/* Stay Dates */}
//                                                         <td className="col-staydates">
//                                                             <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
//                                                             <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
//                                                         </td>

//                                                         {/* Location */}
//                                                         <td className="col-location">{assignment.location || "Ahmedabad"}</td>

//                                                         {/* BR Room Names */}
//                                                         <td className="col-br">
//                                                             <div className="truncate-2">{assignment.property_name}</div>
//                                                         </td>

//                                                         {/* Room & Bed Name */}
//                                                         <td className="col-room">
//                                                             {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
//                                                         </td>

//                                                         {/* Status */}
//                                                         <td className="col-status">
//                                                             {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                                 {assignment.booking_status}
//                                                             </span> */}
//                                                             <span style={{ lineHeight: '18px' }} className={
//                                                                 assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
//                                                                     assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
//                                                                         assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
//                                                                             assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
//                                                                                 assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
//                                                                                     assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
//                                                                                         assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
//                                                                                             assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
//                                                                                                 assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
//                                                             }>
//                                                                 {assignment.booking_status}
//                                                             </span>
//                                                         </td>

//                                                         {/* Progress */}
//                                                         <td className="col-progress">
//                                                             {/* {assignment?.progress?.type?.includes("completed") ? (
//                                                                 <span className="noshow-badge">{assignment.progress.type}</span>
//                                                             ) : (
//                                                                 assignment.progress ? (
//                                                                     <span className="progress-box">{assignment.progress.type}</span>
//                                                                 ) : null
//                                                             )} */}
//                                                             <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
//                                                                 {getBookingProgress(assignment)}
//                                                             </p>
//                                                         </td>

//                                                         {/* Action Button */}
//                                                         <td className="col-action">
//                                                             {assignment.booking_status === "Check-In-pending" ||
//                                                                 assignment.booking_status === "Check-In-Upcoming" ? (
//                                                                 <button className="btn-checkin">Check-in</button>
//                                                             ) : (
//                                                                 <Link href={''} className="btn-view-details">
//                                                                     View Details
//                                                                 </Link>
//                                                             )}
//                                                         </td>

//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </Table>
//                                     </div>

//                                 </Tab>

//                                 <Tab eventKey="checkouts" title=" Check Outs">

//                                     <div className="property-listview" >
//                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                             <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                 <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
//                                             </div>
//                                             <div className='filter-right-option d-flex gap-3'>
//                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <Table className='desktop-emp  snapshot-table' responsive>
//                                             <thead>
//                                                 <tr>
//                                                     <th  > <div className="mwid-20">BKG ID</div> </th>
//                                                     <th  ><div className="mwid-20">Guests</div></th>
//                                                     <th  ><div className="mwid-20">Stay dates</div></th>
//                                                     <th  ><div className="mwid-20">Booked </div> </th>
//                                                     <th ><div className="">BR </div> </th>

//                                                     <th ><div className="">Room & Bed Name </div> </th>
//                                                     <th><div className="mwid-25">Status</div></th>
//                                                     <th><div className="mwid-20">Progress</div></th>


//                                                     <th style={{ width: '10%', textAlign: 'right' }} >
//                                                         <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

//                                                         </div>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {filteredBookings?.map((assignment, idx) => (
//                                                     <tr key={idx}>

//                                                         {/* BKG ID */}
//                                                         <td className="col-booking-id">{assignment.booking_id}</td>

//                                                         {/* Guests */}
//                                                         <td className="col-guests">
//                                                             <span className="guest-name">{assignment?.guest_name}</span>
//                                                             <small className="guest-info">{"assignment?.Guestsinfo"}</small>
//                                                         </td>

//                                                         {/* Stay Dates */}
//                                                         <td className="col-staydates">
//                                                             <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
//                                                             <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
//                                                         </td>

//                                                         {/* Location */}
//                                                         <td className="col-location">{assignment.location || "Ahmedabad"}</td>

//                                                         {/* BR Room Names */}
//                                                         <td className="col-br">
//                                                             <div className="truncate-2">{assignment.property_name}</div>
//                                                         </td>

//                                                         {/* Room & Bed Name */}
//                                                         <td className="col-room">
//                                                             {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
//                                                         </td>

//                                                         {/* Status */}
//                                                         <td className="col-status">
//                                                             {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                                 {assignment.booking_status}
//                                                             </span> */}
//                                                             <span style={{ lineHeight: '18px' }} className={
//                                                                 assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
//                                                                     assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
//                                                                         assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
//                                                                             assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
//                                                                                 assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
//                                                                                     assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
//                                                                                         assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
//                                                                                             assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
//                                                                                                 assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
//                                                             }>
//                                                                 {assignment.booking_status}
//                                                             </span>
//                                                         </td>

//                                                         {/* Progress */}
//                                                         <td className="col-progress">
//                                                             {/* {assignment?.progress?.type?.includes("completed") ? (
//                                                                 <span className="noshow-badge">{assignment.progress.type}</span>
//                                                             ) : (
//                                                                 assignment.progress ? (
//                                                                     <span className="progress-box">{assignment.progress.type}</span>
//                                                                 ) : null
//                                                             )} */}
//                                                             <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
//                                                                 {getBookingProgress(assignment)}
//                                                             </p>
//                                                         </td>

//                                                         {/* Action Button */}
//                                                         <td className="col-action">
//                                                             {assignment.booking_status === "Check-In-pending" ||
//                                                                 assignment.booking_status === "Check-In-Upcoming" ? (
//                                                                 <button className="btn-checkin">Check-in</button>
//                                                             ) : (
//                                                                 <Link href={''} className="btn-view-details">
//                                                                     View Details
//                                                                 </Link>
//                                                             )}
//                                                         </td>

//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </Table>
//                                     </div>


//                                 </Tab>
//                                 <Tab eventKey="pending_checkins" title="Pending Check-ins">

//                                     <div className="property-listview" >
//                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                             <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                 <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
//                                             </div>
//                                             <div className='filter-right-option d-flex gap-3'>
//                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <Table className='desktop-emp  snapshot-table' responsive>
//                                             <thead>
//                                                 <tr>
//                                                     <th  > <div className="mwid-20">BKG ID</div> </th>
//                                                     <th  ><div className="mwid-20">Guests</div></th>
//                                                     <th  ><div className="mwid-20">Stay dates</div></th>
//                                                     <th  ><div className="mwid-20">Booked </div> </th>
//                                                     <th ><div className="">BR </div> </th>

//                                                     <th ><div className="">Room & Bed Name </div> </th>
//                                                     <th><div className="mwid-25">Status</div></th>
//                                                     <th><div className="mwid-20">Progress</div></th>


//                                                     <th style={{ width: '10%', textAlign: 'right' }} >
//                                                         <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

//                                                         </div>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {filteredBookings?.map((assignment, idx) => (
//                                                     <tr key={idx}>

//                                                         {/* BKG ID */}
//                                                         <td className="col-booking-id">{assignment.booking_id}</td>

//                                                         {/* Guests */}
//                                                         <td className="col-guests">
//                                                             <span className="guest-name">{assignment?.guest_name}</span>
//                                                             <small className="guest-info">{"assignment?.Guestsinfo"}</small>
//                                                         </td>

//                                                         {/* Stay Dates */}
//                                                         <td className="col-staydates">
//                                                             <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
//                                                             <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
//                                                         </td>

//                                                         {/* Location */}
//                                                         <td className="col-location">{assignment.location || "Ahmedabad"}</td>

//                                                         {/* BR Room Names */}
//                                                         <td className="col-br">
//                                                             <div className="truncate-2">{assignment.property_name}</div>
//                                                         </td>

//                                                         {/* Room & Bed Name */}
//                                                         <td className="col-room">
//                                                             {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
//                                                         </td>

//                                                         {/* Status */}
//                                                         <td className="col-status">
//                                                             {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                                 {assignment.booking_status}
//                                                             </span> */}
//                                                             <span style={{ lineHeight: '18px' }} className={
//                                                                 assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
//                                                                     assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
//                                                                         assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
//                                                                             assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
//                                                                                 assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
//                                                                                     assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
//                                                                                         assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
//                                                                                             assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
//                                                                                                 assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
//                                                             }>
//                                                                 {assignment.booking_status}
//                                                             </span>
//                                                         </td>

//                                                         {/* Progress */}
//                                                         <td className="col-progress">
//                                                             {/* {assignment?.progress?.type?.includes("completed") ? (
//                                                                 <span className="noshow-badge">{assignment.progress.type}</span>
//                                                             ) : (
//                                                                 assignment.progress ? (
//                                                                     <span className="progress-box">{assignment.progress.type}</span>
//                                                                 ) : null
//                                                             )} */}
//                                                             <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
//                                                                 {getBookingProgress(assignment)}
//                                                             </p>
//                                                         </td>

//                                                         {/* Action Button */}
//                                                         <td className="col-action">
//                                                             {assignment.booking_status === "Check-In-pending" ||
//                                                                 assignment.booking_status === "Check-In-Upcoming" ? (
//                                                                 <button className="btn-checkin">Check-in</button>
//                                                             ) : (
//                                                                 <Link href={''} className="btn-view-details">
//                                                                     View Details
//                                                                 </Link>
//                                                             )}
//                                                         </td>

//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </Table>
//                                     </div>

//                                 </Tab>

//                                 <Tab eventKey="pending_checkouts" title="Pending Check Outs">

//                                     <div className="property-listview" >
//                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                             <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                 <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
//                                             </div>
//                                             <div className='filter-right-option d-flex gap-3'>
//                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <Table className='desktop-emp  snapshot-table' responsive>
//                                             <thead>
//                                                 <tr>
//                                                     <th  > <div className="mwid-20">BKG ID</div> </th>
//                                                     <th  ><div className="mwid-20">Guests</div></th>
//                                                     <th  ><div className="mwid-20">Stay dates</div></th>
//                                                     <th  ><div className="mwid-20">Booked </div> </th>
//                                                     <th ><div className="">BR </div> </th>

//                                                     <th ><div className="">Room & Bed Name </div> </th>
//                                                     <th><div className="mwid-25">Status</div></th>
//                                                     <th><div className="mwid-20">Progress</div></th>


//                                                     <th style={{ width: '10%', textAlign: 'right' }} >
//                                                         <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

//                                                         </div>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {filteredBookings?.map((assignment, idx) => (
//                                                     <tr key={idx}>

//                                                         {/* BKG ID */}
//                                                         <td className="col-booking-id">{assignment.booking_id}</td>

//                                                         {/* Guests */}
//                                                         <td className="col-guests">
//                                                             <span className="guest-name">{assignment?.guest_name}</span>
//                                                             <small className="guest-info">{"assignment?.Guestsinfo"}</small>
//                                                         </td>

//                                                         {/* Stay Dates */}
//                                                         <td className="col-staydates">
//                                                             <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
//                                                             <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
//                                                         </td>

//                                                         {/* Location */}
//                                                         <td className="col-location">{assignment.location || "Ahmedabad"}</td>

//                                                         {/* BR Room Names */}
//                                                         <td className="col-br">
//                                                             <div className="truncate-2">{assignment.property_name}</div>
//                                                         </td>

//                                                         {/* Room & Bed Name */}
//                                                         <td className="col-room">
//                                                             {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
//                                                         </td>

//                                                         {/* Status */}
//                                                         <td className="col-status">
//                                                             {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                                 {assignment.booking_status}
//                                                             </span> */}
//                                                             <span style={{ lineHeight: '18px' }} className={
//                                                                 assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
//                                                                     assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
//                                                                         assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
//                                                                             assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
//                                                                                 assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
//                                                                                     assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
//                                                                                         assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
//                                                                                             assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
//                                                                                                 assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
//                                                             }>
//                                                                 {assignment.booking_status}
//                                                             </span>
//                                                         </td>

//                                                         {/* Progress */}
//                                                         <td className="col-progress">
//                                                             {/* {assignment?.progress?.type?.includes("completed") ? (
//                                                                 <span className="noshow-badge">{assignment.progress.type}</span>
//                                                             ) : (
//                                                                 assignment.progress ? (
//                                                                     <span className="progress-box">{assignment.progress.type}</span>
//                                                                 ) : null
//                                                             )} */}
//                                                             <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
//                                                                 {getBookingProgress(assignment)}
//                                                             </p>
//                                                         </td>

//                                                         {/* Action Button */}
//                                                         <td className="col-action">
//                                                             {assignment.booking_status === "Check-In-pending" ||
//                                                                 assignment.booking_status === "Check-In-Upcoming" ? (
//                                                                 <button className="btn-checkin">Check-in</button>
//                                                             ) : (
//                                                                 <Link href={''} className="btn-view-details">
//                                                                     View Details
//                                                                 </Link>
//                                                             )}
//                                                         </td>

//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </Table>
//                                     </div>


//                                 </Tab>

//                                 <Tab eventKey="no_shows" title="No-Shows">

//                                     <div className="property-listview" >
//                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                             <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                 <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
//                                             </div>
//                                             <div className='filter-right-option d-flex gap-3'>
//                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <Table className='desktop-emp  snapshot-table' responsive>
//                                             <thead>
//                                                 <tr>
//                                                     <th  > <div className="mwid-20">BKG ID</div> </th>
//                                                     <th  ><div className="mwid-20">Guests</div></th>
//                                                     <th  ><div className="mwid-20">Stay dates</div></th>
//                                                     <th  ><div className="mwid-20">Booked </div> </th>
//                                                     <th ><div className="">BR </div> </th>

//                                                     <th ><div className="">Room & Bed Name </div> </th>
//                                                     <th><div className="mwid-25">Status</div></th>
//                                                     <th><div className="mwid-20">Progress</div></th>


//                                                     <th style={{ width: '10%', textAlign: 'right' }} >
//                                                         <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

//                                                         </div>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {filteredBookings?.map((assignment, idx) => (
//                                                     <tr key={idx}>

//                                                         {/* BKG ID */}
//                                                         <td className="col-booking-id">{assignment.booking_id}</td>

//                                                         {/* Guests */}
//                                                         <td className="col-guests">
//                                                             <span className="guest-name">{assignment?.guest_name}</span>
//                                                             <small className="guest-info">{"assignment?.Guestsinfo"}</small>
//                                                         </td>

//                                                         {/* Stay Dates */}
//                                                         <td className="col-staydates">
//                                                             <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
//                                                             <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
//                                                         </td>

//                                                         {/* Location */}
//                                                         <td className="col-location">{assignment.location || "Ahmedabad"}</td>

//                                                         {/* BR Room Names */}
//                                                         <td className="col-br">
//                                                             <div className="truncate-2">{assignment.property_name}</div>
//                                                         </td>

//                                                         {/* Room & Bed Name */}
//                                                         <td className="col-room">
//                                                             {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
//                                                         </td>

//                                                         {/* Status */}
//                                                         <td className="col-status">
//                                                             {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                                 {assignment.booking_status}
//                                                             </span> */}
//                                                             <span style={{ lineHeight: '18px' }} className={
//                                                                 assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
//                                                                     assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
//                                                                         assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
//                                                                             assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
//                                                                                 assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
//                                                                                     assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
//                                                                                         assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
//                                                                                             assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
//                                                                                                 assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
//                                                             }>
//                                                                 {assignment.booking_status}
//                                                             </span>
//                                                         </td>

//                                                         {/* Progress */}
//                                                         <td className="col-progress">
//                                                             {/* {assignment?.progress?.type?.includes("completed") ? (
//                                                                 <span className="noshow-badge">{assignment.progress.type}</span>
//                                                             ) : (
//                                                                 assignment.progress ? (
//                                                                     <span className="progress-box">{assignment.progress.type}</span>
//                                                                 ) : null
//                                                             )} */}
//                                                             <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
//                                                                 {getBookingProgress(assignment)}
//                                                             </p>
//                                                         </td>

//                                                         {/* Action Button */}
//                                                         <td className="col-action">
//                                                             {assignment.booking_status === "Check-In-pending" ||
//                                                                 assignment.booking_status === "Check-In-Upcoming" ? (
//                                                                 <button className="btn-checkin">Check-in</button>
//                                                             ) : (
//                                                                 <Link href={''} className="btn-view-details">
//                                                                     View Details
//                                                                 </Link>
//                                                             )}
//                                                         </td>

//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </Table>
//                                     </div>


//                                 </Tab>


//                             </Tabs>

//                         </Col>



//                     </Row>

//                 </Container>
//             </div>
//         </>
//     )
// }


"use client"
import React, { useMemo } from 'react'
import { useEffect, useState } from "react";
import Header from '../Header/Header'
import { Col, Container, Row, Button, Tabs, Tab, Table } from "react-bootstrap";
import Select from "react-select";
import Link from 'next/link';
import Image from "next/image";
import { companyListAPI, PropertyListFullApi, SnapshotCheckInCheckoutAPI, PermissionsCalAndDash } from '@/services/provider';
import { calculateNights, convertDatewithNotComma, extractDates, formatDateRangeDashboard, formatYMD, getNextDate, getPreviousDate } from '@/utils/formatTime';
export default function Checkinsnapshot() {
    const [activeDay, setActiveDay] = useState(formatYMD(new Date()));
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [snapshotData, setSnapshotData] = useState({})
    const [propertyList, setPropertyList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [CompanyListData, setCompanyListData] = useState([]);
    const [totalBrRowsPage, setTotalBrRowsPage] = useState(0);
    const [filterKeyHome, setFilterKeyHome] = useState({
        property: '', location: '', company: '', sort_by: '', page: 1, limit: 10
    })

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingProperties, setLoadingProperties] = useState(false);
    // Permissions ---------------------------------------------------------
    const [permissionData, setPermissionData] = useState({});
    // Until permissionData has loaded, default to true so content doesn't flash hidden.
    const hasPermission = (key) => {
        if (!permissionData || Object.keys(permissionData).length === 0) return true;
        return permissionData?.[key]?.allowed === true;
    };
    const SNAPSHOT_PERMISSIONS = {
        checkinCheckoutSnapshot: "dashboard.checkin_checkout_snapshot",
    };
    const DynamicPermission = async () => {
        try {
            const res = await PermissionsCalAndDash();
            if (res?.data?.success) {
                setPermissionData(res.data.response)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        DynamicPermission();
    }, []);

    const getCompanyList = async () => {
        try {
            const response = await companyListAPI("all");
            if (response?.data?.success) {
                const companyList = response.data.response?.filter(item => !item?.is_company_inactive)?.map(company => ({
                    value: company.uid,
                    label: company.company_name
                }));
                setCompanyListData(companyList);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getPropertiesList = async (pageNumber) => {
        try {
            if (loadingProperties) return;
            setLoadingProperties(true)
            const response = await PropertyListFullApi(10, pageNumber);
            if (response?.data?.success) {
                const list = response.data.response?.filter(val => val?.property_status !== "Draft" && val?.property_status !== "Inactive")?.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url }))
                setPropertyList([...propertyList, ...list])
                const uniqueCities = [
                    { city: "Jaipur" },
                    ...Array.from(
                        new Set(response.data.response.map(ele => ele.city)),
                        city => ({ city })
                    ).filter(item => item.city !== "Jaipur")
                ];
                const listCity = uniqueCities.map((cv) => ({ value: cv.city, label: cv.city }))
                setCityList([...cityList, ...listCity])
                setHasMore(response.data.next_page);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingProperties(false)
        }
    }

    const loadMoreProperties = () => {
        if (!hasMore || loadingProperties) return;

        const nextPage = page + 1;
        setPage(nextPage);
        getPropertiesList(nextPage);
    };

    const getSnapshotCheckinCheckoutData = async () => {
        try {
            const response = await SnapshotCheckInCheckoutAPI(activeDay, activeTab, filterKeyHome.page, filterKeyHome.limit, filterKeyHome.property, filterKeyHome.location, filterKeyHome.company, filterKeyHome.sort_by);
            if (response?.data?.success) {
                setSnapshotData(response.data.response);
                setTotalBrRowsPage(response.data.response.total_pages);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { getCompanyList(); getPropertiesList(page); }, [])
    useEffect(() => {
        getSnapshotCheckinCheckoutData();
    }, [activeDay, activeTab, filterKeyHome.property, filterKeyHome.location, filterKeyHome.company, filterKeyHome.sort_by,filterKeyHome.page])

    const handleTabSelect = (e) => {
        if (e == "yesterday") {
            setActiveDay(formatYMD(getPreviousDate(new Date())))
        } else if (e == "today") {
            setActiveDay(formatYMD(new Date()))
        } else if (e == "tomorrow") {
            setActiveDay(formatYMD(getNextDate(new Date())))
        }
    }

    const handleStatusSelect = (e) => {
        setActiveTab(e)
    }
    const getDiffDate = (dates) => {
        const { checkIn, checkOut } = extractDates(dates);
        const result = formatDateRangeDashboard(checkIn, checkOut)
        return result;
    }
    const getDifwithNight = (dates) => {
        const { checkIn, checkOut } = extractDates(dates);
        const result = calculateNights(checkIn, checkOut);
        return result;
    }
    // -----------------------------
    const reasonsOption = [
        { value: "status1", label: "Status 1" },
        { value: "status2", label: "Status 2" }
    ];

    const monthOption = [
        { value: "1-month", label: "Last 1 Months" },
        { value: "3-month", label: "Last 3 Months" },
        { value: "6-month", label: "Last 6 Months" }
    ];

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#4635271F"
                : state.isFocused
                    ? "#4635271F"
                    : "inherit",
            color: "#000",
            cursor: "pointer"
        })
    };

    const sortoption = [
        { value: "booking-Status", label: "Booking Status" },
        { value: "Less-trips", label: "Less Trips" }
    ]

    const getBookingProgress = (assignment) => {
        if (!assignment?.booking_status) return "";

        const now = new Date();
        const checkIn = assignment?.check_in_date
            ? new Date(assignment.check_in_date)
            : null;
        const checkOut = assignment?.check_out
            ? new Date(assignment.check_out)
            : null;

        const getDiff = (from, to) => {
            const diffMs = Math.abs(to - from);
            const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
            const days = Math.floor(totalHours / 24);
            const hours = totalHours % 24;
            return { days, hours };
        };

        switch (assignment.booking_status) {

            case "Check-in-Upcoming": {
                if (!checkIn) return "";
                const diffMs = checkIn - now;
                if (diffMs <= 0) return "Arrived";

                const { days, hours } = getDiff(now, checkIn);
                return `Arriving in ${days}d ${hours}h`;
            }


            case "Check-in-Pending": {
                if (!checkIn) return "";
                const nextDayCheckIn = new Date(checkIn);
                nextDayCheckIn.setDate(nextDayCheckIn.getDate() + 1);

                const diffMs = nextDayCheckIn - now;
                if (diffMs <= 0) return "No-show";

                const { days, hours } = getDiff(now, nextDayCheckIn);
                return `No-show in ${days}d ${hours}h`;
            }


            case "Checked In":
                return "Active";


            case "Check-out-Pending": {
                if (!checkOut) return "";
                const diffMs = now - checkOut;
                if (diffMs <= 0) return "On time";

                const { days, hours } = getDiff(checkOut, now);
                return `Overdue for ${days}d ${hours}h`;
            }

            case "Checked-Out":
                return "Completed";

            case "Cancelled":
            case "No-Show-Manual":
            case "No-Show-Auto":
                return "Cancelled";

            default:
                return "N/A";
        }
    };

    const Occupancyreport = ({ title }) => {
        return (
            <div className="stats-record-dashboard">
                <Row>
                    <Col md={3}>
                        <div className="prev-days">
                            <h3>{snapshotData?.occupancy?.occupancy_percentage}%</h3>
                            <p className="font-20 mb-4" >{title} Occupancy</p>
                            <div className="rating-row">
                                <span>Guests at the property</span>
                                <div className="rating-value">
                                    <span>{snapshotData?.occupancy?.guests_at_property}</span>
                                </div>
                            </div>
                            <div className="rating-row">
                                <span>Rooms occupied</span>
                                <div className="rating-value">
                                    <span>{snapshotData?.occupancy?.rooms_occupied}</span>
                                </div>
                            </div>
                            <div className="rating-row">
                                <span>Rooms available</span>
                                <div className="rating-value">
                                    <span>{snapshotData?.occupancy?.rooms_available}</span>
                                </div>
                            </div>
                            <div className="rating-row">
                                <span>Rooms blocked</span>
                                <div className="rating-value">
                                    <span>{snapshotData?.occupancy?.rooms_blocked}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={9}>
                        <div className="today-calendor">
                            <Row>
                                <Col md={6}>
                                    <div className="today-checkin">
                                        <h3 style={{ textDecoration: 'underline' }} >{snapshotData?.stats?.check_ins?.total}</h3>
                                        <p className="d-flex align-items-center gap-2" >{title} Check-ins  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>
                                        <Row>
                                            <Col md={6}>
                                                <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                    <span className="d-flex align-items-center gap-2">
                                                        Checked-in
                                                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                    </span>
                                                    <span className="font-18 mb-0" >
                                                        {snapshotData?.stats?.check_ins?.checked_in}
                                                    </span>
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                    <span className="d-flex align-items-center gap-2">
                                                        Check-in pending
                                                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                    </span>
                                                    <span className="font-18 mb-0" >
                                                        {snapshotData?.stats?.check_ins?.pending}
                                                    </span>
                                                </p>
                                            </Col>
                                            <Col md={12}>
                                                <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                    <span className="d-flex align-items-center gap-2">
                                                        No Show
                                                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                    </span>
                                                    <span className="font-18 mb-0" >
                                                        {snapshotData?.stats?.check_ins?.no_show}
                                                    </span>
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="today-checkin">
                                        <h3 style={{ textDecoration: 'underline' }} >{snapshotData?.stats?.check_outs?.total}</h3>
                                        <p className="d-flex align-items-center gap-2" >{title} Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>
                                        <Row>
                                            <Col md={12}>
                                                <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                    <span className="d-flex align-items-center gap-2">
                                                        Checked out
                                                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                    </span>
                                                    <span className="font-18 mb-0" >
                                                        {snapshotData?.stats?.check_outs?.checked_out}
                                                    </span>
                                                </p>
                                            </Col>
                                            <Col md={12}>
                                                <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                    <span className="d-flex align-items-center gap-2">
                                                        Checkout pending
                                                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                    </span>
                                                    <span className="font-18 mb-0" >
                                                        {snapshotData?.stats?.check_outs?.pending}
                                                    </span>
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

    const [search, setSearch] = useState("");
    const filteredBookings = useMemo(() => {
        return snapshotData?.bookings?.filter((booking) =>
            booking.location.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, snapshotData?.bookings]);

    const [assignmentremoShow, assignmentremovesetShow] = useState(false);

    const assignmentRemoveClose = () => assignmentremovesetShow(false);
    const assignmentRemoveShow = () => assignmentremovesetShow(true);


    const [openPicIndex, setOpenPicIndex] = useState(null);

    const togglePicOption1 = (e, idx) => {
        e.preventDefault();
        setOpenPicIndex(openPicIndex === idx ? null : idx);
        if (typeof toggleoptio1 === 'function') {
            toggleoptio1();
        }
    }

    // 

    const [filtermShow, filtersetShow] = useState(false);

    const filterClose = () => filtersetShow(false);
    const filterShow = () => filtersetShow(true);

    // const [selected, setSelected] = useState("email");
    const [showEmailInput, setShowEmailInput] = useState(false);




    const [selectedSegment, setSelectedSegment] = useState([]);
    const [emailError, setEmailError] = useState("");


    const toggleDropdown1 = () => setOpen(!open);

    const handleSegmentDep = (option) => {
        if (selectedSegment.includes(option)) {
            setSelectedSegment(selectedSegment.filter((item) => item !== option));
        } else {
            setSelectedSegment([...selectedSegment, option]);
        }
        // setOpen(false); // Add this line to close dropdown after selection
    };

    const handleRemove = (option) => {
        setSelectedSegment(selectedSegment.filter((item) => item !== option));
    };    // 

    const [selected, setSelected] = useState("pdf");

    const validateEmail = (email) => {
        // Simple regex for email validation
        return /^\S+@\S+\.[A-Za-z]{2,}$/.test(email);
    };

    const handleOptionKeyDown = (e) => {
        // Accept Enter, Tab, comma, or space as delimiters
        if ((e.key === "Enter" || e.key === "Tab" || e.key === "," || e.key === " ") && search.trim()) {
            e.preventDefault();
            // Split input by comma or space, filter out empty, trim, and deduplicate
            const emails = search
                .split(/[ ,]+/)
                .map(s => s.trim())
                .filter(s => s.length > 0 && !selectedSegment.includes(s));
            if (emails.length > 0) {
                const validEmails = emails.filter(validateEmail);
                const invalidEmails = emails.filter(e => !validateEmail(e));
                if (validEmails.length > 0) {
                    setSelectedSegment([...selectedSegment, ...validEmails]);
                }
                if (invalidEmails.length > 0) {
                    setEmailError(`Invalid email: ${invalidEmails.join(", ")}`);
                } else {
                    setEmailError("");
                }
            }
            setSearch("");
        }
    };

    const handlePageBrChange = (page) => {
        if (page === "..." || page === recentPage) return;

        setFilterKeyHome((prev) => ({
            ...prev,
            page: page
        }));
    };

    const recentPage = filterKeyHome.page;
    const allPages = totalBrRowsPage;

    const getPaginationNumbersBr = () => {
        const pages = [];

        if (allPages <= 7) {
            for (let i = 1; i <= allPages; i++) {
                pages.push(i);
            }
        } else {
            if (recentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", allPages);
            } else if (recentPage >= allPages - 3) {
                pages.push(
                    1,
                    "...",
                    allPages - 4,
                    allPages - 3,
                    allPages - 2,
                    allPages - 1,
                    allPages
                );
            } else {
                pages.push(
                    1,
                    "...",
                    recentPage - 1,
                    recentPage,
                    recentPage + 1,
                    "...",
                    allPages
                );
            }
        }

        return pages;
    };

    return (

        <>
            <Header />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>
                                {/* <li><a href=''>Home</a></li> */}
                                <li><Link href='./Home'>Home</Link></li>
                                <li> Check-in checkout snapshot</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>


            <div className='page-body  pt-4 pb-4'>
                <Container>
                    {!hasPermission(SNAPSHOT_PERMISSIONS.checkinCheckoutSnapshot) ? (
                        <Row>
                            <Col md={12}>
                                <div className="text-center py-5">
                                    <p className="font-20 fw-medium mb-0">
                                        You don’t have permission to view the check-in checkout snapshot.
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <Col md={12} >
                                <Link href="./Home" className='back-page'>
                                    <Image src='../images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                    Back</Link>
                            </Col>
                            <Col md={12} className=' mb-4' >
                                <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
                                    <h2 className='page-title'>Check-in Checkout Snapshot</h2>

                                    <div className="d-flex align-items-center gap-3">
                                        <Select className="react_selectbox" placeholder="All Properties" options={propertyList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, property: e.value })} styles={customStyles} onMenuScrollToBottom={loadMoreProperties} />
                                        <Select className="react_selectbox" placeholder="Location" options={cityList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, location: e.value })} styles={customStyles} />
                                        <Select className="react_selectbox" placeholder="Company" options={CompanyListData} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, company: e.value })} styles={customStyles} />

                                    </div>
                                </div>
                            </Col>


                            <Col md={12}>
                                <div className="occ-block">

                                    <div className="occ-header">

                                        <div className="occ-tab-box">

                                            <Tabs
                                                defaultActiveKey="today"
                                                id="occ-tabs"
                                                className="tab-buttons tabs-btn-3"
                                                onSelect={handleTabSelect}
                                            >
                                                <Tab eventKey="yesterday" title={
                                                    <div className="tab-title-box">
                                                        <p className="label">Yesterday</p>
                                                        <p className="date">{convertDatewithNotComma(getPreviousDate(new Date()))}</p>
                                                    </div>
                                                }>
                                                    <Occupancyreport title={`Yesterday's`} />
                                                    {/* <div className="stats-record-dashboard">

                                                    <Row>
                                                        <Col md={3}>
                                                            <div className="prev-days">



                                                                <h3>{snapshotData?.occupancy?.occupancy_percentage}%</h3>
                                                                <p className="font-20 mb-4" >Occupancy</p>
                                                                <div className="rating-row">
                                                                    <span>Guests at the property</span>
                                                                    <div className="rating-value">

                                                                        <span>49</span>
                                                                    </div>
                                                                </div>

                                                                <div className="rating-row">
                                                                    <span>Rooms occupied</span>
                                                                    <div className="rating-value">

                                                                        <span>53</span>
                                                                    </div>
                                                                </div>
                                                                <div className="rating-row">
                                                                    <span>Rooms available</span>
                                                                    <div className="rating-value">

                                                                        <span>7</span>
                                                                    </div>
                                                                </div>

                                                                <div className="rating-row">
                                                                    <span>Rooms blocked</span>
                                                                    <div className="rating-value">

                                                                        <span>1</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </Col>

                                                        <Col md={9}>
                                                            <div className="today-calendor">

                                                                <Row>
                                                                    <Col md={6}>
                                                                        <div className="today-checkin">
                                                                            <h3 style={{ textDecoration: 'underline' }} >10</h3>
                                                                            <p className="d-flex align-items-center gap-2" >{`Today's Check-ins`}  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

                                                                            <Row>
                                                                                <Col md={6}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checked-in
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            0
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                                <Col md={6}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Check-in pending
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            3
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>

                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            No Show
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            0
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                            </Row>

                                                                        </div>
                                                                    </Col>


                                                                    <Col md={6}>
                                                                        <div className="today-checkin">
                                                                            <h3 style={{ textDecoration: 'underline' }} >5</h3>
                                                                            <p className="d-flex align-items-center gap-2" >Today’s Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checked out
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            4
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>


                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checkout pending
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            1
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                            </Row>

                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </div>

                                                        </Col>

                                                    </Row>



                                                </div> */}
                                                </Tab>

                                                <Tab eventKey="today" title={
                                                    <div className="tab-title-box">
                                                        <p className="label">Today</p>
                                                        <p className="date">{convertDatewithNotComma(new Date())}</p>
                                                    </div>
                                                }>
                                                    <Occupancyreport title={`Today's`} />
                                                    {/* <div className="stats-record-dashboard    ">

                                                    <Row>
                                                        <Col md={3}>
                                                            <div className="prev-days">



                                                                <h3>{snapshotData?.occupancy?.occupancy_percentage}%</h3>
                                                                <p className="font-20 mb-4" >Today’s Occupancy</p>
                                                                <div className="rating-row">
                                                                    <span>Guests at the property</span>
                                                                    <div className="rating-value">

                                                                        <span>{snapshotData?.occupancy?.guests_at_property}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="rating-row">
                                                                    <span>Rooms occupied</span>
                                                                    <div className="rating-value">

                                                                        <span>{snapshotData?.occupancy?.rooms_occupied}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="rating-row">
                                                                    <span>Rooms available</span>
                                                                    <div className="rating-value">

                                                                        <span>{snapshotData?.occupancy?.rooms_available}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="rating-row">
                                                                    <span>Rooms blocked</span>
                                                                    <div className="rating-value">

                                                                        <span>{snapshotData?.occupancy?.rooms_blocked}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </Col>

                                                        <Col md={9}>
                                                            <div className="today-calendor">

                                                                <Row>
                                                                    <Col md={6}>
                                                                        <div className="today-checkin">
                                                                            <h3 style={{ textDecoration: 'underline' }} >{snapshotData?.stats?.check_ins?.total}</h3>
                                                                            <p className="d-flex align-items-center gap-2" >{`Today's Check-ins`}  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

                                                                            <Row>
                                                                                <Col md={6}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checked-in
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            {snapshotData?.stats?.check_ins?.checked_in}
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                                <Col md={6}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Check-in pending
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            {snapshotData?.stats?.check_ins?.pending}
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>

                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            No Show
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            {snapshotData?.stats?.check_ins?.no_show}
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                            </Row>

                                                                        </div>
                                                                    </Col>


                                                                    <Col md={6}>
                                                                        <div className="today-checkin">
                                                                            <h3 style={{ textDecoration: 'underline' }} >{snapshotData?.stats?.check_outs?.total}</h3>
                                                                            <p className="d-flex align-items-center gap-2" >Today’s Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checked out
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            {snapshotData?.stats?.check_outs?.checked_out}
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>


                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checkout pending
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            {snapshotData?.stats?.check_outs?.pending}
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                            </Row>

                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </div>

                                                        </Col>

                                                    </Row>



                                                </div> */}
                                                </Tab>

                                                <Tab eventKey="tomorrow" title={
                                                    <div className="tab-title-box">
                                                        <p className="label">Tomorrow</p>
                                                        <p className="date">{convertDatewithNotComma(getNextDate(new Date()))}</p>
                                                    </div>
                                                }>

                                                    <Occupancyreport title={`Tomorrow's`} />
                                                    {/* <div className="stats-record-dashboard    ">

                                                    <Row>
                                                        <Col md={3}>
                                                            <div className="prev-days">



                                                                <h3>78%</h3>
                                                                <p className="font-20 mb-4" >Occupancy</p>
                                                                <div className="rating-row">
                                                                    <span>Guests at the property</span>
                                                                    <div className="rating-value">

                                                                        <span>48</span>
                                                                    </div>
                                                                </div>

                                                                <div className="rating-row">
                                                                    <span>Rooms occupied</span>
                                                                    <div className="rating-value">

                                                                        <span>53</span>
                                                                    </div>
                                                                </div>
                                                                <div className="rating-row">
                                                                    <span>Rooms available</span>
                                                                    <div className="rating-value">

                                                                        <span>7</span>
                                                                    </div>
                                                                </div>

                                                                <div className="rating-row">
                                                                    <span>Rooms blocked</span>
                                                                    <div className="rating-value">

                                                                        <span>1</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </Col>

                                                        <Col md={9}>
                                                            <div className="today-calendor">

                                                                <Row>
                                                                    <Col md={6}>
                                                                        <div className="today-checkin">
                                                                            <h3 style={{ textDecoration: 'underline' }} >10</h3>
                                                                            <p className="d-flex align-items-center gap-2" >{`Today's Check-ins`}  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

                                                                            <Row>
                                                                                <Col md={6}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checked-in
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            0
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                                <Col md={6}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Check-in pending
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            3
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>

                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            No Show
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            0
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                            </Row>

                                                                        </div>
                                                                    </Col>


                                                                    <Col md={6}>
                                                                        <div className="today-checkin">
                                                                            <h3 style={{ textDecoration: 'underline' }} >5</h3>
                                                                            <p className="d-flex align-items-center gap-2" >Today’s Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

                                                                            <Row>
                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checked out
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            4
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>


                                                                                <Col md={12}>
                                                                                    <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                                                                        <span className="d-flex align-items-center gap-2">
                                                                                            Checkout pending
                                                                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
                                                                                        </span>

                                                                                        <span className="font-18 mb-0" >
                                                                                            1
                                                                                        </span>
                                                                                    </p>
                                                                                </Col>
                                                                            </Row>

                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </div>

                                                        </Col>

                                                    </Row>



                                                </div> */}


                                                </Tab>
                                            </Tabs>


                                        </div>


                                    </div>
                                </div>



                                <hr style={{ margin: '40px 0 ' }} ></hr>
                            </Col>


                            <Col md={12}>
                                <div className='search-box mb-4'>
                                    <input type='text' placeholder='Search by company name, or location' onChange={(e) => setSearch(e.target.value)} className='form-control' />
                                    <button className='btn btn-search' >
                                        <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                                    </button>
                                </div>
                            </Col>


                            <Col md={12} >

                                <Tabs
                                    defaultActiveKey="all"
                                    id="uncontrolled-tab-example"
                                    className="mb-3 employee-tabs"
                                    onSelect={handleStatusSelect}
                                >
                                    <Tab eventKey="all" title="All">
                                        <div className="property-listview" >
                                            <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                    <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{snapshotData?.bookings?.length}</strong>  Bookings  </p>
                                                </div>
                                                <div className='filter-right-option d-flex gap-3'>
                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                        <Button variant="" className='btn-sort'> Sort by :
                                                            <Select
                                                                name="aria-role-select"
                                                                options={sortoption}
                                                                placeholder="Name"
                                                                onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
                                                                className="react_selectbox"
                                                                isSearchable={false}
                                                                styles={customStyles}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Table className='desktop-emp  snapshot-table' responsive>
                                                <thead>
                                                    <tr>
                                                        <th  > <div className="mwid-20">BKG ID</div> </th>
                                                        <th  ><div className="mwid-20">Guests</div></th>
                                                        <th  ><div className="mwid-20">Stay dates</div></th>
                                                        <th  ><div className="mwid-20">Booked </div> </th>
                                                        <th ><div className="">BR </div> </th>

                                                        <th ><div className="">Room & Bed Name </div> </th>
                                                        <th><div className="mwid-25">Status</div></th>
                                                        <th><div className="mwid-20">Progress</div></th>


                                                        <th style={{ width: '10%', textAlign: 'right' }} >
                                                            <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBookings?.map((assignment, idx) => (
                                                        <tr key={idx}>

                                                            {/* BKG ID */}
                                                            <td className="col-booking-id">{assignment.booking_id}</td>

                                                            {/* Guests */}
                                                            <td className="col-guests">
                                                                <span className="guest-name">{assignment?.guest_name}</span>
                                                                <small className="guest-info">{assignment?.Guestsinfo}</small>
                                                            </td>

                                                            {/* Stay Dates */}
                                                            <td className="col-staydates">
                                                                <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
                                                                <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
                                                            </td>

                                                            {/* Location */}
                                                            <td className="col-location">{assignment.location || "Ahmedabad"}</td>

                                                            {/* BR Room Names */}
                                                            <td className="col-br">
                                                                <div className="truncate-2">{assignment.property_name}</div>
                                                            </td>

                                                            {/* Room & Bed Name */}
                                                            <td className="col-room">
                                                                {assignment.room_name}, {assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
                                                            </td>

                                                            {/* Status */}
                                                            <td className="col-status">
                                                                {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                                {assignment.booking_status}
                                                            </span> */}
                                                                <span style={{ lineHeight: '18px' }} className={
                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>
                                                                    {assignment.booking_status}
                                                                </span>
                                                            </td>

                                                            {/* Progress */}
                                                            <td className="col-progress">
                                                                {/* {assignment?.progress?.type?.includes("completed") ? (
                                                                <span className="noshow-badge">{assignment.progress.type}</span>
                                                            ) : (
                                                                assignment.progress ? (
                                                                    <span className="progress-box">{assignment.progress.type}</span>
                                                                ) : null
                                                            )} */}
                                                                <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                    {getBookingProgress(assignment)}
                                                                </p>
                                                            </td>

                                                            {/* Action Button */}
                                                            <td className="col-action">
                                                                {assignment.booking_status === "Check-In-pending" ||
                                                                    assignment.booking_status === "Check-In-Upcoming" ? (
                                                                    <button className="btn-checkin">Check-in</button>
                                                                ) : (
                                                                    <Link href={`/BookingDetails/${assignment?.booking_uid
                                                                        }`} className="btn-view-details">
                                                                        View Details
                                                                    </Link>
                                                                )}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="checkins" title=" Check-ins">

                                        <div className="property-listview" >
                                            <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                    <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
                                                </div>
                                                <div className='filter-right-option d-flex gap-3'>
                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                        <Button variant="" className='btn-sort'> Sort by :
                                                            <Select
                                                                name="aria-role-select"
                                                                options={sortoption}
                                                                placeholder="Name"
                                                                onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
                                                                className="react_selectbox"
                                                                isSearchable={false}
                                                                styles={customStyles}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Table className='desktop-emp  snapshot-table' responsive>
                                                <thead>
                                                    <tr>
                                                        <th  > <div className="mwid-20">BKG ID</div> </th>
                                                        <th  ><div className="mwid-20">Guests</div></th>
                                                        <th  ><div className="mwid-20">Stay dates</div></th>
                                                        <th  ><div className="mwid-20">Booked </div> </th>
                                                        <th ><div className="">BR </div> </th>

                                                        <th ><div className="">Room & Bed Name </div> </th>
                                                        <th><div className="mwid-25">Status</div></th>
                                                        <th><div className="mwid-20">Progress</div></th>


                                                        <th style={{ width: '10%', textAlign: 'right' }} >
                                                            <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBookings?.map((assignment, idx) => (
                                                        <tr key={idx}>

                                                            {/* BKG ID */}
                                                            <td className="col-booking-id">{assignment.booking_id}</td>

                                                            {/* Guests */}
                                                            <td className="col-guests">
                                                                <span className="guest-name">{assignment?.guest_name}</span>
                                                                <small className="guest-info">{assignment?.Guestsinfo}</small>
                                                            </td>

                                                            {/* Stay Dates */}
                                                            <td className="col-staydates">
                                                                <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
                                                                <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
                                                            </td>

                                                            {/* Location */}
                                                            <td className="col-location">{assignment.location || "Ahmedabad"}</td>

                                                            {/* BR Room Names */}
                                                            <td className="col-br">
                                                                <div className="truncate-2">{assignment.property_name}</div>
                                                            </td>

                                                            {/* Room & Bed Name */}
                                                            <td className="col-room">
                                                                {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
                                                            </td>

                                                            {/* Status */}
                                                            <td className="col-status">
                                                                {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                                {assignment.booking_status}
                                                            </span> */}
                                                                <span style={{ lineHeight: '18px' }} className={
                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>
                                                                    {assignment.booking_status}
                                                                </span>
                                                            </td>

                                                            {/* Progress */}
                                                            <td className="col-progress">
                                                                {/* {assignment?.progress?.type?.includes("completed") ? (
                                                                <span className="noshow-badge">{assignment.progress.type}</span>
                                                            ) : (
                                                                assignment.progress ? (
                                                                    <span className="progress-box">{assignment.progress.type}</span>
                                                                ) : null
                                                            )} */}
                                                                <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                    {getBookingProgress(assignment)}
                                                                </p>
                                                            </td>

                                                            {/* Action Button */}
                                                            <td className="col-action">
                                                                {assignment.booking_status === "Check-In-pending" ||
                                                                    assignment.booking_status === "Check-In-Upcoming" ? (
                                                                    <button className="btn-checkin">Check-in</button>
                                                                ) : (
                                                                    <Link href={`/BookingDetails/${assignment?.booking_uid}`} className="btn-view-details">
                                                                        View Details
                                                                    </Link>
                                                                )}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>

                                    </Tab>

                                    <Tab eventKey="checkouts" title=" Check Outs">

                                        <div className="property-listview" >
                                            <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                    <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
                                                </div>
                                                <div className='filter-right-option d-flex gap-3'>
                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                        <Button variant="" className='btn-sort'> Sort by :
                                                            <Select
                                                                name="aria-role-select"
                                                                options={sortoption}
                                                                placeholder="Name"
                                                                onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
                                                                className="react_selectbox"
                                                                isSearchable={false}
                                                                styles={customStyles}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Table className='desktop-emp  snapshot-table' responsive>
                                                <thead>
                                                    <tr>
                                                        <th  > <div className="mwid-20">BKG ID</div> </th>
                                                        <th  ><div className="mwid-20">Guests</div></th>
                                                        <th  ><div className="mwid-20">Stay dates</div></th>
                                                        <th  ><div className="mwid-20">Booked </div> </th>
                                                        <th ><div className="">BR </div> </th>

                                                        <th ><div className="">Room & Bed Name </div> </th>
                                                        <th><div className="mwid-25">Status</div></th>
                                                        <th><div className="mwid-20">Progress</div></th>


                                                        <th style={{ width: '10%', textAlign: 'right' }} >
                                                            <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBookings?.map((assignment, idx) => (
                                                        <tr key={idx}>

                                                            {/* BKG ID */}
                                                            <td className="col-booking-id">{assignment.booking_id}</td>

                                                            {/* Guests */}
                                                            <td className="col-guests">
                                                                <span className="guest-name">{assignment?.guest_name}</span>
                                                                <small className="guest-info">{assignment?.Guestsinfo}</small>
                                                            </td>

                                                            {/* Stay Dates */}
                                                            <td className="col-staydates">
                                                                <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
                                                                <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
                                                            </td>

                                                            {/* Location */}
                                                            <td className="col-location">{assignment.location || "Ahmedabad"}</td>

                                                            {/* BR Room Names */}
                                                            <td className="col-br">
                                                                <div className="truncate-2">{assignment.property_name}</div>
                                                            </td>

                                                            {/* Room & Bed Name */}
                                                            <td className="col-room">
                                                                {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
                                                            </td>

                                                            {/* Status */}
                                                            <td className="col-status">
                                                                {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                                {assignment.booking_status}
                                                            </span> */}
                                                                <span style={{ lineHeight: '18px' }} className={
                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>
                                                                    {assignment.booking_status}
                                                                </span>
                                                            </td>

                                                            {/* Progress */}
                                                            <td className="col-progress">
                                                                {/* {assignment?.progress?.type?.includes("completed") ? (
                                                                <span className="noshow-badge">{assignment.progress.type}</span>
                                                            ) : (
                                                                assignment.progress ? (
                                                                    <span className="progress-box">{assignment.progress.type}</span>
                                                                ) : null
                                                            )} */}
                                                                <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                    {getBookingProgress(assignment)}
                                                                </p>
                                                            </td>

                                                            {/* Action Button */}
                                                            <td className="col-action">
                                                                {assignment.booking_status === "Check-In-pending" ||
                                                                    assignment.booking_status === "Check-In-Upcoming" ? (
                                                                    <button className="btn-checkin">Check-in</button>
                                                                ) : (
                                                                    <Link href={`/BookingDetails/${assignment?.booking_uid}`} className="btn-view-details">
                                                                        View Details
                                                                    </Link>
                                                                )}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>


                                    </Tab>
                                    <Tab eventKey="pending_checkins" title="Pending Check-ins">

                                        <div className="property-listview" >
                                            <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                    <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
                                                </div>
                                                <div className='filter-right-option d-flex gap-3'>
                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                        <Button variant="" className='btn-sort'> Sort by :
                                                            <Select
                                                                name="aria-role-select"
                                                                options={sortoption}
                                                                placeholder="Name"
                                                                onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
                                                                className="react_selectbox"
                                                                isSearchable={false}
                                                                styles={customStyles}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Table className='desktop-emp  snapshot-table' responsive>
                                                <thead>
                                                    <tr>
                                                        <th  > <div className="mwid-20">BKG ID</div> </th>
                                                        <th  ><div className="mwid-20">Guests</div></th>
                                                        <th  ><div className="mwid-20">Stay dates</div></th>
                                                        <th  ><div className="mwid-20">Booked </div> </th>
                                                        <th ><div className="">BR </div> </th>

                                                        <th ><div className="">Room & Bed Name </div> </th>
                                                        <th><div className="mwid-25">Status</div></th>
                                                        <th><div className="mwid-20">Progress</div></th>


                                                        <th style={{ width: '10%', textAlign: 'right' }} >
                                                            <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBookings?.map((assignment, idx) => (
                                                        <tr key={idx}>

                                                            {/* BKG ID */}
                                                            <td className="col-booking-id">{assignment.booking_id}</td>

                                                            {/* Guests */}
                                                            <td className="col-guests">
                                                                <span className="guest-name">{assignment?.guest_name}</span>
                                                                <small className="guest-info">{assignment?.Guestsinfo}</small>
                                                            </td>

                                                            {/* Stay Dates */}
                                                            <td className="col-staydates">
                                                                <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
                                                                <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
                                                            </td>

                                                            {/* Location */}
                                                            <td className="col-location">{assignment.location || "Ahmedabad"}</td>

                                                            {/* BR Room Names */}
                                                            <td className="col-br">
                                                                <div className="truncate-2">{assignment.property_name}</div>
                                                            </td>

                                                            {/* Room & Bed Name */}
                                                            <td className="col-room">
                                                                {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
                                                            </td>

                                                            {/* Status */}
                                                            <td className="col-status">
                                                                {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                                {assignment.booking_status}
                                                            </span> */}
                                                                <span style={{ lineHeight: '18px' }} className={
                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>
                                                                    {assignment.booking_status}
                                                                </span>
                                                            </td>

                                                            {/* Progress */}
                                                            <td className="col-progress">
                                                                {/* {assignment?.progress?.type?.includes("completed") ? (
                                                                <span className="noshow-badge">{assignment.progress.type}</span>
                                                            ) : (
                                                                assignment.progress ? (
                                                                    <span className="progress-box">{assignment.progress.type}</span>
                                                                ) : null
                                                            )} */}
                                                                <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                    {getBookingProgress(assignment)}
                                                                </p>
                                                            </td>

                                                            {/* Action Button */}
                                                            <td className="col-action">
                                                                {assignment.booking_status === "Check-In-pending" ||
                                                                    assignment.booking_status === "Check-In-Upcoming" ? (
                                                                    <button className="btn-checkin">Check-in</button>
                                                                ) : (
                                                                    <Link href={`/BookingDetails/${assignment?.booking_uid}`} className="btn-view-details">
                                                                        View Details
                                                                    </Link>
                                                                )}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>

                                    </Tab>

                                    <Tab eventKey="pending_checkouts" title="Pending Check Outs">

                                        <div className="property-listview" >
                                            <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                    <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
                                                </div>
                                                <div className='filter-right-option d-flex gap-3'>
                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                        <Button variant="" className='btn-sort'> Sort by :
                                                            <Select
                                                                name="aria-role-select"
                                                                options={sortoption}
                                                                placeholder="Name"
                                                                onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
                                                                className="react_selectbox"
                                                                isSearchable={false}
                                                                styles={customStyles}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Table className='desktop-emp  snapshot-table' responsive>
                                                <thead>
                                                    <tr>
                                                        <th  > <div className="mwid-20">BKG ID</div> </th>
                                                        <th  ><div className="mwid-20">Guests</div></th>
                                                        <th  ><div className="mwid-20">Stay dates</div></th>
                                                        <th  ><div className="mwid-20">Booked </div> </th>
                                                        <th ><div className="">BR </div> </th>

                                                        <th ><div className="">Room & Bed Name </div> </th>
                                                        <th><div className="mwid-25">Status</div></th>
                                                        <th><div className="mwid-20">Progress</div></th>


                                                        <th style={{ width: '10%', textAlign: 'right' }} >
                                                            <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBookings?.map((assignment, idx) => (
                                                        <tr key={idx}>

                                                            {/* BKG ID */}
                                                            <td className="col-booking-id">{assignment.booking_id}</td>

                                                            {/* Guests */}
                                                            <td className="col-guests">
                                                                <span className="guest-name">{assignment?.guest_name}</span>
                                                                <small className="guest-info">{assignment?.Guestsinfo}</small>
                                                            </td>

                                                            {/* Stay Dates */}
                                                            <td className="col-staydates">
                                                                <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
                                                                <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
                                                            </td>

                                                            {/* Location */}
                                                            <td className="col-location">{assignment.location || "Ahmedabad"}</td>

                                                            {/* BR Room Names */}
                                                            <td className="col-br">
                                                                <div className="truncate-2">{assignment.property_name}</div>
                                                            </td>

                                                            {/* Room & Bed Name */}
                                                            <td className="col-room">
                                                                {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
                                                            </td>

                                                            {/* Status */}
                                                            <td className="col-status">
                                                                {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                                {assignment.booking_status}
                                                            </span> */}
                                                                <span style={{ lineHeight: '18px' }} className={
                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>
                                                                    {assignment.booking_status}
                                                                </span>
                                                            </td>

                                                            {/* Progress */}
                                                            <td className="col-progress">
                                                                {/* {assignment?.progress?.type?.includes("completed") ? (
                                                                <span className="noshow-badge">{assignment.progress.type}</span>
                                                            ) : (
                                                                assignment.progress ? (
                                                                    <span className="progress-box">{assignment.progress.type}</span>
                                                                ) : null
                                                            )} */}
                                                                <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                    {getBookingProgress(assignment)}
                                                                </p>
                                                            </td>

                                                            {/* Action Button */}
                                                            <td className="col-action">
                                                                {assignment.booking_status === "Check-In-pending" ||
                                                                    assignment.booking_status === "Check-In-Upcoming" ? (
                                                                    <button className="btn-checkin">Check-in</button>
                                                                ) : (
                                                                    <Link href={`/BookingDetails/${assignment?.booking_uid}`} className="btn-view-details">
                                                                        View Details
                                                                    </Link>
                                                                )}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>


                                    </Tab>

                                    <Tab eventKey="no_shows" title="No-Shows">

                                        <div className="property-listview" >
                                            <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                    <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{filteredBookings?.length}</strong>  Bookings  </p>
                                                </div>
                                                <div className='filter-right-option d-flex gap-3'>
                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                        <Button variant="" className='btn-sort'> Sort by :
                                                            <Select
                                                                name="aria-role-select"
                                                                options={sortoption}
                                                                placeholder="Name"
                                                                onChange={(opt) => setFilterKeyHome({ ...filterKeyHome, sort_by: opt.value })}
                                                                className="react_selectbox"
                                                                isSearchable={false}
                                                                styles={customStyles}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Table className='desktop-emp  snapshot-table' responsive>
                                                <thead>
                                                    <tr>
                                                        <th  > <div className="mwid-20">BKG ID</div> </th>
                                                        <th  ><div className="mwid-20">Guests</div></th>
                                                        <th  ><div className="mwid-20">Stay dates</div></th>
                                                        <th  ><div className="mwid-20">Booked </div> </th>
                                                        <th ><div className="">BR </div> </th>

                                                        <th ><div className="">Room & Bed Name </div> </th>
                                                        <th><div className="mwid-25">Status</div></th>
                                                        <th><div className="mwid-20">Progress</div></th>


                                                        <th style={{ width: '10%', textAlign: 'right' }} >
                                                            <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredBookings?.map((assignment, idx) => (
                                                        <tr key={idx}>

                                                            {/* BKG ID */}
                                                            <td className="col-booking-id">{assignment.booking_id}</td>

                                                            {/* Guests */}
                                                            <td className="col-guests">
                                                                <span className="guest-name">{assignment?.guest_name}</span>
                                                                <small className="guest-info">{assignment?.Guestsinfo}</small>
                                                            </td>

                                                            {/* Stay Dates */}
                                                            <td className="col-staydates">
                                                                <span className="date-range">{getDiffDate(assignment.stay_dates)}</span>
                                                                <small className="nights">{getDifwithNight(assignment.stay_dates)} nights</small>
                                                            </td>

                                                            {/* Location */}
                                                            <td className="col-location">{assignment.location || "Ahmedabad"}</td>

                                                            {/* BR Room Names */}
                                                            <td className="col-br">
                                                                <div className="truncate-2">{assignment.property_name}</div>
                                                            </td>

                                                            {/* Room & Bed Name */}
                                                            <td className="col-room">
                                                                {assignment.room_name}{assignment.bed_name ? `, ${assignment.bed_name}` : 'Bed B'}
                                                            </td>

                                                            {/* Status */}
                                                            <td className="col-status">
                                                                {/* <span className={`status-badge ${assignment.booking_status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                                {assignment.booking_status}
                                                            </span> */}
                                                                <span style={{ lineHeight: '18px' }} className={
                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>
                                                                    {assignment.booking_status}
                                                                </span>
                                                            </td>

                                                            {/* Progress */}
                                                            <td className="col-progress">
                                                                {/* {assignment?.progress?.type?.includes("completed") ? (
                                                                <span className="noshow-badge">{assignment.progress.type}</span>
                                                            ) : (
                                                                assignment.progress ? (
                                                                    <span className="progress-box">{assignment.progress.type}</span>
                                                                ) : null
                                                            )} */}
                                                                <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                    {getBookingProgress(assignment)}
                                                                </p>
                                                            </td>

                                                            {/* Action Button */}
                                                            <td className="col-action">
                                                                {assignment.booking_status === "Check-In-pending" ||
                                                                    assignment.booking_status === "Check-In-Upcoming" ? (
                                                                    <button className="btn-checkin">Check-in</button>
                                                                ) : (
                                                                    <Link href={`/BookingDetails/${assignment?.booking_uid}`} className="btn-view-details">
                                                                        View Details
                                                                    </Link>
                                                                )}
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>

                                        </div>


                                    </Tab>


                                </Tabs>

                                <div className="pagination-container mt-4 d-flex align-items-center gap-3">

                                    <span className="pagination-text">
                                        Showing {recentPage} of {allPages}
                                    </span>

                                    <div className="pagination d-flex align-items-center gap-2">

                                        <button
                                            className="page-arrow"
                                            disabled={recentPage === 1}
                                            onClick={() => handlePageBrChange(recentPage - 1)}
                                        >
                                            <Image
                                                src="/images/icons/back.svg"
                                                alt="previous"
                                                width={10}
                                                height={10}
                                                style={{ opacity: recentPage === 1 ? 0.3 : 1 }}
                                            />
                                        </button>


                                        {/* Pages */}
                                        {getPaginationNumbersBr().map((page, index) => (
                                            <button
                                                key={index}
                                                className={`page-number ${recentPage === page ? "active" : ""
                                                    }`}
                                                onClick={() => handlePageBrChange(page)}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {/* Next */}
                                        <button
                                            className="page-arrow"
                                            disabled={recentPage === allPages}
                                            onClick={() => handlePageBrChange(recentPage + 1)}
                                        >
                                            <Image
                                                src="/images/icons/Arrows-right.svg"
                                                alt="next"
                                                width={29}
                                                height={29}
                                                style={{ opacity: recentPage === allPages ? 0.3 : 1 }}
                                            />
                                        </button>

                                    </div>
                                </div>

                            </Col>



                        </Row>
                    )}

                </Container>
            </div>
        </>
    )
}