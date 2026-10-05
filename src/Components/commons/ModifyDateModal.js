"use client"
import React, { useState } from 'react'
import { Row, Col, Button, Modal, Form, Accordion } from 'react-bootstrap';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Image from 'next/image';
import { convertDayMonthcommaYear, formatDatesForModal, formatYMD, generateTimeOptions } from '@/utils/formatTime';
import { CheckAvailabilityAPI, ModifyBookingAPI } from '@/services/provider';

export const ModifyDateModal = ({ changepicsModal, changepicClose, isStep2, setIsStep2, inactiveFrom, setInactiveFrom, inactiveTo, setInactiveTo, fetchDataFunction, bookingDetailData }) => {
    // const timeOption = [
    //     { value: "2pm", label: "2.00 P.M." },
    //     { value: "3pm", label: "3.00 P.M." },
    //     { value: "4pm", label: "4.00 P.M." },
    // ]\

    const timeOption = generateTimeOptions(30);

    const updateArrivalDetails = (key, value) => setArrivalData(prev => ({
        ...prev,
        arrival_details: { ...prev.arrival_details, [key]: value }
    }));

    const arrivalOption = [
        { value: "Flight", label: "Flight" },
        { value: "Train", label: "Train" }
    ];
    const [arrivalData, setArrivalData] = useState({
        additional_comments: '',
        arrival_time: '',
        mode_of_arrival: '',
        transport_number: ''
    })
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
    const handleCheckAvailability = async () => {
        try {
            const payload = {
                check_in_date: inactiveFrom,
                check_out_date: inactiveTo
            }
            const response = await CheckAvailabilityAPI(bookingDetailData?.uid, payload);
            if (response?.data?.response?.available) {
                setIsStep2(true);
            }else{
                toast.error(response?.data?.response?.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleModifyDates = async () => {
        try {
            const arrival_info = {
                arrival_date: inactiveFrom
            }
            if(arrivalData?.arrival_details?.arrival_time){
                arrival_info.arrival_time = arrivalData?.arrival_details?.arrival_time
            }
            if(arrivalData?.arrival_details?.mode_of_arrival){
                arrival_info.mode_of_arrival = arrivalData?.arrival_details?.mode_of_arrival
            }
            if(arrivalData?.arrival_details?.transport_number){
                arrival_info.transport_number = arrivalData?.arrival_details?.transport_number   
            }
            const payload = {
                check_in_date: inactiveFrom,
                check_out_date: inactiveTo,
                additional_comments: arrivalData.additional_comments,
                arrival_details: arrival_info
            }
            const response = await ModifyBookingAPI(bookingDetailData?.uid, payload)
            if (response?.data?.success) {
                fetchDataFunction();
                setInactiveFrom('');
                setInactiveTo('');
                setArrivalData({
                    additional_comments: '',
                    arrival_time: '',
                    mode_of_arrival: '',
                    transport_number: ''
                })
                setIsStep2(false);
                changepicClose();
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log(bookingDetailData)

    const handleCopy = () => {
        navigator.clipboard.writeText(bookingDetailData?.booking_number);
        toast.success("Booking ID copied");
    };



    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const diffTime = end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return Math.max(1, Math.ceil(diffDays));
    };

    return (
        <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal ' >
            <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                <Modal.Title>
                    Update Stay Dates

                </Modal.Title>

                <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
            </Modal.Header>
            <Modal.Body className='pt-4 pb-4'>

                <div className={`update-step-1 ${isStep2 ? "d-none" : ""}`}>
                    <div className='booking-details-br'>

                        <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for {bookingDetailData?.traveler?.name || bookingDetailData?.traveler_name} </p>
                        <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400' }} > <Image src='/images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  {bookingDetailData?.company?.name || bookingDetailData?.company_name}</p>

                        <div className='bm-contact mt-4'>
                            <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Contact Details </p>
                            <p className='mb-0 d-flex gap-2 align-items-center font-18' >  {bookingDetailData?.traveler?.name || bookingDetailData?.traveler_name}, </p>
                            <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                                {bookingDetailData?.traveler?.email || bookingDetailData?.traveler_email},  {bookingDetailData?.traveler?.phone || bookingDetailData?.traveler_phone}

                            </p>


                            <p className='border-bottom pb-4'></p>

                            <ul className='room-list'>
                                <li>1 <span>Room</span></li>
                                <li>{formatDatesForModal(bookingDetailData?.check_in_date, bookingDetailData?.check_out_date)}  <span>{bookingDetailData?.total_nights} nights</span></li>
                                <li>
                                    <Toaster position="top-right" />
                                    <span>Booking Id </span> {bookingDetailData?.booking_number} <Image src='/images/icons/content_copy.svg' className='img-fluid' alt='clone' width={16} height={16} style={{ cursor: "pointer" }}
                                        onClick={handleCopy} /> </li>
                            </ul>


                        </div>


                    </div>


                    <div className='booking-details-br mt-3'>

                        <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Choose stay dates </p>
                        <Row className=''>
                            <Col md={6}>
                                <div className='form-group mb-2'  >
                                    <label> Check-in</label>
                                    {/* <DatePicker
                                        selected={inactiveFrom}
                                        onChange={(date) => setInactiveFrom(date)}
                                        placeholderText="Select date"
                                        className="form-control  custom-date-picker"
                                        dateFormat="dd/MM/yyyy"

                                    /> */}
                                    <DatePicker
                                        selected={inactiveFrom}
                                        onChange={(date) => setInactiveFrom(formatYMD(date))}
                                        selectsStart
                                        minDate={new Date()}
                                        startDate={new Date()}
                                        className="form-control  custom-date-picker"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText='dd/MM/yyyy'
                                    />
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className='form-group mb-2'>
                                    <label>Checkout</label>
                                    {/* <DatePicker
                                        selected={inactiveTo}
                                        onChange={(date) => setInactiveTo(date)}
                                        placeholderText="Select date"
                                        className="form-control custom-date-picker"
                                        dateFormat="dd/MM/yyyy"
                                    /> */}
                                    <DatePicker
                                        selected={inactiveTo ? inactiveTo : inactiveFrom}
                                        onChange={(date) => setInactiveTo(formatYMD(date))}
                                        selectsEnd
                                        startDate={inactiveFrom}
                                        endDate={inactiveTo ? inactiveTo : new Date()}
                                        minDate={new Date()}
                                        className="form-control  custom-date-picker"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText='dd/MM/yyyy'
                                    />
                                </div>
                            </Col>


                            <Col md={6}>
                                <div className=' mb-2 mt-2' >
                                    {calculateNights(inactiveFrom, inactiveTo)} nights
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>


                <div className={`update-step-2 mt-3 ${isStep2 ? "" : "d-none"}`}>
                    <p>Good news your dates are available! Check the new dates of your stay below:</p>

                    <p>Original stay dates</p>
                    <div className='booking-details-br mt-3 mb-3'>
                        <p className='mb-0' >Check-in:  <strong>{convertDayMonthcommaYear(bookingDetailData?.check_in_date)}</strong> </p>
                        <p className='mb-0'>Checkout: <strong>{convertDayMonthcommaYear(bookingDetailData?.check_out_date)}</strong></p>
                        <p className='mt-2 mb-0'>Duration: {calculateNights(bookingDetailData?.check_in_date, bookingDetailData?.check_out_date)} nights</p>

                    </div>

                    <hr style={{ margin: '30px 0' }} ></hr>

                    <p>New stay dates</p>
                    <div className='booking-details-br mt-3 mb-3'>
                        <p className='mb-0' >Check-in:  <strong>{convertDayMonthcommaYear(inactiveFrom)}</strong> </p>
                        <p className='mb-0'>Checkout: <strong>{convertDayMonthcommaYear(inactiveTo)}</strong></p>
                        <p className='mt-2 mb-0'>Duration: {calculateNights(inactiveFrom, inactiveTo)} nights</p>

                    </div>




                    <p></p>

                    <Accordion className='change-arrival-date-coll' defaultActiveKey="0" flush>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Change Arrival Details</Accordion.Header>
                            <Accordion.Body>

                                <div className="arrival-section">
                                    <Form.Group className='mb-4 mt-4' controlId="arrivalTime">
                                        <Form.Label className="mb-2 fw-semibold">
                                            Est. Time of Arrival In Individual House
                                        </Form.Label>

                                        <Select
                                            name="aria-role-select"
                                            options={timeOption}
                                            // onChange={(e) => setArrivalData({ ...arrivalData, arrival_time: e.value })}
                                            onChange={(e) => updateArrivalDetails("arrival_time", e.value)}
                                            placeholder="Choose Time "
                                            className="react_selectbox"
                                            isSearchable={false}
                                            styles={customStyles}
                                        />
                                    </Form.Group>


                                    <Form.Group className='mb-4' controlId="mode_of_arrival">
                                        <Form.Label className=" mb-2 fw-semibold">
                                            Mode of Arrival
                                        </Form.Label>

                                        <Select
                                            name="aria-role-select"
                                            options={arrivalOption}
                                            // onChange={(e) => setArrivalData({ ...arrivalData, mode_of_arrival: e.value })}
                                            placeholder="Select Mode"
                                            className="react_selectbox"
                                            isSearchable={false}
                                            styles={customStyles}
                                            value={arrivalOption.find(opt => opt.value === arrivalData?.arrival_details?.mode_of_arrival) || null}
                                            onChange={(e) => updateArrivalDetails("mode_of_arrival", e.value)}
                                        />
                                    </Form.Group>

                                    <div className='mb-4 form-group' controlId="arrivalTime">
                                        <Form.Label className=" mb-2 fw-semibold">
                                            Flight / Train Number
                                        </Form.Label>

                                        <input type="text"
                                            // onChange={(e) => setArrivalData({ ...arrivalData, transport_number: e.target.value })}

                                            value={arrivalData?.arrival_details?.transport_number}
                                            onChange={(e) => updateArrivalDetails("transport_number", e.target.value)}
                                            placeholder='Enter number e.g. MADGAON LTT EXP #11100' className='form-control' />
                                    </div>
                                </div>

                                <div className="arrival-section  mt-4 pt-3 mb-5">
                                    <p className="font-18 mb-2">Other Essential Details</p>
                                    <p className="text-secondary  mb-4">
                                        Share any additional details or requests for this booking.
                                    </p>

                                    <div className='mb-4 form-group' >
                                        <textarea className='form-control' onChange={(e) => setArrivalData({ ...arrivalData, additional_comments: e.target.value })} placeholder='Got any thoughts or questions? Add them here! (Optional)'>
                                        </textarea>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
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
                            // changepicClose();
                            handleModifyDates()
                        } else {
                            // setIsStep2(true); // switch to step 2
                            handleCheckAvailability()
                        }
                    }}
                    className='search-btn complete-form-btn '
                    style={{ padding: '13px 25px', borderRadius: '0' }}
                >
                    {isStep2 ? "Confirm This Change" : "Check Availability"}
                </Button>

            </Modal.Footer>

        </Modal>
    )
}