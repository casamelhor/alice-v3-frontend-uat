// "use client"
// import { CreateBookingRestrictionAPI, DeleteBookingRestrictedAPI, WizardStepUpdateAPI } from '@/services/provider';
// import { getItemLocalStorage } from '@/utils/browserStorage';
// import { useRouter } from 'next/navigation';
// import React from 'react'
// import { useEffect, useState } from "react";
// import { Button, Col, Row, Image } from 'react-bootstrap'
// // import { ToastContainer } from 'react-toastify';

// export default function Step6({ propertyRole, roomList, bookingRestrictionList, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, draft, getRoomList }) {
//     const router = useRouter();

//     const [managers, setManagers] = useState([{ id: Date.now(), data: null }]);
//     const [showManagerList, setShowManagerList] = useState(null);

//     const [roomManagers, setRoomManagers] = useState({});
//     const [property, setProperty] = useState({});

//     useEffect(() => {
//         try {
//             const propertyItem = getItemLocalStorage("properyItem");
//             if (propertyItem) {
//                 setProperty(JSON.parse(propertyItem));
//             } else if (draft?.uid) {
//                 setProperty(draft)
//             }
//         } catch (error) {
//             console.error("Error loading property data:", error);
//         }
//     }, [activeStep]);

//     // useEffect(() => {
//     //     if (roomList?.length > 0) {
//     //         const initialRoomManagers = {};
//     //         roomList.forEach(room => {
//     //             initialRoomManagers[room.uid] = [{ id: Date.now(), data: null }];
//     //         });
//     //         setRoomManagers(initialRoomManagers);
//     //     }
//     // }, [roomList]);
//     useEffect(() => {
//         if (bookingRestrictionList?.length > 0) {
//             const filterProperty = bookingRestrictionList.find((val) => val.restriction_level == "Property-Level")
//             const propertyManagers = filterProperty?.property_restricted_users?.map(user => ({
//                 id: Date.now() + Math.random(),
//                 data: {
//                     uid: user.uid,
//                     name: user.name,
//                     email: user.email,
//                     img: "/images/icons/user-default.svg",
//                     phone: "Not available",
//                     rest_uid: filterProperty.uid
//                 }
//             })) || [{ id: Date.now(), data: null }];

//             if (propertyManagers.length > 0) {
//                 setManagers(propertyManagers);
//             }


//             const initialRoomManagers = {};
//             const filterRoomList = bookingRestrictionList.filter((val) => val.restriction_level == "Room-Level")
//             filterRoomList.forEach(room => {
//                 const roomManagerData = room.room_restricted_users?.map(user => ({
//                     id: Date.now() + Math.random(),
//                     data: {
//                         uid: user.uid,
//                         name: user.name,
//                         email: user.email,
//                         img: "/images/icons/user-default.svg",
//                         phone: user.phone_number,
//                         rest_uid: room.uid
//                     }
//                 })) || [{ id: Date.now(), data: null }];

//                 initialRoomManagers[room?.room_details?.uid] = roomManagerData;
//             });
//             setRoomManagers(initialRoomManagers);
//         }
//     }, [bookingRestrictionList]);


//     const handleManagerSelect = (id, manager) => {
//         setManagers(prev =>
//             prev.map(m => (m.id === id ? { ...m, data: manager } : m))
//         );
//         setShowManagerList(null);
//     };

//     const handleManagerRemove = async (res, managerId, userId) => {
//         try {
//             const payload = {
//                 delete_type: "user",
//                 user_uid: userId
//             }
//             const response = await DeleteBookingRestrictedAPI(res, payload);
//             if (response?.data?.success) {
//                 if (managers.length > 0) {
//                     setManagers(prev => prev.filter(m => m.id !== managerId));
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleAddManager = () => {
//         setManagers(prev => [...prev, { id: Date.now(), data: null }]);
//     };


//     const handleRoomManagerSelect = (roomUid, managerId, manager) => {
//         setRoomManagers(prev => ({
//             ...prev,
//             [roomUid]: prev[roomUid]?.map(m =>
//                 m.id === managerId ? { ...m, data: manager } : m
//             )
//         }));
//     };

//     const handleRoomManagerRemove = async (rest_uid, managerId, userId, room_uid) => {
//         try {
//             const payload = {
//                 delete_type: "user",
//                 user_uid: userId
//             }
//             const response = await DeleteBookingRestrictedAPI(rest_uid, payload);
//             if (response?.data?.success) {
//                 setRoomManagers(prev => ({
//                     ...prev,
//                     [room_uid]: prev[room_uid]?.filter(m => m.id !== managerId)
//                 }));
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // const handleAddRoomManager = (roomUid) => {
//     //     setRoomManagers(prev => ({
//     //         ...prev,
//     //         [roomUid]: [...prev[roomUid], { id: Date.now(), data: null }]
//     //     }));
//     // };
//     const handleAddRoomManager = (roomUid) => {
//         setRoomManagers(prev => {
//             const currentArray = prev[roomUid];

//             // Ensure we're working with an array
//             if (!Array.isArray(currentArray)) {
//                 return {
//                     ...prev,
//                     [roomUid]: [{ id: Date.now(), data: null }]
//                 };
//             }

//             return {
//                 ...prev,
//                 [roomUid]: [...currentArray, { id: Date.now(), data: null }]
//             };
//         });
//     };

//     const toggleRoomManagerList = (roomUid, managerId) => {
//         setShowManagerList(showManagerList === `${roomUid}-${managerId}` ? null : `${roomUid}-${managerId}`);
//     };

//     const toggleManagerList = (managerId) => {
//         setShowManagerList(showManagerList === `br-${managerId}` ? null : `br-${managerId}`);
//     };


//     // default room with filed 

//     useEffect(() => {
//         if (!roomList?.length) return;

//         setRoomManagers(prev => {
//             const updated = { ...prev };

//             roomList.forEach(room => {
//                 // check if restriction exists for this room
//                 const restriction = bookingRestrictionList?.find(
//                     r =>
//                         r.restriction_level === "Room-Level" &&
//                         r?.room_details?.uid === room.uid
//                 );

//                 if (restriction?.room_restricted_users?.length > 0) {
//                     // Prefill from API
//                     updated[room.uid] = restriction.room_restricted_users.map(user => ({
//                         id: Date.now() + Math.random(),
//                         data: {
//                             uid: user.uid,
//                             name: user.name,
//                             email: user.email,
//                             img: "/images/icons/user-default.svg",
//                             phone: user.phone_number,
//                             rest_uid: restriction.uid
//                         }
//                     }));
//                 } else {
//                     // 👇 DEFAULT INPUT (THIS WAS MISSING)
//                     updated[room.uid] = [{ id: Date.now() + Math.random(), data: null }];
//                 }
//             });

//             return updated;
//         });
//     }, [roomList, bookingRestrictionList]);


//     useEffect(() => {
//         if (activeStep === 6 && draft?.uid) {
//             getRoomList(draft.uid);
//         }
//     }, [activeStep]);



//     const renderManagerInput = (managerItem, isRoomManager, res) => {
//         const managerId = managerItem.id;
//         const listKey = isRoomManager ? `${res?.uid}-${managerId}` : `br-${managerId}`;
//         const isListVisible = showManagerList === listKey;
//         // debugger

//         if (!managerItem.data) {
//             return (
//                 <>
//                     <div className='d-flex justify-between align-items-center gap-2'>
//                         <input
//                             type="text"
//                             className="form-control user-icn2"
//                             placeholder="Add Booking manager"
//                             onFocus={() => setShowManagerList(listKey)}
//                             readOnly
//                         />
//                         {(isRoomManager ? roomManagers[res?.uid]?.length > 1 : managers.length > 1) && (
//                             <Image
//                                 src="./images/icons/delete_b.svg"
//                                 className="img-fluid"
//                                 alt="remove"
//                                 width={24}
//                                 height={24}
//                                 // onClick={() => isRoomManager ? handleRoomManagerRemove(managerItem?.data?.rest_uid, managerId, managerItem?.data?.uid, res?.uid) : handleManagerRemove(managerItem?.data?.rest_uid, managerId)}
//                                 onClick={() => {
//                                     if (isRoomManager) {
//                                         setRoomManagers(prev => ({
//                                             ...prev,
//                                             [res?.uid]: prev[res?.uid]?.filter(m => m.id !== managerId)
//                                         }));
//                                     } else {
//                                         setManagers(prev => prev.filter(m => m.id !== managerId));
//                                     }
//                                 }}
//                                 style={{ cursor: "pointer" }}
//                             />
//                         )}
//                     </div>

//                     {isListVisible && (
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 top: "58px",
//                                 left: 0,
//                                 right: 0,
//                                 background: "#f9f6f4",
//                                 border: "1px solid #6B4F3F",
//                                 borderRadius: "0px",
//                                 zIndex: 10,
//                                 padding: "16px",
//                             }}
//                         >
//                             {propertyRole?.bookingManager.map((manager, idx) => (
//                                 <div
//                                     className="managers-data"
//                                     key={idx}
//                                     style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         marginBottom: "18px",
//                                         borderBottom: idx < propertyRole?.bookingManager?.length - 1 ? "1px solid #ececec" : "none",
//                                         paddingBottom: "15px",
//                                         cursor: "pointer",
//                                     }}
//                                     onClick={() => isRoomManager ?
//                                         handleRoomManagerSelect(res?.uid, managerId, manager) :
//                                         handleManagerSelect(managerId, manager)
//                                     }
//                                 >
//                                     <Image
//                                         src={manager.profile_image ? manager.profile_image : '/images/icons/No-Image.svg'}
//                                         alt={manager.name}
//                                         style={{
//                                             width: "48px",
//                                             height: "48px",
//                                             borderRadius: "0px",
//                                             objectFit: "cover",
//                                             marginRight: "16px",
//                                         }}
//                                     />
//                                     <div>
//                                         <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                                             {manager.name}
//                                         </div>
//                                         <div style={{ fontSize: "14px", color: "#73615F" }}>
//                                             {manager.email}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </>
//             );
//         }



//         return (
//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "center",
//                     background: "#f9f6f4",
//                     border: "1px solid rgb(128 99 75 / 24%)",
//                     borderRadius: "0px",
//                     padding: "12px 16px",
//                     marginBottom: "8px",
//                     marginTop: "15px",
//                 }}
//             >
//                 <Image
//                     // src={managerItem.data.img ? `https://alicedevapi.casamelhor.in${managerItem.data.img}` : '/images/icons/manager-img.jpg'}
//                     src={managerItem.data.profile_image ? managerItem.data.profile_image : '/images/icons/No-Image.svg'}
//                     alt={managerItem.data.name}
//                     style={{
//                         width: "48px",
//                         height: "48px",
//                         borderRadius: "0px",
//                         objectFit: "cover",
//                         marginRight: "16px",
//                     }}
//                 />
//                 <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
//                     <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                         {managerItem.data.name} {managerItem.data.first_name} {managerItem.data.last_name}
//                     </span>
//                     <span style={{ color: "#73615F" }}>|</span>
//                     <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
//                         <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />&nbsp;
//                         {managerItem.data.phone} {managerItem.data.phone_number}
//                     </span>
//                     <span style={{ color: "#73615F" }}>|</span>
//                     <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
//                         <Image src="./images/icons/email.svg" alt="email" width={18} height={18} /> &nbsp;
//                         {managerItem.data.email}
//                     </span>
//                 </div>
//                 <button
//                     type="button"
//                     className='ms-auto me-0'
//                     onClick={() => isRoomManager ? handleRoomManagerRemove(managerItem?.data?.rest_uid, managerId, managerItem?.data?.uid, res?.uid) : handleManagerRemove(managerItem?.data?.rest_uid, managerId, managerItem?.data?.uid)}
//                     style={{
//                         background: "none",
//                         border: "none",
//                         color: "#6B4F3F",
//                         fontSize: "20px",
//                         marginLeft: "12px",
//                         cursor: "pointer",
//                     }}
//                     title="Remove"
//                 >
//                     <Image src="./images/icons/delete_b.svg" onClick={() => {
//                         if (isRoomManager) {
//                             setRoomManagers(prev => ({
//                                 ...prev,
//                                 [res?.uid]: prev[res?.uid]?.filter(m => m.id !== managerId)
//                             }));
//                         } else {
//                             setManagers(prev => prev.filter(m => m.id !== managerId));
//                         }
//                     }}
//                         style={{ cursor: "pointer" }} alt="delete" width={24} height={24} />
//                 </button>
//             </div>
//         );
//     };

//     const handleContinue = async (level) => {
//         try {
//             setSaveExit(false)
//             assignmentRemoveClose();
//             const propertyRestrictedUserIds = managers
//                 .filter(manager => manager.data !== null)
//                 .map(manager => manager.data.uid);


//             const restrictedRooms = Object.keys(roomManagers).map(roomUid => {
//                 const roomManagerIds = roomManagers[roomUid]
//                     .filter(manager => manager.data !== null)
//                     .map(manager => manager.data.uid);

//                 return {
//                     room: roomUid,
//                     restricted_user_ids: roomManagerIds
//                 };
//             }).filter(room => room.restricted_user_ids.length > 0);

//             const payload = {
//                 restricted_property: property?.uid,
//                 // restriction_level: propertyRestrictedUserIds.length > 0 ? 'Property-Level' : 'Room-Level',
//                 restriction_level: level,
//                 property_restricted_user_ids: propertyRestrictedUserIds,
//                 restricted_rooms: restrictedRooms
//             };

//             console.log('Booking Restriction Payload:', payload);
//             let response
//             if ((level == "Property-Level" && propertyRestrictedUserIds.length) || (level == "Room-Level" && restrictedRooms.length)) {
//                 response = await CreateBookingRestrictionAPI(payload);
//             }
//             // const response = await CreateBookingRestrictionAPI(payload);

//             if (response?.data?.success) {
//                 // setActiveStep(activeStep + 1);
//             } else {
//                 console.error('API Error:', response?.data);
//                 const dynamicKey = Object.keys(response.data.response)[0];
//                 const message = response.data.response[dynamicKey].join('\n');
//                 alert_danger(message)
//             }
//         } catch (error) {
//             console.error('Error creating booking restrictions:', error);
//         }
//     };
//     const handleExit = async () => {
//         const wizard = new FormData();
//         wizard.append("wizard_step_completed", activeStep)
//         await WizardStepUpdateAPI(property?.uid, wizard)
//         router.push("/PropertyListing")
//     }
//     useEffect(() => {
//         if (saveExit && activeStep == 6) {
//             handleExit()
//         }
//     }, [saveExit])
//     useEffect(() => {
//         handleContinue('Property-Level')
//     }, [managers])
//     useEffect(() => {
//         handleContinue('Room-Level')
//     }, [roomManagers])
//     // console.log('fetching room list', roomList,managers,roomManagers,bookingRestrictionList)
//     console.log(managers, roomManagers)
//     return (
//         <div className='container'>
//             {/* <ToastContainer /> */}
//             <Row>
//                 <Col md={8}>
//                     <div className='box-input'>
//                         <h3 className='page-title mb-4'>Add booking restrictions to the BR</h3>

//                         {/* Booking by Residences Section */}
//                         <div className="property-list-2">
//                             <div className='d-flex justify-content-between align-items-center'>
//                                 <p style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }}>
//                                     Booking by Residences
//                                 </p>
//                                 {/* {!managers.length && (
//                                     <Image
//                                         src="./images/icons/add_circle.svg"
//                                         className="img-fluid mb-0"
//                                         alt="add"
//                                         width={32}
//                                         height={32}
//                                         onClick={handleAddManager}
//                                         style={{ cursor: "pointer" }}
//                                     />
//                                 )} */}
//                             </div>
//                             <p>{`People who can book rooms in this BR in it's entirety.`}</p>
//                             <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}></p>
//                             <div className='rooms-details'>
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <p className="subheadline-2 mb-3">Booking manager details</p>
//                                     <Image
//                                         src="./images/icons/add_circle.svg"
//                                         className="img-fluid mb-0"
//                                         alt="add"
//                                         width={32}
//                                         height={32}
//                                         onClick={handleAddManager}
//                                         style={{ cursor: "pointer" }}
//                                     />

//                                 </div>

//                                 {managers.map((managerItem) => (
//                                     <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
//                                         {renderManagerInput(managerItem, false, '')}
//                                     </div>
//                                 ))}

//                                 <hr style={{ margin: "50px 0" }} />
//                             </div>
//                         </div>

//                         {/* Booking by Rooms Section */}
//                         <div className="property-list-2">
//                             <p style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }}>
//                                 Booking by Rooms
//                             </p>
//                             <p>{`People who can only book specific rooms in this BR in it's entirety`}.</p>
//                             <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}></p>

//                             {roomList?.length > 0 && roomList.map((item, index) => (
//                                 <div key={item.uid} className='rooms-details'>
//                                     <p style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }}>
//                                         {item?.room_name}
//                                     </p>
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <p className="subheadline-2 mb-3">Booking manager details</p>
//                                         <Image
//                                             src="./images/icons/add_circle.svg"
//                                             className="img-fluid mb-3"
//                                             alt="add"
//                                             width={32}
//                                             height={32}
//                                             onClick={() => handleAddRoomManager(item.uid)}
//                                             style={{ cursor: "pointer" }}
//                                         />
//                                     </div>

//                                     {/* {roomManagers[item?.uid]?.map((managerItem) => (
//                                         <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
//                                             {renderManagerInput(managerItem, true, item)}
//                                         </div>
//                                     ))} */}

//                                     {(roomManagers[item?.uid] || []).map((managerItem) => (
//                                         <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
//                                             {renderManagerInput(managerItem, true, item)}
//                                         </div>
//                                     ))}

//                                     {index < roomList.length - 1 && <hr style={{ margin: "50px 0" }} />}
//                                 </div>
//                             ))}
//                         </div>

//                         <div className='d-flex mt-5'>
//                             <Button variant="" className='btn-white-transparent d-flex gap-2 me-3' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={() => setActiveStep(activeStep - 1)}>
//                                 <Image src="./images/icons/double-arrows.svg" className='img-fluid' alt='arrow' /> Back
//                             </Button>
//                             <Button variant="success" className='complete-form-btn' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={() => setActiveStep(activeStep + 1)}>
//                                 Continue
//                             </Button>
//                         </div>
//                     </div>
//                 </Col>
//             </Row>
//         </div>
//     );
// }


"use client"
import { CreateBookingRestrictionAPI, DeleteBookingRestrictedAPI, WizardStepUpdateAPI } from '@/services/provider';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useEffect, useState, useRef } from "react";
import { Button, Col, Row, Image } from 'react-bootstrap'

export default function Step6({ propertyRole, roomList, bookingRestrictionList, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, draft, getRoomList }) {
    const router = useRouter();

    const [managers, setManagers] = useState([{ id: Date.now(), data: null }]);
    const [showManagerList, setShowManagerList] = useState(null);
    const [roomManagers, setRoomManagers] = useState({});
    const [property, setProperty] = useState({});

    // Refs to track whether changes are user-initiated (not from initialization)
    const isInitialized = useRef(false);
    const isRoomInitialized = useRef(false);

    useEffect(() => {
        try {
            const propertyItem = getItemLocalStorage("properyItem");
            if (propertyItem) {
                setProperty(JSON.parse(propertyItem));
            } else if (draft?.uid) {
                setProperty(draft);
            }
        } catch (error) {
            console.error("Error loading property data:", error);
        }
    }, [activeStep]);

    // Populate property-level managers from API data
    useEffect(() => {
        if (bookingRestrictionList?.length > 0) {
            isInitialized.current = false; // reset before setting

            const filterProperty = bookingRestrictionList.find((val) => val.restriction_level === "Property-Level");
            const propertyManagers = filterProperty?.property_restricted_users?.map(user => ({
                id: Date.now() + Math.random(),
                data: {
                    uid: user.uid,
                    name: user.name,
                    email: user.email,
                    profile_image: user.profile_image || null,
                    phone_number: user.phone_number,
                    rest_uid: filterProperty.uid
                }
            })) || [];

            setManagers(propertyManagers.length > 0 ? propertyManagers : [{ id: Date.now(), data: null }]);
        } else {
            isInitialized.current = false;
            setManagers([{ id: Date.now(), data: null }]);
        }
    }, [bookingRestrictionList]);

    // Populate room-level managers from API data + default empty slots
    useEffect(() => {
        if (!roomList?.length) return;

        isRoomInitialized.current = false; // reset before setting

        const updated = {};
        roomList.forEach(room => {
            const restriction = bookingRestrictionList?.find(
                r => r.restriction_level === "Room-Level" && r?.room_details?.uid === room.uid
            );

            if (restriction?.room_restricted_users?.length > 0) {
                updated[room.uid] = restriction.room_restricted_users.map(user => ({
                    id: Date.now() + Math.random(),
                    data: {
                        uid: user.uid,
                        name: user.name,
                        email: user.email,
                        profile_image: user.profile_image || null,
                        phone_number: user.phone_number,
                        rest_uid: restriction.uid
                    }
                }));
            } else {
                updated[room.uid] = [{ id: Date.now() + Math.random(), data: null }];
            }
        });

        setRoomManagers(updated);
    }, [roomList, bookingRestrictionList]);

    // Mark initialized after first render pass
    useEffect(() => {
        const timer = setTimeout(() => {
            isInitialized.current = true;
        }, 300);
        return () => clearTimeout(timer);
    }, [managers]);

    useEffect(() => {
        const timer = setTimeout(() => {
            isRoomInitialized.current = true;
        }, 300);
        return () => clearTimeout(timer);
    }, [roomManagers]);

    useEffect(() => {
        if (activeStep === 6 && draft?.uid) {
            getRoomList(draft.uid);
        }
    }, [activeStep]);

    // ─── Property-Level Save (only when user makes changes) ───────────────────
    useEffect(() => {
        if (!isInitialized.current) return;
        const hasData = managers.some(m => m.data !== null);
        if (hasData) {
            savePropertyLevel();
        }
    }, [managers]);

    // ─── Room-Level Save (only when user makes changes) ───────────────────────
    useEffect(() => {
        if (!isRoomInitialized.current) return;
        const hasData = Object.values(roomManagers).some(arr =>
            arr.some(m => m.data !== null)
        );
        if (hasData) {
            saveRoomLevel();
        }
    }, [roomManagers]);

    const savePropertyLevel = async () => {
        try {
            const propertyRestrictedUserIds = managers
                .filter(m => m.data !== null)
                .map(m => m.data.uid);

            if (!propertyRestrictedUserIds.length) return;

            const payload = {
                restricted_property: property?.uid,
                restriction_level: 'Property-Level',
                property_restricted_user_ids: propertyRestrictedUserIds,
                restricted_rooms: []
            };

            const response = await CreateBookingRestrictionAPI(payload);
            if (!response?.data?.success) {
                const dynamicKey = Object.keys(response.data.response)[0];
                const message = response.data.response[dynamicKey].join('\n');
                alert(message);
            }
        } catch (error) {
            console.error('Error saving property-level restrictions:', error);
        }
    };

    const saveRoomLevel = async () => {
        try {
            const restrictedRooms = Object.keys(roomManagers).map(roomUid => {
                const roomManagerIds = roomManagers[roomUid]
                    .filter(m => m.data !== null)
                    .map(m => m.data.uid);
                return { room: roomUid, restricted_user_ids: roomManagerIds };
            }).filter(r => r.restricted_user_ids.length > 0);

            if (!restrictedRooms.length) return;

            const payload = {
                restricted_property: property?.uid,
                restriction_level: 'Room-Level',
                property_restricted_user_ids: [],
                restricted_rooms: restrictedRooms
            };

            const response = await CreateBookingRestrictionAPI(payload);
            if (!response?.data?.success) {
                const dynamicKey = Object.keys(response.data.response)[0];
                const message = response.data.response[dynamicKey].join('\n');
                alert(message);
            }
        } catch (error) {
            console.error('Error saving room-level restrictions:', error);
        }
    };

    // ─── Property-Level Handlers ───────────────────────────────────────────────
    const handleManagerSelect = (id, manager) => {
        setManagers(prev =>
            prev.map(m => (m.id === id ? { ...m, data: manager } : m))
        );
        setShowManagerList(null);
    };

    const handleManagerRemove = async (rest_uid, managerId, userId) => {
        // Optimistically remove from UI first
        setManagers(prev => prev.filter(m => m.id !== managerId));

        if (rest_uid && userId) {
            try {
                const payload = { delete_type: "user", user_uid: userId };
                const response = await DeleteBookingRestrictedAPI(rest_uid, payload);
                if (!response?.data?.success) {
                    console.error('Delete failed, data may be out of sync');
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleAddManager = () => {
        setManagers(prev => [...prev, { id: Date.now(), data: null }]);
    };

    // ─── Room-Level Handlers ───────────────────────────────────────────────────
    const handleRoomManagerSelect = (roomUid, managerId, manager) => {
        setRoomManagers(prev => ({
            ...prev,
            [roomUid]: prev[roomUid]?.map(m =>
                m.id === managerId ? { ...m, data: manager } : m
            )
        }));
        setShowManagerList(null);
    };

    const handleRoomManagerRemove = async (rest_uid, managerId, userId, room_uid) => {
        // Optimistically remove from UI first
        setRoomManagers(prev => ({
            ...prev,
            [room_uid]: prev[room_uid]?.filter(m => m.id !== managerId)
        }));

        if (rest_uid && userId) {
            try {
                const payload = { delete_type: "user", user_uid: userId };
                const response = await DeleteBookingRestrictedAPI(rest_uid, payload);
                if (!response?.data?.success) {
                    console.error('Delete failed, data may be out of sync');
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleAddRoomManager = (roomUid) => {
        setRoomManagers(prev => {
            const currentArray = Array.isArray(prev[roomUid]) ? prev[roomUid] : [];
            return {
                ...prev,
                [roomUid]: [...currentArray, { id: Date.now(), data: null }]
            };
        });
    };

    const handleExit = async () => {
        const wizard = new FormData();
        wizard.append("wizard_step_completed", activeStep);
        await WizardStepUpdateAPI(property?.uid, wizard);
        router.push("/PropertyListing");
    };

    useEffect(() => {
        if (saveExit && activeStep === 6) {
            handleExit();
        }
    }, [saveExit]);

    // ─── Render ────────────────────────────────────────────────────────────────
    const renderManagerInput = (managerItem, isRoomManager, res) => {
        const managerId = managerItem.id;
        const listKey = isRoomManager ? `${res?.uid}-${managerId}` : `br-${managerId}`;
        const isListVisible = showManagerList === listKey;

        if (!managerItem.data) {
            const currentList = isRoomManager ? roomManagers[res?.uid] : managers;
            const showDelete = Array.isArray(currentList) && currentList.length > 1;

            return (
                <>
                    <div className='d-flex justify-between align-items-center gap-2'>
                        <input
                            type="text"
                            className="form-control user-icn2"
                            placeholder="Add Booking manager"
                            onFocus={() => setShowManagerList(listKey)}
                            readOnly
                        />
                        {showDelete && (
                            <Image
                                src="./images/icons/delete_b.svg"
                                className="img-fluid"
                                alt="remove"
                                width={24}
                                height={24}
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

                    {isListVisible && (
                        <div style={{
                            position: "absolute",
                            top: "58px",
                            left: 0,
                            right: 0,
                            background: "#f9f6f4",
                            border: "1px solid #6B4F3F",
                            borderRadius: "0px",
                            zIndex: 10,
                            padding: "16px",
                        }}>
                            {propertyRole?.bookingManager?.map((manager, idx) => (
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
                                    onClick={() =>
                                        isRoomManager
                                            ? handleRoomManagerSelect(res?.uid, managerId, manager)
                                            : handleManagerSelect(managerId, manager)
                                    }
                                >
                                    <Image
                                        src={manager.profile_image || '/images/icons/No-Image.svg'}
                                        alt={manager.name}
                                        style={{ width: "48px", height: "48px", borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>{manager.name}</div>
                                        <div style={{ fontSize: "14px", color: "#73615F" }}>{manager.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }

        // Selected manager card
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                background: "#f9f6f4",
                border: "1px solid rgb(128 99 75 / 24%)",
                borderRadius: "0px",
                padding: "12px 16px",
                marginBottom: "8px",
                marginTop: "15px",
            }}>
                <Image
                    src={managerItem.data.profile_image || '/images/icons/No-Image.svg'}
                    alt={managerItem.data.name || ''}
                    style={{ width: "48px", height: "48px", borderRadius: "0px", objectFit: "cover", marginRight: "16px" }}
                />
                <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '12px' }}>
                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
                        {managerItem.data.name} {managerItem.data.first_name} {managerItem.data.last_name}
                    </span>
                    <span style={{ color: "#73615F" }}>|</span>
                    <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                        <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />&nbsp;
                        {managerItem.data.phone_number || managerItem.data.phone}
                    </span>
                    <span style={{ color: "#73615F" }}>|</span>
                    <span style={{ display: "flex", color: "#463527", fontSize: "14px" }}>
                        <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />&nbsp;
                        {managerItem.data.email}
                    </span>
                </div>
                <button
                    type="button"
                    className='ms-auto me-0'
                    onClick={() =>
                        isRoomManager
                            ? handleRoomManagerRemove(managerItem?.data?.rest_uid, managerId, managerItem?.data?.uid, res?.uid)
                            : handleManagerRemove(managerItem?.data?.rest_uid, managerId, managerItem?.data?.uid)
                    }
                    style={{ background: "none", border: "none", color: "#6B4F3F", fontSize: "20px", marginLeft: "12px", cursor: "pointer" }}
                    title="Remove"
                >
                    <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
                </button>
            </div>
        );
    };

    return (
        <div className='container'>
            <Row>
                <Col md={8}>
                    <div className='box-input'>
                        <h3 className='page-title mb-4'>Add booking restrictions to the BR</h3>

                        {/* Booking by Residences */}
                        <div className="property-list-2">
                            <div className='d-flex justify-content-between align-items-center'>
                                <p style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }}>
                                    Booking by Residences
                                </p>
                            </div>
                            <p>{`People who can book rooms in this BR in it's entirety.`}</p>
                            <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}></p>
                            <div className='rooms-details'>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="subheadline-2 mb-3">Booking manager details</p>
                                    <Image
                                        src="./images/icons/add_circle.svg"
                                        className="img-fluid mb-0"
                                        alt="add"
                                        width={32}
                                        height={32}
                                        onClick={handleAddManager}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>

                                {managers.map((managerItem) => (
                                    <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
                                        {renderManagerInput(managerItem, false, '')}
                                    </div>
                                ))}

                                <hr style={{ margin: "50px 0" }} />
                            </div>
                        </div>

                        {/* Booking by Rooms */}
                        <div className="property-list-2">
                            <p style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }}>
                                Booking by Rooms
                            </p>
                            <p>{`People who can only book specific rooms in this BR in it's entirety`}.</p>
                            <p className="mt-4 mb-4" style={{ border: '1px solid #463527' }}></p>

                            {roomList?.length > 0 && roomList.map((item, index) => (
                                <div key={item.uid} className='rooms-details'>
                                    <p style={{ fontSize: '20px', fontWeight: '500', color: '#463527', marginBottom: 0, width: '100%' }}>
                                        {item?.room_name}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="subheadline-2 mb-3">Booking manager details</p>
                                        <Image
                                            src="./images/icons/add_circle.svg"
                                            className="img-fluid mb-3"
                                            alt="add"
                                            width={32}
                                            height={32}
                                            onClick={() => handleAddRoomManager(item.uid)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>

                                    {(roomManagers[item?.uid] || []).map((managerItem) => (
                                        <div key={managerItem.id} className="form-group mb-4" style={{ position: "relative" }}>
                                            {renderManagerInput(managerItem, true, item)}
                                        </div>
                                    ))}

                                    {index < roomList.length - 1 && <hr style={{ margin: "50px 0" }} />}
                                </div>
                            ))}
                        </div>

                        <div className='d-flex mt-5'>
                            <Button variant="" className='btn-white-transparent d-flex gap-2 me-3' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={() => setActiveStep(activeStep - 1)}>
                                <Image src="./images/icons/double-arrows.svg" className='img-fluid' alt='arrow' /> Back
                            </Button>
                            <Button variant="success" className='complete-form-btn' style={{ padding: '13px 35px', borderRadius: '0' }} onClick={() => setActiveStep(activeStep + 1)}>
                                Continue
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}