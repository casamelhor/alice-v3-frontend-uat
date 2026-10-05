"use client"
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Table, Thead } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from "react-datepicker";
import ProtectedRoute from "../ProtectedRoute";
import { useSearchParams } from "next/navigation";
import { AssignProperty, MultiplePropertiesAssignToCompany, PropertyListApi, PropertyListFullApi } from "@/services/provider";
import { useRouter } from "next/navigation";
import { alert_danger, alert_success } from '@/utils/Alerts/TostifyAlerts';
import toast, { Toaster } from "react-hot-toast";
// import { ToastContainer } from 'react-toastify';


export default function AssignPropertyComponent() {
    const router = useRouter();
    // const [id, setId] = useState(null);


    const searchParams = useSearchParams();
    const id = searchParams.get("uid");
    const [propertyList, setPropertyList] = useState([]);
    const companyName = searchParams.get("company_name");

    const getPropertiesList = async () => {
        try {
            const response = await PropertyListFullApi("all");
            if (response?.data?.success) {
                // const filterData = response.data.response.filter(item => item.property_status == "Active")
                // setPropertyList(filterData.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url })))
                const propertiesWithoutAlice = response.data.response.filter(property => {
                    return property.property_status !== "Draft" && property.property_status !== "Inactive" && !property.assigned_companies.some(
                        company => company.company_name === companyName
                    );
                });
                setPropertyList(propertiesWithoutAlice?.map((val) => ({ label: val?.property_name, value: val?.uid, photo: val?.cover_photo_url })))
          
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {        
            getPropertiesList()        
    }, []);

    const [properties, setProperties] = useState([
        {
            name: null,
            inactiveFrom: null,
            inactiveTo: null,
            collapsed: false
        }
    ])

    const handleAddProperty = () => {
        setProperties([
            ...properties,
            {
                name: null,
                inactiveFrom: null,
                inactiveTo: null,
                collapsed: false
            }
        ]);
    };

    const handleDeleteProperty = (idx) => {
        setProperties(properties.filter((_, i) => i !== idx));
    };

    const handleCollapseProperty = (idx) => {
        setProperties(properties.map((prop, i) =>
            i === idx ? { ...prop, collapsed: !prop.collapsed } : prop
        ));
    };

    const handleChange = (idx, field, value) => {
        setProperties(properties.map((prop, i) =>
            i === idx ? { ...prop, [field]: value } : prop
        ));
    };

    // const formatDate = (date) => {
    //     if (!date) return null;
    //     return new Date(date).toISOString().split("T")[0]; 
    // };

    const formatDate = (date) => {
        if (!date) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };



    const handleAssignProperty = async () => {
        try {

            const payload = {
                assigned_company: id,
                assignments: properties.map(p => ({
                    assigned_property: p.name,   // company UID
                    date_from: formatDate(p.inactiveFrom),
                    date_to: formatDate(p.inactiveTo)
                }))
            };

            console.log("FINAL PAYLOAD:", payload);

            const response = await MultiplePropertiesAssignToCompany(payload);

            if (response?.data?.success) {
                // alert_success("Property assigned successfully");
                toast.success("Property assigned successfully")
                setTimeout(() => {
                    router.push(`/CompanyDetails?uid=${id}`);
                    // {`/CompanyDetails?uid=${companyDetail?.uid}`}
                }, 1500);

            }
            else {
                const backendMessage =
                    response?.data?.response?.property?.[0] ||
                    "Something went wrong";

                // alert_danger(backendMessage);
                toast.error(backendMessage)
            }

        } catch (error) {
            const backendMessage =
                error?.response?.data?.response?.property?.[0] ||
                error?.response?.data?.message ||
                "Server error";

            // alert_danger(backendMessage);
            toast.error(backendMessage)
            console.log("AssignProperty API Error:", error);
        }
    };
    console.log(properties)
    return (
        <ProtectedRoute>
            {/* <ToastContainer /> */}
            <Toaster position="top-right" />
            <Header />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>

                                <li><Link href='./AllCompany'>Company</Link></li>

                                {/* <li><Link href='./AllCompany'>CasaMelhor</Link></li> */}
                                <li> <Link href={`/CompanyDetails?uid =${id}`}>{companyName}</Link></li>

                                <li>Assign Property
                                    {/* <Image src="./images/icons/bottom-arrow.svg" className='img-fluid ms-2' alt='bot-arrow' width={10} height={10} />  */}
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='page-body  pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12} className='mb-4 mt-4' >
                            <Link href={`/CompanyDetails?uid=${id}`} className='back-page'>
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={6} className=' mb-4' >
                            <div className=' pb-4  '>
                                <h2 className='page-title'>Assign properties to this company</h2>
                            </div>
                            {properties.map((property, idx) => (
                                <div className='assign-property-box mt-5' key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p className='pb-4' style={{ fontSize: '20px', borderBottom: '1px solid #463527', fontWeight: '500', color: '#463527', marginBottom: 0 }} >
                                            {`Property ${idx + 1}`}
                                        </p>
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
                                        )}
                                    </div>
                                    <hr style={{ marginTop: 0 }} />
                                    {!property.collapsed && (
                                        <div className='add-propertu-assign mt-4 p-4' style={{ border: '1px solid #4635271F' }}>
                                            <Row>
                                                <Col md={12}>
                                                    <div className='form-group mb-4'>
                                                        <label>Property name/BR name</label>
                                                        <Select
                                                            className='add-home-field'
                                                            options={propertyList}
                                                            placeholder='Add a Property'
                                                            isSearchable={true}
                                                            value={propertyList.find(cv => cv?.value == properties?.name)}
                                                            onChange={e => handleChange(idx, 'name', e.value)}
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
                                                        <label>Date From</label>
                                                        <DatePicker
                                                            selected={property.inactiveFrom}
                                                            onChange={date => handleChange(idx, 'inactiveFrom', date)}
                                                            placeholderText="Select Dates"
                                                            className="form-control custom-date-picker"
                                                            minDate={new Date()}
                                                            dateFormat="dd/MM/yyyy"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className='form-group'>
                                                        <label>Date To</label>
                                                        <DatePicker
                                                            selected={property.inactiveTo}
                                                            onChange={date => handleChange(idx, 'inactiveTo', date)}
                                                            placeholderText="Select Dates"
                                                            className="form-control custom-date-picker"
                                                            minDate={property.inactiveFrom || new Date()}
                                                            dateFormat="dd/MM/yyyy"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Button variant="" className="btn-company-add mt-5 mb-5" onClick={handleAddProperty}>
                                <span style={{ fontSize: '24px' }}> + </span>     Assign Another Property
                            </Button>

                            <hr />

                            <div className="form-group mt-5 mb-4">
                                <Button variant="" className="btn-success complete-form-btn" style={{ padding: '14px 50px' }} onClick={handleAssignProperty} >Done</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ProtectedRoute>
    )
}