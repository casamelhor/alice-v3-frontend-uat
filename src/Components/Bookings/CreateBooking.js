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
import { useRouter } from 'next/navigation';
import { companyListAPI, getCompanyPropertiesCitiesAPI, PropertyListFullApi } from '@/services/provider';
import { alert_danger } from '@/utils/Alerts/TostifyAlerts';
import { ToastContainer } from 'react-toastify';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '@/utils/browserStorage';
import { changeToNextDate } from '@/utils/formatTime';

export default function CreateBooking() {
    const router = useRouter();
    const bacisSearchApiError = JSON.parse(getItemLocalStorage("bacisSearchApiError"));
    const [selectedRooms, setRooms] = useState([
        { id: 1, adults: 1 }
    ]);
    const [searchFieldData, setSearchFieldData] = useState(
        {
            company_id: 0,
            city: "",
            //   2025-12-20
            check_in_date: "",
            check_out_date: "",
            rooms: selectedRooms,
            availability: true,
            company_name: "",
            c_uid: ""
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
    const goToResult = () => {
        const updatedSearchFieldData = {
            ...searchFieldData,
            check_out_date:
                searchFieldData.check_out_date || changeToNextDate(searchFieldData.check_in_date)
        };
        setItemLocalStorage(
            "basicSecrchItemObj",
            JSON.stringify(updatedSearchFieldData)
        );

        setItemLocalStorage("searchForm", "Create");
        router.push("/Searchresult");
    };

    const formatYMD = (inputDate) => {
        const d = new Date(inputDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

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

    const [companyList, setCompanyList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

    const handleAdultChange = (roomId, change) => {
        setRooms(selectedRooms.map(room => {
            if (room.id === roomId) {
                const newValue = room.adults + change;
                return { ...room, adults: newValue >= 1 ? newValue : 1 };
            }
            return room;
        }));
    };

    const addRoom = () => {
        const newRoomId = selectedRooms.length + 1;
        setRooms([...selectedRooms, { id: newRoomId, adults: 1 }]);
    };

    const deleteRoom = (roomId) => {
        if (selectedRooms.length > 1) {
            setRooms(selectedRooms.filter(room => room.id !== roomId));
        }
    };

    // const getProprtyList = async () => {
    //     try {
    //         const response = await PropertyListFullApi("all");
    //         if (response?.data?.success) {
    //             //                 const uniqueCities = [
    //             //   ...new Set(response.data.response.map(ele => ele.city))
    //             // ].map(city => ({ city }));
    //             // const uniqueCities = [
    //             //     { city: "Jaipur" },
    //             //     ...Array.from(
    //             //         new Set(response.data.response.map(ele => ele.city)),
    //             //         city => ({ city })
    //             //     ).filter(item => item.city !== "Jaipur")
    //             // ];
    //             // setCityList(uniqueCities)
    //             setAllListCity(response.data.response)
    //         }

    //     } catch (error) {
    //         console.log("Company API Error: ", error);
    //     }
    // };
    const getLocationOfProperty = async (id) => {
        try {
            const response = await getCompanyPropertiesCitiesAPI(id);
            if (response?.success) {
                setCityList(response?.response?.cities.map(cv => ({ value: cv, label: cv })))
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getCompanyList = async () => {
        try {
            const response = await companyListAPI("all");
            if (response?.data?.success) {
                const list = response.data.response
                    .filter(item => item.is_company_inactive !== true)   //filter add for inactive remove
                    .map(item => ({
                        value: item.id,
                        label: item.company_name,
                        uid: item.uid
                    }));
                console.log(list)
                setCompanyList(list);
            }

        } catch (error) {
            console.log("Company API Error: ", error);
        }
    };

    useEffect(() => {
        getCompanyList();
        // getProprtyList();
    }, []);

    useEffect(() => {
        if (companyList.length === 1) {
            setSearchFieldData({ ...searchFieldData, company_id: companyList?.[0].value, company_name: companyList?.[0]?.label,c_uid:companyList?.[0]?.uid })
        }
    }, [companyList])

    useEffect(() => {
        if (searchFieldData.c_uid) {
            getLocationOfProperty(searchFieldData.c_uid)
        }
    }, [searchFieldData.c_uid])

    const showErrors = (errorObj) => {
        const extractMessages = (obj, parentKey = "") => {
            let messages = [];

            Object.entries(obj).forEach(([key, value]) => {
                const fieldName = parentKey ? `${parentKey}.${key}` : key;

                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        if (typeof item === "string") {
                            messages.push(`${fieldName}: ${item}`);
                        } else if (typeof item === "object" && item !== null) {
                            messages = messages.concat(extractMessages(item, fieldName));
                        }
                    });
                }
                else if (typeof value === "object" && value !== null) {
                    messages = messages.concat(extractMessages(value, fieldName));
                }
            });

            return messages;
        };

        const messages = extractMessages(errorObj);
        messages.forEach(msg => alert_danger(msg));
    };


    useEffect(() => {
        if (bacisSearchApiError === null && bacisSearchApiError === undefined) return
        if (bacisSearchApiError) {
            showErrors(bacisSearchApiError);
        }
        removeItemLocalStorage("bacisSearchApiError")
    }, [bacisSearchApiError]);


    return (
        <>
            <Header />
            <ToastContainer />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>
                                {/* <li><a href=''>Home</a></li> */}
                                <li><Link href='./Bookings'>Bookings</Link></li>
                                <li>Create Booking</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className='book-stay' style={{
                backgroundImage: "url('/images/icons/create-booking-banner.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} >
                <Container>
                    <h2 className='page-title-2 text-center text-white' >Book a stay</h2>

                    <div className='booking-filter mt-5'>
                        <Row className='gap-0' >
                            <Col onClick={() => { setIsRoomDropdownOpen(false) }} md={2} className='gap-1' >
                                <div className='form-group'>
                                    <label className='text-white' > Which company?</label>
                                    <Select
                                        name="aria-role-select"
                                        options={companyList}
                                        placeholder="Select company"
                                        className="react_selectbox"
                                        isSearchable={false}
                                        isDisabled={companyList.length > 1 ? false : true}
                                        value={companyList?.find(c => c.value === searchFieldData.company_id) || null}
                                        onChange={option => setSearchFieldData({ ...searchFieldData, company_id: option.value, company_name: option.label, c_uid: option.uid, city: "" })}
                                        styles={customStyles}
                                    />
                                </div>
                            </Col>



                            <Col onClick={() => { setIsRoomDropdownOpen(false) }} md={2} className='gap-1'>
                                <div className='form-group'>
                                    <label className='text-white' > Where to?</label>
                                    <Select
                                        name="aria-role-select"
                                        isDisabled={searchFieldData.company_name ? false : true}
                                        options={cityList}
                                        placeholder="Select city"
                                        className="react_selectbox"
                                        isSearchable={false}
                                        // getOptionLabel={(option) => option.city}
                                        // getOptionValue={(option) => option.city}
                                        value={cityList?.find(c => c.value === searchFieldData.city) || null}
                                        onChange={(option) =>
                                            setSearchFieldData({ ...searchFieldData, city: option.value })
                                        }
                                        styles={customStyles}
                                    />

                                </div>
                            </Col>

                            <Col onClick={() => { setIsRoomDropdownOpen(false) }} md={4} className='gap-2' >
                                <div className='d-flex gap-0 '>
                                    <div className='d-flex form-group flex-col w-50'>
                                        <label className='text-white' > Check-in date</label>
                                        <DatePicker
                                            selected={searchFieldData.check_in_date}
                                            onChange={(date) => { setSearchFieldData({ ...searchFieldData, check_in_date: formatYMD(date) }) }}
                                            selectsStart
                                            minDate={new Date()}
                                            startDate={new Date()}
                                            className="form-control  custom-date-picker"
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText='dd/MM/yyyy'
                                        />

                                    </div>
                                    <div className='d-flex form-group flex-col w-50'>
                                        <label className='text-white' > Checkout date</label>
                                        <DatePicker
                                            selected={searchFieldData.check_out_date ? searchFieldData.check_out_date : changeToNextDate(searchFieldData.check_in_date)}
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
                                            <label className='text-white'>No. of Rooms & Guests</label>
                                            <div
                                                className="react_selectbox custom-dropdown"
                                                onClick={() => {
                                                    setIsRoomDropdownOpen(!isRoomDropdownOpen); setSearchFieldData({
                                                        ...searchFieldData,
                                                        rooms: selectedRooms.map(item => ({ adults: item.adults }))
                                                    })
                                                }}
                                            >
                                                <div className="selected-value">
                                                    {`${selectedRooms.length} room${selectedRooms.length > 1 ? 's' : ''} for ${selectedRooms.reduce((sum, room) => sum + room.adults, 0)} guest${selectedRooms.reduce((sum, room) => sum + room.adults, 0) > 1 ? 's' : ''}`}
                                                </div>
                                                {isRoomDropdownOpen && (
                                                    <div className="room-dropdown-content">
                                                        {selectedRooms.map((room) => (
                                                            <div key={room.id} className="room-section">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="room-header">Room {room.id}</div>
                                                                    {selectedRooms.length > 1 && (
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
                                                                                setSearchFieldData({
                                                                                    ...searchFieldData,
                                                                                    rooms: selectedRooms.map(item => ({ adults: item.adults }))
                                                                                })
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
                                                                                setSearchFieldData({
                                                                                    ...searchFieldData,
                                                                                    rooms: selectedRooms.map(item => ({ adults: item.adults }))
                                                                                })
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
                                                                        rooms: selectedRooms.map(item => ({ adults: item.adults }))
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
                                            <Button onClick={goToResult} className="mt-4 search-btn" style={{  width: '100%', height: '48px', textAlign: 'center', borderRadius: '0', color: '#fff' }} variant='' >Search Stays</Button>
                                        </div>
                                    </Col>
                                </Row>

                            </Col>





                        </Row>
                    </div>
                </Container>

            </div>
        </>
    )
}