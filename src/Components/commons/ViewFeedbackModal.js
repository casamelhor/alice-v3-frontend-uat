"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal, Card } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

import Image from 'next/image';
import { getReviewDetailsAPI } from '@/services/provider';
import { formatDatesForModal } from '@/utils/formatTime';

export const ViewFeedbackModal = ({ viewFeedbackModal, handleCloseFeedbackModal, fetchDataFunction, bookingDetailData }) => {
    console.log(bookingDetailData);

    const [privateExpanded, setPrivateExpanded] = useState(false);
    const togglePrivateReview = () => setPrivateExpanded((prev) => !prev);
    const [rating,setRating] = useState({});    

    const fetchReviewDetail = async () => {
        try {
            const response = await getReviewDetailsAPI(bookingDetailData?.review?.uid)
            if (response?.data?.success) {         
                setRating(response?.data?.response)       
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if(bookingDetailData?.review?.uid) fetchReviewDetail()
    }, [viewFeedbackModal])
    return (
        <Modal show={viewFeedbackModal} onHide={handleCloseFeedbackModal} animation={false} centered className='custom-theme-modal status-height-70' >
            <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
                <Modal.Title className='d-flex align-items-center gap-3'>
                    Read review
                </Modal.Title>
                <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={handleCloseFeedbackModal} />
            </Modal.Header>
            <Modal.Body className='pt-4 pb-4'>
                <div className="room-details-modal">
                    <div className="review-details-wrapper">

                        {/* ===== TOP SECTION ===== */}
                        <Card className="review-card-top  mb-3">
                            <Card.Body className="p-3">
                                <Row className="align-items-center">
                                    <Col xs={12}>
                                        <div className='d-flex align-items-center gap-2 mb-3'>
                                            <p className="room-title  mb-0 fw-medium ">{bookingDetailData?.room?.name ? bookingDetailData?.room?.name : bookingDetailData?.room_name}<span className="text-muted"></span>{bookingDetailData?.room?.bed_name && `| ${bookingDetailData?.room?.bed_name}`} {bookingDetailData?.bed_name && `| ${bookingDetailData?.bed_name}`}</p>
                                            <span className="text-muted"> | </span>  <p className="room-title  mb-0 fw-medium ">{bookingDetailData?.property_name ? bookingDetailData?.property_name : bookingDetailData?.property?.name}</p>

                                        </div>
                                    </Col>

                                    <Col xs={12} className=" d-flex justify-between">


                                        <p className="reviewer-name mb-0 fw-medium">{bookingDetailData?.traveler?.name || bookingDetailData?.traveler_name} review <br></br>  of your BR</p>

                                        <Image
                                            src={bookingDetailData?.traveler?.profile_picture || `${bookingDetailData?.traveler_image}`}
                                            width={55}
                                            height={55}
                                            className="profile-img "
                                            alt="Guest"
                                        />
                                    </Col>
                                </Row>

                                <Row className="review-meta mt-3 g-3">
                                    <Col xs={2} className="border-end">
                                        <p className="meta-title mb-0 fw-medium d-flex">1 Room</p>
                                    </Col>
                                    <Col xs={5} className="border-end">
                                        <p className="meta-title mb-0 fw-medium d-flex align-center justify-around ">{formatDatesForModal(bookingDetailData?.check_in_date, bookingDetailData?.check_out_date)} <br /><span className="text-muted small">{bookingDetailData?.total_nights} nights</span></p>
                                    </Col>
                                    <Col xs={5}>
                                        <p className="meta-title mb-0 fw-medium d-flex align-center justify-around ">Booking Id <br /><span className="id-no fw-bold">{bookingDetailData?.booking_number}</span></p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* ===== OVERALL RATING ===== */}



                        {/* ===== CATEGORY RATINGS (Expandable Items) ===== */}

                        <Card className="expand-card mb-3">
                            <Card.Body

                                className="expand-header d-flex justify-content-between align-items-center p-3"
                                style={{ cursor: 'pointer' }}
                            >
                                <p className="category-label mb-0 ">Overall rating</p>

                                <div className="d-flex align-items-center gap-2">
                                    <div className="rating-box d-flex align-items-center gap-2">
                                        <Image src="/images/icons/Star-green.svg" width={24} height={24} alt="rating" />
                                        <span className="rating-sub-value ">{rating?.overall_rating}</span>
                                    </div>
                                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                                </div>
                            </Card.Body>
                        </Card>


                        <Card className="expand-card mb-3">
                            <Card.Body
                                className="expand-headerw  p-3"
                                style={{ cursor: 'pointer' }}
                            >

                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <p className="category-label mb-0 ">Public Review</p>

                                    {/* <div className="d-flex align-items-center gap-2">
                                        <div className="rating-box d-flex align-items-center gap-2">
                                            <Image src="/images/icons/star.svg" width={20} height={20} alt="rating" />
                                            <span className="rating-sub-value ">4.5</span>
                                        </div>
                                        <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span>
                                    </div> */}

                                </div>

                                <div className='flex-column'>
                                    <p>
                                    {rating?.public_review}
                                    {/* The place was adorable and spotless. It showered before I got there and Ramesh cleared a parking spot for me, which was very kind. Quick responses, great-smelling soaps, and a perfect location. Can’t recomend enough! */}
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="expand-card mb-3">
                            <Card.Body

                                className="expand-header d-flex justify-content-between align-items-center p-3"
                                style={{ cursor: 'pointer' }}
                            >
                                <p className="category-label mb-0 ">Cleanliness</p>

                                <div className="d-flex align-items-center gap-2">
                                    <div className="rating-box d-flex align-items-center gap-2">
                                        <Image src="/images/icons/star.svg" width={20} height={20} alt="rating" />
                                        <span className="rating-sub-value ">{rating?.cleanliness_rating}</span>
                                    </div>
                                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="expand-card mb-3">
                            <Card.Body

                                className="expand-header d-flex justify-content-between align-items-center p-3"
                                style={{ cursor: 'pointer' }}
                            >
                                <p className="category-label mb-0 ">Food quality</p>

                                <div className="d-flex align-items-center gap-2">
                                    <div className="rating-box d-flex align-items-center gap-2">
                                        <Image src="/images/icons/star.svg" width={20} height={20} alt="rating" />
                                        <span className="rating-sub-value ">{rating?.food_quality_rating}</span>
                                    </div>
                                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="expand-card mb-3">
                            <Card.Body

                                className="expand-header d-flex justify-content-between align-items-center p-3"
                                style={{ cursor: 'pointer' }}
                            >
                                <p className="category-label mb-0 ">Staff hospitality</p>

                                <div className="d-flex align-items-center gap-2">
                                    <div className="rating-box d-flex align-items-center gap-2">
                                        <Image src="/images/icons/star.svg" width={20} height={20} alt="rating" />
                                        <span className="rating-sub-value ">{rating?.staff_hospitality_rating}</span>
                                    </div>
                                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="expand-card mb-3">
                            <Card.Body

                                className="expand-header d-flex justify-content-between align-items-center p-3"
                                style={{ cursor: 'pointer' }}
                            >
                                <p className="category-label mb-0 ">Comfort</p>

                                <div className="d-flex align-items-center gap-2">
                                    <div className="rating-box d-flex align-items-center gap-2">
                                        <Image src="/images/icons/star.svg" width={20} height={20} alt="rating" />
                                        <span className="rating-sub-value ">{rating?.comfort_rating}</span>
                                    </div>
                                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="expand-card mb-3">
                            <Card.Body

                                className="expand-header d-flex justify-content-between align-items-center p-3"
                                style={{ cursor: 'pointer' }}
                            >
                                <p className="category-label mb-0 ">Recommendation</p>

                                <div className="d-flex align-items-center gap-2">
                                    <div className="rating-box d-flex align-items-center gap-2">
                                        <Image src="/images/icons/star.svg" width={20} height={20} alt="rating" />
                                        <span className="rating-sub-value ">{rating?.location_rating}</span>
                                    </div>
                                    {/* <span className={`arrow ${expanded[item.key] ? "open" : ""}`} style={{ fontSize: '1.2rem' }}>⌄</span> */}
                                </div>
                            </Card.Body>
                        </Card>                       


                        <Card className="expand-card mb-3">
                            <Card.Body
                                className="expand-headerw  p-3"
                                style={{ cursor: 'pointer' }}
                                onClick={togglePrivateReview}
                            >
                                <div className='d-flex justify-content-between align-items-center '>
                                    <p className="category-label mb-0 ">Private Review</p>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rating-box d-flex align-items-center gap-2">
                                            <Image
                                                src={privateExpanded ? "/images/icons/bottom-arrow.svg" : "/images/icons/bottom-arrow.svg"}
                                                width={18}
                                                height={18}
                                                alt="toggle"
                                                style={{ transition: 'transform 0.2s', transform: privateExpanded ? 'rotate(180deg)' : 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {privateExpanded && (
                                    <div className='flex-column mt-3'>
                                        <p className='mb-0' >{rating?.private_feedback}
                                        {/* The place was adorable and spotless. It showered before I got there and Ramesh cleared a parking spot for me, which was very kind. Quick responses, great-smelling soaps, and a perfect location. Can’t recomend enough! */}
                                        </p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                        {/* DONE BUTTON */}


                    </div>
                </div>
            </Modal.Body>
            <div className="modal-footer-border-top border-top p-4 " >
                <div className="done-btn-wrapper m-0">
                    <Button className="done-btn w-100 py-2 fw-semibold" variant="primary" onClick={handleCloseFeedbackModal}>Done</Button>
                </div>
            </div>
        </Modal>
    )
}
