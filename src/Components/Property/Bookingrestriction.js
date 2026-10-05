"use client";
import { CreateBookingRestrictionAPI, DeleteBookingRestrictedAPI } from "@/services/provider";
import { alert_danger } from "@/utils/Alerts/TostifyAlerts";
import { getItemLocalStorage } from "@/utils/browserStorage";
import { checkPermission } from "@/utils/helper";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image } from "react-bootstrap";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";

export default function Bookingrestriction({ propertyRole, roomList, bookingRestrictionList, activeTab, getBookingRestrictionList }) {
    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionBookingRest = checkPermission(permissionArray, "booking_restriction");
    //restriction for booking
    const canUpdateBookingRest = permissionBookingRest === true || permissionBookingRest?.can_update;
    const canDeleteBookingRest = permissionBookingRest === true || permissionBookingRest?.can_delete;

    // const { id } = useParams();
    const [id, setId] = useState()
    const searchParams = useSearchParams();
    // useEffect(() => {
    //     const stateParam = searchParams.get('state');
    //     if (stateParam) {
    //         const state = JSON.parse(decodeURIComponent(stateParam));
    //         setId(state.id)
    //     }
    // }, [searchParams]);


    const uid = searchParams.get("uid");
    useEffect(() => {
        if (uid) {
            setId(uid);
        }
    }, [uid]);

    const [managers, setManagers] = useState([{ id: Date.now(), data: null }]);
    const [roomManagers, setRoomManagers] = useState({});
    const [showManagerList, setShowManagerList] = useState(null);
    const [isNotCallCreate, setIsNotCallCreate] = useState(null)

    const property = JSON.parse(getItemLocalStorage("properyItem") || "{}");

    // -------------------------
    // Initialize From API
    // -------------------------

    useEffect(() => {
        if (!roomList?.length) return;

        const initialRoomManagers = {};

        // -------------------------
        // PROPERTY LEVEL
        // -------------------------
        if (bookingRestrictionList?.length > 0) {
            const filterProperty = bookingRestrictionList.find(
                (val) => val.restriction_level === "Property-Level"
            );

            const propertyManagers =
                filterProperty?.property_restricted_users?.map((user) => ({
                    id: Date.now() + Math.random(),
                    data: {
                        uid: user.uid,
                        name: user.name,
                        email: user.email,
                        img: "/images/icons/user-default.svg",
                        phone: "Not available",
                        rest_uid: filterProperty.uid,
                    },
                })) || [{ id: Date.now(), data: null }];

            setManagers(propertyManagers);
        } else {
            // If no property restriction exists
            setManagers([{ id: Date.now(), data: null }]);
        }

        // -------------------------
        // ROOM LEVEL
        // -------------------------

        roomList.forEach((room) => {
            const roomRestriction = bookingRestrictionList?.find(
                (val) =>
                    val.restriction_level === "Room-Level" &&
                    val?.room_details?.uid === room.uid
            );

            const roomManagerData =
                roomRestriction?.room_restricted_users?.length > 0
                    ? roomRestriction.room_restricted_users.map((user) => ({
                        id: Date.now() + Math.random(),
                        data: {
                            uid: user.uid,
                            name: user.name,
                            email: user.email,
                            img: "/images/icons/user-default.svg",
                            phone: user.phone_number,
                            rest_uid: roomRestriction.uid,
                        },
                    }))
                    : [{ id: Date.now() + Math.random(), data: null }]; // 👈 default empty input

            initialRoomManagers[room.uid] = roomManagerData;
        });

        setRoomManagers(initialRoomManagers);
    }, [bookingRestrictionList, roomList]);


    // -------------------------
    // Property-level handlers
    // -------------------------
    const handleManagerSelect = (id, manager) => {
        setIsNotCallCreate(null)
        setManagers(prev =>
            prev.map(m => (m.id === id ? { ...m, data: manager } : m))
        );
        setShowManagerList(null);
    };

    const handleManagerRemove = async (res, managerId, userId) => {
        try {
            const payload = {
                delete_type: "user",
                user_uid: userId
            }
            const response = await DeleteBookingRestrictedAPI(res, payload);
            if (response?.data?.success) {
                if (managers.length > 0) {
                    setManagers(prev => prev.filter(m => m.id !== managerId));
                }
            } else {
                setManagers(prev => prev.filter(m => m.id !== managerId));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddManager = () => {
        setManagers(prev => [...prev, { id: Date.now(), data: null }]);
    };


    const handleRoomManagerSelect = (roomUid, managerId, manager) => {
        setIsNotCallCreate(null)
        setRoomManagers(prev => ({
            ...prev,
            [roomUid]: prev[roomUid]?.map(m =>
                m.id === managerId ? { ...m, data: manager } : m
            )
        }));
    };

    const handleRoomManagerRemove = async (rest_uid, managerId, userId, room_uid) => {
        try {
            const payload = {
                delete_type: "user",
                user_uid: userId
            }
            const response = await DeleteBookingRestrictedAPI(rest_uid, payload);
            if (response?.data?.success) {
                setRoomManagers(prev => ({
                    ...prev,
                    [room_uid]: prev[room_uid]?.filter(m => m.id !== managerId)
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // const handleAddRoomManager = (roomUid) => {
    //     setRoomManagers(prev => ({
    //         ...prev,
    //         [roomUid]: [...prev[roomUid], { id: Date.now(), data: null }]
    //     }));
    // };
    const handleAddRoomManager = (roomUid) => {
        setRoomManagers(prev => {
            const currentArray = prev[roomUid];

            // Ensure we're working with an array
            if (!Array.isArray(currentArray)) {
                return {
                    ...prev,
                    [roomUid]: [{ id: Date.now(), data: null }]
                };
            }

            return {
                ...prev,
                [roomUid]: [...currentArray, { id: Date.now(), data: null }]
            };
        });
    };


    const renderManagerInput = (managerItem, isRoomManager, res) => {
        const managerId = managerItem.id;
        const listKey = isRoomManager ? `${res?.uid}-${managerId}` : `br-${managerId}`;
        const isListVisible = showManagerList === listKey;

        if (!managerItem.data) {
            return (
                <>
                    {canUpdateBookingRest && (
                        <div className='d-flex justify-between align-items-center gap-2'>
                            <input
                                type="text"
                                className="form-control user-icn2"
                                placeholder="Add Booking manager"
                                onFocus={() => setShowManagerList(listKey)}
                                readOnly
                            />
                            {(isRoomManager ? roomManagers[res?.uid]?.length > 1 : managers.length > 1) && (
                                <Image
                                    src="/images/icons/delete_b.svg"
                                    className="img-fluid"
                                    alt="remove"
                                    width={24}
                                    height={24}
                                    // onClick={() => isRoomManager ? handleRoomManagerRemove(managerItem?.data?.rest_uid, managerId, managerItem?.data?.uid, res?.uid) : handleManagerRemove(managerItem?.data?.rest_uid, managerId)}
                                    onClick={() => {
                                        if (isRoomManager) {
                                            setRoomManagers(prev => ({
                                                ...prev,
                                                [res?.uid]: prev[res?.uid]?.filter(m => m.id !== managerId)
                                            }));
                                        } else {
                                            setManagers(prev => prev.filter(m => m.id !== managerId));
                                        }
                                    }}
                                    style={{ cursor: "pointer" }}
                                />
                            )}
                        </div>
                    )}

                    {isListVisible && (
                        <div
                            style={{
                                position: "absolute",
                                top: "58px",
                                left: 0,
                                right: 0,
                                background: "#f9f6f4",
                                border: "1px solid #6B4F3F",
                                borderRadius: "0px",
                                zIndex: 10,
                                padding: "16px",
                            }}
                        >
                            {propertyRole?.bookingManager.map((manager, idx) => (
                                <div
                                    className="managers-data"
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "18px",
                                        borderBottom: idx < propertyRole?.bookingManager?.length - 1 ? "1px solid #ececec" : "none",
                                        paddingBottom: "15px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => isRoomManager ?
                                        handleRoomManagerSelect(res?.uid, managerId, manager) :
                                        handleManagerSelect(managerId, manager)
                                    }
                                >
                                    <Image
                                        src={manager.user_role.role_icon ? manager.user_role.role_icon : '/images/icons/No-Image.svg'}
                                        alt={manager.name}
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "0px",
                                            objectFit: "cover",
                                            marginRight: "16px",
                                        }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                                            {manager.name}
                                        </div>
                                        <div style={{ fontSize: "14px", color: "#73615F" }}>
                                            {manager.email}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }

        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f9f6f4",
                    border: "1px solid rgb(128 99 75 / 24%)",
                    borderRadius: "0px",
                    padding: "12px 16px",
                    marginBottom: "8px",
                    marginTop: "15px",
                }}
            >
                <Image
                    // src={managerItem.data.img ? `https://alicedevapi.casamelhor.in${managerItem.data.img}` : '/images/icons/manager-img.jpg'}
                    // src='/images/icons/manager-img.jpg'
                    // src={
                    //     managerItem.data.profile_image
                    //         ? `${BASE_URL}${managerItem.data.profile_image}`
                    //         : "/images/icons/No-Image.svg"
                    // }

                    src={
                        managerItem.data.profile_image
                            ? managerItem.data.profile_image.startsWith("http")
                                ? managerItem.data.profile_image
                                : `${managerItem.data.profile_image}`
                            : "/images/icons/No-Image.svg"
                    }
                    alt={managerItem.data.name}
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "0px",
                        objectFit: "cover",
                        marginRight: "16px",
                    }}
                />
                <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                        {managerItem.data.name} {managerItem.data.first_name} {managerItem.data.last_name}
                    </span>
                    <span style={{ color: "#73615F" }}>|</span>
                    <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                        <Image src="/images/icons/call.svg" alt="call" width={18} height={18} />&nbsp;
                        {managerItem.data.phone} {managerItem.data.phone_number}
                    </span>
                    <span style={{ color: "#73615F" }}>|</span>
                    <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                        <Image src="/images/icons/email.svg" alt="email" width={18} height={18} /> &nbsp;
                        {managerItem.data.email}
                    </span>
                </div>
                {canDeleteBookingRest && (
                    <button
                        type="button"
                        className='ms-auto me-0'
                        onClick={() => isRoomManager ? handleRoomManagerRemove(managerItem?.data?.rest_uid, managerId, managerItem?.data?.uid, res?.uid) : handleManagerRemove(managerItem?.data?.rest_uid, managerId, managerItem?.data?.uid)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#6B4F3F",
                            fontSize: "20px",
                            marginLeft: "12px",
                            cursor: "pointer",
                        }}
                        title="Remove"
                    >
                        <Image src="/images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                    </button>
                )}
            </div>
        );
    };

    // -------------------------
    // Submit Handler
    // -------------------------
    const handleContinue = async (level) => {
        try {
            const propertyRestrictedUserIds = managers
                .filter(manager => manager.data !== null)
                .map(manager => manager.data.uid);


            const restrictedRooms = Object.keys(roomManagers).map(roomUid => {
                const roomManagerIds = roomManagers[roomUid]
                    .filter(manager => manager.data !== null)
                    .map(manager => manager.data.uid);

                return {
                    room: roomUid,
                    restricted_user_ids: roomManagerIds
                };
            }).filter(room => room.restricted_user_ids.length > 0);

            const payload = {
                restricted_property: id,
                // restriction_level: propertyRestrictedUserIds.length > 0 ? 'Property-Level' : 'Room-Level',
                restriction_level: level,
                property_restricted_user_ids: propertyRestrictedUserIds,
                restricted_rooms: restrictedRooms
            };

            console.log('Booking Restriction Payload:', payload);
            let response
            if ((level == "Property-Level" && propertyRestrictedUserIds.length) || (level == "Room-Level" && restrictedRooms.length)) {
                response = await CreateBookingRestrictionAPI(payload);
            }

            // const response = await CreateBookingRestrictionAPI(payload);

            if (response?.data?.success) {
                setIsNotCallCreate("notUpdate")
                getBookingRestrictionList();
                // setActiveStep(activeStep + 1);
            } else {
                console.error('API Error:', response?.data);
                // const dynamicKey = Object.keys(response.data.response)[0];
                // const message = response.data.response[dynamicKey].join('\n');

                // alert(`${dynamicKey}:\n${message}`);
                // alert_danger(message)

            }
        } catch (error) {
            console.error('Error creating booking restrictions:', error);
        }
    };

    useEffect(() => {
        if (activeTab === "booking-restrictions" && !isNotCallCreate) handleContinue('Property-Level')
    }, [managers])
    useEffect(() => {
        if (activeTab === "booking-restrictions" && !isNotCallCreate) handleContinue('Room-Level')
    }, [roomManagers])
    // -------------------------
    // JSX
    // -------------------------
    console.log(managers, roomManagers)
    return (
        <div className='container'>
            <ToastContainer />

            <Row>
                <Col md={7}>
                    <div className='box-input'>
                        <div className="property-list-2 mb-5">
                            <div className='d-flex justify-content-between align-items-center'>
                                <h2 className='font-24 mb-0'>
                                    Booking by Residences
                                </h2>
                                {!managers.length && (
                                    <div className='d-flex gap-2 align-items-center'>
                                        <span>Manage</span>
                                        <Image
                                            src="/images/icons/add_circle.svg"
                                            className="img-fluid mb-0"
                                            alt="add"
                                            width={44}
                                            height={44}
                                            onClick={handleAddManager}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                )}
                                {/* <div className='d-flex gap-2 align-items-center'>
                                    <span>Manage</span>
                                    <Image
                                        src="/images/icons/add_circle.svg"
                                        className="img-fluid mb-0"
                                        alt="add"
                                        width={44}
                                        height={44}
                                        onClick={handleAddManager}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div> */}
                            </div>

                            <div className='rooms-details'>
                                {/* {managers.map((managerItem) => (
                                    <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
                                        {renderManagerInput(managerItem)}
                                    </div>
                                ))} */}
                                {managers.map((managerItem) => (
                                    <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
                                        {renderManagerInput(managerItem, false, '')}
                                    </div>
                                ))}

                                <hr style={{ margin: "20px 0" }} />
                            </div>
                        </div>

                        <div className="property-list-2">

                            {roomList?.length > 0 && roomList.map((item, index) => (
                                <>
                                    <div className='rooms-details mb-5'>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h3 className='font-24  mb-0'>
                                                Booking by {item?.room_name}
                                            </h3>
                                            {canUpdateBookingRest && (
                                                <div className='d-flex align-items-center gap-2'>
                                                    <span>  Manage</span>
                                                    <Image
                                                        src="/images/icons/add_circle.svg"
                                                        className="img-fluid "
                                                        alt="add"
                                                        width={44}
                                                        height={44}
                                                        onClick={() => handleAddRoomManager(item.uid)}
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* {roomManagers[item.uid]?.map((managerItem) => (
                                            <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
                                                {renderManagerInput(managerItem, true, item.uid)}
                                            </div>
                                        ))} */}

                                        {roomManagers[item?.uid]?.map((managerItem) => (
                                            <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
                                                {renderManagerInput(managerItem, true, item)}
                                            </div>
                                        ))}

                                        {index < roomList.length - 1 && <hr style={{ margin: "50px 0" }} />}
                                    </div>
                                </>
                            ))}
                        </div>
                        <div className='d-flex mt-5'>
                            {/* <Button variant="" className='btn-white-transparent d-flex gap-2 me-3' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={() => setActiveStep(activeStep - 1)}>
                                <Image src="./images/icons/double-arrows.svg" className='img-fluid' alt='arrow' /> Back
                            </Button> */}
                            <Button variant="success" className='complete-form-btn' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={() => toast.success("Success!")}>
                                Continue
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
