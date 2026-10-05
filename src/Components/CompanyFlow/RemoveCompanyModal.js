"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import Select from 'react-select';
import {  RemoveCompanyAPI } from '@/services/provider';
import {  useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { showErrorMsg } from '@/utils/Alerts/TostifyAlerts';

export const RemoveCompanyModal = ({ compnayremoShow, cmppremodShow, compnayRemoveClose, companyDetail }) => {

    const searchParams = useSearchParams();
    const id = searchParams.get("uid");

    const [reasonType, setReasonType] = useState({
        reason: '',
        message: ''
    })

    useEffect(() => {
        if (companyDetail?.is_permanently_inactive) {
            setReasonType({
                isPermanent: companyDetail?.is_permanently_inactive,
                reason: companyDetail?.inactive_reason,
                message: companyDetail?.inactive_notes,
            })
        } else {
            setReasonType({
                isPermanent: companyDetail?.is_permanently_inactive,
                reason: companyDetail?.scheduled_inactive_info?.reason ? companyDetail?.scheduled_inactive_info?.reason : undefined,
                message: companyDetail?.scheduled_inactive_info?.notes ? companyDetail?.scheduled_inactive_info?.notes : undefined,
            })
        }
    }, [compnayremoShow]);

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

    const reasonsOption = [
        { value: "maintenance-repairs", label: "Maintenance/Repairs" },
        { value: "renovation", label: "Renovation" },
        { value: "seasonal-closure", label: "Seasonal closure" },
        { value: "property-damage", label: "Property damage" },
        { value: "contract-ended", label: "Contract ended" },
        { value: "other", label: "Other" },
    ]

    const handleRemoveCompany = async () => {
        try {
            const payload = {
                removal_date: new Date().toISOString().split('T')[0],
                reason: reasonType.reason,
                confirmation_text: "REMOVE COMPANY",
                reason_text: reasonType.message,
                data_retention_policy: "archive_7_years",
                notify_stakeholders: true
            };

            const response = await RemoveCompanyAPI(id, payload);

            if (response?.data?.success) {
                toast.success(response?.data?.message || 'Company removed successfully');
                compnayRemoveClose();
            } else {
                toast.error(showErrorMsg(response.data.response))
            }
        } catch (error) {
            error?.response?.data?.message || 'Something went wrong while removing company'
            console.error('Remove company error:', error);
        }
    };

    return (
        <Modal show={compnayremoShow} onHide={compnayRemoveClose} animation={false} centered className='custom-theme-modal status-height-70' >
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
                        {/* <input type='text' name='reason' id='confirm-add' className='custom-checkbox'
                                onChange={(e) => setReasonType({ ...reasonType, reason: e.target.value })}
                            /> */}
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
                            value={reasonType.message}
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
        </Modal>
    )
}
