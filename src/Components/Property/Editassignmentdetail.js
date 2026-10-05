"use client"
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Table, Thead } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from "react-datepicker";
import { useParams, useSearchParams } from "next/navigation";
import { UpdatePropertyAssignmentAPI, PropertyDataById, companyListAPI } from "@/services/provider";
import { convertDateYYYYMMDD } from "@/utils/formatTime";
import { useRouter } from 'next/navigation';
import { alert_danger, alert_success } from '@/utils/Alerts/TostifyAlerts';
// import { ToastContainer } from 'react-toastify';

export default function Editassignmentdetail() {
    // const PUID = localStorage.getItem("propertyUid")
    const param = useParams();
    const router = useRouter();
    const id = param.id;
    const [properties, setProperties] = useState([])
    const [CompanyListData, setCompanyListData] = useState([]);
    const searchParams = useSearchParams();
    const propertyUid = searchParams.get("property_uid");
    const params = useParams();
    const assignmentUid = params.id;
    const [roomIdForUrl, setRoomIdForUrl] = useState(null)

    useEffect(() => {
        const saved = localStorage.getItem("roomIdForUrl");
        if (saved) {
            setRoomIdForUrl(saved);
        }
    }, [])


    const handleChangeDate = async () => {
        try {
            if (!properties.length) return;

            const item = properties[0];

            const fieldData = new FormData();
            fieldData.append("assignment_uids", JSON.stringify([item.uid]));
            fieldData.append("company_uids", JSON.stringify([item.company_uid]));
            fieldData.append(
                "date_from",
                JSON.stringify([convertDateYYYYMMDD(item.dateFrom)])
            );
            fieldData.append(
                "date_to",
                JSON.stringify([convertDateYYYYMMDD(item.dateTo)])
            );

            const response = await UpdatePropertyAssignmentAPI(propertyUid, fieldData);

            if (response?.data?.success) {
                alert_success("Changed data successfully");

                setTimeout(() => {
                    router.push(`/propertyDetails?uid=${propertyUid}`);
                }, 2000);
            } else {
                alert_danger(
                    response?.data?.message || "Something went wrong"
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


    useEffect(() => {
        const fetchAssignment = async () => {
            if (!propertyUid || !assignmentUid) return;

            const res = await PropertyDataById(propertyUid);
            const list = res?.data?.response || [];

            const selectedAssignment = list.find(
                item => item.uid === assignmentUid
            );

            if (selectedAssignment) {
                setProperties([{
                    ...selectedAssignment,
                    dateFrom: selectedAssignment.date_from
                        ? new Date(selectedAssignment.date_from)
                        : null,
                    dateTo: selectedAssignment.date_to
                        ? new Date(selectedAssignment.date_to)
                        : null,
                }]);
            }
        };

        fetchAssignment();
    }, [propertyUid, assignmentUid]);




    useEffect(() => {
        if (!propertyUid) return;

        PropertyDataById(propertyUid);
        // URL banega:
        // /property/{property_uid}/assignments ✅
    }, [propertyUid]);



    const getCompanyList = async () => {
        try {
            const response = await companyListAPI("all");
            if (response?.data?.success) {
                const companyList = response.data.response.map(company => ({
                    value: company.uid,
                    label: company.company_name
                }));
                setCompanyListData(companyList);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { getCompanyList(); }, [])

    // console.log(inputData)
    return (
        <>
            {/* <ToastContainer /> */}
            <Header />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>

                                <li><Link href='./PropertyListing'>Properties</Link></li>

                                {/* <li><Link href='./PropertyDetails'>Astha Homes, Mumbai Listing Editor</Link></li> */}
                                <li> <Link href={`/propertyDetails?uid=${propertyUid}`}>
                                    {properties[0]?.property_name}
                                </Link></li>


                                <li>Assign Property 
                                    {/* <Image src="./images/icons/bottom-arrow.svg" className='img-fluid ms-2' alt='bot-arrow' width={10} height={10} />  */}
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='page-body '>
                <Container>
                    <Row>
                        <Col md={12} className='mb-4 mt-4' >
                            <Link href={`/propertyDetails?uid=${propertyUid}`} className='back-page'>
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={6} className=' mb-4' >
                            <div className=' pb-4  '>
                                <h2 className='page-title'>Change Assignment Dates</h2>
                            </div>
                            {/* {properties.map((property, idx) => ( */}
                            <div className='assign-property-box '
                            // key={idx}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {/* 
                                        {idx !== 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                                                <span className="d-flex align-items-center" style={{ cursor: 'pointer', color: '#463527', fontWeight: 500 }} onClick={() => handleCollapseProperty(idx)}>
                                                    {property.collapsed ? 'Expand' : 'Collapse'}
                                                    <Image
                                                        src={property.collapsed ? '/images/icons/top-arrow.svg' : '/images/icons/top-arrow.svg'}
                                                        width={18}
                                                        height={18}
                                                        alt={property.collapsed ? 'Expand' : 'Collapse'}
                                                        style={{ transform: property.collapsed ? 'rotate(180deg)' : 'none', marginLeft: '6px' }}
                                                    />
                                                </span>
                                                <Button variant="outline" style={{ border: '1px solid #463527', background: 'none', padding: '8px', borderRadius: '0' }} onClick={() => handleDeleteProperty(idx)}>
                                                    <Image src='/images/icons/delete_b.svg' width={20} height={20} alt='Delete' />
                                                </Button>
                                            </div>
                                        )} */}
                                </div>
                                <hr style={{ marginTop: 0 }} />
                                {/* {!property.collapsed && ( */}
                                <div className='add-propertu-assign mt-4 ' >
                                    {/* {properties.length > 0 && properties.map((item, index) => ( */}
                                    {properties.map((item, index) => (
                                        <Row key={item.uid}>
                                            <Col md={12}>
                                                <div className='form-group mb-4'>
                                                    <label className="font-18" >Company name</label>
                                                    <Select
                                                        className=' buisness-select'
                                                        options={CompanyListData}
                                                        placeholder='Add a Property'
                                                        isSearchable={false}
                                                        isDisabled={true}
                                                        value={
                                                            CompanyListData.find(
                                                                c => c.value === item.company_uid
                                                            ) || null
                                                        }
                                                        // value={item.uid ? (CompanyListData?.find(c => c.label === item.assigned_company) || null) : (CompanyListData?.find(c => c.value === item.assigned_company) || null)}
                                                        // value={property.name}
                                                        // onChange={option => handleChange(idx, 'name', option)}

                                                        components={{
                                                            MenuList: (props) => (
                                                                <>
                                                                    {props.children}
                                                                    <div style={{ padding: '12px', borderTop: '1px solid #eee', textAlign: 'left' }}>
                                                                        <span style={{ color: '#463527' }}>Can’t find the property?</span><br />
                                                                        <Link href='#' style={{ color: '#463527', textDecoration: 'underline', fontWeight: 500 }}>Create a new listing</Link>
                                                                    </div>
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                </div>
                                                <hr />
                                            </Col>
                                            <Col md={6}>
                                                <div className='form-group'>
                                                    <label className="font-18" >Date From</label>
                                                    <DatePicker
                                                        selected={item.dateFrom}
                                                        // onChange={date => handleChange(idx, 'dateFrom', date)}
                                                        onChange={(date) => {
                                                            setProperties(prev =>
                                                                prev.map((p, i) =>
                                                                    i === index ? { ...p, dateFrom: date } : p
                                                                )
                                                            );
                                                        }}
                                                        placeholderText="Select Dates"
                                                        className="form-control custom-date-picker"
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className='form-group'>
                                                    <label className="font-18" >Date To</label>
                                                    <DatePicker
                                                        selected={item.dateTo}
                                                        // onChange={date => handleChange(idx, 'dateTo', date)}
                                                        onChange={(date) => {
                                                            setProperties(prev =>
                                                                prev.map((p, i) =>
                                                                    i === index ? { ...p, dateTo: date } : p
                                                                )
                                                            );
                                                        }}
                                                        placeholderText="Select Dates"
                                                        className="form-control custom-date-picker"
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                </div>
                                            </Col>
                                        </Row>))}
                                </div>
                                {/* )} */}
                            </div>
                            {/* ))} */}
                            <div className="form-group mt-5 mb-4">
                                <Button variant="" className="btn-success complete-form-btn" style={{ padding: '14px 50px' }} onClick={handleChangeDate}>Done</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}
