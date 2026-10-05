"use client"
import React, { useState } from 'react'
import { Row, Col, Button, Modal, Form, Accordion } from 'react-bootstrap';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Image from 'next/image';
import { CancelBookingAPI } from '@/services/provider';
import { formatDatesForModal } from '@/utils/formatTime';

export const CancelBookingModal = ({ cancelbooksModal, cancelbookClose, fetchDataFunction, bookingDetailData }) => {
    const reasonsOption = [
        { value: "Change-of-Plans", label: "Change-of-Plans" },
        { value: "Travel-Dates-Changed", label: "Travel-Dates-Changed" },
        { value: "Alternative-Accommodation", label: "Alternative-Accommodation" },
        { value: "Emergency-Personal", label: "Emergency-Personal" },
        { value: "Company-Policy", label: "Company-Policy" },
        { value: "Duplicate-Booking", label: "Duplicate-Booking" },
        { value: "Other", label: "Other" }
    ];
    const [cancelFormData, setCancelFormData] = useState({ reason: '', message: '' });
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
    const handleCancelFun = async (flag) => {        
        try {
            let response;
            if (flag == "Not") {
                if(!cancelFormData.reason) {
                    toast.error("Please select reason")
                    return;
                }
                const formData = new FormData();
                formData.append('reason', cancelFormData.reason);
                formData.append('notes', cancelFormData.message);
                response = await CancelBookingAPI(bookingDetailData?.uid, formData);                
                if (response?.data?.success) {
                    fetchDataFunction()
                    cancelbookClose(true)
                    toast.success(response.data.response.message)
                }
            } else { }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(bookingDetailData?.booking_number);
        toast.success("Booking ID copied");
    };
    return (
        <Modal show={cancelbooksModal} onHide={cancelbookClose} animation={false} centered className='custom-theme-modal ' >
            <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                <Modal.Title>
                    Cancel Booking
                </Modal.Title>

                <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={cancelbookClose} />
            </Modal.Header>
            <Modal.Body className='pt-4 pb-4'>

                <div className='update-step-1'>
                    <div className='booking-details-br'>

                        <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for {bookingDetailData?.traveler?.name || bookingDetailData?.traveler_name} </p>
                        <p className='d-flex gap-1' style={{ lineHeight: '24px' }} >{bookingDetailData?.room?.name || bookingDetailData?.room_name} &nbsp; | &nbsp; <Image src='/images/icons/king_bed.svg' className='img-fluid' alt='building' width={24} height={24} />  {bookingDetailData?.room?.bed_name || bookingDetailData?.bed_name}  &nbsp; |  &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>{bookingDetailData?.booking_status}</span>  </p>
                        <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='/images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  {bookingDetailData?.company?.name || bookingDetailData?.company_name}</p>

                        <div className='bm-contact mt-4'>
                            <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                            <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                            <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                                gloria@slb.com,  +91 7876776655

                            </p>


                            <p className='border-bottom pb-4'></p>

                            <ul className='room-list'>

                                <li>{formatDatesForModal(bookingDetailData?.check_in_date, bookingDetailData?.check_out_date)}  <span>{bookingDetailData?.total_nights} nights</span></li>
                                <li>  <Toaster position="top-right" />
                                    <span>Booking Id </span> {bookingDetailData?.booking_number} <Image src='/images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} style={{ cursor: "pointer" }} onClick={handleCopy} /> </li>
                            </ul>


                        </div>


                    </div>



                    <div className='booking-details-br mt-3'>

                        <div className='inactive-box remove-company-box company-status-box'>
                            <div className='form-group mb-4'>
                                <label>Why do you we need to cancel?</label>
                                <Select
                                    name="aria-live-color"
                                    options={reasonsOption}
                                    placeholder="Select a reason"
                                    className="react_selectbox"
                                    isSearchable={false}
                                    styles={customStyles}
                                    onChange={(e) => setCancelFormData({ ...cancelFormData, reason: e.value })}
                                />
                            </div>

                            <div className='forom-group mb-0'>
                                <label>Tell booking manager and property managers why you need to cancel</label>
                                <textarea
                                    className="form-control textareabox mt-2"
                                    rows={4}
                                    placeholder="Add your message here"
                                    onChange={(e) => setCancelFormData({ ...cancelFormData, message: e.target.value })}
                                />
                            </div>

                        </div>

                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex align-items-center flex-column justify-content-between '>
                <Button variant="" className='cancel-booking w-100' onClick={() => handleCancelFun('Not')}  style={{ padding: '10px', borderRadius: '0', fontSize: '14px' }}>
                    Cancel Booking
                </Button>
                <Button variant="" onClick={() => handleCancelFun('Yes')} className='' style={{ padding: '0', borderRadius: '0' }}  >
                    The booking will be permanently deleted.
                </Button>
            </Modal.Footer>
        </Modal>
    )
}