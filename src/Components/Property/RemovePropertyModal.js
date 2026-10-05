"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { CompanyStatusValidation } from '@/utils/validation';
import { PropertyStatusUpdateApi, RemovePropertyListAPI } from '@/services/provider';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { dateFormatYearMonthDay } from '@/utils/formatTime';
import { alert_success } from '@/utils/Alerts/TostifyAlerts';
import Link from 'next/link';
import toast from 'react-hot-toast';


export const RemovePropertyModal = ({ compnayremoShow, compnayRemoveClose, settingData, getPropertyDetail }) => {
    // const param = useParams();
    // const id = param.id;
    // const [id, setId] = useState()
    const router = useRouter();
    // const searchParams = useSearchParams();

    // useEffect(() => {
    //     const stateParam = searchParams.get('state');
    //     if (stateParam) {
    //         const state = JSON.parse(decodeURIComponent(stateParam));
    //         setId(state.id)
    //     }
    // }, [searchParams]);
    const searchParams = useSearchParams();
    const id = searchParams.get("uid");
    const [isLoading,setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        isPermanent: false,
        reason: null,
        message: "",
    });

    useEffect(() => {
        // setFormData({            
        //     isPermanent: settingData?.is_permanently_inactive,
        //     reason: settingData?.inactive_reason ? settingData?.inactive_reason : "",
        //     message: settingData?.inactive_notes ? settingData?.inactive_notes : "",
        // })
        if (settingData?.is_permanently_inactive) {
            setFormData({
                isPermanent: settingData?.is_permanently_inactive,
                reason: settingData?.inactive_reason,
                message: settingData?.inactive_notes,
            })
        } else {
            setFormData({
                isPermanent: settingData?.is_permanently_inactive,
                reason: settingData?.scheduled_unavailability?.inactive_reason ? settingData?.scheduled_unavailability?.inactive_reason : undefined,
                message: settingData?.scheduled_unavailability?.inactive_notes ? settingData?.scheduled_unavailability?.inactive_notes : undefined,
            })
        }
    }, [compnayremoShow])
    const [error, setError] = useState({});

    const reasonsOption = [
        { value: "maintenance-repairs", label: "Maintenance/Repairs" },
        { value: "renovation", label: "Renovation" },
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
    const handleRemoveProperty = async () => {
        try {
            const { errors, isValid } = CompanyStatusValidation(formData);
            setError(errors)
            if (isValid) {
                const payload = {
                    inactive_reason: formData.reason,
                    inactive_notes: formData.message,
                    // is_permanently_inactive: formData.isPermanent
                };
                try {
                    setIsLoading(true);
                    const res = await RemovePropertyListAPI(id, payload);
                    if (res.data.success) {
                        setIsLoading(false);
                        toast.success(res.data.response.message)
                        router.push('PropertyListing?tab=inactive')
                        compnayRemoveClose()
                    }else{
                        setIsLoading(false)
                        toast.error(res.data.response)
                    }

                } catch (err) {
                    setIsLoading(false);
                    console.log(err);
                    toast.error("Failed to update!");
                }
            }
        } catch (error) {

        }
    }

    return (
        <Modal show={compnayremoShow} onHide={compnayRemoveClose} animation={false} centered className='custom-theme-modal status-height-70' >
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
                            name="reason"
                            options={reasonsOption}
                            value={reasonsOption.find((opt) => opt.value == formData.reason)}
                            placeholder="Select a reason"
                            className="react_selectbox"
                            isSearchable={false}
                            onChange={handleSelectReason}
                            styles={customStyles}
                        />
                        <span className='text-danger'>{error.reason}</span>
                    </div>

                    <div className='forom-group mb-4'>
                        <label>Tell why you need to unlist this company</label>
                        <textarea
                            name='message'
                            className="form-control textareabox mt-2"
                            value={formData.message}
                            rows={4}
                            onChange={handleInputChange}
                            placeholder="Add your message here"
                        />
                        <span className='text-danger'>{error.message}</span>
                    </div>

                </div>


            </Modal.Body>

            <Modal.Footer className='d-flex align-items-center justify-content-between '>
                <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={compnayRemoveClose}>
                    Cancel
                </Button>
                <Button variant="" className='confrim-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={handleRemoveProperty}>
                    {isLoading?<Spinner animation="border" variant="light" size='sm' />:"Yes, Remove"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
