"use client"
import React from 'react'
import Header from '../Header/Header'
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form, Accordion } from 'react-bootstrap';
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Bookingnoshow() {
    const router = useRouter();

    const [isStep2, setIsStep2] = useState(false);

    const [updateDatesModal, updateDatesetShow] = useState(false);

    const updateDateClose = () => updateDatesetShow(false);
    const updateDateModal = () => updateDatesetShow(true);


    const [marknoShowsModal, marknoShowsetShow] = useState(false);

    const marknoShowClose = () => marknoShowsetShow(false);
    const marknoShowModal = () => marknoShowsetShow(true);





    const [updateDatesModal1, updateDatesetShow1] = useState(false);

    const updateDateClose1 = () => updateDatesetShow1(false);
    const updateDateModal1 = () => updateDatesetShow1(true);



    const [updateDatesModal2, updateDatesetShow2] = useState(false);

    const updateDateClose2 = () => updateDatesetShow2(false);
    const updateDateModal2 = () => updateDatesetShow2(true);


    const sortoption = [
        { value: "booking-Status", label: "Booking Status" },
        { value: "Less-trips", label: "Less Trips" }
    ]

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


    const [smShow, setSmShow] = useState(false);

    const [errorMessages, setErrorMessages] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newData = { [name]: value }
        setFormData({
            ...formData,
            [name]: value
        })
        const { errors } = addCompanyValidation(newData)
        setErrorMessages({
            ...errorMessages,
            ...errors
        })
    }

    const [inactiveFrom, setInactiveFrom] = useState(null);
    const [inactiveTo, setInactiveTo] = useState(null);


    const reasonsOption = [
        { value: "reason1", label: "Reason 1" },
        { value: "reason1", label: "Reason 2" },
    ]

    const [nationality, setNationality] = useState("Indian");

    const [WhetherEmployed, setWhetherEmployed] = useState("Indian");





    const [idType, setIdType] = useState("Passport");

    // Personal details fields
    const [firstName, setFirstName] = useState('Shuban');
    const [lastName, setLastName] = useState('Leena');
    const [sex, setSex] = useState('Female');
    const [nationalitySelect, setNationalitySelect] = useState('');
    const [dob, setDob] = useState(null);
    const [specialCategory, setSpecialCategory] = useState('');


    // adeqweqwe



    const [photos, setPhotos] = useState([]);
    const [coverIndex, setCoverIndex] = useState(null);

    const MAX_PHOTOS = 1;



    const makeCoverPhoto = (index) => {
        setCoverIndex(index);
    };


    const [files, setFiles] = useState([]);

    // Drag & drop
    const handleDrop1 = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const totalFiles = [...files, ...droppedFiles].slice(0, 5);

        setFiles(totalFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        })));
    };

    const handleFileChange1 = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Only allow max 5
        const newPhotos = selectedFiles
            .slice(0, MAX_PHOTOS - photos.length)
            .map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));

        const updatedPhotos = [...photos, ...newPhotos];
        setPhotos(updatedPhotos);

        // If no cover set, pick first
        if (coverIndex === null && updatedPhotos.length > 0) {
            setCoverIndex(0);
        }
    };

    const removePhoto = (index) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);

        // Reset cover photo if deleted
        if (index === coverIndex) {
            setCoverIndex(updatedPhotos.length > 0 ? 0 : null);
        }
    };

    const handleDragOver1 = (e) => e.preventDefault();

    // Remove single file
    const removeFile1 = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };


    // 


    useEffect(() => {
        // Initialize all tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map((tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl));
    }, []);


    // 


    const [showsProfile, profilesetShow] = useState(false);

    const profileClose = () => profilesetShow(false);
    const showProfile = () => profilesetShow(true);


    return (
        <>
            <Header />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>
                                {/* <li><a href=''>Home</a></li> */}
                                <li><Link href='./Bookings'>Bookings</Link></li>
                                <li>Booking for Shuban Leena - Booking id: 14269 </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='booking-details-page'>

                <div className='booking-details-box '>
                    <h2 className='page-title2 mb-4'>Booking for Shuban Leena</h2>
                    <ul className='booki-lits-li mb-2'>
                        <li>   <p className='rounded mb-0' style={{ background: '#fff', fontSize: '14px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: 'Fitcontent', padding: '4px 6px' }} ><span style={{ color: '#73615F' }} >No Show (A)</span> </p></li>
                        <li> <Image src='./images/icons/calendor.svg' className='img-fluid' alt='calendor' width={24} height={24} /> Sun, 3 Aug - Thu, 7 Aug, 2025,  3 nights</li>
                        <li> <Image src='./images/icons/group.svg' className='img-fluid' alt='calendor' width={24} height={24} /> 1 Guest</li>

                    </ul>


                </div>
                <div className='booking-details-page'>

                    {/* Timeline hero */}
                    <div className='timeline-hero mb-4'>
                        <div className='green-checkbox-bg'>
                            <Container>
                                <Accordion defaultActiveKey="0">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            <div className='d-flex justify-between w-100'>
                                                <div className='acc-title d-flex align-items-center gap-3'>
                                                    <p className='mb-0' >
                                                        <strong> No Show and Canceled (A)  </strong><br></br>
                                                        <span>Sat, 2 Aug, 2025, 2:00PM</span>
                                                    </p>

                                                    {/* <p className='rounded mb-0 ' style={{ background: '#fff', fontSize: '14px', textAlign: 'center', lineHeight: '24px', color: '#463527', width: 'auto', padding: '2px 4px' }} >Confirm status Within <span style={{ color: '#BF9039', fontSize: '14px' }} >10h 58M 30S  <Image style={{ filter: 'none' }} src='./images/icons/info-i.svg' className='img-fluid mt-1 ms-1' alt='hail' width={24} height={24} data-toggle="tooltip" data-placement="top" title="Tooltip on top" /> </span>   </p> */}

                                                    <p style={{ borderRight: '0', marginBottom: '0', paddingLeft: '0px', lineHeight: '40px' }} > Modified 4 days ago </p>
                                                </div>
                                            </div>





                                            <span> <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='hail' width={24} height={24} />

                                                <p className='exp-false mb-0'> View timeline overview </p>
                                                <p className='exp-true mb-0'> Minimize timeline overview </p>

                                            </span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: "#f9f8f6" }}>
                                                <div className="position-relative" style={{ overflow: "hidden" }}>
                                                    {/* SVG Curved Path */}
                                                    {/* <svg viewBox="0 0 1100 200" className="position-absolute top-0 start-0 w-100 h-100">
            <path
              d="M30,50 C100,160 450,110 710,120 S1000,50 1059,40"
              stroke="#00695c"
              strokeWidth="3"
              strokeDasharray="8 4"
              fill="transparent"
            />
          </svg> */}

                                                    {/* Timeline Steps */}
                                                    <div className="d-flex justify-content-between align-items-start  position-relative z-1 progress-dot-line">
                                                        {/* Step 1 */}
                                                        <div className="text-start position-relative completed-point" style={{ width: "16%" }}>


                                                            <div className="d-inline-flex align-items-center justify-content-center mb-2" >

                                                                <Image src='./images/icons/hail_24dp.svg' className='img-fluid' alt='hail' width={24} height={24} />
                                                            </div>
                                                            <span className='point pnt-1 '></span>
                                                            <p className="mb-0 fw-semibold small text-dark">29 Jul, 2025</p>
                                                            <p className="mb-0 text-muted small">at 3:50 pm</p>
                                                            <p className="text-muted small">Booking confirmed</p>

                                                            <Image src='./images/icons/info-i.svg' className='img-fluid mb-2' alt='hail' width={24} height={24} />

                                                            <div className='booking-detail-tooltip p-2 bg-white'>
                                                                <p className='fw-medium' >Booked by:</p>
                                                                <p>CasaMelhor Admin</p>
                                                                <p className='mb-0'>gloria@slb.com <br></br>
                                                                    +91 7876776655

                                                                </p>

                                                            </div>

                                                        </div>

                                                        {/* Step 2 */}
                                                        <div className="text-start  position-relative completed-point" style={{ width: "16%" }}>

                                                            <div className=" d-inline-flex align-items-center justify-content-center mb-2" >
                                                                <Image src='./images/icons/locate-home.svg' className='img-fluid opacity-50' alt='hail' width={20} height={20} />
                                                            </div>
                                                            <span className='point pnt-2 '></span>
                                                            <p className="mb-0 fw-semibold small text-dark">by 2 Aug, 2025</p>
                                                            <p className="text-muted small">Check-in Upcoming</p>
                                                        </div>



                                                        {/* Step 4 */}
                                                        <div className="text-start  position-relative completed-point" style={{ width: "16%" }}>

                                                            <div className="d-inline-flex align-items-center justify-content-center mb-2" >
                                                                <Image src='./images/icons/key_vertical24.svg' className='img-fluid opacity-50' alt='hail' width={24} height={24} />
                                                            </div>
                                                            <span className='point pnt-3 '></span>
                                                            <p className="mb-0 fw-semibold small text-dark">3 Aug, 2025</p>
                                                            <p className="text-muted small">Check-in pending </p>
                                                        </div>

                                                        {/* Step 5 */}
                                                        <div className="text-start  position-relative completed-point" style={{ width: "16%" }}>

                                                            <div className=" d-inline-flex align-items-center justify-content-center mb-2" >
                                                                <Image src='./images/icons/user.svg' className='img-fluid opacity-50' alt='hail' width={24} height={24} />
                                                            </div>
                                                            <span className='point pnt-4'></span>
                                                            <p className="mb-0 fw-semibold small text-dark  ">4 Aug, 2025  </p>
                                                            <p className="text-muted small d-flex gap-2">No Show and Canceled (A) <Image src='./images/icons/info-i.svg' className='img-fluid mb-2' alt='hail' width={16} height={16} /></p>
                                                        </div>

                                                        {/* Step 6 */}
                                                        <div className="text-start position-relative" style={{ width: "16%" }}>

                                                            <div className=" d-inline-flex align-items-center justify-content-center mb-2">
                                                                <Image src='./images/icons/emoji_people24.svg' className='img-fluid opacity-50' alt='hail' width={24} height={24} />
                                                            </div>
                                                            <span className='point pnt-5'></span>
                                                            <p className="mb-0 fw-semibold small text-dark">Post 7 Aug, 2025</p>
                                                            <p className="text-muted small">Checkout</p>
                                                        </div>


                                                        {/* custom-mt-50 */}


                                                        {/* Step 3 */}
                                                        <div className="text-start position-relative" style={{ width: "9%" }}>

                                                            <div className=" d-inline-flex align-items-center justify-content-center mb-2" >
                                                                <Image src='./images/icons/home_pin.svg' className='img-fluid' alt='hail' width={24} height={24} />
                                                            </div>
                                                            <span className='point pnt-6'></span>
                                                            <p className="mb-0 fw-semibold small text-dark">by 7 Aug, 2025</p>
                                                            <p className="text-muted small">Stay feedback</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-start pt-3" style={{ borderTop: '1px solid #4635271F' }} >
                                                    <p className="small text-muted mb-0">
                                                        Booking ID: <span className="fw-semibold text-success">14269</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                </Accordion>
                            </Container>
                        </div>
                    </div>




                </div>

                <Container>
                    <Row className='justify-center'>
                        <Col md={8}>



                            <div className='booking-details-box2 pt-5 pb-5 mb-5'>


                                {/* Client & Booking Details */}
                                <div className='client-booking-details mb-5'>
                                    <h4 style={{ fontWeight: 500 }}>Client & Booking Details</h4>

                                    <Row className='company-info-select'>
                                        <Col md={4}>
                                            <div className='comp-pro'>
                                                <Image src='./images/icons/building.svg' className='img-fluid' width={24} height={24} alt='building' />
                                                <h5 style={{ fontWeight: 500 }}>Company:</h5>
                                                <p className='mb-1' style={{ fontWeight: 500 }}>Schlumberger Asia Service Ltd</p>
                                                <small>8th Floor, Tower C, Building No. 10 DLF Cyber City, Phase II, Gurugram, Haryana, India - 122002.</small>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className='comp-pro'>
                                                <Image src='./images/icons/person_raised.svg' className='img-fluid' width={24} height={24} alt='building' />
                                                <h5 style={{ fontWeight: 500 }}>Booked by:</h5>
                                                <p className='mb-1' style={{ fontWeight: 500 }}>CasaMelhor Admin</p>
                                                <small>gloria@cmh.com · +91 7876767655</small>
                                            </div>
                                        </Col>
                                        <Col md={4} className='text-md-end '>
                                            <h5 className='d-flex gap-2 justify-end' style={{ fontWeight: 500 }}>Booking id: 14269    <Image src='./images/icons/content_copy.svg' className='img-fluid' width={18} height={18} alt='building' /></h5>
                                            <p className='mb-0'>Booking date: 29 Jul, 2025</p>
                                        </Col>
                                    </Row>

                                    <hr></hr>
                                </div>

                                {/* Guests */}
                                <div className='guests-section mb-4'>
                                    <h4 style={{ fontWeight: 500 }}>Guests</h4>


                                    <div className='guest-card p-3 bg-white border mb-3 d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center gap-3'>
                                            <div >
                                                <Image src='/images/icons/profile-pic.jpg' alt='guest' width={48} height={48} style={{ objectFit: 'contain' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>Shuban Leena</div>
                                                <div className='text-muted' style={{ fontSize: 13 }}> Emp. id: 00003 <br></br> Dept: Sales & Marketing</div>
                                            </div>
                                        </div>


                                        <div className='text-muted d-flex gap-2' style={{ fontSize: 14, paddingLeft: '15px', borderLeft: '1px solid #ccc' }}><Image src='./images/icons/call.svg' alt='phone' width={16} height={16} /> 8390734261</div>
                                        <div className='text-muted d-flex  gap-2' style={{ fontSize: 14, paddingLeft: '15px', borderLeft: '1px solid #ccc' }}><Image src='./images/icons/email.svg' alt='email' width={16} height={16} /> Shubancasamelhor@gmail.com</div>
                                        <div className='text-muted d-flex  gap-2' style={{ fontSize: 14, paddingLeft: '15px', borderLeft: '1px solid #ccc' }}><Image src='./images/icons/Genders.svg' alt='email' width={16} height={16} /> Female</div>
                                        <Button variant='' onClick={showProfile} className='btn-table-action' style={{ border: '1px solid #000', borderRadius: '0', fontSize: '14px' }} >View Details</Button>
                                    </div>

                                    <hr></hr>

                                </div>

                                {/* Stay Details header */}
                                <div className='stay-details-section mb-4'>
                                    <h4 style={{ fontWeight: 500 }}>Stay Details</h4>

                                    <p className='text-muted' style={{ fontWeight: '500' }} >4 night stay in BR</p>

                                    <div className='property-hero mb-4 p-3' style={{ background: '#fff' }}>
                                        <Row className='align-items-start'>
                                            <Col md={4} className='d-flex'>
                                                <div >
                                                    <Image src='/images/icons/room-1.jpg' alt='property' width={300} height={300} style={{ objectFit: 'cover' }} />
                                                </div>
                                            </Col>
                                            <Col md={6} className=''>
                                                <h3 style={{ margin: 0, fontWeight: 600 }}>Casa Melhor Yayati Room 1</h3>
                                                <p className='text-muted mb-0 d-flex align-items-start gap-1 pt-2' style={{ fontSize: 14 }}>

                                                    <Image src='./images/icons/location_on.svg' className='img-fluid ' alt='location' width={20} height={20} />
                                                    Casa Melhor Yayati Tulip 17th Floor Tato Building, A-11, Tonca, Miramar, Panaji, Goa 403002</p>
                                            </Col>

                                        </Row>

                                        <Row className='mt-4'>
                                            <Col md={3} className='d-flex'>
                                                <div style={{ flex: 1 }}>
                                                    <h6 style={{ margin: 0, fontWeight: 600 }}>Check-in:</h6>
                                                    <p className='mb-0' style={{ fontWeight: 600 }}>Sun, 3 Aug, 2025</p>
                                                    <small className='text-muted'>2:00 PM</small>
                                                </div>
                                            </Col>
                                            <Col md={3} className='d-flex'>
                                                <div style={{ flex: 1 }}>
                                                    <h6 style={{ margin: 0, fontWeight: 600 }}>Check-out:</h6>
                                                    <p className='mb-0' style={{ fontWeight: 600 }}>Thu, 7 Aug, 2025</p>
                                                    <small className='text-muted'>11:00 AM</small>
                                                </div>
                                            </Col>
                                        </Row>

                                        <hr style={{ margin: '18px 0' }} />

                                        <Row>
                                            <Col md={4}>
                                                <h6 style={{ fontWeight: 600 }}>Caretaker:</h6>
                                                <p className='mb-0'>Sonu</p>
                                                <p className='mb-0 text-muted'>+91 98765 56789, +91 78654 56763</p>
                                                <small className='text-muted'>1 More</small>
                                            </Col>
                                            <Col md={4}>
                                                <h6 style={{ fontWeight: 600 }}>Property Manager:</h6>
                                                <p className='mb-0'>Pradeep</p>
                                                <p className='mb-0 text-muted'>+91 98765 56789, +91 78654 56763</p>
                                                <small className='text-muted'>1 More</small>
                                            </Col>
                                            <Col md={4}>
                                                <h6 style={{ fontWeight: 600 }}>Operations Manager:</h6>
                                                <p className='mb-0'>Druv</p>
                                                <p className='mb-0 text-muted'>+91 98765 56789, +91 78654 56763</p>
                                                <small className='text-muted'>1 More</small>
                                            </Col>
                                        </Row>


                                    </div>

                                    <hr></hr>


                                </div>



                                {/* Guests */}
                                <div className='guests-section mb-4'>
                                    <h4 style={{ fontWeight: 500 }}>Approver Details</h4>

                                    <div className='d-flex align-items-start gap-2'>
                                        <Image src='/images/icons/approval.svg' alt='property' width={24} height={24} />
                                        <div className='blank-paragraph'>
                                            <p className='fw-medium'>Approved by:</p>

                                            <p style={{ lineHeight: '25px' }} >Shabha Shaikh <br></br>

                                                gloria@slb.com  <br></br>
                                                +91 7876776655 <br></br>
                                                Approved date: 29 Jul, 2025

                                            </p>
                                        </div>
                                    </div>


                                    <hr></hr>


                                </div>



                                <div className='guests-section mb-4'>
                                    <h4 style={{ fontWeight: 500 }}>Additional Notes</h4>

                                    <div className='guest-card bg-white p-3'>
                                        <Row>
                                            <Col md={5}>
                                                <p className='mb-0 fw-medium' >We would like to know the transportation costs from the airport to the venue for both check-in and check-out.</p>
                                            </Col>
                                        </Row>
                                    </div>


                                </div>


                                <p>Need help with your bookings here? Contact service@alice.com</p>

                            </div>


                        </Col>
                    </Row>
                </Container>

            </div>






            <div className='page-footer'>
                <Container>
                    <hr></hr>
                    <p className='mb-5 mt-4'> Can’t find your bookings here? Contact service@alice.com </p>

                    <p>We strive to provide you the best property & vacation rental management service by managing rentals in the most profitable way for you and making sure that you and your guests come to a spotlessly clean and fully functional home.</p>

                    <ul className='footer-links pl-0 mt-3 mb-0'>
                        <li><Link href="#">About</Link></li>
                        <li><Link href="#">Our Team</Link></li>
                        <li><Link href="#">What we do</Link></li>

                        <li><Link href="#">Help Center</Link></li>
                    </ul>


                    <ul className='social-link mb-5'>
                        <li><Link href="#"><Image src='/images/icons/instagram-logo 1.svg' width={24} height={24} alt='Facebook' /></Link></li>
                        <li><Link href="#"><Image src='/images/icons/linkedin-logo.svg' width={24} height={24} alt='Twitter' /></Link></li>
                        <li><Link href="#"><Image src='/images/icons/x-logo.svg' width={24} height={24} alt='Instagram' /></Link></li>

                        <li> +91 83224 62973 &nbsp; | </li>
                        <li> +91 77097 28684 &nbsp; | </li>
                        <li> info@TeamOffsite.in </li>
                    </ul>

                    <hr></hr>

                    <p className='d-flex gap-2' >A-11, Tato Building, Tonca Miramar, Panaji, Goa, India

                        <Link style={{ textDecoration: 'none', color: '#463527' }} href='#' >Terms of Service</Link>
                        <Link style={{ textDecoration: 'none', color: '#463527' }} href='#'>Privacy Policy</Link>
                    </p>

                </Container>
            </div>







            <Modal show={showsProfile} onHide={profileClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                    <p className='d-flex align-items-center gap-3 font-18' style={{ color: '#73615F' }}>
                        Guest Details <Image src='./images/icons/bottom-arrow.svg' style={{ transform: 'rotate(180deg)', opacity: '.5' }} className='img-fluid' alt='top' width={12} height={12} />
                        <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='top' width={12} height={12} />
                    </p>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={profileClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='cmp-employe-box'>
                        <div className='d-flex justify-content-between mb-3'>
                            <Image src='/images/icons/employee-pic.jpg' className='img-fluid' alt='employer' width={64} height={64} />

                            {/* <Button variant="" onClick={() => {
                                                    profileClose();
                                                    editemploye();
                                                }} className='edit-btn gap-2'>Edit  <Image src='/images/icons/edit.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button> */}

                        </div>

                        <p className='mb-1'>Company Employee</p>

                        <h4 className='font-24 mb-1'>Shuban Leena</h4>

                        <p className='d-flex gap-2' >
                            <Image src='./images/icons/email.svg' className='img-fluid' alt='email' width={20} height={20} />
                            <Link style={{ color: '#463527', fontWeight: '500' }} href='mailto:Shubancasamelhor@gmail.com'>Shubancasamelhor@gmail.com</Link>

                            <Image src='./images/icons/call.svg' className='img-fluid' alt='email' width={20} height={20} />
                            <Link style={{ color: '#463527', fontWeight: '500' }} href='tell:8390734261'>8390734261</Link>
                        </p>


                        <Button variant="" className='edit-btn gap-2' onClick={()=>router.push(`/Bookings?guest_uid=${bookingDetailData?.uid}`)}>View Trips  <Image src='/images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>

                        <hr style={{ marginTop: '20px', borderColor: '#4635273D' }}></hr>

                        <div className='comapny-information-box-employer'>

                            <p className='subheadine-2'>Personal Information</p>
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Gender  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > Female </span></p>




                        </div>




                        <div className='comapny-information-box-employer'>

                            <p className='subheadine-2'>Company Identity</p>
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Company  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > Casa Melhor </span></p>

                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Employee ID  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > CM25003 </span></p>


                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Dept./Segment  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > Sales & Marketing </span></p>




                        </div>


                        <div className='comapny-information-box-employer'>

                            <p className='subheadine-2'>Custom Question</p>
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Rezo ticket  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > CM656574754536 </span></p>




                        </div>

                        {/* 
                                            <Button variant="" className='edit-btn gap-2'>Change Role/Password  <Image src='/images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button> */}


                    </div>





                </Modal.Body>



            </Modal>






        </>
    )
}

