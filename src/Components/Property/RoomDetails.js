"use client"
import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button, Table, Thead, Modal, Tabs, Tab, Badge, Form } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus, components } from 'react-select';
import DatePicker from "react-datepicker";
import { PropertyRoomDetailAPI } from "@/services/provider";
import { useParams, useSearchParams } from "next/navigation";
import { RoomStatusModal } from "./RoomStatusModal";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { getItemLocalStorage } from "@/utils/browserStorage";
import { checkPermission } from "@/utils/helper";

export default function RoomDetails() {
    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionRoom = checkPermission(permissionArray, "room");
    const permissionRoomPhoto = checkPermission(permissionArray, "room_photo");

    //can permission room
    const canUpdateRoom = permissionRoom === true || permissionRoom?.can_update;
    const canDeleteRoom = permissionRoom === true || permissionRoom?.can_delete;


    const param = useParams();

    const id = param.id;
    const searchParams = useSearchParams();
    const paramShowModal = searchParams.get("show");

    const [roomIdForUrl, setRoomIdForUrl] = useState(null)
    const statusOption = [
        { value: "active", label: "Active" },
        { value: "Inactive", label: "Inactive" },

    ];

    // const reasonsOption = [
    //     { value: "reason1", label: "Reason 1" },
    //     { value: "reason1", label: "Reason 2" },
    // ]

    const [selectedStatus, setSelectedStatus] = useState(null);


    const [roomDetailsData, setRoomDetailsData] = useState(null)
    const [roomShow, roomstatussetShow] = useState(false);

    const roomStatusClose = () => roomstatussetShow(false);
    const roomStatusShow = () => roomstatussetShow(true);


    // 

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


    const [inactiveFrom, setInactiveFrom] = useState(null);
    const [inactiveTo, setInactiveTo] = useState(null);
    const [permanent, setPermanent] = useState(false);

    // 


    const [amenitySearch2, setAmenitySearch2] = useState('');
    const [showAmenitySearch2, setShowAmenitySearch2] = useState(false);

    const amenities2 = [

        { icon: "/images/icons/printer.svg", label: "Business services" },
        { icon: "/images/icons/wifi.svg", label: "Free internet access" },

    ];

    const filteredAmenities2 = amenities2.filter(a =>
        a.label.toLowerCase().includes(amenitySearch2.toLowerCase())
    );

    const [selectedAmenities2, setSelectedAmenities2] = useState([]);

    const handleAmenitySelect2 = (label) => {
        setSelectedAmenities2((prev) =>
            prev.includes(label)
                ? prev.filter((l) => l !== label)
                : [...prev, label]
        );
    };


    // 



    const [amenitySearch, setAmenitySearch] = useState("");
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const amenities = [
        { icon: "/images/icons/ac.svg", label: "Air conditioning" },
        { icon: "/images/icons/concierge.svg", label: "Concierge" },
        { icon: "/images/icons/fitness_center.svg", label: "Fitness center" },
        { icon: "/images/icons/wifi.svg", label: "Free internet access" },
        { icon: "/images/icons/local_parking.svg", label: "Free parking" },
        { icon: "/images/icons/interpreter.svg", label: "Meeting facilities" }
    ];

    const filteredAmenities = amenities.filter((a) =>
        a.label.toLowerCase().includes(amenitySearch.toLowerCase())
    );

    const toggleAmenity = (label) => {
        setSelectedAmenities((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };


    useEffect(() => {
        const saved = localStorage.getItem("roomIdForUrl");
        if (saved) {
            setRoomIdForUrl(saved);
        }
    }, [])

    // const fetchRoomDetailsById = async () => {
    //     try {
    //         const response = await PropertyRoomDetailAPI(id);
    //         if (response?.data?.success) {
    //             console.log(response.data.response);
    //             setRoomDetailsData(response.data.response);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // In your existing useEffect that fetches room details, add:
    const fetchRoomDetailsById = async () => {
        try {
            const response = await PropertyRoomDetailAPI(id);
            if (response?.data?.success) {
                const data = response.data.response;
                setRoomDetailsData(data);                
                if (data?.property_details?.uid && !roomIdForUrl) {
                    setRoomIdForUrl(data.property_details.uid);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (id) {
            fetchRoomDetailsById();
        }
    }, [id]);

    useEffect(() => {
        if (paramShowModal == "true") {
            roomstatussetShow(true)
        }
    }, [paramShowModal])

    // return (
    //     <>

    //         <Header />
    //         <ToastContainer />

    //         <div className='Breadcrumb'>
    //             <Container>
    //                 <Row>
    //                     <Col md={12} >
    //                         <ul className='d-flex align-items-center breadcrumb-list'>

    //                             <li><Link href='/PropertyListing?tab=assigned'>Properties</Link></li>
    //                             {/* <li><Link href='/PropertyDetails'>Astha Homes, Mumbai Listing Editor</Link></li> */}
    //                             <li><Link href={`/propertyDetails?uid=${roomIdForUrl}`}>{roomDetailsData?.property_details.property_name}, {roomDetailsData?.property_details.city}</Link></li>

    //                             <li>Room 1 </li>
    //                         </ul>
    //                     </Col>
    //                 </Row>
    //             </Container>
    //         </div>

    //         <div className='page-body  pt-4 pb-4'>
    //             <Container>
    //                 <Row>
    //                     <Col md={12} >
    //                         <Link href={`/propertyDetails?uid=${roomIdForUrl}`} className='back-page'>
    //                             <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
    //                             Back</Link>
    //                     </Col>


    //                     <Col md={12} className='mt-4 mb-4' >
    //                         <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
    //                             <div className="d-flex align-items-center gap-2">
    //                                 <h2 className='page-title'>{roomDetailsData?.room_name}  </h2>
    //                                 <span className="badge-active" >  {roomDetailsData?.room_status} </span >
    //                             </div>

    //                             <Link onClick={roomStatusShow} href='javascriptvoid:(0)' className='btn-company-delete btn-light-transparent'>  <Image src="/images/icons/room_preferences.svg" className='img-fluid' width={25} height={25} alt='setting' />  Room Status </Link>


    //                         </div>
    //                     </Col>


    //                     <Col md={12}>

    //                         <Row>
    //                             <Col md={6}>
    //                                 <div className='d-flex align-items-start justify-content-between mb-5'>
    //                                     <div className='general-info'>
    //                                         <h2 className='page-title'> General information</h2>
    //                                         <p className='mb-0'>Change or edit all company related general information from here</p>
    //                                     </div>

    //                                     <Link href={`/Editroomdetails/${id}`} className='edit-company-btn' style={{ color: '#463527', textDecoration: 'none' }} > Manage </Link>

    //                                 </div>


    //                                 <div className='comapny-information-box '>
    //                                     <h4 className='mb-4'>Basic Information</h4>

    //                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                         <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Room name  </span>
    //                                         <br></br>
    //                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
    //                                             {roomDetailsData?.room_name} </span>
    //                                     </p>



    //                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                         <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Room type  </span>
    //                                         <br></br>
    //                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
    //                                             {roomDetailsData?.room_type} </span>

    //                                     </p>



    //                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                         <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Room size (sq ft)  </span>
    //                                         <br></br>
    //                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
    //                                             {roomDetailsData?.room_size_sqft}



    //                                         </span>

    //                                     </p>

    //                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                         <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Room description  </span>
    //                                         <br></br>
    //                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >{roomDetailsData?.room_description} </span>

    //                                     </p>




    //                                 </div>





    //                                 <div className='comapny-information-box '>
    //                                     <h4 className='mb-4'>Bed information</h4>
    //                                     {roomDetailsData?.beds.length > 0 && roomDetailsData?.beds.map((bed, i) => (
    //                                         <p key={i} style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                             <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Bed type and name  </span> <br></br>


    //                                             <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
    //                                                 {bed?.type}, {bed?.name}
    //                                             </span>

    //                                         </p>
    //                                     ))}






    //                                 </div>



    //                                 <div className='comapny-information-box property-list-2'>
    //                                     <h4 className='mb-4'>Room Occupancy</h4>



    //                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                         <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Bathrooms  </span> <br></br>


    //                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
    //                                             {roomDetailsData?.bathrooms}
    //                                         </span>

    //                                     </p>


    //                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                         <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Bedroom preference  </span> <br></br>


    //                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
    //                                             {roomDetailsData?.bedroom_preference}</span>

    //                                     </p>


    //                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                         <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Number of guests allowed in this room  </span> <br></br>


    //                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >{roomDetailsData?.max_guests} </span>

    //                                     </p>


    //                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
    //                                         <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Average base price of this bedroom  </span> <br></br>


    //                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
    //                                             ₹{roomDetailsData?.avg_base_price_per_night} /night</span>

    //                                     </p>
    //                                 </div>


    //                                 <div className='comapny-information-box property-list-2'>
    //                                     <h4 className='mb-0'>Room Level Amenities</h4>
    //                                     <p> You’ve added these to your listing so far. </p>

    //                                     <ol className="br-list-data ps-0 mb-0">
    //                                         {filteredAmenities.map((a, idx) => {
    //                                             const isSelected = selectedAmenities.includes(a.label);
    //                                             return (
    //                                                 <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
    //                                                     <span className='br-list gap-2'>
    //                                                         <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
    //                                                         {a.label}
    //                                                     </span>

    //                                                 </li>
    //                                             );
    //                                         })}

    //                                         <li>  <span className='br-list gap-2'>View less </span></li>

    //                                         {filteredAmenities.length === 0 && (
    //                                             <li style={{ color: "#73615F" }}>No amenities found.</li>
    //                                         )}
    //                                     </ol>



    //                                     <hr></hr>


    //                                 </div>



    //                                 <div className='comapny-information-box '>
    //                                     <h4 className='mb-4'>Photos</h4>

    //                                     <div className="grid upload-photo grid-cols-3 mt-0 gap-4">


    //                                         {roomDetailsData?.room_photos.map((item, i) => (<div key={i} className="relative group">
    //                                             {item.is_room_cover_photo && <span className="absolute top-4 left-3  text-white text-xs px-2 py-1  cover-photo">
    //                                                 Cover photo
    //                                             </span>}
    //                                             <Image
    //                                                 src={`https://alicedevapi.casamelhor.in${item?.room_photo_url}`}
    //                                                 alt="proprty"
    //                                                 width={300}
    //                                                 height={200}
    //                                                 className="object-cover w-full"
    //                                             />



    //                                         </div>))}


    //                                         {/* <div className="relative group">
    //                                                                                        <Image
    //                                                                                            src="/images/icons/amentiy.jpg"
    //                                                                                            alt="proprty"
    //                                                                                            width={300}
    //                                                                                            height={200}
    //                                                                                            className="object-cover w-full"
    //                                                                                        />


    //                                                                                    </div>

    //                                                                                       <div className="relative group">
    //                                                                                        <Image
    //                                                                                            src="/images/icons/amentiy.jpg"
    //                                                                                            alt="proprty"
    //                                                                                            width={300}
    //                                                                                            height={200}
    //                                                                                            className="object-cover w-full"
    //                                                                                        />



    //                                                                                    </div>
    //                                             */}


    //                                         {/* Show Add Photo only if < 5 */}

    //                                     </div>

    //                                     <hr></hr>



    //                                 </div>







    //                             </Col>

    //                         </Row>
    //                     </Col>

    //                 </Row>
    //             </Container>
    //         </div>



    //         <RoomStatusModal roomShow={roomShow} roomStatusClose={roomStatusClose} settingData={roomDetailsData} />
    //         {/* <Modal show={compnayShow} onHide={compnayStatusClose} className='custom-theme-modal status-height-70' animation={false} centered >
    //             <Modal.Header className='d-flex align-items-center justify-content-between ' >
    //                 <Modal.Title>Change room status</Modal.Title>
    //                 <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={compnayStatusClose} />
    //             </Modal.Header>
    //             <Modal.Body>

    //                 <div className='company-status-box'>
    //                     <div className='form-group mb-2'>
    //                         <label>Current Status</label>
    //                         <Select
    //                             name="aria-live-color"
    //                             options={statusOption}
    //                             placeholder="Choose Status"
    //                             className="react_selectbox"
    //                             isSearchable={false}
    //                             value={selectedStatus}
    //                             onChange={setSelectedStatus}
    //                             styles={customStyles}
    //                         />
    //                     </div>
    //                     {selectedStatus?.value === "Inactive" && (
    //                         <p style={{
    //                             color: '#73615F'
    //                         }}>The room will be unlisted until you change the status.</p>

    //                     )}



    //                     {selectedStatus?.value === "Inactive" && (
    //                         <div className="inactive-box">
    //                             <Row className=''>
    //                                 <Col md={6}>
    //                                     <div className='form-group mb-4'>
    //                                         <label>Inactive date from</label>
    //                                         <DatePicker
    //                                             selected={inactiveFrom}
    //                                             onChange={(date) => setInactiveFrom(date)}
    //                                             placeholderText="Select date"
    //                                             className="form-control  custom-date-picker"
    //                                             dateFormat="dd/MM/yyyy"
    //                                         />
    //                                     </div>
    //                                 </Col>

    //                                 <Col md={6}>
    //                                     <div className='form-group mb-4'>
    //                                         <label>Inactive date to</label>
    //                                         <DatePicker
    //                                             selected={inactiveTo}
    //                                             onChange={(date) => setInactiveTo(date)}
    //                                             placeholderText="Select date"
    //                                             className="form-control custom-date-picker"
    //                                             dateFormat="dd/MM/yyyy"
    //                                         />
    //                                     </div>
    //                                 </Col>


    //                                 <Col md={6}>
    //                                     <div className='confirm-address-block mb-4' >
    //                                         <input type='checkbox' id='confirm-add' className='custom-checkbox' />
    //                                         <label htmlFor='confirm-add'>Mark as Permanently inactive</label>
    //                                     </div>
    //                                 </Col>
    //                             </Row>




    //                             <div className='form-group mb-4'>
    //                                 <label>Reason</label>
    //                                 <Select
    //                                     name="aria-live-color"
    //                                     options={reasonsOption}
    //                                     placeholder="Select a reason"
    //                                     className="react_selectbox"
    //                                     isSearchable={false}
    //                                     styles={customStyles}
    //                                 />
    //                             </div>

    //                             <div className='forom-group mb-4'>
    //                                 <label>Tell why you need to unlist this room</label>
    //                                 <textarea
    //                                     className="form-control textareabox mt-2"
    //                                     rows={4}
    //                                     placeholder="Add your message here"
    //                                 />
    //                             </div>

    //                         </div>
    //                     )}

    //                 </div>


    //             </Modal.Body>
    //             <Modal.Footer className='d-flex align-items-center justify-content-between '>
    //                 <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={compnayStatusClose}>
    //                     Cancel
    //                 </Button>
    //                 <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={compnayStatusClose}>
    //                     Confirm and  Change
    //                 </Button>
    //             </Modal.Footer>
    //         </Modal> */}

    //     </>
    // )
    return (
        <>
            <Header />
            {/* <ToastContainer /> */}
            <Toaster position="top-right" />

            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12}>
                            <ul className='d-flex align-items-center breadcrumb-list'>
                                <li><Link href='/PropertyListing?tab=assigned'>Properties</Link></li>
                                <li><Link href={`/propertyDetails?uid=${roomIdForUrl}`}>
                                    {roomDetailsData?.property_details?.property_name}, {roomDetailsData?.property_details?.city}
                                </Link></li>
                                <li>Room 1</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='page-body pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12}>
                            {/* <Link href={`/propertyDetails?uid=${roomIdForUrl}`} className='back-page'>
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back
                            </Link> */}
                            {/* {roomIdForUrl ? (
                                <Link href={`/propertyDetails?uid=${roomIdForUrl}`} className='back-page'>
                                    <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                    Back
                                </Link>
                            ) : (
                                <button onClick={() => window.history.back()} className='back-page' style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                    Back
                                </button>
                            )} */}
                            <Link
                                href={roomIdForUrl ? `/propertyDetails?uid=${roomIdForUrl}` : '/PropertyListing?tab=assigned'}
                                className='back-page'
                            >
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back
                            </Link>
                        </Col>

                        <Col md={12} className='mt-4 mb-4'>
                            <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom'>
                                <div className="d-flex align-items-center gap-2">
                                    <h2 className='page-title'>{roomDetailsData?.room_name || 'Room'}</h2>
                                    <span className="badge-active">
                                        {/* {String(roomDetailsData?.room_status || 'N/A')} */}
                                        {roomDetailsData?.is_permanently_inactive ? "Inactive" : "Active"}
                                    </span>
                                </div>

                                <Link onClick={roomStatusShow} href='#' className='btn-company-delete btn-light-transparent'>
                                    <Image src="/images/icons/room_preferences.svg" className='img-fluid' width={25} height={25} alt='setting' />
                                    Room Status
                                </Link>
                            </div>
                        </Col>

                        <Col md={12}>
                            <Row>
                                <Col md={6}>
                                    <div className='d-flex align-items-start justify-content-between mb-5'>
                                        <div className='general-info'>
                                            <h2 className='page-title'>General information</h2>
                                            <p className='mb-0'>Change or edit all company related general information from here</p>
                                        </div>
                                        {canUpdateRoom && (
                                            <Link href={`/Editroomdetails/${id}`} className='edit-company-btn' style={{ color: '#463527', textDecoration: 'none' }}>
                                                Manage
                                            </Link>
                                        )}
                                    </div>

                                    <div className='comapny-information-box'>
                                        <h4 className='mb-4'>Basic Information</h4>

                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Room name</span>
                                            <br />
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                {roomDetailsData?.room_name || 'N/A'}
                                            </span>
                                        </p>

                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Room type</span>
                                            <br />
                                            {/* <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                {roomDetailsData?.room_type || 'N/A'}
                                            </span> */}
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                {typeof roomDetailsData?.room_type === 'object'
                                                    ? roomDetailsData.room_type?.name || roomDetailsData.room_type?.label || 'N/A'
                                                    : roomDetailsData?.room_type || 'N/A'}
                                            </span>
                                        </p>

                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Room size (sq ft)</span>
                                            <br />
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                {roomDetailsData?.room_size_sqft || 'N/A'}
                                            </span>
                                        </p>

                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Room description</span>
                                            <br />
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                {roomDetailsData?.room_description || 'N/A'}
                                            </span>
                                        </p>
                                    </div>

                                    <div className='comapny-information-box'>
                                        <h4 className='mb-4'>Bed information</h4>
                                        {roomDetailsData?.beds && roomDetailsData.beds.length > 0 ? (
                                            roomDetailsData.beds.map((bed, i) => (
                                                <p key={i} style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                                    <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>
                                                        Bed type and name
                                                    </span>
                                                    <br />
                                                    {/* <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                        {String(bed?.type || '')}, {String(bed?.name || '')}
                                                    </span> */}
                                                    <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                        {typeof bed?.bed_type === 'object'
                                                            ? bed.bed_type?.name || bed.bed_type?.label || ''
                                                            : bed?.bed_type || ''}
                                                        {', '}
                                                        {typeof bed?.name === 'object'
                                                            ? bed.name?.name || bed.name?.label || ''
                                                            : bed?.name || 'N/A'}
                                                    </span>
                                                </p>
                                            ))
                                        ) : (
                                            <p style={{ color: "#73615F" }}>No bed information available.</p>
                                        )}
                                    </div>

                                    <div className='comapny-information-box property-list-2'>
                                        <h4 className='mb-4'>Room Occupancy</h4>

                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Bathrooms</span>
                                            <br />
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                {roomDetailsData?.bathrooms || 'N/A'}
                                            </span>
                                        </p>

                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>Bedroom preference</span>
                                            <br />
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                {roomDetailsData?.bedroom_preference || 'N/A'}
                                            </span>
                                        </p>

                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>
                                                Number of guests allowed in this room
                                            </span>
                                            <br />
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                {roomDetailsData?.max_guests || 'N/A'}
                                            </span>
                                        </p>

                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                                            <span className='w-100' style={{ fontSize: '18px', lineHeight: '24px' }}>
                                                Average base price of this bedroom
                                            </span>
                                            <br />
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                ₹{roomDetailsData?.avg_base_price_per_night || '0'} /night
                                            </span>
                                        </p>
                                    </div>

                                    <div className='comapny-information-box property-list-2'>
                                        <h4 className='mb-0'>Room Level Amenities</h4>
                                        <p>{`You've added these to your listing so far.`}</p>

                                        <ol className="br-list-data ps-0 mb-0">
                                            {roomDetailsData?.room_amenities && roomDetailsData.room_amenities.length > 0 ? (
                                                roomDetailsData.room_amenities.map((amenity, idx) => (
                                                    <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
                                                        <span className='br-list gap-2'>
                                                            {typeof amenity === 'string' ? amenity : amenity?.label || amenity?.name || 'Amenity'}
                                                        </span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li style={{ color: "#73615F" }}>No amenities found.</li>
                                            )}
                                        </ol>

                                        <hr />
                                    </div>

                                    <div className='comapny-information-box'>
                                        <h4 className='mb-4'>Photos</h4>

                                        <div className="grid upload-photo grid-cols-3 mt-0 gap-4">
                                            {roomDetailsData?.room_photos && roomDetailsData.room_photos.length > 0 ? (
                                                roomDetailsData.room_photos.map((item, i) => (
                                                    <div key={i} className="relative group">
                                                        {item.is_room_cover_photo && (
                                                            <span className="absolute top-4 left-3 text-white text-xs px-2 py-1 cover-photo">
                                                                Cover photo
                                                            </span>
                                                        )}
                                                        <Image
                                                            src={`${item?.room_photo_url}`}
                                                            alt="property"
                                                            width={300}
                                                            height={200}
                                                            className="object-cover w-full"
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: "#73615F" }}>No photos available.</p>
                                            )}
                                        </div>

                                        <hr />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            <RoomStatusModal roomShow={roomShow} roomStatusClose={roomStatusClose} settingData={roomDetailsData} fetchRoomDetails={fetchRoomDetailsById} />
        </>
    )
}


