"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Button, Modal } from 'react-bootstrap';
import Header from '../Header/Header';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, Tab } from 'react-bootstrap';
import Select, { AriaOnFocus, components } from 'react-select';
import ProtectedRoute from '../ProtectedRoute';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { addCompanyValidation, travellerValidation } from '@/utils/validation';
import { companyDetailAPI, UpdateCompanyDetailAPI, UserCompanyUpdateAPI, UserExternalUpdateAPI } from '@/services/provider';
import { getItemLocalStorage } from '@/utils/browserStorage';
import toast from 'react-hot-toast';

export const EditUserProfile = ({ showEditBox, openEditBox, userListData, closeEditBox, editData, companyDetail, roleOption, companyList, getUserListData, loadMoreCompanies }) => {
    const [changepicsModal, changepisetShow] = useState(false);
    const [showPhoto, setShowPhoto] = useState(true);
    const [isFileDeleted, setIsFileDeleted] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isStatusChanged, setIsStatusChanged] = useState(false);


    // const changepicClose = () => changepisetShow(false);
    // const changepicModal = () => changepisetShow(true);

    const changepicClose = () => { changepisetShow(false); };
    const changepicModal = () => { changepisetShow(true); closeEditBox(); };

    // const changepicClose = () =>{

    // }

    //   drag drop upload
    const [file, setFile] = useState(null);
    const param = useParams();
    const id = param.id;
    const pathname = usePathname();
    const loginData = JSON.parse(getItemLocalStorage("userLogin"));
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        company_uid: "",
        companyName: "",
        designation: "",
        employee_id: "",
        email: "",
        phone: "",
        role: "",
        // rezo_ticket: "",
        traveller_type: "",
        segment: "",
        employee_grade: "",
        account_unit: "",
        account_code: "",
        roleLabel: "",
        password: "",
        con_password: "",
        reason: "",
        profile_image: null
    });
    const [requiredField, setRequiredField] = useState({
        phone_required: null,
        employee_id_required: null,
        segment_required: null,
        designation_required: null,
        employee_grade_required: null,
        account_unit_required: null,
        account_code_required: null,
    });
    const [errorMessages, setErrorMessages] = useState({});
    const [companyInfo, setCompanyInfo] = useState({})
    const [customFields, setCustomFields] = useState({});
    const [showPass, setShowPass] = useState(false)
    const [showcPass, setShowcPass] = useState(false)
    const genderOption = [
        { value: "Male", label: "Male", icon: "../images/icons/male.svg" },
        { value: "Female", label: "Female", icon: "../images/icons/genders.svg" }
    ]

    const statusOption = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
    ]

    const [selectedStatus, setSelectedStatus] = useState(); // default "Active"
    const [reason, setReason] = useState('');
    // useEffect(() => {
    //     const obj = companyList?.find((cv) => cv.label == editData?.company_name)
    //     setSelectedStatus(editData?.is_active)
    //     if (editData?.user_category == "Company-Employee") {
    //         setFormData({
    //             firstName: editData?.first_name,
    //             lastName: editData?.last_name,
    //             gender: editData?.gender,
    //             companyName: editData?.company_name,
    //             company_uid: obj?.value,
    //             designation: editData?.designation,
    //             employee_id: editData?.employee_id,
    //             email: editData?.email,
    //             phone: editData?.phone_number,
    //             role: editData?.user_role?.uid,
    //             roleLabel: editData?.user_role?.role_name,
    //             // rezo_ticket: "",
    //             traveller_type: editData?.user_category,
    //             segment: editData?.segment,
    //             employee_grade: editData?.employee_grade,
    //             account_unit: editData?.account_unit,
    //             account_code: editData?.account_code,
    //             // password: "",
    //             // con_password: ""
    //         })
    //         setCustomFields(editData?.custom_fields)
    //         if (editData?.profile_image) {
    //             setFile(`https://alicedevapi.casamelhor.in${editData?.profile_image}`)
    //         } else { setFile(null) }
    //     } else {
    //         setFormData({
    //             firstName: editData?.first_name,
    //             lastName: editData?.last_name,
    //             gender: editData?.gender,
    //             companyName: editData?.company_name,
    //             company_uid: obj?.value,
    //             email: editData?.email,
    //             phone: editData?.phone_number,
    //             role: editData?.user_role?.uid,
    //             roleLabel: editData?.user_role?.role_name,
    //             rezo_ticket: "",
    //             traveller_type: editData?.user_category,
    //             password: "",
    //             con_password: ""
    //         })
    //         if (editData?.profile_image) {
    //             setFile(`https://alicedevapi.casamelhor.in${editData?.profile_image}`)
    //         } else { setFile(null) }
    //     }

    // }, [showEditBox]);


    // useEffect(() => {
    //     if (isFileDeleted) return;

    //     if (isUploaded) return;

    //     const obj = companyList?.find((cv) => cv.label == editData?.company_name)
    //     setSelectedStatus(editData?.is_active)
    //     setIsStatusChanged(false);

    //     if (editData?.user_category === "Company-Employee") {
    //         setFormData({
    //             firstName: editData?.first_name,
    //             lastName: editData?.last_name,
    //             gender: editData?.gender,
    //             companyName: editData?.company_name,
    //             company_uid: obj?.value,
    //             designation: editData?.designation,
    //             employee_id: editData?.employee_id,
    //             email: editData?.email,
    //             phone: editData?.phone_number,
    //             role: editData?.user_role?.uid,
    //             roleLabel: editData?.user_role?.role_name,
    //             traveller_type: editData?.user_category,
    //             segment: editData?.segment,
    //             employee_grade: editData?.employee_grade,
    //             account_unit: editData?.account_unit,
    //             account_code: editData?.account_code,
    //         });

    //         setCustomFields(editData?.custom_fields);

    //         if (editData?.profile_image) {
    //             setFile(`https://alicedevapi.casamelhor.in${editData?.profile_image}`)
    //         } else {
    //             setFile(null);
    //         }

    //     } else {

    //         setFormData({
    //             firstName: editData?.first_name,
    //             lastName: editData?.last_name,
    //             gender: editData?.gender,
    //             companyName: editData?.company_name,
    //             company_uid: obj?.value,
    //             email: editData?.email,
    //             phone: editData?.phone_number,
    //             role: editData?.user_role?.uid,
    //             roleLabel: editData?.user_role?.role_name,
    //             rezo_ticket: "",
    //             traveller_type: editData?.user_category,
    //             password: "",
    //             con_password: ""
    //         });

    //         if (editData?.profile_image) {
    //             setFile(`https://alicedevapi.casamelhor.in${editData?.profile_image}`)
    //         } else {
    //             setFile(null);
    //         }
    //     }

    // }, [showEditBox, isFileDeleted]);

    useEffect(() => {
        if (isFileDeleted) return;
        if (isUploaded) return;

        const obj = companyList?.find((cv) => cv.label == editData?.company_name);
        setSelectedStatus(editData?.is_active);
        setIsStatusChanged(false);

        // ✅ Determine correct company_uid upfront
        const resolvedCompanyUid =
            loginData?.user_company !== "Casamelhor"
                ? loginData?.uid          // Company Admin: use their own company
                : obj?.value;             // Casamelhor admin: use matched company

        if (editData?.user_category == "Company-Employee") {
            setFormData({
                firstName: editData?.first_name,
                lastName: editData?.last_name,
                gender: editData?.gender,
                companyName: editData?.company_name,
                company_uid: resolvedCompanyUid,   // ✅ correct uid from start
                designation: editData?.designation,
                employee_id: editData?.employee_id,
                email: editData?.email,
                phone: editData?.phone_number,
                role: editData?.user_role?.uid,
                roleLabel: editData?.user_role?.role_name,
                traveller_type: editData?.user_category,
                segment: editData?.segment,
                employee_grade: editData?.employee_grade,
                account_unit: editData?.account_unit,
                account_code: editData?.account_code,
            });
            setCustomFields(editData?.custom_fields);
            setFile(editData?.profile_image
                ? `${editData?.profile_image}`
                : null
            );
        } else {
            setFormData({
                firstName: editData?.first_name,
                lastName: editData?.last_name,
                gender: editData?.gender,
                companyName: editData?.company_name,
                company_uid: resolvedCompanyUid,   // ✅ consistent
                email: editData?.email,
                phone: editData?.phone_number,
                role: editData?.user_role?.uid,
                roleLabel: editData?.user_role?.role_name,
                rezo_ticket: "",
                traveller_type: editData?.user_category,
                password: "",
                con_password: ""
            });
            setFile(editData?.profile_image
                ? `${editData?.profile_image}`
                : null
            );
        }
    }, [showEditBox, isFileDeleted]);



    const cmpOption = [
        { value: "SchlumbergerAsiaServiceLtd", label: "Schlumberger Asia Service Ltd" },
        // { value: "female", label: "Female" }
    ]
    // const role = [
    //     { value: "client-admin", label: "Client Admin", icon: "../images/icons/approval.svg" },
    //     { value: "client-booking-manager", label: "Client Booking Manager", icon: "../images/icons/person_raised.svg" },
    //     { value: "company-emloyee", label: "Company Employee", icon: "../images/icons/group-user.svg" },
    // ]
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


    // const handleFileChange = (e) => {
    //     const uploadedFile = e.target.files[0];
    //     setFormData({
    //         ...formData,
    //         profile_image: uploadedFile
    //     })
    //     if (uploadedFile) {
    //         setFile(URL.createObjectURL(uploadedFile));
    //     }
    // };
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            // original file save karo for backend
            setFormData((prev) => ({
                ...prev,
                profile_image: uploadedFile
            }));
            //  image URL for Preview
            const previewUrl = URL.createObjectURL(uploadedFile);
            setFile(previewUrl);
            // visible Traveler Photo section
            setShowPhoto(true);
            // 4. Delete flag reset (optional)
            setIsFileDeleted(false);
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
        // setIsUploaded(false);

    };

    // const removeFile = () => {
    //     setIsFileDeleted(true);   // <-- IMPORTANT
    //     setFile(null);
    //     setFormData({
    //         ...formData,
    //         profile_image: null,
    //     });
    //     setShowPhoto(false);
    // };

    const togglePicOption = () => {
        setIsOpen((prev) => !prev);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newData = { [name]: value }
        setFormData({
            ...formData,
            [name]: value
        })
        // const { errors } = travellerValidation(newData, formData.password)
        const { errors } = travellerValidation(newData, '', requiredField)
        setErrorMessages({
            ...errorMessages,
            ...errors
        })
    }
    const handleSelectDropdown = (e, name) => {
        const { value, label } = e
        let newVal = { [name]: value }
        if (name === "traveller_type") {
            if (value === "External-Guest") {
                const updatedForm = { ...formData, traveller_type: value };
                delete updatedForm.segment;
                delete updatedForm.designation;
                delete updatedForm.employee_grade;
                delete updatedForm.account_unit;
                delete updatedForm.account_code;
                delete updatedForm.employee_id;
                delete updatedForm.company_uid;
                delete updatedForm.role;
                // delete updatedForm.password;
                // delete updatedForm.con_password;
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
                    employee_id: ""
                }));
            }
        } else if (name == "role") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                ["roleLabel"]: label
            }));
        } else if (name == "company_uid") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                ["companyName"]: label
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
        const { errors } = travellerValidation(newVal, '', requiredField)
        setErrorMessages({
            ...errorMessages,
            ...errors
        })
    }
    // useEffect(() => {
    //     if (loginData?.user_company !== "Casamelhor") {
    //         setFormData({
    //             ...formData,
    //             company_uid: loginData?.uid
    //         })
    //     }
    // }, [showEditBox])
    useEffect(() => {
        if (loginData?.user_company !== "Casamelhor") {
            const c_info = companyList?.find((opt) => opt?.label == loginData?.user_company)
            setFormData((prev) => ({
                ...prev,
                // company_uid: loginData?.uid
                company_uid: c_info?.value
            }));
        }
    }, [showEditBox]);
    const getcompanyDetail = async () => {
        try {
            const response = await companyDetailAPI(formData.company_uid);
            if (response?.data?.success) {
                setCompanyInfo(response?.data?.response)
                setRequiredField({
                    phone_required: response?.data?.response?.is_phone_required,
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
        getcompanyDetail()
    }, [formData.company_uid])
    const handleChangeDetail = async () => {
        try {
            const { isValid, errors } = travellerValidation(formData, '', requiredField)
            setErrorMessages(errors)
            if (isValid) {
                const fieldData = new FormData();
                fieldData.append("first_name", formData.firstName);
                fieldData.append("last_name", formData.lastName);
                fieldData.append("gender", formData.gender)
                fieldData.append("user_category", formData.traveller_type)
                fieldData.append("user_company", id ? id : formData.company_uid)
                fieldData.append("user_role", formData.role)
                fieldData.append("employee_id", formData.employee_id)
                fieldData.append("email", formData.email)
                fieldData.append("phone_number", formData.phone)
                fieldData.append("segment", formData.segment)
                fieldData.append("designation", formData.designation)
                fieldData.append("employee_grade", formData.employee_grade)
                fieldData.append("account_unit", formData.account_unit)
                fieldData.append("account_code", formData.account_code)
                // if (Object.keys(companyInfo?.custom_display_field_name).length > 0) fieldData.append("custom_fields", JSON.stringify(customFields))
                if (companyInfo?.custom_display_field_name && Object.keys(companyInfo.custom_display_field_name).length > 0) {
                    fieldData.append("custom_fields", JSON.stringify(customFields));
                }
                // fieldData.append("rezo_ticket", formData.rezo_ticket)
                if (formData.password) fieldData.append("new_password", formData.password)
                if (formData.con_password) fieldData.append("confirm_new_password", formData.con_password)
                fieldData.append("is_active", selectedStatus)
                fieldData.append("reason", formData.reason)
                if (formData.profile_image) {
                    fieldData.append("profile_image", formData.profile_image)
                }
                let response;
                if (formData.traveller_type == "Company-Employee") {
                    response = await UserCompanyUpdateAPI(editData?.uid, fieldData);
                } else {
                    response = await UserExternalUpdateAPI(editData?.uid, fieldData);
                }
                if (response?.data?.success) {
                    toast.success("User updated successfully");

                    getUserListData()
                    // userListData()

                    closeEditBox();
                } else {
                    toast.error(response?.data?.message || "Something went wrong");
                }
            }
        } catch (error) {
            console.error("handleChangeDetail error:", error); 
        }

    }
    console.log(editData, file)
    console.log(formData)
    console.log(companyInfo)
    console.log(customFields)
    return (
        <>
            <Modal show={showEditBox} onHide={closeEditBox} animation={false} centered className='custom-theme-modal traveler-modal  status-height-70' >
                <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        <Image src='../images/icons/back.svg' className='img-fluid' alt='top' width={12} height={12} />
                        Edit Traveler Profile
                    </Modal.Title>

                    <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={closeEditBox} />
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
                                {/* value={formData.firstName}  */}
                                <input type='text' name='firstName' value={formData.firstName || ""} onChange={handleInputChange} className='form-control' placeholder='Enter First name' />
                                <span className='text-danger'>{errorMessages.firstName}</span>
                            </div>


                            <div className='form-group mb-4'>
                                <label>Last name</label>
                                <input type='text' name='lastName' value={formData.lastName || ""} onChange={handleInputChange} className='form-control' placeholder='Enter Last name' />
                                <span className='text-danger'>{errorMessages.lastName}</span>
                            </div>

                            <Row>
                                <Col md="6">
                                    <div className='form-group mb-4'>
                                        <label>Gender</label>
                                        <Select
                                            name="gender"
                                            value={genderOption.find((opt) => opt.value == formData.gender)}
                                            options={genderOption}
                                            placeholder="Select Gender"
                                            className='react_selectbox gender-icn-2'
                                            isSearchable={false}
                                            onChange={(e) => handleSelectDropdown(e, "gender")}
                                            // defaultValue={genderOption[0]}
                                            styles={customStyles}
                                        />
                                        <span className='text-danger'>{errorMessages.gender}</span>
                                    </div>
                                </Col>
                            </Row>

                            <p className='subheadline-2'>Traveler category</p>
                            <div className='form-group mb-4'>

                                <Select
                                    name="traveller_type"
                                    value={travelOption.find((opt) => opt.value == formData.traveller_type)}
                                    options={travelOption}
                                    placeholder="Choose Role"
                                    className='react_selectbox'
                                    isSearchable={false}
                                    onChange={(e) => handleSelectDropdown(e, "traveller_type")}
                                    components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                    styles={customStyles}
                                />
                                <span className='text-danger'>{errorMessages.traveller_type}</span>
                            </div>

                            {/* {formData?.traveller_type == "Company-Employee" && (
                                <>
                                    <p className='subheadline-2'>Company</p>
                                    <div className='form-group mb-4'>
                                        {loginData?.user_company == "Casamelhor" ?
                                            <Select
                                                name="companyName"
                                                value={companyList?.find((opt) => opt.label == formData.companyName)}
                                                options={companyList}
                                                placeholder="Choose Company"
                                                className='react_selectbox'
                                                isSearchable={false}
                                                onChange={(e) => handleSelectDropdown(e, "company_uid")}
                                                styles={customStyles}
                                            /> : <input type='text' name='company_uid' value={loginData?.user_company} className='form-control' placeholder='Enter First name' disabled />
                                        }
                                        <span className='text-danger'>{errorMessages.companyName}</span>
                                    </div>

                                    <p className='subheadline-2'>Role</p>
                                    <div className='form-group mb-4'>

                                        <Select
                                            name="role"
                                            value={roleOption.find((opt) => opt.label == formData.roleLabel)}
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
                                </>
                            )} */}

                            {/* {formData?.traveller_type == "Company-Employee" && pathname !== "/People" && (
                                <>
                                    {companyDetail?.is_employee_id_required && (
                                        <div className='form-group mb-4'>
                                            <label>Employee ID</label>
                                            <input type='text' name='employee_id' value={formData.employee_id} onChange={handleInputChange} className='form-control' placeholder='Enter Employee ID' />
                                            <span className='text-danger'>{errorMessages.employee_id}</span>
                                        </div>
                                    )}
                                    {companyDetail?.is_segment_required && (
                                        <div className='form-group mb-4'>
                                            <label>Dept./Segment</label>
                                            <input type='text' name='segment' value={formData.segment} onChange={handleInputChange} className='form-control' placeholder='Enter Dept./Segment' />
                                            <span className='text-danger'>{errorMessages.segment}</span>
                                        </div>
                                    )}
                                    {companyDetail?.is_designation_required && (
                                        <div className='form-group mb-4'>
                                            <label>Designation</label>
                                            <input type='text' name='designation' value={formData.designation} onChange={handleInputChange} className='form-control' placeholder='Enter Designation' />
                                            <span className='text-danger'>{errorMessages.designation}</span>
                                        </div>
                                    )}
                                    {companyDetail?.is_employee_grade_required && (
                                        <div className='form-group mb-4'>
                                            <label>Employee Grade</label>
                                            <input type='text' name='employee_grade' value={formData.employee_grade} onChange={handleInputChange} className='form-control' placeholder='Enter Employee Grade' />
                                            <span className='text-danger'>{errorMessages.employee_grade}</span>
                                        </div>
                                    )}
                                    {companyDetail?.is_account_unit_required && (
                                        <div className='form-group mb-4'>
                                            <label>Account Unit</label>
                                            <input type='text' name='account_unit' value={formData.account_unit} onChange={handleInputChange} className='form-control' placeholder='Enter Account Unit' />
                                            <span className='text-danger'>{errorMessages.account_unit}</span>
                                        </div>
                                    )}
                                    {companyDetail?.is_account_code_required && (
                                        <div className='form-group mb-4'>
                                            <label>Account Code</label>
                                            <input type='text' name='account_code' value={formData.account_code} onChange={handleInputChange} className='form-control' placeholder='Enter Account Code' />
                                            <span className='text-danger'>{errorMessages.account_code}</span>
                                        </div>
                                    )}
                                </>
                            )} */}

                            {formData?.traveller_type == "Company-Employee" && (
                                <>
                                    <div className='form-group mb-4'>
                                        <label>Company</label>
                                        {loginData?.user_company == "Casamelhor" ?
                                            <Select
                                                name="companyName"
                                                value={companyList?.find((opt) => opt.label == formData.companyName)}
                                                options={companyList}
                                                placeholder="Choose Company"
                                                className='react_selectbox'
                                                isSearchable={false}
                                                onMenuScrollToBottom={loadMoreCompanies}   // infinite scroll
                                                onChange={(e) => handleSelectDropdown(e, "company_uid")}
                                                styles={customStyles}
                                            /> : <input type='text' name='company_uid' value={loginData?.user_company} className='form-control' placeholder='Enter First name' disabled />
                                        }
                                        <span className='text-danger'>{errorMessages.companyName}</span>
                                    </div>

                                    <div className='form-group mb-4'>
                                        <label>Role</label>
                                        <Select
                                            name="role"
                                            value={roleOption.find((opt) => opt.label == formData.roleLabel)}
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
                                                <input type='text' name='employee_id' value={formData.employee_id} onChange={handleInputChange} className='form-control' placeholder='Enter Employee ID' />
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
                                                <input type='text' name='segment' value={formData.segment} onChange={handleInputChange} className='form-control' placeholder='Enter Dept./Segment' />
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
                                                <input type='text' name='designation' value={formData.designation} onChange={handleInputChange} className='form-control' placeholder='Enter Designation' />
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
                                                <input type='text' name='employee_grade' value={formData.employee_grade} onChange={handleInputChange} className='form-control' placeholder='Enter Employee Grade' />
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
                                                <input type='text' name='account_unit' value={formData.account_unit} onChange={handleInputChange} className='form-control' placeholder='Enter Account Unit' />
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
                                                <input type='text' name='account_code' value={formData.account_code} onChange={handleInputChange} className='form-control' placeholder='Enter Account Code' />
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
                                                        value={field?.values?.map((val) => ({ label: val, value: val }))?.find((Val) => Val.value == customFields[key])}
                                                        placeholder={`Select ${field.display_name}`}
                                                        className="react_selectbox"
                                                        isSearchable={false}
                                                        styles={customStyles}
                                                        onChange={(e) => {
                                                            setCustomFields({ ...customFields, [key]: e.value })
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="form-group mb-4" key={key}>
                                                    <label>{field.display_name}</label>
                                                    <input
                                                        type="text"
                                                        name={field.display_name}
                                                        value={customFields[key]}
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
                                <input type='email' name='email' value={formData.email || ""} onChange={handleInputChange} className='form-control' placeholder='Enter email ' />
                                <span className='text-danger'>{errorMessages.email}</span>
                            </div>

                            {/* <p className='subheadline-2 mt-3'>Login information</p>
                            <div className='form-group relative mb-4'>
                                <label> Password</label>
                                <input type={showPass ? 'text' : 'password'} name='password' onChange={handleInputChange} className='form-control' placeholder='Enter Password ' />
                                <span className='absolute bottom-3 right-2' onClick={() => setShowPass(!showPass)} style={{ cursor: 'pointer' }}>Show</span>
                                <span className='text-danger'>{errorMessages.password}</span>
                            </div>


                            <div className='form-group relative mb-4'>
                                <label>Re Enter Password</label>
                                <input type={showcPass ? 'text' : 'password'} name='con_password' onChange={handleInputChange} className='form-control' placeholder='Confirm Password ' />
                                <span className='absolute bottom-3 right-2' onClick={() => setShowcPass(!showcPass)} style={{ cursor: 'pointer' }}>Show</span>
                                <span className='text-danger'>{errorMessages.con_password}</span>
                            </div> */}

                            {companyInfo?.is_phone_required != "Off" && (
                                <div className='form-group mb-4'>
                                    <label>Phone number</label>
                                    <input type='text' name='phone' value={formData.phone || ""} onChange={handleInputChange} className='form-control' placeholder='Enter phone ' />
                                    <span className='text-danger'>{errorMessages.phone}</span>
                                </div>
                            )}

                            <p className='subheadline-2 mt-3'>Login information</p>
                            <div className='form-group relative mb-4'>
                                <label>New Password</label>
                                <input type={showPass ? 'text' : 'password'} name='password' onChange={handleInputChange} className='form-control' placeholder='Enter Password ' />
                                <span className='absolute bottom-3 right-2' onClick={() => setShowPass(!showPass)} style={{ cursor: 'pointer' }}>Show</span>
                                <span className='text-danger'>{errorMessages.password}</span>
                            </div>
                            <div className='form-group relative mb-4'>
                                <label>Confirm New Password</label>
                                <input type={showcPass ? 'text' : 'password'} name='con_password' onChange={handleInputChange} className='form-control' placeholder='Confirm Password ' />
                                <span className='absolute bottom-3 right-2' onClick={() => setShowcPass(!showcPass)} style={{ cursor: 'pointer' }}>Show</span>
                                <span className='text-danger'>{errorMessages.con_password}</span>
                            </div>


                            <p className='subheadline-2'>Status</p>

                            <div className='form-group '>
                                <label>Select Status</label>

                                <Select
                                    name="aria-role-select"
                                    options={statusOption}
                                    placeholder="Select Status"
                                    className="react_selectbox"
                                    isSearchable={false}
                                    styles={customStyles}
                                    value={statusOption.find((opt) => opt.value == selectedStatus)}
                                    // onChange={(option) => setSelectedStatus(option.value)}
                                    onChange={(option) => {
                                        setSelectedStatus(option.value);
                                        setIsStatusChanged(true); // 👈 user interaction track
                                    }}
                                // defaultValue={statusOption[0]}
                                />

                                {/* Show extra field only when "Inactive" is selected */}
                                {/* {!selectedStatus && ( */}
                                {selectedStatus === false && isStatusChanged && (
                                    <div className="mt-3">
                                        <label>Reason for Inactive</label>
                                        <input
                                            type="text"
                                            name='reason'
                                            className="form-control"
                                            placeholder="Enter reason"
                                            value={formData.reason || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}

                            </div>


                        </Col>

                        <Col md={3}>
                            <p className='subheadline-2'>Traveler photo</p>
                            {showPhoto && (
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
                                                setShowPhoto(false);
                                            }} href='#'>Delete</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {!showPhoto && (

                                <div className='add-upload-photo' style={{ border: '1px solid #dedede' }} >
                                    <Image src={"/images/icons/photo-camera.svg"} className='img-fluid' alt='camera' width={48} height={48} />
                                    <Button variant='' onClick={() => {
                                        //     handleOptionClick();
                                        removeFile()
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
                    <Button variant="" style={{ padding: '13px 25px' }} onClick={closeEditBox} className='btn-company-add '>
                        Cancel
                    </Button>
                    <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}
                        // onClick={filterClose}
                        onClick={handleChangeDetail}
                    >
                        Save Changes
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
                    <Button variant="" onClick={changepicClose} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={() => {
                        changepicClose()
                        // removeFile()
                        openEditBox()
                        setIsUploaded(true);
                    }} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>

        </>



    )
}
