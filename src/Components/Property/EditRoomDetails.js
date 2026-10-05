"use client"
import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button, Modal } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { components } from 'react-select';
import { useParams, useSearchParams } from "next/navigation";
import { PropertyRoomDetailAPI, UploadRoomPhotosAPI, UpdateRoomDetailAPI } from "@/services/provider";
import { useRouter } from 'next/navigation';

export default function EditRoomDetails() {    
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    // const router = useRouter();
    // const param = useParams();
    // const id = param.id;
    // const [id, setId] = useState()
    // const searchParams = useSearchParams();

    //     const params = useParams();
    // const id = params?.id;

    // useEffect(() => {
    //     const stateParam = searchParams.get('state');
    //     if (stateParam) {
    //         const state = JSON.parse(decodeURIComponent(stateParam));
    //         setId(state.id)
    //     }
    // }, [searchParams]);
    const [roomDetailsData, setRoomDetailsData] = useState(null)

    const chooseBeds = [
        {
            value: "single-bed",
            label: "Single Bed",
            icon: "/images/icons/single_bed.svg"
        },
        {
            value: "double-bed",
            label: "Double Bed",
            icon: "/images/icons/double-bed.svg"
        },
        {
            value: "Queen-bed",
            label: "Queen Bed",
            icon: "/images/icons/double-bed.svg"
        },
        {
            value: "King-bed",
            label: "King Bed",
            icon: "/images/icons/king_bed.svg"
        },
        {
            value: "super-king-bed",
            label: "Super King Bed",
            icon: "/images/icons/king_bed.svg"
        },
        {
            value: "Sofa Bed",
            label: "Sofa Bed",
            icon: "/images/icons/sofa-bed.svg"
        },
    ];

    const chooseBedprefrence = [
        {
            value: "Male",
            label: "Male",
        },
        {
            value: "female",
            label: "Female",
        },
    ];

    // Custom option in dropdown
    const CustomOption = (props) => (
        <components.Option {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image
                        src={props.data.icon}
                        alt={props.data.label}
                        width={20}
                        height={20}
                    />
                    <span>{props.data.label}</span>
                </div>
                {props.isSelected && (
                    <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
                )}
            </div>
        </components.Option>
    );

    // Custom selected value (shows in input box)
    const CustomSingleValue = (props) => (
        <components.SingleValue {...props}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image
                    src={props.data.icon}
                    alt={props.data.label}
                    width={20}
                    height={20}
                />
                <span>{props.data.label}</span>
            </div>
        </components.SingleValue>
    );

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

    const [selectedType, setSelectedType] = useState(null);
    const [properties, setProperties] = useState([
        {
            name: null,
            inactiveFrom: null,
            inactiveTo: null,
            collapsed: false
        }
    ]);

    const handleAddProperty = () => {
        setProperties([
            ...properties,
            {
                name: null,
                inactiveFrom: null,
                inactiveTo: null,
                collapsed: false
            }
        ]);
    };

    const handleDeleteProperty = (idx) => {
        setProperties(properties.filter((_, i) => i !== idx));
    };

    const handleCollapseProperty = (idx) => {
        setProperties(properties.map((prop, i) =>
            i === idx ? { ...prop, collapsed: !prop.collapsed } : prop
        ));
    };

    const handleChange = (idx, field, value) => {
        setProperties(properties.map((prop, i) =>
            i === idx ? { ...prop, [field]: value } : prop
        ));
    };

    const [guestCount, setGuestCount] = useState(1);

    const handleGuestChange = (delta) => {
        setGuestCount((prev) => Math.max(1, prev + delta));
        setRoomDetailsData({
            ...roomDetailsData,
            bathrooms: Math.max(1, guestCount + delta)
        });
    };

    const [guestCount1, setGuestCount1] = useState(1);

    const handleGuestChange1 = (delta) => {
        setGuestCount1((prev) => Math.max(1, prev + delta));
        setRoomDetailsData({ ...roomDetailsData, max_guests: Math.max(1, guestCount1 + delta) })
    };

    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const handleAmenitySelect = (label) => {
        setSelectedAmenities(prev => {
            const updated = prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label];

            // Update roomDetailsData using updated amenities
            setRoomDetailsData(r => ({
                ...r,
                room_amenities: updated
            }));

            return updated;
        });
    };

    const [amenitySearch, setAmenitySearch] = useState('');
    const [showAmenitySearch, setShowAmenitySearch] = useState(false);

    const [amenities, setAmenities] = useState([
        { icon: "/images/icons/ac.svg", label: "Air conditioning" },
        { icon: "/images/icons/concierge.svg", label: "Concierge" },
        { icon: "/images/icons/fitness_center.svg", label: "Fitness center" },
        { icon: "/images/icons/wifi.svg", label: "Free internet access" },
        { icon: "/images/icons/local_parking.svg", label: "Free parking" },
        { icon: "/images/icons/interpreter.svg", label: "Meeting facilities" }
    ]);

    const filteredAmenities = amenities.filter(a =>
        a.label.toLowerCase().includes(amenitySearch.toLowerCase())
    );

    const [changepicsModal1, changepisetShow1] = useState(false);

    const changepicClose1 = () => changepisetShow1(false);
    const changepicModal1 = () => changepisetShow1(true);

    // Manage Photos mode
    const [isManagePhotos, setIsManagePhotos] = useState(false);

    useEffect(() => {
        if (isManagePhotos) {
            document.body.classList.add('manage-photos-active');
        } else {
            document.body.classList.remove('manage-photos-active');
        }
        return () => document.body.classList.remove('manage-photos-active');
    }, [isManagePhotos]);

    // Photos
    const [photos, setPhotos] = useState([]);
    const [coverIndex, setCoverIndex] = useState(null);

    const MAX_PHOTOS = 5;

    const handleFileChange1 = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newPhotos = selectedFiles
            .slice(0, MAX_PHOTOS - photos.length)
            .map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
        const updatedPhotos = [...photos, ...newPhotos];
        setPhotos(updatedPhotos);
        if (coverIndex === null && updatedPhotos.length > 0) {
            setCoverIndex(0);
        }
    };

    const removePhoto = (index) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
        if (index === coverIndex) {
            setCoverIndex(updatedPhotos.length > 0 ? 0 : null);
        } else if (coverIndex > index) {
            setCoverIndex(coverIndex - 1);
        }
    };

    const makeCoverPhoto = (index) => {
        setCoverIndex(index);
    };

    // add bed type
    const [beds, setBeds] = useState([
        { type: chooseBeds[0], name: '' }
    ]);

    const handleBedChange = (idx, field, value) => {

        // If value is an object, extract `.value`. Otherwise use the raw value.
        const finalValue = typeof value === "object" && value !== null
            ? value.value
            : value;

        const updatedBeds = beds.map((bed, i) =>
            i === idx ? { ...bed, [field]: finalValue } : bed
        );

        setBeds(updatedBeds);

        setRoomDetailsData({
            ...roomDetailsData,
            beds: updatedBeds
        });

        // console.log(updatedBeds);
    };

    const handleAddBed = () => {
        setBeds([...beds, { type: chooseBeds[0], name: '' }]);
    };

    const handleRemoveBed = (idx) => {
        setBeds(beds.filter((_, i) => i !== idx));
    };

    useEffect(() => {
        const fetchRoomDetailsById = async () => {

            try {
                console.log("ROOM IDvvv:", id);
                const response = await PropertyRoomDetailAPI(id);
                if (response?.data?.success) {
                    console.log(response.data.response);
                    setRoomDetailsData(response.data.response);
                    // setBeds(response.data.response.beds || []);                    
                    setBeds(
                        (response.data.response.beds || []).map(bed => ({
                            ...bed,
                            bed_type: bed.bed_type || bed.type  // normalize to bed_type
                        }))
                    );
                    setGuestCount(response?.data?.response?.bathrooms);
                    setGuestCount1(response?.data?.response?.max_guests);
                    setSelectedAmenities(response?.data?.response?.room_amenities || []);
                    setPhotos(response?.data?.response?.room_photos?.length > 0 ? response?.data?.response?.room_photos : [])
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (id) {
            fetchRoomDetailsById();
        }
    }, [id]);



    const handleSave = async () => {
        try {
            const response = await UpdateRoomDetailAPI(id, JSON.stringify(roomDetailsData));
            if (response?.data?.success) {
                // Handle photo updates
                if (photos.filter(item => !item.room_photo_url).length > 0) {
                    await handleRoomPhotos(id);
                } else {
                    console.log("No new photos to upload");
                    router.push(`/Roomdetails/${id}`);
                    // localStorage.removeItem("RoomIdForRoomDetails")
                }
                return response.data.response;
            } else {
                throw new Error(`Failed to update room ${index + 1}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRoomPhotos = async (roomId) => {
        try {
            // Upload new photos
            if (photos.length > 0) {
                const fieldData = new FormData();
                fieldData.append("room", roomId);

                photos.filter(item => !item.room_photo_url).forEach((fileObj, fileIndex) => {
                    fieldData.append(`room_photo_url[${fileIndex}]`, fileObj.file);
                });

                const response = await UploadRoomPhotosAPI(fieldData);
                if (!response?.data?.success) {
                    throw new Error("Failed to upload room photos");
                } else {
                    router.push(`/Roomdetails/${id}`);
                    // localStorage.removeItem("RoomIdForRoomDetails")
                }
            }

            // Note: Implement photo deletion API if needed
            // if (photosToDelete.length > 0) {
            //   for (const photo of photosToDelete) {
            //     await DeleteRoomPhotoAPI(photo.uid);
            //   }
            // }

            return true;
        } catch (error) {
            console.log(error);
            alert_danger("Failed to upload room photos");
            throw error;
        }
    };

    // useEffect(() => {
    //     console.log("Updated roomDetailsData:", photos);
    // }, [photos]);


    if (!roomDetailsData) {
        return (
            <div className="page-body pt-4 pb-4" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <p>Loading room details...</p>
            </div>
        );
    }

    return (
        <>
            <Header />

            <div className='page-body disable-body pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <Link href={`/Roomdetails/${id}`} className='back-page'>
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={12} className='mt-4 mb-4' >
                            <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
                                <div className="d-flex align-items-center gap-2">
                                    <h2 className='page-title'>{roomDetailsData?.room_name}  </h2>
                                    <span className="badge-active" >  {roomDetailsData?.room_status} </span >
                                </div>
                            </div>
                        </Col>


                        <Col md={12} >
                            <Row>
                                <Col md={6} className="active-box-fadein" >
                                    <div className='d-flex align-items-start justify-content-between mb-5'>
                                        <div className='general-info'>
                                            <h2 className='page-title'> General information</h2>
                                            <p className='mb-0'>Change or edit all company related general information from here</p>
                                        </div>
                                        <Link href="#" className='Save-company-btn' style={{ textDecoration: 'none' }} onClick={handleSave}> Done </Link>
                                    </div>
                                    <div className='assign-property-box mt-5' >
                                        <div className='pb-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p className='' style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }} >
                                                Bedroom
                                            </p>
                                        </div>
                                        <p className="mt-2 mb-2" style={{ border: '1px solid rgb(70, 53, 39)' }}></p>
                                        <div className='add-propertu-assign mt-4 ' >
                                            <Row>
                                                <Col md={12}>
                                                    <div className='form-group mb-4'>
                                                        <p className='font-18' style={{ color: '#73615F' }} >Room name</p>
                                                        <input type='text' className='form-control' value={roomDetailsData?.room_name} onChange={(e) => { setRoomDetailsData({ ...roomDetailsData, room_name: e.target.value }) }} placeholder='e.g 1 King bed with balcony bay view ' />
                                                    </div>
                                                    <hr></hr>
                                                    <div className='form-group mb-4'>
                                                        <p className='font-18' style={{ color: '#73615F' }} >Classify room type</p>
                                                        <Row className='mb-2'>
                                                            <Col md={6}>
                                                                <div className="radio-select-box d-flex gap-2" style={{ background: '#F2F2F2' }}>
                                                                    <label className="form-check-label d-flex gap-2 mb-0" htmlFor="room-type-twin">
                                                                        <input
                                                                            type="radio"
                                                                            id="room-type-twin"
                                                                            name="select-question-type"
                                                                            checked={roomDetailsData?.room_type === "Twins Sharing"}
                                                                            onChange={() =>
                                                                                setRoomDetailsData({ ...roomDetailsData, room_type: "Twins Sharing" })
                                                                            }
                                                                        />
                                                                        <span className="radio-checkmark"></span>
                                                                        <Image
                                                                            src="/images/icons/groups.svg"
                                                                            className="img-fluid"
                                                                            width={24}
                                                                            height={24}
                                                                            alt="Twin Sharing"
                                                                        />
                                                                        Twin Sharing Room
                                                                    </label>
                                                                </div>
                                                            </Col>

                                                            <Col md={6}>
                                                                <div className="radio-select-box d-flex gap-2" style={{ background: '#F2F2F2' }}>
                                                                    <label className="form-check-label d-flex gap-2 mb-0" htmlFor="room-type-private">
                                                                        <input
                                                                            type="radio"
                                                                            id="room-type-private"
                                                                            name="select-question-type"
                                                                            checked={roomDetailsData?.room_type === "Private"}
                                                                            onChange={() =>
                                                                                setRoomDetailsData({ ...roomDetailsData, room_type: "Private" })
                                                                            }
                                                                        />
                                                                        <span className="radio-checkmark"></span>
                                                                        <Image
                                                                            src="/images/icons/group.svg"
                                                                            className="img-fluid"
                                                                            width={24}
                                                                            height={24}
                                                                            alt="Private Room"
                                                                        />
                                                                        Private Room
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <p className='font-500'>A private room is a single-occupancy space where you have exclusive use of the bed, desk, and other amenities, offering maximum privacy.</p>
                                                    </div>
                                                    <hr></hr>
                                                    <div className='form-group relative mb-4'>
                                                        <p className='font-18' style={{ color: '#73615F' }} >Room size (sq ft)</p>
                                                        <input type='text' className='form-control ' value={roomDetailsData?.room_size_sqft} onChange={(e) => { setRoomDetailsData({ ...roomDetailsData, room_size_sqft: e.target.value }) }} placeholder='e.g. 538' />
                                                        <span className='absolute right-2 bottom-3'>sq ft</span>
                                                    </div>
                                                    <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}></p>
                                                    {beds.map((bed, idx) => (
                                                        <Row className='mb-2' key={idx}>
                                                            <Col md={6}>
                                                                <div className='form-group mb-4'>
                                                                    <p className='font-18' style={{ color: '#73615F' }}>Bed type</p>
                                                                    <Select
                                                                        name={`bed-type-${idx}`}
                                                                        options={chooseBeds}
                                                                        placeholder="Choose Bed"
                                                                        className='react_selectbox'
                                                                        isSearchable={false}
                                                                        // value={chooseBeds.find(opt => opt.value === bed.type) || null}
                                                                        value={chooseBeds.find(opt => opt.value === (bed.bed_type || bed.type)) || null}
                                                                        onChange={option => handleBedChange(idx, "bed_type", option)}
                                                                        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                                                        styles={customStyles}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col md={6} >
                                                                <div style={{ display: 'flex', alignItems: 'flex-end' }} className=''>
                                                                    <div className='form-group mb-4' style={{ flex: 1 }}>
                                                                        <p className='font-18' style={{ color: '#73615F' }}>Bed Name</p>
                                                                        <input
                                                                            type='text'
                                                                            className='form-control'
                                                                            placeholder='e.g. Bed A'
                                                                            value={bed.name}
                                                                            onChange={e => handleBedChange(idx, 'name', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    {beds.length > 1 && (
                                                                        <Button
                                                                            variant=""
                                                                            className='mb-4 ms-3 d-flex align-items-center justify-content-center'
                                                                            style={{
                                                                                background: "#f7f2ee",
                                                                                border: "1px solid #463527",
                                                                                borderRadius: "0px",
                                                                                height: "40px",
                                                                                marginLeft: "8px",
                                                                                width: '40px',
                                                                                padding: '0',
                                                                                textAlign: 'center'
                                                                            }}
                                                                            onClick={() => handleRemoveBed(idx)}
                                                                        >
                                                                            <Image src='/images/icons/delete_b.svg' width={20} height={20} alt='Delete' />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                            <Col md={12}>
                                                                <hr style={{ margin: "0 0 16px 0" }} />
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                    <Button
                                                        style={{ color: '#2C734A', fontWeight: '500', marginBottom: "16px" }}
                                                        className='d-flex p-0 gap-2'
                                                        variant=''
                                                        onClick={handleAddBed}
                                                    >
                                                        <Image src='/images/icons/Plusminus.svg' className='img-fluid' width={15} height={15} alt='plus' />  Add bed type
                                                    </Button>
                                                    <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}></p>
                                                    <Row className='mb-3'>
                                                        <Col md={6}>
                                                            <div className='d-flex align-items-center h-100'>
                                                                <p className='font-18 mb-0' style={{ color: '#73615F' }} >Bathrooms</p>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className='form-group '>
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        border: "2px solid #d3ccc5",
                                                                        borderRadius: "2px",
                                                                        background: "#f2f2f2",
                                                                        padding: "13px 0",
                                                                        width: "100%",
                                                                        maxWidth: "100%",
                                                                        fontSize: "14px",
                                                                        marginTop: "8px"
                                                                    }}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleGuestChange(-1)}
                                                                        style={{
                                                                            background: "none",
                                                                            border: "none",
                                                                            textAlign: 'center',
                                                                            width: "20%",
                                                                            cursor: guestCount > 1 ? "pointer" : "not-allowed"
                                                                        }}
                                                                        disabled={guestCount === 1}
                                                                    >
                                                                        <Image src='/images/icons/minus.svg' width={15} height={15} className='img-fluid ms-auto me-auto' alt='minus' />
                                                                    </button>
                                                                    <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>{guestCount}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleGuestChange(1)}
                                                                        style={{
                                                                            background: "none",
                                                                            border: "none",
                                                                            color: "#463527",
                                                                            width: "20%",
                                                                            cursor: "pointer",
                                                                            textAlign: 'center'
                                                                        }}
                                                                    >
                                                                        <Image src='/images/icons/Plus.svg' width={15} height={15} className='img-fluid  ms-auto me-auto' alt='minus' />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <hr style={{ margin: '20px 0' }} ></hr>
                                                    <Row className='mb-3'>
                                                        <Col md={6}>
                                                            <div className='d-flex align-items-center h-100'>
                                                                <p className='font-18 mb-0' style={{ color: '#73615F' }} >Bedroom preference</p>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className='form-group '>
                                                                <Select
                                                                    name="aria-live-color"
                                                                    options={chooseBedprefrence}
                                                                    placeholder="Please select an option"
                                                                    className='react_selectbox'
                                                                    value={chooseBedprefrence.find(beds => beds.label === roomDetailsData?.bedroom_preference) || null}
                                                                    isSearchable={false}
                                                                    onChange={(option) => setRoomDetailsData({ ...roomDetailsData, bedroom_preference: option.label })}
                                                                    styles={customStyles}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <hr style={{ margin: '20px 0' }} ></hr>
                                                    <Row className='mb-3'>
                                                        <Col md={6}>
                                                            <div className='d-flex align-items-center h-100'>
                                                                <p className='font-18 mb-0' style={{ color: '#73615F' }} >Max guests allowed</p>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className='form-group '>
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "space-between",
                                                                        border: "2px solid #d3ccc5",
                                                                        borderRadius: "2px",
                                                                        background: "#f2f2f2",
                                                                        padding: "13px 0",
                                                                        width: "100%",
                                                                        maxWidth: "100%",
                                                                        fontSize: "14px",
                                                                        marginTop: "0px"
                                                                    }}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleGuestChange1(-1)}
                                                                        style={{
                                                                            background: "none",
                                                                            border: "none",
                                                                            textAlign: 'center',
                                                                            width: "20%",
                                                                            cursor: guestCount1 > 1 ? "pointer" : "not-allowed"
                                                                        }}
                                                                        disabled={guestCount1 === 1}
                                                                    >
                                                                        <Image src='/images/icons/minus.svg' width={15} height={15} className='img-fluid ms-auto me-auto' alt='minus' />
                                                                    </button>
                                                                    <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>{guestCount1}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleGuestChange1(1)}
                                                                        style={{
                                                                            background: "none",
                                                                            border: "none",
                                                                            color: "#463527",
                                                                            width: "20%",
                                                                            cursor: "pointer",
                                                                            textAlign: 'center'
                                                                        }}
                                                                    >
                                                                        <Image src='/images/icons/Plus.svg' width={15} height={15} className='img-fluid  ms-auto me-auto' alt='minus' />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <hr style={{ margin: '20px 0' }} ></hr>
                                                    <div className='form-group relative mb-4'>
                                                        <p className='font-18' style={{ color: '#73615F' }} >Set your rate (Nightly rate)</p>
                                                        <p>The lowest possible rate for this room, not including promotions, taxes, or other fees.</p>
                                                        <input type='text' className='form-control ' value={roomDetailsData?.avg_base_price_per_night} onChange={(e) => setRoomDetailsData({ ...roomDetailsData, avg_base_price_per_night: e.target.value })} placeholder='₹ | 0' />
                                                        <span className='absolute right-2 bottom-3'>/night</span>
                                                    </div>
                                                    <hr style={{ margin: '20px 0' }} ></hr>
                                                    <p className='subheadline-2 mb-3'>Room description</p>
                                                    <div className='form-group mb-4'>
                                                        <textarea className='form-control' value={roomDetailsData?.room_description} onChange={(e) => setRoomDetailsData({ ...roomDetailsData, room_description: e.target.value })} rows={15} placeholder='e.x Mountain views, dedicated meeting spaces, and customizable meal options' >
                                                        </textarea>
                                                    </div>
                                                    <span className='text-count'>{roomDetailsData?.room_description.length}/1500</span>
                                                    <hr style={{ margin: '20px 0' }}></hr>
                                                    <div className='property-list-2'>
                                                        <p className='subheadline-2 mb-3'>Room amenities</p>
                                                        <div className='search-box mb-3' style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                            <div style={{ flex: 1, position: "relative" }}>
                                                                <input
                                                                    type='text'
                                                                    placeholder='Search'
                                                                    className='form-control'
                                                                    value={amenitySearch}
                                                                    onFocus={() => setShowAmenitySearch(true)}
                                                                    onChange={e => setAmenitySearch(e.target.value)}
                                                                    style={{
                                                                        paddingLeft: "40px",
                                                                        fontSize: "16px",
                                                                        border: "2px solid #d3ccc5",
                                                                        borderRadius: "2px",
                                                                        background: "#f2f2f2"
                                                                    }}
                                                                />
                                                                <Image
                                                                    src='/images/icons/search.svg'
                                                                    width={20}
                                                                    height={20}
                                                                    alt='Search'
                                                                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                                                                />
                                                                {amenitySearch && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setAmenitySearch('')}
                                                                        style={{
                                                                            position: "absolute",
                                                                            right: "12px",
                                                                            top: "50%",
                                                                            transform: "translateY(-50%)",
                                                                            background: "none",
                                                                            border: "none",
                                                                            fontSize: "20px",
                                                                            color: "#6B4F3F",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        aria-label="Clear"
                                                                    >
                                                                        <Image
                                                                            src='/images/icons/close-circle.svg'
                                                                            className='img-fluid'
                                                                            width={24}
                                                                            height={24}
                                                                            alt='close'
                                                                        />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {showAmenitySearch && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setAmenitySearch('');
                                                                        setShowAmenitySearch(false);
                                                                    }}
                                                                    style={{
                                                                        background: "none",
                                                                        border: "none",
                                                                        color: "#6B4F3F",
                                                                        fontWeight: "500",
                                                                        fontSize: "16px",
                                                                        cursor: "pointer"
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                        <dl className='br-list-data'>
                                                            {filteredAmenities?.map((a, idx) => {
                                                                const isSelected = selectedAmenities.includes(a.label);
                                                                return (
                                                                    <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
                                                                        <span className='br-list gap-2'>
                                                                            <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
                                                                            {a.label}
                                                                        </span>
                                                                        <span
                                                                            className='add-plus-icn'
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => handleAmenitySelect(a.label)}
                                                                        >
                                                                            <Image
                                                                                src={
                                                                                    isSelected
                                                                                        ? "/images/icons/check_circle.svg"
                                                                                        : "/images/icons/add_circle.svg"
                                                                                }
                                                                                className='img-fluid'
                                                                                width={24}
                                                                                height={24}
                                                                                alt={isSelected ? 'selected' : 'add circle'}
                                                                            />
                                                                        </span>
                                                                    </li>
                                                                );
                                                            })}
                                                            {filteredAmenities.length === 0 && (
                                                                <li style={{ color: "#73615F", padding: "0px 0" }}>No amenities found.</li>
                                                            )}
                                                        </dl>
                                                        <hr style={{ margin: '20px 0' }} />
                                                    </div>
                                                    <div className='box-input'>
                                                        {photos.length === 0 && (
                                                            <div className='property-list-2'>
                                                                <p className='subheadline-2 mb-1'>Outside or surrounding photos</p>
                                                                <div className='form-group  mb-5'>
                                                                    <label>{"You'll need 5 photos to get started. You can add more or make changes later."}</label>
                                                                    <div className='add-upload-photo'>
                                                                        <Image src="/images/icons/photo-camera.svg" className='img-fluid mb-2' width={50} height={40} alt='add photo' />
                                                                        <Button onClick={changepicModal1} variant='' className='add-photo-btn'>
                                                                            Add Photo
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <hr style={{ margin: '30px 0' }}></hr>
                                                            </div>
                                                        )}
                                                        {photos.length > 0 && (
                                                            <>
                                                                <div className='d-flex justify-content-between align-items-start'>
                                                                    <p className='subheadline-2 mb-4'>Photos of your flat/apartment</p>
                                                                    <div className="d-flex gap-2">
                                                                        <Button
                                                                            variant=""
                                                                            className='btn-company-delete rounded-0 btn-light-transparent'
                                                                            onClick={() => setIsManagePhotos((prev) => !prev)}
                                                                        >
                                                                            {isManagePhotos ? 'Done' : 'Manage Photos'}
                                                                        </Button>
                                                                        <Image
                                                                            src='/images/icons/add_circle.svg'
                                                                            className='img-fluid'
                                                                            width={50}
                                                                            height={40}
                                                                            alt='circle'
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={changepicModal1}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="photo-gallery">
                                                                    {/* Cover Photo */}
                                                                    {coverIndex !== null && photos[coverIndex] && (
                                                                        <div className="relative upload-photo mb-6 group">
                                                                            <Image
                                                                                // src={`https://alicedevapi.casamelhor.in${photos[coverIndex]?.room_photo_url}`}
                                                                                src={
                                                                                    photos[coverIndex]?.preview
                                                                                        ? photos[coverIndex].preview
                                                                                        : `${photos[coverIndex]?.room_photo_url}`
                                                                                }
                                                                                alt="Cover photo"
                                                                                width={600}
                                                                                height={400}
                                                                                className="object-cover w-full"
                                                                            />
                                                                            <span className="absolute top-2 left-2  text-white text-xs px-2 py-1 " style={{ border: '1px solid #fff', borderRadius: '50px', top: '20px', left: '20px' }} >
                                                                                Cover photo
                                                                            </span>
                                                                            <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                                                <li>
                                                                                    <button
                                                                                        onClick={() => removePhoto(coverIndex)}
                                                                                        className="block text-sm w-full text-left"
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </li>
                                                                            </ul>
                                                                            {isManagePhotos ? (
                                                                                <button
                                                                                    className="more-action absolute top-2 right-2 btn btn-danger btn-sm"
                                                                                    onClick={() => removePhoto(coverIndex)}
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            ) : (
                                                                                <div className="more-action absolute top-2 right-2">
                                                                                    <Image
                                                                                        src="/images/icons/more-dots-3.svg"
                                                                                        className="img-fluid"
                                                                                        alt="dot 3"
                                                                                        width={20}
                                                                                        height={20}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {/* Grid for other photos */}
                                                                    <div className="grid upload-photo grid-cols-2 gap-4">
                                                                        {photos.map((photo, index) => {
                                                                            if (index === coverIndex) return null;
                                                                            return (
                                                                                <div key={index} className="relative group">
                                                                                    <Image
                                                                                        // src={`https://alicedevapi.casamelhor.in${photo?.room_photo_url}`}
                                                                                        // src={photo.preview ? photo.preview : `${photo.room_photo_url}`}
                                                                                        src={photo?.preview ? photo.preview : `${photo?.room_photo_url}`}
                                                                                        alt={`Photo ${index + 1}`}
                                                                                        width={300}
                                                                                        height={200}
                                                                                        className="object-cover w-full"
                                                                                    />
                                                                                    <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                                                        <li>
                                                                                            <button
                                                                                                onClick={() => makeCoverPhoto(index)}
                                                                                                className="block text-sm w-full text-left"
                                                                                            >
                                                                                                Make cover photo
                                                                                            </button>
                                                                                        </li>
                                                                                        <li>
                                                                                            <button
                                                                                                onClick={() => removePhoto(index)}
                                                                                                className="block text-sm w-full text-left"
                                                                                            >
                                                                                                Delete
                                                                                            </button>
                                                                                        </li>
                                                                                    </ul>
                                                                                    {isManagePhotos ? (
                                                                                        <button
                                                                                            className="more-action absolute top-2 right-2 btn btn-danger btn-sm"
                                                                                            onClick={() => removePhoto(index)}
                                                                                        >
                                                                                            Delete
                                                                                        </button>
                                                                                    ) : (
                                                                                        <div className="more-action absolute top-2 right-2">
                                                                                            <Image
                                                                                                src="/images/icons/more-dots-3.svg"
                                                                                                className="img-fluid"
                                                                                                alt="dot 3"
                                                                                                width={20}
                                                                                                height={20}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                        {photos.length < MAX_PHOTOS && (
                                                                            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 h-40 cursor-pointer" style={{ minHeight: '349px' }} >
                                                                                <label className="flex flex-col items-center cursor-pointer">
                                                                                    <Image
                                                                                        src="/images/icons/photo-camera.svg"
                                                                                        alt="Add"
                                                                                        width={50}
                                                                                        height={40}
                                                                                        className="mb-3 ms-auto me-auto"
                                                                                    />
                                                                                    <span style={{ border: '1px solid #000', padding: '10px 20px' }} className="text-sm">Add Photo</span>
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        multiple
                                                                                        onChange={handleFileChange1}
                                                                                        className="hidden"
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                </div>


                                                                <hr />
                                                            </>
                                                        )}
                                                    </div>

                                                    <Button variant="" onClick={handleSave} className='complete-form-btn' style={{ padding: '13px 35px', borderRadius: '0' }}  >
                                                        Save Changes
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* Photo Upload Modal */}
            <Modal show={changepicsModal1} onHide={changepicClose1} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
                    <Modal.Title>
                        Upload photo
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose1} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <span>{photos.length} items selected</span>
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
                                        src="/images/icons/photo-library.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                    />
                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Drag and drop
                                    </p>
                                    <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                    >
                                        or click here to choose files (max 5).
                                    </p>
                                </div>
                            </label>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                            <Image
                                                src={`${photo?.room_photo_url}`}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={250}
                                                height={250}
                                                className="object-cover"
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
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={changepicClose1} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Cancel
                    </Button>
                    <Button variant=""
                        onClick={changepicClose1}
                        className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}