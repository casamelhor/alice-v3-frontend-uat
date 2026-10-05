"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal, Card } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

import Image from 'next/image';
import { ReviewGiveFeedbackPostAPI } from '@/services/provider';
import { formatDatesForModal } from '@/utils/formatTime';
import toast from 'react-hot-toast';

export const GiveFeedbackModal = ({ giveReviewModal, handleCloseGiveReviewModal, fetchDataFunction, bookingDetailData }) => {
    console.log(bookingDetailData);


    const [privateExpanded, setPrivateExpanded] = useState(false);

    const togglePrivateReview = () => setPrivateExpanded((prev) => !prev);

    const [publicExpanded, setPublicExpanded] = useState(false);
    const [reviewText, setReviewText] = useState({
        public: "",
        private: ""
    })

    const togglePublicReview = () => setPublicExpanded((prev) => !prev);
    const feedbackOption = [
        {
            label: "Cleanliness",
            name: "cleanliness",
            desc: "How satisfied were you with the cleanliness of the property?",
        },
        {
            label: "Food quality",
            name: "food",
            desc: "How would you rate the quality of food and dining services?",
        },
        {
            label: "Staff hospitality",
            name: "staff",
            desc: "How helpful and courteous was our staff?",
        },
        {
            label: "Comfort",
            name: "comfort",
            desc: "How comfortable was your stay?",
        },
        {
            label: "Recommendation",
            name: "recommendation",
            desc: "Would you recommend CasaMelhor to your colleagues?",
        },        
    ]

    const [ratings, setRatings] = useState({

        cleanliness: 0,

        food: 0,

        staff: 0,

        location: 0,

        comfort: 0,

    });

    const isFeedbackRequired = Object.values(ratings).some(
        (value) => value <= 3
    );
    const RatingStars = ({ value, onChange }) => {
        const emotions = {
            1: { emoji: "😞", label: "Very Bad", color: "#dc2626" },
            2: { emoji: "😕", label: "Bad", color: "#f97316" },
            3: { emoji: "😐", label: "Okay", color: "#facc15" },
            4: { emoji: "🙂", label: "Good", color: "#84cc16" },
            5: { emoji: "😄", label: "Excellent", color: "#22c55e" },
        };

        return (
            <div className="d-flex align-items-center gap-3">
                {value > 0 && (
                    <div className="emotion-box">
                        <span className="emoji">{emotions[value].emoji}</span>
                        <span className="label">{emotions[value].label}</span>
                    </div>
                )}

                <div className="d-flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => onChange(star)}
                            className={`rating-star ${value >= star ? "active" : ""}`}
                            style={{ "--star-color": emotions[value]?.color }}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>
        );

    };

    const handleGiveFeedbackSave = async () => {
        try {
            if (isFeedbackRequired && !reviewText.public.trim()) {
                toast.error("Public review is mandatory if any rating is 3 or below");
                return;
            }
            
            const formData = new FormData();
            formData.append("booking_uid", bookingDetailData?.uid)
            formData.append("cleanliness_rating", ratings.cleanliness)
            formData.append("food_quality_rating", ratings.food)
            formData.append("staff_hospitality_rating", ratings.staff)
            formData.append("location_rating", ratings.location)
            formData.append("comfort_rating", ratings.comfort)
            formData.append("public_review", reviewText.public)
            formData.append("private_feedback", reviewText.private)
            const response = await ReviewGiveFeedbackPostAPI(formData);
            if (response?.data?.success) {
                handleCloseGiveReviewModal();
                fetchDataFunction();
                toast.success(response?.data?.response?.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log(ratings)
    return (
        <Modal
            show={giveReviewModal}
            onHide={handleCloseGiveReviewModal}
            centered
            animation={false}
            className="custom-theme-modal status-height-70"
        >

            <Modal.Header className="border-bottom d-flex justify-between align-items-center px-4 pt-4 pb-3">
                <Modal.Title>Give Feedback</Modal.Title>
                <Image
                    src="/images/icons/close-circle.svg"
                    width={24}
                    height={24}
                    alt="Close"
                    style={{ cursor: "pointer" }}
                    onClick={handleCloseGiveReviewModal}
                />
            </Modal.Header>

            <Modal.Body className="pt-4 pb-4">

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
                                <p className="meta-title mb-0 fw-medium d-flex pt-1">1 Room</p>
                            </Col>
                            <Col xs={5} className="border-end">
                                <p className="meta-title mb-0 fw-medium d-flex align-center justify-around font-18">{formatDatesForModal(bookingDetailData?.check_in_date, bookingDetailData?.check_out_date)} <br /><span className="text-muted small">{bookingDetailData?.total_nights} nights</span></p>
                            </Col>
                            <Col xs={5}>
                                <p className="meta-title mb-0 fw-medium d-flex align-center justify-around font-18">Booking Id <br /><span className="id-no fw-bold">{bookingDetailData?.booking_number}</span></p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>


                {feedbackOption.map((item, i) => (
                    <Card className="mb-3" key={i}>
                        <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="mb-1 font-18 ">
                                    {item.label} <span className="text-danger">*</span>
                                </p>

                                <RatingStars
                                    value={ratings?.[item?.name]}
                                    onChange={(val) =>
                                        setRatings({ ...ratings, [item?.name]: val })
                                    }
                                />
                            </div>
                            <p className="text-muted small mb-0">{item.desc}</p>
                        </Card.Body>
                    </Card>
                ))}


                <Card className="expand-card mb-3">
                    <Card.Body
                        className="expand-headerw  p-3"
                        style={{ cursor: 'pointer' }}

                    >
                        <div className='d-flex justify-content-between align-items-center '>
                            <p className="category-label mb-0 ">Public review</p>
                            <div className="d-flex align-items-center gap-2">

                                <div className="rating-box d-flex align-items-center gap-1">
                                    <Image
                                        src={publicExpanded ? "/images/icons/bottom-arrow.svg" : "/images/icons/bottom-arrow.svg"}
                                        width={18}
                                        height={18}
                                        alt="toggle"
                                        style={{ transition: 'transform 0.2s', transform: publicExpanded ? 'rotate(180deg)' : 'none' }}
                                        onClick={togglePublicReview}
                                    />
                                </div>
                            </div>
                        </div>
                        {publicExpanded && (
                            <div className='flex-column mt-3'>
                                <textarea
                                    className="form-control p-0"
                                    rows={3}
                                    placeholder="Type here..."
                                    onChange={(e) => setReviewText({ ...reviewText, public: e.target.value })}
                                    style={{ resize: "none", border: "0" }}
                                />
                            </div>
                        )}
                    </Card.Body>
                </Card>

                <Card className="expand-card mb-3">
                    <Card.Body
                        className="expand-headerw  p-3"
                        style={{ cursor: 'pointer' }}
                    >
                        <div className='d-flex justify-content-between align-items-center '>
                            <p className="category-label mb-0 ">Private Review</p>
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge-Checked-Out ">Private</span>
                                <div className="rating-box d-flex align-items-center gap-1">
                                    <Image
                                        src={privateExpanded ? "/images/icons/bottom-arrow.svg" : "/images/icons/bottom-arrow.svg"}
                                        width={18}
                                        height={18}
                                        alt="toggle"
                                        style={{ transition: 'transform 0.2s', transform: privateExpanded ? 'rotate(180deg)' : 'none' }}
                                        onClick={togglePrivateReview}
                                    />
                                </div>
                            </div>
                        </div>
                        {privateExpanded && (
                            <div className='flex-column mt-3'>
                                <textarea
                                    className="form-control p-0"
                                    rows={3}
                                    placeholder="Type here..."
                                    onChange={(e) => setReviewText({ ...reviewText, private: e.target.value })}
                                    style={{ resize: "none", border: "0" }}
                                />
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Modal.Body>

            <div className="border-top p-4 d-flex justify-content-between">
                <Button variant="" className="btn-company-add " style={{ padding: "13px 25px" }} onClick={handleCloseGiveReviewModal}>
                    Cancel
                </Button>
                <Button variant="" className="complete-form-btn " style={{ padding: "13px 25px" }} onClick={handleGiveFeedbackSave}>Save Changes</Button>
            </div>
        </Modal>
    )
}
