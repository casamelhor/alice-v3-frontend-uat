// "use client"
// import React from 'react'
// import Header from '../Header/Header'
// import { useEffect, useState } from "react";
// import { Row, Col, Container, Button, Tabs, Tab, Table, Modal, Form } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { AriaOnFocus } from 'react-select';

// import Image from 'next/image';
// import ProtectedRoute from '../ProtectedRoute';
// import { companyDetailAPI, UpdateCompanyDetailAPI } from '@/services/provider';
// import { useParams } from 'next/navigation';
// import { alert_success } from '@/utils/Alerts/TostifyAlerts';
// import { ToastContainer } from 'react-toastify';
// import { CustomFieldValidation } from '@/utils/validation';

// export const AddQuestionModel = ({ show, cmppremodShow, cmppremodClose, selectedType, setSelectedType, textshow, setTextShow,
//     showSaveChanges, optionshow, setOptionsShow, optionmodClose, optionInput, setOptionInput, optionsList,
//     handleAddQuestion, textmodClose, customFields, setCustomFields,questionData, setQuestionData }) => {

//     const [showModal, setShowModal] = useState(false);

//     // const [customFields, setCustomFields] = useState({});

//     const [step, setStep] = useState(1);
//     const [selectedTypeError, setSelectedTypeError] = useState("");
//     const [errorMessages, setErrorMessages] = useState({});

//     // const [questionData, setQuestionData] = useState({
//     //     display_name: "",
//     //     values: [],
//     //     is_required: "Optional",
//     //     type: "",
//     // });

//     // =============================
//     // OPEN MODAL BUT MAX 2 QUESTIONS
//     // =============================
//     const openModal = () => {
//         if (Object.keys(customFields).length >= 2) {
//             alert("You can add only 2 questions.");
//             return;
//         }
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         cmppremodClose()
//         textmodClose()
//         optionmodClose()
//         setStep(1);
//         setSelectedType("");
//         setSelectedTypeError("")
//         setQuestionData({
//             display_name: "",
//             values: [],
//             is_required: "Optional",
//             type: "",
//         });
//     };

//     const handleTypeSelect = (type) => {
//         setSelectedType(type);
//         setQuestionData({ ...questionData, type });
//         setStep(2);
//     };

//     const handleOptionAdd = (e) => {
//         if (e.key === "Enter" || e.key === "Tab") {
//             e.preventDefault();
//             const val = e.target.value.trim();
//             if (val) {
//                 setQuestionData({
//                     ...questionData,
//                     values: [...questionData.values, val],
//                 });
//                 e.target.value = "";
//             }
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         let newData = { [name]: value }
//         setQuestionData({ ...questionData, display_name: e.target.value })
//         const { errors } = CustomFieldValidation(newData, selectedType)
//         setErrorMessages({
//             ...errorMessages,
//             ...errors
//         })
//     }

//     const handleOptionKeyDown = (e) => {
//         const { name, value } = e.target;
//         if ((e.key === "Enter" || e.key === "Tab") && optionInput.trim()) {
//             e.preventDefault();
//             let newData = { [name]: [...questionData.values, optionInput] }
//             const { errors } = CustomFieldValidation(newData, selectedType)
//             setErrorMessages({
//                 ...errorMessages,
//                 ...errors
//             })
//             setQuestionData({
//                 ...questionData,
//                 values: [...questionData.values, optionInput],
//             });
//             setOptionInput("");
//         }
//     };

//     const removeOption = (index) => {
//         const newValues = [...questionData.values];
//         newValues.splice(index, 1);
//         setQuestionData({ ...questionData, values: newValues });

//         let newData = { ["values"]: newValues }
//         const { errors } = CustomFieldValidation(newData, selectedType)
//         setErrorMessages({
//             ...errorMessages,
//             ...errors
//         })
//     };

//     const handleSave = () => {
//         const { errors, isValid } = CustomFieldValidation(questionData, selectedType);
//         setErrorMessages(errors)
//         // debugger
//         if (isValid) {
//             const quesKey = `custom_ques${Object.keys(customFields).length + 1}`;

//             setCustomFields({
//                 ...customFields,
//                 [quesKey]: questionData,
//             });

//             closeModal();
//         }
//     };

//     console.log(selectedType, questionData, customFields)
//     return (
//         <>           
//             <Modal show={show} onHide={cmppremodClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-2' >
//                     <Modal.Title>Add Question</Modal.Title>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={cmppremodClose} />
//                 </Modal.Header>
//                 <Modal.Body className='pt-0'>
//                     <p style={{ color: ' #73615F' }}>Ask guests custom questions when they register.</p>
//                     <div className='select-question-type'>
//                         <p style={{ color: ' #463527' }}>Select question type</p>
//                         <Row>
//                             <Col md={6}>
//                                 <div className='radio-select-box  d-flex gap-2' onClick={() => setSelectedType('text')} >
//                                     <label className="form-check-label  d-flex gap-2" htmlFor="default-radio">
//                                         <input type="radio" name='select-question-type' id='default-radio' checked={selectedType === 'text'} onChange={() => setSelectedType('text')} />
//                                         <span className="radio-checkmark"></span>
//                                         <Image src='../images/icons/text.svg' className='img-fluid' width={24} height={24} alt='text' />

//                                         Text
//                                     </label>
//                                 </div>
//                             </Col>

//                             <Col md={6}>
//                                 <div className='radio-select-box d-flex gap-2' onClick={() => setSelectedType("dropdown")} >
//                                     <label className="form-check-label  d-flex gap-2" htmlFor="default-radio-1">
//                                         <input type="radio" name='select-question-type' id='default-radio-1' checked={selectedType === "dropdown"} onChange={() => setSelectedType("dropdown")} />
//                                         <span className="radio-checkmark"></span>
//                                         <Image src='../images/icons/menu-fold-fill1.svg' className='img-fluid' width={24} height={24} alt='text' />
//                                         Options
//                                     </label>
//                                 </div>
//                             </Col>
//                         </Row>
//                         {!selectedType && (<span className='text-danger'>{selectedTypeError}</span>)}
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <Button variant=""
//                         className='btn-company-add ms-auto me-0'
//                         style={{ padding: '13px 25px', borderRadius: '0' }}
//                         onClick={() => {
//                             // cmppremodClose();
//                             if (!selectedType) {
//                                 setSelectedTypeError("Please select type")

//                             } else {
//                                 if (selectedType === 'text') {
//                                     setTextShow(true);
//                                     setQuestionData({ ...questionData, type: selectedType })
//                                 } else if (selectedType === "dropdown") {
//                                     // optionmodShow();
//                                     setOptionsShow(true)
//                                     setQuestionData({ ...questionData, type: selectedType })
//                                 }
//                             }
//                         }}
//                     >
//                         Next
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* text show */}
//             <Modal show={textshow} onHide={textmodClose} animation={false} centered className="custom-theme-modal status-height-70">
//                 <Modal.Header className="d-flex align-items-center justify-content-between pb-2">
//                     <Modal.Title>Add Question</Modal.Title>
//                     <Image
//                         src="../images/icons/close-circle.svg"
//                         width={24}
//                         height={24}
//                         alt="Close"
//                         style={{ cursor: "pointer" }}
//                         onClick={textmodClose}
//                     />
//                 </Modal.Header>
//                 <Modal.Body className="p-0">
//                     <div className="text-form-head">
//                         <Image src="../images/icons/text.svg" className="img-fluid" alt="text" width={32} height={32} />
//                         <p className="mb-0">Text</p>
//                         <p className="mb-0">
//                             <small>Ask for a free-form response</small>
//                         </p>
//                     </div>

//                     <div className="select-question-type p-4">
//                         <Row>
//                             <Col md={12}>
//                                 <div className="form-group mb-4">
//                                     <label>Question</label>
//                                     <input
//                                         name='display_name'
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Enter your question here"
//                                         value={questionData.display_name}
//                                         onChange={handleInputChange}
//                                     />
//                                     <span className='text-danger'>{errorMessages?.display_name}</span>
//                                 </div>
//                             </Col>


//                             {showSaveChanges && (
//                                 <Col md={12} className="selct-radio-show-hide mb-4">
//                                     <div className='form-group'>
//                                         <label>Question</label>
//                                     </div>
//                                     <Row>
//                                         <Col md={6}>
//                                             <div className="radio-select-box d-flex gap-2" onClick={() => setSelectedType("text")}>
//                                                 <label className="form-check-label d-flex gap-2" htmlFor="default-radio">
//                                                     <input
//                                                         type="radio"
//                                                         name="select-question-type"
//                                                         id="default-radio"
//                                                         checked={selectedType === "text"}
//                                                         onChange={() => setSelectedType("text")}
//                                                     />
//                                                     <span className="radio-checkmark"></span>
//                                                     <Image src="../images/icons/text.svg" className="img-fluid" width={24} height={24} alt="text" />
//                                                     Text
//                                                 </label>
//                                             </div>
//                                         </Col>

//                                         <Col md={6}>
//                                             <div className="radio-select-box d-flex gap-2" onClick={() => setSelectedType("Option")}>
//                                                 <label className="form-check-label d-flex gap-2" htmlFor="default-radio-1">
//                                                     <input
//                                                         type="radio"
//                                                         name="select-question-type"
//                                                         id="default-radio-1"
//                                                         checked={selectedType === "Option"}
//                                                         onChange={() => setSelectedType("Option")}
//                                                     />
//                                                     <span className="radio-checkmark"></span>
//                                                     <Image src="../images/icons/menu-fold-fill1.svg" className="img-fluid" width={24} height={24} alt="text" />
//                                                     Options
//                                                 </label>
//                                             </div>
//                                         </Col>
//                                     </Row>
//                                 </Col>
//                             )}

//                             <Col md={12}>
//                                 <div className="asd d-flex justify-content-between ">
//                                     <label>Required</label>
//                                     <Form.Check type="switch"
//                                         onChange={(e) => setQuestionData({
//                                             ...questionData,
//                                             is_required: e.target.checked ? "Required" : "Optional"
//                                         })}
//                                         id="custom-switch" className="custom-switch" />
//                                 </div>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Modal.Body>

//                 <Modal.Footer>

//                     {!showSaveChanges && (
//                         <div className="w-100 add-question-form">
//                             <div className="d-flex w-100 align-items-center justify-content-between">
//                                 <Link
//                                     href="#"
//                                     className="d-flex gap-2"
//                                     style={{ textDecoration: "none", color: "#463527", fontWeight: "500" }}
//                                     onClick={() => {
//                                         textmodClose();
//                                         cmppremodShow();
//                                         setErrorMessages({});
//                                         setQuestionData({
//                                             display_name: "",
//                                             values: [],
//                                             is_required: "Optional",
//                                             type: "",
//                                         });
//                                     }}
//                                 >
//                                     <Image src="../images/icons/back.svg" className="img-fluid" alt="text" width={10} height={10} />
//                                     Back
//                                 </Link>
//                                 <Button variant=""
//                                     className="add-question-btn-green ms-auto me-0"
//                                     style={{ padding: "13px 25px", borderRadius: "0" }}
//                                     onClick={handleSave} // ✅ switch to save mode
//                                 >
//                                     Add Question
//                                 </Button>
//                             </div>
//                         </div>
//                     )}


//                     {showSaveChanges && (
//                         <div className="w-100 save-changes-form">
//                             <div className="d-flex w-100 align-items-center justify-content-between savechange-btn-footer">
//                                 <Button variant="" onClick={textmodClose} className="add-question-btn-green" style={{ padding: "13px 25px", borderRadius: "0", width: "90%" }}>
//                                     Save Changes
//                                 </Button>
//                                 <Link
//                                     href="#"
//                                     className="d-flex gap-2 me-2"
//                                     style={{ textDecoration: "none", color: "#463527", fontWeight: "500" }}
//                                     //onClick={handleDelete} // ✅ go back to Add Question
//                                     //onClick={assignmentRemoveShow}
//                                     onClick={() => {
//                                         textmodClose();
//                                         assignmentRemoveShow();
//                                     }}
//                                 >
//                                     <Image src="../images/icons/delete_b.svg" className="img-fluid" alt="delete" width={24} height={24} />
//                                 </Link>
//                             </div>
//                         </div>
//                     )}
//                 </Modal.Footer>
//             </Modal>

//             {/* Option show */}
//             <Modal show={optionshow} onHide={optionmodClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-2' >
//                     <Modal.Title>Add Question</Modal.Title>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={optionmodClose} />
//                 </Modal.Header>
//                 <Modal.Body className='p-0'>
//                     <div className="text-form-head">
//                         <Image src="../images/icons/menu-fold-fill1.svg" className="img-fluid" alt="text" width={32} height={32} />
//                         <p className="mb-0">Options</p>
//                         <p className="mb-0">
//                             <small>Let the guest choose from a list of options</small>
//                         </p>
//                     </div>

//                     <div className="select-question-type p-4">
//                         <Row>
//                             <Col md={12}>
//                                 <div className="form-group mb-4">
//                                     <label>Question</label>
//                                     <input
//                                         name='display_name'
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Enter your question here"
//                                         value={questionData.display_name}
//                                         onChange={handleInputChange}
//                                     />
//                                     <span className='text-danger'>{errorMessages?.display_name}</span>
//                                 </div>
//                             </Col>

//                             <Col md={12}>
//                                 <div className="form-group mb-4">
//                                     <label>Options</label>
//                                     <input
//                                         name='values'
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Add options"
//                                         value={optionInput}
//                                         onChange={e => setOptionInput(e.target.value)}
//                                         onKeyDown={handleOptionKeyDown}
//                                     />
//                                     <div style={{ fontSize: "14px", color: "#73615F", marginTop: "4px" }}>
//                                         Press Enter or Tab key to add a new option.
//                                     </div>
//                                     <span className='text-danger'>{errorMessages?.values}</span>
//                                     <div className="d-flex gap-2 mt-3 flex-wrap">
//                                         {Array.isArray(questionData?.values) && questionData?.values?.map((opt, idx) => (
//                                             <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
//                                                 {opt}
//                                                 <span
//                                                     style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
//                                                     onClick={() => removeOption(idx)}
//                                                 >
//                                                     <Image src="../images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
//                                                 </span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </Col>                           

//                             <Col md={12}>
//                                 <div className="asd d-flex justify-content-between ">
//                                     <label>Required</label>
//                                     <Form.Check
//                                         type="switch"
//                                         onChange={(e) => setQuestionData({
//                                             ...questionData,
//                                             is_required: e.target.checked ? "Required" : "Optional"
//                                         })}
//                                         id="custom-switch"
//                                         className="custom-switch" />
//                                 </div>
//                             </Col>

//                         </Row>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <div className="w-100 save-changes-form">
//                         <div className="d-flex w-100 align-items-center justify-content-between savechange-btn-footer">
//                             <Link
//                                 href="#"
//                                 className="d-flex gap-2"
//                                 style={{ textDecoration: "none", color: "#463527", fontWeight: "500" }}
//                                 onClick={() => {
//                                     optionmodClose();
//                                     cmppremodShow();
//                                     setErrorMessages({});
//                                     setQuestionData({
//                                         display_name: "",
//                                         values: [],
//                                         is_required: "Optional",
//                                         type: "",
//                                     });
//                                 }}
//                             >
//                                 <Image src="../images/icons/back.svg" className="img-fluid" alt="text" width={10} height={10} />
//                                 Back
//                             </Link>
//                             <Button variant="" onClick={handleSave} className="add-question-btn-green" style={{ padding: "13px 25px", borderRadius: "0", width: "80%" }}>
//                                 Save Changes
//                             </Button>
//                         </div>
//                     </div>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     )
// }


"use client"
import React from 'react'
import { useState } from "react";
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { CustomFieldValidation } from '@/utils/validation';

export const AddQuestionModel = ({
    show, cmppremodShow, cmppremodClose,
    selectedType, setSelectedType,
    textshow, setTextShow,
    showSaveChanges,
    optionshow, setOptionsShow, optionmodClose,
    optionInput, setOptionInput,
    handleAddQuestion, textmodClose,
    customFields, setCustomFields,
    questionData, setQuestionData,
}) => {

    const [selectedTypeError, setSelectedTypeError] = useState("");
    const [errorMessages,     setErrorMessages]     = useState({});

    // BUG FIX 1: closeModal now resets ALL shared state (selectedType, questionData,
    // optionInput) so that closing and reopening the modal never shows stale values.
    const closeModal = () => {
        cmppremodClose();
        textmodClose();
        optionmodClose();
        setSelectedType(null);          // was setSelectedType("") — null is cleaner for the radio checks
        setSelectedTypeError("");
        setErrorMessages({});
        setOptionInput("");
        setQuestionData({
            display_name: "",
            values: [],
            is_required: "Optional",
            type: "",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuestionData({ ...questionData, display_name: value });
        const { errors } = CustomFieldValidation({ [name]: value }, selectedType);
        setErrorMessages({ ...errorMessages, ...errors });
    };

    const handleOptionKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === "Tab") && optionInput.trim()) {
            e.preventDefault();
            const newValues = [...questionData.values, optionInput.trim()];
            // BUG FIX 2: validate using the updated values array (not the stale one)
            const { errors } = CustomFieldValidation({ values: newValues }, selectedType);
            setErrorMessages({ ...errorMessages, ...errors });
            setQuestionData({ ...questionData, values: newValues });
            setOptionInput("");
        }
    };

    const removeOption = (index) => {
        const newValues = [...questionData.values];
        newValues.splice(index, 1);
        setQuestionData({ ...questionData, values: newValues });
        const { errors } = CustomFieldValidation({ values: newValues }, selectedType);
        setErrorMessages({ ...errorMessages, ...errors });
    };

    const handleSave = () => {
        const { errors, isValid } = CustomFieldValidation(questionData, selectedType);
        setErrorMessages(errors);
        if (!isValid) return;

        // BUG FIX 3: key must be unique. Original always used length+1 which
        // breaks if a question was deleted (e.g. length is 0 after deletion
        // but 'custom_ques1' already exists from before).
        // Use a timestamp-based key to guarantee uniqueness.
        const quesKey = `custom_ques_${Date.now()}`;

        setCustomFields({ ...customFields, [quesKey]: { ...questionData } });
        closeModal();
    };

    // ── Step 1 modal: pick type ──────────────────────────────────────────────
    return (
        <>
            <Modal show={show} onHide={closeModal} animation={false} centered className="custom-theme-modal status-height-70">
                <Modal.Header className="d-flex align-items-center justify-content-between pb-2">
                    <Modal.Title>Add Question</Modal.Title>
                    <Image src="../images/icons/close-circle.svg" width={24} height={24} alt="Close"
                        style={{ cursor:"pointer" }} onClick={closeModal} />
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <p style={{ color:"#73615F" }}>Ask guests custom questions when they register.</p>
                    <div className="select-question-type">
                        <p style={{ color:"#463527" }}>Select question type</p>
                        <Row>
                            <Col md={6}>
                                <div className="radio-select-box d-flex gap-2" onClick={() => setSelectedType("text")}>
                                    <label className="form-check-label d-flex gap-2" htmlFor="add-radio-text">
                                        <input type="radio" name="add-question-type" id="add-radio-text"
                                            checked={selectedType === "text"}
                                            onChange={() => setSelectedType("text")} />
                                        <span className="radio-checkmark"></span>
                                        <Image src="../images/icons/text.svg" className="img-fluid" width={24} height={24} alt="text" />
                                        Text
                                    </label>
                                </div>
                            </Col>
                            <Col md={6}>
                                {/* BUG FIX 4: was using the string "dropdown" inconsistently.
                                    AddQuestionModel used "dropdown" here for options but the
                                    type-select step was using "option" elsewhere.
                                    Standardised to "dropdown" everywhere to match EditQuestionModel
                                    and the API payload (field.type === 'dropdown'). */}
                                <div className="radio-select-box d-flex gap-2" onClick={() => setSelectedType("dropdown")}>
                                    <label className="form-check-label d-flex gap-2" htmlFor="add-radio-dropdown">
                                        <input type="radio" name="add-question-type" id="add-radio-dropdown"
                                            checked={selectedType === "dropdown"}
                                            onChange={() => setSelectedType("dropdown")} />
                                        <span className="radio-checkmark"></span>
                                        <Image src="../images/icons/menu-fold-fill1.svg" className="img-fluid" width={24} height={24} alt="options" />
                                        Options
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        {!selectedType && <span className="text-danger">{selectedTypeError}</span>}
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-between">
                    <Button variant="" className="btn-company-add ms-auto me-0"
                        style={{ padding:"13px 25px", borderRadius:0 }}
                        onClick={() => {
                            if (!selectedType) {
                                setSelectedTypeError("Please select type");
                                return;
                            }
                            // BUG FIX 5: sync questionData.type with selectedType BEFORE
                            // opening the next modal so handleSave always has the right type.
                            setQuestionData(p => ({ ...p, type: selectedType }));
                            if (selectedType === "text") {
                                setTextShow(true);
                            } else {
                                setOptionsShow(true);
                            }
                        }}
                    >
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ── Step 2a: Text question modal ── */}
            <Modal show={textshow} onHide={closeModal} animation={false} centered className="custom-theme-modal status-height-70">
                <Modal.Header className="d-flex align-items-center justify-content-between pb-2">
                    <Modal.Title>Add Question</Modal.Title>
                    <Image src="../images/icons/close-circle.svg" width={24} height={24} alt="Close"
                        style={{ cursor:"pointer" }} onClick={closeModal} />
                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className="text-form-head">
                        <Image src="../images/icons/text.svg" className="img-fluid" alt="text" width={32} height={32} />
                        <p className="mb-0">Text</p>
                        <p className="mb-0"><small>Ask for a free-form response</small></p>
                    </div>
                    <div className="select-question-type p-4">
                        <Row>
                            <Col md={12}>
                                <div className="form-group mb-4">
                                    <label>Question</label>
                                    <input
                                        name="display_name" type="text" className="form-control"
                                        placeholder="Enter your question here"
                                        value={questionData.display_name}
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-danger">{errorMessages?.display_name}</span>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="d-flex justify-content-between">
                                    <label>Required</label>
                                    <Form.Check type="switch" id="add-text-required-switch" className="custom-switch"
                                        checked={questionData.is_required === "Required"}
                                        onChange={e => setQuestionData({
                                            ...questionData,
                                            is_required: e.target.checked ? "Required" : "Optional",
                                        })} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="w-100 add-question-form">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <Link href="#" className="d-flex gap-2"
                                style={{ textDecoration:"none", color:"#463527", fontWeight:500 }}
                                onClick={e => {
                                    e.preventDefault();
                                    textmodClose();
                                    // BUG FIX 6: clear errors and reset display_name when going
                                    // back so the user doesn't see stale validation messages.
                                    setErrorMessages({});
                                    setQuestionData(p => ({ ...p, display_name:"", type:"" }));
                                    cmppremodShow();
                                }}>
                                <Image src="../images/icons/back.svg" className="img-fluid" alt="back" width={10} height={10} />
                                Back
                            </Link>
                            <Button variant="" className="add-question-btn-green ms-auto me-0"
                                style={{ padding:"13px 25px", borderRadius:0 }}
                                onClick={handleSave}>
                                Add Question
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* ── Step 2b: Options/dropdown question modal ── */}
            <Modal show={optionshow} onHide={closeModal} animation={false} centered className="custom-theme-modal status-height-70">
                <Modal.Header className="d-flex align-items-center justify-content-between pb-2">
                    <Modal.Title>Add Question</Modal.Title>
                    <Image src="../images/icons/close-circle.svg" width={24} height={24} alt="Close"
                        style={{ cursor:"pointer" }} onClick={closeModal} />
                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className="text-form-head">
                        <Image src="../images/icons/menu-fold-fill1.svg" className="img-fluid" alt="options" width={32} height={32} />
                        <p className="mb-0">Options</p>
                        <p className="mb-0"><small>Let the guest choose from a list of options</small></p>
                    </div>
                    <div className="select-question-type p-4">
                        <Row>
                            <Col md={12}>
                                <div className="form-group mb-4">
                                    <label>Question</label>
                                    <input
                                        name="display_name" type="text" className="form-control"
                                        placeholder="Enter your question here"
                                        value={questionData.display_name}
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-danger">{errorMessages?.display_name}</span>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="form-group mb-4">
                                    <label>Options</label>
                                    <input
                                        name="values" type="text" className="form-control"
                                        placeholder="Add options"
                                        value={optionInput}
                                        onChange={e => setOptionInput(e.target.value)}
                                        onKeyDown={handleOptionKeyDown}
                                    />
                                    <div style={{ fontSize:14, color:"#73615F", marginTop:4 }}>
                                        Press Enter or Tab to add a new option.
                                    </div>
                                    <span className="text-danger">{errorMessages?.values}</span>
                                    <div className="d-flex gap-2 mt-3 flex-wrap">
                                        {Array.isArray(questionData.values) && questionData.values.map((opt, idx) => (
                                            <div key={idx} style={{
                                                display:"flex", alignItems:"center",
                                                border:"1px solid #4635271F", borderRadius:24,
                                                padding:"13px 14px", background:"transparent",
                                                fontWeight:500, color:"#463527",
                                            }}>
                                                {opt}
                                                <span style={{ marginLeft:8, cursor:"pointer" }} onClick={() => removeOption(idx)}>
                                                    <Image src="../images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="d-flex justify-content-between">
                                    <label>Required</label>
                                    <Form.Check type="switch" id="add-option-required-switch" className="custom-switch"
                                        checked={questionData.is_required === "Required"}
                                        onChange={e => setQuestionData({
                                            ...questionData,
                                            is_required: e.target.checked ? "Required" : "Optional",
                                        })} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-between">
                    <div className="w-100 save-changes-form">
                        <div className="d-flex w-100 align-items-center justify-content-between savechange-btn-footer">
                            <Link href="#" className="d-flex gap-2"
                                style={{ textDecoration:"none", color:"#463527", fontWeight:500 }}
                                onClick={e => {
                                    e.preventDefault();
                                    optionmodClose();
                                    setErrorMessages({});
                                    setQuestionData(p => ({ ...p, display_name:"", values:[], type:"" }));
                                    cmppremodShow();
                                }}>
                                <Image src="../images/icons/back.svg" className="img-fluid" alt="back" width={10} height={10} />
                                Back
                            </Link>
                            <Button variant="" className="add-question-btn-green"
                                style={{ padding:"13px 25px", borderRadius:0, width:"80%" }}
                                onClick={handleSave}>
                                Add Question
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};