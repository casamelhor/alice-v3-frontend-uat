"use client"
import React from 'react'
import Header from '../Header/Header'
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form, Accordion, Label } from 'react-bootstrap';
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import './testimonials.scss';
import { useRouter } from 'next/navigation';
import { companyListAPI, PropertyListFullApi, BasicBookingSearch, PropertyDetailApi, FeedbackInsightsAPI } from '@/services/provider';
import { formatYMD } from '@/utils/formatTime';
import dynamic from "next/dynamic";
import { getItemLocalStorage, setItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
import { useParams, useSearchParams } from "next/navigation";



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





export default function ViewDetailsResult() {
    const router = useRouter();
    const bacisSearchDetails = JSON.parse(getItemLocalStorage("basicSecrchItemObj"));
    const selectedpropId = getItemLocalStorage("selectedpropId");
    const [marknoShowsModal, marknoShowsetShow] = useState(false);
    const [bookingRoomsData, setBookingRoomsData] = useState([])
    const [currentPropDetails, setCurrentPropDetails] = useState(null)
    const [mapDataArr, setMapDataArr] = useState([])
    const [companyList, setCompanyList] = useState([]);
    const [roomsCountForOption, setRoomCountForOption] = useState(0)
    const [isAutoCallChange, setIsAutoCallChange] = useState(false)
    const [cityList, setCityList] = useState([]);
    const [responseSearchData, setResponseSearchData] = useState(null)
    const [activeSec, setActiveSec] = useState("space")
    const [feedbackInsights, setFeedbackInsights] = useState({});
    const [testimonials, setTestimonials] = useState([]);
    const [propManagers, setPropManagers] = useState([]);
    const [filtermShow, setFiltersetShow] = useState(false);
    const [showFull, setShowFull] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);



    const [filterKeyHome, setFilterKeyHome] = useState({
        property: '', location: '', company: ''
    })
    const [searchFieldData, setSearchFieldData] = useState(
        {
            company_id: 0,
            city: "",
            check_in_date: "",
            check_out_date: "",
            rooms: [],
            // room_type_preference: "Any",
            // budget_range: {
            //     min: 0,
            //     max: 0
            // },
            // availability: false,
            // sort_by: "availability",
            // gender_filter: "Male"
        }
    )

    const params = useParams();
    const room_uid = params.room_uid;



    const searchParams = useSearchParams();
    const propertyUID = searchParams.get("property_uid");

    useEffect(() => {

        console.log("LocalStorage selectedpropId:", selectedpropId);

        console.log("URL property_uid:", propertyUID);

    }, [propertyUID]);




    //  const router = useRouter();

    // const propertyUID =
    //     router.isReady && typeof router.query.property_uid === "string"
    //         ? router.query.property_uid
    //         : null;

    useEffect(() => {

        if (!propertyUID) return;

        console.log("Selected property:", propertyUID);

    }, [propertyUID]);





    useEffect(() => {

        const payload = JSON.parse(localStorage.getItem("basicSecrchItemObj"));

        if (payload) {
            payload.room_uid = room_uid;

            BasicBookingSearch(payload)
                .then(res => {
                    console.log("Room details:", res);
                });
        }

    }, []);

    console.log("room uid", room_uid);



    const marknoShowClose = () => marknoShowsetShow(false);
    const marknoShowModal = () => marknoShowsetShow(true);

    const reserveroom = () => {
        router.push('/ReserveBooking');
    };

    const PropertyMap = dynamic(
        () => import("../PropertyMap"),
        {
            ssr: false,
        }
    );

    // 
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



    const [rooms, setRooms] = useState([
        { id: 1, adults: 1 }
    ]);

    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

    const handleAdultChange = (roomId, change) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId) {
                const newValue = room.adults + change;
                return { ...room, adults: newValue >= 1 ? newValue : 1 };
            }
            return room;
        }));
    };


    const [showPrices, setShowPrices] = useState(false);

    const addRoom = () => {
        const newRoomId = rooms.length + 1;
        setRooms([...rooms, { id: newRoomId, adults: 1 }]);
    };

    const deleteRoom = (roomId) => {
        if (rooms.length > 1) {
            setRooms(rooms.filter(room => room.id !== roomId));
        }
    };

    const handleUpdateSearch = () => {
        fetchSearchResult(searchFieldData)
        setIsAutoCallChange(false)
    }

    useEffect(() => {
        if (isAutoCallChange) {
            handleUpdateSearch()
        }
    }, [isAutoCallChange]);

    // const [propertyManagers, setPropManagers] = useState([
    //     {
    //         name: 'N/A',
    //         role: 'N/A',
    //         image: '/images/icons/No-Image.svg',
    //         phone: 'N/A',
    //         email: 'N/A'
    //     }
    // ]);

    useEffect(() => {
        if (bookingRoomsData.length > 0) {

            // ✅ total rooms count
            const totalRooms = bookingRoomsData.length;

            setRoomCountForOption(totalRooms);

            // ✅ property manager object
            let propManagerObj = {
                name: currentPropDetails?.ops_manager_name,
                role: "Manager",
                image: currentPropDetails?.ops_manager_photo_url,
                phone: currentPropDetails?.ops_manager_phone,
                email: currentPropDetails?.ops_manager_email,
            };

            setPropManagers((prev) => [...prev, propManagerObj]);
        }

    }, [bookingRoomsData, currentPropDetails]);


    const fetchSearchResult = async (payload) => {
        try {
            const response = await BasicBookingSearch(payload);

            if (response?.data?.success) {

                // ✅ flatten and filter rooms by propertyUID
                const filteredRooms =
                    response?.data?.response?.bedrooms
                        ?.flatMap(bed =>
                            bed.properties
                                .filter(prop => prop.property_uid === propertyUID)
                                .flatMap(prop => prop.rooms)
                        ) || [];

                console.log("Filtered Rooms:", filteredRooms);

                // ✅ now bookingRoomsData will contain direct rooms array
                setBookingRoomsData(filteredRooms);

                // optional: save search params
                setResponseSearchData(response?.data?.response?.search_params);

            } else {
                console.log("API returned error");
            }

        } catch (error) {
            console.log("Search Error:", error);
        }
    };

    // useEffect(() => {
    //     if (!!bacisSearchDetails) {
    //         fetchSearchResult(bacisSearchDetails)
    //     }
    // }, [])



    useEffect(() => {
        if (bacisSearchDetails && propertyUID) {
            fetchSearchResult(bacisSearchDetails);
        }
    }, [propertyUID]);



    const [selectedDate, setStartDate] = useState(
        new Date("2025/10/1")
    );
    const [endDate, setEndDate] = useState(
        new Date("2025/10/1")

    );

    const [images] = useState([
        '/images/icons/slide-image.jpg',
        '/images/icons/room-1.jpg',
        '/images/icons/room-1.jpg',
        '/images/icons/room-1.jpg',
        '/images/icons/room-1.jpg',

    ]);
    const [activeIndex, setActiveIndex] = useState(0);
    const amenities = [
        { icon: '/images/icons/work.svg', label: 'Business Services', value: "business_services" },
        { icon: '/images/icons/concierge.svg', label: 'Concierge', value: "concierge" },
        { icon: '/images/icons/qr_code.svg', label: 'Digital Check-In', value: "digital_check-In" },
        { icon: '/images/icons/fitness_center.svg', label: 'Fitness Center', value: "fitness_center" },
        { icon: '/images/icons/wifi.svg', label: 'Free Internet Access', value: "free_internet_access" },
        { icon: '/images/icons/local_parking.svg', label: 'Free Parking', value: "parking" },
        { icon: '/images/icons/ac.svg', label: 'Air Conditioning', value: "air_conditioning" },
        { icon: '/images/icons/laundry.svg', label: 'Laundry', value: "laundry" },
        { icon: '/images/icons/interpreter_mode.svg', label: 'Meeting Facilities', value: "meeting_facilities" },
        { icon: '/images/icons/pool.svg', label: 'Pool', value: "pool" },
        { icon: '/images/icons/in_home_mode.svg', label: 'Resort Property', value: "resort_property" },
        { icon: '/images/icons/room_service.svg', label: 'Room Service', value: "room_service" },
        { icon: '/images/icons/Serves-Dinner.svg', label: 'Serves Dinner', value: "serves_dinner" }

    ];

    // const normalize = (text) =>
    //     text.toLowerCase().replace(/\s+/g, "_");
    // const apiValues = currentPropDetails?.property_amenities?.map(normalize);

    // const filteredAmenities = amenities.filter(item =>
    //     apiValues?.includes(item.value)
    // );





    const thingstoknow = [
        {
            icons: '/images/icons/group-user.svg',
            text: 'Guest Requirements',
            text2: 'Guest aged 2 and up can attend'
        },

        {
            icons: '/images/icons/group-user.svg',
            text: 'Guest Requirements',
            text2: 'Guest aged 2 and up can attend'
        },

        {
            icons: '/images/icons/group-user.svg',
            text: 'Guest Requirements',
            text2: 'Guest aged 2 and up can attend'
        },

        {
            icons: '/images/icons/group-user.svg',
            text: 'Guest Requirements',
            text2: 'Guest aged 2 and up can attend'
        },

        {
            icons: '/images/icons/group-user.svg',
            text: 'Guest Requirements',
            text2: 'Guest aged 2 and up can attend'
        },


    ]

    // sample rooms data
    // const roomsList = [
    //     {
    //         id: 1,
    //         title: 'Room 1',
    //         sleeps: 2,
    //         bedType: '2 twin beds',
    //         size: '538 sq ft',
    //         amenities: ['36" flat-screen TV', 'Ceiling fans', 'Coffee maker', 'Robes', 'Hair dryer'],
    //         image: '/images/icons/room-1.jpg',
    //         imagesCount: 5,
    //         booked: true,
    //         femalePreferred: true,
    //         price: 2939
    //     },
    //     {
    //         id: 2,
    //         title: 'Room 2',
    //         sleeps: 2,
    //         bedType: '1 king bed',
    //         size: '538 sq ft',
    //         amenities: ['36" flat-screen TV', 'Ceiling fans', 'Coffee maker'],
    //         image: '/images/icons/room-2.jpg',
    //         imagesCount: 5,
    //         booked: true,
    //         femalePreferred: false,
    //         price: 2939
    //     },
    //     {
    //         id: 3,
    //         title: 'Room 3',
    //         sleeps: 2,
    //         bedType: '2 twin beds',
    //         size: '538 sq ft',
    //         amenities: ['36" flat-screen TV', 'Coffee maker', 'Iron and ironing board'],
    //         image: '/images/icons/room-1.jpg',
    //         imagesCount: 5,
    //         booked: false,
    //         femalePreferred: false,
    //         price: 2939
    //     },
    //     {
    //         id: 4,
    //         title: 'Room 4',
    //         sleeps: 2,
    //         bedType: '1 king bed',
    //         size: '538 sq ft',
    //         amenities: ['36" flat-screen TV', 'Ceiling fans', 'Coffee maker'],
    //         image: '/images/icons/room-2.jpg',
    //         imagesCount: 5,
    //         booked: false,
    //         femalePreferred: false,
    //         price: 2939
    //     }
    // ];

    useEffect(() => {
        if (filterKeyHome?.property && filterKeyHome?.company) {
            getFeedbackInsightsData();

        }
    }, [filterKeyHome]);


    const getFeedbackInsightsData = async () => {
        try {
            const response = await FeedbackInsightsAPI(
                '12_months',
                filterKeyHome.property,
                filterKeyHome.company

            );

            console.log("API response:", response);
            if (response?.data?.success) {
                const insights = response.data.response;
                setFeedbackInsights(insights);

                // map backend data → testimonials format
                const mappedTestimonials = insights.recent_reviews.map((review) => ({
                    quote: review.public_review,
                    images: review.guest_photo
                        ? [review.guest_photo]  // string ko array me convert
                        : ['/images/icons/slide-image.jpg'],
                    author: review.guest_name
                }));

                setTestimonials(mappedTestimonials);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log("useEffect called");
        getFeedbackInsightsData();
    }, []);


    // useEffect(() => {
    //     getFeedbackInsightsData()
    // }, []);

    // const testimonials = [
    //     {
    //         public_review: "Planning an offsite would take time we simply didn't have. When the options were trying to put together a half-assed offsite, which would distract the team and cost just as much in the hours put in, or let someone with actual experience and focus put together a great offsite tailored for our needs and goals – it was a no-brainer to work with Team Offsite.",
    //         guest_photo: ['/images/icons/slide-image.jpg', '/images/icons/room-1.jpg', '/images/icons/room-2.jpg'],
    //         guest_name: 'Dhruv Mahajan'
    //     },
    // {
    //     quote: "Planning an offsite would take time we simply didn't have. When the options were trying to put together a half-assed offsite, which would distract the team and cost just as much in the hours put in, or let someone with actual experience and focus put together a great offsite tailored for our needs and goals – it was a no-brainer to work with Team Offsite.",
    //     images: ['/images/icons/room-1.jpg', '/images/icons/room-2.jpg'],
    //     author: 'Dhruv Mahajan'
    // },
    // {
    //     quote: "Planning an offsite would take time we simply didn't have. When the options were trying to put together a half-assed offsite, which would distract the team and cost just as much in the hours put in, or let someone with actual experience and focus put together a great offsite tailored for our needs and goals – it was a no-brainer to work with Team Offsite.",
    //     images: ['/images/icons/room-1.jpg'],
    //     author: 'Dhruv Mahajan'
    // },
    // {
    //     quote: "Planning an offsite would take time we simply didn't have. When the options were trying to put together a half-assed offsite, which would distract the team and cost just as much in the hours put in, or let someone with actual experience and focus put together a great offsite tailored for our needs and goals – it was a no-brainer to work with Team Offsite.",
    //     images: ['/images/icons/room-1.jpg', '/images/icons/room-2.jpg'],
    //     author: 'Dhruv Mahajan'
    // }
    // ];
    const getProprtyList = async () => {
        try {
            const response = await PropertyListFullApi();
            if (response?.data?.success) {
                //                 const uniqueCities = [
                //   ...new Set(response.data.response.map(ele => ele.city))
                // ].map(city => ({ city }));
                const uniqueCities = [
                    { city: "Jaipur" },
                    ...Array.from(
                        new Set(response.data.response.map(ele => ele.city)),
                        city => ({ city })
                    ).filter(item => item.city !== "Jaipur")
                ];
                setCityList(uniqueCities)
            }

        } catch (error) {
            console.log("Company API Error: ", error);
        }
    };
    const getCompanyList = async () => {
        try {
            const response = await companyListAPI("all");
            if (response?.data?.success) {
                const list = response.data.response.map(item => ({
                    value: item.id,
                    label: item.company_name
                }));
                setCompanyList(list);
            }
        } catch (error) {
            console.log("Company API Error: ", error);
        }
    };
    // const gerPropertyById = async () => {
    //     try {
    //         const response = await PropertyDetailApi(selectedpropId);
    //         if (response?.data?.success) {
    //             setCurrentPropDetails(response.data.response)
    //         }
    //     } catch (error) {
    //         console.log("Company API Error: ", error);
    //     }
    // };

    const gerPropertyById = async (uid) => {

        if (!uid) {
            console.log("Property UID is null");
            return;
        }

        try {
            console.log("Calling PropertyDetailApi with UID:", uid);

            const response = await PropertyDetailApi(uid);

            if (response?.data?.success) {
                setCurrentPropDetails(response.data.response);
            }

        } catch (error) {
            console.log("Company API Error: ", error);
        }
    };


    useEffect(() => {
        getCompanyList();
        getProprtyList();
        if (propertyUID) {
            gerPropertyById(propertyUID);
        }
        if (bacisSearchDetails) {
            setSearchFieldData({
                company_id: bacisSearchDetails.company_id,
                city: bacisSearchDetails.city,
                check_in_date: bacisSearchDetails.check_in_date,
                check_out_date: bacisSearchDetails.check_out_date,
                rooms: bacisSearchDetails.rooms.map(item => ({ adults: item.adults }))
            })
            setRooms(bacisSearchDetails.rooms.map((val, idx) => ({ id: rooms.length, adults: val.adults })))
        }
    }, [propertyUID])


    const checkIn = searchFieldData.check_in_date
        ? new Date(searchFieldData.check_in_date)
        : null;

    const checkOut = searchFieldData.check_out_date
        ? new Date(searchFieldData.check_out_date)
        : null;


    const propertyManagers = React.useMemo(() => {
        const managers = [];

        // ✅ Add ops_manager
        if (currentPropDetails?.ops_manager_name) {
            managers.push({
                ops_manager_name: currentPropDetails.ops_manager_name,
                ops_manager_email: currentPropDetails.ops_manager_email,
                ops_manager_phone: currentPropDetails.ops_manager_phone,
                ops_manager_photo_url: currentPropDetails.ops_manager_photo_url,
                role: "Operations Manager"
            });
        }

        // ✅ Correct path: staff_assignments.property_managers
        if (currentPropDetails?.staff_assignments?.property_managers?.length > 0) {
            currentPropDetails.staff_assignments.property_managers.forEach(pm => {
                managers.push({
                    ops_manager_name: pm.name,
                    ops_manager_email: pm.email,
                    ops_manager_phone: pm.phone_number,
                    // ops_manager_photo_url: pm.profile_image,
                    ops_manager_photo_url: pm.profile_image
                        ? `${pm.profile_image}`
                        : null,
                    role: "Property Manager"
                });
            });
        }

        return managers;

    }, [currentPropDetails]);


    //   const amenities = [
    //         { icon: "./images/icons/ac.svg", label: "Air conditioning" },
    //         { icon: "./images/icons/concierge.svg", label: "Concierge" },
    //         { icon: "./images/icons/fitness_center.svg", label: "Fitness center" },
    //         { icon: "./images/icons/wifi.svg", label: "Free internet access" },
    //         { icon: "./images/icons/local_parking.svg", label: "Free parking" },
    //         { icon: "./images/icons/interpreter.svg", label: "Meeting facilities" }
    //     ];

    const propertyAmenities = currentPropDetails?.property_amenities || [];

    const filteredAmenities = amenities.filter(a =>
        propertyAmenities.some(pa =>
            pa.toLowerCase() === a.label.toLowerCase()
        )
    );


    // const [filtermShow, setFiltersetShow] = useState(false);
    const [seletedRoomData, setSelectedRoomData] = useState(null)

    const filterClose = () => { setFiltersetShow(false); setSelectedRoomData(null) };
    // const filterShow = (room, adults) => {
    //     setFiltersetShow(true);
    //     const filteredData =
    //         bookingRoomsData?.[0]?.properties
    //             ?.map(prop => {
    //                 const selectedRooms = prop.rooms.filter(
    //                     selectedRoom => selectedRoom.room_uid === room.room_uid
    //                 );


    //                 if (!selectedRooms.length) return null;

    //                 return {
    //                     ...prop,
    //                     rooms: selectedRooms,
    //                     adultCount: adults,
    //                 };
    //             })
    //             .filter(Boolean) || [];

    //     setSelectedRoomData(filteredData);
    // };

    const filterShow = (room, adults = 1) => {
        setFiltersetShow(true);
        setCurrentIndex(0);
        setSelectedRoomData({
            ...room,
            adultCount: adults
        });
    };


    const visibleAmenities = showAll ? amenities : amenities.slice(0, 6);

    return (
        <>
            <Header />

            <div className='booking-filter bg-light p-4'>
                <Container>
                    <Row className='gap-0' >
                        <Col md={2} className='gap-1' >
                            <div className='form-group'>
                                <label className='text-black' > Which company?</label>
                                <Select
                                    name="aria-role-select"
                                    options={companyList}
                                    placeholder="Select company"
                                    className="react_selectbox"
                                    isSearchable={false}
                                    value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
                                    onChange={option => { setSearchFieldData({ ...searchFieldData, company_id: option.value }) }}
                                    styles={customStyles}
                                />
                            </div>
                        </Col>



                        <Col md={2} className='gap-1'>
                            <div className='form-group'>
                                <label className='text-black' > Where to?</label>
                                <Select
                                    name="aria-role-select"
                                    options={cityList}
                                    placeholder="Select city"
                                    className="react_selectbox"
                                    isSearchable={false}
                                    getOptionLabel={(option) => option.city}
                                    getOptionValue={(option) => option.city}
                                    value={cityList?.find(c => c.city === searchFieldData.city) || null}
                                    onChange={(option) =>
                                        setSearchFieldData({ ...searchFieldData, city: option.city })
                                    }
                                    styles={customStyles}
                                />

                            </div>
                        </Col>

                        <Col md={4} className='gap-2' >
                            <div className='d-flex gap-0 '>
                                <div className='d-flex form-group flex-col w-50'>
                                    <label className='text-black' > Check-in date</label>
                                    <DatePicker
                                        selected={searchFieldData.check_in_date}
                                        onChange={(date) => setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) })}
                                        selectsStart
                                        minDate={new Date()}
                                        startDate={new Date()}
                                        className="form-control  custom-date-picker"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText='dd/MM/yyyy'
                                    />

                                </div>
                                <div className='d-flex form-group flex-col w-50'>
                                    <label className='text-black' > Checkout date</label>
                                    <DatePicker
                                        selected={searchFieldData.check_out_date ? searchFieldData.check_out_date : searchFieldData.check_in_date}
                                        onChange={(date) => setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) })}
                                        selectsEnd
                                        startDate={searchFieldData.check_in_date}
                                        endDate={searchFieldData?.check_out_date ? searchFieldData?.check_out_date : new Date()}
                                        minDate={new Date()}
                                        className="form-control  custom-date-picker"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText='dd/MM/yyyy'
                                    />
                                </div>
                            </div>
                        </Col>


                        <Col md={4} className='gap-1 '>
                            <Row>
                                <Col md={7}>
                                    <div className='form-group'>
                                        <label className='text-black'>No. of Rooms & Guests</label>
                                        <div
                                            className="react_selectbox custom-dropdown"
                                            onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                                        >
                                            <div className="selected-value">
                                                {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`}
                                            </div>
                                            {isRoomDropdownOpen && (
                                                <div className="room-dropdown-content">
                                                    {rooms.map((room) => (
                                                        <div key={room.id} className="room-section">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="room-header">Room {room.id}</div>
                                                                {rooms.length > 1 && (
                                                                    <button
                                                                        className="delete-room-btn"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            deleteRoom(room.id);
                                                                        }}
                                                                    >

                                                                        <Image src='./images/icons/delete_b.svg' width={20} height={20} alt="delete" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="guest-counter">
                                                                <label>Adults</label>
                                                                <div className="counter-controls">
                                                                    <button
                                                                        className="counter-btn"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleAdultChange(room.id, -1);
                                                                        }}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span>{room.adults}</span>
                                                                    <button
                                                                        className="counter-btn"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleAdultChange(room.id, 1);
                                                                        }}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="d-flex align-items-center justify-between">
                                                        <button
                                                            className="add-room-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addRoom();
                                                            }}
                                                        >
                                                            <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' width={24} height={24} />   Add a room
                                                        </button>
                                                        <button
                                                            className="done-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsRoomDropdownOpen(false);
                                                                setSearchFieldData({
                                                                    ...searchFieldData,
                                                                    rooms: rooms.map(item => ({ adults: item.adults }))
                                                                })
                                                            }}
                                                        >
                                                            Done
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>

                                <Col md={5}>
                                    <div className='form-group h-100 align-items-center d-flex pt-1'>

                                        <Button className="mt-4 p-2" style={{ background: '#2C734A', width: '100%', height: '48px', textAlign: 'center', borderRadius: '0', color: '#fff' }} variant='' onClick={(e) => { router.push('./Searchresult'); setItemLocalStorage('basicSecrchItemObj', JSON.stringify(searchFieldData)) }}> Update Search </Button>

                                    </div>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='page-body  pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <Link href="./Searchresult" className='back-page'>
                                <Image src='../images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={12} className=' mb-4' >
                            <div className='d-flex justify-content-between align-items-center pb-4 border-bottom-custom '>
                                {/* <h2 className='page-title'>Casa Melhor Yayati Tulip 17th Floor Property Details</h2> */}
                                <h2 className='page-title'>{currentPropDetails?.property_name},{currentPropDetails?.address_search_text}</h2>
                                <div className='d-flex align-items-center gap-3'>
                                    <Link href="/Bookings" className='btn-company-edit btn-light-transparent btn-white-transparent '> Bookings <Image src="../images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='booking' /> </Link>
                                    <Link href="/Calendar" className='btn-company-delete btn-light-transparent btn-white-transparent'> Calendar <Image src="../images/icons/open_in_new.svg" className='img-fluid' width={25} height={25} alt='calendor' /></Link>
                                    <Link href={`/propertyDetails?uid=${propertyUID}`} className='btn-company-delete btn-light-transparent'>  Go to Listing Editor </Link>
                                </div>
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="property-gallery mb-4">
                                <Row className="g-3">
                                    <Col md={7} className="gallery-main-col">
                                        {currentPropDetails?.property_photos.length > 0 && currentPropDetails?.property_photos.filter(item => item.is_property_cover_photo).map((image, index) => (<div key={index} className={`gallery-main ${activeIndex === 0 ? 'active' : ''}`}>
                                            <Image src={`${image.property_photo_url}`} alt={`photo-${activeIndex}`} width={1000} height={600} className="img-fluid w-100" />
                                            <div className="show-all-badge">
                                                <Image src='/images/icons/image_w.svg' className='img-fluid' alt='galler' width={16} height={16} />
                                                Show all {currentPropDetails?.property_photos?.length} photos</div>
                                        </div>))}
                                    </Col>
                                    <Col md={5} className="gallery-thumbs-col">
                                        <div className="thumbs-grid">
                                            {currentPropDetails?.property_photos.length > 0 && currentPropDetails?.property_photos.slice(1, 5).map((item, i) => {
                                                const imgIndex = i + 1;
                                                return (
                                                    <button key={imgIndex} className={`thumb-btn ${activeIndex === imgIndex ? 'selected' : ''}`} onClick={() => setActiveIndex(imgIndex)}>
                                                        <Image src={`${item.property_photo_url}`} alt={`thumb-${imgIndex}`} width={320} height={160} className="img-fluid" />
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='scrollar-btn'>
                                <Link href="#space" variant='' onClick={() => { setActiveSec("space") }} className={`btn-movewble ${activeSec === "space" ? "active" : ""}`}>Space</Link>
                                <Link href="#Rooms" variant='' onClick={() => { setActiveSec("Rooms") }} className={`btn-movewble ${activeSec === "Rooms" ? "active" : ""}`}>Rooms</Link>
                                <Link href="#Review" variant='' onClick={() => { setActiveSec("Review") }} className={`btn-movewble ${activeSec === "Review" ? "active" : ""}`}>Reviews</Link>
                                <Link href="#Location" variant='' onClick={() => { setActiveSec("Location") }} className={`btn-movewble ${activeSec === "Location" ? "active" : ""}`}>location</Link>

                                <Link href="#Things-to-know" variant='' onClick={() => { setActiveSec("Things-to-know") }} className={`btn-movewble ${activeSec === "Things-to-know" ? "active" : ""}`}>Things to Know</Link>
                            </div>
                            <div onMouseEnter={(e) => { setActiveSec("space") }} className="space-details py-5" id='space' >
                                <Row>
                                    <Col md={6}>
                                        <p className="small-label">The space</p>
                                        <h3 className="font-24">{currentPropDetails?.property_name}</h3>
                                        <p className="address d-flex gap-2 align-items-start mb-3"><Image src='/images/icons/location_on.svg' width={24} height={24} alt='loc' /> {currentPropDetails?.address_search_text}, {currentPropDetails?.street_number}, {currentPropDetails?.state}, {currentPropDetails?.pin_code}</p>
                                        <p className="text-muted">{currentPropDetails?.property_description}.</p>
                                    </Col>
                                    <Col md={6}>
                                        <div className="venue-amenities">
                                            <h5 className="font-18 mb-4" style={{ fontFamily: 'Gilroy' }} >Venue amenities</h5>
                                            <Row>
                                                {/* {filteredAmenities?.map((a, idx) => ( */}
                                                {filteredAmenities.map((a, idx) => (
                                                    <Col xs={6} key={idx} className="mb-3">
                                                        <div className="amenity d-flex align-items-center gap-2">
                                                            <Image src={a.icon} width={20} height={20} alt={a.label} />
                                                            <span>{a.label}</span>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                            {/* <Button variant="link" className="read-more-btn-full mt-3">Show all 15 amenities <Image src="/images/icons/double-arrows.svg" className='img-fluid' alt='d-arrow' width={16} height={16} style={{ transform: 'rotate(-90deg)' }} /></Button> */}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <hr></hr>
                            <div onMouseEnter={(e) => { setActiveSec("Rooms") }} className="rooms-list py-4" id='Rooms' >
                                <Row>
                                    <Col md={4}>
                                        <h3 className='page-titles-2 font-24' > Rooms </h3>
                                        <p>{roomsCountForOption} Rooms</p>
                                    </Col>

                                    <Col md={8}>
                                        <Row className='mb-5' >
                                            <Col md={6} className='gap-2'>
                                                <div className='d-flex gap-0 '>
                                                    <div className='d-flex form-group flex-col w-50'>
                                                        <label className='text-black' > Check-in date</label>
                                                        <DatePicker
                                                            selected={searchFieldData.check_in_date}
                                                            onChange={(date) => { setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) }); setIsAutoCallChange(true) }}
                                                            selectsStart
                                                            minDate={new Date()}
                                                            startDate={new Date()}
                                                            className="form-control  custom-date-picker"
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText='dd/MM/yyyy'
                                                        />

                                                    </div>
                                                    <div className='d-flex form-group flex-col w-50'>
                                                        <label className='text-black' > Checkout date</label>
                                                        <DatePicker
                                                            selected={searchFieldData.check_out_date ? searchFieldData.check_out_date : searchFieldData.check_in_date}
                                                            onChange={(date) => { setSearchFieldData({ ...searchFieldData, check_out_date: formatYMD(date) }); setIsAutoCallChange(true) }}
                                                            selectsEnd
                                                            startDate={searchFieldData.check_in_date}
                                                            endDate={searchFieldData?.check_out_date ? searchFieldData?.check_out_date : new Date()}
                                                            minDate={new Date()}
                                                            className="form-control  custom-date-picker"
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText='dd/MM/yyyy'
                                                        />
                                                    </div>
                                                </div>
                                            </Col>


                                            <Col md={6} className='gap-1 '>
                                                <Row>
                                                    <Col md={6}>
                                                        <div className='form-group'>
                                                            <label className='text-black'>No. of Rooms & Guests</label>
                                                            <div
                                                                className="react_selectbox custom-dropdown"
                                                                onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                                                            >
                                                                <div className="selected-value">
                                                                    {`${rooms.length} room${rooms.length > 1 ? 's' : ''} for ${rooms.reduce((sum, room) => sum + room.adults, 0)} guest${rooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`}
                                                                </div>
                                                                {isRoomDropdownOpen && (
                                                                    <div className="room-dropdown-content">
                                                                        {rooms.map((room) => (
                                                                            <div key={room.id} className="room-section">
                                                                                <div className="d-flex justify-content-between align-items-center">
                                                                                    <div className="room-header">Room {room.id}</div>
                                                                                    {rooms.length > 1 && (
                                                                                        <button
                                                                                            className="delete-room-btn"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                deleteRoom(room.id);
                                                                                            }}
                                                                                        >

                                                                                            <Image src='./images/icons/delete_b.svg' width={20} height={20} alt="delete" />
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                                <div className="guest-counter">
                                                                                    <label>Adults</label>
                                                                                    <div className="counter-controls">
                                                                                        <button
                                                                                            className="counter-btn"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                handleAdultChange(room.id, -1);
                                                                                            }}
                                                                                        >
                                                                                            -
                                                                                        </button>
                                                                                        <span>{room.adults}</span>
                                                                                        <button
                                                                                            className="counter-btn"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                handleAdultChange(room.id, 1);
                                                                                            }}
                                                                                        >
                                                                                            +
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}

                                                                        <div className="d-flex align-items-center justify-between">
                                                                            <button
                                                                                className="add-room-btn"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    addRoom();
                                                                                }}
                                                                            >
                                                                                <Image src='./images/icons/Plusminus.svg' className='img-fluid' alt='plus' width={24} height={24} />   Add a room
                                                                            </button>
                                                                            <button
                                                                                className="done-btn"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setIsAutoCallChange(true)
                                                                                    setIsRoomDropdownOpen(false);
                                                                                    setSearchFieldData({
                                                                                        ...searchFieldData,
                                                                                        rooms: rooms.map(item => ({ adults: item.adults }))
                                                                                    })
                                                                                }}
                                                                            >
                                                                                Done
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col md={6}>
                                                        <div className='h-100 align-items-center d-flex pt-1'>

                                                            <label className='mb-0 mt-4 d-flex gap-2 align-items-center' >
                                                                <input type="checkbox" disabled={roomsCountForOption === 0} className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
                                                                Show room prices
                                                            </label>
                                                        </div>
                                                    </Col>
                                                </Row>

                                            </Col>

                                        </Row>

                                    </Col>
                                </Row>

                                {/* {bookingRoomsData?.[0]?.properties ? bookingRoomsData?.[0]?.properties?.[0]?.rooms?.map((r) => ( */}
                                {bookingRoomsData?.length > 0 ? (
                                    bookingRoomsData.map((r) => (
                                        <div key={r.room_uid} className="room-card border-bottom-custom mb-4 pb-4 ">
                                            <Row className="">

                                                <Col md={3} className="">
                                                    <div className="room-card-image position-relative">
                                                        <Image src={r?.cover_photo ? `${r?.cover_photo}` : "/images/icons/No-Image.svg"} alt={r.room_name} width={320} height={180} className="img-fluid" />
                                                        <div className="image-count-badge"><Image src='/images/icons/image_w.svg' width={16} height={16} alt='count' />
                                                            {/* {r.imagesCount} */}
                                                            {r.room_photos?.length}
                                                        </div>
                                                        {r.booked && <div className="overlay-text">Booked on your dates</div>}
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="room-card-body">
                                                        <div className='div-justify'>
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <h5 className="mb-1">{r.room_name}</h5>
                                                                <div className="room-action-icon"><Image onClick={marknoShowModal} src='./images/icons/calendor.svg' width={20} height={20} alt='cal' /></div>
                                                            </div>
                                                            <div className="room-meta d-flex gap-3 mb-2">
                                                                <span><Image src='/images/icons/person.svg' width={24} height={24} alt='person' /> Sleeps {r.max_guests}  &nbsp;&nbsp; |</span>
                                                                <span><Image src='/images/icons/single_bed.svg' width={24} height={24} alt='bed' /> {r.beds.length} Beds &nbsp;|</span>
                                                                <span>{r.room_size_sqft} sq ft</span>
                                                            </div>
                                                            <div className="room-amenities-list mb-2">

                                                                {r?.room_amenities?.join(' · ')}
                                                            </div>
                                                            <Link href="#" onClick={() => filterShow(r)} style={{ color: '#463527', }} className="room-details-link">Room Details</Link>
                                                        </div>

                                                        <div className="mt-2 flex item-center gap-2">
                                                            {r?.bedroom_preference === "Female" && <p className='female-preferred'>
                                                                Female PREFERRED
                                                            </p>}
                                                            {r?.bedroom_preference === "Male" && <span className='male-preferred'>
                                                                Male PREFERRED
                                                            </span>}
                                                            {r?.gender_lock && r?.room_type === "Twin-Sharing" &&
                                                                <><span className='status-tag male-booked'>
                                                                    Male Booked
                                                                </span>
                                                                    <span className='status-tag female-booked'>
                                                                        Female Booked
                                                                    </span>
                                                                </>}
                                                            {r?.available_beds?.length > 0 ? <span className="badge badge-grey">{r?.available_beds.length} BED LEFT!</span> : <span className="badge badge-grey">NO BED LEFT!</span>}

                                                            {/* {r.bedroom_preference==="Female" && <span className="badge badge-pink me-2">FEMALE PREFERRED</span>}
                                                        {r.booked && <span className="badge badge-grey">NO BED LEFT!</span>} */}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={3} className="text-end">

                                                    {!r.is_available ? (
                                                        <>
                                                            <div className="room-right-actions justify-between">
                                                                <p className="mb-2 small">This room is already<br /> booked for your<br /> selected dates.</p>
                                                                <Button variant="" className="edit-btn w-100 mb-2">Change Dates</Button>
                                                                <p className='mb-1'>Or</p>
                                                                <Button variant="" className="edit-btn w-100">Book Hotel <Image src='/images/icons/open_in_new.svg' width={16} height={16} alt='open' /></Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        showPrices ? (
                                                            <>
                                                                <div className="room-right-actions justify-between">
                                                                    <p className="price-tag mb-2">₹{r?.price_per_night}<small>4 nights • 2 guests<br /> <span>₹{Math.round(r?.price_per_night / 4)}</span> / night</small></p>
                                                                    {/* <Button variant="success" className="reserve-btn">Reserve</Button> */}
                                                                    <Link href='./ReserveBooking' onClick={() => {
                                                                        setItemLocalStorage("reserveRoom", JSON.stringify(bookingRoomsData?.[0]?.properties.map(prop => {
                                                                            const selectedRooms = prop.rooms.filter(
                                                                                selecedRoom => selecedRoom.room_uid === r.room_uid
                                                                            );

                                                                            // only return prop if the selected room exists
                                                                            if (!selectedRooms.length) return null;

                                                                            return {
                                                                                ...prop,
                                                                                rooms: selectedRooms, adultCount: item.adults
                                                                            };
                                                                        }).filter(Boolean))); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData))
                                                                    }} className="reserve-btn">Reserve</Link>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="room-right-actions justify-center">
                                                                    <Button onClick={reserveroom} variant="success" className="reserve-btn">Reserve</Button>
                                                                </div>
                                                            </>
                                                        )
                                                    )}

                                                </Col>
                                            </Row>


                                        </div>
                                    ))) :
                                    <div className='bg-white p-3 flex item-center justify-center'>
                                        <span className=''>No rooms avilable for selected dates</span>
                                    </div>
                                }
                            </div>
                            <hr></hr>
                            <div onMouseEnter={(e) => { setActiveSec("Review") }} className='review-box py-4' id='Review'>
                                <h3 className='page-title-2 font-24 mb-4 d-flex gap-2 align-items-center' >
                                    <Image src="./images/icons/Star.svg" className='img-fluid' alt='star' width={24} height={24} />  5.0  ·
                                    reviews from 42 teams</h3>

                                <div className="testimonials-section ">

                                    <Row>
                                        {testimonials.map((t, idx) => (
                                            <Col md={6} key={idx} className="mb-4">
                                                <div className="testimonial-card p-4">
                                                    <p className="testimonial-quote">“{t.quote}”</p>
                                                    <div className="d-flex align-items-start justify-content-between flex-col">
                                                        <div className="d-flex testimonial-images" style={{ gap: '12px' }}>
                                                            {t.images && t.images.slice(0, 4).map((src, i,) => (
                                                                <Image key={i}
                                                                    // src={src} 
                                                                    src={`${src}`}
                                                                    width={88} height={88} alt={`t-${idx}-${i}`} />
                                                            ))}
                                                        </div>
                                                        <div className="ms-0 mt-2 text-end">
                                                            <div className="testimonial-author d-flex gap-1 align-items-center">  {t.author} <Image src="./images/icons/verified.svg" width={14} height={14} alt="verify" /> </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>

                                    <Button className='edit-btn ms-auto me-auto p-3 mb-4 mt-4 ' style={{ fontSize: '14px' }}>Show all reviews</Button>
                                </div>
                            </div>
                            <hr></hr>
                            <div onMouseEnter={(e) => { setActiveSec("Location") }} className='location-box py-4' id='Location' >
                                <Row>
                                    <Col md={12}>
                                        <div className="map-wrapper mb-3" style={{
                                            height: "calc(140vh - 150px)",
                                            // position: "sticky",
                                            top: "120px",
                                        }}>
                                            <div style={{
                                                height: "100%",
                                                width: "100%",
                                                borderRadius: "12px",
                                                overflow: "hidden",
                                            }}>
                                                {/* <PropertyMap properties={bookingRoomsData?.[0]?.properties} /> */}
                                                <DynamicMap
                                                    lat={currentPropDetails?.latitude}
                                                    lng={currentPropDetails?.longitude}
                                                    address={currentPropDetails?.address_search_text}
                                                />

                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                {/* <Image src='/images/icons/mapsample.jpg' alt="map" width={1200} height={320} className="img-fluid w-100" /> */}

                                {/* <p className="address mb-4">Flat No. 17, 17th Floor, near NRI apartments, Seawoods, Sector 58A, Navi Mumbai, Maharashtra, 400706</p> */}

                                <div className="getting-here-box p-4">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <div className="getting-here-title d-flex align-items-center gap-2 mb-3">
                                            <Image src='/images/icons/plane.png' width={22} height={22} alt="plane" />
                                            <h4 className="mb-0">Getting here</h4>
                                        </div>
                                        <p className="mb-1">21.54km from Goa Dabolim International Airport, approx. 34min by car.</p>
                                        <p className="mb-0">38km from Manohar International Airport (GOX), approx. 51min by car.</p>
                                    </div>
                                </div>


                            </div>
                            <hr></hr>
                            <div className="property-managers py-4 mb-4">
                                <p className=" mb-4">Property Manager & Emergency Contacts</p>
                                <Row className="g-4">
                                    {propertyManagers.length > 0 && propertyManagers?.map((manager, idx) => (
                                        <Col md={6} key={idx}>
                                            <div className="manager-card d-flex gap-3 align-items-start">
                                                <div className="manager-image">
                                                    <Image src={manager?.ops_manager_photo_url ? manager?.ops_manager_photo_url : "/images/icons/No-Image.svg"} width={120} height={120} alt={manager?.ops_manager_name} classops_manager_name="rounded-1" />
                                                </div>
                                                <div className="manager-info">
                                                    <h4 className="font-18 mb-1">{manager?.ops_manager_name}</h4>
                                                    <p className="text-muted mb-3">{manager?.role}</p>
                                                    <p className="mb-2 d-flex gap-2 align-items-center">
                                                        <Image src="/images/icons/call.svg" width={16} height={16} alt="phone" />
                                                        {manager?.ops_manager_phone}
                                                    </p>
                                                    <p className="mb-0 d-flex gap-2 align-items-center">
                                                        <Image src="/images/icons/email.svg" width={16} height={16} alt="email" />
                                                        {manager?.ops_manager_email}
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            <hr className='mt-4 mb-4' ></hr>
                            {/* <div onMouseEnter={(e) => { setActiveSec("Things-to-know") }} className='things-to-knbow-box py-4' id='Things-to-know' >

                                <h3 className='page-title-3 font-24 mb-4'> Things To Know </h3>
                                <div className='py-4'>

                                    <Row className='mt-4' >
                                        {thingstoknow.map((thingsto, idx) => (
                                            <React.Fragment key={idx}>
                                                <Col md={4} className='mb-5' >


                                                    <div className='things-data '>
                                                        <Image src={thingsto.icons} className='img-fluid mb-3' alt='things-img' width={24} height={24} />
                                                        <p className='mb-0' > <strong>{thingsto.text}</strong> </p>
                                                        <p className='mb-0' >{thingsto.text2} </p>
                                                    </div>

                                                </Col>
                                            </React.Fragment>
                                        ))}
                                    </Row>

                                </div>


                            </div> */}
                        </Col>
                    </Row>
                </Container>
            </div>





            <Modal show={marknoShowsModal} onHide={marknoShowClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >

                    <Modal.Title>
                        Room 3
                    </Modal.Title>

                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={marknoShowClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>

                    <p>Room Availability </p>


                    <div className="calendar-section ">
                        <div className="custom-calendar-wrapper">
                            {/* <DatePicker
                                selected={selectedDate}
                                onChange={date => setStartDate(date)}
                                inline
                                showMonthYearPicker={false}
                                monthsShown={1}
                                minDate={new Date("2025/08/01")}
                                maxDate={new Date("2025/08/31")}
                                showDisabledMonthNavigation
                                fixedHeight
                                dateFormat="MMMM yyyy"
                                defaultValue={new Date("2025/08/01")}
                                renderCustomHeader={({
                                    date,
                                    decreaseMonth,
                                    increaseMonth,
                                   
                                }) => (
                                    <div className="custom-header">
                                        <span className="month-year">
                                            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <div className="navigation-buttons">
                                           
                                            <button onClick={increaseMonth} >
                                                <Image src="/images/icons/right-a.svg" width={12} height={20} alt="Next" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                dayClassName={date => {
                                    if (date.getDate() >= 17 && date.getDate() <= 21) {
                                        return 'highlighted-date'
                                    }
                                    return 'normal-date'
                                }}
                            /> */}
                            <DatePicker
                                inline
                                selected={checkIn}
                                minDate={new Date()}     // 👈 sirf past disable

                                openToDate={checkIn || new Date()}

                                onChange={(date) => setSelectedDate(date)}

                                renderDayContents={(day, date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);

                                    const isPast = date < today;

                                    const isInRange =
                                        checkIn &&
                                        checkOut &&
                                        date >= checkIn &&
                                        date <= checkOut;

                                    return (
                                        <div
                                            style={{
                                                backgroundColor: isInRange ? "#ccc" : "transparent",
                                                color: isPast ? "#ccc" : isInRange ? "#fff" : "#000",
                                                pointerEvents: isPast ? "none" : "auto",
                                                borderRadius: "6px",
                                                width: "32px",
                                                height: "32px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {day}
                                        </div>
                                    );
                                }}
                            />



                        </div>
                    </div>







                </Modal.Body>







            </Modal>

            {/* room details */}
            {filtermShow && <Modal show={filtermShow && !!seletedRoomData} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
                <Modal.Header className='d-flex align-items-start justify-content-between border-bottom' >
                    <Modal.Title className='d-flex align-items-center gap-3'>
                        {/* {seletedRoomData?.[0]?.property_name} <br></br> {seletedRoomData?.[0]?.rooms?.[0]?.room_name} */}
                        {currentPropDetails?.property_name} <br></br> {seletedRoomData?.room_name}
                        {/* <h2 className='page-title'>{currentPropDetails?.property_name},{currentPropDetails?.address_search_text}</h2> */}
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className="room-details-modal">
                        <div className="room-image-gallery mb-4">
                            <Row>
                                <Col md={12}>
                                    {seletedRoomData?.[0]?.rooms?.[0]?.room_photos?.length > 0 ? <div className="main-image-container position-relative">
                                        <Image
                                            // src={seletedRoomData?.[0]?.rooms?.[0]?.room_photos[currentIndex]?.room_photo_url ? `https://alicedevapi.casamelhor.in${seletedRoomData?.[0]?.rooms?.[0]?.room_photos[currentIndex]?.room_photo_url}` : `/images/icons/No-Image.svg`}
                                            src={
                                                seletedRoomData.room_photos[currentIndex]?.room_photo_url
                                                    ? `${seletedRoomData.room_photos[currentIndex].room_photo_url}`
                                                    : "/images/icons/No-Image.svg"
                                            }
                                            alt="Room"
                                            width={1000}
                                            height={500}
                                            className="img-fluid w-100"
                                        />
                                        <div className="image-navigation">

                                            {/* PREVIOUS BUTTON */}
                                            <Button
                                                variant=""
                                                className="nav-btn prev"
                                                onClick={() => {
                                                    setCurrentIndex(prev =>
                                                        prev === 0
                                                            ? seletedRoomData.room_photos.length - 1
                                                            : prev - 1
                                                    );
                                                }}
                                            >
                                                <Image
                                                    src="/images/icons/left-a.svg"
                                                    width={12}
                                                    height={20}
                                                    alt="Previous"
                                                />
                                            </Button>

                                            {/* NEXT BUTTON */}
                                            <Button
                                                variant=""
                                                className="nav-btn next"
                                                disabled={seletedRoomData.room_photos.length <= 1}
                                                onClick={() => {
                                                    setCurrentIndex(prev =>
                                                        prev === seletedRoomData.room_photos.length - 1
                                                            ? 0
                                                            : prev + 1
                                                    );
                                                }}
                                            >
                                                <Image
                                                    src="/images/icons/right-a.svg"
                                                    width={12}
                                                    height={20}
                                                    alt="Next"
                                                />
                                            </Button>

                                        </div>
                                    </div> : <div className="main-image-container position-relative">
                                        <Image
                                            // src={seletedRoomData?.[0]?.rooms?.[0]?.cover_photo ? `https://alicedevapi.casamelhor.in${seletedRoomData?.[0]?.rooms?.[0]?.cover_photo}` : `/images/icons/No-Image.svg`}
                                            src={
                                                seletedRoomData?.cover_photo
                                                    ? `${seletedRoomData.cover_photo}`
                                                    : "/images/icons/No-Image.svg"
                                            }
                                            alt="Room"
                                            width={1000}
                                            height={500}
                                            className="img-fluid w-100"
                                        />
                                    </div>}
                                </Col>
                            </Row>
                        </div>

                        <div className="room-info mb-4">
                            <Row>
                                <Col md={12}>
                                    <div className="room-specs d-flex align-items-center gap-3 mb-3">
                                        <span className="spec-item"><Image src="./images/icons/person.svg" width={24} height={24} alt="bed" /> Sleeps {seletedRoomData?.max_guests}</span> |
                                        <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={24} height={24} alt="area" /> {seletedRoomData?.beds?.length} beds</span> |
                                        <span className="spec-item">{seletedRoomData?.room_size_sqft} sq ft</span>
                                    </div>
                                    <div className="booking-status d-flex gap-3 mb-3">
                                        {seletedRoomData?.[0]?.rooms?.[0]?.bedroom_preference_badge === "FEMALE PREFERRED" && <span className="status-tag female-booked">FEMALE BOOKED</span>}
                                        {seletedRoomData?.[0]?.rooms?.[0]?.room_type === "Twin-Sharing" && (seletedRoomData?.[0]?.rooms?.[0]?.available_beds?.length > 0 ? <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>
                                            {seletedRoomData?.[0]?.rooms?.[0]?.available_beds?.length} BED LEFT!</span> : <span className="badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>NO BED LEFT!</span>)}
                                    </div>
                                    <p className="room-description">
                                        {showFull ? seletedRoomData?.room_description : seletedRoomData?.room_description?.split(" ")?.slice(0, 10)?.join(" ") + "..."}
                                        {/* {showFull
                                            ? seletedRoomData?.room_description
                                            : seletedRoomData?.room_description?.split(" ").slice(0, 10).join(" ") + "..."
                                        } */}

                                    </p>
                                    <Button
                                        variant="link"
                                        className="read-more-btn-full mt-3"
                                        onClick={() => setShowFull(!showFull)}
                                    >
                                        {showFull ? "Hide full description" : "Read full description"}
                                        <Image
                                            src="./images/icons/double-arrows.svg"
                                            className="img-fluid ms-2"
                                            alt="d-arrow"
                                            width={16}
                                            height={16}
                                            style={{
                                                transform: showFull ? "rotate(90deg)" : "rotate(-90deg)",
                                                transition: "0.2s",
                                            }}
                                        />
                                    </Button>
                                </Col>

                            </Row>
                        </div>

                        <hr style={{ margin: '40px 0' }} ></hr>

                        <div className="room-amenities">
                            <h5 className="section-title mb-4 mt-3">Room amenities</h5>
                            <Row className="g-4">
                                {visibleAmenities
                                    .filter(item =>
                                        seletedRoomData?.room_amenities?.some(
                                            amenity =>
                                                amenity.toLowerCase().trim() === item.label.toLowerCase().trim()
                                        )
                                    )
                                    .map((item, index) => (
                                        <Col xs={6} key={index}>
                                            <div className="amenity-item d-flex align-items-center gap-2">
                                                <Image
                                                    src={item.icon}
                                                    width={24}
                                                    height={24}
                                                    alt={item.label}
                                                />
                                                <span>{item.label}</span>
                                            </div>
                                        </Col>
                                    ))
                                }
                            </Row>


                            <Button
                                variant="link"
                                className="read-more-btn-full mt-3"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll
                                    ? "Hide amenities"
                                    : `Show all ${amenities.length} amenities`}

                                <Image
                                    src="./images/icons/double-arrows.svg"
                                    className="img-fluid ms-2"
                                    alt='arrow'
                                    width={16}
                                    height={16}
                                    style={{
                                        transform: showAll ? "rotate(90deg)" : "rotate(-90deg)",
                                        transition: "0.2s",
                                    }}
                                />
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Link href='./ReserveBooking' onClick={() => { setItemLocalStorage("reserveRoom", JSON.stringify(seletedRoomData)); setItemLocalStorage("searchParam", JSON.stringify(responseSearchData)) }} variant="" className='search-btn complete-form-btn w-100 text-center' style={{ padding: '13px 25px', borderRadius: '0' }} >

                        Reserve

                    </Link>
                    {/* <Link href="./SingleRoomBr" variant="" className='search-btn complete-form-btn w-100 text-center' style={{ padding: '13px 25px', borderRadius: '0' }} >
                                    Reserve
                                </Link> */}
                </Modal.Footer>

            </Modal>}

        </>
    )
}