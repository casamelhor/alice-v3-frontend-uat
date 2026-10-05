"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal } from 'react-bootstrap';
import Image from 'next/image';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { CompanyStatusValidation } from '@/utils/validation';
import { RoomStatusUpdateApi } from '@/services/provider';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { dateFormatYearMonthDay } from '@/utils/formatTime';
import { alert_danger, alert_success } from '@/utils/Alerts/TostifyAlerts';
import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
import toast from 'react-hot-toast';


export const RoomStatusModal = ({ roomShow, roomStatusClose, settingData, fetchRoomDetails }) => {
    const param = useParams();
    const id = param.id;
    const searchParams = useSearchParams();
    const paramDisable = searchParams.get("disable")
    const localData = JSON.parse(getItemLocalStorage('blockInfo'));
    const router = useRouter();
    // const [id, setId] = useState()
    // const searchParams = useSearchParams();

    // useEffect(() => {
    //     const stateParam = searchParams.get('state');
    //     if (stateParam) {
    //         const state = JSON.parse(decodeURIComponent(stateParam));
    //         setId(state.id)
    //     }
    // }, [searchParams]);
    const [formData, setFormData] = useState({
        currentStatus: "",
        inactiveFrom: "",
        inactiveTo: "",
        isPermanent: false,
        reason: null,
        message: "",
    });

    useEffect(() => {
        if (settingData?.is_permanently_inactive) {
            setFormData({
                currentStatus: settingData?.room_status,
                inactiveFrom: settingData?.inactive_from,
                inactiveTo: settingData?.inactive_to,
                isPermanent: settingData?.is_permanently_inactive,
                reason: settingData?.inactive_reason,
                message: settingData?.inactive_notes,
            })
        } else {
            setFormData({
                currentStatus: settingData?.is_scheduled_inactive ? "Inactive" : "Active",
                inactiveFrom: settingData?.scheduled_inactive_info?.inactive_from ? settingData?.scheduled_inactive_info?.inactive_from : undefined,
                inactiveTo: settingData?.scheduled_inactive_info?.inactive_to ? settingData?.scheduled_inactive_info?.inactive_to : undefined,
                isPermanent: settingData?.is_permanently_inactive,
                reason: settingData?.scheduled_inactive_info?.reason ? settingData?.scheduled_inactive_info?.reason : undefined,
                message: settingData?.scheduled_inactive_info?.notes ? settingData?.scheduled_inactive_info?.notes : undefined,
            })
        }
    }, [roomShow]);
    useEffect(() => {
        if (paramDisable == "true") {
            setFormData({
                currentStatus: localData?.set_room_status,
                inactiveFrom: localData?.start_date,
                inactiveTo: localData?.end_date,
                isPermanent: localData?.is_permanently_inactive ? localData?.is_permanently_inactive : false,
                reason: localData?.reason,
                message: localData?.note,
            })
        }
    }, [roomShow])
    const [error, setError] = useState({});
    const statusOption = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },

    ];
    const reasonsOption = [
        { value: "Maintenance", label: "Maintenance/Repairs" },
        { value: "Renovation", label: "Renovation" },
        { value: "seasonal-closure", label: "Seasonal closure" },
        { value: "property-damage", label: "Property damage" },
        { value: "contract-ended", label: "Contract ended" },
        { value: "other", label: "Other" },
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
    const handleSelectChange = (opt, name) => {
        let newVal = { [name]: opt.value }
        if (opt.value == "Active") {
            const updatedForm = { ...formData, [name]: opt.value };
            delete updatedForm.inactiveFrom;
            delete updatedForm.inactiveTo;
            delete updatedForm.reason;
            delete updatedForm.message;
            setFormData(updatedForm);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: opt.value,
                inactiveFrom: "",
                inactiveTo: "",
                reason: "",
                message: ""
            }));
        }
        // setFormData({
        //     ...formData,
        //     [name]: opt.value
        // })
        const { errors } = CompanyStatusValidation(newVal)
        setError({
            ...error,
            ...errors
        })
    }
    const handleParmanentCheckBox = (e) => {
        const { name, checked } = e.target;
        let newVal = { [name]: checked }
        if (checked) {
            const updatedForm = { ...formData, isPermanent: checked, };
            // delete updatedForm.inactiveFrom;
            delete updatedForm.inactiveTo;
            // delete updatedForm.reason;
            // delete updatedForm.message;
            setFormData(updatedForm);
        } else {
            const updatedForm = { ...formData, isPermanent: false };
            // delete updatedForm.message;
            setFormData(updatedForm)
        }
        // const { errors } = CompanyStatusValidation(newVal)
        // setError({
        //     ...error,
        //     ...errors
        // })

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newData = { [name]: value }
        setFormData({
            ...formData,
            [name]: value
        })
        const { errors } = CompanyStatusValidation(newData)
        setError({
            ...error,
            ...errors
        })
    }
    const handleSelectReason = (e) => {
        let newData = { ['reason']: e.value }
        setFormData({
            ...formData,
            ['reason']: e.value
        })
        const { errors } = CompanyStatusValidation(newData)
        setError({
            ...error,
            ...errors
        })
    }
    const handleDateChange = (value, name) => {
        let newData = { [name]: value }
        setFormData({
            ...formData,
            [name]: value
        })
        const { errors } = CompanyStatusValidation(newData)
        setError({
            ...error,
            ...errors
        })
    }
    const handleConfirmChange = async () => {
        try {
            const { errors, isValid } = CompanyStatusValidation(formData);
            setError(errors)
            if (isValid) {
                const payload = {
                    room_status: formData.currentStatus,
                    // inactive_from: dateFormatYearMonthDay(formData.inactiveFrom),
                    // inactive_to: dateFormatYearMonthDay(formData.inactiveTo),
                    // inactive_reason: formData.reason,
                    // inactive_notes: formData.message,
                    is_permanently_inactive: formData.isPermanent
                };
                if (formData.currentStatus == "Inactive") {
                        payload.inactive_from = dateFormatYearMonthDay(formData.inactiveFrom);
                        if(formData.inactiveTo) payload.inactive_to = dateFormatYearMonthDay(formData.inactiveTo);
                        payload.inactive_reason = formData.reason;
                        payload.inactive_notes = formData.message;
                }

                try {
                    const res = await RoomStatusUpdateApi(id, payload);
                    if (res.data.success) {
                        // alert_success(res.data.response.message)
                        toast.success(res.data.response.message)
                        fetchRoomDetails()
                        removeItemLocalStorage('blockInfo')
                        router.push(`/Roomdetails/${id}`)
                        roomStatusClose()
                    } else {
                        toast.error(res.data.response.booking_conflict.message)
                    }

                } catch (err) {
                    console.log(err);
                    toast.error("Failed to update!");
                }
            }
        } catch (error) {

        }
    }

    console.log(settingData, localData)

    return (
        <Modal show={roomShow} onHide={roomStatusClose} className='custom-theme-modal status-height-70' animation={false} centered >
            <Modal.Header className='d-flex align-items-center justify-content-between ' >
                <Modal.Title>Change room status</Modal.Title>
                <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={roomStatusClose} />
            </Modal.Header>
            <Modal.Body>

                <div className='company-status-box'>
                    <div className='form-group mb-2'>
                        <label>Current Status</label>
                        <Select
                            name="currentStatus"
                            options={statusOption}
                            placeholder="Choose Status"
                            className="react_selectbox"
                            isSearchable={false}
                            value={statusOption.find((val) => val.value == formData.currentStatus)}
                            onChange={(e) => handleSelectChange(e, "currentStatus")}
                            isDisabled={paramDisable == "true" ? true : false}
                            styles={customStyles}
                        />
                        <span className='text-danger'>{error.currentStatus}</span>
                    </div>
                    {formData?.currentStatus === "Inactive" && (
                        <p style={{
                            color: '#73615F'
                        }}>The room will be unlisted until you change the status.</p>

                    )}

                    {formData?.currentStatus === "Inactive" && (
                        <div className="inactive-box">
                            <Row className=''>
                                <Col md={6}>
                                    <div className='form-group mb-4'>
                                        <label>Inactive date from</label>
                                        <DatePicker
                                            selected={formData.inactiveFrom}
                                            onChange={(e) => handleDateChange(e, "inactiveFrom")}
                                            placeholderText="Select date"
                                            className="form-control  custom-date-picker"
                                            minDate={new Date()}
                                            dateFormat="dd/MM/yyyy"
                                            disabled={settingData?.is_permanently_inactive}
                                        />
                                        <span className='text-danger'>{error.inactiveFrom}</span>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className='form-group mb-4'>
                                        <label>Inactive date to</label>
                                        <DatePicker
                                            selected={formData.inactiveTo}
                                            onChange={(e) => handleDateChange(e, "inactiveTo")}
                                            placeholderText="Select date"
                                            className="form-control custom-date-picker"
                                            minDate={formData.inactiveFrom || new Date()}
                                            disabled={formData.isPermanent?true:false}
                                            dateFormat="dd/MM/yyyy"
                                        />
                                        <span className='text-danger'>{error.inactiveTo}</span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className='confirm-address-block mb-4' >
                                        <input type='checkbox' name='isPermanent' checked={formData.isPermanent} disabled={settingData?.is_permanently_inactive} id='confirm-add' className='custom-checkbox'
                                            onChange={handleParmanentCheckBox}
                                        />
                                        <label htmlFor='confirm-add'>Mark as Permanently inactive</label>
                                    </div>
                                </Col>
                            </Row>
                            <div className='form-group mb-4'>
                                <label>Reason</label>
                                <Select
                                    name="reason"
                                    options={reasonsOption}
                                    value={reasonsOption.find((opt) => opt.value == formData.reason)}
                                    placeholder="Select a reason"
                                    className="react_selectbox"
                                    isSearchable={false}
                                    onChange={handleSelectReason}
                                    styles={customStyles}
                                    isDisabled={settingData?.is_permanently_inactive}
                                />
                                <span className='text-danger'>{error.reason}</span>
                            </div>
                            <div className='forom-group mb-4'>
                                <label>Tell why you need to unlist this room</label>
                                <textarea
                                    name='message'
                                    className="form-control textareabox mt-2"
                                    rows={4}
                                    value={formData.message}
                                    placeholder="Add your message here"
                                    onChange={handleInputChange}
                                    disabled={settingData?.is_permanently_inactive}
                                />
                                <span className='text-danger'>{error.message}</span>
                            </div>
                        </div>
                    )}

                </div>


            </Modal.Body>
            <Modal.Footer className='d-flex align-items-center justify-content-between '>
                <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={roomStatusClose}>
                    Cancel
                </Button>
                <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={handleConfirmChange}>
                    Confirm and  Change
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
