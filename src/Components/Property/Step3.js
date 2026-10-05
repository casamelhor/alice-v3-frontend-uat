"use client"
import { DeletePhotoAPI, PropertyPhotosListAPI, SetCoverPhotoAPI, SetOrderPhotoAPI, UploadPropertyPhotosAPI, WizardStepUpdateAPI } from '@/services/provider';
import { alert_danger, alert_success } from '@/utils/Alerts/TostifyAlerts';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image, Modal, Form } from 'react-bootstrap'
import toast from 'react-hot-toast';
// import { ToastContainer } from 'react-toastify';

export default function Step3({ step3Data, setStep3Data, propertyRole, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, draft }) {
    // const property = JSON.parse(getItemLocalStorage("properyItem"));
    const [errors, setErrors] = useState({});
    const [property, setProperty] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        try {
            const propertyItem = getItemLocalStorage("properyItem");
            if (propertyItem) {
                setProperty(JSON.parse(propertyItem));
            } else if (draft?.uid) {
                setProperty(draft)
            }
        } catch (error) {
            console.error("Error loading property data:", error);
        }
    }, [activeStep]);
    const router = useRouter();
    // const [isSubmitted, setIsSubmitted] = useState(false);

    // Validation function
    const validateForm = (fieldData) => {
        let newErrors = {};
        let isValid = true;

        // Property Photos validation - at least one photo required
        if (fieldData?.length === 0) {
            newErrors.propertyPhotos = 'At least one property photo is required';
            isValid = false;
        }

        return { newErrors, isValid }
    };

    // Property Photos functionality
    const [photos, setPhotos] = useState([]);
    const [coverPhoto, setCoverPhoto] = useState({})
    const [coverIndex, setCoverIndex] = useState(null);
    const [isCoverPhotoSet, setIsCoverPhotoSet] = useState(false);
    const [isCoverPhotoError, setIsCoverPhotoError] = useState("");

    const MAX_PHOTOS = 5;

    const handleFileChange1 = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Only allow max 5
        const newPhotos = selectedFiles
            .slice(0, MAX_PHOTOS - photos.length)
            .map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));

        // const updatedPhotos = [...photos, ...newPhotos];
        // setPhotos(updatedPhotos);
        const updatedPhotos = [...step3Data?.propertyPhotos, ...newPhotos]

        // Update form data
        setStep3Data(prev => ({
            ...prev,
            propertyPhotos: [...prev?.propertyPhotos, ...newPhotos]
        }));

        // Clear property photos error when photos are added
        if (errors.propertyPhotos && updatedPhotos.length > 0) {
            setErrors(prev => ({
                ...prev,
                propertyPhotos: ''
            }));
        }

        // If no cover set, pick first
        if (coverIndex === null && updatedPhotos.length > 0) {
            setCoverIndex(0);
        }
    };

    const removePhoto = async (index, id) => {
        // const updatedPhotos = photos.filter((_, i) => i !== index);
        // setPhotos(updatedPhotos);

        // // Update form data
        // const updateState = step3Data?.propertyPhotos?.filter((_, i) => i !== index)
        // setStep3Data(prev => ({
        //     ...prev,
        //     propertyPhotos: updateState
        // }));

        // // Reset cover photo if deleted
        // if (index === coverIndex) {
        //     setCoverIndex(updatedPhotos.length > 0 ? 0 : null);
        // }
        try {
            const response = await DeletePhotoAPI(id)
            if (response?.data?.success) {
                alert_success(response.data.response.message)
                getPropertyPhotosList();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const removePhotoModal = (index) => {
        // Update form data
        const updateState = step3Data?.propertyPhotos?.filter((_, i) => i !== index)
        setStep3Data(prev => ({
            ...prev,
            propertyPhotos: updateState
        }));
    }

    const makeCoverPhoto = async (index, id) => {
        setCoverIndex(index);
        try {
            const response = await SetCoverPhotoAPI(id);
            if (response?.data?.success) {
                alert_success(response.data.response.message)

                //  cover photo successfully set
                setIsCoverPhotoSet(true);
                setIsCoverPhotoError("")

                getPropertyPhotosList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Drag & drop for property photos
    const handleDrop1 = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const newPhotos = droppedFiles
            .slice(0, MAX_PHOTOS - photos.length)
            .map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));

        // const updatedPhotos = [...photos, ...newPhotos];
        // setPhotos(updatedPhotos);
        const updatedPhotos = [...step3Data?.propertyPhotos, ...newPhotos]

        // Update form data
        setStep3Data(prev => ({
            ...prev,
            propertyPhotos: [...prev?.propertyPhotos, ...newPhotos]
        }));

        // Clear property photos error when photos are added
        if (errors.propertyPhotos && updatedPhotos.length > 0) {
            setErrors(prev => ({
                ...prev,
                propertyPhotos: ''
            }));
        }

        // If no cover set, pick first
        if (coverIndex === null && updatedPhotos.length > 0) {
            setCoverIndex(0);
        }
    };

    const handleDragOver1 = (e) => e.preventDefault();

    // Amenities Photos functionality (NO VALIDATION)
    const [amenitiesFiles, setAmenitiesFiles] = useState([]);

    const handleFileChange2 = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Only allow max 5
        const newPhotos = selectedFiles
            .slice(0, MAX_PHOTOS - amenitiesFiles.length)
            .map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));

        // const updatedPhotos = [...photos, ...newPhotos];
        // setPhotos(updatedPhotos);
        const updatedPhotos = [...step3Data?.amenitiesPhotos, ...newPhotos]

        // Update form data
        setStep3Data(prev => ({
            ...prev,
            amenitiesPhotos: [...prev?.amenitiesPhotos, ...newPhotos]
        }));

        // If no cover set, pick first
        if (coverIndex === null && updatedPhotos.length > 0) {
            setCoverIndex(0);
        }
    };

    const handleDrop2 = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const newPhotos = droppedFiles
            .slice(0, MAX_PHOTOS - amenitiesFiles.length)
            .map((file) => ({
                file: file,
                preview: URL.createObjectURL(file),
            }));

        // const updatedPhotos = [...photos, ...newPhotos];
        // setPhotos(updatedPhotos);
        const updatedPhotos = [...step3Data?.amenitiesPhotos, ...newPhotos]

        // Update form data
        setStep3Data(prev => ({
            ...prev,
            amenitiesPhotos: [...prev?.amenitiesPhotos, ...newPhotos]
        }));

    };

    const handleDragOver2 = (e) => e.preventDefault();

    const removeAmenitiesFile = (index) => {
        const updatedFiles = amenitiesFiles.filter((_, i) => i !== index);
        setAmenitiesFiles(updatedFiles);

        // Update form data (no validation for this field)
        setStep3Data(prev => ({
            ...prev,
            amenitiesPhotos: updatedFiles
        }));
    };

    // Modal states
    const [changepicsModal1, changepisetShow1] = useState(false);
    const changepicClose1 = () => changepisetShow1(false);
    const changepicModal1 = () => changepisetShow1(true);

    const [changepicsModal2, changepisetShow2] = useState(false);
    const changepicClose2 = () => changepisetShow2(false);
    const changepicModal2 = () => changepisetShow2(true);

    const getPropertyPhotosList = async () => {
        try {
            const response = await PropertyPhotosListAPI(property?.uid);  // "c6e63e82-dbbf-41a8-a01a-d19baa9c5adc"
            if (response?.data?.success) {
                setPhotos(response?.data?.response?.property_photos?.filter((Val) => Val?.photo_type == "Property"));
                setAmenitiesFiles(response?.data?.response?.property_photos?.filter((Val) => Val?.photo_type == "Amenities"));
                setCoverPhoto(response?.data?.response?.property_photos?.find((val) => val?.is_property_cover_photo))
                const hasCoverPhoto = response?.data?.response?.property_photos?.some(photo => photo.is_property_cover_photo === true);
                setIsCoverPhotoSet(hasCoverPhoto)
                setIsCoverPhotoError('');
                // debugger
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPropertyPhotosList()
    }, [property.uid])

    const setOderPhotosMethod = async (oderArray) => {
        try {
            const payload = {
                photo_type: "property",
                display_order: oderArray
            }
            const response = await SetOrderPhotoAPI(JSON.stringify(payload))
            if (response?.data?.success) {

            }
        } catch (error) {
            console.log(error);
        }
    }
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (index) => {
        if (draggedIndex === null) return;

        const updatedItems = [...photos];
        const draggedItem = updatedItems[draggedIndex];

        // Remove the dragged item from its original position
        updatedItems.splice(draggedIndex, 1);
        // Insert it at the new position
        updatedItems.splice(index, 0, draggedItem);

        const oderFixed = updatedItems.map((val, index) => ({ uid: val?.uid, order: index }))
        setOderPhotosMethod(oderFixed)

        setPhotos(updatedItems);
        setDraggedIndex(null);
    };


    const handleDragStartAm = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOverAm = (event) => {
        event.preventDefault();
    };

    const handleDropAm = (index) => {
        if (draggedIndex === null) return;

        const updatedItems = [...amenitiesFiles];
        const draggedItem = updatedItems[draggedIndex];

        // Remove the dragged item from its original position
        updatedItems.splice(draggedIndex, 1);
        // Insert it at the new position
        updatedItems.splice(index, 0, draggedItem);

        const oderFixed = updatedItems.map((val, index) => ({ uid: val?.uid, order: index }))
        setOderPhotosMethod(oderFixed)

        setAmenitiesFiles(updatedItems);
        setDraggedIndex(null);
    };

    // Handle form submission
    // const handleUpload = async (flag) => {
    //     // e.preventDefault();
    //     setSaveExit(false)
    //     assignmentRemoveClose();

    //     //  BLOCK SUBMIT IF COVER NOT SET
    //     // if (!isCoverPhotoSet) {
    //     //     alert_danger("Please make a cover photo before submitting.");
    //     //     return;
    //     // }



    //     const { isValid, newErrors } = validateForm(step3Data?.propertyPhoto)
    //     setErrors(newErrors)
    //     if (isValid) {
    //         const fieldData = new FormData();
    //         fieldData.append("property", property?.uid)    // "c6e63e82-dbbf-41a8-a01a-d19baa9c5adc"
    //         if (step3Data?.propertyPhotos?.length) {
    //             step3Data?.propertyPhotos?.forEach((img, index) => {
    //                 fieldData.append(`property_photo_url[${index}]`, img.file)
    //             })
    //             fieldData.append("photo_type", "Property")
    //         }
    //         if (step3Data?.amenitiesPhotos?.length) {
    //             step3Data?.amenitiesPhotos?.forEach((img, index) => {
    //                 fieldData.append(`property_photo_url[${index}]`, img.file)
    //             })
    //             fieldData.append("photo_type", "Amenities")
    //         }

    //         const response = await UploadPropertyPhotosAPI(fieldData)
    //         if (response?.data?.success) {
    //             alert_success("Photo uploaded successfully!")
    //             setStep3Data({
    //                 propertyPhotos: [],
    //                 amenitiesPhotos: []
    //             })
    //             // if (flag == "exit") {
    //             //     const wizard = new FormData();
    //             //     wizard.append("wizard_step_completed", activeStep)
    //             //     await WizardStepUpdateAPI(property?.uid, wizard)
    //             //     router.push("/PropertyListing")
    //             // }
    //             getPropertyPhotosList();
    //             changepicClose1();
    //             changepicClose2();                
    //         }
    //     } else {
    //         // Scroll to first error
    //         const firstErrorField = Object.keys(errors)[0];
    //         const element = document.querySelector(`[name="${firstErrorField}"]`);
    //         if (element) {
    //             element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //         }
    //     }
    // };
    const handleUpload = async (flag) => {
        setSaveExit(false);
        assignmentRemoveClose();

        const { isValid, newErrors } = validateForm(step3Data?.propertyPhoto);
        setErrors(newErrors);

        if (isValid) {
            setIsUploading(true); // 👈 start loading
            try {
                const fieldData = new FormData();
                fieldData.append("property", property?.uid);

                if (step3Data?.propertyPhotos?.length) {
                    step3Data?.propertyPhotos?.forEach((img, index) => {
                        fieldData.append(`property_photo_url[${index}]`, img.file);
                    });
                    fieldData.append("photo_type", "Property");
                }
                if (step3Data?.amenitiesPhotos?.length) {
                    step3Data?.amenitiesPhotos?.forEach((img, index) => {
                        fieldData.append(`property_photo_url[${index}]`, img.file);
                    });
                    fieldData.append("photo_type", "Amenities");
                }

                const response = await UploadPropertyPhotosAPI(fieldData);
                // if (response?.data?.success) {
                //     alert_success("Photo uploaded successfully!");
                //     setStep3Data({ propertyPhotos: [], amenitiesPhotos: [] });
                //     getPropertyPhotosList();
                //     changepicClose1();
                //     changepicClose2();
                // }
                if (response?.data?.success) {
                    toast.success("Photo uploaded successfully!");
                    setStep3Data({ propertyPhotos: [], amenitiesPhotos: [] });
                    setErrors(prev => ({ ...prev, propertyPhotos: '' })); // 👈 clear error
                    getPropertyPhotosList();
                    changepicClose1();
                    changepicClose2();
                }
            } catch (error) {
                console.log(error);
                toast.error("Upload failed. Please try again.");
            } finally {
                setIsUploading(false); // 👈 stop loading always
            }
        }
    };
    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     //  cover photo not set
    //     if (!isCoverPhotoSet) {
    //         setIsCoverPhotoError("Please make a cover photo before submitting.")
    //         return;
    //     }


    //     if (photos.length) {
    //         setActiveStep(activeStep + 1)
    //     }
    // }

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Check photos uploaded first
        if (!photos.length) {
            setErrors(prev => ({
                ...prev,
                propertyPhotos: 'At least one property photo is required'
            }));

            // Scroll to the error
            const element = document.querySelector('[data-field="propertyPhotos"]');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // 2. Then check cover photo
        if (!isCoverPhotoSet) {
            setIsCoverPhotoError("Please make a cover photo before submitting.");
            return;
        }

        // 3. All good — proceed
        setActiveStep(activeStep + 1);
    };

    const handleExit = async () => {
        const wizard = new FormData();
        wizard.append("wizard_step_completed", activeStep)
        await WizardStepUpdateAPI(property?.uid, wizard)
        router.push("/PropertyListing")
    }
    useEffect(() => {
        if (saveExit && activeStep == 3) {
            handleExit()
        }
    }, [saveExit])

    // console.log("------------->", photos, step3Data)
    console.log(step3Data)
    return (
        <>
            {/* <ToastContainer /> */}
            <Container>
                <Row>
                    <Col md={8}>
                        <div className='box-input'>
                            <Form onSubmit={handleSubmit}>
                                {photos.length === 0 && (
                                    <>
                                        <h3 className='page-title mb-4'>Add some photos of this BR</h3>

                                        <div className='property-list-2'>
                                            <p className='subheadline-2 mb-1' data-field="propertyPhotos">Property photos <span style={{ color: '#f00' }} >*</span> </p>

                                            {errors.propertyPhotos && (
                                                <div className="alert alert-danger" role="alert">
                                                    {errors.propertyPhotos}
                                                </div>
                                            )}

                                            <div className='form-group mb-5'>
                                                <label>{"You'll need 1 photos to get started. You can add more or make changes later."}</label>

                                                <div className='add-upload-photo'>
                                                    <Image src="./images/icons/photo-camera.svg" className='img-fluid mb-2' width={50} height={40} alt='add photo' />
                                                    <Button onClick={changepicModal1} variant='' className='add-photo-btn'>
                                                        Add Photo
                                                    </Button>
                                                </div>
                                            </div>
                                            <hr style={{ margin: '50px 0' }}></hr>
                                        </div>
                                    </>
                                )}

                                {photos.length > 0 && (
                                    <>
                                        <div className='d-flex justify-content-between align-items-start'>
                                            <h3 className='page-title mb-4'>Ta-da! How does this look?</h3>
                                            <Image src='./images/icons/add_circle.svg' className='img-fluid' alt='circle' />
                                        </div>
                                        <div className="photo-gallery">
                                            {isCoverPhotoError && (
                                                <div className="alert alert-danger" role="alert">
                                                    {isCoverPhotoError}
                                                </div>
                                            )}
                                            {coverPhoto?.property_photo_url && (
                                                <div className="relative upload-photo mb-6 group">
                                                    <Image
                                                        src={`${coverPhoto?.property_photo_url}`}
                                                        alt="Cover photo"
                                                        width={600}
                                                        height={400}
                                                        className="object-cover w-full"
                                                    />
                                                    <span className="absolute top-4 left-3 cover-photo text-white text-xs px-2 py-1 rounded">
                                                        Cover photo
                                                    </span>

                                                    <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                        <li>
                                                            <button
                                                                onClick={() => removePhoto(coverIndex, coverPhoto?.uid)}
                                                                className="block text-sm w-full text-left"
                                                                type='button'
                                                            >
                                                                Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                    <div className="more-action absolute top-2 right-2">
                                                        <Image
                                                            src="./images/icons/more-dots-3.svg"
                                                            className="img-fluid"
                                                            alt="dot 3"
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Grid for other photos */}
                                            <div className="grid upload-photo grid-cols-2 gap-4">
                                                {photos.map((photo, index) => {
                                                    if (photo?.is_property_cover_photo) return null;
                                                    return (
                                                        <div key={index} className="relative group">
                                                            <Image
                                                                src={photo.preview || `${photo.property_photo_url}`}
                                                                alt={`Photo ${index + 1}`}
                                                                width={300}
                                                                height={200}
                                                                className="object-cover w-full uploaded-img"
                                                                draggable
                                                                onDragStart={() => handleDragStart(index)}
                                                                onDragOver={handleDragOver}
                                                                onDrop={() => handleDrop(index)}
                                                            />
                                                            {/* <Image
                                                                src={"./images/icons/drag.svg "}
                                                                alt={`Photo ${index + 1}`}
                                                                width={30}
                                                                height={30}
                                                            /> */}

                                                            {/* Options */}
                                                            <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                                <li>
                                                                    <button
                                                                        onClick={() => makeCoverPhoto(index, photo?.uid)}
                                                                        className="block text-sm w-full text-left"
                                                                        type='button'
                                                                    >
                                                                        Make cover photo
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        onClick={() => removePhoto(index, photo?.uid)}
                                                                        type='button'
                                                                        className="block text-sm w-full text-left"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            </ul>

                                                            {/* Dots */}
                                                            <div className="more-action absolute top-2 right-2">
                                                                <Image
                                                                    src="./images/icons/more-dots-3.svg"
                                                                    className="img-fluid"
                                                                    alt="dot 3"
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Show Add Photo only if < 5 */}
                                                {photos.length < MAX_PHOTOS && (
                                                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 h-40 cursor-pointer" style={{ minHeight: '349px' }} >
                                                        <label className="flex flex-col items-center cursor-pointer">
                                                            <Image
                                                                src="/images/icons/photo-camera.svg"
                                                                alt="Add"
                                                                width={50}
                                                                height={40}
                                                                className="mb-3 ms-auto me-auto"
                                                            />
                                                            <span style={{ border: '1px solid #000', padding: '10px 20px' }} className="text-sm" onClick={changepicModal1}>Add Photo</span>
                                                            {/* <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handleFileChange1}
                                                                className="hidden"
                                                            /> */}
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <hr style={{ margin: "50px 0" }} />
                                    </>
                                )}

                                {/* Photos of this BR's amenities - NO VALIDATION */}
                                {amenitiesFiles.length === 0 && (
                                    <div className='property-list-2'>
                                        <p className='subheadline-2 mb-1'>{`Photos of this BR's amenities`}</p>

                                        <div className='form-group mb-5'>
                                            <label>e.x. Pool, Game area, Gym, Kids area, Bar, etc. You can add more or make changes later.</label>

                                            <div className='add-upload-photo'>
                                                <Image src="./images/icons/photo-camera.svg" className='img-fluid mb-2' width={50} height={40} alt='add photo' />
                                                <Button onClick={changepicModal2} variant='' className='add-photo-btn'>
                                                    Add Photo
                                                </Button>
                                            </div>
                                        </div>
                                        <hr style={{ margin: '50px 0' }}></hr>
                                    </div>
                                )}


                                {amenitiesFiles.length > 0 && (
                                    <>
                                        <div className='d-flex justify-content-between align-items-start'>
                                            <h3 className='page-title mb-4'>Ta-da! How does this look?</h3>
                                            <Image src='./images/icons/add_circle.svg' className='img-fluid' alt='circle' />
                                        </div>
                                        <div className="photo-gallery">
                                            {/* Cover Photo */}
                                            {/* {coverPhoto?.property_photo_url && (
                                                <div className="relative upload-photo mb-6 group">
                                                    <Image
                                                        src={`${coverPhoto?.property_photo_url}`}
                                                        alt="Cover photo"
                                                        width={600}
                                                        height={400}
                                                        className="object-cover w-full"
                                                    />
                                                    <span className="absolute top-4 left-3 cover-photo text-white text-xs px-2 py-1 rounded">
                                                        Cover photo
                                                    </span>

                                                    <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                        <li>
                                                            <button
                                                                onClick={() => removePhoto(coverIndex, coverPhoto?.uid)}
                                                                className="block text-sm w-full text-left"
                                                                type='button'
                                                            >
                                                                Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                    <div className="more-action absolute top-2 right-2">
                                                        <Image
                                                            src="./images/icons/more-dots-3.svg"
                                                            className="img-fluid"
                                                            alt="dot 3"
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </div>
                                                </div>
                                            )} */}

                                            {/* Grid for other amenitiesFiles */}
                                            <div className="grid upload-photo grid-cols-2 gap-4">
                                                {amenitiesFiles.map((photo, index) => {
                                                    if (photo?.is_property_cover_photo) return null;
                                                    return (
                                                        <div key={index} className="relative group">
                                                            <Image
                                                                src={photo.preview || `${photo.property_photo_url}`}
                                                                alt={`Photo ${index + 1}`}
                                                                width={300}
                                                                height={200}
                                                                className="object-cover w-full"
                                                                draggable
                                                                onDragStart={() => handleDragStartAm(index)}
                                                                onDragOver={handleDragOverAm}
                                                                onDrop={() => handleDropAm(index)}
                                                            />

                                                            {/* <Image
                                                                src={"./images/icons/drag.svg "}
                                                                alt={`Photo ${index + 1}`}
                                                                width={30}
                                                                height={30}
                                                            /> */}

                                                            {/* Options */}
                                                            <ul className="absolute top-2 right-2 bg-white shadow picoption2 hidden ps-0 group-hover:block">
                                                                <li>
                                                                    <button
                                                                        onClick={() => makeCoverPhoto(index, photo?.uid)}
                                                                        className="block text-sm w-full text-left"
                                                                        type='button'
                                                                    >
                                                                        Make cover photo
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        onClick={() => removePhoto(index, photo?.uid)}
                                                                        type='button'
                                                                        className="block text-sm w-full text-left"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            </ul>

                                                            {/* Dots */}
                                                            <div className="more-action absolute top-2 right-2">
                                                                <Image
                                                                    src="./images/icons/more-dots-3.svg"
                                                                    className="img-fluid"
                                                                    alt="dot 3"
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Show Add Photo only if < 5 */}
                                                {amenitiesFiles.length < MAX_PHOTOS && (
                                                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 h-40 cursor-pointer" style={{ minHeight: '349px' }} >
                                                        <label className="flex flex-col items-center cursor-pointer">
                                                            <Image
                                                                src="/images/icons/photo-camera.svg"
                                                                alt="Add"
                                                                width={50}
                                                                height={40}
                                                                className="mb-3 ms-auto me-auto"
                                                            />
                                                            <span style={{ border: '1px solid #000', padding: '10px 20px' }} className="text-sm" onClick={changepicModal2}>Add Photo</span>
                                                            {/* <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handleFileChange1}
                                                                className="hidden"
                                                            /> */}
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <hr style={{ margin: "50px 0" }} />
                                    </>
                                )}

                                <div className='d-flex'>
                                    <Button
                                        variant=""
                                        className='btn-white-transparent d-flex gap-2 me-3'
                                        style={{ padding: '13px 35px', borderRadius: '0' }}
                                        type="button"
                                        onClick={() => setActiveStep(activeStep - 1)}
                                    >
                                        <Image src="./images/icons/double-arrows.svg" className='img-fluid' alt='arrow' /> Back
                                    </Button>

                                    <Button
                                        variant=""
                                        className='complete-form-btn'
                                        style={{ padding: '13px 35px', borderRadius: '0' }}
                                        type="submit"
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Property Photos Modal */}
            <Modal show={changepicsModal1} onHide={changepicClose1} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
                    <Modal.Title>
                        Upload photo
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose1} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <span>{step3Data?.propertyPhotos?.length} items selected</span>
                        {photos.length > 0 && photos.length < MAX_PHOTOS && (
                            <label className="cursor-pointer d-flex align-items-center gap-2">
                                <Image
                                    src="/images/icons/add_circle.svg"
                                    width={24}
                                    height={24}
                                    alt="Add more photos"
                                />
                                <span>Add more photos</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange1}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <div className="drap-drop-box-full">
                        {step3Data?.propertyPhotos?.length === 0 ? (
                            <label
                                onDrop={handleDrop1}
                                onDragOver={handleDragOver1}
                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange1}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <Image
                                        src="/images/icons/photo-library.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                    />
                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Drag and drop
                                    </p>
                                    <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                    >
                                        or click here to choose files (max 5).
                                    </p>
                                </div>
                            </label>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    {step3Data?.propertyPhotos?.map((photo, index) => (
                                        <div key={index} className="relative inline-block">
                                            <Image
                                                src={photo.preview || `${photo.property_photo_url}`}
                                                alt={`Uploaded preview ${index + 1}`}
                                                width={250}
                                                height={250}
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhotoModal(index)}
                                                className="absolute top-1 right-1 delete-icn"
                                            >
                                                <Image
                                                    src="/images/icons/delete.svg"
                                                    width={20}
                                                    height={20}
                                                    alt="delete"
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={changepicClose1} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }} disabled={isUploading}>
                        Cancel
                    </Button>
                    {/* <Button variant=""
                        onClick={() => handleUpload('')}
                        className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Upload
                    </Button> */}
                    {/* In Modal 1 footer */}
                    <Button
                        variant=""
                        onClick={() => handleUpload('')}
                        className='search-btn complete-form-btn'
                        style={{ padding: '13px 25px', borderRadius: '0' }}
                        disabled={isUploading}  // 👈
                    >
                        {isUploading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Uploading...
                            </>
                        ) : 'Upload'}
                    </Button>

                    {/* Same for Modal 2 footer */}
                </Modal.Footer>
            </Modal>

            {/* Amenities Photos Modal - NO VALIDATION */}
            <Modal show={changepicsModal2} onHide={changepicClose2} animation={false} centered className='custom-theme-modal ' >
                <Modal.Header className='d-flex align-items-center justify-content-between pb-0' >
                    <Modal.Title>
                        Upload photo
                    </Modal.Title>
                    <Image src='/images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={changepicClose2} />
                </Modal.Header>
                <Modal.Body className='pt-4 pb-4'>
                    <p className='border-bottom pb-4'>{amenitiesFiles.length} items selected</p>

                    <div className="drap-drop-box-full">
                        {step3Data?.amenitiesPhotos?.length === 0 ? (
                            <label
                                onDrop={handleDrop2}
                                onDragOver={handleDragOver2}
                                className="border-2 border-dashed border-gray-300 h-48 flex flex-col items-center justify-center cursor-pointer"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange2}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <Image
                                        src="/images/icons/photo-library.svg"
                                        alt="Upload"
                                        width={30}
                                        height={30}
                                        className="mx-auto mb-2"
                                    />
                                    <p className="font-medium mb-0" style={{ color: "#463527" }}>
                                        Drag and drop
                                    </p>
                                    <p
                                        className="text-sm text-gray-500 mb-0"
                                        style={{ color: "#73615F" }}
                                    >
                                        or click here to choose files (max 5).
                                    </p>
                                </div>
                            </label>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {step3Data?.amenitiesPhotos?.map((file, index) => (
                                    <div key={index} className="relative inline-block">
                                        <Image
                                            src={file.preview || `${file.property_photo_url}`}
                                            alt={`Uploaded preview ${index + 1}`}
                                            width={250}
                                            height={250}
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAmenitiesFile(index)}
                                            className="absolute top-1 right-1 delete-icn"
                                        >
                                            <Image
                                                src="/images/icons/delete.svg"
                                                width={20}
                                                height={20}
                                                alt="delete"
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center justify-content-between '>
                    <Button variant="" onClick={changepicClose2} className='btn-company-add ' style={{ padding: '13px 25px', borderRadius: '0' }}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={() => handleUpload('')} className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }}  >
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}