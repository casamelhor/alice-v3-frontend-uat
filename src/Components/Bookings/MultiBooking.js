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

export default function MultiBooking() {

  const [updateDatesModal3, updateDatesetShow3] = useState(false);

  const updateDateClose3 = () => updateDatesetShow3(false);
  const updateDateModal3 = () => updateDatesetShow3(true);

  //


  const roomsData = [
    {
      id: 1,
      room: "Room 2",
      bed: "Bed A",
      status: "CHECKED-IN",
      statusColor: "#cce8e1",
      guestNo: "Adult 1",
      guestName: "Shuban Leena",
    },
    {
      id: 2,
      room: "Room 2",
      bed: "Bed B",
      status: "CHECK-IN-PENDING",
      statusColor: "#d7ebc8",
      guestNo: "Adult 2",
      guestName: "Jenny Shaikh",
    },
  ];

  const [openId, setOpenId] = useState(null);
  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Room-specific state management
  const [roomStates, setRoomStates] = useState({});

  // Initialize or get state for a specific room
  const getRoomState = (roomId) => {
    return roomStates[roomId] || {
      nationality: "Indian",
      idType: "Passport",
      WhetherEmployed: "No",
      firstName: "Shuban",
      lastName: "Leena",
      sex: "Female",
      nationalitySelect: "",
      specialCategory: "",
      photos: [],
      // other fields as needed
    };
  };

  // Update state for a specific room
  const updateRoomState = (roomId, updates) => {
    setRoomStates(prev => ({
      ...prev,
      [roomId]: {
        ...getRoomState(roomId),
        ...updates
      }
    }));
  };

  // Room-specific file upload handlers
  const handleFileChange = (roomId, e) => {
    const selectedFiles = Array.from(e.target.files);
    const MAX_PHOTOS = 1;

    const currentPhotos = getRoomState(roomId).photos || [];
    const newPhotos = selectedFiles
      .slice(0, MAX_PHOTOS - currentPhotos.length)
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    const updatedPhotos = [...currentPhotos, ...newPhotos];
    updateRoomState(roomId, { photos: updatedPhotos });
  };

  const removePhoto = (roomId, index) => {
    const currentPhotos = getRoomState(roomId).photos || [];
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    updateRoomState(roomId, { photos: updatedPhotos });
  };

  const handleDrop = (roomId, e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const currentPhotos = getRoomState(roomId).photos || [];
    const MAX_PHOTOS = 1;

    const newPhotos = droppedFiles
      .slice(0, MAX_PHOTOS - currentPhotos.length)
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    const updatedPhotos = [...currentPhotos, ...newPhotos];
    updateRoomState(roomId, { photos: updatedPhotos });
  };

  const handleDragOver = (e) => e.preventDefault();

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
          ? "#4635271F"
          : "inherit",
      color: state.isSelected ? "#000" : "black",
      cursor: "pointer",
    }),
  };

  const [smShow, setSmShow] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newData = { [name]: value }
    // setFormData({
    //   ...formData,
    //   [name]: value
    // })
    // const { errors } = addCompanyValidation(newData)
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


  const [nationality, setNationality] = useState("Indian");

  const [WhetherEmployed, setWhetherEmployed] = useState("Indian");


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
          <h2 className='page-title2 mb-4'>Booking for Shuban, and Jenny</h2>
          <ul className='booki-lits-li mb-2'>
            <li>   <p className='rounded mb-0' style={{ background: '#fff', fontSize: '14px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: 'Fitcontent', padding: '4px 6px' }} ><span style={{ color: '#BF9039' }} >Active</span> </p></li>
            <li> <Image src='./images/icons/calendor.svg' className='img-fluid' alt='calendor' width={24} height={24} /> Sun, 3 Aug - Thu, 7 Aug, 2025,  3 nights</li>
            <li> <Image src='./images/icons/group.svg' className='img-fluid' alt='calendor' width={24} height={24} /> 2 Guest</li>

          </ul>

          <hr style={{ margin: '30px 0 ' }} ></hr>

          {/* <div className='d-flex justify-center gap-3'>
                        <Button  variant='' className='btn-modify ' onClick={updateDateModal2} >
                            <Image src='./images/icons/edit.svg' className='img-fluid' alt='edit' width={24} height={24} />      Modify Checkout
                        </Button>
                        <Button variant='' className='btn-move-room'  >
                            <Image src='./images/icons/switch_access.svg' className='img-fluid' alt='edit' width={24} height={24} />      Move Room

                            <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='edit' width={14} height={14} />
                          </Button>

                        <Button variant='' onClick={marknoShowModal} className='btn-move-room'  >
                                Undo Check-in


                        </Button>


                        <Button variant='' onClick={updateDateModal} className='btn-move-room ' style={{ background: '#2C734A', color: '#fff', }}  >
                            <Image src='./images/icons/key_vertical.svg' className='img-fluid' alt='edit' width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />      Undo Check-in


                        </Button> 

                         <Button variant='' onClick={updateDateModal1} className='btn-move-room ' style={{ background: '#463527', color: '#fff', }}  >
                            <Image src='./images/icons/emoji_people.svg' className='img-fluid' alt='edit' width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />      Checkout


                        </Button>
                    </div> */}


          {/* case 2  */}

          <div className='d-flex justify-center gap-3'>
            <Button variant='' className='btn-modify ' onClick={updateDateModal2} >
              <Image src='./images/icons/edit.svg' className='img-fluid' alt='edit' width={24} height={24} />      Modify Checkout
            </Button>
            <Button variant='' className='btn-move-room'  >
              <Image src='./images/icons/switch_access.svg' className='img-fluid' alt='edit' width={24} height={24} />      Move Room

              <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='edit' width={14} height={14} />
            </Button>

            <Button variant='' onClick={marknoShowModal} className='btn-move-room'  >
              <Image src='./images/icons/user.svg' className='img-fluid' alt='edit' width={24} height={24} />
              Mark as No Show


            </Button>

            <Button variant='' onClick={updateDateModal3} className='btn-move-room'  >
              <Image src='./images/icons/key_vertical.svg' className='img-fluid' alt='edit' width={24} height={24} />      Check in Formalties


            </Button>


            <Button variant='' onClick={updateDateModal} className='btn-move-room ' style={{ background: '#2C734A', color: '#fff', }}  >
              <Image src='./images/icons/key_vertical.svg' className='img-fluid' alt='edit' width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />      Check-in


            </Button>

            {/* <Button variant='' onClick={updateDateModal1} className='btn-move-room ' style={{ background: '#463527', color: '#fff', }}  >
                            <Image src='./images/icons/emoji_people.svg' className='img-fluid' alt='edit' width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />      Checkout


                        </Button>  */}
          </div>


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
                            <strong> Checked-In  </strong><br></br>
                            <span>Sat, 2 Aug, 2025, 2:00PM</span>
                          </p>

                          {/* <p className='rounded mb-0 ' style={{ background: '#fff', fontSize: '14px', textAlign: 'center', lineHeight: '24px', color: '#463527', width: 'auto', padding: '2px 4px' }} >Confirm status Within <span style={{ color: '#BF9039', fontSize: '14px' }} >10h 58M 30S  <Image style={{ filter: 'none' }} src='./images/icons/info-i.svg' className='img-fluid mt-1 ms-1' alt='hail' width={24} height={24} data-toggle="tooltip" data-placement="top" title="Tooltip on top" /> </span>   </p> */}

                          <p style={{ borderRight: '0', marginBottom: '0', paddingLeft: '15px', lineHeight: '40px' }} > Modified 4 days ago </p>
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
                              <p className="text-muted small">Check-in </p>
                            </div>

                            {/* Step 5 */}
                            <div className="text-start  position-relative" style={{ width: "16%" }}>

                              <div className=" d-inline-flex align-items-center justify-content-center mb-2" >
                                <Image src='./images/icons/home_pin_24dp.svg' className='img-fluid opacity-50' alt='hail' width={24} height={24} />
                              </div>
                              <span className='point pnt-4'></span>
                              {/* <p className="mb-0 fw-semibold small text-dark">by 7 Aug, 2025</p> */}
                              <p className="text-muted small">Stay dates</p>
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
                  <div className='company-info-select'>
                    <Row >
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

                  </div>

                  <hr></hr>
                </div>

                {/* Guests */}
                <div className='guests-section mb-4'>
                  <h4 style={{ fontWeight: 500 }}>Guests</h4>

                  <div className='guest-card p-3 bg-white border'>
                    <div className='d-flex align-items-center gap-3 justify-between border-bottom-custom mb-3'>
                      <div >
                        <p className='d-flex align-items-center gap-2' style={{ lineHeight: 'auto', fontSize: '14px' }} >

                          Room 2  &nbsp;|
                          <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> Bed A | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Checked-in'>Checked-In</span>  </p>

                      </div>


                      <p>3-7 Aug, 2025  <span>3 nights</span></p>

                    </div>
                    <div className=' mb-3 d-flex align-items-center justify-content-between'>


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
                      <Button variant='' onClick={showProfile}  className='btn-table-action' style={{ border: '1px solid #000', borderRadius: '0', fontSize: '14px' }} >View Details</Button>

                    </div>

                  </div>


                  <div className='guest-card p-3 bg-white border mt-3'>
                    <div className='d-flex align-items-center gap-3 justify-between border-bottom-custom mb-3'>
                      <div >
                        <p className='d-flex align-items-center gap-2' style={{ lineHeight: 'auto', fontSize: '14px' }} >

                          Room 2  &nbsp;|
                          <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> Bed B | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Checked-in'>Checked-In</span>  </p>

                      </div>


                      <p>3-7 Aug, 2025  <span>3 nights</span></p>

                    </div>
                    <div className=' mb-3 d-flex align-items-center justify-content-between'>


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
                      <Button variant='' onClick={showProfile}  className='btn-table-action' style={{ border: '1px solid #000', borderRadius: '0', fontSize: '14px' }} >View Details</Button>

                    </div>

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



      {/* Check in */}


      <Modal show={updateDatesModal} onHide={updateDateClose} animation={false} centered className='custom-theme-modal ' >
        <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
          <Modal.Title>Check-in</Modal.Title>
          <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={updateDateClose} />
        </Modal.Header>
        <Modal.Body className='pt-4 pb-4'>
          <div className='update-step-1'>
            <div className='booking-details-br'>
              <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban, and Jenny </p>
              <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p>
              <hr></hr>
              <div className='bm-contact mt-4'>
                <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                <p className='mb-0 d-flex gap-2 align-items-center font-18' >gloria@slb.com,  +91 7876776655</p>
                <p className='border-bottom pb-4'></p>
                <ul className='room-list'>
                  <li>3-7 Aug, 2025  <span>3 nights</span></li>
                  <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} /> </li>
                </ul>
              </div>
            </div>

            <div className='room-list-check'>

              <div className="d-flex gap-2">
                <input type="checkbox" className="custom-checkbox" />

                Room 2  &nbsp;|
                <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> Bed A | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-pending'>Check-In-Pending</span>

              </div>

              <hr></hr>

              <Accordion className='mt-4 ' defaultActiveKey="">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Adult 1 | Shuban Leena</Accordion.Header>
                  <Accordion.Body>
                    <div className='booking-details-brs mt-3'>
                      <p className='font-18 fw-medium'>Guest Nationality</p>

                      <Row>
                        <Col md={12} className='d-flex justify-content-start gap-2' >
                          <div className="radio-select-box d-flex gap-2">
                            <label className="form-check-label d-flex gap-2" htmlFor="nationality-indian">
                              <input
                                type="radio"
                                name="select-nationality"
                                id="nationality-indian"
                                checked={nationality === "Indian"}
                                onChange={() => setNationality("Indian")}
                              />
                              <span className="radio-checkmark"></span>
                              Indian
                            </label>
                          </div>

                          <div className="radio-select-box d-flex gap-2">
                            <label className="form-check-label d-flex gap-2" htmlFor="nationality-foreign">
                              <input
                                type="radio"
                                name="select-nationality"
                                id="nationality-foreign"
                                checked={nationality === "Foreign"}
                                onChange={() => setNationality("Foreign")}
                              />
                              <span className="radio-checkmark"></span>
                              Foreign National
                            </label>
                          </div>
                        </Col>
                      </Row>

                    </div>



                    {nationality === "Indian" && (

                      <>
                        <div className='booking-details-brs mt-3'>
                          <p className='font-18 fw-medium'>Choose an ID type to add</p>

                          <Row>
                            <Col md={12} className='d-flex justify-content-start gap-2' >
                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-passport">
                                  <input
                                    type="radio"
                                    name="select-id-type"
                                    id="id-type-passport"
                                    checked={idType === "Passport"}
                                    onChange={() => setIdType("Passport")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  Passport
                                </label>
                              </div>

                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-aadhaar">
                                  <input
                                    type="radio"
                                    name="select-id-type"
                                    id="id-type-aadhaar"
                                    checked={idType === "Aadhaarcard"}
                                    onChange={() => setIdType("Aadhaarcard")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  Aadhaar card
                                </label>
                              </div>

                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-driving">
                                  <input
                                    type="radio"
                                    name="select-id-type"
                                    id="id-type-driving"
                                    checked={idType === "Drivinglicence"}
                                    onChange={() => setIdType("Drivinglicence")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  Driving licence
                                </label>
                              </div>
                            </Col>
                          </Row>



                          <hr />

                          {/* Conditional fields for ID type */}
                          {idType === "Passport" && (
                            <>
                              <p className='font-18 fw-medium'>Upload an image of Guest passport</p>
                              <p>Make sure the photo of guest passport isn’t blurry and that it clearly shows the guests face.</p>
                              <div className="d-flex align-items-center justify-content-start mb-3">
                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                  <label className="cursor-pointer d-flex align-items-center gap-2">
                                    <Image
                                      src="/images/icons/add_circle.svg"
                                      width={24}
                                      height={24}
                                      alt="Add more photos"
                                    />
                                    <span>Add more photos</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                              <div className="drap-drop-box-full">
                                {photos.length === 0 ? (
                                  <label
                                    onDrop={handleDrop1}
                                    onDragOver={handleDragOver1}
                                    style={{ minHeight: '156px' }}
                                    className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                    <div className="text-center">
                                      <Image
                                        src="/images/icons/menu_book.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                      />
                                      <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Upload passport
                                      </p>
                                      <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                      >
                                        JPEG or PNG only
                                      </p>
                                    </div>
                                  </label>
                                ) : (
                                  <div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                      {photos.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                          <Image
                                            src={photo.preview}
                                            alt={`Uploaded preview ${index + 1}`}
                                            width={156}
                                            height={156}
                                            className="object-cover"
                                            style={{ width: '100%', height: '156px' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 delete-icn"
                                          >
                                            <Image
                                              src="/images/icons/delete.svg"
                                              width={20}
                                              height={20}
                                              alt="delete"
                                            />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className='mt-4' >Re-Upload Image</p>
                            </>
                          )}
                          {idType === "Aadhaarcard" && (
                            <div className="aadhaar-fields mt-3">
                              <p className='font-18 fw-medium'>Upload images of Guest Aadhaar card</p>
                              <p>Make sure the photos aren’t blurry and the front of the Aadhaar card clearly shows the guests face.</p>

                              <Row>
                                <Col md="6">
                                  <div className="drap-drop-box-full">
                                    {photos.length === 0 ? (
                                      <label
                                        onDrop={handleDrop1}
                                        onDragOver={handleDragOver1}
                                        style={{ minHeight: '156px' }}
                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                      >
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleFileChange1}
                                          className="hidden"
                                        />
                                        <div className="text-center">
                                          <Image
                                            src="/images/icons/id_card.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mx-auto mb-2"
                                          />
                                          <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                            Upload front
                                          </p>
                                          <p
                                            className="text-sm text-gray-500 mb-0"
                                            style={{ color: "#73615F" }}
                                          >
                                            JPEG or PNG only
                                          </p>
                                        </div>
                                      </label>
                                    ) : (
                                      <div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                          {photos.map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                              <Image
                                                src={photo.preview}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={156}
                                                height={156}
                                                className="object-cover"
                                                style={{ width: '100%', height: '156px' }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                              >
                                                <Image
                                                  src="/images/icons/delete.svg"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col md="6">
                                  <div className="drap-drop-box-full">
                                    {photos.length === 0 ? (
                                      <label
                                        onDrop={handleDrop1}
                                        onDragOver={handleDragOver1}
                                        style={{ minHeight: '156px' }}
                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                      >
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleFileChange1}
                                          className="hidden"
                                        />
                                        <div className="text-center">
                                          <Image
                                            src="/images/icons/bank-card-line1.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mx-auto mb-2"
                                          />
                                          <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                            Upload back
                                          </p>
                                          <p
                                            className="text-sm text-gray-500 mb-0"
                                            style={{ color: "#73615F" }}
                                          >
                                            JPEG or PNG only
                                          </p>
                                        </div>
                                      </label>
                                    ) : (
                                      <div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                          {photos.map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                              <Image
                                                src={photo.preview}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={156}
                                                height={156}
                                                className="object-cover"
                                                style={{ width: '100%', height: '156px' }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                              >
                                                <Image
                                                  src="/images/icons/delete.svg"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Col>
                              </Row>

                            </div>
                          )}
                          {idType === "Drivinglicence" && (
                            <div className="driving-fields mt-3">
                              <p className='font-18 fw-medium'>Enter Driving Licence Number</p>
                              <p>Make sure the photos aren’t blurry and the front of the driving licence clearly shows the guests face.</p>
                              <Row>
                                <Col md="6">
                                  <div className="drap-drop-box-full">
                                    {photos.length === 0 ? (
                                      <label
                                        onDrop={handleDrop1}
                                        onDragOver={handleDragOver1}
                                        style={{ minHeight: '156px' }}
                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                      >
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleFileChange1}
                                          className="hidden"
                                        />
                                        <div className="text-center">
                                          <Image
                                            src="/images/icons/id_card.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mx-auto mb-2"
                                          />
                                          <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                            Upload front
                                          </p>
                                          <p
                                            className="text-sm text-gray-500 mb-0"
                                            style={{ color: "#73615F" }}
                                          >
                                            JPEG or PNG only
                                          </p>
                                        </div>
                                      </label>
                                    ) : (
                                      <div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                          {photos.map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                              <Image
                                                src={photo.preview}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={156}
                                                height={156}
                                                className="object-cover"
                                                style={{ width: '100%', height: '156px' }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                              >
                                                <Image
                                                  src="/images/icons/delete.svg"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col md="6">
                                  <div className="drap-drop-box-full">
                                    {photos.length === 0 ? (
                                      <label
                                        onDrop={handleDrop1}
                                        onDragOver={handleDragOver1}
                                        style={{ minHeight: '156px' }}
                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                      >
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleFileChange1}
                                          className="hidden"
                                        />
                                        <div className="text-center">
                                          <Image
                                            src="/images/icons/bank-card-line1.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mx-auto mb-2"
                                          />
                                          <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                            Upload back
                                          </p>
                                          <p
                                            className="text-sm text-gray-500 mb-0"
                                            style={{ color: "#73615F" }}
                                          >
                                            JPEG or PNG only
                                          </p>
                                        </div>
                                      </label>
                                    ) : (
                                      <div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                          {photos.map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                              <Image
                                                src={photo.preview}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={156}
                                                height={156}
                                                className="object-cover"
                                                style={{ width: '100%', height: '156px' }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                              >
                                                <Image
                                                  src="/images/icons/delete.svg"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Col>
                              </Row>


                            </div>
                          )}
                        </div>
                      </>
                    )}


                    {nationality === "Foreign" && (
                      <>
                        <div className='booking-details-brs mt-3'>
                          <p className='font-18 fw-medium'>Personal Details</p>

                          <p>Enter the following information exactly the same as it appears on the traveler’s passport or ID.</p>


                          <Row className='g-3'>
                            <Col md={12}>
                              <label className='form-label'>First name</label>
                              <div className='d-flex align-items-center form-group'>
                                <input type='text' className='form-control' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                                  <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                                </button>
                              </div>
                            </Col>

                            <Col md={12}>
                              <label className='form-label'>Last name</label>
                              <div className='d-flex align-items-center form-group'>
                                <input type='text' className='form-control' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                                  <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                                </button>
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Sex</label>
                                <select className='form-control' value={sex} onChange={(e) => setSex(e.target.value)}>
                                  <option>Female</option>
                                  <option>Male</option>
                                  <option>Other</option>
                                </select>
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Nationality</label>
                                <select className='form-control' value={nationalitySelect} onChange={(e) => setNationalitySelect(e.target.value)}>
                                  <option value=''>Select</option>
                                  <option value='India'>India</option>
                                  <option value='USA'>USA</option>
                                  <option value='UK'>UK</option>
                                </select>
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Date of birth</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Special Category</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>
                          </Row>

                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Accommodation Details</p>


                          <div className='form-group mb-4'>
                            <label>Name</label>
                            <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.x. GQJ8+V2H Calangute, Goa' />
                            <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                          </div>
                          <Row>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                              </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>City</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>State</label>
                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>PIN code</label>
                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                              </div>
                            </Col>
                          </Row>


                          <div className='form-group mb-4'>
                            <label>Mobile number</label>
                            <input type='number' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>


                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Arrival Details</p>


                          <div className='form-group mb-4'>
                            <label>Arrived From</label>
                            <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='Enter' />
                            <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                          </div>
                          <Row>
                            <Col md={6}>
                              <div className='form-group mb-4'>
                                <label>Date of arrival in India</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className='form-group mb-4'>
                                <label>Date of Arrival in Individual House</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />                                            </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>Time of Arrival in Individual House</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>



                          <div className='form-group mb-0'>
                            <label>Intended Duration of Stay in Individual House</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>


                        </div>



                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Upload an image of Guest passport</p>

                          <p>EnMake sure the photo of the guest passport isn’t blurry and that it clearly shows the guests face.</p>


                          <Row className='g-3'>
                            <Col md={12}>
                              <div className="d-flex align-items-center justify-content-start mb-3">
                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                  <label className="cursor-pointer d-flex align-items-center gap-2">
                                    <Image
                                      src="/images/icons/add_circle.svg"
                                      width={24}
                                      height={24}
                                      alt="Add more photos"
                                    />
                                    <span>Add more photos</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                              <div className="drap-drop-box-full">
                                {photos.length === 0 ? (
                                  <label
                                    onDrop={handleDrop1}
                                    onDragOver={handleDragOver1}
                                    style={{ minHeight: '156px' }}
                                    className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                    <div className="text-center">
                                      <Image
                                        src="/images/icons/menu_book.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                      />
                                      <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Upload passport
                                      </p>
                                      <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                      >
                                        JPEG or PNG only
                                      </p>
                                    </div>
                                  </label>
                                ) : (
                                  <div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                      {photos.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                          <Image
                                            src={photo.preview}
                                            alt={`Uploaded preview ${index + 1}`}
                                            width={156}
                                            height={156}
                                            className="object-cover"
                                            style={{ width: '100%', height: '156px' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 delete-icn"
                                          >
                                            <Image
                                              src="/images/icons/delete.svg"
                                              width={20}
                                              height={20}
                                              alt="delete"
                                            />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className='mt-4' >Re-Upload Image</p>
                            </Col>



                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Issuing country/region</label>
                                <Select
                                  name="aria-role-select"
                                  options={sortoption}
                                  placeholder="Name"
                                  className="react_selectbox"
                                  isSearchable={false}
                                  styles={customStyles}
                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Passport No.</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Date of birth</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Expiry Date</label>

                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />

                              </div>
                            </Col>
                          </Row>

                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Upload an image of Guest Visa document</p>

                          <p>Make sure the photo of guest visa document isn’t blurry and that it clearly shows the guests face.</p>


                          <Row className='g-3'>
                            <Col md={12}>
                              <div className="d-flex align-items-center justify-content-start mb-3">
                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                  <label className="cursor-pointer d-flex align-items-center gap-2">
                                    <Image
                                      src="/images/icons/add_circle.svg"
                                      width={24}
                                      height={24}
                                      alt="Add more photos"
                                    />
                                    <span>Add more photos</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                              <div className="drap-drop-box-full">
                                {photos.length === 0 ? (
                                  <label
                                    onDrop={handleDrop1}
                                    onDragOver={handleDragOver1}
                                    style={{ minHeight: '156px' }}
                                    className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                    <div className="text-center">
                                      <Image
                                        src="/images/icons/article_person.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                      />
                                      <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Upload visa
                                      </p>
                                      <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                      >
                                        JPEG or PNG only
                                      </p>
                                    </div>
                                  </label>
                                ) : (
                                  <div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                      {photos.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                          <Image
                                            src={photo.preview}
                                            alt={`Uploaded preview ${index + 1}`}
                                            width={156}
                                            height={156}
                                            className="object-cover"
                                            style={{ width: '100%', height: '156px' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 delete-icn"
                                          >
                                            <Image
                                              src="/images/icons/delete.svg"
                                              width={20}
                                              height={20}
                                              alt="delete"
                                            />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                            </Col>



                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Issuing country/region</label>
                                <Select
                                  name="aria-role-select"
                                  options={sortoption}
                                  placeholder="Name"
                                  className="react_selectbox"
                                  isSearchable={false}
                                  styles={customStyles}
                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Visa Number</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Date of Issue</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Valid Till</label>

                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />

                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Visa Type</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>


                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Visa Subtype</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>
                          </Row>

                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Address in country where residing permanently</p>



                          <Row>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                              </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>City</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>State</label>
                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>PIN code</label>
                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                              </div>
                            </Col>
                          </Row>





                        </div>



                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Address/Reference in India</p>



                          <Row>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                              </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>City</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>State</label>
                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>PIN code</label>
                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                              </div>
                            </Col>
                          </Row>





                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Whether Employed in India</p>

                          <Row>
                            <Col md={12} className='d-flex justify-content-start gap-2' >
                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2">
                                  <input
                                    type="radio"
                                    name="select-employed"
                                    id="WhetherEmployed-no"
                                    checked={WhetherEmployed === "No"}
                                    onChange={() => setWhetherEmployed("No")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  No
                                </label>
                              </div>

                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2" >
                                  <input
                                    type="radio"
                                    name="select-employed"
                                    id="WhetherEmployed-yes"
                                    checked={WhetherEmployed === "Yes"}
                                    onChange={() => setWhetherEmployed("Yes")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  Yes
                                </label>
                              </div>
                            </Col>
                          </Row>

                        </div>



                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Purpose of Visit</p>

                          <div className='form-group '>

                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='Enter reason' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>

                        </div>



                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Next Destination</p>


                          <div className='form-group mb-4'>
                            <label>Place Name</label>
                            <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.g. Grand hyatt' />
                            <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                          </div>
                          <Row>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                              </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>City</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>State</label>
                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>PIN code</label>
                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                              </div>
                            </Col>
                          </Row>


                          <div className='form-group mb-4'>
                            <label>Mobile number</label>
                            <input type='number' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>


                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Additional comments/ remarks</p>

                          <div className='form-group '>

                            <textarea className='form-control' placeholder="Add your message here"></textarea>
                          </div>

                        </div>



                      </>

                    )}
                  </Accordion.Body>
                </Accordion.Item>

              </Accordion>

            </div>

            <div className='room-list-check'>

              <div className="d-flex gap-2">
                <input type="checkbox" className="custom-checkbox" />

                Room 2  &nbsp;|
                <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> Bed A | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-pending'>Check-In-Pending</span>

              </div>

              <hr></hr>

              <Accordion className='mt-4 ' defaultActiveKey="">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Adult 1 | Shuban Leena</Accordion.Header>
                  <Accordion.Body>
                    <div className='booking-details-brs mt-3'>
                      <p className='font-18 fw-medium'>Guest Nationality</p>

                      <Row>
                        <Col md={12} className='d-flex justify-content-start gap-2' >
                          <div className="radio-select-box d-flex gap-2">
                            <label className="form-check-label d-flex gap-2" htmlFor="nationality-indian">
                              <input
                                type="radio"
                                name="select-nationality"
                                id="nationality-indian"
                                checked={nationality === "Indian"}
                                onChange={() => setNationality("Indian")}
                              />
                              <span className="radio-checkmark"></span>
                              Indian
                            </label>
                          </div>

                          <div className="radio-select-box d-flex gap-2">
                            <label className="form-check-label d-flex gap-2" htmlFor="nationality-foreign">
                              <input
                                type="radio"
                                name="select-nationality"
                                id="nationality-foreign"
                                checked={nationality === "Foreign"}
                                onChange={() => setNationality("Foreign")}
                              />
                              <span className="radio-checkmark"></span>
                              Foreign National
                            </label>
                          </div>
                        </Col>
                      </Row>

                    </div>



                    {nationality === "Indian" && (

                      <>
                        <div className='booking-details-brs mt-3'>
                          <p className='font-18 fw-medium'>Choose an ID type to add</p>

                          <Row>
                            <Col md={12} className='d-flex justify-content-start gap-2' >
                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-passport">
                                  <input
                                    type="radio"
                                    name="select-id-type"
                                    id="id-type-passport"
                                    checked={idType === "Passport"}
                                    onChange={() => setIdType("Passport")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  Passport
                                </label>
                              </div>

                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-aadhaar">
                                  <input
                                    type="radio"
                                    name="select-id-type"
                                    id="id-type-aadhaar"
                                    checked={idType === "Aadhaarcard"}
                                    onChange={() => setIdType("Aadhaarcard")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  Aadhaar card
                                </label>
                              </div>

                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-driving">
                                  <input
                                    type="radio"
                                    name="select-id-type"
                                    id="id-type-driving"
                                    checked={idType === "Drivinglicence"}
                                    onChange={() => setIdType("Drivinglicence")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  Driving licence
                                </label>
                              </div>
                            </Col>
                          </Row>



                          <hr />

                          {/* Conditional fields for ID type */}
                          {idType === "Passport" && (
                            <>
                              <p className='font-18 fw-medium'>Upload an image of Guest passport</p>
                              <p>Make sure the photo of guest passport isn’t blurry and that it clearly shows the guests face.</p>
                              <div className="d-flex align-items-center justify-content-start mb-3">
                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                  <label className="cursor-pointer d-flex align-items-center gap-2">
                                    <Image
                                      src="/images/icons/add_circle.svg"
                                      width={24}
                                      height={24}
                                      alt="Add more photos"
                                    />
                                    <span>Add more photos</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                              <div className="drap-drop-box-full">
                                {photos.length === 0 ? (
                                  <label
                                    onDrop={handleDrop1}
                                    onDragOver={handleDragOver1}
                                    style={{ minHeight: '156px' }}
                                    className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                    <div className="text-center">
                                      <Image
                                        src="/images/icons/menu_book.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                      />
                                      <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Upload passport
                                      </p>
                                      <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                      >
                                        JPEG or PNG only
                                      </p>
                                    </div>
                                  </label>
                                ) : (
                                  <div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                      {photos.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                          <Image
                                            src={photo.preview}
                                            alt={`Uploaded preview ${index + 1}`}
                                            width={156}
                                            height={156}
                                            className="object-cover"
                                            style={{ width: '100%', height: '156px' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 delete-icn"
                                          >
                                            <Image
                                              src="/images/icons/delete.svg"
                                              width={20}
                                              height={20}
                                              alt="delete"
                                            />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className='mt-4' >Re-Upload Image</p>
                            </>
                          )}
                          {idType === "Aadhaarcard" && (
                            <div className="aadhaar-fields mt-3">
                              <p className='font-18 fw-medium'>Upload images of Guest Aadhaar card</p>
                              <p>Make sure the photos aren’t blurry and the front of the Aadhaar card clearly shows the guests face.</p>

                              <Row>
                                <Col md="6">
                                  <div className="drap-drop-box-full">
                                    {photos.length === 0 ? (
                                      <label
                                        onDrop={handleDrop1}
                                        onDragOver={handleDragOver1}
                                        style={{ minHeight: '156px' }}
                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                      >
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleFileChange1}
                                          className="hidden"
                                        />
                                        <div className="text-center">
                                          <Image
                                            src="/images/icons/id_card.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mx-auto mb-2"
                                          />
                                          <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                            Upload front
                                          </p>
                                          <p
                                            className="text-sm text-gray-500 mb-0"
                                            style={{ color: "#73615F" }}
                                          >
                                            JPEG or PNG only
                                          </p>
                                        </div>
                                      </label>
                                    ) : (
                                      <div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                          {photos.map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                              <Image
                                                src={photo.preview}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={156}
                                                height={156}
                                                className="object-cover"
                                                style={{ width: '100%', height: '156px' }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                              >
                                                <Image
                                                  src="/images/icons/delete.svg"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col md="6">
                                  <div className="drap-drop-box-full">
                                    {photos.length === 0 ? (
                                      <label
                                        onDrop={handleDrop1}
                                        onDragOver={handleDragOver1}
                                        style={{ minHeight: '156px' }}
                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                      >
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleFileChange1}
                                          className="hidden"
                                        />
                                        <div className="text-center">
                                          <Image
                                            src="/images/icons/bank-card-line1.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mx-auto mb-2"
                                          />
                                          <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                            Upload back
                                          </p>
                                          <p
                                            className="text-sm text-gray-500 mb-0"
                                            style={{ color: "#73615F" }}
                                          >
                                            JPEG or PNG only
                                          </p>
                                        </div>
                                      </label>
                                    ) : (
                                      <div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                          {photos.map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                              <Image
                                                src={photo.preview}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={156}
                                                height={156}
                                                className="object-cover"
                                                style={{ width: '100%', height: '156px' }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                              >
                                                <Image
                                                  src="/images/icons/delete.svg"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Col>
                              </Row>

                            </div>
                          )}
                          {idType === "Drivinglicence" && (
                            <div className="driving-fields mt-3">
                              <p className='font-18 fw-medium'>Enter Driving Licence Number</p>
                              <p>Make sure the photos aren’t blurry and the front of the driving licence clearly shows the guests face.</p>
                              <Row>
                                <Col md="6">
                                  <div className="drap-drop-box-full">
                                    {photos.length === 0 ? (
                                      <label
                                        onDrop={handleDrop1}
                                        onDragOver={handleDragOver1}
                                        style={{ minHeight: '156px' }}
                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                      >
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleFileChange1}
                                          className="hidden"
                                        />
                                        <div className="text-center">
                                          <Image
                                            src="/images/icons/id_card.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mx-auto mb-2"
                                          />
                                          <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                            Upload front
                                          </p>
                                          <p
                                            className="text-sm text-gray-500 mb-0"
                                            style={{ color: "#73615F" }}
                                          >
                                            JPEG or PNG only
                                          </p>
                                        </div>
                                      </label>
                                    ) : (
                                      <div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                          {photos.map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                              <Image
                                                src={photo.preview}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={156}
                                                height={156}
                                                className="object-cover"
                                                style={{ width: '100%', height: '156px' }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                              >
                                                <Image
                                                  src="/images/icons/delete.svg"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Col>

                                <Col md="6">
                                  <div className="drap-drop-box-full">
                                    {photos.length === 0 ? (
                                      <label
                                        onDrop={handleDrop1}
                                        onDragOver={handleDragOver1}
                                        style={{ minHeight: '156px' }}
                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                      >
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={handleFileChange1}
                                          className="hidden"
                                        />
                                        <div className="text-center">
                                          <Image
                                            src="/images/icons/bank-card-line1.svg"
                                            alt="Upload"
                                            width={30}
                                            height={30}
                                            className="mx-auto mb-2"
                                          />
                                          <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                            Upload back
                                          </p>
                                          <p
                                            className="text-sm text-gray-500 mb-0"
                                            style={{ color: "#73615F" }}
                                          >
                                            JPEG or PNG only
                                          </p>
                                        </div>
                                      </label>
                                    ) : (
                                      <div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                          {photos.map((photo, index) => (
                                            <div key={index} className="relative inline-block">
                                              <Image
                                                src={photo.preview}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={156}
                                                height={156}
                                                className="object-cover"
                                                style={{ width: '100%', height: '156px' }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                              >
                                                <Image
                                                  src="/images/icons/delete.svg"
                                                  width={20}
                                                  height={20}
                                                  alt="delete"
                                                />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Col>
                              </Row>


                            </div>
                          )}
                        </div>
                      </>
                    )}


                    {nationality === "Foreign" && (
                      <>
                        <div className='booking-details-brs mt-3'>
                          <p className='font-18 fw-medium'>Personal Details</p>

                          <p>Enter the following information exactly the same as it appears on the traveler’s passport or ID.</p>


                          <Row className='g-3'>
                            <Col md={12}>
                              <label className='form-label'>First name</label>
                              <div className='d-flex align-items-center form-group'>
                                <input type='text' className='form-control' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                                  <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                                </button>
                              </div>
                            </Col>

                            <Col md={12}>
                              <label className='form-label'>Last name</label>
                              <div className='d-flex align-items-center form-group'>
                                <input type='text' className='form-control' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                                  <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                                </button>
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Sex</label>
                                <select className='form-control' value={sex} onChange={(e) => setSex(e.target.value)}>
                                  <option>Female</option>
                                  <option>Male</option>
                                  <option>Other</option>
                                </select>
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Nationality</label>
                                <select className='form-control' value={nationalitySelect} onChange={(e) => setNationalitySelect(e.target.value)}>
                                  <option value=''>Select</option>
                                  <option value='India'>India</option>
                                  <option value='USA'>USA</option>
                                  <option value='UK'>UK</option>
                                </select>
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Date of birth</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Special Category</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>
                          </Row>

                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Accommodation Details</p>


                          <div className='form-group mb-4'>
                            <label>Name</label>
                            <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.x. GQJ8+V2H Calangute, Goa' />
                            <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                          </div>
                          <Row>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                              </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>City</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>State</label>
                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>PIN code</label>
                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                              </div>
                            </Col>
                          </Row>


                          <div className='form-group mb-4'>
                            <label>Mobile number</label>
                            <input type='number' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>


                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Arrival Details</p>


                          <div className='form-group mb-4'>
                            <label>Arrived From</label>
                            <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='Enter' />
                            <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                          </div>
                          <Row>
                            <Col md={6}>
                              <div className='form-group mb-4'>
                                <label>Date of arrival in India</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className='form-group mb-4'>
                                <label>Date of Arrival in Individual House</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />                                            </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>Time of Arrival in Individual House</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>



                          <div className='form-group mb-0'>
                            <label>Intended Duration of Stay in Individual House</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>


                        </div>



                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Upload an image of Guest passport</p>

                          <p>EnMake sure the photo of the guest passport isn’t blurry and that it clearly shows the guests face.</p>


                          <Row className='g-3'>
                            <Col md={12}>
                              <div className="d-flex align-items-center justify-content-start mb-3">
                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                  <label className="cursor-pointer d-flex align-items-center gap-2">
                                    <Image
                                      src="/images/icons/add_circle.svg"
                                      width={24}
                                      height={24}
                                      alt="Add more photos"
                                    />
                                    <span>Add more photos</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                              <div className="drap-drop-box-full">
                                {photos.length === 0 ? (
                                  <label
                                    onDrop={handleDrop1}
                                    onDragOver={handleDragOver1}
                                    style={{ minHeight: '156px' }}
                                    className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                    <div className="text-center">
                                      <Image
                                        src="/images/icons/menu_book.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                      />
                                      <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Upload passport
                                      </p>
                                      <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                      >
                                        JPEG or PNG only
                                      </p>
                                    </div>
                                  </label>
                                ) : (
                                  <div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                      {photos.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                          <Image
                                            src={photo.preview}
                                            alt={`Uploaded preview ${index + 1}`}
                                            width={156}
                                            height={156}
                                            className="object-cover"
                                            style={{ width: '100%', height: '156px' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 delete-icn"
                                          >
                                            <Image
                                              src="/images/icons/delete.svg"
                                              width={20}
                                              height={20}
                                              alt="delete"
                                            />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className='mt-4' >Re-Upload Image</p>
                            </Col>



                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Issuing country/region</label>
                                <Select
                                  name="aria-role-select"
                                  options={sortoption}
                                  placeholder="Name"
                                  className="react_selectbox"
                                  isSearchable={false}
                                  styles={customStyles}
                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Passport No.</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Date of birth</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Expiry Date</label>

                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select date"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />

                              </div>
                            </Col>
                          </Row>

                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Upload an image of Guest Visa document</p>

                          <p>Make sure the photo of guest visa document isn’t blurry and that it clearly shows the guests face.</p>


                          <Row className='g-3'>
                            <Col md={12}>
                              <div className="d-flex align-items-center justify-content-start mb-3">
                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                  <label className="cursor-pointer d-flex align-items-center gap-2">
                                    <Image
                                      src="/images/icons/add_circle.svg"
                                      width={24}
                                      height={24}
                                      alt="Add more photos"
                                    />
                                    <span>Add more photos</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                              <div className="drap-drop-box-full">
                                {photos.length === 0 ? (
                                  <label
                                    onDrop={handleDrop1}
                                    onDragOver={handleDragOver1}
                                    style={{ minHeight: '156px' }}
                                    className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                  >
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChange1}
                                      className="hidden"
                                    />
                                    <div className="text-center">
                                      <Image
                                        src="/images/icons/article_person.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                      />
                                      <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Upload visa
                                      </p>
                                      <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                      >
                                        JPEG or PNG only
                                      </p>
                                    </div>
                                  </label>
                                ) : (
                                  <div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                      {photos.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                          <Image
                                            src={photo.preview}
                                            alt={`Uploaded preview ${index + 1}`}
                                            width={156}
                                            height={156}
                                            className="object-cover"
                                            style={{ width: '100%', height: '156px' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 delete-icn"
                                          >
                                            <Image
                                              src="/images/icons/delete.svg"
                                              width={20}
                                              height={20}
                                              alt="delete"
                                            />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                            </Col>



                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Issuing country/region</label>
                                <Select
                                  name="aria-role-select"
                                  options={sortoption}
                                  placeholder="Name"
                                  className="react_selectbox"
                                  isSearchable={false}
                                  styles={customStyles}
                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Visa Number</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Date of Issue</label>
                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />
                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Valid Till</label>

                                <DatePicker
                                  selected={inactiveFrom}
                                  onChange={(date) => setInactiveFrom(date)}
                                  placeholderText="Select"
                                  className="form-control  custom-date-picker"
                                  dateFormat="dd/MM/yyyy"

                                />

                              </div>
                            </Col>

                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Visa Type</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>


                            <Col md={6}>
                              <div className='form-group'>
                                <label className='form-label'>Visa Subtype</label>
                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                              </div>
                            </Col>
                          </Row>

                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Address in country where residing permanently</p>



                          <Row>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                              </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>City</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>State</label>
                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>PIN code</label>
                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                              </div>
                            </Col>
                          </Row>





                        </div>



                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Address/Reference in India</p>



                          <Row>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                              </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>City</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>State</label>
                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>PIN code</label>
                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                              </div>
                            </Col>
                          </Row>





                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Whether Employed in India</p>

                          <Row>
                            <Col md={12} className='d-flex justify-content-start gap-2' >
                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2">
                                  <input
                                    type="radio"
                                    name="select-employed"
                                    id="WhetherEmployed-no"
                                    checked={WhetherEmployed === "No"}
                                    onChange={() => setWhetherEmployed("No")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  No
                                </label>
                              </div>

                              <div className="radio-select-box d-flex gap-2">
                                <label className="form-check-label d-flex gap-2" >
                                  <input
                                    type="radio"
                                    name="select-employed"
                                    id="WhetherEmployed-yes"
                                    checked={WhetherEmployed === "Yes"}
                                    onChange={() => setWhetherEmployed("Yes")}
                                  />
                                  <span className="radio-checkmark"></span>
                                  Yes
                                </label>
                              </div>
                            </Col>
                          </Row>

                        </div>



                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Purpose of Visit</p>

                          <div className='form-group '>

                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='Enter reason' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>

                        </div>



                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Next Destination</p>


                          <div className='form-group mb-4'>
                            <label>Place Name</label>
                            <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.g. Grand hyatt' />
                            <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                          </div>
                          <Row>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                              </div>
                            </Col>
                          </Row>
                          <div className='form-group mb-4'>
                            <label>City</label>
                            <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className='form-group mb-4'>
                                <label>State</label>
                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                              </div>
                            </Col>
                            <Col md={8}>
                              <div className='form-group mb-4'>
                                <label>PIN code</label>
                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                              </div>
                            </Col>
                          </Row>


                          <div className='form-group mb-4'>
                            <label>Mobile number</label>
                            <input type='number' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                            <span className='text-danger'>{errorMessages.city}</span>
                          </div>


                        </div>


                        <div className='booking-details-br mt-3'>
                          <p className='font-18 fw-medium'>Additional comments/ remarks</p>

                          <div className='form-group '>

                            <textarea className='form-control' placeholder="Add your message here"></textarea>
                          </div>

                        </div>



                      </>

                    )}
                  </Accordion.Body>
                </Accordion.Item>

              </Accordion>

            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='d-flex align-items-center justify-content-between modern-footer'>
          <Button variant="" onClick={updateDateClose} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>Cancel</Button>
          <Button variant="" onClick={() => { updateDateClose(); setSmShow(true); }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}>Check In</Button>
        </Modal.Footer>
      </Modal>


      <Modal
        className='checkin-complete'
        size=""
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        centered
      >

        <Modal.Body className='text-center' >
          <Image src='./images/icons/check-yel.svg' className='img-fluid ms-auto me-auto mb-2' width={20} height={20} alt='check' />
          <p className='fw-medium mb-2' >Check-in successful</p>



          <p className='mb-3' >The booking details have been updated.</p>


          <Button variant='' onClick={() => setSmShow(false)} className='' style={{ background: '#2C734A', borderRadius: '0', padding: '18px 24px', width: '182px', color: '#fff' }} >Okay</Button>

        </Modal.Body>
      </Modal>




      {/* second templte */}

      <Modal show={updateDatesModal1} onHide={updateDateClose1} animation={false} centered className='custom-theme-modal ' >
        {/* <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Check-in
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={updateDateClose1} />
                </Modal.Header> */}
        <Modal.Body className='p-0'>
          <div
            className='checkout-property'
            style={{
              backgroundImage: "url('/images/icons/checkout-property.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '28px',
              borderRadius: '8px',
              position: 'relative',
              color: '#fff',
              textAlign: 'left'
            }}
          >
            <h3 style={{ margin: 0, fontWeight: 500, color: '#fff' }}>Checkout today  by <br></br> 11:00AM</h3>

            <Image
              src='/images/icons/close-circle.svg'
              width={24}
              height={24}
              alt='Close'
              style={{ cursor: 'pointer', position: 'absolute', top: 12, right: 12, filter: 'brightness(0) invert(1)' }}
              onClick={updateDateClose1}
            />
          </div>


          <div className='p-4'>
            <div className='booking-details-br'>

              <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban, and Jenny </p>

              {/* <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p> */}
              <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p>


              <hr></hr>
              <div className='bm-contact mt-4'>
                <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                  gloria@slb.com,  +91 7876776655

                </p>


                <p className='border-bottom pb-4'></p>

                <ul className='room-list'>

                  <li>3-7 Aug, 2025  <span>3 nights</span></li>
                  <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} /> </li>
                </ul>


              </div>


            </div>




            <div className="room-card-wrapper">

              {/* Top Row */}
              <div className="d-flex align-items-center gap-2 room-header">
                <input type="checkbox" className="room-checkbox" />
                <span className="room-title">Room 2</span>
                <span className="d-flex align-items-center gap-1">
                  <Image
                    src="./images/icons/king_bed.svg"
                    width={18}
                    height={18}
                    alt="bed"
                  />
                  Bed A
                </span>
                <span className="status-badge">CHECKED-IN</span>
              </div>

              <hr className="divider" />

              {/* Guest Box */}
              <div className="guest-box d-flex align-items-center justify-content-between">
                <div className="guest-info d-flex align-items-center gap-3">
                  <span className="guest-label">Adult 1</span>
                  <span className="guest-name">Shuban Leena</span>
                </div>

                <div className="modify-section d-flex align-items-center gap-1">
                  <Image
                    src="/images/icons/edit.svg"
                    width={16}
                    height={16}
                    alt="edit"
                  />
                  <button className="modify-btn">Modify Checkout</button>
                </div>
              </div>

            </div>


            <div className="room-card-wrapper">

              {/* Top Row */}
              <div className="d-flex align-items-center gap-2 room-header">
                <input type="checkbox" className="room-checkbox" />
                <span className="room-title">Room 2</span>
                <span className="d-flex align-items-center gap-1">
                  <Image
                    src="./images/icons/king_bed.svg"
                    width={18}
                    height={18}
                    alt="bed"
                  />
                  Bed B
                </span>
                <span className="status-badge">CHECKED-IN</span>
              </div>

              <hr className="divider" />

              {/* Guest Box */}
              <div className="guest-box d-flex align-items-center justify-content-between">
                <div className="guest-info d-flex align-items-center gap-3">
                  <span className="guest-label">Adult 1</span>
                  <span className="guest-name">Shuban Leena</span>
                </div>

                <div className="modify-section d-flex align-items-center gap-1">
                  <Image
                    src="/images/icons/edit.svg"
                    width={16}
                    height={16}
                    alt="edit"
                  />
                  <button className="modify-btn">Modify Checkout</button>
                </div>
              </div>

            </div>
          </div>







        </Modal.Body>



        <Modal.Footer className='d-flex align-items-center justify-content-between '>
          <Button variant="" onClick={updateDateClose} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
            Cancel
          </Button>
          <Button variant="" onClick={updateDateClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
            Confirm and Checkout
          </Button>
        </Modal.Footer>



      </Modal>













      {/* update date */}


      <Modal show={updateDatesModal2} onHide={updateDateClose2} animation={false} centered className='custom-theme-modal ' >
        <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

          <Modal.Title>
            Update Checkout Date
          </Modal.Title>

          <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={updateDateClose2} />
        </Modal.Header>
        <Modal.Body className='pt-4 pb-4'>

          <div className={`update-step-1 ${isStep2 ? "d-none" : ""}`}>
            <div className='booking-details-br'>

              <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban Leena </p>
              <p className='d-flex gap-1' style={{ lineHeight: '24px' }} >Room 1 &nbsp; | &nbsp; <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='building' width={24} height={24} />  King bed  &nbsp; |  &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>Check-In-Upcoming</span>  </p>
              <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p>

              <div className='bm-contact mt-4'>
                <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                  gloria@slb.com,  +91 7876776655

                </p>


                <p className='border-bottom pb-4'></p>

                <ul className='room-list'>

                  <li>3-7 Aug, 2025  <span>3 nights</span></li>
                  <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} /> </li>
                </ul>


              </div>


            </div>



            <div className='booking-details-br mt-3'>
              <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Choose new checktout date </p>


              <Row className=''>
                <Col md={12}>
                  <div className='form-group mb-2'  >
                    <label> Checkout</label>
                    <DatePicker
                      selected={inactiveFrom}
                      onChange={(date) => setInactiveFrom(date)}
                      placeholderText="Select date"
                      className="form-control  custom-date-picker"
                      dateFormat="dd/MM/yyyy"

                    />
                  </div>
                </Col>
              </Row>

            </div>





          </div>


          <div className={`update-step-2 mt-3 ${isStep2 ? "" : "d-none"}`}>
            <p>Good news your dates are available! Check the new dates of your stay below:</p>

            <p>Original stay dates</p>
            <div className='booking-details-br mt-3 mb-3'>
              <p className='mb-0' >Check-in:  <strong>3 Aug, 2025</strong> </p>
              <p className='mb-0'>Checkout: <strong>3 Aug, 2025</strong></p>
              <p className='mt-2 mb-0'>Duration: 4 nights</p>

            </div>

            <hr style={{ margin: '30px 0' }} ></hr>

            <p>New stay dates</p>
            <div className='booking-details-br mt-3 mb-3'>
              <p className='mb-0' >Check-in:  <strong>3 Aug, 2025</strong> </p>
              <p className='mb-0'>Checkout: <strong>3 Aug, 2025</strong></p>
              <p className='mt-2 mb-0'>Duration: 4 nights</p>

            </div>

          </div>








        </Modal.Body>



        <Modal.Footer className='d-flex align-items-center justify-content-between '>

          {/* Cancel / Check Other Dates */}
          <Button
            variant=""
            onClick={() => {
              if (isStep2) {
                setIsStep2(false); // back to step 1
              } else {
                changepicClose(); // normal close
              }
            }}
            className='edit-btn'
            style={{ padding: '13px 15px', borderRadius: '0', fontSize: '14px' }}
          >
            {isStep2 ? "Check Other Dates" : "Cancel"}
          </Button>

          {/* Check Availability / Confirm This Change */}
          <Button
            variant=""
            onClick={() => {
              if (isStep2) {
                // Final confirmation logic
                changepicClose();
              } else {
                setIsStep2(true); // switch to step 2
              }
            }}
            className='search-btn complete-form-btn '
            style={{ padding: '13px 25px', borderRadius: '0' }}
          >
            {isStep2 ? "Confirm This Change" : "Check Availability"}
          </Button>

        </Modal.Footer>


      </Modal>



      {/* mark now show */}



      <Modal show={marknoShowsModal} onHide={marknoShowClose} animation={false} centered className='custom-theme-modal ' >
        <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

          <Modal.Title>
            Mark as No Show?
          </Modal.Title>

          <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={marknoShowClose} />
        </Modal.Header>
        <Modal.Body className='pt-4 pb-4'>

          <div className='update-step-1'>
            <div className='booking-details-br'>

              <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban Leena </p>
              <p className='d-flex gap-1' style={{ lineHeight: '24px' }} >Room 1 &nbsp; | &nbsp; <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='building' width={24} height={24} />  King bed  &nbsp; |  &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>Check-In-Upcoming</span>  </p>
              <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p>

              <div className='bm-contact mt-4'>
                <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                  gloria@slb.com,  +91 7876776655

                </p>


                <p className='border-bottom pb-4'></p>

                <ul className='room-list'>

                  <li>3-7 Aug, 2025  <span>3 nights</span></li>
                  <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} /> </li>
                </ul>


              </div>


            </div>



            <div className='booking-details-br mt-3'>

              <div className='inactive-box remove-company-box company-status-box'>


                <div className='forom-group mb-0'>
                  <label>Tell booking manager and property managers why you need to cancel</label>
                  <textarea
                    className="form-control textareabox mt-2"
                    rows={4}
                    placeholder="Add your message here"
                  />
                </div>

              </div>

            </div>





          </div>








        </Modal.Body>



        <Modal.Footer className='d-flex align-items-center justify-content-between '>
          <Button variant="" onClick={updateDateClose} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
            Cancel
          </Button>
          <Button variant="" onClick={updateDateClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
            Confrim This Change
          </Button>
        </Modal.Footer>



      </Modal>



      {/*  */}

      {/* Check in formalties */}

      <Modal show={updateDatesModal3} onHide={updateDateClose3} animation={false} centered className='custom-theme-modal ' >
        <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

          <Modal.Title>
            Check-in Formalities
          </Modal.Title>

          <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={updateDateClose3} />
        </Modal.Header>
        <Modal.Body className='pt-4 pb-4'>

          <div className='update-step-1'>
            <div className='booking-details-br'>

              <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban, and Jenny </p>

              {/* <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p> */}
              <p className='d-flex align-items-center gap-2' style={{ lineHeight: 'auto', fontSize: '14px' }} >

                Room 2  &nbsp;|
                <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> Bed A | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-pending'>Check-In-Pending</span>  </p>

              <hr></hr>
              <div className='bm-contact mt-4'>





                <ul className='room-list'>


                  <li>3-7 Aug, 2025  <span>3 nights</span></li>
                  <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={20} height={20} /> </li>
                </ul>


              </div>


            </div>

            <div className='booking-details-br mt-3'>
              <p className='font-18 fw-medium'>Guest Nationality</p>

              <Row>
                <Col md={12} className='d-flex justify-content-start gap-2' >
                  <div className="radio-select-box d-flex gap-2">
                    <label className="form-check-label d-flex gap-2" htmlFor="nationality-indian">
                      <input
                        type="radio"
                        name="select-nationality"
                        id="nationality-indian"
                        checked={nationality === "Indian"}
                        onChange={() => setNationality("Indian")}
                      />
                      <span className="radio-checkmark"></span>
                      Indian
                    </label>
                  </div>

                  <div className="radio-select-box d-flex gap-2">
                    <label className="form-check-label d-flex gap-2" htmlFor="nationality-foreign">
                      <input
                        type="radio"
                        name="select-nationality"
                        id="nationality-foreign"
                        checked={nationality === "Foreign"}
                        onChange={() => setNationality("Foreign")}
                      />
                      <span className="radio-checkmark"></span>
                      Foreign National
                    </label>
                  </div>
                </Col>
              </Row>

            </div>



            {nationality === "Indian" && (

              <>
                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Choose an ID type to add</p>

                  <Row>
                    <Col md={12} className='d-flex justify-content-start gap-2' >
                      <div className="radio-select-box d-flex gap-2">
                        <label className="form-check-label d-flex gap-2" htmlFor="id-type-passport">
                          <input
                            type="radio"
                            name="select-id-type"
                            id="id-type-passport"
                            checked={idType === "Passport"}
                            onChange={() => setIdType("Passport")}
                          />
                          <span className="radio-checkmark"></span>
                          Passport
                        </label>
                      </div>

                      <div className="radio-select-box d-flex gap-2">
                        <label className="form-check-label d-flex gap-2" htmlFor="id-type-aadhaar">
                          <input
                            type="radio"
                            name="select-id-type"
                            id="id-type-aadhaar"
                            checked={idType === "Aadhaarcard"}
                            onChange={() => setIdType("Aadhaarcard")}
                          />
                          <span className="radio-checkmark"></span>
                          Aadhaar card
                        </label>
                      </div>

                      <div className="radio-select-box d-flex gap-2">
                        <label className="form-check-label d-flex gap-2" htmlFor="id-type-driving">
                          <input
                            type="radio"
                            name="select-id-type"
                            id="id-type-driving"
                            checked={idType === "Drivinglicence"}
                            onChange={() => setIdType("Drivinglicence")}
                          />
                          <span className="radio-checkmark"></span>
                          Driving licence
                        </label>
                      </div>
                    </Col>
                  </Row>



                  <hr />

                  {/* Conditional fields for ID type */}
                  {idType === "Passport" && (
                    <>
                      <p className='font-18 fw-medium'>Upload an image of Guest passport</p>
                      <p>Make sure the photo of guest passport isn’t blurry and that it clearly shows the guests face.</p>
                      <div className="d-flex align-items-center justify-content-start mb-3">
                        {photos.length > 0 && photos.length < MAX_PHOTOS && (
                          <label className="cursor-pointer d-flex align-items-center gap-2">
                            <Image
                              src="/images/icons/add_circle.svg"
                              width={24}
                              height={24}
                              alt="Add more photos"
                            />
                            <span>Add more photos</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange1}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <div className="drap-drop-box-full">
                        {photos.length === 0 ? (
                          <label
                            onDrop={handleDrop1}
                            onDragOver={handleDragOver1}
                            style={{ minHeight: '156px' }}
                            className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange1}
                              className="hidden"
                            />
                            <div className="text-center">
                              <Image
                                src="/images/icons/menu_book.svg"
                                alt="Upload"
                                width={30}
                                height={30}
                                className="mx-auto mb-2"
                              />
                              <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                Upload passport
                              </p>
                              <p
                                className="text-sm text-gray-500 mb-0"
                                style={{ color: "#73615F" }}
                              >
                                JPEG or PNG only
                              </p>
                            </div>
                          </label>
                        ) : (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                              {photos.map((photo, index) => (
                                <div key={index} className="relative inline-block">
                                  <Image
                                    src={photo.preview}
                                    alt={`Uploaded preview ${index + 1}`}
                                    width={156}
                                    height={156}
                                    className="object-cover"
                                    style={{ width: '100%', height: '156px' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-1 right-1 delete-icn"
                                  >
                                    <Image
                                      src="/images/icons/delete.svg"
                                      width={20}
                                      height={20}
                                      alt="delete"
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className='mt-4' >Re-Upload Image</p>
                    </>
                  )}
                  {idType === "Aadhaarcard" && (
                    <div className="aadhaar-fields mt-3">
                      <p className='font-18 fw-medium'>Upload images of Guest Aadhaar card</p>
                      <p>Make sure the photos aren’t blurry and the front of the Aadhaar card clearly shows the guests face.</p>

                      <Row>
                        <Col md="6">
                          <div className="drap-drop-box-full">
                            {photos.length === 0 ? (
                              <label
                                onDrop={handleDrop1}
                                onDragOver={handleDragOver1}
                                style={{ minHeight: '156px' }}
                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleFileChange1}
                                  className="hidden"
                                />
                                <div className="text-center">
                                  <Image
                                    src="/images/icons/id_card.svg"
                                    alt="Upload"
                                    width={30}
                                    height={30}
                                    className="mx-auto mb-2"
                                  />
                                  <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                    Upload front
                                  </p>
                                  <p
                                    className="text-sm text-gray-500 mb-0"
                                    style={{ color: "#73615F" }}
                                  >
                                    JPEG or PNG only
                                  </p>
                                </div>
                              </label>
                            ) : (
                              <div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                  {photos.map((photo, index) => (
                                    <div key={index} className="relative inline-block">
                                      <Image
                                        src={photo.preview}
                                        alt={`Uploaded preview ${index + 1}`}
                                        width={156}
                                        height={156}
                                        className="object-cover"
                                        style={{ width: '100%', height: '156px' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-1 right-1 delete-icn"
                                      >
                                        <Image
                                          src="/images/icons/delete.svg"
                                          width={20}
                                          height={20}
                                          alt="delete"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Col>

                        <Col md="6">
                          <div className="drap-drop-box-full">
                            {photos.length === 0 ? (
                              <label
                                onDrop={handleDrop1}
                                onDragOver={handleDragOver1}
                                style={{ minHeight: '156px' }}
                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleFileChange1}
                                  className="hidden"
                                />
                                <div className="text-center">
                                  <Image
                                    src="/images/icons/bank-card-line1.svg"
                                    alt="Upload"
                                    width={30}
                                    height={30}
                                    className="mx-auto mb-2"
                                  />
                                  <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                    Upload back
                                  </p>
                                  <p
                                    className="text-sm text-gray-500 mb-0"
                                    style={{ color: "#73615F" }}
                                  >
                                    JPEG or PNG only
                                  </p>
                                </div>
                              </label>
                            ) : (
                              <div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                  {photos.map((photo, index) => (
                                    <div key={index} className="relative inline-block">
                                      <Image
                                        src={photo.preview}
                                        alt={`Uploaded preview ${index + 1}`}
                                        width={156}
                                        height={156}
                                        className="object-cover"
                                        style={{ width: '100%', height: '156px' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-1 right-1 delete-icn"
                                      >
                                        <Image
                                          src="/images/icons/delete.svg"
                                          width={20}
                                          height={20}
                                          alt="delete"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>

                    </div>
                  )}
                  {idType === "Drivinglicence" && (
                    <div className="driving-fields mt-3">
                      <p className='font-18 fw-medium'>Enter Driving Licence Number</p>
                      <p>Make sure the photos aren’t blurry and the front of the driving licence clearly shows the guests face.</p>
                      <Row>
                        <Col md="6">
                          <div className="drap-drop-box-full">
                            {photos.length === 0 ? (
                              <label
                                onDrop={handleDrop1}
                                onDragOver={handleDragOver1}
                                style={{ minHeight: '156px' }}
                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleFileChange1}
                                  className="hidden"
                                />
                                <div className="text-center">
                                  <Image
                                    src="/images/icons/id_card.svg"
                                    alt="Upload"
                                    width={30}
                                    height={30}
                                    className="mx-auto mb-2"
                                  />
                                  <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                    Upload front
                                  </p>
                                  <p
                                    className="text-sm text-gray-500 mb-0"
                                    style={{ color: "#73615F" }}
                                  >
                                    JPEG or PNG only
                                  </p>
                                </div>
                              </label>
                            ) : (
                              <div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                  {photos.map((photo, index) => (
                                    <div key={index} className="relative inline-block">
                                      <Image
                                        src={photo.preview}
                                        alt={`Uploaded preview ${index + 1}`}
                                        width={156}
                                        height={156}
                                        className="object-cover"
                                        style={{ width: '100%', height: '156px' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-1 right-1 delete-icn"
                                      >
                                        <Image
                                          src="/images/icons/delete.svg"
                                          width={20}
                                          height={20}
                                          alt="delete"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Col>

                        <Col md="6">
                          <div className="drap-drop-box-full">
                            {photos.length === 0 ? (
                              <label
                                onDrop={handleDrop1}
                                onDragOver={handleDragOver1}
                                style={{ minHeight: '156px' }}
                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleFileChange1}
                                  className="hidden"
                                />
                                <div className="text-center">
                                  <Image
                                    src="/images/icons/bank-card-line1.svg"
                                    alt="Upload"
                                    width={30}
                                    height={30}
                                    className="mx-auto mb-2"
                                  />
                                  <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                    Upload back
                                  </p>
                                  <p
                                    className="text-sm text-gray-500 mb-0"
                                    style={{ color: "#73615F" }}
                                  >
                                    JPEG or PNG only
                                  </p>
                                </div>
                              </label>
                            ) : (
                              <div>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                  {photos.map((photo, index) => (
                                    <div key={index} className="relative inline-block">
                                      <Image
                                        src={photo.preview}
                                        alt={`Uploaded preview ${index + 1}`}
                                        width={156}
                                        height={156}
                                        className="object-cover"
                                        style={{ width: '100%', height: '156px' }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-1 right-1 delete-icn"
                                      >
                                        <Image
                                          src="/images/icons/delete.svg"
                                          width={20}
                                          height={20}
                                          alt="delete"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>


                    </div>
                  )}
                </div>
              </>
            )}


            {nationality === "Foreign" && (
              <>
                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Personal Details</p>

                  <p>Enter the following information exactly the same as it appears on the traveler’s passport or ID.</p>


                  <Row className='g-3'>
                    <Col md={12}>
                      <label className='form-label'>First name</label>
                      <div className='d-flex align-items-center form-group'>
                        <input type='text' className='form-control' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                          <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                        </button>
                      </div>
                    </Col>

                    <Col md={12}>
                      <label className='form-label'>Last name</label>
                      <div className='d-flex align-items-center form-group'>
                        <input type='text' className='form-control' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                          <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                        </button>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Sex</label>
                        <select className='form-control' value={sex} onChange={(e) => setSex(e.target.value)}>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Nationality</label>
                        <select className='form-control' value={nationalitySelect} onChange={(e) => setNationalitySelect(e.target.value)}>
                          <option value=''>Select</option>
                          <option value='India'>India</option>
                          <option value='USA'>USA</option>
                          <option value='UK'>UK</option>
                        </select>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Date of birth</label>
                        <DatePicker
                          selected={inactiveFrom}
                          onChange={(date) => setInactiveFrom(date)}
                          placeholderText="Select date"
                          className="form-control  custom-date-picker"
                          dateFormat="dd/MM/yyyy"

                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Special Category</label>
                        <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                      </div>
                    </Col>
                  </Row>

                </div>


                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Accommodation Details</p>


                  <div className='form-group mb-4'>
                    <label>Name</label>
                    <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.x. GQJ8+V2H Calangute, Goa' />
                    <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                  </div>
                  <Row>
                    <Col md={8}>
                      <div className='form-group mb-4'>
                        <label>Street and number</label>
                        <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.street}</span>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className='form-group mb-4'>
                        <label>Flat/House No.</label>
                        <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.flatNo}</span>
                      </div>
                    </Col>
                  </Row>
                  <div className='form-group mb-4'>
                    <label>City</label>
                    <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>
                  <Row>
                    <Col md={4}>
                      <div className='form-group mb-4'>
                        <label>State</label>
                        <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.state}</span>
                      </div>
                    </Col>
                    <Col md={8}>
                      <div className='form-group mb-4'>
                        <label>PIN code</label>
                        <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.pinCode}</span>
                      </div>
                    </Col>
                  </Row>


                  <div className='form-group mb-4'>
                    <label>Mobile number</label>
                    <input type='number' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>


                </div>


                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Arrival Details</p>


                  <div className='form-group mb-4'>
                    <label>Arrived From</label>
                    <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='Enter' />
                    <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                  </div>
                  <Row>
                    <Col md={6}>
                      <div className='form-group mb-4'>
                        <label>Date of arrival in India</label>
                        <DatePicker
                          selected={inactiveFrom}
                          onChange={(date) => setInactiveFrom(date)}
                          placeholderText="Select date"
                          className="form-control  custom-date-picker"
                          dateFormat="dd/MM/yyyy"

                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className='form-group mb-4'>
                        <label>Date of Arrival in Individual House</label>
                        <DatePicker
                          selected={inactiveFrom}
                          onChange={(date) => setInactiveFrom(date)}
                          placeholderText="Select date"
                          className="form-control  custom-date-picker"
                          dateFormat="dd/MM/yyyy"

                        />                                            </div>
                    </Col>
                  </Row>
                  <div className='form-group mb-4'>
                    <label>Time of Arrival in Individual House</label>
                    <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>



                  <div className='form-group mb-0'>
                    <label>Intended Duration of Stay in Individual House</label>
                    <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>


                </div>



                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Upload an image of Guest passport</p>

                  <p>EnMake sure the photo of the guest passport isn’t blurry and that it clearly shows the guests face.</p>


                  <Row className='g-3'>
                    <Col md={12}>
                      <div className="d-flex align-items-center justify-content-start mb-3">
                        {photos.length > 0 && photos.length < MAX_PHOTOS && (
                          <label className="cursor-pointer d-flex align-items-center gap-2">
                            <Image
                              src="/images/icons/add_circle.svg"
                              width={24}
                              height={24}
                              alt="Add more photos"
                            />
                            <span>Add more photos</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange1}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <div className="drap-drop-box-full">
                        {photos.length === 0 ? (
                          <label
                            onDrop={handleDrop1}
                            onDragOver={handleDragOver1}
                            style={{ minHeight: '156px' }}
                            className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange1}
                              className="hidden"
                            />
                            <div className="text-center">
                              <Image
                                src="/images/icons/menu_book.svg"
                                alt="Upload"
                                width={30}
                                height={30}
                                className="mx-auto mb-2"
                              />
                              <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                Upload passport
                              </p>
                              <p
                                className="text-sm text-gray-500 mb-0"
                                style={{ color: "#73615F" }}
                              >
                                JPEG or PNG only
                              </p>
                            </div>
                          </label>
                        ) : (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                              {photos.map((photo, index) => (
                                <div key={index} className="relative inline-block">
                                  <Image
                                    src={photo.preview}
                                    alt={`Uploaded preview ${index + 1}`}
                                    width={156}
                                    height={156}
                                    className="object-cover"
                                    style={{ width: '100%', height: '156px' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-1 right-1 delete-icn"
                                  >
                                    <Image
                                      src="/images/icons/delete.svg"
                                      width={20}
                                      height={20}
                                      alt="delete"
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className='mt-4' >Re-Upload Image</p>
                    </Col>



                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Issuing country/region</label>
                        <Select
                          name="aria-role-select"
                          options={sortoption}
                          placeholder="Name"
                          className="react_selectbox"
                          isSearchable={false}
                          styles={customStyles}
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Passport No.</label>
                        <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Date of birth</label>
                        <DatePicker
                          selected={inactiveFrom}
                          onChange={(date) => setInactiveFrom(date)}
                          placeholderText="Select date"
                          className="form-control  custom-date-picker"
                          dateFormat="dd/MM/yyyy"

                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Expiry Date</label>

                        <DatePicker
                          selected={inactiveFrom}
                          onChange={(date) => setInactiveFrom(date)}
                          placeholderText="Select date"
                          className="form-control  custom-date-picker"
                          dateFormat="dd/MM/yyyy"

                        />

                      </div>
                    </Col>
                  </Row>

                </div>


                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Upload an image of Guest Visa document</p>

                  <p>Make sure the photo of guest visa document isn’t blurry and that it clearly shows the guests face.</p>


                  <Row className='g-3'>
                    <Col md={12}>
                      <div className="d-flex align-items-center justify-content-start mb-3">
                        {photos.length > 0 && photos.length < MAX_PHOTOS && (
                          <label className="cursor-pointer d-flex align-items-center gap-2">
                            <Image
                              src="/images/icons/add_circle.svg"
                              width={24}
                              height={24}
                              alt="Add more photos"
                            />
                            <span>Add more photos</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange1}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      <div className="drap-drop-box-full">
                        {photos.length === 0 ? (
                          <label
                            onDrop={handleDrop1}
                            onDragOver={handleDragOver1}
                            style={{ minHeight: '156px' }}
                            className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange1}
                              className="hidden"
                            />
                            <div className="text-center">
                              <Image
                                src="/images/icons/article_person.svg"
                                alt="Upload"
                                width={30}
                                height={30}
                                className="mx-auto mb-2"
                              />
                              <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                Upload visa
                              </p>
                              <p
                                className="text-sm text-gray-500 mb-0"
                                style={{ color: "#73615F" }}
                              >
                                JPEG or PNG only
                              </p>
                            </div>
                          </label>
                        ) : (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                              {photos.map((photo, index) => (
                                <div key={index} className="relative inline-block">
                                  <Image
                                    src={photo.preview}
                                    alt={`Uploaded preview ${index + 1}`}
                                    width={156}
                                    height={156}
                                    className="object-cover"
                                    style={{ width: '100%', height: '156px' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-1 right-1 delete-icn"
                                  >
                                    <Image
                                      src="/images/icons/delete.svg"
                                      width={20}
                                      height={20}
                                      alt="delete"
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </Col>



                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Issuing country/region</label>
                        <Select
                          name="aria-role-select"
                          options={sortoption}
                          placeholder="Name"
                          className="react_selectbox"
                          isSearchable={false}
                          styles={customStyles}
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Visa Number</label>
                        <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Date of Issue</label>
                        <DatePicker
                          selected={inactiveFrom}
                          onChange={(date) => setInactiveFrom(date)}
                          placeholderText="Select"
                          className="form-control  custom-date-picker"
                          dateFormat="dd/MM/yyyy"

                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Valid Till</label>

                        <DatePicker
                          selected={inactiveFrom}
                          onChange={(date) => setInactiveFrom(date)}
                          placeholderText="Select"
                          className="form-control  custom-date-picker"
                          dateFormat="dd/MM/yyyy"

                        />

                      </div>
                    </Col>

                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Visa Type</label>
                        <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                      </div>
                    </Col>


                    <Col md={6}>
                      <div className='form-group'>
                        <label className='form-label'>Visa Subtype</label>
                        <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                      </div>
                    </Col>
                  </Row>

                </div>


                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Address in country where residing permanently</p>



                  <Row>
                    <Col md={8}>
                      <div className='form-group mb-4'>
                        <label>Street and number</label>
                        <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.street}</span>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className='form-group mb-4'>
                        <label>Flat/House No.</label>
                        <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.flatNo}</span>
                      </div>
                    </Col>
                  </Row>
                  <div className='form-group mb-4'>
                    <label>City</label>
                    <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>
                  <Row>
                    <Col md={4}>
                      <div className='form-group mb-4'>
                        <label>State</label>
                        <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.state}</span>
                      </div>
                    </Col>
                    <Col md={8}>
                      <div className='form-group mb-4'>
                        <label>PIN code</label>
                        <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.pinCode}</span>
                      </div>
                    </Col>
                  </Row>





                </div>



                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Address/Reference in India</p>



                  <Row>
                    <Col md={8}>
                      <div className='form-group mb-4'>
                        <label>Street and number</label>
                        <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.street}</span>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className='form-group mb-4'>
                        <label>Flat/House No.</label>
                        <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.flatNo}</span>
                      </div>
                    </Col>
                  </Row>
                  <div className='form-group mb-4'>
                    <label>City</label>
                    <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>
                  <Row>
                    <Col md={4}>
                      <div className='form-group mb-4'>
                        <label>State</label>
                        <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.state}</span>
                      </div>
                    </Col>
                    <Col md={8}>
                      <div className='form-group mb-4'>
                        <label>PIN code</label>
                        <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.pinCode}</span>
                      </div>
                    </Col>
                  </Row>





                </div>


                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Whether Employed in India</p>

                  <Row>
                    <Col md={12} className='d-flex justify-content-start gap-2' >
                      <div className="radio-select-box d-flex gap-2">
                        <label className="form-check-label d-flex gap-2">
                          <input
                            type="radio"
                            name="select-employed"
                            id="WhetherEmployed-no"
                            checked={WhetherEmployed === "No"}
                            onChange={() => setWhetherEmployed("No")}
                          />
                          <span className="radio-checkmark"></span>
                          No
                        </label>
                      </div>

                      <div className="radio-select-box d-flex gap-2">
                        <label className="form-check-label d-flex gap-2" >
                          <input
                            type="radio"
                            name="select-employed"
                            id="WhetherEmployed-yes"
                            checked={WhetherEmployed === "Yes"}
                            onChange={() => setWhetherEmployed("Yes")}
                          />
                          <span className="radio-checkmark"></span>
                          Yes
                        </label>
                      </div>
                    </Col>
                  </Row>

                </div>



                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Purpose of Visit</p>

                  <div className='form-group '>

                    <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='Enter reason' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>

                </div>



                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Next Destination</p>


                  <div className='form-group mb-4'>
                    <label>Place Name</label>
                    <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.g. Grand hyatt' />
                    <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                  </div>
                  <Row>
                    <Col md={8}>
                      <div className='form-group mb-4'>
                        <label>Street and number</label>
                        <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.street}</span>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className='form-group mb-4'>
                        <label>Flat/House No.</label>
                        <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.flatNo}</span>
                      </div>
                    </Col>
                  </Row>
                  <div className='form-group mb-4'>
                    <label>City</label>
                    <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>
                  <Row>
                    <Col md={4}>
                      <div className='form-group mb-4'>
                        <label>State</label>
                        <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.state}</span>
                      </div>
                    </Col>
                    <Col md={8}>
                      <div className='form-group mb-4'>
                        <label>PIN code</label>
                        <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.pinCode}</span>
                      </div>
                    </Col>
                  </Row>


                  <div className='form-group mb-4'>
                    <label>Mobile number</label>
                    <input type='number' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                    <span className='text-danger'>{errorMessages.city}</span>
                  </div>


                </div>


                <div className='booking-details-br mt-3'>
                  <p className='font-18 fw-medium'>Additional comments/ remarks</p>

                  <div className='form-group '>

                    <textarea className='form-control' placeholder="Add your message here"></textarea>
                  </div>

                </div>



              </>

            )}

          </div>


















        </Modal.Body>



        <Modal.Footer className='d-flex align-items-center justify-content-between modern-footer'>
          <Button variant="" onClick={updateDateClose3} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
            Cancel
          </Button>
          <Button variant="" onClick={() => {
            updateDateClose3();
            setSmShow(true);

          }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
            Complete
          </Button>
        </Modal.Footer>



      </Modal>


      {/*  */}

      {/*  */}

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
                                                     
                                                     
                                                                             <Button variant="" className='edit-btn gap-2'>View Trips  <Image src='/images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
                                                     
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
