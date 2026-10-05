// "use client";

// import React, { useEffect, useState } from "react";
// import Header from '../Header/Header'
// import ProtectedRoute from '../ProtectedRoute'
// import { Col, Container, Row, Button, Tabs, Tab, Table, Card, Modal } from "react-bootstrap";
// import Image from "next/image";
// import Select from "react-select";
// import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { useRouter } from 'next/navigation';
// import {
//   PieChart, Pie, Cell, BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Label,
// } from "recharts";


// import Link from 'next/link';
// import { ActiveGuestAPI, companyListAPI, DashboardAPI, FeedbackInsightsAPI, occupancyReportAPI, PermissionsCalAndDash, PropertyListFullApi } from "@/services/provider";
// import { calculateNights, convertDatewith, convertDatewithNotComma, extractDates, formatDateRangeDashboard, formatYMD, getOneMonthBefore } from "@/utils/formatTime";
// import dynamic from "next/dynamic";
// const MapView = dynamic(() => import("./Map/PropertyDynamicMap"), {
//   ssr: false,
// })
// // import MapView from "./Map/PropertyDynamicMap";


// const Dashboard = () => {
//   // 

//   const router = useRouter();
//   const [propertyList, setPropertyList] = useState([]);
//   const [cityList, setCityList] = useState([]);
//   const [CompanyListData, setCompanyListData] = useState([]);
//   const [filterKeyHome, setFilterKeyHome] = useState({
//     property: '', location: '', company: ''
//   })
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(10);
//   const [homeData, setHomeData] = useState({});
//   const [performanceStat, setPerformanceStat] = useState('1_month');
//   const [distributeData, setDistributeData] = useState([]);
//   const [distAnlt, setDistAnlt] = useState('1_month');
//   const [activeGuest, setActiveGuest] = useState({});
//   const [feedbackInsights, setFeedbackInsights] = useState({});
//   const [activeOccupancy, setActiveOccupancy] = useState('daily')
//   const [isMapMinimized, setIsMapMinimized] = useState(false);
//   const [noShowCountdown, setNoShowCountdown] = useState('');
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [permissionData,setPermissionData] = useState({});

//   const toggleGuestMap = () => {
//     setIsMapMinimized((prev) => !prev);
//   };

//   const goToResult = () => {
//     // Close the modal first
//     // removeTravel2(); // This should be your modal close function

//     // Then navigate after a small delay to ensure modal is closed
//     setTimeout(() => {
//       router.push('/Checkinsnapshot');
//     }, 100);
//   };
//   // -----------------------------
//   // OPTIONS
//   // -----------------------------


//   const monthOption = [
//     { value: "1_month", label: "Last 1 Month" },
//     { value: "3_months", label: "Last 3 Month" },
//     { value: "6_months", label: "Last 6 Month" },
//     { value: "9_months", label: "Last 9 Month" },
//     { value: "12_months", label: "Last 12 Month" },
//   ];

//   const customStyles = {
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? "#4635271F"
//         : state.isFocused
//           ? "#4635271F"
//           : "inherit",
//       color: "#000",
//       cursor: "pointer"
//     })
//   };

//   // const getTimeUntilMidnight = () => {
//   //   const now = new Date();
//   //   const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
//   //   const diff = midnight - now;
//   //   if (diff <= 0) return '00h 00M 00S';
//   //   const hours = Math.floor(diff / (1000 * 60 * 60));
//   //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//   //   const seconds = Math.floor((diff % (1000 * 60)) / 1000);
//   //   return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
//   // };
//   const getTimeUntilNoShow = () => {
//     const now = new Date();
//     const todayDeadline = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 59, 0);

//     const diff = todayDeadline - now;
//     if (diff <= 0) return '00h 00M 00S';

//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//     return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
//   };

//   useEffect(() => {
//     setNoShowCountdown(getTimeUntilNoShow());
//     const interval = setInterval(() => {
//       setNoShowCountdown(getTimeUntilNoShow());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // useEffect(() => {
//   //   setNoShowCountdown(getTimeUntilNoShow());
//   //   const interval = setInterval(() => {
//   //     setNoShowCountdown(getTimeUntilNoShow());
//   //   }, 1000);
//   //   return () => clearInterval(interval);
//   // }, []);

//   // -----------------------------
//   // SEARCH + DATA
//   // -----------------------------
//   // const [search, setSearch] = useState("");



//   // -----------------------------
//   // PIE CHART
//   // -----------------------------  


//   const data = homeData?.occupancy_snapshot?.daily?.br_summary?.slice(0, 6).map(property => ({
//     name: property.property_name.substring(0, 15) + (property.property_name.length > 15 ? '...' : ''),
//     value: property.rooms_available
//     // value:property.occupancy_percentage
//   }));

//   const monthlyTrend = homeData?.occupancy_snapshot?.monthly?.monthly_trend; // your API data

//   const currentMonth = new Date().getMonth() + 1; // 1–12
//   const currentYear = new Date().getFullYear();

//   const monthly_data = monthlyTrend?.map(item => ({
//     name: item?.month_name?.slice(0, 3), // Feb, Mar, Apr
//     value: Number(item.occupancy_percentage), // already in %
//     active:
//       item.year === currentYear && item.month === currentMonth,
//     future:
//       item.year > currentYear ||
//       (item.year === currentYear && item.month > currentMonth),
//   }));
//   const months_result = monthly_data?.map(item => item.name);



//   const COLORS = ["#259c3f", "#f9f4f1"];

//   // -----------------------------
//   // BAR CHART
//   // -----------------------------

//   const ColorDistribute = ["#A47FF6", "#7C7C7C", "#8740FF", "#FF5252", "#00C49F", "#00FF92", "#7ED6FF", "#000000", "#005EFF", "#4CAF50", "#FF8F00"]


//   const ratings = [
//     { label: "Cleanliness", value: feedbackInsights?.cleanliness_rating },
//     { label: "Food quality", value: feedbackInsights?.food_quality_rating },
//     { label: "Staff hospitality", value: feedbackInsights?.staff_hospitality_rating },
//     { label: "Location", value: feedbackInsights?.location_rating },
//   ];


//   // -----------------------------
//   // REVIEWS SECTION SLIDER
//   // -----------------------------


//   const [index, setIndex] = useState(0);

//   const nextSlide = () => {
//     if (index < feedbackInsights?.recent_reviews?.length - 1) setIndex(index + 1);
//   };

//   const prevSlide = () => {
//     if (index > 0) setIndex(index - 1);
//   };


//   const [filtermShow, filtersetShow] = useState(false);
//   const [guestReview, setGuestReview] = useState({});
//   const filterClose = () => filtersetShow(false);
//   const filterShow = (e, val) => {
//     e.preventDefault();
//     filtersetShow(true);
//     setGuestReview(val);
//   };

//   const getDiffDate = (dates) => {
//     const { checkIn, checkOut } = extractDates(dates);
//     const result = formatDateRangeDashboard(checkIn, checkOut)
//     return result;
//   }
//   const getDifwithNight = (dates) => {
//     const { checkIn, checkOut } = extractDates(dates);
//     const result = calculateNights(checkIn, checkOut);
//     return result;
//   }


//   // 

//   const [expanded, setExpanded] = useState({
//     public: false,
//     // clean: false,
//     // food: false,
//     // staff: false,
//     // location: false
//   });

//   const toggleExpand = (key) => {
//     setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   const DynamicPermission=async()=>{
//     try {
//       const res = await PermissionsCalAndDash();
//       if(res?.data?.success){
//         setPermissionData(res.data.response)
//       }
//     } catch (error) {
//       console.log(error);      
//     }
//   }
//   //Dynamic Dashboard functionaliyt----------------------
//   const getDashboardData = async () => {
//     try {
//       const response = await DashboardAPI(formatYMD(getOneMonthBefore(new Date())), formatYMD(new Date()), filterKeyHome.property, filterKeyHome.location, filterKeyHome.company)
//       if (response?.data?.response) {
//         setHomeData(response.data.response)
//         setDistributeData(response?.data?.response?.distribution_analytics?.['1_month']?.distribution?.map((val, index) => ({
//           name: val?.name,
//           value: val?.booking_distribution_percentage,
//           color: ColorDistribute[index]
//         })))
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   const getActiveGuestData = async () => {
//     try {
//       const response = await ActiveGuestAPI(filterKeyHome.property, filterKeyHome.company);
//       if (response?.data?.success) {
//         setActiveGuest(response.data.response)
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   const getFeedbackInsightsData = async () => {
//     try {
//       const response = await FeedbackInsightsAPI('12_months', filterKeyHome.property, filterKeyHome.company);
//       if (response?.data?.success) {
//         setFeedbackInsights(response.data.response)
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const getCompanyList = async () => {
//     try {
//       const response = await companyListAPI("all");
//       if (response?.data?.success) {
//         const companyList = response.data.response?.filter(item => !item?.is_company_inactive)?.map(company => ({
//           value: company.uid,
//           label: company.company_name
//         }));
//         setCompanyListData(companyList);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   const getPropertiesList = async () => {
//     try {
//       const response = await PropertyListFullApi();
//       if (response?.data?.success) {
//         setPropertyList(response.data.response?.filter(val => val?.property_status !== "Draft" && val?.property_status !== "Inactive")?.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url })))
//         const uniqueCities = [
//           { city: "Jaipur" },
//           ...Array.from(
//             new Set(response.data.response.map(ele => ele.city)),
//             city => ({ city })
//           ).filter(item => item.city !== "Jaipur")
//         ];
//         setCityList(uniqueCities.map((cv) => ({ value: cv.city, label: cv.city })))
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     getPropertiesList()
//     getCompanyList()
//     getDashboardData()
//     getActiveGuestData()
//     getFeedbackInsightsData()
//     DynamicPermission()
//   }, []);

//   useEffect(() => {
//     getDashboardData()
//     getActiveGuestData()
//     getFeedbackInsightsData()

//   }, [filterKeyHome.property, filterKeyHome.location, filterKeyHome.company])

//   const handleDistrubution = (e) => {
//     const item = homeData?.distribution_analytics?.[e.value]
//     setDistAnlt(e.value)

//     const result = item.distribution?.map((val, index) => ({
//       name: val?.name,
//       value: val?.booking_distribution_percentage,
//       color: ColorDistribute[index]
//     }))
//     setDistributeData(result)
//   }

//   const [privateExpanded, setPrivateExpanded] = useState(false);

//   const togglePrivateReview = () => setPrivateExpanded((prev) => !prev);

//   // console.log(homeData)
//   // console.log(homeData?.distribution_analytics[distAnlt])
//   // console.log(feedbackInsights)
// console.log(permissionData)

//   return (
//     <>
//       <ProtectedRoute>
//         <Header />
//         <div className="dashboardWrapper mb-4">
//           <Container>
//             <Row>

//               {/* FILTER ROW */}
//               <Col md={12}>
//                 <div className="d-flex align-items-center justify-content-between mb-4 mt-4">
//                   <div className="d-flex align-items-center gap-3">
//                     <h2 className="page-title mb-0">Home</h2>


//                   </div>

//                   <div className="d-flex align-items-center gap-3">
//                     <Select className="react_selectbox" placeholder="All Properties" options={propertyList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, property: e.value })} styles={customStyles} />
//                     <Select className="react_selectbox" placeholder="Location" options={cityList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, location: e.value })} styles={customStyles} />
//                     <Select className="react_selectbox" placeholder="Company" options={CompanyListData} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, company: e.value })} styles={customStyles} />

//                   </div>
//                 </div>


//               </Col>

//               <Col md={12}>
//                 <div className="stats-record-dashboard">
//                   <Row>
//                     <Col md={3}>
//                       <div className="prev-days">
//                         <p className="font-20" >Previous day(s)</p>
//                         {/* <p>4 Aug, 2025</p> */}
//                         <p>{convertDatewithNotComma(homeData?.yesterday?.date)}</p>
//                         <p>Bookings created <b> {homeData?.yesterday?.bookings_created}</b></p>

//                         <h3>{homeData?.yesterday?.check_ins?.pending}</h3>
//                         <p className="d-flex align-items-center gap-2" >Check-in pending <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span> </p>
//                         <p className='rounded mb-0 w-40' style={{ background: '#fff', fontSize: '14px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: 'Fitcontent', padding: '4px 6px' }} >No-show <span style={{ color: '#BF9039' }} >{noShowCountdown}</span> </p>

//                         <p className="d-flex justify-between align-items-center mt-3" style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                           <span className="d-flex align-items-center gap-2">
//                             No Show
//                             <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
//                           </span>

//                           <span className="font-16 mb-0" >
//                             {homeData?.yesterday?.check_ins?.no_show}
//                           </span>
//                         </p>
//                       </div>

//                     </Col>

//                     <Col md={9}>
//                       <div className="today-calendor">
//                         <div className="d-flex justify-between mb-2">
//                           <p className="font-20 mb-0" >Today</p>
//                           <p className="font-16 mb-0 gap-2" style={{ color: '#73615F' }} >Bookings created <span className="font-20 ms-2" >{homeData?.today?.bookings_created} </span></p>
//                         </div>
//                         <p className="font-14 mb-3" >{convertDatewithNotComma(homeData?.today?.date)}</p>

//                         <Row>
//                           <Col md={6}>
//                             <div className="today-checkin">
//                               <h3 style={{}} >{homeData?.today?.check_ins?.total}</h3>
//                               <p className="d-flex align-items-center gap-2" >{`Today's Check-ins`}  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

//                               <Row>
//                                 <Col md={6}>
//                                   <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                     <span className="d-flex align-items-center gap-2">
//                                       Checked-in
//                                       <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                     </span>

//                                     <span className="font-16 mb-0" >
//                                       {homeData?.today?.check_ins?.checked_in}
//                                     </span>
//                                   </p>
//                                 </Col>
//                                 <Col md={6}>
//                                   <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                     <span className="d-flex align-items-center gap-2">
//                                       Check-in pending
//                                       <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                     </span>

//                                     <span className="font-16 mb-0" >
//                                       {homeData?.today?.check_ins?.pending}
//                                     </span>
//                                   </p>
//                                 </Col>

//                                 <Col md={12}>
//                                   <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                     <span className="d-flex align-items-center gap-2">
//                                       No Show
//                                       <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                     </span>

//                                     <span className="font-16 mb-0" >
//                                       {homeData?.today?.check_ins?.no_show}
//                                     </span>
//                                   </p>
//                                 </Col>
//                               </Row>

//                             </div>
//                           </Col>


//                           <Col md={6}>
//                             <div className="today-checkin">
//                               <h3 style={{}} >{homeData?.today?.check_outs?.total}</h3>
//                               <p className="d-flex align-items-center gap-2" >Today’s Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

//                               <Row>
//                                 <Col md={12}>
//                                   <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                     <span className="d-flex align-items-center gap-2">
//                                       Checked out
//                                       <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                     </span>

//                                     <span className="font-16 mb-0" >
//                                       {homeData?.today?.check_outs?.checked_out}
//                                     </span>
//                                   </p>
//                                 </Col>


//                                 <Col md={12}>
//                                   <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
//                                     <span className="d-flex align-items-center gap-2">
//                                       Checkout pending
//                                       <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
//                                     </span>

//                                     <span className="font-16 mb-0" >
//                                       {homeData?.today?.check_outs?.pending}
//                                     </span>
//                                   </p>
//                                 </Col>
//                               </Row>

//                             </div>
//                           </Col>
//                         </Row>

//                       </div>

//                     </Col>

//                   </Row>

//                   <Button variant="" onClick={goToResult} className="complete-form-btn w-100 mt-3">Show Check-in Checkout Snapshot</Button>

//                 </div>


//                 <hr style={{ margin: '40px 0 ' }} ></hr>

//               </Col>

//               <Col md={12}>
//                 <div className="d-flex justify-between">
//                   <p className="font-20 fw-medium">Active guest map</p>


//                   <p className="d-flex gap-2 align-center " style={{ lineHeight: '24px', cursor: 'pointer' }} onClick={toggleGuestMap}>
//                     <Image src="/images/icons/bottom-arrow.svg" style={{ transform: isMapMinimized ? 'rotate(0deg)' : 'rotate(180deg)' }} width={12} height={12} alt="down" />
//                     {isMapMinimized ? 'Show guest map' : 'Minimize guest map'}
//                   </p>
//                 </div>

//                 {!isMapMinimized && (
//                   <div className="guest-maps mt-4">

//                     <div className="guest-wrapper">
//                       {/* <h2 className="guest-title">{activeGuest?.guests?.length} guests</h2> */}

//                       <h2 className="guest-title">
//                         {activeGuest?.total_active_guests ?? activeGuest?.guests?.length} guests
//                       </h2>

//                       <div className='search-box mb-4'>
//                         <input type='text' placeholder='Search for guests or property' className='form-control' />
//                         <button className='btn btn-search'>
//                           <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
//                         </button>
//                       </div>

//                       <div className="guest-list">
//                         {activeGuest?.guests?.map((guest, index) => (
//                           <div className="guest-item" key={index}
//                             onClick={() => setSelectedProperty({
//                               latitude: guest.latitude,
//                               longitude: guest.longitude,
//                               property_uid: guest.property_uid,
//                             })}
//                             style={{ cursor: 'pointer' }}
//                           >
//                             <img
//                               // src={`https://alicedevapi.casamelhor.in${guest.guest_photo}`}
//                               src={
//                                 guest.guest_photo
//                                   ? `${BASE_URL}${guest.guest_photo}`
//                                   : "/images/icons/No-Image.svg"
//                               }
//                               alt={guest.guest_name} className="guest-img" />

//                             <div className="guest-info">
//                               <h4>{guest.guest_name}</h4>
//                               <p>
//                                 {formatDateRangeDashboard(guest.check_in_date, guest?.check_out_date)}, {calculateNights(guest.check_in_date, guest?.check_out_date)} nights | <span>{guest.property_name}</span>
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                     </div>
//                     <div className="guest-maps-img">
//                       {/* <Image src='./images/icons/map.jpg' className="img-fluid" alt="map" width={300} height={200} /> */}
//                       <MapView locations={activeGuest?.property_locations} selectedProperty={selectedProperty} />
//                     </div>
//                   </div>
//                 )}

//                 <hr style={{ margin: '40px 0 ' }} ></hr>

//               </Col>

//               <Col md={12}>
//                 <div className="occ-block">

//                   <div className="occ-header">


//                     <div className="occ-tab-box">
//                       <p className="title font-20 fw-medium">Occupancy snapshot</p>
//                       <Tabs
//                         defaultActiveKey="daily"
//                         id="occ-tabs"
//                         className="tab-buttons"
//                         onSelect={(e) => setActiveOccupancy(e)}
//                       >
//                         <Tab eventKey="daily" title="Daily">
//                           <div className="occ-content">
//                             <p className="font-16 fw-medium" >Daily Occupancy</p>
//                             <p>{convertDatewithNotComma(homeData?.occupancy_snapshot?.daily?.date)}</p>

//                             <Row>
//                               <Col md={8}>
//                                 <Row>
//                                   <Col md={6}>
//                                     <div className="property-block">
//                                       <h3 className="" >{homeData?.occupancy_snapshot?.daily?.guests_at_property}</h3>
//                                       <p>Guest at the property</p>
//                                     </div>
//                                   </Col>

//                                   <Col md={6}>
//                                     <div className="property-block">
//                                       <h3 className="" >{homeData?.occupancy_snapshot?.daily?.rooms_occupied}</h3>
//                                       <p>Rooms occupied</p>
//                                     </div>
//                                   </Col>
//                                   <Col md={6}>
//                                     <div className="property-block">
//                                       <h3 className="" >{homeData?.occupancy_snapshot?.daily?.rooms_available}</h3>
//                                       <p>Rooms available</p>
//                                     </div>
//                                   </Col>
//                                   <Col md={6}>
//                                     <div className="property-block">
//                                       <h3 className="" >{homeData?.occupancy_snapshot?.daily?.rooms_blocked}</h3>
//                                       <p>Rooms blocked</p>
//                                     </div>
//                                   </Col>
//                                 </Row>

//                                 <div className="clearfix"></div>
//                                 <Link href={`./Occupancyreport?view=${activeOccupancy}`} className="show-occupancy-btn font-16 mt-4" style={{ textDecoration: 'none' }} >
//                                   Show Occupancy Report
//                                 </Link>

//                               </Col>

//                               <Col md={4}>
//                                 <div className="donut-wrapper">
//                                   <PieChart width={320} height={320}>
//                                     <Pie
//                                       data={data}
//                                       dataKey="value"
//                                       cx="50%"
//                                       cy="50%"
//                                       innerRadius={100}
//                                       outerRadius={160}
//                                       startAngle={90}
//                                       endAngle={-270} // rotates chart to match screenshot
//                                       paddingAngle={2}
//                                     >
//                                       {data?.map((entry, index) => (
//                                         <Cell key={index} fill={COLORS[index]} stroke="none" />
//                                       ))}
//                                     </Pie>
//                                   </PieChart>

//                                   <div className="center-info">
//                                     <Image src='./images/icons/holiday_village.svg' className="img-fluid" alt="village" width={24} height={24} />
//                                     {/* <Home size={22} color="#6a5644" /> */}
//                                     <h2>{homeData?.occupancy_snapshot?.daily?.occupancy_percentage}%</h2>
//                                     <p>Occupancy</p>
//                                   </div>
//                                 </div>
//                               </Col>
//                             </Row>

//                           </div>
//                         </Tab>

//                         <Tab eventKey="monthly" title="Monthly">
//                           <div className="occ-content">
//                             <p className=" font-16 mb-3" >Monthly Occupancy</p>
//                             <h3>You had <span style={{ background: '#24F260' }} > {homeData?.occupancy_snapshot?.monthly?.avg_occupancy_percentage}% </span> occupancy in  <br></br>{homeData?.occupancy_snapshot?.monthly?.month_name} {homeData?.occupancy_snapshot?.monthly?.year}.</h3>


//                             <div className="monthly-wrapper">


//                               {/* Bar Chart */}
//                               <div className="chart-container">
//                                 {/* <ResponsiveContainer width="100%" height={260}>
//                                   <BarChart data={data1} barSize={38}>
//                                     <CartesianGrid
//                                       stroke="#efe8e3"
//                                       vertical={false}
//                                       strokeDasharray="0"
//                                     />

//                                     <XAxis
//                                       dataKey="name"
//                                       type="category"
//                                       ticks={months}
//                                       axisLine={false}
//                                       tickLine={false}
//                                       tick={{ fill: "#6b645e", fontSize: 13 }}
//                                     />

//                                     <YAxis
//                                       domain={[0, 100]}
//                                       ticks={[0, 25, 50, 75, 100]}
//                                       tick={{ fill: "#a9a39e", fontSize: 12 }}
//                                       axisLine={false}
//                                       tickLine={false}
//                                     />

//                                     <Tooltip cursor={{ fill: "#f4f0ec" }} />

//                                     <Bar
//                                       dataKey="value"
//                                       shape={(props) => {
//                                         const { x, y, width, height, payload } = props;

//                                         // Active month (July)
//                                         if (payload.active) {
//                                           return (
//                                             <rect
//                                               x={x}
//                                               y={y}
//                                               width={width}
//                                               height={height}
//                                               fill="#259c3f"
//                                               stroke="#3a2b22"
//                                               strokeWidth={0}
//                                               rx={0}
//                                             />
//                                           );
//                                         }

//                                         // Future month (August dotted outline)
//                                         if (payload.future) {
//                                           return (
//                                             <rect
//                                               x={x}
//                                               y={210}
//                                               width={width}
//                                               height={4}
//                                               fill="none"
//                                               stroke="#259c3f"
//                                               strokeDasharray="4 4"
//                                               rx={0}
//                                             />
//                                           );
//                                         }

//                                         // Default months
//                                         return (
//                                           <rect
//                                             x={x}
//                                             y={y}
//                                             width={width}
//                                             height={height}
//                                             fill="#259c3f"
//                                             rx={0}
//                                           />
//                                         );
//                                       }}
//                                     />
//                                   </BarChart>
//                                 </ResponsiveContainer> */}
//                                 <ResponsiveContainer width="100%" height={260}>
//                                   <BarChart data={monthly_data} barSize={38}>
//                                     <CartesianGrid
//                                       stroke="#efe8e3"
//                                       vertical={false}
//                                       strokeDasharray="0"
//                                     />

//                                     <XAxis
//                                       dataKey="name"
//                                       ticks={months_result}
//                                       axisLine={false}
//                                       tickLine={false}
//                                       tick={{ fill: "#6b645e", fontSize: 13 }}
//                                     />

//                                     <YAxis
//                                       domain={[0, 100]}
//                                       ticks={[0, 25, 50, 75, 100]}
//                                       tick={{ fill: "#a9a39e", fontSize: 12 }}
//                                       axisLine={false}
//                                       tickLine={false}
//                                     />

//                                     <Tooltip cursor={{ fill: "#f4f0ec" }} />

//                                     <Bar
//                                       dataKey="value"
//                                       shape={(props) => {
//                                         const { x, y, width, height, payload } = props;

//                                         if (payload.active) {
//                                           return (
//                                             <rect
//                                               x={x}
//                                               y={y}
//                                               width={width}
//                                               height={height}
//                                               fill="#259c3f"
//                                             />
//                                           );
//                                         }

//                                         if (payload.future) {
//                                           return (
//                                             <rect
//                                               x={x}
//                                               y={210}
//                                               width={width}
//                                               height={4}
//                                               fill="none"
//                                               stroke="#259c3f"
//                                               strokeDasharray="4 4"
//                                             />
//                                           );
//                                         }

//                                         return (
//                                           <rect
//                                             x={x}
//                                             y={y}
//                                             width={width}
//                                             height={height}
//                                             fill="#259c3f"
//                                           />
//                                         );
//                                       }}
//                                     />
//                                   </BarChart>
//                                 </ResponsiveContainer>
//                               </div>


//                             </div>
//                             {/* Bottom Stats */}
//                             <div className="chart-stats justify-start mb-4">
//                               <div className="stat-card">
//                                 <p className="label">Nights booked</p>
//                                 <h3>{homeData?.occupancy_snapshot?.monthly?.consumed_room_nights}</h3>
//                                 <p className="sub">of {homeData?.occupancy_snapshot?.monthly?.total_room_nights} room nights</p>
//                               </div>

//                               <div className="stat-card">
//                                 <p className="label">Blocked rooms</p>
//                                 <h3>{homeData?.occupancy_snapshot?.monthly?.blocked_room_nights}</h3>
//                               </div>
//                             </div>

//                             <div className="clearfix"></div>

//                             <Link href={`./Monthlyoccupanyreport?view=${activeOccupancy}`} className="show-occupancy-btn font-16 mt-4" style={{ textDecoration: 'none' }} >
//                               Show Occupancy Report
//                             </Link>

//                           </div>
//                         </Tab>
//                       </Tabs>
//                     </div>
//                   </div>
//                 </div>



//                 <hr style={{ margin: '40px 0 ' }} ></hr>
//               </Col>




//               <Col md={12}>
//                 <div className="d-flex align-items-center gap-2">
//                   <p className="title font-20 fw-medium mb-0">Performance stats</p>

//                   <Select placeholder="Select Months" className="react_selectbox" options={monthOption} value={monthOption.find(val => val.value == performanceStat)} isSearchable={false} onChange={(e) => setPerformanceStat(e.value)} styles={customStyles} />
//                 </div>
//                 <div className="occ-tab-box">


//                   <div className="chart-stats">
//                     <div className="stat-card">
//                       <p className="label">Nights booked</p>
//                       <h3>{homeData?.performance_stats?.[performanceStat]?.consumed_room_nights}</h3>
//                       <p className="sub">of {homeData?.performance_stats?.[performanceStat]?.usable_room_nights} room nights</p>
//                     </div>

//                     <div className="stat-card">
//                       <p className="label">Avg night stay</p>
//                       <h3>{homeData?.performance_stats?.[performanceStat]?.avg_nights_per_stay}</h3>
//                     </div>

//                     <div className="stat-card">
//                       <p className="label">Avg booking window</p>
//                       <h3>{homeData?.performance_stats?.[performanceStat]?.avg_booking_window_days} days</h3>
//                     </div>

//                     <div className="stat-card">
//                       <p className="label">Top destination</p>
//                       <h3>{homeData?.performance_stats?.[performanceStat]?.top_destination}</h3>
//                       <p>with {homeData?.performance_stats?.[performanceStat]?.occupancy_percentage} occupancy</p>
//                     </div>

//                     <div className="stat-card">
//                       <p className="label">Top booked BR</p>
//                       <h3>{homeData?.performance_stats?.[performanceStat]?.top_booked_br?.property_name}</h3>
//                       <p>with {homeData?.performance_stats?.[performanceStat]?.top_booked_br?.booking_count} occupancy</p>
//                     </div>
//                   </div>
//                 </div>

//                 <hr style={{ margin: '40px 0 ' }} ></hr>
//               </Col>


//               <Col md={12}>
//                 <div className="d-flex align-items-center gap-2 pb-2">
//                   <p className="title font-20 fw-medium mb-0">Distribution analytics</p>

//                   <Select placeholder="Select Months" className="react_selectbox" options={monthOption} value={monthOption.find(val => val.value == distAnlt)} onChange={handleDistrubution} isSearchable={false} styles={customStyles} />
//                 </div>


//                 <div className="occ-content mt-4" style={{ background: '#f2f2f2', padding: '24px 16px', border: '1px solid #4635271F' }} >
//                   <p className=" font-16 mb-3" >Over the past {homeData?.distribution_analytics?.[distAnlt]?.period_months} {homeData?.distribution_analytics?.[distAnlt]?.period_months == 1 ? 'month' : 'months'}, with most of the usage coming from <span className="text-white" style={{ background: '#A969DA' }} >{homeData?.distribution_analytics?.[distAnlt]?.group_by}.</span> </p>



//                   {/* Bottom Stats */}
//                   <div style={{ display: "flex", alignItems: "center", gap: "40px", justifyContent: 'center' }}>

//                     {/* Donut Chart */}
//                     <div style={{ width: "350px", height: "350px" }}>
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={distributeData}
//                             dataKey="value"
//                             nameKey="name"
//                             innerRadius={90}
//                             outerRadius={140}
//                             paddingAngle={1}
//                           >
//                             {distributeData?.map((entry, index) => (
//                               <Cell key={index} fill={entry.color} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>

//                       {/* Center Text */}
//                       <div
//                         style={{
//                           position: "relative",
//                           marginTop: "-200px",
//                           textAlign: "center",

//                         }}
//                       >
//                         <h2 style={{ margin: 0, fontSize: "40px", color: "#4A3F2A" }}>
//                           {homeData?.distribution_analytics?.[distAnlt]?.total_bookings}
//                         </h2>
//                         <p style={{ margin: 0, marginTop: "-5px", color: "#4A3F2A" }}>
//                           Total bookings
//                         </p>
//                       </div>
//                     </div>

//                     {/* Legend Section */}
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
//                       {distributeData?.map((item, index) => (
//                         <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                           <span
//                             style={{
//                               width: "12px",
//                               height: "12px",
//                               borderRadius: "50%",
//                               background: item.color,
//                             }}
//                           ></span>
//                           <span style={{ color: "#444" }}>
//                             {item.name} {item.value}%
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>



//                 </div>

//                 <hr style={{ margin: '40px 0 ' }} ></hr>
//               </Col>


//               <Col md={12}>
//                 <p className="title font-20 fw-medium mb-0">Feedback insights</p>


//                 <div className="review-wrapper mt-4">
//                   {/* Left Section */}
//                   <div className="overall-rating-box">
//                     <div className="rating-header">
//                       <FaStar className="star" />
//                       <h2>{feedbackInsights?.overall_rating}</h2>
//                     </div>

//                     <p className="section-title">Overall rating</p>

//                     {ratings.map((item, i) => (
//                       <div key={i} className="rating-row">
//                         <span>{item.label}</span>
//                         <div className="rating-value">
//                           <FaStar className="star" />
//                           <span>{item?.value}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Right Section */}
//                   <div className="recent-reviews-box">
//                     <p className="title font-20 fw-medium mb-3">Recent reviews</p>


//                     {/* Slider */}

//                     <div className="slider-container">
//                       <div
//                         className="slider-track"
//                         style={{
//                           transform: `translateX(-${index * 50}%)`, // 2 cards per view = 50%
//                         }}
//                       >
//                         {feedbackInsights?.recent_reviews?.map((item, i) => (
//                           <div key={i} className="review-card">
//                             <div className="review-header border-bottom-custom">
//                               <div>
//                                 <p className="font-16" >{item?.guest_name}</p>
//                                 <p className="meta">
//                                   {convertDatewith(item?.reviewed_at)} · {item?.property_name}
//                                 </p>
//                               </div>

//                               <img
//                                 // src={item?.guest_photo ? item?.guest_photo : '/images/icons/book-user-1.png'} 
//                                 src={
//                                   item.guest_photo
//                                     ? `${BASE_URL}${item.guest_photo}`
//                                     : "/images/icons/No-Image.svg"
//                                 }

//                                 alt="" className="review-img" />
//                             </div>

//                             <div className="review-rating">
//                               <span>Overall rating</span>
//                               <FaStar className="star" />
//                               <span>{item?.overall_rating}</span>
//                             </div>

//                             <p className="review-text">{item?.public_review}</p>

//                             <a href="#" onClick={(e) => filterShow(e, item)} className="review-link">
//                               Read Review
//                             </a>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Navigation Arrows */}
//                     <div className="slider-nav">
//                       <button
//                         className={`nav-btn ${index === 0 ? "disabled" : ""}`}
//                         disabled={index === 0 ? true : false}
//                         onClick={prevSlide}
//                       >
//                         <FaChevronLeft />
//                       </button>

//                       <button
//                         className={`nav-btn ${index === feedbackInsights?.recent_reviews?.length - 2 ? "disabled" : ""
//                           }`}
//                         disabled={index === feedbackInsights?.recent_reviews?.length - 2 ? true : false}
//                         onClick={nextSlide}
//                       >
//                         <FaChevronRight />
//                       </button>
//                     </div>

//                     <Link href='./Reviews' className="show-btn show-occupancy-btn d-table">Show All {feedbackInsights?.total_reviews} Reviews</Link>
//                   </div>
//                 </div>

//                 <hr style={{ margin: '40px 0 ' }} ></hr>
//               </Col>


//               <Col md={12}>
//                 <p className="title font-20 fw-medium mb-0">Year-To-Date top performer analysis</p>

//                 {/* <p>1 Jan – 5 Aug, 2025</p> */}
//                 <p>{formatDateRangeDashboard(homeData?.top_performers?.period?.start_date, homeData?.top_performers?.period?.end_date)}</p>



//                 <div className="occ-content mt-4 " style={{ padding: '24px 16px', background: '#f2f2f2', border: '1px solid #4635271F' }} >
//                   <h3>Star booking managers</h3>

//                   <Table className='employee-table company-table' responsive>
//                     <thead>
//                       <tr>
//                         <th  > <div className="mwid-35">Booking manager name</div> </th>
//                         <th  ><div className="mwid-20">Nights booked	</div></th>

//                       </tr>
//                     </thead>
//                     <tbody>
//                       {homeData?.top_performers?.star_booking_managers?.map((val, ind) => (
//                         <tr key={ind}>
//                           <td>
//                             <div className="booiing-user d-flex align-items-center gap-3">
//                               <Image
//                                 // src={val?.profile_image ? val?.profile_image : './images/icons/employee-pic.jpg'} 
//                                 src={
//                                   val.profile_image
//                                     ? `${BASE_URL}${val.profile_image}`
//                                     : "/images/icons/No-Image.svg"
//                                 }
//                                 className="img-fluid" alt="user" width={56} height={56} />
//                               <div className="user-names">
//                                 <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
//                                 <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >{val?.name}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td>{val?.bookings_created}</td>
//                         </tr>
//                       ))}

//                       {/* <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Druv</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>3</td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Druv</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>3</td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Druv</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>3</td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Druv</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>3</td>
//                       </tr> */}

//                     </tbody>

//                   </Table>
//                 </div>



//                 <div className="occ-content mt-4 " style={{ padding: '24px 16px', background: '#f2f2f2', border: '1px solid #4635271F' }} >
//                   <h3>Caretaker performance</h3>

//                   <Table className='employee-table company-table' responsive>
//                     <thead>
//                       <tr>
//                         <th  > <div className="mwid-35">Caretaker name</div> </th>
//                         <th  ><div className="mwid-20">BR name	</div></th>

//                         <th  ><div className="mwid-20">Overall ratings	</div></th>

//                       </tr>
//                     </thead>
//                     <tbody>
//                       {homeData?.top_performers?.caretaker_performance?.map((item, idx) => (
//                         <tr key={idx}>
//                           <td>
//                             <div className="booiing-user d-flex align-items-center gap-3">
//                               <Image src={item?.profile_image ? `https://alicedevapi.casamelhor.in${item?.profile_image}` : './images/icons/caretaker-img.jpg'} className="img-fluid" alt="user" width={56} height={56} />
//                               <div className="user-names">
//                                 <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
//                                 <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >{item?.name}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td>{item?.assigned_properties?.[0]}</td>

//                           <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   {item?.avg_rating}</span> </td>
//                         </tr>
//                       ))}



//                       {/* <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/caretaker-img.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Swami Iyer</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>CasaMelhor Areca Exotica</td>

//                         <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   4.54</span> </td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/caretaker-img.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Swami Iyer</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>CasaMelhor Areca Exotica</td>

//                         <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   4.54</span> </td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/caretaker-img.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Swami Iyer</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>CasaMelhor Areca Exotica</td>

//                         <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   4.54</span> </td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/caretaker-img.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Swami Iyer</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>CasaMelhor Areca Exotica</td>

//                         <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   4.54</span> </td>
//                       </tr> */}

//                     </tbody>

//                   </Table>
//                 </div>



//                 <div className="occ-content mt-4 " style={{ padding: '24px 16px', background: '#f2f2f2', border: '1px solid #4635271F' }} >
//                   <h3>Frequent travelers</h3>

//                   <Table className='employee-table company-table' responsive>
//                     <thead>
//                       <tr>
//                         <th  > <div className="mwid-35">Travelers name</div> </th>
//                         <th  ><div className="mwid-20">Trips made	</div></th>
//                         <th  ><div className="mwid-20">Nights booked		</div></th>
//                         <th  ><div className="mwid-20">Avg night stay	</div></th>


//                       </tr>
//                     </thead>
//                     <tbody>
//                       {homeData?.top_performers?.frequent_travelers?.map((val, ind) => (
//                         <tr key={ind}>
//                           <td>
//                             <div className="booiing-user d-flex align-items-center gap-3">
//                               <Image
//                                 // src='./images/icons/employee-pic.jpg'
//                                 src={
//                                   val.profile_image
//                                     ? `${BASE_URL}${val.profile_image}`
//                                     : "/images/icons/No-Image.svg"
//                                 }
//                                 className="img-fluid" alt="user" width={56} height={56} />
//                               <div className="user-names">

//                                 <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >{val?.name}</p>
//                                 <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > {val?.department}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td>{val?.booking_count}</td>
//                           <td>{val?.total_nights}</td>
//                           <td>{val?.avg_stay}</td>
//                         </tr>
//                       ))}



//                       {/* <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">

//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Shuban Leena</p>
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > Sales</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>3</td>
//                         <td>3</td>
//                         <td>2.5</td>
//                       </tr>

//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">

//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Shuban Leena</p>
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > Sales</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>3</td>
//                         <td>3</td>
//                         <td>2.5</td>
//                       </tr>


//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">

//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Shuban Leena</p>
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > Sales</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>3</td>
//                         <td>3</td>
//                         <td>2.5</td>
//                       </tr>
//                       <tr>
//                         <td>
//                           <div className="booiing-user d-flex align-items-center gap-3">
//                             <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
//                             <div className="user-names">

//                               <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Shuban Leena</p>
//                               <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > Sales</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td>3</td>
//                         <td>3</td>
//                         <td>2.5</td>
//                       </tr> */}



//                     </tbody>

//                   </Table>
//                 </div>




//               </Col>

//               <Col md={12}>
//                 <hr style={{ margin: '40px 0 ' }} ></hr>

//                 <p className="title font-20 fw-medium mb-4">CasaMelhor Emergency contacts</p>

//                 <Row>
//                   <Col md={4}>
//                     <div className="emergency-contact">
//                       <Image src='./images/icons/young-boy.jpg' className="img-fluid mb-3" alt="conatct-person" width={64} height={64} />
//                       <p>Operations Manager</p>
//                       <h4>Pradeep Bangari</h4>

//                       <div className="d-flex gap-2">
//                         <p className="d-flex gap-2 mb-0" ><Image src='./images/icons/email.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >pradeep@casamelhor.in</Link> </p>
//                         <p className="d-flex gap-2 mb-0"><Image src='./images/icons/call.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >+91 8956245327</Link> </p>
//                       </div>
//                     </div>
//                   </Col>


//                   <Col md={4}>
//                     <div className="emergency-contact">
//                       <Image src='./images/icons/young-boy.jpg' className="img-fluid mb-3" alt="conatct-person" width={64} height={64} />
//                       <p>Accounts Manager</p>
//                       <h4>Sukhdev Mangoankar</h4>

//                       <div className="d-flex gap-2">
//                         <p className="d-flex gap-2 mb-0" ><Image src='./images/icons/email.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >accounts@casamelhor.in</Link> </p>
//                         <p className="d-flex gap-2 mb-0"><Image src='./images/icons/call.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >+91 7387077551</Link> </p>
//                       </div>
//                     </div>
//                   </Col>


//                   <Col md={4}>
//                     <div className="emergency-contact">
//                       <Image src='./images/icons/young-boy.jpg' className="img-fluid mb-3" alt="conatct-person" width={64} height={64} />
//                       <p>Tech Manager</p>
//                       <h4>Rajdatta Sawant</h4>

//                       <div className="d-flex gap-2">
//                         <p className="d-flex gap-2 mb-0" ><Image src='./images/icons/email.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >rajdatta@casamelhor.in</Link> </p>
//                         <p className="d-flex gap-2 mb-0"><Image src='./images/icons/call.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >+91 8956381955</Link> </p>
//                       </div>
//                     </div>
//                   </Col>
//                 </Row>


//               </Col>

//             </Row>
//           </Container>
//         </div>
//       </ProtectedRoute>


//       {/*  */}


//       <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
//         <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
//           <Modal.Title className='d-flex align-items-center gap-3'>
//             Read review
//           </Modal.Title>
//           <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
//         </Modal.Header>
//         <Modal.Body className='pt-4 pb-4'>
//           <div className="room-details-modal">
//             <div className="review-details-wrapper">

//               {/* ===== TOP SECTION ===== */}
//               <Card className="review-card-top  mb-3">
//                 <Card.Body className="p-3">
//                   <Row className="align-items-center">
//                     <Col xs={12}>
//                       <div className='d-flex align-items-center gap-2 mb-3'>
//                         <p className="room-title  mb-0 fw-medium ">{guestReview?.room_name} <span className="text-muted"> </span>{guestReview?.bed_name ? `| ${guestReview?.bed_name}` : ''}</p>
//                         <span className="text-muted"> | </span>  <p className="room-title  mb-0 fw-medium ">{guestReview?.property_name}</p>

//                       </div>
//                     </Col>

//                     <Col xs={12} className=" d-flex justify-between">


//                       <p className="reviewer-name mb-0 fw-medium">{guestReview?.guest_name} review <br></br>  of your BR</p>

//                       <Image
//                         // src={guestReview?.guest_photo || "/images/icons/profile-pic.jpg"}
//                         src={
//                           guestReview?.guest_photo
//                             ? `${BASE_URL}${guestReview?.guest_photo}`
//                             : "/images/icons/No-Image.svg"
//                         }
//                         width={55}
//                         height={55}
//                         className="profile-img "
//                         alt="Guest"
//                       />
//                     </Col>
//                   </Row>

//                   <Row className="review-meta mt-3 g-3">
//                     <Col xs={2} className="border-end">
//                       <p className="meta-title mb-0 fw-medium d-flex">{guestReview?.room_name}</p>
//                     </Col>
//                     <Col xs={5} className="border-end">
//                       <p className="meta-title mb-0 fw-medium d-flex align-center font-16">{getDiffDate(guestReview?.stay_dates)} <br /><span className="text-muted small">{getDifwithNight(guestReview?.stay_dates)} nights</span></p>
//                     </Col>
//                     <Col xs={5}>
//                       <p className="meta-title mb-0 fw-medium d-flex align-center font-16">Booking Id <br /><span className="id-no fw-bold">{guestReview?.booking_number}</span></p>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>

//               {/* ===== OVERALL RATING ===== */}



//               {/* ===== CATEGORY RATINGS (Expandable Items) ===== */}

//               <Card className="expand-card mb-3">
//                 <Card.Body

//                   className="expand-header d-flex justify-content-between align-items-center p-3"
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <p className="category-label mb-0 ">Overall rating</p>

//                   <div className="d-flex align-items-center gap-2">
//                     <div className="rating-box d-flex align-items-center gap-1">
//                       <Image src="/images/icons/Star-green.svg" width={24} height={24} alt="rating" />
//                       <span className="rating-sub-value ">{guestReview?.overall_rating}</span>
//                     </div>
//                     {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
//                   </div>
//                 </Card.Body>






//               </Card>


//               <Card className="expand-card mb-3">
//                 <Card.Body
//                   className="expand-headerw  p-3"
//                   style={{ cursor: 'pointer' }}
//                 >

//                   <div className='d-flex justify-content-between align-items-center mb-3'>
//                     <p className="category-label mb-0 ">Public Review</p>

//                     <div className="d-flex align-items-center gap-2">
//                       <div className="rating-box d-flex align-items-center gap-1">
//                         <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
//                         <span className="rating-sub-value ">4.5</span>
//                       </div>
//                       {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
//                     </div>

//                   </div>

//                   <div className='flex-column'>
//                     <p>{guestReview?.public_review}
//                       {/* The place was adorable and spotless. It showered before I got there and Ramesh cleared a parking spot for me, which was very kind. Quick responses, great-smelling soaps, and a perfect location. Can’t recomend enough! */}
//                     </p>
//                   </div>
//                 </Card.Body>






//               </Card>

//               <Card className="expand-card mb-3">
//                 <Card.Body

//                   className="expand-header d-flex justify-content-between align-items-center p-3"
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <p className="category-label mb-0 ">Cleanliness</p>

//                   <div className="d-flex align-items-center gap-2">
//                     <div className="rating-box d-flex align-items-center gap-1">
//                       <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
//                       <span className="rating-sub-value ">{guestReview?.cleanliness_rating}</span>
//                     </div>
//                     {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
//                   </div>
//                 </Card.Body>






//               </Card>

//               <Card className="expand-card mb-3">
//                 <Card.Body

//                   className="expand-header d-flex justify-content-between align-items-center p-3"
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <p className="category-label mb-0 ">Food quality</p>

//                   <div className="d-flex align-items-center gap-2">
//                     <div className="rating-box d-flex align-items-center gap-1">
//                       <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
//                       <span className="rating-sub-value ">{guestReview?.food_quality_rating}</span>
//                     </div>
//                     {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
//                   </div>
//                 </Card.Body>






//               </Card>

//               <Card className="expand-card mb-3">
//                 <Card.Body

//                   className="expand-header d-flex justify-content-between align-items-center p-3"
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <p className="category-label mb-0 ">Staff hospitality</p>

//                   <div className="d-flex align-items-center gap-2">
//                     <div className="rating-box d-flex align-items-center gap-1">
//                       <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
//                       <span className="rating-sub-value ">{guestReview?.staff_hospitality_rating}</span>
//                     </div>
//                     {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
//                   </div>
//                 </Card.Body>






//               </Card>

//               <Card className="expand-card mb-3">
//                 <Card.Body

//                   className="expand-header d-flex justify-content-between align-items-center p-3"
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <p className="category-label mb-0 ">Location</p>

//                   <div className="d-flex align-items-center gap-2">
//                     <div className="rating-box d-flex align-items-center gap-1">
//                       <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
//                       <span className="rating-sub-value ">{guestReview?.location_rating}</span>
//                     </div>
//                     {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
//                   </div>
//                 </Card.Body>






//               </Card>

//               <Card className="expand-card mb-3">
//                 <Card.Body

//                   className="expand-header d-flex justify-content-between align-items-center p-3"
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <p className="category-label mb-0 ">Comfort</p>

//                   <div className="d-flex align-items-center gap-2">
//                     <div className="rating-box d-flex align-items-center gap-1">
//                       <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
//                       <span className="rating-sub-value ">{guestReview?.comfort_rating}</span>
//                     </div>
//                     {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
//                   </div>
//                 </Card.Body>






//               </Card>


//               <Card className="expand-card mb-3">
//                 <Card.Body
//                   className="expand-headerw  p-3"
//                   style={{ cursor: 'pointer' }}
//                   onClick={togglePrivateReview}
//                 >
//                   <div className='d-flex justify-content-between align-items-center '>
//                     <p className="category-label mb-0 ">Private Review</p>
//                     <div className="d-flex align-items-center gap-2">
//                       <div className="rating-box d-flex align-items-center gap-1">
//                         <Image
//                           src={privateExpanded ? "/images/icons/bottom-arrow.svg" : "/images/icons/bottom-arrow.svg"}
//                           width={18}
//                           height={18}
//                           alt="toggle"
//                           style={{ transition: 'transform 0.2s', transform: privateExpanded ? 'rotate(180deg)' : 'none' }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   {privateExpanded && (
//                     <div className='flex-column mt-3'>
//                       <p className='mb-0' >{guestReview?.private_feedback}
//                         {/* The place was adorable and spotless. It showered before I got there and Ramesh cleared a parking spot for me, which was very kind. Quick responses, great-smelling soaps, and a perfect location. Can’t recomend enough! */}
//                       </p>
//                     </div>
//                   )}
//                 </Card.Body>






//               </Card>




//               {/* DONE BUTTON */}


//             </div>
//           </div>
//         </Modal.Body>
//         <div className="modal-footer-border-top border-top p-4 " >
//           <div className="done-btn-wrapper m-0">
//             <Button className="done-btn w-100 py-2 fw-semibold" variant="primary" onClick={filterClose}>Done</Button>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };




// export default Dashboard;



"use client";

import React, { useEffect, useState } from "react";
import Header from '../Header/Header'
import ProtectedRoute from '../ProtectedRoute'
import { Col, Container, Row, Button, Tabs, Tab, Table, Card, Modal, Spinner } from "react-bootstrap";
import Image from "next/image";
import Select from "react-select";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import {
  PieChart, Pie, Cell, BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";


import Link from 'next/link';
import { ActiveGuestAPI, companyListAPI, DashboardAPI, FeedbackInsightsAPI, getCompanyPropertiesCitiesAPI, occupancyReportAPI, PermissionsCalAndDash, PropertyListFullApi } from "@/services/provider";
import { calculateNights, convertDatewith, convertDatewithNotComma, extractDates, formatDateRangeDashboard, formatYMD, getOneMonthBefore } from "@/utils/formatTime";
import dynamic from "next/dynamic";
import { getItemLocalStorage } from "@/utils/browserStorage";
const MapView = dynamic(() => import("./Map/PropertyDynamicMap"), {
  ssr: false,
})
// import MapView from "./Map/PropertyDynamicMap";


const Dashboard = () => {
  const router = useRouter();
  const [propertyList, setPropertyList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [CompanyListData, setCompanyListData] = useState([]);
  const [filterKeyHome, setFilterKeyHome] = useState({
    property: '', location: '', company: ''
  })
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [homeData, setHomeData] = useState({});
  const [performanceStat, setPerformanceStat] = useState('1_month');
  const [distributeData, setDistributeData] = useState([]);
  const [distAnlt, setDistAnlt] = useState('1_month');
  const [activeGuest, setActiveGuest] = useState({});
  const [feedbackInsights, setFeedbackInsights] = useState({});
  const [activeOccupancy, setActiveOccupancy] = useState('daily')
  const [isMapMinimized, setIsMapMinimized] = useState(false);
  const [noShowCountdown, setNoShowCountdown] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [permissionData, setPermissionData] = useState({});
  const loginData = JSON.parse(getItemLocalStorage("userLogin"));

  const toggleGuestMap = () => {
    setIsMapMinimized((prev) => !prev);
  };

  const goToResult = () => {
    // Close the modal first
    // removeTravel2(); // This should be your modal close function

    // Then navigate after a small delay to ensure modal is closed
    setTimeout(() => {
      router.push('/Checkinsnapshot');
    }, 100);
  };
  // -----------------------------
  // OPTIONS
  // -----------------------------


  const monthOption = [
    { value: "1_month", label: "Last 1 Month" },
    { value: "3_months", label: "Last 3 Month" },
    { value: "6_months", label: "Last 6 Month" },
    { value: "9_months", label: "Last 9 Month" },
    { value: "12_months", label: "Last 12 Month" },
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

  // const getTimeUntilMidnight = () => {
  //   const now = new Date();
  //   const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  //   const diff = midnight - now;
  //   if (diff <= 0) return '00h 00M 00S';
  //   const hours = Math.floor(diff / (1000 * 60 * 60));
  //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  //   return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
  // };
  const getTimeUntilNoShow = () => {
    const now = new Date();
    const todayDeadline = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 59, 0);

    const diff = todayDeadline - now;
    if (diff <= 0) return '00h 00M 00S';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
  };

  useEffect(() => {
    setNoShowCountdown(getTimeUntilNoShow());
    const interval = setInterval(() => {
      setNoShowCountdown(getTimeUntilNoShow());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   setNoShowCountdown(getTimeUntilNoShow());
  //   const interval = setInterval(() => {
  //     setNoShowCountdown(getTimeUntilNoShow());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // -----------------------------
  // SEARCH + DATA
  // -----------------------------
  // const [search, setSearch] = useState("");



  // -----------------------------
  // PIE CHART
  // -----------------------------  


  const data = homeData?.occupancy_snapshot?.daily?.br_summary?.slice(0, 6).map(property => ({
    name: property.property_name.substring(0, 15) + (property.property_name.length > 15 ? '...' : ''),
    value: property.rooms_available
    // value:property.occupancy_percentage
  }));

  const monthlyTrend = homeData?.occupancy_snapshot?.monthly?.monthly_trend; // your API data

  const currentMonth = new Date().getMonth() + 1; // 1–12
  const currentYear = new Date().getFullYear();

  const monthly_data = monthlyTrend?.map(item => ({
    name: item?.month_name?.slice(0, 3), // Feb, Mar, Apr
    value: Number(item.occupancy_percentage), // already in %
    active:
      item.year === currentYear && item.month === currentMonth,
    future:
      item.year > currentYear ||
      (item.year === currentYear && item.month > currentMonth),
  }));
  const months_result = monthly_data?.map(item => item.name);



  const COLORS = ["#259c3f", "#f9f4f1"];

  // -----------------------------
  // BAR CHART
  // -----------------------------

  const ColorDistribute = ["#A47FF6", "#7C7C7C", "#8740FF", "#FF5252", "#00C49F", "#00FF92", "#7ED6FF", "#000000", "#005EFF", "#4CAF50", "#FF8F00"]


  const ratings = [
    { label: "Cleanliness", value: feedbackInsights?.cleanliness_rating },
    { label: "Food quality", value: feedbackInsights?.food_quality_rating },
    { label: "Staff hospitality", value: feedbackInsights?.staff_hospitality_rating },
    { label: "Location", value: feedbackInsights?.location_rating },
  ];


  // -----------------------------
  // REVIEWS SECTION SLIDER
  // -----------------------------


  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    if (index < feedbackInsights?.recent_reviews?.length - 1) setIndex(index + 1);
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };


  const [filtermShow, filtersetShow] = useState(false);
  const [guestReview, setGuestReview] = useState({});
  const filterClose = () => filtersetShow(false);
  const filterShow = (e, val) => {
    e.preventDefault();
    filtersetShow(true);
    setGuestReview(val);
  };

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


  // 

  const [expanded, setExpanded] = useState({
    public: false,
    // clean: false,
    // food: false,
    // staff: false,
    // location: false
  });

  const toggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
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

  // Permission helper --------------------------------------------------
  // permissionData looks like:
  // { "dashboard.occupancy_daily": { allowed: true, scope: "ALL" }, ... }
  // Until the permissions API responds we don't know the real access yet,
  // so we default to `true` to avoid a content flash; once permissionData
  // is populated, the actual `allowed` flag decides visibility.
  const hasPermission = (key) => {
    if (!permissionData || Object.keys(permissionData).length === 0) return true;
    return permissionData?.[key]?.allowed === true;
  };

  // Dashboard-specific permission keys used across this page
  const DASHBOARD_PERMISSIONS = {
    view: "dashboard.view",
    snapshotGlance: "dashboard.snapshot_glance",
    checkinCheckoutSnapshot: "dashboard.checkin_checkout_snapshot",
    occupancyDaily: "dashboard.occupancy_daily",
    occupancyMonthly: "dashboard.occupancy_monthly",
    brSummary: "dashboard.br_summary",
    bookingDistribution: "dashboard.booking_distribution",
    topPerformers: "dashboard.top_performers",
  };

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //Dynamic Dashboard functionaliyt----------------------
  const getDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await DashboardAPI(formatYMD(getOneMonthBefore(new Date())), formatYMD(new Date()), filterKeyHome.property, filterKeyHome.location, filterKeyHome.company)
      if (response?.data?.success) {
        setIsLoading(false);
        setHomeData(response.data.response)
        setDistributeData(response?.data?.response?.distribution_analytics?.['1_month']?.distribution?.map((val, index) => ({
          name: val?.name,
          value: val?.booking_distribution_percentage,
          color: ColorDistribute[index]
        })))
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
  const getActiveGuestData = async () => {
    try {
      const response = await ActiveGuestAPI(filterKeyHome.property, filterKeyHome.company);
      if (response?.data?.success) {
        setActiveGuest(response.data.response)
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getFeedbackInsightsData = async () => {
    try {
      const response = await FeedbackInsightsAPI('12_months', filterKeyHome.property, filterKeyHome.company);
      if (response?.data?.success) {
        setFeedbackInsights(response.data.response)
      }
    } catch (error) {
      console.log(error);
    }
  }

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
  const getPropertiesList = async (pageNumber) => {
    try {
      if (loadingProperties) return;
      setLoadingProperties(true)
      const response = await PropertyListFullApi(10, pageNumber, filterKeyHome.company, filterKeyHome.location);
      if (response?.data?.success) {
        const list = response.data.response?.filter(val => val?.property_status !== "Draft" && val?.property_status !== "Inactive")?.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url }))
        setPropertyList(list);
        // setPropertyList([...propertyList, ...list])
        // const uniqueCities = [
        //   { city: "Jaipur" },
        //   ...Array.from(
        //     new Set(response.data.response.map(ele => ele.city)),
        //     city => ({ city })
        //   ).filter(item => item.city !== "Jaipur")
        // ];
        // const listCity = uniqueCities.map((cv) => ({ value: cv.city, label: cv.city }))
        // setCityList([...cityList, ...listCity])
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

  useEffect(()=>{
    if(filterKeyHome.company) getLocationOfProperty(filterKeyHome.company);
    getPropertiesList(page)
  },[filterKeyHome]);

  useEffect(() => {
    getPropertiesList(page)
    getCompanyList()
    getDashboardData()
    getActiveGuestData()
    getFeedbackInsightsData()
    DynamicPermission()
    if(loginData?.user_role?.role_name==='Company Admin') setFilterKeyHome({...filterKeyHome,company:loginData.company_uid})
  }, []);

  useEffect(() => {
    getDashboardData()
    getActiveGuestData()
    getFeedbackInsightsData()

  }, [filterKeyHome.property, filterKeyHome.location, filterKeyHome.company])

  const handleDistrubution = (e) => {
    const item = homeData?.distribution_analytics?.[e.value]
    setDistAnlt(e.value)

    const result = item.distribution?.map((val, index) => ({
      name: val?.name,
      value: val?.booking_distribution_percentage,
      color: ColorDistribute[index]
    }))
    setDistributeData(result)
  }

  const [privateExpanded, setPrivateExpanded] = useState(false);

  const togglePrivateReview = () => setPrivateExpanded((prev) => !prev);

  // console.log(homeData)
  // console.log(homeData?.distribution_analytics[distAnlt])
  // console.log(feedbackInsights)

  return (
    <>
      <ProtectedRoute>
        <Header />
        <div className="dashboardWrapper mb-4">
          <Container>
            {!hasPermission(DASHBOARD_PERMISSIONS.view) ? (
              <Row>
                <Col md={12}>
                  <div className="text-center py-5">
                    <p className="font-20 fw-medium mb-0">
                      You don’t have permission to view this dashboard.
                    </p>
                  </div>
                </Col>
              </Row>
            ) : (
              <>
                {isLoading ?
                  <Row>
                    <Col md={12}>
                      <div className="text-center py-5">
                        <Spinner />
                      </div>
                    </Col>
                  </Row> : (
                    <Row>

                      {/* FILTER ROW */}
                      <Col md={12}>
                        <div className="d-flex align-items-center justify-content-between mb-4 mt-4">
                          <div className="d-flex align-items-center gap-3">
                            <h2 className="page-title mb-0">Home</h2>


                          </div>

                          <div className="d-flex align-items-center gap-3">
                            <Select className="react_selectbox" placeholder="Company" options={CompanyListData} isSearchable={false} value={CompanyListData?.find(cv=>cv.value==filterKeyHome.company)} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, company: e.value })} styles={customStyles} />
                            <Select className="react_selectbox" placeholder="Location" options={cityList} value={cityList?.find(cv=>cv.value==filterKeyHome.location)} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, location: e.value })} styles={customStyles} />
                            <Select className="react_selectbox" placeholder="All Properties" options={propertyList} value={propertyList.find(cv=>cv.value==filterKeyHome.property)} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, property: e.value })} styles={customStyles} onMenuScrollToBottom={loadMoreProperties} />

                          </div>
                        </div>


                      </Col>

                      {hasPermission(DASHBOARD_PERMISSIONS.snapshotGlance) && (
                        <Col md={12}>
                          <div className="stats-record-dashboard">
                            <Row>
                              <Col md={3}>
                                <div className="prev-days">
                                  <p className="font-20" >Previous day(s)</p>
                                  {/* <p>4 Aug, 2025</p> */}
                                  <p>{convertDatewithNotComma(homeData?.yesterday?.date)}</p>
                                  <p>Bookings created <b> {homeData?.yesterday?.bookings_created}</b></p>

                                  <h3>{homeData?.yesterday?.check_ins?.pending}</h3>
                                  <p className="d-flex align-items-center gap-2" >Check-in pending <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span> </p>
                                  <p className='rounded mb-0 w-40' style={{ background: '#fff', fontSize: '14px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: 'Fitcontent', padding: '4px 6px' }} >No-show <span style={{ color: '#BF9039' }} >{noShowCountdown}</span> </p>

                                  <p className="d-flex justify-between align-items-center mt-3" style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                    <span className="d-flex align-items-center gap-2">
                                      No Show
                                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
                                    </span>

                                    <span className="font-16 mb-0" >
                                      {homeData?.yesterday?.check_ins?.no_show}
                                    </span>
                                  </p>
                                </div>

                              </Col>

                              <Col md={9}>
                                <div className="today-calendor">
                                  <div className="d-flex justify-between mb-2">
                                    <p className="font-20 mb-0" >Today</p>
                                    <p className="font-16 mb-0 gap-2" style={{ color: '#73615F' }} >Bookings created <span className="font-20 ms-2" >{homeData?.today?.bookings_created} </span></p>
                                  </div>
                                  <p className="font-14 mb-3" >{convertDatewithNotComma(homeData?.today?.date)}</p>

                                  <Row>
                                    <Col md={6}>
                                      <div className="today-checkin">
                                        <h3 style={{}} >{homeData?.today?.check_ins?.total}</h3>
                                        <p className="d-flex align-items-center gap-2" >{`Today's Check-ins`}  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3A8C8C', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

                                        <Row>
                                          <Col md={6}>
                                            <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                              <span className="d-flex align-items-center gap-2">
                                                Checked-in
                                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#165953', display: 'inline-flex', alignItems: 'center' }} ></span>
                                              </span>

                                              <span className="font-16 mb-0" >
                                                {homeData?.today?.check_ins?.checked_in}
                                              </span>
                                            </p>
                                          </Col>
                                          <Col md={6}>
                                            <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                              <span className="d-flex align-items-center gap-2">
                                                Check-in pending
                                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#5A8C37', display: 'inline-flex', alignItems: 'center' }} ></span>
                                              </span>

                                              <span className="font-16 mb-0" >
                                                {homeData?.today?.check_ins?.pending}
                                              </span>
                                            </p>
                                          </Col>

                                          <Col md={12}>
                                            <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                              <span className="d-flex align-items-center gap-2">
                                                No Show
                                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9D9D9D', display: 'inline-flex', alignItems: 'center' }} ></span>
                                              </span>

                                              <span className="font-16 mb-0" >
                                                {homeData?.today?.check_ins?.no_show}
                                              </span>
                                            </p>
                                          </Col>
                                        </Row>

                                      </div>
                                    </Col>


                                    <Col md={6}>
                                      <div className="today-checkin">
                                        <h3 style={{}} >{homeData?.today?.check_outs?.total}</h3>
                                        <p className="d-flex align-items-center gap-2" >Today’s Checkouts  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span> </p>

                                        <Row>
                                          <Col md={12}>
                                            <p className="d-flex justify-between align-items-center " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                              <span className="d-flex align-items-center gap-2">
                                                Checked out
                                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7F32CD', display: 'inline-flex', alignItems: 'center' }} ></span>
                                              </span>

                                              <span className="font-16 mb-0" >
                                                {homeData?.today?.check_outs?.checked_out}
                                              </span>
                                            </p>
                                          </Col>


                                          <Col md={12}>
                                            <p className="d-flex justify-between align-items-center mb-0 " style={{ border: '1px solid #4635271F', padding: '15px' }} >
                                              <span className="d-flex align-items-center gap-2">
                                                Checkout pending
                                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#A969DA', display: 'inline-flex', alignItems: 'center' }} ></span>
                                              </span>

                                              <span className="font-16 mb-0" >
                                                {homeData?.today?.check_outs?.pending}
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

                            {hasPermission(DASHBOARD_PERMISSIONS.checkinCheckoutSnapshot) && (
                              <Button variant="" onClick={goToResult} className="complete-form-btn w-100 mt-3">Show Check-in Checkout Snapshot</Button>
                            )}

                          </div>


                          <hr style={{ margin: '40px 0 ' }} ></hr>

                        </Col>
                      )}

                      <Col md={12}>
                        <div className="d-flex justify-between">
                          <p className="font-20 fw-medium">Active guest map</p>


                          <p className="d-flex gap-2 align-center " style={{ lineHeight: '24px', cursor: 'pointer' }} onClick={toggleGuestMap}>
                            <Image src="/images/icons/bottom-arrow.svg" style={{ transform: isMapMinimized ? 'rotate(0deg)' : 'rotate(180deg)' }} width={12} height={12} alt="down" />
                            {isMapMinimized ? 'Show guest map' : 'Minimize guest map'}
                          </p>
                        </div>

                        {!isMapMinimized && (
                          <div className="guest-maps mt-4">

                            <div className="guest-wrapper">
                              {/* <h2 className="guest-title">{activeGuest?.guests?.length} guests</h2> */}

                              <h2 className="guest-title">
                                {activeGuest?.total_active_guests ?? activeGuest?.guests?.length} guests
                              </h2>

                              <div className='search-box mb-4'>
                                <input type='text' placeholder='Search for guests or property' className='form-control' />
                                <button className='btn btn-search'>
                                  <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                                </button>
                              </div>

                              <div className="guest-list">
                                {activeGuest?.guests?.map((guest, index) => (
                                  <div className="guest-item" key={index}
                                    onClick={() => setSelectedProperty({
                                      latitude: guest.latitude,
                                      longitude: guest.longitude,
                                      property_uid: guest.property_uid,
                                    })}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <img
                                      src={
                                        guest.guest_photo
                                          ? `${guest.guest_photo}`
                                          : "/images/icons/No-Image.svg"
                                      }
                                      alt={guest.guest_name} className="guest-img" />

                                    <div className="guest-info">
                                      <h4>{guest.guest_name}</h4>
                                      <p>
                                        {formatDateRangeDashboard(guest.check_in_date, guest?.check_out_date)}, {calculateNights(guest.check_in_date, guest?.check_out_date)} nights | <span>{guest.property_name}</span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                            </div>
                            <div className="guest-maps-img">
                              {/* <Image src='./images/icons/map.jpg' className="img-fluid" alt="map" width={300} height={200} /> */}
                              <MapView locations={activeGuest?.property_locations} selectedProperty={selectedProperty} />
                            </div>
                          </div>
                        )}

                        <hr style={{ margin: '40px 0 ' }} ></hr>

                      </Col>

                      <Col md={12}>
                        <div className="occ-block">

                          <div className="occ-header">


                            <div className="occ-tab-box">
                              <p className="title font-20 fw-medium">Occupancy snapshot</p>
                              <Tabs
                                defaultActiveKey="daily"
                                id="occ-tabs"
                                className="tab-buttons"
                                onSelect={(e) => setActiveOccupancy(e)}
                              >
                                {hasPermission(DASHBOARD_PERMISSIONS.occupancyDaily) && (
                                  <Tab eventKey="daily" title="Daily">
                                    <div className="occ-content">
                                      <p className="font-16 fw-medium" >Daily Occupancy</p>
                                      <p>{convertDatewithNotComma(homeData?.occupancy_snapshot?.daily?.date)}</p>

                                      <Row>
                                        <Col md={8}>
                                          <Row>
                                            <Col md={6}>
                                              <div className="property-block">
                                                <h3 className="" >{homeData?.occupancy_snapshot?.daily?.guests_at_property}</h3>
                                                <p>Guest at the property</p>
                                              </div>
                                            </Col>

                                            <Col md={6}>
                                              <div className="property-block">
                                                <h3 className="" >{homeData?.occupancy_snapshot?.daily?.rooms_occupied}</h3>
                                                <p>Rooms occupied</p>
                                              </div>
                                            </Col>
                                            <Col md={6}>
                                              <div className="property-block">
                                                <h3 className="" >{homeData?.occupancy_snapshot?.daily?.rooms_available}</h3>
                                                <p>Rooms available</p>
                                              </div>
                                            </Col>
                                            <Col md={6}>
                                              <div className="property-block">
                                                <h3 className="" >{homeData?.occupancy_snapshot?.daily?.rooms_blocked}</h3>
                                                <p>Rooms blocked</p>
                                              </div>
                                            </Col>
                                          </Row>

                                          <div className="clearfix"></div>
                                          <Link href={`./Occupancyreport?view=${activeOccupancy}`} className="show-occupancy-btn font-16 mt-4" style={{ textDecoration: 'none' }} >
                                            Show Occupancy Report
                                          </Link>

                                        </Col>

                                        {hasPermission(DASHBOARD_PERMISSIONS.brSummary) && (
                                          <Col md={4}>
                                            <div className="donut-wrapper">
                                              <PieChart width={320} height={320}>
                                                <Pie
                                                  data={data}
                                                  dataKey="value"
                                                  cx="50%"
                                                  cy="50%"
                                                  innerRadius={100}
                                                  outerRadius={160}
                                                  startAngle={90}
                                                  endAngle={-270} // rotates chart to match screenshot
                                                  paddingAngle={2}
                                                >
                                                  {data?.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index]} stroke="none" />
                                                  ))}
                                                </Pie>
                                              </PieChart>

                                              <div className="center-info">
                                                <Image src='./images/icons/holiday_village.svg' className="img-fluid" alt="village" width={24} height={24} />
                                                {/* <Home size={22} color="#6a5644" /> */}
                                                <h2>{homeData?.occupancy_snapshot?.daily?.occupancy_percentage}%</h2>
                                                <p>Occupancy</p>
                                              </div>
                                            </div>
                                          </Col>
                                        )}
                                      </Row>

                                    </div>
                                  </Tab>
                                )}

                                {hasPermission(DASHBOARD_PERMISSIONS.occupancyMonthly) && (
                                  <Tab eventKey="monthly" title="Monthly">
                                    <div className="occ-content">
                                      <p className=" font-16 mb-3" >Monthly Occupancy</p>
                                      <h3>You had <span style={{ background: '#24F260' }} > {homeData?.occupancy_snapshot?.monthly?.avg_occupancy_percentage}% </span> occupancy in  <br></br>{homeData?.occupancy_snapshot?.monthly?.month_name} {homeData?.occupancy_snapshot?.monthly?.year}.</h3>


                                      <div className="monthly-wrapper">


                                        {/* Bar Chart */}
                                        <div className="chart-container">
                                          {/* <ResponsiveContainer width="100%" height={260}>
                                  <BarChart data={data1} barSize={38}>
                                    <CartesianGrid
                                      stroke="#efe8e3"
                                      vertical={false}
                                      strokeDasharray="0"
                                    />

                                    <XAxis
                                      dataKey="name"
                                      type="category"
                                      ticks={months}
                                      axisLine={false}
                                      tickLine={false}
                                      tick={{ fill: "#6b645e", fontSize: 13 }}
                                    />

                                    <YAxis
                                      domain={[0, 100]}
                                      ticks={[0, 25, 50, 75, 100]}
                                      tick={{ fill: "#a9a39e", fontSize: 12 }}
                                      axisLine={false}
                                      tickLine={false}
                                    />

                                    <Tooltip cursor={{ fill: "#f4f0ec" }} />

                                    <Bar
                                      dataKey="value"
                                      shape={(props) => {
                                        const { x, y, width, height, payload } = props;

                                        // Active month (July)
                                        if (payload.active) {
                                          return (
                                            <rect
                                              x={x}
                                              y={y}
                                              width={width}
                                              height={height}
                                              fill="#259c3f"
                                              stroke="#3a2b22"
                                              strokeWidth={0}
                                              rx={0}
                                            />
                                          );
                                        }

                                        // Future month (August dotted outline)
                                        if (payload.future) {
                                          return (
                                            <rect
                                              x={x}
                                              y={210}
                                              width={width}
                                              height={4}
                                              fill="none"
                                              stroke="#259c3f"
                                              strokeDasharray="4 4"
                                              rx={0}
                                            />
                                          );
                                        }

                                        // Default months
                                        return (
                                          <rect
                                            x={x}
                                            y={y}
                                            width={width}
                                            height={height}
                                            fill="#259c3f"
                                            rx={0}
                                          />
                                        );
                                      }}
                                    />
                                  </BarChart>
                                </ResponsiveContainer> */}
                                          <ResponsiveContainer width="100%" height={260}>
                                            <BarChart data={monthly_data} barSize={38}>
                                              <CartesianGrid
                                                stroke="#efe8e3"
                                                vertical={false}
                                                strokeDasharray="0"
                                              />

                                              <XAxis
                                                dataKey="name"
                                                ticks={months_result}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: "#6b645e", fontSize: 13 }}
                                              />

                                              <YAxis
                                                domain={[0, 100]}
                                                ticks={[0, 25, 50, 75, 100]}
                                                tick={{ fill: "#a9a39e", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                              />

                                              <Tooltip cursor={{ fill: "#f4f0ec" }} />

                                              <Bar
                                                dataKey="value"
                                                shape={(props) => {
                                                  const { x, y, width, height, payload } = props;

                                                  if (payload.active) {
                                                    return (
                                                      <rect
                                                        x={x}
                                                        y={y}
                                                        width={width}
                                                        height={height}
                                                        fill="#259c3f"
                                                      />
                                                    );
                                                  }

                                                  if (payload.future) {
                                                    return (
                                                      <rect
                                                        x={x}
                                                        y={210}
                                                        width={width}
                                                        height={4}
                                                        fill="none"
                                                        stroke="#259c3f"
                                                        strokeDasharray="4 4"
                                                      />
                                                    );
                                                  }

                                                  return (
                                                    <rect
                                                      x={x}
                                                      y={y}
                                                      width={width}
                                                      height={height}
                                                      fill="#259c3f"
                                                    />
                                                  );
                                                }}
                                              />
                                            </BarChart>
                                          </ResponsiveContainer>
                                        </div>


                                      </div>
                                      {/* Bottom Stats */}
                                      <div className="chart-stats justify-start mb-4">
                                        <div className="stat-card">
                                          <p className="label">Nights booked</p>
                                          <h3>{homeData?.occupancy_snapshot?.monthly?.consumed_room_nights}</h3>
                                          <p className="sub">of {homeData?.occupancy_snapshot?.monthly?.total_room_nights} room nights</p>
                                        </div>

                                        <div className="stat-card">
                                          <p className="label">Blocked rooms</p>
                                          <h3>{homeData?.occupancy_snapshot?.monthly?.blocked_room_nights}</h3>
                                        </div>
                                      </div>

                                      <div className="clearfix"></div>

                                      <Link href={`./Monthlyoccupanyreport?view=${activeOccupancy}`} className="show-occupancy-btn font-16 mt-4" style={{ textDecoration: 'none' }} >
                                        Show Occupancy Report
                                      </Link>

                                    </div>
                                  </Tab>
                                )}
                              </Tabs>
                            </div>
                          </div>
                        </div>



                        <hr style={{ margin: '40px 0 ' }} ></hr>
                      </Col>




                      <Col md={12}>
                        <div className="d-flex align-items-center gap-2">
                          <p className="title font-20 fw-medium mb-0">Performance stats</p>

                          <Select placeholder="Select Months" className="react_selectbox" options={monthOption} value={monthOption.find(val => val.value == performanceStat)} isSearchable={false} onChange={(e) => setPerformanceStat(e.value)} styles={customStyles} />
                        </div>
                        <div className="occ-tab-box">


                          <div className="chart-stats">
                            <div className="stat-card">
                              <p className="label">Nights booked</p>
                              <h3>{homeData?.performance_stats?.[performanceStat]?.consumed_room_nights}</h3>
                              <p className="sub">of {homeData?.performance_stats?.[performanceStat]?.usable_room_nights} room nights</p>
                            </div>

                            <div className="stat-card">
                              <p className="label">Avg night stay</p>
                              <h3>{homeData?.performance_stats?.[performanceStat]?.avg_nights_per_stay}</h3>
                            </div>

                            <div className="stat-card">
                              <p className="label">Avg booking window</p>
                              <h3>{homeData?.performance_stats?.[performanceStat]?.avg_booking_window_days} days</h3>
                            </div>

                            <div className="stat-card">
                              <p className="label">Top destination</p>
                              <h3>{homeData?.performance_stats?.[performanceStat]?.top_destination}</h3>
                              <p>with {homeData?.performance_stats?.[performanceStat]?.occupancy_percentage} occupancy</p>
                            </div>

                            <div className="stat-card">
                              <p className="label">Top booked BR</p>
                              <h3>{homeData?.performance_stats?.[performanceStat]?.top_booked_br?.property_name}</h3>
                              <p>with {homeData?.performance_stats?.[performanceStat]?.top_booked_br?.booking_count} occupancy</p>
                            </div>
                          </div>
                        </div>

                        <hr style={{ margin: '40px 0 ' }} ></hr>
                      </Col>


                      {hasPermission(DASHBOARD_PERMISSIONS.bookingDistribution) && (
                        <Col md={12}>
                          <div className="d-flex align-items-center gap-2 pb-2">
                            <p className="title font-20 fw-medium mb-0">Distribution analytics</p>

                            <Select placeholder="Select Months" className="react_selectbox" options={monthOption} value={monthOption.find(val => val.value == distAnlt)} onChange={handleDistrubution} isSearchable={false} styles={customStyles} />
                          </div>


                          <div className="occ-content mt-4" style={{ background: '#f2f2f2', padding: '24px 16px', border: '1px solid #4635271F' }} >
                            <p className=" font-16 mb-3" >Over the past {homeData?.distribution_analytics?.[distAnlt]?.period_months} {homeData?.distribution_analytics?.[distAnlt]?.period_months == 1 ? 'month' : 'months'}, with most of the usage coming from <span className="text-white" style={{ background: '#A969DA' }} >{homeData?.distribution_analytics?.[distAnlt]?.group_by}.</span> </p>



                            {/* Bottom Stats */}
                            <div style={{ display: "flex", alignItems: "center", gap: "40px", justifyContent: 'center' }}>

                              {/* Donut Chart */}
                              <div style={{ width: "350px", height: "350px" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={distributeData}
                                      dataKey="value"
                                      nameKey="name"
                                      innerRadius={90}
                                      outerRadius={140}
                                      paddingAngle={1}
                                    >
                                      {distributeData?.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>

                                {/* Center Text */}
                                <div
                                  style={{
                                    position: "relative",
                                    marginTop: "-200px",
                                    textAlign: "center",

                                  }}
                                >
                                  <h2 style={{ margin: 0, fontSize: "40px", color: "#4A3F2A" }}>
                                    {homeData?.distribution_analytics?.[distAnlt]?.total_bookings}
                                  </h2>
                                  <p style={{ margin: 0, marginTop: "-5px", color: "#4A3F2A" }}>
                                    Total bookings
                                  </p>
                                </div>
                              </div>

                              {/* Legend Section */}
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
                                {distributeData?.map((item, index) => (
                                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span
                                      style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        background: item.color,
                                      }}
                                    ></span>
                                    <span style={{ color: "#444" }}>
                                      {item.name} {item.value}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>



                          </div>

                          <hr style={{ margin: '40px 0 ' }} ></hr>
                        </Col>
                      )}


                      <Col md={12}>
                        <p className="title font-20 fw-medium mb-0">Feedback insights</p>


                        <div className="review-wrapper mt-4">
                          {/* Left Section */}
                          <div className="overall-rating-box">
                            <div className="rating-header">
                              <FaStar className="star" />
                              <h2>{feedbackInsights?.overall_rating}</h2>
                            </div>

                            <p className="section-title">Overall rating</p>

                            {ratings.map((item, i) => (
                              <div key={i} className="rating-row">
                                <span>{item.label}</span>
                                <div className="rating-value">
                                  <FaStar className="star" />
                                  <span>{item?.value}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Right Section */}
                          <div className="recent-reviews-box">
                            <p className="title font-20 fw-medium mb-3">Recent reviews</p>


                            {/* Slider */}

                            <div className="slider-container">
                              <div
                                className="slider-track"
                                style={{
                                  transform: `translateX(-${index * 50}%)`, // 2 cards per view = 50%
                                }}
                              >
                                {feedbackInsights?.recent_reviews?.map((item, i) => (
                                  <div key={i} className="review-card">
                                    <div className="review-header border-bottom-custom">
                                      <div>
                                        <p className="font-16" >{item?.guest_name}</p>
                                        <p className="meta">
                                          {convertDatewith(item?.reviewed_at)} · {item?.property_name}
                                        </p>
                                      </div>

                                      <img
                                        // src={item?.guest_photo ? item?.guest_photo : '/images/icons/book-user-1.png'} 
                                        src={
                                          item.guest_photo
                                            ? `${item.guest_photo}`
                                            : "/images/icons/No-Image.svg"
                                        }

                                        alt="" className="review-img" />
                                    </div>

                                    <div className="review-rating">
                                      <span>Overall rating</span>
                                      <FaStar className="star" />
                                      <span>{item?.overall_rating}</span>
                                    </div>

                                    <p className="review-text">{item?.public_review}</p>

                                    <a href="#" onClick={(e) => filterShow(e, item)} className="review-link">
                                      Read Review
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Navigation Arrows */}
                            <div className="slider-nav">
                              <button
                                className={`nav-btn ${index === 0 ? "disabled" : ""}`}
                                disabled={index === 0 ? true : false}
                                onClick={prevSlide}
                              >
                                <FaChevronLeft />
                              </button>

                              <button
                                className={`nav-btn ${index === feedbackInsights?.recent_reviews?.length - 2 ? "disabled" : ""
                                  }`}
                                disabled={index === feedbackInsights?.recent_reviews?.length - 2 ? true : false}
                                onClick={nextSlide}
                              >
                                <FaChevronRight />
                              </button>
                            </div>

                            <Link href='./Reviews' className="show-btn show-occupancy-btn d-table">Show All {feedbackInsights?.total_reviews} Reviews</Link>
                          </div>
                        </div>

                        <hr style={{ margin: '40px 0 ' }} ></hr>
                      </Col>


                      {hasPermission(DASHBOARD_PERMISSIONS.topPerformers) && (
                        <Col md={12}>
                          <p className="title font-20 fw-medium mb-0">Year-To-Date top performer analysis</p>

                          {/* <p>1 Jan – 5 Aug, 2025</p> */}
                          <p>{formatDateRangeDashboard(homeData?.top_performers?.period?.start_date, homeData?.top_performers?.period?.end_date)}</p>



                          <div className="occ-content mt-4 " style={{ padding: '24px 16px', background: '#f2f2f2', border: '1px solid #4635271F' }} >
                            <h3>Star booking managers</h3>

                            <Table className='employee-table company-table' responsive>
                              <thead>
                                <tr>
                                  <th  > <div className="mwid-35">Booking manager name</div> </th>
                                  <th  ><div className="mwid-20">Nights booked	</div></th>

                                </tr>
                              </thead>
                              <tbody>
                                {homeData?.top_performers?.star_booking_managers?.map((val, ind) => (
                                  <tr key={ind}>
                                    <td>
                                      <div className="booiing-user d-flex align-items-center gap-3">
                                        <Image
                                          // src={val?.profile_image ? val?.profile_image : './images/icons/employee-pic.jpg'} 
                                          src={
                                            val.profile_image
                                              ? `${val.profile_image}`
                                              : "/images/icons/No-Image.svg"
                                          }
                                          className="img-fluid" alt="user" width={56} height={56} />
                                        <div className="user-names">
                                          <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
                                          <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >{val?.name}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td>{val?.bookings_created}</td>
                                  </tr>
                                ))}

                                {/* <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">
                              <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Druv</p>
                            </div>
                          </div>
                        </td>
                        <td>3</td>
                      </tr>

                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">
                              <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Druv</p>
                            </div>
                          </div>
                        </td>
                        <td>3</td>
                      </tr>

                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">
                              <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Druv</p>
                            </div>
                          </div>
                        </td>
                        <td>3</td>
                      </tr>

                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">
                              <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > CasaMelhor Admin</p>
                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Druv</p>
                            </div>
                          </div>
                        </td>
                        <td>3</td>
                      </tr> */}

                              </tbody>

                            </Table>
                          </div>



                          <div className="occ-content mt-4 " style={{ padding: '24px 16px', background: '#f2f2f2', border: '1px solid #4635271F' }} >
                            <h3>Caretaker performance</h3>

                            <Table className='employee-table company-table' responsive>
                              <thead>
                                <tr>
                                  <th  > <div className="mwid-35">Caretaker name</div> </th>
                                  <th  ><div className="mwid-20">BR name	</div></th>

                                  <th  ><div className="mwid-20">Overall ratings	</div></th>

                                </tr>
                              </thead>
                              <tbody>
                                {homeData?.top_performers?.caretaker_performance?.map((item, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      <div className="booiing-user d-flex align-items-center gap-3">
                                        <Image src={item?.profile_image ? `${item?.profile_image}` : './images/icons/caretaker-img.jpg'} className="img-fluid" alt="user" width={56} height={56} />
                                        <div className="user-names">
                                          <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
                                          <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >{item?.name}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td>{item?.assigned_properties?.[0]}</td>

                                    <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   {item?.avg_rating}</span> </td>
                                  </tr>
                                ))}



                                {/* <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/caretaker-img.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">
                              <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Swami Iyer</p>
                            </div>
                          </div>
                        </td>
                        <td>CasaMelhor Areca Exotica</td>

                        <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   4.54</span> </td>
                      </tr>

                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/caretaker-img.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">
                              <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Swami Iyer</p>
                            </div>
                          </div>
                        </td>
                        <td>CasaMelhor Areca Exotica</td>

                        <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   4.54</span> </td>
                      </tr>

                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/caretaker-img.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">
                              <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Swami Iyer</p>
                            </div>
                          </div>
                        </td>
                        <td>CasaMelhor Areca Exotica</td>

                        <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   4.54</span> </td>
                      </tr>

                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/caretaker-img.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">
                              <p className="mb-0" style={{ fontSize: '12px', color: '#5A8C37' }} > Housekeeper</p>
                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Swami Iyer</p>
                            </div>
                          </div>
                        </td>
                        <td>CasaMelhor Areca Exotica</td>

                        <td> <span className="d-flex gap-2" style={{ fontSize: '14px', lineHeight: '20px' }} ><Image src='./images/icons/Star-green.svg' className="img-fluid " alt="star" width={14} height={14} />   4.54</span> </td>
                      </tr> */}

                              </tbody>

                            </Table>
                          </div>



                          <div className="occ-content mt-4 " style={{ padding: '24px 16px', background: '#f2f2f2', border: '1px solid #4635271F' }} >
                            <h3>Frequent travelers</h3>

                            <Table className='employee-table company-table' responsive>
                              <thead>
                                <tr>
                                  <th  > <div className="mwid-35">Travelers name</div> </th>
                                  <th  ><div className="mwid-20">Trips made	</div></th>
                                  <th  ><div className="mwid-20">Nights booked		</div></th>
                                  <th  ><div className="mwid-20">Avg night stay	</div></th>


                                </tr>
                              </thead>
                              <tbody>
                                {homeData?.top_performers?.frequent_travelers?.map((val, ind) => (
                                  <tr key={ind}>
                                    <td>
                                      <div className="booiing-user d-flex align-items-center gap-3">
                                        <Image
                                          // src='./images/icons/employee-pic.jpg'
                                          src={
                                            val.profile_image
                                              ? `${val.profile_image}`
                                              : "/images/icons/No-Image.svg"
                                          }
                                          className="img-fluid" alt="user" width={56} height={56} />
                                        <div className="user-names">

                                          <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >{val?.name}</p>
                                          <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > {val?.department}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td>{val?.booking_count}</td>
                                    <td>{val?.total_nights}</td>
                                    <td>{val?.avg_stay}</td>
                                  </tr>
                                ))}



                                {/* <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">

                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Shuban Leena</p>
                              <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > Sales</p>
                            </div>
                          </div>
                        </td>
                        <td>3</td>
                        <td>3</td>
                        <td>2.5</td>
                      </tr>

                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">

                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Shuban Leena</p>
                              <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > Sales</p>
                            </div>
                          </div>
                        </td>
                        <td>3</td>
                        <td>3</td>
                        <td>2.5</td>
                      </tr>


                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">

                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Shuban Leena</p>
                              <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > Sales</p>
                            </div>
                          </div>
                        </td>
                        <td>3</td>
                        <td>3</td>
                        <td>2.5</td>
                      </tr>
                      <tr>
                        <td>
                          <div className="booiing-user d-flex align-items-center gap-3">
                            <Image src='./images/icons/employee-pic.jpg' className="img-fluid" alt="user" width={56} height={56} />
                            <div className="user-names">

                              <p className="mb-0 fw-medium" style={{ fontSize: '14px' }} >Shuban Leena</p>
                              <p className="mb-0" style={{ fontSize: '12px', color: '#463527' }} > Sales</p>
                            </div>
                          </div>
                        </td>
                        <td>3</td>
                        <td>3</td>
                        <td>2.5</td>
                      </tr> */}



                              </tbody>

                            </Table>
                          </div>




                        </Col>
                      )}

                      <Col md={12}>
                        <hr style={{ margin: '40px 0 ' }} ></hr>

                        <p className="title font-20 fw-medium mb-4">CasaMelhor Emergency contacts</p>

                        <Row>
                          <Col md={4}>
                            <div className="emergency-contact">
                              <Image src='./images/icons/young-boy.jpg' className="img-fluid mb-3" alt="conatct-person" width={64} height={64} />
                              <p>Operations Manager</p>
                              <h4>Pradeep Bangari</h4>

                              <div className="d-flex gap-2">
                                <p className="d-flex gap-2 mb-0" ><Image src='./images/icons/email.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >pradeep@casamelhor.in</Link> </p>
                                <p className="d-flex gap-2 mb-0"><Image src='./images/icons/call.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >+91 8956245327</Link> </p>
                              </div>
                            </div>
                          </Col>


                          <Col md={4}>
                            <div className="emergency-contact">
                              <Image src='./images/icons/young-boy.jpg' className="img-fluid mb-3" alt="conatct-person" width={64} height={64} />
                              <p>Accounts Manager</p>
                              <h4>Sukhdev Mangoankar</h4>

                              <div className="d-flex gap-2">
                                <p className="d-flex gap-2 mb-0" ><Image src='./images/icons/email.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >accounts@casamelhor.in</Link> </p>
                                <p className="d-flex gap-2 mb-0"><Image src='./images/icons/call.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >+91 7387077551</Link> </p>
                              </div>
                            </div>
                          </Col>


                          <Col md={4}>
                            <div className="emergency-contact">
                              <Image src='./images/icons/young-boy.jpg' className="img-fluid mb-3" alt="conatct-person" width={64} height={64} />
                              <p>Tech Manager</p>
                              <h4>Rajdatta Sawant</h4>

                              <div className="d-flex gap-2">
                                <p className="d-flex gap-2 mb-0" ><Image src='./images/icons/email.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >rajdatta@casamelhor.in</Link> </p>
                                <p className="d-flex gap-2 mb-0"><Image src='./images/icons/call.svg' className="img-fluid" alt="mail" width={16} height={16} /> <Link href="#" >+91 8956381955</Link> </p>
                              </div>
                            </div>
                          </Col>
                        </Row>


                      </Col>

                    </Row>
                  )}
              </>
            )}
          </Container>
        </div>
      </ProtectedRoute>


      {/*  */}


      <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
        <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
          <Modal.Title className='d-flex align-items-center gap-3'>
            Read review
          </Modal.Title>
          <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
        </Modal.Header>
        <Modal.Body className='pt-4 pb-4'>
          <div className="room-details-modal">
            <div className="review-details-wrapper">

              {/* ===== TOP SECTION ===== */}
              <Card className="review-card-top  mb-3">
                <Card.Body className="p-3">
                  <Row className="align-items-center">
                    <Col xs={12}>
                      <div className='d-flex align-items-center gap-2 mb-3'>
                        <p className="room-title  mb-0 fw-medium ">{guestReview?.room_name} <span className="text-muted"> </span>{guestReview?.bed_name ? `| ${guestReview?.bed_name}` : ''}</p>
                        <span className="text-muted"> | </span>  <p className="room-title  mb-0 fw-medium ">{guestReview?.property_name}</p>

                      </div>
                    </Col>

                    <Col xs={12} className=" d-flex justify-between">


                      <p className="reviewer-name mb-0 fw-medium">{guestReview?.guest_name} review <br></br>  of your BR</p>

                      <Image
                        // src={guestReview?.guest_photo || "/images/icons/profile-pic.jpg"}
                        src={
                          guestReview?.guest_photo
                            ? `${guestReview?.guest_photo}`
                            : "/images/icons/No-Image.svg"
                        }
                        width={55}
                        height={55}
                        className="profile-img "
                        alt="Guest"
                      />
                    </Col>
                  </Row>

                  <Row className="review-meta mt-3 g-3">
                    <Col xs={2} className="border-end">
                      <p className="meta-title mb-0 fw-medium d-flex">{guestReview?.room_name}</p>
                    </Col>
                    <Col xs={5} className="border-end">
                      <p className="meta-title mb-0 fw-medium d-flex align-center font-16">{getDiffDate(guestReview?.stay_dates)} <br /><span className="text-muted small">{getDifwithNight(guestReview?.stay_dates)} nights</span></p>
                    </Col>
                    <Col xs={5}>
                      <p className="meta-title mb-0 fw-medium d-flex align-center font-16">Booking Id <br /><span className="id-no fw-bold">{guestReview?.booking_number}</span></p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* ===== OVERALL RATING ===== */}



              {/* ===== CATEGORY RATINGS (Expandable Items) ===== */}

              <Card className="expand-card mb-3">
                <Card.Body

                  className="expand-header d-flex justify-content-between align-items-center p-3"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="category-label mb-0 ">Overall rating</p>

                  <div className="d-flex align-items-center gap-2">
                    <div className="rating-box d-flex align-items-center gap-1">
                      <Image src="/images/icons/Star-green.svg" width={24} height={24} alt="rating" />
                      <span className="rating-sub-value ">{guestReview?.overall_rating}</span>
                    </div>
                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                  </div>
                </Card.Body>






              </Card>


              <Card className="expand-card mb-3">
                <Card.Body
                  className="expand-headerw  p-3"
                  style={{ cursor: 'pointer' }}
                >

                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <p className="category-label mb-0 ">Public Review</p>

                    <div className="d-flex align-items-center gap-2">
                      <div className="rating-box d-flex align-items-center gap-1">
                        <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
                        <span className="rating-sub-value ">4.5</span>
                      </div>
                      {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                    </div>

                  </div>

                  <div className='flex-column'>
                    <p>{guestReview?.public_review}
                      {/* The place was adorable and spotless. It showered before I got there and Ramesh cleared a parking spot for me, which was very kind. Quick responses, great-smelling soaps, and a perfect location. Can’t recomend enough! */}
                    </p>
                  </div>
                </Card.Body>






              </Card>

              <Card className="expand-card mb-3">
                <Card.Body

                  className="expand-header d-flex justify-content-between align-items-center p-3"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="category-label mb-0 ">Cleanliness</p>

                  <div className="d-flex align-items-center gap-2">
                    <div className="rating-box d-flex align-items-center gap-1">
                      <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
                      <span className="rating-sub-value ">{guestReview?.cleanliness_rating}</span>
                    </div>
                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                  </div>
                </Card.Body>






              </Card>

              <Card className="expand-card mb-3">
                <Card.Body

                  className="expand-header d-flex justify-content-between align-items-center p-3"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="category-label mb-0 ">Food quality</p>

                  <div className="d-flex align-items-center gap-2">
                    <div className="rating-box d-flex align-items-center gap-1">
                      <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
                      <span className="rating-sub-value ">{guestReview?.food_quality_rating}</span>
                    </div>
                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                  </div>
                </Card.Body>






              </Card>

              <Card className="expand-card mb-3">
                <Card.Body

                  className="expand-header d-flex justify-content-between align-items-center p-3"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="category-label mb-0 ">Staff hospitality</p>

                  <div className="d-flex align-items-center gap-2">
                    <div className="rating-box d-flex align-items-center gap-1">
                      <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
                      <span className="rating-sub-value ">{guestReview?.staff_hospitality_rating}</span>
                    </div>
                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                  </div>
                </Card.Body>






              </Card>

              <Card className="expand-card mb-3">
                <Card.Body

                  className="expand-header d-flex justify-content-between align-items-center p-3"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="category-label mb-0 ">Location</p>

                  <div className="d-flex align-items-center gap-2">
                    <div className="rating-box d-flex align-items-center gap-1">
                      <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
                      <span className="rating-sub-value ">{guestReview?.location_rating}</span>
                    </div>
                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                  </div>
                </Card.Body>






              </Card>

              <Card className="expand-card mb-3">
                <Card.Body

                  className="expand-header d-flex justify-content-between align-items-center p-3"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="category-label mb-0 ">Comfort</p>

                  <div className="d-flex align-items-center gap-2">
                    <div className="rating-box d-flex align-items-center gap-1">
                      <Image src="/images/icons/Star.svg" width={20} height={20} alt="rating" />
                      <span className="rating-sub-value ">{guestReview?.comfort_rating}</span>
                    </div>
                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                  </div>
                </Card.Body>






              </Card>


              <Card className="expand-card mb-3">
                <Card.Body
                  className="expand-headerw  p-3"
                  style={{ cursor: 'pointer' }}
                  onClick={togglePrivateReview}
                >
                  <div className='d-flex justify-content-between align-items-center '>
                    <p className="category-label mb-0 ">Private Review</p>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rating-box d-flex align-items-center gap-1">
                        <Image
                          src={privateExpanded ? "/images/icons/bottom-arrow.svg" : "/images/icons/bottom-arrow.svg"}
                          width={18}
                          height={18}
                          alt="toggle"
                          style={{ transition: 'transform 0.2s', transform: privateExpanded ? 'rotate(180deg)' : 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                  {privateExpanded && (
                    <div className='flex-column mt-3'>
                      <p className='mb-0' >{guestReview?.private_feedback}
                        {/* The place was adorable and spotless. It showered before I got there and Ramesh cleared a parking spot for me, which was very kind. Quick responses, great-smelling soaps, and a perfect location. Can’t recomend enough! */}
                      </p>
                    </div>
                  )}
                </Card.Body>






              </Card>




              {/* DONE BUTTON */}


            </div>
          </div>
        </Modal.Body>
        <div className="modal-footer-border-top border-top p-4 " >
          <div className="done-btn-wrapper m-0">
            <Button className="done-btn w-100 py-2 fw-semibold" variant="primary" onClick={filterClose}>Done</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};




export default Dashboard;