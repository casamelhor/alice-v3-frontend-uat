// // Sample data for assignments table
// "use client"
// import React from 'react'
// import { useEffect, useState } from "react";
// import Header from '../Header/Header'
// import { Row, Col, Container, Button, Tabs, Tab, Table, Modal } from 'react-bootstrap';
// import Link from 'next/link';
// import Image from 'next/image';
// import Select, { AriaOnFocus, components } from 'react-select';
// import DatePicker from "react-datepicker";
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import { companyDetailAPI, companyListAPI, CompanySettingDetailAPI, CompanyuserDetailAPI, CompanyuserListAPI, UserDetailAPI, UserRoleListAPI, DeptDesignationAPI, AssignPropertiesToCompanyAPI, PropertyStatusUpdateApi, RemovePropertyAssignmentApi, RemoveCompanyAPI } from '@/services/provider';
// import ProtectedRoute from '../ProtectedRoute';
// import EditCompany from './EditCompany';
// import { EditUserProfile } from '../commons/EditUserProfile';
// import { EmployeeDetailModel } from '../commons/EmployeeDetailModel';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import { getItemLocalStorage } from '@/utils/browserStorage';
// import { FilterUserAll } from '../commons/FilterUserAll';
// import { CompnayStatusModel } from './CompnayStatusModel';
// import { formatDaysDateMonthYear } from '@/utils/formatTime';
// import { alert_danger, alert_success, showError, showErrorMsg } from '@/utils/Alerts/TostifyAlerts';
// import toast, { Toaster } from 'react-hot-toast';
// import { RemoveCompanyModal } from './RemoveCompanyModal';
// import { checkPermission } from '@/utils/helper';

// export default function CompanyDetails() {

//     const BASE_IMAGE_URL = "https://alicedevapi.casamelhor.in";

//     // const param = useParams();
//     // // const id = param.id;
//     // const id = param?.id || param?.companyId;
//     // const [id, setId] = useState(null);
//     const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
//     const permissionCompany = checkPermission(permissionArray, "company");
//     const permissionBooking = checkPermission(permissionArray, "booking");
//     const permissionSetting = checkPermission(permissionArray, "company_settings");
//     const permissionUser = checkPermission(permissionArray, "user");
//     const permissionProperty = checkPermission(permissionArray, "property");
//     const permissionPropertyAssign = checkPermission(permissionArray, "property_assignment");

//     const canAdd = permissionCompany === true || permissionCompany?.can_add;
//     const canList = permissionCompany === true || permissionCompany?.can_list;
//     const canRetrieve = permissionCompany === true || permissionCompany?.can_retrieve;
//     const canUpdate = permissionCompany === true || permissionCompany?.can_update;
//     const canDelete = permissionCompany === true || permissionCompany?.can_delete;
//     //setting permission for retrieve
//     const canRetrieveSetting = permissionSetting === true || permissionSetting?.can_retrieve;
//     //permission for bookign lisr 
//     const canListBooking = permissionBooking === true || permissionBooking?.can_list;
//     //user permission
//     const canAddUser = permissionUser === true || permissionUser?.can_add;
//     const canListUser = permissionUser === true || permissionUser?.can_list;
//     const canRetrieveUser = permissionUser === true || permissionUser?.can_retrieve;
//     const canUpdateUser = permissionUser === true || permissionUser?.can_update;
//     const canDeleteUser = permissionUser === true || permissionUser?.can_delete;
//     //property permission
//     const canListProperty = permissionProperty === true || permissionProperty?.can_list;
//     const canRetrieveProperty = permissionProperty === true || permissionProperty?.can_retrieve;
//     const canUpdateProperty = permissionProperty === true || permissionProperty?.can_update;
//     const canDeleteProperty = permissionProperty === true || permissionProperty?.can_delete;
//     //can property assign
//     const canAddAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_add;
//     const canRetrieveAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_retrieve;
//     const canUpdateAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_update;
//     const canDeleteAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_delete;

//     const searchParams = useSearchParams();
//     const id = searchParams.get("uid");
//     const router = useRouter();
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"))
//     const [companyDetail, setCompanyDetails] = useState({})
//     const [userList, setUserList] = useState([]);
//     const [userDetails, setUserDetails] = useState({});
//     const [companySettingData, setCompanySettingData] = useState({});
//     const [noCompanyset, setNoCompanyset] = useState('');
//     const [open, setOpen] = useState(false);
//     const [selectedRoles, setSelectedRoles] = useState([]);
//     const [sortBy, setSortBy] = useState('');
//     const [isEditManage, setIsEditManage] = useState(false);
//     const [searchUser, setSearchUser] = useState("");
//     const [isGenderOpen, setIsGenderOpen] = useState(false);
//     const [selectedGender, setSelectedGender] = useState('');
//     const [role, setRole] = useState([]);
//     const [companyList, setCompanyList] = useState([]);
//     const [searchKey, setSearchKey] = useState("");
//     const [page, setPage] = useState(1);

//     const [segments, setSegments] = useState([]);
//     const [designations, setDesignations] = useState([]);
//     const [selectedCompanies, setSelectedCompanies] = useState([]);
//     const [properties, setProperties] = useState([]);
//     const [companyName, setCompanyName] = useState("");


//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     // const [totalRecords, setTotalRecords] = useState(0);
//     const [company_count, setCompany_count] = useState(0);

//     const [user_count, setUser_count] = useState(0);
//     const [totalPages, setTotalPages] = useState(1);
//     // const [reasonType, setReasonType] = useState({
//     //     reason: '',
//     //     message: ''
//     // })



//     // const reasonsOption = [
//     //     { value: "maintenance-repairs", label: "Maintenance/Repairs" },
//     //     { value: "renovation", label: "Renovation" },
//     //     { value: "seasonal-closure", label: "Seasonal closure" },
//     //     { value: "property-damage", label: "Property damage" },
//     //     { value: "contract-ended", label: "Contract ended" },
//     //     { value: "other", label: "Other" },
//     // ]

//     const gender = [
//         { id: 1, label: "Male", icon: "../images/icons/male.svg" },
//         { id: 2, label: "Female", icon: "../images/icons/Genders.svg" },

//     ];
//     const currencyOption = [
//         { value: "INR", label: "INR, ₹" },
//         { value: "USD", label: "USD, $" },
//         { value: "EURO", label: "EURO, € " },
//     ];


//     const toggleGenderDropdown = () => setIsGenderOpen((prev) => !prev);

//     const handleSelectGender = (label) => {
//         setSelectedGender(label);
//     };

//     const handleClearGender = () => setSelectedGender(null);

//     const handleDoneGender = () => setIsGenderOpen(false);



//     const toggleDropdown = () => setIsOpen((prev) => !prev);




//     const handleRoleSelect = (role) => {
//         setSelectedRoles((prev) =>
//             prev.includes(role)
//                 ? prev.filter((r) => r !== role)
//                 : [...prev, role]
//         );
//     };



//     const assignments = [
//         {
//             name: 'CasaMelhor Areca',
//             extra: 'Exotica',
//             address: 'Flat No. 17, 17th Floor, near NRI apartments, Seawoods, Sector 58A, Navi Mumbai, Maharashtra, 400706',
//             dates: 'From Sun, 3 Aug 2025 to Thu, 7 Aug, 2025',
//             admin: 'Casa Melhor Admin',
//             email: 'casamelhoradmin@casamelhor.in'
//         },
//         {
//             name: 'CasaMelhor Palm',
//             extra: 'Retreat',
//             address: 'Palm Street, Sector 12, Pune, Maharashtra, 411001',
//             dates: 'From Mon, 10 Aug 2025 to Fri, 14 Aug, 2025',
//             admin: 'Casa Melhor Admin',
//             email: 'admin@casamelhor.in'
//         },
//         // Add more objects as needed
//     ];

//     // 

//     // const deptOptions = [
//     //     "Administrator",
//     //     "Finance",
//     //     "HR",
//     //     "Sales & Marketing",
//     //     "Support",
//     // ];

//     const [search, setSearch] = useState("");
//     const [selectedSegment, setSelectedSegment] = useState([]);

//     const toggleDropdown1 = () => setOpen(!open);

//     const handleSegmentDep = (option) => {
//         if (selectedSegment.includes(option)) {
//             setSelectedSegment(selectedSegment.filter((item) => item !== option));
//         } else {
//             setSelectedSegment([...selectedSegment, option]);
//         }
//         // setOpen(false); // Add this line to close dropdown after selection
//     };

//     const handleRemove = (option) => {
//         setSelectedSegment(selectedSegment.filter((item) => item !== option));
//     };    // 


//     const handleOptionKeyDown = (e) => {
//         if ((e.key === "Enter" || e.key === "Tab") && search.trim()) {
//             e.preventDefault();
//             setSelectedSegment([...selectedSegment, search.trim()]);
//             setSearch("");
//         }
//     };

//     const [searchDesignation, setSearchDesignation] = useState("");
//     const [selectedDesignation, setSelectedDesignation] = useState([]);

//     // const handleDesignation = (e) => {
//     //     if ((e.key === "Enter" || e.key === "Tab") && searchDesignation.trim()) {
//     //         e.preventDefault();
//     //         setSelectedDesignation([...selectedDesignation, searchDesignation.trim()]);
//     //         setSearchDesignation("");
//     //     }
//     // }
//     // const handleRemoveDesignation = (option) => {
//     //     setSelectedDesignation(selectedDesignation.filter((item) => item !== option));
//     // };


//     const handleDesignation = (valueOrEvent) => {
//         //  If fired from dropdown click
//         if (typeof valueOrEvent === "string") {
//             setSelectedDesignation((prev) => [...prev, valueOrEvent]);
//             return;
//         }
//         // If fired from keyboard
//         if (
//             (valueOrEvent.key === "Enter" || valueOrEvent.key === "Tab") &&
//             searchDesignation.trim()
//         ) {
//             valueOrEvent.preventDefault();
//             setSelectedDesignation((prev) => [...prev, searchDesignation.trim()]);
//             setSearchDesignation("");
//         }
//     };



//     const handleRemoveDesignation = (option) => {

//         setSelectedDesignation((prev) => prev.filter((item) => item !== option));

//     };

//     const [searchLocation, setSearchLocation] = useState("");
//     const [selectedLocation, setSelectedLocation] = useState([]);

//     const handleLocation = (e) => {
//         if ((e.key === "Enter" || e.key === "Tab") && searchLocation.trim()) {
//             e.preventDefault();
//             setSelectedLocation([...selectedLocation, searchLocation.trim()]);
//             setSearchLocation("");
//         }
//     }
//     const handleRemoveLocation = (option) => {
//         setSelectedLocation(selectedLocation.filter((item) => item !== option));
//     };

//     const [isOpen, setIsOpen] = useState(false);



//     const handleOptionClick = () => {
//         setIsOpen(false); // hide menu when option is clicked
//     };


//     //   drag drop upload

//     const [file, setFile] = useState(null);

//     const handleFileChange = (e) => {
//         const uploadedFile = e.target.files[0];
//         if (uploadedFile) {
//             setFile(URL.createObjectURL(uploadedFile));
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         const uploadedFile = e.dataTransfer.files[0];
//         if (uploadedFile) {
//             setFile(URL.createObjectURL(uploadedFile));
//         }
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//     };

//     const removeFile = () => {
//         setFile(null);
//     };


//     // 

//     const customStyles = {
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected
//                 ? "#4635271F"
//                 : state.isFocused
//                     ? "#4635271F" // Color on hover
//                     : "inherit",
//             color: state.isSelected ? "#000" : "black",
//             cursor: "pointer", // Optional: improves UX on hover
//         }),
//     };



//     // const reasonsOption = [
//     //     { value: "reason1", label: "Reason 1" },
//     //     { value: "reason1", label: "Reason 2" },
//     // ]





//     const department = [
//         { value: "Sales-Marketing", label: "Sales & Marketing" },
//         { value: "Administrator", label: "Administrator" },
//     ]

//     const sortoption = [
//         { value: "most_trips", label: "Most Trips" },
//         { value: "less_trips", label: "Less Trips" }
//     ]




//     const [openPicIndex, setOpenPicIndex] = useState(null);

//     const togglePicOption1 = (e, idx) => {
//         e.preventDefault();
//         setOpenPicIndex(openPicIndex === idx ? null : idx);
//         if (typeof toggleoptio1 === 'function') {
//             toggleoptio1();
//         }
//     }



//     const handleSortBy = (e) => {
//         if (e.value == "Name") {
//         } else {
//             setSearchUser(loginData?.uid)
//         }
//     }






//     const [inactiveFrom, setInactiveFrom] = useState(null);
//     const [inactiveTo, setInactiveTo] = useState(null);
//     const [permanent, setPermanent] = useState(false);

//     const [show, compsetShow] = useState(false);

//     const cmppremodClose = () => compsetShow(false);
//     const cmppremodShow = () => compsetShow(true);

//     const [compnayShow, compstatussetShow] = useState(false);

//     const compnayStatusClose = () => compstatussetShow(false);
//     const compnayStatusShow = () => compstatussetShow(true);



//     const [compnayremoShow, compremovesetShow] = useState(false);

//     const compnayRemoveClose = () => compremovesetShow(false);
//     const compnayRemoveShow = () => compremovesetShow(true);



//     const [assignmentremoShow, assignmentremovesetShow] = useState(false);

//     const assignmentRemoveClose = () => assignmentremovesetShow(false);
//     const assignmentRemoveShow = (Values) => {
//         assignmentremovesetShow(true);
//         setProperty(Values)
//     }
//     const [property, setProperty] = useState({});




//     const [filtermShow, filtersetShow] = useState(false);

//     const filterClose = () => filtersetShow(false);
//     const filterShow = () => filtersetShow(true);





//     const [showsProfile, profilesetShow] = useState(false);
//     const [userId, setUserId] = useState()
//     const [userCompany, setUserCompany] = useState({});

//     const profileClose = () => profilesetShow(false);

//     const [externalshowsProfile, externalprofilesetShow] = useState(false);
//     const externalprofileClose = () => externalprofilesetShow(false);
//     const externalshowProfile = () => externalprofilesetShow(true);
//     const [editsemploye, editemployesetShow] = useState(false);
//     const employeClose = () => editemployesetShow(false);
//     const editemploye = () => editemployesetShow(true);
//     const [deletespicModal, deletepicsetShow] = useState(false);

//     const deletepicClose = () => deletepicsetShow(false);
//     const deletepicModal = () => deletepicsetShow(true);

//     const [changepicsModal, changepisetShow] = useState(false);
//     // const changepicClose = () =>

//     const changepicClose = () => {
//         changepisetShow(false);
//         editemployesetShow(false);
//     }
//     const changepicModal = () => changepisetShow(true);
//     const [addTravels, addTravelsetShow] = useState(false);

//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);
//     const [selectedStatus, setSelectedStatus] = useState(null);

//     const [isLoading, setIsLoading] = useState(false);

//     const showProfile = (val) => {
//         profilesetShow(true);
//         setUserId(val?.uid)
//         const updatedField = val?.user_company;
//         delete updatedField.id;
//         delete updatedField.uid;
//         delete updatedField.company_name;
//         setUserCompany(updatedField)
//     }

//     const getcompanyDetail = async () => {
//         try {
//             const response = await companyDetailAPI(id);
//             if (response?.data?.success) {
//                 setCompanyDetails(response?.data?.response)
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     const getcompanyUserList = async () => {
//         try {
//             const filterRoles = selectedRoles.join(",");
//             const filterSegment = selectedSegment.join(",");
//             const filterdesignation = selectedDesignation.join(",");
//             const filterLocation = selectedLocation.join(",");
//             const response = await CompanyuserListAPI(id, searchUser, filterRoles, filterSegment, filterdesignation, selectedGender, filterLocation, currentPage, sortBy);
//             if (response?.data?.success) {

//                 // setCompany_count(response.data.response.length);
//                 //  setUser_count(response.data.response.length);
//                 setUserList(response?.data?.response)
//                 setUser_count(response?.data?.user_count);
//                 setCompany_count(response?.data?.company_count);
//                 setTotalPages(response.data.total_page)

//                 setIsOpen(false);
//                 setOpen(false);
//                 filterClose();
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const handleClearAllFields = () => {
//         setSelectedRoles([]);
//         setSelectedSegment([]);
//         setSelectedDesignation([]);
//         setSelectedLocation([])
//         setSelectedGender([])
//     }

//     // dynamic pagenationa 
//     // const start = (currentPage - 1) * pageSize + 1;
//     // const end = Math.min(currentPage * pageSize, company_count);

//     const start = companyList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
//     const end = Math.min(currentPage * pageSize, user_count);

//     const getCompanyUserDetails = async () => {
//         try {
//             setIsLoading(true)
//             // const response = await CompanyuserDetailAPI(id, userId)
//             const response = await UserDetailAPI(userId)
//             if (response?.data?.success) {
//                 setUserDetails(response.data.response);
//                 setIsLoading(false);
//             }
//         } catch (error) {
//             setIsLoading(false);
//         }
//     }
//     const userListData = async () => {
//         try {
//             const response = await UserRoleListAPI(loginData?.uid);
//             if (response?.data?.success) {
//                 setRole(response?.data?.response?.map((Val) => ({
//                     value: Val?.uid,
//                     label: Val?.role_name,
//                     icon: Val?.role_icon
//                 })))
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const getCompanySettingData = async () => {
//         try {
//             setIsLoading(true)
//             const response = await CompanySettingDetailAPI(id)
//             if (response?.data?.success) {
//                 setCompanySettingData(response.data.response)
//             }
//         } catch (error) {
//             console.log(error);
//             setNoCompanyset(error?.response?.data?.response)
//         }
//     }

//     // const getCompanyList = async () => {
//     //     try {
//     //         const response = await companyListAPI(searchKey, page);
//     //         if (response?.data?.success) {
//     //             setCompanyList(response?.data?.response?.map((Val) => ({
//     //                 value: Val?.uid,
//     //                 label: Val?.company_name
//     //             })))
//     //         }
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // }

//     const getCompanyList = async () => {

//         try {

//             const response = await companyListAPI(searchKey, page);

//             if (response?.data?.success) {

//                 const list = response?.data?.response?.map((Val) => ({

//                     value: Val?.uid,

//                     label: Val?.company_name

//                 }));



//                 setCompanyList(list);

//                 //  Default select company "Casamelhor"

//                 const defaultCompany = list.find(c => c.label === "Casamelhor");

//                 if (defaultCompany) {

//                     setSelectedCompanies([defaultCompany.label]); // assuming you store labels in selectedCompanies

//                     fetchDept(defaultCompany.value);

//                 }

//             }



//         } catch (error) {

//             console.log(error);

//         }

//     };

//     const [hasMore, setHasMore] = useState(true);

//     const loadMoreCompanies = async () => {
//         try {
//             const nextPage = page + 1;

//             const response = await companyListAPI(searchKey, nextPage);

//             if (response?.data?.success) {

//                 const list = response?.data?.response?.map((Val) => ({
//                     value: Val?.uid,
//                     label: Val?.company_name
//                 }));

//                 // Append new data
//                 setCompanyList(prev => [...prev, ...list]);

//                 setPage(nextPage);

//                 // If less than 10 returned → no more data
//                 if (list.length < 10) {
//                     setHasMore(false);
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };




//     // DeptDesignationAPI
//     const getDeptDesignationList = async () => {
//         try {
//             const response = await DeptDesignationAPI(id);
//             if (response?.data?.success) {
//                 setSegments(response.data.response.segments);
//                 setDesignations(response.data.response.designations);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const getAssignPropertiesList = async () => {
//         try {
//             const response = await AssignPropertiesToCompanyAPI(id);
//             if (response?.data?.success) {
//                 //  alert_success("Assigned sccessfully")
//                 setProperties(response.data.response.company_assignment)
//                 setCompanyName(response.data.response.company_name);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     useEffect(() => {
//         if (id) {
//             getDeptDesignationList();
//             getAssignPropertiesList()
//         }
//     }, [id]);


//     useEffect(() => {
//         getcompanyDetail();
//         getcompanyUserList();
//         userListData();
//         getCompanySettingData();
//         getCompanyList()
//     }, []);

//     useEffect(() => {
//         getcompanyUserList()
//     }, [currentPage, searchUser, sortBy])
//     useEffect(() => {
//         getCompanyUserDetails()
//     }, [userId])

//     // const handleRemoveAssignment = async () => {
//     //     try {
//     //         await RemovePropertyAssignmentApi(property?.uid);

//     //         const payload = {
//     //             property_status: "Active",
//     //             inactive_from: null,
//     //             assigned_companies: [],
//     //             inactive_to: null,
//     //             inactive_reason: null,
//     //             inactive_notes: "",
//     //             is_permanently_inactive: false
//     //         };


//     //         const response = await PropertyStatusUpdateApi(property?.assigned_property?.uid, payload);
//     //         if (response.data.success) {
//     //             alert_success("Assignment removed & status set to Active!");
//     //             getAssignPropertiesList();
//     //             assignmentRemoveClose()
//     //         } else {
//     //             console.log(response?.data?.response?.property_status?.[0]);

//     //             // alert_danger(response?.data?.response?.property_status?.[0])
//     //             assignmentRemoveClose()
//     //         }
//     //         // await PropertyStatusUpdateApi(property?.assigned_property?.uid, payload);

//     //         // alert_success("Assignment removed & status set to Active!");
//     //         // getAssignPropertiesList();

//     //     } catch (err) {
//     //         // alert_danger("Failed to remove assignment!");
//     //         console.log("Failed to remove assignment!");

//     //     }
//     // };

//     // const handleRemoveCompany=async()=>{
//     //     try {
//     //         debugger
//     //         // const response = await
//     //     } catch (error) {
//     //         console.log(error);            
//     //     }
//     // }


//     const handleRemoveAssignment = async () => {
//         try {
//             const removeResponse = await RemovePropertyAssignmentApi(property?.uid);

//             if (!removeResponse?.data?.success) {
//                 // alert_danger(response?.data?.response?.property_status?.[0]);
//                 const errorMessages = showErrorMsg(response?.data?.response);
//                 toast.error(errorMessages)
//                 return;
//             }

//             const payload = {
//                 property_status: "Active",
//                 inactive_from: null,
//                 inactive_to: null,
//                 inactive_reason: null,
//                 inactive_notes: "",
//                 assigned_companies: [],
//                 is_permanently_inactive: false
//             };

//             const statusResponse = await PropertyStatusUpdateApi(
//                 property?.assigned_property?.uid,
//                 payload
//             );

//             if (statusResponse?.data?.success) {
//                 toast.success("Removed property from company");
//                 getAssignPropertiesList();
//                 assignmentRemoveClose();
//             } else {
//                 // alert_danger(
//                 //     statusResponse?.data?.response?.property_status?.[0] ||
//                 //     "Failed to update property status"
//                 // );
//                 const errorRes = showErrorMsg(response?.data?.response)
//                 toast.error(errorRes)
//                 assignmentRemoveClose();
//             }

//         } catch (error) {
//             console.error("Error while removing assignment:", error);
//             toast.error("Something went wrong while updating property status!");
//         }
//     };



//     // const handleRemoveCompany = async () => {
//     //     try {
//     //         const payload = {
//     //             removal_date: new Date().toISOString().split('T')[0],
//     //             reason: reasonType.reason,
//     //             confirmation_text: "REMOVE COMPANY",
//     //             reason_text: reasonType.message,
//     //             data_retention_policy: "archive_7_years",
//     //             notify_stakeholders: true
//     //         };

//     //         const response = await RemoveCompanyAPI(id, payload);

//     //         if (response?.data?.success) {
//     //             toast.success(response?.data?.message || 'Company removed successfully');
//     //             compnayRemoveClose();
//     //         }else{
//     //             toast.error(showErrorMsg(response.data.response))
//     //         }
//     //     } catch (error) {
//     //         error?.response?.data?.message || 'Something went wrong while removing company'
//     //         console.error('Remove company error:', error);
//     //     }
//     // };


//     console.log(companyDetail)

//     const totalSelectedFilters =
//         selectedRoles.length +
//         selectedSegment.length +
//         selectedDesignation.length +
//         selectedGender.length;
//     console.log(companyDetail)
//     console.log(properties)


//     const getCoverPhotoUrl = (assignment) => {
//         const photos = assignment?.assigned_property?.property_photos;

//         if (!Array.isArray(photos)) return null;

//         const coverPhoto = photos.find(
//             (photo) => photo.is_property_cover_photo === true
//         );

//         return coverPhoto
//             ? `${BASE_IMAGE_URL}${coverPhoto.property_photo_url}`
//             : null;
//     };

//     const setCompanyStatus = () => {
//         if (companyDetail?.is_permanently_inactive) {
//             return companyDetail?.company_status
//         } else if (companyDetail?.is_scheduled_inactive) {
//             return "Inactive"
//         } else {
//             return "Active"
//         }
//     }
//     return (
//         <ProtectedRoute>
//             <Header />
//             <Toaster position="top-right" />
//             <div className='Breadcrumb'>
//                 <Container>
//                     <Row>
//                         <Col md={12} >
//                             <ul className='d-flex align-items-center breadcrumb-list'>
//                                 {/* <li><a href=''>Home</a></li> */}
//                                 <li><Link href='/AllCompany'>Company</Link></li>
//                                 <li>{companyDetail?.company_name} <Image src="../images/icons/bottom-arrow.svg" className='img-fluid ms-2' alt='bot-arrow' width={10} height={10} /> </li>
//                             </ul>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//             <div className='page-body  pt-4 pb-4'>
//                 <Container>
//                     <Row>
//                         <Col md={12} >
//                             <Link href="/AllCompany" className='back-page'>
//                                 <Image src='../images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
//                                 Back</Link>
//                         </Col>
//                         <Col md={12} className=' mb-4' >
//                             <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
//                                 <h2 className='page-title'>{companyDetail?.company_name} Details</h2>

//                                 <div className='d-flex align-items-center gap-3'>
//                                     {canListBooking && <Link href="/Bookings" className='btn-company-edit btn-light-transparent btn-white-transparent '> Bookings <Image src="../images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='booking' /> </Link>}
//                                     <Link href="/Calendar" className='btn-company-delete btn-light-transparent btn-white-transparent'> Calendar <Image src="../images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='calendor' /></Link>
//                                     <Link href='javascriptvoid:(0)' onClick={cmppremodShow} className='btn-company-delete btn-light-transparent'>  <Image src="../images/icons/settings.svg" className='img-fluid' width={25} height={25} alt='setting' />  Edit Company Preferences </Link>
//                                 </div>
//                             </div>
//                         </Col>
//                         <Col md={12} >
//                             <Tabs
//                                 defaultActiveKey="company"
//                                 id="uncontrolled-tab-example"
//                                 className="mb-5 mt-3 compnay-detail-tabs"
//                             >
//                                 <Tab eventKey="company" title="Company">
//                                     {isEditManage ? (
//                                         <EditCompany editData={companyDetail} setIsEditManage={setIsEditManage} getcompanyDetail={getcompanyDetail} />
//                                     ) : (
//                                         <Row>
//                                             <Col md={6}>
//                                                 <div className='d-flex align-items-start justify-content-between mb-5'>
//                                                     <div className='general-info'>
//                                                         <h2 className='page-title'> General information</h2>
//                                                         <p className='mb-0'>Change or edit all company related general information from here</p>
//                                                     </div>
//                                                     {canUpdate && <Link href="#" className='edit-company-btn' style={{ color: '#463527', textDecoration: 'none' }} onClick={() => setIsEditManage(true)} > Manage </Link>}

//                                                 </div>
//                                                 <div className='comapny-information-box '>
//                                                     <h4 className='mb-4'>Company</h4>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Company Name  </span> <br></br>
//                                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.company_name} </span></p>
//                                                 </div>
//                                                 <div className='comapny-information-box '>
//                                                     <h4 className='mb-4'>Address</h4>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Headoffice address  </span> <br></br>
//                                                         {/* <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > 4V8R+FCC, Off, Saki Vihar Rd, Tunga Village, Chandivali, Powai, Powai, Mumbai, 400072 </span></p> */}
//                                                         <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >{companyDetail?.house_no}, {companyDetail?.street_and_number},{companyDetail?.head_office_location},{companyDetail?.head_office_city},{companyDetail?.head_office_state}-{companyDetail?.head_office_pin_code} </span></p>
//                                                 </div>
//                                                 <div className='comapny-information-box '>
//                                                     <h4 className='mb-4'>Contacts</h4>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Name  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.c_first_name} {companyDetail?.c_last_name} </span></p>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Position </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.position} </span></p>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >E-mail address  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >  {companyDetail?.company_email}  </span></p>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Phone number  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.phone_number}</span></p>
//                                                 </div>
//                                                 <div className='comapny-information-box '>
//                                                     <h4 className='mb-4'>Legal entity details</h4>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >GST Number  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.gst_number} </span></p>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Legal entity name </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.legal_entity_name} </span></p>
//                                                     <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Contract currency </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {currencyOption.find((val) => val.value == companyDetail?.contract_currency)?.label}</span></p>
//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     )}
//                                 </Tab>
//                                 {canListUser && (
//                                     <Tab eventKey="directories" title="Directories">
//                                         <Row>
//                                             <Col md={12}>
//                                                 <div className='d-flex align-items-center justify-content-between mb-4'>
//                                                     <div className='general-info'>
//                                                         <h2 className='page-title'> Employee Directories</h2>
//                                                     </div>
//                                                     {canAddUser && <Link href="#" onClick={addTravel} className='btn-company-add '  > <span style={{ fontSize: '24px' }}> + </span>  Add Traveler </Link>}
//                                                 </div>
//                                             </Col>
//                                             <Col md={12}>
//                                                 <div className='search-box mb-5'>
//                                                     <input type='text' onChange={(e) => setSearchUser(e.target.value)} placeholder='Search for travelers' className='form-control' />
//                                                     <button className='btn btn-search' onClick={getcompanyUserList}>
//                                                         <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
//                                                     </button>
//                                                 </div>
//                                             </Col>
//                                             <Col md={12} >
//                                                 <div className='d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                                     <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                         <p className='mb-0 d-flex gap-2  align-items-center'> <Image src='../images/icons/group-user.svg' className='img-fluid' alt='user' width={24} height={24} /> {userList?.length}  </p>
//                                                         <div className='role-select'>
//                                                             {/* <Select
//                                                             name="aria-role-select"
//                                                             options={role}
//                                                             placeholder="Role"
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         /> */}
//                                                             <div className="flex gap-2">
//                                                                 <button
//                                                                     onClick={toggleDropdown}
//                                                                     className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
//                                                                 >
//                                                                     Role
//                                                                     <Image src="../images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
//                                                                     {selectedRoles.length > 0 && (
//                                                                         <span className="selected-item">{selectedRoles.length}</span>
//                                                                     )}
//                                                                 </button>
//                                                             </div>
//                                                             {isOpen && (
//                                                                 <div className="absolute mt-2 w-64 border z-10" style={{
//                                                                     background: '#F2F2F2', maxWidth: '317px', width: '100%'
//                                                                 }} >
//                                                                     {/* Role Options */}
//                                                                     <ul className="space-y-3 p-3 mb-0">
//                                                                         {role.map((role) => (
//                                                                             <li
//                                                                                 key={role.id}
//                                                                                 onClick={() => handleRoleSelect(role.label)}
//                                                                                 className={` gap-2 px-3 py-2 user-role-list  rounded-full cursor-pointer ${selectedRoles.includes(role.label)
//                                                                                     ? "select-grey"
//                                                                                     : "hover:bg-gray-100"
//                                                                                     }`}
//                                                                             >
//                                                                                 {/* Placeholder Icon */}
//                                                                                 <span className="text-gray-600"><Image src={role.icon} className='img-fluid' alt='role' width={20} height={20} /> </span>
//                                                                                 <span>{role.label}</span>
//                                                                             </li>
//                                                                         ))}
//                                                                     </ul>

//                                                                     {/* Actions */}
//                                                                     <div className="flex justify-between items-center border-top p-3">
//                                                                         <button
//                                                                             onClick={() => setSelectedRoles([])}
//                                                                             className="text-gray-500 text-sm hover:underline"
//                                                                         >
//                                                                             Clear all
//                                                                         </button>
//                                                                         <button
//                                                                             onClick={getcompanyUserList}
//                                                                             className="bg-green-700 text-white rounded-md" style={{ padding: "12px 16px" }}
//                                                                         >
//                                                                             Done
//                                                                         </button>
//                                                                     </div>
//                                                                 </div>
//                                                             )}

//                                                         </div>
//                                                         <div className='role-select'>
//                                                             <div className="flex gap-2">
//                                                                 <button
//                                                                     onClick={toggleDropdown1}
//                                                                     className="selected-list-border w-full position-relative border border-gray-300 role-btn rounded-md px-3 gap-3 py-2 flex justify-between items-center"
//                                                                 >
//                                                                     <span className="text-gray-700">Dept./Segment</span>
//                                                                     <Image src="../images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
//                                                                     {selectedSegment.length > 0 && (
//                                                                         <span className="selected-item">{selectedSegment.length}</span>
//                                                                     )}

//                                                                 </button>

//                                                                 {open && (
//                                                                     <div className="searching-filter absolute mt-2 w-64 border z-10" style={{
//                                                                         background: '#F2F2F2', maxWidth: '317px', width: '100%'
//                                                                     }} >
//                                                                         <div className='p-3 position-relative' style={{ minHeight: '300px' }} >
//                                                                             {/* Search */}
//                                                                             <div className="flex items-center border-bottom mb-2 px-2 py-2 position-relative">
//                                                                                 <Image src='../images/icons/search.svg' className='img-fluid mr-2' alt='search' width={16} height={16} />
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     placeholder="Search"
//                                                                                     className="flex-1 outline-none text-sm"
//                                                                                     value={search}
//                                                                                     onChange={(e) => setSearch(e.target.value)}
//                                                                                 />
//                                                                             </div>

//                                                                             <div className="option-list max-h-40 overflow-y-auto ">
//                                                                                 {search.trim() !== "" &&
//                                                                                     segments
//                                                                                         .filter((opt) =>
//                                                                                             opt.toLowerCase().includes(search.toLowerCase())
//                                                                                         )
//                                                                                         .map((opt) => (
//                                                                                             <div
//                                                                                                 key={opt}
//                                                                                                 onClick={(e) => {
//                                                                                                     e.stopPropagation();
//                                                                                                     handleSegmentDep(opt); // This will now close the dropdown
//                                                                                                     setSearch("");   // clear search field
//                                                                                                 }}
//                                                                                                 className={`px-3 py-1 data-option cursor-pointer text-sm ${selectedSegment.includes(opt)
//                                                                                                     ? "bg-gray-200 font-medium"
//                                                                                                     : "hover:bg-gray-100"
//                                                                                                     }`}
//                                                                                             >
//                                                                                                 {opt}
//                                                                                             </div>
//                                                                                         ))}
//                                                                             </div>

//                                                                             {/* Selected tags */}
//                                                                             <div className="flex flex-wrap gap-2 px-2 py-2">
//                                                                                 {selectedSegment.map((item) => (
//                                                                                     <div
//                                                                                         key={item}
//                                                                                         className="selected-badge flex items-center bg-gray-100 px-3 gap-2 py-1 rounded-md text-sm"
//                                                                                     >
//                                                                                         {item}
//                                                                                         <button
//                                                                                             onClick={() => handleRemove(item)}
//                                                                                             className="ml-1 text-gray-500 hover:text-black"
//                                                                                         >
//                                                                                             <Image src="../images/icons/x-circle.svg" alt='close' width={20} height={20} />
//                                                                                         </button>
//                                                                                     </div>
//                                                                                 ))}
//                                                                             </div>
//                                                                         </div>

//                                                                         {/* Footer */}
//                                                                         <div className="border-top flex justify-between items-center p-3">
//                                                                             <button
//                                                                                 onClick={() => setSelectedSegment([])}
//                                                                                 className="text-sm text-gray-500 hover:text-black"
//                                                                             >
//                                                                                 Clear all
//                                                                             </button>
//                                                                             <button
//                                                                                 onClick={getcompanyUserList} // This closes the dropdown
//                                                                                 className="bg-green-700 text-white rounded-md text-sm"
//                                                                                 style={{ padding: '12px 26px' }}
//                                                                             >
//                                                                                 Done
//                                                                             </button>
//                                                                         </div>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </div>

//                                                         <Button variant="" className='btn-filter position-relative selected-list-border' onClick={filterShow} >
//                                                             {totalSelectedFilters > 0 && (
//                                                                 <span className="selected-item">{totalSelectedFilters}</span>
//                                                             )}
//                                                             <Image src='../images/icons/filter.svg' className='img-fluid' width={24} height={24} alt='filter' />
//                                                         </Button>


//                                                     </div>


//                                                     <div className='filter-right-option d-flex gap-3'>
//                                                         <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                             <p className='mb-0'>
//                                                                 {user_count > 0
//                                                                     ? `${start}-${end} of ${user_count}`
//                                                                     : "0 results"}
//                                                             </p>

//                                                             <Image
//                                                                 src='../images/icons/back.svg'
//                                                                 className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
//                                                                 alt='back'
//                                                                 width={10}
//                                                                 height={10}
//                                                                 onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
//                                                                 style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}

//                                                             />


//                                                             <Image
//                                                                 src='../images/icons/Arrows-right.svg'
//                                                                 className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
//                                                                 alt='right'
//                                                                 width={29}
//                                                                 height={29}
//                                                                 onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
//                                                                 style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
//                                                             />

//                                                         </div>

//                                                         <Button variant="" className='btn-sort'> Sort by :
//                                                             <Select
//                                                                 name="aria-role-select"
//                                                                 options={sortoption}
//                                                                 placeholder="Name"
//                                                                 className="react_selectbox"
//                                                                 isSearchable={false}
//                                                                 styles={customStyles}
//                                                                 onChange={(e) => setSortBy(e.value)}
//                                                             />

//                                                         </Button>

//                                                     </div>

//                                                 </div>

//                                                 <Table className='company-table' responsive>
//                                                     <thead>
//                                                         <tr>
//                                                             <th style={{ width: '30%' }} >Employee</th>
//                                                             <th style={{ width: '20%' }} >Employee ID</th>
//                                                             <th style={{ width: '20%' }} >Dept./Segment</th>
//                                                             <th style={{ width: '20%' }}>Number of trips</th>

//                                                             <th style={{ width: '10%', textAlign: 'right' }} >
//                                                                 <Image src='../images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />
//                                                             </th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {userList.map((Val, index) => (
//                                                             <tr key={index}>
//                                                                 <td>
//                                                                     <div className='d-flex align-items-center gap-3'>
//                                                                         {/* <Image src={`https://alicedevapi.casamelhor.in${Val?.user_role?.role_icon}` || "/images/icons/user-long.svg"} width={56} height={104} className='img-fluid ' alt='User' /> */}
//                                                                         <Image
//                                                                             src={Val?.profile_image ? Val?.profile_image : "/images/icons/No-Image.svg"}
//                                                                             width={56}
//                                                                             height={104}
//                                                                             className="img-fluid"
//                                                                             alt="User"
//                                                                             style={{ objectFit: "cover", height: "104px" }}
//                                                                         />
//                                                                         <p className='mb-0'>
//                                                                             <small>Company Employee</small> <br></br>
//                                                                             <span style={{ fontWeight: '500' }} > {Val?.first_name} {Val?.last_name} </span>
//                                                                         </p>
//                                                                     </div>
//                                                                 </td>
//                                                                 <td>
//                                                                     <div className='d-flex align-items-center gap-2'>{Val?.employee_id ? Val?.employee_id : "-"}</div>

//                                                                 </td>
//                                                                 <td>{Val?.segment ? Val?.segment : "-"}</td>
//                                                                 <td>{Val?.number_of_trips ? Val?.number_of_trips : 0}</td>

//                                                                 <td>
//                                                                     {canRetrieveUser && (
//                                                                         <Button variant="" onClick={() => showProfile(Val)} className='btn-light-action mb-2'  > View Full Profile</Button>
//                                                                     )}
//                                                                     {canRetrieveUser && (
//                                                                         <Link href={`/Bookings?guest_uid=${Val?.uid}`} className='btn-table-action gap-2'>
//                                                                             View Trips <Image src='../images/icons/open_in_new.svg' className='img-fluid' alt='open-new-tab' width={20} height={20} />
//                                                                         </Link>
//                                                                     )}
//                                                                 </td>
//                                                             </tr>

//                                                         ))}

//                                                     </tbody>
//                                                 </Table>
//                                             </Col>

//                                         </Row>
//                                     </Tab>
//                                 )}
//                                 {canListProperty && (
//                                     <Tab eventKey="properties" title="Properties" >
//                                         <Row>
//                                             <Col md={12}>
//                                                 <div className='d-flex align-items-center justify-content-between mb-4'>
//                                                     <div className='general-info'>
//                                                         <h2 className='page-title'> Properties List</h2>

//                                                     </div>

//                                                     {canAddAssignProperty && (
//                                                         <Link
//                                                             // href={`/AssignProperty?uid=${id}`}
//                                                             href={{
//                                                                 pathname: "/AssignProperty",
//                                                                 query: {
//                                                                     uid: id,
//                                                                     company_name: companyName
//                                                                 }
//                                                             }}
//                                                             className='btn-company-add '  > <span style={{ fontSize: '24px' }}> + </span>  Assign Property

//                                                         </Link>
//                                                     )}
//                                                 </div>
//                                             </Col>
//                                             <Col md={12}>
//                                                 <div className='search-box mb-5'>
//                                                     <input type='text' placeholder='Search by company name, or location' className='form-control' />
//                                                     <button className='btn btn-search'>
//                                                         <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
//                                                     </button>
//                                                 </div>
//                                             </Col>

//                                             <Col md={12} >
//                                                 <div className='d-flex justify-content-between align-items-center mb-4'>
//                                                     <p className='mb-0'> <strong>
//                                                         {properties?.filter((assignment) => {
//                                                             const today = new Date();
//                                                             const fromDate = new Date(assignment.date_from);
//                                                             const toDate = new Date(assignment.date_to);
//                                                             return (
//                                                                 assignment?.property_assignment_status === "Active"
//                                                                 &&
//                                                                 today >= fromDate &&
//                                                                 today <= toDate
//                                                             )
//                                                         })?.length}
//                                                     </strong>  Properties</p>
//                                                 </div>

//                                                 <Table className='company-table' >
//                                                     <thead>
//                                                         <tr>
//                                                             <th style={{ width: '25%' }} >BR Name</th>
//                                                             <th style={{ width: '20%' }} >BR Address</th>
//                                                             <th style={{ width: '20%' }} >Assigned dates</th>
//                                                             <th style={{ width: '15%' }}>Assigned by</th>



//                                                             <th style={{ textAlign: 'right' }} width="20%" >
//                                                                 <Image src='../images/icons/settings.svg' className='ms-auto me-0' width={16} height={16} alt='Sort' />
//                                                             </th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {/* {properties?.map((assignment, idx) => ( */}
//                                                         {properties
//                                                             ?.filter((assignment) => {
//                                                                 const today = new Date();
//                                                                 const fromDate = new Date(assignment.date_from);
//                                                                 const toDate = new Date(assignment.date_to);

//                                                                 return (
//                                                                     assignment?.property_assignment_status === "Active"
//                                                                     &&
//                                                                     today >= fromDate &&
//                                                                     today <= toDate
//                                                                 )
//                                                             })
//                                                             ?.map((assignment, idx) => (
//                                                                 <tr key={idx}>
//                                                                     <td>
//                                                                         <div className='d-flex align-items-center gap-3'>
//                                                                             {/* <Image src={assignment.cover_photo_url ? assignment.cover_photo_url : "/images/icons/No-Image.svg"} */}
//                                                                             <Image src={
//                                                                                 getCoverPhotoUrl(assignment)
//                                                                                     ? getCoverPhotoUrl(assignment)
//                                                                                     : "/images/icons/No-Image.svg"
//                                                                             }
//                                                                                 width={58} height={58} style={{ height: '104px', objectFit: 'cover' }} className='img-fluid ' alt='User' />
//                                                                             <span style={{ fontWeight: '500' }}> {assignment?.assigned_property?.property_name} <br></br>{assignment?.assigned_property?.street_number} </span>
//                                                                         </div>
//                                                                     </td>
//                                                                     <td>
//                                                                         {assignment?.assigned_property?.flat_house_no}, {assignment?.assigned_property?.address_search_text}, {assignment?.assigned_property?.city}, {assignment?.assigned_property?.state}, {assignment?.assigned_property?.pin_code}
//                                                                     </td>
//                                                                     <td>From {formatDaysDateMonthYear(assignment.date_from)} to {formatDaysDateMonthYear(assignment.date_to)}</td>
//                                                                     <td>
//                                                                         {assignment?.assigned_by?.first_name}
//                                                                         <br></br>
//                                                                         {assignment?.assigned_by?.email}
//                                                                     </td>
//                                                                     <td>
//                                                                         <div className='bt-abs position-relative'>
//                                                                             <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
//                                                                                 <Image src='../images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
//                                                                             </Link>
//                                                                             <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>
//                                                                                 {canUpdateAssignProperty && (
//                                                                                     <li><Link href={`/EditAssignPropertyCompany/${assignment?.uid}`} onClick={() => { localStorage.setItem("propertyUid", assignment?.assigned_property?.uid) }}>Change Date</Link></li>)}
//                                                                                 {canDeleteProperty && (
//                                                                                     <li>
//                                                                                         <Link href='#' onClick={() => assignmentRemoveShow(assignment)} className={`event-remove ${openPicIndex === idx ? "show" : "hide"}`}>Remove Properties</Link>
//                                                                                     </li>
//                                                                                 )}
//                                                                                 {canRetrieveProperty && (
//                                                                                     <li><Link className='d-flex gap-2' href={`/propertyDetails?uid=${assignment?.assigned_property?.uid}`}
//                                                                                     >View BR Details <Image src='../images/icons/open_in_new.svg' className='img-fluid' width={24} height={24} alt='open' /> </Link></li>
//                                                                                 )}
//                                                                             </ul>
//                                                                         </div>
//                                                                     </td>
//                                                                 </tr>
//                                                             ))}
//                                                     </tbody>
//                                                 </Table>
//                                             </Col>
//                                         </Row>
//                                     </Tab>
//                                 )}
//                             </Tabs>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//             {/* compnay prefrence modal */}


//             <Modal show={show} onHide={cmppremodClose} animation={false} centered className='custom-theme-modal' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between' >
//                     <Modal.Title>Edit company preferences</Modal.Title>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={cmppremodClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-0'>
//                     {canRetrieveSetting && (
//                         <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
//                             <div className=''>
//                                 <p className='font-18 mb-0'> User onboarding questions</p>
//                                 <p className='mb-0'> Questions that we ask guest when they book a stay.</p>
//                             </div>
//                             <Link href={`/UserOnboardQuestion/${id}`} className='' style={{
//                                 background: 'transparent', color: '#463527', border: 'none', padding: '0',
//                             }}>
//                                 <Image src='../images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />
//                             </Link>

//                         </div>
//                     )}

//                     {canUpdate && (
//                         <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
//                             <div className=''>
//                                 <p className='font-18 mb-0'> Company status</p>
//                                 <span className='badge ' style={{
//                                     background: 'transparent', color: '#E07912', fontWeight: '500', fontSize: '14px', padding: '5px 10px', borderRadius: '4px', textTransform: 'Uppercase'
//                                 }} > {setCompanyStatus()} </span>
//                             </div>
//                             <Button variant="" disabled={canUpdate ? false : true} onClick={() => {
//                                 cmppremodClose();
//                                 compnayStatusShow();
//                             }} className='' style={{
//                                 background: 'transparent', color: '#463527', border: 'none', padding: '0',
//                             }}>
//                                 <Image src='../images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />

//                             </Button>
//                         </div>
//                     )}

//                     {canDelete && (
//                         <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
//                             <div className=''>
//                                 <p className='font-18 mb-0'> Remove company </p>
//                                 <p className='mb-0'> Permanently remove this company from listing</p>
//                             </div>

//                             <Button variant="" onClick={() => {
//                                 cmppremodClose();
//                                 compnayRemoveShow();
//                             }} className='' style={{
//                                 background: 'transparent', color: '#463527', border: 'none', padding: '0',
//                             }}>
//                                 <Image src='../images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />

//                             </Button>
//                         </div>
//                     )}
//                 </Modal.Body>
//             </Modal>


//             {/* company status modal */}



//             <CompnayStatusModel
//                 compnayShow={compnayShow}
//                 compnayStatusClose={compnayStatusClose}
//                 settingData={companyDetail}
//                 getcompanyDetail={getcompanyDetail}
//             />
//             {/* company remove */}


//             {/* <Modal show={compnayremoShow} onHide={compnayRemoveClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between' >
//                     <Link href='#' className='d-flex align-items-center gap-2' style={{ textDecoration: 'none', color: '#463527', fontWeight: '500' }}
//                         onClick={() => {
//                             compnayRemoveClose();
//                             cmppremodShow();
//                         }} >
//                         <Image src='../images/icons/back.svg' width={10} height={10} className='img-fluid' alt='back' /> Back
//                     </Link>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={compnayRemoveClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-0'>
//                     <h2 className='page-title'>Remove this company listing?</h2>
//                     <p style={{ color: '#73615F' }}>The company will permanently be removed from the listing</p>


//                     <div className='inactive-box remove-company-box company-status-box'>
//                         <div className='form-group mb-4'>
//                             <label>Reason</label>

//                             <Select
//                                 name="reason"
//                                 options={reasonsOption}
//                                 value={reasonsOption.find((opt) => opt.value == reasonType.reason)}
//                                 placeholder="Select a reason"
//                                 className="react_selectbox"
//                                 isSearchable={false}
//                                 onChange={(e) => setReasonType({ ...reasonType, reason: e.value })}
//                                 styles={customStyles}
//                             />
//                         </div>

//                         <div className='forom-group mb-4'>
//                             <label>Tell why you need to unlist this company</label>
//                             <textarea
//                                 className="form-control textareabox mt-2"
//                                 onChange={(e) => setReasonType({ ...reasonType, message: e.target.value })}
//                                 rows={4}
//                                 placeholder="Add your message here"
//                             />
//                         </div>
//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={compnayRemoveClose}>
//                         Cancel
//                     </Button>
//                     <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={handleRemoveCompany}>
//                         Yes, Remove
//                     </Button>
//                 </Modal.Footer>
//             </Modal> */}
//             <RemoveCompanyModal compnayremoShow={compnayremoShow} cmppremodShow={cmppremodShow} compnayRemoveClose={compnayRemoveClose} companyDetail={companyDetail} />
//             {/* Filter modal */}


//             {/* <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
//                     Filters
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='filter-compnay-details'>
//                         <p>Role</p>

//                         <ul className="space-y-3 gap-2 ps-0 mb-0">
//                             {role.map((role) => (
//                                 <li
//                                     key={role.id}
//                                     onClick={() => handleRoleSelect(role.label)}
//                                     className={` gap-2 px-3 py-2 user-role-list me-3  rounded-full cursor-pointer ${selectedRoles.includes(role.label)
//                                         ? "select-grey"
//                                         : "hover:bg-gray-100"
//                                         }`}
//                                 >

//                                     <span className="text-gray-600"><Image src={`https://alicedevapi.casamelhor.in${role.icon}`} className='img-fluid' alt='role' width={20} height={20} /> </span>
//                                     <span>{role.label}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                         <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
//                     </div>
//                     <div className='filter-compnay-details'>
//                         <p>Dept./Segment</p>
//                         <div className='search-box '>
//                             <input
//                                 type='text'
//                                 placeholder='Search '
//                                 className='form-control'
//                                 value={search}
//                                 onChange={e => setSearch(e.target.value)}
//                                 onKeyDown={handleOptionKeyDown}
//                             />
//                             <button className='btn btn-search'>
//                                 <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
//                             </button>
//                         </div>
//                         <div className="d-flex gap-2 mt-3 flex-wrap">
//                             {selectedSegment.map((opt, idx) => (
//                                 <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
//                                     {opt}
//                                     <span
//                                         style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
//                                         onClick={() => handleRemove(opt)}
//                                     >
//                                         <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                         <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
//                     </div>
//                     <div className='filter-compnay-details'>
//                         <p>Designation</p>

//                         <div className='role-select'>


//                             <div className='search-box '>
//                                 <input
//                                     type='text'
//                                     placeholder='Search '
//                                     className='form-control'
//                                     value={searchDesignation}
//                                     onChange={e => setSearchDesignation(e.target.value)}
//                                     onKeyDown={handleDesignation}
//                                 />
//                                 <button className='btn btn-search'>
//                                     <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="d-flex gap-2 mt-3 flex-wrap">
//                             {selectedDesignation.map((opt, idx) => (
//                                 <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
//                                     {opt}
//                                     <span
//                                         style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
//                                         onClick={() => handleRemoveDesignation(opt)}
//                                     >
//                                         <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                         <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
//                     </div>
//                     <div className='filter-compnay-details'>
//                         <p>Gender</p>

//                         <ul className="space-y-3 gap-2 ps-0 mb-0">
//                             {gender.map((role) => (
//                                 <li
//                                     key={role.id}
//                                     onClick={() => handleSelect(role.label)}
//                                     className={` gap-2 px-3 py-2 user-role-list me-3  rounded-full cursor-pointer ${selectedRoles.includes(role.label)
//                                         ? "select-grey"
//                                         : "hover:bg-gray-100"
//                                         }`}
//                                 >

//                                     <span className="text-gray-600"><Image src={role.icon} className='img-fluid' alt='role' width={20} height={20} /> </span>
//                                     <span>{role.label}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                         <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
//                     </div>
//                     <div className='filter-compnay-details'>
//                         <p className='d-flex justify-content-between' >Location <Image style={{ transform: 'rotate(180deg)' }} src='../images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>

//                         <div className='search-box '>
//                             <input type='text' placeholder='Search by company name, or location' className='form-control' />
//                             <button className='btn btn-search'>
//                                 <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
//                             </button>
//                         </div>
//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <p onClick={filterClose}>
//                         Clear all
//                     </p>
//                     <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={getcompanyUserList}>
//                         Search
//                     </Button>
//                 </Modal.Footer>
//             </Modal> */}
//             {/* profile show */}

//             <FilterUserAll
//                 filtermShow={filtermShow}
//                 filterClose={filterClose}
//                 role={role}
//                 search={search}
//                 setSearch={setSearch}
//                 handleOptionKeyDown={handleOptionKeyDown}
//                 selectedSegment={selectedSegment}
//                 setSelectedSegment={setSelectedSegment}
//                 searchDesignation={searchDesignation}
//                 setSearchDesignation={setSearchDesignation}
//                 handleDesignation={handleDesignation}
//                 selectedDesignation={selectedDesignation}
//                 selectedRoles={selectedRoles}
//                 handleRemove={handleRemove}
//                 handleRemoveDesignation={handleRemoveDesignation}
//                 handleRoleSelect={handleRoleSelect}
//                 selectedGender={selectedGender}
//                 setSelectedGender={setSelectedGender}
//                 searchLocation={searchLocation}
//                 setSearchLocation={setSearchLocation}
//                 selectedLocation={selectedLocation}
//                 setSelectedLocation={setSelectedLocation}
//                 handleLocation={handleLocation}
//                 handleRemoveLocation={handleRemoveLocation}
//                 gender={gender}
//                 getcompanyUserList={getcompanyUserList}
//                 selectedCompanies={selectedCompanies}
//                 companyList={companyList}
//                 segments={segments}
//                 designations={designations}
//                 handleSegmentDep={handleSegmentDep}
//                 showCompanyFilter={false}
//                 handleSelectGender={handleSelectGender}
//                 handleClearAllFields={handleClearAllFields}
//             />

//             <EmployeeDetailModel
//                 showsProfile={showsProfile}
//                 profileClose={profileClose}
//                 userDetails={userDetails}
//                 editemploye={editemploye}
//                 companyDetail={companyDetail}
//                 userCompany={userCompany}

//             />

//             {/* edit employ */}
//             <EditUserProfile
//                 showEditBox={editsemploye}
//                 closeEditBox={employeClose}
//                 editData={userDetails}
//                 companyDetail={companyDetail}
//                 roleOption={role}
//                 companyList={companyList}
//                 changepicClose={changepicClose}
//                 //  openEditBox={editsemploye}
//                 // openEditBox={editemploye}
//                 userListData={userListData}
//                 openEditBox={editemploye}
//             />
//             {/* delete pic modal */}

//             {/* Filter modal */}


//             <Modal show={deletespicModal} onHide={deletepicClose} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
//                     <Modal.Title>
//                         Remove profile photo?
//                     </Modal.Title>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={deletepicClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <p>Are you sure you want to remove this photo? We’ll replace it with a default Alice avatar.</p>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <Button variant="" onClick={deletepicClose} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
//                         Clear all
//                     </Button>
//                     <Button variant="" onClick={deletepicClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}>
//                         Yes, Remove
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//             {/* change pic  */}

//             <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
//                     <Modal.Title>
//                         Upload photo
//                     </Modal.Title>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <p className='border-bottom pb-4'>Please upload Operations managers photo</p>
//                     <div className="drap-drop-box-full">
//                         {!file ? (
//                             <label
//                                 onDrop={handleDrop}
//                                 onDragOver={handleDragOver}
//                                 className="border-2 border-dashed border-gray-300 rounded-md h-48 flex flex-col items-center justify-center cursor-pointer"
//                             >
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleFileChange}
//                                     className="hidden"
//                                 />
//                                 <div className="text-center">
//                                     <Image
//                                         src="/images/icons/photo-library.svg" // replace with your upload icon
//                                         alt="Upload"
//                                         width={30}
//                                         height={30}
//                                         className="mx-auto mb-2"
//                                     />
//                                     <p className="font-medium mb-0" style={{ color: '#463527' }} >Drag and drop</p>
//                                     <p className="text-sm text-gray-500 mb-0" style={{ color: '#73615F' }}  >
//                                         or click here to choose file.
//                                     </p>
//                                 </div>
//                             </label>
//                         ) : (
//                             <div className="relative inline-block">
//                                 <Image
//                                     src={file}
//                                     alt="Uploaded preview"
//                                     width={250}
//                                     height={250}
//                                     className="rounded-md object-cover"
//                                 />
//                                 <button
//                                     onClick={removeFile}
//                                     className="absolute delete-icn"
//                                 >
//                                     <Image src="../images/icons/delete.svg" className='img-fluid ' width={24} height={24} alt='delete' />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <Button variant="" onClick={changepicClose} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
//                         Cancel
//                     </Button>
//                     <Button variant="" onClick={changepicClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
//                         Upload
//                     </Button>
//                 </Modal.Footer>

//             </Modal>

//             {/* add Traveler */}
//             <AddPersonModel
//                 addTravels={addTravels}
//                 removeTravel={removeTravel}
//                 roleOption={role}
//                 companyList={companyList}
//                 addTravel={addTravel}
//                 companyDetail={companyDetail}
//                 companyUid={id}
//                 loadMoreCompanies={loadMoreCompanies}
//             />
//             {/* external profile show */}


//             <Modal show={externalshowsProfile} onHide={externalprofileClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
//                     <p className='d-flex align-items-center gap-3 font-18' style={{ color: '#73615F' }}>
//                         External Traveler Details <Image src='../images/icons/bottom-arrow.svg' style={{ transform: 'rotate(180deg)', opacity: '.5' }} className='img-fluid' alt='top' width={12} height={12} />
//                         <Image src='../images/icons/bottom-arrow.svg' className='img-fluid' alt='top' width={12} height={12} />
//                     </p>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={profileClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='cmp-employe-box'>
//                         <div className='d-flex justify-content-between mb-3'>
//                             <Image src='../images/icons/external-user.jpg' className='img-fluid' alt='employer' width={64} height={64} />
//                             <Button variant="" onClick={() => {
//                                 externalprofileClose();
//                                 editemploye();
//                             }} className='edit-btn gap-2'>Edit Profile  <Image src='../images/icons/edit.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
//                         </div>
//                         <p className='mb-1'>External</p>
//                         <h4 className='font-24 mb-1'>Jenny Shaikh</h4>
//                         <p className='d-flex gap-2' >
//                             <Image src='../images/icons/email.svg' className='img-fluid' alt='email' width={20} height={20} />
//                             <Link style={{ color: '#463527', fontWeight: '500' }} href='mailto:Shubancasamelhor@gmail.com'>Shubancasamelhor@gmail.com</Link>

//                             <Image src='../images/icons/call.svg' className='img-fluid' alt='email' width={20} height={20} />
//                             <Link style={{ color: '#463527', fontWeight: '500' }} href='tell:8390734261'>8390734261</Link>
//                         </p>
//                         <Button variant="" className='edit-btn gap-2'>View Trips  <Image src='../images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
//                         <hr style={{ marginTop: '20px', borderColor: '#4635273D' }}></hr>
//                         <div className='comapny-information-box-employer'>
//                             <p className='subheadine-2'>Personal Information</p>
//                             <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Gender  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > Female </span></p>
//                         </div>
//                         <div className='comapny-information-box-employer'>
//                             <p className='subheadine-2'>Custom Question</p>
//                             <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Rezo ticket  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > CM656574754536 </span></p>
//                         </div>
//                         <Button variant="" className='edit-btn gap-2'>Change Role/Password  <Image src='../images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
//                     </div>
//                 </Modal.Body>
//             </Modal>
//             {/* Remove Assignment */}
//             <Modal show={assignmentremoShow} onHide={assignmentRemoveClose} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between' >
//                     <Link href='#' className='d-flex align-items-center gap-2' style={{ textDecoration: 'none', color: '#463527', fontWeight: '500' }}
//                         onClick={() => {
//                             assignmentRemoveClose();
//                             //cmppremodShow();
//                         }} >
//                         <Image src='../images/icons/back.svg' width={10} height={10} onClick={assignmentRemoveClose} className='img-fluid' alt='back' /> Back
//                     </Link>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={assignmentRemoveClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-0' style={{ minHeight: '200px' }} >
//                     <h2 className='page-title'>Remove this Assigment?</h2>
//                     <p style={{ color: '#73615F' }}>The BR will permanently be unassigned to this company</p>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={assignmentRemoveClose}>
//                         Cancel
//                     </Button>
//                     <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={handleRemoveAssignment}>
//                         Yes, Remove
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </ProtectedRoute>
//     )
// }

// Sample data for assignments table
"use client"
import React from 'react'
import { useEffect, useState } from "react";
import CompanyIntegrationsTab from '../Integrations/CompanyIntegrationsTab'; // integration: alice_v3_claude — w7
import Header from '../Header/Header'
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import Select, { AriaOnFocus, components } from 'react-select';
import DatePicker from "react-datepicker";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { companyDetailAPI, companyListAPI, CompanySettingDetailAPI, CompanyuserDetailAPI, CompanyuserListAPI, UserDetailAPI, UserRoleListAPI, DeptDesignationAPI, AssignPropertiesToCompanyAPI, PropertyStatusUpdateApi, RemovePropertyAssignmentApi, RemoveCompanyAPI } from '@/services/provider';
import ProtectedRoute from '../ProtectedRoute';
import EditCompany from './EditCompany';
import { EditUserProfile } from '../commons/EditUserProfile';
import { EmployeeDetailModel } from '../commons/EmployeeDetailModel';
import { AddPersonModel } from '../commons/AddPersonModel';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { FilterUserAll } from '../commons/FilterUserAll';
import { CompnayStatusModel } from './CompnayStatusModel';
import { formatDaysDateMonthYear } from '@/utils/formatTime';
import { alert_danger, alert_success, showError, showErrorMsg } from '@/utils/Alerts/TostifyAlerts';
import toast, { Toaster } from 'react-hot-toast';
import { RemoveCompanyModal } from './RemoveCompanyModal';
import { checkPermission } from '@/utils/helper';

export default function CompanyDetails() {

    // const param = useParams();
    // // const id = param.id;
    // const id = param?.id || param?.companyId;
    // const [id, setId] = useState(null);
    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionCompany = checkPermission(permissionArray, "company");
    const permissionBooking = checkPermission(permissionArray, "booking");
    const permissionSetting = checkPermission(permissionArray, "company_settings");
    const permissionUser = checkPermission(permissionArray, "user");
    const permissionIntegration = checkPermission(permissionArray, "integration"); // integration: alice_v3_claude — w7
    const canListIntegration = permissionIntegration === true || permissionIntegration?.can_list; // integration: alice_v3_claude — w7
    const permissionProperty = checkPermission(permissionArray, "property");
    const permissionPropertyAssign = checkPermission(permissionArray, "property_assignment");

    const canAdd = permissionCompany === true || permissionCompany?.can_add;
    const canList = permissionCompany === true || permissionCompany?.can_list;
    const canRetrieve = permissionCompany === true || permissionCompany?.can_retrieve;
    const canUpdate = permissionCompany === true || permissionCompany?.can_update;
    const canDelete = permissionCompany === true || permissionCompany?.can_delete;
    //setting permission for retrieve
    const canRetrieveSetting = permissionSetting === true || permissionSetting?.can_retrieve;
    //permission for bookign lisr 
    const canListBooking = permissionBooking === true || permissionBooking?.can_list;
    //user permission
    const canAddUser = permissionUser === true || permissionUser?.can_add;
    const canListUser = permissionUser === true || permissionUser?.can_list;
    const canRetrieveUser = permissionUser === true || permissionUser?.can_retrieve;
    const canUpdateUser = permissionUser === true || permissionUser?.can_update;
    const canDeleteUser = permissionUser === true || permissionUser?.can_delete;
    //property permission
    const canListProperty = permissionProperty === true || permissionProperty?.can_list;
    const canRetrieveProperty = permissionProperty === true || permissionProperty?.can_retrieve;
    const canUpdateProperty = permissionProperty === true || permissionProperty?.can_update;
    const canDeleteProperty = permissionProperty === true || permissionProperty?.can_delete;
    //can property assign
    const canAddAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_add;
    const canRetrieveAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_retrieve;
    const canUpdateAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_update;
    const canDeleteAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_delete;

    const searchParams = useSearchParams();
    const id = searchParams.get("uid");
    const router = useRouter();
    const loginData = JSON.parse(getItemLocalStorage("userLogin"))
    const [companyDetail, setCompanyDetails] = useState({})
    const [userList, setUserList] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [companySettingData, setCompanySettingData] = useState({});
    const [noCompanyset, setNoCompanyset] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [isEditManage, setIsEditManage] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [role, setRole] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [page, setPage] = useState(1);

    const [segments, setSegments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [properties, setProperties] = useState([]);
    const [companyName, setCompanyName] = useState("");


    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // const [totalRecords, setTotalRecords] = useState(0);
    const [company_count, setCompany_count] = useState(0);

    const [user_count, setUser_count] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    // const [reasonType, setReasonType] = useState({
    //     reason: '',
    //     message: ''
    // })



    // const reasonsOption = [
    //     { value: "maintenance-repairs", label: "Maintenance/Repairs" },
    //     { value: "renovation", label: "Renovation" },
    //     { value: "seasonal-closure", label: "Seasonal closure" },
    //     { value: "property-damage", label: "Property damage" },
    //     { value: "contract-ended", label: "Contract ended" },
    //     { value: "other", label: "Other" },
    // ]

    const isCompanyInactive =
        companyDetail?.company_setting?.is_parmanently_inactive ?? false;


    const gender = [
        { id: 1, label: "Male", icon: "../images/icons/male.svg" },
        { id: 2, label: "Female", icon: "../images/icons/Genders.svg" },

    ];
    const currencyOption = [
        { value: "INR", label: "INR, ₹" },
        { value: "USD", label: "USD, $" },
        { value: "EURO", label: "EURO, € " },
    ];


    const toggleGenderDropdown = () => setIsGenderOpen((prev) => !prev);

    const handleSelectGender = (label) => {
        setSelectedGender(label);
    };

    const handleClearGender = () => setSelectedGender(null);

    const handleDoneGender = () => setIsGenderOpen(false);



    const toggleDropdown = () => setIsOpen((prev) => !prev);




    const handleRoleSelect = (role) => {
        setSelectedRoles((prev) =>
            prev.includes(role)
                ? prev.filter((r) => r !== role)
                : [...prev, role]
        );
    };



    const assignments = [
        {
            name: 'CasaMelhor Areca',
            extra: 'Exotica',
            address: 'Flat No. 17, 17th Floor, near NRI apartments, Seawoods, Sector 58A, Navi Mumbai, Maharashtra, 400706',
            dates: 'From Sun, 3 Aug 2025 to Thu, 7 Aug, 2025',
            admin: 'Casa Melhor Admin',
            email: 'casamelhoradmin@casamelhor.in'
        },
        {
            name: 'CasaMelhor Palm',
            extra: 'Retreat',
            address: 'Palm Street, Sector 12, Pune, Maharashtra, 411001',
            dates: 'From Mon, 10 Aug 2025 to Fri, 14 Aug, 2025',
            admin: 'Casa Melhor Admin',
            email: 'admin@casamelhor.in'
        },
        // Add more objects as needed
    ];

    // 

    // const deptOptions = [
    //     "Administrator",
    //     "Finance",
    //     "HR",
    //     "Sales & Marketing",
    //     "Support",
    // ];

    const [search, setSearch] = useState("");
    const [selectedSegment, setSelectedSegment] = useState([]);

    const toggleDropdown1 = () => setOpen(!open);

    const handleSegmentDep = (option) => {
        if (selectedSegment.includes(option)) {
            setSelectedSegment(selectedSegment.filter((item) => item !== option));
        } else {
            setSelectedSegment([...selectedSegment, option]);
        }
        // setOpen(false); // Add this line to close dropdown after selection
    };

    const handleRemove = (option) => {
        setSelectedSegment(selectedSegment.filter((item) => item !== option));
    };    // 


    const handleOptionKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === "Tab") && search.trim()) {
            e.preventDefault();
            setSelectedSegment([...selectedSegment, search.trim()]);
            setSearch("");
        }
    };

    const [searchDesignation, setSearchDesignation] = useState("");
    const [selectedDesignation, setSelectedDesignation] = useState([]);

    // const handleDesignation = (e) => {
    //     if ((e.key === "Enter" || e.key === "Tab") && searchDesignation.trim()) {
    //         e.preventDefault();
    //         setSelectedDesignation([...selectedDesignation, searchDesignation.trim()]);
    //         setSearchDesignation("");
    //     }
    // }
    // const handleRemoveDesignation = (option) => {
    //     setSelectedDesignation(selectedDesignation.filter((item) => item !== option));
    // };


    const handleDesignation = (valueOrEvent) => {
        //  If fired from dropdown click
        if (typeof valueOrEvent === "string") {
            setSelectedDesignation((prev) => [...prev, valueOrEvent]);
            return;
        }
        // If fired from keyboard
        if (
            (valueOrEvent.key === "Enter" || valueOrEvent.key === "Tab") &&
            searchDesignation.trim()
        ) {
            valueOrEvent.preventDefault();
            setSelectedDesignation((prev) => [...prev, searchDesignation.trim()]);
            setSearchDesignation("");
        }
    };



    const handleRemoveDesignation = (option) => {

        setSelectedDesignation((prev) => prev.filter((item) => item !== option));

    };

    const [searchLocation, setSearchLocation] = useState("");
    const [selectedLocation, setSelectedLocation] = useState([]);

    const handleLocation = (e) => {
        if ((e.key === "Enter" || e.key === "Tab") && searchLocation.trim()) {
            e.preventDefault();
            setSelectedLocation([...selectedLocation, searchLocation.trim()]);
            setSearchLocation("");
        }
    }
    const handleRemoveLocation = (option) => {
        setSelectedLocation(selectedLocation.filter((item) => item !== option));
    };

    const [isOpen, setIsOpen] = useState(false);



    const handleOptionClick = () => {
        setIsOpen(false); // hide menu when option is clicked
    };


    //   drag drop upload

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(URL.createObjectURL(uploadedFile));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile) {
            setFile(URL.createObjectURL(uploadedFile));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeFile = () => {
        setFile(null);
    };


    // 

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



    // const reasonsOption = [
    //     { value: "reason1", label: "Reason 1" },
    //     { value: "reason1", label: "Reason 2" },
    // ]





    const department = [
        { value: "Sales-Marketing", label: "Sales & Marketing" },
        { value: "Administrator", label: "Administrator" },
    ]

    const sortoption = [
        { value: "most_trips", label: "Most Trips" },
        { value: "less_trips", label: "Less Trips" }
    ]




    const [openPicIndex, setOpenPicIndex] = useState(null);

    const togglePicOption1 = (e, idx) => {
        e.preventDefault();
        setOpenPicIndex(openPicIndex === idx ? null : idx);
        if (typeof toggleoptio1 === 'function') {
            toggleoptio1();
        }
    }



    const handleSortBy = (e) => {
        if (e.value == "Name") {
        } else {
            setSearchUser(loginData?.uid)
        }
    }






    const [inactiveFrom, setInactiveFrom] = useState(null);
    const [inactiveTo, setInactiveTo] = useState(null);
    const [permanent, setPermanent] = useState(false);

    const [show, compsetShow] = useState(false);

    const cmppremodClose = () => compsetShow(false);
    const cmppremodShow = () => compsetShow(true);

    const [compnayShow, compstatussetShow] = useState(false);

    const compnayStatusClose = () => compstatussetShow(false);
    const compnayStatusShow = () => compstatussetShow(true);



    const [compnayremoShow, compremovesetShow] = useState(false);

    const compnayRemoveClose = () => compremovesetShow(false);
    const compnayRemoveShow = () => compremovesetShow(true);



    const [assignmentremoShow, assignmentremovesetShow] = useState(false);

    const assignmentRemoveClose = () => assignmentremovesetShow(false);
    const assignmentRemoveShow = (Values) => {
        assignmentremovesetShow(true);
        setProperty(Values)
    }
    const [property, setProperty] = useState({});




    const [filtermShow, filtersetShow] = useState(false);

    const filterClose = () => filtersetShow(false);
    const filterShow = () => filtersetShow(true);





    const [showsProfile, profilesetShow] = useState(false);
    const [userId, setUserId] = useState()
    const [userCompany, setUserCompany] = useState({});

    const profileClose = () => profilesetShow(false);

    const [externalshowsProfile, externalprofilesetShow] = useState(false);
    const externalprofileClose = () => externalprofilesetShow(false);
    const externalshowProfile = () => externalprofilesetShow(true);
    const [editsemploye, editemployesetShow] = useState(false);
    const employeClose = () => editemployesetShow(false);
    const editemploye = () => editemployesetShow(true);
    const [deletespicModal, deletepicsetShow] = useState(false);

    const deletepicClose = () => deletepicsetShow(false);
    const deletepicModal = () => deletepicsetShow(true);

    const [changepicsModal, changepisetShow] = useState(false);
    // const changepicClose = () =>

    const changepicClose = () => {
        changepisetShow(false);
        editemployesetShow(false);
    }
    const changepicModal = () => changepisetShow(true);
    const [addTravels, addTravelsetShow] = useState(false);

    const removeTravel = () => addTravelsetShow(false);
    const addTravel = () => addTravelsetShow(true);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const showProfile = (val) => {
        profilesetShow(true);
        setUserId(val?.uid)
        const updatedField = val?.user_company;
        delete updatedField.id;
        delete updatedField.uid;
        delete updatedField.company_name;
        setUserCompany(updatedField)
    }

    const getcompanyDetail = async () => {
        try {
            const response = await companyDetailAPI(id);
            if (response?.data?.success) {
                setCompanyDetails(response?.data?.response)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getcompanyUserList = async () => {
        try {
            const filterRoles = selectedRoles.join(",");
            const filterSegment = selectedSegment.join(",");
            const filterdesignation = selectedDesignation.join(",");
            const filterLocation = selectedLocation.join(",");
            const response = await CompanyuserListAPI(id, searchUser, filterRoles, filterSegment, filterdesignation, selectedGender, filterLocation, currentPage, sortBy);
            if (response?.data?.success) {

                // setCompany_count(response.data.response.length);
                //  setUser_count(response.data.response.length);
                setUserList(response?.data?.response)
                setUser_count(response?.data?.user_count);
                setCompany_count(response?.data?.company_count);
                setTotalPages(response.data.total_page)

                setIsOpen(false);
                setOpen(false);
                filterClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClearAllFields = () => {
        setSelectedRoles([]);
        setSelectedSegment([]);
        setSelectedDesignation([]);
        setSelectedLocation([])
        setSelectedGender([])
    }

    // dynamic pagenationa 
    // const start = (currentPage - 1) * pageSize + 1;
    // const end = Math.min(currentPage * pageSize, company_count);

    const start = companyList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const end = Math.min(currentPage * pageSize, user_count);

    const getCompanyUserDetails = async () => {
        try {
            setIsLoading(true)
            // const response = await CompanyuserDetailAPI(id, userId)
            const response = await UserDetailAPI(userId)
            if (response?.data?.success) {
                setUserDetails(response.data.response);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
        }
    }
    const userListData = async () => {
        try {
            const response = await UserRoleListAPI(loginData?.uid);
            if (response?.data?.success) {
                setRole(response?.data?.response?.map((Val) => ({
                    value: Val?.uid,
                    label: Val?.role_name,
                    icon: Val?.role_icon
                })))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getCompanySettingData = async () => {
        try {
            setIsLoading(true)
            const response = await CompanySettingDetailAPI(id)
            if (response?.data?.success) {
                setCompanySettingData(response.data.response)
            }
        } catch (error) {
            console.log(error);
            setNoCompanyset(error?.response?.data?.response)
        }
    }

    // const getCompanyList = async () => {
    //     try {
    //         const response = await companyListAPI(searchKey, page);
    //         if (response?.data?.success) {
    //             setCompanyList(response?.data?.response?.map((Val) => ({
    //                 value: Val?.uid,
    //                 label: Val?.company_name
    //             })))
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const getCompanyList = async () => {

        try {

            const response = await companyListAPI(searchKey, page);

            if (response?.data?.success) {

                const list = response?.data?.response?.filter(item => !item?.is_company_inactive)?.map((Val) => ({

                    value: Val?.uid,

                    label: Val?.company_name

                }));



                setCompanyList(list);

                //  Default select company "Casamelhor"

                const defaultCompany = list.find(c => c.label === "Casamelhor");

                if (defaultCompany) {

                    setSelectedCompanies([defaultCompany.label]); // assuming you store labels in selectedCompanies

                    fetchDept(defaultCompany.value);

                }

            }



        } catch (error) {

            console.log(error);

        }

    };

    const [hasMore, setHasMore] = useState(true);

    const loadMoreCompanies = async () => {
        try {
            const nextPage = page + 1;

            const response = await companyListAPI(searchKey, nextPage);

            if (response?.data?.success) {

                const list = response?.data?.response?.map((Val) => ({
                    value: Val?.uid,
                    label: Val?.company_name
                }));

                // Append new data
                setCompanyList(prev => [...prev, ...list]);

                setPage(nextPage);

                // If less than 10 returned → no more data
                if (list.length < 10) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };




    // DeptDesignationAPI
    const getDeptDesignationList = async () => {
        try {
            const response = await DeptDesignationAPI(id);
            if (response?.data?.success) {
                setSegments(response.data.response.segments);
                setDesignations(response.data.response.designations);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAssignPropertiesList = async () => {
        try {
            const response = await AssignPropertiesToCompanyAPI(id);
            if (response?.data?.success) {
                //  alert_success("Assigned sccessfully")
                setProperties(response.data.response.company_assignment)
                setCompanyName(response.data.response.company_name);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (id) {
            getDeptDesignationList();
            getAssignPropertiesList()
        }
    }, [id]);


    useEffect(() => {
        getcompanyDetail();
        getcompanyUserList();
        userListData();
        getCompanySettingData();
        getCompanyList()
    }, []);

    useEffect(() => {
        getcompanyUserList()
    }, [currentPage, searchUser, sortBy])
    useEffect(() => {
        getCompanyUserDetails()
    }, [userId])
    useEffect(() => {
        if (searchKey) getCompanyList()
    }, [searchKey])

    // const handleRemoveAssignment = async () => {
    //     try {
    //         await RemovePropertyAssignmentApi(property?.uid);

    //         const payload = {
    //             property_status: "Active",
    //             inactive_from: null,
    //             assigned_companies: [],
    //             inactive_to: null,
    //             inactive_reason: null,
    //             inactive_notes: "",
    //             is_permanently_inactive: false
    //         };


    //         const response = await PropertyStatusUpdateApi(property?.assigned_property?.uid, payload);
    //         if (response.data.success) {
    //             alert_success("Assignment removed & status set to Active!");
    //             getAssignPropertiesList();
    //             assignmentRemoveClose()
    //         } else {
    //             console.log(response?.data?.response?.property_status?.[0]);

    //             // alert_danger(response?.data?.response?.property_status?.[0])
    //             assignmentRemoveClose()
    //         }
    //         // await PropertyStatusUpdateApi(property?.assigned_property?.uid, payload);

    //         // alert_success("Assignment removed & status set to Active!");
    //         // getAssignPropertiesList();

    //     } catch (err) {
    //         // alert_danger("Failed to remove assignment!");
    //         console.log("Failed to remove assignment!");

    //     }
    // };

    // const handleRemoveCompany=async()=>{
    //     try {
    //         debugger
    //         // const response = await
    //     } catch (error) {
    //         console.log(error);            
    //     }
    // }


    const handleRemoveAssignment = async () => {
        try {
            const removeResponse = await RemovePropertyAssignmentApi(property?.uid);

            if (!removeResponse?.data?.success) {
                // alert_danger(response?.data?.response?.property_status?.[0]);
                const errorMessages = showErrorMsg(response?.data?.response);
                toast.error(errorMessages)
                return;
            }

            const payload = {
                property_status: "Active",
                inactive_from: null,
                inactive_to: null,
                inactive_reason: null,
                inactive_notes: "",
                assigned_companies: [],
                is_permanently_inactive: false
            };

            const statusResponse = await PropertyStatusUpdateApi(
                property?.assigned_property?.uid,
                payload
            );

            if (statusResponse?.data?.success) {
                toast.success("Removed property from company");
                getAssignPropertiesList();
                assignmentRemoveClose();
            } else {
                // alert_danger(
                //     statusResponse?.data?.response?.property_status?.[0] ||
                //     "Failed to update property status"
                // );
                const errorRes = showErrorMsg(response?.data?.response)
                toast.error(errorRes)
                assignmentRemoveClose();
            }

        } catch (error) {
            console.error("Error while removing assignment:", error);
            toast.error("Something went wrong while updating property status!");
        }
    };



    // const handleRemoveCompany = async () => {
    //     try {
    //         const payload = {
    //             removal_date: new Date().toISOString().split('T')[0],
    //             reason: reasonType.reason,
    //             confirmation_text: "REMOVE COMPANY",
    //             reason_text: reasonType.message,
    //             data_retention_policy: "archive_7_years",
    //             notify_stakeholders: true
    //         };

    //         const response = await RemoveCompanyAPI(id, payload);

    //         if (response?.data?.success) {
    //             toast.success(response?.data?.message || 'Company removed successfully');
    //             compnayRemoveClose();
    //         }else{
    //             toast.error(showErrorMsg(response.data.response))
    //         }
    //     } catch (error) {
    //         error?.response?.data?.message || 'Something went wrong while removing company'
    //         console.error('Remove company error:', error);
    //     }
    // };


    console.log(companyDetail)

    const totalSelectedFilters =
        selectedRoles.length +
        selectedSegment.length +
        selectedDesignation.length +
        selectedGender.length;
    console.log(companyDetail)
    console.log(properties)


    const getCoverPhotoUrl = (assignment) => {
        const photos = assignment?.assigned_property?.property_photos;

        if (!Array.isArray(photos)) return null;

        const coverPhoto = photos.find(
            (photo) => photo.is_property_cover_photo === true
        );

        return coverPhoto
            ? `${coverPhoto.property_photo_url}`
            : null;
    };

    const setCompanyStatus = () => {
        if (companyDetail?.is_permanently_inactive) {
            return companyDetail?.company_status
        } else if (companyDetail?.is_scheduled_inactive) {
            return "Inactive"
        } else {
            return "Active"
        }
    }



    return (
        <ProtectedRoute>
            <Header />
            <Toaster position="top-right" />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>
                                {/* <li><a href=''>Home</a></li> */}
                                <li><Link href='/AllCompany'>Company</Link></li>
                                <li>{companyDetail?.company_name} <Image src="../images/icons/bottom-arrow.svg" className='img-fluid ms-2' alt='bot-arrow' width={10} height={10} /> </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='page-body  pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <Link href="/AllCompany" className='back-page'>
                                <Image src='../images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={12} className=' mb-4' >
                            <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
                                <h2 className='page-title'>{companyDetail?.company_name} Details</h2>

                                <div className='d-flex align-items-center gap-3'>
                                    {canListBooking && <Link href={`/Bookings?company_uid=${companyDetail?.id}`} className='btn-company-edit btn-light-transparent btn-white-transparent '> Bookings <Image src="../images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='booking' /> </Link>}
                                    {/* <Link href="/Calendar" className='btn-company-delete btn-light-transparent btn-white-transparent'> Calendar <Image src="../images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='calendor' /></Link>
                                    <Link href='javascriptvoid:(0)' onClick={cmppremodShow} className='btn-company-delete btn-light-transparent'>  <Image src="../images/icons/settings.svg" className='img-fluid' width={25} height={25} alt='setting' />  Edit Company Preferences </Link> */}
                                    <Link href={`/Calendar?company_uid=${companyDetail?.id}`} className='btn-company-delete btn-light-transparent btn-white-transparent'> Calendar <Image src="../images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='calendor' /></Link>
                                    <Link href={`/company/reporting?uid=${id}`} className='btn-company-delete btn-light-transparent btn-white-transparent'> Reporting <Image src="../images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='reporting' /></Link>
                                    <Link href='javascriptvoid:(0)' onClick={cmppremodShow} className='btn-company-delete btn-light-transparent'>  <Image src="../images/icons/settings.svg" className='img-fluid' width={25} height={25} alt='setting' />  Edit Company Preferences </Link>
                                </div>
                            </div>
                        </Col>
                        <Col md={12} >
                            <Tabs
                                defaultActiveKey="company"
                                id="uncontrolled-tab-example"
                                className="mb-5 mt-3 compnay-detail-tabs"
                            >
                                <Tab eventKey="company" title="Company">
                                    {isEditManage ? (
                                        <EditCompany editData={companyDetail} setIsEditManage={setIsEditManage} getcompanyDetail={getcompanyDetail} />
                                    ) : (
                                        <Row>
                                            <Col md={6}>
                                                <div className='d-flex align-items-start justify-content-between mb-5'>
                                                    <div className='general-info'>
                                                        <h2 className='page-title'> General information</h2>
                                                        <p className='mb-0'>Change or edit all company related general information from here</p>
                                                    </div>
                                                    {canUpdate && <Link href="#" className='edit-company-btn' style={{ color: '#463527', textDecoration: 'none' }} onClick={() => setIsEditManage(true)} > Manage </Link>}

                                                </div>
                                                <div className='comapny-information-box '>
                                                    <h4 className='mb-4'>Company</h4>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Company Name  </span> <br></br>
                                                        <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.company_name} </span></p>                                                    

                                                </div>
                                                <div className='comapny-information-box '>
                                                    <h4 className='mb-4'>Address</h4>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Headoffice address  </span> <br></br>
                                                        {/* <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > 4V8R+FCC, Off, Saki Vihar Rd, Tunga Village, Chandivali, Powai, Powai, Mumbai, 400072 </span></p> */}
                                                        {/* <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >{companyDetail?.house_no}, {companyDetail?.street_and_number},{companyDetail?.head_office_location},{companyDetail?.head_office_city},{companyDetail?.head_office_state}-{companyDetail?.head_office_pin_code} </span> */}
                                                        <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }}>
                                                            {[
                                                                companyDetail?.house_no,
                                                                companyDetail?.street_and_number,
                                                                companyDetail?.head_office_city,
                                                                companyDetail?.head_office_state,
                                                                companyDetail?.head_office_pin_code,
                                                            ]
                                                                .filter(part => part != null && String(part).trim() !== '')
                                                                .join(', ')}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className='comapny-information-box '>
                                                    <h4 className='mb-4'>Contacts</h4>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Name  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.c_first_name} {companyDetail?.c_last_name} </span></p>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Position </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.position} </span></p>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >E-mail address  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >  {companyDetail?.company_email}  </span></p>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Phone number  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.phone_number}</span></p>
                                                </div>
                                                <div className='comapny-information-box '>
                                                    <h4 className='mb-4'>Legal entity details</h4>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >GST Number  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.gst_number} </span></p>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Legal entity name </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {companyDetail?.legal_entity_name} </span></p>
                                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Contract currency </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {currencyOption.find((val) => val.value == companyDetail?.contract_currency)?.label}</span></p>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                </Tab>
                                {canListUser && (
                                    <Tab eventKey="directories" title="Directories">
                                        <Row>
                                            <Col md={12}>
                                                <div className='d-flex align-items-center justify-content-between mb-4'>
                                                    <div className='general-info'>
                                                        <h2 className='page-title'> Employee Directories</h2>
                                                    </div>
                                                    {canAddUser && <Link href="#" onClick={addTravel} className='btn-company-add '  > <span style={{ fontSize: '24px' }}> + </span>  Add Traveler </Link>}
                                                </div>
                                            </Col>
                                            <Col md={12}>
                                                <div className='search-box mb-5'>
                                                    <input type='text' onChange={(e) => setSearchUser(e.target.value)} placeholder='Search for travelers' className='form-control' />
                                                    <button className='btn btn-search' onClick={getcompanyUserList}>
                                                        <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
                                                    </button>
                                                </div>
                                            </Col>
                                            <Col md={12} >
                                                <div className='d-flex justify-content-between align-items-center mb-4 pt-3'>
                                                    <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
                                                        <p className='mb-0 d-flex gap-2  align-items-center'> <Image src='../images/icons/group-user.svg' className='img-fluid' alt='user' width={24} height={24} /> {userList?.length}  </p>
                                                        <div className='role-select'>
                                                            {/* <Select
                                                            name="aria-role-select"
                                                            options={role}
                                                            placeholder="Role"
                                                            className="react_selectbox"
                                                            isSearchable={false}
                                                            styles={customStyles}
                                                        /> */}
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={toggleDropdown}
                                                                    className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
                                                                >
                                                                    Role
                                                                    <Image src="../images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
                                                                    {selectedRoles.length > 0 && (
                                                                        <span className="selected-item">{selectedRoles.length}</span>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            {isOpen && (
                                                                <div className="absolute mt-2 w-64 border z-10" style={{
                                                                    background: '#F2F2F2', maxWidth: '317px', width: '100%'
                                                                }} >
                                                                    {/* Role Options */}
                                                                    <ul className="space-y-3 p-3 mb-0">
                                                                        {role.map((role) => (
                                                                            <li
                                                                                key={role.id}
                                                                                onClick={() => handleRoleSelect(role.label)}
                                                                                className={` gap-2 px-3 py-2 user-role-list  rounded-full cursor-pointer ${selectedRoles.includes(role.label)
                                                                                    ? "select-grey"
                                                                                    : "hover:bg-gray-100"
                                                                                    }`}
                                                                            >
                                                                                {/* Placeholder Icon */}
                                                                                <span className="text-gray-600"><Image src={role.icon} className='img-fluid' alt='role' width={20} height={20} /> </span>
                                                                                <span>{role.label}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>

                                                                    {/* Actions */}
                                                                    <div className="flex justify-between items-center border-top p-3">
                                                                        <button
                                                                            onClick={() => setSelectedRoles([])}
                                                                            className="text-gray-500 text-sm hover:underline"
                                                                        >
                                                                            Clear all
                                                                        </button>
                                                                        <button
                                                                            onClick={getcompanyUserList}
                                                                            className="bg-green-700 text-white rounded-md" style={{ padding: "12px 16px" }}
                                                                        >
                                                                            Done
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div>
                                                        <div className='role-select'>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={toggleDropdown1}
                                                                    className="selected-list-border w-full position-relative border border-gray-300 role-btn rounded-md px-3 gap-3 py-2 flex justify-between items-center"
                                                                >
                                                                    <span className="text-gray-700">Dept./Segment</span>
                                                                    <Image src="../images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
                                                                    {selectedSegment.length > 0 && (
                                                                        <span className="selected-item">{selectedSegment.length}</span>
                                                                    )}

                                                                </button>

                                                                {open && (
                                                                    <div className="searching-filter absolute mt-2 w-64 border z-10" style={{
                                                                        background: '#F2F2F2', maxWidth: '317px', width: '100%'
                                                                    }} >
                                                                        <div className='p-3 position-relative' style={{ minHeight: '300px' }} >
                                                                            {/* Search */}
                                                                            <div className="flex items-center border-bottom mb-2 px-2 py-2 position-relative">
                                                                                <Image src='../images/icons/search.svg' className='img-fluid mr-2' alt='search' width={16} height={16} />
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Search"
                                                                                    className="flex-1 outline-none text-sm"
                                                                                    value={search}
                                                                                    onChange={(e) => setSearch(e.target.value)}
                                                                                />
                                                                            </div>

                                                                            <div className="option-list max-h-40 overflow-y-auto ">
                                                                                {search.trim() !== "" &&
                                                                                    segments
                                                                                        .filter((opt) =>
                                                                                            opt.toLowerCase().includes(search.toLowerCase())
                                                                                        )
                                                                                        .map((opt) => (
                                                                                            <div
                                                                                                key={opt}
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    handleSegmentDep(opt); // This will now close the dropdown
                                                                                                    setSearch("");   // clear search field
                                                                                                }}
                                                                                                className={`px-3 py-1 data-option cursor-pointer text-sm ${selectedSegment.includes(opt)
                                                                                                    ? "bg-gray-200 font-medium"
                                                                                                    : "hover:bg-gray-100"
                                                                                                    }`}
                                                                                            >
                                                                                                {opt}
                                                                                            </div>
                                                                                        ))}
                                                                            </div>

                                                                            {/* Selected tags */}
                                                                            <div className="flex flex-wrap gap-2 px-2 py-2">
                                                                                {selectedSegment.map((item) => (
                                                                                    <div
                                                                                        key={item}
                                                                                        className="selected-badge flex items-center bg-gray-100 px-3 gap-2 py-1 rounded-md text-sm"
                                                                                    >
                                                                                        {item}
                                                                                        <button
                                                                                            onClick={() => handleRemove(item)}
                                                                                            className="ml-1 text-gray-500 hover:text-black"
                                                                                        >
                                                                                            <Image src="../images/icons/x-circle.svg" alt='close' width={20} height={20} />
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>

                                                                        {/* Footer */}
                                                                        <div className="border-top flex justify-between items-center p-3">
                                                                            <button
                                                                                onClick={() => setSelectedSegment([])}
                                                                                className="text-sm text-gray-500 hover:text-black"
                                                                            >
                                                                                Clear all
                                                                            </button>
                                                                            <button
                                                                                onClick={getcompanyUserList} // This closes the dropdown
                                                                                className="bg-green-700 text-white rounded-md text-sm"
                                                                                style={{ padding: '12px 26px' }}
                                                                            >
                                                                                Done
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <Button variant="" className='btn-filter position-relative selected-list-border' onClick={filterShow} >
                                                            {totalSelectedFilters > 0 && (
                                                                <span className="selected-item">{totalSelectedFilters}</span>
                                                            )}
                                                            <Image src='../images/icons/filter.svg' className='img-fluid' width={24} height={24} alt='filter' />
                                                        </Button>


                                                    </div>


                                                    <div className='filter-right-option d-flex gap-3'>
                                                        <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                                                            <p className='mb-0'>
                                                                {user_count > 0
                                                                    ? `${start}-${end} of ${user_count}`
                                                                    : "0 results"}
                                                            </p>

                                                            <Image
                                                                src='../images/icons/back.svg'
                                                                className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
                                                                alt='back'
                                                                width={10}
                                                                height={10}
                                                                onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                                                                style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}

                                                            />


                                                            <Image
                                                                src='../images/icons/Arrows-right.svg'
                                                                className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
                                                                alt='right'
                                                                width={29}
                                                                height={29}
                                                                onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                                                                style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                                            />

                                                        </div>

                                                        <Button variant="" className='btn-sort'> Sort by :
                                                            <Select
                                                                name="aria-role-select"
                                                                options={sortoption}
                                                                placeholder="Name"
                                                                className="react_selectbox"
                                                                isSearchable={false}
                                                                styles={customStyles}
                                                                onChange={(e) => setSortBy(e.value)}
                                                            />

                                                        </Button>

                                                    </div>

                                                </div>

                                                <Table className='company-table' responsive>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '30%' }} >Employee</th>
                                                            <th style={{ width: '20%' }} >Employee ID</th>
                                                            <th style={{ width: '20%' }} >Dept./Segment</th>
                                                            <th style={{ width: '20%' }}>Number of trips</th>

                                                            <th style={{ width: '10%', textAlign: 'right' }} >
                                                                <Image src='../images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {userList.map((Val, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className='d-flex align-items-center gap-3'>
                                                                        {/* <Image src={`https://alicedevapi.casamelhor.in${Val?.user_role?.role_icon}` || "/images/icons/user-long.svg"} width={56} height={104} className='img-fluid ' alt='User' /> */}
                                                                        <Image
                                                                            src={Val?.profile_image ? Val?.profile_image : "/images/icons/No-Image.svg"}
                                                                            width={56}
                                                                            height={104}
                                                                            className="img-fluid"
                                                                            alt="User"
                                                                            style={{ objectFit: "cover", height: "104px" }}
                                                                        />
                                                                        <p className='mb-0'>
                                                                            <small>Company Employee</small> <br></br>
                                                                            <span style={{ fontWeight: '500' }} > {Val?.first_name} {Val?.last_name} </span>
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center gap-2'>{Val?.employee_id ? Val?.employee_id : "-"}</div>

                                                                </td>
                                                                <td>{Val?.segment ? Val?.segment : "-"}</td>
                                                                <td>{Val?.number_of_trips ? Val?.number_of_trips : 0}</td>

                                                                <td>
                                                                    {canRetrieveUser && (
                                                                        <Button variant="" onClick={() => showProfile(Val)} className='btn-light-action mb-2'  > View Full Profile</Button>
                                                                    )}
                                                                    {canRetrieveUser && (
                                                                        <Link href={`/Bookings?guest_uid=${Val?.uid}`} className='btn-table-action gap-2'>
                                                                            View Trips <Image src='../images/icons/open_in_new.svg' className='img-fluid' alt='open-new-tab' width={20} height={20} />
                                                                        </Link>
                                                                    )}
                                                                </td>
                                                            </tr>

                                                        ))}

                                                    </tbody>
                                                </Table>
                                            </Col>

                                        </Row>
                                    </Tab>
                                )}
                                {canListProperty && (
                                    <Tab eventKey="properties" title="Properties" >
                                        <Row>
                                            <Col md={12}>
                                                <div className='d-flex align-items-center justify-content-between mb-4'>
                                                    <div className='general-info'>
                                                        <h2 className='page-title'> Properties List</h2>

                                                    </div>

                                                    {canAddAssignProperty && (
                                                        <Link
                                                            href={
                                                                !isCompanyInactive
                                                                    ? {
                                                                        pathname: "/AssignProperty",
                                                                        query: {
                                                                            uid: id,
                                                                            company_name: companyName,
                                                                        },
                                                                    }
                                                                    : "#"
                                                            }
                                                            className="btn-company-add"
                                                            onClick={(e) => {
                                                                if (isCompanyInactive) e.preventDefault();
                                                            }}
                                                            style={{
                                                                pointerEvents: isCompanyInactive ? "none" : "auto",
                                                                opacity: isCompanyInactive ? 0.5 : 1,
                                                                cursor: isCompanyInactive ? "not-allowed" : "pointer",
                                                            }}
                                                            title={
                                                                isCompanyInactive
                                                                    ? "Company is permanently inactive"
                                                                    : ""
                                                            }
                                                        >
                                                            <span style={{ fontSize: "24px" }}> + </span> Assign Property
                                                        </Link>
                                                    )}


                                                </div>
                                            </Col>
                                            <Col md={12}>
                                                <div className='search-box mb-5'>
                                                    <input type='text' placeholder='Search by company name, or location' className='form-control' />
                                                    <button className='btn btn-search'>
                                                        <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
                                                    </button>
                                                </div>
                                            </Col>

                                            <Col md={12} >
                                                <div className='d-flex justify-content-between align-items-center mb-4'>
                                                    <p className='mb-0'> <strong>
                                                        {properties?.filter((assignment) => {
                                                            const today = new Date();
                                                            const fromDate = new Date(assignment.date_from);
                                                            const toDate = new Date(assignment.date_to);
                                                            return (
                                                                assignment?.property_assignment_status === "Active"
                                                                &&
                                                                today >= fromDate &&
                                                                today <= toDate
                                                            )
                                                        })?.length}
                                                    </strong>  Properties</p>
                                                </div>

                                                <Table className='company-table' >
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '25%' }} >BR Name</th>
                                                            <th style={{ width: '20%' }} >BR Address</th>
                                                            <th style={{ width: '20%' }} >Assigned dates</th>
                                                            <th style={{ width: '15%' }}>Assigned by</th>



                                                            <th style={{ textAlign: 'right' }} width="20%" >
                                                                <Image src='../images/icons/settings.svg' className='ms-auto me-0' width={16} height={16} alt='Sort' />
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* {properties?.map((assignment, idx) => ( */}
                                                        {properties
                                                            ?.filter((assignment) => {
                                                                const today = new Date();
                                                                const fromDate = new Date(assignment.date_from);
                                                                const toDate = new Date(assignment.date_to);

                                                                return (
                                                                    assignment?.property_assignment_status === "Active"
                                                                    &&
                                                                    today >= fromDate &&
                                                                    today <= toDate
                                                                )
                                                            })
                                                            ?.map((assignment, idx) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <div className='d-flex align-items-center gap-3'>
                                                                            {/* <Image src={assignment.cover_photo_url ? assignment.cover_photo_url : "/images/icons/No-Image.svg"} */}
                                                                            <Image src={
                                                                                getCoverPhotoUrl(assignment)
                                                                                    ? getCoverPhotoUrl(assignment)
                                                                                    : "/images/icons/No-Image.svg"
                                                                            }
                                                                                width={58} height={58} style={{ height: '104px', objectFit: 'cover' }} className='img-fluid ' alt='User' />
                                                                            <span style={{ fontWeight: '500' }}> {assignment?.assigned_property?.property_name} <br></br>{assignment?.assigned_property?.street_number} </span>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {assignment?.assigned_property?.flat_house_no}, {assignment?.assigned_property?.address_search_text}, {assignment?.assigned_property?.city}, {assignment?.assigned_property?.state}, {assignment?.assigned_property?.pin_code}
                                                                    </td>
                                                                    <td>From {formatDaysDateMonthYear(assignment.date_from)} to {formatDaysDateMonthYear(assignment.date_to)}</td>
                                                                    <td>
                                                                        {assignment?.assigned_by?.first_name}
                                                                        <br></br>
                                                                        {assignment?.assigned_by?.email}
                                                                    </td>
                                                                    <td>
                                                                        <div className='bt-abs position-relative'>
                                                                            <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                                                <Image src='../images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                                            </Link>
                                                                            <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>
                                                                                {canUpdateAssignProperty && (
                                                                                    <li><Link href={`/EditAssignPropertyCompany/${assignment?.uid}`} onClick={() => { localStorage.setItem("propertyUid", assignment?.assigned_property?.uid) }}>Change Date</Link></li>)}
                                                                                {canDeleteProperty && (
                                                                                    <li>
                                                                                        <Link href='#' onClick={() => assignmentRemoveShow(assignment)} className={`event-remove ${openPicIndex === idx ? "show" : "hide"}`}>Remove Properties</Link>
                                                                                    </li>
                                                                                )}
                                                                                {canRetrieveProperty && (
                                                                                    <li><Link className='d-flex gap-2' href={`/propertyDetails?uid=${assignment?.assigned_property?.uid}`}
                                                                                    >View BR Details <Image src='../images/icons/open_in_new.svg' className='img-fluid' width={24} height={24} alt='open' /> </Link></li>
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Tab>
                                )}
                                {/* integration: alice_v3_claude — w7 — Integrations tab */}
                                {canListIntegration && (
                                    <Tab eventKey="integrations" title="Integrations">
                                        <CompanyIntegrationsTab companyId={companyDetail?.id} />
                                    </Tab>
                                )}
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* compnay prefrence modal */}


            <Modal show={show} onHide={cmppremodClose} animation={false} centered className='custom-theme-modal' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >
                    <Modal.Title>Edit company preferences</Modal.Title>
                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={cmppremodClose} />
                </Modal.Header>
                <Modal.Body className='pt-0'>
                    {canRetrieveSetting && (
                        <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
                            <div className=''>
                                <p className='font-18 mb-0'> User onboarding questions</p>
                                <p className='mb-0'> Questions that we ask guest when they book a stay.</p>
                            </div>
                            <Link href={`/UserOnboardQuestion/${id}`} className='' style={{
                                background: 'transparent', color: '#463527', border: 'none', padding: '0',
                            }}>
                                <Image src='../images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />
                            </Link>

                        </div>
                    )}

                    {canUpdate && (
                        <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
                            <div className=''>
                                <p className='font-18 mb-0'> Company status</p>
                                <span className='badge ' style={{
                                    background: 'transparent', color: '#E07912', fontWeight: '500', fontSize: '14px', padding: '5px 10px', borderRadius: '4px', textTransform: 'Uppercase'
                                }} > {setCompanyStatus()} </span>
                            </div>
                            <Button variant="" disabled={canUpdate ? false : true} onClick={() => {
                                cmppremodClose();
                                compnayStatusShow();
                            }} className='' style={{
                                background: 'transparent', color: '#463527', border: 'none', padding: '0',
                            }}>
                                <Image src='../images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />

                            </Button>
                        </div>
                    )}

                    {canDelete && (
                        <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
                            <div className=''>
                                <p className='font-18 mb-0'> Remove company </p>
                                <p className='mb-0'> Permanently remove this company from listing</p>
                            </div>

                            <Button variant="" onClick={() => {
                                cmppremodClose();
                                compnayRemoveShow();
                            }} className='' style={{
                                background: 'transparent', color: '#463527', border: 'none', padding: '0',
                            }}>
                                <Image src='../images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />

                            </Button>
                        </div>
                    )}
                    {loginData?.user_role?.role_name === "CasaMelhor Admin" && (
                        <div className='user-question-box d-flex align-items-center justify-content-between gap-3 mb-3 pe-2'>
                            <div className=''>
                                <p className='font-18 mb-0'> Company Config</p>                                
                            </div>
                            <Link href={`/NotificationSettings?comId=${id}`} className='' style={{
                                background: 'transparent', color: '#463527', border: 'none', padding: '0',
                            }}>
                                <Image src='../images/icons/breadcrumb-arrow.svg' width={12} height={12} alt='Info' />
                            </Link>
                        </div>
                    )}
                </Modal.Body>
            </Modal>


            {/* company status modal */}



            <CompnayStatusModel
                compnayShow={compnayShow}
                compnayStatusClose={compnayStatusClose}
                settingData={companyDetail}
                getcompanyDetail={getcompanyDetail}
            />
            {/* company remove */}


            {/* <Modal show={compnayremoShow} onHide={compnayRemoveClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >
                    <Link href='#' className='d-flex align-items-center gap-2' style={{ textDecoration: 'none', color: '#463527', fontWeight: '500' }}
                        onClick={() => {
                            compnayRemoveClose();
                            cmppremodShow();
                        }} >
                        <Image src='../images/icons/back.svg' width={10} height={10} className='img-fluid' alt='back' /> Back
                    </Link>
                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={compnayRemoveClose} />
                </Modal.Header>
                <Modal.Body className='pt-0'>
                    <h2 className='page-title'>Remove this company listing?</h2>
                    <p style={{ color: '#73615F' }}>The company will permanently be removed from the listing</p>


                    <div className='inactive-box remove-company-box company-status-box'>
                        <div className='form-group mb-4'>
                            <label>Reason</label>
                            
                            <Select
                                name="reason"
                                options={reasonsOption}
                                value={reasonsOption.find((opt) => opt.value == reasonType.reason)}
                                placeholder="Select a reason"
                                className="react_selectbox"
                                isSearchable={false}
                                onChange={(e) => setReasonType({ ...reasonType, reason: e.value })}
                                styles={customStyles}
                            />
                        </div>

                        <div className='forom-group mb-4'>
                            <label>Tell why you need to unlist this company</label>
                            <textarea
                                className="form-control textareabox mt-2"
                                onChange={(e) => setReasonType({ ...reasonType, message: e.target.value })}
                                rows={4}
                                placeholder="Add your message here"
                            />
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={compnayRemoveClose}>
                        Cancel
                    </Button>
                    <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={handleRemoveCompany}>
                        Yes, Remove
                    </Button>
                </Modal.Footer>
            </Modal> */}
            <RemoveCompanyModal compnayremoShow={compnayremoShow} cmppremodShow={cmppremodShow} compnayRemoveClose={compnayRemoveClose} companyDetail={companyDetail} />
            {/* Filter modal */}


            {/* <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                    Filters
                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='filter-compnay-details'>
                        <p>Role</p>
                        
                        <ul className="space-y-3 gap-2 ps-0 mb-0">
                            {role.map((role) => (
                                <li
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role.label)}
                                    className={` gap-2 px-3 py-2 user-role-list me-3  rounded-full cursor-pointer ${selectedRoles.includes(role.label)
                                        ? "select-grey"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    
                                    <span className="text-gray-600"><Image src={`https://alicedevapi.casamelhor.in${role.icon}`} className='img-fluid' alt='role' width={20} height={20} /> </span>
                                    <span>{role.label}</span>
                                </li>
                            ))}
                        </ul>
                        <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
                    </div>
                    <div className='filter-compnay-details'>
                        <p>Dept./Segment</p>
                        <div className='search-box '>
                            <input
                                type='text'
                                placeholder='Search '
                                className='form-control'
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleOptionKeyDown}
                            />
                            <button className='btn btn-search'>
                                <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
                            </button>
                        </div>
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {selectedSegment.map((opt, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                    {opt}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemove(opt)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>
                        <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
                    </div>
                    <div className='filter-compnay-details'>
                        <p>Designation</p>

                        <div className='role-select'>
                            

                            <div className='search-box '>
                                <input
                                    type='text'
                                    placeholder='Search '
                                    className='form-control'
                                    value={searchDesignation}
                                    onChange={e => setSearchDesignation(e.target.value)}
                                    onKeyDown={handleDesignation}
                                />
                                <button className='btn btn-search'>
                                    <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
                                </button>
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            {selectedDesignation.map((opt, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                    {opt}
                                    <span
                                        style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                        onClick={() => handleRemoveDesignation(opt)}
                                    >
                                        <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                    </span>
                                </div>
                            ))}
                        </div>
                        <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
                    </div>
                    <div className='filter-compnay-details'>
                        <p>Gender</p>
                        
                        <ul className="space-y-3 gap-2 ps-0 mb-0">
                            {gender.map((role) => (
                                <li
                                    key={role.id}
                                    onClick={() => handleSelect(role.label)}
                                    className={` gap-2 px-3 py-2 user-role-list me-3  rounded-full cursor-pointer ${selectedRoles.includes(role.label)
                                        ? "select-grey"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    
                                    <span className="text-gray-600"><Image src={role.icon} className='img-fluid' alt='role' width={20} height={20} /> </span>
                                    <span>{role.label}</span>
                                </li>
                            ))}
                        </ul>
                        <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
                    </div>
                    <div className='filter-compnay-details'>
                        <p className='d-flex justify-content-between' >Location <Image style={{ transform: 'rotate(180deg)' }} src='../images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>

                        <div className='search-box '>
                            <input type='text' placeholder='Search by company name, or location' className='form-control' />
                            <button className='btn btn-search'>
                                <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
                            </button>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <p onClick={filterClose}>
                        Clear all
                    </p>
                    <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={getcompanyUserList}>
                        Search
                    </Button>
                </Modal.Footer>
            </Modal> */}
            {/* profile show */}

            <FilterUserAll
                filtermShow={filtermShow}
                filterClose={filterClose}
                role={role}
                search={search}
                setSearch={setSearch}
                handleOptionKeyDown={handleOptionKeyDown}
                selectedSegment={selectedSegment}
                setSelectedSegment={setSelectedSegment}
                searchDesignation={searchDesignation}
                setSearchDesignation={setSearchDesignation}
                handleDesignation={handleDesignation}
                selectedDesignation={selectedDesignation}
                selectedRoles={selectedRoles}
                handleRemove={handleRemove}
                handleRemoveDesignation={handleRemoveDesignation}
                handleRoleSelect={handleRoleSelect}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                searchLocation={searchLocation}
                setSearchLocation={setSearchLocation}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                handleLocation={handleLocation}
                handleRemoveLocation={handleRemoveLocation}
                gender={gender}
                getcompanyUserList={getcompanyUserList}
                selectedCompanies={selectedCompanies}
                companyList={companyList}
                segments={segments}
                designations={designations}
                handleSegmentDep={handleSegmentDep}
                showCompanyFilter={false}
                handleSelectGender={handleSelectGender}
                handleClearAllFields={handleClearAllFields}
            />

            <EmployeeDetailModel
                showsProfile={showsProfile}
                profileClose={profileClose}
                userDetails={userDetails}
                editemploye={editemploye}
                companyDetail={companyDetail}
                userCompany={userCompany}

            />

            {/* edit employ */}
            <EditUserProfile
                showEditBox={editsemploye}
                closeEditBox={employeClose}
                editData={userDetails}
                companyDetail={companyDetail}
                roleOption={role}
                companyList={companyList}
                changepicClose={changepicClose}
                //  openEditBox={editsemploye}
                // openEditBox={editemploye}
                userListData={userListData}
                openEditBox={editemploye}
            />
            {/* delete pic modal */}

            {/* Filter modal */}


            <Modal show={deletespicModal} onHide={deletepicClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                    <Modal.Title>
                        Remove profile photo?
                    </Modal.Title>
                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={deletepicClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <p>Are you sure you want to remove this photo? We’ll replace it with a default Alice avatar.</p>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={deletepicClose} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Clear all
                    </Button>
                    <Button variant="" onClick={deletepicClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Yes, Remove
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* change pic  */}

            <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
                    <Modal.Title>
                        Upload photo
                    </Modal.Title>
                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <p className='border-bottom pb-4'>Please upload Operations managers photo</p>
                    <div className="drap-drop-box-full">
                        {!file ? (
                            <label
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="border-2 border-dashed border-gray-300 rounded-md h-48 flex flex-col items-center justify-center cursor-pointer"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <Image
                                        src="/images/icons/photo-library.svg" // replace with your upload icon
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                    />
                                    <p className="font-medium mb-0" style={{ color: '#463527' }} >Drag and drop</p>
                                    <p className="text-sm text-gray-500 mb-0" style={{ color: '#73615F' }}  >
                                        or click here to choose file.
                                    </p>
                                </div>
                            </label>
                        ) : (
                            <div className="relative inline-block">
                                <Image
                                    src={file}
                                    alt="Uploaded preview"
                                    width={250}
                                    height={250}
                                    className="rounded-md object-cover"
                                />
                                <button
                                    onClick={removeFile}
                                    className="absolute delete-icn"
                                >
                                    <Image src="../images/icons/delete.svg" className='img-fluid ' width={24} height={24} alt='delete' />
                                </button>
                            </div>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={changepicClose} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={changepicClose} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Upload
                    </Button>
                </Modal.Footer>

            </Modal>

            {/* add Traveler */}
            <AddPersonModel
                addTravels={addTravels}
                removeTravel={removeTravel}
                roleOption={role}
                companyList={companyList}
                addTravel={addTravel}
                companyDetail={companyDetail}
                companyUid={id}
                loadMoreCompanies={loadMoreCompanies}
                setSearchComp={setSearchKey}
            />
            {/* external profile show */}


            <Modal show={externalshowsProfile} onHide={externalprofileClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                    <p className='d-flex align-items-center gap-3 font-18' style={{ color: '#73615F' }}>
                        External Traveler Details <Image src='../images/icons/bottom-arrow.svg' style={{ transform: 'rotate(180deg)', opacity: '.5' }} className='img-fluid' alt='top' width={12} height={12} />
                        <Image src='../images/icons/bottom-arrow.svg' className='img-fluid' alt='top' width={12} height={12} />
                    </p>
                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={profileClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className='cmp-employe-box'>
                        <div className='d-flex justify-content-between mb-3'>
                            <Image src='../images/icons/external-user.jpg' className='img-fluid' alt='employer' width={64} height={64} />
                            <Button variant="" onClick={() => {
                                externalprofileClose();
                                editemploye();
                            }} className='edit-btn gap-2'>Edit Profile  <Image src='../images/icons/edit.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
                        </div>
                        <p className='mb-1'>External</p>
                        <h4 className='font-24 mb-1'>Jenny Shaikh</h4>
                        <p className='d-flex gap-2' >
                            <Image src='../images/icons/email.svg' className='img-fluid' alt='email' width={20} height={20} />
                            <Link style={{ color: '#463527', fontWeight: '500' }} href='mailto:Shubancasamelhor@gmail.com'>Shubancasamelhor@gmail.com</Link>

                            <Image src='../images/icons/call.svg' className='img-fluid' alt='email' width={20} height={20} />
                            <Link style={{ color: '#463527', fontWeight: '500' }} href='tell:8390734261'>8390734261</Link>
                        </p>
                        <Button variant="" className='edit-btn gap-2'>View Trips  <Image src='../images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
                        <hr style={{ marginTop: '20px', borderColor: '#4635273D' }}></hr>
                        <div className='comapny-information-box-employer'>
                            <p className='subheadine-2'>Personal Information</p>
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Gender  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > Female </span></p>
                        </div>
                        <div className='comapny-information-box-employer'>
                            <p className='subheadine-2'>Custom Question</p>
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Rezo ticket  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > CM656574754536 </span></p>
                        </div>
                        <Button variant="" className='edit-btn gap-2'>Change Role/Password  <Image src='../images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Remove Assignment */}
            <Modal show={assignmentremoShow} onHide={assignmentRemoveClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >
                    <Link href='#' className='d-flex align-items-center gap-2' style={{ textDecoration: 'none', color: '#463527', fontWeight: '500' }}
                        onClick={() => {
                            assignmentRemoveClose();
                            //cmppremodShow();
                        }} >
                        <Image src='../images/icons/back.svg' width={10} height={10} onClick={assignmentRemoveClose} className='img-fluid' alt='back' /> Back
                    </Link>
                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={assignmentRemoveClose} />
                </Modal.Header>
                <Modal.Body className='pt-0' style={{ minHeight: '200px' }} >
                    <h2 className='page-title'>Remove this Assigment?</h2>
                    <p style={{ color: '#73615F' }}>The BR will permanently be unassigned to this company</p>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={assignmentRemoveClose}>
                        Cancel
                    </Button>
                    <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={handleRemoveAssignment}>
                        Yes, Remove
                    </Button>
                </Modal.Footer>
            </Modal>
        </ProtectedRoute>
    )
}