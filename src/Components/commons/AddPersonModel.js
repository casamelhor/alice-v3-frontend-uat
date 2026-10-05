// "use client"
// import React, { useEffect, useState } from 'react'
// import { Row, Col, Button, Modal } from 'react-bootstrap';
// import Image from 'next/image';
// import Select, { components } from 'react-select';
// import { useParams, usePathname } from 'next/navigation';
// import { travellerValidation } from '@/utils/validation';
// import { AddCompanyUserAPI, AddExternalGuestUserAPI, companyDetailAPI } from '@/services/provider';
// import Link from 'next/link';
// import { getItemLocalStorage } from '@/utils/browserStorage';
// import { alert_danger, alert_success } from '@/utils/Alerts/TostifyAlerts';
// import toast, { Toaster } from 'react-hot-toast';
// // import { ToastContainer } from 'react-toastify';


// export const AddPersonModel = ({ addTravel, addTravels, removeTravel, companyDetail, editData, roleOption, companyList, loadMoreCompanies }) => {
//     const [changepicsModal, changepisetShow] = useState(false);
//     const changepicClose = () => changepisetShow(false);
//     const changepicModal = () => { changepisetShow(true); removeTravel(); };
//     const [showPass, setShowPass] = useState(false)
//     const [showcPass, setShowcPass] = useState(false)
//     const loginData = JSON.parse(getItemLocalStorage("userLogin"));
//     const [showPhoto, setShowPhoto] = useState(true);
//     //   drag drop upload

//     const [file, setFile] = useState(null);
//     const param = useParams();
//     const id = param.id;
//     const pathname = usePathname();
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         gender: "",
//         companyName: "",
//         designation: "",
//         employee_id: "",
//         email: "",
//         phone: "",
//         role: "",
//         rezo_ticket: "",
//         traveller_type: "",
//         segment: "",
//         employee_grade: "",
//         account_unit: "",
//         account_code: "",
//         roleLabel: "",
//         password: "",
//         con_password: "",
//         profile_image: null
//     });

//     const initialFormState = {
//         firstName: "",
//         lastName: "",
//         gender: "",
//         companyName: "",
//         designation: "",
//         employee_id: "",
//         email: "",
//         phone: "",
//         role: "",
//         rezo_ticket: "",
//         traveller_type: "",
//         segment: "",
//         employee_grade: "",
//         account_unit: "",
//         account_code: "",
//         roleLabel: "",
//         password: "",
//         con_password: "",
//         profile_image: null
//     };


//     const [requiredField, setRequiredField] = useState({
//         // phone_required: null,
//         employee_id_required: null,
//         segment_required: null,
//         designation_required: null,
//         employee_grade_required: null,
//         account_unit_required: null,
//         account_code_required: null,
//     });
//     const [errorMessages, setErrorMessages] = useState({});
//     const genderOption = [
//         { value: "Male", label: "Male", icon: "../images/icons/male.svg" },
//         { value: "Female", label: "Female", icon: "../images/icons/Genders.svg" }
//     ]
//     const [companyInfo, setCompanyInfo] = useState({})
//     const [customFields, setCustomFields] = useState({});
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

//     const togglePicOption = () => {
//         setIsOpen((prev) => !prev);
//     };

//     const [isOpen, setIsOpen] = useState(false);

//     const handleFileChange = (e) => {
//         const uploadedFile = e.target.files[0];
//         setFormData({
//             ...formData,
//             profile_image: uploadedFile
//         })
//         if (uploadedFile) {
//             setFile(URL.createObjectURL(uploadedFile));
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         const uploadedFile = e.dataTransfer.files[0];
//         setFormData({
//             ...formData,
//             profile_image: uploadedFile
//         })
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


//     const cmpOption = [
//         { value: "SchlumbergerAsiaServiceLtd", label: "Schlumberger Asia Service Ltd" },
//         // { value: "female", label: "Female" }
//     ]


//     const travelOption = [
//         {
//             value: "Company-Employee",
//             label: "Company employee",
//             icon: "../images/icons/hail.svg"
//         },
//         {
//             value: "External-Guest",
//             label: "External",
//             icon: "../images/icons/short_stay.svg"
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
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         let newData = { [name]: value }
//         setFormData({
//             ...formData,
//             [name]: value
//         })
//         const { errors } = travellerValidation(newData, formData.password, requiredField)
//         setErrorMessages({
//             ...errorMessages,
//             ...errors
//         })
//     }
//     const handleSelectDropdown = (e, name) => {
//         const { value } = e
//         let newVal = { [name]: value }
//         if (name === "traveller_type") {
//             if (value === "External-Guest") {
//                 const roleValue = roleOption?.find(item => item.label == "External")
//                 const updatedForm = { ...formData, traveller_type: value, role: roleValue?.value };
//                 delete updatedForm.segment;
//                 delete updatedForm.designation;
//                 delete updatedForm.employee_grade;
//                 delete updatedForm.account_unit;
//                 delete updatedForm.account_code;
//                 delete updatedForm.employee_id;
//                 delete updatedForm.companyName;
//                 // delete updatedForm.role;
//                 delete updatedForm.password;
//                 delete updatedForm.con_password;
//                 setFormData(updatedForm);
//             } else {
//                 setFormData((prev) => ({
//                     ...prev,
//                     traveller_type: value,
//                     segment: "",
//                     designation: "",
//                     employee_grade: "",
//                     account_unit: "",
//                     account_code: "",
//                     employee_id: "",
//                     role: ''
//                 }));
//             }
//         } else {
//             setFormData((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//         const { errors } = travellerValidation(newVal, formData.password, requiredField)
//         setErrorMessages({
//             ...errorMessages,
//             ...errors
//         })
//     }
//     const handleSelectCustomField = (e, name) => {
//         setCustomFields({
//             ...customFields,
//             [name]: e.value
//         })
//     }
//     useEffect(() => {
//         if (loginData?.user_company !== "Casamelhor") {
//             setFormData({
//                 ...formData,
//                 companyName: loginData?.uid
//             })
//         }
//     }, [addTravels])
//     const getcompanyDetail = async () => {
//         try {
//             const response = await companyDetailAPI(formData.companyName);
//             if (response?.data?.success) {
//                 setCompanyInfo(response?.data?.response)
//                 setRequiredField({
//                     // phone_required: response?.data?.response?.is_phone_required,
//                     employee_id_required: response?.data?.response?.is_employee_id_required,
//                     segment_required: response?.data?.response?.is_segment_required,
//                     designation_required: response?.data?.response?.is_designation_required,
//                     employee_grade_required: response?.data?.response?.is_employee_grade_required,
//                     account_unit_required: response?.data?.response?.is_account_unit_required,
//                     account_code_required: response?.data?.response?.is_account_code_required
//                 })
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     useEffect(() => {
//         getcompanyDetail()
//     }, [formData.companyName]);


//     // const handleAddPerson = async () => {
//     //     try {
//     //         const { isValid, errors } = travellerValidation(
//     //             formData,
//     //             formData.password,
//     //             requiredField
//     //         );

//     //         setErrorMessages(errors);

//     //         if (!isValid) return;

//     //         const fieldData = new FormData();
//     //         fieldData.append("first_name", formData.firstName);
//     //         fieldData.append("last_name", formData.lastName);
//     //         fieldData.append("gender", formData.gender);
//     //         fieldData.append("user_category", formData.traveller_type);
//     //         fieldData.append("user_company", id ? id : formData.companyName);
//     //         fieldData.append("user_role", formData.role);
//     //         fieldData.append("employee_id", formData.employee_id);
//     //         fieldData.append("email", formData.email);
//     //         fieldData.append("phone_number", formData.phone);
//     //         fieldData.append("segment", formData.segment);
//     //         fieldData.append("designation", formData.designation);
//     //         fieldData.append("employee_grade", formData.employee_grade);
//     //         fieldData.append("account_unit", formData.account_unit);
//     //         fieldData.append("account_code", formData.account_code);
//     //         fieldData.append("new_password", formData.password);
//     //         fieldData.append("confirm_new_password", formData.con_password);
//     //         fieldData.append("profile_image", formData.profile_image);
//     //         fieldData.append(
//     //             "custom_fields",
//     //             JSON.stringify(customFields || {})
//     //         );

//     //         let response;
//     //         if (formData.traveller_type === "Company-Employee") {
//     //             response = await AddCompanyUserAPI(fieldData);
//     //         } else {
//     //             response = await AddExternalGuestUserAPI(fieldData);
//     //         }


//     //         if (!response?.data?.success) {
//     //             alert_danger(
//     //                 getBackendErrorMessage(response?.data) || "Something went wrong"
//     //             );
//     //             return;
//     //         }

//     //         alert_success(
//     //             response?.data?.message || "User added successfully"
//     //         );

//     //         removeTravel();

//     //     } catch (error) {
//     //         const errorMsg = getBackendErrorMessage(
//     //             error?.response?.data
//     //         );

//     //         alert_danger(errorMsg || "Something went wrong");
//     //     }
//     // };



//     const handleAddPerson = async () => {
//         try {
//             const { isValid, errors } = travellerValidation(
//                 formData,
//                 formData.password,
//                 requiredField
//             );

//             setErrorMessages(errors);
//             if (!isValid) return;

//             // ✅ ALWAYS resolve role safely
//             // const userRole = formData.role || roleOption?.[0]?.value;

//             // if (!userRole) {
//             //     // alert_danger("User role is required");
//             //     toast.error('User role is required')
//             //     return;
//             // }

//             const fieldData = new FormData();

//             // 🔹 COMMON FIELDS (BOTH CASES)
//             fieldData.append("first_name", formData.firstName);
//             fieldData.append("last_name", formData.lastName);
//             fieldData.append("gender", formData.gender);
//             fieldData.append("user_category", formData.traveller_type);
//             fieldData.append("email", formData.email);
//             fieldData.append("phone_number", formData.phone);
//             if (formData.role) fieldData.append("user_role", formData.role);
//             fieldData.append("new_password", formData.password);
//             fieldData.append("confirm_new_password", formData.con_password);

//             if (formData.profile_image) {
//                 fieldData.append("profile_image", formData.profile_image);
//             }

//             // 🔹 COMPANY-EMPLOYEE ONLY
//             if (formData.traveller_type === "Company-Employee") {
//                 fieldData.append("user_company", id ? id : formData.companyName);

//                 // append ONLY if value exists (safe)
//                 if (formData.employee_id)
//                     fieldData.append("employee_id", formData.employee_id);

//                 if (formData.segment)
//                     fieldData.append("segment", formData.segment);

//                 if (formData.designation)
//                     fieldData.append("designation", formData.designation);

//                 if (formData.employee_grade)
//                     fieldData.append("employee_grade", formData.employee_grade);

//                 if (formData.account_unit)
//                     fieldData.append("account_unit", formData.account_unit);

//                 if (formData.account_code)
//                     fieldData.append("account_code", formData.account_code);

//                 if (customFields && Object.keys(customFields).length > 0) {
//                     fieldData.append(
//                         "custom_fields",
//                         JSON.stringify(customFields)
//                     );
//                 }
//             }

//             // 🔹 API CALL
//             const response =
//                 formData.traveller_type === "Company-Employee"
//                     ? await AddCompanyUserAPI(fieldData)
//                     : await AddExternalGuestUserAPI(fieldData);

//             if (!response?.data?.success) {
//                 // alert_danger(
//                 //     getBackendErrorMessage(response?.data) || "Something went wrong"
//                 // );
//                 toast.error(getBackendErrorMessage(response?.data) || "Something went wrong")
//                 return;
//             }

//             // alert_success(
//             //     response?.data?.message || "User added successfully"

//             // );
//             toast.success(response?.data?.message || "User added successfully")
//             setFormData(initialFormState);

//             setFile(null);

//             removeTravel();

//         } catch (error) {
//             const errorMsg = getBackendErrorMessage(error?.response?.data);
//             toast.error(errorMsg || "Something went wrong");
//         }
//     };



//     const getBackendErrorMessage = (data) => {
//         if (!data) return "Something went wrong";

//         //  direct message
//         if (data.message) return data.message;

//         //  backend nested response 
//         if (data.response && typeof data.response === "object") {
//             const key = Object.keys(data.response)[0];
//             if (Array.isArray(data.response[key])) {
//                 return data.response[key][0];
//             }
//         }

//         // direct field-wise error
//         if (typeof data === "object") {
//             const key = Object.keys(data)[0];
//             if (Array.isArray(data[key])) {
//                 return data[key][0];
//             }
//         }

//         return "Something went wrong. Please try again.";
//     };




//     console.log(formData, id, companyDetail);
//     console.log(companyInfo)
//     console.log(customFields)
//     return (
//         <>
//             <Toaster position="top-right" />
//             <Modal show={addTravels} onHide={removeTravel} animation={false} centered className='custom-theme-modal traveler-modal  status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
//                     <Modal.Title className='d-flex align-items-center gap-3'>
//                         Add a person
//                     </Modal.Title>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     <Row className='justify-content-between'>
//                         <Col md={9}>
//                             <p className='font-18'>
//                                 Personal information
//                             </p>
//                             <p style={{ color: '#73615F' }} >Enter the following information exactly the same as it appears on the traveler’s passport or ID.</p>
//                             <div className='form-group mb-4'>
//                                 <label>First name</label>
//                                 <input type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} className='form-control' placeholder='Enter First name' />
//                                 <span className='text-danger'>{errorMessages.firstName}</span>
//                             </div>
//                             <div className='form-group mb-4'>
//                                 <label>Last name</label>
//                                 <input type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} className='form-control' placeholder='Enter Last name' />
//                                 <span className='text-danger'>{errorMessages.lastName}</span>
//                             </div>
//                             <Row>
//                                 <Col md="6">
//                                     <div className='form-group mb-4'>
//                                         <label>Gender</label>
//                                         {/* gender select */}
//                                         <Select
//                                             name="gender"
//                                             options={genderOption}
//                                             placeholder="Select a Gender"
//                                             value={genderOption.find((opt) => opt.value == formData.gender)}
//                                             className='react_selectbox '
//                                             isSearchable={false}
//                                             styles={customStyles}
//                                             onChange={(e) => handleSelectDropdown(e, "gender")}
//                                             components={{ Option: CustomOption1, SingleValue: CustomSingleValue1 }}
//                                         />
//                                         <span className='text-danger'>{errorMessages.gender}</span>
//                                     </div>
//                                 </Col>
//                             </Row>

//                             <p className='subheadline-2'>Traveler category</p>
//                             <div className='form-group mb-4'>
//                                 <Select
//                                     name="traveller_type"
//                                     options={travelOption}
//                                     value={travelOption.find((opt) => opt.value == formData.traveller_type)}
//                                     placeholder="Choose Role"
//                                     className='react_selectbox '
//                                     isSearchable={false}
//                                     styles={customStyles}
//                                     onChange={(e) => handleSelectDropdown(e, "traveller_type")}
//                                     components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//                                 />
//                                 <span className='text-danger'>{errorMessages.traveller_type}</span>
//                             </div>

//                             {formData?.traveller_type == "Company-Employee" && (
//                                 <>
//                                     <div className='form-group mb-4'>
//                                         <label>Company</label>
//                                         {loginData?.user_company == "Casamelhor" ?
//                                             // <Select
//                                             //     name="companyName"
//                                             //     value={companyList?.find((opt) => opt?.value == formData.companyName)}
//                                             //     options={companyList}
//                                             //     placeholder="Choose Company"
//                                             //     className='react_selectbox'
//                                             //     isSearchable={false}
//                                             //     onChange={(e) => handleSelectDropdown(e, "companyName")}
//                                             //     styles={customStyles}
//                                             // />

//                                             <Select
//                                                 name="companyName"
//                                                 value={companyList?.find((opt) => opt?.value == formData.companyName)}
//                                                 options={companyList}
//                                                 placeholder="Choose Company"
//                                                 className='react_selectbox'
//                                                 isSearchable={true}
//                                                 onMenuScrollToBottom={loadMoreCompanies}   // ✅ infinite scroll
//                                                 onChange={(e) => handleSelectDropdown(e, "companyName")}
//                                                 styles={customStyles}
//                                             />


//                                             : <input type='text' name='companyName' value={loginData?.user_company} className='form-control' placeholder='Enter First name' disabled />}
//                                         <span className='text-danger'>{errorMessages.companyName}</span>
//                                     </div>

//                                     <div className='form-group mb-4'>
//                                         <label>Role</label>
//                                         <Select
//                                             name="role"
//                                             value={roleOption?.find((opt) => opt.value == formData.role)}
//                                             options={roleOption}
//                                             placeholder="Choose Role"
//                                             className='react_selectbox role-icn-2'
//                                             isSearchable={false}
//                                             onChange={(e) => handleSelectDropdown(e, "role")}
//                                             // defaultValue={role[0]}
//                                             styles={customStyles}
//                                         />
//                                         <span className='text-danger'>{errorMessages.role}</span>
//                                     </div>

//                                     {companyInfo?.is_employee_id_required != "Off" && (
//                                         <div className='form-group mb-4'>
//                                             <label>{companyInfo?.employee_id_display_name}</label>
//                                             {companyInfo?.employee_id_options?.length > 0 ? (
//                                                 <Select
//                                                     name="employee_id"
//                                                     value={companyInfo?.employee_id_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.employee_id)}
//                                                     options={companyInfo?.employee_id_options?.map((val) => ({ value: val, label: val }))}
//                                                     placeholder="Choose Employee ID"
//                                                     className='react_selectbox'
//                                                     isSearchable={false}
//                                                     onChange={(e) => handleSelectDropdown(e, "employee_id")}
//                                                     // defaultValue={role[0]}
//                                                     styles={customStyles}
//                                                 />
//                                             ) : (
//                                                 <input type='text' name='employee_id' onChange={handleInputChange} className='form-control' placeholder='Enter Employee ID' />
//                                             )}
//                                             <span className='text-danger'>{errorMessages.employee_id}</span>
//                                         </div>
//                                     )}

//                                     {companyInfo?.is_segment_required != "Off" && (
//                                         <div className='form-group mb-4'>
//                                             <label>{companyInfo?.segment_display_name}</label>
//                                             {companyInfo?.segment_options?.length > 0 ? (
//                                                 <Select
//                                                     name="segment"
//                                                     value={companyInfo?.segment_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.segment)}
//                                                     options={companyInfo?.segment_options?.map((val) => ({ value: val, label: val }))}
//                                                     placeholder="Choose segment"
//                                                     className='react_selectbox'
//                                                     isSearchable={false}
//                                                     onChange={(e) => handleSelectDropdown(e, "segment")}
//                                                 />
//                                             ) : (
//                                                 <input type='text' name='segment' onChange={handleInputChange} className='form-control' placeholder='Enter Dept./Segment' />
//                                             )}
//                                             <span className='text-danger'>{errorMessages.segment}</span>
//                                         </div>
//                                     )}

//                                     {companyInfo?.is_designation_required != "Off" && (
//                                         <div className='form-group mb-4'>
//                                             <label>{companyInfo?.designation_display_name}</label>
//                                             {companyInfo?.designation_options?.length > 0 ? (
//                                                 <Select
//                                                     name="designation"
//                                                     value={companyInfo?.designation_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.designation)}
//                                                     options={companyInfo?.designation_options?.map((val) => ({ value: val, label: val }))}
//                                                     placeholder="Choose designation"
//                                                     className='react_selectbox'
//                                                     isSearchable={false}
//                                                     onChange={(e) => handleSelectDropdown(e, "designation")}
//                                                 />

//                                             ) : (
//                                                 <input type='text' name='designation' onChange={handleInputChange} className='form-control' placeholder='Enter Designation' />
//                                             )}
//                                             <span className='text-danger'>{errorMessages.designation}</span>
//                                         </div>
//                                     )}

//                                     {companyInfo?.is_employee_grade_required != "Off" && (
//                                         <div className='form-group mb-4'>
//                                             <label>{companyInfo?.employee_grade_display_name}</label>
//                                             {companyInfo?.employee_grade_options?.length > 0 ? (
//                                                 <Select
//                                                     name="employee_grade"
//                                                     value={companyInfo?.employee_grade_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.employee_grade)}
//                                                     options={companyInfo?.employee_grade_options?.map((val) => ({ value: val, label: val }))}
//                                                     placeholder="Choose Employee Grade"
//                                                     className='react_selectbox'
//                                                     isSearchable={false}
//                                                     onChange={(e) => handleSelectDropdown(e, "employee_grade")}
//                                                 />
//                                             ) : (
//                                                 <input type='text' name='employee_grade' onChange={handleInputChange} className='form-control' placeholder='Enter Employee Grade' />
//                                             )}
//                                             <span className='text-danger'>{errorMessages.employee_grade}</span>
//                                         </div>
//                                     )}

//                                     {companyInfo?.is_account_unit_required != "Off" && (
//                                         <div className='form-group mb-4'>
//                                             <label>{companyInfo?.account_unit_display_name}</label>
//                                             {companyInfo?.account_unit_options?.length > 0 ? (
//                                                 <Select
//                                                     name="account_unit"
//                                                     value={companyInfo?.account_unit_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.account_unit)}
//                                                     options={companyInfo?.account_unit_options?.map((val) => ({ value: val, label: val }))}
//                                                     placeholder="Choose account_unit"
//                                                     className='react_selectbox'
//                                                     isSearchable={false}
//                                                     onChange={(e) => handleSelectDropdown(e, "account_unit")}
//                                                 />
//                                             ) : (
//                                                 <input type='text' name='account_unit' onChange={handleInputChange} className='form-control' placeholder='Enter Account Unit' />
//                                             )}
//                                             <span className='text-danger'>{errorMessages.account_unit}</span>
//                                         </div>
//                                     )}

//                                     {companyInfo?.is_account_code_required != "Off" && (
//                                         <div className='form-group mb-4'>
//                                             <label>{companyInfo?.account_code_display_name}</label>
//                                             {companyInfo?.account_code_options?.length > 0 ? (
//                                                 <Select
//                                                     name="account_code"
//                                                     value={companyInfo?.account_code_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.account_code)}
//                                                     options={companyInfo?.account_code_options?.map((val) => ({ value: val, label: val }))}
//                                                     placeholder="Choose account_code"
//                                                     className='react_selectbox'
//                                                     isSearchable={false}
//                                                     onChange={(e) => handleSelectDropdown(e, "account_code")}
//                                                 />

//                                             ) : (
//                                                 <input type='text' name='account_code' onChange={handleInputChange} className='form-control' placeholder='Enter Account Code' />
//                                             )}
//                                             <span className='text-danger'>{errorMessages.account_code}</span>
//                                         </div>
//                                     )}

//                                 </>
//                             )}

//                             {formData?.traveller_type === "Company-Employee" && companyInfo?.custom_display_field_name &&
//                                 Object.entries(companyInfo?.custom_display_field_name)?.length > 0 && (
//                                     <>
//                                         {Object.entries(companyInfo?.custom_display_field_name)?.map(([key, field]) => {
//                                             return field.type === "dropdown" ? (
//                                                 <div className="form-group mb-4" key={key}>
//                                                     <label>{field.display_name}</label>
//                                                     <Select
//                                                         key={key}
//                                                         name={field.display_name}
//                                                         options={field.values.map((val) => ({ label: val, value: val }))}
//                                                         placeholder={`Select ${field.display_name}`}
//                                                         className="react_selectbox"
//                                                         isSearchable={false}
//                                                         styles={customStyles}
//                                                         onChange={(e) => handleSelectCustomField(e, key)}
//                                                     // components={{ Option: CustomOption1, SingleValue: CustomSingleValue1 }}
//                                                     />
//                                                 </div>
//                                             ) : (
//                                                 <div className="form-group mb-4" key={key}>
//                                                     <label>{field.display_name}</label>
//                                                     <input
//                                                         type="text"
//                                                         name={field.display_name}
//                                                         // value={field.display_name || ""}
//                                                         onChange={(e) => { setCustomFields({ ...customFields, [key]: e.target.value }) }}
//                                                         className="form-control"
//                                                         placeholder={`Enter ${field.display_name}`}
//                                                     />
//                                                     <span className="text-danger">{errorMessages[key]}</span>
//                                                 </div>
//                                             );
//                                         })}
//                                     </>
//                                 )}
//                             <p className='subheadline-2'>Contact information</p>
//                             <div className='form-group mb-4'>
//                                 <label>Email</label>
//                                 <input type='email' name='email' value={formData.email} onChange={handleInputChange} className='form-control' placeholder='Enter email ' />
//                                 <span className='text-danger'>{errorMessages.email}</span>
//                             </div>
//                             {/* {companyInfo?.is_phone_required != "Off" && ( */}
//                             <div className='form-group '>
//                                 <label>Phone number</label>
//                                 <input type='tel' name='phone' onChange={handleInputChange} className='form-control' placeholder='Enter phone ' value={formData.phone} autoComplete="off" />
//                                 <span className='text-danger'>{errorMessages.phone}</span>
//                             </div>
//                             {/* )} */}

//                             {/* {formData?.traveller_type == "Company-Employee" && ( */}
//                             <>
//                                 <p className='subheadline-2 mt-3'>Login information</p>
//                                 <div className='form-group relative mb-4'>
//                                     <label>New Password</label>
//                                     <input type={showPass ? 'text' : 'password'} name='password' value={formData.password} onChange={handleInputChange} className='form-control' placeholder='Enter Password ' autoComplete="new-password" />
//                                     <span className='absolute top-4 mt-4 right-2' onClick={() => setShowPass(!showPass)} style={{ cursor: 'pointer' }}>Show</span>
//                                     <span className='text-danger'>{errorMessages.password}</span>
//                                 </div>
//                                 <div className='form-group relative mb-4'>
//                                     <label>Confirm New Password</label>
//                                     <input type={showcPass ? 'text' : 'password'} name='con_password' value={formData.con_password} onChange={handleInputChange} className='form-control' placeholder='Confirm Password' autoComplete="new-password" />
//                                     <span className='absolute top-4 mt-4 right-2' onClick={() => setShowcPass(!showcPass)} style={{ cursor: 'pointer' }}>Show</span>
//                                     <span className='text-danger'>{errorMessages.con_password}</span>
//                                 </div>
//                             </>
//                             {/* )} */}

//                         </Col>

//                         {/* <Col md={3}>
//                             <p className='subheadline-2'>Traveler photo</p>

//                             <div className='add-upload-photo' style={{ border: '1px solid #dedede' }} >
//                                 <Image src={file || "../images/icons/photo-camera.svg"} className='img-fluid' alt='camera' width={file ? 150 : 48}
//                                     height={file ? 150 : 48}
//                                     style={{ objectFit: 'cover', borderRadius: file ? '8px' : '0' }} />


//                                 {!file && (
//                                     <Button variant='' onClick={() => {
//                                         //     handleOptionClick();
//                                         changepicModal();
//                                         removeFile()
//                                         // removeTravel();
//                                     }} className='add-photo-btn mt-2'>
//                                         Add Photo
//                                     </Button>
//                                 )}
//                             </div>
//                         </Col> */}
//                         <Col md={3}>
//                             <p className='subheadline-2'>Traveler photo</p>
//                             {file && (
//                                 <div className='upload-photo'>
//                                     <Image src={file ? file : '../images/icons/No-Image.svg'} className='img-fluid' alt='profile' width={214} height={214} />
//                                     {/* <Image src={file ? file : '/images/icons/photo-camera.svg'} className='img-fluid' alt='profile' width={214} height={214} /> */}
//                                     <span className='more-action' onClick={togglePicOption}  >
//                                         <Image src='../images/icons/more-dots-3.svg' className='img-fluid' alt='more' width={24} height={24} />
//                                     </span>
//                                     <ul className={`picoption ${isOpen ? "active" : ""}`}>
//                                         <li>
//                                             <Link onClick={() => {
//                                                 // handleOptionClick();
//                                                 changepicModal();
//                                                 setIsOpen(false)
//                                                 // closeEditBox();
//                                             }} href='#'>Change Photo</Link>
//                                         </li>
//                                         <li>
//                                             <Link onClick={() => {
//                                                 // employeClose();
//                                                 // handleOptionClick();
//                                                 // deletepicModal();
//                                                 setIsOpen(false)
//                                                 removeFile();
//                                                 // setShowPhoto(false);
//                                             }} href='#'>Delete</Link>
//                                         </li>
//                                     </ul>
//                                 </div>
//                             )}

//                             {!file && (

//                                 <div className='add-upload-photo' style={{ border: '1px solid #dedede' }} >
//                                     <Image src={"/images/icons/photo-camera.svg"} className='img-fluid' alt='camera' width={48} height={48} />
//                                     <Button variant='' onClick={() => {
//                                         //     handleOptionClick();
//                                         // removeFile()
//                                         changepicModal();
//                                         // setShowPhoto(true);
//                                         // removeTravel();
//                                     }} className='add-photo-btn mt-2'>
//                                         Add Photo
//                                     </Button>
//                                 </div>
//                             )}
//                         </Col>
//                     </Row>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <Button variant="" style={{ padding: '13px 25px' }} onClick={handleAddPerson} className='btn-company-add '>
//                         Cancel
//                     </Button>
//                     <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}
//                         // onClick={filterClose}
//                         onClick={handleAddPerson}
//                     >
//                         Add a person
//                     </Button>
//                 </Modal.Footer>
//             </Modal>





//             <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

//                     <Modal.Title>
//                         Upload photo

//                     </Modal.Title>

//                     <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-4 pb-4'>
//                     {!file && (<p className='border-bottom pb-4'>Please upload Operations managers photo</p>)}


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
//                     <Button variant="" onClick={changepicClose}
//                         className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
//                         Cancel
//                     </Button>
//                     {/* <Button variant="" onClick={() => {
//                         changepicClose();
//                         addTravel();
//                     }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
//                         Upload
//                     </Button> */}

//                     <Button
//                         variant=""
//                         onClick={() => {
//                             if (file) {
//                                 toast.success("Photo uploaded successfully");
//                                 changepicClose();
//                                 addTravel();
//                             } else {
//                                 toast.error("Please upload a photo first");
//                             }
//                         }}
//                         className='search-btn complete-form-btn'
//                         style={{ padding: '13px 25px', borderRadius: '0' }}
//                     >
//                         Upload
//                     </Button>

//                 </Modal.Footer>
//             </Modal>

//         </>
//     )
// }


"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal } from 'react-bootstrap';
import Image from 'next/image';
import Select, { components } from 'react-select';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { travellerValidation } from '@/utils/validation';
import { AddCompanyUserAPI, AddExternalGuestUserAPI, companyDetailAPI } from '@/services/provider';
import Link from 'next/link';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { alert_danger, alert_success } from '@/utils/Alerts/TostifyAlerts';
import toast, { Toaster } from 'react-hot-toast';
// import { ToastContainer } from 'react-toastify';


export const AddPersonModel = ({ addTravel, addTravels, removeTravel, companyDetail, companyUid, editData, roleOption, companyList, loadMoreCompanies,setSearchComp, getUserListData, refreshCompanyList }) => {
    const [changepicsModal, changepisetShow] = useState(false);
    const changepicClose = () => changepisetShow(false);
    const changepicModal = () => { changepisetShow(true); removeTravel(); };
    const [showPass, setShowPass] = useState(false)
    const [showcPass, setShowcPass] = useState(false)
    const loginData = JSON.parse(getItemLocalStorage("userLogin"));
    const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
    const [showPhoto, setShowPhoto] = useState(true);
    //   drag drop upload

    const [file, setFile] = useState(null);
    const searchParams = useSearchParams();
    const id = searchParams.get("uid");
    const pathname = usePathname();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        companyName: "",
        designation: "",
        employee_id: "",
        email: "",
        phone: "",
        role: "",
        rezo_ticket: "",
        traveller_type: "",
        segment: "",
        employee_grade: "",
        account_unit: "",
        account_code: "",
        roleLabel: "",
        password: "",
        con_password: "",
        profile_image: null
    });

    const initialFormState = {
        firstName: "",
        lastName: "",
        gender: "",
        companyName: "",
        designation: "",
        employee_id: "",
        email: "",
        phone: "",
        role: "",
        rezo_ticket: "",
        traveller_type: "",
        segment: "",
        employee_grade: "",
        account_unit: "",
        account_code: "",
        roleLabel: "",
        password: "",
        con_password: "",
        profile_image: null
    };


    const [requiredField, setRequiredField] = useState({
        // phone_required: null,
        employee_id_required: null,
        segment_required: null,
        designation_required: null,
        employee_grade_required: null,
        account_unit_required: null,
        account_code_required: null,
    });
    const [errorMessages, setErrorMessages] = useState({});
    const genderOption = [
        { value: "Male", label: "Male", icon: "../images/icons/male.svg" },
        { value: "Female", label: "Female", icon: "../images/icons/Genders.svg" }
    ]
    const [companyInfo, setCompanyInfo] = useState({})
    const [customFields, setCustomFields] = useState({});
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

    const togglePicOption = () => {
        setIsOpen((prev) => !prev);
    };

    const [isOpen, setIsOpen] = useState(false);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFormData({
            ...formData,
            profile_image: uploadedFile
        })
        if (uploadedFile) {
            setFile(URL.createObjectURL(uploadedFile));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const uploadedFile = e.dataTransfer.files[0];
        setFormData({
            ...formData,
            profile_image: uploadedFile
        })
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

    // ✅ Custom option in dropdown
    const CustomOption1 = (props) => (
        <components.Option {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image
                        src={props.data.icon}
                        alt={props.data.label}
                        width={20}
                        height={20}
                    />
                    <span>{props.data.label}</span>
                </div>
                {props.isSelected && (
                    <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
                )}
            </div>

        </components.Option>
    );

    // ✅ Custom selected value (shows in input box)
    const CustomSingleValue1 = (props) => (
        <components.SingleValue {...props}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image
                    src={props.data.icon}
                    alt={props.data.label}
                    width={20}
                    height={20}
                />
                <span>{props.data.label}</span>
            </div>
        </components.SingleValue>
    );


    const cmpOption = [
        { value: "SchlumbergerAsiaServiceLtd", label: "Schlumberger Asia Service Ltd" },
        // { value: "female", label: "Female" }
    ]


    const travelOption = [
        {
            value: "Company-Employee",
            label: "Company employee",
            icon: "../images/icons/hail.svg"
        },
        {
            value: "External-Guest",
            label: "External",
            icon: "../images/icons/short_stay.svg"
        },
    ];
    // ✅ Custom option in dropdown
    const CustomOption = (props) => (
        <components.Option {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Image
                        src={props.data.icon}
                        alt={props.data.label}
                        width={20}
                        height={20}
                    />
                    <span>{props.data.label}</span>
                </div>
                {props.isSelected && (
                    <span style={{ color: "#5a3e85", fontWeight: "bold" }}>✔</span>
                )}
            </div>

        </components.Option>
    );
    // ✅ Custom selected value (shows in input box)
    const CustomSingleValue = (props) => (
        <components.SingleValue {...props}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image
                    src={props.data.icon}
                    alt={props.data.label}
                    width={20}
                    height={20}
                />
                <span>{props.data.label}</span>
            </div>
        </components.SingleValue>
    );
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newData = { [name]: value }
        setFormData({
            ...formData,
            [name]: value
        })
        const { errors } = travellerValidation(newData, formData.password, requiredField)
        setErrorMessages({
            ...errorMessages,
            ...errors
        })
    }
    const handleSelectDropdown = (e, name) => {
        const { value } = e
        let newVal = { [name]: value }
        if (name === "traveller_type") {
            if (value === "External-Guest") {
                const roleValue = roleOption?.find(item => item.label == "External")
                const updatedForm = { ...formData, traveller_type: value, role: roleValue?.value };
                delete updatedForm.segment;
                delete updatedForm.designation;
                delete updatedForm.employee_grade;
                delete updatedForm.account_unit;
                delete updatedForm.account_code;
                delete updatedForm.employee_id;
                delete updatedForm.companyName;
                // delete updatedForm.role;
                delete updatedForm.password;
                delete updatedForm.con_password;
                setFormData(updatedForm);
            } else {
                setFormData((prev) => ({
                    ...prev,
                    traveller_type: value,
                    segment: "",
                    designation: "",
                    employee_grade: "",
                    account_unit: "",
                    account_code: "",
                    employee_id: "",
                    role: ''
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
        const { errors } = travellerValidation(newVal, formData.password, requiredField)
        setErrorMessages({
            ...errorMessages,
            ...errors
        })
    }
    const handleSelectCustomField = (e, name) => {
        setCustomFields({
            ...customFields,
            [name]: e.value
        })
    }
    useEffect(() => {
        if (loginData?.user_company !== "Casamelhor") {
           const c_info = companyList?.find((opt) => opt?.label == loginData?.user_company)           
            setFormData({
                ...formData,
                // companyName: loginData?.uid
                companyName:bacisSearchDetails?.c_uid?bacisSearchDetails?.c_uid:c_info?.value
            })
        }
    }, [addTravels])
    const getcompanyDetail = async () => {
        try {
            const response = await companyDetailAPI(formData.companyName);
            if (response?.data?.success) {
                setCompanyInfo(response?.data?.response)
                setRequiredField({
                    // phone_required: response?.data?.response?.is_phone_required,
                    employee_id_required: response?.data?.response?.is_employee_id_required,
                    segment_required: response?.data?.response?.is_segment_required,
                    designation_required: response?.data?.response?.is_designation_required,
                    employee_grade_required: response?.data?.response?.is_employee_grade_required,
                    account_unit_required: response?.data?.response?.is_account_unit_required,
                    account_code_required: response?.data?.response?.is_account_code_required
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (formData.companyName) getcompanyDetail()
    }, [formData.companyName]);


    // const handleAddPerson = async () => {
    //     try {
    //         const { isValid, errors } = travellerValidation(
    //             formData,
    //             formData.password,
    //             requiredField
    //         );

    //         setErrorMessages(errors);

    //         if (!isValid) return;

    //         const fieldData = new FormData();
    //         fieldData.append("first_name", formData.firstName);
    //         fieldData.append("last_name", formData.lastName);
    //         fieldData.append("gender", formData.gender);
    //         fieldData.append("user_category", formData.traveller_type);
    //         fieldData.append("user_company", id ? id : formData.companyName);
    //         fieldData.append("user_role", formData.role);
    //         fieldData.append("employee_id", formData.employee_id);
    //         fieldData.append("email", formData.email);
    //         fieldData.append("phone_number", formData.phone);
    //         fieldData.append("segment", formData.segment);
    //         fieldData.append("designation", formData.designation);
    //         fieldData.append("employee_grade", formData.employee_grade);
    //         fieldData.append("account_unit", formData.account_unit);
    //         fieldData.append("account_code", formData.account_code);
    //         fieldData.append("new_password", formData.password);
    //         fieldData.append("confirm_new_password", formData.con_password);
    //         fieldData.append("profile_image", formData.profile_image);
    //         fieldData.append(
    //             "custom_fields",
    //             JSON.stringify(customFields || {})
    //         );

    //         let response;
    //         if (formData.traveller_type === "Company-Employee") {
    //             response = await AddCompanyUserAPI(fieldData);
    //         } else {
    //             response = await AddExternalGuestUserAPI(fieldData);
    //         }


    //         if (!response?.data?.success) {
    //             alert_danger(
    //                 getBackendErrorMessage(response?.data) || "Something went wrong"
    //             );
    //             return;
    //         }

    //         alert_success(
    //             response?.data?.message || "User added successfully"
    //         );

    //         removeTravel();

    //     } catch (error) {
    //         const errorMsg = getBackendErrorMessage(
    //             error?.response?.data
    //         );

    //         alert_danger(errorMsg || "Something went wrong");
    //     }
    // };



    const handleAddPerson = async () => {
        try {
            const { isValid, errors } = travellerValidation(
                formData,
                formData.password,
                requiredField
            );

            setErrorMessages(errors);
            if (!isValid) return;

            // ✅ ALWAYS resolve role safely
            // const userRole = formData.role || roleOption?.[0]?.value;

            // if (!userRole) {
            //     // alert_danger("User role is required");
            //     toast.error('User role is required')
            //     return;
            // }

            const fieldData = new FormData();

            // 🔹 COMMON FIELDS (BOTH CASES)
            fieldData.append("first_name", formData.firstName);
            fieldData.append("last_name", formData.lastName);
            fieldData.append("gender", formData.gender);
            fieldData.append("user_category", formData.traveller_type);
            fieldData.append("email", formData.email);
            fieldData.append("phone_number", formData.phone);
            if (formData.role) fieldData.append("user_role", formData.role);
            fieldData.append("new_password", formData.password);
            fieldData.append("confirm_new_password", formData.con_password);

            if (formData.profile_image) {
                fieldData.append("profile_image", formData.profile_image);
            }

            // 🔹 COMPANY-EMPLOYEE ONLY
            if (formData.traveller_type === "Company-Employee") {
                fieldData.append("user_company", id ? id : formData.companyName);

                // append ONLY if value exists (safe)
                if (formData.employee_id)
                    fieldData.append("employee_id", formData.employee_id);

                if (formData.segment)
                    fieldData.append("segment", formData.segment);

                if (formData.designation)
                    fieldData.append("designation", formData.designation);

                if (formData.employee_grade)
                    fieldData.append("employee_grade", formData.employee_grade);

                if (formData.account_unit)
                    fieldData.append("account_unit", formData.account_unit);

                if (formData.account_code)
                    fieldData.append("account_code", formData.account_code);

                if (customFields && Object.keys(customFields).length > 0) {
                    fieldData.append(
                        "custom_fields",
                        JSON.stringify(customFields)
                    );
                }
            }

            // 🔹 API CALL
            const response =
                formData.traveller_type === "Company-Employee"
                    ? await AddCompanyUserAPI(fieldData)
                    : await AddExternalGuestUserAPI(fieldData);

            if (!response?.data?.success) {
                // alert_danger(
                //     getBackendErrorMessage(response?.data) || "Something went wrong"
                // );
                toast.error(getBackendErrorMessage(response?.data) || "Something went wrong")
                return;
            }

            // alert_success(
            //     response?.data?.message || "User added successfully"

            // );            
            toast.success(response?.data?.message || "User added successfully");
            getUserListData();
            refreshCompanyList?.();   // ← re-fetch companies
            setFormData(initialFormState);
            setFile(null);
            removeTravel();

        } catch (error) {
            const errorMsg = getBackendErrorMessage(error?.response?.data);
            toast.error(errorMsg || "Something went wrong");
        }
    };



    const getBackendErrorMessage = (data) => {
        if (!data) return "Something went wrong";

        //  direct message
        if (data.message) return data.message;

        //  backend nested response 
        if (data.response && typeof data.response === "object") {
            const key = Object.keys(data.response)[0];
            if (Array.isArray(data.response[key])) {
                return data.response[key][0];
            }
        }

        // direct field-wise error
        if (typeof data === "object") {
            const key = Object.keys(data)[0];
            if (Array.isArray(data[key])) {
                return data[key][0];
            }
        }

        return "Something went wrong. Please try again.";
    };




    useEffect(() => {
        if (addTravels && companyUid) {
            setFormData((prev) => ({
                ...prev,
                companyName: companyUid
            }));
        }
    }, [addTravels, companyUid]);



    console.log(formData, id, companyDetail);
    console.log(companyInfo)
    console.log(customFields)
    return (
        <>
            <Toaster position="top-right" />
            <Modal show={addTravels} onHide={removeTravel} animation={false} centered className='custom-theme-modal traveler-modal  status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        Add a person
                    </Modal.Title>
                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={removeTravel} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <Row className='justify-content-between'>
                        <Col md={9}>
                            <p className='font-18'>
                                Personal information
                            </p>
                            <p style={{ color: '#73615F' }} >Enter the following information exactly the same as it appears on the traveler’s passport or ID.</p>
                            <div className='form-group mb-4'>
                                <label>First name</label>
                                <input type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} className='form-control' placeholder='Enter First name' />
                                <span className='text-danger'>{errorMessages.firstName}</span>
                            </div>
                            <div className='form-group mb-4'>
                                <label>Last name</label>
                                <input type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} className='form-control' placeholder='Enter Last name' />
                                <span className='text-danger'>{errorMessages.lastName}</span>
                            </div>
                            <Row>
                                <Col md="6">
                                    <div className='form-group mb-4'>
                                        <label>Gender</label>
                                        {/* gender select */}
                                        <Select
                                            name="gender"
                                            options={genderOption}
                                            placeholder="Select a Gender"
                                            value={genderOption.find((opt) => opt.value == formData.gender)}
                                            className='react_selectbox '
                                            isSearchable={false}
                                            styles={customStyles}
                                            onChange={(e) => handleSelectDropdown(e, "gender")}
                                            components={{ Option: CustomOption1, SingleValue: CustomSingleValue1 }}
                                        />
                                        <span className='text-danger'>{errorMessages.gender}</span>
                                    </div>
                                </Col>
                            </Row>

                            <p className='subheadline-2'>Traveler category</p>
                            <div className='form-group mb-4'>
                                <Select
                                    name="traveller_type"
                                    options={travelOption}
                                    value={travelOption.find((opt) => opt.value == formData.traveller_type)}
                                    placeholder="Choose Role"
                                    className='react_selectbox '
                                    isSearchable={false}
                                    styles={customStyles}
                                    onChange={(e) => handleSelectDropdown(e, "traveller_type")}
                                    components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                />
                                <span className='text-danger'>{errorMessages.traveller_type}</span>
                            </div>

                            {formData?.traveller_type == "Company-Employee" && (
                                <>
                                    <div className='form-group mb-4'>
                                        <label>Company</label>
                                        {loginData?.user_company == "Casamelhor" ?
                                            <Select
                                                name="companyName"
                                                value={companyList?.find((opt) => opt?.value == formData.companyName) || { label: companyDetail?.company_name,value:id }}
                                                options={companyList}
                                                placeholder="Choose Company"
                                                className='react_selectbox'
                                                // isSearchable={true}
                                                onMenuScrollToBottom={loadMoreCompanies}   // ✅ infinite scroll
                                                onChange={(e) => handleSelectDropdown(e, "companyName")}
                                                onInputChange={(e)=>setSearchComp(e)}
                                                styles={customStyles}
                                            />


                                            : <input type='text' name='companyName' value={loginData?.user_company} className='form-control' placeholder='Enter First name' disabled />}
                                        <span className='text-danger'>{errorMessages.companyName}</span>
                                    </div>

                                    <div className='form-group mb-4'>
                                        <label>Role</label>
                                        <Select
                                            name="role"
                                            value={roleOption?.find((opt) => opt.value == formData.role)}
                                            options={roleOption}
                                            placeholder="Choose Role"
                                            className='react_selectbox role-icn-2'
                                            isSearchable={false}
                                            onChange={(e) => handleSelectDropdown(e, "role")}
                                            // defaultValue={role[0]}
                                            styles={customStyles}
                                        />
                                        <span className='text-danger'>{errorMessages.role}</span>
                                    </div>

                                    {companyInfo?.is_employee_id_required != "Off" && (
                                        <div className='form-group mb-4'>
                                            <label>{companyInfo?.employee_id_display_name}</label>
                                            {companyInfo?.employee_id_options?.length > 0 ? (
                                                <Select
                                                    name="employee_id"
                                                    value={companyInfo?.employee_id_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.employee_id)}
                                                    options={companyInfo?.employee_id_options?.map((val) => ({ value: val, label: val }))}
                                                    placeholder="Choose Employee ID"
                                                    className='react_selectbox'
                                                    isSearchable={false}
                                                    onChange={(e) => handleSelectDropdown(e, "employee_id")}
                                                    // defaultValue={role[0]}
                                                    styles={customStyles}
                                                />
                                            ) : (
                                                <input type='text' name='employee_id' onChange={handleInputChange} className='form-control' placeholder='Enter Employee ID' />
                                            )}
                                            <span className='text-danger'>{errorMessages.employee_id}</span>
                                        </div>
                                    )}

                                    {companyInfo?.is_segment_required != "Off" && (
                                        <div className='form-group mb-4'>
                                            <label>{companyInfo?.segment_display_name}</label>
                                            {companyInfo?.segment_options?.length > 0 ? (
                                                <Select
                                                    name="segment"
                                                    value={companyInfo?.segment_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.segment)}
                                                    options={companyInfo?.segment_options?.map((val) => ({ value: val, label: val }))}
                                                    placeholder="Choose segment"
                                                    className='react_selectbox'
                                                    isSearchable={false}
                                                    onChange={(e) => handleSelectDropdown(e, "segment")}
                                                />
                                            ) : (
                                                <input type='text' name='segment' onChange={handleInputChange} className='form-control' placeholder='Enter Dept./Segment' />
                                            )}
                                            <span className='text-danger'>{errorMessages.segment}</span>
                                        </div>
                                    )}

                                    {companyInfo?.is_designation_required != "Off" && (
                                        <div className='form-group mb-4'>
                                            <label>{companyInfo?.designation_display_name}</label>
                                            {companyInfo?.designation_options?.length > 0 ? (
                                                <Select
                                                    name="designation"
                                                    value={companyInfo?.designation_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.designation)}
                                                    options={companyInfo?.designation_options?.map((val) => ({ value: val, label: val }))}
                                                    placeholder="Choose designation"
                                                    className='react_selectbox'
                                                    isSearchable={false}
                                                    onChange={(e) => handleSelectDropdown(e, "designation")}
                                                />

                                            ) : (
                                                <input type='text' name='designation' onChange={handleInputChange} className='form-control' placeholder='Enter Designation' />
                                            )}
                                            <span className='text-danger'>{errorMessages.designation}</span>
                                        </div>
                                    )}

                                    {companyInfo?.is_employee_grade_required != "Off" && (
                                        <div className='form-group mb-4'>
                                            <label>{companyInfo?.employee_grade_display_name}</label>
                                            {companyInfo?.employee_grade_options?.length > 0 ? (
                                                <Select
                                                    name="employee_grade"
                                                    value={companyInfo?.employee_grade_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.employee_grade)}
                                                    options={companyInfo?.employee_grade_options?.map((val) => ({ value: val, label: val }))}
                                                    placeholder="Choose Employee Grade"
                                                    className='react_selectbox'
                                                    isSearchable={false}
                                                    onChange={(e) => handleSelectDropdown(e, "employee_grade")}
                                                />
                                            ) : (
                                                <input type='text' name='employee_grade' onChange={handleInputChange} className='form-control' placeholder='Enter Employee Grade' />
                                            )}
                                            <span className='text-danger'>{errorMessages.employee_grade}</span>
                                        </div>
                                    )}

                                    {companyInfo?.is_account_unit_required != "Off" && (
                                        <div className='form-group mb-4'>
                                            <label>{companyInfo?.account_unit_display_name}</label>
                                            {companyInfo?.account_unit_options?.length > 0 ? (
                                                <Select
                                                    name="account_unit"
                                                    value={companyInfo?.account_unit_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.account_unit)}
                                                    options={companyInfo?.account_unit_options?.map((val) => ({ value: val, label: val }))}
                                                    placeholder="Choose account_unit"
                                                    className='react_selectbox'
                                                    isSearchable={false}
                                                    onChange={(e) => handleSelectDropdown(e, "account_unit")}
                                                />
                                            ) : (
                                                <input type='text' name='account_unit' onChange={handleInputChange} className='form-control' placeholder='Enter Account Unit' />
                                            )}
                                            <span className='text-danger'>{errorMessages.account_unit}</span>
                                        </div>
                                    )}

                                    {companyInfo?.is_account_code_required != "Off" && (
                                        <div className='form-group mb-4'>
                                            <label>{companyInfo?.account_code_display_name}</label>
                                            {companyInfo?.account_code_options?.length > 0 ? (
                                                <Select
                                                    name="account_code"
                                                    value={companyInfo?.account_code_options?.map((val) => ({ value: val, label: val }))?.find((opt) => opt.value == formData.account_code)}
                                                    options={companyInfo?.account_code_options?.map((val) => ({ value: val, label: val }))}
                                                    placeholder="Choose account_code"
                                                    className='react_selectbox'
                                                    isSearchable={false}
                                                    onChange={(e) => handleSelectDropdown(e, "account_code")}
                                                />

                                            ) : (
                                                <input type='text' name='account_code' onChange={handleInputChange} className='form-control' placeholder='Enter Account Code' />
                                            )}
                                            <span className='text-danger'>{errorMessages.account_code}</span>
                                        </div>
                                    )}

                                </>
                            )}

                            {formData?.traveller_type === "Company-Employee" && companyInfo?.custom_display_field_name &&
                                Object.entries(companyInfo?.custom_display_field_name)?.length > 0 && (
                                    <>
                                        {Object.entries(companyInfo?.custom_display_field_name)?.map(([key, field]) => {
                                            return field.type === "dropdown" ? (
                                                <div className="form-group mb-4" key={key}>
                                                    <label>{field.display_name}</label>
                                                    <Select
                                                        key={key}
                                                        name={field.display_name}
                                                        options={field.values.map((val) => ({ label: val, value: val }))}
                                                        placeholder={`Select ${field.display_name}`}
                                                        className="react_selectbox"
                                                        isSearchable={false}
                                                        styles={customStyles}
                                                        onChange={(e) => handleSelectCustomField(e, key)}
                                                    // components={{ Option: CustomOption1, SingleValue: CustomSingleValue1 }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="form-group mb-4" key={key}>
                                                    <label>{field.display_name}</label>
                                                    <input
                                                        type="text"
                                                        name={field.display_name}
                                                        // value={field.display_name || ""}
                                                        onChange={(e) => { setCustomFields({ ...customFields, [key]: e.target.value }) }}
                                                        className="form-control"
                                                        placeholder={`Enter ${field.display_name}`}
                                                    />
                                                    <span className="text-danger">{errorMessages[key]}</span>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            <p className='subheadline-2'>Contact information</p>
                            <div className='form-group mb-4'>
                                <label>Email</label>
                                <input type='email' name='email' value={formData.email} onChange={handleInputChange} className='form-control' placeholder='Enter email ' />
                                <span className='text-danger'>{errorMessages.email}</span>
                            </div>
                            {/* {companyInfo?.is_phone_required != "Off" && ( */}
                            <div className='form-group '>
                                <label>Phone number</label>
                                <input type='tel' name='phone' onChange={handleInputChange} className='form-control' placeholder='Enter phone ' value={formData.phone} autoComplete="off" />
                                <span className='text-danger'>{errorMessages.phone}</span>
                            </div>
                            {/* )} */}

                            {/* {formData?.traveller_type == "Company-Employee" && ( */}
                            <>
                                <p className='subheadline-2 mt-3'>Login information</p>
                                <div className='form-group relative mb-4'>
                                    <label>New Password</label>
                                    <input type={showPass ? 'text' : 'password'} name='password' value={formData.password} onChange={handleInputChange} className='form-control' placeholder='Enter Password ' autoComplete="new-password" />
                                    <span className='absolute top-4 mt-4 right-2' onClick={() => setShowPass(!showPass)} style={{ cursor: 'pointer' }}>Show</span>
                                    <span className='text-danger'>{errorMessages.password}</span>
                                </div>
                                <div className='form-group relative mb-4'>
                                    <label>Confirm New Password</label>
                                    <input type={showcPass ? 'text' : 'password'} name='con_password' value={formData.con_password} onChange={handleInputChange} className='form-control' placeholder='Confirm Password' autoComplete="new-password" />
                                    <span className='absolute top-4 mt-4 right-2' onClick={() => setShowcPass(!showcPass)} style={{ cursor: 'pointer' }}>Show</span>
                                    <span className='text-danger'>{errorMessages.con_password}</span>
                                </div>
                            </>
                            {/* )} */}

                        </Col>

                        {/* <Col md={3}>
                            <p className='subheadline-2'>Traveler photo</p>

                            <div className='add-upload-photo' style={{ border: '1px solid #dedede' }} >
                                <Image src={file || "../images/icons/photo-camera.svg"} className='img-fluid' alt='camera' width={file ? 150 : 48}
                                    height={file ? 150 : 48}
                                    style={{ objectFit: 'cover', borderRadius: file ? '8px' : '0' }} />

                                    
                                {!file && (
                                    <Button variant='' onClick={() => {
                                        //     handleOptionClick();
                                        changepicModal();
                                        removeFile()
                                        // removeTravel();
                                    }} className='add-photo-btn mt-2'>
                                        Add Photo
                                    </Button>
                                )}
                            </div>
                        </Col> */}
                        <Col md={3}>
                            <p className='subheadline-2'>Traveler photo</p>
                            {file && (
                                <div className='upload-photo'>
                                    <Image src={file ? file : '../images/icons/No-Image.svg'} className='img-fluid' alt='profile' width={214} height={214} />
                                    {/* <Image src={file ? file : '/images/icons/photo-camera.svg'} className='img-fluid' alt='profile' width={214} height={214} /> */}
                                    <span className='more-action' onClick={togglePicOption}  >
                                        <Image src='../images/icons/more-dots-3.svg' className='img-fluid' alt='more' width={24} height={24} />
                                    </span>
                                    <ul className={`picoption ${isOpen ? "active" : ""}`}>
                                        <li>
                                            <Link onClick={() => {
                                                // handleOptionClick();
                                                changepicModal();
                                                setIsOpen(false)
                                                // closeEditBox();
                                            }} href='#'>Change Photo</Link>
                                        </li>
                                        <li>
                                            <Link onClick={() => {
                                                // employeClose();
                                                // handleOptionClick();
                                                // deletepicModal();
                                                setIsOpen(false)
                                                removeFile();
                                                // setShowPhoto(false);
                                            }} href='#'>Delete</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {!file && (

                                <div className='add-upload-photo' style={{ border: '1px solid #dedede' }} >
                                    <Image src={"/images/icons/photo-camera.svg"} className='img-fluid' alt='camera' width={48} height={48} />
                                    <Button variant='' onClick={() => {
                                        //     handleOptionClick();
                                        // removeFile()
                                        changepicModal();
                                        // setShowPhoto(true);
                                        // removeTravel();
                                    }} className='add-photo-btn mt-2'>
                                        Add Photo
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" style={{ padding: '13px 25px' }} onClick={handleAddPerson} className='btn-company-add '>
                        Cancel
                    </Button>
                    <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}
                        // onClick={filterClose}
                        onClick={handleAddPerson}
                    >
                        Add a person
                    </Button>
                </Modal.Footer>
            </Modal>





            <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Upload photo

                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    {!file && (<p className='border-bottom pb-4'>Please upload Operations managers photo</p>)}


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
                    <Button variant="" onClick={changepicClose}
                        className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Cancel
                    </Button>
                    {/* <Button variant="" onClick={() => {
                        changepicClose();
                        addTravel();
                    }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Upload
                    </Button> */}

                    <Button
                        variant=""
                        onClick={() => {
                            if (file) {
                                toast.success("Photo uploaded successfully");
                                changepicClose();
                                addTravel();
                            } else {
                                toast.error("Please upload a photo first");
                            }
                        }}
                        className='search-btn complete-form-btn'
                        style={{ padding: '13px 25px', borderRadius: '0' }}
                    >
                        Upload
                    </Button>

                </Modal.Footer>
            </Modal>

        </>
    )
}