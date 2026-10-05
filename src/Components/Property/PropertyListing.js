"use client"
import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Container, Button, Table, Thead, Modal, Tabs, Tab, Badge, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { PropertyListApi, PropertyListFullApi, PropertyStatusUpdateApi, RemovePropertyAssignmentApi, companyListAPI } from '@/services/provider';
import { useSearchParams, useRouter } from "next/navigation";
import 'leaflet/dist/leaflet.css';
import { alert_danger, alert_info, alert_success } from '@/utils/Alerts/TostifyAlerts';
import BeatLoader from "react-spinners/BeatLoader";
import dynamic from "next/dynamic";
import { ToastContainer } from 'react-toastify';
import { getItemLocalStorage } from "@/utils/browserStorage";
import { checkPermission } from "@/utils/helper";

export default function PropertYListing() {


    const PropertyMap = dynamic(
        () => import("../PropertyMap"),
        {
            ssr: false,
        }
    );

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Property manager
        </Tooltip>
    );

    const renderTooltip1 = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Property Caretaker
        </Tooltip>
    );

    const renderTooltip2 = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Oprations Manager
        </Tooltip>
    );

    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionProperty = checkPermission(permissionArray, "property");
    const permissionPropertyAssign = checkPermission(permissionArray, "property_assignment");
    const permissionCompany = checkPermission(permissionArray, "company");
    //property permission
    const canAddProperty = permissionProperty === true || permissionProperty?.can_add;
    const canListProperty = permissionProperty === true || permissionProperty?.can_list;
    const canRetrieveProperty = permissionProperty === true || permissionProperty?.can_retrieve;
    const canUpdateProperty = permissionProperty === true || permissionProperty?.can_update;
    const canDeleteProperty = permissionProperty === true || permissionProperty?.can_delete;
    //can property assign
    const canAddAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_add;
    const canRetrieveAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_retrieve;
    const canUpdateAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_update;
    const canDeleteAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_delete;
    //can permision company 
    const canListCompany = permissionCompany === true || permissionCompany?.can_list;
    const canRetrieveCompany = permissionCompany === true || permissionCompany?.can_retrieve;

    const router = useRouter();
    const PAGE_SIZE = 10;
    const paginate = (list = []) =>
        list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const [fullPropertyList, setFullPropertyList] = useState([]);
    const [inactiveFrom, setInactiveFrom] = useState(null);
    const [inactiveTo, setInactiveTo] = useState(null);
    const cmppremodClose = () => compsetShow(false);
    const cmppremodShow = () => compsetShow(true);
    const [inactiveReason, setInactiveReason] = useState(null);
    const [inactiveNotes, setInactiveNotes] = useState("");
    const [isPermanent, setIsPermanent] = useState(false);
    const [compnayShow, compstatussetShow] = useState(false);
    const [show, compsetShow] = useState(false);
    const compnayStatusClose = () => compstatussetShow(false);
    // const compnayStatusShow = () => compstatussetShow(true);
    const [compnayremoShow, compremovesetShow] = useState(false);
    const compnayRemoveClose = () => compremovesetShow(false);
    const compnayRemoveShow = () => compremovesetShow(true);
    const [expandedRow, setExpandedRow] = useState({});
    // const [page, setPage] = useState(1);
    // const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const [searchKeyForTab, setSearchKeyForTab] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [propertyCount, setPropertyCount] = useState(0);
    const [hasNextPage, hasNextSetPage] = useState(Boolean);

    const statusOption = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        // { value: "Assigned", label: "Assigned" }

    ];

    const reasonsOption = [
        { value: "maintenance-repairs", label: "Maintenance/Repairs" },
        { value: "renovation", label: "Renovation" },
        { value: "seasonal-closure", label: "Seasonal closure" },
        { value: "property-damage", label: "Property damage" },
        { value: "contract-ended", label: "Contract ended" },
        { value: "other", label: "Other" },
    ]

    const [selectedStatus, setSelectedStatus] = useState(null);

    const tableRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scrollTable = (direction) => {
        if (!tableRef.current) return;

        const scrollAmount = 200;
        const table = tableRef.current;

        let newScrollLeft =
            direction === 'right'
                ? table.scrollLeft + scrollAmount   // 👉 left ➜ right
                : table.scrollLeft - scrollAmount;  // 👈 right ➜ left

        // Prevent over scrolling
        newScrollLeft = Math.max(
            0,
            Math.min(newScrollLeft, table.scrollWidth - table.clientWidth)
        );

        table.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth',
        });

        setTimeout(updateArrowVisibility, 300);
    };

    const updateArrowVisibility = () => {
        if (tableRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        startX.current = e.pageX - tableRef.current.offsetLeft;
        scrollLeft.current = tableRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX - tableRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // speed control
        tableRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const [showExportDropdown, setShowExportDropdown] = useState(false);

    const [filtermShow, filtersetShow] = useState(false);

    const filterClose = () => filtersetShow(false);
    const filterShow = () => filtersetShow(true);

    // const filterClear = () => {
    //     setSelectedCompanies([]);   // uncheck all companies
    //     setSearchTerm("");         // clear search box
    //     filterClose();             // close modal
    // };
    const filterClear = () => {
        setSelectedCompanies([]);
        setSearchTerm("");
        setSearchLocationTerm("");   // ← add this
        setPage(1);                  // ← reset page too
        filterClose();
    };


    const [opensDraft, draftsetShow] = useState(false);

    const closeDraft = () => draftsetShow(false);
    // const openDraft = () => draftsetShow(true);

    // const travelOption = [
    //     {
    //         value: "company-employee",
    //         label: "Company employee",
    //         icon: "./images/icons/hail.svg"
    //     },
    //     {
    //         value: "external",
    //         label: "External",
    //         icon: "./images/icons/short_stay.svg"
    //     },
    // ];


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

    // ✅ Custom option in dropdown
    // const CustomOption = (props) => (
    //     <components.Option {...props}>
    //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
    //             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    //                 <Image
    //                     src={props.data.icon}
    //                     alt={props.data.label}
    //                     width={20}
    //                     height={20}
    //                 />
    //                 <span>{props.data.label}</span>
    //             </div>
    //             {props.isSelected && (
    //                 <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
    //             )}
    //         </div>

    //     </components.Option>
    // );

    // ✅ Custom selected value (shows in input box)
    // const CustomSingleValue = (props) => (
    //     <components.SingleValue {...props}>
    //         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    //             <Image
    //                 src={props.data.icon}
    //                 alt={props.data.label}
    //                 width={20}
    //                 height={20}
    //             />
    //             <span>{props.data.label}</span>
    //         </div>
    //     </components.SingleValue>
    // );

    const [viewType, setViewType] = React.useState('list');
    const handleViewToggle = (type) => setViewType(type);


    const [openPicIndex, setOpenPicIndex] = useState(null);

    const togglePicOption1 = (e, idx) => {
        e.preventDefault();
        setOpenPicIndex(openPicIndex === idx ? null : idx);
        if (typeof toggleoptio1 === 'function') {
            toggleoptio1();
        }
    }


    // const assignments = [
    //     {
    //         name: 'CasaMelhor Areca',
    //         extra: 'Exotica',
    //         address: 'Flat No. 17, 17th Floor, near NRI apartments, Seawoods, Sector 58A, Navi Mumbai, Maharashtra, 400706',
    //         dates: 'From Sun, 3 Aug 2025 to Thu, 7 Aug, 2025',
    //         admin: 'Casa Melhor Admin',
    //         email: 'casamelhoradmin@casamelhor.in',
    //         image: '/images/icons/Br-list-image.svg',
    //         companyname: 'Schlumberger',
    //         status: 'assigned'
    //     },
    //     {
    //         name: 'CasaMelhor Palm',
    //         extra: 'Retreat',
    //         address: 'Palm Street, Sector 12, Pune, Maharashtra, 411001',
    //         dates: 'From Mon, 10 Aug 2025 to Fri, 14 Aug, 2025',
    //         admin: 'Casa Melhor Admin',
    //         email: 'admin@casamelhor.in',
    //         image: '/images/icons/Br-list-image-2.svg',
    //         companyname: 'Schlumberger',
    //         status: 'assigned'
    //     },
    //     // Add more objects as needed
    // ];

    const [allPropertyList, setAllPropertyList] = useState([]);
    // const [draftList, setDraftList] = useState([]);
    // const [activeList, setActiveList] = useState([]);
    // const [inActiveList, setInActiveList] = useState([]);
    // const [assignedList, setAssignedList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLocationTerm, setSearchLocationTerm] = useState("");
    const [companyList, setCompanyList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [company_count, setCompany_count] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedCompanies, setSelectedCompanies] = useState([]);


    // const formatDate = (dateStr) => {
    //     if (!dateStr) return "";
    //     const date = new Date(dateStr);

    //     const options = {
    //         weekday: "short",
    //         day: "numeric",
    //         month: "short",
    //         year: "numeric"
    //     };

    //     return date.toLocaleDateString("en-US", options);
    // };



    // const filterCompanyData = (list) => {
    //     if (!searchTerm) return list;

    //     const term = searchTerm.toLowerCase();

    //     return list.filter(item =>
    //         item.company_name?.toLowerCase().includes(term) ||
    //         item.email?.toLowerCase().includes(term) ||
    //         item.phone?.toLowerCase().includes(term) ||
    //         item.address?.toLowerCase().includes(term)
    //     );
    // };

    // const filteredCompany = filterCompanyData(companyList);

    const [selectedProperty, setSelectedProperty] = useState(null);

    const compnayStatusShow = (item) => {
        compstatussetShow(true)
        setSelectedProperty(item);

        // Find matching option from statusOption
        const matchedStatus = statusOption.find(
            (opt) => opt.value.toLowerCase() === item.property_status.toLowerCase()
        );
        // Set default status in dropdown
        setSelectedStatus(matchedStatus || null);

        setCompnayShow(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedProperty) return;

        const payload = {
            property_status: selectedStatus.value,
            inactive_from: inactiveFrom ? inactiveFrom.toISOString().split("T")[0] : null,
            inactive_to: inactiveTo ? inactiveTo.toISOString().split("T")[0] : null,
            inactive_reason: inactiveReason?.value || null,
            inactive_notes: inactiveNotes,
            is_permanently_inactive: isPermanent
        };


        try {

            const res = await PropertyStatusUpdateApi(selectedProperty.uid, payload);

            if (res?.data?.success) {

                alert_success("Status updated!");

                compnayStatusClose();

                getPropertyList();

            } else {

                //  Show backend validation message

                const errorMessage =

                    res?.data?.response?.inactive_from?.[0] ||

                    "Failed to update!";



                alert_danger(errorMessage);

            }





        } catch (err) {

            console.log(err);

            const errorMessage =

                err?.response?.data?.response?.inactive_from?.[0] ||

                err?.response?.data?.message ||

                "Failed to update!";



            alert_danger(errorMessage);

        }


    };


    useEffect(() => {
        if (selectedStatus?.value !== "Inactive") {
            setInactiveFrom(null);
            setInactiveTo(null);
            setInactiveReason(null);
            setInactiveNotes("");
            setIsPermanent(false);
        }
    }, [selectedStatus]);


    // remove assignment
    const handleRemoveAssignment = async (item) => {
        const assignmentUid = item?.property_assignment_uid?.[0];

        if (!assignmentUid) {
            alert_danger("Assignment UID not found");
            return;
        }

        try {
            // 1. Remove assignments first
            await RemovePropertyAssignmentApi(assignmentUid);

            // 2. Then update status
            const payload = {
                property_status: "Active",
                inactive_from: null,
                assigned_companies: [],
                inactive_to: null,
                inactive_reason: null,
                inactive_notes: "",
                is_permanently_inactive: false
            };

            await PropertyStatusUpdateApi(item.uid, payload);

            alert_success("Assignment removed & status set to Active!");
            getPropertyList(page);

        } catch (err) {
            console.error(err);
            alert_danger("Failed to remove assignment!");
        }
    };


    const getPropertyList = async () => {
        try {
            setIsLoading(true);

            const updatedSerchK = searchKey === "All" ? "" : searchKey

            const res = await PropertyListApi(searchTerm, searchLocationTerm, "", selectedCompanies, updatedSerchK, PAGE_SIZE, page,);

            if (res?.data?.success) {
                const list = Array.isArray(res?.data?.response)
                    ? res.data.response
                    : [];

                setAllPropertyList(list);
                setPropertyCount(res.data.property_count || 0);
                setTotalPage(res?.data?.total_page || 1);
                hasNextSetPage(res?.data?.next_page);
                filterClose();


            }

        } catch (err) {
            console.error("Property list error:", err);
        } finally {
            setIsLoading(false);
        }
    };


    // useEffect(() => {
    //     getFullPropertyList();
    // }, [searchKey]);

    // useEffect(() => {
    //     if (searchTerm != "") {
    //         setPage(1)
    //     }
    //     getPropertyList();
    //     setAllPropertyList([])
    // }, [page, searchKey, searchTerm, selectedCompanies,]);
    useEffect(() => {
        if (searchTerm !== "") {
            setPage(1);
        }
        getPropertyList();
        setAllPropertyList([]);
    }, [page, searchKey, searchTerm]);

    // const getFullPropertyList = async () => {
    //     try {
    //         const res = await PropertyListFullApi(searchKey);

    //         if (res?.data?.success) {
    //             const list = Array.isArray(res?.data?.response)
    //                 ? res.data.response
    //                 : [];
    //             setFullPropertyList(list);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    const handleNextPage = () => {
        if (page < totalPage) setPage(p => p + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const filterData = (list = []) => {
        if (!Array.isArray(list)) {
            console.error("Property list is not an array", list);
            return;
        }

        if (!searchTerm && selectedCompanies.length === 0) return list;

        const selectedCompanyNames = companyList
            .filter(c => selectedCompanies.includes(c.value))
            .map(c => c.label?.toLowerCase());

        return list.filter(item => {
            const term = searchTerm.toLowerCase();

            const baseMatch =
                item.property_name?.toLowerCase().includes(term) ||
                item.ops_manager_name?.toLowerCase().includes(term) ||
                item.street_number?.toLowerCase().includes(term) ||
                item.city?.toLowerCase().includes(term) ||
                item.state?.toLowerCase().includes(term) ||
                item.country?.toLowerCase().includes(term) ||
                item.assigned_by?.toLowerCase().includes(term) ||
                item.staff_assignment?.property_managers?.[0]?.name?.toLowerCase().includes(term) ||
                item.staff_assignment?.property_caretakers?.[0]?.name?.toLowerCase().includes(term) ||
                item.assigned_companies?.some(comp =>
                    comp.company_name?.toLowerCase().includes(term)
                );

            const companyMatch =
                selectedCompanyNames.length === 0
                    ? true
                    : item.assigned_companies?.some(comp =>
                        selectedCompanyNames.includes(comp.company_name?.toLowerCase())
                    );

            return baseMatch && companyMatch;
        });
    };

    const fullfilteredAll = filterData(fullPropertyList);

    const fullFilteredActive = filterData(
        fullPropertyList.filter(i => i.property_status?.toLowerCase() === "active")
    );

    const fullFilteredDraft = filterData(
        fullPropertyList.filter(i => i.property_status?.toLowerCase() === "draft")
    );

    const fullFilteredInactive = filterData(
        fullPropertyList.filter(i => i.property_status?.toLowerCase() === "inactive")
    );

    const fullFilteredAssigned = filterData(
        fullPropertyList.filter(i => i.property_status?.toLowerCase() === "assigned")
    );

    const filteredAll = paginate(fullfilteredAll);
    const filteredActive = paginate(fullFilteredActive);
    const filteredDraft = paginate(fullFilteredDraft);
    const filteredInActive = paginate(fullFilteredInactive);
    const filteredAssigned = paginate(fullFilteredAssigned);

    const getCurrentTabTotal = () => {
        switch (searchKey) {
            case "active":
                return fullFilteredActive.length;
            case "draft":
                return fullFilteredDraft.length;
            case "inactive":
                return fullFilteredInactive.length;
            case "assigned":
                return fullFilteredAssigned.length;
            default:
                return fullfilteredAll.length;
        }
    };

    const totalItems = getCurrentTabTotal();
    const totalPageFrontend = Math.ceil(totalItems / PAGE_SIZE);

    // const getMapProperties = () => {
    //     switch (searchKeyForTab) {
    //         case "active":
    //             return filteredActive;
    //         case "inactive":
    //             return filteredInActive;
    //         case "draft":
    //             return filteredDraft;
    //         case "assigned":
    //             return filteredAssigned;
    //         case "all":
    //         default:
    //             return filteredAll;
    //     }
    // };

    const getMapProperties = () => allPropertyList;

    const getCompanyList = async () => {
        try {
            console.log("Calling companyListAPI...", searchKey, page);

            // const response = await companyListAPI(searchKey, page);
            const response = await companyListAPI("",
                currentPage,
                '',
                pageSize);


            console.log("Company API Response:", response);

            if (response?.data?.success) {
                const list = response.data.response?.filter(item => !item?.is_company_inactive)?.map(item => ({
                    value: item.uid,
                    label: item.company_name
                }));

                setCompanyList(prev => [...prev, ...list]);
                setCompany_count(response?.data?.company_count || 0);
                setTotalPages(response?.data?.total_page || 1);
            }

        } catch (error) {
            console.log("Company API Error: ", error);
        }
    };

    useEffect(() => {
        getCompanyList();
    }, [currentPage]);

    // const router = useRouter();
    const searchParams = useSearchParams();

    const urlTab = searchParams.get("tab") || "all";

    // const [searchKey, setSearchKey] = useState(urlTab);

    // When URL tab changes → update selected tab
    useEffect(() => {
        const capitalizedTab =
            urlTab ? urlTab.charAt(0).toUpperCase() + urlTab.slice(1) : "";
        setSearchKey(capitalizedTab);
        setSearchKeyForTab(urlTab)
    }, [urlTab]);

    // When user clicks a tab → update URL also
    const handleTabSelect = (key) => {
        let updatedKey = key === "all" ? "" : key;

        const capitalizedKey =
            updatedKey ? updatedKey.charAt(0).toUpperCase() + updatedKey.slice(1) : "";

        setSearchKey(capitalizedKey);
        setSearchKeyForTab(key)
        router.push(`/PropertyListing?tab=${key}`, { scroll: false });
        setPage(1);
    };


    const handleExpandRow = (id) => {
        setExpandedRow(prev => {
            const current = prev[id] || 0;
            const next = current >= 3 ? 0 : current + 1;
            return { ...prev, [id]: next };
        });
    };

    const totalSelectedFilters =
        selectedCompanies.length;

    return (
        <>
            <Header />
            <div className='page-body All-company pt-5 pb-5'>
                <Container>
                    <ToastContainer />
                    <Row>
                        <Col md={12} >
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <h2 className='page-title'>Property Listings</h2>
                                <div className='d-flex align-items-center gap-3'>


                                    {canListProperty && (
                                        <Button variant="" className='btn-filter position-relative selected-list-border' onClick={filterShow} >
                                            {totalSelectedFilters > 0 && (
                                                <span className="selected-item">{totalSelectedFilters}</span>
                                            )}
                                            {/*  */}
                                            <Image src='./images/icons/filter.svg' className='img-fluid' width={24} height={24} alt='filter' />
                                        </Button>
                                    )}

                                    {canListProperty && (
                                        <div style={{ position: 'relative' }}>
                                            <Button variant="" className='btn-filter-export position-relative gap-3' style={{ color: '#000' }} onClick={() => setShowExportDropdown(s => !s)}>
                                                Export
                                                <span> <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' width={10} height={10} alt='filter' /></span>
                                            </Button>
                                            {showExportDropdown && (
                                                <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 10, background: '#fff', border: '1px solid #463527', boxShadow: '0 2px 8px #4635271F', minWidth: '260px' }}>
                                                    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                                        <Image src='/images/icons/file-pdf.svg' width={24} height={24} alt='PDF' />
                                                        <span style={{ color: '#463527' }}>as PDF for Current Parameters</span>
                                                    </div>
                                                    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                                        <Image src='/images/icons/file-excel.svg' width={24} height={24} alt='CSV' />
                                                        <span style={{ color: '#463527' }}>as CSV for current parameters</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}


                                    {canListProperty && (
                                        <div className='d-flex gap-3'>
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
                                    {canAddProperty && <Link href="./CreateNewListing" className='btn-company-add ' >  <span style={{ fontSize: '24px' }}> + </span>  &nbsp;Create New Listing</Link>}
                                </div>
                            </div>
                        </Col>

                        <Col md={12}>
                            {canListProperty && (
                                <div className='search-box mb-4'>
                                    <input type='text' placeholder='Search by property name, or location' className='form-control'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} />
                                    <button className='btn btn-search'>
                                        <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                                    </button>
                                </div>
                            )}
                        </Col>

                        <Col md={12} >
                            {canListProperty && (
                                <>
                                    <div className="property-listview" style={{ display: viewType === 'list' ? 'block' : 'none' }}>

                                        <Row>
                                            <Col md={12} >
                                                <Tabs
                                                    defaultActiveKey="all"
                                                    id="userlist-tab"
                                                    className="mb-3 pb-4 userlist-data-tabs"
                                                    activeKey={searchKeyForTab} onSelect={handleTabSelect}
                                                >

                                                    <Tab eventKey="all" title="All">
                                                        <Row>
                                                            <Col md={12} >
                                                                <div className='d-flex justify-content-between align-items-center mb-4'>
                                                                    {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                        <p className="mb-0">
                                                                            Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                        </p>

                                                                        <small>Total Properties: {propertyCount}</small>

                                                                        {/* PREVIOUS */}
                                                                        <Image
                                                                            src='./images/icons/back.svg'
                                                                            className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                            alt='back'
                                                                            width={10}
                                                                            height={10}
                                                                            style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                            onClick={handlePrevPage}
                                                                        />

                                                                        {/* NEXT */}
                                                                        <Image
                                                                            src='./images/icons/Arrows-right.svg'
                                                                            className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                            alt='right'
                                                                            width={29}
                                                                            height={29}
                                                                            style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                            onClick={handleNextPage}
                                                                        />

                                                                    </div>


                                                                </div>

                                                                <div className="position-relative">
                                                                    {/* Scroll Arrows */}
                                                                    {/* <div className="d-flex justify-content-end mb-3">
                                                                <div className="d-flex gap-2">
                                                                    {showLeftArrow && (
                                                                        <button
                                                                            className="btn btn-outline-secondary btn-sm"
                                                                            onClick={() => scrollTable('left')}
                                                                            style={{
                                                                                width: '40px',
                                                                                height: '40px',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}
                                                                        >
                                                                            <Image
                                                                                src='/images/icons/arrow-left.svg'
                                                                                width={16}
                                                                                height={16}
                                                                                alt='Scroll Left'
                                                                            />
                                                                        </button>
                                                                    )}
                                                                    {showRightArrow && (
                                                                        <button
                                                                            className="btn btn-outline-secondary btn-sm"
                                                                            onClick={() => scrollTable('right')}
                                                                            style={{
                                                                                width: '40px',
                                                                                height: '40px',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}
                                                                        >
                                                                            <Image
                                                                                src='/images/icons/Arrows-right.svg'
                                                                                width={16}
                                                                                height={16}
                                                                                alt='Scroll Right'
                                                                            />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div> */}

                                                                    {/* Table Container with Horizontal Scroll */}
                                                                    <div
                                                                        ref={tableRef}
                                                                        className={`table-scroll-wrapper ${isDragging ? "dragging" : ""}`}
                                                                        onMouseDown={handleMouseDown}
                                                                        onMouseLeave={handleMouseLeave}
                                                                        onMouseUp={handleMouseUp}
                                                                        onMouseMove={handleMouseMove}
                                                                        style={{
                                                                            overflowX: 'auto',
                                                                            position: 'relative',
                                                                            //whiteSpace: 'nowrap',
                                                                            //border: '1px solid #dee2e6',
                                                                            //borderRadius: '8px'
                                                                        }}
                                                                        onScroll={updateArrowVisibility}
                                                                    >
                                                                        <Table className='company-table mb-0' >
                                                                            <thead>
                                                                                <tr>
                                                                                    {/* Fixed First Column */}
                                                                                    <th style={{
                                                                                        width: '26%',
                                                                                        minWidth: '270px',
                                                                                        position: 'sticky',
                                                                                        left: 0,
                                                                                        backgroundColor: '#F2EEEB',
                                                                                        // zIndex: 10,
                                                                                        // borderRight: '2px solid #dee2e6'
                                                                                    }}>
                                                                                        Listing
                                                                                    </th>

                                                                                    {/* Scrollable Columns */}
                                                                                    <th style={{ width: '15%', minWidth: '250px', maxWidth: '250px' }}>Location</th>
                                                                                    <th style={{ width: '15%', minWidth: '150px' }}>No. of rooms</th>
                                                                                    <th style={{ width: '10%', minWidth: '150px' }}>Property caretaker</th>
                                                                                    <th style={{ width: '15%', minWidth: '180px' }}>Property manager</th>

                                                                                    <th style={{ width: '15%', minWidth: '180px' }}>Operations manager</th>
                                                                                    <th style={{ width: '10%', minWidth: '120px' }}>
                                                                                        Status
                                                                                    </th>
                                                                                    <th style={{ width: '15%', minWidth: '200px' }}>Company Name</th>
                                                                                    <th style={{ width: '15%', minWidth: '200px' }}>Booking Restrictions (Properties)</th>
                                                                                    <th style={{ width: '15%', minWidth: '200px' }}>Room Restriction</th>
                                                                                    <th style={{ width: '5%' }}></th>


                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {isLoading ? (
                                                                                    <tr>
                                                                                        <td colSpan="100%">
                                                                                            <div
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    justifyContent: "center",
                                                                                                    padding: "40px",
                                                                                                }}
                                                                                            >

                                                                                                {/* <BounceLoader /> */}
                                                                                                <BeatLoader />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ) : allPropertyList.length > 0 ? (
                                                                                    allPropertyList.map((item, idx) => (
                                                                                        <tr key={idx}>
                                                                                            {/* Fixed First Column Cell */}
                                                                                            <td style={{
                                                                                                position: 'sticky',
                                                                                                left: 0,
                                                                                                backgroundColor: '#F2EEEB',
                                                                                                //zIndex: 5,
                                                                                                ///borderRight: '2px solid #dee2e6'
                                                                                            }}
                                                                                            // onClick={() => {
                                                                                            //     if (item.property_status == "Draft") {
                                                                                            //         router.push(`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid }))}`)
                                                                                            //     } else {
                                                                                            //         router.push(`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid, edit: true }))}`)
                                                                                            //     }
                                                                                            // }}
                                                                                            >
                                                                                                <Link href={(item.property_status == "Draft" && canUpdateProperty) ? `/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid }))}` : canRetrieveProperty ? `/propertyDetails?uid=${item?.uid}` : ''} style={{ textDecoration: 'none', color: '#333' }}>
                                                                                                    <div className='d-flex align-items-center gap-3'>
                                                                                                        <Image style={{ objectFit: 'cover', height: '104px' }}
                                                                                                            src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"}
                                                                                                            width={56} height={104} alt="Property"
                                                                                                        />
                                                                                                        <p className="mb-0">
                                                                                                            <strong>{item.property_name}</strong> <br />
                                                                                                            {item.property_slug}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                </Link>
                                                                                            </td>

                                                                                            {/* Scrollable Column Cells */}
                                                                                            <td style={{ width: '15%', minWidth: '250px', maxWidth: '250px' }}>

                                                                                                <div className='d-flex align-items-center gap-2'>

                                                                                                    {item.street_number}, {item.city}, {item.state}, {item.country}

                                                                                                </div>

                                                                                            </td>
                                                                                            <td>
                                                                                                <span>Total: {item.total_rooms?.["Total"]}</span><br />
                                                                                                <span>Private: {item.total_rooms?.["Private"]}</span><br />
                                                                                                <span>Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</span>
                                                                                            </td>
                                                                                            <td>
                                                                                                {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                                            </td>
                                                                                            <td>
                                                                                                {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                                            </td>


                                                                                            <td>
                                                                                                {item.ops_manager_name || "--"}
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="d-flex justify-content-between gap-3 align-items-center">
                                                                                                    <span className={`badge-${item.property_status}`}>
                                                                                                        {item.property_status}
                                                                                                    </span>

                                                                                                    {/* FIXED ARROW — SAME PLACE ALWAYS */}
                                                                                                    {/* <span
                                                                                            className="arrow-right"
                                                                                            style={{ cursor: 'pointer' }}
                                                                                            onClick={() => handleExpandRow(item.uid)}
                                                                                        >
                                                                                            <Image
                                                                                                src="/images/icons/Arrows-right.svg"
                                                                                                width={20}
                                                                                                height={20}
                                                                                                alt="expand"
                                                                                            />
                                                                                        </span> */}
                                                                                                </div>
                                                                                            </td>


                                                                                            <td>
                                                                                                {item.assigned_companies && item.assigned_companies.length > 0 ? (
                                                                                                    item.assigned_companies.map((comp, i) => (
                                                                                                        <div key={i}>{comp.company_name}</div>
                                                                                                    ))
                                                                                                ) : (
                                                                                                    <div>N/A</div>
                                                                                                )}
                                                                                            </td>


                                                                                            <td>
                                                                                                {item.booking_restrictions?.some(
                                                                                                    comp => comp?.property_restricted_user && comp.property_restricted_user.length > 0
                                                                                                ) ? (
                                                                                                    item.booking_restrictions.map((comp, i) =>
                                                                                                        comp?.property_restricted_user ? (
                                                                                                            <div key={i}>{comp.property_restricted_user}</div>
                                                                                                        ) : null
                                                                                                    )
                                                                                                ) : (
                                                                                                    <div>N/A</div>
                                                                                                )}
                                                                                            </td>

                                                                                            <td>

                                                                                                {item.booking_restrictions?.some(
                                                                                                    comp => comp?.room_restricted_user && comp.room_restricted_user.length > 0
                                                                                                ) ? (
                                                                                                    item.booking_restrictions.map((comp, i) =>
                                                                                                        comp?.room_restricted_user ? (
                                                                                                            <div key={i}>{comp.room_restricted_user}</div>
                                                                                                        ) : null
                                                                                                    )
                                                                                                ) : (
                                                                                                    <div>N/A</div>
                                                                                                )}
                                                                                            </td>


                                                                                            {/* <td>
                                                                                        {item.booking_restrictions && item.booking_restrictions.length > 0 ? (
                                                                                            item.booking_restrictions.map((comp, i) => (
                                                                                                <div key={i}>{comp.property_restricted_user}</div>
                                                                                            ))
                                                                                        ) : (
                                                                                            <div>N/A</div>
                                                                                        )}
                                                                                    </td>

                                                                                    <td>
                                                                                        {item.booking_restrictions && item.booking_restrictions.length > 0 ? (
                                                                                            item.booking_restrictions.map((comp, i) => (
                                                                                                <div key={i}>{comp.restricted_room}</div>
                                                                                            ))
                                                                                        ) : (
                                                                                            <div>N/A</div>
                                                                                        )}
                                                                                    </td> */}

                                                                                            <td style={{ width: '5%', minWidth: '20px', position: 'sticky', right: 0, backgroundColor: '#F2EEEB' }}>
                                                                                                <span
                                                                                                    className="arrow-right"
                                                                                                    style={{ cursor: 'pointer' }}
                                                                                                    onClick={() => scrollTable('right')}
                                                                                                >
                                                                                                    <Image
                                                                                                        src="/images/icons/Arrows-right.svg"
                                                                                                        width={24}
                                                                                                        height={24}
                                                                                                        className="img-fluid"
                                                                                                        alt="Scroll Right"
                                                                                                    />
                                                                                                </span>
                                                                                            </td>

                                                                                            {/* <td>
                                                                                    <span
                                                                                        className="arrow-right"
                                                                                        style={{ cursor: 'pointer' }}
                                                                                        onClick={() => scrollTable('right')}
                                                                                    >
                                                                                        <Image
                                                                                            src='/images/icons/Arrows-right.svg'
                                                                                            width={24}
                                                                                            height={24}
                                                                                            className='img-fluid'
                                                                                            alt='Scroll Right'
                                                                                        />
                                                                                    </span>
                                                                                </td> */}
                                                                                        </tr>

                                                                                    ))
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan="100%" style={{ textAlign: "center" }}>
                                                                                            No data found
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </Table>
                                                                    </div>

                                                                </div>

                                                            </Col>
                                                        </Row>
                                                    </Tab>

                                                    <Tab eventKey="active" title="Active">

                                                        <div className='d-flex justify-content-between align-items-center mb-4'>
                                                            {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className="mb-0">
                                                                    Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                </p>

                                                                <small>Total Properties: {propertyCount}</small>

                                                                {/* PREVIOUS */}
                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                    onClick={handlePrevPage}
                                                                />

                                                                {/* NEXT */}
                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                    onClick={handleNextPage}
                                                                />

                                                            </div>


                                                        </div>
                                                        <Table className='company-table' responsive>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: '16%', minWidth: '250px' }} >Listing</th>
                                                                    <th style={{ width: '19%' }}>Location</th>
                                                                    <th style={{ width: '15%' }}>No. of rooms</th>
                                                                    <th style={{ width: '15%' }} >Property caretaker </th>
                                                                    <th style={{ width: '15%' }}>Property manager </th>

                                                                    <th style={{ width: '15%' }}>Operations manager </th>



                                                                    <th style={{ width: '' }} >
                                                                        Status
                                                                    </th>
                                                                    <th style={{ width: '20%' }}>
                                                                        <Image src='/images/icons/settings.svg' className="ms-auto me-0" width={16} height={16} alt='Sort' />

                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {isLoading ? (
                                                                    <tr>
                                                                        <td colSpan="100%">
                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    padding: "40px",
                                                                                }}
                                                                            >
                                                                                <BeatLoader />
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ) : allPropertyList.length > 0 ? (allPropertyList?.map((item, idx) => (
                                                                    <tr key={idx}>
                                                                        <td
                                                                        // onClick={() => router.push(`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid, edit: true }))}`)}
                                                                        >
                                                                            <Link href={canRetrieveProperty ? `/propertyDetails?uid=${item?.uid}` : ''} style={{ textDecoration: 'none', color: '#333' }}>
                                                                                <div className='d-flex align-items-center gap-3'>
                                                                                    {/* <Image
                                                                                // src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/Br-list-image.svg"} 
                                                                                src={item?.cover_photo_url ? `https://alicedevapi.casamelhor.in${item.cover_photo_url}` : "/images/icons/No-Image.svg"} */}

                                                                                    <Image
                                                                                        src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"}
                                                                                        width={56}
                                                                                        height={104}
                                                                                        className="img-fluid"
                                                                                        style={{ objectFit: 'cover', height: '104px' }}
                                                                                        alt="User"
                                                                                    />

                                                                                    <p className="mb-0">
                                                                                        <strong>{item.property_name}</strong> <br />
                                                                                        {item.property_slug}
                                                                                    </p>
                                                                                </div>
                                                                            </Link>

                                                                        </td>

                                                                        <td>
                                                                            {item.street_number}, {item.city}, {item.state}, {item.country}
                                                                        </td>
                                                                        {/* <div className='d-flex align-items-center gap-2'>

                                                                        B1-1103, Parshvanath Exotica, Sector 53, Gurugram, Haryana, 122011

                                                                    </div> */}


                                                                        {/* <td>
                                                                    <span>Total: {item.total_rooms?.Total}</span><br />
                                                                    <span>Private: {item.total_rooms?.Private}</span><br />
                                                                    <span>Twin-sharing: {item.total_rooms?.Twin-Sharing}</span>
                                                                </td> */}

                                                                        <td>
                                                                            <span>Total: {item.total_rooms?.["Total"]}</span><br />
                                                                            <span>Private: {item.total_rooms?.["Private"]}</span><br />
                                                                            <span>Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</span>
                                                                        </td>

                                                                        <td>
                                                                            {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                        </td>
                                                                        <td>
                                                                            {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                        </td>




                                                                        <td>
                                                                            {item.ops_manager_name || "--"}
                                                                        </td>

                                                                        <td>


                                                                            <div className="d-flex justify-content-between gap-3">

                                                                                <span className="badge-active" >
                                                                                    {item.property_status}
                                                                                </span >


                                                                                {/* <span className="arrow-right">
                                                                            <Image src='/images/icons/Arrows-right.svg' width={24} height={24} className='img-fluid ' alt='User' />
                                                                        </span> */}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className='bt-abs position-relative'>
                                                                                <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                    <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                </Link>
                                                                                <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>
                                                                                    {/* <li ><Link className='d-flex gap-2' href='./PropertyDetails'>View company details <Image src='./images/icons/open_in_new.svg' className='img-fluid' width={24} height={24} alt='open' /> </Link></li> */}

                                                                                    {/* <li><Link href='./ChangeDate'>Change Date</Link></li> */}
                                                                                    {canAddAssignProperty && (
                                                                                        <li>
                                                                                            {/* <Link href='./Assignmentedit'  className={`event-remove ${openPicIndex === idx ? "show" : "hide"}`}>Add Assignment</Link> */}
                                                                                            <Link
                                                                                                href={{
                                                                                                    pathname: "/Assignmentedit",
                                                                                                    query: { uid: item.uid }   // yaha UID bhej diya
                                                                                                }}
                                                                                                className={`event-remove ${openPicIndex === idx ? "show" : "hide"}`}
                                                                                            >
                                                                                                Add Assignment
                                                                                            </Link>
                                                                                        </li>
                                                                                    )}
                                                                                    {canUpdateProperty && (
                                                                                        <li><Link onClick={() => compnayStatusShow(item)} href='#'>INACTIVE </Link></li>
                                                                                    )}
                                                                                </ul>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))) : (
                                                                    <tr>
                                                                        <td colSpan="100%" style={{ textAlign: "center", padding: "40px" }}>
                                                                            No assigned properties found
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </Tab>

                                                    <Tab eventKey="draft" title="Draft">
                                                        <div className='d-flex justify-content-between align-items-center mb-4'>
                                                            {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className="mb-0">
                                                                    Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                </p>

                                                                <small>Total Properties: {propertyCount}</small>

                                                                {/* PREVIOUS */}
                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                    onClick={handlePrevPage}
                                                                />

                                                                {/* NEXT */}
                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                    onClick={handleNextPage}
                                                                />

                                                            </div>


                                                        </div>
                                                        <Table className='company-table' responsive>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: '16%', minWidth: '250px' }} >Listing</th>
                                                                    <th style={{ width: '19%' }}>Location</th>
                                                                    <th style={{ width: '15%' }}>No. of rooms</th>
                                                                    <th style={{ width: '15%' }} >Property caretaker </th>
                                                                    <th style={{ width: '15%' }}>Property manager </th>

                                                                    <th style={{ width: '15%' }}>Operations manager </th>
                                                                    <th style={{ width: '' }} >
                                                                        Status
                                                                    </th>
                                                                    <th style={{ width: '20%' }}>
                                                                        <Image src='/images/icons/settings.svg' className="ms-auto me-0" width={16} height={16} alt='Sort' />

                                                                    </th>
                                                                </tr>

                                                            </thead>
                                                            <tbody>
                                                                {isLoading ? (
                                                                    <tr>
                                                                        <td colSpan="100%">
                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    padding: "40px",
                                                                                }}
                                                                            >
                                                                                <BeatLoader />
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ) : allPropertyList.length > 0 ? (allPropertyList?.map((item, idx) => (
                                                                    <tr key={idx}>

                                                                        {/* Listing */}
                                                                        <td
                                                                        // onClick={() => router.push(`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid }))}`)}
                                                                        >
                                                                            <Link href={canUpdateProperty ? `/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid }))}` : ''} style={{ textDecoration: 'none', color: '#333' }}>
                                                                                <div className="d-flex align-items-center gap-3">
                                                                                    <Image
                                                                                        src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"}
                                                                                        style={{ objectFit: 'cover', height: '104px' }}
                                                                                        // src={item?.cover_photo_url ? `https://alicedevapi.casamelhor.in${item.cover_photo_url}` : "/images/icons/No-Image.svg"}
                                                                                        width={56} height={104} alt="Property" />
                                                                                    <p className="mb-0">
                                                                                        <strong>{item.property_name}</strong> <br />
                                                                                        {item.property_slug}
                                                                                    </p>
                                                                                </div>
                                                                            </Link>
                                                                        </td>
                                                                        <td>
                                                                            {item.street_number}, {item.city}, {item.state}, {item.country}
                                                                        </td>

                                                                        <td>
                                                                            <span>Total: {item.total_rooms?.["Total"]}</span><br />
                                                                            <span>Private: {item.total_rooms?.["Private"]}</span><br />
                                                                            <span>Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</span>
                                                                        </td>

                                                                        <td>
                                                                            {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                        </td>

                                                                        <td>
                                                                            {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                        </td>

                                                                        <td>
                                                                            {item.ops_manager_name || "--"}
                                                                        </td>

                                                                        {/* Status */}
                                                                        <td>
                                                                            <span className="badge-draft">{item.property_status}</span>
                                                                        </td>
                                                                        <td>
                                                                            <div className='bt-abs position-relative'>
                                                                                <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                    <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                </Link>
                                                                                <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>
                                                                                    {canUpdateProperty && (
                                                                                        <li onClick={() => router.push(`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid }))}`)}><Link className='d-flex gap-2' href='./PropertyDetails'>Edit Property details <Image src='./images/icons/open_in_new.svg' className='img-fluid' width={24} height={24} alt='open' /> </Link></li>
                                                                                    )}
                                                                                    {/* <li><Link href='./ChangeDate'>Change Date</Link></li>
                                                                            <li>
                                                                                <Link href='./Assignmentedit' className={`event-remove ${openPicIndex === idx ? "show" : "hide"}`}>Add Assignment</Link>
                                                                            </li>

                                                                            <li><Link onClick={cmppremodShow} href='#'>In Active Listing</Link></li> */}


                                                                                </ul>
                                                                            </div>
                                                                        </td>

                                                                    </tr>

                                                                ))) : (
                                                                    <tr>
                                                                        <td colSpan="100%" style={{ textAlign: "center", padding: "40px" }}>
                                                                            No assigned properties found
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </Tab>

                                                    <Tab eventKey="inactive" title="Inactive">

                                                        <div className='d-flex justify-content-between align-items-center mb-4'>
                                                            {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className="mb-0">
                                                                    Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                </p>

                                                                <small>Total Properties: {propertyCount}</small>

                                                                {/* PREVIOUS */}
                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                    onClick={handlePrevPage}
                                                                />

                                                                {/* NEXT */}
                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                    onClick={handleNextPage}
                                                                />

                                                            </div>


                                                        </div>


                                                        <Table className='company-table' responsive>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: '16%', minWidth: '250px' }} >Listing</th>
                                                                    <th style={{ width: '19%' }}>Location</th>
                                                                    <th style={{ width: '15%' }}>No. of rooms</th>
                                                                    <th style={{ width: '15%' }} >Property caretaker </th>
                                                                    <th style={{ width: '15%' }}>Property manager </th>

                                                                    <th style={{ width: '15%' }}>Operations manager </th>



                                                                    <th style={{ width: '' }} >
                                                                        Status
                                                                    </th>
                                                                    <th style={{ width: '10%' }}>
                                                                        <Image src='/images/icons/settings.svg' className="ms-auto me-0" width={16} height={16} alt='Sort' />

                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {isLoading ? (
                                                                    <tr>
                                                                        <td colSpan="100%">
                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    padding: "40px",
                                                                                }}
                                                                            >
                                                                                <BeatLoader />
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ) : allPropertyList.length > 0 ? (allPropertyList?.map((item, idx) => (
                                                                    <tr key={idx}>
                                                                        <td
                                                                        // onClick={() => router.push(`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid, edit: true }))}`)}
                                                                        >
                                                                            <Link href={canRetrieveProperty ? `/propertyDetails?uid=${item?.uid}` : ''} style={{ textDecoration: 'none', color: '#333' }}>
                                                                                <div className='d-flex align-items-center gap-3'>
                                                                                    <Image
                                                                                        // src={item?.cover_photo_url ? `https://alicedevapi.casamelhor.in${item.cover_photo_url}` : "/images/icons/No-Image.svg"}
                                                                                        src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"}
                                                                                        width={56}
                                                                                        style={{ objectFit: 'cover', height: '104px' }}
                                                                                        height={104}
                                                                                        className="img-fluid"
                                                                                        alt="User"
                                                                                    />

                                                                                    <p className="mb-0">
                                                                                        <strong>{item.property_name}</strong> <br />
                                                                                        {item.property_slug}
                                                                                    </p>
                                                                                </div>
                                                                            </Link>

                                                                        </td>
                                                                        {/* <td>
                                                                    <div className='d-flex align-items-center gap-2'>

                                                                        B1-1103, Parshvanath Exotica, Sector 53, Gurugram, Haryana, 122011

                                                                    </div>

                                                                </td> */}

                                                                        <td>
                                                                            <div className='d-flex align-items-center gap-2'>
                                                                                {item.street_number}, {item.city}, {item.state}, {item.country}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <span>Total: {item.total_rooms?.["Total"]}</span><br />
                                                                            <span>Private: {item.total_rooms?.["Private"]}</span><br />
                                                                            <span>Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</span>
                                                                        </td>

                                                                        <td>
                                                                            {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                        </td>
                                                                        <td>
                                                                            {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                        </td>


                                                                        <td>
                                                                            {item.ops_manager_name || "--"}
                                                                        </td>




                                                                        <td>
                                                                            <span className="badge-inactive" >
                                                                                {item.property_status}
                                                                            </span >

                                                                        </td>

                                                                        <td>

                                                                            <div className='bt-abs position-relative'>
                                                                                <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                    <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                </Link>
                                                                                <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>

                                                                                    {/* <li ><Link className='d-flex gap-2' href='#'>View company details <Image src='./images/icons/open_in_new.svg' className='img-fluid' width={24} height={24} alt='open' /> </Link></li> */}

                                                                                    {/* <li><Link href='#'>Active </Link></li> */}
                                                                                    {canUpdateProperty && (
                                                                                        <li><Link onClick={() => compnayStatusShow(item)} href='#'>Active </Link></li>
                                                                                    )}

                                                                                </ul>
                                                                            </div>
                                                                        </td>





                                                                    </tr>

                                                                ))) : (
                                                                    <tr>
                                                                        <td colSpan="100%" style={{ textAlign: "center", padding: "40px" }}>
                                                                            No assigned properties found
                                                                        </td>
                                                                    </tr>
                                                                )}

                                                            </tbody>
                                                        </Table>


                                                    </Tab>

                                                    <Tab eventKey="assigned" title="Assigned">

                                                        <Row>
                                                            <Col md={12} >
                                                                <div className='d-flex justify-content-between align-items-center mb-4'>
                                                                    {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                                    <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                        <p className="mb-0">
                                                                            Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                        </p>

                                                                        <small>Total Properties: {propertyCount}</small>

                                                                        {/* PREVIOUS */}
                                                                        <Image
                                                                            src='./images/icons/back.svg'
                                                                            className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                            alt='back'
                                                                            width={10}
                                                                            height={10}
                                                                            style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                            onClick={handlePrevPage}
                                                                        />

                                                                        {/* NEXT */}
                                                                        <Image
                                                                            src='./images/icons/Arrows-right.svg'
                                                                            className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                            alt='right'
                                                                            width={29}
                                                                            height={29}
                                                                            style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                            onClick={handleNextPage}
                                                                        />

                                                                    </div>


                                                                </div>

                                                                <Table className='company-table' responsive>
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: '15%', minWidth: '250px' }} >Listing Name</th>
                                                                            <th style={{ width: '15%' }}>Company Name</th>
                                                                            <th style={{ width: '15%', minWidth: '150px' }}>No. of rooms</th>
                                                                            <th style={{ width: '15%' }}>Room Restriction</th>
                                                                            <th style={{ width: '15%' }}>Booking Restriction (Property) </th>
                                                                            <th style={{ width: '15%' }}>Assigned by </th>
                                                                            <th style={{ width: '5%' }} >
                                                                                Status
                                                                            </th>

                                                                            <th style={{ width: '20%' }}>
                                                                                <Image src='/images/icons/settings.svg' className="ms-auto me-0" width={16} height={16} alt='Sort' />

                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {isLoading ? (
                                                                            <tr>
                                                                                <td colSpan="100%">
                                                                                    <div
                                                                                        style={{
                                                                                            display: "flex",
                                                                                            justifyContent: "center",
                                                                                            padding: "40px",
                                                                                        }}
                                                                                    >
                                                                                        <BeatLoader />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ) : allPropertyList.length > 0 ? (
                                                                            allPropertyList.map((item, idx) => (
                                                                                <tr key={idx}>
                                                                                    <td
                                                                                    // onClick={() => router.push(`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid, edit: true }))}`)}
                                                                                    >
                                                                                        <Link href={canRetrieveProperty ? `/propertyDetails?uid=${item?.uid}` : ''} style={{ textDecoration: 'none', color: '#333' }}>
                                                                                            <div className="d-flex align-items-center gap-3">
                                                                                                <Image
                                                                                                    src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"}
                                                                                                    style={{ objectFit: 'cover', height: '104px' }}
                                                                                                    // src={item?.cover_photo_url ? `https://alicedevapi.casamelhor.in${item.cover_photo_url}` : "/images/icons/No-Image.svg"}
                                                                                                    width={56} height={104} alt="Property" />
                                                                                                <p className='mb-0'>
                                                                                                    <span style={{ fontWeight: '500' }}>
                                                                                                        {item.property_slug}
                                                                                                    </span>
                                                                                                </p>
                                                                                            </div>
                                                                                        </Link>
                                                                                    </td>
                                                                                    <td>
                                                                                        <Link href={canRetrieveCompany ? `./CompanyDetails/${item?.uid}` : ''} style={{ textDecoration: 'none', color: '#333' }} >
                                                                                            {item.assigned_companies?.map((comp, i) => (
                                                                                                <div key={i}>
                                                                                                    {comp.company_name}
                                                                                                </div>
                                                                                            ))}
                                                                                        </Link>
                                                                                    </td>

                                                                                    <td>
                                                                                        <span>Total: {item.total_rooms?.["Total"]}</span><br />
                                                                                        <span>Private: {item.total_rooms?.["Private"]}</span><br />
                                                                                        <span>Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</span>
                                                                                    </td>

                                                                                    {/* <td>
                                                                            {item.assigned_companies?.map((comp, i) => (
                                                                                <div key={i}>
                                                                                    From {formatDate(comp.assigned_from)}
                                                                                    <br />
                                                                                    to {formatDate(comp.assigned_to)}
                                                                                </div>
                                                                            ))}
                                                                        </td> */}


                                                                                    <td>

                                                                                        {item.booking_restrictions?.some(
                                                                                            comp => comp?.room_restricted_user && comp.room_restricted_user.length > 0
                                                                                        ) ? (
                                                                                            item.booking_restrictions.map((comp, i) =>
                                                                                                comp?.room_restricted_user ? (
                                                                                                    <div key={i}>{comp.room_restricted_user}</div>
                                                                                                ) : null
                                                                                            )
                                                                                        ) : (
                                                                                            <div>N/A</div>
                                                                                        )}
                                                                                    </td>

                                                                                    <td>
                                                                                        {item.booking_restrictions?.some(
                                                                                            comp => comp?.property_restricted_user && comp.property_restricted_user.length > 0
                                                                                        ) ? (
                                                                                            item.booking_restrictions.map((comp, i) =>
                                                                                                comp?.property_restricted_user ? (
                                                                                                    <div key={i}>{comp.property_restricted_user}</div>
                                                                                                ) : null
                                                                                            )
                                                                                        ) : (
                                                                                            <div>N/A</div>
                                                                                        )}
                                                                                    </td>
                                                                                    {/* 
                                                                        <td>
                                                                            {item.booking_restrictions?.map((comp, i) => (
                                                                                <div key={i}>
                                                                                {(comp.restricted_room)}
                                                                                 
                                                                                </div>
                                                                            ))}
                                                                        </td> */}

                                                                                    <td>
                                                                                        {[...new Set(
                                                                                            item.assigned_companies
                                                                                                ?.map(comp => comp.assigned_by)
                                                                                                .filter(Boolean)
                                                                                        )].map((assignedBy, i) => (
                                                                                            <div key={i}>{assignedBy}</div>
                                                                                        ))}
                                                                                    </td>

                                                                                    <td>

                                                                                        <span className={`badge-${item.property_status}`}>{item.property_status}</span>


                                                                                    </td>


                                                                                    <td>
                                                                                        <div className='bt-abs position-relative'>
                                                                                            <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                                <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                                            </Link>
                                                                                            <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>
                                                                                                {canRetrieveAssignProperty && (
                                                                                                    <li >
                                                                                                        <Link className='d-flex gap-2'
                                                                                                            href={`/propertyDetails?uid=${item?.uid}&tab=assignments`}
                                                                                                        // href={`./PropertyDetails/${item?.uid}`}
                                                                                                        >View Assignment details <Image src='./images/icons/open_in_new.svg' className='img-fluid' width={24} height={24} alt='open' />
                                                                                                        </Link>
                                                                                                    </li>
                                                                                                )}

                                                                                                {canUpdateAssignProperty && <li><Link href={`/ChangeDate/${item.uid}`}>Change Date</Link></li>}
                                                                                                {canDeleteAssignProperty && (
                                                                                                    <li>
                                                                                                        <Link href='#' onClick={() => handleRemoveAssignment(item)} className={`event-remove ${openPicIndex === idx ? "show" : "hide"}`}>Remove Assignment</Link>
                                                                                                    </li>
                                                                                                )}
                                                                                                {canUpdateProperty && (
                                                                                                    <li><Link onClick={() => compnayStatusShow(item)} href='#'>INACTIVE</Link></li>
                                                                                                )}
                                                                                            </ul>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="100%" style={{ textAlign: "center", padding: "40px" }}>
                                                                                    No assigned properties found
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </Table>
                                                            </Col>
                                                        </Row>
                                                    </Tab>
                                                </Tabs>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="property-gridview" style={{ display: viewType === 'grid' ? 'block' : 'none' }} >
                                        <Row>
                                            <Col md={6} >
                                                <Tabs
                                                    defaultActiveKey="all"
                                                    id="gridlist-tab"
                                                    className="mb-3 pb-4 userlist-data-tabs"
                                                    // activeKey={searchKey}
                                                    // onSelect={handleTabSelect}
                                                    activeKey={searchKeyForTab}
                                                    onSelect={handleTabSelect}
                                                >
                                                    <Tab eventKey="all" title="All">
                                                        <PropertyMap properties={allPropertyList} />
                                                        <Row>
                                                            <Col md={12} >
                                                                <div>
                                                                    <div className='d-flex justify-content-between align-items-center mb-4'>
                                                                        {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                                        <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                            <p className="mb-0">
                                                                                Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                            </p>

                                                                            <small>Total Properties: {propertyCount}</small>

                                                                            {/* PREVIOUS */}
                                                                            <Image
                                                                                src='./images/icons/back.svg'
                                                                                className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                                alt='back'
                                                                                width={10}
                                                                                height={10}
                                                                                style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                                onClick={handlePrevPage}
                                                                            />

                                                                            {/* NEXT */}
                                                                            <Image
                                                                                src='./images/icons/Arrows-right.svg'
                                                                                className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                                alt='right'
                                                                                width={29}
                                                                                height={29}
                                                                                style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                                onClick={handleNextPage}
                                                                            />

                                                                        </div>


                                                                    </div>
                                                                    {allPropertyList?.map((item, idx) => (
                                                                        <Row key={idx} className='border-bottom mt-4 pb-3 pt-2 mb-4'>

                                                                            <Col md={4}>
                                                                                <div className="proprty-thumbnail position-relative">
                                                                                    <Image src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"}
                                                                                        className="img-fluid" width={200} height={220} alt="as" />

                                                                                    {item.property_status?.toLowerCase() === "draft" ? (
                                                                                        // Draft
                                                                                        <div
                                                                                            className="status-property absolute bottom-3 left-3"
                                                                                            style={{ background: "#B1B1B1" }}
                                                                                        >
                                                                                            <span className="text-light">{item.property_status}</span>
                                                                                        </div>
                                                                                    ) : item.property_status?.toLowerCase() === "inactive" ? (
                                                                                        // Inactive
                                                                                        <div className="status-property absolute bottom-3 left-3">
                                                                                            <span className="text-danger">{item.property_status}</span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        // Active / Assigned / Others
                                                                                        <div className="status-property absolute bottom-3 left-3">
                                                                                            <span className="text-success">{item.property_status}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </Col>
                                                                            <Col md={8}>
                                                                                <div className="property-grid-details">
                                                                                    <p className="font-18" >{item.property_name} </p>
                                                                                    <p className="mb-1">  {item.street_number}, {item.city}, {item.state}, {item.country}</p>

                                                                                    <p className="mb-0">Total: {item.total_rooms?.["Total"]} | Private:  {item.total_rooms?.["Private"]} | Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</p>
                                                                                    {/* <span>Total: {item.total_rooms?.["Total"]}</span><br />
                                                                                    <span>Private: {item.total_rooms?.["Private"]}</span><br />
                                                                                    <span>Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</span> */}


                                                                                    <div className="d-flex justify-content-between align-items-end mt-3">
                                                                                        <ul className="property-amenties ps-0">
                                                                                            <li className="d-flex gap-2">
                                                                                                <Image src="./images/icons/person_raised.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/cleaning.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip1}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/siren.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.ops_manager_name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip2}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                        </ul>

                                                                                        {(item.property_status?.toLowerCase() === "draft" && canUpdateProperty) ? (
                                                                                            <Link href={`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid }))}`} className="complete-form-btn mb-3 " style={{ padding: '10px 30px' }}>Complete Step</Link>
                                                                                        ) : canRetrieveProperty ? (
                                                                                            <Link href={`/propertyDetails?uid=${item?.uid}`} className="complete-form-btn mb-3 " style={{ padding: '10px 30px' }}>View Details</Link>
                                                                                        ) : ''}

                                                                                    </div>
                                                                                </div>

                                                                            </Col>
                                                                        </Row>
                                                                    ))}


                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Tab>

                                                    <Tab eventKey="active" title="Active">
                                                        <PropertyMap properties={allPropertyList} />
                                                        <Row>
                                                            <Col md={12} >
                                                                <div >
                                                                    <div className='d-flex justify-content-between align-items-center mb-4'>
                                                                        {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                                        <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                            <p className="mb-0">
                                                                                Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                            </p>

                                                                            <small>Total Properties: {propertyCount}</small>

                                                                            {/* PREVIOUS */}
                                                                            <Image
                                                                                src='./images/icons/back.svg'
                                                                                className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                                alt='back'
                                                                                width={10}
                                                                                height={10}
                                                                                style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                                onClick={handlePrevPage}
                                                                            />

                                                                            {/* NEXT */}
                                                                            <Image
                                                                                src='./images/icons/Arrows-right.svg'
                                                                                className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                                alt='right'
                                                                                width={29}
                                                                                height={29}
                                                                                style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                                onClick={handleNextPage}
                                                                            />

                                                                        </div>


                                                                    </div>
                                                                    {allPropertyList?.map((item, idx) => (
                                                                        <Row key={idx} className='border-bottom mt-4 pb-3 pt-2 mb-4'>
                                                                            <Col md={4}>
                                                                                <div className="proprty-thumbnail position-relative">
                                                                                    <Image src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"} className="img-fluid" width={200} height={220} alt="as" />

                                                                                    <div className="status-property absolute bottom-3 left-3">
                                                                                        <span className="text-success" >{item.property_status}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col md={8}>
                                                                                <div className="property-grid-details">
                                                                                    <p className="font-18" >{item.property_name}</p>
                                                                                    <p className="mb-1">{item.street_number}, {item.city}, {item.state}, {item.country}</p>

                                                                                    <p className="mb-0">Total: {item.total_rooms?.["Total"]} | Private: {item.total_rooms?.["Private"]} | Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</p>




                                                                                    <div className="d-flex justify-content-between align-items-end mt-3">
                                                                                        <ul className="property-amenties ps-0">
                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/person_raised.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/cleaning.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip1}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/siren.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.ops_manager_name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip2}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                        </ul>

                                                                                        {canRetrieveProperty && <Link href={`/propertyDetails?uid=${item?.uid}`} className="complete-form-btn mb-3 " style={{ padding: '10px 30px' }}>View Details</Link>}

                                                                                    </div>


                                                                                </div>

                                                                            </Col>

                                                                        </Row>
                                                                    ))}
                                                                </div>
                                                            </Col>
                                                        </Row>


                                                    </Tab>

                                                    <Tab eventKey="draft" title="Draft">
                                                        <PropertyMap properties={allPropertyList} />
                                                        <Row>
                                                            <Col md={12} >
                                                                <div >
                                                                    <div className='d-flex justify-content-between align-items-center mb-4'>
                                                                        {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                                        <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                            <p className="mb-0">
                                                                                Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                            </p>

                                                                            <small>Total Properties: {propertyCount}</small>

                                                                            {/* PREVIOUS */}
                                                                            <Image
                                                                                src='./images/icons/back.svg'
                                                                                className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                                alt='back'
                                                                                width={10}
                                                                                height={10}
                                                                                style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                                onClick={handlePrevPage}
                                                                            />

                                                                            {/* NEXT */}
                                                                            <Image
                                                                                src='./images/icons/Arrows-right.svg'
                                                                                className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                                alt='right'
                                                                                width={29}
                                                                                height={29}
                                                                                style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                                onClick={handleNextPage}
                                                                            />

                                                                        </div>


                                                                    </div>
                                                                    {allPropertyList?.map((item, idx) => (
                                                                        <Row key={idx} className='border-bottom mt-4 pb-3 pt-2 mb-4'>
                                                                            <Col md={4}>
                                                                                <div className="proprty-thumbnail position-relative">
                                                                                    <Image src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"} className="img-fluid" width={200} height={220} alt="as" />

                                                                                    <div className="status-property absolute bottom-3 left-3" style={{ background: '#B1B1B1' }}>
                                                                                        <span className="text-light" >{item.property_status}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col md={8}>
                                                                                <div className="property-grid-details">
                                                                                    <p className="font-18" >{item.property_name}</p>
                                                                                    <p className="mb-1">{item.street_number}, {item.city}, {item.state}, {item.country}</p>

                                                                                    <p className="mb-0">Total: {item.total_rooms?.["Total"]} | Private: {item.total_rooms?.["Private"]} | Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</p>


                                                                                    <div className="d-flex justify-content-between align-items-end mt-3">
                                                                                        <ul className="property-amenties ps-0">
                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/person_raised.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/cleaning.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip1}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/siren.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.ops_manager_name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip2}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                        </ul>

                                                                                        {canUpdateProperty && <Link href={`/CreateNewListing?state=${encodeURIComponent(JSON.stringify({ id: item?.uid }))}`} className="complete-form-btn mb-3 " style={{ padding: '10px 30px' }}>Complete Step</Link>}

                                                                                    </div>

                                                                                </div>

                                                                            </Col>

                                                                        </Row>

                                                                    ))}



                                                                </div>
                                                            </Col>
                                                        </Row>


                                                    </Tab>

                                                    <Tab eventKey="inactive" title="Inactive">
                                                        <PropertyMap properties={allPropertyList} />
                                                        <Row>
                                                            <Col md={12} >
                                                                <div >
                                                                    <div className='d-flex justify-content-between align-items-center mb-4'>
                                                                        {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                                        <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                            <p className="mb-0">
                                                                                Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                            </p>

                                                                            <small>Total Properties: {propertyCount}</small>

                                                                            {/* PREVIOUS */}
                                                                            <Image
                                                                                src='./images/icons/back.svg'
                                                                                className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                                alt='back'
                                                                                width={10}
                                                                                height={10}
                                                                                style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                                onClick={handlePrevPage}
                                                                            />

                                                                            {/* NEXT */}
                                                                            <Image
                                                                                src='./images/icons/Arrows-right.svg'
                                                                                className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                                alt='right'
                                                                                width={29}
                                                                                height={29}
                                                                                style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                                onClick={handleNextPage}
                                                                            />

                                                                        </div>


                                                                    </div>
                                                                    {allPropertyList?.map((item, idx) => (
                                                                        <Row key={idx} className='border-bottom mt-4 pb-3 pt-2 mb-4'>
                                                                            <Col md={4}>
                                                                                <div className="proprty-thumbnail position-relative">
                                                                                    <Image src="/images/icons/property-thumb.jpg" className="img-fluid" width={200} height={220} alt="as" />

                                                                                    <div className="status-property absolute bottom-3 left-3">
                                                                                        <span className="text-danger" >{item.property_status}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col md={8}>
                                                                                <div className="property-grid-details">
                                                                                    <p className="font-18" >{item.property_name}</p>
                                                                                    <p className="mb-1"> {item.street_number}, {item.city}, {item.state}, {item.country}</p>

                                                                                    <p className="mb-0">Total: {item.total_rooms?.["Total"]} | Private: {item.total_rooms?.["Private"]} | Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</p>

                                                                                    <div className="d-flex justify-content-between align-items-end mt-3">
                                                                                        <ul className="property-amenties ps-0">
                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/person_raised.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip2}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/cleaning.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip1}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                            <li className="d-flex gap-2"><Image src="./images/icons/siren.svg" className="img-fluid" width={16} height={16} alt="amen" />
                                                                                                {item.ops_manager_name || "--"}
                                                                                                <OverlayTrigger
                                                                                                    placement="right"
                                                                                                    delay={{ show: 250, hide: 400 }}
                                                                                                    overlay={renderTooltip2}
                                                                                                ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                        </ul>

                                                                                        {canRetrieveProperty && <Link href={`/propertyDetails?uid=${item?.uid}`} className="complete-form-btn mb-3 " style={{ padding: '10px 30px' }}>View Details</Link>}

                                                                                    </div>


                                                                                </div>

                                                                            </Col>

                                                                        </Row>
                                                                    ))}


                                                                </div>

                                                            </Col>
                                                        </Row>

                                                    </Tab>

                                                    <Tab eventKey="assigned" title="Assigned">
                                                        <PropertyMap properties={allPropertyList} />
                                                        <div className='d-flex justify-content-between align-items-center mb-4'>
                                                            {/* <p className='mb-0'> <strong>{allPropertyList?.length || 0}</strong>  Companies</p> */}
                                                            <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>

                                                                <p className="mb-0">
                                                                    Page <strong>{page}</strong> of <strong>{totalPage}</strong>
                                                                </p>

                                                                <small>Total Properties: {propertyCount}</small>

                                                                {/* PREVIOUS */}
                                                                <Image
                                                                    src='./images/icons/back.svg'
                                                                    className={`img-fluid prev-a ${page === 1 ? 'mute' : ''}`}
                                                                    alt='back'
                                                                    width={10}
                                                                    height={10}
                                                                    style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                                                    onClick={handlePrevPage}
                                                                />

                                                                {/* NEXT */}
                                                                <Image
                                                                    src='./images/icons/Arrows-right.svg'
                                                                    className={`img-fluid next-a ${page === totalPageFrontend ? 'mute' : ''}`}
                                                                    alt='right'
                                                                    width={29}
                                                                    height={29}
                                                                    style={{ cursor: !hasNextPage ? 'not-allowed' : 'pointer' }}
                                                                    onClick={handleNextPage}
                                                                />

                                                            </div>


                                                        </div>
                                                        {allPropertyList?.map((item, idx) => (
                                                            <Row key={idx} className='border-bottom mt-4 pb-3 pt-2 mb-4'>

                                                                <Col md={4}>
                                                                    <div className="proprty-thumbnail position-relative">
                                                                        <Image src={item.cover_photo_url ? item.cover_photo_url : "/images/icons/No-Image.svg"} className="img-fluid" width={200} height={220} alt="as" />

                                                                        <div className="status-property absolute bottom-3 left-3">
                                                                            <span className="text-success" >{item.property_status}</span>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col md={8}>
                                                                    <div className="property-grid-details">
                                                                        <p className="font-18" >
                                                                            {item.property_name}
                                                                        </p>
                                                                        <p className="mb-1"> {item.street_number}, {item.city}, {item.state}, {item.country}</p>

                                                                        <p className="mb-0">Total: {item.total_rooms?.["Total"]} | Private: {item.total_rooms?.["Private"]} | 2 Twin-sharing: {item.total_rooms?.["Twin-Sharing"]}</p>

                                                                        <div className="d-flex justify-content-between align-items-end mt-3">
                                                                            <ul className="property-amenties ps-0">
                                                                                <li className="d-flex gap-2"><Image src="./images/icons/person_raised.svg" className="img-fluid" width={16} height={16} alt="amen" />        {item.staff_assignment?.property_managers?.[0]?.name || "--"}
                                                                                    <OverlayTrigger
                                                                                        placement="right"
                                                                                        delay={{ show: 250, hide: 400 }}
                                                                                        overlay={renderTooltip}
                                                                                    ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                <li className="d-flex gap-2"><Image src="./images/icons/cleaning.svg" className="img-fluid" width={16} height={16} alt="amen" />   {item.staff_assignment?.property_caretakers?.[0]?.name || "--"}
                                                                                    <OverlayTrigger
                                                                                        placement="right"
                                                                                        delay={{ show: 250, hide: 400 }}
                                                                                        overlay={renderTooltip1}
                                                                                    ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                                <li className="d-flex gap-2"><Image src="./images/icons/siren.svg" className="img-fluid" width={16} height={16} alt="amen" />  {item.ops_manager_name || "--"}
                                                                                    <OverlayTrigger
                                                                                        placement="right"
                                                                                        delay={{ show: 250, hide: 400 }}
                                                                                        overlay={renderTooltip2}
                                                                                    ><Image src="./images/icons/info-i.svg" className="img-fluid" width={16} height={16} alt="amen" /></OverlayTrigger></li>

                                                                            </ul>

                                                                            <Link href={`/propertyDetails?uid=${item?.uid}`} className="complete-form-btn mb-3 " style={{ padding: '10px 30px' }}>View Details</Link>

                                                                        </div>


                                                                    </div>

                                                                </Col>

                                                            </Row>
                                                        ))}


                                                    </Tab>

                                                </Tabs>
                                            </Col>
                                            {/* <Col md={6}>
                                        <div className="map-view-full">
                                            <Image src='/images/icons/map-full.jpg' className="img-fluid" alt="Map" width={500} height={500} />
                                        </div>

                                    </Col> */}
                                            <Col
                                                md={6}
                                                style={{
                                                    height: "calc(100vh - 180px)",
                                                    position: "sticky",
                                                    top: "120px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height: "100%",
                                                        width: "100%",
                                                        borderRadius: "12px",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <PropertyMap properties={allPropertyList} />

                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </>
                            )}

                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Filter modal */}
            <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >

                    Filters

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    {canListCompany && (
                        <div className='filter-compnay-details'>
                            <p className='d-flex justify-content-between' >Companies <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>

                            <ul className="company-name-filter">
                                {companyList.map((item, index) => {
                                    const checkboxId = `company_${index}`;
                                    const isChecked = selectedCompanies.includes(item.value);

                                    return (
                                        <li key={index}>
                                            <input
                                                type="checkbox"
                                                id={checkboxId}
                                                checked={isChecked}
                                                onChange={() => {
                                                    if (isChecked) {
                                                        setSelectedCompanies(prev =>
                                                            prev.filter(c => c !== item.value)
                                                        );
                                                        setPage(1);
                                                    } else {
                                                        setSelectedCompanies(prev => [...prev, item.value]);
                                                    }
                                                }}
                                                className="custom-checkbox"
                                            />

                                            <label htmlFor={checkboxId}>
                                                {item.label}
                                            </label>
                                        </li>
                                    );
                                })}

                            </ul>

                            <span style={{ cursor: 'pointer' }} onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}>View More</span>
                            <hr style={{ margin: '15px 0 30px' }} ></hr>



                        </div>

                    )}

                    <div className='filter-compnay-details'>
                        <p className='d-flex justify-content-between' >Location <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>
                        <div className='search-box '>
                            <input type='text' placeholder='Search by company name, or location' value={searchLocationTerm}
                                onChange={(e) => { setSearchLocationTerm(e.target.value); setPage(1) }} className='form-control' />
                            <button className='btn btn-search'>
                                <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                            </button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <p onClick={filterClear}>
                        Clear all
                    </p>
                    <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={getPropertyList}>
                        Show Properties
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Draft show */}
            <Modal show={opensDraft} onHide={closeDraft} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between PB-0' >



                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} className="ms-auto me-0" onClick={closeDraft} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <Image src="/images/icons/draft-img-1.jpg" className="img-fluid ms-auto me-auto" width={200} height={220} alt="as" />

                    <p className="font-18 ms-auto me-auto text-center mt-4" >Listing started on 8 August 2025</p>



                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between flex-column '>

                    <Button variant="" className='search-btn complete-form-btn w-100' style={{ padding: '15px 25px', borderRadius: '0' }} onClick={filterClose}>
                        Edit Listing
                    </Button>
                    <Button variant="" className="btn-company-add w-100 mt-2" style={{ padding: '13px 25px', borderRadius: '0' }} onClick={closeDraft}>
                        <Image src="/images/icons/delete_b.svg" className="img-fluid " width={24} height={24} alt="as" />
                        Clear all
                    </Button>
                </Modal.Footer>

            </Modal>

            {/*  */}
            <Modal show={show} onHide={cmppremodClose} animation={false} centered className='custom-theme-modal' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >
                    <Modal.Title>Edit listings preferences</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={cmppremodClose} />
                </Modal.Header>
                <Modal.Body className='pt-0'>



                    <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
                        <div className=''>
                            <p className='font-18 mb-0'> listing status</p>
                            <span className='badge ' style={{
                                background: 'transparent', color: '#E07912', fontWeight: '500', fontSize: '14px', padding: '5px 10px', borderRadius: '4px', textTransform: 'Uppercase'
                            }} > Active </span>
                        </div>
                        <Button variant="" onClick={() => {
                            cmppremodClose();
                            compnayStatusShow();
                        }} className='' style={{
                            background: 'transparent', color: '#463527', border: 'none', padding: '0',
                        }}>
                            <Image src='/images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />

                        </Button>
                    </div>

                    <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
                        <div className=''>
                            <p className='font-18 mb-0'> Remove listing </p>
                            <p className='mb-0'> Permanently remove your listing</p>
                        </div>

                        <Button variant="" onClick={() => {
                            cmppremodClose();
                            compnayRemoveShow();
                        }} className='' style={{
                            background: 'transparent', color: '#463527', border: 'none', padding: '0',
                        }}>
                            <Image src='/images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />

                        </Button>
                    </div>




                </Modal.Body>

            </Modal>

            {/*  */}
            <Modal show={compnayShow} onHide={compnayStatusClose} className='custom-theme-modal status-height-70' animation={false} centered >
                <Modal.Header className='d-flex align-items-center justify-content-between ' >
                    <Modal.Title>Change listing status</Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={compnayStatusClose} />
                </Modal.Header>
                <Modal.Body>

                    <div className='company-status-box'>
                        <div className='form-group mb-2'>
                            <label>Current Status</label>
                            <Select
                                name="aria-live-color"
                                options={statusOption}
                                placeholder="Choose Status"
                                className="react_selectbox"
                                isSearchable={false}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                styles={customStyles}
                            />
                        </div>
                        {selectedStatus?.value === "Inactive" && (
                            <p style={{
                                color: '#73615F'
                            }}>The company will be unlisted until you change the status.</p>

                        )}


                        {/* 👇 Conditionally show section if Inactive */}
                        {selectedStatus?.value === "Inactive" && (
                            <div className="inactive-box">
                                <Row className=''>
                                    <Col md={6}>
                                        <div className='form-group mb-4'>
                                            <label>Inactive date from</label>
                                            <DatePicker
                                                selected={inactiveFrom}
                                                onChange={(date) => setInactiveFrom(date)}
                                                placeholderText="Select date"
                                                className="form-control  custom-date-picker"
                                                dateFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                startDate={new Date()}
                                            // disabled={isInactiveStatus}
                                            // customInput={<DisabledDateInput disabled={isInactiveStatus} />}
                                            />
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className='form-group mb-4'>
                                            <label>Inactive date to</label>
                                            <DatePicker
                                                selected={inactiveTo}
                                                onChange={(date) => setInactiveTo(date)}
                                                placeholderText="Select date"
                                                className="form-control custom-date-picker"
                                                dateFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                startDate={new Date()}
                                            // disabled={isInactiveStatus}
                                            // style={isInactiveStatus ? { color: "#999" } : {}}
                                            // customInput={<DisabledDateInput disabled={isInactiveStatus} />}
                                            />
                                        </div>
                                    </Col>


                                    <Col md={6}>
                                        <div className='confirm-address-block mb-4' >
                                            <input type='checkbox' className='custom-checkbox' id='confirm-add' checked={isPermanent} onChange={(e) => setIsPermanent(e.target.checked)}
                                            // disabled={isInactiveStatus}
                                            />
                                            <label htmlFor='confirm-add'>Mark as Permanently inactive</label>
                                        </div>
                                    </Col>
                                </Row>




                                <div className='form-group mb-4'>
                                    <label>Reason</label>
                                    <Select
                                        name="aria-live-color"
                                        options={reasonsOption}
                                        placeholder="Select a reason"
                                        className="react_selectbox"
                                        isSearchable={false}
                                        styles={customStyles}
                                        value={inactiveReason}
                                        onChange={setInactiveReason}
                                    // isDisabled={isInactiveStatus}
                                    />
                                </div>

                                <div className='forom-group mb-4'>
                                    <label>Tell why you need to unlist this company</label>
                                    <textarea
                                        className="form-control textareabox mt-2"
                                        rows={4}
                                        placeholder="Add your message here"
                                        value={inactiveNotes}
                                        onChange={(e) => setInactiveNotes(e.target.value)}
                                    // disabled={isInactiveStatus}
                                    // style={isInactiveStatus ? { color: "#999" } : {}}
                                    />
                                </div>

                            </div>
                        )}

                    </div>


                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={compnayStatusClose}>
                        Cancel
                    </Button>
                    <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={() => {
                        handleStatusUpdate()
                        compnayStatusClose()
                    }} >
                        Confirm and  Change
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Remove Company  */}
            <Modal show={compnayremoShow} onHide={compnayRemoveClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >
                    <Link href='#' className='d-flex align-items-center gap-2' style={{ textDecoration: 'none', color: '#463527', fontWeight: '500' }}
                        onClick={() => {
                            compnayRemoveClose();
                            cmppremodShow();
                        }} >
                        <Image src='./images/icons/back.svg' width={10} height={10} className='img-fluid' alt='back' /> Back
                    </Link>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={compnayRemoveClose} />
                </Modal.Header>
                <Modal.Body className='pt-0'>
                    <h2 className='page-title'>Remove this  listing?</h2>
                    <p style={{ color: '#73615F' }}>The room will permanently be removed from the listing</p>


                    <div className='inactive-box remove-company-box company-status-box'>
                        <div className='form-group mb-4'>
                            <label>Reason</label>
                            <Select
                                name="aria-live-color"
                                options={reasonsOption}
                                placeholder="Select a reason"
                                className="react_selectbox"
                                isSearchable={false}
                                styles={customStyles}
                            />
                        </div>

                        <div className='forom-group mb-4'>
                            <label>Tell why you need to unlist this company</label>
                            <textarea
                                className="form-control textareabox mt-2"
                                rows={4}
                                placeholder="Add your message here"
                            />
                        </div>

                    </div>


                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={compnayStatusClose}>
                        Cancel
                    </Button>
                    <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={compnayStatusClose}>
                        Yes, Remove
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}