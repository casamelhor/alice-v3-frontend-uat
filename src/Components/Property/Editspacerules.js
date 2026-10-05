"use client"
import React, { useEffect } from 'react'
import { useState } from "react";
import { Button, Col, Row, Image } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Link from 'next/link';
import { formatTime12Hour } from '@/utils/formatTime';
import { useParams, useSearchParams } from 'next/navigation';
import { UpdatePropertyDetailAPI } from '@/services/provider';

export default function Editspacerules({ setIsEditSpaceRule, formData, setFormData, petsAllowed, setPetsAllowed, smokingAllowed, setSmokingAllowed, photographyAllowed, setPhotographyAllowed,getPropertyDetail }) {
    // const param = useParams();
    // const id = param.id;
    const [id, setId] = useState()
    const searchParams = useSearchParams();

    // useEffect(() => {
    //     const stateParam = searchParams.get('state');
    //     if (stateParam) {
    //         const state = JSON.parse(decodeURIComponent(stateParam));
    //         setId(state.id)
    //     }
    // }, [searchParams]);


    useEffect(() => {
        const uid = searchParams.get('uid');
        if (uid) {
            setId(uid);
        }
    }, [searchParams]);

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

    const [time, setTime] = useState(new Date());
    const [time1, setTime1] = useState(new Date());
    const [time2, setTime2] = useState(new Date());
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            addressHelp: e.target.value
        })
    }

    const handleUpload = async () => {
        try {
            const rawData = {
                // nearest_airport: formData.addressHelp,
                checkin_time: formatTime12Hour(formData.checkin_time),
                checkout_time: formatTime12Hour(formData.checkout_time),
                pets_allowed: petsAllowed,
                smoking_allowed: smokingAllowed,
                commercial_photography_allowed: photographyAllowed
            };

            const response = await UpdatePropertyDetailAPI(id, rawData);
            if (response?.data?.success) {
                setIsEditSpaceRule(false)
                getPropertyDetail();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Row>
                <Col md={6} className="relative active-box-fadein">
                    <div className='d-flex align-items-start justify-content-between mb-5'>
                        <div className='general-info'>
                            <h2 className='page-title'> General information</h2>
                            <p className='mb-0'>Change or edit all company related general information from here</p>
                        </div>
                        <Link href="" className='Save-company-btn' style={{ textDecoration: 'none' }} onClick={() => {
                            // setIsEditSpaceRule(false)
                            handleUpload()
                        }}> Done </Link>
                    </div>
                    <div className='box-input'>
                        <div className='property-list-2'>
                            {/* <h3 className='font-24 mb-3'>Basic Information</h3>
                            <p className='subheadline-2 mb-1'>{"What's the nearest airport to this BR / property?"}</p>
                            <p>Help corporate guests plan their travel by sharing the closest airport. </p>
                            <div className='form-group mb-4'>
                                <label>Help corporate guests plan their travel by sharing the closest airport.</label>
                                <input type='text' name='addressHelp' value={formData?.addressHelp} onChange={handleInputChange} className='form-control' placeholder='e.x. Mumbai International Airport (45 minutes drive)' />
                            </div>
                            <hr style={{ margin: "10px 0" }} /> */}
                            <h3 className='font-24 mt-5 mb-1'>Space rules</h3>
                            <p>{"Guests are expected to follow your rules and may be removed from space if they don't."}</p>
                            <p className='subheadine-2 mt-4 mb-4'>Check-in and checkout times</p>
                            <Row>
                                <Col md={6}>
                                    <p className='mb-4' >Check-in Time</p>
                                    <div className='form-group'>
                                        <DatePicker
                                            selected={formData?.checkin_time}
                                            onChange={(newTime) => {
                                                if (newTime) {
                                                    setFormData({
                                                        ...formData,
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
                                    <p className='mb-4 ' >Checkout time</p>
                                    <div className='form-group'>
                                        <DatePicker
                                            selected={formData?.checkout_time}
                                            onChange={(newTime) => {
                                                if (newTime) {
                                                    setFormData({
                                                        ...formData,
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
                                    <hr className='mt-4 mb-4'></hr>
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
                                                    // value=false
                                                    checked={petsAllowed === false}
                                                    onChange={(e) => setPetsAllowed(false)}
                                                />
                                                <Image src='/images/icons/cross-w.svg' className='imG-fluid' alt='cross' />
                                            </label>
                                            <label className={`radio-btn ${petsAllowed === true ? "active" : ""}`}>
                                                <input
                                                    type="radio"
                                                    name="petsAllowed"
                                                    // value=true
                                                    checked={petsAllowed === true}
                                                    onChange={(e) => setPetsAllowed(true)}
                                                />
                                                <Image src='/images/icons/check-w.svg' className='imG-fluid' alt='CHECK' />
                                            </label>
                                        </div>
                                    </div>
                                    <hr className='mt-4 mb-4'></hr>
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
                                                    name="petsAllowed"
                                                    // value=false
                                                    checked={smokingAllowed === false}
                                                    onChange={(e) => setSmokingAllowed(false)}
                                                />
                                                <Image src='/images/icons/cross-w.svg' className='imG-fluid' alt='cross' />
                                            </label>
                                            <label className={`radio-btn ${smokingAllowed === true ? "active" : ""}`}>
                                                <input
                                                    type="radio"
                                                    name="petsAllowed"
                                                    // value=true
                                                    checked={smokingAllowed === true}
                                                    onChange={(e) => setSmokingAllowed(true)}
                                                />
                                                <Image src='/images/icons/check-w.svg' className='imG-fluid' alt='CHECK' />
                                            </label>
                                        </div>
                                    </div>
                                    <hr className='mt-4 mb-4'></hr>
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
                                                    name="petsAllowed"
                                                    // value=false
                                                    checked={photographyAllowed === false}
                                                    onChange={(e) => setPhotographyAllowed(false)}
                                                />
                                                <Image src='/images/icons/cross-w.svg' className='imG-fluid' alt='cross' />
                                            </label>
                                            <label className={`radio-btn ${photographyAllowed === true ? "active" : ""}`}>
                                                <input
                                                    type="radio"
                                                    name="petsAllowed"
                                                    // value=true
                                                    checked={photographyAllowed === true}
                                                    onChange={(e) => setPhotographyAllowed(true)}
                                                />
                                                <Image src='/images/icons/check-w.svg' className='imG-fluid' alt='CHECK' />
                                            </label>
                                        </div>
                                    </div>
                                    <hr className='mt-4 mb-4'></hr>
                                </Col>
                            </Row>
                            <div className='d-flex mt-5'>
                                <Button variant="success" className='complete-form-btn' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={handleUpload} >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}
