"use client"
import React from 'react'
import { useEffect, useState } from "react";
import Header from '../Header/Header'
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Card } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { UserCompanyUpdateAPI, UserDetailAPI, UserRoleListAPI } from '@/services/provider';
import { travellerValidation } from '@/utils/validation';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';

export default function AccountSetting() {

    const [showPasswordUI, setShowPasswordUI] = useState(false);
    const loginData = JSON.parse(getItemLocalStorage("userLogin"));
    const [userDetails, setUserDetails] = useState({});
    const [isEditManage, setIsEditManage] = useState(false);

    const handleUpdateClick = () => {
        setShowPasswordUI(true);
    };

    const handleSaveClick = () => {
        // Save API call here…
        setShowPasswordUI(false); // go back to old UI
    };

    const [changepicsModal, changepisetShow] = useState(false);
    const [showPhoto, setShowPhoto] = useState(true);
    const [isFileDeleted, setIsFileDeleted] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    const changepicClose = () => { changepisetShow(false); };
    const changepicModal = () => { changepisetShow(true); closeEditBox(); };

    // const changepicClose = () =>{

    // }

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

    //   drag drop upload
    const [file, setFile] = useState(null);
    const param = useParams();
    // const id = param.id;
    // const pathname = usePathname();
    // const loginData = JSON.parse(getItemLocalStorage("userLogin"));
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        // company_uid: "",
        // companyName: "",
        // designation: "",
        // employee_id: "",
        email: "",
        phone: "",
        role: "",
        // rezo_ticket: "",
        // traveller_type: "",
        segment: "",
        // employee_grade: "",
        // account_unit: "",
        // account_code: "",
        roleLabel: "",
        new_password: "",
        con_password: "",
        // reason: "",
        profile_image: null
    });
    const [role, setRole] = useState([]);
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
    const togglePicOption = () => {
        setIsOpen((prev) => !prev);
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
        if (name == "role") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                ["roleLabel"]: label
            }));
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

    const getUserDetails = async () => {
        try {
            const response = await UserDetailAPI(loginData?.uid)
            if (response?.data?.success) {
                setUserDetails(response.data.response);
                // debugger
                setFormData({
                    firstName: response.data.response.first_name,
                    lastName: response.data.response.last_name,
                    gender: response.data.response.gender,
                    // company_uid: response.data.response.first_name,
                    // companyName: response.data.response.company_name,
                    // designation: response.data.response.designation,
                    // employee_id: response.data.response.employee_id,
                    email: response.data.response.email,
                    phone: response.data.response.phone_number,
                    role: response.data.response.user_role.role_name,
                    // rezo_ticket: response.data.response.first_name,
                    // traveller_type: response.data.response.user_category,
                    segment: response.data.response.segment,
                    // employee_grade: response.data.response.employee_grade,
                    // account_unit: response.data.response.account_unit,
                    // account_code: response.data.response.account_code,
                    roleLabel: response.data.response.user_role.role_name,
                    // password: response.data.response.first_name,
                    // con_password: response.data.response.first_name,
                    // reason: response.data.response.reason,
                    // profile_image: response.data.response.profile_image || null
                })
                setFile(response.data.response.profile_image)
            }
        } catch (error) {
            console.log(error);
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

    useEffect(() => {
        getUserDetails();
        userListData();
    }, [])

    const handleChangeDetail = async (e) => {
        e.preventDefault()
        try {
            const { isValid, errors } = travellerValidation(formData, '', requiredField)
            setErrorMessages(errors)
            if (isValid) {
                const fieldData = new FormData();
                fieldData.append("first_name", formData.firstName);
                fieldData.append("last_name", formData.lastName);
                fieldData.append("gender", formData.gender)
                fieldData.append("email", formData.email)
                fieldData.append("phone_number", formData.phone)
                fieldData.append("segment", formData.segment)
                if (formData.new_password) fieldData.append("new_password", formData.new_password)
                if (formData.con_password) fieldData.append("confirm_new_password", formData.con_password)
                if (formData.profile_image) {
                    fieldData.append("profile_image", formData.profile_image)
                }
                const response = await UserCompanyUpdateAPI(loginData?.uid, fieldData);
                if (response?.data?.success) {
                    setIsEditManage(false);
                    setShowPasswordUI(false);
                    toast.success("Updated Account setting data")
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log(userDetails)

    return (
        <>
            <Header />
            <Toaster position="top-right" />
            <div className='page-body  pt-4 pb-4'>

                <section className='people-section'>
                    <Container>
                        <Row className='align-items-center justify-center pb-4 pt-4 mb-4'>

                            <Col md={6}>

                                <Row>
                                    <Col md={4}>

                                        {showPhoto && (
                                            <div className='upload-photo mb-3'>
                                                <Image src={file ? `${file}` : '../images/icons/No-Image.svg'} className='img-fluid' alt='profile' width={160} height={160} />
                                                {/* <Image src={file ? file : '/images/icons/photo-camera.svg'} className='img-fluid' alt='profile' width={214} height={214} /> */}
                                                <span className='more-action' onClick={togglePicOption}  >
                                                    <Image src='../images/icons/more-dots-3.svg' className='img-fluid' alt='more' width={16} height={16} />
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

                                            <div className='add-upload-photo mb-3' style={{ border: '1px solid #dedede' }} >
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

                                        <h3>{formData?.firstName} {formData?.lastName}</h3>
                                        <p>{formData?.email}</p>
                                    </Col>
                                </Row>



                                <div className='comapny-information-box mt-4 '>
                                    <h4 className='mb-4 d-flex justify-between'>Personal details
                                        {isEditManage ?
                                            <Link href="#" className={`Save-company-btn`} style={{ textDecoration: 'none' }} onClick={handleChangeDetail}> Done </Link>
                                            :
                                            <span className='fs-14 fw-medium' style={{ fontSize: '14px', fontFamily: 'gilroy' }} onClick={() => setIsEditManage(true)}>Edit Personal Details</span>

                                        }
                                    </h4>
                                    {!isEditManage ?
                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Name  </span> <br></br>
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {formData?.firstName} {formData?.lastName} </span>
                                        </p> : (
                                            <>
                                                <div className='form-group mb-4'>
                                                    <label>First name</label>
                                                    {/* value={formData.firstName}  */}
                                                    <input type='text' name='firstName' value={formData.firstName || ""} onChange={handleInputChange} className='form-control' placeholder='Enter First name' />
                                                    <span className='text-danger'>{errorMessages.firstName}</span>
                                                </div>
                                                <div className='form-group mb-4'>
                                                    <label>Last name</label>
                                                    {/* value={formData.firstName}  */}
                                                    <input type='text' name='lastName' value={formData.lastName || ""} onChange={handleInputChange} className='form-control' placeholder='Enter Last name' />
                                                    <span className='text-danger'>{errorMessages.lastName}</span>
                                                </div>
                                            </>
                                        )
                                    }


                                    {!isEditManage ?
                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Phone number  </span> <br></br>
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {formData?.phone}  </span>
                                        </p> :
                                        <div className='form-group mb-4'>
                                            <label>Phone number</label>
                                            <input type='text' name='phone' maxLength={10} value={formData.phone || ""} onChange={handleInputChange} className='form-control' placeholder='Enter phone ' />
                                            <span className='text-danger'>{errorMessages.phone}</span>
                                        </div>
                                    }

                                    {!isEditManage ?
                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Gender  </span> <br></br>
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {formData?.gender}  </span>
                                        </p> :
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
                                    }


                                </div>
                                <div className='comapny-information-box '>
                                    <h4 className='mb-4'>Work identity</h4>
                                    {!isEditManage ?
                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Email address  </span> <br></br>
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {formData?.email} </span>
                                        </p> :
                                        <div className='form-group mb-4'>
                                            <label>Email</label>
                                            <input type='email' name='email' value={formData.email || ""} onChange={handleInputChange} className='form-control' placeholder='Enter email ' />
                                            <span className='text-danger'>{errorMessages.email}</span>
                                        </div>
                                    }

                                    {!isEditManage ?
                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Department  </span> <br></br>
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {formData?.segment} </span>
                                        </p>
                                        :
                                        <div className='form-group mb-4'>
                                            <label>Department</label>
                                            <input type='text' name='segment' value={formData.segment} onChange={handleInputChange} className='form-control' placeholder='Enter Dept./Segment' />
                                            <span className='text-danger'>{errorMessages.segment}</span>
                                        </div>
                                    }

                                    {!isEditManage ?
                                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Role  </span> <br></br>
                                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {formData?.role} </span>
                                        </p> :
                                        <div className='form-group mb-4'>
                                            <label>Role</label>
                                            <Select
                                                name="role"
                                                value={role.find((opt) => opt.label == formData.roleLabel)}
                                                options={role}
                                                placeholder="Choose Role"
                                                className='react_selectbox role-icn-2'
                                                isSearchable={false}
                                                onChange={(e) => handleSelectDropdown(e, "role")}
                                                // defaultValue={role[0]}
                                                styles={customStyles}
                                            />
                                            <span className='text-danger'>{errorMessages.role}</span>
                                        </div>
                                    }
                                </div>


                                <div className='comapny-information-box '>
                                    <h4 className='mb-4 d-flex justify-between'>Login  </h4>

                                    <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><div className="d-flex justify-between"> <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Password  </span>
                                        {!showPasswordUI && (
                                            <span className='fs-14 fw-medium' style={{ fontSize: '14px', fontFamily: 'gilroy' }} onClick={handleUpdateClick} >Update</span>
                                        )}

                                        {showPasswordUI && (
                                            <span className='fs-14 fw-medium' style={{ fontSize: '14px', fontFamily: 'gilroy' }} onClick={() => setShowPasswordUI(false)}
                                            >Cancel</span>
                                        )}

                                    </div>
                                        <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > Last updated 1 month ago </span></p>



                                    {showPasswordUI && (
                                        <div className="new-ui">

                                            <p className="note">
                                                Must include at least one symbol or number and have at least 8 characters.
                                            </p>
                                            <div className='form-group relative mb-4'>
                                                <label>Current Password</label>
                                                <input type="password" placeholder="Current Password" name='' onChange={handleInputChange} className="form-control" />
                                            </div>
                                            <div className='form-group relative mb-4'>
                                                <label>New password</label>
                                                <input type="password" placeholder="New Password" name='new_password' onChange={handleInputChange} className="form-control" />
                                            </div>
                                            <div className='form-group relative mb-4'>
                                                <label>Confirm password</label>
                                                <input type="password" placeholder="Re-enter-password" name='con_password' onChange={handleInputChange} className="form-control" /></div>
                                            <div className='form-group relative mb-4'>
                                                <button className="complete-form-btn" onClick={handleChangeDetail}>
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>



                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>


            <Modal show={changepicsModal} onHide={changepicClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
                    <Modal.Title>
                        Upload photo
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose} />
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
                                    <Image src="/images/icons/delete.svg" className='img-fluid ' width={24} height={24} alt='delete' />
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
