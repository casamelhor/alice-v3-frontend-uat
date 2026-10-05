// "use client"
// import React from 'react'
// import { useEffect, useState } from "react";
// import Header from '../Header/Header'
// import { Row, Col, Container, Button, Tabs, Tab, Table, Modal } from 'react-bootstrap';
// import Link from 'next/link';
// import Image from 'next/image';
// import Select, { AriaOnFocus, components } from 'react-select';
// import { companyListAPI, CompanyuserDetailAPI, UserDetailAPI, UserListAPI, UserRoleListAPI, DeptDesignationAPI } from '@/services/provider';
// import { EmployeeDetailModel } from '../commons/EmployeeDetailModel';
// import { EditUserProfile } from '../commons/EditUserProfile';
// import { AddPersonModel } from '../commons/AddPersonModel';
// import ProtectedRoute from '../ProtectedRoute';
// import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
// import { FilterUserAll } from '../commons/FilterUserAll';
// import { EmployeeExternalDetel } from '../commons/EmployeeExternalDetel';
// import { useSearchParams } from 'next/navigation';
// import { checkPermission } from '@/utils/helper';

// export default function People() {
//     //user permission
//     const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
//     const permissionUser = checkPermission(permissionArray, "user");
//     const permissionBooking = checkPermission(permissionArray, "booking");

//     const canAddUser = permissionUser === true || permissionUser?.can_add;
//     const canListUser = permissionUser === true || permissionUser?.can_list;
//     const canRetrieveUser = permissionUser === true || permissionUser?.can_retrieve;
//     const canUpdateUser = permissionUser === true || permissionUser?.can_update;
//     const canDeleteUser = permissionUser === true || permissionUser?.can_delete;
//     //Booking
//     const canListBooking = permissionBooking === true || permissionBooking?.can_list;
//     const searchParams = useSearchParams();
//     const paramShowModal = searchParams.get("show");
//     const paramUid = searchParams.get("guest_uid");
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"))
//     const ReservePageData = JSON.parse(getItemLocalStorage("reserveRoom"))
//     const [open, setOpen] = useState(false);
//     const [selectedRoles, setSelectedRoles] = useState([]);
//     const [userList, setUserList] = useState([]);
//     const [userDetails, setUserDetails] = useState({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [searchUser, setSearchUser] = useState("");
//     const [role, setRole] = useState([]);
//     const [searchKey, setSearchKey] = useState("");
//     const [page, setPage] = useState(1);
//     const [companyList, setCompanyList] = useState([])

//     const [deptList, setDeptList] = useState([]);
//     const [filteredList, setFilteredList] = useState([]);
//     const [segments, setSegments] = useState([]);
//     const [designations, setDesignations] = useState([]);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     // const [totalRecords, setTotalRecords] = useState(0);
//     const [company_count, setCompany_count] = useState(0);
//     const [totalPages, setTotalPages] = useState(1);



//     const paginatedUsers = userList.slice(
//         (currentPage - 1) * pageSize,
//         currentPage * pageSize
//     );



//     const normalize = (val) =>
//         typeof val === "string" ? val.trim().toLowerCase() : "";


//     const roles = [
//         { id: 1, label: "Client Admin", icon: "./images/icons/approval.svg" },
//         { id: 2, label: "Client Booking Manager", icon: "./images/icons/person_raised.svg" },
//         { id: 3, label: "Company Employee", icon: "./images/icons/group-user.svg" },
//     ];


//     const gender = [
//         { id: 1, label: "Male", icon: "./images/icons/male.svg" },
//         { id: 2, label: "Female", icon: "./images/icons/Genders.svg" },

//     ];


//     const [isGenderOpen, setIsGenderOpen] = useState(false);
//     const [selectedGender, setSelectedGender] = useState([]);


//     const toggleGenderDropdown = () => setIsGenderOpen((prev) => !prev);

//     // const handleSelectGender = (label) => {
//     //     setSelectedGender(label);
//     // };

//     const handleClearGender = () => setSelectedGender([]);

//     const handleDoneGender = () => setIsGenderOpen(false);



//     const toggleDropdown = () => setIsOpen((prev) => !prev);




//     const handleRoleSelect = (role) => {
//         setSelectedRoles((prev) =>
//             prev.includes(role)
//                 ? prev.filter((r) => r !== role)
//                 : [...prev, role]
//         );
//     };


//     // 

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

//     const handleGenderSelect = (option) => {
//         if (selectedGender.includes(option)) {
//             setSelectedGender(selectedGender.filter((item) => item !== option));
//         } else {
//             setSelectedGender([option]);
//         }
//     };

//     const [isOpen, setIsOpen] = useState(false);

//     const togglePicOption = () => {
//         setIsOpen((prev) => !prev);
//     };

//     // const handleOptionClick = () => {
//     //     setIsOpen(false); // hide menu when option is clicked
//     // };


//     const handleOptionClick = (item) => {

//         if (!selectedSegment.includes(item.name)) {

//             setSelectedSegment([...selectedSegment, item.name]);

//         }

//         setSearch("");

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

//     const statusOption = [
//         { value: "active", label: "Active" },
//         { value: "Inactive", label: "In Active" },

//     ];

//     const reasonsOption = [
//         { value: "reason1", label: "Reason 1" },
//         { value: "reason1", label: "Reason 2" },
//     ]


//     // const role = [
//     //     { value: "client-admin", label: "Client Admin", icon: "./images/icons/approval.svg" },
//     //     { value: "client-booking-manager", label: "Client Booking Manager", icon: "./images/icons/person_raised.svg" },
//     //     { value: "company-emloyee", label: "Company Employee", icon: "./images/icons/group-user.svg" },
//     // ]


//     // ✅ Custom option in dropdown
//     const CustomOption1 = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image
//                         src={props.data.icon}
//                         alt={props.data.label}
//                         width={20}
//                         height={20}
//                     />
//                     <span>{props.data.label}</span>
//                 </div>
//                 {props.isSelected && (
//                     <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
//                 )}
//             </div>

//         </components.Option>
//     );

//     // ✅ Custom selected value (shows in input box)
//     const CustomSingleValue1 = (props) => (
//         <components.SingleValue {...props}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <Image
//                     src={props.data.icon}
//                     alt={props.data.label}
//                     width={20}
//                     height={20}
//                 />
//                 <span>{props.data.label}</span>
//             </div>
//         </components.SingleValue>
//     );



//     // compnay 

//     // ✅ Custom option in dropdown
//     const CustomOption2 = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image
//                         src={props.data.icon}
//                         alt={props.data.label}
//                         width={20}
//                         height={20}
//                     />
//                     <span>{props.data.label}</span>
//                 </div>
//                 {props.isSelected && (
//                     <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
//                 )}
//             </div>

//         </components.Option>
//     );

//     // ✅ Custom selected value (shows in input box)
//     const CustomSingleValue2 = (props) => (
//         <components.SingleValue {...props}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <Image
//                     src={props.data.icon}
//                     alt={props.data.label}
//                     width={20}
//                     height={20}
//                 />
//                 <span>{props.data.label}</span>
//             </div>
//         </components.SingleValue>
//     );

//     // 

//     // ✅ Custom option in dropdown
//     const CustomOption3 = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image
//                         src={props.data.icon}
//                         alt={props.data.label}
//                         width={20}
//                         height={20}
//                     />
//                     <span>{props.data.label}</span>
//                 </div>
//                 {props.isSelected && (
//                     <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
//                 )}
//             </div>

//         </components.Option>
//     );

//     // ✅ Custom selected value (shows in input box)
//     const CustomSingleValue3 = (props) => (
//         <components.SingleValue {...props}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <Image
//                     src={props.data.icon}
//                     alt={props.data.label}
//                     width={20}
//                     height={20}
//                 />
//                 <span>{props.data.label}</span>
//             </div>
//         </components.SingleValue>
//     );

//     // 


//     const department = [
//         { value: "Sales-Marketing", label: "Sales & Marketing" },
//         { value: "Administrator", label: "Administrator" },
//     ]

//     const sortoption = [
//         { value: "most-trips", label: "Most Trips" },
//         { value: "Less-trips", label: "Less Trips" }
//     ]


//     const genderOption = [
//         { value: "male", label: "Male", icon: "./images/icons/male.svg" },
//         { value: "female", label: "Female", icon: "./images/icons/genders.svg" }
//     ]



//     const cmpOption = [
//         { value: "SchlumbergerAsiaServiceLtd", label: "Schlumberger Asia Service Ltd" },
//         { value: "CasaMelhor", label: "CasaMelhor" },
//         { value: "Delhivery", label: "Delhivery" },
//         { value: "PicusCapital", label: "Picus Capital" },
//         { value: "GPSRenewables", label: "GPS Renewables" },
//     ]

//     // Company dropdown state
//     const [isCompanyOpen, setIsCompanyOpen] = useState(false);
//     const [selectedCompanies, setSelectedCompanies] = useState([]);

//     const toggleCompanyDropdown = () => setIsCompanyOpen((prev) => !prev);

//     const handleSelectCompany = (label) => {
//         setSelectedCompanies((prev) =>
//             prev.includes(label) ? prev.filter((c) => c !== label) : [label]
//         );
//     };

//     const handleClearCompanies = () => setSelectedCompanies([]);
//     const handleDoneCompanies = () => setIsCompanyOpen(false);


//     const [openPicIndex, setOpenPicIndex] = useState(null);

//     const togglePicOption1 = (e, idx) => {
//         e.preventDefault();
//         setOpenPicIndex(openPicIndex === idx ? null : idx);
//         if (typeof toggleoptio1 === 'function') {
//             toggleoptio1();
//         }
//     }


//     const travelOption = [
//         {
//             value: "company-employee",
//             label: "Company employee",
//             icon: "./images/icons/hail.svg"
//         },
//         {
//             value: "external",
//             label: "External",
//             icon: "./images/icons/short_stay.svg"
//         },
//     ];

//     // ✅ Custom option in dropdown
//     const CustomOption = (props) => (
//         <components.Option {...props}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <Image
//                         src={props.data.icon}
//                         alt={props.data.label}
//                         width={20}
//                         height={20}
//                     />
//                     <span>{props.data.label}</span>
//                 </div>
//                 {props.isSelected && (
//                     <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
//                 )}
//             </div>

//         </components.Option>
//     );

//     // ✅ Custom selected value (shows in input box)
//     const CustomSingleValue = (props) => (
//         <components.SingleValue {...props}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <Image
//                     src={props.data.icon}
//                     alt={props.data.label}
//                     width={20}
//                     height={20}
//                 />
//                 <span>{props.data.label}</span>
//             </div>
//         </components.SingleValue>
//     );



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
//     const assignmentRemoveShow = () => assignmentremovesetShow(true);




//     const [filtermShow, filtersetShow] = useState(false);

//     const filterClose = () => filtersetShow(false);
//     const filterShow = () => filtersetShow(true);





//     const [showsProfile, profilesetShow] = useState(false);
//     const [userId, setUserId] = useState();
//     const [userCompany, setUserCompany] = useState({});

//     const [showsProfileExternal, setShowsProfileExternal] = useState(false);

//     // const profileClose = () => profilesetShow(false);
//     const profileClose = () => {
//         profilesetShow(false);
//         setShowsProfileExternal(false);
//     };


//     const showProfile = (val) => {
//         profilesetShow(true);
//         setUserId(val?.uid)
//         const updatedField = val?.user_company;
//         delete updatedField.id;
//         delete updatedField.uid;
//         delete updatedField.company_name;
//         setUserCompany(updatedField)
//     }

//     const showProfileExternal = (val) => {
//         setShowsProfileExternal(true);
//         //  profilesetShow(true);
//         setUserId(val?.uid)
//         const updatedField = val?.user_company;
//         // delete updatedField.id;
//         // delete updatedField.uid;
//         // delete updatedField.company_name;
//         setUserCompany(updatedField)
//     }


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

//     const changepicClose = () => changepisetShow(false);
//     const changepicModal = () => changepisetShow(true);





//     const [addTravels, addTravelsetShow] = useState(false);

//     const removeTravel = () => addTravelsetShow(false);
//     const addTravel = () => addTravelsetShow(true);



//     const [selectedStatus, setSelectedStatus] = useState(null);

//     const [activeTab, setActiveTab] = useState("employee");

//     const handleTabSelect = (key) => {
//         setActiveTab(key);
//         setSelectedRoles([]);
//         setSelectedCompanies([]);
//         setSelectedSegment([]);
//         setSelectedDesignation([]);
//         setSelectedGender([])
//     };

//     // const getUserListData = async () => {
//     //     try {
//     //         const tab = activeTab == "employee" ? "Company-Employee" : "External-Guest";
//     //         const filterRoles = selectedRoles.join(",");
//     //         const filterSegment = selectedSegment.join(",");
//     //         const filterdesignation = selectedDesignation.join(",");
//     //         const filterLocation = selectedLocation.join(",");
//     //         const filterComany = selectedCompanies.join(",")
//     //         const response = await UserListAPI(tab, searchUser, filterRoles, filterSegment, filterdesignation, selectedGender, filterLocation, filterComany)
//     //         if (response?.data?.success) {
//     //             setUserList(response.data.response);
//     //             setIsOpen(false)
//     //             setOpen(false);
//     //             filterClose();
//     //             setIsCompanyOpen(false)
//     //             setIsGenderOpen(false);
//     //         }
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // }

//     const normalizedGender = selectedGender.map(g => g.toLowerCase());

//     const getUserListData = async () => {
//         try {
//             const tab = activeTab == "employee" ? "Company-Employee" : "External-Guest";
//             const filterRoles = selectedRoles.join(",");
//             const filterSegment = selectedSegment.join(",");
//             const filterdesignation = selectedDesignation.join(",");
//             const filterLocation = selectedLocation.join(",");
//             const filterCompany = selectedCompanies.join(",");


//             const selectedCompanyObj = companyList.find(c => c.label === selectedCompanies[0]);
//             const selectedCompanyUID = selectedCompanyObj?.value;

//             const response = await UserListAPI(
//                 tab,
//                 searchUser,
//                 filterRoles,
//                 filterSegment,
//                 filterdesignation,
//                 selectedGender,
//                 normalizedGender,
//                 filterLocation,
//                 filterCompany,
//                 currentPage,
//                 pageSize
//             );

//             if (response?.data?.success) {
//                 // console.log("API Response tttttt:", response.data);

//                 let filteredUsers = response.data.response;


//                 // search filter 
//                 if (searchUser?.trim()) {
//                     const searchText = searchUser.toLowerCase();

//                     filteredUsers = filteredUsers.filter(user =>
//                         user?.first_name?.toLowerCase().includes(searchText) ||
//                         user?.last_name?.toLowerCase().includes(searchText) ||
//                         user?.user_company?.company_name?.toLowerCase().includes(searchText) ||
//                         user?.employee_id?.toLowerCase().includes(searchText)
//                     );
//                 }

//                 //  Company filter
//                 // ✅ Company filter sirf Employee ke liye
//                 if (tab === "Company-Employee" && selectedCompanies.length > 0) {
//                     filteredUsers = filteredUsers.filter(user =>
//                         selectedCompanies.includes(user?.user_company?.company_name)
//                     );
//                 }

//                 // if (selectedCompanies.length > 0) {
//                 //     filteredUsers = filteredUsers.filter(user =>
//                 //         selectedCompanies.includes(user?.user_company?.company_name)
//                 //     );
//                 // }

//                 // Segment / Dept filter
//                 const getUserSegments = (user) => {
//                     //  case: segments array
//                     if (Array.isArray(user.segments)) return user.segments;

//                     //  case: single segment string
//                     if (typeof user.segment === "string") return [user.segment];

//                     return [];
//                 };


//                 if (selectedSegment.length > 0) {
//                     const normalizedSelected = selectedSegment.map(normalize);

//                     filteredUsers = filteredUsers.filter(user => {
//                         const userSegments = getUserSegments(user).map(normalize);

//                         return normalizedSelected.some(sel =>
//                             userSegments.includes(sel)
//                         );
//                     });
//                 }


//                 if (tab === "External-Guest" && selectedGender.length > 0) {
//                     const normalizedSelectedGender = selectedGender.map(g => g.toLowerCase());

//                     filteredUsers = filteredUsers.filter(user =>
//                         normalizedSelectedGender.includes(user.gender?.toLowerCase())
//                     );
//                 }




//                 // setUserList(response.data.response);
//                 // setCompany_count(response.data.response.length);

//                 setUserList(filteredUsers);
//                 setCompany_count(filteredUsers.length);

//                 const pages = Math.ceil(filteredUsers.length / pageSize);
//                 setTotalPages(pages);


//                 // Close all dropdowns
//                 setIsOpen(false);
//                 setOpen(false);
//                 filterClose();
//                 setIsCompanyOpen(false);
//                 setIsGenderOpen(false);


//                 if (selectedCompanyUID) {
//                     fetchDept(selectedCompanyUID);
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };


//     // dynamic pagenationa 
//     const start = (currentPage - 1) * pageSize + 1;
//     const end = Math.min(currentPage * pageSize, company_count);


//     const getCompanyUserDetails = async () => {
//         try {
//             setIsLoading(true)
//             const response = await UserDetailAPI(userId)
//             if (response?.data?.success) {
//                 setUserDetails(response.data.response)
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


//     // ------------------ DEPT + DESIGNATION API ------------------
//     const fetchDept = async (company_uid) => {
//         try {
//             let res = await DeptDesignationAPI(company_uid);

//             const apiSegments = res?.data?.response?.segments || [];
//             const apiDesignations = res?.data?.response?.designations || [];

//             setSegments(apiSegments.filter(item => item && item !== "undefined"));
//             setDesignations(apiDesignations.filter(item => item && item !== "undefined"));

//             const data = res?.data?.data || [];
//             setDeptList(data);
//             setFilteredList(data);

//         } catch (e) {
//             console.log("DeptDesignation API ERROR:", e);
//         }
//     };



//     // ------------------ SEARCH FILTER ------------------
//     useEffect(() => {
//         if (!search.trim()) {
//             setFilteredList(deptList);
//         } else {
//             const text = search.toLowerCase();
//             const filtered = deptList.filter(item =>
//                 item?.name?.toLowerCase().includes(text) ||
//                 item?.designation?.toLowerCase().includes(text)
//             );
//             setFilteredList(filtered);
//         }
//     }, [deptList, search]);

//     useEffect(() => {
//         if (!!ReservePageData) {
//             addTravelsetShow(true);
//             removeItemLocalStorage("reserveRoom")
//             removeItemLocalStorage("basicSearchObj")

//         }
//     }, [ReservePageData])


//     useEffect(() => {
//         getUserListData();
//         userListData()
//         getCompanyList()
//     }, [activeTab, searchUser]);
//     useEffect(() => {
//         getCompanyUserDetails()
//     }, [userId])

//     useEffect(() => {
//         if (paramShowModal == "true" && paramUid) {
//             profilesetShow(true);
//             setUserId(paramUid);
//         }
//     }, [paramShowModal])

//     // ------------------ WHEN USER CHANGES THE COMPANY FROM DROPDOWN ------------------
//     const handleCompanyChange = (selected) => {
//         setSelectedCompanies([selected.value]);
//         fetchDept(selected.value);
//     };


//     const totalSelectedFilters =
//         selectedCompanies.length +
//         selectedRoles.length +
//         selectedSegment.length +
//         selectedDesignation.length +
//         selectedGender.length;


//     return (
//         <ProtectedRoute>
//             <Header />
//             <div className='page-body  pt-4 pb-4'>
//                 <section className='people-section'>
//                     <Container>
//                         <Row className='align-items-center mb-4'>
//                             <Col md={12}>
//                                 <div className='d-flex align-items-center justify-content-between mb-4'>
//                                     <div className='general-info'>
//                                         <h2 className='page-title'>People Directories</h2>
//                                     </div>
//                                     {canAddUser && <Link href="#" onClick={addTravel} className='btn-company-add '  > <span style={{ fontSize: '24px' }}> + </span>  Add a Person </Link>}
//                                 </div>
//                             </Col>
//                             <Col md={12}>
//                                 {canListUser && (
//                                     <div className='search-box mb-5'>
//                                         <input type='text' onChange={(e) => setSearchUser(e.target.value)} placeholder='Search for persons' className='form-control' />
//                                         <button className='btn btn-search' onClick={getUserListData}>
//                                             <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
//                                         </button>
//                                     </div>
//                                 )}
//                             </Col>
//                             <Col md={12} >
//                                 {canListUser && (
//                                     <Tabs
//                                         // defaultActiveKey="employee"
//                                         accessKey={activeTab}
//                                         id="uncontrolled-tab-example"
//                                         className="mb-3 employee-tabs"
//                                         onSelect={handleTabSelect}
//                                     >
//                                         <Tab eventKey="employee" title="Employee">
//                                             <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                                 <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                     <p className='mb-0 d-flex gap-2  align-items-center'> <Image src='./images/icons/group-user.svg' className='img-fluid' alt='user' width={24} height={24} /> {userList?.length}  </p>
//                                                     <div className='role-select'>
//                                                         <div className="flex gap-2 ">
//                                                             <button
//                                                                 onClick={toggleDropdown}
//                                                                 className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
//                                                             >
//                                                                 Role
//                                                                 <Image src="./images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
//                                                                 {selectedRoles.length > 0 && (
//                                                                     <span className="selected-item">{selectedRoles.length}</span>
//                                                                 )}

//                                                             </button>
//                                                         </div>
//                                                         {isOpen && (
//                                                             <div className="absolute mt-2 w-64 border z-10" style={{
//                                                                 background: '#F2F2F2', maxWidth: '317px', width: '100%'
//                                                             }} >
//                                                                 {/* Role Options */}
//                                                                 <ul className="space-y-3 p-3 mb-0">
//                                                                     {role.map((roles, index) => (
//                                                                         <li
//                                                                             key={index}
//                                                                             onClick={() => handleRoleSelect(roles.label)}
//                                                                             className={` gap-2 px-3 py-2 user-role-list  rounded-full cursor-pointer ${selectedRoles.includes(roles.label)
//                                                                                 ? "select-grey"
//                                                                                 : "hover:bg-gray-100"
//                                                                                 }`}
//                                                                         >
//                                                                             {/* Placeholder Icon */}
//                                                                             <span className="text-gray-600"><Image src={roles.icon} className='img-fluid' alt='role' width={20} height={20} /> </span>
//                                                                             <span>{roles.label}</span>
//                                                                         </li>
//                                                                     ))}
//                                                                 </ul>

//                                                                 {/* Actions */}
//                                                                 <div className="flex justify-between items-center border-top p-3">
//                                                                     <button
//                                                                         onClick={() => setSelectedRoles([])}
//                                                                         className="text-gray-500 text-sm hover:underline"
//                                                                     >
//                                                                         Clear all
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={getUserListData}
//                                                                         className="bg-green-700 text-white rounded-md" style={{ padding: "12px 16px" }}
//                                                                     >
//                                                                         Done
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     <div className='role-select'>
//                                                         <div className="flex gap-2">
//                                                             <button
//                                                                 onClick={toggleCompanyDropdown}
//                                                                 className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
//                                                             >
//                                                                 Company
//                                                                 <Image src="./images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
//                                                             </button>

//                                                             {isCompanyOpen && (
//                                                                 <div className="absolute top-13 mt-2 w-64 border z-10" style={{ background: '#F2F2F2', maxWidth: '317px', width: '100%' }} >
//                                                                     <div className="p-3" style={{ minHeight: '260px' }}>
//                                                                         <ul className="Companies-list space-y-3 mb-0">
//                                                                             {companyList?.map((c, index) => (
//                                                                                 <li key={index} className="px-3 py-2 border user-role-list  flex items-center justify-between">
//                                                                                     <label className="flex items-center  gap-3 cursor-pointer" onClick={() => handleSelectCompany(c.label)}>
//                                                                                         <input type="checkbox" checked={selectedCompanies.includes(c.label)} className='custom-checkbox' readOnly />
//                                                                                         <span className="ml-1">{c.label}</span>
//                                                                                     </label>
//                                                                                 </li>
//                                                                             ))}
//                                                                         </ul>
//                                                                     </div>

//                                                                     <div className="border-top flex justify-between items-center p-3 ">
//                                                                         <button onClick={handleClearCompanies} className="text-gray-500 text-sm hover:underline">Clear all</button>
//                                                                         <button onClick={getUserListData} className="bg-green-700 text-white rounded-md" style={{ padding: '12px 26px' }}>Done</button>
//                                                                     </div>
//                                                                 </div>
//                                                             )}

//                                                         </div>
//                                                     </div>

//                                                     <div className='role-select'>
//                                                         <div className="flex gap-2">
//                                                             <button
//                                                                 onClick={toggleDropdown1}
//                                                                 className="selected-list-border w-full position-relative border border-gray-300 role-btn rounded-md px-3 gap-3 py-2 flex justify-between items-center"
//                                                             >
//                                                                 <span className="text-gray-700">Dept./Segment</span>
//                                                                 <Image src="./images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
//                                                                 {selectedSegment.length > 0 && (
//                                                                     <span className="selected-item">{selectedSegment.length}</span>
//                                                                 )}


//                                                             </button>

//                                                             {open && (
//                                                                 <div className="searching-filter absolute mt-2 w-64 border z-10" style={{
//                                                                     background: '#F2F2F2', maxWidth: '317px', width: '100%'
//                                                                 }} >
//                                                                     <div className='p-3 position-relative' style={{ minHeight: '300px' }} >
//                                                                         {/* Search */}
//                                                                         <div className="flex items-center border-bottom mb-2 px-2 py-2 position-relative">
//                                                                             <Image src='./images/icons/search.svg' className='img-fluid mr-2' alt='search' width={16} height={16} />
//                                                                             <input
//                                                                                 type="text"
//                                                                                 placeholder="Search"
//                                                                                 className="flex-1 outline-none text-sm"
//                                                                                 value={search}
//                                                                                 onChange={(e) => setSearch(e.target.value)}
//                                                                             />
//                                                                         </div>

//                                                                         <div className="option-list max-h-40 overflow-y-auto ">
//                                                                             {search.trim() !== "" &&
//                                                                                 segments
//                                                                                     .filter((opt) =>
//                                                                                         opt.toLowerCase().includes(search.toLowerCase())
//                                                                                     )
//                                                                                     .map((opt, index) => (
//                                                                                         <div
//                                                                                             key={index}
//                                                                                             onClick={(e) => {
//                                                                                                 e.stopPropagation();
//                                                                                                 handleSegmentDep(opt); // This will now close the dropdown
//                                                                                                 setSearch("");   // clear search field
//                                                                                             }}
//                                                                                             className={`px-3 py-1 data-option cursor-pointer text-sm ${selectedSegment.includes(opt)
//                                                                                                 ? "bg-gray-200 font-medium"
//                                                                                                 : "hover:bg-gray-100"
//                                                                                                 }`}
//                                                                                         >
//                                                                                             {opt}
//                                                                                         </div>
//                                                                                     ))}
//                                                                         </div>

//                                                                         {/* Selected tags */}
//                                                                         <div className="flex flex-wrap gap-2 px-2 py-2">
//                                                                             {selectedSegment.map((item, index) => (
//                                                                                 <div
//                                                                                     key={index}
//                                                                                     className="selected-badge flex items-center bg-gray-100 px-3 gap-2 py-1 rounded-md text-sm"
//                                                                                 >
//                                                                                     {item}
//                                                                                     <button
//                                                                                         onClick={() => handleRemove(item)}
//                                                                                         className="ml-1 text-gray-500 hover:text-black"
//                                                                                     >
//                                                                                         <Image src="./images/icons/x-circle.svg" alt='close' width={20} height={20} />
//                                                                                     </button>
//                                                                                 </div>
//                                                                             ))}
//                                                                         </div>
//                                                                     </div>

//                                                                     {/* Footer */}
//                                                                     <div className="border-top flex justify-between items-center p-3">
//                                                                         <button
//                                                                             onClick={() => setSelectedSegment([])}
//                                                                             className="text-sm text-gray-500 hover:text-black"
//                                                                         >
//                                                                             Clear all
//                                                                         </button>
//                                                                         <button
//                                                                             onClick={getUserListData} // This closes the dropdown
//                                                                             className="bg-green-700 text-white rounded-md text-sm"
//                                                                             style={{ padding: '12px 26px' }}
//                                                                         >
//                                                                             Done
//                                                                         </button>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>

//                                                     <Button variant="" className='btn-filter position-relative selected-list-border' onClick={filterShow} >
//                                                         {totalSelectedFilters > 0 && (
//                                                             <span className="selected-item">{totalSelectedFilters}</span>
//                                                         )}
//                                                         <Image src='./images/icons/filter.svg' className='img-fluid' width={24} height={24} alt='filter' />
//                                                     </Button>
//                                                 </div>
//                                                 <div className='filter-right-option d-flex gap-3'>
//                                                     <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                         <p className='mb-0'>
//                                                             {company_count > 0
//                                                                 ? `${start}-${end} of ${company_count}`
//                                                                 : "0 results"}
//                                                         </p>
//                                                         <Image
//                                                             src='./images/icons/back.svg'
//                                                             className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
//                                                             alt='back'
//                                                             width={10}
//                                                             height={10}
//                                                             onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
//                                                         />

//                                                         <Image
//                                                             src='./images/icons/Arrows-right.svg'
//                                                             className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
//                                                             alt='right'
//                                                             width={29}
//                                                             height={29}
//                                                             onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
//                                                         />


//                                                     </div>

//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />

//                                                     </Button>

//                                                 </div>

//                                             </div>

//                                             <Table className='employee-table company-table' responsive>
//                                                 <thead>
//                                                     <tr>
//                                                         <th  > <div className="mwid-35">Employee</div> </th>
//                                                         <th  ><div className="mwid-20">Company</div></th>
//                                                         <th  ><div className="mwid-20">Employee ID</div></th>
//                                                         <th  ><div className="mwid-20">Dept./Segment </div> </th>
//                                                         <th ><div className="mwid-20">Number of trips </div> </th>
//                                                         <th style={{ width: '10%', textAlign: 'right' }} >
//                                                             <div className="mwid-15">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />

//                                                             </div>
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {/* {userList.map((Val, index) => ( */}
//                                                     {paginatedUsers.map((Val, index) => (
//                                                         <tr key={index}>
//                                                             <td>
//                                                                 <div className='d-flex align-items-center gap-3'>
//                                                                     <Image
//                                                                         src={Val.profile_image ? Val.profile_image : "/images/icons/No-Image.svg"}
//                                                                         width={56}
//                                                                         height={104}
//                                                                         className="img-fluid"
//                                                                         alt="User"
//                                                                         style={{ height: '104px', objectFit: 'cover' }}
//                                                                     />
//                                                                     <p className='mb-0'>
//                                                                         <small>Company Employee</small> <br></br>
//                                                                         <span style={{ fontWeight: '500' }} > {Val?.first_name} {Val?.last_name}</span>
//                                                                     </p>
//                                                                 </div>

//                                                             </td>
//                                                             <td>
//                                                                 <div className='d-flex align-items-center gap-2'>
//                                                                     {Val?.user_company?.company_name}
//                                                                 </div>

//                                                             </td>
//                                                             <td>
//                                                                 <div className='d-flex align-items-center gap-2'>
//                                                                     {Val?.employee_id ? Val?.employee_id : "-"}
//                                                                 </div>

//                                                             </td>
//                                                             <td>{Val?.segment ? Val?.segment : "-"}</td>
//                                                             <td>
//                                                                 <div className='d-flex align-items-center gap-2'>
//                                                                     {Val?.number_of_trips ? Val?.number_of_trips : "-"}
//                                                                 </div>

//                                                             </td>

//                                                             <td>
//                                                                 {canRetrieveUser && (
//                                                                     <Button variant="" onClick={() => showProfile(Val)} className='btn-light-action mb-2'  >
//                                                                         View Full Profile
//                                                                     </Button>
//                                                                 )}

//                                                                 {/* <Button variant="" onClick={() => showProfile(Val?.uid)} className='btn-light-action mb-2'  >
//                                                                 View Full Profile
//                                                             </Button> */}
//                                                                 {canListBooking && (
//                                                                     <Link href={`/Bookings?guest_uid=${Val?.uid}`} className='btn-table-action gap-2'>
//                                                                         View Trips <Image src='./images/icons/open_in_new.svg' className='img-fluid' alt='open-new-tab' width={20} height={20} />
//                                                                     </Link>
//                                                                 )}

//                                                             </td>
//                                                         </tr>

//                                                     ))}
//                                                 </tbody>
//                                             </Table>
//                                         </Tab>
//                                         <Tab eventKey="external" title="External">
//                                             <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                                 <div className='filter-left-option gap-4 d-flex justify-content-between align-items-center '>
//                                                     <p className='mb-0 d-flex gap-2  align-items-center'>
//                                                         <Image src='./images/icons/building.svg' className='img-fluid' alt='user' width={24} height={24} /> {userList?.length}  </p>

//                                                     <div className='role-select'>
//                                                         {/* <Select
//                                                         name="aria-role-select"
//                                                         options={role}
//                                                         placeholder="Role"
//                                                         className="react_selectbox"
//                                                         isSearchable={false}
//                                                         styles={customStyles}
//                                                     /> */}

//                                                         <div className="flex gap-2">
//                                                             <button
//                                                                 onClick={toggleGenderDropdown}
//                                                                 className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
//                                                             >
//                                                                 Any Gender
//                                                                 <Image src="./images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
//                                                             </button>
//                                                         </div>
//                                                         {isGenderOpen && (
//                                                             <div className="absolute mt-2 w-64 border z-10" style={{
//                                                                 background: '#F2F2F2', maxWidth: '317px', width: '100%'
//                                                             }} >
//                                                                 {/* Role Options */}
//                                                                 <ul className="space-y-3 p-3 mb-0">
//                                                                     {gender.map((role, index) => (
//                                                                         <li
//                                                                             key={index}
//                                                                             onClick={() => handleGenderSelect(role.label)}
//                                                                             className={` gap-2 px-3 py-2 user-role-list me-3  rounded-full cursor-pointer ${selectedGender.includes(role.label)
//                                                                                 ? "select-grey"
//                                                                                 : "hover:bg-gray-100"
//                                                                                 }`}
//                                                                         >
//                                                                             {/* Placeholder Icon */}
//                                                                             <span className="text-gray-600"><Image src={role.icon} className='img-fluid' alt='role' width={20} height={20} /> </span>
//                                                                             <span>{role.label}</span>
//                                                                         </li>
//                                                                     ))}
//                                                                 </ul>

//                                                                 {/* Actions */}
//                                                                 <div className="flex justify-between items-center border-top p-3">
//                                                                     <button
//                                                                         onClick={handleClearGender}
//                                                                         className="text-gray-500 text-sm hover:underline"
//                                                                     >
//                                                                         Clear all
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={getUserListData}
//                                                                         className="bg-green-700 text-white rounded-md" style={{ padding: "12px 16px" }}
//                                                                     >
//                                                                         Done
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     {/* <Button variant="" className='btn-filter position-relative selected-list-border' onClick={filterShow} >
//                                                     <span className="selected-item">2</span>
//                                                     <Image src='./images/icons/filter.svg' className='img-fluid' width={24} height={24} alt='filter' />
//                                                 </Button> */}
//                                                 </div>


//                                                 <div className='filter-right-option d-flex gap-3'>
//                                                     <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                                                         <p className='mb-0'>
//                                                             {company_count > 0
//                                                                 ? `${start}-${end} of ${company_count}`
//                                                                 : "0 results"}
//                                                         </p>

//                                                         <Image
//                                                             src='./images/icons/back.svg'
//                                                             className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
//                                                             alt='back'
//                                                             width={10}
//                                                             height={10}
//                                                             onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
//                                                         />

//                                                         <Image
//                                                             src='./images/icons/Arrows-right.svg'
//                                                             className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
//                                                             alt='right'
//                                                             width={29}
//                                                             height={29}
//                                                             onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
//                                                         />

//                                                     </div>

//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />
//                                                     </Button>
//                                                 </div>

//                                             </div>

//                                             <Table className='employee-table company-table' responsive>
//                                                 <thead>
//                                                     <tr>
//                                                         <th  > <div className="mwid-35">Traveler</div> </th>
//                                                         <th  ><div className="mwid-20">Gender</div></th>
//                                                         <th  ><div className="mwid-20">Email</div></th>
//                                                         <th  ><div className="mwid-20">Phone number </div> </th>
//                                                         <th ><div className="mwid-20">Number of trips </div> </th>
//                                                         <th style={{ width: '10%', textAlign: 'right' }} >
//                                                             <div className="mwid-15">  <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' className='ms-auto me-0' />
//                                                             </div>
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {/* {userList.map((Val, index) => ( */}
//                                                     {paginatedUsers.map((Val, index) => (
//                                                         <tr key={index}>
//                                                             <td>
//                                                                 <div className='d-flex align-items-center gap-3'>
//                                                                     {/* <Image src={`https://alicedevapi.casamelhor.in${Val?.profile_image}` || "/images/icons/No-Image.svg"} width={56} height={104} className='img-fluid ' alt='User' /> */}

//                                                                     <Image
//                                                                         src={Val.profile_image ? Val.profile_image : "/images/icons/No-Image.svg"}
//                                                                         width={56}
//                                                                         height={104}
//                                                                         className="img-fluid"
//                                                                         alt="User"
//                                                                         style={{ height: '104px', objectFit: 'cover' }}
//                                                                     />
//                                                                     <p className='mb-0'>
//                                                                         <small>External</small> <br></br>
//                                                                         <span style={{ fontWeight: '500' }} > {Val?.first_name} {Val?.last_name} </span>
//                                                                     </p>
//                                                                 </div>
//                                                             </td>
//                                                             <td>
//                                                                 <div className='d-flex align-items-center gap-2'>
//                                                                     <Image src="./images/icons/Genders.svg" className='img-fluid' alt='gender female' width={24} height={24} /> {Val?.gender}
//                                                                 </div>
//                                                             </td>
//                                                             <td>
//                                                                 <div className='d-flex align-items-center gap-2'>
//                                                                     <Image src="./images/icons/email.svg" className='img-fluid' alt='gender female' width={24} height={24} />  {Val?.email}
//                                                                 </div>
//                                                             </td>
//                                                             <td>
//                                                                 <div className='d-flex align-items-center gap-2'>
//                                                                     <Image src="./images/icons/call.svg" className='img-fluid' alt='gender female' width={24} height={24} />
//                                                                     {Val?.phone_number}
//                                                                 </div>
//                                                             </td>
//                                                             <td> <div className='d-flex align-items-center gap-2'>
//                                                                 {Val?.number_of_trips ? Val?.number_of_trips : "-"}
//                                                             </div></td>
//                                                             <td>
//                                                                 <Button variant="" onClick={() => showProfileExternal(Val)} className='btn-light-action mb-2'  >
//                                                                     View Full Profile
//                                                                 </Button>

//                                                                 <Link href={`/Bookings?guest_uid=${Val?.uid}`} className='btn-table-action gap-2'>
//                                                                     View Trips <Image src='./images/icons/open_in_new.svg' className='img-fluid' alt='open-new-tab' width={20} height={20} />
//                                                                 </Link>
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </Table>
//                                         </Tab>
//                                     </Tabs>
//                                 )}
//                             </Col>
//                         </Row>
//                     </Container>
//                 </section>
//             </div>




//             {/*  */}


//             {/* <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >

//                     Filters

//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>

//                     <div className='filter-compnay-details'>
//                         <p className='d-flex justify-content-between font-18' >Companies <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>

//                         <ul className="company-name-filter p-0">
//                             <li>

//                                 <input type='checkbox' id='confirm-add' className='custom-checkbox' />
//                                 <label htmlFor='confirm-add'>CasaMelhor Admin</label>

//                             </li>

//                             <li>

//                                 <input type='checkbox' id='confirm-add1' className='custom-checkbox' />
//                                 <label htmlFor='confirm-add1'>Delhivery</label>

//                             </li>

//                             <li>

//                                 <input type='checkbox' id='confirm-add2' className='custom-checkbox' />
//                                 <label htmlFor='confirm-add2'>GPS Renewables</label>

//                             </li>
//                             <li>

//                                 <input type='checkbox' id='confirm-add3' className='custom-checkbox' />
//                                 <label htmlFor='confirm-add3'>Schlumberger</label>

//                             </li>

//                             <li className="">

//                                 <input type='checkbox' id='confirm-add4' className='custom-checkbox' />
//                                 <label htmlFor='confirm-add4'>Picus Capital</label>

//                             </li>
//                         </ul>


//                         <hr style={{ margin: '15px 0 30px' }} ></hr>



//                     </div>

//                     <div className='filter-compnay-details'>
//                         <p className='font-18' >Role</p>

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
//                         <p className='font-18'>Designation</p>

//                         <div className='role-select'>


//                             <div className='search-box '>
//                                 <input type='text' placeholder='Search' className='form-control' />
//                                 <button className='btn btn-search'>
//                                     <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
//                                 </button>
//                             </div>
//                         </div>

//                         <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>

//                     </div>



//                     <div className='filter-compnay-details'>
//                         <p className='font-18'>Gender</p>




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
//                         <p className='d-flex justify-content-between font-18' >Location <Image style={{ transform: 'rotate(180deg)' }} src='./images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>

//                         <div className='search-box '>
//                             <input type='text' placeholder='Search by company name, or location' className='form-control' />
//                             <button className='btn btn-search'>
//                                 <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
//                             </button>
//                         </div>



//                     </div>





//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <p onClick={filterClose}>
//                         Clear all
//                     </p>
//                     <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={filterClose}>
//                         Search
//                     </Button>
//                 </Modal.Footer>

//             </Modal> */}

//             <FilterUserAll
//                 filtermShow={filtermShow}
//                 filterClose={filterClose}
//                 filteredList={filteredList}
//                 handleOptionClick={handleOptionClick}
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
//                 getcompanyUserList={getUserListData}
//                 companyList={companyList}
//                 activeTab={activeTab}
//                 handleSelectCompany={handleSelectCompany}
//                 handleGenderSelect={handleGenderSelect}
//                 handleClearCompanies={handleClearCompanies}
//                 selectedCompanies={selectedCompanies}
//                 segments={segments}
//                 designations={designations}
//                 handleSegmentDep={handleSegmentDep}
//                 showCompanyFilter={true}
//             />

//             <EmployeeDetailModel
//                 showsProfile={showsProfile}
//                 profileClose={profileClose}
//                 userDetails={userDetails}
//                 editemploye={editemploye}
//                 userCompany={userCompany}
//             />

//             <EmployeeExternalDetel
//                 showsProfileExternal={showsProfileExternal}
//                 profileClose={profileClose}
//                 userDetails={userDetails}
//                 editemploye={editemploye}
//             // userCompany={userCompany}
//             />


//             {/*  */}


//             {/* edit employ */}


//             <EditUserProfile
//                 showEditBox={editsemploye}
//                 closeEditBox={employeClose}
//                 // openEditBox={editsemploye}
//                 editData={userDetails}
//                 roleOption={role}
//                 companyList={companyList}
//                 openEditBox={editemploye}
//                 getUserListData={getUserListData}
//             />




//             {/* delete pic modal */}

//             {/* Filter modal */}


//             <Modal show={deletespicModal} onHide={deletepicClose} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
//                     <Modal.Title>
//                         Remove profile photo?
//                     </Modal.Title>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={deletepicClose} />
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

//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
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
//                                     <Image src="./images/icons/delete.svg" className='img-fluid ' width={24} height={24} alt='delete' />
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

//             />

//             {/* external profile show */}


//             <Modal show={externalshowsProfile} onHide={externalprofileClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
//                     <p className='d-flex align-items-center gap-3 font-18' style={{ color: '#73615F' }}>
//                         External Traveler Details <Image src='./images/icons/bottom-arrow.svg' style={{ transform: 'rotate(180deg)', opacity: '.5' }} className='img-fluid' alt='top' width={12} height={12} />
//                         <Image src='./images/icons/bottom-arrow.svg' className='img-fluid' alt='top' width={12} height={12} />
//                     </p>
//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={profileClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <div className='cmp-employe-box'>
//                         <div className='d-flex justify-content-between mb-3'>
//                             <Image src='/images/icons/external-user.jpg' className='img-fluid' alt='employer' width={64} height={64} />

//                             <Button variant="" onClick={() => {
//                                 externalprofileClose();
//                                 editemploye();
//                             }} className='edit-btn gap-2'>Edit Profile  <Image src='/images/icons/edit.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
//                         </div>
//                         <p className='mb-1'>External</p>
//                         <h4 className='font-24 mb-1'>Jenny Shaikh</h4>
//                         <p className='d-flex gap-2' >
//                             <Image src='./images/icons/email.svg' className='img-fluid' alt='email' width={20} height={20} />
//                             <Link style={{ color: '#463527', fontWeight: '500' }} href='mailto:Shubancasamelhor@gmail.com'>Shubancasamelhor@gmail.com</Link>

//                             <Image src='./images/icons/call.svg' className='img-fluid' alt='email' width={20} height={20} />
//                             <Link style={{ color: '#463527', fontWeight: '500' }} href='tell:8390734261'>8390734261</Link>
//                         </p>
//                         <Button variant="" className='edit-btn gap-2'>View Trips  <Image src='/images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
//                         <hr style={{ marginTop: '20px', borderColor: '#4635273D' }}></hr>
//                         <div className='comapny-information-box-employer'>
//                             <p className='subheadine-2'>Personal Information</p>
//                             <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Gender  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > Female </span></p>
//                         </div>
//                         <div className='comapny-information-box-employer'>
//                             <p className='subheadine-2'>Custom Question</p>
//                             <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Rezo ticket  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > CM656574754536 </span></p>
//                         </div>
//                         <Button variant="" className='edit-btn gap-2'>Change Role/Password  <Image src='/images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
//                     </div>
//                 </Modal.Body>
//             </Modal>
//         </ProtectedRoute>
//     )
// }


"use client"
import React, { useRef } from 'react'
import { useEffect, useState } from "react";
import Header from '../Header/Header'
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import Select, { components } from 'react-select';
import { companyListAPI, UserDetailAPI, UserListAPI, UserRoleListAPI, DeptDesignationAPI } from '@/services/provider';
import { EmployeeDetailModel } from '../commons/EmployeeDetailModel';
import { EditUserProfile } from '../commons/EditUserProfile';
import { AddPersonModel } from '../commons/AddPersonModel';
import ProtectedRoute from '../ProtectedRoute';
import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
import { FilterUserAll } from '../commons/FilterUserAll';
import { EmployeeExternalDetel } from '../commons/EmployeeExternalDetel';
import { useSearchParams } from 'next/navigation';
import { checkPermission } from '@/utils/helper';

export default function People() {
    // ---------- PERMISSIONS ----------
    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionUser = checkPermission(permissionArray, "user");
    const permissionBooking = checkPermission(permissionArray, "booking");
    const permissionCompany = checkPermission(permissionArray, "company");
    const permissionRole = checkPermission(permissionArray, "role");

    const canAddUser = permissionUser === true || permissionUser?.can_add;
    const canListUser = permissionUser === true || permissionUser?.can_list;
    const canRetrieveUser = permissionUser === true || permissionUser?.can_retrieve;
    const canListBooking = permissionBooking === true || permissionBooking?.can_list;
    const canListCompany = permissionCompany === true || permissionCompany?.can_list;
    const canListRole = permissionRole === true || permissionRole?.can_list;

    // ---------- ROUTER / PARAMS ----------
    const searchParams = useSearchParams();
    const paramShowModal = searchParams.get("show");
    const paramUid = searchParams.get("guest_uid");

    const loginData = JSON.parse(getItemLocalStorage("userLogin"));
    const ReservePageData = JSON.parse(getItemLocalStorage("reserveRoom"));

    // ---------- STATE ----------
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const didSetDefaultCompany = useRef(false);

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedSegment, setSelectedSegment] = useState([]);
    const [selectedDesignation, setSelectedDesignation] = useState([]);
    const [selectedGender, setSelectedGender] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);

    const [userList, setUserList] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [userId, setUserId] = useState(null);   // FIX: start null, not undefined
    const [userCompany, setUserCompany] = useState({});


    const [searchUser, setSearchUser] = useState("");

    const [role, setRole] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [companyList, setCompanyList] = useState([]);
    const [deptList, setDeptList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [segments, setSegments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    // const [company_count, setCompany_count] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [searchDesignation, setSearchDesignation] = useState("");
    const [searchLocation, setSearchLocation] = useState("");

    const [activeTab, setActiveTab] = useState("employee");

    // ---------- MODAL VISIBILITY ----------
    const [showsProfile, profilesetShow] = useState(false);
    const [showsProfileExternal, setShowsProfileExternal] = useState(false);
    const [editsemploye, editemployesetShow] = useState(false);
    const [addTravels, addTravelsetShow] = useState(false);
    const [filtermShow, filtersetShow] = useState(false);
    const [deletespicModal, deletepicsetShow] = useState(false);
    const [changepicsModal, changepisetShow] = useState(false);
    // (unused legacy modals kept as no-ops to avoid breaking imports)
    const [show, compsetShow] = useState(false);
    const [compnayShow, compstatussetShow] = useState(false);
    const [compnayremoShow, compremovesetShow] = useState(false);
    const [assignmentremoShow, assignmentremovesetShow] = useState(false);



    const [sortBy, setSortBy] = useState('');
    const [isCompanyFilterApplied, setIsCompanyFilterApplied] = useState(false);

    const [openPicIndex, setOpenPicIndex] = useState(null);
    const [file, setFile] = useState(null);



    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [companySearchText, setCompanySearchText] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    // ---------- COMPUTED ----------

    const start = userCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;

    const end = userCount > 0
        ? Math.min((currentPage - 1) * pageSize + userList.length, userCount)
        : 0;


    // ---------- HELPERS ----------
    const normalize = (val) =>
        typeof val === "string" ? val.trim().toLowerCase() : "";

    const closeAllDropdowns = () => {
        setIsOpen(false);
        setOpen(false);
        setIsCompanyOpen(false);
        setIsGenderOpen(false);
        filtersetShow(false);
        setCompanySearchText("")
    };

    // ---------- STATIC OPTIONS ----------
    const roles = [
        { id: 1, label: "Client Admin", icon: "./images/icons/approval.svg" },
        { id: 2, label: "Client Booking Manager", icon: "./images/icons/person_raised.svg" },
        { id: 3, label: "Company Employee", icon: "./images/icons/group-user.svg" },
    ];

    const gender = [
        { id: 1, label: "Male", icon: "./images/icons/male.svg" },
        { id: 2, label: "Female", icon: "./images/icons/Genders.svg" },
    ];

    // const sortoption = [
    //     { value: "most-trips", label: "Most Trips" },
    //     { value: "less-trips", label: "Less Trips" },
    // ];

    const sortoption = [
        { value: "most_trips", label: "Most Trips" },
        { value: "less_trips", label: "Less Trips" }
    ]

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected || state.isFocused ? "#4635271F" : "inherit",
            color: "black",
            cursor: "pointer",
        }),
    };

    // ---------- CUSTOM SELECT COMPONENTS ----------
    // const makeCustomOption = () => (props) => (
    //     <components.Option {...props}>
    //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
    //             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    //                 <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
    //                 <span>{props.data.label}</span>
    //             </div>
    //             {props.isSelected && <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>}
    //         </div>
    //     </components.Option>
    // );

    // const makeCustomSingleValue = () => (props) => (
    //     <components.SingleValue {...props}>
    //         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    //             <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
    //             <span>{props.data.label}</span>
    //         </div>
    //     </components.SingleValue>
    // );

    // const CustomOption = makeCustomOption();
    // const CustomSingleValue = makeCustomSingleValue();

    // ---------- FILTER HANDLERS ----------
    const handleTabSelect = (key) => {
        setActiveTab(key);
        setCurrentPage(1);   // FIX: reset page on tab change
        setSelectedRoles([]);
        setSelectedCompanies([]);
        setSelectedSegment([]);
        setSelectedDesignation([]);
        setSelectedGender([]);
    };

    const handleRoleSelect = (roleLabel) => {
        setSelectedRoles((prev) =>
            prev.includes(roleLabel) ? prev.filter((r) => r !== roleLabel) : [...prev, roleLabel]
        );
    };

    // FIX: unified company selection — always store label strings
    const handleSelectCompany = (label) => {
        setSelectedCompanies((prev) =>
            prev.includes(label) ? prev.filter((c) => c !== label) : [label]
        );
    };

    // const handleClearCompanies = () => setSelectedCompanies([]);
    // const handleDoneCompanies = () => setIsCompanyOpen(false);

    const handleSelectGender = (label) => {
        setSelectedGender(label);
    };

    const handleDoneCompanies = () => {
        setIsCompanyOpen(false);
        setIsCompanyFilterApplied(true);   // ✅ mark filter applied
        setCurrentPage(1);
        setCompanySearchText("");  // ← add this line

    };
    const handleClearCompanies = () => {
        setSelectedCompanies([]);
        setIsCompanyFilterApplied(false);
        setCompanySearchText("");
    };




    // FIX: handleCompanyChange now consistent — stores label, fetches dept by uid
    const handleCompanyChange = (selectedOption) => {
        setSelectedCompanies([selectedOption.label]);
        fetchDept(selectedOption.value);
    };

    const handleSegmentDep = (option) => {
        setSelectedSegment((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };
    const handleRemove = (option) => setSelectedSegment((prev) => prev.filter((item) => item !== option));

    const handleDesignation = (valueOrEvent) => {
        if (typeof valueOrEvent === "string") {
            setSelectedDesignation((prev) => [...prev, valueOrEvent]);
            return;
        }
        if ((valueOrEvent.key === "Enter" || valueOrEvent.key === "Tab") && searchDesignation.trim()) {
            valueOrEvent.preventDefault();
            setSelectedDesignation((prev) => [...prev, searchDesignation.trim()]);
            setSearchDesignation("");
        }
    };
    const handleRemoveDesignation = (option) =>
        setSelectedDesignation((prev) => prev.filter((item) => item !== option));

    const handleLocation = (e) => {
        if ((e.key === "Enter" || e.key === "Tab") && searchLocation.trim()) {
            e.preventDefault();
            setSelectedLocation((prev) => [...prev, searchLocation.trim()]);
            setSearchLocation("");
        }
    };
    const handleRemoveLocation = (option) =>
        setSelectedLocation((prev) => prev.filter((item) => item !== option));

    const handleGenderSelect = (option) => {
        setSelectedGender((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [option]
        );
    };
    const handleClearGender = () => setSelectedGender([]);

    const handleOptionKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === "Tab") && search.trim()) {
            e.preventDefault();
            setSelectedSegment((prev) => [...prev, search.trim()]);
            setSearch("");
        }
    };

    const handleOptionClick = (item) => {
        if (!selectedSegment.includes(item.name)) {
            setSelectedSegment((prev) => [...prev, item.name]);
        }
        setSearch("");
    };

    const totalSelectedFilters =
        selectedCompanies.length +
        selectedRoles.length +
        selectedSegment.length +
        selectedDesignation.length +
        selectedGender.length;

    // ---------- TOGGLE HELPERS ----------
    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const toggleDropdown1 = () => setOpen((prev) => !prev);
    const toggleCompanyDropdown = () => setIsCompanyOpen((prev) => !prev);
    const toggleGenderDropdown = () => setIsGenderOpen((prev) => !prev);

    // FIX: removed reference to undefined `toggleoptio1`
    const togglePicOption1 = (e, idx) => {
        e.preventDefault();
        setOpenPicIndex(openPicIndex === idx ? null : idx);
    };

    // ---------- FILE UPLOAD ----------
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) setFile(URL.createObjectURL(uploadedFile));
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile) setFile(URL.createObjectURL(uploadedFile));
    };
    const handleDragOver = (e) => e.preventDefault();
    const removeFile = () => setFile(null);

    // ---------- PROFILE MODALS ----------
    const profileClose = () => {
        profilesetShow(false);
        setShowsProfileExternal(false);
    };

    const showProfile = (val) => {
        profilesetShow(true);
        setUserId(val?.uid);
        const updatedField = { ...val?.user_company };  // FIX: clone before mutating
        delete updatedField.id;
        delete updatedField.uid;
        delete updatedField.company_name;
        setUserCompany(updatedField);
    };

    const showProfileExternal = (val) => {
        setShowsProfileExternal(true);
        setUserId(val?.uid);
        setUserCompany(val?.user_company || {});
    };

    const employeClose = () => editemployesetShow(false);
    const editemploye = () => editemployesetShow(true);
    const removeTravel = () => addTravelsetShow(false);
    const addTravel = () => addTravelsetShow(true);
    const filterClose = () => filtersetShow(false);
    const filterShow = () => filtersetShow(true);
    const deletepicClose = () => deletepicsetShow(false);
    const deletepicModal = () => deletepicsetShow(true);
    const changepicClose = () => changepisetShow(false);
    const changepicModal = () => changepisetShow(true);

    // ---------- API CALLS ----------
    // const getUserListData = async () => {
    //     try {
    //         const tab = activeTab === "employee" ? "Company-Employee" : "External-Guest";
    //         const filterRoles = selectedRoles.join(",");
    //         const filterSegment = selectedSegment.join(",");
    //         const filterdesignation = selectedDesignation.join(",");
    //         const filterLocation = selectedLocation.join(",");
    //         const filterCompany = selectedCompanies.join(",");

    //         // FIX: normalizedGender computed here (inside fn), not at module level
    //         const normalizedGender = selectedGender.map((g) => g.toLowerCase());

    //         const response = await UserListAPI(
    //             tab,
    //             searchUser,
    //             filterRoles,
    //             filterSegment,
    //             filterdesignation,
    //             selectedGender,
    //             normalizedGender,
    //             filterLocation,
    //             filterCompany,
    //             currentPage,
    //             pageSize
    //         );

    //         if (response?.data?.success) {
    //             let filteredUsers = response.data.response;

    //             // Search filter (client-side fallback)
    //             if (searchUser?.trim()) {
    //                 const searchText = searchUser.toLowerCase();
    //                 filteredUsers = filteredUsers.filter((user) =>
    //                     user?.first_name?.toLowerCase().includes(searchText) ||
    //                     user?.last_name?.toLowerCase().includes(searchText) ||
    //                     user?.user_company?.company_name?.toLowerCase().includes(searchText) ||
    //                     user?.employee_id?.toLowerCase().includes(searchText)
    //                 );
    //             }

    //             // Company filter — employee tab only
    //             if (tab === "Company-Employee" && selectedCompanies.length > 0) {
    //                 filteredUsers = filteredUsers.filter((user) =>
    //                     selectedCompanies.includes(user?.user_company?.company_name)
    //                 );
    //             }

    //             // Segment / Dept filter
    //             if (selectedSegment.length > 0) {
    //                 const normalizedSelected = selectedSegment.map(normalize);
    //                 filteredUsers = filteredUsers.filter((user) => {
    //                     const userSegments = (
    //                         Array.isArray(user.segments)
    //                             ? user.segments
    //                             : typeof user.segment === "string"
    //                                 ? [user.segment]
    //                                 : []
    //                     ).map(normalize);
    //                     return normalizedSelected.some((sel) => userSegments.includes(sel));
    //                 });
    //             }

    //             // Gender filter — external tab only
    //             if (tab === "External-Guest" && selectedGender.length > 0) {
    //                 filteredUsers = filteredUsers.filter((user) =>
    //                     normalizedGender.includes(user.gender?.toLowerCase())
    //                 );
    //             }

    //             setUserList(filteredUsers);
    //             setCompany_count(filteredUsers.length);
    //             setTotalPages(Math.ceil(filteredUsers.length / pageSize) || 1);

    //             // FIX: reset to page 1 when new filter is applied
    //             setCurrentPage(1);

    //             closeAllDropdowns();

    //             // Fetch dept for selected company
    //             const selectedCompanyObj = companyList.find((c) => c.label === selectedCompanies[0]);
    //             if (selectedCompanyObj) fetchDept(selectedCompanyObj.value);
    //         }
    //     } catch (error) {
    //         console.error("getUserListData error:", error);
    //     }
    // };


    const getUserListData = async () => {
        try {
            const tab = activeTab == "employee" ? "Company-Employee" : "External-Guest";
            const filterRoles = selectedRoles.join(",");
            const filterSegment = selectedSegment.join(",");
            const filterdesignation = selectedDesignation.join(",");
            const filterLocation = selectedLocation.join(",");
            const sortby = sortBy || "";

            let filterCompany;
            // isCompanyFilterApplied && selectedCompanies.length > 0
            if (activeTab == "employee") filterCompany = selectedCompanies.length > 0 ? selectedCompanies.join(",") : loginData?.user_company;

            const selectedCompanyObj = companyList.find(c => c.label === selectedCompanies[0]);
            const selectedCompanyUID = selectedCompanyObj?.value;

            const response = await UserListAPI(
                tab,
                filterRoles,
                searchUser,
                filterSegment,
                filterdesignation,
                selectedGender,
                filterLocation,
                sortby,
                filterCompany,
                currentPage,
                pageSize

            );


            console.log("API Raw Responseeeeee:", response.data.response);
            if (response?.data?.success) {


                setUserList(response.data.response);  // ✅ direct backend data
                // setCompany_count(response.data.total_count);
                setUserCount(response.data.user_count);
                setTotalPages(response.data.total_page);


                // console.log("API Response tttttt:", response.data);

                let filteredUsers = response.data.response;


                // search filter 
                // if (searchUser?.trim()) {
                //     const searchText = searchUser.toLowerCase();

                //     filteredUsers = filteredUsers.filter(user =>
                //         user?.first_name?.toLowerCase().includes(searchText) ||
                //         user?.last_name?.toLowerCase().includes(searchText) ||
                //         user?.user_company?.company_name?.toLowerCase().includes(searchText) ||
                //         user?.employee_id?.toLowerCase().includes(searchText)
                //     );
                // }

                //  Company filter
                // ✅ Company filter sirf Employee ke liye
                if (tab === "Company-Employee" && selectedCompanies.length > 0) {
                    filteredUsers = filteredUsers.filter(user =>
                        selectedCompanies.includes(user?.user_company?.company_name)
                    );
                }

                // if (selectedCompanies.length > 0) {
                //     filteredUsers = filteredUsers.filter(user =>
                //         selectedCompanies.includes(user?.user_company?.company_name)
                //     );
                // }

                // Segment / Dept filter
                const getUserSegments = (user) => {
                    //  case: segments array
                    if (Array.isArray(user.segments)) return user.segments;

                    //  case: single segment string
                    if (typeof user.segment === "string") return [user.segment];

                    return [];
                };


                if (selectedSegment.length > 0) {
                    const normalizedSelected = selectedSegment.map(normalize);

                    filteredUsers = filteredUsers.filter(user => {
                        const userSegments = getUserSegments(user).map(normalize);

                        return normalizedSelected.some(sel =>
                            userSegments.includes(sel)
                        );
                    });
                }


                if (tab === "External-Guest" && selectedGender.length > 0) {
                    const normalizedSelectedGender = selectedGender.map(g => g.toLowerCase());

                    filteredUsers = filteredUsers.filter(user =>
                        normalizedSelectedGender.includes(user.gender?.toLowerCase())
                    );
                }




                // setUserList(response.data.response);
                // setCompany_count(response.data.response.length);

                // setUserList(filteredUsers);
                // setCompany_count(filteredUsers.length);

                // const pages = Math.ceil(filteredUsers.length / pageSize);
                // setTotalPages(pages);




                // Close all dropdowns
                // setIsOpen(false);
                // setOpen(false);
                // filterClose();
                // setIsCompanyOpen(false);
                // setIsGenderOpen(false);
                // Close all dropdowns
                setIsOpen(false);
                setOpen(false);
                filterClose();
                setIsCompanyOpen(false);
                setIsGenderOpen(false);
                setCompanySearchText("");


                if (selectedCompanyUID) {
                    fetchDept(selectedCompanyUID);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getUserListData();
    }, [activeTab, searchUser, sortBy, currentPage, selectedCompanies]);


    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCompanies, searchUser]);



    const getCompanyUserDetails = async () => {
        // FIX: guard against null/undefined userId
        if (!userId) return;
        try {
            setIsLoading(true);
            const response = await UserDetailAPI(userId);
            if (response?.data?.success) {
                setUserDetails(response.data.response);
                if (paramUid) {
                    const updatedField = { ...response?.data?.response?.user_company };  // FIX: clone before mutating
                    delete updatedField.id;
                    delete updatedField.uid;
                    delete updatedField.company_name;
                    setUserCompany(updatedField);
                }
            }
        } catch (error) {
            console.error("getCompanyUserDetails error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const userListData = async () => {
        try {
            const response = await UserRoleListAPI(loginData?.uid);
            if (response?.data?.success) {
                setRole(
                    response.data.response.map((val) => ({
                        value: val?.uid,
                        label: val?.role_name,
                        icon: val?.role_icon,
                    }))
                );
            }
        } catch (error) {
            console.error("userListData error:", error);
        }
    };

    // const getCompanyList = async () => {
    //     try {
    //         const response = await companyListAPI("", 1);
    //         if (response?.data?.success) {
    //             const list = response.data.response.map((val) => ({
    //                 value: val?.uid,
    //                 label: val?.company_name,
    //             }));
    //             setCompanyList(list);

    //             // Default-select "Casamelhor"
    //             // const defaultCompany = list.find((c) => c.label === "Angel Resort");
    //             const userLoginData = JSON.parse(localStorage.getItem("userLogin"));
    //             const loggedInCompany = userLoginData?.user_company;

    //             if (loggedInCompany) {
    //                 const defaultCompany = list.find(
    //                     (c) => c.label === loggedInCompany
    //                 );

    //                 if (defaultCompany) {
    //                     setSelectedCompanies([defaultCompany.label]);
    //                     setIsCompanyFilterApplied(true);
    //                     fetchDept(defaultCompany.value);
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error("getCompanyList error:", error);
    //     }
    // };



    const getCompanyList = async (pageNumber = 1) => {
        try {
            if (loadingCompanies) return;

            setLoadingCompanies(true);

            const response = await companyListAPI(companySearchText, pageNumber);

            if (response?.data?.success) {

                const list = response.data.response?.filter(item => !item?.is_company_inactive)?.map((val) => ({
                    value: val?.uid,
                    label: val?.company_name,
                }));

                // ✅ Append instead of replace
                setCompanyList(prev =>
                    pageNumber === 1 ? list : [...prev, ...list]
                );

                // ✅ Check if more data exists
                if (list.length === 10) {
                    setHasMore(false);
                }

                // ✅ Default-select logic ONLY on first page
                // if (pageNumber === 1) {
                //     const userLoginData = JSON.parse(localStorage.getItem("userLogin"));
                //     const loggedInCompany = userLoginData?.user_company;

                //     if (loggedInCompany) {
                //         const defaultCompany = list.find(
                //             (c) => c.label === loggedInCompany
                //         );

                //         if (defaultCompany) {
                //             setSelectedCompanies([defaultCompany.label]);
                //             setIsCompanyFilterApplied(true);
                //             fetchDept(defaultCompany.value);
                //         }
                //     }
                // }
                if (pageNumber === 1 && !companySearchText && !didSetDefaultCompany.current) {
                    const userLoginData = JSON.parse(localStorage.getItem("userLogin"));
                    const loggedInCompany = userLoginData?.user_company;
                    if (loggedInCompany) {
                        const defaultCompany = list.find(c => c.label === loggedInCompany);
                        if (defaultCompany) {
                            setSelectedCompanies([defaultCompany.label]);
                            setIsCompanyFilterApplied(true);
                            fetchDept(defaultCompany.value);
                        }
                    }
                    didSetDefaultCompany.current = true;
                }
            }

        } catch (error) {
            console.error("getCompanyList error:", error);
        } finally {
            setLoadingCompanies(false);
        }
    };


    const loadMoreCompanies = () => {
        if (!hasMore || loadingCompanies) return;

        const nextPage = page + 1;
        setPage(nextPage);
        getCompanyList(nextPage);
    };

    // useEffect(() => {
    //     getCompanyList(page)
    // }, [companySearchText])
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setHasMore(true);
            getCompanyList(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [companySearchText]);


    const fetchDept = async (company_uid) => {
        if (!company_uid) return;
        try {
            const res = await DeptDesignationAPI(company_uid);
            const apiSegments = res?.data?.response?.segments || [];
            const apiDesignations = res?.data?.response?.designations || [];
            setSegments(apiSegments.filter((item) => item && item !== "undefined"));
            setDesignations(apiDesignations.filter((item) => item && item !== "undefined"));
            const data = res?.data?.data || [];
            setDeptList(data);
            setFilteredList(data);
        } catch (e) {
            console.error("fetchDept error:", e);
        }
    };

    // ---------- EFFECTS ----------
    // Search filter on deptList
    useEffect(() => {
        if (!search.trim()) {
            setFilteredList(deptList);
        } else {
            const text = search.toLowerCase();
            setFilteredList(
                deptList.filter(
                    (item) =>
                        item?.name?.toLowerCase().includes(text) ||
                        item?.designation?.toLowerCase().includes(text)
                )
            );
        }
    }, [deptList, search]);

    // Reserve room auto-open
    useEffect(() => {
        if (ReservePageData) {
            // addTravelsetShow(true);
            removeItemLocalStorage("reserveRoom");
            removeItemLocalStorage("basicSearchObj");
        }
    }, []); // FIX: run once on mount only

    // FIX: getUserListData re-runs on tab change, search change, OR any filter change
    // useEffect(() => {
    //     getUserListData();
    // }, [activeTab, searchUser]);

    useEffect(() => {
        userListData();
        getCompanyList(1);
    }, []);

    // FIX: only fetch user details when userId is actually set
    useEffect(() => {
        if (userId) getCompanyUserDetails();
    }, [userId]);

    // URL param — open profile from query string
    useEffect(() => {
        if (paramShowModal === "true" && paramUid) {
            profilesetShow(true);
            setUserId(paramUid);
        }
    }, [paramShowModal, paramUid]);

    // ---------- RENDER ----------
    return (
        <ProtectedRoute>
            <Header />
            <div className="page-body pt-4 pb-4">
                <section className="people-section">
                    <Container>
                        <Row className="align-items-center mb-4">
                            <Col md={12}>
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div className="general-info">
                                        <h2 className="page-title">People Directories</h2>
                                    </div>
                                    {canAddUser && (
                                        <Link href="#" onClick={addTravel} className="btn-company-add">
                                            <span style={{ fontSize: "24px" }}> + </span> Add a Person
                                        </Link>
                                    )}
                                </div>
                            </Col>
                            <Col md={12}>
                                {canListUser && (
                                    <div className="search-box mb-5">
                                        {/* <input
                                            type="text"
                                            onChange={(e) => setSearchUser(e.target.value)}
                                            placeholder="Search for persons"
                                            className="form-control"
                                        /> */}

                                        <input
                                            type="text"
                                            value={searchUser}
                                            onChange={(e) => setSearchUser(e.target.value)}
                                            placeholder="Search for persons"
                                            className="form-control"
                                        />

                                        <button className="btn btn-search" onClick={getUserListData}>
                                            <Image src="/images/icons/search.svg" width={24} height={24} alt="Search" />
                                        </button>
                                    </div>
                                )}
                            </Col>
                            <Col md={12}>
                                {canListUser && (
                                    // FIX: activeKey (not accessKey)
                                    <Tabs
                                        activeKey={activeTab}
                                        id="people-tabs"
                                        className="mb-3 employee-tabs"
                                        onSelect={handleTabSelect}
                                    >
                                        {/* ===================== EMPLOYEE TAB ===================== */}
                                        <Tab eventKey="employee" title="Employee">
                                            <div className="mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3">
                                                <div className="filter-left-option gap-4 d-flex justify-content-between align-items-center">
                                                    {/* Count */}
                                                    <p className="mb-0 d-flex gap-2 align-items-center">
                                                        <Image src="./images/icons/group-user.svg" className="img-fluid" alt="user" width={24} height={24} />
                                                        {userList?.length}
                                                    </p>

                                                    {/* Role filter */}
                                                    {canListRole && (
                                                        <div className="role-select">
                                                            <button
                                                                onClick={toggleDropdown}
                                                                className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
                                                            >
                                                                Role
                                                                <Image src="./images/icons/bottom-arrow.svg" className="img-fluid" alt="bottom" width={10} height={10} />
                                                                {selectedRoles.length > 0 && (
                                                                    <span className="selected-item">{selectedRoles.length}</span>
                                                                )}
                                                            </button>
                                                            {isOpen && (
                                                                <div className="absolute mt-2 w-64 border z-10" style={{ background: "#F2F2F2", maxWidth: "317px", width: "100%" }}>
                                                                    <ul className="space-y-3 p-3 mb-0">
                                                                        {role.map((r, index) => (
                                                                            <li
                                                                                key={index}
                                                                                onClick={() => handleRoleSelect(r.label)}
                                                                                className={`gap-2 px-3 py-2 user-role-list rounded-full cursor-pointer ${selectedRoles.includes(r.label) ? "select-grey" : "hover:bg-gray-100"}`}
                                                                            >
                                                                                <span className="text-gray-600">
                                                                                    <Image src={r.icon} className="img-fluid" alt="role" width={20} height={20} />
                                                                                </span>
                                                                                <span>{r.label}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <div className="flex justify-between items-center border-top p-3">
                                                                        <button onClick={() => setSelectedRoles([])} className="text-gray-500 text-sm hover:underline">Clear all</button>
                                                                        <button onClick={getUserListData} className="bg-green-700 text-white rounded-md" style={{ padding: "12px 16px" }}>Done</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Company filter */}
                                                    {canListCompany && (
                                                        <div className="role-select">
                                                            <button
                                                                onClick={toggleCompanyDropdown}
                                                                className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
                                                            >
                                                                Company
                                                                <Image src="./images/icons/bottom-arrow.svg" className="img-fluid" alt="bottom" width={10} height={10} />
                                                                {selectedCompanies.length > 0 && (
                                                                    <span className="selected-item">{selectedCompanies.length}</span>
                                                                )}
                                                            </button>
                                                            {/* {isCompanyOpen && (
                                                            <div className="absolute top-13 mt-2 w-64 border z-10" style={{ background: "#F2F2F2", maxWidth: "317px", width: "100%" }}>
                                                                <div className="p-3" style={{ minHeight: "260px" }}>
                                                                    <ul className="Companies-list space-y-3 mb-0">
                                                                        {companyList.map((c, index) => (
                                                                            <li key={index} className="px-3 py-2 border user-role-list flex items-center justify-between">
                                                                                <label className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelectCompany(c.label)}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={selectedCompanies.includes(c.label)}
                                                                                        className="custom-checkbox"
                                                                                        readOnly
                                                                                    />
                                                                                    <span className="ml-1">{c.label}</span>
                                                                                </label>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div className="border-top flex justify-between items-center p-3">
                                                                    <button onClick={handleClearCompanies} className="text-gray-500 text-sm hover:underline">Clear all</button>
                                                                    <button onClick={getUserListData} className="bg-green-700 text-white rounded-md" style={{ padding: "12px 26px" }}>Done</button>
                                                                </div>
                                                            </div>
                                                        )} */}
                                                            {isCompanyOpen && (
                                                                <div className="absolute top-13 mt-2 w-64 border z-10" style={{ background: "#F2F2F2", maxWidth: "317px", width: "100%" }}>

                                                                    {/* Search Box */}
                                                                    <div className="p-2 border-bottom">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Search company..."
                                                                            className="form-control form-control-sm"
                                                                            value={companySearchText}
                                                                            onChange={(e) => setCompanySearchText(e.target.value)}
                                                                        />
                                                                    </div>

                                                                    <div className="p-3" style={{ minHeight: "260px" }}>
                                                                        <ul
                                                                            className="Companies-list space-y-3 mb-0"
                                                                            style={{ maxHeight: "220px", overflowY: "auto" }}
                                                                            onScroll={(e) => {
                                                                                const el = e.target;
                                                                                const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
                                                                                if (isAtBottom && !loadingCompanies && hasMore) {
                                                                                    loadMoreCompanies();
                                                                                }
                                                                            }}
                                                                        >
                                                                            {/* {companyList.filter((c) =>
                                                                                    !companySearchText ||
                                                                                    c.label.toLowerCase().includes(companySearchText.toLowerCase())
                                                                                ) */}
                                                                                {companyList?.map((c, index) => (
                                                                                    <li key={index} className="px-3 py-2 border user-role-list flex items-center justify-between">
                                                                                        <label className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelectCompany(c.label)}>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={selectedCompanies.includes(c.label)}
                                                                                                className="custom-checkbox"
                                                                                                readOnly
                                                                                            />
                                                                                            <span className="ml-1">{c.label}</span>
                                                                                        </label>
                                                                                    </li>
                                                                                ))
                                                                            }

                                                                            {/* Show loading text when fetching more */}
                                                                            {loadingCompanies && (
                                                                                <li className="px-3 py-2 text-center text-sm" style={{ color: "#888" }}>
                                                                                    Loading more...
                                                                                </li>
                                                                            )}

                                                                            {/* Show message when search finds nothing */}
                                                                            {!loadingCompanies &&
                                                                                companySearchText &&
                                                                                companyList.filter((c) =>
                                                                                    c.label.toLowerCase().includes(companySearchText.toLowerCase())
                                                                                ).length === 0 && (
                                                                                    <li className="px-3 py-2 text-center text-sm" style={{ color: "#888" }}>
                                                                                        No companies found
                                                                                    </li>
                                                                                )}
                                                                        </ul>
                                                                    </div>

                                                                    <div className="border-top flex justify-between items-center p-3">
                                                                        <button
                                                                            onClick={handleClearCompanies}
                                                                            className="text-gray-500 text-sm hover:underline"
                                                                        >
                                                                            Clear all
                                                                        </button>
                                                                        <button
                                                                            onClick={getUserListData}
                                                                            className="bg-green-700 text-white rounded-md"
                                                                            style={{ padding: "12px 26px" }}
                                                                        >
                                                                            Done
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div>
                                                    )}

                                                    {/* Dept / Segment filter */}
                                                    <div className="role-select">
                                                        <button
                                                            onClick={toggleDropdown1}
                                                            className="selected-list-border w-full position-relative border border-gray-300 role-btn rounded-md px-3 gap-3 py-2 flex justify-between items-center"
                                                        >
                                                            <span className="text-gray-700">Dept./Segment</span>
                                                            <Image src="./images/icons/bottom-arrow.svg" className="img-fluid" alt="bottom" width={10} height={10} />
                                                            {selectedSegment.length > 0 && (
                                                                <span className="selected-item">{selectedSegment.length}</span>
                                                            )}
                                                        </button>
                                                        {open && (
                                                            <div className="searching-filter absolute mt-2 w-64 border z-10" style={{ background: "#F2F2F2", maxWidth: "317px", width: "100%" }}>
                                                                <div className="p-3 position-relative" style={{ minHeight: "300px" }}>
                                                                    <div className="flex items-center border-bottom mb-2 px-2 py-2 position-relative">
                                                                        <Image src="./images/icons/search.svg" className="img-fluid mr-2" alt="search" width={16} height={16} />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Search"
                                                                            className="flex-1 outline-none text-sm"
                                                                            value={search}
                                                                            onChange={(e) => setSearch(e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className="option-list max-h-40 overflow-y-auto">
                                                                        {search.trim() !== "" &&
                                                                            segments
                                                                                .filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
                                                                                .map((opt, index) => (
                                                                                    <div
                                                                                        key={index}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleSegmentDep(opt);
                                                                                            setSearch("");
                                                                                        }}
                                                                                        className={`px-3 py-1 data-option cursor-pointer text-sm ${selectedSegment.includes(opt) ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
                                                                                    >
                                                                                        {opt}
                                                                                    </div>
                                                                                ))}
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2 px-2 py-2">
                                                                        {selectedSegment.map((item, index) => (
                                                                            <div key={index} className="selected-badge flex items-center bg-gray-100 px-3 gap-2 py-1 rounded-md text-sm">
                                                                                {item}
                                                                                <button onClick={() => handleRemove(item)} className="ml-1 text-gray-500 hover:text-black">
                                                                                    <Image src="./images/icons/x-circle.svg" alt="close" width={20} height={20} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="border-top flex justify-between items-center p-3">
                                                                    <button onClick={() => setSelectedSegment([])} className="text-sm text-gray-500 hover:text-black">Clear all</button>
                                                                    <button onClick={getUserListData} className="bg-green-700 text-white rounded-md text-sm" style={{ padding: "12px 26px" }}>Done</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Advanced Filter */}
                                                    <Button variant="" className="btn-filter position-relative selected-list-border" onClick={filterShow}>
                                                        {totalSelectedFilters > 0 && (
                                                            <span className="selected-item">{totalSelectedFilters}</span>
                                                        )}
                                                        <Image src="./images/icons/filter.svg" className="img-fluid" width={24} height={24} alt="filter" />
                                                    </Button>
                                                </div>

                                                {/* Pagination + Sort */}
                                                <div className="filter-right-option d-flex gap-3">
                                                    <div className="pagination-list d-flex gap-3 align-items-center justify-content-end">
                                                        <p className="mb-0">
                                                            <p className='mb-0'>
                                                                {userCount > 0
                                                                    ? `${start}-${end} of ${userCount}`
                                                                    : "0 results"}
                                                            </p>
                                                        </p>
                                                        <Image
                                                            src="./images/icons/back.svg"
                                                            className={`img-fluid prev-a ${currentPage === 1 ? "mute" : ""}`}
                                                            alt="back"
                                                            width={10}
                                                            height={10}
                                                            onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                                                        />
                                                        <Image
                                                            src="./images/icons/Arrows-right.svg"
                                                            className={`img-fluid next-a ${currentPage === totalPages ? "mute" : ""}`}
                                                            alt="right"
                                                            width={29}
                                                            height={29}
                                                            onClick={() => currentPage < totalPages && setCurrentPage((prev) => prev + 1)}
                                                        />
                                                    </div>
                                                    <Button variant="" className="btn-sort">
                                                        Sort by :
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

                                            {/* Employee Table */}
                                            <Table className="employee-table company-table" responsive>
                                                <thead>
                                                    <tr>
                                                        <th><div className="mwid-35">Employee</div></th>
                                                        <th><div className="mwid-20">Role</div></th>
                                                        <th><div className="mwid-20">Company</div></th>
                                                        <th><div className="mwid-20">Employee ID</div></th>
                                                        <th><div className="mwid-20">Dept./Segment</div></th>
                                                        <th><div className="mwid-20">Number of trips</div></th>
                                                        <th style={{ width: "10%", textAlign: "right" }}>
                                                            <div className="mwid-15">
                                                                <Image src="/images/icons/settings.svg" width={16} height={16} alt="Sort" className="ms-auto me-0" />
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* {paginatedUsers.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="text-center py-4">No employees found.</td>
                                                        </tr>
                                                    ) : (
                                                        paginatedUsers.map((val, index) => ( */}

                                                    {userList.map((val, index) => (
                                                        <tr key={val?.uid || index}>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <Image
                                                                        src={val.profile_image || "/images/icons/No-Image.svg"}
                                                                        width={56}
                                                                        height={104}
                                                                        className="img-fluid"
                                                                        alt="User"
                                                                        style={{ height: "104px", objectFit: "cover" }}
                                                                    />
                                                                    <p className="mb-0">
                                                                        <small>Company Employee</small><br />
                                                                        <span style={{ fontWeight: "500" }}>{val?.first_name} {val?.last_name}</span>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td>{val?.user_role?.role_name}</td>
                                                            <td>{val?.user_company?.company_name}</td>
                                                            <td>{val?.employee_id || "-"}</td>
                                                            <td>{val?.segment || "-"}</td>
                                                            <td>{val?.number_of_trips || "0"}</td>
                                                            <td>
                                                                {canRetrieveUser && (
                                                                    <Button variant="" onClick={() => showProfile(val)} className="btn-light-action mb-2">
                                                                        View Full Profile
                                                                    </Button>
                                                                )}
                                                                {canListBooking && (
                                                                    <Link href={`/Bookings?guest_uid=${val?.uid}`} className="btn-table-action gap-2">
                                                                        View Trips <Image src="./images/icons/open_in_new.svg" className="img-fluid" alt="open-new-tab" width={20} height={20} />
                                                                    </Link>
                                                                )}
                                                            </td>
                                                        </tr>

                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Tab>

                                        {/* ===================== EXTERNAL TAB ===================== */}
                                        {loginData?.user_company === "Casamelhor" && (
                                            <Tab eventKey="external" title="External">
                                                <div className="mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3">
                                                    <div className="filter-left-option gap-4 d-flex justify-content-between align-items-center">
                                                        <p className="mb-0 d-flex gap-2 align-items-center">
                                                            <Image src="./images/icons/building.svg" className="img-fluid" alt="user" width={24} height={24} />
                                                            {userList?.length}
                                                        </p>
                                                        {/* Gender filter */}
                                                        <div className="role-select">
                                                            <button
                                                                onClick={toggleGenderDropdown}
                                                                className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
                                                            >
                                                                Any Gender
                                                                <Image src="./images/icons/bottom-arrow.svg" className="img-fluid" alt="bottom" width={10} height={10} />
                                                                {selectedGender.length > 0 && (
                                                                    <span className="selected-item">{selectedGender.length}</span>
                                                                )}
                                                            </button>
                                                            {isGenderOpen && (
                                                                <div className="absolute mt-2 w-64 border z-10" style={{ background: "#F2F2F2", maxWidth: "317px", width: "100%" }}>
                                                                    <ul className="space-y-3 p-3 mb-0">
                                                                        {gender.map((g, index) => (
                                                                            <li
                                                                                key={index}
                                                                                onClick={() => handleGenderSelect(g.label)}
                                                                                className={`gap-2 px-3 py-2 user-role-list me-3 rounded-full cursor-pointer ${selectedGender.includes(g.label) ? "select-grey" : "hover:bg-gray-100"}`}
                                                                            >
                                                                                <span className="text-gray-600">
                                                                                    <Image src={g.icon} className="img-fluid" alt="role" width={20} height={20} />
                                                                                </span>
                                                                                <span>{g.label}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <div className="flex justify-between items-center border-top p-3">
                                                                        <button onClick={handleClearGender} className="text-gray-500 text-sm hover:underline">Clear all</button>
                                                                        <button onClick={getUserListData} className="bg-green-700 text-white rounded-md" style={{ padding: "12px 16px" }}>Done</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Pagination + Sort */}
                                                    <div className="filter-right-option d-flex gap-3">
                                                        <div className="pagination-list d-flex gap-3 align-items-center justify-content-end">
                                                            <p className="mb-0">
                                                                <p className='mb-0'>
                                                                    {userCount > 0
                                                                        ? `${start}-${end} of ${userCount}`
                                                                        : "0 results"}
                                                                </p>
                                                            </p>
                                                            <Image
                                                                src="./images/icons/back.svg"
                                                                className={`img-fluid prev-a ${currentPage === 1 ? "mute" : ""}`}
                                                                alt="back"
                                                                width={10}
                                                                height={10}
                                                                onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                                                            />
                                                            <Image
                                                                src="./images/icons/Arrows-right.svg"
                                                                className={`img-fluid next-a ${currentPage === totalPages ? "mute" : ""}`}
                                                                alt="right"
                                                                width={29}
                                                                height={29}
                                                                onClick={() => currentPage < totalPages && setCurrentPage((prev) => prev + 1)}
                                                            />
                                                        </div>
                                                        <Button variant="" className="btn-sort">
                                                            Sort by :
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

                                                {/* External Table */}
                                                <Table className="employee-table company-table" responsive>
                                                    <thead>
                                                        <tr>
                                                            <th><div className="mwid-35">Traveler</div></th>
                                                            <th><div className="mwid-20">Gender</div></th>
                                                            <th><div className="mwid-20">Email</div></th>
                                                            <th><div className="mwid-20">Phone number</div></th>
                                                            <th><div className="mwid-20">Number of trips</div></th>
                                                            <th style={{ width: "10%", textAlign: "right" }}>
                                                                <div className="mwid-15">
                                                                    <Image src="/images/icons/settings.svg" width={16} height={16} alt="Sort" className="ms-auto me-0" />
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* {paginatedUsers.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} className="text-center py-4">No external guests found.</td>
                                                        </tr>
                                                    ) : (
                                                        paginatedUsers.map((val, index) => ( */}
                                                        {userList.map((val, index) => (
                                                            <tr key={val?.uid || index}>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <Image
                                                                            src={val.profile_image || "/images/icons/No-Image.svg"}
                                                                            width={56}
                                                                            height={104}
                                                                            className="img-fluid"
                                                                            alt="User"
                                                                            style={{ height: "104px", objectFit: "cover" }}
                                                                        />
                                                                        <p className="mb-0">
                                                                            <small>External</small><br />
                                                                            <span style={{ fontWeight: "500" }}>{val?.first_name} {val?.last_name}</span>
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        {/* <Image src="./images/icons/Genders.svg" className="img-fluid" alt="gender" width={24} height={24} /> */}

                                                                        <Image
                                                                            src={val?.gender === "Female"
                                                                                ? "./images/icons/Genders.svg"
                                                                                : "./images/icons/male.svg"
                                                                            }
                                                                            className='img-fluid'
                                                                            alt={val?.gender}
                                                                            width={24}
                                                                            height={24}
                                                                        />
                                                                        {val?.gender}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <Image src="./images/icons/email.svg" className="img-fluid" alt="email" width={24} height={24} />
                                                                        {val?.email}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <Image src="./images/icons/call.svg" className="img-fluid" alt="call" width={24} height={24} />
                                                                        {val?.phone_number}
                                                                    </div>
                                                                </td>
                                                                <td>{val?.number_of_trips || "0"}</td>
                                                                <td>
                                                                    <Button variant="" onClick={() => showProfileExternal(val)} className="btn-light-action mb-2">
                                                                        View Full Profile
                                                                    </Button>
                                                                    <Link href={`/Bookings?guest_uid=${val?.uid}`} className="btn-table-action gap-2">
                                                                        View Trips <Image src="./images/icons/open_in_new.svg" className="img-fluid" alt="open-new-tab" width={20} height={20} />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Tab>
                                        )}
                                    </Tabs>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>

            {/* ===================== MODALS ===================== */}

            <FilterUserAll
                filtermShow={filtermShow}
                filterClose={filterClose}
                filteredList={filteredList}
                handleOptionClick={handleOptionClick}
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
                getcompanyUserList={getUserListData}
                companyList={companyList}
                activeTab={activeTab}
                handleSelectCompany={handleSelectCompany}
                handleGenderSelect={handleGenderSelect}
                handleClearCompanies={handleClearCompanies}
                selectedCompanies={selectedCompanies}
                segments={segments}
                designations={designations}
                handleSegmentDep={handleSegmentDep}
                handleSelectGender={handleSelectGender}
                showCompanyFilter={true}
                loadMoreCompanies={loadMoreCompanies}
                canListCompany={canListCompany}
                canListRole={canListRole}
                setCompanySearchText={setCompanySearchText}
            />

            <EmployeeDetailModel
                showsProfile={showsProfile}
                profileClose={profileClose}
                userDetails={userDetails}
                editemploye={editemploye}
                userCompany={userCompany}
            />

            <EmployeeExternalDetel
                showsProfileExternal={showsProfileExternal}
                profileClose={profileClose}
                userDetails={userDetails}
                editemploye={editemploye}
            />

            <EditUserProfile
                showEditBox={editsemploye}
                closeEditBox={employeClose}
                editData={userDetails}
                roleOption={role}
                companyList={companyList}
                openEditBox={editemploye}
                getUserListData={getUserListData}
                loadMoreCompanies={loadMoreCompanies}
            />

            <AddPersonModel
                addTravels={addTravels}
                removeTravel={removeTravel}
                roleOption={role}
                companyList={companyList}
                addTravel={addTravel}
                loadMoreCompanies={loadMoreCompanies}
                setSearchComp={setSearchKey}
                getUserListData={getUserListData}
                refreshCompanyList={() => {
                    setPage(1);
                    setHasMore(true);
                    setCompanyList([]);
                    getCompanyList(1);
                }}
            />

            {/* Delete photo modal */}
            <Modal show={deletespicModal} onHide={deletepicClose} animation={false} centered className="custom-theme-modal">
                <Modal.Header className="d-flex align-items-center justify-content-between border-bottom">
                    <Modal.Title>Remove profile photo?</Modal.Title>
                    <Image src="/images/icons/close-circle.svg" width={24} height={24} alt="Close" style={{ cursor: "pointer" }} onClick={deletepicClose} />
                </Modal.Header>
                <Modal.Body className="pt-4 pb-4">
                    <p>{`Are you sure you want to remove this photo? We'll replace it with a default Alice avatar.`}</p>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-between">
                    <Button variant="" onClick={deletepicClose} className="btn-company-add" style={{ padding: "13px 25px", borderRadius: "0" }}>Cancel</Button>
                    <Button variant="" onClick={deletepicClose} className="search-btn complete-form-btn" style={{ padding: "13px 25px", borderRadius: "0" }}>Yes, Remove</Button>
                </Modal.Footer>
            </Modal>

            {/* Change photo modal */}
            <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className="custom-theme-modal">
                <Modal.Header className="d-flex align-items-center justify-content-between pb-0">
                    <Modal.Title>Upload photo</Modal.Title>
                    <Image src="/images/icons/close-circle.svg" width={24} height={24} alt="Close" style={{ cursor: "pointer" }} onClick={changepicClose} />
                </Modal.Header>
                <Modal.Body className="pt-4 pb-4">
                    <p className="border-bottom pb-4">Please upload the profile photo</p>
                    <div className="drap-drop-box-full">
                        {!file ? (
                            <label onDrop={handleDrop} onDragOver={handleDragOver} className="border-2 border-dashed border-gray-300 rounded-md h-48 flex flex-col items-center justify-center cursor-pointer">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                <div className="text-center">
                                    <Image src="/images/icons/photo-library.svg" alt="Upload" width={30} height={30} className="mx-auto mb-2" />
                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>Drag and drop</p>
                                    <p className="text-sm text-gray-500 mb-0" style={{ color: "#73615F" }}>or click here to choose file.</p>
                                </div>
                            </label>
                        ) : (
                            <div className="relative inline-block">
                                <Image src={file} alt="Uploaded preview" width={250} height={250} className="rounded-md object-cover" />
                                <button onClick={removeFile} className="absolute delete-icn">
                                    <Image src="./images/icons/delete.svg" className="img-fluid" width={24} height={24} alt="delete" />
                                </button>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-between">
                    <Button variant="" onClick={changepicClose} className="btn-company-add" style={{ padding: "13px 25px", borderRadius: "0" }}>Cancel</Button>
                    <Button variant="" onClick={changepicClose} className="search-btn complete-form-btn" style={{ padding: "13px 25px", borderRadius: "0" }}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </ProtectedRoute>
    );
}
