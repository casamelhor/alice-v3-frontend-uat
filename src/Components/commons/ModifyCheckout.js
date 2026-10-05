"use client"
import React from 'react'
import { Row, Col, Button, Modal, Form, Accordion } from 'react-bootstrap';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Image from 'next/image';
import { BookingCheckoutAPI, CheckAvailabilityAPI, ModifyBookingAPI } from '@/services/provider';
import { calculateNights, convertDayMonthcommaYear, formatDatesForModal, formatYMD } from '@/utils/formatTime';

export const ModifyCheckout = ({ showModifyCheckout, handleModifyCheckoutClose, isStep2, setIsStep2, inactiveFrom, setInactiveFrom, inactiveTo, setInactiveTo,fetchDataFunction, bookingDetailData }) => {
    console.log(bookingDetailData)
    const handleCheckAvailability = async () => {
        try {
            const payload = {
                check_in_date: formatYMD(bookingDetailData?.check_in_date),
                check_out_date: inactiveTo
            }
            const response = await CheckAvailabilityAPI(bookingDetailData?.uid, payload);
            if (response?.data?.response?.available) {
                setIsStep2(true);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleModifyDates = async () => {
        try {
            const formData = new FormData();
            formData.append("check_out_date",inactiveTo)
            const response = await ModifyBookingAPI(bookingDetailData?.uid, formData)
            if (response?.data?.success) {     
                fetchDataFunction();           
                setInactiveTo('');               
                handleModifyCheckoutClose();
                setIsStep2(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Modal show={showModifyCheckout} onHide={handleModifyCheckoutClose} animation={false} centered className='custom-theme-modal ' >
            <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                <Modal.Title>
                    Update Checkout Date
                </Modal.Title>

                <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={handleModifyCheckoutClose} />
            </Modal.Header>
            <Modal.Body className='pt-4 pb-4'>

                <div className={`update-step-1 ${isStep2 ? "d-none" : ""}`}>
                    <div className='booking-details-br'>

                        <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for {bookingDetailData?.traveler?.name || bookingDetailData?.traveler_name} </p>
                        <p className='d-flex gap-1' style={{ lineHeight: '24px' }} >{bookingDetailData?.room?.name || bookingDetailData?.room_name} &nbsp; | &nbsp; <Image src='/images/icons/king_bed.svg' className='img-fluid' alt='building' width={24} height={24} />  {bookingDetailData?.room?.bed_name || bookingDetailData?.bed_name}  &nbsp; |  &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>{bookingDetailData?.company?.name || bookingDetailData?.company_name}</span>  </p>
                        <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='/images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  {bookingDetailData?.traveler?.name || bookingDetailData?.traveler_name}</p>

                        <div className='bm-contact mt-4'>
                            <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                            <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                            <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                                gloria@slb.com,  +91 7876776655

                            </p>


                            <p className='border-bottom pb-4'></p>

                            <ul className='room-list'>

                                <li>{formatDatesForModal(bookingDetailData?.check_in_date,bookingDetailData?.check_out_date)}  <span>{bookingDetailData?.total_nights} nights</span></li>
                                <li> <span>Booking Id </span> {bookingDetailData?.booking_number} <Image src='/images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} /> </li>
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
                                        selected={inactiveTo}
                                        onChange={(date) => setInactiveTo(formatYMD(date))}
                                        selectsEnd
                                        startDate={inactiveTo}
                                        endDate={inactiveTo ? inactiveTo : new Date()}
                                        minDate={new Date()}
                                        className="form-control  custom-date-picker"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText='dd/MM/yyyy'
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
                        <p className='mb-0' >Check-in:  <strong>{convertDayMonthcommaYear(bookingDetailData?.check_in_date)}</strong> </p>
                        <p className='mb-0'>Checkout: <strong>{convertDayMonthcommaYear(bookingDetailData?.check_out_date)}</strong></p>
                        <p className='mt-2 mb-0'>Duration: {calculateNights(bookingDetailData?.check_in_date, bookingDetailData?.check_out_date)} nights</p>

                    </div>

                    <hr style={{ margin: '30px 0' }} ></hr>

                    <p>New stay dates</p>
                    <div className='booking-details-br mt-3 mb-3'>
                        <p className='mb-0' >Check-in:  <strong>{convertDayMonthcommaYear(bookingDetailData?.check_in_date)}</strong> </p>
                        <p className='mb-0'>Checkout: <strong>{convertDayMonthcommaYear(inactiveTo)}</strong></p>
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
