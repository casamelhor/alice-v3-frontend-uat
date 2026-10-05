"use client"
import React from 'react'
import { useEffect, useState } from "react";
import Header from '../Header/Header'
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Card } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { UserDetailAPI } from '@/services/provider';
import { useRouter } from 'next/navigation';
import { formatMonthYear } from '@/utils/formatTime';
import { CheckInModal } from '../commons/CheckInModal';
import { ModifyDateModal } from '../commons/ModifyDateModal';
import { CancelBookingModal } from '../commons/CancelBookingModal';
import { ModifyCheckout } from '../commons/ModifyCheckout';
import { MarkNoShowModal } from '../commons/MarkNoShowModal';
import { CheckInFormalitiesModal } from '../commons/CheckInFormalitiesModal';
import { CheckoutModal } from '../commons/CheckoutModal';
import { GiveFeedbackModal } from '../commons/GiveFeedbackModal';
import { ViewFeedbackModal } from '../commons/ViewFeedbackModal';
import { Toaster } from 'react-hot-toast';

export default function ViewProfile() {
    const loginData = JSON.parse(getItemLocalStorage("userLogin"));
    const [userDetails, setUserDetails] = useState({});
    const [openPicIndex, setOpenPicIndex] = useState(null);
    const router = useRouter();

    const formatBookingDates = (checkIn, checkOut, dateType = "stayDates") => {
        if (!checkIn) return "";        // For single-date formats
        if (!checkOut && dateType !== "booked") return ""; // Original stay/booked requires both

        const startDate = new Date(checkIn);
        const endDate = checkOut ? new Date(checkOut) : null;

        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleString("en-US", { month: "short" });
        const startYear = startDate.getFullYear();

        const endDay = endDate?.getDate();
        const endMonth = endDate?.toLocaleString("en-US", { month: "short" });
        const endYear = endDate?.getFullYear();

        const startWeekday = startDate.toLocaleString("en-US", { weekday: "short" });
        const endWeekday = endDate?.toLocaleString("en-US", { weekday: "short" });

        // 👉 New Format — Single booked date → 29 Jul, 2025
        if (dateType === "booked") {
            return `${startDay} ${startMonth}, ${startYear}`;
        }

        // STAY DATES FORMAT  → 3 - 7 Aug, 2025
        if (dateType === "stayDates") {
            if (
                startDate.getMonth() === endDate.getMonth() &&
                startDate.getFullYear() === endDate.getFullYear()
            ) {
                return `${startDay} - ${endDay} ${startMonth}, ${startYear}`;
            }
            return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`;
        }

        // BOOKED DATES FORMAT → From Sun, 3 Aug 2025 to Thu, 7 Aug, 2025
        if (dateType === "bookedDates") {
            return `From ${startWeekday}, ${startDay} ${startMonth} ${startYear} to ${endWeekday}, ${endDay} ${endMonth}, ${endYear}`;
        }

        return "";
    };

    const getBookingProgress = (assignment) => {
        if (!assignment?.booking_status) return "";

        const now = new Date();
        const checkIn = assignment?.check_in_date
            ? new Date(assignment.check_in_date)
            : null;
        const checkOut = assignment?.check_out
            ? new Date(assignment.check_out)
            : null;

        const getDiff = (from, to) => {
            const diffMs = Math.abs(to - from);
            const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
            const days = Math.floor(totalHours / 24);
            const hours = totalHours % 24;
            return { days, hours };
        };

        switch (assignment.booking_status) {

            case "Check-in-Upcoming": {
                if (!checkIn) return "";
                const diffMs = checkIn - now;
                if (diffMs <= 0) return "Arrived";

                const { days, hours } = getDiff(now, checkIn);
                return `Arriving in ${days}d ${hours}h`;
            }


            case "Check-in-Pending": {
                if (!checkIn) return "";
                const nextDayCheckIn = new Date(checkIn);
                nextDayCheckIn.setDate(nextDayCheckIn.getDate() + 1);

                const diffMs = nextDayCheckIn - now;
                if (diffMs <= 0) return "No-show";

                const { days, hours } = getDiff(now, nextDayCheckIn);
                return `No-show in ${days}d ${hours}h`;
            }


            case "Checked In":
                return "Active";


            case "Check-out-Pending": {
                if (!checkOut) return "";
                const diffMs = now - checkOut;
                if (diffMs <= 0) return "On time";

                const { days, hours } = getDiff(checkOut, now);
                return `Overdue for ${days}d ${hours}h`;
            }

            case "Checked-Out":
                return "Completed";

            case "Cancelled":
            case "No-Show-Manual":
            case "No-Show-Auto":
                return "Cancelled";

            default:
                return "N/A";
        }
    };

    const getUserDetails = async () => {
        try {
            const response = await UserDetailAPI(loginData?.uid)
            if (response?.data?.success) {
                setUserDetails(response.data.response);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getUserDetails();
    }, [])

    const togglePicOption1 = (e, idx) => {
        e.preventDefault();
        setOpenPicIndex(openPicIndex === idx ? null : idx);
        if (typeof toggleoptio1 === 'function') {
            toggleoptio1();
        }
    }

    //<--------------------------------------------------------new ---------------------------------------------->
    const [bookingDetailData, setBookingDetailData] = useState({});
    const [isStep2, setIsStep2] = useState(false)
    const [inactiveFrom, setInactiveFrom] = useState(null);
    const [inactiveTo, setInactiveTo] = useState(null);
    const [showCheckInModal, setShowCheckInModal] = useState(false);

    const checkInModalClose = () => setShowCheckInModal(false);
    const checkInModal = () => setShowCheckInModal(true);


    const [changepicsModal, changepisetShow] = useState(false);

    const changepicClose = () => changepisetShow(false);
    const changepicModal = () => changepisetShow(true);

    const [showModifyCheckout, setShowModifyCheckout] = useState(false);

    const handleModifyCheckoutClose = () => setShowModifyCheckout(false);
    const handleModifyCheckout = () => setShowModifyCheckout(true);

    const [marknoShowsModal, marknoShowsetShow] = useState(false);

    const marknoShowClose = () => marknoShowsetShow(false);
    const marknoShowModal = () => marknoShowsetShow(true);

    const [checkInFormalities, setCheckInFormalities] = useState(false);

    const CheckInFormalitiesClose = () => setCheckInFormalities(false);
    const CheckInFormalitiesShowModal = () => setCheckInFormalities(true);

    const [cancelbooksModal, cancelbooksetShow] = useState(false);

    const cancelbookClose = () => cancelbooksetShow(false);
    const cancelbookModal = () => cancelbooksetShow(true);

    const [checkoutModal, setCheckoutModal] = useState(false);

    const CheckoutClose = () => setCheckoutModal(false);
    const CheckoutShowModal = () => setCheckoutModal(true);

    const [giveReviewModal, setGiveReviewModal] = useState(false);

    const handleCloseGiveReviewModal = () => setGiveReviewModal(false);

    const handleGiveReviewModal = () => setGiveReviewModal(true);


    const [viewFeedbackModal, setViewFeedbackModal] = useState(false);

    const handleCloseFeedbackModal = () => setViewFeedbackModal(false);

    const handleFeedbackModal = () => setViewFeedbackModal(true);

    const [nationality, setNationality] = useState("Indian");
    const [idType, setIdType] = useState("Passport");
    const [passImage, setPassImage] = useState([]);
    const [visaImage, setVisaImage] = useState([]);
    const [docTypeImage, setDocTypeImage] = useState([]);

    const [photos, setPhotos] = useState([]);
    const [coverIndex, setCoverIndex] = useState(null);
    const [showCaretakerAll, setShowCaretakerAll] = useState(false);
    const [showPropManagerAll, setshowPropManagerAll] = useState(false);
    const [showOpManagerAll, setshowOpManagerAll] = useState(false);

    const MAX_PHOTOS = 1;

    const [files, setFiles] = useState([]);

    const handleDrop1 = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const totalFiles = [...files, ...droppedFiles].slice(0, 5);

        setFiles(totalFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        })));
    };
    const handleFileChange1 = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Only allow max 5
        const newPhotos = selectedFiles
            .slice(0, MAX_PHOTOS - photos.length)
            .map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));

        const updatedPhotos = [...photos, ...newPhotos];
        setPhotos(updatedPhotos);

        // If no cover set, pick first
        if (coverIndex === null && updatedPhotos.length > 0) {
            setCoverIndex(0);
        }
    };

    const removePhoto = (index) => {
        setImages(prev => {
            const updatedImages = prev.filter((_, i) => i !== index);

            // prevent memory leaks
            if (prev[index]?.preview) {
                URL.revokeObjectURL(prev[index].localImageRes || prev[index].apiImageRes);
            }

            return updatedImages;
        });
    };

    const handleDragOver1 = (e) => e.preventDefault();


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

    const [showsProfile, profilesetShow] = useState(false);

    const profileClose = () => profilesetShow(false);
    const showProfile = () => profilesetShow(true);
    //-----------------------------------------------------
    return (
        <>
            <Header />
            <Toaster position="top-right" />
            <div className='page-body  pt-4 pb-4'>
                <section className='people-section'>
                    <Container>
                        <Row className='align-items-center pb-4 pt-4 mb-4'>
                            <Col md={12}>
                                <div className='user-edit text-center pb-4'>
                                    <Image src={userDetails?.profile_image ? `${userDetails?.profile_image}` : "../images/icons/No-Image.svg"} className='img-fluid ms-auto me-auto mb-3' alt='user' width={96} height={96} />
                                    <h2 className='font-32' >{userDetails?.first_name} {userDetails?.last_name}</h2>
                                    {/* <p>Joined May, 2025</p> */}
                                    <p>Joined {formatMonthYear(userDetails?.created_at)}</p>
                                    <p>{userDetails?.trips_made_count} Trips Made |  {userDetails?.trips_created_count} Trips Created  | {userDetails?.email}</p>
                                    <Button variant='' onClick={() => router.push(`/People?guest_uid=${loginData?.uid}&show=true`)} className='edit-btn pt-3 pb-3 ps-4 pe-4 ms-auto me-auto'>Edit Profile</Button>
                                </div>
                                <hr></hr>
                            </Col>
                            <Col md={12}>
                                <h3 className='mt-2 mb-3 font-24' >Trips Created </h3>
                                {userDetails?.trips_created?.map((item, idx) => (
                                    <div className='booking-card-grid mb-4' key={idx}>
                                        <div className='booking-list-details'>
                                            <div className='booking-grid-header mb-2'>
                                                <div className='d-flex justify-between'>
                                                    <h3 className='font-24'>{item?.traveler_name}</h3>
                                                    <div className='bt-abs position-relative'>
                                                        <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                            <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                        </Link>
                                                        <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                            {/* Check-in Formalities */}
                                                            <li className={`${item?.available_actions.includes("check_in_formalities") ? "" : "disabled-list"}`}>
                                                                <Link href="#" className={`${item?.available_actions.includes("check_in_formalities") ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                    CheckInFormalitiesShowModal();
                                                                    setBookingDetailData(item)
                                                                }}>
                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                    Check-in Formalities
                                                                </Link>
                                                            </li>

                                                            <hr style={{ margin: "6px 0" }} />

                                                            {/* Check-in */}
                                                            <li className={`${item?.available_actions.includes("check_in") ? "" : "disabled-list"}`}>
                                                                <Link href="#" className={`${item?.available_actions.includes("check_in") ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                    checkInModal();
                                                                    setBookingDetailData(item)
                                                                }}>
                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                    Check-in
                                                                </Link>
                                                            </li>

                                                            {/* Modify Check-out */}
                                                            <li className={`${item?.available_actions.includes("modify_check_out") ? "" : "disabled-list"}`}>
                                                                <Link href='#' className={`${item?.available_actions.includes("modify_check_out") ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                    handleModifyCheckout();
                                                                    setBookingDetailData(item)
                                                                }}>
                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                    Modify Check-out
                                                                </Link>
                                                            </li>

                                                            {/* Check-out */}
                                                            <li className={`${item?.available_actions.includes("check_out") ? "" : "disabled-list"}`}>
                                                                <Link href="#" className={`${item?.available_actions.includes("check_out") ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                    CheckoutShowModal();
                                                                    setBookingDetailData(item)
                                                                }}>
                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                    Check-out
                                                                </Link>
                                                            </li>

                                                            <hr style={{ margin: "6px 0" }} />

                                                            {/* Modify Dates */}
                                                            <li className={`${item?.available_actions.includes("modify_dates") ? "" : "disabled-list"}`}>
                                                                <Link href="#" className={`${item?.available_actions.includes("modify_dates") ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                    changepicModal();
                                                                    setBookingDetailData(item)
                                                                }}>
                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                    Modify Dates
                                                                </Link>
                                                            </li>

                                                            {/* Mark as No Show */}
                                                            <li className={`${item?.available_actions.includes("mark_no_show") ? "" : "disabled-list"}`}>
                                                                <Link href="#" className={`${item?.available_actions.includes("mark_no_show") ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                    marknoShowModal();
                                                                    setBookingDetailData(item)
                                                                }}>
                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                    Mark as No Show
                                                                </Link>
                                                            </li>

                                                            <li className={`${item?.available_actions.includes("give_review") ? "" : "disabled-list"}`}>
                                                                <Link href="#" className={`${item?.available_actions.includes("give_review") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        handleGiveReviewModal();
                                                                        setBookingDetailData(item)
                                                                    }}>
                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                    Give Feedback
                                                                </Link>
                                                            </li>


                                                            <li className={`${item?.available_actions.includes("view_review") ? "" : "disabled-list"}`}>
                                                                <Link href="#" className={`${item?.available_actions.includes("view_review") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        handleFeedbackModal();
                                                                        setBookingDetailData(item)
                                                                    }}>
                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                    View Feedback
                                                                </Link>
                                                            </li>

                                                            <hr style={{ margin: "6px 0" }} />

                                                            {/* Cancel Booking */}
                                                            <li className={`${item?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                <Link href="#" className={`${item?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                    onClick={() => {
                                                                        cancelbookModal();
                                                                        setBookingDetailData(item);
                                                                    }}>
                                                                    Cancel Booking
                                                                </Link>
                                                            </li>

                                                        </ul>
                                                    </div>
                                                </div>
                                                <p className='d-flex ' style={{ lineHeight: '24px', fontSize: '14px' }} >{item?.max_guests} adult | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>{item?.booking_status}</span>  </p>
                                            </div>
                                            <hr></hr>
                                            <ul className='room-list2 mb-0'>
                                                <li  > <span>{formatBookingDates(item.check_in_date, item.check_out_date, "stayDates")} </span>  {item?.total_nights} nights</li>
                                                <li > <span> {item.property_name},{item.room_name},{item.property_city} </span></li>
                                                <li  > Booked <span>{formatBookingDates(item.check_in_date, item.check_out_date, "bookedDates")} </span> by {item.created_by_name}</li>
                                                <li  > Booking Id <span>{item?.booking_number} </span></li>
                                            </ul>
                                        </div>
                                        <div className='booking-grid-img'>
                                            <span className='progress-br-span' >{getBookingProgress(item)}</span>
                                            <Image src={item?.property_image ? `${item.property_image}` : '/images/icons/property-br.jpg'} width={400} height={250} alt='Booking Image' className='img-fluid' />
                                        </div>
                                    </div>
                                ))}

                                {/* <div className='booking-card-grid mb-4'>
                                    <div className='booking-list-details'>
                                        <div className='booking-grid-header mb-2'>
                                            <div className='d-flex justify-between'>
                                                <h3 className='font-24'>Shuban Leena</h3>
                                                <Image
                                                    src="./images/icons/more-dots-3.svg"
                                                    className="img-fluid"
                                                    alt="dot 3"
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                            <p className='d-flex ' style={{ lineHeight: '24px', fontSize: '14px' }} >1 adult | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>Check-In-Upcoming</span>  </p>
                                        </div>
                                        <hr></hr>
                                        <ul className='room-list2 mb-0'>
                                            <li  > <span>3-7 Aug, 2025 </span>  4 nights</li>
                                            <li > <span> Casa Melhor Yayati Room 1, Casa Melhor Yayati Tulip 17th Floor </span></li>
                                            <li  > Booked <span>29 Jul, 2025 </span> by CasaMelhor Admin</li>
                                            <li  > Booking Id <span>14269 </span></li>
                                        </ul>
                                    </div>
                                    <div className='booking-grid-img'>
                                        <span className='progress-br-span' >Cancelled</span>
                                        <Image src='/images/icons/property-br.jpg' width={400} height={250} alt='Booking Image' className='img-fluid' />
                                    </div>
                                </div> */}
                                {/* <div className='booking-card-grid mb-4'>
                                    <div className='booking-list-details'>
                                        <div className='booking-grid-header mb-2'>
                                            <div className='d-flex justify-between'>
                                                <h3 className='font-24'>Shuban Leena</h3>
                                                <Image
                                                    src="./images/icons/more-dots-3.svg"
                                                    className="img-fluid"
                                                    alt="dot 3"
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                            <p className='d-flex ' style={{ lineHeight: '24px', fontSize: '14px' }} >1 adult | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>Check-In-Upcoming</span>  </p>
                                        </div>
                                        <hr></hr>
                                        <ul className='room-list2 mb-0'>
                                            <li  > <span>3-7 Aug, 2025 </span>  4 nights</li>
                                            <li > <span> Casa Melhor Yayati Room 1, Casa Melhor Yayati Tulip 17th Floor </span></li>
                                            <li  > Booked <span>29 Jul, 2025 </span> by CasaMelhor Admin</li>
                                            <li  > Booking Id <span>14269 </span></li>
                                        </ul>
                                    </div>
                                    <div className='booking-grid-img'>
                                        <span className='progress-br-span' >Completed</span>
                                        <Image src='/images/icons/property-br.jpg' width={400} height={250} alt='Booking Image' className='img-fluid' />
                                    </div>
                                </div> */}
                                <hr></hr>
                            </Col>
                            <Col md={12}>
                                <h3 className='mt-2 mb-3 font-24' >Trips Made </h3>
                                <div className='text-center'>
                                    <p className='fs-20' >No trips yet</p>
                                    <p className='fs-14 text-mute mb-0' >You have not attended any trips yet.</p>
                                    <p className='fs-14 text-mute mb-0'>Once you do, they’ll show up here.</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>

            {showCheckInModal && (<CheckInModal
                showCheckInModal={showCheckInModal}
                checkInModalClose={checkInModalClose}
                selectedBookingData={bookingDetailData}
                nationality={nationality}
                setNationality={setNationality}
                idType={idType}
                docTypeImage={docTypeImage}
                visaImage={visaImage}
                passImage={passImage}
                setPassImage={setPassImage}
                setVisaImage={setVisaImage}
                setDocTypeImage={setDocTypeImage}
                handleDrop1={handleDrop1}
                handleDragOver1={handleDragOver1}
                handleFileChange1={handleFileChange1}
                removePhoto={removePhoto}                
            />)}

            <ModifyDateModal
                changepicsModal={changepicsModal}
                changepicClose={changepicClose}
                isStep2={isStep2}
                setIsStep2={setIsStep2}
                inactiveFrom={inactiveFrom}
                setInactiveFrom={setInactiveFrom}
                inactiveTo={inactiveTo}
                setInactiveTo={setInactiveTo}
                fetchDataFunction={getUserDetails}
                bookingDetailData={bookingDetailData}
            />

            <CancelBookingModal
                cancelbooksModal={cancelbooksModal}
                cancelbookClose={cancelbookClose}
                // changepicClose={changepicClose}
                fetchDataFunction={getUserDetails}
                bookingDetailData={bookingDetailData}
            />

            <ModifyCheckout
                showModifyCheckout={showModifyCheckout}
                handleModifyCheckoutClose={handleModifyCheckoutClose}
                isStep2={isStep2}
                setIsStep2={setIsStep2}
                inactiveFrom={inactiveFrom}
                setInactiveFrom={setInactiveFrom}
                inactiveTo={inactiveTo}
                setInactiveTo={setInactiveTo}
                fetchDataFunction={getUserDetails}
                bookingDetailData={bookingDetailData}
            />

            <MarkNoShowModal
                marknoShowsModal={marknoShowsModal}
                marknoShowClose={marknoShowClose}
                fetchDataFunction={getUserDetails}
                bookingDetailData={bookingDetailData}
            />

            {checkInFormalities && <CheckInFormalitiesModal
                checkInFormalities={checkInFormalities}
                CheckInFormalitiesClose={CheckInFormalitiesClose}
                selectedBookingData={bookingDetailData}
                nationality={nationality}
                setNationality={setNationality}
                idType={idType}
                docTypeImage={docTypeImage}
                visaImage={visaImage}
                passImage={passImage}
                setPassImage={setPassImage}
                setVisaImage={setVisaImage}
                setDocTypeImage={setDocTypeImage}
                handleDrop1={handleDrop1}
                handleDragOver1={handleDragOver1}
                handleFileChange1={handleFileChange1}
                removePhoto={removePhoto}
                alert_danger={alert_danger}
                alert_success={alert_success}
            />}

            <CheckoutModal
                checkoutModal={checkoutModal}
                CheckoutClose={CheckoutClose}
                fetchDataFunction={getUserDetails}
                bookingDetailData={bookingDetailData}
            />



            <GiveFeedbackModal
                giveReviewModal={giveReviewModal}
                handleCloseGiveReviewModal={handleCloseGiveReviewModal}
                fetchDataFunction={getUserDetails}
                bookingDetailData={bookingDetailData}
            />

            <ViewFeedbackModal
                viewFeedbackModal={viewFeedbackModal}
                handleCloseFeedbackModal={handleCloseFeedbackModal}
                fetchDataFunction={getUserDetails}
                bookingDetailData={bookingDetailData}
            />
        </>
    )
}
