"use client"
import React, { useEffect, useState } from 'react'
import {  Button, Modal } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { formatDatesForModal, getTimeinDatestring } from '@/utils/formatTime';
import { BookingCheckoutAPI } from '@/services/provider';
import { ToastContainer } from 'react-toastify';
import toast from 'react-hot-toast';

export const CheckoutModal = ({ checkoutModal, CheckoutClose,fetchDataFunction, bookingDetailData }) => {    
    const [additionalComments, setAdditionalComments] = useState('')
    useEffect(() => {
        setAdditionalComments(bookingDetailData?.additional_comments)
    }, [checkoutModal])
    const handleCheckoutFun = async () => {
        try {
            const formData = new FormData();
            formData.append("remarks", additionalComments)
            const response = await BookingCheckoutAPI(bookingDetailData?.uid, formData);
            if (response?.data?.success) {
                fetchDataFunction();
                toast.success(response.data.response.message)
                CheckoutClose();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <ToastContainer />
            <Modal show={checkoutModal} onHide={CheckoutClose} animation={false} centered className='custom-theme-modal ' >
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
                        <h3 style={{ margin: 0, fontWeight: 500, color: '#fff' }}>Checkout today  by <br></br> {getTimeinDatestring(bookingDetailData?.check_out_date)}</h3>

                        <Image
                            src='/images/icons/close-circle.svg'
                            width={24}
                            height={24}
                            alt='Close'
                            style={{ cursor: 'pointer', position: 'absolute', top: 12, right: 12, filter: 'brightness(0) invert(1)' }}
                            onClick={CheckoutClose}
                        />
                    </div>


                    <div className='p-4'>
                        <div className='booking-details-br'>

                            <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for {bookingDetailData?.traveler?.name || bookingDetailData?.traveler_name}
                                {/* Shuban, and Jenny  */}
                            </p>

                            {/* <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p> */}
                            <p className='d-flex align-items-center gap-2' style={{ lineHeight: 'auto', fontSize: '14px' }} >

                                {bookingDetailData?.room?.name || bookingDetailData?.room_name}  &nbsp;|
                                <Image src='/images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> {bookingDetailData?.room?.bed_name || bookingDetailData?.bed_name} | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Checked-in'>{bookingDetailData?.booking_status}</span>  </p>

                            <hr></hr>
                            <div className='bm-contact mt-4'>
                                <ul className='room-list'>
                                    <li>{formatDatesForModal(bookingDetailData?.check_in_date,bookingDetailData?.check_out_date)}  <span>{bookingDetailData?.total_nights} nights</span></li>
                                    <li> <span>Booking Id </span> {bookingDetailData?.booking_number} <Image src='/images/icons/content_copy.svg' className='img-fluid' alt='clone' width={20} height={20} /> </li>
                                </ul>
                            </div>
                        </div>
                        <div className='booking-details-br mt-3'>
                            <p className='font-18 fw-medium'>Additional comments/ remarks</p>
                            <div className='form-group '>
                                <textarea className='form-control' value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)} placeholder="Add your message here"></textarea>
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={CheckoutClose} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={handleCheckoutFun} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Confirm and Checkout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
