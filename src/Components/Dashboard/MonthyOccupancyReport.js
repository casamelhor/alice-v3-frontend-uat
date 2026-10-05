// "use client"
// import React from 'react'
// import { useEffect, useState } from "react";
// import Header from '../Header/Header'
// import { Col, Container, Row, Button, Tabs, Tab, Table, Modal } from "react-bootstrap";
// import Select from "react-select";
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { occupancyReportAPI, occupancyRoomReportAPI, MonthlyReportAPI, companyListAPI, PropertyListFullApi } from '@/services/provider';
// import Image from "next/image";
// import { calculateNights, formatDatesForModal } from '@/utils/formatTime';
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Legend,
//     LabelList,
//     CartesianGrid,
//     ResponsiveContainer,
// } from "recharts";

// export default function MonthyOccupancyReport() {
//     const router = useRouter();
//     const [view, setView] = useState()
//     const searchParams = useSearchParams();
//     const [roomsRows, setRoomsRows] = useState([]);
//     const [occupancyReport, setOccupancyReport] = useState({})

//     useEffect(() => {
//         const stateParam = searchParams.get('view');
//         if (stateParam) {
//             setView(stateParam)
//         }
//     }, [searchParams]);

//     const [showEmailInput, setShowEmailInput] = useState(false);
//     const [search, setSearch] = useState("");
//     const [selectedSegment, setSelectedSegment] = useState([]);
//     const [selectedMonth, setSelectedMonth] = useState(null)
//     const [propertyList, setPropertyList] = useState([]);
//     const [cityList, setCityList] = useState([]);
//     const [CompanyListData, setCompanyListData] = useState([]);
//     const [totalRoomsRows, setTotalRoomsRows] = useState(0);
//     const [totalRoomsRowsPage, setTotalRoomsRowsPage] = useState(0);
//     const [filterKeyHome, setFilterKeyHome] = useState({
//         property: '', location: '', company: '', page: 1, page_size: 10
//     });
//     const [totalBrRowsPage, setTotalBrRowsPage] = useState(0);
//     const [filterKeyFirst, setFilterKeyFirst] = useState({
//         property: '', location: '', company: '', page: 1, limit: 10
//     })
//     const [successModal, setSuccessModal] = useState({ show: false, text: '' });
//     const handleSuccessModal = () => {
//         setSuccessModal({ show: false, text: '' })
//     }

//     const handleRemove = (option) => {
//         setSelectedSegment(selectedSegment.filter((item) => item !== option));
//     };    // 

//     const handleOptionKeyDown = (e) => {
//         if ((e.key === "Enter" || e.key === "Tab") && search.trim()) {
//             e.preventDefault();
//             setSelectedSegment([...selectedSegment, search.trim()]);
//             setSearch("");
//         }
//     };

//     const [filtermShow, filtersetShow] = useState(false);

//     const filterClose = () => filtersetShow(false);
//     const filterShow = () => filtersetShow(true);


//     const monthOption = [
//         { value: "daily", label: "Daily" },
//         { value: "monthly", label: "Monthly" },

//     ];

//     const getLast12Months = (baseDate = new Date()) => {
//         const months = [];
//         const date = new Date(baseDate);

//         for (let i = 0; i < 12; i++) {
//             const month = date.toLocaleString("en-US", { month: "short" });
//             const year = date.getFullYear().toString().slice(-2);
//             const monthValue = String(date.getMonth() + 1).padStart(2, "0");

//             months.push({
//                 label: `${month} ${year}`,
//                 value: `${date.getFullYear()}-${monthValue}`,
//             });

//             // move to previous month
//             date.setMonth(date.getMonth() - 1);
//         }

//         return months;
//     };

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



//     const [selected, setSelected] = useState("pdf");

//     const ticks = Array.from({ length: 13 }, (_, i) => i * 30);
//     // Handler for month option change
//     const handleMonthOptionChange = (option) => {
//         if (option.value === 'daily') {
//             router.push(`/Occupancyreport?view=${option?.value}`);
//         } else if (option.value === 'monthly') {
//             router.push(`/Monthlyoccupanyreport?view=${option?.value}`);
//         }
//     };

//     //<-------------------------------D--------------------------->
//     const getOccupancyReportData = async () => {
//         try {

//             const [year, month] = selectedMonth?.value.split('-') ?? getLast12Months()[0]?.value.split('-');

//             const dataMonthYear = {
//                 year: Number(year),
//                 month: Number(month),
//             };
//             const response = await occupancyReportAPI(view, "", dataMonthYear, filterKeyFirst);
//             if (response?.data?.success) {
//                 setOccupancyReport(response.data.response)
//                 setTotalBrRowsPage(response.data.total_page)
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const getOccupancyRoomReportData = async () => {
//         try {
//             const [year, month] = getLast12Months()[0]?.value.split('-');

//             const dataMonthYear = {
//                 year: Number(year),
//                 month: Number(month),
//             };

//             const response = await occupancyRoomReportAPI(view, "", dataMonthYear, filterKeyHome);
//             if (response?.data?.success) {
//                 // setRoomsRows((prev) => [...prev, ...response?.data?.response?.rows]);
//                 setRoomsRows(response?.data?.response?.rows);
//                 setTotalRoomsRows(response?.data?.response?.total_count)
//                 setTotalRoomsRowsPage(response?.data?.response?.total_pages)
//             }
//         } catch (error) {
//             console.log(error);
//             // 
//         }
//     }







//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI("all");
//             if (response?.data?.success) {
//                 const companyList = response.data.response.map(company => ({
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
//                 setPropertyList(response.data.response.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url })))
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

//     useEffect(() => {
//         if (view != undefined) {
//             // getOccupancyReportData();
//             getOccupancyRoomReportData();
//             getPropertiesList();
//             getCompanyList();
//         }
//     }, [view, filterKeyHome])

//     useEffect(() => {
//         if (view != undefined) {
//             getOccupancyReportData();
//             // getCompanyList();
//             // getPropertiesList();
//         }
//     }, [view, filterKeyFirst])

//     useEffect(() => {
//         if (view != undefined) {
//             getOccupancyReportData();
//             getOccupancyRoomReportData();
//         }
//     }, [selectedMonth])

//     const handleDownloadPDFCall = async () => {
//         try {
//             const dateObj = new Date();

//             //   if (reportForDay === "yesterday") {
//             //     dateObj.setDate(dateObj.getDate() - 1);
//             //   }

//             const formattedDate = dateObj.toISOString().split('T')[0];
//             const [year, month] = selectedMonth?.value.split('-') ?? getLast12Months()[0]?.value.split('-');

//             const dataMonthYear = {
//                 year: Number(year),
//                 month: Number(month),
//             };
//             let payload = {}
//             if (search == "") {
//                 payload = {
//                     view: view,
//                     year: dataMonthYear?.year,
//                     month: dataMonthYear?.month,
//                     action: "download",
//                 }
//             } else {
//                 payload = {
//                     view: view,
//                     year: dataMonthYear?.year,
//                     month: dataMonthYear?.month,
//                     action: "email",
//                     recipients: [search],
//                 }
//             }

//             const response = await MonthlyReportAPI(payload);
//             if (response) {
//                 filterClose();
//                 if (payload.action == "download") {
//                     const blob = new Blob([response.data], {
//                         type: "application/pdf",
//                     });

//                     const url = window.URL.createObjectURL(blob);

//                     const link = document.createElement("a");
//                     link.href = url;
//                     link.download = `occupancy_report_${formattedDate}.pdf`;

//                     document.body.appendChild(link);
//                     link.click();

//                     link.remove();
//                     window.URL.revokeObjectURL(url);
//                 } else {
//                     if (response?.data?.response?.success) {
//                         setSuccessModal({
//                             show: true,
//                             text: `${response.data.response.message}, Please check the email`
//                         })
//                     }
//                 }
//             } else {
//                 console.log(response.data)
//             }

//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const ITEMS_PER_LOAD = 10;
//     const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);


//     const handleLoadMore = () => {
//         setVisibleCount((prev) =>
//             Math.min(prev + ITEMS_PER_LOAD, occupancyReport?.br_summary?.length)
//         );
//     };


//     const isAllVisible = visibleCount >= occupancyReport?.br_summary?.length;

//     const handlePageChange = (page) => {
//         if (page === "..." || page === currentPage) return;

//         setFilterKeyHome((prev) => ({
//             ...prev,
//             page: page
//         }));
//     };

//     const handlePageBrChange = (page) => {
//         if (page === "..." || page === recentPage) return;

//         setFilterKeyFirst((prev) => ({
//             ...prev,
//             page: page
//         }));
//     };

//     const recentPage = filterKeyFirst.page;
//     const allPages = totalBrRowsPage;

//     const getPaginationNumbersBr = () => {
//         const pages = [];

//         if (allPages <= 7) {
//             for (let i = 1; i <= allPages; i++) {
//                 pages.push(i);
//             }
//         } else {
//             if (recentPage <= 4) {
//                 pages.push(1, 2, 3, 4, 5, "...", allPages);
//             } else if (recentPage >= allPages - 3) {
//                 pages.push(
//                     1,
//                     "...",
//                     allPages - 4,
//                     allPages - 3,
//                     allPages - 2,
//                     allPages - 1,
//                     allPages
//                 );
//             } else {
//                 pages.push(
//                     1,
//                     "...",
//                     recentPage - 1,
//                     recentPage,
//                     recentPage + 1,
//                     "...",
//                     allPages
//                 );
//             }
//         }

//         return pages;
//     };



//     const currentPage = filterKeyHome.page;
//     const totalPages = totalRoomsRowsPage;

//     const getPaginationNumbers = () => {
//         const pages = [];

//         if (totalPages <= 7) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pages.push(i);
//             }
//         } else {
//             if (currentPage <= 4) {
//                 pages.push(1, 2, 3, 4, 5, "...", totalPages);
//             } else if (currentPage >= totalPages - 3) {
//                 pages.push(
//                     1,
//                     "...",
//                     totalPages - 4,
//                     totalPages - 3,
//                     totalPages - 2,
//                     totalPages - 1,
//                     totalPages
//                 );
//             } else {
//                 pages.push(
//                     1,
//                     "...",
//                     currentPage - 1,
//                     currentPage,
//                     currentPage + 1,
//                     "...",
//                     totalPages
//                 );
//             }
//         }

//         return pages;
//     };


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
//                                 <li> Occupancy Report</li>
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
//                             <div className='d-flex justify-content-between align-items-center pb-4 pt-4'>
//                                 <div className='colum-1 d-flex align-items-center gap-3'>
//                                     <Select
//                                         className="react_selectbox"
//                                         // placeholder="Daily"
//                                         options={monthOption}
//                                         isSearchable={false}
//                                         styles={customStyles}
//                                         value={monthOption.find(opt => view === opt.value)}
//                                         onChange={handleMonthOptionChange}
//                                     />
//                                     <Select className="react_selectbox" defaultValue={getLast12Months()[0]} placeholder="Select Month" options={getLast12Months()} isSearchable={false} onChange={(e) => { setSelectedMonth(e) }} styles={customStyles} />
//                                 </div>

//                                 <div className="d-flex align-items-center gap-3">
//                                     <Select className="react_selectbox" placeholder="All Properties" options={propertyList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, property: e.value })} styles={customStyles} />
//                                     <Select className="react_selectbox" placeholder="Location" options={cityList} isSearchable={false} styles={customStyles} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, location: e.value })} />
//                                     <Select className="react_selectbox" placeholder="Company" options={CompanyListData} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, company: e.value })} styles={customStyles} />
//                                     <span className='seprater'>

//                                     </span>
//                                     <Button onClick={filterShow} variant='' className='get-pdf-report'>
//                                         Get PDF Report
//                                     </Button>
//                                 </div>
//                             </div>

//                             <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
//                                 <h2 className='page-title'>Occupancy Report</h2>
//                             </div>
//                         </Col>

//                         <Col md={12}>
//                             <div className="d-flex align-items-center gap-2">
//                                 <h3 className="title font-24 fw-medium mb-0">Performance stats</h3>


//                             </div>
//                             <div className="occ-tab-box">


//                                 <div className="chart-stats">
//                                     <div className="stat-card">
//                                         <p className="label  mb-2">Avg occupancy</p>
//                                         <h3>{occupancyReport?.avg_occupancy_percentage ?? "N/A"}%</h3>
//                                         {/* <p className="sub">of 120 room nights</p> */}
//                                     </div>

//                                     <div className="stat-card">
//                                         <p className="label  mb-2">Total rooms</p>
//                                         <h3>{occupancyReport?.total_rooms ?? "N/A"}</h3>
//                                     </div>

//                                     <div className="stat-card">
//                                         <p className="label  mb-2">Nights booked</p>
//                                         <h3>{occupancyReport?.consumed_room_nights ?? "N/A"}</h3>
//                                         <p>of {occupancyReport?.total_room_nights ?? "N/A"} room nights</p>
//                                     </div>

//                                 </div>
//                             </div>


//                         </Col>

//                         <Col md={12}>
//                             <div className="d-flex align-items-center gap-2 mt-4">
//                                 <h3 className="title font-24 fw-medium mb-0">Performance stats</h3>
//                             </div>

//                             <div className="occ-tab-box mt-4">

//                                 <div
//                                     style={{
//                                         width: "100%",
//                                         height: "1200px",
//                                         background: "#fdf9f6",
//                                         padding: "20px",
//                                         borderRadius: "0px",
//                                     }}
//                                 >
//                                     <ResponsiveContainer width="100%" height="100%" style={{ background: '#F2EEEB' }} >
//                                         <BarChart
//                                             layout="vertical"
//                                             data={occupancyReport?.monthly_trend}
//                                             barCategoryGap={25}
//                                             margin={{
//                                                 top: 20,
//                                                 right: 50,
//                                                 left: 50,
//                                                 bottom: 20,
//                                             }}
//                                         >
//                                             {/* Light grid lines */}
//                                             <CartesianGrid stroke="#eee" horizontal={false} />

//                                             {/* Y-Axis Property Names */}
//                                             <YAxis
//                                                 dataKey="property_name"
//                                                 type="category"
//                                                 tick={{ fontSize: 14, fill: "#4c3f35" }}
//                                                 width={150}
//                                                 axisLine={false}   // remove border
//                                                 tickLine={false}   // remove tick line
//                                             />

//                                             {/* X-Axis Numbers */}
//                                             <XAxis
//                                                 type="number"
//                                                 ticks={ticks}
//                                                 domain={[0, 360]}
//                                                 tick={{ fill: "#aaa" }}
//                                                 axisLine={false}
//                                                 tickLine={false}
//                                             />

//                                             {/* Top Legend */}
//                                             <Legend
//                                                 verticalAlign="top"
//                                                 align="left"
//                                                 wrapperStyle={{
//                                                     paddingBottom: 20,
//                                                     fontSize: "14px",
//                                                 }}
//                                             />

//                                             <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />

//                                             {/* Monthly Usable */}
//                                             <Bar
//                                                 dataKey="usable_room_nights"
//                                                 name="Monthly Usable Room Nights"
//                                                 fill="#1e8c3b"
//                                                 barSize={18}
//                                                 radius={[0, 0, 0, 0]}
//                                             >
//                                                 <LabelList
//                                                     dataKey="usable_room_nights"
//                                                     position="right"
//                                                     fill="#1e8c3b"
//                                                     fontSize={13}
//                                                     offset={6}
//                                                 />
//                                             </Bar>

//                                             {/* Occupied */}
//                                             <Bar
//                                                 dataKey="consumed_room_nights"
//                                                 name="Occupied Room Nights"
//                                                 fill="#8ed4a9"
//                                                 barSize={18}
//                                                 radius={[0, 0, 0, 0]}
//                                             >
//                                                 <LabelList
//                                                     dataKey="consumed_room_nights"
//                                                     position="right"
//                                                     fill="#6aa780"
//                                                     fontSize={13}
//                                                     offset={6}
//                                                 />
//                                             </Bar>
//                                         </BarChart>
//                                     </ResponsiveContainer>
//                                 </div>
//                             </div>
//                         </Col>

//                         <Col md={12}>

//                             <div className="d-flex align-items-center gap-2 mt-5">
//                                 <h3 className="title font-24 fw-medium mb-0">BR Summary</h3>
//                             </div>

//                             <Table className='employee-table company-table' responsive>
//                                 <thead>
//                                     <tr>
//                                         <th><div className="mwid-35">BR Name</div></th>
//                                         <th><div className="mwid-20">Location</div></th>
//                                         <th><div className="mwid-20">Rooms Occupied</div></th>
//                                         <th><div className="mwid-20">Rooms Available</div></th>
//                                         <th><div className="mwid-20">Rooms Blocked</div></th>
//                                         <th><div className="mwid-20">Occupancy %</div></th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {occupancyReport?.br_summary?.slice(0, visibleCount)?.map((item, index) => (
//                                         <tr key={index}>
//                                             <td>
//                                                 <div className="booiing-user d-flex align-items-center gap-3">
//                                                     <Image
//                                                         src={item?.img ?? "/images/icons/No-Image.svg"}
//                                                         className="img-fluid"
//                                                         alt="user"
//                                                         width={56}
//                                                         height={56}
//                                                     />
//                                                     <div className="user-names">
//                                                         <p className="mb-0 fw-medium" style={{ fontSize: "14px" }}>
//                                                             {item?.property_name}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </td>

//                                             <td>{item.location}</td>
//                                             <td>{item.rooms_occupied}</td>
//                                             <td>{item.rooms_available}</td>
//                                             <td>{item.rooms_blocked}</td>
//                                             <td>{item.occupancy_percentage}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </Table>
//                             {/* <div className='flex gap-2 justify-center' onClick={handleLoadMore}
//                                 disabled={isAllVisible}
//                                 style={{
//                                     marginTop: "10px",
//                                     opacity: isAllVisible ? 0.5 : 1,
//                                     cursor: isAllVisible ? "not-allowed" : "pointer",
//                                 }}>
//                                 <Image src='./images/icons/double-arrows-down.svg' className='img-fluid' width={24} height={24} alt='star' />  View More  Total Count{" " + occupancyReport?.br_summary?.length} BRs
//                             </div> */}

//                             <div className="pagination-container mt-4 d-flex align-items-center gap-3">

//                                 <span className="pagination-text">
//                                     Showing {recentPage} of {allPages}
//                                 </span>

//                                 <div className="pagination d-flex align-items-center gap-2">

//                                     {/* Previous */}
//                                     {/* <button
//                                                                     className="page-arrow"
//                                                                     disabled={currentPage === 1}
//                                                                     onClick={() => handlePageChange(currentPage - 1)}
//                                                                 >
//                                                                     ‹
//                                                                 </button> */}
//                                     <button
//                                         className="page-arrow"
//                                         disabled={recentPage === 1}
//                                         onClick={() => handlePageBrChange(recentPage - 1)}
//                                     >
//                                         <Image
//                                             src="/images/icons/back.svg"
//                                             alt="previous"
//                                             width={10}
//                                             height={10}
//                                             style={{ opacity: recentPage === 1 ? 0.3 : 1 }}
//                                         />
//                                     </button>


//                                     {/* Pages */}
//                                     {getPaginationNumbersBr().map((page, index) => (
//                                         <button
//                                             key={index}
//                                             className={`page-number ${recentPage === page ? "active" : ""
//                                                 }`}
//                                             onClick={() => handlePageBrChange(page)}
//                                         >
//                                             {page}
//                                         </button>
//                                     ))}

//                                     {/* Next */}
//                                     <button
//                                         className="page-arrow"
//                                         disabled={recentPage === allPages}
//                                         onClick={() => handlePageBrChange(recentPage + 1)}
//                                     >
//                                         <Image
//                                             src="/images/icons/Arrows-right.svg"
//                                             alt="next"
//                                             width={29}
//                                             height={29}
//                                             style={{ opacity: recentPage === allPages ? 0.3 : 1 }}
//                                         />
//                                     </button>

//                                 </div>
//                             </div>

//                         </Col>

//                         <Col md={12}>
//                             <div className="d-flex align-items-center gap-2 mt-5">
//                                 <h3 className="title font-24 fw-medium mb-0">{totalRoomsRows} Occupancy Information</h3>
//                             </div>

//                             <Table className='desktop-emp  snapshot-table mt-4' responsive>
//                                 <thead>
//                                     <tr>
//                                         <th><div className="mwid-20">BKG ID</div> </th>
//                                         <th><div className="mwid-20">BR Name</div></th>
//                                         <th><div className="mwid-20">Guests</div></th>
//                                         <th><div className="mwid-20">Room & Bed Name</div></th>
//                                         <th><div className="">Location</div></th>
//                                         <th><div className="">Stay Dates</div></th>
//                                         <th><div className="mwid-25">Status</div></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {roomsRows.map((item, idx) => (
//                                         <tr key={idx}>
//                                             <td className="booking-id">{item?.booking_number ?? "N/A"}</td>

//                                             <td className="property-name">{item?.property_name ?? "N/A"}</td>

//                                             <td className="guest-col">
//                                                 <span className="guest-name">{item?.guest_name ?? "N/A"}</span>
//                                                 <small className="guest-info">1 adult</small>
//                                             </td>

//                                             <td className="room-info">
//                                                 {item?.room_name ?? "N/A"},{item?.bed_name ?? "N/A"}
//                                             </td>

//                                             <td className="city-col">{item?.location ?? "N/A"}</td>

//                                             <td className="stay-dates">
//                                                 <span className="date-range">{formatDatesForModal(item.check_in_date, item.check_out_date) ?? "N/A"}</span>
//                                                 <small className="nights">{calculateNights(item.check_in_date, item.check_out_date) ?? "N/A"} {`Night's`}</small>
//                                             </td>

//                                             <td className="status-col">
//                                                 <span className={`status-badge ${item?.booking_status?.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                     {item?.booking_status ?? "N/A"}
//                                                 </span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </Table>
//                             {/* <div className='flex gap-2 justify-center' disabled={filterKeyHome.page === totalRoomsRowsPage}
//                                 style={{
//                                     marginTop: "10px",
//                                     opacity: filterKeyHome.page === totalRoomsRowsPage ? 0.5 : 1,
//                                     cursor: filterKeyHome.page === totalRoomsRowsPage ? "not-allowed" : "pointer",
//                                 }} onClick={() => {
//                                     setFilterKeyHome(prev => ({
//                                         ...prev,
//                                         page: prev.page + 1,
//                                     }));
//                                 }}>
//                                 <Image src='./images/icons/double-arrows-down.svg' className='img-fluid' width={24} height={24} alt='star' />  View More  Total Count{" " + roomsRows.length}/{" " + totalRoomsRows} BRs
//                             </div> */}



//                             <div className="pagination-container mt-4 d-flex align-items-center gap-3">

//                                 <span className="pagination-text">
//                                     Showing {currentPage} of {totalPages}
//                                 </span>

//                                 <div className="pagination d-flex align-items-center gap-2">

//                                     {/* Previous */}

//                                     <button
//                                         className="page-arrow"
//                                         disabled={currentPage === 1}
//                                         onClick={() => handlePageChange(currentPage - 1)}
//                                     >
//                                         <Image
//                                             src="/images/icons/back.svg"
//                                             alt="previous"
//                                             width={10}
//                                             height={10}
//                                             style={{ opacity: currentPage === 1 ? 0.3 : 1 }}
//                                         />
//                                     </button>


//                                     {/* Pages */}
//                                     {getPaginationNumbers().map((page, index) => (
//                                         <button
//                                             key={index}
//                                             className={`page-number ${currentPage === page ? "active" : ""
//                                                 }`}
//                                             onClick={() => handlePageChange(page)}
//                                         >
//                                             {page}
//                                         </button>
//                                     ))}

//                                     {/* Next */}
//                                     <button
//                                         className="page-arrow"
//                                         disabled={currentPage === totalPages}
//                                         onClick={() => handlePageChange(currentPage + 1)}
//                                     >
//                                         <Image
//                                             src="/images/icons/Arrows-right.svg"
//                                             alt="next"
//                                             width={29}
//                                             height={29}
//                                             style={{ opacity: currentPage === totalPages ? 0.3 : 1 }}
//                                         />
//                                     </button>

//                                 </div>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             {/*  */}

//             <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
//                     <Modal.Title className='d-flex align-items-center gap-3'>
//                         Get {showEmailInput && selected === "email" ? "Email" : "Pdf"} Report
//                     </Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <p>5 August 2025</p>

//                     {((selected !== "email") || (selected === "email" && !showEmailInput)) && (
//                         <div className="download-options">
//                             {/* DOWNLOAD PDF */}
//                             <div
//                                 className={`option-box ${selected === "pdf" ? "active" : ""}`}
//                                 onClick={() => setSelected("pdf")}
//                             >
//                                 <label className="option-row">
//                                     <input
//                                         type="radio"
//                                         name="downloadOption"
//                                         value="pdf"
//                                         checked={selected === "pdf"}
//                                         onChange={() => setSelected("pdf")}
//                                     />
//                                     <span className="label-text">
//                                         Download PDF
//                                     </span>
//                                 </label>
//                             </div>

//                             {/* SEND BY EMAIL */}
//                             <div
//                                 className={`option-box ${selected === "email" ? "active" : ""}`}
//                                 onClick={() => {
//                                     setSelected("email");
//                                     setShowEmailInput(true);
//                                 }}
//                             >
//                                 <label className="option-row">
//                                     <input
//                                         type="radio"
//                                         name="downloadOption"
//                                         value="email"
//                                         checked={selected === "email"}
//                                         onChange={() => {
//                                             setSelected("email");
//                                             setShowEmailInput(true);
//                                         }}
//                                     />
//                                     <span className="label-text">
//                                         Send by Email

//                                         {/* <small className="email-sub">P......a@CFP.com</small> */}

//                                     </span>
//                                 </label>
//                             </div>
//                         </div>
//                     )}

//                     {showEmailInput && selected === "email" && (
//                         <div className='download-options'>
//                             <div className='search-box '>
//                                 <input
//                                     type='text'
//                                     placeholder='Enter Email Address'
//                                     className='form-control ps-3'
//                                     value={search}
//                                     onChange={e => setSearch(e.target.value)}
//                                     onKeyDown={handleOptionKeyDown}
//                                 />
//                             </div>
//                             {/* {emailError && (
//                                          <div style={{ color: 'red', marginTop: 4, marginBottom: 4, fontSize: 13 }}>{emailError}</div>
//                                      )} */}
//                             <div className="d-flex gap-2 mt-3 flex-wrap">
//                                 {selectedSegment.map((opt, idx) => (
//                                     <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
//                                         {opt}
//                                         <span
//                                             style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
//                                             onClick={() => handleRemove(opt)}
//                                         >
//                                             <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}


//                 </Modal.Body>

//                 {/* Email input box, shown only when Send is clicked and 'email' is selected */}

//                 <div className='modal-footer d-flex align-items-center justify-content-between gap-3 border-top pt-3 pb-3'>
//                     {showEmailInput && selected === "email" && (
//                         <Button
//                             className='edit-btn'
//                             style={{ height: '48px' }}
//                             variant=''
//                             onClick={() => {
//                                 setShowEmailInput(false);
//                             }}
//                         >
//                             Cancel
//                         </Button>
//                     )}
//                     <Button
//                         className={`complete-form-btn text-center${selected === "pdf" ? " w-100" : ""}`}
//                         style={{ height: '48px', lineHeight: 'auto' }}
//                         onClick={() => {
//                             // Handle PDF download or email send here if needed
//                             handleDownloadPDFCall()
//                         }}
//                         variant=''
//                     >
//                         {showEmailInput && selected === "email" ? "Send Email" : "Download"}
//                     </Button>
//                 </div>

//             </Modal>

//             <Modal show={successModal.show} onHide={handleSuccessModal} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between' >
//                     <Image src='/images/icons/close-circle.svg' className="ms-auto me-0" width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={handleSuccessModal} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-0' style={{ minHeight: '200px' }} >
//                     <h2 className='page-title'>Success!</h2>
//                     <p style={{ color: '#73615F' }}>{successModal.text}</p>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     {/* <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={"assignmentRemoveClose"}>
//                                     Cancel
//                                 </Button> */}
//                     <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={handleSuccessModal}>
//                         Ok
//                     </Button>
//                 </Modal.Footer>

//             </Modal>

//         </>
//     )
// }

"use client"
import React from 'react'
import { useEffect, useState } from "react";
import Header from '../Header/Header'
import { Col, Container, Row, Button, Tabs, Tab, Table, Modal } from "react-bootstrap";
import Select from "react-select";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { occupancyReportAPI, occupancyRoomReportAPI, MonthlyReportAPI, companyListAPI, PropertyListFullApi, getCompanyPropertiesCitiesAPI } from '@/services/provider';
import Image from "next/image";
import { calculateNights, formatDatesForModal } from '@/utils/formatTime';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LabelList,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function MonthyOccupancyReport() {
    const router = useRouter();
    const [view, setView] = useState()
    const searchParams = useSearchParams();
    const [roomsRows, setRoomsRows] = useState([]);
    const [occupancyReport, setOccupancyReport] = useState({})

    useEffect(() => {
        const stateParam = searchParams.get('view');
        if (stateParam) {
            setView(stateParam)
        }
    }, [searchParams]);

    const [showEmailInput, setShowEmailInput] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedSegment, setSelectedSegment] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [propertyList, setPropertyList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [CompanyListData, setCompanyListData] = useState([]);
    const [totalRoomsRows, setTotalRoomsRows] = useState(0);
    const [totalRoomsRowsPage, setTotalRoomsRowsPage] = useState(0);
    const [filterKeyHome, setFilterKeyHome] = useState({
        property: '', location: '', company: '', page: 1, page_size: 10
    });
    const [totalBrRowsPage, setTotalBrRowsPage] = useState(0);
    const [filterKeyFirst, setFilterKeyFirst] = useState({
        property: '', location: '', company: '', page: 1, limit: 10
    })
    const [successModal, setSuccessModal] = useState({ show: false, text: '' });
    const handleSuccessModal = () => {
        setSuccessModal({ show: false, text: '' })
    }

    const handleRemove = (option) => {
        setSelectedSegment(selectedSegment.filter((item) => item !== option));
    };    // 

    const handleOptionKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === "Tab") && search.trim()) {
            e.preventDefault();
            setSelectedSegment([...selectedSegment, search.trim()]);
            setSearch("");
        }
    };

    const [filtermShow, filtersetShow] = useState(false);

    const filterClose = () => filtersetShow(false);
    const filterShow = () => filtersetShow(true);


    const monthOption = [
        { value: "daily", label: "Daily" },
        { value: "monthly", label: "Monthly" },

    ];

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingProperties, setLoadingProperties] = useState(false);

    const getLast12Months = (baseDate = new Date()) => {
        const months = [];
        const date = new Date(baseDate);

        for (let i = 0; i < 12; i++) {
            const month = date.toLocaleString("en-US", { month: "short" });
            const year = date.getFullYear().toString().slice(-2);
            const monthValue = String(date.getMonth() + 1).padStart(2, "0");

            months.push({
                label: `${month} ${year}`,
                value: `${date.getFullYear()}-${monthValue}`,
            });

            // move to previous month
            date.setMonth(date.getMonth() - 1);
        }

        return months;
    };

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



    const [selected, setSelected] = useState("pdf");

    // FIX: ticks/domain now match the real usable_room_nights scale for monthly_trend
    // (sample values run up to ~7130 across all properties combined per month).
    // The original domain={[0, 360]} clipped every bar to invisible since real
    // values are 20x+ larger than the axis max.
    const CHART_MAX = 7500;
    const CHART_TICK_STEP = 1000;
    const ticks = Array.from(
        { length: CHART_MAX / CHART_TICK_STEP + 1 },
        (_, i) => i * CHART_TICK_STEP
    );

    // Handler for month option change
    const handleMonthOptionChange = (option) => {
        if (option.value === 'daily') {
            router.push(`/Occupancyreport?view=${option?.value}`);
        } else if (option.value === 'monthly') {
            router.push(`/Monthlyoccupanyreport?view=${option?.value}`);
        }
    };

    //<-------------------------------D--------------------------->
    const getOccupancyReportData = async () => {
        try {

            const [year, month] = selectedMonth?.value.split('-') ?? getLast12Months()[0]?.value.split('-');

            const dataMonthYear = {
                year: Number(year),
                month: Number(month),
            };
            const response = await occupancyReportAPI(view, "", dataMonthYear, filterKeyFirst);
            if (response?.data?.success) {
                setOccupancyReport(response.data.response)
                setTotalBrRowsPage(response.data.total_page)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getOccupancyRoomReportData = async () => {
        try {
            const [year, month] = getLast12Months()[0]?.value.split('-');

            const dataMonthYear = {
                year: Number(year),
                month: Number(month),
            };

            const response = await occupancyRoomReportAPI(view, "", dataMonthYear, filterKeyHome);
            if (response?.data?.success) {
                // setRoomsRows((prev) => [...prev, ...response?.data?.response?.rows]);
                setRoomsRows(response?.data?.response?.rows);
                setTotalRoomsRows(response?.data?.response?.total_count)
                setTotalRoomsRowsPage(response?.data?.response?.total_pages)
            }
        } catch (error) {
            console.log(error);
            // 
        }
    }







    const getCompanyList = async () => {
        try {
            const response = await companyListAPI("all");
            if (response?.data?.success) {
                const companyList = response.data.response.map(company => ({
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
            const response = await PropertyListFullApi(10, pageNumber, filterKeyHome.company, filterKeyHome.location);
            if (response?.data?.success) {
                const list = response.data.response?.filter(val => val?.property_status !== "Draft" && val?.property_status !== "Inactive")?.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url }))
                setPropertyList(list)
                // setPropertyList(response.data.response.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url })))
                // const uniqueCities = [
                //     { city: "Jaipur" },
                //     ...Array.from(
                //         new Set(response.data.response.map(ele => ele.city)),
                //         city => ({ city })
                //     ).filter(item => item.city !== "Jaipur")
                // ];
                // setCityList(uniqueCities.map((cv) => ({ value: cv.city, label: cv.city })))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const loadMoreProperties = () => {
        if (!hasMore || loadingProperties) return;

        const nextPage = page + 1;
        setPage(nextPage);
        getPropertiesList(nextPage);
    };

    useEffect(() => {
        if (view != undefined) {
            // getOccupancyReportData();
            getOccupancyRoomReportData();
            getCompanyList();
            if (filterKeyHome.company) getLocationOfProperty(filterKeyHome.company);
            if (filterKeyHome.company || filterKeyHome.location) getPropertiesList(page);
        }
    }, [view, filterKeyHome])

    useEffect(() => {
        if (view != undefined) {
            getOccupancyReportData();
            // getCompanyList();
            // getPropertiesList();
        }
    }, [view, filterKeyFirst])

    useEffect(() => {
        if (view != undefined) {
            getOccupancyReportData();
            getOccupancyRoomReportData();
        }
    }, [selectedMonth])

    const handleDownloadPDFCall = async () => {
        try {
            const dateObj = new Date();

            //   if (reportForDay === "yesterday") {
            //     dateObj.setDate(dateObj.getDate() - 1);
            //   }

            const formattedDate = dateObj.toISOString().split('T')[0];
            const [year, month] = selectedMonth?.value.split('-') ?? getLast12Months()[0]?.value.split('-');

            const dataMonthYear = {
                year: Number(year),
                month: Number(month),
            };
            let payload = {}
            if (search == "") {
                payload = {
                    view: view,
                    year: dataMonthYear?.year,
                    month: dataMonthYear?.month,
                    action: "download",
                }
            } else {
                payload = {
                    view: view,
                    year: dataMonthYear?.year,
                    month: dataMonthYear?.month,
                    action: "email",
                    recipients: [search],
                }
            }

            // const response = await MonthlyReportAPI(payload);
            const response = await MonthlyReportAPI(payload, filterKeyFirst.property, filterKeyFirst.location, filterKeyFirst.company);                
            if (response) {
                filterClose();
                if (payload.action == "download") {
                    const blob = new Blob([response.data], {
                        type: "application/pdf",
                    });

                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `occupancy_report_${formattedDate}.pdf`;

                    document.body.appendChild(link);
                    link.click();

                    link.remove();
                    window.URL.revokeObjectURL(url);
                } else {
                    if (response?.data?.response?.success) {
                        setSuccessModal({
                            show: true,
                            text: `${response.data.response.message}, Please check the email`
                        })
                    }
                }
            } else {
                console.log(response.data)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const ITEMS_PER_LOAD = 10;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);


    const handleLoadMore = () => {
        setVisibleCount((prev) =>
            Math.min(prev + ITEMS_PER_LOAD, occupancyReport?.br_summary?.length)
        );
    };


    const isAllVisible = visibleCount >= occupancyReport?.br_summary?.length;

    const handlePageChange = (page) => {
        if (page === "..." || page === currentPage) return;

        setFilterKeyHome((prev) => ({
            ...prev,
            page: page
        }));
    };

    const handlePageBrChange = (page) => {
        if (page === "..." || page === recentPage) return;

        setFilterKeyFirst((prev) => ({
            ...prev,
            page: page
        }));
    };

    const recentPage = filterKeyFirst.page;
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



    const currentPage = filterKeyHome.page;
    const totalPages = totalRoomsRowsPage;

    const getPaginationNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(
                    1,
                    "...",
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
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
                                <li> Occupancy Report</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='page-body  pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <Link href="./Home" className='back-page'>
                                <Image src='../images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>

                        <Col md={12} className=' mb-4' >
                            <div className='d-flex justify-content-between align-items-center pb-4 pt-4'>
                                <div className='colum-1 d-flex align-items-center gap-3'>
                                    <Select
                                        className="react_selectbox"
                                        // placeholder="Daily"
                                        options={monthOption}
                                        isSearchable={false}
                                        styles={customStyles}
                                        value={monthOption.find(opt => view === opt.value)}
                                        onChange={handleMonthOptionChange}
                                    />
                                    <Select className="react_selectbox" defaultValue={getLast12Months()[0]} placeholder="Select Month" options={getLast12Months()} isSearchable={false} onChange={(e) => { setSelectedMonth(e) }} styles={customStyles} />
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    {/* <Select className="react_selectbox" placeholder="Company" options={CompanyListData} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, company: e.value })} styles={customStyles} />
                                    <Select className="react_selectbox" placeholder="Location" options={cityList} isSearchable={false} styles={customStyles} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, location: e.value })} />
                                    <Select className="react_selectbox" placeholder="All Properties" options={propertyList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, property: e.value })} styles={customStyles} onMenuScrollToBottom={loadMoreProperties} /> */}
                                    <Select className="react_selectbox" placeholder="Company" options={CompanyListData} value={CompanyListData?.find(cv => cv.value == filterKeyHome.company)} isSearchable={false} onChange={(e) => { setFilterKeyHome({ ...filterKeyHome,location:'',property:'', company: e.value }); setFilterKeyFirst({ ...filterKeyFirst, company: e.value }) }} styles={customStyles} />
                                    <Select className="react_selectbox" placeholder="Location" options={cityList} isSearchable={false} value={filterKeyHome.location? cityList?.find(cv => cv.value == filterKeyHome.location):""} styles={customStyles} onChange={(e) => { setFilterKeyHome({ ...filterKeyHome, location: e.value }); setFilterKeyFirst({ ...filterKeyFirst, location: e.value }) }} />
                                    <Select className="react_selectbox" placeholder="All Properties" options={propertyList} value={ filterKeyHome.property? propertyList.find(cv => cv.value == filterKeyHome.property):""} isSearchable={false} onChange={(e) => { setFilterKeyHome({ ...filterKeyHome, property: e.value }); setFilterKeyFirst({ ...filterKeyFirst, property: e.value }) }} styles={customStyles} onMenuScrollToBottom={loadMoreProperties} />

                                    <span className='seprater'>

                                    </span>
                                    <Button onClick={filterShow} variant='' className='get-pdf-report'>
                                        Get PDF Report
                                    </Button>
                                </div>
                            </div>

                            <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
                                <h2 className='page-title'>Occupancy Report</h2>
                            </div>
                        </Col>

                        <Col md={12}>
                            <div className="d-flex align-items-center gap-2">
                                <h3 className="title font-24 fw-medium mb-0">Performance stats</h3>


                            </div>
                            <div className="occ-tab-box">


                                <div className="chart-stats">
                                    <div className="stat-card">
                                        <p className="label  mb-2">Avg occupancy</p>
                                        <h3>{occupancyReport?.avg_occupancy_percentage ?? "N/A"}%</h3>
                                        {/* <p className="sub">of 120 room nights</p> */}
                                    </div>

                                    <div className="stat-card">
                                        <p className="label  mb-2">Total rooms</p>
                                        <h3>{occupancyReport?.total_rooms ?? "N/A"}</h3>
                                    </div>

                                    <div className="stat-card">
                                        <p className="label  mb-2">Nights booked</p>
                                        <h3>{occupancyReport?.consumed_room_nights ?? "N/A"}</h3>
                                        <p>of {occupancyReport?.total_room_nights ?? "N/A"} room nights</p>
                                    </div>

                                </div>
                            </div>


                        </Col>

                        <Col md={12}>
                            <div className="d-flex align-items-center gap-2 mt-4">
                                <h3 className="title font-24 fw-medium mb-0">Performance stats</h3>
                            </div>

                            <div className="occ-tab-box mt-4">

                                <div
                                    style={{
                                        width: "100%",
                                        height: "1200px",
                                        background: "#fdf9f6",
                                        padding: "20px",
                                        borderRadius: "0px",
                                    }}
                                >
                                    {/* FIX: guard against rendering the chart before data has loaded.
                                        Previously this rendered immediately with occupancyReport = {}
                                        and the wrong data source, producing a blank chart with only the
                                        legend visible. */}
                                    {occupancyReport?.monthly_trend?.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%" style={{ background: '#F2EEEB' }} >
                                            <BarChart
                                                layout="vertical"
                                                data={occupancyReport?.monthly_trend}
                                                barCategoryGap={25}
                                                margin={{
                                                    top: 20,
                                                    right: 50,
                                                    left: 50,
                                                    bottom: 20,
                                                }}
                                            >
                                                {/* Light grid lines */}
                                                <CartesianGrid stroke="#eee" horizontal={false} />

                                                {/* Y-Axis Month Names */}
                                                {/* FIX: was dataKey="property_name", which doesn't exist on
                                                    monthly_trend rows (they have month_name instead). That
                                                    mismatch meant Recharts had no valid category to plot
                                                    against, so no bars were drawn. */}
                                                <YAxis
                                                    dataKey="month_name"
                                                    type="category"
                                                    tick={{ fontSize: 14, fill: "#4c3f35" }}
                                                    width={150}
                                                    axisLine={false}   // remove border
                                                    tickLine={false}   // remove tick line
                                                />

                                                {/* X-Axis Numbers */}
                                                <XAxis
                                                    type="number"
                                                    ticks={ticks}
                                                    domain={[0, CHART_MAX]}
                                                    tick={{ fill: "#aaa" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />

                                                {/* Top Legend */}
                                                <Legend
                                                    verticalAlign="top"
                                                    align="left"
                                                    wrapperStyle={{
                                                        paddingBottom: 20,
                                                        fontSize: "14px",
                                                    }}
                                                />

                                                <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />

                                                {/* Monthly Usable */}
                                                <Bar
                                                    dataKey="usable_room_nights"
                                                    name="Monthly Usable Room Nights"
                                                    fill="#1e8c3b"
                                                    barSize={18}
                                                    radius={[0, 0, 0, 0]}
                                                >
                                                    <LabelList
                                                        dataKey="usable_room_nights"
                                                        position="right"
                                                        fill="#1e8c3b"
                                                        fontSize={13}
                                                        offset={6}
                                                    />
                                                </Bar>

                                                {/* Occupied */}
                                                <Bar
                                                    dataKey="consumed_room_nights"
                                                    name="Occupied Room Nights"
                                                    fill="#8ed4a9"
                                                    barSize={18}
                                                    radius={[0, 0, 0, 0]}
                                                >
                                                    <LabelList
                                                        dataKey="consumed_room_nights"
                                                        position="right"
                                                        fill="#6aa780"
                                                        fontSize={13}
                                                        offset={6}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center h-100">
                                            <p className="mb-0" style={{ color: "#aaa" }}>
                                                Loading chart data...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>

                        <Col md={12}>

                            <div className="d-flex align-items-center gap-2 mt-5">
                                <h3 className="title font-24 fw-medium mb-0">BR Summary</h3>
                            </div>

                            <Table className='employee-table company-table' responsive>
                                <thead>
                                    <tr>
                                        <th><div className="mwid-35">BR Name</div></th>
                                        <th><div className="mwid-20">Location</div></th>
                                        <th><div className="mwid-20">Rooms Occupied</div></th>
                                        <th><div className="mwid-20">Rooms Available</div></th>
                                        <th><div className="mwid-20">Rooms Blocked</div></th>
                                        <th><div className="mwid-20">Occupancy %</div></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {occupancyReport?.br_summary?.slice(0, visibleCount)?.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="booiing-user d-flex align-items-center gap-3">
                                                    <Image
                                                        src={item?.img ?? "/images/icons/No-Image.svg"}
                                                        className="img-fluid"
                                                        alt="user"
                                                        width={56}
                                                        height={56}
                                                    />
                                                    <div className="user-names">
                                                        <p className="mb-0 fw-medium" style={{ fontSize: "14px" }}>
                                                            {item?.property_name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{item.location}</td>
                                            <td>{item.rooms_occupied}</td>
                                            <td>{item.rooms_available}</td>
                                            <td>{item.rooms_blocked}</td>
                                            <td>{item.occupancy_percentage}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {/* <div className='flex gap-2 justify-center' onClick={handleLoadMore}
                                disabled={isAllVisible}
                                style={{
                                    marginTop: "10px",
                                    opacity: isAllVisible ? 0.5 : 1,
                                    cursor: isAllVisible ? "not-allowed" : "pointer",
                                }}>
                                <Image src='./images/icons/double-arrows-down.svg' className='img-fluid' width={24} height={24} alt='star' />  View More  Total Count{" " + occupancyReport?.br_summary?.length} BRs
                            </div> */}

                            <div className="pagination-container mt-4 d-flex align-items-center gap-3">

                                <span className="pagination-text">
                                    Showing {recentPage} of {allPages}
                                </span>

                                <div className="pagination d-flex align-items-center gap-2">

                                    {/* Previous */}
                                    {/* <button
                                                                    className="page-arrow"
                                                                    disabled={currentPage === 1}
                                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                                >
                                                                    ‹
                                                                </button> */}
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

                        <Col md={12}>
                            <div className="d-flex align-items-center gap-2 mt-5">
                                <h3 className="title font-24 fw-medium mb-0">{totalRoomsRows} Occupancy Information</h3>
                            </div>

                            <Table className='desktop-emp  snapshot-table mt-4' responsive>
                                <thead>
                                    <tr>
                                        <th><div className="mwid-20">BKG ID</div> </th>
                                        <th><div className="mwid-20">BR Name</div></th>
                                        <th><div className="mwid-20">Guests</div></th>
                                        <th><div className="mwid-20">Room & Bed Name</div></th>
                                        <th><div className="">Location</div></th>
                                        <th><div className="">Stay Dates</div></th>
                                        <th><div className="mwid-25">Status</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roomsRows.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="booking-id">{item?.booking_number ?? "N/A"}</td>

                                            <td className="property-name">{item?.property_name ?? "N/A"}</td>

                                            <td className="guest-col">
                                                <span className="guest-name">{item?.guest_name ?? "N/A"}</span>
                                                <small className="guest-info">1 adult</small>
                                            </td>

                                            <td className="room-info">
                                                {item?.room_name ?? "N/A"},{item?.bed_name ?? "N/A"}
                                            </td>

                                            <td className="city-col">{item?.location ?? "N/A"}</td>

                                            <td className="stay-dates">
                                                <span className="date-range">{formatDatesForModal(item.check_in_date, item.check_out_date) ?? "N/A"}</span>
                                                <small className="nights">{calculateNights(item.check_in_date, item.check_out_date) ?? "N/A"} {`Night's`}</small>
                                            </td>

                                            <td className="status-col">
                                                <span className={`status-badge ${item?.booking_status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    {item?.booking_status ?? "N/A"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {/* <div className='flex gap-2 justify-center' disabled={filterKeyHome.page === totalRoomsRowsPage}
                                style={{
                                    marginTop: "10px",
                                    opacity: filterKeyHome.page === totalRoomsRowsPage ? 0.5 : 1,
                                    cursor: filterKeyHome.page === totalRoomsRowsPage ? "not-allowed" : "pointer",
                                }} onClick={() => {
                                    setFilterKeyHome(prev => ({
                                        ...prev,
                                        page: prev.page + 1,
                                    }));
                                }}>
                                <Image src='./images/icons/double-arrows-down.svg' className='img-fluid' width={24} height={24} alt='star' />  View More  Total Count{" " + roomsRows.length}/{" " + totalRoomsRows} BRs
                            </div> */}



                            <div className="pagination-container mt-4 d-flex align-items-center gap-3">

                                <span className="pagination-text">
                                    Showing {currentPage} of {totalPages}
                                </span>

                                <div className="pagination d-flex align-items-center gap-2">

                                    {/* Previous */}

                                    <button
                                        className="page-arrow"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <Image
                                            src="/images/icons/back.svg"
                                            alt="previous"
                                            width={10}
                                            height={10}
                                            style={{ opacity: currentPage === 1 ? 0.3 : 1 }}
                                        />
                                    </button>


                                    {/* Pages */}
                                    {getPaginationNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            className={`page-number ${currentPage === page ? "active" : ""
                                                }`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next */}
                                    <button
                                        className="page-arrow"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        <Image
                                            src="/images/icons/Arrows-right.svg"
                                            alt="next"
                                            width={29}
                                            height={29}
                                            style={{ opacity: currentPage === totalPages ? 0.3 : 1 }}
                                        />
                                    </button>

                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/*  */}

            <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        Get {showEmailInput && selected === "email" ? "Email" : "Pdf"} Report
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <p>5 August 2025</p>

                    {((selected !== "email") || (selected === "email" && !showEmailInput)) && (
                        <div className="download-options">
                            {/* DOWNLOAD PDF */}
                            <div
                                className={`option-box ${selected === "pdf" ? "active" : ""}`}
                                onClick={() => setSelected("pdf")}
                            >
                                <label className="option-row">
                                    <input
                                        type="radio"
                                        name="downloadOption"
                                        value="pdf"
                                        checked={selected === "pdf"}
                                        onChange={() => setSelected("pdf")}
                                    />
                                    <span className="label-text">
                                        Download PDF
                                    </span>
                                </label>
                            </div>

                            {/* SEND BY EMAIL */}
                            <div
                                className={`option-box ${selected === "email" ? "active" : ""}`}
                                onClick={() => {
                                    setSelected("email");
                                    setShowEmailInput(true);
                                }}
                            >
                                <label className="option-row">
                                    <input
                                        type="radio"
                                        name="downloadOption"
                                        value="email"
                                        checked={selected === "email"}
                                        onChange={() => {
                                            setSelected("email");
                                            setShowEmailInput(true);
                                        }}
                                    />
                                    <span className="label-text">
                                        Send by Email

                                        {/* <small className="email-sub">P......a@CFP.com</small> */}

                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {showEmailInput && selected === "email" && (
                        <div className='download-options'>
                            <div className='search-box '>
                                <input
                                    type='text'
                                    placeholder='Enter Email Address'
                                    className='form-control ps-3'
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={handleOptionKeyDown}
                                />
                            </div>
                            {/* {emailError && (
                                         <div style={{ color: 'red', marginTop: 4, marginBottom: 4, fontSize: 13 }}>{emailError}</div>
                                     )} */}
                            <div className="d-flex gap-2 mt-3 flex-wrap">
                                {selectedSegment.map((opt, idx) => (
                                    <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                        {opt}
                                        <span
                                            style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                            onClick={() => handleRemove(opt)}
                                        >
                                            <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                </Modal.Body>

                {/* Email input box, shown only when Send is clicked and 'email' is selected */}

                <div className='modal-footer d-flex align-items-center justify-content-between gap-3 border-top pt-3 pb-3'>
                    {showEmailInput && selected === "email" && (
                        <Button
                            className='edit-btn'
                            style={{ height: '48px' }}
                            variant=''
                            onClick={() => {
                                setShowEmailInput(false);
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        className={`complete-form-btn text-center${selected === "pdf" ? " w-100" : ""}`}
                        style={{ height: '48px', lineHeight: 'auto' }}
                        onClick={() => {
                            // Handle PDF download or email send here if needed
                            handleDownloadPDFCall()
                        }}
                        variant=''
                    >
                        {showEmailInput && selected === "email" ? "Send Email" : "Download"}
                    </Button>
                </div>

            </Modal>

            <Modal show={successModal.show} onHide={handleSuccessModal} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >
                    <Image src='/images/icons/close-circle.svg' className="ms-auto me-0" width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={handleSuccessModal} />
                </Modal.Header>
                <Modal.Body className='pt-0' style={{ minHeight: '200px' }} >
                    <h2 className='page-title'>Success!</h2>
                    <p style={{ color: '#73615F' }}>{successModal.text}</p>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    {/* <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={"assignmentRemoveClose"}>
                                    Cancel
                                </Button> */}
                    <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={handleSuccessModal}>
                        Ok
                    </Button>
                </Modal.Footer>

            </Modal>

        </>
    )
}