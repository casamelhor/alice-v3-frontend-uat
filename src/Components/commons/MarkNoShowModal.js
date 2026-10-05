"use client"
import React, { useState } from 'react'
import { Row, Col, Button, Modal, Form, Accordion } from 'react-bootstrap';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Image from 'next/image';
import { MarkNoShowAPI } from '@/services/provider';
import { formatDatesForModal } from '@/utils/formatTime';

export const MarkNoShowModal = ({marknoShowsModal,marknoShowClose,fetchDataFunction,bookingDetailData}) => {
    console.log(bookingDetailData);
    const [notes,setNotes] = useState('');
    const handleMarkNoShow=async()=>{
        try {
            const formData = new FormData();
            formData.append("notes",notes);
            const response = await MarkNoShowAPI(bookingDetailData?.uid,formData);
            if (response?.data?.success) {
                fetchDataFunction();
                marknoShowClose();
            }
        } catch (error) {
            console.log(error);            
        }
    }
    return (
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

                        <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for {bookingDetailData?.traveler?.name || bookingDetailData?.traveler_name} </p>
                        <p className='d-flex gap-1' style={{ lineHeight: '24px' }} >{bookingDetailData?.room?.name || bookingDetailData?.room_name} &nbsp; | &nbsp; <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='building' width={24} height={24} />  {bookingDetailData?.room?.bed_name || bookingDetailData?.bed_name}  &nbsp; |  &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>{bookingDetailData?.booking_status}</span>  </p>
                        <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  {bookingDetailData?.company?.name || bookingDetailData?.company_name}</p>

                        <div className='bm-contact mt-4'>
                            <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                            <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                            <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                                gloria@slb.com,  +91 7876776655

                            </p>


                            <p className='border-bottom pb-4'></p>

                            <ul className='room-list'>

                                <li>{formatDatesForModal(bookingDetailData?.check_in_date,bookingDetailData?.check_out_date)}  <span>{bookingDetailData?.total_nights} nights</span></li>
                                <li> <span>Booking Id </span> {bookingDetailData?.booking_number} <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} /> </li>
                            </ul>


                        </div>


                    </div>



                    <div className='booking-details-br mt-3'>

                        <div className='inactive-box remove-company-box company-status-box'>


                            <div className='forom-group mb-0'>
                                <label>Tell booking manager and property managers why you need to cancel</label>
                                <textarea
                                    onChange={(e)=>setNotes(e.target.value)}
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
                <Button variant=""
                    onClick={marknoShowClose}
                    className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                    Cancel
                </Button>
                <Button variant=""
                    onClick={handleMarkNoShow}
                    className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                    Confirm This Change
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
