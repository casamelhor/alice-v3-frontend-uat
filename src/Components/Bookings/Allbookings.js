"use client"
import React, { useEffect, useState, useRef } from "react";
import Header from '../Header/Header'
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Card, Form, Accordion, Label } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BookingsListAPI, DynamicFiltersAPI, ExportBookingAPI } from "@/services/provider";
import SourceBadge from "../Integrations/SourceBadge"; // integration: alice_v3_claude — w7
import Pagination from 'react-bootstrap/Pagination';
import { ModifyCheckout } from "../commons/ModifyCheckout";
import { ModifyDateModal } from "../commons/ModifyDateModal";
import { MarkNoShowModal } from "../commons/MarkNoShowModal";
import { CheckInFormalitiesModal } from "../commons/CheckInFormalitiesModal";
import { CheckInModal } from "../commons/CheckInModal";
import { CheckoutModal } from "../commons/CheckoutModal";
import { CancelBookingModal } from "../commons/CancelBookingModal";
import { ToastContainer } from 'react-toastify';
import { downloadCSV, downloadPdfFromBase64 } from "@/utils/datatypecheck";
import { GiveFeedbackModal } from "../commons/GiveFeedbackModal";
import { ViewFeedbackModal } from "../commons/ViewFeedbackModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { getItemLocalStorage } from "@/utils/browserStorage";
import { checkPermission } from "@/utils/helper";

export default function Allbookings() {

    const getId = (item) => item?.uid ?? item?.id;

    const toLocalDateString = (d) => {
        if (!d) return "";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionBookingMain = checkPermission(permissionArray, "booking");
    const permissionBookingCheckin = checkPermission(permissionArray, "booking_checkin");
    const permissionBookingReview = checkPermission(permissionArray, "booking_review");
    const permissionCompany = checkPermission(permissionArray, "company");

    const canAdd = permissionBookingMain === true || permissionBookingMain?.can_add;
    const canList = permissionBookingMain === true || permissionBookingMain?.can_list;
    const canRetrieve = permissionBookingMain === true || permissionBookingMain?.can_retrieve;
    const canUpdate = permissionBookingMain === true || permissionBookingMain?.can_update;
    const canDelete = permissionBookingMain === true || permissionBookingMain?.can_delete;
    const canListCompany = permissionCompany === true || permissionCompany?.can_list;

    //booking check-In 
    const canUpdateBooking = permissionBookingCheckin === true || permissionBookingCheckin?.can_update;
    //booking review
    const canAddGive = permissionBookingReview === true || permissionBookingReview?.can_add
    const canRetrieveReview = permissionBookingReview === true || permissionBookingReview?.can_retrieve;

    const searchParams = useSearchParams();
    const paramUid = searchParams.get("guest_uid");
    const paramCompanyUid = searchParams.get("company_uid");
    // const only_my_booking = searchParams.get("onlymy");
    const router = useRouter();
    const wrapperRef = useRef(null);
    const [isStep2, setIsStep2] = useState(false);
    const [addTravels, addTravelsetShow] = useState(false);
    const addTravel = () => addTravelsetShow(true);
    // const [optionInput, setOptionInput] = useState("");
    const [bookedByInput, setBookedByInput] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [propertyInput, setPropertyInput] = useState("");

    const [optionsBookedByList, setOptionsBookedByList] = useState([]);
    const [optionsLocationList, setOptionsLocationList] = useState([]);
    const [optionsPropertyList, setOptionsPropertyList] = useState([]);
    const [showBookedByList, setShowBookedByList] = useState(false);
    const [showLocationList, setShowLocationList] = useState(false);
    const [showPropertyList, setPropertyShowList] = useState(false);
    const [filteredBookedByList, setFilteredBookedByList] = useState([]);
    const [filteredPropertyList, setFilteredPropertyList] = useState([]);
    const [filteredLocationList, setFilteredLocationList] = useState([]);
    const [pagination, setPagination] = useState()
    const [tabCount, setTabCount] = useState(null)
    const [smShow, setSmShow] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [filtersFromRes, setFiltersfromRes] = useState(null)
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [filtermShow, filtersetShow] = useState(false);
    const [viewType, setViewType] = React.useState('list');
    const [openPicIndex, setOpenPicIndex] = useState(null);
    const [changepicsModal, changepisetShow] = useState(false);
    const [cancelbooksModal, cancelbooksetShow] = useState(false);
    const [updateDatesModal, updateDatesetShow] = useState(false);
    const [updateDatesModal1, updateDatesetShow1] = useState(false);
    const [updateDatesModal2, updateDatesetShow2] = useState(false);
    const [updateDatesModal3, updateDatesetShow3] = useState(false);
    // const [marknoShowsModal, marknoShowsetShow] = useState(false);
    const [inactiveFrom, setInactiveFrom] = useState(null);
    const [inactiveTo, setInactiveTo] = useState(null);
    const [assignments, setAssignments] = useState([])
    const [nationality, setNationality] = useState("Indian");
    const [idType, setIdType] = useState("Passport");
    const [passImage, setPassImage] = useState([]);
    const [visaImage, setVisaImage] = useState([]);
    const [docTypeImage, setDocTypeImage] = useState([]);
    const [coverIndex, setCoverIndex] = useState(null);
    const [files, setFiles] = useState([]);
    const [bookingDetailData, setBookingDetailData] = useState({});
    const [filteredOptions, setFilteredOptions] = useState({
        tab: "all",
        search: "",
        companies: paramCompanyUid ? paramCompanyUid : "",
        properties: "",
        locations: "",
        booked_by: "",
        date_type: "",
        date_from: "",
        date_to: "",
        only_my_booking: false,
        sort_by: "",
        page: 1,
        page_size: 10,  // you can set default too
        booking_source: "", // integration: alice_v3_claude — w7 — Source filter (Alice / Quest2Travel / MakeMyTrip)
        traveler_uid: paramUid ? paramUid : ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [booking_count, setBooking_count] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBookedBy, setSelectedBookedBy] = useState(null);
    // const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState(
        paramCompanyUid ? [String(paramCompanyUid)] : []
    );
    const [tempDateFilter, setTempDateFilter] = useState({
        date_type: "date_from",
        date_from: "",
        date_to: ""
    });




    // Handle add option on Enter/Tab
    const handleOptionKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === "Tab") && optionInput.trim()) {
            e.preventDefault();
            setOptionsList([...optionsList, optionInput.trim()]);
            setOptionInput("");
        }
    };

    // Remove option chip
    // const handleRemoveOption = (idx) => {
    //     setOptionsList(optionsList.filter((_, i) => i !== idx));
    // };
    // ADD these three instead:
    // const handleRemoveBookedBy = () => {
    //     setOptionsBookedByList([]);
    //     setSelectedBookedBy(null);
    //     setBookedByInput("");
    // };

    // const handleRemoveLocation = (idx) => {
    //     setOptionsLocationList(prev => prev.filter((_, i) => i !== idx));
    // };

    // const handleRemoveProperty = (idx) => {
    //     setOptionsPropertyList(prev => prev.filter((_, i) => i !== idx));
    // };
    const handleRemoveBookedBy = (idx) => {
        setOptionsBookedByList(prev => prev.filter((_, i) => i !== idx));
    };

    const handleRemoveLocation = (idx) => {
        setOptionsLocationList(prev => prev.filter((_, i) => i !== idx));
    };

    const handleRemoveProperty = (idx) => {
        setOptionsPropertyList(prev => prev.filter((_, i) => i !== idx));
    };
    // const filterClose = () => {
    //     filtersetShow(false);
    //     setFilteredOptions({
    //         ...filteredOptions, tab: "all",
    //         companies: "",
    //         properties: "",
    //         locations: "",
    //         booked_by: "",
    //         date_type: "",
    //         date_from: "",
    //         date_to: "",
    //     })
    // };
    // const filterClose = () => {
    //     filtersetShow(false);
    //     setFilteredOptions({
    //         ...filteredOptions,
    //         companies: paramCompanyUid ? paramCompanyUid : "",
    //         properties: "",
    //         locations: "",
    //         booked_by: "",
    //         date_type: "",
    //         date_from: "",
    //         date_to: "",
    //     });
    //     setSelectedCompanies([]);
    //     setSelectedBookedBy(null);
    //     setOptionsLocationList([]);
    //     setOptionsPropertyList([]);
    //     setInactiveFrom(null);
    //     setInactiveTo(null);
    // };
    // const filterClose = () => {
    //     filtersetShow(false);
    //     setFilteredOptions({
    //         ...filteredOptions,
    //         companies: paramCompanyUid ? paramCompanyUid : "",
    //         properties: "",
    //         locations: "",
    //         booked_by: "",
    //         date_type: "",
    //         date_from: "",
    //         date_to: "",
    //     });
    //     setSelectedCompanies([]);
    //     setSelectedBookedBy(null);
    //     setOptionsLocationList([]);
    //     setOptionsPropertyList([]);
    //     setOptionsBookedByList([]);
    //     setInactiveFrom(null);
    //     setInactiveTo(null);
    //     // Reset all three inputs
    //     setBookedByInput("");
    //     setLocationInput("");
    //     setPropertyInput("");
    // };
    // const filterClose = () => {
    //     filtersetShow(false);
    //     setFilteredOptions({
    //         ...filteredOptions,
    //         companies: paramCompanyUid ? paramCompanyUid : "",
    //         properties: "",
    //         locations: "",
    //         booked_by: "",
    //         date_type: "",
    //         date_from: "",
    //         date_to: "",
    //     });
    //     setSelectedCompanies([]);
    //     setOptionsBookedByList([]);
    //     setOptionsLocationList([]);
    //     setOptionsPropertyList([]);
    //     setInactiveFrom(null);
    //     setInactiveTo(null);
    //     setBookedByInput("");
    //     setLocationInput("");
    //     setPropertyInput("");
    // };
    // const filterShow = () => {
    //     filtersetShow(true);
    //     setFilteredOptions({ ...filteredOptions, date_type: "date_from" })
    // };
    const filterShow = () => filtersetShow(true);

    // Closing the modal should NOT wipe applied filters
    const filterClose = () => filtersetShow(false);

    const clearAllFilters = () => {
        setSelectedCompanies([]);
        setOptionsBookedByList([]);
        setOptionsLocationList([]);
        setOptionsPropertyList([]);
        setInactiveFrom(null);
        setInactiveTo(null);
        setBookedByInput("");
        setLocationInput("");
        setPropertyInput("");
        setTempDateFilter({ date_type: "date_from", date_from: "", date_to: "" });
        setFilteredOptions(prev => ({
            ...prev,
            // companies: paramCompanyUid || "",
            companies: "",
            properties: "",
            locations: "",
            booked_by: "",
            date_type: "",
            date_from: "",
            date_to: "",
            page: 1,
        }));
        // filtersetShow(false);
    };

    const getBookedByName = (key) =>
        filtersFromRes?.booked_by?.find(i => String(getId(i)) === String(key))?.name ?? key;

    const getPropertyName = (key) =>
        filtersFromRes?.properties?.find(p => String(getId(p)) === String(key))?.property_name ?? key;

    const handleViewToggle = (type) => setViewType(type);

    const togglePicOption1 = (e, idx) => {
        e.preventDefault();
        setOpenPicIndex(openPicIndex === idx ? null : idx);
        if (typeof toggleoptio1 === 'function') {
            toggleoptio1();
        }
    }

    const sortoption = [
        { value: "booking-Status", label: "Booking Status" },
        { value: "Less-trips", label: "BR Name" }
    ]

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

    const changepicClose = () => changepisetShow(false);
    const changepicModal = () => changepisetShow(true);
    const cancelbookClose = () => cancelbooksetShow(false);
    const cancelbookModal = () => cancelbooksetShow(true);

    const updateDateModal = () => updateDatesetShow(true);

    const updateDateModal1 = () => updateDatesetShow1(true);

    const updateDateModal2 = () => updateDatesetShow2(true);

    const updateDateModal3 = () => updateDatesetShow3(true);
    // const marknoShowClose = () => marknoShowsetShow(false);
    // const marknoShowModal = () => marknoShowsetShow(true);

    const [showCheckInModal, setShowCheckInModal] = useState(false);

    const checkInModalClose = () => setShowCheckInModal(false);
    const checkInModal = () => setShowCheckInModal(true);
    const [showModifyCheckout, setShowModifyCheckout] = useState(false);

    const handleModifyCheckoutClose = () => setShowModifyCheckout(false);
    const handleModifyCheckout = () => setShowModifyCheckout(true);

    const [marknoShowsModal, marknoShowsetShow] = useState(false);

    const marknoShowClose = () => marknoShowsetShow(false);
    const marknoShowModal = () => marknoShowsetShow(true);

    const [checkInFormalities, setCheckInFormalities] = useState(false);

    const CheckInFormalitiesClose = () => setCheckInFormalities(false);
    const CheckInFormalitiesShowModal = () => setCheckInFormalities(true);

    const [checkoutModal, setCheckoutModal] = useState(false);

    const CheckoutClose = () => setCheckoutModal(false);
    const CheckoutShowModal = () => setCheckoutModal(true);

    // const reasonsOption = [
    //     { value: "reason1", label: "Reason 1" },
    //     { value: "reason1", label: "Reason 2" },
    // ]

    // Personal details fields

    const MAX_PHOTOS = 1;

    // Drag & drop
    const handleDrop1 = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const totalFiles = [...files, ...droppedFiles].slice(0, 5);

        setFiles(totalFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        })));
    };

    // const handleFileChange1 = (e, images, setImages, side = null) => {
    //     const selectedFiles = Array.from(e.target.files);
    //     if (!selectedFiles.length) return;

    //     // 👉 CASE 1: FRONT / BACK MODE
    //     if (side) {
    //         const file = selectedFiles[0];

    //         const imageObj = {
    //             file,
    //             localImageRes: URL.createObjectURL(file),
    //             side: side
    //         };

    //         setImages(prev => {
    //             const updated = [...(prev || [])];

    //             if (side === "front") updated[0] = imageObj;
    //             if (side === "back") updated[1] = imageObj;

    //             return updated;
    //         });

    //         return;
    //     }


    //     const newImages = selectedFiles
    //         .slice(0, MAX_PHOTOS - (images?.length || 0))
    //         .map(file => ({
    //             file,
    //             localImageRes: URL.createObjectURL(file),
    //         }));

    //     setImages(prev => [...(prev || []), ...newImages]);
    // };


    const handleFileChange1 = (e, images, setImages, side = null) => {
        const selectedFiles = Array.from(e.target.files);
        if (!selectedFiles.length) return;

        // ✅ CASE 1: FRONT / BACK MODE (Aadhaar)
        if (side) {
            const file = selectedFiles[0];

            const imageObj = {
                file,
                localImageRes: URL.createObjectURL(file),
                side: side
            };

            setImages(prev => {
                const updated = [...(prev || [])];

                if (side === "front") updated[0] = imageObj;
                if (side === "back") updated[1] = imageObj;

                return updated;
            });

            return;
        }

        // ✅ CASE 2: NORMAL MULTIPLE UPLOAD (Passport / Visa)
        const newImages = selectedFiles.map(file => ({
            file,
            localImageRes: URL.createObjectURL(file)
        }));

        setImages(prev => [...(prev || []), ...newImages]);
    };



    const removePhoto = (index, setImages) => {
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

    // Remove single file
    const removeFile1 = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const getBookingFilters = async () => {
        try {
            const response = await DynamicFiltersAPI()
            if (response.data.success) {
                setFiltersfromRes(response.data.response);
                setFilteredBookedByList(response.data.response.booked_by || []);
                setFilteredLocationList(response.data.response.locations || []);
                setFilteredPropertyList(response.data.response.properties || []);
            }
        } catch (error) {
            console.log("Error feching booking filters:", error);
        }
    }

    const getBookingListData = async () => {
        try {
            const response = await BookingsListAPI(filteredOptions)
            if (response.data.success) {
                setAssignments(response.data.response.bookings)
                setPagination(response.data.response.pagination)
                setTabCount(response.data.response?.tab_counts)
                // setOptionsBookedByList(response.data.response?.filters_applied?.booked_by || []);
                // setOptionsLocationList(response.data.response?.filters_applied?.locations || []);
                // setOptionsPropertyList(response.data.response?.filters_applied?.properties)
                setBooking_count(response.data.response.pagination.total_items);
                setTotalPages(response.data.response.pagination.total_pages)
            }
        } catch (error) {
            console.log("Error feching booking filters:", error);
        }
    }

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
    const formatBookingCreated = (date) => {
        if (!date) return "";

        const startDate = new Date(date);


        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleString("en-US", { month: "short" });
        const startYear = startDate.getFullYear();



        return `${startDay} ${startMonth}, ${startYear}`;

    };


    useEffect(() => {
        // Initialize all tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map((tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl));
        getBookingFilters();
        // getBookingListData();
    }, []);

    useEffect(() => {
        getBookingListData();
    }, [filteredOptions])

    const handlePageChange = (page) => {
        setFilteredOptions(prev => ({
            ...prev,
            page
        }));
    };

    // useEffect(() => {
    //     function handleClickOutside(e) {
    //         if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
    //             setShowBookedByList(false);
    //             setShowLocationList(false);
    //             setPropertyShowList(false);
    //         }
    //     }
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, []);
    useEffect(() => {
        function handleClickOutside(e) {
            if (!e.target.closest("[data-filter-dropdown]")) {
                setShowBookedByList(false);
                setShowLocationList(false);
                setPropertyShowList(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // FILTER LIST
    // useEffect(() => {
    //     if (optionInput.trim() === "") {
    //         setFilteredBookedByList(filtersFromRes?.booked_by);
    //     } else {
    //         const search = optionInput.toLowerCase();
    //         setFilteredBookedByList(filtersFromRes?.booked_by.filter(o => o.toLowerCase().includes(search)));
    //     }
    // }, [optionInput]);

    // useEffect(() => {
    //     if (optionInput.trim() === "") {
    //         setFilteredBookedByList(filtersFromRes?.booked_by || []);
    //     } else {
    //         const search = optionInput.toLowerCase();
    //         setFilteredBookedByList(
    //             filtersFromRes?.booked_by?.filter(o =>
    //                 o.name.toLowerCase().includes(search)
    //             ) || []
    //         );
    //     }
    // }, [optionInput, filtersFromRes]);

    useEffect(() => {
        if (bookedByInput.trim() === "") {
            setFilteredBookedByList(filtersFromRes?.booked_by || []);
        } else {
            const search = bookedByInput.toLowerCase();
            setFilteredBookedByList(
                filtersFromRes?.booked_by?.filter(o =>
                    o.name.toLowerCase().includes(search)
                ) || []
            );
        }
    }, [bookedByInput, filtersFromRes]);

    // ADD new effect for Location filter:
    useEffect(() => {
        if (locationInput.trim() === "") {
            setFilteredLocationList(filtersFromRes?.locations || []);
        } else {
            const search = locationInput.toLowerCase();
            setFilteredLocationList(
                filtersFromRes?.locations?.filter(loc =>
                    loc.toLowerCase().includes(search)
                ) || []
            );
        }
    }, [locationInput, filtersFromRes]);

    // ADD new effect for Property filter:
    useEffect(() => {
        if (propertyInput.trim() === "") {
            setFilteredPropertyList(filtersFromRes?.properties || []);
        } else {
            const search = propertyInput.toLowerCase();
            setFilteredPropertyList(
                filtersFromRes?.properties?.filter(p =>
                    p.property_name.toLowerCase().includes(search)
                ) || []
            );
        }
    }, [propertyInput, filtersFromRes]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newData = { [name]: value }
        setFormData({
            ...formData,
            [name]: value
        })
        const { errors } = addCompanyValidation(newData)
        setErrorMessages({
            ...errorMessages,
            ...errors
        })
    }

    const timeOption = [
        { value: "2pm", label: "2.00 P.M." },
        { value: "3pm", label: "3.00 P.M." },
        { value: "4pm", label: "4.00 P.M." },
    ]

    const arrivalOption = [
        { value: "Flight", label: "Flight" }
    ]

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

    const downloadCSV = (csvContent, filename = "data.csv") => {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleParameters = async (format) => {
        try {
            const payload = {
                export_format: format,
                tab: filteredOptions.tab,
                // search: filteredOptions.search,
                // sort_by: filteredOptions.sort_by,
                // only_my_bookings: filteredOptions.only_my_booking,
                // date_type: filteredOptions.date_type,
                // date_from: filteredOptions.date_from,
                // date_to: filteredOptions.date_to,
                // booked_by: filteredOptions.booked_by,
                // companies: filteredOptions.companies,
                // location: filteredOptions.locations,
                // properties: filteredOptions.properties
            }
            const response = await ExportBookingAPI(payload);
            if (response?.data?.success) {
                if (format == "csv") {
                    downloadCSV(response.data.content, response.data.filename)
                }
                if (format == "pdf") {
                    downloadPdfFromBase64(response.data.content, response.data.filename)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const [giveReviewModal, setGiveReviewModal] = useState(false);
    const handleCloseGiveReviewModal = () => setGiveReviewModal(false);
    const handleGiveReviewModal = () => setGiveReviewModal(true);
    const [viewFeedbackModal, setViewFeedbackModal] = useState(false);
    const handleCloseFeedbackModal = () => setViewFeedbackModal(false);
    const handleFeedbackModal = () => setViewFeedbackModal(true);

    // Calculate start and end indices
    const start = assignments.length > 0 ? (filteredOptions.page - 1) * pageSize + 1 : 0;
    const end = Math.min(filteredOptions.page * pageSize, booking_count);

    const activeFilterCount = [
        filteredOptions.companies,
        filteredOptions.properties,
        filteredOptions.locations,
        filteredOptions.booked_by,
        (filteredOptions.date_from || filteredOptions.date_to) ? "date" : "",
    ].filter(Boolean).length;


    return (
        <>
            <Header />
            {/* <ToastContainer /> */}
            <Toaster position="top-right" />

            <div className='page-body  pt-4 pb-4'>

                <section className='people-section'>
                    <Container>
                        <Row className='align-items-center mb-4'>

                            <Col md={12}>
                                <div className='d-flex align-items-center justify-content-between mb-4'>
                                    <div className='general-info'>
                                        <h2 className='page-title'> Bookings</h2>
                                    </div>

                                    <div className='d-flex gap-2'>
                                        {/* {canList && (
                                            <Button variant="" className='btn-filter position-relative selected-list-border' onClick={filterShow} >
                                                <span className="selected-item">2</span>
                                                
                                                <Image src='./images/icons/filter.svg' className='img-fluid' width={24} height={24} alt='filter' />
                                            </Button>
                                        )} */}
                                        {canList && (
                                            <Button variant="" className={`btn-filter position-relative ${activeFilterCount > 0 ? 'selected-list-border' : ''}`} onClick={filterShow}>
                                                {activeFilterCount > 0 && (
                                                    <span className="selected-item">{activeFilterCount}</span>
                                                )}
                                                <Image src='./images/icons/filter.svg' className='img-fluid' width={24} height={24} alt='filter' />
                                            </Button>
                                        )}


                                        {canList && (
                                            <div style={{ position: 'relative' }}>
                                                <Button variant="" className='btn-filter-export position-relative gap-3' style={{ color: '#000' }} onClick={() => setShowExportDropdown(s => !s)}>
                                                    Export
                                                    <span> <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' width={10} height={10} alt='filter' /></span>
                                                </Button>
                                                {showExportDropdown && (
                                                    <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 10, background: '#fff', border: '1px solid #463527', boxShadow: '0 2px 8px #4635271F', minWidth: '260px' }}>
                                                        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                                            <Image src='/images/icons/file-pdf.svg' width={24} height={24} alt='PDF' />
                                                            <span style={{ color: '#463527' }} onClick={() => handleParameters('pdf')}>as PDF for Current Parameters</span>
                                                        </div>
                                                        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                                            <Image src='/images/icons/file-excel.svg' width={24} height={24} alt='CSV' />
                                                            <span style={{ color: '#463527' }} onClick={() => handleParameters('csv')}>as CSV for current parameters</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {canList && (
                                            <div className='d-flex gap-2'>
                                                <Button
                                                    className={`btn-filter position-relative`}
                                                    onClick={() => handleViewToggle(viewType === 'list' ? 'grid' : 'list')}
                                                    style={{ background: '#f5f5f5' }}
                                                    variant=""
                                                >
                                                    {viewType === 'list' ? (
                                                        <Image
                                                            src='./images/icons/list-view.svg'
                                                            className='img-fluid'
                                                            width={24}
                                                            height={24}
                                                            alt='List View'
                                                        />
                                                    ) : (
                                                        <Image
                                                            src='./images/icons/grid-view.svg'
                                                            className='img-fluid'
                                                            width={24}
                                                            height={24}
                                                            alt='Grid View'
                                                        />
                                                    )}
                                                </Button>
                                            </div>
                                        )}

                                        {canAdd && (
                                            <Link href="/CreateBooking" onClick={addTravel} className='btn-company-add '  > <span style={{ fontSize: '24px' }}> + </span>  Create Booking  </Link>
                                        )}

                                    </div>
                                </div>

                            </Col>

                            <Col md={12}>
                                <div className='search-box mb-5'>
                                    <input type='text' onChange={(e) => { setFilteredOptions({ ...filteredOptions, search: e?.target?.value }) }} placeholder='Search id’s, trips, travelers, or locations ' className='form-control' />
                                    <button className='btn btn-search'>
                                        <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                                    </button>
                                </div>
                            </Col>

                            {/* integration: alice_v3_claude — w7 — Source filter */}
                            <Col md={12} className="d-flex justify-content-end mb-2">
                                <label className="d-flex align-items-center gap-2 mb-0" style={{ fontSize: 14 }}>
                                    Source
                                    <select
                                        className="form-select form-select-sm"
                                        style={{ width: 180 }}
                                        value={filteredOptions.booking_source}
                                        onChange={(e) => setFilteredOptions({ ...filteredOptions, page: 1, booking_source: e.target.value })}
                                    >
                                        <option value="">All sources</option>
                                        <option value="alice">Alice</option>
                                        <option value="q2t">Quest2Travel</option>
                                        <option value="mmt">MakeMyTrip</option>
                                    </select>
                                </label>
                            </Col>
                            <Col md={12} >
                                <Tabs
                                    defaultActiveKey="all"
                                    id="uncontrolled-tab-example"
                                    className="mb-3 employee-tabs"
                                    onSelect={(k) => {
                                        setFilteredOptions({ ...filteredOptions, page: 1, tab: k })
                                    }}

                                >
                                    <Tab eventKey="all" title="All">
                                        {canList && (
                                            <>
                                                <div className="property-listview" style={{ display: viewType === 'list' ? 'block' : 'none' }}>

                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>

                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    checked={filteredOptions.only_my_booking ? true : false}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>

                                                            {/* <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p> */}
                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{booking_count ? booking_count : 0}</strong>  Bookings  </p>
                                                        </div>


                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                                <p className='mb-0'>
                                                                    {booking_count > 0
                                                                        ? `${start}-${end} of ${booking_count}`
                                                                        : "0 results"}
                                                                </p>

                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${filteredOptions.page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    // onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                    onClick={() => filteredOptions.page > 1 && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page > 1 ? prev.page - 1 : 1   // prevent going below 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === 1 ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${filteredOptions.page === totalPages ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    // onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                    onClick={() => filteredOptions.page < totalPages && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page + 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === totalPages ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>

                                                    </div>

                                                    <Table className='desktop-emp employee-table company-table' responsive>
                                                        <thead>
                                                            <tr>
                                                                <th  > <div className="mwid-20">ID</div> </th>
                                                                <th  ><div className="mwid-20">Guests</div></th>
                                                                <th  ><div className="mwid-20">Stay dates</div></th>
                                                                <th  ><div className="mwid-20">Booking Created </div> </th>
                                                                <th ><div className="desk-35 mwidbr-20">BR </div> </th>
                                                                <th><div className="mwid-25">Status</div></th>
                                                                <th><div className="mwid-20">Progress</div></th>


                                                                <th style={{ width: '10%', textAlign: 'right' }} >
                                                                    <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' /></div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {assignments.map((assignment, idx) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-3'>
                                                                            {assignment.id}
                                                                            <SourceBadge source={assignment.booking_source} reference={assignment.source_reference} compact />{/* integration: alice_v3_claude — w7 */}
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>
                                                                            <p className='mb-0'>
                                                                                <span style={{ fontWeight: '500' }} > {assignment.traveler_name} </span>
                                                                                <br></br><small>
                                                                                    {assignment.traveler_role}
                                                                                </small>
                                                                            </p>
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>
                                                                                <br></br>
                                                                                <small>{assignment.total_nights} Nights</small>
                                                                            </p>

                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>
                                                                                <span style={{ fontWeight: '500' }} > {formatBookingCreated(assignment.created_at)}</span>
                                                                                <br></br>
                                                                                <small>by {assignment.created_by_name}</small>
                                                                            </p>

                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="desk-35"> {assignment.property_name},{assignment.room_name},{assignment.property_city} </div>
                                                                    </td>
                                                                    <td>
                                                                        <span
                                                                            className={

                                                                                assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                                    assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                                        assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                            assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                                assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                                    assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                                        assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                            assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                                assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                            }

                                                                            style={{ lineHeight: '16px' }}>
                                                                            {assignment.booking_status}
                                                                        </span >
                                                                    </td>
                                                                    <td>
                                                                        {/* <span style={{ color: '#BF9039' }} >  {assignment.progress} </span> */}
                                                                        <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                            {getBookingProgress(assignment)}
                                                                        </p>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex justify-between align-items-center'>
                                                                            <Link
                                                                                href={`/BookingDetails/${assignment?.uid}`}
                                                                                className={`btn-table-action ${(!canRetrieve || !assignment?.available_actions.includes("view_details")) ? "disabled-link opacity-25" : ""}`}
                                                                                onClick={(e) => {
                                                                                    if (!canRetrieve || !assignment?.available_actions.includes("view_details")) e.preventDefault();  // stop navigation if disabled
                                                                                }}
                                                                            >
                                                                                Details
                                                                            </Link>
                                                                            <div className='bt-abs position-relative'>
                                                                                <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                    <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                </Link>

                                                                                <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                                    {/* Check-in Formalities */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            CheckInFormalitiesShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                            Check-in Formalities
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Check-in */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            checkInModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                            Check-in
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Modify Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            handleModifyCheckout();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                            Modify Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            CheckoutShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                            Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Modify Dates */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            changepicModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                            Modify Dates
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Mark as No Show */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            marknoShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                            Mark as No Show
                                                                                        </Link>
                                                                                    </li>

                                                                                    <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleGiveReviewModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            Give Feedback
                                                                                        </Link>
                                                                                    </li>


                                                                                    <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleFeedbackModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            View Feedback
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Cancel Booking */}
                                                                                    {canDelete && (
                                                                                        <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                            <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                                onClick={() => {
                                                                                                    cancelbookModal();
                                                                                                    setBookingDetailData(assignment);
                                                                                                }}>
                                                                                                Cancel Booking
                                                                                            </Link>
                                                                                        </li>
                                                                                    )}

                                                                                </ul>

                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="property-gridview" style={{ display: viewType === 'grid' ? 'block' : 'none' }} >
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>

                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>

                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>


                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {assignments.map((assignment, idx) => (<div key={idx} className='booking-card-grid mb-4'>
                                                        <div className='booking-list-details'>
                                                            <div className='booking-grid-header mb-2'>
                                                                <div className='d-flex justify-between'>
                                                                    <h3 className='font-24'>{assignment.traveler_name}</h3>


                                                                    <div className='bt-abs position-relative'>
                                                                        <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                            <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                        </Link>

                                                                        <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            {/* Check-in Formalities */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Check-in */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    checkInModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            {/* Modify Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    handleModifyCheckout();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            {/* Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    CheckoutShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Modify Dates */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    changepicModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            {/* Mark as No Show */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    marknoShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleGiveReviewModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    Give Feedback
                                                                                </Link>
                                                                            </li>


                                                                            <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleFeedbackModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    View Feedback
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Cancel Booking */}
                                                                            {canDelete && (
                                                                                <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                    <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                        onClick={() => {
                                                                                            cancelbookModal();
                                                                                            setBookingDetailData(assignment);
                                                                                        }}>
                                                                                        Cancel Booking
                                                                                    </Link>
                                                                                </li>
                                                                            )}

                                                                        </ul>

                                                                    </div>
                                                                </div>


                                                                <p className='d-flex ' style={{ lineHeight: '24px', fontSize: '14px' }} >1 adult | &nbsp; <span style={{ lineHeight: '18px' }} className={

                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>{assignment.booking_status}</span>  </p>


                                                            </div>

                                                            <hr></hr>

                                                            <ul className='room-list2 mb-0'>
                                                                <li  > <span>{formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>  {assignment.total_nights} nights</li>

                                                                <li > <span> {assignment.property_name},{assignment.room_name},{assignment.property_city} </span></li>


                                                                <li  > Booked <span>{formatBookingDates(assignment.check_in_date, null, "booked")} </span> by {assignment.created_by_name}</li>


                                                                <li  > Booking Id <span>{assignment.booking_number} </span><SourceBadge source={assignment.booking_source} reference={assignment.source_reference} />{/* integration: alice_v3_claude — w7 */}</li>
                                                            </ul>

                                                        </div>

                                                        <div className='booking-grid-img'>
                                                            <span className='progress-br-span' >{getBookingProgress(assignment)}</span>
                                                            <Image src='/images/icons/property-br.jpg' width={400} height={250} alt='Booking Image' className='img-fluid' />
                                                        </div>
                                                    </div>))}
                                                </div>
                                            </>
                                        )}
                                    </Tab>
                                    <Tab eventKey="active" title="Active">
                                        {canList && (
                                            <>
                                                <div className="property-listview" style={{ display: viewType === 'list' ? 'block' : 'none' }}>

                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>

                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>

                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>


                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className='mb-0'>
                                                                    {booking_count > 0
                                                                        ? `${start}-${end} of ${booking_count}`
                                                                        : "0 results"}
                                                                </p>

                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${filteredOptions.page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    // onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                    onClick={() => filteredOptions.page > 1 && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page > 1 ? prev.page - 1 : 1   // prevent going below 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === 1 ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${filteredOptions.page === totalPages ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    // onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                    onClick={() => filteredOptions.page < totalPages && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page + 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === totalPages ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>

                                                    </div>

                                                    <Table className='desktop-emp employee-table company-table' responsive>
                                                        <thead>
                                                            <tr>
                                                                <th  > <div className="mwid-20">ID</div> </th>
                                                                <th  ><div className="mwid-20">Guests</div></th>
                                                                <th  ><div className="mwid-20">Stay dates</div></th>
                                                                <th  ><div className="mwid-20">Booking Created </div> </th>
                                                                <th ><div className="desk-35 mwidbr-20">BR </div> </th>
                                                                <th><div className="mwid-25">Status</div></th>
                                                                <th><div className="mwid-20">Progress</div></th>


                                                                <th style={{ width: '10%', textAlign: 'right' }} >
                                                                    <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' /></div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {assignments.map((assignment, idx) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-3'>
                                                                            {assignment.id}
                                                                            <SourceBadge source={assignment.booking_source} reference={assignment.source_reference} compact />{/* integration: alice_v3_claude — w7 */}
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>
                                                                            <p className='mb-0'>
                                                                                <span style={{ fontWeight: '500' }} > {assignment.traveler_name} </span>
                                                                                <br></br><small>
                                                                                    {assignment.traveler_role}
                                                                                    N/A
                                                                                </small>
                                                                            </p>
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>
                                                                                <br></br>
                                                                                <small>{assignment.total_nights} Nights</small>
                                                                            </p>

                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingCreated(assignment.created_at)}</span>
                                                                                <br></br>
                                                                                <small>by {assignment.created_by_name}</small>
                                                                            </p>

                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="desk-35"> {assignment.property_name},{assignment.room_name},{assignment.property_city} </div>
                                                                    </td>
                                                                    <td>
                                                                        <span
                                                                            className={

                                                                                assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                                    assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                                        assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                            assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                                assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                                    assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                                        assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                            assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                                assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                            }

                                                                            style={{ lineHeight: '16px' }}>
                                                                            {assignment.booking_status}
                                                                        </span >
                                                                    </td>
                                                                    <td>
                                                                        {/* <span style={{ color: '#BF9039' }} >  {assignment.progress} </span> */}
                                                                        <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                            {getBookingProgress(assignment)}
                                                                        </p>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex justify-between align-items-center'>
                                                                            <Link
                                                                                href={`/BookingDetails/${assignment?.uid}`}
                                                                                className={`btn-table-action ${(!canRetrieve || !assignment?.available_actions.includes("view_details")) ? "disabled-link opacity-25" : ""}`}
                                                                                onClick={(e) => {
                                                                                    if (!canRetrieve || !assignment?.available_actions.includes("view_details")) e.preventDefault();  // stop navigation if disabled
                                                                                }}
                                                                            >
                                                                                Details
                                                                            </Link>


                                                                            <div className='bt-abs position-relative'>
                                                                                <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                    <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                </Link>
                                                                                {/* <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_in_formalities") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_in") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { checkInModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("modify_check_out") ? "" : "disabled-list"}`}>
                                                                                <Link href='#' onClick={(e) => { handleModifyCheckout(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_out") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { CheckoutShowModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("modify_dates") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={() => { changepicModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("mark_no_show") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { marknoShowModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                <Link href="#" onClick={(e) => { cancelbookModal(); setBookingDetailData(assignment) }}>
                                                                                    Cancel Booking
                                                                                </Link>
                                                                            </li>

                                                                        </ul> */}
                                                                                <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                                    {/* Check-in Formalities */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            CheckInFormalitiesShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                            Check-in Formalities
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Check-in */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            checkInModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                            Check-in
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Modify Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            handleModifyCheckout();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                            Modify Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            CheckoutShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                            Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Modify Dates */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            changepicModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                            Modify Dates
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Mark as No Show */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            marknoShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                            Mark as No Show
                                                                                        </Link>
                                                                                    </li>

                                                                                    <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleGiveReviewModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            Give Feedback
                                                                                        </Link>
                                                                                    </li>


                                                                                    <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleFeedbackModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            View Feedback
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Cancel Booking */}
                                                                                    {canDelete && (
                                                                                        <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                            <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                                onClick={() => {
                                                                                                    cancelbookModal();
                                                                                                    setBookingDetailData(assignment);
                                                                                                }}>
                                                                                                Cancel Booking
                                                                                            </Link>
                                                                                        </li>
                                                                                    )}

                                                                                </ul>

                                                                            </div>
                                                                        </div>

                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="property-gridview" style={{ display: viewType === 'grid' ? 'block' : 'none' }} >
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>

                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>

                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>


                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className='mb-0'>
                                                                    {booking_count > 0
                                                                        ? `${start}-${end} of ${booking_count}`
                                                                        : "0 results"}
                                                                </p>

                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                    style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                    style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {assignments.map((assignment, idx) => (<div key={idx} className='booking-card-grid mb-4'>
                                                        <div className='booking-list-details'>
                                                            <div className='booking-grid-header mb-2'>
                                                                <div className='d-flex justify-between'>
                                                                    <h3 className='font-24'>{assignment.traveler_name}</h3>


                                                                    <div className='bt-abs position-relative'>
                                                                        <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                            <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                        </Link>

                                                                        <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            {/* Check-in Formalities */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Check-in */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    checkInModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            {/* Modify Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    handleModifyCheckout();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            {/* Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    CheckoutShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Modify Dates */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    changepicModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            {/* Mark as No Show */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    marknoShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleGiveReviewModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    Give Feedback
                                                                                </Link>
                                                                            </li>


                                                                            <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleFeedbackModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    View Feedback
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Cancel Booking */}
                                                                            {canDelete && (
                                                                                <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                    <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                        onClick={() => {
                                                                                            cancelbookModal();
                                                                                            setBookingDetailData(assignment);
                                                                                        }}>
                                                                                        Cancel Booking
                                                                                    </Link>
                                                                                </li>
                                                                            )}

                                                                        </ul>

                                                                    </div>
                                                                </div>


                                                                <p className='d-flex ' style={{ lineHeight: '24px', fontSize: '14px' }} >1 adult | &nbsp; <span style={{ lineHeight: '18px' }} className={

                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>{assignment.booking_status}</span>  </p>


                                                            </div>

                                                            <hr></hr>

                                                            <ul className='room-list2 mb-0'>
                                                                <li  > <span>{formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>  {assignment.total_nights} nights</li>

                                                                <li > <span> {assignment.property_name},{assignment.room_name},{assignment.property_city} </span></li>


                                                                <li  > Booked <span>{formatBookingDates(assignment.check_in_date, null, "booked")} </span> by {assignment.created_by_name}</li>


                                                                <li  > Booking Id <span>{assignment.booking_number} </span><SourceBadge source={assignment.booking_source} reference={assignment.source_reference} />{/* integration: alice_v3_claude — w7 */}</li>
                                                            </ul>

                                                        </div>

                                                        <div className='booking-grid-img'>
                                                            <span className='progress-br-span' >{getBookingProgress(assignment)}</span>
                                                            <Image src='/images/icons/property-br.jpg' width={400} height={250} alt='Booking Image' className='img-fluid' />
                                                        </div>
                                                    </div>))}
                                                </div>
                                            </>
                                        )}
                                    </Tab>
                                    <Tab eventKey="upcoming" title="Upcoming">
                                        {canList && (
                                            <>
                                                <div className="property-listview" style={{ display: viewType === 'list' ? 'block' : 'none' }}>
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>
                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>
                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className='mb-0'>
                                                                    {booking_count > 0
                                                                        ? `${start}-${end} of ${booking_count}`
                                                                        : "0 results"}
                                                                </p>

                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${filteredOptions.page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    // onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                    onClick={() => filteredOptions.page > 1 && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page > 1 ? prev.page - 1 : 1   // prevent going below 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === 1 ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${filteredOptions.page === totalPages ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    // onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                    onClick={() => filteredOptions.page < totalPages && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page + 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === totalPages ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>
                                                    </div>

                                                    <Table className='desktop-emp employee-table company-table' responsive>
                                                        <thead>
                                                            <tr>
                                                                <th> <div className="mwid-20">ID</div> </th>
                                                                <th><div className="mwid-20">Guests</div></th>
                                                                <th><div className="mwid-20">Stay dates</div></th>
                                                                <th><div className="mwid-20">Booking Created </div> </th>
                                                                <th><div className="desk-35 mwidbr-20">BR </div> </th>
                                                                <th><div className="mwid-25">Status</div></th>
                                                                <th><div className="mwid-20">Progress</div></th>
                                                                <th style={{ width: '10%', textAlign: 'right' }} >
                                                                    <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' /></div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {assignments.map((assignment, idx) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-3'>
                                                                            {assignment.id}
                                                                            <SourceBadge source={assignment.booking_source} reference={assignment.source_reference} compact />{/* integration: alice_v3_claude — w7 */}
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>
                                                                            <p className='mb-0'>
                                                                                <span style={{ fontWeight: '500' }} > {assignment.traveler_name} </span>
                                                                                <br></br><small>
                                                                                    {assignment.traveler_role}
                                                                                    N/A
                                                                                </small>
                                                                            </p>
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>
                                                                                <br></br>
                                                                                <small>{assignment.total_nights} Nights</small>
                                                                            </p>

                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingCreated(assignment.created_at)}</span>
                                                                                <br></br>
                                                                                <small>by {assignment.created_by_name}</small>
                                                                            </p>

                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="desk-35"> {assignment.property_name},{assignment.room_name},{assignment.property_city} </div>
                                                                    </td>
                                                                    <td>
                                                                        <span
                                                                            className={

                                                                                assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                                    assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                                        assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                            assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                                assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                                    assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                                        assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                            assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                                assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                            }

                                                                            style={{ lineHeight: '16px' }}>
                                                                            {assignment.booking_status}
                                                                        </span >
                                                                    </td>
                                                                    <td>
                                                                        {/* <span style={{ color: '#BF9039' }} >  {assignment.progress} </span> */}
                                                                        <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                            {getBookingProgress(assignment)}
                                                                        </p>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex justify-between align-items-center'>
                                                                            <Link
                                                                                href={`/BookingDetails/${assignment?.uid}`}
                                                                                className={`btn-table-action ${(!canRetrieve || !assignment?.available_actions.includes("view_details")) ? "disabled-link opacity-25" : ""}`}
                                                                                onClick={(e) => {
                                                                                    if (!canRetrieve || !assignment?.available_actions.includes("view_details")) e.preventDefault();  // stop navigation if disabled
                                                                                }}
                                                                            >
                                                                                Details
                                                                            </Link>


                                                                            <div className='bt-abs position-relative'>
                                                                                <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                    <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                </Link>
                                                                                {/* <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_in_formalities") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_in") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { checkInModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("modify_check_out") ? "" : "disabled-list"}`}>
                                                                                <Link href='#' onClick={(e) => { handleModifyCheckout(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_out") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { CheckoutShowModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("modify_dates") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={() => { changepicModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("mark_no_show") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { marknoShowModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                <Link href="#" onClick={(e) => { cancelbookModal(); setBookingDetailData(assignment) }}>
                                                                                    Cancel Booking
                                                                                </Link>
                                                                            </li>

                                                                        </ul> */}
                                                                                <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                                    {/* Check-in Formalities */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            CheckInFormalitiesShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                            Check-in Formalities
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Check-in */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            checkInModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                            Check-in
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Modify Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            handleModifyCheckout();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                            Modify Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            CheckoutShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                            Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Modify Dates */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            changepicModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                            Modify Dates
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Mark as No Show */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            marknoShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                            Mark as No Show
                                                                                        </Link>
                                                                                    </li>

                                                                                    <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleGiveReviewModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            Give Feedback
                                                                                        </Link>
                                                                                    </li>


                                                                                    <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleFeedbackModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            View Feedback
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Cancel Booking */}
                                                                                    {canDelete && (
                                                                                        <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                            <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                                onClick={() => {
                                                                                                    cancelbookModal();
                                                                                                    setBookingDetailData(assignment);
                                                                                                }}>
                                                                                                Cancel Booking
                                                                                            </Link>
                                                                                        </li>
                                                                                    )}

                                                                                </ul>

                                                                            </div>
                                                                        </div>

                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>

                                                </div>
                                                <div className="property-gridview" style={{ display: viewType === 'grid' ? 'block' : 'none' }} >
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>

                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>

                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>


                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


                                                                <p className='mb-0'>
                                                                    {booking_count > 0
                                                                        ? `${start}-${end} of ${booking_count}`
                                                                        : "0 results"}
                                                                </p>

                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                    style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                    style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                                                />
                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {assignments.map((assignment, idx) => (<div key={idx} className='booking-card-grid mb-4'>
                                                        <div className='booking-list-details'>
                                                            <div className='booking-grid-header mb-2'>
                                                                <div className='d-flex justify-between'>
                                                                    <h3 className='font-24'>{assignment.traveler_name}</h3>


                                                                    <div className='bt-abs position-relative'>
                                                                        <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                            <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                        </Link>



                                                                        <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            {/* Check-in Formalities */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Check-in */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    checkInModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            {/* Modify Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    handleModifyCheckout();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            {/* Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    CheckoutShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Modify Dates */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    changepicModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            {/* Mark as No Show */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    marknoShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleGiveReviewModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    Give Feedback
                                                                                </Link>
                                                                            </li>


                                                                            <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleFeedbackModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    View Feedback
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Cancel Booking */}
                                                                            {canDelete && (
                                                                                <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                    <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                        onClick={() => {
                                                                                            cancelbookModal();
                                                                                            setBookingDetailData(assignment);
                                                                                        }}>
                                                                                        Cancel Booking
                                                                                    </Link>
                                                                                </li>
                                                                            )}

                                                                        </ul>

                                                                    </div>
                                                                </div>


                                                                <p className='d-flex ' style={{ lineHeight: '24px', fontSize: '14px' }} >1 adult | &nbsp; <span style={{ lineHeight: '18px' }} className={

                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>{assignment.booking_status}</span>  </p>


                                                            </div>

                                                            <hr></hr>

                                                            <ul className='room-list2 mb-0'>
                                                                <li  > <span>{formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>  {assignment.total_nights} nights</li>

                                                                <li > <span> {assignment.property_name},{assignment.room_name},{assignment.property_city} </span></li>


                                                                <li  > Booked <span>{formatBookingDates(assignment.check_in_date, null, "booked")} </span> by {assignment.created_by_name}</li>


                                                                <li  > Booking Id <span>{assignment.booking_number} </span><SourceBadge source={assignment.booking_source} reference={assignment.source_reference} />{/* integration: alice_v3_claude — w7 */}</li>
                                                            </ul>

                                                        </div>

                                                        <div className='booking-grid-img'>
                                                            <span className='progress-br-span' >{getBookingProgress(assignment)}</span>
                                                            <Image src='/images/icons/property-br.jpg' width={400} height={250} alt='Booking Image' className='img-fluid' />
                                                        </div>
                                                    </div>))}
                                                </div>
                                            </>
                                        )}
                                    </Tab>
                                    <Tab eventKey="past" title="Past">
                                        {canList && (
                                            <>
                                                <div className="property-listview" style={{ display: viewType === 'list' ? 'block' : 'none' }}>
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>
                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>
                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className='mb-0'>
                                                                    {booking_count > 0
                                                                        ? `${start}-${end} of ${booking_count}`
                                                                        : "0 results"}
                                                                </p>

                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${filteredOptions.page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    // onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                    onClick={() => filteredOptions.page > 1 && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page > 1 ? prev.page - 1 : 1   // prevent going below 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === 1 ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${filteredOptions.page === totalPages ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    // onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                    onClick={() => filteredOptions.page < totalPages && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page + 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === totalPages ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>
                                                    </div>
                                                    <Table className='desktop-emp employee-table company-table' responsive>
                                                        <thead>
                                                            <tr>
                                                                <th  > <div className="mwid-20">ID</div> </th>
                                                                <th  ><div className="mwid-20">Guests</div></th>
                                                                <th  ><div className="mwid-20">Stay dates</div></th>
                                                                <th  ><div className="mwid-20">Booking Created </div> </th>
                                                                <th ><div className="desk-35 mwidbr-20">BR </div> </th>
                                                                <th><div className="mwid-25">Status</div></th>
                                                                <th><div className="mwid-20">Progress</div></th>


                                                                <th style={{ width: '10%', textAlign: 'right' }} >
                                                                    <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' /></div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {assignments.map((assignment, idx) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-3'>
                                                                            {assignment.id}
                                                                            <SourceBadge source={assignment.booking_source} reference={assignment.source_reference} compact />{/* integration: alice_v3_claude — w7 */}
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>
                                                                            <p className='mb-0'>
                                                                                <span style={{ fontWeight: '500' }} > {assignment.traveler_name} </span>
                                                                                <br></br><small>
                                                                                    {assignment.traveler_role}
                                                                                    N/A
                                                                                </small>
                                                                            </p>
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>
                                                                                <br></br>
                                                                                <small>{assignment.total_nights} Nights</small>
                                                                            </p>

                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingCreated(assignment.created_at)}</span>
                                                                                <br></br>
                                                                                <small>by {assignment.created_by_name}</small>
                                                                            </p>

                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="desk-35"> {assignment.property_name},{assignment.room_name},{assignment.property_city} </div>
                                                                    </td>
                                                                    <td>
                                                                        <span
                                                                            className={

                                                                                assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                                    assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                                        assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                            assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                                assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                                    assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                                        assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                            assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                                assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                            }

                                                                            style={{ lineHeight: '16px' }}>
                                                                            {assignment.booking_status}
                                                                        </span >
                                                                    </td>
                                                                    <td>
                                                                        {/* <span style={{ color: '#BF9039' }} >  {assignment.progress} </span> */}
                                                                        <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                            {getBookingProgress(assignment)}
                                                                        </p>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex justify-between align-items-center'>
                                                                            <Link
                                                                                href={`/BookingDetails/${assignment?.uid}`}
                                                                                className={`btn-table-action ${(!canRetrieve || !assignment?.available_actions.includes("view_details")) ? "disabled-link opacity-25" : ""}`}
                                                                                onClick={(e) => {
                                                                                    if (!canRetrieve || !assignment?.available_actions.includes("view_details")) e.preventDefault();  // stop navigation if disabled
                                                                                }}
                                                                            >
                                                                                Details
                                                                            </Link>


                                                                            <div className='bt-abs position-relative'>
                                                                                <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                    <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                </Link>
                                                                                {/* <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_in_formalities") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_in") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { checkInModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("modify_check_out") ? "" : "disabled-list"}`}>
                                                                                <Link href='#' onClick={(e) => { handleModifyCheckout(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_out") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { CheckoutShowModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("modify_dates") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={() => { changepicModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("mark_no_show") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { marknoShowModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                <Link href="#" onClick={(e) => { cancelbookModal(); setBookingDetailData(assignment) }}>
                                                                                    Cancel Booking
                                                                                </Link>
                                                                            </li>

                                                                        </ul> */}
                                                                                <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                                    {/* Check-in Formalities */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            CheckInFormalitiesShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                            Check-in Formalities
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Check-in */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            checkInModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                            Check-in
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Modify Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            handleModifyCheckout();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                            Modify Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            CheckoutShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                            Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Modify Dates */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            changepicModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                            Modify Dates
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Mark as No Show */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            marknoShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                            Mark as No Show
                                                                                        </Link>
                                                                                    </li>

                                                                                    <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleGiveReviewModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            Give Feedback
                                                                                        </Link>
                                                                                    </li>


                                                                                    <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleFeedbackModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            View Feedback
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Cancel Booking */}
                                                                                    {canDelete && (
                                                                                        <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                            <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                                onClick={() => {
                                                                                                    cancelbookModal();
                                                                                                    setBookingDetailData(assignment);
                                                                                                }}>
                                                                                                Cancel Booking
                                                                                            </Link>
                                                                                        </li>
                                                                                    )}

                                                                                </ul>

                                                                            </div>
                                                                        </div>

                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="property-gridview" style={{ display: viewType === 'grid' ? 'block' : 'none' }} >
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>

                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>

                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>


                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className='mb-0'>
                                                                    {booking_count > 0
                                                                        ? `${start}-${end} of ${booking_count}`
                                                                        : "0 results"}
                                                                </p>

                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                    style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                    style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {assignments.map((assignment, idx) => (<div key={idx} className='booking-card-grid mb-4'>
                                                        <div className='booking-list-details'>
                                                            <div className='booking-grid-header mb-2'>
                                                                <div className='d-flex justify-between'>
                                                                    <h3 className='font-24'>{assignment.traveler_name}</h3>


                                                                    <div className='bt-abs position-relative'>
                                                                        <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                            <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                        </Link>

                                                                        <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            {/* Check-in Formalities */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Check-in */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    checkInModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            {/* Modify Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    handleModifyCheckout();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            {/* Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    CheckoutShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Modify Dates */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    changepicModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            {/* Mark as No Show */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    marknoShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleGiveReviewModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    Give Feedback
                                                                                </Link>
                                                                            </li>


                                                                            <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleFeedbackModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    View Feedback
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Cancel Booking */}
                                                                            {canDelete && (
                                                                                <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                    <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                        onClick={() => {
                                                                                            cancelbookModal();
                                                                                            setBookingDetailData(assignment);
                                                                                        }}>
                                                                                        Cancel Booking
                                                                                    </Link>
                                                                                </li>
                                                                            )}

                                                                        </ul>

                                                                    </div>
                                                                </div>


                                                                <p className='d-flex ' style={{ lineHeight: '24px', fontSize: '14px' }} >1 adult | &nbsp; <span style={{ lineHeight: '18px' }} className={

                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>{assignment.booking_status}</span>  </p>


                                                            </div>

                                                            <hr></hr>

                                                            <ul className='room-list2 mb-0'>
                                                                <li  > <span>{formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>  {assignment.total_nights} nights</li>

                                                                <li > <span> {assignment.property_name},{assignment.room_name},{assignment.property_city} </span></li>


                                                                <li  > Booked <span>{formatBookingDates(assignment.check_in_date, null, "booked")} </span> by {assignment.created_by_name}</li>


                                                                <li  > Booking Id <span>{assignment.booking_number} </span><SourceBadge source={assignment.booking_source} reference={assignment.source_reference} />{/* integration: alice_v3_claude — w7 */}</li>
                                                            </ul>

                                                        </div>

                                                        <div className='booking-grid-img'>
                                                            <span className='progress-br-span' >{getBookingProgress(assignment)}</span>
                                                            <Image src='/images/icons/property-br.jpg' width={400} height={250} alt='Booking Image' className='img-fluid' />
                                                        </div>
                                                    </div>))}
                                                </div>
                                            </>
                                        )}
                                    </Tab>
                                    <Tab eventKey="cancelled" title="Cancelled">
                                        {canList && (
                                            <>
                                                <div className="property-listview" style={{ display: viewType === 'list' ? 'block' : 'none' }}>
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>
                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>
                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className='mb-0'>
                                                                    {booking_count > 0
                                                                        ? `${start}-${end} of ${booking_count}`
                                                                        : "0 results"}
                                                                </p>

                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${filteredOptions.page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    // onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                    onClick={() => filteredOptions.page > 1 && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page > 1 ? prev.page - 1 : 1   // prevent going below 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === 1 ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${filteredOptions.page === totalPages ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    // onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                    onClick={() => filteredOptions.page < totalPages && setFilteredOptions(prev => ({
                                                                        ...prev,
                                                                        page: prev.page + 1
                                                                    }))
                                                                    }
                                                                    style={{ cursor: filteredOptions.page === totalPages ? 'not-allowed' : 'pointer' }}
                                                                />

                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>
                                                    </div>
                                                    <Table className='desktop-emp employee-table company-table' responsive>
                                                        <thead>
                                                            <tr>
                                                                <th  > <div className="mwid-20">ID</div> </th>
                                                                <th  ><div className="mwid-20">Guests</div></th>
                                                                <th  ><div className="mwid-20">Stay dates</div></th>
                                                                <th  ><div className="mwid-20">Booking Created </div> </th>
                                                                <th ><div className="desk-35 mwidbr-20">BR </div> </th>
                                                                <th><div className="mwid-25">Status</div></th>
                                                                <th><div className="mwid-20">Progress</div></th>


                                                                <th style={{ width: '10%', textAlign: 'right' }} >
                                                                    <div className="">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' /></div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {assignments.map((assignment, idx) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-3'>
                                                                            {assignment.id}
                                                                            <SourceBadge source={assignment.booking_source} reference={assignment.source_reference} compact />{/* integration: alice_v3_claude — w7 */}
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>
                                                                            <p className='mb-0'>
                                                                                <span style={{ fontWeight: '500' }} > {assignment.traveler_name} </span>
                                                                                <br></br><small>
                                                                                    {assignment.traveler_role}
                                                                                    N/A
                                                                                </small>
                                                                            </p>
                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>
                                                                                <br></br>
                                                                                <small>{assignment.total_nights} Nights</small>
                                                                            </p>

                                                                        </div>

                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-2'>

                                                                            <p className='mb-0'>

                                                                                <span style={{ fontWeight: '500' }} > {formatBookingCreated(assignment.created_at)}</span>
                                                                                <br></br>
                                                                                <small>by {assignment.created_by_name}</small>
                                                                            </p>

                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="desk-35"> {assignment.property_name},{assignment.room_name},{assignment.property_city} </div>
                                                                    </td>
                                                                    <td>
                                                                        <span
                                                                            className={

                                                                                assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                                    assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                                        assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                            assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                                assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                                    assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                                        assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                            assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                                assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                            }

                                                                            style={{ lineHeight: '16px' }}>
                                                                            {assignment.booking_status}
                                                                        </span >
                                                                    </td>
                                                                    <td>
                                                                        {/* <span style={{ color: '#BF9039' }} >  {assignment.progress} </span> */}
                                                                        <p className='rounded mb-0' style={{ background: '#fff', fontSize: '12px', textAlign: 'center', lineHeight: '20px', color: '#463527', width: '72px' }} >
                                                                            {getBookingProgress(assignment)}
                                                                        </p>
                                                                    </td>
                                                                    <td>
                                                                        <div className='d-flex justify-between align-items-center'>
                                                                            <Link
                                                                                href={`/BookingDetails/${assignment?.uid}`}
                                                                                className={`btn-table-action ${(!canRetrieve || !assignment?.available_actions.includes("view_details")) ? "disabled-link opacity-25" : ""}`}
                                                                                onClick={(e) => {
                                                                                    if (!canRetrieve || !assignment?.available_actions.includes("view_details")) e.preventDefault();  // stop navigation if disabled
                                                                                }}
                                                                            >
                                                                                Details
                                                                            </Link>


                                                                            <div className='bt-abs position-relative'>
                                                                                <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                    <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                </Link>
                                                                                {/* <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_in_formalities") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_in") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { checkInModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("modify_check_out") ? "" : "disabled-list"}`}>
                                                                                <Link href='#' onClick={(e) => { handleModifyCheckout(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("check_out") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { CheckoutShowModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("modify_dates") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={() => { changepicModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("mark_no_show") ? "" : "disabled-list"}`}>
                                                                                <Link href="#" onClick={(e) => { marknoShowModal(); setBookingDetailData(assignment) }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            
                                                                            <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                <Link href="#" onClick={(e) => { cancelbookModal(); setBookingDetailData(assignment) }}>
                                                                                    Cancel Booking
                                                                                </Link>
                                                                            </li>

                                                                        </ul> */}
                                                                                <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                                    {/* Check-in Formalities */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            CheckInFormalitiesShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                            Check-in Formalities
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Check-in */}
                                                                                    <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                            checkInModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                            Check-in
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Modify Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            handleModifyCheckout();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                            Modify Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Check-out */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            CheckoutShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                            Check-out
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Modify Dates */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            changepicModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                            Modify Dates
                                                                                        </Link>
                                                                                    </li>

                                                                                    {/* Mark as No Show */}
                                                                                    <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                            marknoShowModal();
                                                                                            setBookingDetailData(assignment)
                                                                                        }}>
                                                                                            <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                            Mark as No Show
                                                                                        </Link>
                                                                                    </li>

                                                                                    <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleGiveReviewModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            Give Feedback
                                                                                        </Link>
                                                                                    </li>


                                                                                    <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                        <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                handleFeedbackModal();
                                                                                                setBookingDetailData(assignment)
                                                                                            }}>
                                                                                            <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                            View Feedback
                                                                                        </Link>
                                                                                    </li>

                                                                                    <hr style={{ margin: "6px 0" }} />

                                                                                    {/* Cancel Booking */}
                                                                                    {canDelete && (
                                                                                        <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                            <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                                onClick={() => {
                                                                                                    cancelbookModal();
                                                                                                    setBookingDetailData(assignment);
                                                                                                }}>
                                                                                                Cancel Booking
                                                                                            </Link>
                                                                                        </li>
                                                                                    )}

                                                                                </ul>

                                                                            </div>
                                                                        </div>

                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="property-gridview" style={{ display: viewType === 'grid' ? 'block' : 'none' }} >
                                                    <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                        <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>

                                                            <label className='mb-0 d-flex gap-2 align-items-center  show-my-booking' >
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={(e) => {
                                                                        setFilteredOptions({
                                                                            ...filteredOptions,
                                                                            only_my_booking: e.target.checked   // true or false
                                                                        });
                                                                    }}
                                                                    className="mx-2 custom-checkbox"
                                                                />
                                                                Only my bookings
                                                            </label>

                                                            <p className='mb-0 d-flex gap-2  align-items-center'> <strong>{tabCount ? tabCount[filteredOptions.tab] : 0}</strong>  Bookings  </p>
                                                        </div>


                                                        <div className='filter-right-option d-flex gap-3'>
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


                                                                <Button variant="" className='btn-sort'> Sort by :
                                                                    <Select
                                                                        name="aria-role-select"
                                                                        options={sortoption}
                                                                        placeholder="Select Option"
                                                                        onChange={(opt) => setFilteredOptions({ ...filteredOptions, sort_by: opt.value })}
                                                                        className="react_selectbox"
                                                                        isSearchable={false}
                                                                        styles={customStyles}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {assignments.map((assignment, idx) => (<div key={idx} className='booking-card-grid mb-4'>
                                                        <div className='booking-list-details'>
                                                            <div className='booking-grid-header mb-2'>
                                                                <div className='d-flex justify-between'>
                                                                    <h3 className='font-24'>{assignment.traveler_name}</h3>


                                                                    <div className='bt-abs position-relative'>
                                                                        <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                            <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                        </Link>

                                                                        <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                            {/* Check-in Formalities */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in_formalities")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    CheckInFormalitiesShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/person_pin.svg' width={24} height={24} alt='open' />
                                                                                    Check-in Formalities
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Check-in */}
                                                                            <li className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdateBooking && assignment?.available_actions.includes("check_in")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={(e) => {
                                                                                    checkInModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/key_vertical.svg' width={24} height={24} alt='open' />
                                                                                    Check-in
                                                                                </Link>
                                                                            </li>

                                                                            {/* Modify Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href='#' className={`${(canUpdate && assignment?.available_actions.includes("modify_check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    handleModifyCheckout();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                    Modify Check-out
                                                                                </Link>
                                                                            </li>

                                                                            {/* Check-out */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("check_out")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    CheckoutShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/emoji_people.svg' width={24} height={24} alt='open' />
                                                                                    Check-out
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Modify Dates */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("modify_dates")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    changepicModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/edit_calendar.svg' width={24} height={24} alt='open' />
                                                                                    Modify Dates
                                                                                </Link>
                                                                            </li>

                                                                            {/* Mark as No Show */}
                                                                            <li className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canUpdate && assignment?.available_actions.includes("mark_no_show")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`} onClick={() => {
                                                                                    marknoShowModal();
                                                                                    setBookingDetailData(assignment)
                                                                                }}>
                                                                                    <Image src='./images/icons/account_circle.svg' width={24} height={24} alt='open' />
                                                                                    Mark as No Show
                                                                                </Link>
                                                                            </li>

                                                                            <li className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canAddGive && assignment?.available_actions.includes("give_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleGiveReviewModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    Give Feedback
                                                                                </Link>
                                                                            </li>


                                                                            <li className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "" : "disabled-list"}`}>
                                                                                <Link href="#" className={`${(canRetrieveReview && assignment?.available_actions.includes("view_review")) ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        handleFeedbackModal();
                                                                                        setBookingDetailData(assignment)
                                                                                    }}>
                                                                                    <Image src='/images/icons/feedstar.svg' width={24} height={24} alt='open' />
                                                                                    View Feedback
                                                                                </Link>
                                                                            </li>

                                                                            <hr style={{ margin: "6px 0" }} />

                                                                            {/* Cancel Booking */}
                                                                            {canDelete && (
                                                                                <li className={`${assignment?.available_actions.includes("cancel_booking") ? "" : "disabled-list"} d-flex gap-2`}>
                                                                                    <Link href="#" className={`${assignment?.available_actions.includes("cancel_booking") ? "text-blue-600" : "pointer-events-none text-gray-400"}`}
                                                                                        onClick={() => {
                                                                                            cancelbookModal();
                                                                                            setBookingDetailData(assignment);
                                                                                        }}>
                                                                                        Cancel Booking
                                                                                    </Link>
                                                                                </li>
                                                                            )}

                                                                        </ul>

                                                                    </div>
                                                                </div>


                                                                <p className='d-flex ' style={{ lineHeight: '24px', fontSize: '14px' }} >1 adult | &nbsp; <span style={{ lineHeight: '18px' }} className={

                                                                    assignment.booking_status === 'Checked-Out' ? 'badge-Checked-Out' :
                                                                        assignment.booking_status === "No-Show-Auto" ? 'badge-cancelled' :
                                                                            assignment.booking_status === "Check-in-Upcoming" ? 'badge-Check-In-upcoming' :
                                                                                assignment.booking_status === "Check-in-Pending" ? 'badge-Check-In-pending' :
                                                                                    assignment.booking_status === "Checked In" ? 'badge-Checked-in' :
                                                                                        assignment.booking_status === 'Checkout upcoming' ? 'badge-Checked-out-upcoming' :
                                                                                            assignment.booking_status === "No-Show-Manual" ? 'badge-cancelled' :
                                                                                                assignment.booking_status === 'Cancelled' ? 'badge-Cancel' :
                                                                                                    assignment.booking_status === "Check-out-Pending" ? 'badge-Checkout-pending' : ''
                                                                }>{assignment.booking_status}</span>  </p>


                                                            </div>

                                                            <hr></hr>

                                                            <ul className='room-list2 mb-0'>
                                                                <li  > <span>{formatBookingDates(assignment.check_in_date, assignment.check_out_date, "stayDates")} </span>  {assignment.total_nights} nights</li>

                                                                <li > <span> {assignment.property_name},{assignment.room_name},{assignment.property_city} </span></li>


                                                                <li  > Booked <span>{formatBookingDates(assignment.check_in_date, null, "booked")} </span> by {assignment.created_by_name}</li>


                                                                <li  > Booking Id <span>{assignment.booking_number} </span><SourceBadge source={assignment.booking_source} reference={assignment.source_reference} />{/* integration: alice_v3_claude — w7 */}</li>
                                                            </ul>

                                                        </div>

                                                        <div className='booking-grid-img'>
                                                            <span className='progress-br-span' >{getBookingProgress(assignment)}</span>
                                                            <Image src='/images/icons/property-br.jpg' width={400} height={250} alt='Booking Image' className='img-fluid' />
                                                        </div>
                                                    </div>))}
                                                </div>
                                            </>
                                        )}
                                    </Tab>
                                </Tabs>
                                {/* <div className="flex justify-end ">
                                    <div className="mr-4">
                                        <Form.Select
                                            value={filteredOptions.page_size}
                                            onChange={(e) =>
                                                setFilteredOptions(prev => ({
                                                    ...prev,
                                                    page_size: Number(e.target.value),
                                                    page: 1
                                                }))
                                            }
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </Form.Select>
                                    </div>
                                    <div>
                                        <Pagination className="grid gap-2">
                                            <Pagination.Prev
                                                disabled={!pagination?.has_previous}
                                                onClick={() => handlePageChange(pagination?.page - 1)}
                                                className={!pagination?.has_previous ? "opacity-75 cursor-not-allowed" : ""}
                                            />

                                            {[...Array(pagination?.total_pages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                return (
                                                    <Pagination.Item
                                                        key={pageNumber}
                                                        active={pageNumber === pagination?.page}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </Pagination.Item>
                                                );
                                            })}

                                            <Pagination.Next
                                                disabled={!pagination?.has_next}
                                                onClick={() => handlePageChange(pagination?.page + 1)}
                                                className={!pagination?.has_next ? "opacity-75 cursor-not-allowed" : ""}
                                            />
                                        </Pagination>
                                    </div>
                                </div> */}
                            </Col>
                        </Row>
                    </Container>
                </section>
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




            {/*  */}


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
                            <p className='font-18 d-flex gap-2 ' style={{ fontWeight: '400' }} > <Image src='./images/icons/building.svg' className='img-fluid' alt='building' width={24} height={24} />  Schlumberger Asia Service Ltd</p>

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
                                    <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={16} height={16} /> </li>
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

                        <Accordion className='change-arrival-date-coll' flush>
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
                                            <textarea className='form-control' placeholder='Got any thoughts or questions? Add them here! (Optional)' ></textarea>
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
                fetchDataFunction={getBookingListData}
                bookingDetailData={bookingDetailData}
            />


            {/*  */}


            {/* <Modal show={cancelbooksModal} onHide={cancelbookClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Cancel Booking
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={cancelbookClose} />
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
                                <div className='form-group mb-4'>
                                    <label>Why do you we need to cancel?</label>
                                    <Select
                                        name="aria-live-color"
                                        options={reasonsOption}
                                        placeholder="Select a reason"
                                        className="react_selectbox"
                                        isSearchable={false}
                                        styles={customStyles}
                                    />
                                </div>

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
                <Modal.Footer className='d-flex align-items-center flex-column justify-content-between '>
                    <Button variant="" onClick={cancelbookClose} className=' ' style={{ padding: '10px', borderRadius: '0', fontSize: '14px' }}>
                        Cancel Booking
                    </Button>
                    <Button variant="" onClick={changepicClose} className='' style={{ padding: '0', borderRadius: '0' }}  >
                        The booking will be permanently deleted.
                    </Button>
                </Modal.Footer>
            </Modal> */}
            <CancelBookingModal
                cancelbooksModal={cancelbooksModal}
                cancelbookClose={cancelbookClose}
                // changepicClose={changepicClose}
                fetchDataFunction={getBookingListData}
                bookingDetailData={bookingDetailData}
            />


            {/* update date */}


            {/* <Modal show={updateDatesModal} onHide={updateDateClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Update Checkout Date
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={updateDateClose} />
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
                </Modal.Body>



                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={updateDateClose} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={updateDateClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Check Availability
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
                fetchDataFunction={getBookingListData}
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
                    <Button variant="" onClick={updateDateClose} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={updateDateClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Confrim This Change
                    </Button>
                </Modal.Footer>



            </Modal> */}
            <MarkNoShowModal
                marknoShowsModal={marknoShowsModal}
                marknoShowClose={marknoShowClose}
                fetchDataFunction={getBookingListData}
                bookingDetailData={bookingDetailData}
            />



            {/* Filter modal */}


            <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal     ' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >

                    Filters

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <div className='filter-compnay-details mb-4'>
                        <p className='d-flex justify-content-between font-18 mb-3' >Date type <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>
                        <Tabs
                            defaultActiveKey="date_from"
                            id="uncontrolled-tab-example"
                            className="checkin-checkout-filter-tabs"
                            // onSelect={(k) => {
                            //     setFilteredOptions({ ...filteredOptions, date_type: k })
                            // }}
                            onSelect={(k) => {
                                setTempDateFilter(prev => ({
                                    ...prev,
                                    date_type: k
                                }));
                            }}

                        >
                            <Tab eventKey="date_from" title="Check-in date">
                                <Row className=''>
                                    <Col md={6}>
                                        <div className='form-group mb-2'  >
                                            <label> From</label>
                                            <DatePicker
                                                selected={inactiveFrom}
                                                // onChange={(date) => {
                                                //     const formatted = date ? date.toISOString().split("T")[0] : "";
                                                //     setFilteredOptions({ ...filteredOptions, date_from: formatted })
                                                // }}
                                                onChange={(date) => {
                                                    setInactiveFrom(date);
                                                    // const formatted = date ? date.toISOString().split("T")[0] : "";
                                                    const formatted = toLocalDateString(date);
                                                    setTempDateFilter(prev => ({
                                                        ...prev,
                                                        date_from: formatted
                                                    }));
                                                }}

                                                placeholderText="Select date"
                                                className="form-control  custom-date-picker"
                                                dateFormat="dd/MM/yyyy"

                                            />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group mb-2'>
                                            <label>To</label>
                                            <DatePicker
                                                selected={inactiveTo}
                                                // onChange={(date) => {
                                                //     const formatted = date ? date.toISOString().split("T")[0] : "";
                                                //     setFilteredOptions({ ...filteredOptions, date_to: formatted })
                                                // }}

                                                onChange={(date) => {
                                                    setInactiveTo(date);
                                                    // const formatted = date ? date.toISOString().split("T")[0] : "";
                                                    const formatted = toLocalDateString(date);
                                                    setTempDateFilter(prev => ({
                                                        ...prev,
                                                        date_to: formatted
                                                    }));
                                                }}

                                                placeholderText="Select date"
                                                className="form-control custom-date-picker"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </Col>



                                </Row>
                            </Tab>
                            <Tab eventKey="date_to" title="Checkout date">
                                <Row className=''>
                                    <Col md={6}>
                                        <div className='form-group mb-2'  >
                                            <label> From</label>
                                            <DatePicker
                                                selected={inactiveFrom}
                                                // onChange={(date) => {
                                                //     const formatted = date ? date.toISOString().split("T")[0] : "";
                                                //     setFilteredOptions({ ...filteredOptions, date_from: formatted })
                                                // }}
                                                onChange={(date) => {
                                                    setInactiveFrom(date);
                                                    // const formatted = date ? date.toISOString().split("T")[0] : "";
                                                    const formatted = toLocalDateString(date);
                                                    setTempDateFilter(prev => ({
                                                        ...prev,
                                                        date_from: formatted
                                                    }));
                                                }}

                                                placeholderText="Select date"
                                                className="form-control  custom-date-picker"
                                                dateFormat="dd/MM/yyyy"

                                            />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group mb-2'>
                                            <label>To</label>
                                            <DatePicker
                                                selected={inactiveTo}
                                                // onChange={(date) => {
                                                //     const formatted = date ? date.toISOString().split("T")[0] : "";
                                                //     setFilteredOptions({ ...filteredOptions, date_to: formatted })
                                                // }}
                                                onChange={(date) => {
                                                    setInactiveTo(date);
                                                    // const formatted = date ? date.toISOString().split("T")[0] : "";
                                                    const formatted = toLocalDateString(date);
                                                    setTempDateFilter(prev => ({
                                                        ...prev,
                                                        date_to: formatted
                                                    }));
                                                }}
                                                placeholderText="Select date"
                                                className="form-control custom-date-picker"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </Col>



                                </Row>
                            </Tab>
                            <Tab eventKey="booking_date" title="Booking date" >
                                <Row className=''>
                                    <Col md={6}>
                                        <div className='form-group mb-2'  >
                                            <label> From</label>
                                            <DatePicker
                                                selected={inactiveFrom}
                                                // onChange={(date) => {
                                                //     const formatted = date ? date.toISOString().split("T")[0] : "";
                                                //     setFilteredOptions({ ...filteredOptions, date_from: formatted })
                                                // }}
                                                onChange={(date) => {
                                                    setInactiveFrom(date);
                                                    // const formatted = date ? date.toISOString().split("T")[0] : "";
                                                    const formatted = toLocalDateString(date);
                                                    setTempDateFilter(prev => ({
                                                        ...prev,
                                                        date_from: formatted
                                                    }));
                                                }}
                                                placeholderText="Select date"
                                                className="form-control  custom-date-picker"
                                                dateFormat="dd/MM/yyyy"

                                            />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group mb-2'>
                                            <label>To</label>
                                            <DatePicker
                                                selected={inactiveTo}
                                                // onChange={(date) => {
                                                //     const formatted = date ? date.toISOString().split("T")[0] : "";
                                                //     setFilteredOptions({ ...filteredOptions, date_to: formatted })
                                                // }}
                                                onChange={(date) => {
                                                    setInactiveTo(date);
                                                    // const formatted = date ? date.toISOString().split("T")[0] : "";
                                                    const formatted = toLocalDateString(date);
                                                    setTempDateFilter(prev => ({
                                                        ...prev,
                                                        date_to: formatted
                                                    }));
                                                }}
                                                placeholderText="Select date"
                                                className="form-control custom-date-picker"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </Col>



                                </Row>
                            </Tab>
                        </Tabs>
                        <hr style={{ margin: '20px 0' }} ></hr>
                    </div>
                    <>
                        {/* 
                    <div className='filter-compnay-details'>
                        <p className='d-flex justify-content-between font-18 mb-3' >Booked by <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>

                        <div className='search-box '>
                            <input
                                type='text'
                                placeholder='Search '
                                className='form-control'
                                value={optionInput}
                                onChange={e => setOptionInput(e.target.value)}
                                onKeyDown={handleOptionKeyDown}
                            />
                            <button className='btn btn-search'>
                                <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                            </button>
                        </div>

                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {optionsList.map((opt, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                    {opt}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveOption(idx)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>

                        <hr style={{ margin: '30px 0' }} ></hr>



                    </div> */}
                    </>

                    {/* <div className="filter-compnay-details" ref={wrapperRef}>
                        <p className='d-flex justify-content-between font-18 mb-3' >Booked by <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>
                        
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search"
                                className="form-control"
                                value={optionInput}
                                onChange={e => setOptionInput(e.target.value)}
                                onClick={() => { setShowBookedByList(!showBookedByList) }}
                            />
                            <button className="btn btn-search">
                                <Image src="/images/icons/search.svg" width={24} height={24} alt="Search" />
                            </button>
                        </div>
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {optionsBookedByList.map((opt, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                    {filtersFromRes?.properties?.find(item => item.uid === opt)?.name}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveOption(idx)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>

                        
                        {showBookedByList && (
                            <ul
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                    marginTop: "4px",
                                    padding: "8px",
                                    listStyle: "none",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                    background: "#fff",
                                    position: "absolute",
                                    width: "92%",
                                    zIndex: 10,
                                }}
                            >
                                {filteredBookedByList?.length > 0 ? (
                                    filteredBookedByList.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="px-2 py-1"
                                            style={{ cursor: "pointer" }}
                                            // onMouseDown={() => {
                                            //     setOptionInput("");
                                            //     setShowBookedByList(false)
                                            //     setFilteredOptions({ ...filteredOptions, booked_by: Number(item.id) });
                                            // }}
                                            onMouseDown={() => {
                                                setOptionInput(item.name);
                                                setSelectedBookedBy(item.uid);
                                                setShowBookedByList(false);
                                            }}

                                        >
                                            {item.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-2 py-1 text-muted">No result found</li>
                                )}
                            </ul>
                        )}
                        <hr style={{ margin: '30px 0' }} ></hr>
                    </div> */}



                    <div className="filter-compnay-details" data-filter-dropdown>
                        <p className='d-flex justify-content-between font-18 mb-3'>
                            Booked by
                            <Image
                                style={{ transform: 'rotate(180deg)' }}
                                src='./images/icons/bottom-arrow.svg'
                                className='img-fluid'
                                width={12}
                                height={12}
                                alt='bottom'
                            />
                        </p>

                        {/* Search Input */}
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search"
                                className="form-control"
                                value={bookedByInput}
                                onChange={e => setBookedByInput(e.target.value)}
                                onClick={() => {
                                    setShowBookedByList(true);
                                    setShowLocationList(false);
                                    setPropertyShowList(false);
                                }}
                            />
                            <button className="btn btn-search">
                                <Image src="/images/icons/search.svg" width={24} height={24} alt="Search" />
                            </button>
                        </div>

                        {/* Selected chips — array, same as Location/Property */}
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {/* {optionsBookedByList?.map((uid, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        border: "1px solid #4635271F",
                                        borderRadius: "24px",
                                        padding: "13px 14px",
                                        background: "transparent",
                                        fontWeight: 500,
                                        color: "#463527"
                                    }}
                                >                                    
                                    {filtersFromRes?.booked_by?.find(item => item.uid === uid)?.name ?? uid}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveBookedBy(idx)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))} */}
                            {optionsBookedByList.map((key, idx) => (
                                <div
                                    key={String(key)}
                                    style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}
                                >
                                    {getBookedByName(key)}
                                    <span style={{ marginLeft: "8px", cursor: "pointer" }} onClick={() => handleRemoveBookedBy(idx)}>
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Dropdown list */}
                        {showBookedByList && (
                            <ul
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                    marginTop: "4px",
                                    padding: "8px",
                                    listStyle: "none",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                    background: "#fff",
                                    position: "absolute",
                                    width: "92%",
                                    zIndex: 10,
                                }}
                            >
                                {/* {filteredBookedByList?.length > 0 ? (
                                    filteredBookedByList
                                        // hide already-selected items
                                        .filter(item => !optionsBookedByList.includes(item.uid))
                                        .map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="px-2 py-1"
                                                style={{ cursor: "pointer" }}
                                                onMouseDown={() => {
                                                    setOptionsBookedByList(prev => [...prev, item.uid]);
                                                    setBookedByInput("");
                                                    setShowBookedByList(false);
                                                }}
                                            >
                                                {item.name}
                                            </li>
                                        ))
                                ) : (
                                    <li className="px-2 py-1 text-muted">No result found</li>
                                )} */}
                                {(() => {
                                    const available = (filteredBookedByList || []).filter(
                                        item => !optionsBookedByList.some(k => String(k) === String(getId(item)))
                                    );
                                    return available.length > 0 ? available.map(item => (
                                        <li
                                            key={getId(item)}
                                            className="px-2 py-1"
                                            style={{ cursor: "pointer" }}
                                            onMouseDown={() => {
                                                setOptionsBookedByList(prev => [...prev, getId(item)]);
                                                setBookedByInput("");
                                                setShowBookedByList(false);
                                            }}
                                        >
                                            {item.name}
                                        </li>
                                    )) : <li className="px-2 py-1 text-muted">No result found</li>;
                                })()}
                            </ul>
                        )}

                        <hr style={{ margin: '30px 0' }} />
                    </div>
                    {canListCompany && (
                        <div className='filter-compnay-details'>
                            <p className='d-flex justify-content-between font-18 ' >Companies <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>
                            {/* <ul className="company-name-filter">
                                {filtersFromRes?.companies?.length > 0 &&
                                    filtersFromRes.companies.map((company, index) => (
                                        <li key={company?.id ?? index}>
                                            <input
                                                type="checkbox"
                                                id={`company-${company?.id}`}
                                                className="custom-checkbox"
                                                // onChange={(e) => {
                                                //     if (e.target.checked) {
                                                //         setFilteredOptions({ ...filteredOptions, companies: company?.id })
                                                //     } else { setFilteredOptions({ ...filteredOptions, companies: "" }) }
                                                // }}

                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedCompanies(prev => [...prev, company?.id]);
                                                    } else {
                                                        setSelectedCompanies(prev =>
                                                            prev.filter(id => id !== company?.id)
                                                        );
                                                    }
                                                }}

                                            />
                                            <label htmlFor={`company-${company?.id}`}>
                                                {company?.company_name}
                                            </label>
                                        </li>
                                    ))
                                }
                                <>
                                    
                                </>
                            </ul> */}
                            <ul className="company-name-filter">
                                {filtersFromRes?.companies?.length > 0 &&
                                    filtersFromRes.companies.map((company, index) => {
                                        const companyKey = String(company?.id ?? company?.uid ?? index);
                                        return (
                                            <li key={companyKey}>
                                                <input
                                                    type="checkbox"
                                                    id={`company-${companyKey}`}
                                                    className="custom-checkbox"
                                                    checked={selectedCompanies.includes(companyKey)}
                                                    onChange={(e) => {
                                                        setSelectedCompanies(prev =>
                                                            e.target.checked
                                                                ? [...prev, companyKey]
                                                                : prev.filter(id => id !== companyKey)
                                                        );
                                                    }}
                                                />
                                                <label htmlFor={`company-${companyKey}`}>
                                                    {company?.company_name}
                                                </label>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            <hr style={{ margin: '15px 0 30px' }} ></hr>
                        </div>
                    )}
                    {/* <div className='filter-compnay-details'>
                        <p className='d-flex justify-content-between font-18 mb-3' >Location <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>
                        <div className='search-box '>
                            <input type='text' placeholder='Search by company name, or location' className='form-control' />
                            <button className='btn btn-search'>
                                <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                            </button>
                        </div>
                    </div> */}
                    {/* <div className="filter-compnay-details" ref={wrapperRef}>
                        <p className='d-flex justify-content-between font-18 mb-3' >Location <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>
                        
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search"
                                className="form-control"
                                onChange={e => setOptionInput(e.target.value)}
                                onClick={() => { setShowLocationList(!showLocationList); setPropertyShowList(false) }}
                            />
                            <button className="btn btn-search">
                                <Image src="/images/icons/search.svg" width={24} height={24} alt="Search" />
                            </button>
                        </div>
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {optionsLocationList?.map((opt, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                    {opt}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveOption(idx)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>

                        
                        {showLocationList && (
                            <ul
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                    marginTop: "4px",
                                    padding: "8px",
                                    listStyle: "none",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                    background: "#fff",
                                    position: "absolute",
                                    width: "92%",
                                    zIndex: 10,
                                }}
                            >
                                {filteredLocationList.length > 0 ? (
                                    filteredLocationList.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="px-2 py-1"
                                            style={{ cursor: "pointer" }}
                                            onMouseDown={() => {
                                                setOptionInput("");
                                                setShowLocationList(false)
                                                // setFilteredOptions({ ...filteredOptions, locations: item });
                                                setOptionsLocationList([item]);
                                            }}
                                        >
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-2 py-1 text-muted">No result found</li>
                                )}
                            </ul>
                        )}
                    </div> */}
                    <div className="filter-compnay-details" data-filter-dropdown>
                        <p className='d-flex justify-content-between font-18 mb-3'>
                            Location
                            <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' />
                        </p>

                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search"
                                className="form-control"
                                value={locationInput}
                                onChange={e => setLocationInput(e.target.value)}
                                onClick={() => {
                                    setShowLocationList(true);
                                    setPropertyShowList(false);
                                    setShowBookedByList(false);
                                }}
                            />
                            <button className="btn btn-search">
                                <Image src="/images/icons/search.svg" width={24} height={24} alt="Search" />
                            </button>
                        </div>

                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {optionsLocationList?.map((opt, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex", alignItems: "center", border: "1px solid #4635271F",
                                        borderRadius: "24px", padding: "13px 14px", background: "transparent",
                                        fontWeight: 500, color: "#463527"
                                    }}
                                >
                                    {opt}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveLocation(idx)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>

                        {showLocationList && (
                            <ul style={{
                                border: "1px solid #ccc", borderRadius: "10px", marginTop: "4px",
                                padding: "8px", listStyle: "none", maxHeight: "150px", overflowY: "auto",
                                background: "#fff", position: "absolute", width: "92%", zIndex: 10,
                            }}>
                                {filteredLocationList?.length > 0 ? (
                                    filteredLocationList
                                        .filter(item => !optionsLocationList.includes(item))
                                        .map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="px-2 py-1"
                                                style={{ cursor: "pointer" }}
                                                onMouseDown={() => {
                                                    setLocationInput("");
                                                    setShowLocationList(false);
                                                    setOptionsLocationList(prev => [...prev, item]);
                                                }}
                                            >
                                                {item}
                                            </li>
                                        ))
                                ) : (
                                    <li className="px-2 py-1 text-muted">No result found</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <hr style={{ margin: '30px 0' }} ></hr>

                    <>
                        {/* <div className='filter-compnay-details'>
                        <p className='d-flex justify-content-between font-18 mb-3' >Property <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>

                        <div className='search-box '>
                            <input
                                type='text'
                                placeholder='Search '
                                className='form-control'
                                value={optionInput}
                                onChange={e => setOptionInput(e.target.value)}
                                onKeyDown={handleOptionKeyDown}
                            />
                            <button className='btn btn-search'>
                                <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                            </button>
                        </div>


                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {optionsList.map((opt, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                    {opt}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveOption(idx)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>





                    </div> */}
                    </>
                    {/* <div className="filter-compnay-details" ref={wrapperRef}>
                        <p className='d-flex justify-content-between font-18 mb-3' >Property <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>
                        
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search"
                                className="form-control"
                                onChange={e => setOptionInput(e.target.value)}
                                onClick={() => { setPropertyShowList(!showPropertyList); setShowLocationList(false) }}
                            />
                            <button className="btn btn-search">
                                <Image src="/images/icons/search.svg" width={24} height={24} alt="Search" />
                            </button>
                        </div>

                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {optionsPropertyList?.map((opt, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                    {console.log(filtersFromRes?.properties)}

                                    {filtersFromRes?.properties?.find(item => item.uid === opt).property_name}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveOption(idx)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>

                        
                        {showPropertyList && (
                            <ul
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                    marginTop: "4px",
                                    padding: "8px",
                                    listStyle: "none",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                    background: "#fff",
                                    position: "absolute",
                                    width: "92%",
                                    zIndex: 10,
                                }}
                            >
                                {filteredPropertyList.length > 0 ? (
                                    filteredPropertyList.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="px-2 py-1"
                                            style={{ cursor: "pointer" }}
                                            onMouseDown={() => {
                                                setOptionInput("");
                                                setPropertyShowList(false)
                                                // setFilteredOptions({ ...filteredOptions, properties: item.uid });
                                                setOptionsPropertyList([item.uid]);
                                            }}
                                        >
                                            {item.property_name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-2 py-1 text-muted">No result found</li>
                                )}
                            </ul>
                        )}
                    </div> */}
                    <div className="filter-compnay-details" data-filter-dropdown>
                        <p className='d-flex justify-content-between font-18 mb-3'>
                            Property
                            <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' />
                        </p>

                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search"
                                className="form-control"
                                value={propertyInput}
                                onChange={e => setPropertyInput(e.target.value)}
                                onClick={() => {
                                    setPropertyShowList(true);
                                    setShowLocationList(false);
                                    setShowBookedByList(false);
                                }}
                            />
                            <button className="btn btn-search">
                                <Image src="/images/icons/search.svg" width={24} height={24} alt="Search" />
                            </button>
                        </div>

                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {/* {optionsPropertyList?.map((opt, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex", alignItems: "center", border: "1px solid #4635271F",
                                        borderRadius: "24px", padding: "13px 14px", background: "transparent",
                                        fontWeight: 500, color: "#463527"
                                    }}
                                >
                                    {filtersFromRes?.properties?.find(item => item.uid === opt)?.property_name ?? opt}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveProperty(idx)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))} */}
                            {optionsPropertyList.map((key, idx) => (
                                <div
                                    key={String(key)}
                                    style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}
                                >
                                    {getPropertyName(key)}
                                    <span style={{ marginLeft: "8px", cursor: "pointer" }} onClick={() => handleRemoveProperty(idx)}>
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>

                        {showPropertyList && (
                            <ul style={{
                                border: "1px solid #ccc", borderRadius: "10px", marginTop: "4px",
                                padding: "8px", listStyle: "none", maxHeight: "150px", overflowY: "auto",
                                background: "#fff", position: "absolute", width: "92%", zIndex: 10,
                            }}>
                                {/* {filteredPropertyList?.length > 0 ? (
                                    filteredPropertyList
                                        .filter(item => !optionsPropertyList?.includes(item.uid))
                                        .map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="px-2 py-1"
                                                style={{ cursor: "pointer" }}
                                                onMouseDown={() => {
                                                    setPropertyInput("");
                                                    setPropertyShowList(false);
                                                    setOptionsPropertyList(prev => [...prev, item.uid]);
                                                }}
                                            >
                                                {item.property_name}
                                            </li>
                                        ))
                                ) : (
                                    <li className="px-2 py-1 text-muted">No result found</li>
                                )} */}
                                {(() => {
                                    const available = (filteredPropertyList || []).filter(
                                        item => !optionsPropertyList.some(k => String(k) === String(getId(item)))
                                    );
                                    return available.length > 0 ? available.map(item => (
                                        <li
                                            key={getId(item)}
                                            className="px-2 py-1"
                                            style={{ cursor: "pointer" }}
                                            onMouseDown={() => {
                                                setPropertyInput("");
                                                setPropertyShowList(false);
                                                setOptionsPropertyList(prev => [...prev, getId(item)]);
                                            }}
                                        >
                                            {item.property_name}
                                        </li>
                                    )) : <li className="px-2 py-1 text-muted">No result found</li>;
                                })()}
                            </ul>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    {/* <p onClick={filterClose}>
                        Clear all
                    </p> */}
                    <p onClick={clearAllFilters} style={{ cursor: "pointer" }}>
                        Clear all
                    </p>
                    <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}
                        // onClick={() => { filtersetShow(false) }}
                        // onClick={() => {
                        //     const payload = {
                        //         ...filteredOptions,
                        //         locations: optionsLocationList?.[0] || "",
                        //         properties: optionsPropertyList?.[0] || "",
                        //         companies: selectedCompanies.join(","),
                        //         booked_by: selectedBookedBy,


                        //         date_type: tempDateFilter.date_type,
                        //         date_from: tempDateFilter.date_from,
                        //         date_to: tempDateFilter.date_to,

                        //         page: 1,
                        //         page_size: 10
                        //     };
                        //     setFilteredOptions(payload);
                        //     // BookingsListAPI(payload);
                        //     filtersetShow(false);
                        // }}
                        onClick={() => {
                            const payload = {
                                ...filteredOptions,
                                locations: optionsLocationList?.[0] || "",
                                properties: optionsPropertyList?.[0] || "",
                                // companies: selectedCompanies.join(","),
                                companies: selectedCompanies.length ? selectedCompanies.join(",") : (paramCompanyUid || ""),
                                booked_by: optionsBookedByList.join(","),   // FIX: was selectedBookedBy
                                date_type: tempDateFilter.date_type,
                                date_from: tempDateFilter.date_from,
                                date_to: tempDateFilter.date_to,
                                page: 1,
                                page_size: 10
                            };
                            setFilteredOptions(payload);
                            filtersetShow(false);
                        }}
                    >
                        Show Bookings
                    </Button>
                </Modal.Footer>

            </Modal>



            {/* Check in modal */}

            <>

                {/* <Modal show={updateDatesModal1} onHide={updateDateClose1} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Check-in
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={updateDateClose1} />
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
                    <Button variant="" onClick={updateDateClose1} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={() => {
                        updateDateClose1();
                        setSmShow(true);

                    }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Check In
                    </Button>
                </Modal.Footer>



            </Modal> */}
            </>

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


            <Modal
                className='checkin-complete'
                size=""
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
                centered
            >

                <Modal.Body className='text-center' >
                    <Image src='./images/icons/check-yel.svg' className='img-fluid ms-auto me-auto mb-2' width={20} height={20} alt='check' />
                    <p className='fw-medium mb-2' >Check-in successful</p>



                    <p className='mb-3' >The booking details have been updated.</p>


                    <Button variant='' onClick={() => setSmShow(false)} className='' style={{ background: '#2C734A', borderRadius: '0', padding: '18px 24px', width: '182px', color: '#fff' }} >Okay</Button>

                </Modal.Body>
            </Modal>



            {/* Check in formalties */}

            {/* <Modal show={updateDatesModal2} onHide={updateDateClose2} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Check-in Formalities
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={updateDateClose2} />
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
                    <Button variant="" onClick={updateDateClose2} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={() => {
                        updateDateClose2();
                        setSmShow(true);

                    }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Complete
                    </Button>
                </Modal.Footer>



            </Modal> */}
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
            />}

            {/* Checkuout Model */}

            {/* <Modal show={updateDatesModal3} onHide={updateDateClose3} animation={false} centered className='custom-theme-modal ' >
                
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
                        <h3 style={{ margin: 0, fontWeight: 500, color: '#fff' }}>Checkout today  by <br></br> 11:00AM</h3>

                        <Image
                            src='/images/icons/close-circle.svg'
                            width={24}
                            height={24}
                            alt='Close'
                            style={{ cursor: 'pointer', position: 'absolute', top: 12, right: 12, filter: 'brightness(0) invert(1)' }}
                            onClick={updateDateClose1}
                        />
                    </div>


                    <div className='p-4'>
                        <div className='booking-details-br'>

                            <p className='mb-2 fs-20' style={{ fontWeight: '500' }}> Booking for Shuban, and Jenny </p>

                            <p className='d-flex align-items-center gap-2' style={{ lineHeight: 'auto', fontSize: '14px' }} >

                                Room 2  &nbsp;|
                                <Image src='./images/icons/king_bed.svg' className='img-fluid' alt='bed' width={16} height={16} /> Bed A | &nbsp; <span style={{ lineHeight: '18px' }} className='badge-Checked-in'>Checked-In</span>  </p>

                            <hr></hr>
                            <div className='bm-contact mt-4'>





                                <ul className='room-list'>


                                    <li>3-7 Aug, 2025  <span>3 nights</span></li>
                                    <li> <span>Booking Id </span> 14269 <Image src='./images/icons/content_copy.svg' className='img-fluid' alt='clone' width={20} height={20} /> </li>
                                </ul>


                            </div>


                        </div>




                        <div className='booking-details-br mt-3'>
                            <p className='font-18 fw-medium'>Additional comments/ remarks</p>

                            <div className='form-group '>

                                <textarea className='form-control' placeholder="Add your message here"></textarea>
                            </div>




                        </div>
                    </div>







                </Modal.Body>



                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={updateDateClose} className=' ' style={{ padding: '0', borderRadius: '0', fontSize: '14px' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={updateDateClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Confirm and Checkout
                    </Button>
                </Modal.Footer>



            </Modal> */}
            {/* <ModifyCheckout
                showModifyCheckout={showModifyCheckout}
                handleModifyCheckoutClose={handleModifyCheckoutClose}
                isStep2={isStep2}
                setIsStep2={setIsStep2}
                inactiveFrom={inactiveFrom}
                setInactiveFrom={setInactiveFrom}
                inactiveTo={inactiveTo}
                setInactiveTo={setInactiveTo}
            /> */}

            <CheckoutModal
                checkoutModal={checkoutModal}
                CheckoutClose={CheckoutClose}
                bookingDetailData={bookingDetailData}
            />





            {/*  */}

            {/* <Modal
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
                                        <p className="room-title  mb-0 fw-medium ">Room 3 <span className="text-muted"> | </span> Bed B</p>
                                        <span className="text-muted"> | </span>  <p className="room-title  mb-0 fw-medium ">CasaMelhor Areca Exotica B1-1103, Parshvanath…</p>

                                    </div>
                                </Col>

                                <Col xs={12} className=" d-flex justify-between">


                                    <p className="reviewer-name mb-0 fw-medium">{`Jenny Shaikh's`} review <br></br>  of your BR</p>

                                    <Image
                                        src="/images/icons/profile-pic.jpg"
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
                                    <p className="meta-title mb-0 fw-medium d-flex align-center justify-around font-18">5–8 Aug, 2025 <br /><span className="text-muted small">4 nights</span></p>
                                </Col>
                                <Col xs={5}>
                                    <p className="meta-title mb-0 fw-medium d-flex align-center justify-around font-18">Booking Id <br /><span className="id-no fw-bold">14269</span></p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    
                    {[
                        {
                            label: "Cleanliness",
                            desc: "How satisfied were you with the cleanliness of the property?",
                        },
                        {
                            label: "Food quality",
                            desc: "How would you rate the quality of food and dining services?",
                        },
                        {
                            label: "Staff hospitality",
                            desc: "How helpful and courteous was our staff?",
                        },
                        {
                            label: "Location",
                            desc: "How would you rate the property’s location and facilities?",
                        },
                        {
                            label: "Comfort",
                            desc: "How comfortable was your stay?",
                        },
                    ].map((item, i) => (
                        <Card className="mb-3" key={i}>
                            <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="mb-1 font-18 ">
                                        {item.label} <span className="text-danger">*</span>
                                    </p>
                                    

                                    <RatingStars
                                        value={ratings.cleanliness}
                                        onChange={(val) =>
                                            setRatings({ ...ratings, cleanliness: val })
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
                            onClick={togglePublicReview}
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
                            onClick={togglePrivateReview}
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
                    <Button variant="" className="complete-form-btn " style={{ padding: "13px 25px" }} >Save Changes</Button>
                </div>
            </Modal> */}
            <GiveFeedbackModal
                giveReviewModal={giveReviewModal}
                handleCloseGiveReviewModal={handleCloseGiveReviewModal}
                fetchDataFunction={getBookingListData}
                bookingDetailData={bookingDetailData}
            />
            {/* Read Review */}


            <ViewFeedbackModal
                viewFeedbackModal={viewFeedbackModal}
                handleCloseFeedbackModal={handleCloseFeedbackModal}
                fetchDataFunction={getBookingListData}
                bookingDetailData={bookingDetailData}
            />
        </>
    )
}