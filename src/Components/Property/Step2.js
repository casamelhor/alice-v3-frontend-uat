"use client"
import { UpdatePropertySpaceAPI, WizardStepUpdateAPI } from '@/services/provider';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image, Modal, Form } from 'react-bootstrap'

export default function Step2({ step2Data, setStep2Data, propertyRole, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, draft }) {
    // const property = JSON.parse(getItemLocalStorage("properyItem"));
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [property, setProperty] = useState({});

    useEffect(() => {
        try {
            const propertyItem = getItemLocalStorage("properyItem");
            if (propertyItem) {
                setProperty(JSON.parse(propertyItem));
            } else if (draft?.uid) {
                setProperty(draft)
            }
        } catch (error) {
            console.error("Error loading property data:", error);
        }
    }, [activeStep]);
    // const [isSubmitted, setIsSubmitted] = useState(false);

    // Validation function
    const validateForm = (inputData) => {
        let newErrors = {};
        let isValid = true;

        if (inputData?.guestCapacity != undefined && inputData?.guestCapacity < 1) {
            newErrors.guestCapacity = 'Guest capacity must be at least 1';
            isValid = false;
        } else if (inputData?.guestCapacity > 0) {
            newErrors.guestCapacity = '';
        }

        if (inputData.brDescription !== undefined && !inputData.brDescription) {
            newErrors.brDescription = 'Please describe what makes your BR special';
            isValid = false;
        } else if (inputData.brDescription !== undefined && inputData.brDescription.length > 1500) {
            newErrors.brDescription = 'Description must be less than 1500 characters';
            isValid = false;
        } else if (inputData.brDescription) {
            newErrors.brDescription = '';
        }

        return { newErrors, isValid }
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        let newVal = { [field]: value }
        const { newErrors } = validateForm(newVal);
        setStep2Data(prev => ({
            ...prev,
            [field]: value
        }));
        setErrors({
            ...errors,
            ...newErrors
        })
    };

    // Guest count functionality    

    const handleGuestChange = (delta) => {
        let newVal = { ["guestCapacity"]: step2Data.guestCapacity + delta }
        const { newErrors } = validateForm(newVal)
        setStep2Data({
            ...step2Data,
            guestCapacity: step2Data.guestCapacity + delta
        })
        setErrors({
            ...errors,
            ...newErrors
        })
    };

    // Amenities functionality (NO VALIDATION)
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [amenitySearch, setAmenitySearch] = useState('');
    const [showAmenitySearch, setShowAmenitySearch] = useState(false);

    const amenities = [
        { icon: "./images/icons/amenities-icon/Air-Conditioning.svg", label: "Air Conditioning" },
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
        { icon: "./images/icons/amenities-icon/Swimming-pool.svg", label: "Swimming Pool" },
        { icon: "./images/icons/amenities-icon/Air-Conditioning.svg", label: "Gym" },
        { icon: "./images/icons/amenities-icon/gym.svg", label: "Air Conditioning" },


    ];

    const filteredAmenities = amenities.filter(a =>
        a.label.toLowerCase().includes(amenitySearch.toLowerCase())
    );

    const handleAmenitySelect = (label) => {
        const newAmenities = step2Data?.amenities?.includes(label)
            ? step2Data?.amenities?.filter((l) => l !== label)
            : [...step2Data?.amenities, label];

        setSelectedAmenities(newAmenities);
        handleInputChange('amenities', newAmenities);
    };

    // Standout amenities functionality (NO VALIDATION)
    const [selectedAmenities2, setSelectedAmenities2] = useState([]);
    const [amenitySearch2, setAmenitySearch2] = useState('');
    const [showAmenitySearch2, setShowAmenitySearch2] = useState(false);

    const amenities2 = [
        { icon: "./images/icons/amenities-icon/Air-Conditioning.svg", label: "Air Conditioning" },
        { icon: "./images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
        { icon: "./images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
        { icon: "./images/icons/amenities-icon/heating.svg", label: "Heating" },
        { icon: "./images/icons/amenities-icon/test.svg", label: "Test" },
        { icon: "./images/icons/amenities-icon/Workspace.svg", label: "Workspace" },
        { icon: "./images/icons/amenities-icon/Ensuite-Bathroom.svg", label: "Ensuite Bathroom" },
        { icon: "./images/icons/amenities-icon/Desk.svg", label: "Desk" },
        { icon: "./images/icons/amenities-icon/Wardrobe-Hangers.svg", label: "Wardrobe & Hangers" },
        { icon: "./images/icons/amenities-icon/family-kid-friends.svg", label: "Family/Kid Friendly" },
        { icon: "./images/icons/amenities-icon/Fire-Extinguisher.svg", label: "Fire Extinguisher" },
        { icon: "./images/icons/amenities-icon/Frist-Aid-Kit.svg", label: "First Aid Kit" },
        { icon: "./images/icons/amenities-icon/Emergency-Escape.svg", label: "Emergency Escape" },
        { icon: "./images/icons/amenities-icon/CCTV.svg", label: "CCTV" },
        { icon: "./images/icons/amenities-icon/Bathing-kit.svg", label: "Bathing Kit" },

        { icon: "./images/icons/amenities-icon/Smoking-area.svg", label: "Smoking Allowed in" },
        { icon: "./images/icons/amenities-icon/Open-Area.svg", label: "Open Area" },
        { icon: "./images/icons/amenities-icon/Iron-on-request.svg", label: "Iron On Request" },
    ];


    const filteredAmenities2 = amenities2.filter(a =>
        a.label.toLowerCase().includes(amenitySearch2.toLowerCase())
    );

    const handleAmenitySelect2 = (label) => {
        const newAmenities = step2Data?.standoutAmenities?.includes(label)
            ? step2Data?.standoutAmenities?.filter((l) => l !== label)
            : [...step2Data?.standoutAmenities, label];

        setSelectedAmenities2(newAmenities);
        handleInputChange('standoutAmenities', newAmenities);
    };

    // Handle form submission
    const handleSubmit = async (flag) => {
        // e.preventDefault();
        setSaveExit(false)
        assignmentRemoveClose()
        try {
            const { newErrors, isValid } = validateForm(step2Data)
            setErrors(newErrors)
            if (isValid) {
                const fieldData = new FormData();
                fieldData.append("max_capacity", step2Data.guestCapacity);
                fieldData.append("property_description", step2Data.brDescription);
                fieldData.append("property_amenities", JSON.stringify(step2Data.amenities));
                fieldData.append("key_features", JSON.stringify(step2Data.standoutAmenities));
                const response = await UpdatePropertySpaceAPI(property?.uid, fieldData);
                if (response?.data?.success) {
                    if (flag == "exit") {
                        const wizard = new FormData();
                        wizard.append("wizard_step_completed", activeStep)
                        await WizardStepUpdateAPI(property?.uid, wizard)
                        router.push("/PropertyListing")
                    } else { setActiveStep(activeStep + 1) }
                }
            } else {
                const firstErrorField = Object.keys(errors)[0];
                const element = document.querySelector(`[name="${firstErrorField}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        if (saveExit && activeStep == 2) {
            handleSubmit('exit')
        }
    }, [saveExit])
    // console.log(step2Data)
    console.log(saveExit)
    return (
        <Container>
            <Row>
                <Col md={8}>
                    <div className='box-input'>
                        <h3 className='page-title mb-4'>{`Some details about the BR and it's amenities`}</h3>

                        {/* <Form onSubmit={handleSubmit}> */}
                        <div className='property-list-2'>
                            <p className='subheadline-2 mb-3'>What the maximum guest capacity for booking this BR?</p>

                            <div className='form-group mb-4'>
                                <label>Guests (Adults) <span style={{ color: '#f00' }} >*</span> </label>
                                <div className='form-group'>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            border: errors.guestCapacity ? "2px solid #dc3545" : "2px solid #d3ccc5",
                                            borderRadius: "2px",
                                            background: "#f2f2f2",
                                            padding: "13px 0",
                                            width: "100%",
                                            maxWidth: "228px",
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
                                                cursor: step2Data.guestCapacity > 0 ? "pointer" : "not-allowed"
                                            }}
                                            disabled={step2Data.guestCapacity === 0}
                                        >
                                            <Image src='./images/icons/minus.svg' className='img-fluid ms-auto me-auto' alt='minus' />
                                        </button>
                                        <span style={{ color: "#463527", fontWeight: "500", width: "60%", textAlign: "center" }}>{step2Data.guestCapacity}</span>
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
                                            <Image src='./images/icons/Plus.svg' className='img-fluid  ms-auto me-auto' alt='minus' />
                                        </button>
                                    </div>
                                </div>
                                {errors.guestCapacity && (
                                    <div className="invalid-feedback d-block">
                                        {errors.guestCapacity}
                                    </div>
                                )}
                            </div>
                            <hr style={{ margin: '50px 0' }}></hr>
                        </div>

                        <div className='property-list-2'>
                            <p className='subheadline-2 mb-3'>What makes this BR ideal for corporate booking?</p>

                            <div className='form-group mb-4'>
                                <label>Share what makes your place special. <span style={{ color: '#f00' }} >*</span> </label>

                                <textarea
                                    className={`form-control ${errors.brDescription ? 'is-invalid' : ''}`}
                                    rows={15}
                                    placeholder='e.x Mountain views, dedicated meeting spaces, and customizable meal options'
                                    value={step2Data.brDescription}
                                    onChange={(e) => handleInputChange('brDescription', e.target.value)}
                                    name="brDescription"
                                ></textarea>
                                {errors.brDescription && (
                                    <div className="invalid-feedback d-block">
                                        {errors.brDescription}
                                    </div>
                                )}
                            </div>
                            <span className='text-count'>{step2Data?.brDescription?.length ? `${step2Data?.brDescription?.length}/1500` : ''}</span>

                            <hr style={{ margin: '50px 0' }}></hr>
                        </div>

                        {/* Tell guests what the BR has to offer - NO VALIDATION */}
                        <div className='property-list-2'>
                            <p className='subheadline-2 mb-3'>Tell guests what the BR has to offer</p>
                            <div style={{ color: "#73615F", fontSize: "15px", marginBottom: "8px" }}>
                                You can add more amenities after you publish your listing.
                            </div>

                            {/* NO ERROR MESSAGES - Validation removed */}

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
                                                src='./images/icons/close-circle.svg'
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
                                {filteredAmenities.slice(0, 6).map((a, idx) => {
                                    {/* const isSelected = selectedAmenities.includes(a.label); */ }
                                    const isSelected = step2Data?.amenities.includes(a.label);
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
                                                            ? "./images/icons/check_circle.svg"
                                                            : "./images/icons/add_circle.svg"
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
                            <hr style={{ margin: '50px 0' }} />
                        </div>

                        <div className='property-list-2'>
                            <p className='subheadline-2 mb-3'>Does this BR have any key features or standout amenities?</p>
                            <div style={{ color: "#73615F", fontSize: "15px", marginBottom: "8px" }}>
                                {`Choose up to 2 highlights. We'll use these to get your description started.`}
                            </div>

                            {/* No validation for this section as per requirement */}

                            <div className='search-box mb-3' style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ flex: 1, position: "relative" }}>
                                    <input
                                        type='text'
                                        placeholder='Search'
                                        className='form-control'
                                        value={amenitySearch2}
                                        onFocus={() => setShowAmenitySearch2(true)}
                                        onChange={e => setAmenitySearch2(e.target.value)}
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
                                    {amenitySearch2 && (
                                        <button
                                            type="button"
                                            onClick={() => setAmenitySearch2('')}
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
                                                src='./images/icons/close-circle.svg'
                                                className='img-fluid'
                                                width={24}
                                                height={24}
                                                alt='close'
                                            />
                                        </button>
                                    )}
                                </div>
                                {showAmenitySearch2 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAmenitySearch2('');
                                            setShowAmenitySearch2(false);
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
                                {filteredAmenities2.slice(0, 6).map((a, idx) => {
                                    {/* const isSelected = selectedAmenities2.includes(a.label); */ }
                                    const isSelected = step2Data?.standoutAmenities?.includes(a.label);
                                    return (
                                        <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
                                            <span className='br-list gap-2'>
                                                <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
                                                {a.label}
                                            </span>
                                            <span
                                                className='add-plus-icn'
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleAmenitySelect2(a.label)}
                                            >
                                                <Image
                                                    src={
                                                        isSelected
                                                            ? "./images/icons/check_circle.svg"
                                                            : "./images/icons/add_circle.svg"
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
                                {filteredAmenities2.length === 0 && (
                                    <li style={{ color: "#73615F", padding: "0px 0" }}>No amenities found.</li>
                                )}
                            </dl>
                            <hr style={{ margin: '50px 0' }} />
                        </div>

                        <div className='d-flex'>
                            <Button
                                variant=""
                                className='btn-white-transparent d-flex gap-2 me-3'
                                style={{ padding: '13px 35px', borderRadius: '0' }}
                                type="button"
                                onClick={() => setActiveStep(activeStep - 1)}
                            >
                                <Image src="./images/icons/double-arrows.svg" className='img-fluid' alt='arrow' /> Back
                            </Button>

                            <Button
                                variant="success"
                                className='complete-form-btn'
                                style={{ padding: '13px 35px', borderRadius: '0' }}
                                // type="submit"
                                onClick={() => handleSubmit('')}
                            >
                                Continue
                            </Button>
                        </div>
                        {/* </Form> */}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}