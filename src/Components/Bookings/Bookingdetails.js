"use client"
import React from 'react'
import Header from '../Header/Header'
import SourceBadge from '../Integrations/SourceBadge'; // integration: alice_v3_claude — w7
import AllocationSummary from '../Integrations/AllocationSummary'; // integration: alice_v3_claude — w7
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form, Accordion, Card } from 'react-bootstrap';
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { BookingDetailAPI } from '@/services/provider';
import { calculateDaysDifference, calculateNights, checkDateEqualOrNot, convertDatewith, convertDatewithtime, formatDateRange, formatDaysDateMonthYear, getPreviousDate, getTimeinDatestring } from '@/utils/formatTime';
import { ModifyDateModal } from '../commons/ModifyDateModal';
import { ModifyCheckout } from '../commons/ModifyCheckout';
import { MarkNoShowModal } from '../commons/MarkNoShowModal';
import { CheckInFormalitiesModal } from '../commons/CheckInFormalitiesModal';
import { CheckInModal } from '../commons/CheckInModal';
import { CheckoutModal } from '../commons/CheckoutModal';
import { CancelBookingModal } from '../commons/CancelBookingModal';
import { GiveFeedbackModal } from '../commons/GiveFeedbackModal';
import { ViewFeedbackModal } from '../commons/ViewFeedbackModal';
import { ToastContainer } from 'react-toastify';
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { getItemLocalStorage } from '@/utils/browserStorage';
import { checkPermission } from '@/utils/helper';

const EVENT_CONFIG = {
    'Creation': {
        icon: '/images/icons/hail_24dp.svg',
        colorClass: 'event-success'
    },
    'Status-Change': {
        icon: '/images/icons/sync.svg',
        colorClass: 'event-info'
    },
    'Formalities Submitted': {
        icon: '/images/icons/edit.svg',
        colorClass: 'event-warning'
    },
    'Cancellation': {
        icon: '/images/icons/cancel.svg',
        colorClass: 'event-danger'
    },
    'Notification': {
        icon: '/images/icons/notification.svg',
        colorClass: 'event-info'
    },

    'Check-in-Upcoming': {
        icon: '/images/checkinupcoming.svg',
        colorClass: 'event-success'
    },
    'Check-in-Pending': {
        icon: '/images/icons/checkin-pending.svg',
        colorClass: 'event-success'
    },
    'Checked In': {
        icon: '/images/icons/key_vertical24.svg',
        colorClass: 'event-success'
    },
    'Checked Out': {
        icon: '/images/icons/emoji_people24.svg',
        colorClass: 'event-primary'
    },
    'Stay dates': {
        icon: '/images/icons/home_pin_24dp.svg',
        colorClass: 'event-success'
    },
    'No-Show': {
        icon: '/images/icons/error.svg',
        colorClass: 'event-danger'
    },
    'Payment': {
        icon: '/images/icons/payment.svg',
        colorClass: 'event-success'
    },
    'Refund': {
        icon: '/images/icons/refund.svg',
        colorClass: 'event-warning'
    },
    'Document-Upload': {
        icon: '/images/icons/info-i.svg',
        colorClass: 'event-info'
    },
    'Stay-feedback': {
        icon: '/images/icons/home_pin.svg',
        colorClass: 'event-success'
    }
};

const getEventConfig = (eventType) => {
    return (
        EVENT_CONFIG[eventType] || {
            icon: '/images/icons/activity.svg',
            colorClass: 'event-default'
        }
    );
};

// const buildTimeline = (history = []) => {
//     return [...history]
//         .sort((a, b) => new Date(a.performed_at) - new Date(b.performed_at))
//         .map((event, index) => {
//             const config = getEventConfig(event.new_value.booking_status);

//             return {
//                 key: `event-${index}`,
//                 title: event.new_value.booking_status,
//                 type: event.event_type,
//                 date: event.performed_at,
//                 icon: config.icon,
//                 colorClass: config.colorClass,
//                 meta: {
//                     by: event.performed_by,
//                     old: event.old_value,
//                     new: event.new_value
//                 }
//             };
//         });
// };
// const buildTimeline = (history = []) => {
//     const timeline = [...history]
//         .sort((a, b) => new Date(a.performed_at) - new Date(b.performed_at))
//         .map((event, index) => {
//             const config = getEventConfig(event.new_value.booking_status);

//             return {
//                 key: `event-${index}`,
//                 title: event.new_value.booking_status,
//                 type: event.event_type,
//                 date: event.performed_at,
//                 icon: config.icon,
//                 colorClass: config.colorClass,
//                 meta: {
//                     by: event.performed_by,
//                     old: event.old_value,
//                     new: event.new_value
//                 }
//             };
//         });

//     // Insert "Stay Dated" after every "Checked In" entry
//     const result = [];
//     timeline.forEach((item, index) => {
//         result.push(item);

//         if (item.title === "Checked In") {
//             const stayDatedConfig = getEventConfig("Stay dates");

//             result.push({
//                 key: `event-stay-dated-${index}`,
//                 title: "Stay dates",
//                 type: item.type,
//                 date: item.date,
//                 icon: stayDatedConfig.icon,
//                 colorClass: stayDatedConfig.colorClass,
//                 meta: {
//                     by: item.meta.by,
//                     old: item.meta.old,
//                     new: item.meta.new
//                 }
//             });
//         }
//     });

//     return result;
// };
function buildTimeline(booking) {
    if (!booking || !booking.booking_status) return [];

    const {
        booking_status,
        history = [],
        check_in_date,
        check_out_date,
        actual_check_in_timestamp,
        created_at,
    } = booking;

    const nodes = [];

    // ── helpers ────────────────────────────────────────────────────────────────
    const findByStatus = (statusValue) =>
        history.find(h => h.new_value?.booking_status === statusValue);

    const creationEvent = history.find(h => h.event_type === 'Creation');

    // Detect key history events
    const checkInUpcomingEvent = findByStatus('Check-in-Upcoming');
    const checkInPendingEvent = findByStatus('Check-in-Pending');
    const checkedInEvent = findByStatus('Checked In');
    const checkoutModifiedEvent = history.find(
        h => h.event_type === 'Modification' &&
            h.new_value?.booking_status === 'Check-out-date-Modified'
    );
    const checkInModifiedEvent = history.find(
        h => h.event_type === 'Modification' &&
            h.new_value?.check_in_date &&
            h.new_value?.booking_status !== 'Check-out-date-Modified'
    );
    const noShowEvent =
        // findByStatus('No Show and Canceled (A)') ||
        // findByStatus('No Show and Canceled');
        findByStatus('No-Show-Auto') ||
        findByStatus('No-Show');

    const isTerminal = [
        // 'No Show and Canceled',
        // 'No Show and Canceled (A)',
        'No-Show-Auto',
        'No-Show',
        'Cancelled',
    ].includes(booking_status);

    const isCheckedIn =
        booking_status === 'Checked In' || !!checkedInEvent;

    const isCheckedOut = booking_status === 'Checked-Out';

    // ── helper: derive node status ────────────────────────────────────────────
    // 'completed'  → solid line, teal dot  (past, done)
    // 'current'    → solid line, amber dot (active right now)
    // 'future'     → dashed line, grey dot (not yet reached)
    // 'terminal'   → solid line, coral dot (no-show / cancelled)
    // 'cancelled'  → dashed line, grey dot (greyed-out post-noshow checkout)

    // ── Node 0: Booking confirmed ─────────────────────────────────────────────
    nodes.push({
        id: 'booking_confirmed',
        label: 'Booking confirmed',
        sublabel: null,
        date: created_at || creationEvent?.performed_at,
        prefix: null,
        status: 'completed',           // always completed — it exists
        icon: '/images/icons/hail_24dp.svg',
    });

    // ── Node 1: Check-In-Upcoming ─────────────────────────────────────────────
    // Completed once ANY later status exists in history or current status is past it.
    const upcomingIsCurrent = booking_status === 'Check-in-Upcoming';
    const upcomingIsCompleted =
        !upcomingIsCurrent &&
        (!!checkInUpcomingEvent ||
            !!checkInPendingEvent ||
            !!checkedInEvent ||
            !!noShowEvent ||
            isCheckedOut);

    nodes.push({
        id: 'check_in_upcoming',
        label: 'Check-In-Upcoming',
        sublabel: null,
        date: checkInUpcomingEvent?.performed_at || check_in_date,
        prefix: upcomingIsCurrent ? 'by' : null,
        status: upcomingIsCurrent
            ? 'current'
            : upcomingIsCompleted
                ? 'completed'
                : 'future',
        icon: '/images/checkinupcoming.svg',
    });

    // ── Node 1b: Check-in modified  ───────────────────────────────────────────
    // Show only when a check-in date modification happened AND Check-In-Pending
    // never appeared (booking went Upcoming → [modified] → Checked-In directly).
    if (checkInModifiedEvent && !checkInPendingEvent && (isCheckedIn || isCheckedOut)) {
        nodes.push({
            id: 'check_in_modified',
            label: 'Check-in modified',
            sublabel: null,
            date: checkInModifiedEvent.performed_at,
            prefix: null,
            status: 'completed',
            icon: '/images/icons/sync.svg',
        });
    }

    // ── Node 2: Check-In-Pending ──────────────────────────────────────────────
    if (checkInPendingEvent || booking_status === 'Check-in-Pending') {
        const pendingIsCurrent = booking_status === 'Check-in-Pending';
        const pendingIsCompleted =
            !pendingIsCurrent && (!!checkedInEvent || !!noShowEvent || isCheckedOut);

        nodes.push({
            id: 'check_in_pending',
            label: 'Check-in Pending',
            sublabel: null,
            date: checkInPendingEvent?.performed_at || check_in_date,
            prefix: null,
            status: pendingIsCurrent
                ? 'current'
                : pendingIsCompleted
                    ? 'completed'
                    : 'future',
            icon: '/images/icons/checkin-pending.svg',
            urgentBadge: pendingIsCurrent,
        });
    }

    // ── Node 3: Checked-In OR future Check-in OR No-Show (before check-in) ───
    if (noShowEvent && !checkedInEvent) {
        // No-show happened WITHOUT ever checking in
        // Then no-show node
        nodes.push({
            id: 'no_show',
            label: noShowEvent.new_value?.booking_status == "No-Show-Auto" ? "No Show and Canceled (A)" : "No Show and Canceled",
            sublabel: null,
            date: noShowEvent.performed_at,
            prefix: null,
            status: 'terminal',
            icon: '/images/icons/account_circle.svg',
        });
        // Show future/greyed check-in node first
        nodes.push({
            id: 'check_in_future',
            label: 'Check-in',
            sublabel: null,
            date: check_in_date,
            prefix: 'by',
            status: 'cancelled',
            icon: '/images/icons/key_vertical24.svg',
        });



        // Checkout shown greyed/dashed
        nodes.push({
            id: 'check_out_greyed',
            label: 'Check-out',
            sublabel: null,
            date: check_out_date,
            prefix: 'by',
            status: 'cancelled',
            icon: '/images/icons/emoji_people24.svg',
        });

        return nodes;

    } else if (noShowEvent && checkedInEvent) {
        // No-show happened AFTER checking in
        nodes.push({
            id: 'checked_in',
            label: 'Checked-In',
            sublabel: null,
            date: actual_check_in_timestamp || checkedInEvent?.performed_at,
            prefix: null,
            status: 'completed',
            icon: '/images/icons/key_vertical24.svg',
        });

        nodes.push({
            id: 'no_show',
            label: noShowEvent.new_value?.booking_status || 'No-Show',
            sublabel: null,
            date: noShowEvent.performed_at,
            prefix: null,
            status: 'terminal',
            icon: '/images/icons/error.svg',
        });

        nodes.push({
            id: 'check_out_greyed',
            label: 'Check-out',
            sublabel: null,
            date: check_out_date,
            prefix: 'by',
            status: 'cancelled',
            icon: '/images/icons/emoji_people24.svg',
        });

        return nodes;

    } else if (isCheckedIn || isCheckedOut) {
        // Normal checked-in path
        nodes.push({
            id: 'checked_in',
            label: 'Checked-In',
            sublabel: null,
            date: actual_check_in_timestamp || checkedInEvent?.performed_at,
            prefix: null,
            status: isCheckedOut ? 'completed' : 'current',
            icon: '/images/icons/key_vertical24.svg',
        });

    } else if (!isTerminal) {
        // Future check-in node
        nodes.push({
            id: 'check_in_future',
            label: 'Check-in',
            sublabel: null,
            date: check_in_date,
            prefix: 'by',
            status: 'future',
            icon: '/images/icons/key_vertical24.svg',
        });
    }

    // ── Node 4b: Checkout modified OR Stay dates ──────────────────────────────
    if (checkoutModifiedEvent) {
        nodes.push({
            id: 'checkout_modified',
            label: 'Checkout modified',
            sublabel: null,
            date: checkoutModifiedEvent.performed_at,
            prefix: null,
            status: isCheckedIn || isCheckedOut ? 'completed' : 'future',
            icon: '/images/icons/emoji_people24.svg',
        });
    } else {
        // "Stay dates" — synthetic range node, always present on non-terminal paths
        nodes.push({
            id: 'stay_dates',
            label: 'Stay dates',
            sublabel: null,
            date: null,
            prefix: null,
            // Solid once checked in, dashed before
            status: isCheckedIn || isCheckedOut ? 'completed' : 'future',
            icon: '/images/icons/home_pin_24dp.svg',
        });
    }

    // ── Node 5: Check-out ─────────────────────────────────────────────────────
    const checkoutDate = checkoutModifiedEvent
        ? checkoutModifiedEvent.new_value?.check_out_date || check_out_date
        : check_out_date;

    // nodes.push({
    //     id: 'check_out',
    //     label: isCheckedIn && checkoutModifiedEvent
    //         ? `Checkout today by ${getTimeinDatestring(checkoutDate)}`
    //         : 'Check-out',
    //     sublabel: null,
    //     date: checkoutDate,
    //     prefix: !checkoutModifiedEvent ? 'by' : null,
    //     status: isCheckedOut ? 'completed' : 'future',
    //     icon: '/images/icons/emoji_people24.svg',
    // });
    nodes.push({
        id: 'check_out',
        label: isCheckedOut
            ? 'Checked-Out'
            : isCheckedIn && checkoutModifiedEvent
                ? `Checkout today by ${getTimeinDatestring(checkoutDate)}`
                : 'Check-out',
        sublabel: null,
        date: checkoutDate,
        prefix: !checkoutModifiedEvent && !isCheckedOut ? 'by' : null,
        status: isCheckedOut ? 'completed' : 'future',
        icon: '/images/icons/emoji_people24.svg',
    });

    // ── Node 6: Stay feedback ─────────────────────────────────────────────────
    nodes.push({
        id: 'stay_feedback',
        label: 'Stay feedback',
        sublabel: null,
        date: checkoutDate,
        prefix: 'Post',
        status: isCheckedOut ? 'current' : 'future',
        icon: '/images/icons/home_pin.svg',
    });

    return nodes;
}

function getStatusHeaderDate(booking) {
    if (!booking) return null;

    const {
        booking_status,
        history = [],
        check_in_date,
        check_out_date,
        actual_check_in_timestamp,
        actual_check_out_timestamp,
    } = booking;

    const findByStatus = (statusValue) =>
        history.find(h => h.new_value?.booking_status === statusValue);

    switch (booking_status) {
        case 'Cancelled':
            return findByStatus('Cancelled')?.performed_at || check_in_date;

        case 'No-Show':
        case 'No-Show-Manual':
        case 'No-Show-Auto':
            return (
                findByStatus('No-Show-Auto')?.performed_at ||
                findByStatus('No-Show')?.performed_at ||
                findByStatus('No-Show-Manual')?.performed_at ||
                check_in_date
            );

        case 'Checked In':
            return (
                actual_check_in_timestamp ||
                findByStatus('Checked In')?.performed_at ||
                check_in_date
            );

        case 'Checked-Out':
            return (
                actual_check_out_timestamp ||
                findByStatus('Checked-Out')?.performed_at ||
                check_out_date
            );

        case 'Check-in-Pending':
            return findByStatus('Check-in-Pending')?.performed_at || check_in_date;

        case 'Check-in-Upcoming':
        default:
            return check_in_date;
    }
}

const getIconByIndex = (index) => {
    const icons = [
        '/images/icons/hail_24dp.svg',
        '/images/icons/info-i.svg',
        '/images/icons/key_vertical24.svg',
        '/images/icons/emoji_people24.svg'
    ];
    return icons[index % icons.length];
};

function BookingConfirmedTooltip({ bookingNumber, bookedBy, bookedAt }) {
    const [show, setShow] = useState(false);

    return (
        <div
            style={{ position: 'relative', display: 'inline-block', marginTop: '15px', marginBottom: '15px' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {/* Circle i icon */}
            <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ cursor: 'pointer', display: 'block' }}
            >
                <circle cx="11" cy="11" r="10" stroke="#73615F" strokeWidth="1.5" />
                <text
                    x="11"
                    y="16"
                    textAnchor="middle"
                    fill="#73615F"
                    fontSize="13"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fontWeight="600"
                >
                    i
                </text>
            </svg>

            {/* Tooltip box */}
            {show && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 8px)',
                        left: '-1',
                        transform: 'translateX(1%)',
                        background: '#fff',
                        color: '#000',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        zIndex: 9999,
                        minWidth: '200px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        pointerEvents: 'none',
                    }}
                >
                    {/* Arrow pointing down */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '4%',
                        transform: 'translateX(-4%) rotate(45deg)',
                        width: '10px',
                        height: '10px',
                        background: '#fff',
                    }} />

                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>
                        Booking confirmed
                    </p>
                    {bookingNumber && (
                        <p style={{ margin: 0, fontSize: '14px', opacity: 1 }}>
                            Booking ID: {bookingNumber}
                        </p>
                    )}
                    {bookedBy && (
                        <p style={{ margin: 0, fontSize: '14px', opacity: 1 }}>
                            Booked by: {bookedBy}
                        </p>
                    )}
                    {bookedAt && (
                        <p style={{ margin: 0, fontSize: '14px', opacity: 1 }}>
                            Date: {bookedAt}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}


export default function Bookingdetails() {

    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionBookingMain = checkPermission(permissionArray, "booking");
    const permissionBookingReview = checkPermission(permissionArray, "booking_review");
    const permissionBookingCheckin = checkPermission(permissionArray, "booking_checkin");
    const permissionBookingHistory = checkPermission(permissionArray, "booking_history");

    const canAdd = permissionBookingMain === true || permissionBookingMain?.can_add;
    const canList = permissionBookingMain === true || permissionBookingMain?.can_list;
    const canRetrieve = permissionBookingMain === true || permissionBookingMain?.can_retrieve;
    const canUpdate = permissionBookingMain === true || permissionBookingMain?.can_update;
    const canDelete = permissionBookingMain === true || permissionBookingMain?.can_delete;

    //booking check-In 
    const canUpdateBooking = permissionBookingCheckin === true || permissionBookingCheckin?.can_update;
    //booking review
    const canAddGive = permissionBookingReview === true || permissionBookingReview?.can_add
    const canRetrieveReview = permissionBookingReview === true || permissionBookingReview?.can_retrieve;
    //booking history
    const canRetrieveHistory = permissionBookingHistory === true || permissionBookingHistory?.can_retrieve;
    const canListHistory = permissionBookingHistory === true || permissionBookingHistory?.can_list;

    const param = useParams();
    const id = param.id;
    const router = useRouter();
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



    const handleCopy = () => {
        navigator.clipboard.writeText(bookingDetailData?.booking_number);
        toast.success("Booking ID copied");
    };

    const makeCoverPhoto = (index) => {
        setCoverIndex(index);
    };


    const [files, setFiles] = useState([]);

    const handleDrop1 = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const totalFiles = [...files, ...droppedFiles].slice(0, 5);

        setFiles(totalFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        })));
    };

    // const handleFileChange1 = (e) => {
    //     const selectedFiles = Array.from(e.target.files);


    //     const newPhotos = selectedFiles
    //         .slice(0, MAX_PHOTOS - photos.length)
    //         .map((file) => ({
    //             file,
    //             preview: URL.createObjectURL(file),
    //         }));

    //     const updatedPhotos = [...photos, ...newPhotos];
    //     setPhotos(updatedPhotos);


    //     if (coverIndex === null && updatedPhotos.length > 0) {
    //         setCoverIndex(0);
    //     }
    // };


    const handleFileChange1 = (e, state, setState, side = null) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileObj = {
            file,
            preview: URL.createObjectURL(file),
        };

        if (side === "front") {
            setState(prev => [fileObj, prev?.[1] || null]);
        }
        else if (side === "back") {
            setState(prev => [prev?.[0] || null, fileObj]);
        }
        else {
            setState([fileObj]);
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
    // <--------------------------------------------xxxxxxxxxxxxxxxxxxxxx----------------------------------->
    const [bookingDetailData, setBookingDetailData] = useState({});
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, status: '' });
    const getBookingDetails = async () => {
        try {
            const response = await BookingDetailAPI(id);
            if (response?.success) {
                setBookingDetailData(response?.response?.booking)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getBookingDetails();
    }, [])

    useEffect(() => {
        const calculateTimeLeft = () => {
            const checkInDate = new Date(bookingDetailData.check_in_date);
            const now = new Date();
            const difference = checkInDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );

                setTimeLeft({ days: days, hours: hours });
            } else {
                setTimeLeft({ days: 0, hours: 0, status: bookingDetailData?.booking_status });
            }
        };

        // Calculate immediately
        calculateTimeLeft();

        // Update every hour (or minute for more accuracy)
        const interval = setInterval(calculateTimeLeft, 3600000);

        return () => clearInterval(interval);
    }, [bookingDetailData.check_in_date]);

    const getUpcomingDate = (date) => {
        const preDate = getPreviousDate(date);
        return convertDatewith(preDate)
    }
    const trackUpcoming = (date) => {
        const preDate = getPreviousDate(date);
        return checkDateEqualOrNot(preDate)
    }

    console.log(bookingDetailData, timeLeft)


    // 
    const [filtermShow, filtersetShow] = useState(false);

    const filterClose = () => filtersetShow(false);
    const filterShow = () => filtersetShow(true);

    // 

    const [filtermShow1, filtersetShow1] = useState(false);

    const filterClose1 = () => filtersetShow1(false);
    const filterShow1 = () => filtersetShow1(true);


    console.log(bookingDetailData, timeLeft)
    // 

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

    const [ratings, setRatings] = useState({
        cleanliness: 0,
        food: 0,
        staff: 0,
        location: 0,
        comfort: 0,
    });

    // 
    // Add state for expand/collapse of Private Review
    const [privateExpanded, setPrivateExpanded] = useState(false);

    const togglePrivateReview = () => setPrivateExpanded((prev) => !prev);


    const [publicExpanded, setPublicExpanded] = useState(false);

    const togglePublicReview = () => setPublicExpanded((prev) => !prev);

    const timelineData = buildTimeline(bookingDetailData);

    // caretacker 
    const caretakers = bookingDetailData?.property?.caretakers || [];
    const visibleCaretakers = showCaretakerAll ? caretakers : caretakers.slice(0, 1);
    // Property Manage
    const propManagers = bookingDetailData?.property?.property_managers || [];
    const visiblePropManager = showPropManagerAll ? propManagers : propManagers.slice(0, 1);
    // Operations Manager
    const opManagers = bookingDetailData?.property?.operations_manager
        ? [bookingDetailData.property.operations_manager]
        : [];

    const visibleOpManager = showOpManagerAll ? opManagers : opManagers.slice(0, 1);

    //   const opManagers = bookingDetailData?.property?.operations_manager || [];
    //     const visibleOpManager = showOpManagerAll ? opManagers : opManagers.slice(0, 1);


    // showOpManagerAll, setshowOpManagerAll

    console.log(timelineData)
    return (
        <>
            <Header />
            {/* <ToastContainer /> */}
            <Toaster position="top-right" />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>
                                {/* <li><a href=''>Home</a></li> */}
                                <li><Link href='./Bookings'>Bookings</Link></li>
                                <li>Booking for {bookingDetailData?.traveler?.name} - Booking id: {bookingDetailData?.booking_number} <SourceBadge source={bookingDetailData?.booking_source} reference={bookingDetailData?.source_reference} showAlice />{/* integration: alice_v3_claude — w7 */}</li>
                            </ul>
                            <AllocationSummary allocation={bookingDetailData?.allocation} />{/* integration: alice_v3_claude — w7 */}
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='booking-details-page'>

                <div className='booking-details-box '>
                    <h2 className='page-title2 mb-4'>Booking for {bookingDetailData?.traveler?.name}</h2>
                    <ul className='booki-lits-li mb-2'>
                        {/* <li>   <p className='rounded mb-0' style={{ background: '#fff', fontSize: '14px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: 'Fitcontent', padding: '4px 6px' }} >Arriving in <span style={{ color: '#BF9039' }} >{timeLeft.days}D {timeLeft.hours}H</span> </p></li> */}

                        <li>
                            <p
                                className='rounded mb-0'
                                style={{
                                    background: '#fff',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    lineHeight: '20px',
                                    color: '#463527',
                                    width: 'Fitcontent',
                                    padding: '4px 6px'
                                }}
                            >
                                {bookingDetailData?.booking_status === "No-Show-Manual" ||
                                    bookingDetailData?.booking_status === "No-Show-Auto" ? (
                                    <span style={{ color: 'red' }}>No Show</span>
                                ) : bookingDetailData?.booking_status === "Cancelled" ? (
                                    <span style={{ color: 'red' }}>Cancelled</span>
                                ) : timeLeft.status ? timeLeft.status : (
                                    <>
                                        Arriving in{" "}
                                        <span style={{ color: '#BF9039' }}>
                                            {timeLeft.days}D {timeLeft.hours}H
                                        </span>
                                    </>
                                )}
                            </p>
                        </li>

                        <li> <Image src='/images/icons/calendor.svg' className='img-fluid' alt='calendor' width={24} height={24} /> {formatDateRange(bookingDetailData.check_in_date, bookingDetailData.check_out_date)},  {bookingDetailData?.total_nights} nights</li>
                        <li> <Image src='/images/icons/group.svg' className='img-fluid' alt='calendor' width={24} height={24} /> {bookingDetailData?.adults_count ?? 0}  Guest</li>

                    </ul>

                    <hr style={{ margin: '30px 0 ' }} ></hr>

                    <div className='d-flex justify-center gap-3'>
                        {canUpdate && bookingDetailData?.available_actions?.includes('modify_dates') && (
                            <Button variant='' className='btn-modify me-3' onClick={changepicModal} >
                                <Image src='/images/icons/edit.svg' className='img-fluid' alt='edit' width={24} height={24} />      Modify Dates
                            </Button>
                        )}

                        {/* <Button variant='' className='btn-move-room'  >
                            <Image src='./images/icons/switch_access.svg' className='img-fluid' alt='edit' width={24} height={24} />      Move Room

                            <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='edit' width={14} height={14} />
                        </Button> */}
                        {canUpdate && bookingDetailData?.available_actions?.includes('modify_check_out_date') && (
                            <Button variant='' className='btn-modify '
                                onClick={handleModifyCheckout}
                            >
                                <Image src='/images/icons/edit.svg' className='img-fluid' alt='edit' width={24} height={24} />      Modify Checkout
                            </Button>
                        )}

                        {/* <Button variant='' className='btn-move-room'  >
                            <Image src='./images/icons/switch_access.svg' className='img-fluid' alt='edit' width={24} height={24} />      Move Room

                            <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='edit' width={14} height={14} />
                        </Button> */}
                        {canUpdate && bookingDetailData?.available_actions?.includes('mark_no_show') && (
                            <Button variant=''
                                onClick={marknoShowModal}
                                className='btn-move-room'  >
                                <Image src='/images/icons/account_circle.svg' className='img-fluid' alt='edit' width={24} height={24} />      Mark as No Show


                            </Button>
                        )}


                        {canUpdateBooking && bookingDetailData?.available_actions?.includes('check_in_formalities') && (
                            <Button variant=''
                                onClick={CheckInFormalitiesShowModal}
                                className='btn-move-room'  >
                                <Image src='/images/icons/key_vertical.svg' className='img-fluid' alt='edit' width={24} height={24} />      Check in Formalties


                            </Button>
                        )}


                        {canUpdateBooking && bookingDetailData?.available_actions?.includes('check_in') && (
                            <Button variant=''
                                onClick={checkInModal}
                                className='btn-move-room ' style={{ background: '#2C734A', color: '#fff', }}  >
                                <Image src='/images/icons/key_vertical.svg' className='img-fluid' alt='edit' width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />      Check-in


                            </Button>
                        )}

                        {/* <Button variant='' onClick={updateDateModal1} className='btn-move-room ' style={{ background: '#463527', color: '#fff', }}  >
                            <Image src='./images/icons/emoji_people.svg' className='img-fluid' alt='edit' width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />      Checkout


                        </Button> */}
                        {canUpdate && bookingDetailData?.available_actions?.includes('check_out') && (
                            <Button variant=''
                                onClick={CheckoutShowModal}
                                className='btn-move-room ' style={{ background: '#463527', color: '#fff', }}  >
                                <Image src='/images/icons/emoji_people.svg' className='img-fluid' alt='edit' width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />      Checkout
                            </Button>
                        )}
                        {canDelete && bookingDetailData?.available_actions?.includes('cancel_booking') && (
                            <Button variant=''
                                onClick={cancelbookModal}
                                className='btn-move-room'  >
                                <Image src='/images/icons/emoji_people.svg' className='img-fluid' alt='edit' width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />      Cancel Booking
                            </Button>
                        )}


                        {canAddGive && bookingDetailData?.available_actions?.includes('give_review') && (
                            <Button variant=''
                                onClick={handleGiveReviewModal}
                                className='btn-move-room '   >
                                <Image src='/images/icons/feedstar.svg' className='img-fluid' alt='edit' width={24} height={24} />      Give Feedback
                            </Button>
                        )}

                        {canRetrieveReview && bookingDetailData?.available_actions?.includes('view_review') && (
                            <Button variant=''
                                onClick={handleFeedbackModal}
                                className='btn-move-room '   >
                                <Image src='/images/icons/feedstar.svg' className='img-fluid' alt='edit' width={24} height={24} />      View Feedback
                            </Button>
                        )}

                        {/* {bookingDetailData?.available_actions?.includes('view_review') && (
                            <Button variant=''
                                onClick={handleFeedbackModal}
                                className='btn-move-room '   >
                                <Image src='/images/icons/feedstar.svg' className='img-fluid' alt='edit' width={24} height={24} />      View Feedback
                            </Button>
                        )} */}

                    </div>
                </div>
                <div className='booking-details-page'>

                    {/* Timeline hero */}
                    <div className='timeline-hero mb-4'>
                        <div className='green-checkbox-bg'>
                            <Container>
                                {canRetrieveHistory && (
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                <div className='d-flex justify-between w-100'>
                                                    <div className='acc-title d-flex align-items-center gap-3'>
                                                        <p className='mb-0' >
                                                            <strong> {bookingDetailData?.booking_status}  </strong><br></br>
                                                            <span>{convertDatewithtime(getStatusHeaderDate(bookingDetailData))}</span>
                                                        </p>
                                                        {bookingDetailData?.history?.[0]?.event_type == "Modification" ? `Modified ${calculateDaysDifference(bookingDetailData?.history?.[0]?.old_value?.check_in_date, bookingDetailData?.history?.[0]?.new_value?.check_in_date)} days ago` : bookingDetailData?.history?.[0]?.event_type}
                                                    </div>
                                                </div>
                                                <span> <Image src='/images/icons/bottom-arrow.svg' className='img-fluid' alt='hail' width={24} height={24} />
                                                    <p className='exp-false mb-0'> View timeline overview </p>
                                                    <p className='exp-true mb-0'> Minimize timeline overview </p>
                                                </span>
                                            </Accordion.Header>
                                            {/* <Accordion.Body>
                                                <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: "#f9f8f6" }}>
                                                    <div className="position-relative" style={{ overflow: "hidden" }}>
                                                        <div className="d-flex justify-content-between align-items-start position-relative progress-dot-line">
                                                            <div
                                                                // key={item.key}
                                                                className={`text-start position-relative completed-point `}
                                                                style={{ width: `${100 / timelineData.length}%` }}
                                                            >
                                                                <div className="d-inline-flex align-items-center justify-content-center mb-2">
                                                                    <Image
                                                                        src="/images/icons/hail_24dp.svg"
                                                                        width={24}
                                                                        height={24}
                                                                    // alt={item.type}
                                                                    />
                                                                </div>

                                                                <span className={`point pnt-${0}`}></span>

                                                                <p className="mb-0 fw-semibold small text-dark">
                                                                    {convertDatewith(bookingDetailData.created_at)}
                                                                </p>
                                                                <p className="text-muted small">Booking Confirmed</p>


                                                            </div>
                                                            {canListHistory && timelineData.map((item, index) => (
                                                                <div
                                                                    key={item.key}
                                                                    className={`text-start position-relative ${bookingDetailData?.history?.some(val=>val.new_value.booking_status==item.label) && 'completed-point'} ${item.colorClass}`}
                                                                    style={{ width: `${100 / timelineData.length}%` }}
                                                                >
                                                                    <div className="d-inline-flex align-items-center justify-content-center mb-2">
                                                                        <Image
                                                                            src={item.icon}
                                                                            width={24}
                                                                            height={24}
                                                                        // alt={item.type}
                                                                        />
                                                                    </div>

                                                                    <span className={`point pnt-${index + 1}`}></span>
                                                                    {item?.title !== "Stay dates" && (
                                                                        <p className="mb-0 fw-semibold small text-dark">
                                                                            {convertDatewith(item.date)}
                                                                        </p>
                                                                    )}


                                                                    <p className="text-muted small">{item.label === "Booking Created" ? "Booking Confirmed" : item?.label}</p>

                                                                    
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {canRetrieveHistory && (
                                                        <div className="text-start pt-3" style={{ borderTop: '1px solid #4635271F' }} >
                                                            <p className="small text-muted mb-0">
                                                                Booking ID: <span className="fw-semibold text-success">{bookingDetailData?.booking_number}</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </Accordion.Body> */}
                                            <Accordion.Body>
                                                <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: "#f9f8f6" }}>
                                                    <div className="position-relative" style={{ overflow: "hidden" }}>
                                                        <div className="d-flex justify-content-between align-items-start position-relative progress-dot-line">
                                                            {canListHistory && timelineData.map((item, index) => {
                                                                const isCompleted = item.status === 'completed';
                                                                const isCurrent = item.status === 'current';
                                                                const isFuture = item.status === 'future' || item.status === 'cancelled';
                                                                const isTerminal = item.status === 'terminal';

                                                                // Solid line segment = completed or current
                                                                // Dashed line segment = future or cancelled
                                                                const isDashed = isFuture;

                                                                return (
                                                                    <div
                                                                        key={item.id}
                                                                        className={`text-start position-relative ${isCompleted || isCurrent || isTerminal
                                                                            ? 'completed-point'
                                                                            : 'future-point'
                                                                            } ${isDashed ? 'dashed-point' : ''}`}
                                                                        style={{ width: `${100 / timelineData.length}%` }}
                                                                    >
                                                                        <div className="d-inline-flex align-items-center justify-content-center mb-2">
                                                                            <Image
                                                                                src={item.icon}
                                                                                width={24}
                                                                                height={24}
                                                                                alt={item.label}
                                                                                style={isDashed ? { opacity: 0.4 } : {}}
                                                                            />
                                                                        </div>

                                                                        <span
                                                                            className={`point pnt-${index}`}
                                                                        // style={
                                                                        //     isCurrent
                                                                        //         ? { background: '#BF9039', borderColor: '#BF9039' }     // amber — active
                                                                        //         : isTerminal
                                                                        //             ? { background: '#D85A30', borderColor: '#D85A30' }     // coral — no-show
                                                                        //             : isFuture
                                                                        //                 ? { background: '#ccc', borderColor: '#ccc' }        // grey — future
                                                                        //                 : {}                                                    // default teal — completed
                                                                        // }
                                                                        />

                                                                        {/* {item.date && item.id !== 'stay_dates' && (
                                                                            <p
                                                                                className="mb-0 fw-semibold small"
                                                                                style={{ color: isDashed ? '#aaa' : '#000' }}
                                                                            >
                                                                                {item.prefix ? `${item.prefix} ` : ''}
                                                                                {convertDatewith(item.date)}
                                                                            </p>
                                                                        )}

                                                                        {item.date && (isCurrent || isCompleted) && item.id !== 'stay_dates' && (
                                                                            <p
                                                                                className="mb-0 text-muted small"
                                                                                style={{ color: isDashed ? '#aaa' : undefined }}
                                                                            >
                                                                                at {getTimeinDatestring(item.date)}
                                                                            </p>
                                                                        )}

                                                                        <p
                                                                            className="text-muted small mb-0"
                                                                            style={{ color: isDashed ? '#aaa' : undefined }}
                                                                        >
                                                                            {item.label}
                                                                        </p> */}
                                                                        {item.date && item.id !== 'stay_dates' && (
                                                                            <p
                                                                                className="mb-0 fw-semibold small"
                                                                                style={{ color: isDashed ? '#aaa' : '#000' }}
                                                                            >
                                                                                {item.prefix ? `${item.prefix} ` : ''}
                                                                                {convertDatewith(item.date)}
                                                                            </p>
                                                                        )}

                                                                        {item.date && (isCurrent || isCompleted) && item.id !== 'stay_dates' && (
                                                                            <p
                                                                                className="mb-0 text-muted small"
                                                                                style={{ color: isDashed ? '#aaa' : undefined }}
                                                                            >
                                                                                at {getTimeinDatestring(item.date)}
                                                                            </p>
                                                                        )}

                                                                        <p
                                                                            className="text-muted small mb-0"
                                                                            style={{ color: isDashed ? '#aaa' : undefined }}
                                                                        >
                                                                            {item.label}
                                                                        </p>

                                                                        {/* Info tooltip icon — only on booking_confirmed node */}
                                                                        {item.id === 'booking_confirmed' && (
                                                                            <BookingConfirmedTooltip
                                                                                bookingNumber={bookingDetailData?.booking_number}
                                                                                bookedBy={bookingDetailData?.created_by?.email}
                                                                                bookedAt={item.date}
                                                                            />
                                                                        )}

                                                                        {/* Urgent badge for Check-In-Pending */}
                                                                        {item.urgentBadge && (
                                                                            <p className="mb-0 mt-1">
                                                                                <span className="badge-check-in-pending-urgent">
                                                                                    CONFIRM STATUS WITHIN ...
                                                                                </span>
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {canRetrieveHistory && (
                                                        <div
                                                            className="text-start pt-3"
                                                            style={{ borderTop: '1px solid #4635271F' }}
                                                        >
                                                            <p className=" text-muted mb-0 d-flex gap-2 align-items-center">
                                                                Booking id: {bookingDetailData?.booking_number}
                                                                <Image
                                                                    src="/images/icons/content_copy.svg"
                                                                    className="img-fluid ms-2"
                                                                    alt="copy"
                                                                    width={16}
                                                                    height={16}
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={handleCopy}
                                                                />
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>

                                    </Accordion>

                                )}
                            </Container>
                        </div>
                    </div>
                </div>

                <Container>
                    <Row className='justify-center'>
                        <Col md={8}>
                            <div className='booking-details-box2 pt-5 pb-5 mb-5'>
                                {/* Client & Booking Details */}
                                <div className='client-booking-details mb-5'>
                                    <h4 style={{ fontWeight: 500 }}>Client & Booking Details</h4>

                                    <Row className='company-info-select'>
                                        <Col md={4}>
                                            <div className='comp-pro'>
                                                <Image src='/images/icons/building.svg' className='img-fluid' width={24} height={24} alt='building' />
                                                <h5 style={{ fontWeight: 500 }}>Company:</h5>
                                                <p className='mb-1' style={{ fontWeight: 500 }}>{bookingDetailData?.company?.name}</p>
                                                {/* <small>8th Floor, Tower C, Building No. 10 DLF Cyber City, Phase II, Gurugram, Haryana, India - 122002.</small> */}
                                                <small>{bookingDetailData?.company?.street_no}, {bookingDetailData?.company?.location}, {bookingDetailData?.company?.city}, {bookingDetailData?.company?.state}, India - {bookingDetailData?.company?.pin_code}.</small>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className='comp-pro'>
                                                <Image src='/images/icons/person_raised.svg' className='img-fluid' width={24} height={24} alt='building' />
                                                <h5 style={{ fontWeight: 500 }}>Booked by:</h5>
                                                <p className='mb-1' style={{ fontWeight: 500 }}>{bookingDetailData?.created_by?.role_name}</p>
                                                <small>{bookingDetailData?.created_by?.email} · {bookingDetailData?.created_by?.phone}</small>
                                            </div>
                                        </Col>
                                        <Col md={4} className='text-md-end '>
                                            {/* <Toaster position="top-right" /> */}
                                            <h5 className='d-flex gap-2 justify-end' style={{ fontWeight: 500 }}>Booking id: {bookingDetailData?.booking_number}    <Image src='/images/icons/content_copy.svg' className='img-fluid' width={18} height={18} alt='building' style={{ cursor: "pointer" }}
                                                onClick={handleCopy} /></h5>
                                            {/* <p className='mb-0'>Booking date: 29 Jul, 2025</p> */}
                                            <p className='mb-0'>Booking date: {convertDatewith(bookingDetailData?.created_at)}</p>
                                        </Col>
                                    </Row>

                                    <hr></hr>
                                </div>

                                {/* Guests */}
                                <div className='guests-section mb-4'>
                                    <h4 style={{ fontWeight: 500 }}>Guests</h4>


                                    <div className='guest-card p-3 bg-white border mb-3 d-flex align-items-center justify-content-between'>
                                        <div className='d-flex align-items-center gap-3'>
                                            <div >
                                                <Image src={bookingDetailData?.traveler?.profile_picture ? bookingDetailData?.traveler?.profile_picture : bookingDetailData?.traveler?.gender === "Male" ? "/images/icons/young-boy.jpg" : "/images/icons/young-girl.jpg"}
                                                    alt='guest' width={48} height={48} style={{ objectFit: 'contain' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{bookingDetailData?.traveler?.name}</div>
                                                <div className='text-muted' style={{ fontSize: 13 }}> Emp. id: {bookingDetailData?.traveler?.employee_id} <br></br> Dept: {bookingDetailData?.traveler?.department}</div>
                                            </div>
                                        </div>


                                        <div className='text-muted d-flex gap-2' style={{ fontSize: 14, paddingLeft: '15px', borderLeft: '1px solid #ccc' }}><Image src='/images/icons/call.svg' alt='phone' width={16} height={16} /> {bookingDetailData?.traveler?.phone}</div>
                                        <div className='text-muted d-flex  gap-2' style={{ fontSize: 14, paddingLeft: '15px', borderLeft: '1px solid #ccc' }}><Image src='/images/icons/email.svg' alt='email' width={16} height={16} /> {bookingDetailData?.traveler?.email}</div>
                                        <div className='text-muted d-flex  gap-2' style={{ fontSize: 14, paddingLeft: '15px', borderLeft: '1px solid #ccc' }}><Image src='/images/icons/Genders.svg' alt='email' width={16} height={16} />
                                            {bookingDetailData?.traveler?.gender}</div>
                                        {/* {permissionBookingMain?.can_retrieve && <Button variant='' onClick={showProfile} className='btn-table-action' style={{ border: '1px solid #000', borderRadius: '0', fontSize: '14px' }} >View Details</Button>} */}
                                        {canRetrieve && (
                                            <Button
                                                variant=''
                                                onClick={showProfile}
                                                className='btn-table-action'
                                                style={{ border: '1px solid #000', borderRadius: '0', fontSize: '14px' }}
                                            >
                                                View Details
                                            </Button>
                                        )}

                                    </div>
                                    <hr></hr>
                                </div>

                                {/* Stay Details header */}
                                <div className='stay-details-section mb-4'>
                                    <h4 style={{ fontWeight: 500 }}>Stay Details</h4>

                                    <p className='text-muted' style={{ fontWeight: '500' }} >{bookingDetailData?.total_nights} night stay in BR</p>

                                    <div className='property-hero mb-4 p-3' style={{ background: '#fff' }}>
                                        <Row className='align-items-start'>
                                            <Col md={4} className='d-flex'>
                                                <div >
                                                    <Image src={bookingDetailData?.property?.cover_photo_url ? bookingDetailData?.property?.cover_photo_url : '/images/icons/room-1.jpg'} alt='property' width={300} height={300} style={{ objectFit: 'cover' }} />
                                                </div>
                                            </Col>
                                            <Col md={6} className=''>
                                                <h3 style={{ margin: 0, fontWeight: 600 }} className='room-title fw-semibold fs-20 mb-2'>
                                                    {bookingDetailData?.room?.name}
                                                    <span className='room-type-badge ms-2'>
                                                        {bookingDetailData?.room?.type === "Private" ? "Private Rooms" : "Shared Rooms"}
                                                    </span>
                                                </h3>
                                                <p className='text-muted mb-0 d-flex align-items-start gap-1 pt-2' style={{ fontSize: 14 }}>

                                                    <Image src='/images/icons/location_on.svg' className='img-fluid ' alt='location' width={20} height={20} />
                                                    {bookingDetailData?.property?.name}<br />
                                                    {bookingDetailData?.property?.street_number}, {bookingDetailData?.property?.flat_house_no}, {bookingDetailData?.property?.city}, {bookingDetailData?.property?.state}, {bookingDetailData?.property?.country} {bookingDetailData?.property?.pin_code}</p>
                                            </Col>


                                        </Row>

                                        <Row className='mt-4'>
                                            <Col md={3} className='d-flex'>
                                                <div style={{ flex: 1 }}>
                                                    <h6 style={{ margin: 0, fontWeight: 600 }}>Check-in:</h6>
                                                    <p className='mb-0' style={{ fontWeight: 600 }}>{formatDaysDateMonthYear(bookingDetailData?.check_in_date)}</p>
                                                    <small className='text-muted'>{getTimeinDatestring(bookingDetailData?.check_in_date)}</small>
                                                </div>
                                            </Col>
                                            <Col md={3} className='d-flex'>
                                                <div style={{ flex: 1 }}>
                                                    <h6 style={{ margin: 0, fontWeight: 600 }}>Check-out:</h6>
                                                    <p className='mb-0' style={{ fontWeight: 600 }}>{formatDaysDateMonthYear(bookingDetailData?.check_out_date)}</p>
                                                    <small className='text-muted'>{getTimeinDatestring(bookingDetailData?.check_out_date)}</small>
                                                </div>
                                            </Col>
                                        </Row>

                                        <hr style={{ margin: '18px 0' }} />

                                        <Row>
                                            <Col md={4}>
                                                <h6 style={{ fontWeight: 600 }}>Caretaker:</h6>
                                                {visibleCaretakers.map((item, index) => (
                                                    <div key={index}>
                                                        <p className='mb-0'>{item?.name}</p>
                                                        <p className='mb-0 text-muted'>{item?.phone}</p>
                                                    </div>
                                                ))}

                                                {/* MORE */}
                                                {caretakers.length > 1 && !showCaretakerAll && (
                                                    <small
                                                        className='text-muted cursor-pointer'
                                                        onClick={() => setShowCaretakerAll(true)}
                                                    >
                                                        {caretakers.length - 1} More
                                                    </small>
                                                )}

                                                {/* COLLAPSE ICON */}
                                                {caretakers.length > 1 && showCaretakerAll && (
                                                    <div
                                                        className="cursor-pointer text-muted"
                                                        onClick={() => setShowCaretakerAll(false)}
                                                    >
                                                        <small>view less</small>
                                                    </div>
                                                )}
                                                {/* {bookingDetailData?.property?.caretakers?.map((item) => (
                                                    <>
                                                        <p className='mb-0'>{item?.name}</p>
                                                        <p className='mb-0 text-muted'>{item?.phone}</p>
                                                    </>
                                                ))}
                                                <small className='text-muted'>1 More</small> */}
                                            </Col>
                                            <Col md={4}>
                                                <h6 style={{ fontWeight: 600 }}>Property Manager:</h6>
                                                {visiblePropManager.map((item, index) => (
                                                    <div key={index}>
                                                        <p className='mb-0'>{item?.name}</p>
                                                        <p className='mb-0 text-muted'>{item?.phone}</p>
                                                    </div>
                                                ))}

                                                {/* MORE */}
                                                {propManagers.length > 1 && !showPropManagerAll && (
                                                    <small
                                                        className='text-muted cursor-pointer'
                                                        onClick={() => setshowPropManagerAll(true)}
                                                    >
                                                        {propManagers.length - 1} More
                                                    </small>
                                                )}

                                                {/* COLLAPSE ICON */}
                                                {propManagers.length > 1 && showPropManagerAll && (
                                                    <div
                                                        className="cursor-pointer text-muted"
                                                        onClick={() => setshowPropManagerAll(false)}
                                                    >
                                                        <small>view less</small>
                                                    </div>
                                                )}
                                                {/* {bookingDetailData?.property?.property_managers?.map((item) => (
                                                    <>
                                                        <p className='mb-0'>{item?.name}</p>
                                                        <p className='mb-0 text-muted'>{item?.phone}</p>
                                                    </>
                                                ))} */}
                                                {/* <small className='text-muted'>1 More</small> */}
                                            </Col>
                                            <Col md={4}>
                                                <h6 style={{ fontWeight: 600 }}>Operations Manager:</h6>
                                                {visibleOpManager.map((item, index) => (
                                                    <div key={index}>
                                                        <p className='mb-0'>{item?.name}</p>
                                                        <p className='mb-0 text-muted'>{item?.phone}</p>
                                                    </div>

                                                ))}

                                                {/* MORE */}
                                                {opManagers.length > 1 && !showOpManagerAll && (
                                                    <small
                                                        className='text-muted cursor-pointer'
                                                        onClick={() => setshowOpManagerAll(true)}
                                                    >
                                                        {opManagers.length - 1} More
                                                    </small>
                                                )}

                                                {/* COLLAPSE ICON */}
                                                {opManagers.length > 1 && showOpManagerAll && (
                                                    <div
                                                        className="cursor-pointer text-muted"
                                                        onClick={() => setshowOpManagerAll(false)}
                                                    >
                                                        <small>view less</small>
                                                    </div>
                                                )}
                                                {/* <p className='mb-0'>
                                                    {bookingDetailData?.property?.operations_manager?.name}</p>
                                                <p className='mb-0 text-muted'>{bookingDetailData?.property?.operations_manager?.phone}</p>
                                                <small className='text-muted'>1 More</small> */}
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr></hr>
                                </div>



                                {/* Guests */}
                                {/* <div className='guests-section mb-4'>
                                    <h4 style={{ fontWeight: 500 }}>Approver Details</h4>

                                    <div className='d-flex align-items-start gap-2'>
                                        <Image src='/images/icons/approval.svg' alt='property' width={24} height={24} />
                                        <div className='blank-paragraph'>
                                            <p className='fw-medium'>Approved by:</p>

                                            <p style={{ lineHeight: '25px' }} >Shabha Shaikh <br></br>

                                                gloria@slb.com  <br></br>
                                                +91 7876776655 <br></br>
                                                Approved date: 29 Jul, 2025

                                            </p>
                                        </div>
                                    </div>
                                    <hr></hr>
                                </div> */}

                                <div className='guests-section mb-4'>
                                    <h4 style={{ fontWeight: 500 }}>Additional Notes</h4>

                                    {bookingDetailData?.additional_comments && (
                                        <div className='guest-card bg-white p-3'>
                                            <Row>
                                                <Col md={5}>
                                                    <p className='mb-0 fw-medium' >
                                                        {/* We would like to know the transportation costs from the airport to the venue for both check-in and check-out. */}
                                                        {bookingDetailData?.additional_comments}
                                                    </p>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                                <p>Need help with your bookings here? Contact service@alice.com</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='page-footer'>
                <Container>
                    <hr></hr>
                    <p className='mb-5 mt-4'> Can’t find your bookings here? Contact service@alice.com </p>

                    <p>We strive to provide you the best property & vacation rental management service by managing rentals in the most profitable way for you and making sure that you and your guests come to a spotlessly clean and fully functional home.</p>

                    <ul className='footer-links pl-0 mt-3 mb-0'>
                        <li><Link href="#">About</Link></li>
                        <li><Link href="#">Our Team</Link></li>
                        <li><Link href="#">What we do</Link></li>

                        <li><Link href="#">Help Center</Link></li>
                    </ul>


                    <ul className='social-link mb-5'>
                        <li><Link href="#"><Image src='/images/icons/instagram-logo 1.svg' width={24} height={24} alt='Facebook' /></Link></li>
                        <li><Link href="#"><Image src='/images/icons/linkedin-logo.svg' width={24} height={24} alt='Twitter' /></Link></li>
                        <li><Link href="#"><Image src='/images/icons/x-logo.svg' width={24} height={24} alt='Instagram' /></Link></li>

                        <li> +91 83224 62973 &nbsp; | </li>
                        <li> +91 77097 28684 &nbsp; | </li>
                        <li> info@TeamOffsite.in </li>
                    </ul>

                    <hr></hr>

                    <p className='d-flex gap-2' >A-11, Tato Building, Tonca Miramar, Panaji, Goa, India

                        <Link style={{ textDecoration: 'none', color: '#463527' }} href='#' >Terms of Service</Link>
                        <Link style={{ textDecoration: 'none', color: '#463527' }} href='#'>Privacy Policy</Link>
                    </p>

                </Container>
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
                fetchDataFunction={getBookingDetails}
            />)}

            {/* <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Update Stay Dates

                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <div className={`update-step-1 ${isStep2 ? "d-none" : ""}`}>
                        <div className='booking-details-br'>

                            <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban Leena </p>
                            <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400' }} > <Image src='/images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p>

                            <div className='bm-contact mt-4'>
                                <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Contact Details </p>
                                <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                                <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                                    gloria@slb.com,  +91 7876776655

                                </p>


                                <p className='border-bottom pb-4'></p>

                                <ul className='room-list'>
                                    <li>1 <span>Room</span></li>
                                    <li>3-7 Aug, 2025  <span>3 nights</span></li>
                                    <li> <span>Booking Id </span> 14269 <Image src='/images/icons/content_copy.svg' className='img-fluid' alt='clone' width={16} height={16} /> </li>
                                </ul>


                            </div>


                        </div>


                        <div className='booking-details-br mt-3'>

                            <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Choose stay dates </p>
                            <Row className=''>
                                <Col md={6}>
                                    <div className='form-group mb-2'  >
                                        <label> Check-in</label>
                                        <DatePicker
                                            selected={inactiveFrom}
                                            onChange={(date) => setInactiveFrom(date)}
                                            placeholderText="Select date"
                                            className="form-control  custom-date-picker"
                                            dateFormat="dd/MM/yyyy"

                                        />
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className='form-group mb-2'>
                                        <label>Checkout</label>
                                        <DatePicker
                                            selected={inactiveTo}
                                            onChange={(date) => setInactiveTo(date)}
                                            placeholderText="Select date"
                                            className="form-control custom-date-picker"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                </Col>


                                <Col md={6}>
                                    <div className=' mb-2 mt-2' >
                                        3 nights
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>


                    <div className={`update-step-2 mt-3 ${isStep2 ? "" : "d-none"}`}>
                        <p>Good news your dates are available! Check the new dates of your stay below:</p>

                        <p>Original stay dates</p>
                        <div className='booking-details-br mt-3 mb-3'>
                            <p className='mb-0' >Check-in:  <strong>3 Aug, 2025</strong> </p>
                            <p className='mb-0'>Checkout: <strong>3 Aug, 2025</strong></p>
                            <p className='mt-2 mb-0'>Duration: 4 nights</p>

                        </div>

                        <hr style={{ margin: '30px 0' }} ></hr>

                        <p>New stay dates</p>
                        <div className='booking-details-br mt-3 mb-3'>
                            <p className='mb-0' >Check-in:  <strong>3 Aug, 2025</strong> </p>
                            <p className='mb-0'>Checkout: <strong>3 Aug, 2025</strong></p>
                            <p className='mt-2 mb-0'>Duration: 4 nights</p>

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
                                                placeholder="Select company"
                                                className="react_selectbox"
                                                isSearchable={false}
                                                styles={customStyles}
                                            />
                                        </Form.Group>


                                        <Form.Group className='mb-4' controlId="arrivalTime">
                                            <Form.Label className=" mb-2 fw-semibold">
                                                Mode of Arrival
                                            </Form.Label>

                                            <Select
                                                name="aria-role-select"
                                                options={arrivalOption}
                                                placeholder="Select company"
                                                className="react_selectbox"
                                                isSearchable={false}
                                                styles={customStyles}
                                            />
                                        </Form.Group>

                                        <div className='mb-4 form-group' controlId="arrivalTime">
                                            <Form.Label className=" mb-2 fw-semibold">
                                                Flight / Train Number
                                            </Form.Label>

                                            <input type="text" placeholder='Enter number e.g. MADGAON LTT EXP #11100' className='form-control' />
                                        </div>
                                    </div>

                                    <div className="arrival-section  mt-4 pt-3 mb-5">
                                        <p className="font-18 mb-2">Other Essential Details</p>
                                        <p className="text-secondary  mb-4">
                                            Share any additional details or requests for this booking.
                                        </p>

                                        <div className='mb-4 form-group' >
                                            <textarea className='form-control' placeholder='Got any thoughts or questions? Add them here! (Optional)'>
                                            </textarea>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>

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


                    <Button
                        variant=""
                        onClick={() => {
                            if (isStep2) {
                                // Final confirmation logic
                                changepicClose();
                            } else {
                                setIsStep2(true); // switch to step 2
                            }
                        }}
                        className='search-btn complete-form-btn '
                        style={{ padding: '13px 25px', borderRadius: '0' }}
                    >
                        {isStep2 ? "Confirm This Change" : "Check Availability"}
                    </Button>

                </Modal.Footer>

            </Modal> */}

            <ModifyDateModal
                changepicsModal={changepicsModal}
                changepicClose={changepicClose}
                isStep2={isStep2}
                setIsStep2={setIsStep2}
                inactiveFrom={inactiveFrom}
                setInactiveFrom={setInactiveFrom}
                inactiveTo={inactiveTo}
                setInactiveTo={setInactiveTo}
                fetchDataFunction={getBookingDetails}
                bookingDetailData={bookingDetailData}
            />

            <CancelBookingModal
                cancelbooksModal={cancelbooksModal}
                cancelbookClose={cancelbookClose}
                // changepicClose={changepicClose}
                fetchDataFunction={getBookingDetails}
                bookingDetailData={bookingDetailData}
            />


            {/*  */}


            <Modal show={showsProfile} onHide={profileClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                    <p className='d-flex align-items-center gap-3 font-18' style={{ color: '#73615F' }}>
                        Guest Details <Image src='/images/icons/bottom-arrow.svg' style={{ transform: 'rotate(180deg)', opacity: '.5' }} className='img-fluid' alt='top' width={12} height={12} />
                        <Image src='/images/icons/bottom-arrow.svg' className='img-fluid' alt='top' width={12} height={12} />
                    </p>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={profileClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='cmp-employe-box'>
                        <div className='d-flex justify-content-between mb-3'>
                            <Image src={bookingDetailData?.traveler?.profile_picture || '/images/icons/No-Image.svg'} className='img-fluid' alt='employer' width={64} height={64} />

                            {/* <Button variant="" onClick={() => {
                                profileClose();
                                editemploye();
                            }} className='edit-btn gap-2'>Edit  <Image src='/images/icons/edit.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button> */}

                        </div>

                        <p className='mb-1'>Company Employee</p>

                        <h4 className='font-24 mb-1'>{bookingDetailData?.traveler?.name}</h4>

                        <p className='d-flex gap-2' >
                            <Image src='/images/icons/email.svg' className='img-fluid' alt='email' width={20} height={20} />
                            <Link style={{ color: '#463527', fontWeight: '500' }} href='mailto:Shubancasamelhor@gmail.com'>{bookingDetailData?.traveler?.email}</Link>

                            <Image src='/images/icons/call.svg' className='img-fluid' alt='email' width={20} height={20} />
                            <Link style={{ color: '#463527', fontWeight: '500' }} href='tell:8390734261'>{bookingDetailData?.traveler?.phone}</Link>
                        </p>


                        <Button variant="" className='edit-btn gap-2' onClick={() => router.push(`/Bookings?guest_uid=${bookingDetailData?.uid}`)}>View Trips  <Image src='/images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>

                        <hr style={{ marginTop: '20px', borderColor: '#4635273D' }}></hr>

                        <div className='comapny-information-box-employer'>

                            <p className='subheadine-2'>Personal Information</p>
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Gender  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {bookingDetailData?.traveler?.gender} </span></p>




                        </div>




                        <div className='comapny-information-box-employer'>

                            <p className='subheadine-2'>Company Identity</p>
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Company  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {bookingDetailData?.company?.name} </span></p>

                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Employee ID  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {bookingDetailData?.traveler?.employee_id} </span></p>


                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Dept./Segment  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {bookingDetailData?.traveler?.department} </span></p>




                        </div>


                        {/* <div className='comapny-information-box-employer'>

                            <p className='subheadine-2'>Custom Question</p>
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Rezo ticket  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > CM656574754536 </span></p>




                        </div> */}

                        {/* 
                        <Button variant="" className='edit-btn gap-2'>Change Role/Password  <Image src='/images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button> */}


                    </div>





                </Modal.Body>



            </Modal>


            {/* <Modal show={showModifyCheckout} onHide={handleModifyCheckoutClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Update Checkout Date
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={handleModifyCheckoutClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <div className={`update-step-1 ${isStep2 ? "d-none" : ""}`}>
                        <div className='booking-details-br'>

                            <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban Leena </p>
                            <p className='d-flex gap-1' style={{ lineHeight: '24px' }} >Room 1 &nbsp; | &nbsp; <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='building' width={24} height={24} />  King bed  &nbsp; |  &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>Check-In-Upcoming</span>  </p>
                            <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p>

                            <div className='bm-contact mt-4'>
                                <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                                <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                                <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                                    gloria@slb.com,  +91 7876776655

                                </p>


                                <p className='border-bottom pb-4'></p>

                                <ul className='room-list'>

                                    <li>3-7 Aug, 2025  <span>3 nights</span></li>
                                    <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} /> </li>
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
                                            selected={inactiveFrom}
                                            onChange={(date) => setInactiveFrom(date)}
                                            placeholderText="Select date"
                                            className="form-control  custom-date-picker"
                                            dateFormat="dd/MM/yyyy"

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
                            <p className='mb-0' >Check-in:  <strong>3 Aug, 2025</strong> </p>
                            <p className='mb-0'>Checkout: <strong>3 Aug, 2025</strong></p>
                            <p className='mt-2 mb-0'>Duration: 4 nights</p>

                        </div>

                        <hr style={{ margin: '30px 0' }} ></hr>

                        <p>New stay dates</p>
                        <div className='booking-details-br mt-3 mb-3'>
                            <p className='mb-0' >Check-in:  <strong>3 Aug, 2025</strong> </p>
                            <p className='mb-0'>Checkout: <strong>3 Aug, 2025</strong></p>
                            <p className='mt-2 mb-0'>Duration: 4 nights</p>

                        </div>

                    </div>
                </Modal.Body>



                <Modal.Footer className='d-flex align-items-center justify-content-between '>

                    
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

                    
                    <Button
                        variant=""
                        onClick={() => {
                            if (isStep2) {
                                // Final confirmation logic
                                changepicClose();
                            } else {
                                setIsStep2(true); // switch to step 2
                            }
                        }}
                        className='search-btn complete-form-btn '
                        style={{ padding: '13px 25px', borderRadius: '0' }}
                    >
                        {isStep2 ? "Confirm This Change" : "Check Availability"}
                    </Button>

                </Modal.Footer>


            </Modal> */}
            <ModifyCheckout
                showModifyCheckout={showModifyCheckout}
                handleModifyCheckoutClose={handleModifyCheckoutClose}
                isStep2={isStep2}
                setIsStep2={setIsStep2}
                inactiveFrom={inactiveFrom}
                setInactiveFrom={setInactiveFrom}
                inactiveTo={inactiveTo}
                setInactiveTo={setInactiveTo}
                fetchDataFunction={getBookingDetails}
                bookingDetailData={bookingDetailData}
            />

            {/* mark now show */}



            {/* <Modal show={marknoShowsModal} onHide={marknoShowClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Mark as No Show?
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={marknoShowClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <div className='update-step-1'>
                        <div className='booking-details-br'>

                            <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban Leena </p>
                            <p className='d-flex gap-1' style={{ lineHeight: '24px' }} >Room 1 &nbsp; | &nbsp; <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='building' width={24} height={24} />  King bed  &nbsp; |  &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-upcoming'>Check-In-Upcoming</span>  </p>
                            <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400', opacity: '.8' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p>

                            <div className='bm-contact mt-4'>
                                <p className='mb-1' style={{ fontWeight: '500', fontSize: '14px' }}> Booking Manager Contact </p>
                                <p className='mb-0 d-flex gap-2 align-items-center font-18' >  CasaMelhor Admin, </p>
                                <p className='mb-0 d-flex gap-2 align-items-center font-18' >
                                    gloria@slb.com,  +91 7876776655

                                </p>


                                <p className='border-bottom pb-4'></p>

                                <ul className='room-list'>

                                    <li>3-7 Aug, 2025  <span>3 nights</span></li>
                                    <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={24} height={24} /> </li>
                                </ul>


                            </div>


                        </div>



                        <div className='booking-details-br mt-3'>

                            <div className='inactive-box remove-company-box company-status-box'>


                                <div className='forom-group mb-0'>
                                    <label>Tell booking manager and property managers why you need to cancel</label>
                                    <textarea
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
                        // onClick={updateDateClose}
                        className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                        Cancel
                    </Button>
                    <Button variant=""
                        // onClick={updateDateClose}
                        className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Confirm This Change
                    </Button>
                </Modal.Footer>
            </Modal> */}
            <MarkNoShowModal
                marknoShowsModal={marknoShowsModal}
                marknoShowClose={marknoShowClose}
                fetchDataFunction={getBookingDetails}
                bookingDetailData={bookingDetailData}
            />

            {/* Check in formalties */}

            {/* <Modal show={checkInFormalities} onHide={CheckInFormalitiesClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Check-in Formalities
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={CheckInFormalitiesClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <div className='update-step-1'>
                        <div className='booking-details-br'>

                            <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban, and Jenny </p>

                            <p className='d-flex align-items-center gap-2' style={{ lineHeight: 'auto', fontSize: '14px' }} >

                                Room 2  &nbsp;|
                                <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> Bed A | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Check-In-pending'>Check-In-Pending</span>  </p>

                            <hr></hr>
                            <div className='bm-contact mt-4'>





                                <ul className='room-list'>


                                    <li>3-7 Aug, 2025  <span>3 nights</span></li>
                                    <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={20} height={20} /> </li>
                                </ul>


                            </div>


                        </div>

                        <div className='booking-details-br mt-3'>
                            <p className='font-18 fw-medium'>Guest Nationality</p>

                            <Row>
                                <Col md={12} className='d-flex justify-content-start gap-2' >
                                    <div className="radio-select-box d-flex gap-2">
                                        <label className="form-check-label d-flex gap-2" htmlFor="nationality-indian">
                                            <input
                                                type="radio"
                                                name="select-nationality"
                                                id="nationality-indian"
                                                checked={nationality === "Indian"}
                                                onChange={() => setNationality("Indian")}
                                            />
                                            <span className="radio-checkmark"></span>
                                            Indian
                                        </label>
                                    </div>

                                    <div className="radio-select-box d-flex gap-2">
                                        <label className="form-check-label d-flex gap-2" htmlFor="nationality-foreign">
                                            <input
                                                type="radio"
                                                name="select-nationality"
                                                id="nationality-foreign"
                                                checked={nationality === "Foreign"}
                                                onChange={() => setNationality("Foreign")}
                                            />
                                            <span className="radio-checkmark"></span>
                                            Foreign National
                                        </label>
                                    </div>
                                </Col>
                            </Row>

                        </div>



                        {nationality === "Indian" && (

                            <>
                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Choose an ID type to add</p>

                                    <Row>
                                        <Col md={12} className='d-flex justify-content-start gap-2' >
                                            <div className="radio-select-box d-flex gap-2">
                                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-passport">
                                                    <input
                                                        type="radio"
                                                        name="select-id-type"
                                                        id="id-type-passport"
                                                        checked={idType === "Passport"}
                                                        onChange={() => setIdType("Passport")}
                                                    />
                                                    <span className="radio-checkmark"></span>
                                                    Passport
                                                </label>
                                            </div>

                                            <div className="radio-select-box d-flex gap-2">
                                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-aadhaar">
                                                    <input
                                                        type="radio"
                                                        name="select-id-type"
                                                        id="id-type-aadhaar"
                                                        checked={idType === "Aadhaarcard"}
                                                        onChange={() => setIdType("Aadhaarcard")}
                                                    />
                                                    <span className="radio-checkmark"></span>
                                                    Aadhaar card
                                                </label>
                                            </div>

                                            <div className="radio-select-box d-flex gap-2">
                                                <label className="form-check-label d-flex gap-2" htmlFor="id-type-driving">
                                                    <input
                                                        type="radio"
                                                        name="select-id-type"
                                                        id="id-type-driving"
                                                        checked={idType === "Drivinglicence"}
                                                        onChange={() => setIdType("Drivinglicence")}
                                                    />
                                                    <span className="radio-checkmark"></span>
                                                    Driving licence
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>



                                    <hr />

                                    
                                    {idType === "Passport" && (
                                        <>
                                            <p className='font-18 fw-medium'>Upload an image of Guest passport</p>
                                            <p>Make sure the photo of guest passport isn’t blurry and that it clearly shows the guests face.</p>
                                            <div className="d-flex align-items-center justify-content-start mb-3">
                                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                                    <label className="cursor-pointer d-flex align-items-center gap-2">
                                                        <Image
                                                            src="/images/icons/add_circle.svg"
                                                            width={24}
                                                            height={24}
                                                            alt="Add more photos"
                                                        />
                                                        <span>Add more photos</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleFileChange1}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            <div className="drap-drop-box-full">
                                                {photos.length === 0 ? (
                                                    <label
                                                        onDrop={handleDrop1}
                                                        onDragOver={handleDragOver1}
                                                        style={{ minHeight: '156px' }}
                                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleFileChange1}
                                                            className="hidden"
                                                        />
                                                        <div className="text-center">
                                                            <Image
                                                                src="/images/icons/menu_book.svg"
                                                                alt="Upload"
                                                                width={30}
                                                                height={30}
                                                                className="mx-auto mb-2"
                                                            />
                                                            <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                                                Upload passport
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-500 mb-0"
                                                                style={{ color: "#73615F" }}
                                                            >
                                                                JPEG or PNG only
                                                            </p>
                                                        </div>
                                                    </label>
                                                ) : (
                                                    <div>
                                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                            {photos.map((photo, index) => (
                                                                <div key={index} className="relative inline-block">
                                                                    <Image
                                                                        src={photo.preview}
                                                                        alt={`Uploaded preview ${index + 1}`}
                                                                        width={156}
                                                                        height={156}
                                                                        className="object-cover"
                                                                        style={{ width: '100%', height: '156px' }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removePhoto(index)}
                                                                        className="absolute top-1 right-1 delete-icn"
                                                                    >
                                                                        <Image
                                                                            src="/images/icons/delete.svg"
                                                                            width={20}
                                                                            height={20}
                                                                            alt="delete"
                                                                        />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className='mt-4' >Re-Upload Image</p>
                                        </>
                                    )}
                                    {idType === "Aadhaarcard" && (
                                        <div className="aadhaar-fields mt-3">
                                            <p className='font-18 fw-medium'>Upload images of Guest Aadhaar card</p>
                                            <p>Make sure the photos aren’t blurry and the front of the Aadhaar card clearly shows the guests face.</p>

                                            <Row>
                                                <Col md="6">
                                                    <div className="drap-drop-box-full">
                                                        {photos.length === 0 ? (
                                                            <label
                                                                onDrop={handleDrop1}
                                                                onDragOver={handleDragOver1}
                                                                style={{ minHeight: '156px' }}
                                                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                                            >
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={handleFileChange1}
                                                                    className="hidden"
                                                                />
                                                                <div className="text-center">
                                                                    <Image
                                                                        src="/images/icons/id_card.svg"
                                                                        alt="Upload"
                                                                        width={30}
                                                                        height={30}
                                                                        className="mx-auto mb-2"
                                                                    />
                                                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                                                        Upload front
                                                                    </p>
                                                                    <p
                                                                        className="text-sm text-gray-500 mb-0"
                                                                        style={{ color: "#73615F" }}
                                                                    >
                                                                        JPEG or PNG only
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        ) : (
                                                            <div>
                                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                                    {photos.map((photo, index) => (
                                                                        <div key={index} className="relative inline-block">
                                                                            <Image
                                                                                src={photo.preview}
                                                                                alt={`Uploaded preview ${index + 1}`}
                                                                                width={156}
                                                                                height={156}
                                                                                className="object-cover"
                                                                                style={{ width: '100%', height: '156px' }}
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removePhoto(index)}
                                                                                className="absolute top-1 right-1 delete-icn"
                                                                            >
                                                                                <Image
                                                                                    src="/images/icons/delete.svg"
                                                                                    width={20}
                                                                                    height={20}
                                                                                    alt="delete"
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col md="6">
                                                    <div className="drap-drop-box-full">
                                                        {photos.length === 0 ? (
                                                            <label
                                                                onDrop={handleDrop1}
                                                                onDragOver={handleDragOver1}
                                                                style={{ minHeight: '156px' }}
                                                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                                            >
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={handleFileChange1}
                                                                    className="hidden"
                                                                />
                                                                <div className="text-center">
                                                                    <Image
                                                                        src="/images/icons/bank-card-line1.svg"
                                                                        alt="Upload"
                                                                        width={30}
                                                                        height={30}
                                                                        className="mx-auto mb-2"
                                                                    />
                                                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                                                        Upload back
                                                                    </p>
                                                                    <p
                                                                        className="text-sm text-gray-500 mb-0"
                                                                        style={{ color: "#73615F" }}
                                                                    >
                                                                        JPEG or PNG only
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        ) : (
                                                            <div>
                                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                                    {photos.map((photo, index) => (
                                                                        <div key={index} className="relative inline-block">
                                                                            <Image
                                                                                src={photo.preview}
                                                                                alt={`Uploaded preview ${index + 1}`}
                                                                                width={156}
                                                                                height={156}
                                                                                className="object-cover"
                                                                                style={{ width: '100%', height: '156px' }}
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removePhoto(index)}
                                                                                className="absolute top-1 right-1 delete-icn"
                                                                            >
                                                                                <Image
                                                                                    src="/images/icons/delete.svg"
                                                                                    width={20}
                                                                                    height={20}
                                                                                    alt="delete"
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>

                                        </div>
                                    )}
                                    {idType === "Drivinglicence" && (
                                        <div className="driving-fields mt-3">
                                            <p className='font-18 fw-medium'>Enter Driving Licence Number</p>
                                            <p>Make sure the photos aren’t blurry and the front of the driving licence clearly shows the guests face.</p>
                                            <Row>
                                                <Col md="6">
                                                    <div className="drap-drop-box-full">
                                                        {photos.length === 0 ? (
                                                            <label
                                                                onDrop={handleDrop1}
                                                                onDragOver={handleDragOver1}
                                                                style={{ minHeight: '156px' }}
                                                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                                            >
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={handleFileChange1}
                                                                    className="hidden"
                                                                />
                                                                <div className="text-center">
                                                                    <Image
                                                                        src="/images/icons/id_card.svg"
                                                                        alt="Upload"
                                                                        width={30}
                                                                        height={30}
                                                                        className="mx-auto mb-2"
                                                                    />
                                                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                                                        Upload front
                                                                    </p>
                                                                    <p
                                                                        className="text-sm text-gray-500 mb-0"
                                                                        style={{ color: "#73615F" }}
                                                                    >
                                                                        JPEG or PNG only
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        ) : (
                                                            <div>
                                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                                    {photos.map((photo, index) => (
                                                                        <div key={index} className="relative inline-block">
                                                                            <Image
                                                                                src={photo.preview}
                                                                                alt={`Uploaded preview ${index + 1}`}
                                                                                width={156}
                                                                                height={156}
                                                                                className="object-cover"
                                                                                style={{ width: '100%', height: '156px' }}
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removePhoto(index)}
                                                                                className="absolute top-1 right-1 delete-icn"
                                                                            >
                                                                                <Image
                                                                                    src="/images/icons/delete.svg"
                                                                                    width={20}
                                                                                    height={20}
                                                                                    alt="delete"
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col md="6">
                                                    <div className="drap-drop-box-full">
                                                        {photos.length === 0 ? (
                                                            <label
                                                                onDrop={handleDrop1}
                                                                onDragOver={handleDragOver1}
                                                                style={{ minHeight: '156px' }}
                                                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                                            >
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={handleFileChange1}
                                                                    className="hidden"
                                                                />
                                                                <div className="text-center">
                                                                    <Image
                                                                        src="/images/icons/bank-card-line1.svg"
                                                                        alt="Upload"
                                                                        width={30}
                                                                        height={30}
                                                                        className="mx-auto mb-2"
                                                                    />
                                                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                                                        Upload back
                                                                    </p>
                                                                    <p
                                                                        className="text-sm text-gray-500 mb-0"
                                                                        style={{ color: "#73615F" }}
                                                                    >
                                                                        JPEG or PNG only
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        ) : (
                                                            <div>
                                                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                                    {photos.map((photo, index) => (
                                                                        <div key={index} className="relative inline-block">
                                                                            <Image
                                                                                src={photo.preview}
                                                                                alt={`Uploaded preview ${index + 1}`}
                                                                                width={156}
                                                                                height={156}
                                                                                className="object-cover"
                                                                                style={{ width: '100%', height: '156px' }}
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removePhoto(index)}
                                                                                className="absolute top-1 right-1 delete-icn"
                                                                            >
                                                                                <Image
                                                                                    src="/images/icons/delete.svg"
                                                                                    width={20}
                                                                                    height={20}
                                                                                    alt="delete"
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>


                                        </div>
                                    )}
                                </div>
                            </>
                        )}


                        {nationality === "Foreign" && (
                            <>
                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Personal Details</p>

                                    <p>Enter the following information exactly the same as it appears on the traveler’s passport or ID.</p>


                                    <Row className='g-3'>
                                        <Col md={12}>
                                            <label className='form-label'>First name</label>
                                            <div className='d-flex align-items-center form-group'>
                                                <input type='text' className='form-control' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                                                    <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                                                </button>
                                            </div>
                                        </Col>

                                        <Col md={12}>
                                            <label className='form-label'>Last name</label>
                                            <div className='d-flex align-items-center form-group'>
                                                <input type='text' className='form-control' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                                <button type='button' className='btn ms-2 p-2 d-flex align-center justify-center' style={{ border: '1px solid #463527', width: '48px', height: '48px', borderRadius: '0' }}>
                                                    <Image src='/images/icons/edit.svg' alt='edit' width={20} height={20} />
                                                </button>
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Sex</label>
                                                <select className='form-control' value={sex} onChange={(e) => setSex(e.target.value)}>
                                                    <option>Female</option>
                                                    <option>Male</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Nationality</label>
                                                <select className='form-control' value={nationalitySelect} onChange={(e) => setNationalitySelect(e.target.value)}>
                                                    <option value=''>Select</option>
                                                    <option value='India'>India</option>
                                                    <option value='USA'>USA</option>
                                                    <option value='UK'>UK</option>
                                                </select>
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Date of birth</label>
                                                <DatePicker
                                                    selected={inactiveFrom}
                                                    onChange={(date) => setInactiveFrom(date)}
                                                    placeholderText="Select date"
                                                    className="form-control  custom-date-picker"
                                                    dateFormat="dd/MM/yyyy"

                                                />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Special Category</label>
                                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                                            </div>
                                        </Col>
                                    </Row>

                                </div>


                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Accommodation Details</p>


                                    <div className='form-group mb-4'>
                                        <label>Name</label>
                                        <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.x. GQJ8+V2H Calangute, Goa' />
                                        <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                                    </div>
                                    <Row>
                                        <Col md={8}>
                                            <div className='form-group mb-4'>
                                                <label>Street and number</label>
                                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.street}</span>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className='form-group mb-4'>
                                                <label>Flat/House No.</label>
                                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.flatNo}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className='form-group mb-4'>
                                        <label>City</label>
                                        <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>
                                    <Row>
                                        <Col md={4}>
                                            <div className='form-group mb-4'>
                                                <label>State</label>
                                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.state}</span>
                                            </div>
                                        </Col>
                                        <Col md={8}>
                                            <div className='form-group mb-4'>
                                                <label>PIN code</label>
                                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.pinCode}</span>
                                            </div>
                                        </Col>
                                    </Row>


                                    <div className='form-group mb-4'>
                                        <label>Mobile number</label>
                                        <input type='number' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>


                                </div>


                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Arrival Details</p>


                                    <div className='form-group mb-4'>
                                        <label>Arrived From</label>
                                        <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='Enter' />
                                        <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                                    </div>
                                    <Row>
                                        <Col md={6}>
                                            <div className='form-group mb-4'>
                                                <label>Date of arrival in India</label>
                                                <DatePicker
                                                    selected={inactiveFrom}
                                                    onChange={(date) => setInactiveFrom(date)}
                                                    placeholderText="Select date"
                                                    className="form-control  custom-date-picker"
                                                    dateFormat="dd/MM/yyyy"

                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className='form-group mb-4'>
                                                <label>Date of Arrival in Individual House</label>
                                                <DatePicker
                                                    selected={inactiveFrom}
                                                    onChange={(date) => setInactiveFrom(date)}
                                                    placeholderText="Select date"
                                                    className="form-control  custom-date-picker"
                                                    dateFormat="dd/MM/yyyy"

                                                />                                            </div>
                                        </Col>
                                    </Row>
                                    <div className='form-group mb-4'>
                                        <label>Time of Arrival in Individual House</label>
                                        <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>



                                    <div className='form-group mb-0'>
                                        <label>Intended Duration of Stay in Individual House</label>
                                        <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>


                                </div>



                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Upload an image of Guest passport</p>

                                    <p>EnMake sure the photo of the guest passport isn’t blurry and that it clearly shows the guests face.</p>


                                    <Row className='g-3'>
                                        <Col md={12}>
                                            <div className="d-flex align-items-center justify-content-start mb-3">
                                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                                    <label className="cursor-pointer d-flex align-items-center gap-2">
                                                        <Image
                                                            src="/images/icons/add_circle.svg"
                                                            width={24}
                                                            height={24}
                                                            alt="Add more photos"
                                                        />
                                                        <span>Add more photos</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleFileChange1}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            <div className="drap-drop-box-full">
                                                {photos.length === 0 ? (
                                                    <label
                                                        onDrop={handleDrop1}
                                                        onDragOver={handleDragOver1}
                                                        style={{ minHeight: '156px' }}
                                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleFileChange1}
                                                            className="hidden"
                                                        />
                                                        <div className="text-center">
                                                            <Image
                                                                src="/images/icons/menu_book.svg"
                                                                alt="Upload"
                                                                width={30}
                                                                height={30}
                                                                className="mx-auto mb-2"
                                                            />
                                                            <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                                                Upload passport
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-500 mb-0"
                                                                style={{ color: "#73615F" }}
                                                            >
                                                                JPEG or PNG only
                                                            </p>
                                                        </div>
                                                    </label>
                                                ) : (
                                                    <div>
                                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                            {photos.map((photo, index) => (
                                                                <div key={index} className="relative inline-block">
                                                                    <Image
                                                                        src={photo.preview}
                                                                        alt={`Uploaded preview ${index + 1}`}
                                                                        width={156}
                                                                        height={156}
                                                                        className="object-cover"
                                                                        style={{ width: '100%', height: '156px' }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removePhoto(index)}
                                                                        className="absolute top-1 right-1 delete-icn"
                                                                    >
                                                                        <Image
                                                                            src="/images/icons/delete.svg"
                                                                            width={20}
                                                                            height={20}
                                                                            alt="delete"
                                                                        />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className='mt-4' >Re-Upload Image</p>
                                        </Col>



                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Issuing country/region</label>
                                                <Select
                                                    name="aria-role-select"
                                                    options={sortoption}
                                                    placeholder="Name"
                                                    className="react_selectbox"
                                                    isSearchable={false}
                                                    styles={customStyles}
                                                />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Passport No.</label>
                                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Date of birth</label>
                                                <DatePicker
                                                    selected={inactiveFrom}
                                                    onChange={(date) => setInactiveFrom(date)}
                                                    placeholderText="Select date"
                                                    className="form-control  custom-date-picker"
                                                    dateFormat="dd/MM/yyyy"

                                                />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Expiry Date</label>

                                                <DatePicker
                                                    selected={inactiveFrom}
                                                    onChange={(date) => setInactiveFrom(date)}
                                                    placeholderText="Select date"
                                                    className="form-control  custom-date-picker"
                                                    dateFormat="dd/MM/yyyy"

                                                />

                                            </div>
                                        </Col>
                                    </Row>

                                </div>


                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Upload an image of Guest Visa document</p>

                                    <p>Make sure the photo of guest visa document isn’t blurry and that it clearly shows the guests face.</p>


                                    <Row className='g-3'>
                                        <Col md={12}>
                                            <div className="d-flex align-items-center justify-content-start mb-3">
                                                {photos.length > 0 && photos.length < MAX_PHOTOS && (
                                                    <label className="cursor-pointer d-flex align-items-center gap-2">
                                                        <Image
                                                            src="/images/icons/add_circle.svg"
                                                            width={24}
                                                            height={24}
                                                            alt="Add more photos"
                                                        />
                                                        <span>Add more photos</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleFileChange1}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            <div className="drap-drop-box-full">
                                                {photos.length === 0 ? (
                                                    <label
                                                        onDrop={handleDrop1}
                                                        onDragOver={handleDragOver1}
                                                        style={{ minHeight: '156px' }}
                                                        className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleFileChange1}
                                                            className="hidden"
                                                        />
                                                        <div className="text-center">
                                                            <Image
                                                                src="/images/icons/article_person.svg"
                                                                alt="Upload"
                                                                width={30}
                                                                height={30}
                                                                className="mx-auto mb-2"
                                                            />
                                                            <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                                                Upload visa
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-500 mb-0"
                                                                style={{ color: "#73615F" }}
                                                            >
                                                                JPEG or PNG only
                                                            </p>
                                                        </div>
                                                    </label>
                                                ) : (
                                                    <div>
                                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                            {photos.map((photo, index) => (
                                                                <div key={index} className="relative inline-block">
                                                                    <Image
                                                                        src={photo.preview}
                                                                        alt={`Uploaded preview ${index + 1}`}
                                                                        width={156}
                                                                        height={156}
                                                                        className="object-cover"
                                                                        style={{ width: '100%', height: '156px' }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removePhoto(index)}
                                                                        className="absolute top-1 right-1 delete-icn"
                                                                    >
                                                                        <Image
                                                                            src="/images/icons/delete.svg"
                                                                            width={20}
                                                                            height={20}
                                                                            alt="delete"
                                                                        />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                        </Col>



                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Issuing country/region</label>
                                                <Select
                                                    name="aria-role-select"
                                                    options={sortoption}
                                                    placeholder="Name"
                                                    className="react_selectbox"
                                                    isSearchable={false}
                                                    styles={customStyles}
                                                />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Visa Number</label>
                                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Date of Issue</label>
                                                <DatePicker
                                                    selected={inactiveFrom}
                                                    onChange={(date) => setInactiveFrom(date)}
                                                    placeholderText="Select"
                                                    className="form-control  custom-date-picker"
                                                    dateFormat="dd/MM/yyyy"

                                                />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Valid Till</label>

                                                <DatePicker
                                                    selected={inactiveFrom}
                                                    onChange={(date) => setInactiveFrom(date)}
                                                    placeholderText="Select"
                                                    className="form-control  custom-date-picker"
                                                    dateFormat="dd/MM/yyyy"

                                                />

                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Visa Type</label>
                                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                                            </div>
                                        </Col>


                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className='form-label'>Visa Subtype</label>
                                                <input className='form-control' value={specialCategory} onChange={(e) => setSpecialCategory(e.target.value)} placeholder='Enter' />
                                            </div>
                                        </Col>
                                    </Row>

                                </div>


                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Address in country where residing permanently</p>



                                    <Row>
                                        <Col md={8}>
                                            <div className='form-group mb-4'>
                                                <label>Street and number</label>
                                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.street}</span>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className='form-group mb-4'>
                                                <label>Flat/House No.</label>
                                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.flatNo}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className='form-group mb-4'>
                                        <label>City</label>
                                        <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>
                                    <Row>
                                        <Col md={4}>
                                            <div className='form-group mb-4'>
                                                <label>State</label>
                                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.state}</span>
                                            </div>
                                        </Col>
                                        <Col md={8}>
                                            <div className='form-group mb-4'>
                                                <label>PIN code</label>
                                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.pinCode}</span>
                                            </div>
                                        </Col>
                                    </Row>





                                </div>



                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Address/Reference in India</p>



                                    <Row>
                                        <Col md={8}>
                                            <div className='form-group mb-4'>
                                                <label>Street and number</label>
                                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.street}</span>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className='form-group mb-4'>
                                                <label>Flat/House No.</label>
                                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.flatNo}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className='form-group mb-4'>
                                        <label>City</label>
                                        <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>
                                    <Row>
                                        <Col md={4}>
                                            <div className='form-group mb-4'>
                                                <label>State</label>
                                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.state}</span>
                                            </div>
                                        </Col>
                                        <Col md={8}>
                                            <div className='form-group mb-4'>
                                                <label>PIN code</label>
                                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.pinCode}</span>
                                            </div>
                                        </Col>
                                    </Row>





                                </div>


                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Whether Employed in India</p>

                                    <Row>
                                        <Col md={12} className='d-flex justify-content-start gap-2' >
                                            <div className="radio-select-box d-flex gap-2">
                                                <label className="form-check-label d-flex gap-2">
                                                    <input
                                                        type="radio"
                                                        name="select-employed"
                                                        id="WhetherEmployed-no"
                                                        checked={WhetherEmployed === "No"}
                                                        onChange={() => setWhetherEmployed("No")}
                                                    />
                                                    <span className="radio-checkmark"></span>
                                                    No
                                                </label>
                                            </div>

                                            <div className="radio-select-box d-flex gap-2">
                                                <label className="form-check-label d-flex gap-2" >
                                                    <input
                                                        type="radio"
                                                        name="select-employed"
                                                        id="WhetherEmployed-yes"
                                                        checked={WhetherEmployed === "Yes"}
                                                        onChange={() => setWhetherEmployed("Yes")}
                                                    />
                                                    <span className="radio-checkmark"></span>
                                                    Yes
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>

                                </div>



                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Purpose of Visit</p>

                                    <div className='form-group '>

                                        <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='Enter reason' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>

                                </div>



                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Next Destination</p>


                                    <div className='form-group mb-4'>
                                        <label>Place Name</label>
                                        <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.g. Grand hyatt' />
                                        <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                                    </div>
                                    <Row>
                                        <Col md={8}>
                                            <div className='form-group mb-4'>
                                                <label>Street and number</label>
                                                <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.street}</span>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className='form-group mb-4'>
                                                <label>Flat/House No.</label>
                                                <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.flatNo}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className='form-group mb-4'>
                                        <label>City</label>
                                        <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>
                                    <Row>
                                        <Col md={4}>
                                            <div className='form-group mb-4'>
                                                <label>State</label>
                                                <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.state}</span>
                                            </div>
                                        </Col>
                                        <Col md={8}>
                                            <div className='form-group mb-4'>
                                                <label>PIN code</label>
                                                <input type='number' name='pinCode' className='form-control pincode-flag' onChange={handleInputChange} placeholder='--' />
                                                <span className='text-danger'>{errorMessages.pinCode}</span>
                                            </div>
                                        </Col>
                                    </Row>


                                    <div className='form-group mb-4'>
                                        <label>Mobile number</label>
                                        <input type='number' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.city}</span>
                                    </div>


                                </div>


                                <div className='booking-details-br mt-3'>
                                    <p className='font-18 fw-medium'>Additional comments/ remarks</p>

                                    <div className='form-group '>

                                        <textarea className='form-control' placeholder="Add your message here"></textarea>
                                    </div>

                                </div>



                            </>

                        )}

                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between modern-footer'>
                    <Button variant=""
                        // onClick={updateDateClose3}
                        className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={() => {
                        // updateDateClose3();
                        setSmShow(true);

                    }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Complete
                    </Button>
                </Modal.Footer>
            </Modal> */}
            {/* <CheckInFormalitiesModal
                checkInFormalities={checkInFormalities}
                CheckInFormalitiesClose={CheckInFormalitiesClose}
                nationality={nationality}
                setNationality={setNationality}
                idType={idType}
                photos={photos}
                handleDrop1={handleDrop1}
                handleDragOver1={handleDragOver1}
                handleFileChange1={handleFileChange1}

            /> */}
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
                fetchDataFunction={getBookingDetails}
            />}

            <CheckoutModal
                checkoutModal={checkoutModal}
                CheckoutClose={CheckoutClose}
                fetchDataFunction={getBookingDetails}
                bookingDetailData={bookingDetailData}
            />



            <GiveFeedbackModal
                giveReviewModal={giveReviewModal}
                handleCloseGiveReviewModal={handleCloseGiveReviewModal}
                fetchDataFunction={getBookingDetails}
                bookingDetailData={bookingDetailData}
            />



            {/* Read Review */}


            <ViewFeedbackModal
                viewFeedbackModal={viewFeedbackModal}
                handleCloseFeedbackModal={handleCloseFeedbackModal}
                fetchDataFunction={getBookingDetails}
                bookingDetailData={bookingDetailData}
            />





        </>
    )
}