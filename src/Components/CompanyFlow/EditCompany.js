"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Button, Spinner } from 'react-bootstrap';
import Header from '../Header/Header';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, Tab } from 'react-bootstrap';
import Select, { AriaOnFocus } from 'react-select';
import ProtectedRoute from '../ProtectedRoute';
import { useRouter } from 'next/navigation';
import { addCompanyValidation } from '@/utils/validation';
import { UpdateCompanyDetailAPI } from '@/services/provider';
import { alert_danger, alert_success, showError, showErrorMsg } from '@/utils/Alerts/TostifyAlerts';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import toast from 'react-hot-toast';

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

export default function EditCompany({ editData, setIsEditManage, getcompanyDetail }) {
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
    const [isLoading, setIsLoading] = useState(false);
    const currencyOption = [
        { value: "INR", label: "INR, ₹" },
        { value: "USD", label: "USD, $" },
        { value: "EURO", label: "EURO, € " },
    ];
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
    // useEffect(() => {
    //     setFormData({
    //         companyName: editData?.company_name,
    //         headOfficeLocation: editData?.head_office_location,
    //         street: editData?.street_and_number,
    //         flatNo: editData?.house_no,
    //         city: editData?.head_office_city,
    //         state: editData?.head_office_state,
    //         pinCode: editData?.head_office_pin_code,
    //         firstName: editData?.c_first_name,
    //         lastName: editData?.c_last_name,
    //         position: editData?.position,
    //         email: editData?.company_email,
    //         phone: editData?.phone_number,
    //         gst: editData?.gst_number,
    //         legalEntity: editData?.legal_entity_name,
    //         currency: editData?.contract_currency,
    //         lat: editData?.latitude,
    //         lng: editData?.longitude
    //     })
    // }, [])
    useEffect(() => {
        setFormData({
            companyName: editData?.company_name,
            headOfficeLocation: editData?.head_office_location,
            street: editData?.street_and_number,
            flatNo: editData?.house_no,
            city: editData?.head_office_city,
            state: editData?.head_office_state,
            pinCode: editData?.head_office_pin_code,
            firstName: editData?.c_first_name,
            lastName: editData?.c_last_name,
            position: editData?.position,
            email: editData?.company_email,
            phone: editData?.phone_number,
            gst: editData?.gst_number,
            legalEntity: editData?.legal_entity_name,
            currency: editData?.contract_currency,
            // lat: editData?.latitude,
            // lng: editData?.longitude,
            lat: editData?.latitude ?? null,
            lng: editData?.longitude ?? null,
            country: editData?.head_office_country,
        })
    }, [])
    const router = useRouter();
    const [errorMessages, setErrorMessages] = useState({});
    const [errors, setErrors] = useState({});
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
            console.log('Selecting location:', description);
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

            console.log("Google Maps Result:", { address, lat, lng });

            // Generate Google Maps URL
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
            setGoogleMapsUrl(mapsUrl);

            // Update step1Data with all address information
            setFormData(prev => ({
                ...prev,
                propertyAddress: description,
                streetNumber: address.street,
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
            propertyAddress: value
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
        const { value } = e
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
    //             setIsLoading(true)
    //             const response = await UpdateCompanyDetailAPI(editData?.uid, fieldData);
    //             if (response?.data?.success) {
    //                 setIsLoading(false)
    //                 // router.push("/AllCompany");
    //                 // alert_success('success!')
    //                 toast.success("Success!")
    //                 getcompanyDetail()
    //                 setIsEditManage(false);
    //             } else {         
    //                 setIsLoading(false)          
    //                 const errorRes = showErrorMsg(response.data.response);
    //                 toast.error(errorRes)
    //             }
    //         }
    //     } catch (error) {
    //         setIsLoading(false)
    //         console.log(error);
    //         const [key, value] = Object.entries(error?.response?.data?.response)[0]
    //         setErrorMessages({
    //             ...errorMessages,
    //             [key == "phone_number" ? "phone" : key]: value[0]
    //         })
    //     }
    // }
    // Map API field names → formData keys
    const API_TO_FORM_KEY = {
        phone_number: "phone",
        house_no: "flatNo",
        head_office_location: "headOfficeLocation",
        street_and_number: "street",
        head_office_city: "city",
        head_office_state: "state",
        head_office_pin_code: "pinCode",
        c_first_name: "firstName",
        c_last_name: "lastName",
        company_email: "email",
        gst_number: "gst",
        legal_entity_name: "legalEntity",
        contract_currency: "currency",
        company_name: "companyName",
        head_office_country: "country",
    };

    const handleSubmitForm = async () => {
        try {
            const { errors, isValid } = addCompanyValidation(formData);
            setErrorMessages(errors);
            if (!isValid) return;

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
            // fieldData.append("latitude", formData.lat);
            // fieldData.append("longitude", formData.lng);
            if (formData.lat != null) fieldData.append("latitude", formData.lat);
            if (formData.lng != null) fieldData.append("longitude", formData.lng);
            fieldData.append("head_office_country", formData.country);

            setIsLoading(true);
            const response = await UpdateCompanyDetailAPI(editData?.uid, fieldData);
            setIsLoading(false);

            if (response?.data?.success) {
                toast.success("Success!");
                getcompanyDetail();
                setIsEditManage(false);
            } else {
                // API returned a non-success response (e.g. 400 validation errors)
                const apiErrors = response?.data?.response;
                if (apiErrors && typeof apiErrors === "object") {
                    // Map API field names back to form keys and surface inline errors
                    const mapped = Object.entries(apiErrors).reduce((acc, [apiKey, messages]) => {
                        const formKey = API_TO_FORM_KEY[apiKey] ?? apiKey;
                        acc[formKey] = Array.isArray(messages) ? messages[0] : messages;
                        return acc;
                    }, {});
                    setErrorMessages(prev => ({ ...prev, ...mapped }));
                }
                toast.error(showErrorMsg(apiErrors));
            }
        } catch (error) {
            setIsLoading(false);
            const apiErrors = error?.response?.data?.response;
            if (apiErrors && typeof apiErrors === "object") {
                const mapped = Object.entries(apiErrors).reduce((acc, [apiKey, messages]) => {
                    const formKey = API_TO_FORM_KEY[apiKey] ?? apiKey;
                    acc[formKey] = Array.isArray(messages) ? messages[0] : messages;
                    return acc;
                }, {});
                setErrorMessages(prev => ({ ...prev, ...mapped }));
                toast.error(showErrorMsg(apiErrors));
            } else {
                toast.error("Something went wrong. Please try again.");
            }
            console.error(error);
        }
    };
    return (
        <Row>
            <Col md={6} className='active-box-fadein' >
                <div className='d-flex align-items-start justify-content-between mb-5'>
                    <div className='general-info'>
                        <h2 className='font-32'> General information</h2>
                        <p className='mb-0'>Change or edit all company related general information from here</p>
                    </div>
                    <Link href="#" className={`Save-company-btn ${isLoading ? "pointer-events-none text-gray-400" : "text-blue-600"}`} style={{ textDecoration: 'none' }} onClick={handleSubmitForm}> Done </Link>
                </div>
                <div className=' company-edit-box'>
                    <h4 className='mb-4'>Company</h4>
                    <div className='form-group mb-4'>
                        <label>Company Name</label>
                        <input type='text' name='companyName' value={formData.companyName} className='form-control' onChange={handleInputChange} placeholder='e.g. Casa Melhor' />
                        <span className='text-danger'>{errorMessages.companyName}</span>
                    </div>                    
                    <hr style={{ marginBottom: '2rem' }}></hr>
                </div>
                <div className=' company-edit-box'>
                    <h4 className='mb-4'>Headoffice address</h4>
                    {/* <div className='form-group mb-4'>
                        <label>Where’s your headoffice located?</label>
                        <input type='text' name='headOfficeLocation' value={formData.headOfficeLocation} className='form-control' onChange={handleInputChange} placeholder='e.x. GQJ8+V2H Calangute, Goa' />
                        <span className='text-danger'>{errorMessages.headOfficeLocation}</span>
                    </div>
                    <Row>
                        <Col md={9}>
                            <div className='form-group mb-4'>
                                <label>Street and number</label>
                                <input type='text' name='street' value={formData.street} className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.street}</span>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className='form-group mb-4'>
                                <label>Flat/House No.</label>
                                <input type='text' name='flatNo' value={formData.flatNo} className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.flatNo}</span>
                            </div>
                        </Col>
                    </Row>
                    <div className='form-group mb-4'>
                        <label>Headoffice city</label>
                        <input type='text' name='city' value={formData.city} className='form-control' onChange={handleInputChange} placeholder='--' />
                        <span className='text-danger'>{errorMessages.city}</span>
                    </div>
                    <Row>
                        <Col md={4}>
                            <div className='form-group mb-4'>
                                <label>Headoffice state</label>
                                <input type='text' name='state' value={formData.state} className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.state}</span>
                            </div>
                        </Col>
                        <Col md={8}>
                            <div className='form-group mb-4'>
                                <label>Headoffice PIN code</label>
                                <input type='text' name='pinCode' value={formData.pinCode} className='form-control' onChange={handleInputChange} placeholder='--' />
                                <span className='text-danger'>{errorMessages.pinCode}</span>
                            </div>
                        </Col>
                    </Row>
                    <hr style={{ marginBottom: '2rem' }}></hr> */}
                    <div className="form-group mb-4" style={{ position: "relative" }}>
                        <label>Where’s your headoffice located?</label>
                        <input
                            type="text"
                            name="propertyAddress"
                            className={`form-control ${errorMessages.propertyAddress ? 'is-invalid' : ''}`}
                            placeholder="Search Property Address"
                            value={formData?.propertyAddress || value}
                            onChange={handleAddressInputChange}
                            disabled={!ready}
                            onFocus={() => setShowPropertyList(true)}
                            style={{
                                fontSize: "14px",
                                padding: "12px 16px",
                                border: errorMessages.propertyAddress ? "1px solid #dc3545" : "1px solid #6B4F3F",
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
                                <div className='form-group mb-4'>
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
                                <div className='form-group mb-4'>
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
                                <div className='form-group mb-4'>
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
                                <div className='form-group mb-4'>
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
                                <div className='form-group mb-4'>
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
                </div>
                <div className='company-edit-box '>
                    <h4 className='mb-4'>Contacts</h4>
                    <div className='form-group mb-4'>
                        <label>First name</label>
                        <input type='text' name='firstName' value={formData.firstName} className='form-control' onChange={handleInputChange} placeholder='Enter First name' />
                        <span className='text-danger'>{errorMessages.firstName}</span>
                    </div>
                    <div className='form-group mb-4'>
                        <label>Last name</label>
                        <input type='text' name='lastName' value={formData.lastName} className='form-control' onChange={handleInputChange} placeholder='Enter Last name' />
                        <span className='text-danger'>{errorMessages.lastName}</span>
                    </div>
                    <div className='form-group mb-4'>
                        <label>Position</label>
                        <input type='text' name='position' value={formData.position} className='form-control' onChange={handleInputChange} placeholder='Enter Position' />
                        <span className='text-danger'>{errorMessages.position}</span>
                    </div>
                    <div className='form-group mb-4'>
                        <label>E-mail address</label>
                        <input type='email' name='email' value={formData.email} className='form-control' onChange={handleInputChange} placeholder='Enter E-mail address' />
                        <span className='text-danger'>{errorMessages.email}</span>
                    </div>
                    <div className='form-group mb-4'>
                        <label>Phone number</label>
                        <input type='text' name='phone' value={formData.phone} maxLength={15} className='form-control' onChange={handleInputChange} placeholder='Enter Phone number' />
                        <span className='text-danger'>{errorMessages.phone}</span>
                    </div>
                    <hr style={{ marginBottom: '2rem' }}></hr>
                </div>
                <div className=' company-edit-box'>
                    <h4 className='mb-4'>Legal entity details</h4>
                    <div className='form-group mb-4'>
                        <label>GST Number</label>
                        <input type='text' name='gst' value={formData.gst} className='form-control' onChange={handleInputChange} placeholder='e.g. 24AAACC1206D1ZM' />
                        <span className='text-danger'>{errorMessages.gst}</span>
                    </div>
                    <div className='form-group mb-4'>
                        <label>Legal entity name</label>
                        <input type='text' name='legalEntity' value={formData.legalEntity} className='form-control' onChange={handleInputChange} placeholder='Enter legal entity name' />
                        <span className='text-danger'>{errorMessages.legalEntity}</span>
                    </div>
                    <div className='form-group mb-4'>
                        <label>Contract currency</label>
                        <Select
                            name="currency"
                            value={currencyOption.find((opt) => opt.value == formData.currency)}
                            options={currencyOption}
                            placeholder="Choose Currency"
                            className='react_selectbox'
                            isSearchable={false}
                            styles={customStyles}
                            onChange={handleCurrency}
                        />
                        <span className='text-danger'>{errorMessages.currency}</span>
                    </div>
                    <div className='form-group mt-5 mb-4'>
                        <Button variant="" className='btn-success complete-form-btn' disabled={isLoading ? true : false} onClick={handleSubmitForm} >Save Changes</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}
