"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { Button, Image, Modal } from 'react-bootstrap'
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import ProtectedRoute from '../ProtectedRoute';
import { BookingRestrictionListAPI, companyListAPI, PropertyDetailApi, PropertyRoomListAPI, UserListAPI } from '@/services/provider';
import { getItemLocalStorage, removeItemLocalStorage } from '@/utils/browserStorage';
import { convertToTimestamp } from '@/utils/formatTime';
import { useSearchParams } from 'next/navigation';
import { checkPermission } from '@/utils/helper';

export default function AddNewListing() {

    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionProperty = checkPermission(permissionArray, "property");
    const permissionPhotos = checkPermission(permissionArray, "property_photo")
    const permissionPropertyAssign = checkPermission(permissionArray, "property_assignment");
    const permissionCompany = checkPermission(permissionArray, "company");
    const permissionRoom = checkPermission(permissionArray, "room");
    const permissionRoomPhoto = checkPermission(permissionArray, "room_photo");
    const permissionBookingRest = checkPermission(permissionArray, "booking_restriction");
    //restriction for booking
    const canAddBookingRest = permissionBookingRest === true || permissionBookingRest?.can_add;
    // const canDeleteBookingRest = permissionBookingRest === true || permissionBookingRest?.can_delete;
    //property permission
    const canAddProperty = permissionProperty === true || permissionProperty?.can_add;
    const canListProperty = permissionProperty === true || permissionProperty?.can_list;
    const canRetrieveProperty = permissionProperty === true || permissionProperty?.can_retrieve;
    const canUpdateProperty = permissionProperty === true || permissionProperty?.can_update;
    const canDeleteProperty = permissionProperty === true || permissionProperty?.can_delete;
    //property photos permission
    const canAddPhoto = permissionPhotos === true || permissionPhotos?.can_add;
    const canListPhoto = permissionPhotos === true || permissionPhotos?.can_list;
    const canRetrievePhoto = permissionPhotos === true || permissionPhotos?.can_retrieve;
    const canUpdatePhoto = permissionPhotos === true || permissionPhotos?.can_update;
    const canDeletePhoto = permissionPhotos === true || permissionPhotos?.can_delete;
    //can property assign
    const canListAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_list;
    const canAddAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_add;
    const canRetrieveAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_retrieve;
    const canUpdateAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_update;
    const canDeleteAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_delete;
    //can permision company details
    const canRetrieveCompany = permissionCompany === true || permissionCompany?.can_retrieve;
    //can permission room
    const canAddRoom = permissionRoom === true || permissionRoom?.can_add;
    const canListRoom = permissionRoom === true || permissionRoom?.can_list;
    const canRetrieveRoom = permissionRoom === true || permissionRoom?.can_retrieve;
    const canUpdateRoom = permissionRoom === true || permissionRoom?.can_update;
    const canDeleteRoom = permissionRoom === true || permissionRoom?.can_delete;
    //can permission on room photos
    //property photos permission
    const canAddRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_add;
    const canListRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_list;
    const canRetrieveRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_retrieve;
    const canUpdateRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_update;
    const canDeleteRoomPhoto = permissionRoomPhoto === true || permissionRoomPhoto?.can_delete;
    // const property = JSON.parse(getItemLocalStorage("properyItem"));
    // const [property, setProperty] = useState({ uid: '', edit: false })
    // const searchParams = useSearchParams();

    // useEffect(() => {
    //     const storage = JSON.parse(getItemLocalStorage("properyItem"));
    //     const stateParam = searchParams.get('state');
    //     if (stateParam) {
    //         const state = JSON.parse(decodeURIComponent(stateParam));
    //         setProperty({
    //             uid: state.id,
    //             edit: state?.edit
    //         })
    //     } else if (storage?.uid) {
    //         setProperty({
    //             uid: storage.uid
    //         })
    //     }
    // }, [searchParams]);
    const storage = JSON.parse(getItemLocalStorage("properyItem"));
    const [property, setProperty] = useState({ uid: '' })
    const searchParams = useSearchParams();

    useEffect(() => {
        const stateParam = searchParams.get('state');
        if (stateParam) {
            const state = JSON.parse(decodeURIComponent(stateParam));
            setProperty({
                uid: state.id
            })
        } else if (storage?.uid) {
            setProperty({
                uid: storage.uid
            })
        }
    }, [searchParams]);
    // const handleWizardStep = async () => {
    //     const wizard = new FormData();
    //     wizard.append("wizard_step_completed", activeStep)
    //     await WizardStepUpdateAPI(property?.uid, wizard)
    // }
    useEffect(() => {
        return () => {
            // handleWizardStep()
            removeItemLocalStorage('properyItem')
        };
    }, [])
    const [assignmentremoShow, assignmentremovesetShow] = useState(false);
    const assignmentRemoveClose = () => assignmentremovesetShow(false);
    const assignmentRemoveShow = () => assignmentremovesetShow(true);
    const [activeStep, setActiveStep] = useState(1);
    const [userList, setUserList] = useState({ properyManager: [], propertyCaretacer: [], bookingManager: [] });
    const [roomList, setRoomList] = useState([]);
    const [bookingRestrictionList, setBookingRestriction] = useState([]);
    const [CompanyListData, setCompanyListData] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [saveExit, setSaveExit] = useState(false);
    const [searchMgr,setSearchMgr] = useState('');
    const [searchCaretacker,setSearchCaretacker] = useState('');


    const steps = [
        { id: 1, label: "Basics", className: "Basic-list" },
        { id: 2, label: "Space", className: "space-list" },
        { id: 3, label: "Photos", className: "photos-list" },
        { id: 4, label: "Rooms and Pricings", className: "rooms-list" },
        { id: 5, label: "Property Assignment", className: "assignment-list" },
        { id: 6, label: "Booking Restrictions", className: "booking-list" },
        { id: 7, label: "Finish and Publish", className: "finish-list" },
    ];
    const roles = [
        `Caretaker Housekeeper,Caretaker Chef`,
        "CasaMelhor Property Manager",
        "CasaMelhor Booking Manager"
    ];

    const [step1Data, setStep1Data] = useState({
        propertyName: "",
        propertyAddress: "",
        // selected_Br:"",
        streetNumber: '4V8R+FCC, Off, Saki Vihar Rd, Tunga Village, Chandivali, Powai',
        flatNo: '--',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pinCode: '400072',
        addressHelp: '',
        operationsManagerName: '',
        operationsManagerEmail: '',
        operationsManagerPhone: '',
        operationsManagerAlternatePhone: '',
        person_image: null,
        lat: null,
        lng: null
    })
    const [showManual, setShowManual] = useState(false);
    const [step2Data, setStep2Data] = useState({
        guestCapacity: 0,
        brDescription: '',
        amenities: [],
        standoutAmenities: []
    })
    const [step3Data, setStep3Data] = useState({
        propertyPhotos: [],
        amenitiesPhotos: [] // This field will be ignored for validation
    })
    const [step4Data, setStep4Data] = useState([{
        room_name: '',
        room_type: '',
        room_size_sqft: '',
        beds: [{ type: null, name: '' }],
        bathrooms: 1,
        bedroom_preference: '',
        max_guests: 1,
        avg_base_price_per_night: '',
        room_description: '',
        room_amenities: [],
        roomPhotos: [],
        collapsed: false
    }])
    const [step5Data, setStep5Data] = useState();
    const [step7Data, setStep7Data] = useState({
        gst_number: '',
        pan_number: '',
        checkin_time: convertToTimestamp('02:00 PM'),
        checkout_time: convertToTimestamp('11:00 AM')
    });
    // const getCompanyList = async () => {
    //     try {
    //         const response = await companyListAPI("all");
    //         if (response?.data?.success) {
    //             const companyList = response.data.response?.filter(item => !item?.is_company_inactive)?.map(company => ({
    //                 value: company.uid,
    //                 label: company.company_name
    //             }));
    //             setCompanyListData(companyList);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const getCompanyList = async (pageNumber = 1, search = "") => {

        if (loading) return;

        try {

            setLoading(true);

            const response =
                await companyListAPI(search, pageNumber);

            if (response?.data?.success) {

                const companyList = response.data.response?.filter(item => !item?.is_company_inactive)?.map(company => ({
                    value: company.uid,
                    label: company.company_name
                }));                              

                setCompanyListData(prev =>
                    pageNumber === 1
                        ? companyList
                        : [...prev, ...companyList]
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
    const loadMoreCompany = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            getCompanyList(nextPage, searchKey);
        }
    }
    // const getUserList = async () => {
    //     try {
    //         const response = await UserListAPI("Company-Employee", "CasaMelhor Property Manager");
    //         if (response?.data?.success) {
    //             const caretakerList = response?.data?.response?.filter(item => item?.user_role?.role_name?.toLowerCase().includes("caretaker"));
    //             const propertyManagerList = response?.data?.response?.filter(item => item?.user_role?.role_name?.toLowerCase().includes("property manager"));
    //             const bookingManagerList = response?.data?.response?.filter(item => item?.user_role?.role_name?.toLowerCase().includes("booking manager"));
    //             setUserList({
    //                 propertyCaretacer: caretakerList,
    //                 properyManager: propertyManagerList,
    //                 bookingManager: bookingManagerList
    //             })
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const getUserList = async (roleName,search) => {
        try {
            const response = await UserListAPI("Company-Employee", roleName,search);

            if (response?.data?.success) {
                // const users = response?.data?.response || [];
                const users = (response?.data?.response || [])
                    ?.filter(user => user?.is_active !== false);

                setUserList((prev) => ({
                    ...prev,
                    [roleName === `Caretaker Housekeeper,Caretaker Chef` ? 'propertyCaretacer' : roleName === "CasaMelhor Property Manager" ? 'properyManager' : 'bookingManager']: users
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getRoomList = async (uid) => {
        if (!uid) {
            console.log("No UID passed to getRoomList");
            return;
        }

        try {
            console.log("Calling RoomList API with:", uid);

            const response = await PropertyRoomListAPI(uid);

            if (response?.data?.success) {
                setRoomList(response?.data?.response);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getBookingRestrictionList = async () => {
        try {
            const response = await BookingRestrictionListAPI(property?.uid);
            if (response?.data?.success) {
                setBookingRestriction(response?.data?.response)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getPropertyDetail = async () => {
        try {
            const response = await PropertyDetailApi(property?.uid);
            if (response?.data?.success) {
                setStep1Data({
                    // ...response?.data?.response?.staff_assignments,
                    propertyName: response?.data?.response?.property_name,
                    propertyAddress: response?.data?.response?.address_search_text,
                    streetNumber: response?.data?.response?.street_number,
                    flatNo: response?.data?.response?.flat_house_no,
                    city: response?.data?.response?.city,
                    state: response?.data?.response?.state,
                    country: response?.data?.response?.country,
                    pinCode: response?.data?.response?.pin_code,
                    addressHelp: response?.data?.response?.nearest_airport,
                    operationsManagerName: response?.data?.response?.ops_manager_name,
                    operationsManagerEmail: response?.data?.response?.ops_manager_email,
                    operationsManagerPhone: response?.data?.response?.ops_manager_phone,
                    operationsManagerAlternatePhone: response?.data?.response?.ops_manager_phone_alt,
                    // operationManagerPhoto:response?.data?.response?.ops_manager_photo_url,
                    contactImage: response?.data?.response?.ops_manager_photo_url,
                    property_caretakers: response?.data?.response?.staff_assignments?.property_caretakers,
                    property_managers: response?.data?.response?.staff_assignments?.property_managers,
                    lat: response?.data?.response?.latitude,
                    lng: response?.data?.response?.longitude
                })
                if (response?.data?.response?.street_number && response?.data?.response?.city && response?.data?.response?.state &&
                    response?.data?.response?.country && response?.data?.response?.pin_code
                ) {
                    setShowManual(true)
                }
                setStep2Data({
                    guestCapacity: response?.data?.response?.max_capacity ? response?.data?.response?.max_capacity : 1,
                    brDescription: response?.data?.response?.property_description,
                    amenities: response?.data?.response?.property_amenities,
                    standoutAmenities: response?.data?.response?.key_features
                })
                setActiveStep(response?.data?.response?.wizard_step_completed)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (property?.uid) {
            // getUserList();
            getRoomList(property?.uid);
            getPropertyDetail();
            // getCompanyList();
            getBookingRestrictionList();
        }
    }, [property?.uid])
    useEffect(() => {
        roles.forEach((role) => {
            getUserList(role,'');
        });
        getCompanyList(1, searchKey);
    }, []);
    useEffect(()=>{
        getUserList("CasaMelhor Property Manager",searchMgr)
    },[searchMgr])
    useEffect(()=>{
        getUserList("Caretaker Housekeeper,Caretaker Chef",searchCaretacker)
    },[searchCaretacker])

    useEffect(() => {
        if (activeStep === 6) getBookingRestrictionList();
    }, [activeStep])
    console.log(!property?.uid)


    useEffect(() => {
        if (activeStep === 6) {
            getRoomList(property.uid ? property?.uid : storage?.uid);
        }
    }, [activeStep]);

    return (
        <ProtectedRoute>

            <div className='Create-new-listing-section'>
                <div className='list-20  p-5'>
                    <div className='left-side-listing pt-5'>
                        <p className='text-white mb-3' style={{ fontSize: '28px', fontWeight: '700', fontStyle: 'italic' }}>Alice </p>

                        <ol className="alice-tabs">
                            {steps.map((step, index) => (
                                <li
                                    key={step.id}
                                    className={`${activeStep === step.id ? "active-tabs" : ""} ${activeStep > step.id ? "completed-tabs" : ""}`}
                                    // onClick={() => setActiveStep(step.id)}
                                    // style={{ cursor: "pointer" }}
                                    style={{ cursor: "default" }}
                                >
                                    {activeStep > step.id ? (
                                        <span className="check-icn me-2">
                                            <Image
                                                src="./images/icons/check.svg"
                                                className="img-fluid"
                                                alt="check"
                                                width={16}
                                                height={16}
                                            />
                                        </span>
                                    ) : (
                                        <span className={`number ${step.className} me-2`}>
                                            {index + 1}.
                                        </span>
                                    )}
                                    {step.label}
                                </li>
                            ))}
                        </ol>

                    </div>
                </div>
                <div className='list-80'>
                    {activeStep !== 7 && (
                        <div className='save-exit-btn border-bottom-custom p-4'>
                            <Button variant='' onClick={assignmentRemoveShow} className='ms-auto me-0 btn-company-add ' style={{ padding: '13px 25px' }} >Save & Exit</Button>
                        </div>
                    )}

                    <div
                        className="p-5 Basic-form step-1"
                        style={{ display: activeStep === 1 ? "block" : "none" }}
                    >
                        <Step1
                            step1Data={step1Data}
                            setStep1Data={setStep1Data}
                            propertyRole={userList}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            saveExit={saveExit}
                            setSaveExit={setSaveExit}
                            assignmentRemoveClose={assignmentRemoveClose}
                            showManual={showManual}
                            setShowManual={setShowManual}
                            draft={property}
                            setSearchMgr={setSearchMgr}
                            setSearchCaretacker={setSearchCaretacker}
                        />

                    </div>
                    <div
                        className="p-5 space-form step-2"
                        style={{ display: activeStep === 2 ? "block" : "none" }}
                    >
                        <Step2
                            step2Data={step2Data}
                            setStep2Data={setStep2Data}
                            propertyRole={userList}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            saveExit={saveExit}
                            setSaveExit={setSaveExit}
                            assignmentRemoveClose={assignmentRemoveClose}
                            draft={property}
                        />
                    </div>
                    {canAddPhoto && (
                        <div
                            className="p-5 photos-form step-3"
                            style={{ display: activeStep === 3 ? "block" : "none" }}
                        >
                            <Step3
                                step3Data={step3Data}
                                setStep3Data={setStep3Data}
                                propertyRole={userList}
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                saveExit={saveExit}
                                setSaveExit={setSaveExit}
                                assignmentRemoveClose={assignmentRemoveClose}
                                draft={property}
                            />
                        </div>
                    )}
                    {canAddRoom && (
                        <div
                            className="p-5 rooms-form step-4"
                            style={{ display: activeStep === 4 ? "block" : "none" }}
                        >
                            <Step4
                                step4Data={step4Data}
                                setStep4Data={setStep4Data}
                                propertyRole={userList}
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                saveExit={saveExit}
                                setSaveExit={setSaveExit}
                                assignmentRemoveClose={assignmentRemoveClose}
                                draft={property}
                            />
                        </div>
                    )}
                    {canAddAssignProperty && (
                        <div
                            className="p-5 assignment-form step-5"
                            style={{ display: activeStep === 5 ? "block" : "none" }}
                        >
                            <Step5
                                step5Data={step5Data}
                                setStep5Data={setStep5Data}
                                CompanyListData={CompanyListData}
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                saveExit={saveExit}
                                setSaveExit={setSaveExit}
                                assignmentRemoveClose={assignmentRemoveClose}
                                draft={property}
                                getRoomList={getRoomList}
                                propertyUid={property?.uid}
                                loadMoreCompany={loadMoreCompany}
                            />
                        </div>
                    )}
                    {canAddBookingRest && (
                        <div
                            className="p-5 booking-form step-6"
                            style={{ display: activeStep === 6 ? "block" : "none" }}
                        >
                            <Step6
                                propertyRole={userList}
                                roomList={roomList}
                                bookingRestrictionList={bookingRestrictionList}
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                saveExit={saveExit}
                                setSaveExit={setSaveExit}
                                assignmentRemoveClose={assignmentRemoveClose}
                                draft={property}
                                getRoomList={getRoomList}
                            />
                        </div>
                    )}
                    <div
                        className="p-5 finish-form step-7"
                        style={{ display: activeStep === 7 ? "block" : "none" }}
                    >
                        <Step7
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            draft={property}
                        />
                    </div>
                </div>
            </div>

            <Modal show={assignmentremoShow} onHide={assignmentRemoveClose} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between' >
                    <Image className='ms-auto me-0' src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={assignmentRemoveClose} />
                </Modal.Header>
                <Modal.Body className='pt-0' style={{ minHeight: '200px' }} >
                    <h2 className='page-title'>Save progress</h2>
                    <p style={{ color: '#73615F' }}>Want to register a new company? Please save your progress on the BR listing before exiting.</p>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" className='btn-company-add ' style={{ padding: '13px 25px' }} onClick={assignmentRemoveClose}>
                        Continue with BR Listing
                    </Button>
                    <Button variant="" className='complete-form-btn' style={{ padding: '14px 25px', borderRadius: '0' }} onClick={() => setSaveExit(true)}>
                        Save & Exit
                    </Button>
                </Modal.Footer>
            </Modal>

        </ProtectedRoute>
    )
}
