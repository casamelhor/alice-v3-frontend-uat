// "use client"
// import { useEffect, useState } from "react";
// import { Row, Col, Container, Button, Table, Thead } from 'react-bootstrap';
// import Image from 'next/image';
// import Header from '../Header/Header'
// import Link from 'next/link';
// import Select, { AriaOnFocus } from 'react-select';
// import DatePicker from "react-datepicker";
// import { companyListAPI, AssignProperty } from '@/services/provider';
// import { useRouter, useSearchParams } from "next/navigation";
// import { alert_danger, alert_info, alert_success } from '@/utils/Alerts/TostifyAlerts';
// import { ToastContainer } from 'react-toastify';

// export default function Assignmentedit() {

//     const router = useRouter();
//     const [properties, setProperties] = useState([
//         {
//             name: null,
//             inactiveFrom: null,
//             inactiveTo: null,
//             collapsed: false
//         }
//     ]);

//     const handleAddProperty = () => {
//         setProperties([
//             ...properties,
//             {
//                 name: null,
//                 inactiveFrom: null,
//                 inactiveTo: null,
//                 collapsed: false
//             }
//         ]);
//     };

//     const [errors, setErrors] = useState({});
//     const [selectedPropertyId, setSelectedPropertyId] = useState(null);


//     const searchParams = useSearchParams();
//     const uid = searchParams.get("uid");

//     useEffect(() => {
//         if (uid) {
//             setSelectedPropertyId(uid);
//         }
//     }, [uid]);



//     const handleDeleteProperty = (idx) => {
//         setProperties(properties.filter((_, i) => i !== idx));
//     };

//     const handleCollapseProperty = (idx) => {
//         setProperties(properties.map((prop, i) =>
//             i === idx ? { ...prop, collapsed: !prop.collapsed } : prop
//         ));
//     };

//     const handleChange = (idx, field, value) => {
//         setProperties(properties.map((prop, i) =>
//             i === idx ? { ...prop, [field]: value } : prop
//         ));
//     };

//     // comapny list api 
//     const [companyList, setCompanyList] = useState([]);
//     const [searchKey, setSearchKey] = useState("");
//     const [page, setPage] = useState(1);

//     const getCompanyList = async () => {
//         try {
//             const response = await companyListAPI(searchKey, page);

//             if (response?.data?.success) {
//                 setCompanyList(response.data.response);
//             }
//         } catch (error) {
//             console.log("API Error:", error);
//         }
//     };

//     useEffect(() => {
//         getCompanyList();
//     }, [searchKey, page]);



//     const validate = () => {
//         let valid = true;
//         let newErrors = {};

//         properties.forEach((prop, index) => {
//             let propErrors = {};

//             // Company name required
//             if (!prop.name) {
//                 propErrors.name = "Please select a company";
//                 valid = false;
//             }

//             // Dates required
//             if (!prop.inactiveFrom) {
//                 propErrors.inactiveFrom = "Please select start date";
//                 valid = false;
//             }

//             if (!prop.inactiveTo) {
//                 propErrors.inactiveTo = "Please select end date";
//                 valid = false;
//             }

//             // invalid date range
//             if (prop.inactiveFrom && prop.inactiveTo) {
//                 if (new Date(prop.inactiveFrom) > new Date(prop.inactiveTo)) {
//                     propErrors.inactiveTo = "End date must be after start date";
//                     valid = false;
//                 }
//             }

//             // Only set errors for this index if any error exists
//             if (Object.keys(propErrors).length > 0) {
//                 newErrors[index] = propErrors;
//             }
//         });

//         setErrors(newErrors);
//         return valid;
//     };



//     // Map API data for React-Select
//     const formattedCompanyOptions = companyList?.map(item => ({
//         value: item.uid,
//         label: item.company_name
//     }));



//     const handleAssignProperty = async () => {
//         const isValid = validate();
//         if (!isValid) return;

//         try {

//             const payload = {
//                 assigned_property: selectedPropertyId,   

//                 assignments: properties.map(p => ({
//                     assigned_company: p.name,             // company UID
//                     date_from: formatDate(p.inactiveFrom),
//                     date_to: formatDate(p.inactiveTo)
//                 }))
//             };

//             console.log("FINAL PAYLOAD:", payload);

//             const response = await AssignProperty(payload);

//             if (response?.data?.success) {
//                 alert_success("Property assigned successfully");

//                 setTimeout(() => {
//                     router.push(`/PropertyListing?tab=${currentTab}`);
//                 }, 1500);
//             } else {
//                 alert_info("Property assignment response received, but not successful");
//             }

//         } catch (error) {
//             console.log("AssignProperty API Error:", error);
//             alert_danger("Failed to assign property. Please try again");
//         }
//     };



//     // const formatDate = (date) => {
//     //     if (!date) return null;
//     //     return new Date(date).toISOString().split("T")[0]; 
//     // };


//     const formatDate = (date) => {
//         if (!date) return null;

//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const day = String(date.getDate()).padStart(2, "0");

//         return `${year}-${month}-${day}`;
//     };



//     const currentTab = searchParams.get("tab") || "active";


//     return (
//         <>
//             <Header />
//             <div className='Breadcrumb'>
//                 <Container>
//                     <ToastContainer />
//                     <Row>
//                         <Col md={12} >
//                             <ul className='d-flex align-items-center breadcrumb-list'>

//                                 <li><Link href='./PropertyListing'>Properties</Link></li>

//                                 <li><Link href='./PropertyDetails'>Astha Homes, Mumbai Listing Editor</Link></li>

//                                 <li>Assign Property
//                                     {/* <Image src="./images/icons/bottom-arrow.svg" className='img-fluid ms-2' alt='bot-arrow' width={10} height={10} />  */}
//                                 </li>
//                             </ul>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>



//             <div className='page-body '>
//                 <Container>
//                     <Row>
//                         <Col md={12} className='mb-4 mt-4' >
//                             <Link href={`/PropertyListing?tab=${currentTab}`} className='back-page'>
//                                 <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
//                                 Back</Link>
//                         </Col>
//                         <Col md={6} className=' mb-4' >
//                             <div className=' pb-4  '>
//                                 <h2 className='page-title'>Assign Property</h2>
//                             </div>



//                             {properties.map((property, idx) => (
//                                 <div className='assign-property-box ' key={idx}>
//                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

//                                         {idx !== 0 && (
//                                             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

//                                                 <span className="d-flex align-items-center" style={{ cursor: 'pointer', color: '#463527', fontWeight: 500 }} onClick={() => handleCollapseProperty(idx)}>
//                                                     {property.collapsed ? 'Expand' : 'Collapse'}
//                                                     <Image
//                                                         src={property.collapsed ? '/images/icons/top-arrow.svg' : '/images/icons/top-arrow.svg'}
//                                                         width={18}
//                                                         height={18}
//                                                         alt={property.collapsed ? 'Expand' : 'Collapse'}
//                                                         style={{ transform: property.collapsed ? 'rotate(180deg)' : 'none', marginLeft: '6px' }}
//                                                     />
//                                                 </span>
//                                                 <Button variant="outline" style={{ border: '1px solid #463527', background: 'none', padding: '8px', borderRadius: '0' }} onClick={() => handleDeleteProperty(idx)}>
//                                                     <Image src='/images/icons/delete_b.svg' width={20} height={20} alt='Delete' />
//                                                 </Button>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <hr style={{ marginTop: 0 }} />
//                                     {!property.collapsed && (
//                                         <div className='add-propertu-assign mt-4 ' >
//                                             <Row>
//                                                 <Col md={12}>
//                                                     <div className='form-group mb-4'>
//                                                         <label className="font-18" >Company name</label>
//                                                         <Select
//                                                             className=' buisness-select'
//                                                             options={formattedCompanyOptions}
//                                                             placeholder='Add a Company'
//                                                             isSearchable={false}
//                                                             value={formattedCompanyOptions.find(opt => opt.value === property.name)}
//                                                             onChange={option => handleChange(idx, 'name', option.value)}

//                                                             components={{
//                                                                 MenuList: (props) => (
//                                                                     <>
//                                                                         {props.children}
//                                                                         <div style={{ padding: '12px', borderTop: '1px solid #eee', textAlign: 'left' }}>
//                                                                             <span style={{ color: '#463527' }}>Can’t find the company?</span><br />
//                                                                             <Link href='#' style={{ color: '#463527', textDecoration: 'underline', fontWeight: 500 }}>Create a new listing</Link>
//                                                                         </div>
//                                                                     </>
//                                                                 )
//                                                             }}
//                                                         />
//                                                         {errors[idx]?.name && (
//                                                             <small style={{ color: "red" }}>{errors[idx].name}</small>
//                                                         )}
//                                                     </div>
//                                                     <hr />
//                                                 </Col>
//                                                 <Col md={6}>
//                                                     <div className='form-group'>
//                                                         <label className="font-18" >Date From</label>
//                                                         <DatePicker
//                                                             selected={property.inactiveFrom}
//                                                             onChange={date => handleChange(idx, 'inactiveFrom', date)}
//                                                             placeholderText="Select Dates"
//                                                             className="form-control custom-date-picker"
//                                                             dateFormat="dd/MM/yyyy"
//                                                              minDate={new Date()}

//                                                         />
//                                                         {errors[idx]?.inactiveFrom && (
//                                                             <small style={{ color: "red" }}>{errors[idx].inactiveFrom}</small>
//                                                         )}
//                                                     </div>
//                                                 </Col>
//                                                 <Col md={6}>
//                                                     <div className='form-group'>
//                                                         <label className="font-18" >Date To</label>
//                                                         <DatePicker
//                                                             selected={property.inactiveTo}
//                                                             onChange={date => handleChange(idx, 'inactiveTo', date)}
//                                                             placeholderText="Select Dates"
//                                                             className="form-control custom-date-picker"
//                                                             dateFormat="dd/MM/yyyy"
//                                                             minDate={property.inactiveFrom || new Date()}

//                                                         />
//                                                         {errors[idx]?.inactiveTo && (
//                                                             <small style={{ color: "red" }}>{errors[idx].inactiveTo}</small>
//                                                         )}
//                                                     </div>
//                                                 </Col>
//                                             </Row>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                             <div className="form-group mt-5 mb-4">
//                                 <Button variant="" className="btn-success  complete-form-btn" onClick={handleAssignProperty} style={{ padding: '14px 50px' }} >Done</Button>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>

//             </div>
//         </>
//     )
// }





"use client"
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Table, Thead } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from "react-datepicker";
import { companyListAPI, AssignProperty } from '@/services/provider';
import { useRouter, useSearchParams } from "next/navigation";
import { alert_danger, alert_info, alert_success } from '@/utils/Alerts/TostifyAlerts';
import { ToastContainer } from 'react-toastify';

export default function Assignmentedit() {

    const router = useRouter();
    const [properties, setProperties] = useState([
        {
            name: null,
            inactiveFrom: null,
            inactiveTo: null,
            collapsed: false
        }
    ]);

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

    const [errors, setErrors] = useState({});
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);


    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");

    useEffect(() => {
        if (uid) {
            setSelectedPropertyId(uid);
        }
    }, [uid]);



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

    // comapny list api 
    const [companyList, setCompanyList] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // const getCompanyList = async () => {
    //     try {
    //         const response = await companyListAPI(searchKey, page);

    //         if (response?.data?.success) {
    //             setCompanyList(response.data.response);
    //         }
    //     } catch (error) {
    //         console.log("API Error:", error);
    //     }
    // };

    const getCompanyList = async (pageNumber = 1, search = "") => {

        if (loading) return;

        try {

            setLoading(true);

            const response =
                await companyListAPI(search, pageNumber);

            if (response?.data?.success) {

                const newData =
                    response.data.response?.filter(item => !item?.is_company_inactive) || [];

                setCompanyList(prev =>
                    pageNumber === 1
                        ? newData
                        : [...prev, ...newData]
                );

                // setHasMore(newData.length === 10);
                setHasMore(response.data.next_page)

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    // useEffect(() => {
    //     getCompanyList();
    // }, [searchKey, page]);
    useEffect(() => {
        setPage(1);
        setCompanyList([]);
        setHasMore(true);

        getCompanyList(1, searchKey);

    }, [searchKey]);

    const handleMenuScrollToBottom = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);

            getCompanyList(nextPage, searchKey);
        }
    };



    const validate = () => {
        let valid = true;
        let newErrors = {};

        properties.forEach((prop, index) => {
            let propErrors = {};

            // Company name required
            if (!prop.name) {
                propErrors.name = "Please select a company";
                valid = false;
            }

            // Dates required
            if (!prop.inactiveFrom) {
                propErrors.inactiveFrom = "Please select start date";
                valid = false;
            }

            if (!prop.inactiveTo) {
                propErrors.inactiveTo = "Please select end date";
                valid = false;
            }

            // invalid date range
            if (prop.inactiveFrom && prop.inactiveTo) {
                if (new Date(prop.inactiveFrom) > new Date(prop.inactiveTo)) {
                    propErrors.inactiveTo = "End date must be after start date";
                    valid = false;
                }
            }

            // Only set errors for this index if any error exists
            if (Object.keys(propErrors).length > 0) {
                newErrors[index] = propErrors;
            }
        });

        setErrors(newErrors);
        return valid;
    };



    // Map API data for React-Select
    const formattedCompanyOptions = companyList?.map(item => ({
        value: item.uid,
        label: item.company_name
    }));



    const handleAssignProperty = async () => {
        const isValid = validate();
        if (!isValid) return;

        try {

            const payload = {
                assigned_property: selectedPropertyId,

                assignments: properties.map(p => ({
                    assigned_company: p.name,             // company UID
                    date_from: formatDate(p.inactiveFrom),
                    date_to: formatDate(p.inactiveTo)
                }))
            };

            console.log("FINAL PAYLOAD:", payload);

            const response = await AssignProperty(payload);

            if (response?.data?.success) {
                alert_success("Property assigned successfully");

                setTimeout(() => {
                    router.push(`/PropertyListing?tab=${currentTab}`);
                }, 1500);
            } else {
                alert_info("Property assignment response received, but not successful");
            }

        } catch (error) {
            console.log("AssignProperty API Error:", error);
            alert_danger("Failed to assign property. Please try again");
        }
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



    const currentTab = searchParams.get("tab") || "active";



    const CustomMenuList = (props) => {
        const {
            children,
            innerRef,
            innerProps
        } = props;

        return (
            <div
                ref={innerRef}
                {...innerProps}
                style={{
                    maxHeight: 200,
                    overflowY: "auto"
                }}
            >
                {children}

                {loading && (
                    <div style={{ padding: 10 }}>
                        Loading...
                    </div>
                )}

                {!hasMore && (
                    <div style={{ padding: 10 }}>
                        No more companies
                    </div>
                )}

                <div
                    style={{
                        padding: '12px',
                        borderTop: '1px solid #eee'
                    }}
                >
                    <span>Can’t find the company?</span>
                    <br />

                    <Link
                        href='#'
                        style={{
                            textDecoration: 'underline',
                            fontWeight: 500
                        }}
                    >
                        Create a new listing
                    </Link>
                </div>
            </div>
        );
    };


    return (
        <>
            <Header />
            <div className='Breadcrumb'>
                <Container>
                    <ToastContainer />
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>

                                <li><Link href='./PropertyListing'>Properties</Link></li>

                                <li><Link href='./PropertyDetails'>Astha Homes, Mumbai Listing Editor</Link></li>

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
                            <Link href={`/PropertyListing?tab=${currentTab}`} className='back-page'>
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={6} className=' mb-4' >
                            <div className=' pb-4  '>
                                <h2 className='page-title'>Assign Property</h2>
                            </div>



                            {properties.map((property, idx) => (
                                <div className='assign-property-box ' key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

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
                                        <div className='add-propertu-assign mt-4 ' >
                                            <Row>
                                                <Col md={12}>
                                                    <div className='form-group mb-4'>
                                                        <label className="font-18" >Company name</label>
                                                        {/* <Select
                                                            className=' buisness-select'
                                                            options={formattedCompanyOptions}
                                                            placeholder='Add a Company'
                                                            isSearchable={false}
                                                            value={formattedCompanyOptions.find(opt => opt.value === property.name)}
                                                            onChange={option => handleChange(idx, 'name', option.value)}

                                                            components={{
                                                                MenuList: (props) => (
                                                                    <>
                                                                        {props.children}
                                                                        <div style={{ padding: '12px', borderTop: '1px solid #eee', textAlign: 'left' }}>
                                                                            <span style={{ color: '#463527' }}>Can’t find the company?</span><br />
                                                                            <Link href='#' style={{ color: '#463527', textDecoration: 'underline', fontWeight: 500 }}>Create a new listing</Link>
                                                                        </div>
                                                                    </>
                                                                )
                                                            }}
                                                        /> */}
                                                        <Select
                                                            options={formattedCompanyOptions}
                                                            isSearchable
                                                            onMenuScrollToBottom={() => {
                                                                console.log("SCROLLED");
                                                                if (hasMore && !loading) {
                                                                    const nextPage = page + 1;
                                                                    setPage(nextPage);
                                                                    getCompanyList(nextPage, searchKey);
                                                                }
                                                            }}
                                                            components={{
                                                                MenuList: CustomMenuList
                                                            }}
                                                            isLoading={loading}
                                                            onChange={option => handleChange(idx, 'name', option.value)}
                                                        />
                                                        {errors[idx]?.name && (
                                                            <small style={{ color: "red" }}>{errors[idx].name}</small>
                                                        )}
                                                    </div>
                                                    <hr />
                                                </Col>
                                                <Col md={6}>
                                                    <div className='form-group'>
                                                        <label className="font-18" >Date From</label>
                                                        <DatePicker
                                                            selected={property.inactiveFrom}
                                                            onChange={date => handleChange(idx, 'inactiveFrom', date)}
                                                            placeholderText="Select Dates"
                                                            className="form-control custom-date-picker"
                                                            dateFormat="dd/MM/yyyy"
                                                            minDate={new Date()}

                                                        />
                                                        {errors[idx]?.inactiveFrom && (
                                                            <small style={{ color: "red" }}>{errors[idx].inactiveFrom}</small>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className='form-group'>
                                                        <label className="font-18" >Date To</label>
                                                        <DatePicker
                                                            selected={property.inactiveTo}
                                                            onChange={date => handleChange(idx, 'inactiveTo', date)}
                                                            placeholderText="Select Dates"
                                                            className="form-control custom-date-picker"
                                                            dateFormat="dd/MM/yyyy"
                                                            minDate={property.inactiveFrom || new Date()}

                                                        />
                                                        {errors[idx]?.inactiveTo && (
                                                            <small style={{ color: "red" }}>{errors[idx].inactiveTo}</small>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="form-group mt-5 mb-4">
                                <Button variant="" className="btn-success  complete-form-btn" onClick={handleAssignProperty} style={{ padding: '14px 50px' }} >Done</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>

            </div>
        </>
    )
}

