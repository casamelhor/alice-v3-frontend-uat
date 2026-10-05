"use client"
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Table, Thead } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from "react-datepicker";
import { useParams } from "next/navigation";
import { PropertyDataById, PropertyListFullApi, UpdatePropertiesAssienToCompnayAPI } from "@/services/provider";
import { convertDateYYYYMMDD } from "@/utils/formatTime";
import { useRouter } from 'next/navigation';
import { alert_danger, showError, showErrorMsg } from "@/utils/Alerts/TostifyAlerts";
import toast from "react-hot-toast";
// import { ToastContainer } from "react-toastify";

export default function EditAssignPropertyToCompany() {
    const PUID = localStorage.getItem("propertyUid")
    const param = useParams();
    const router = useRouter();
    const id = param.id;
    const [inputData, setInputData] = useState({ dateFrom: '', dateTo: '' })
    const [properties, setProperties] = useState([])
    // const [CompanyListData, setCompanyListData] = useState([]);
    const [propertyList, setPropertyList] = useState([]);
    // const [properties, setProperties] = useState([
    //     {
    //         name: null,
    //         dateFrom: null,
    //         dateTo: null,
    //         collapsed: false
    //     }
    // ]);

    // const handleAddProperty = () => {
    //     setProperties([
    //         ...properties,
    //         {
    //             name: null,
    //             dateFrom: null,
    //             dateTo: null,
    //             collapsed: false
    //         }
    //     ]);
    // };

    // const handleDeleteProperty = (idx) => {
    //     setProperties(properties.filter((_, i) => i !== idx));
    // };

    // const handleCollapseProperty = (idx) => {
    //     setProperties(properties.map((prop, i) =>
    //         i === idx ? { ...prop, collapsed: !prop.collapsed } : prop
    //     ));
    // };

    // const handleChange = (idx, field, value) => {
    //     setProperties(properties.map((prop, i) =>
    //         i === idx ? { ...prop, [field]: value } : prop
    //     ));
    // };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await PropertyDataById(PUID);
                const data = await res.data.response;
                const filterdData = data.filter(ele => ele.uid === id)
                setInputData({ ...inputData, dateFrom: filterdData[0].date_from, dateTo: filterdData[0].date_to })
                setProperties(filterdData)
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        // if (propertyLs?.uid) {
        fetchData();
        // }
    }, []);

    const handleChangeDate = async () => {
        try {
            const fieldData = new FormData();
            fieldData.append("assignment_uids", JSON.stringify([id]));
            fieldData.append("property_uids", JSON.stringify([propertyList?.find(c => c.value === properties[0]?.property_uid)?.value || null]));
            fieldData.append("date_from", JSON.stringify([convertDateYYYYMMDD(inputData.dateFrom)]));
            fieldData.append("date_to", JSON.stringify([convertDateYYYYMMDD(inputData.dateTo)]));
            const response = await UpdatePropertiesAssienToCompnayAPI(properties?.[0]?.company_uid, fieldData)
            if (response?.data?.success) {
                router.push(`/CompanyDetails/${properties?.[0]?.company_uid}`)
            }else{
                // alert_danger(response?.data?.response)
                toast.error(showErrorMsg(response.data.response))
            }
        } catch (error) {
            console.log(error);
        }
    }


    const getPropertiesList = async () => {
        try {
            const response = await PropertyListFullApi();
            if (response?.data?.success) {
                const filterData = response.data.response.filter(item => item.property_status == "Assigned")
                setPropertyList(filterData.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url })))
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { getPropertiesList(); }, [])

    console.log(inputData)
    console.log(properties, propertyList)
    return (
        <>
            <Header />            
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>

                                <li><Link href='/AllCompany'>Company</Link></li>

                                <li><Link href={`/CompanyDetails/${properties?.[0]?.company_uid}`}>{properties?.[0]?.assigned_company}</Link></li>

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
                            <Link href={`/PropertyDetails/${PUID}`} className='back-page'>
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
                                    {properties.length > 0 && properties.map((item, index) => (<Row key={index}>
                                        <Col md={12}>
                                            <div className='form-group mb-4'>
                                                <label className="font-18" >Property name/BR name</label>
                                                <Select
                                                    className='add-home-field'
                                                    options={propertyList}
                                                    placeholder='Add a Property'
                                                    isSearchable={false}
                                                    isDisabled={true}
                                                    value={propertyList?.find(c => c.value === item.property_uid)}
                                                    // value={property.name}
                                                    // onChange={option => handleChange(idx, 'name', option)}

                                                    components={{
                                                        MenuList: (props) => (
                                                            <>
                                                                {props.children}
                                                                {!props.options.length && (
                                                                    <div style={{ padding: '12px', borderTop: '1px solid #eee', textAlign: 'left' }}>
                                                                        <span style={{ color: '#463527' }}>Can’t find the property?</span><br />
                                                                        <Link href='#' style={{ color: '#463527', textDecoration: 'underline', fontWeight: 500 }}>Create a new listing</Link>
                                                                    </div>
                                                                )}
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
                                                    selected={inputData.dateFrom}
                                                    // onChange={date => handleChange(idx, 'dateFrom', date)}
                                                    onChange={option => setInputData({
                                                        ...inputData,
                                                        dateFrom: option
                                                    })}
                                                    placeholderText="Select Dates"
                                                    minDate={new Date()}
                                                    className="form-control custom-date-picker"
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className='form-group'>
                                                <label className="font-18" >Date To</label>
                                                <DatePicker
                                                    selected={inputData.dateTo}
                                                    // onChange={date => handleChange(idx, 'dateTo', date)}
                                                    onChange={option => setInputData({
                                                        ...inputData,
                                                        dateTo: option
                                                    })}
                                                    placeholderText="Select Dates"
                                                    minDate={inputData.dateFrom || new Date()}
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
