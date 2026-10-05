"use client"
import React from 'react'
import { useEffect, useState } from "react";
import Header from '../Header/Header'
import { Col, Container, Row, Button, Tabs, Tab, Table, Modal, Card,Form } from "react-bootstrap";
import Select from "react-select";
import Link from 'next/link';
import Image from "next/image";
import { ReviewsListAPI, companyListAPI, PropertyListFullApi } from '@/services/provider';
import { formatDatesForModal, calculateNights, formatToDayDate } from '@/utils/formatTime';
import StarRating from './StarRating';
import Pagination from 'react-bootstrap/Pagination';


export default function Review() {

    const [reviewListData, setReviewListData] = useState([])
    const [reviewListCount, setReviewListCount] = useState(0)
    const [reviewListDataByBR, setReviewListDataByBR] = useState([])
    const [reviewListCountByBR, setReviewListCountByBR] = useState(0)
    const [toalReviewPage, setTotalReviewPage] = useState(0)
    const [reviesData, setReviewsData] = useState(null)
    const [targetedReview, setTargetedReview] = useState(null)
    const [propertyList, setPropertyList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [CompanyListData, setCompanyListData] = useState([]);
    const [showPagination,setShowPagination] = useState(false);
    const [pagination, setPagination] = useState()
    const [filterKeyHome, setFilterKeyHome] = useState({
       page:1, limit:10, property: '', location: '', company: '', show_all_brs: false, max_rating: "", min_rating: "", end_date: "", start_date: ""
    });

    const monthOption = [
        { value: "1-month", label: "Last 1 Month" },
        { value: "3-month", label: "Last 3 Month" },
        { value: "6-month", label: "Last 6 Month" },
        { value: "9-month", label: "Last 9 Month" },
        { value: "12-month", label: "Last 12 Month" },
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

    const [filtermShow, filtersetShow] = useState(false);

    const filterClose = () => filtersetShow(false);
    const filterShow = (data) => {
        setTargetedReview(data)
        filtersetShow(true);
    };

    // 

    // const [expanded, setExpanded] = useState({
    //     public: false,
    //     clean: false,
    //     food: false,
    //     staff: false,
    //     location: false
    // });

    // const toggleExpand = (key) => {
    //     setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    // };


    // Add state for expand/collapse of Private Review
    const [privateExpanded, setPrivateExpanded] = useState(false);
    const [publicExpanded, setPublicExpanded] = useState(false);

    const togglePrivateReview = () => setPrivateExpanded((prev) => !prev);
    const togglePublicReview = () => setPublicExpanded((prev) => !prev);

    const getReviewList = async () => {
        try {
           
            const res = await ReviewsListAPI(filterKeyHome)
            if (res.data.success) {
                setReviewListData((prev)=>[...prev,...res?.data?.response?.reviews]);
                if(res?.data?.response?.ratings_by_br.length>10){
                    setReviewListDataByBR((prev)=>[...prev,...res?.data?.response?.ratings_by_br]);
                }else{
                    setReviewListDataByBR(res?.data?.response?.ratings_by_br);
                }
                setReviewsData(res?.data?.response?.overall_summary);
                setReviewListCount(res?.data?.response?.total_count);
                setReviewListCountByBR(res?.data?.response?.total_brs);
                setTotalReviewPage(res?.data?.response?.total_pages);
            }
        } catch (err) {
            console.log(err)
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
    const getPropertiesList = async () => {
        try {
            const response = await PropertyListFullApi();
            if (response?.data?.success) {
                setPropertyList(response.data.response.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url })))
                const uniqueCities = [
                    { city: "Jaipur" },
                    ...Array.from(
                        new Set(response.data.response.map(ele => ele.city)),
                        city => ({ city })
                    ).filter(item => item.city !== "Jaipur")
                ];
                setCityList(uniqueCities.map((cv) => ({ value: cv.city, label: cv.city })))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleMonthChange = (selectedOption) => {
        const formatDate = (date) => {
            return date.toISOString().split("T")[0]; // YYYY-MM-DD
        };
        if (!selectedOption) return;

        const months = parseInt(selectedOption.value); // "3-month" → 3

        const endDate = new Date(); // today
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - months);

        setFilterKeyHome((prev) => ({
            ...prev,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
        }));
    };

    useEffect(() => {
        if(!filterKeyHome.start_date || !filterKeyHome.end_date){
            handleMonthChange(monthOption[0]);
        }else{
            getReviewList()
        }
        getCompanyList();
        getPropertiesList();
    }, [filterKeyHome]);

    return (
        <>

            <Header />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>
                                {/* <li><a href=''>Home</a></li> */}
                                <li><Link href='./Dashboard'>Home</Link></li>
                                <li> Reviews</li>
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
                            <div className='d-flex justify-content-between align-items-center pb-4 pt-4 border-bottom-custom '>
                                <div className='d-flex between align-items-center gap-2 '>
                                    <h2 className='page-title'>{formatToDayDate(filterKeyHome.end_date)}</h2>
                                    <Select
                                        className="react_selectbox"
                                        options={monthOption}
                                        isSearchable={false}
                                        styles={customStyles}
                                        defaultValue={monthOption[0]}
                                        onChange={handleMonthChange}
                                    />
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <Select className="react_selectbox" placeholder="All Properties" options={propertyList} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, property: e.value })} styles={customStyles} />
                                    <Select className="react_selectbox" placeholder="Location" options={cityList} isSearchable={false} styles={customStyles} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, property: e.value })} />
                                    <Select className="react_selectbox" placeholder="Company" options={CompanyListData} isSearchable={false} onChange={(e) => setFilterKeyHome({ ...filterKeyHome, company: e.value })} styles={customStyles} />


                                </div>
                            </div>

                        </Col>
                        <Col md={12}>
                            <div className="d-flex align-items-center gap-2">
                                <p className="title font-20 fw-medium mb-0">Overall reviews and quality</p>


                            </div>
                            <div className="occ-tab-box">


                                <div className="chart-stats">
                                    <div className="stat-card">

                                        <h3 className='d-flex gap-2 mb-2'><Image src='./images/icons/Star-green.svg' className='img-fluid' alt='star' width={24} height={24} /> {reviesData?.overall_rating ?? "N/A"}  </h3>
                                        <p className="label">Overall rating</p>

                                    </div>

                                    <div className="stat-card">

                                        <h3 className='d-flex gap-2 mb-2'><Image src='./images/icons/Star-green.svg' className='img-fluid' alt='star' width={24} height={24} /> {reviesData?.cleanliness_rating ?? "N/A"}  </h3>
                                        <p className="label">Cleanliness</p>
                                    </div>

                                    <div className="stat-card">

                                        <h3 className='d-flex gap-2 mb-2'><Image src='./images/icons/Star-green.svg' className='img-fluid' alt='star' width={24} height={24} />  {reviesData?.food_quality_rating ?? "N/A"} </h3>
                                        <p className="label">Food quality</p>
                                    </div>

                                    <div className="stat-card">

                                        <h3 className='d-flex gap-2 mb-2'><Image src='./images/icons/Star-green.svg' className='img-fluid' alt='star' width={24} height={24} /> {reviesData?.staff_hospitality_rating ?? "N/A"}  </h3>
                                        <p className="label">Staff hospitality</p>

                                    </div>

                                    <div className="stat-card">

                                        <h3 className='d-flex gap-2 mb-2'><Image src='./images/icons/Star-green.svg' className='img-fluid' alt='star' width={24} height={24} /> {reviesData?.location_rating ?? "N/A"}  </h3>
                                        <p className="label">Location</p>

                                    </div>
                                </div>
                            </div>

                            <hr style={{ margin: '40px 0 ' }} ></hr>
                        </Col>
                        <Col md={12}>
                            <div className="occ-content  " style={{ padding: '24px 16px', background: '#f2f2f2', border: '1px solid #4635271F' }} >
                                <p className="title font-20 fw-medium mb-0">Ratings by BR</p>

                                <Table className='employee-table company-table' responsive>
                                    <thead>
                                        <tr>
                                            <th  > <div className="mwid-35">BR name</div> </th>
                                            <th  ><div className="mwid-20">Cleanliness	</div></th>
                                            <th  ><div className="mwid-20">Food quality	</div></th>
                                            <th  ><div className="mwid-20">Staff hospitality	</div></th>
                                            <th  ><div className="mwid-20">Location	</div></th>

                                            <th className='text-end'  ><div className="mwid-20">Overall ratings	</div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviewListDataByBR.length > 0 &&
                                            reviewListDataByBR.map((item, index) => (
                                                <tr key={item.property_uid}>
                                                    <td>
                                                        <div className="booiing-user d-flex align-items-center gap-3">
                                                            <Image
                                                                src={
                                                                    item?.property_photo
                                                                        ? `{item.property_photo}`
                                                                        : "/images/icons/No-Image.svg"
                                                                }
                                                                width={56}
                                                                height={56}
                                                                alt="property"
                                                            />
                                                            <div className="user-names">
                                                                <p className="mb-0 fw-medium" style={{ fontSize: "14px" }}>
                                                                    {item?.property_name ?? "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><StarRating rating={item.cleanliness_rating} /></td>
                                                    <td><StarRating rating={item.food_quality_rating} /></td>
                                                    <td><StarRating rating={item.staff_hospitality_rating} /></td>
                                                    <td><StarRating rating={item.location_rating} /></td>
                                                    <td className="text-end">
                                                        <span className="d-flex gap-2 justify-end" style={{ fontSize: "14px" }}>
                                                            <Image
                                                                src="/images/icons/Star-green.svg"
                                                                width={14}
                                                                height={14}
                                                                alt="star"
                                                            />
                                                            {item?.overall_rating ?? "N/A"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>

                               <div className='flex gap-2 justify-center' disabled={filterKeyHome.page === toalReviewPage||reviewListDataByBR.length===reviewListCountByBR}
                                style={{
                                    marginTop: "10px",
                                    opacity: filterKeyHome.page === toalReviewPage ||reviewListDataByBR.length===reviewListCountByBR ? 0.5 : 1,
                                    cursor: filterKeyHome.page === toalReviewPage ||reviewListDataByBR.length===reviewListCountByBR ? "not-allowed" : "pointer",
                                }} onClick={() => {
                                    if(reviewListDataByBR.length<reviewListCountByBR){
                                    setFilterKeyHome(prev => ({
                                        ...prev,
                                        page: prev.page + 1,
                                    }));}
                                }}>
                                <Image src='./images/icons/double-arrows-down.svg' className='img-fluid' width={24} height={24} alt='star' />  View More  Total Count{" " + reviewListDataByBR?.length}/{" " + reviewListCountByBR} BRs
                            </div>

                            </div>



                            <hr style={{ margin: '40px 0 ' }} ></hr>


                        </Col>
                        <Col md={12}>

                            <p className="title font-20 fw-medium mb-4">{reviewListCount} Reviews</p>

                            <Row>
                                <Col md={6}>
                                    {reviewListData.length > 0 && reviewListData?.map((item, i) => (
                                        <div key={i} className="review-card mb-3">
                                            {/* { name: "Shuban Leena", date: "1 Aug", property: "Areca", rating: 4, review: "The space was clean, beautiful and thoughtfully furnished. Great stay!", image: "/images/icons/book-user-1.png" }, */}
                                            <div className="review-header border-bottom-custom">
                                                <div >
                                                    <p className="font-18" >{item?.reviewer_name}</p>
                                                    <p className="meta">
                                                        {item?.date} · {item?.property_name}
                                                    </p>
                                                </div>

                                                <img src={item?.reviewer_photo ? `{item?.reviewer_photo}` : "/images/icons/No-Image.svg"} alt="" className="review-img" />
                                            </div>

                                            <div className="review-rating gap-2">
                                                <span className='fw-medium' >Overall rating</span>
                                                <Image src='./images/icons/Star-green.svg' className='img-fluid' alt='star' width={14} height={14} />
                                                <span>{item?.overall_rating}</span>
                                            </div>

                                            <p className="review-text">{item.public_review}</p>

                                            <Link href='#' onClick={() => { filterShow(item) }} className="review-link">
                                                Read Review
                                            </Link>
                                        </div>
                                    ))}
                                    <div className='flex gap-2 justify-center' disabled={filterKeyHome.page === toalReviewPage}
                                style={{
                                    marginTop: "10px",
                                    opacity: filterKeyHome.page === toalReviewPage ? 0.5 : 1,
                                    cursor: filterKeyHome.page === toalReviewPage ? "not-allowed" : "pointer",
                                }} onClick={() => {
                                    setFilterKeyHome(prev => ({
                                        ...prev,
                                        page: prev.page + 1,
                                    }));
                                }}>
                                <Image src='./images/icons/double-arrows-down.svg' className='img-fluid' width={24} height={24} alt='star' />  View More  Total Count{" " + reviewListData?.length}/{" " + reviewListCount} BRs
                            </div>
                                </Col>
                            </Row>



                        </Col>

                    </Row>
                </Container>
            </div>



            {/*  */}


            {filterShow && <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
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
                                                <p className="room-title  mb-0 fw-medium ">{targetedReview?.room_name} <span className="text-muted"> | </span> Bed B</p>
                                                <span className="text-muted"> | </span>  <p className="room-title  mb-0 fw-medium ">{targetedReview?.property_name}</p>
                                            </div>
                                        </Col>

                                        <Col xs={12} className=" d-flex justify-between">
                                            <p className="reviewer-name mb-0 fw-medium">{`Jenny Shaikh's`} review <br></br>  of your BR</p>

                                            <Image
                                                src={targetedReview?.reviewer_photo ? `${targetedReview?.reviewer_photo}` : "/images/icons/No-Image.svg"}
                                                width={55}
                                                height={55}
                                                className="profile-img "
                                                alt="Guest"
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="review-meta mt-3 g-3">
                                        <Col xs={2} className="border-end">
                                            <p className="meta-title mb-0 fw-medium d-flex">1 Room</p>
                                        </Col>
                                        <Col xs={5} className="border-end">
                                            <p className="meta-title mb-0 fw-medium d-flex align-center font-18">
                                                {(() => {
                                                    const dates = targetedReview?.stay_dates?.split(" - ");
                                                    return dates?.length === 2
                                                        ? formatDatesForModal(dates[0], dates[1])
                                                        : "";
                                                })()}<br /><span className="text-muted small">{(() => {
                                                    const dates = targetedReview?.stay_dates?.split(" - ");
                                                    return dates?.length === 2
                                                        ? calculateNights(dates[0], dates[1])
                                                        : "";
                                                })()} nights</span></p>
                                        </Col>
                                        <Col xs={5}>
                                            <p className="meta-title mb-0 fw-medium d-flex align-center font-18">Booking Id <br /><span className="id-no fw-bold">{targetedReview?.booking_number}</span></p>
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
                                    <p className="category-label mb-0 fw-semibold">Overall rating</p>

                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rating-box d-flex align-items-center gap-1">
                                            <Image src="/images/icons/star.svg" width={24} height={24} alt="rating" />
                                            <span className="rating-sub-value fw-semibold">{targetedReview?.overall_rating}</span>
                                        </div>
                                        {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                                    </div>
                                </Card.Body>
                            </Card>
                            {/* <Card  className="expand-card mb-3">
                                    <Card.Body                                      
                                        className="expand-headerw  p-3"
                                        style={{ cursor: 'pointer' }}
                                    >

                                    <div className='d-flex justify-content-between align-items-center mb-3'>
                                        <p className="category-label mb-0 fw-semibold">Public Review</p>

                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rating-box d-flex align-items-center gap-1">
                                                <Image src="/images/icons/star.svg" width={24} height={24} alt="rating" />
                                                <span className="rating-sub-value fw-semibold">4.5</span>
                                            </div>
                                            
                                        </div>

                                        </div>

                                    <div className='flex-column'>
                                        <p>The place was adorable and spotless. It showered before I got there and Ramesh cleared a parking spot for me, which was very kind. Quick responses, great-smelling soaps, and a perfect location. Can’t recomend enough!</p>
                                    </div>
                                    </Card.Body>

                                    

                                  
                                       
                                   
                                </Card> */}
                            <Card className="expand-card mb-3">
                                <Card.Body
                                    className="expand-headerw  p-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={togglePublicReview}
                                >
                                    <div className='d-flex justify-content-between align-items-center '>
                                        <p className="category-label mb-0 fw-semibold">Public Review</p>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rating-box d-flex align-items-center gap-1">
                                                <Image
                                                    src={publicExpanded ? "/images/icons/bottom-arrow.svg" : "/images/icons/bottom-arrow.svg"}
                                                    width={18}
                                                    height={18}
                                                    alt="toggle"
                                                    style={{ transition: 'transform 0.2s', transform: publicExpanded ? 'rotate(180deg)' : 'none' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {publicExpanded && (
                                        <div className='flex-column mt-3'>
                                            <p className='mb-0' >{targetedReview?.public_review}</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card className="expand-card mb-3">
                                <Card.Body

                                    className="expand-header d-flex justify-content-between align-items-center p-3"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <p className="category-label mb-0 fw-semibold">Cleanliness</p>

                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rating-box d-flex align-items-center gap-1">
                                            <Image src="/images/icons/star.svg" width={24} height={24} alt="rating" />
                                            <span className="rating-sub-value fw-semibold">{targetedReview?.cleanliness_rating}</span>
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
                                    <p className="category-label mb-0 fw-semibold">Food quality</p>

                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rating-box d-flex align-items-center gap-1">
                                            <Image src="/images/icons/star.svg" width={24} height={24} alt="rating" />
                                            <span className="rating-sub-value fw-semibold">{targetedReview?.food_quality_rating}</span>
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
                                    <p className="category-label mb-0 fw-semibold">Staff hospitality</p>

                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rating-box d-flex align-items-center gap-1">
                                            <Image src="/images/icons/star.svg" width={24} height={24} alt="rating" />
                                            <span className="rating-sub-value fw-semibold">{targetedReview?.staff_hospitality_rating}</span>
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
                                    <p className="category-label mb-0 fw-semibold">Location</p>

                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rating-box d-flex align-items-center gap-1">
                                            <Image src="/images/icons/star.svg" width={24} height={24} alt="rating" />
                                            <span className="rating-sub-value fw-semibold">{targetedReview?.location_rating}</span>
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
                                    <p className="category-label mb-0 fw-semibold">Comfort</p>

                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rating-box d-flex align-items-center gap-1">
                                            <Image src="/images/icons/star.svg" width={24} height={24} alt="rating" />
                                            <span className="rating-sub-value fw-semibold">{targetedReview?.comfort_rating}</span>
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
                                        <p className="category-label mb-0 fw-semibold">Private Review</p>
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
                                            <p className='mb-0' >{targetedReview?.private_feedback}</p>
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
            </Modal>}
        </>
    )
}