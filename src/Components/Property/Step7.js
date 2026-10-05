"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image, Modal } from 'react-bootstrap'
import Select, { AriaOnFocus, components } from 'react-select';
import DatePicker from "react-datepicker";
import Link from 'next/link';
import { PropertyFinishPublishedAPI } from '@/services/provider';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { formatTime12Hour } from '@/utils/formatTime';
import { useRouter } from 'next/navigation';
import { alert_danger } from '@/utils/Alerts/TostifyAlerts';
// import { ToastContainer } from 'react-toastify';

// Add missing convertToTimestamp function
const convertToTimestamp = (timeString) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    let hour = parseInt(hours);
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;

    const date = new Date();
    date.setHours(hour, parseInt(minutes), 0, 0);
    return date;
};

// Add time formatting function
const formatTimeForDisplay = (date) => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export default function Step7({ activeStep, setActiveStep, draft }) {
    const [property, setProperty] = useState({});
    const [step7Data, setStep7Data] = useState({
        gst_number: '',
        pan_number: '',
        checkin_time: convertToTimestamp('02:00 PM'),
        checkout_time: convertToTimestamp('11:00 AM')
    });

    const [petsAllowed, setPetsAllowed] = useState(false);
    const [smokingAllowed, setSmokingAllowed] = useState(false);
    const [photographyAllowed, setPhotographyAllowed] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const router = useRouter();

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

    const handleFinishAndPublish = async () => {
        if (!termsAccepted) {
            alert("Please accept the terms and conditions to continue.");
            return;
        }

        if (!property?.uid) {
            alert("Property data is missing. Please go back to previous steps.");
            return;
        }

        setIsLoading(true);
        try {
            const fieldData = new FormData();
            fieldData.append("gst_number", step7Data.gst_number);
            fieldData.append("pan_number", step7Data.pan_number);
            fieldData.append("checkin_time", formatTime12Hour(step7Data.checkin_time));
            fieldData.append("checkout_time", formatTime12Hour(step7Data.checkout_time));
            fieldData.append("pets_allowed", petsAllowed.toString());
            fieldData.append("smoking_allowed", smokingAllowed.toString());
            fieldData.append("commercial_photography_allowed", photographyAllowed.toString());

            const response = await PropertyFinishPublishedAPI(property.uid, fieldData);

            if (response?.data?.success) {
                setShowSuccessModal(true);
                // Optionally clear localStorage or navigate to success page
                // localStorage.removeItem("properyItem");
                router.push("/PropertyListing")
            } else {
                // throw new Error(response.message || "Failed to publish listing");
                const dynamicKey = Object.keys(response.data.response);
                dynamicKey.map((key) => {
                    const message = response.data.response[key].join('\n');
                    alert_danger(message)
                })

            }
        } catch (error) {
            console.error("Publish error:", error);
            alert(error.message || "Failed to publish listing. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        // Implement navigation back to previous step
        window.history.back();
    };

    return (
        <>
            <Container>
                {/* <ToastContainer /> */}
                <Row>
                    <Col md={8}>
                        <div className='box-input'>
                            <h3 className='page-title mb-4'>Finally, provide some tax information details, and set your space rules</h3>

                            <div className='property-list-2'>
                                <p className='subheadline-2 mb-1'>Tax Information</p>
                                <p className='mb-5'>{"To comply with country's regulations regarding property listings, we require the following information."}</p>

                                <div className='form-group mb-4'>
                                    <label>GST Number (optional)</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={step7Data.gst_number}
                                        onChange={(e) => {
                                            setStep7Data({
                                                ...step7Data,
                                                gst_number: e.target.value
                                            })
                                        }}
                                        placeholder='Enter GST number'
                                    />
                                </div>

                                <div className='form-group mb-4'>
                                    <label>Permanent Account Number (PAN) (optional)</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={step7Data.pan_number}
                                        onChange={(e) => {
                                            setStep7Data({
                                                ...step7Data,
                                                pan_number: e.target.value
                                            })
                                        }}
                                        placeholder='Enter PAN'
                                    />
                                </div>

                                <hr style={{ margin: "50px 0" }} />

                                <p className='subheadline-2 mb-1'>Space rules</p>
                                <p>{"Guests are expected to follow your rules and may be removed from space if they don't."}</p>

                                <p className='mb-3'>Check-in and checkout times</p>
                                <p className='mb-4'>Check-in window</p>

                                <Row>
                                    <Col md={6}>
                                        <p className='mb-4'>Check-in Time</p>
                                        <div className='form-group'>
                                            <DatePicker
                                                selected={step7Data.checkin_time}
                                                onChange={(newTime) => {
                                                    if (newTime) {
                                                        setStep7Data({
                                                            ...step7Data,
                                                            checkin_time: newTime
                                                        })
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                                className="form-control time-dropdown"
                                            />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <p className='mb-4'>Checkout time</p>
                                        <div className='form-group'>
                                            <DatePicker
                                                selected={step7Data.checkout_time}
                                                onChange={(newTime) => {
                                                    if (newTime) {
                                                        setStep7Data({
                                                            ...step7Data,
                                                            checkout_time: newTime
                                                        })
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                                className="form-control time-dropdown"
                                            />
                                        </div>
                                    </Col>

                                    <Col className='mt-4' md='12'>
                                        <hr className='mt-4 mb-4' />

                                        <div className="pets-toggle">
                                            <div>
                                                <p className="title">Pets allowed</p>
                                                <p className="subtitle">
                                                    You can refuse pets, but must reasonably accommodate service animals.
                                                </p>
                                            </div>

                                            <div className="radio-buttons">
                                                <label className={`radio-btn ${petsAllowed === false ? "active" : ""}`}>
                                                    <input
                                                        type="radio"
                                                        name="petsAllowed"
                                                        checked={petsAllowed === false}
                                                        onChange={() => setPetsAllowed(false)}
                                                    />
                                                    <Image src='./images/icons/cross-w.svg' className='img-fluid' alt='cross' />
                                                </label>

                                                <label className={`radio-btn ${petsAllowed === true ? "active" : ""}`}>
                                                    <input
                                                        type="radio"
                                                        name="petsAllowed"
                                                        checked={petsAllowed === true}
                                                        onChange={() => setPetsAllowed(true)}
                                                    />
                                                    <Image src='./images/icons/check-w.svg' className='img-fluid' alt='CHECK' />
                                                </label>
                                            </div>
                                        </div>

                                        <hr className='mt-4 mb-4' />

                                        <div className="pets-toggle">
                                            <div>
                                                <p className="subtitle">
                                                    Smoking, vaping, e‑cigarettes allowed
                                                </p>
                                            </div>

                                            <div className="radio-buttons">
                                                <label className={`radio-btn ${smokingAllowed === false ? "active" : ""}`}>
                                                    <input
                                                        type="radio"
                                                        name="smokingAllowed"
                                                        checked={smokingAllowed === false}
                                                        onChange={() => setSmokingAllowed(false)}
                                                    />
                                                    <Image src='./images/icons/cross-w.svg' className='img-fluid' alt='cross' />
                                                </label>

                                                <label className={`radio-btn ${smokingAllowed === true ? "active" : ""}`}>
                                                    <input
                                                        type="radio"
                                                        name="smokingAllowed"
                                                        checked={smokingAllowed === true}
                                                        onChange={() => setSmokingAllowed(true)}
                                                    />
                                                    <Image src='./images/icons/check-w.svg' className='img-fluid' alt='CHECK' />
                                                </label>
                                            </div>
                                        </div>

                                        <hr className='mt-4 mb-4' />

                                        <div className="pets-toggle">
                                            <div>
                                                <p className="subtitle">
                                                    Commercial photography and filming allowed
                                                </p>
                                            </div>

                                            <div className="radio-buttons">
                                                <label className={`radio-btn ${photographyAllowed === false ? "active" : ""}`}>
                                                    <input
                                                        type="radio"
                                                        name="photographyAllowed"
                                                        checked={photographyAllowed === false}
                                                        onChange={() => setPhotographyAllowed(false)}
                                                    />
                                                    <Image src='./images/icons/cross-w.svg' className='img-fluid' alt='cross' />
                                                </label>

                                                <label className={`radio-btn ${photographyAllowed === true ? "active" : ""}`}>
                                                    <input
                                                        type="radio"
                                                        name="photographyAllowed"
                                                        checked={photographyAllowed === true}
                                                        onChange={() => setPhotographyAllowed(true)}
                                                    />
                                                    <Image src='./images/icons/check-w.svg' className='img-fluid' alt='CHECK' />
                                                </label>
                                            </div>
                                        </div>

                                        <hr className='mt-4 mb-4' />
                                    </Col>
                                </Row>

                                <div className='d-flex align-items-start gap-2'>
                                    <input
                                        type='checkbox'
                                        className='custom-checkbox'
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <p className='tc-apply mt-0 mb-0'>
                                        {`By selecting Confirm and Publish Listing, I agree to Retronym's`}
                                        <Link href='#'> Terms of Service</Link>, and acknowledge the
                                        <Link href='#'> Privacy Policy.</Link>
                                    </p>
                                </div>

                                <div className='d-flex mt-5'>
                                    <Button
                                        variant=""
                                        className='btn-white-transparent d-flex gap-2 me-3'
                                        style={{ padding: '13px 35px', borderRadius: '0' }}
                                        onClick={() => setActiveStep(activeStep - 1)}
                                        disabled={isLoading}
                                    >
                                        <Image src="./images/icons/double-arrows.svg" className='img-fluid' alt='arrow' />
                                        Back
                                    </Button>

                                    <Button
                                        variant="success"
                                        className='complete-form-btn'
                                        style={{ padding: '13px 35px', borderRadius: '0' }}
                                        onClick={handleFinishAndPublish}
                                        disabled={isLoading || !termsAccepted}
                                    >
                                        {isLoading ? 'Publishing...' : 'Confirm and Publish Listing'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your property has been published successfully!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}