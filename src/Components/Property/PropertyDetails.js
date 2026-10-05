"use client"
import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button, Table, Thead, Modal, Tabs, Tab, Badge, Form } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus, components } from 'react-select';
import Bookingrestriction from "./Bookingrestriction";
import Editspacerules from "./Editspacerules";
import DatePicker from "react-datepicker";
import { useParams, useSearchParams } from "next/navigation";
import { BookingRestrictionListAPI, DeletePhotoAPI, DeletePropertyAssignAPI, PropertyAssignListApi, PropertyDetailApi, PropertyPhotosListAPI, PropertyRoomListAPI, SetCoverPhotoAPI, UploadPropertyPhotosAPI, UserListAPI, PropertyRoomsByIdAPI } from "@/services/provider";
import ProtectedRoute from "../ProtectedRoute";
import { Tab2 } from "./Tabs/Tab2";
import EditPropertyDetails from "./EditPropertyDetails";
import { Tab4 } from "./Tabs/Tab4";
import { Tab6 } from "./Tabs/Tab6";
import Step6 from "./Step6";
import { ToastContainer } from "react-toastify";
import { PropertyStatusModal } from "./PropertyStatusModal";
import { RemovePropertyModal } from "./RemovePropertyModal";
import { alert_danger, alert_success, alert_info } from '@/utils/Alerts/TostifyAlerts';
import { useRouter } from 'next/navigation';
import { Toaster } from "react-hot-toast";
import { getItemLocalStorage } from "@/utils/browserStorage";
import { checkPermission } from "@/utils/helper";





const convertToTimestamp = (timeString) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    let hour = parseInt(hours);
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;

    const date = new Date();
    date.setHours(hour, parseInt(minutes), 0, 0);
    return date;
};

export default function PropertyDetails() {
    // const param = useParams();
    // const id = param.id;

    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionProperty = checkPermission(permissionArray, "property");
    const permissionPhotos = checkPermission(permissionArray, "property_photo")
    const permissionPropertyAssign = checkPermission(permissionArray, "property_assignment");
    const permissionCompany = checkPermission(permissionArray, "company");
    const permissionRoom = checkPermission(permissionArray, "room");
    const permissionRoomPhoto = checkPermission(permissionArray, "room_photo");
    const permissionBookingRest = checkPermission(permissionArray, "booking_restriction");
    //restriction for booking
    const canListBookingRest = permissionBookingRest === true || permissionBookingRest?.can_list;
    //property permission
    const canAddProperty = permissionProperty === true || permissionProperty?.can_add;
    const canListProperty = permissionProperty === true || permissionProperty?.can_list;
    const canRetrieveProperty = permissionProperty === true || permissionProperty?.can_retrieve;
    const canUpdateProperty = permissionProperty === true || permissionProperty?.can_update;
    const canDeleteProperty = permissionProperty === true || permissionProperty?.can_delete;
    //property photos permission
    const canAddPhoto = permissionPhotos === true || permissionPhotos?.can_add;
    const canListPhoto = permissionPhotos === true || permissionPhotos?.can_list;
    const canRetrievePhoto = permissionPhotos === true || permissionPhotos?.can_retrieve;
    const canUpdatePhoto = permissionPhotos === true || permissionPhotos?.can_update;
    const canDeletePhoto = permissionPhotos === true || permissionPhotos?.can_delete;
    //can property assign
    const canListAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_list;
    const canAddAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_add;
    const canRetrieveAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_retrieve;
    const canUpdateAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_update;
    const canDeleteAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_delete;
    //can permision company details
    const canRetrieveCompany = permissionCompany === true || permissionCompany?.can_retrieve;
    //can permission room
    const canAddRoom = permissionRoom === true || permissionRoom?.can_add;
    const canListRoom = permissionRoom === true || permissionRoom?.can_list;
    const canRetrieveRoom = permissionRoom === true || permissionRoom?.can_retrieve;
    const canUpdateRoom = permissionRoom === true || permissionRoom?.can_update;
    const canDeleteRoom = permissionRoom === true || permissionRoom?.can_delete;
    //can permission on room photos
    //property photos permission
    const canAddRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_add;
    const canListRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_list;
    const canRetrieveRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_retrieve;
    const canUpdateRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_update;
    const canDeleteRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_delete;

    const [id, setId] = useState(null);

    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    useEffect(() => {
        if (uid) {
            setId(uid);
        }
    }, [uid]);
    const router = useRouter();
    const [inactiveFrom, setInactiveFrom] = useState(null);
    const [inactiveTo, setInactiveTo] = useState(null);
    const [reasonInactive, setReasonInactive] = useState({ Permanently: false, reason: '', text: '' })
    const [show, compsetShow] = useState(false);
    const [compnayShow, compstatussetShow] = useState(false);
    const [propertyDetail, setPropertyDetail] = useState({});
    const [userList, setUserList] = useState({ properyManager: [], propertyCaretacer: [], bookingManager: [] });
    const [propertyPhotos, setPropertyPhotos] = useState({ photos: [], amenitiesPhotos: [] })
    const [isEditManage, setIsEditManage] = useState(false);
    const [isEditSpaceRuleManage, setIsEditSpaceRule] = useState(false);
    const [roomsData, setRoomsData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchMgr, setSearchMgr] = useState('');
    const [searchCaretacker, setSearchCaretacker] = useState('');

    const roles = [
        `Caretaker Housekeeper,Caretaker Chef`,
        "CasaMelhor Property Manager",
        "CasaMelhor Booking Manager"
    ];


    // const searchParams = useSearchParams();

    const tab = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState("photos");

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);


    const [formData, setFormData] = useState({
        propertyName: "",
        propertyAddress: "",
        streetNumber: '',
        flatNo: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        addressHelp: '',
        operationsManagerName: '',
        operationsManagerEmail: '',
        operationsManagerPhone: '',
        operationsManagerAlternatePhone: '',
        person_image: null,
        lat: null,
        lng: null,
        guestCapacity: 0,
        brDescription: '',
        amenities: [],
        standoutAmenities: [],
        gst_number: '',
        pan_number: '',
        checkin_time: '',
        checkout_time: ''
    })
    const [file, setFile] = useState(null);
    const [propertyAssignList, setPropertyAssignList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [bookingRestrictionList, setBookingRestriction] = useState([]);

    const [petsAllowed, setPetsAllowed] = useState(false);
    const [smokingAllowed, setSmokingAllowed] = useState(false);
    const [photographyAllowed, setPhotographyAllowed] = useState(false);

    const cmppremodClose = () => compsetShow(false);
    const cmppremodShow = () => compsetShow(true);

    const compnayStatusClose = () => compstatussetShow(false);
    const compnayStatusShow = () => compstatussetShow(true);

    // Drag & drop
    const handleDrop1 = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const newPhotos = droppedFiles
            .slice(0, MAX_PHOTOS - photos.length)
            .map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));

        // const updatedPhotos = [...photos, ...newPhotos];
        // setPhotos(updatedPhotos);
        const updatedPhotos = [...step3Data?.propertyPhotos, ...newPhotos]

        // Update form data
        setPropertyPhotos(prev => ({
            ...prev,
            photos: [...prev?.photos, ...newPhotos]
        }));

    };

    const handleDragOver1 = (e) => e.preventDefault();

    // Remove single file
    const removeFile1 = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // 


    // Drag & drop
    const handleDrop2 = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const newPhotos = droppedFiles
            .slice(0, MAX_PHOTOS - amenitiesFiles.length)
            .map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));

        // const updatedPhotos = [...photos, ...newPhotos];
        // setPhotos(updatedPhotos);
        // const updatedPhotos = [...step3Data?.amenitiesPhotos, ...newPhotos]

        // Update form data
        setPropertyPhotos(prev => ({
            ...prev,
            amenitiesPhotos: [...prev?.amenitiesPhotos, ...newPhotos]
        }));

    };

    const handleDragOver2 = (e) => e.preventDefault();

    // Remove single file
    const removeFile2 = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };
    // 

    const [changepicsModal1, changepisetShow1] = useState(false);
    const [changepicsModal2, changepisetShow2] = useState(false);

    // const changepicClose1 = () => changepisetShow1(false);
    const changepicModal1 = () => changepisetShow1(true);

    // const changepicClose2 = () => changepisetShow2(false);
    const changepicModal2 = () => changepisetShow2(true);

    const changepicClose2 = () => {
        clearAmenitiesPhotos();
        changepisetShow2(false);
    };

    const changepicClose1 = () => {
        clearAmenitiesPhotos();
        changepisetShow1(false);
    };

    const clearAmenitiesPhotos = () => {
        setPropertyPhotos((prev) => ({
            ...prev,
            amenitiesPhotos: [],
            photos: []
        }));
    };


    // 
    // 

    const [photos, setPhotos] = useState([]);
    const [coverPhoto, setCoverPhoto] = useState({})
    const [coverIndex, setCoverIndex] = useState(null);
    const [amenitiesFiles, setAmenitiesFiles] = useState([]);

    const MAX_PHOTOS = 5;

    const handleFileChange1 = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Only allow max 5
        const newPhotos = selectedFiles
            .slice(0, MAX_PHOTOS - photos.length)
            .map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));

        // Update form data
        setPropertyPhotos(prev => ({
            ...prev,
            photos: [...prev?.photos, ...newPhotos]
        }));
    };

    const handleFileChange2 = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Only allow max 5
        const newPhotos = selectedFiles
            .slice(0, MAX_PHOTOS - amenitiesFiles.length)
            .map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));

        // const updatedPhotos = [...photos, ...newPhotos];
        // setPhotos(updatedPhotos);
        // const updatedPhotos = [...step3Data?.amenitiesPhotos, ...newPhotos]

        // Update form data
        setPropertyPhotos(prev => ({
            ...prev,
            amenitiesPhotos: [...prev?.amenitiesPhotos, ...newPhotos]
        }));

        // // If no cover set, pick first
        // if (coverIndex === null && updatedPhotos.length > 0) {
        //     setCoverIndex(0);
        // }
    };

    // State to track manage mode
    const [isManagePhotos, setIsManagePhotos] = useState(false);
    const [isManageAmenitiesPhotos, setIsManageAmenitiesPhotos] = useState(false);

    // Add/remove class on body when manage mode changes
    useEffect(() => {
        if (isManagePhotos) {
            document.body.classList.add('manage-photos-active');
        } else {
            document.body.classList.remove('manage-photos-active');
        }
        // Cleanup on unmount
        return () => document.body.classList.remove('manage-photos-active');
    }, [isManagePhotos]);



    useEffect(() => {
        if (isManageAmenitiesPhotos) {
            document.body.classList.add('manage-amenities-photos-active');
        } else {
            document.body.classList.remove('manage-amenities-photos-active');
        } // Cleanup on unmount 
        return () => document.body.classList.remove('manage-amenities-photos-active');
    }, [isManageAmenitiesPhotos]);

    // ...existing code...


    const [amenitySearch2, setAmenitySearch2] = useState('');
    const [showAmenitySearch2, setShowAmenitySearch2] = useState(false);



    const [selectedAmenities2, setSelectedAmenities2] = useState([]);

    const handleAmenitySelect2 = (label) => {
        setSelectedAmenities2((prev) =>
            prev.includes(label)
                ? prev.filter((l) => l !== label)
                : [...prev, label]
        );
    };

    const [amenitySearch, setAmenitySearch] = useState("");
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const amenities = [

        { icon: "/images/icons/fitness_center.svg", label: "Exercise equipment" },
        { icon: "/images/icons/pool.svg", label: "Pool" },
        { icon: "/images/icons/beach.svg", label: "Beach access" },

    ];

    const filteredAmenities = amenities.filter((a) =>
        a.label.toLowerCase().includes(amenitySearch.toLowerCase())
    );

    // const toggleAmenity = (label) => {
    //     setSelectedAmenities((prev) =>
    //         prev.includes(label)
    //             ? prev.filter((item) => item !== label)
    //             : [...prev, label]
    //     );
    // };


    // const [openPicIndex, setOpenPicIndex] = useState(null);

    // const togglePicOption1 = (e, idx) => {
    //     e.preventDefault();
    //     setOpenPicIndex(openPicIndex === idx ? null : idx);
    //     if (typeof toggleoptio1 === 'function') {
    //         toggleoptio1();
    //     }
    // }

    const assignments = [
        {
            name: 'Schlumberger',
            dates: 'From Sun, 3 Aug 2025 to Thu, 7 Aug, 2025',
            admin: 'Casa Melhor Admin',
            email: 'casamelhoradmin@casamelhor.in'
        },
        {
            name: 'CasaMelhor Palm',
            dates: 'From Mon, 10 Aug 2025 to Fri, 14 Aug, 2025',
            admin: 'Casa Melhor Admin',
            email: 'admin@casamelhor.in'
        },
        // Add more objects as needed
    ];


    const [assignmentremoShow, assignmentremovesetShow] = useState(false);
    const [assignmentUid, setAssignmentUid] = useState(null);
    const assignmentRemoveClose = () => assignmentremovesetShow(false);
    const assignmentRemoveShow = () => {
        assignmentremovesetShow(true);
        // setAssignmentUid(ids)
    }


    // 


    const [compnayremoShow, compremovesetShow] = useState(false);

    const compnayRemoveClose = () => compremovesetShow(false);
    const compnayRemoveShow = () => compremovesetShow(true);

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

    const statusOption = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },

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

    // const getUserList = async () => {
    //     try {
    //         const response = await UserListAPI("Company-Employee");
    //         if (response?.data?.success) {
    //             const caretakerList = response?.data?.response?.filter(item => item?.user_role?.role_name?.toLowerCase().includes("caretaker"));
    //             const propertyManagerList = response?.data?.response?.filter(item => item?.user_role?.role_name?.toLowerCase().includes("property manager"));
    //             const bookingManagerList = response?.data?.response?.filter(item => item?.user_role?.role_name?.toLowerCase().includes("booking manager"));
    //             setUserList({
    //                 propertyCaretacer: caretakerList,
    //                 properyManager: propertyManagerList,
    //                 bookingManager: bookingManagerList
    //             })
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // const getUserList = async (roleName) => {
    //     try {
    //         const response = await UserListAPI("Company-Employee", roleName);

    //         if (response?.data?.success) {
    //             const users = response?.data?.response || [];

    //             setUserList((prev) => ({
    //                 ...prev,
    //                 [roleName === `Caretaker Housekeeper,Caretaker Chef` ? 'propertyCaretacer' : roleName === "CasaMelhor Property Manager" ? 'properyManager' : 'bookingManager']: users
    //             }));
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const getUserList = async (roleName, search) => {
        try {
            const response = await UserListAPI("Company-Employee", roleName, search);

            if (response?.data?.success) {
                // const users = response?.data?.response || [];
                const users = (response?.data?.response || [])
                    ?.filter(user => user?.is_active !== false);

                setUserList((prev) => ({
                    ...prev,
                    [roleName === `Caretaker Housekeeper,Caretaker Chef` ? 'propertyCaretacer' : roleName === "CasaMelhor Property Manager" ? 'properyManager' : 'bookingManager']: users
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getPropertyDetail = async () => {
        try {
            const response = await PropertyDetailApi(id);
            if (response?.data?.success) {
                setPropertyDetail(response?.data?.response)
                setSelectedStatus(response?.data?.response?.property_status)
                setFormData({
                    propertyName: response?.data?.response?.property_name,
                    propertyAddress: response?.data?.response?.address_search_text,
                    streetNumber: response?.data?.response?.street_number,
                    flatNo: response?.data?.response?.flat_house_no,
                    city: response?.data?.response?.city,
                    state: response?.data?.response?.state,
                    country: response?.data?.response?.country,
                    pinCode: response?.data?.response?.pin_code,
                    addressHelp: response?.data?.response?.nearest_airport,
                    operationsManagerName: response?.data?.response?.ops_manager_name,
                    operationsManagerEmail: response?.data?.response?.ops_manager_email,
                    operationsManagerPhone: response?.data?.response?.ops_manager_phone,
                    operationsManagerAlternatePhone: response?.data?.response?.ops_manager_phone_alt,
                    // operationManagerPhoto:response?.data?.response?.ops_manager_photo_url,
                    guestCapacity: response?.data?.response?.max_capacity ? response?.data?.response?.max_capacity : 1,
                    brDescription: response?.data?.response?.property_description,
                    amenities: response?.data?.response?.property_amenities,
                    standoutAmenities: response?.data?.response?.key_features,
                    lat: response?.data?.response?.latitude,
                    lng: response?.data?.response?.longitude,
                    gst_number: response?.data?.response?.gst_number,
                    pan_number: response?.data?.response?.pan_number,
                    property_caretakers: response?.data?.response?.staff_assignments?.property_caretakers,
                    property_managers: response?.data?.response?.staff_assignments?.property_managers,
                    checkin_time: convertToTimestamp(response?.data?.response?.checkin_time),
                    checkout_time: convertToTimestamp(response?.data?.response?.checkout_time)
                })
                setSelectedAmenities(response?.data?.response?.property_amenities)
                setSelectedAmenities2(response?.data?.response?.key_features)
                setFile(response?.data?.response?.ops_manager_photo_url);
                setPetsAllowed(response?.data?.response?.pets_allowed);
                setSmokingAllowed(response?.data?.response?.smoking_allowed);
                setPhotographyAllowed(response?.data?.response?.commercial_photography_allowed);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getPropertyPhotosList = async () => {
        try {
            const response = await PropertyPhotosListAPI(id);
            if (response?.data?.success) {
                setPhotos(response?.data?.response?.property_photos?.filter((Val) => Val?.photo_type == "Property"));
                setAmenitiesFiles(response?.data?.response?.property_photos?.filter((Val) => Val?.photo_type == "Amenities"));
                setCoverPhoto(response?.data?.response?.property_photos?.find((val) => val?.is_property_cover_photo))
                // debugger
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getPropertyAssignList = async () => {
        try {
            const response = await PropertyAssignListApi(id);
            if (response?.data?.success) {
                setPropertyAssignList(response?.data?.response)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getRoomList = async () => {
        try {
            const response = await PropertyRoomListAPI(id);
            if (response?.data?.success) {
                setRoomList(response?.data?.response)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getBookingRestrictionList = async () => {
        try {
            const response = await BookingRestrictionListAPI(id);
            if (response?.data?.success) {
                setBookingRestriction(response?.data?.response)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const [selectedAssignmentUid, setSelectedAssignmentUid] = useState(null);


    // const removePropertyAssign = async () => {
    //     try {
    //         const response = await DeletePropertyAssignAPI(id);
    //         if (response?.data?.success) {
    //             getPropertyAssignList();
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const removePropertyAssign = async () => {
        try {
            if (!selectedAssignmentUid) return;

            const response = await DeletePropertyAssignAPI(selectedAssignmentUid);
            if (response?.data?.success) {
                alert_success("Changed data successfully");
                setTimeout(() => {
                    router.push(`/propertyDetails?uid=${propertyUid}`);
                }, 2000);
                getPropertyAssignList();
                assignmentRemoveClose();
            } else {
                alert_info(
                    response?.data?.message || "Failed to remove assignment"
                );
            }
        } catch (error) {
            alert_danger(
                error?.response?.data?.message ||
                error?.message ||
                "Server error"
            );
        }
    };


    // const makeCoverPhoto = async (index, id) => {
    //     setCoverIndex(index);
    //     try {
    //         const response = await SetCoverPhotoAPI(id);
    //         if (response?.data?.success) {
    //             getPropertyPhotosList();
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const makeCoverPhoto = async (photoId, photoType) => {
        try {
            const response = await SetCoverPhotoAPI(photoId);

            if (response?.data?.success) {

                if (photoType === "Property") {
                    setPhotos(prev =>
                        prev.map(photo => ({
                            ...photo,
                            is_property_cover_photo: photo.uid === photoId
                        }))
                    );
                }

                if (photoType === "Amenities") {
                    setAmenitiesFiles(prev =>
                        prev.map(photo => ({
                            ...photo,
                            is_property_cover_photo: photo.uid === photoId
                        }))
                    );
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removePhoto = async (index, id) => {
        try {
            const response = await DeletePhotoAPI(id)
            if (response?.data?.success) {
                // alert_success(response.data.response.message)
                getPropertyPhotosList();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const removePhotoModal = (index) => {
        // Update form data
        const updateState = propertyPhotos?.photos?.filter((_, i) => i !== index)
        setPropertyPhotos(prev => ({
            ...prev,
            photos: updateState
        }));
    }

    const removeAmenitisPhotoModal = (index) => {
        const updatedAmenities = propertyPhotos?.amenitiesPhotos?.filter(
            (_, i) => i !== index
        );

        setPropertyPhotos(prev => ({
            ...prev,
            amenitiesPhotos: updatedAmenities
        }));
    };



    useEffect(() => {
        getPropertyDetail();
        getPropertyPhotosList();
        // getUserList();
        roles.forEach((role) => {
            getUserList(role, '');
        });
        getPropertyAssignList();
        getRoomList();
        getBookingRestrictionList()
        const saved = localStorage.getItem("roomIdForUrl");
        if (saved) {
            localStorage.removeItem("roomIdForUrl")
            localStorage.removeItem("propertyUid")
        }
    }, [id])
    useEffect(() => {
        getUserList("CasaMelhor Property Manager", searchMgr)
    }, [searchMgr])
    useEffect(() => {
        getUserList("Caretaker Housekeeper,Caretaker Chef", searchCaretacker)
    }, [searchCaretacker])
    const handleUpload = async (e) => {
        e.preventDefault();

        const fieldData = new FormData();
        fieldData.append("property", id)
        if (propertyPhotos.photos?.length) {
            propertyPhotos.photos?.forEach((img, index) => {
                fieldData.append(`property_photo_url[${index}]`, img.file)
            })
            fieldData.append("photo_type", "Property")
        }
        if (propertyPhotos?.amenitiesPhotos?.length) {
            propertyPhotos?.amenitiesPhotos?.forEach((img, index) => {
                fieldData.append(`property_photo_url[${index}]`, img.file)
            })
            fieldData.append("photo_type", "Amenities")
        }

        const response = await UploadPropertyPhotosAPI(fieldData)
        if (response?.data?.success) {
            // alert_success("Photo uploaded successfully!")
            setPropertyPhotos({
                photos: [],
                amenitiesPhotos: []
            })
            changepicClose1();
            changepicClose2();
            getPropertyPhotosList();
        }

    };

    useEffect(() => {

        const getRoomsDataByPropertyId = async () => {

            try {

                const response = await PropertyRoomsByIdAPI(id);

                if (response?.data?.success) {

                    setRoomsData(response?.data?.response)

                    // debugger

                }

            } catch (error) {

                console.log(error)

            }

        }

        if (!!id) {

            getRoomsDataByPropertyId()

        }

    }, [id])

    console.log(propertyDetail)


    const filteredRooms = roomsData.filter((item) =>
        item?.room_name
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
    );
    const setPropertyStatus = () => {
        if (propertyDetail?.is_permanently_inactive) {
            return propertyDetail?.property_status
        } else if (propertyDetail?.is_scheduled_inactive) {
            return "Inactive"
        } else {
            return "Active"
        }
    }


    return (
        <ProtectedRoute>
            <ToastContainer />
            <Toaster position="top-right" />
            <Header />
            <div className='page-body  pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <Link href="/PropertyListing?tab=assigned" className='back-page'>
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={12} className='mt-4 mb-4' >
                            <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
                                <div className="d-flex align-items-center gap-2">
                                    <h2 className='page-title'>{propertyDetail?.property_name}, {propertyDetail?.city} </h2>
                                    <span className="badge-active" > {propertyDetail?.is_permanently_inactive ? "Inactive" : "Active"} </span >
                                </div>

                                <div className='d-flex align-items-center gap-3'>
                                    {/* <Link href="#" className='btn-company-edit btn-light-transparent btn-white-transparent '> Bookings <Image src="/images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='booking' /> </Link>
                                    <Link href="#" className='btn-company-delete btn-light-transparent btn-white-transparent'> Calendar <Image src="/images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='calendor' /></Link> */}


                                    <Link href='javascriptvoid:(0)' onClick={cmppremodShow} className='btn-company-delete btn-light-transparent'>  <Image src="/images/icons/settings.svg" className='img-fluid' width={25} height={25} alt='setting' />  Settings </Link>


                                </div>
                            </div>
                        </Col>



                        <Col md={12} >
                            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}
                                defaultActiveKey="photos"
                                id="uncontrolled-tab-example"
                                className="mb-5 mt-3 compnay-detail-tabs property-details-tabs"
                            >
                                {canListPhoto && (
                                    <Tab eventKey="photos" title="Photos">
                                        <h2 className='page-title mb-4'>Photo tour</h2>
                                        <p>Manage photos and add details. Guests will only see your tour if every room has a photo.</p>

                                        <div className="property-relative">
                                            <div className="property-added-photos border-bottom-custom pb-3 mt-3 d-flex align-items-center justify-content-between " style={{ borderColor: '#463527' }} >
                                                <p className="subheadine-2 mb-0" >Property Photos </p>

                                                {canUpdatePhoto && (
                                                    <div className="manage-photo-btn d-flex align-items-center gap-3">
                                                        {isManagePhotos ? (
                                                            <>
                                                                <Button variant="" className='btn-company-delete rounded-0 btn-light-transparent' style={{ padding: '18px 20px' }} onClick={() => setIsManagePhotos((prev) => !prev)} >   Done </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button variant="" className='btn-company-delete rounded-0 btn-light-transparent' style={{ padding: '18px 20px' }} onClick={() => setIsManagePhotos((prev) => !prev)} >   Manage Photos </Button>
                                                                <Button variant="" className='btn-company-delete rounded-0 btn-light-transparent' style={{ padding: '18px 20px' }} onClick={changepicModal1}>   <Image src='/images/icons/Plus.svg' className="img-fluid" alt="plus" width={20} height={20} /> </Button>
                                                            </>
                                                        )
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid upload-photo grid-cols-5 mt-4 gap-4">
                                                {photos.map((photo, index) => (
                                                    <div className="relative group" key={photo.uid}>
                                                        {photo?.is_property_cover_photo && (
                                                            <span className="absolute top-4 left-3  text-white text-xs px-2 py-1  cover-photo">
                                                                Cover photo
                                                            </span>
                                                        )}
                                                        <Image
                                                            src={`${photo.property_photo_url}`}
                                                            alt="proprty"
                                                            width={300}
                                                            height={200}
                                                            className="object-cover w-full"
                                                        />

                                                        {/* Dots or Delete */}
                                                        {isManagePhotos ? (
                                                            <button
                                                                className="more-action absolute top-2 right-2   btn-sm"
                                                                onClick={() => removePhoto(index, photo?.uid)} // Uncomment and implement if using dynamic photos
                                                            >
                                                                <Image
                                                                    src="/images/icons/delete.svg"
                                                                    className="img-fluid"
                                                                    alt="delete 3"
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                            </button>
                                                        ) : (

                                                            <>

                                                                {/* Options */}
                                                                <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                                    {canUpdatePhoto && (
                                                                        <li>
                                                                            <button
                                                                                // onClick={() => makeCoverPhoto(index, photo?.uid)}
                                                                                onClick={() => makeCoverPhoto(photo?.uid, "Property")}
                                                                                className="block text-sm w-full text-left"
                                                                            >
                                                                                Make cover photo
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                    {canDeletePhoto && (
                                                                        <li>
                                                                            <button
                                                                                onClick={() => removePhoto(index, photo?.uid)}
                                                                                className="block text-sm w-full text-left"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                </ul>


                                                                <div className="more-action absolute top-2 right-2">
                                                                    <Image
                                                                        src="/images/icons/more-dots-3.svg"
                                                                        className="img-fluid"
                                                                        alt="dot 3"
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>


                                        <hr style={{ margin: '20px 0' }}></hr>



                                        {/* <div className="property-added-photos border-bottom-custom pb-3 mt-3 d-flex align-items-center justify-content-between " style={{ borderColor: '#463527' }} >
                                        <p className="subheadine-2 mb-0" >Property Amenities Photos</p>

                                        <div className="manage-photo-btn d-flex align-items-center gap-3">
                                            <Button variant="" className='btn-company-delete rounded-0 btn-light-transparent' style={{ padding: '18px 20px' }} >   Manage Photos </Button>

                                            <Button variant="" className='btn-company-delete rounded-0 btn-light-transparent' style={{ padding: '18px 20px' }} onClick={changepicModal2} >   <Image src='/images/icons/Plus.svg' className="img-fluid" alt="plus" width={20} height={20} /> </Button>

                                        </div>
                                    </div> */}

                                        <div className="amenities-relative">

                                            <div className="property-added-photos border-bottom-custom pb-3 mt-3 d-flex align-items-center justify-content-between"
                                                style={{ borderColor: '#463527' }}>

                                                <p className="subheadine-2 mb-0">Property Amenities Photos</p>
                                                {canUpdatePhoto && (
                                                    <div className="manage-photo-btn d-flex align-items-center gap-3">
                                                        {isManageAmenitiesPhotos ? (
                                                            <Button
                                                                variant=""
                                                                className="btn-company-delete rounded-0 btn-light-transparent"
                                                                style={{ padding: '18px 20px' }}
                                                                onClick={() => setIsManageAmenitiesPhotos(false)}
                                                            >
                                                                Done
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    variant=""
                                                                    className="btn-company-delete rounded-0 btn-light-transparent"
                                                                    style={{ padding: '18px 20px' }}
                                                                    onClick={() => setIsManageAmenitiesPhotos(true)}
                                                                >
                                                                    Manage Photos
                                                                </Button>

                                                                <Button
                                                                    variant=""
                                                                    className="btn-company-delete rounded-0 btn-light-transparent"
                                                                    style={{ padding: '18px 20px' }}
                                                                    onClick={changepicModal2}
                                                                >
                                                                    <Image
                                                                        src="/images/icons/Plus.svg"
                                                                        className="img-fluid"
                                                                        alt="plus"
                                                                        width={20}
                                                                        height={20}
                                                                    />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>



                                            <div className="grid upload-photo grid-cols-5 mt-4 gap-4">

                                                {amenitiesFiles.map((photo, index) => (
                                                    <div className="relative group" key={index}>

                                                        {photo?.is_property_cover_photo && (
                                                            <span className="absolute top-4 left-3  text-white text-xs px-2 py-1  cover-photo">
                                                                Cover photo
                                                            </span>
                                                        )}
                                                        <Image
                                                            src={`${photo.property_photo_url}`}
                                                            alt="proprty"
                                                            width={300}
                                                            height={200}
                                                            className="object-cover w-full"
                                                        />

                                                        {/* Options */}
                                                        {canDeletePhoto && (
                                                            <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                                <li>
                                                                    <button
                                                                        onClick={() => removePhoto(index, photo?.uid)}
                                                                        className="block text-sm w-full text-left"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        )}

                                                        {/* Dots */}
                                                        {/* <div className="more-action absolute top-2 right-2">
                                                    <Image
                                                        src="/images/icons/more-dots-3.svg"
                                                        className="img-fluid"
                                                        alt="dot 3"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div> */}

                                                        {isManageAmenitiesPhotos ? (
                                                            <button className="more-action absolute top-2 right-2 btn-sm">
                                                                <Image src="/images/icons/delete.svg" width={20} height={20} />
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden group-hover:block">
                                                                    {canUpdatePhoto && (
                                                                        <li>
                                                                            <button
                                                                                // onClick={() => makeCoverPhoto(index, photo?.uid)} 
                                                                                onClick={() => makeCoverPhoto(photo?.uid, "Amenities")}
                                                                                className="block text-sm w-full text-left">
                                                                                Make cover photo
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                    {canDeletePhoto && (
                                                                        <li>
                                                                            <button onClick={() => removePhoto(index, photo?.uid)} className="block text-sm w-full text-left">
                                                                                Delete
                                                                            </button>
                                                                        </li>
                                                                    )}
                                                                </ul>

                                                                <div className="more-action absolute top-2 right-2">
                                                                    <Image src="/images/icons/more-dots-3.svg" width={20} height={20} />
                                                                </div>
                                                            </>
                                                        )}


                                                    </div>
                                                ))}



                                                {/* Show Add Photo only if < 5 */}

                                            </div>
                                        </div>
                                        {/* <div className="grid upload-photo grid-cols-5 mt-4 gap-4">

                                        {amenitiesFiles.map((photo, index) => (
                                            <div className="relative group" key={index}>
                                                <Image
                                                    src={`${photo.property_photo_url}`}
                                                    alt="proprty"
                                                    width={300}
                                                    height={200}
                                                    className="object-cover w-full"
                                                />

                                              
                                                <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                    <li>
                                                        <button
                                                            onClick={() => removePhoto(index, photo?.uid)}
                                                            className="block text-sm w-full text-left"
                                                        >
                                                            Delete
                                                        </button>
                                                    </li>
                                                </ul>

                                       
                                                <div className="more-action absolute top-2 right-2">
                                                    <Image
                                                        src="/images/icons/more-dots-3.svg"
                                                        className="img-fluid"
                                                        alt="dot 3"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>

                                            </div>
                                        ))}



                              

                                    </div> */}

                                    </Tab>
                                )}

                                <Tab eventKey="space" title="Space">
                                    {isEditManage ? (
                                        <EditPropertyDetails setIsEditManage={setIsEditManage}
                                            formData={formData} setFormData={setFormData} file={file} setFile={setFile}
                                            selectedAmenities={selectedAmenities} setSelectedAmenities={setSelectedAmenities}
                                            selectedAmenities2={selectedAmenities2} setSelectedAmenities2={setSelectedAmenities2}
                                            propertyRole={userList} getPropertyDetail={getPropertyDetail} setSearchMgr={setSearchMgr} setSearchCaretacker={setSearchCaretacker}
                                        />
                                    ) : (<Tab2 propertyDetail={propertyDetail} setIsEditManage={setIsEditManage} canUpdateProperty={canUpdateProperty} />)}

                                </Tab>

                                <Tab eventKey="rooms" title="Rooms" >
                                    <Row>
                                        <Col md={12}>
                                            <div className='general-info d-flex justify-content-between align-items-center'>
                                                <h2 className='page-title'> Bedroom Setup ({filteredRooms.length})</h2>

                                                {canAddRoom && <Link href={`/AddRoomSetup?uid=${uid}`} className='btn-company-add ' >  <span style={{ fontSize: '24px' }}> + </span>  &nbsp;Add Bedroom</Link>}

                                            </div>
                                        </Col>

                                        <Col md={12}>
                                            {canListRoom && (
                                                <div className='search-box mt-4 mb-4'>
                                                    {/* <input type='text' placeholder='Search ' className='form-control' /> */}
                                                    <input
                                                        type="text"
                                                        placeholder="Search room name"
                                                        className="form-control"
                                                        value={searchText}
                                                        onChange={(e) => setSearchText(e.target.value)}
                                                    />
                                                    <button className='btn btn-search'>
                                                        <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                                                    </button>
                                                </div>
                                            )}
                                        </Col>
                                        <Col md={12}>
                                            <Row >
                                                {canListRoom && filteredRooms.length > 0 && filteredRooms.map((item, index) => (

                                                    <Col key={index} md={6}>
                                                        <div className="room-details ">
                                                            <Link href={canRetrieveRoom ? `/Roomdetails/${item?.uid}` : ''} onClick={() => { localStorage.setItem("roomIdForUrl", id) }}>

                                                                <div className="room-imgs relative">
                                                                    <Image src={item.cover_photo_url ? item.cover_photo_url : '/images/icons/No-Image.svg'} className="img-fluid room-img" alt="room1" width={400} height={300} />

                                                                    <div className="btn-outline-light absolute bottom-3 left-3" style={{ border: '1px solid #fff', padding: '10px 20px', borderRadius: '30px' }}>
                                                                        <span className="text-warning">{item.room_status}</span>
                                                                    </div>

                                                                </div>



                                                                <p className=" fs-20 mt-3 mb-0" >{item.room_name}</p>
                                                                <ul className="property-amenties d-flex gap-2 ps-0">
                                                                    <li className="d-flex gap-2"><Image src="/images/icons/person.svg" className="img-fluid" width={16} height={16} alt="amen" /> {item.max_guests} &nbsp; |  </li>

                                                                    <li className="d-flex gap-2"><Image src="/images/icons/king_bed.svg" className="img-fluid" width={16} height={16} alt="amen" /> {item.total_beds} &nbsp; |  </li>

                                                                    <li className="d-flex gap-2"> {item?.room_size_sqft} sq ft </li>

                                                                </ul>
                                                            </Link>
                                                        </div>


                                                    </Col>

                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Tab>

                                <Tab eventKey="assignments" title="Assignments">
                                    {canListAssignProperty && (
                                        <Tab4 assignments={propertyAssignList} propertyDetail={propertyDetail} assignmentRemoveShow={assignmentRemoveShow} removePropertyAssign={removePropertyAssign} propertyId={id} setSelectedAssignmentUid={setSelectedAssignmentUid} />
                                    )}
                                </Tab>
                                {canListBookingRest && (
                                    <Tab eventKey="booking-restrictions" title="Booking Restrictions" >
                                        <Row>
                                            <Col md={12}>
                                                <div className='general-info d-flex justify-content-between align-items-center mb-4'>
                                                    <h2 className='page-title'> Booking restrictions to the BR</h2>

                                                </div>
                                            </Col>
                                            <Col md={12}>
                                                <Bookingrestriction propertyRole={userList} roomList={roomList} bookingRestrictionList={bookingRestrictionList} activeTab={activeTab} getBookingRestrictionList={getBookingRestrictionList} />
                                                {/* <Step6 roomList={roomList} /> */}
                                            </Col>
                                        </Row>
                                    </Tab>
                                )}
                                <Tab eventKey="space-rules" title="Space Rules">
                                    {isEditSpaceRuleManage ? (
                                        <Editspacerules setIsEditSpaceRule={setIsEditSpaceRule} formData={formData} setFormData={setFormData}
                                            petsAllowed={petsAllowed} setPetsAllowed={setPetsAllowed}
                                            smokingAllowed={smokingAllowed} setSmokingAllowed={setSmokingAllowed}
                                            photographyAllowed={photographyAllowed} setPhotographyAllowed={setPhotographyAllowed} getPropertyDetail={getPropertyDetail}
                                        />
                                    ) : (
                                        <Tab6 propertyDetail={propertyDetail} setIsEditSpaceRule={setIsEditSpaceRule} canUpdateProperty={canUpdateProperty} />
                                    )}
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal show={changepicsModal1} onHide={changepicClose1} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
                    <Modal.Title>
                        Upload photo
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose1} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <span>{propertyPhotos?.photos?.length} items selected</span>
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
                        {/* <span>{propertyPhotos?.length} items selected</span> */}
                        {propertyPhotos?.photos?.length === 0 ? (
                            <label
                                onDrop={handleDrop1}
                                onDragOver={handleDragOver1}
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
                                        src="/images/icons/photo-library.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                    />
                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Drag and drop
                                    </p>
                                    <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                    >
                                        or click here to choose files (max 5).
                                    </p>
                                </div>
                            </label>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    {propertyPhotos?.photos?.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                            <Image
                                                src={photo.preview || `${photo.property_photo_url}`}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={250}
                                                height={250}
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhotoModal(index)}
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
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={changepicClose1} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Cancel
                    </Button>
                    <Button variant=""
                        onClick={handleUpload}
                        className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={changepicsModal2} onHide={changepicClose2} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
                    <Modal.Title>
                        Upload photo
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose2} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <p className='border-bottom pb-4'>{propertyPhotos?.amenitiesPhotos?.length} items selected</p>

                    <div className="drap-drop-box-full">
                        {propertyPhotos?.amenitiesPhotos?.length === 0 ? (
                            <label
                                onDrop={handleDrop2}
                                onDragOver={handleDragOver2}
                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange2}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <Image
                                        src="/images/icons/photo-library.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                    />
                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Drag and drop
                                    </p>
                                    <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                    >
                                        or click here to choose files (max 5).
                                    </p>
                                </div>
                            </label>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {propertyPhotos?.amenitiesPhotos?.map((file, index) => (
                                    <div key={index} className="relative inline-block">
                                        <Image
                                            src={file.preview || `${file.property_photo_url}`}
                                            alt={`Uploaded preview ${index + 1}`}
                                            width={250}
                                            height={250}
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAmenitisPhotoModal(index)}
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
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={changepicClose2} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={handleUpload} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* remove assginemnt  */}

            {/* Remove Assignment */}


            <Modal show={assignmentremoShow} onHide={assignmentRemoveClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >

                    <Image src='/images/icons/close-circle.svg' className="ms-auto me-0" width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={compnayRemoveClose} />
                </Modal.Header>
                <Modal.Body className='pt-0' style={{ minHeight: '200px' }} >
                    <h2 className='page-title'>Remove this Assigment?</h2>
                    <p style={{ color: '#73615F' }}>The BR will permanently be unassigned to this company</p>




                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={assignmentRemoveClose}>
                        Cancel
                    </Button>
                    <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={removePropertyAssign}>
                        Yes, Remove
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
                            }} > {setPropertyStatus()} </span>
                        </div>
                        <Button variant="" disabled={canUpdateProperty ? false : true} onClick={() => {
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

                        <Button variant="" disabled={canDeleteProperty ? false : true} onClick={() => {
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


            {/* <Modal show={compnayShow} onHide={compnayStatusClose} className='custom-theme-modal status-height-70' animation={false} centered >
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
                                value={statusOption.find(cv=>cv.value==selectedStatus)}
                                onChange={(e)=>setSelectedStatus(e.value)}
                                styles={customStyles}
                            />
                        </div>
                        {selectedStatus === "Inactive" && (
                            <p style={{
                                color: '#73615F'
                            }}>The company will be unlisted until you change the status.</p>

                        )}


                        
                        {selectedStatus === "Inactive" && (
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
                                            />
                                        </div>
                                    </Col>


                                    <Col md={6}>
                                        <div className='confirm-address-block mb-4' >
                                            <input type='checkbox' id='confirm-add' onChange={(e)=>setReasonInactive({...reasonInactive,Permanently:e.target.checked})} className='custom-checkbox' />
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
                                        onChange={(e)=>setReasonInactive({...reasonInactive,reason:e.value})}
                                    />
                                </div>

                                <div className='forom-group mb-4'>
                                    <label>Tell why you need to unlist this company</label>
                                    <textarea
                                        className="form-control textareabox mt-2"
                                        rows={4}
                                        onChange={(e)=>setReasonInactive({...reasonInactive,text:e.target.value})}
                                        placeholder="Add your message here"
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
                    <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={compnayStatusClose}>
                        Confirm and  Change
                    </Button>
                </Modal.Footer>
            </Modal> */}
            <PropertyStatusModal compnayShow={compnayShow} compnayStatusClose={compnayStatusClose} settingData={propertyDetail} getPropertyDetail={getPropertyDetail} />

            {/* Remove Company  */}

            {/* <Modal show={compnayremoShow} onHide={compnayRemoveClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >
                    <Link href='#' className='d-flex align-items-center gap-2' style={{ textDecoration: 'none', color: '#463527', fontWeight: '500' }}
                        onClick={() => {
                            compnayRemoveClose();
                            cmppremodShow();
                        }} >
                        <Image src='/images/icons/back.svg' width={10} height={10} className='img-fluid' alt='back' /> Back
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

            </Modal> */}
            <RemovePropertyModal compnayremoShow={compnayremoShow} compnayRemoveClose={compnayRemoveClose} settingData={propertyDetail} />

        </ProtectedRoute>
    )
}