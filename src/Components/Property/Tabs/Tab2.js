import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
                height: '170px',
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

export const Tab2 = ({ propertyDetail, setIsEditManage, canUpdateProperty }) => {

    const param = useParams();
    const id = param.id;
    const amenities2 = [

        { icon: "/images/icons/amenities-icon/Air-Conditioning.svg", label: "Air Conditioning" },
        { icon: "/images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
        { icon: "/images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
        { icon: "/images/icons/amenities-icon/heating.svg", label: "Heating" },
        { icon: "/images/icons/amenities-icon/test.svg", label: "Test" },
        { icon: "/images/icons/amenities-icon/Workspace.svg", label: "Workspace" },
        { icon: "/images/icons/amenities-icon/Ensuite-Bathroom.svg", label: "Ensuite Bathroom" },
        { icon: "/images/icons/amenities-icon/Desk.svg", label: "Desk" },
        { icon: "/images/icons/amenities-icon/Wardrobe-Hangers.svg", label: "Wardrobe & Hangers" },
        { icon: "/images/icons/amenities-icon/family-kid-friends.svg", label: "Family/Kid Friendly" },
        { icon: "/images/icons/amenities-icon/Fire-Extinguisher.svg", label: "Fire Extinguisher" },
        { icon: "/images/icons/amenities-icon/Frist-Aid-Kit.svg", label: "First Aid Kit" },
        { icon: "/images/icons/amenities-icon/Emergency-Escape.svg", label: "Emergency Escape" },
        { icon: "/images/icons/amenities-icon/CCTV.svg", label: "CCTV" },
        { icon: "/images/icons/amenities-icon/Bathing-kit.svg", label: "Bathing Kit" },

        { icon: "/images/icons/amenities-icon/Smoking-area.svg", label: "Smoking Allowed in" },
        { icon: "/images/icons/amenities-icon/Open-Area.svg", label: "Open Area" },
        { icon: "/images/icons/amenities-icon/Iron-on-request.svg", label: "Iron On Request" },

    ];
    const [amenitySearch2, setAmenitySearch2] = useState('');
    // const filteredAmenities2 = amenities2.filter(a =>
    //     a.label.toLowerCase().includes(amenitySearch2.toLowerCase())
    // );
    const [selectedAmenities2, setSelectedAmenities2] = useState([]);
    useEffect(() => {
        if (propertyDetail?.key_features) {
            setSelectedAmenities2(amenities2.filter((item) => propertyDetail?.key_features?.includes(item.label)))
        }
    }, [propertyDetail?.key_features])

    const handleAmenitySelect2 = (label) => {
        setSelectedAmenities2((prev) =>
            prev.includes(label)
                ? prev.filter((l) => l !== label)
                : [...prev, label]
        );
    };
    const amenities = [

        { icon: "/images/icons/amenities-icon/Air-Conditioning.svg", label: "Air Conditioning" },
        { icon: "/images/icons/amenities-icon/CableSatellite-TV.svg", label: "Cable/Satellite TV" },
        { icon: "/images/icons/amenities-icon/Wifi-Internet.svg", label: "Wifi Internet" },
        { icon: "/images/icons/amenities-icon/Serves-Breakfast.svg", label: "Serves Breakfast" },
        { icon: "/images/icons/amenities-icon/Serves-Lunch.svg", label: "Serves Lunch" },
        { icon: "/images/icons/amenities-icon/Serves-Dinner.svg", label: "Serves Dinner" },
        { icon: "/images/icons/amenities-icon/BuzzerWireless.svg", label: "Buzzer/Wireless" },
        { icon: "/images/icons/amenities-icon/intercom.svg", label: "Intercom" },
        { icon: "/images/icons/amenities-icon/elevator-building.svg", label: "Elevator in Building" },
        { icon: "/images/icons/amenities-icon/parking.svg", label: "Parking  " },
        { icon: "/images/icons/amenities-icon/laundry.svg", label: "Laundry" },
        { icon: "/images/icons/amenities-icon/Access-to-kitchen.svg", label: "Access to Kitchen" },
        { icon: "/images/icons/amenities-icon/Swimming-pool.svg", label: "Swimming Pool" },
        { icon: "/images/icons/amenities-icon/Air-Conditioning.svg", label: "Gym" },
        { icon: "/images/icons/amenities-icon/gym.svg", label: "Air Conditioning" },

    ];
    const [amenitySearch, setAmenitySearch] = useState("");
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    // const filteredAmenities = amenities.filter((a) =>
    //     a.label.toLowerCase().includes(amenitySearch.toLowerCase())
    // );
    useEffect(() => {
        if (propertyDetail?.property_amenities) {
            setSelectedAmenities(amenities.filter((item) => propertyDetail?.property_amenities?.includes(item.label)))
        }
    }, [propertyDetail?.property_amenities])

    console.log(propertyDetail)
    return (
        <>
            <Row>
                <Col md={6}>
                    <div className='d-flex align-items-start justify-content-between mb-5'>
                        <div className='general-info'>
                            <h2 className='page-title'> General information</h2>
                            <p className='mb-0'>Change or edit all company related general information from here</p>
                        </div>

                        {canUpdateProperty && <Link href="" className='edit-company-btn' style={{ color: '#463527', textDecoration: 'none' }} onClick={() => setIsEditManage(true)}> Manage </Link>}

                    </div>


                    <div className='comapny-information-box '>
                        <h4 className='mb-4'>Property level information</h4>

                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                            <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Name  </span>
                            <br></br>
                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
                                {propertyDetail?.property_name}, {propertyDetail?.city} </span>

                        </p>



                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                            <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Maximum guest capacity for BR  </span>
                            <br></br>
                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
                                {propertyDetail?.max_capacity}</span>

                        </p>



                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                            <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Description  </span>
                            <br></br>
                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
                                {/* This tastefully designed bedroom apartment and is surrounded by greenery all around.
                                The Apartment is appointed with modern furnishings that perfectly complement the decor
                                of the entire place. Each of the rooms is furnished with a modern double bed, bedside tables,
                                and a cupboard.
                                <br></br>
                                <br></br>

                                {"The apartment has everything you'll need to stay comfortably and safely in the heart of Porvorim ."}
                                The space is clean and practical, with all comforts - including easily accessible charging points,
                                well-equipped kitchen, iron board with iron provided. */}
                                {propertyDetail?.property_description}
                            </span>

                        </p>
                    </div>
                    <div className='comapny-information-box '>
                        <h4 className='mb-4'>Property location</h4>
                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Address  </span> <br></br>
                        </p>

                        <div className="mb-3" style={{ position: "relative", width: "100%", height: "158px" }}>
                            {propertyDetail.street_number}, {propertyDetail.city}, {propertyDetail.state}, {propertyDetail.country}
                            <DynamicMap
                                lat={propertyDetail.latitude}
                                lng={propertyDetail.longitude}
                                address={propertyDetail.address_search_text}
                            />
                        </div>
                        <p className="mb-0">{propertyDetail?.street_number}, {propertyDetail?.city}, {propertyDetail?.state} {propertyDetail?.pin_code}</p>

                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                            <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Nearest airport to this BR / property  </span>
                            <br></br>
                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >{propertyDetail?.nearest_airport} </span>
                        </p>
                        <hr></hr>
                    </div>



                    <div className='comapny-information-box property-list-2'>
                        <h4 className='mb-0'>Amenities</h4>
                        <p> You’ve added these to your listing so far. </p>


                        <dl className='br-list-data mb-0'>
                            {selectedAmenities?.map((a, idx) => {
                                const isSelected = selectedAmenities2.includes(a.label);
                                return (
                                    <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
                                        <span className='br-list gap-2'>
                                            <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
                                            {a.label}
                                        </span>

                                    </li>
                                );
                            })}
                            {selectedAmenities?.length === 0 && (
                                <li style={{ color: "#73615F", padding: "0px 0" }}>No amenities found.</li>
                            )}
                        </dl>
                        <hr></hr>


                    </div>


                    <div className='comapny-information-box property-list-2'>
                        <h4 className='mb-0'>Key features or standout amenities</h4>
                        <p> You’ve added these to your listing so far. </p>

                        <ol className="br-list-data ps-0 mb-0">
                            {selectedAmenities2?.map((a, idx) => {
                                const isSelected = selectedAmenities.includes(a.label);
                                return (
                                    <li key={idx} className='d-flex justify-content-between align-items-center' style={{ padding: "0px 0" }}>
                                        <span className='br-list gap-2'>
                                            <Image src={a.icon} className='img-fluid' width={24} height={24} alt={a.label} />
                                            {a.label}
                                        </span>

                                    </li>
                                );
                            })}

                            {/* <li>  <span className='br-list gap-2'>+ 1 more </span></li> */}

                            {selectedAmenities2?.length === 0 && (
                                <li style={{ color: "#73615F" }}>No amenities found.</li>
                            )}
                        </ol>
                        <hr></hr>
                    </div>

                    <div className='comapny-information-box '>
                        <h4 className='mb-4'>Additional regional information</h4>
                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >GST Number  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {propertyDetail?.gst_number} </span></p>
                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Permanent Account Number (PAN) </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {propertyDetail?.pan_number} </span></p>
                    </div>



                    <div className='comapny-information-box '>
                        <h4 className='mb-4'>Property manager</h4>

                        {propertyDetail?.staff_assignments?.property_managers?.map((item, index) => (
                            <div key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "#f9f6f4",
                                    border: "1px solid rgb(128 99 75 / 24%)",
                                    borderRadius: "0px",
                                    padding: "12px 16px",
                                    marginBottom: "0px",
                                    marginTop: "0px",
                                }}
                            >
                                <Image
                                    // src="/images/icons/manager-img.jpg"
                                    src={
                                        item.profile_image
                                            ? `${item.profile_image}`
                                            : "/images/icons/No-Image.svg"
                                    }
                                    alt="manager"
                                    width={48}
                                    height={48}
                                    style={{
                                        borderRadius: "0px",
                                        objectFit: "cover",
                                        marginRight: "16px",
                                    }}
                                />

                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                        {item?.name}

                                        {/* <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
                                            (You)
                                        </span> */}

                                    </span>
                                    <span style={{ margin: "0 12px", color: "#73615F" }}>|</span>
                                    <span style={{ display: "flex", color: "#463527", fontSize: "14px", marginRight: "12px" }}>
                                        <Image src="/images/icons/call.svg" alt="call" width={18} height={18} />
                                        {item?.phone_number}
                                    </span>
                                    <span style={{ margin: "0 12px", color: "#73615F" }}>|</span>
                                    <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                                        <Image src="/images/icons/email.svg" alt="email" width={18} height={18} />
                                        {item?.email}
                                    </span>
                                </div>
                            </div>

                        ))}

                        <hr></hr>
                    </div>



                    <div className='comapny-information-box '>
                        <h4 className='mb-4'>Property caretaker</h4>


                        {propertyDetail?.staff_assignments?.property_caretakers?.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "#f9f6f4",
                                    border: "1px solid rgb(128 99 75 / 24%)",
                                    borderRadius: "0px",
                                    padding: "12px 16px",
                                    marginBottom: "0px",
                                    marginTop: "0px",
                                }}
                            >
                                <Image
                                    // src="/images/icons/manager-img.jpg"
                                    src={
                                        item.profile_image
                                            ? `${item.profile_image}`
                                            : "/images/icons/No-Image.svg"
                                    }
                                    alt="manager"
                                    width={48}
                                    height={48}
                                    style={{
                                        borderRadius: "0px",
                                        objectFit: "cover",
                                        marginRight: "16px",
                                    }}
                                />

                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                        {item?.name}

                                        <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
                                            (You)
                                        </span>

                                    </span>
                                    <span style={{ margin: "0 12px", color: "#73615F" }}>|</span>
                                    <span style={{ display: "flex", color: "#463527", fontSize: "14px", marginRight: "12px" }}>
                                        <Image src="/images/icons/call.svg" alt="call" width={18} height={18} />
                                        {item?.phone_number}
                                    </span>
                                    <span style={{ margin: "0 12px", color: "#73615F" }}>|</span>
                                    <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                                        <Image src="/images/icons/email.svg" alt="email" width={18} height={18} />
                                        {item?.email}
                                    </span>
                                </div>
                            </div>

                        ))}
                        <hr></hr>
                    </div>


                    <div className='comapny-information-box '>
                        <h4 className='mb-4'>Operations manager</h4>


                        <div className="manager-pic">
                            <Image
                                src={propertyDetail?.ops_manager_photo_url}
                                className="img-fluid"
                                alt="pic"
                                width={76}
                                height={76}

                            />

                            {/* <span className="edit-pic" > */}
                            <span className="edit-pic" style={{ cursor: 'pointer' }} onClick={() => setIsEditManage(true)} >
                                <Image
                                    src='/images/icons/photo_camera.svg'
                                    className="img-fluid"
                                    alt="pic"
                                    width={18}
                                    height={18}

                                />
                                Edit
                            </span>
                        </div>

                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Name  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {propertyDetail?.ops_manager_name} </span></p>


                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Contact email  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {propertyDetail?.ops_manager_email} </span></p>

                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Contact phone number  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {propertyDetail?.ops_manager_phone} </span></p>
                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Alternate phone number  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {propertyDetail?.ops_manager_phone_alt} </span></p>


                    </div>



                </Col>

            </Row>
        </>
    )
}
