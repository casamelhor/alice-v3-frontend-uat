"use client";
import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Button, Table, Thead, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import { addCompanyValidation } from '@/utils/validation';
import { AddCompanyAPI } from '@/services/provider';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../ProtectedRoute';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { alert_danger, showError } from '@/utils/Alerts/TostifyAlerts';
import toast, { Toaster } from 'react-hot-toast';

const DynamicMap = ({ lat, lng, address }) => {
    const [mapUrl, setMapUrl] = useState('');

    useEffect(() => {
        if (lat && lng) {
            // Dynamic Google Maps URL
            const dynamicUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
            setMapUrl(dynamicUrl);
        }
    }, [lat, lng, address]);

    if (!lat || !lng) {
        return (
            <div style={{
                width: '100%',
                height: '300px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px dashed #ddd'
            }}>
                <div style={{ textAlign: 'center', color: '#666' }}>
                    {/* Map placeholder content */}
                </div>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            {/* Dynamic Map Link */}
            <div style={{ marginBottom: '15px' }}>
                <Link
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#6B4F3F',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    📍 {mapUrl}
                </Link>
            </div>

            {/* Embedded Map */}
            <div style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: '1px solid #ddd', borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location Map"
                />
            </div>
        </div>
    );
};

export default function AddCompany() {
    const [formData, setFormData] = useState({
        companyName: "",
        headOfficeLocation: "",
        street: "",
        flatNo: "",
        city: "",
        state: "",
        pinCode: "",
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        phone: "",
        gst: "",
        lat: null,
        lng: null,
        legalEntity: "",
        currency: "",
    });
    const [errors, setErrors] = useState({});
    const currencyOption = [
        { value: "INR", label: "INR, ₹" },
        { value: "USD", label: "USD, $" },
        { value: "EURO", label: "EURO, € " },
    ];
    const router = useRouter();
    const [errorMessages, setErrorMessages] = useState({});
    const [isGoogleReady, setIsGoogleReady] = useState(false);
    const [addressSearchLoading, setAddressSearchLoading] = useState(false);
    const [googleMapsUrl, setGoogleMapsUrl] = useState('');
    const [showManual, setShowManual] = useState(false);
    const [showPropertyList, setShowPropertyList] = useState(false);

    useEffect(() => {
        const checkGoogleReady = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                setIsGoogleReady(true);
            }
        };

        checkGoogleReady();
        const interval = setInterval(checkGoogleReady, 500);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (formData.lat && formData.lng) {
            const url = `https://www.google.com/maps?q=${formData.lat},${formData.lng}&z=15&output=embed`;
            setGoogleMapsUrl(url);
        }
    }, [formData.lat, formData.lng]);

    // Google Places Autocomplete with debouncing
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
        requestOptions: {
            componentRestrictions: { country: "in" },
        },
        initOnMount: isGoogleReady,
    });

    const handleSelectLocation = async (description) => {
        try {
            setValue(description, false);
            clearSuggestions();
            setShowPropertyList(false);

            // Get geocode results
            const results = await getGeocode({ address: description });

            if (!results || results.length === 0) {
                console.error('No results found for the address');
                setShowManual(true);
                return;
            }

            // Get latitude and longitude
            const { lat, lng } = await getLatLng(results[0]);

            // Parse address components
            const address = parseAddress(results[0]);

            // Generate Google Maps URL
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
            setGoogleMapsUrl(mapsUrl);

            // Update step1Data with all address information
            setFormData(prev => ({
                ...prev,
                propertyAddress: description,
                street: address.street,
                city: address.city,
                state: address.state,
                country: address.country,
                pinCode: address.postalCode,
                lat: lat,
                lng: lng,
                flatNo: address.flatNo || prev.flatNo
            }));

            setShowManual(true);

        } catch (error) {
            console.error('Error in handleSelectLocation:', error);
            setShowManual(true);
        }
    };

    // Enhanced address parser for Indian addresses
    const parseAddress = (result) => {
        const components = result.address_components;

        const getComponent = (types) => {
            const component = components.find(comp =>
                types.some(type => comp.types.includes(type))
            );
            return component ? component.long_name : '';
        };

        // Build street address from multiple possible components
        const streetComponents = [
            getComponent(['street_number']),
            getComponent(['route']),
            getComponent(['premise']),
            getComponent(['sublocality_level_1']),
            getComponent(['sublocality'])
        ].filter(Boolean);

        const street = streetComponents.length > 0
            ? streetComponents.join(', ')
            : result.formatted_address?.split(',')[0] || '';

        return {
            street: street,
            city: getComponent(['locality']) ||
                getComponent(['administrative_area_level_2']) ||
                getComponent(['postal_town']),
            state: getComponent(['administrative_area_level_1']),
            country: getComponent(['country']),
            postalCode: getComponent(['postal_code']),
            flatNo: getComponent(['premise', 'subpremise'])
        };
    };

    const handleManualEntry = () => {
        setShowManual(true);
        setShowPropertyList(false);
    };

    const handleAddressInputChange = (e) => {
        // const value = e.target.value;
        // debouncedAddressChange(value);
        const value = e.target.value;
        setValue(value);
        setFormData(prev => ({
            ...prev,
            headOfficeLocation: value
        }));
        setShowPropertyList(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newData = { [name]: value }
        setFormData({
            ...formData,
            [name]: value
        })
        const { errors } = addCompanyValidation(newData)
        setErrorMessages({
            ...errorMessages,
            ...errors
        })
    }
    const handleCurrency = (e) => {
        if (!e) return; // guard against clear
        const { value } = e;
        let newVal = { ["currency"]: value }
        setFormData({
            ...formData,
            ["currency"]: value
        })
        const { errors } = addCompanyValidation(newVal)
        setErrorMessages({
            ...errorMessages,
            ...errors
        })
    }

    // const handleSubmitForm = async () => {
    //     try {
    //         const { errors, isValid } = addCompanyValidation(formData);
    //         setErrorMessages(errors);
    //         if (isValid) {
    //             const fieldData = new FormData();
    //             fieldData.append("company_name", formData.companyName);
    //             fieldData.append("head_office_location", formData.headOfficeLocation);
    //             fieldData.append("street_and_number", formData.street);
    //             fieldData.append("house_no", formData.flatNo);
    //             fieldData.append("head_office_city", formData.city);
    //             fieldData.append("head_office_state", formData.state);
    //             fieldData.append("head_office_pin_code", formData.pinCode);
    //             fieldData.append("c_first_name", formData.firstName);
    //             fieldData.append("c_last_name", formData.lastName);
    //             fieldData.append("position", formData.position);
    //             fieldData.append("company_email", formData.email);
    //             fieldData.append("phone_number", formData.phone);
    //             fieldData.append("gst_number", formData.gst);
    //             fieldData.append("legal_entity_name", formData.legalEntity);
    //             fieldData.append("contract_currency", formData.currency);
    //             fieldData.append("latitude", formData.lat);
    //             fieldData.append("longitude", formData.lng);
    //             const response = await AddCompanyAPI(fieldData);
    //             if (response?.data?.success) {
    //                 router.push("/AllCompany");
    //             } else {                    
    //                 showError(response.data.response)
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const handleSubmitForm = async () => {
        try {

            const { errors, isValid } = addCompanyValidation(formData);
            setErrorMessages(errors);

            if (!isValid) {
                const firstErrorKey = Object.keys(errors)[0];
                const fieldNameMap = {
                    companyName: "companyName",
                    headOfficeLocation: "propertyAddress", // input uses name="propertyAddress"
                    street: "street",
                    city: "city",
                    state: "state",
                    country: "country",
                    pinCode: "pinCode",
                    firstName: "firstName",
                    lastName: "lastName",
                    position: "position",
                    email: "email",
                    phone: "phone",
                    gst: "gst",
                    legalEntity: "legalEntity",
                    currency: "currency",
                };

                const inputName = fieldNameMap[firstErrorKey] || firstErrorKey;
                const el =
                    document.querySelector(`[name="${inputName}"]`) ||
                    document.querySelector(`[data-error="${firstErrorKey}"]`);

                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    el.focus({ preventScroll: true });
                }
                return; // ✅ Prevent falling through to the API call
            } else {
                const fieldData = new FormData();
                fieldData.append("company_name", formData.companyName);
                fieldData.append("head_office_location", formData.headOfficeLocation);
                fieldData.append("street_and_number", formData.street);
                fieldData.append("house_no", formData.flatNo);
                fieldData.append("head_office_city", formData.city);
                fieldData.append("head_office_state", formData.state);
                fieldData.append("head_office_pin_code", formData.pinCode);
                fieldData.append("c_first_name", formData.firstName);
                fieldData.append("c_last_name", formData.lastName);
                fieldData.append("position", formData.position);
                fieldData.append("company_email", formData.email);
                fieldData.append("phone_number", formData.phone);
                fieldData.append("gst_number", formData.gst);
                fieldData.append("legal_entity_name", formData.legalEntity);
                fieldData.append("contract_currency", formData.currency);
                fieldData.append("latitude", formData.lat);
                fieldData.append("longitude", formData.lng);

                const response = await AddCompanyAPI(fieldData);

                if (response?.data?.success) {
                    toast.success("Company created successfully!");
                    // router.push("/AllCompany");
                    setTimeout(() => router.push("/AllCompany"), 1500);
                } else {
                    showError(response?.data?.response || "Something went wrong. Please try again.");
                }
            }
        } catch (error) {
            const serverMessage =
                error?.response?.data?.response ||
                error?.response?.data?.message ||
                error?.message ||
                "An unexpected error occurred. Please try again.";
            // showError(serverMessage);
            toast.error(serverMessage)
            console.error("AddCompany error:", error);
        }
    };


    return (
        <ProtectedRoute>
            <Header />
            <Toaster position="top-right" />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>
                                {/* <li><a href=''>Home</a></li> */}
                                <li><Link href='./AllCompany'>Company</Link></li>
                                <li>Add New Company</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='page-body  pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <Link href="./AllCompany" className='back-page'>
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={12} >
                            <h2 className='page-title mb-4 border-bottom-custom pb-4'>New company setup</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={7}>
                            <p className='subheadline-2'>Company</p>
                            <div className='form-group mb-4' data-error="companyName">
                                <label>Company Name</label>
                                <input type='text' name="companyName" className='form-control' onChange={handleInputChange} placeholder='e.g. Casa Melhor' />
                                <span className='text-danger'>{errorMessages.companyName}</span>
                            </div>                            
                            <hr style={{ marginBottom: '2rem' }}></hr>
                            <p className='subheadline-2'>Headoffice address</p>
                            {/* <div className='form-group mb-4'>
                                <label>Where’s your headoffice located?</label>
                                <input type='text' name='headOfficeLocation' className='form-control' onChange={handleInputChange} placeholder='e.x. GQJ8+V2H Calangute, Goa' />
                                <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                            </div>
                            <Row>
                                <Col md={9}>
                                    <div className='form-group mb-4'>
                                        <label>Street and number</label>
                                        <input type='text' name='street' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.street}</span>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className='form-group mb-4'>
                                        <label>Flat/House No.</label>
                                        <input type='text' name='flatNo' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.flatNo}</span>
                                    </div>
                                </Col>
                            </Row>
                            <div className='form-group mb-4'>
                                <label>Headoffice city</label>
                                <input type='text' name='city' className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.city}</span>
                            </div> */}
                            <div className="form-group mb-4" style={{ position: "relative" }} data-error="propertyAddress">
                                <label>Where’s your headoffice located?</label>
                                <input
                                    type="text"
                                    name="propertyAddress"
                                    className={`form-control ${errorMessages.propertyAddress ? 'is-invalid' : ''}`}
                                    placeholder="Search Property Address"
                                    value={formData?.headOfficeLocation || value}
                                    onChange={handleAddressInputChange}
                                    disabled={!ready}
                                    onFocus={() => setShowPropertyList(true)}
                                    style={{
                                        fontSize: "14px",
                                        padding: "12px 16px",
                                        border: errorMessages.propertyAddress ? "1px solid #f00" : "1px solid #4635273d",
                                        borderRadius: "0",
                                    }}
                                    onBlur={() => setTimeout(() => { setShowPropertyList(false) }, 200)}
                                />

                                {addressSearchLoading && (
                                    <div style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)"
                                    }}>
                                        <Spinner animation="border" size="sm" />
                                    </div>
                                )}

                                {errorMessages.propertyAddress && (
                                    <div className="invalid-feedback d-block">
                                        {errorMessages.propertyAddress}
                                    </div>
                                )}

                                {showPropertyList && status === "OK" && data.length > 0 && (
                                    <div
                                        style={{
                                            border: "1px solid #6B4F3F",
                                            background: "#fff",
                                            fontSize: "14px",
                                            color: "#463527",
                                            marginTop: "4px",
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            zIndex: 10,
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {data.map(({ place_id, description }) => (
                                            <div
                                                key={place_id}
                                                style={{
                                                    padding: "10px 16px",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid #eee",
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onClick={() => handleSelectLocation(description)}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                {description}
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            style={{
                                                color: "#6B4F3F",
                                                textDecoration: "none",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                padding: "10px 16px",
                                                width: "100%",
                                                textAlign: "left",
                                                background: "none",
                                                border: "none",
                                                borderTop: "1px solid #eee",
                                                cursor: "pointer"
                                            }}
                                            onClick={handleManualEntry}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            Not found? Enter address manually
                                        </button>
                                    </div>
                                )}

                                {/* Show loading or no results states */}
                                {!isGoogleReady && (
                                    <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
                                        Loading Google Maps...
                                    </div>
                                )}
                                {showPropertyList && status === "ZERO_RESULTS" && (
                                    <div className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
                                        No results found. Try a different search or enter manually.
                                    </div>
                                )}
                            </div>

                            {/* Manual Address Form with Dynamic Map */}

                            <div className='mb-3'>
                                <p style={{ fontWeight: "500", marginBottom: "12px" }}>Please fill in the missing details</p>

                                {formData.lat && formData.lng && (
                                    <DynamicMap
                                        lat={formData?.lat}
                                        lng={formData?.lng}
                                        address={formData?.propertyAddress}
                                        isLoading={addressSearchLoading}
                                    />
                                )}

                                <div className="row">
                                    <div className="col-md-8">
                                        <div className='form-group mb-4' data-error="street">
                                            <label>Street and number <span style={{ color: '#f00' }}>*</span></label>
                                            <input
                                                type="text"
                                                name="street"
                                                className={`form-control ${errorMessages.street ? 'is-invalid' : ''}`}
                                                value={formData?.street || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter street address"
                                            />
                                            {errorMessages.street && (
                                                <div className="invalid-feedback d-block">
                                                    {errorMessages.street}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className='form-group mb-4'>
                                            <label>Flat/House No.</label>
                                            <input
                                                type="text"
                                                name="flatNo"
                                                className="form-control"
                                                value={formData?.flatNo || ''}
                                                onChange={handleInputChange}
                                                placeholder="Flat/House number"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='form-group mb-4' data-error="city">
                                            <label>Headoffice city <span style={{ color: '#f00' }}>*</span></label>
                                            <input
                                                type="text"
                                                name="city"
                                                className={`form-control ${errorMessages.city ? 'is-invalid' : ''}`}
                                                value={formData?.city || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter city"
                                            />
                                            {errorMessages.city && (
                                                <div className="invalid-feedback d-block">
                                                    {errorMessages.city}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='form-group mb-4' data-error="state">
                                            <label>Headoffice state <span style={{ color: '#f00' }}>*</span></label>
                                            <input
                                                type="text"
                                                name="state"
                                                className={`form-control ${errorMessages.state ? 'is-invalid' : ''}`}
                                                value={formData?.state || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter state"
                                            />
                                            {errorMessages.state && (
                                                <div className="invalid-feedback d-block">
                                                    {errorMessages.state}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className='form-group mb-4' data-error="country">
                                            <label>Headoffice Country <span style={{ color: '#f00' }}>*</span></label>
                                            <input
                                                type="text"
                                                name="country"
                                                className={`form-control ${errorMessages.country ? 'is-invalid' : ''}`}
                                                value={formData?.country || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter country"
                                            />
                                            {errorMessages.country && (
                                                <div className="invalid-feedback d-block">
                                                    {errorMessages.country}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className='form-group mb-4' data-error="pinCode">
                                            <label>Headoffice PIN Code <span style={{ color: '#f00' }}>*</span></label>
                                            <input
                                                type="text"
                                                name="pinCode"
                                                className={`form-control pincode-flag ${errorMessages.pinCode ? 'is-invalid' : ''}`}
                                                value={formData?.pinCode || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter PIN code"
                                            />
                                            {errorMessages.pinCode && (
                                                <div className="invalid-feedback d-block">
                                                    {errorMessages.pinCode}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                                <hr style={{ margin: "50px 0" }} />

                            </div>
                            {/* <Row>
                                <Col md={4}>
                                    <div className='form-group mb-4'>
                                        <label>Headoffice state</label>
                                        <input type='text' name='state' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.state}</span>
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className='form-group mb-4'>
                                        <label>Headoffice PIN code</label>
                                        <input type='number' name='pinCode' className='form-control' onChange={handleInputChange} placeholder='--' />
                                        <span className='text-danger'>{errorMessages.pinCode}</span>
                                    </div>
                                </Col>
                            </Row>
                            <hr style={{ marginBottom: '2rem' }}></hr> */}


                            <p className='subheadline-2'>Contacts</p>

                            <div className='form-group mb-4' data-error="firstName">
                                <label>First name</label>
                                <input type='text' name='firstName' className='form-control' onChange={handleInputChange} placeholder='Enter First name' />
                                <span className='text-danger'>{errorMessages.firstName}</span>
                            </div>
                            <div className='form-group mb-4' data-error="lastName">
                                <label>Last name</label>
                                <input type='text' name='lastName' className='form-control' onChange={handleInputChange} placeholder='Enter last name' />
                                <span className='text-danger'>{errorMessages.lastName}</span>
                            </div>
                            <div className='form-group mb-4' data-error="position">
                                <label>Position</label>
                                <input type='text' name='position' className='form-control' onChange={handleInputChange} placeholder='e.x. Company Administrator' />
                                <span className='text-danger'>{errorMessages.position}</span>
                            </div>
                            <div className='form-group mb-4' data-error="email">
                                <label>E-mail address</label>
                                <input type='email' name='email' className='form-control' onChange={handleInputChange} placeholder='Enter contact email' />
                                <span className='text-danger'>{errorMessages.email}</span>
                            </div>
                            <div className='form-group mb-4' data-error="phone">
                                <label>Phone number</label>
                                <input type='text' name='phone' maxLength={15} className='form-control' onChange={handleInputChange} placeholder='e.g. +91 4323545464' />
                                <span className='text-danger'>{errorMessages.phone}</span>
                            </div>
                            <hr style={{ marginBottom: '2rem' }}></hr>
                            {/*  */}
                            <p className='subheadline-2'>Legal entity details</p>

                            <div className='form-group mb-4' data-error="gst">
                                <label>GST Number</label>
                                <input type='text' name='gst' className='form-control' onChange={handleInputChange} placeholder='e.g. 24AAACC1206D1ZM' />
                                <span className='text-danger'>{errorMessages.gst}</span>
                            </div>
                            <div className='form-group mb-4' data-error="legalEntity">
                                <label>Legal entity name</label>
                                <input type='text' name='legalEntity' className='form-control' onChange={handleInputChange} placeholder='Enter legal entity name' />
                                <span className='text-danger'>{errorMessages.legalEntity}</span>
                            </div>
                            <div className='form-group mb-4' data-error="currency">
                                <label>Contract currency</label>
                                {/* <Select
                                    name="currency"
                                    options={currencyOption}
                                    placeholder="Choose Currency"
                                    className='react_selectbox'
                                    isSearchable={false}
                                    onChange={handleCurrency}
                                /> */}                                
                                <Select
                                    name="currency"
                                    options={currencyOption}
                                    placeholder="Choose Currency"
                                    className='react_selectbox'
                                    isSearchable={false}
                                    onChange={handleCurrency}
                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                    menuPosition="fixed"
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                />
                                <span className='text-danger'>{errorMessages.currency}</span>
                            </div>
                            <div className='form-group mt-5 mb-4'>
                                <Button variant="" className='btn-success complete-form-btn' onClick={handleSubmitForm} >Complete Registration</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ProtectedRoute>
    )
}
