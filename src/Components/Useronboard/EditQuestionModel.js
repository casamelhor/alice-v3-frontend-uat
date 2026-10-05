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

// export const EditQuestionModel = ({ editoptionshow, editoptionmodClose, selectedType, setSelectedType, textmodClose,
//     optionshow, setOptionsShow, optionmodClose, optionInput, setOptionInput, optionsList,
//     handleAddQuestion, customFields, setCustomFields, questionData, setQuestionData, editKey, setEditKey,deleteoptionshow,deleteoptionmodShow,deleteoptionmodClose
// }) => {

//     const [errorMessages, setErrorMessages] = useState({});

//     const closeModal = () => {
//         editoptionmodClose()
//         setSelectedType("");
//         setQuestionData({
//             display_name: "",
//             values: [],
//             is_required: "Optional",
//             type: "",
//         });
//     };

//     // SAVE CHANGES
//     const handleSave = () => {
//         const { errors, isValid } = CustomFieldValidation(questionData, selectedType);
//         setErrorMessages(errors)
//         if (isValid) {
//             setCustomFields((prev) => ({
//                 ...prev,
//                 [editKey]: {
//                     display_name: questionData.display_name,
//                     values:
//                         questionData.type === "dropdown"
//                             ? questionData.values.map((v) => v.trim())
//                             : [],
//                     is_required: questionData.is_required,
//                     type: questionData.type
//                 }
//             }));

//             setEditKey(null);
//             closeModal()
//         }

//     };

//     // DELETE
//     const handleDelete = () => {
//         const updated = { ...customFields };
//         delete updated[editKey];
//         setCustomFields(updated);
//         editoptionmodClose();
//         deleteoptionmodClose();
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
//     return (
//         <>
//             <Modal show={editoptionshow} onHide={editoptionmodClose} animation={false} centered className='custom-theme-modal status-height-70' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-2' >
//                     <Modal.Title>Edit Question</Modal.Title>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={editoptionmodClose} />
//                 </Modal.Header>
//                 <Modal.Body className='p-0'>
//                     {/* Dynamic header based on selection */}
//                     <div className="text-form-head">
//                         <Image
//                             src={selectedType === "text" ? "../images/icons/text.svg" : "../images/icons/menu-fold-fill1.svg"}
//                             className="img-fluid"
//                             alt="text"
//                             width={32}
//                             height={32}
//                         />
//                         <p className="mb-0">{selectedType === "text" ? "Text" : "Options"}</p>
//                         <p className="mb-0">
//                             <small>
//                                 {selectedType === "text"
//                                     ? "Ask for a free-form response"
//                                     : "Let the guest choose from a list of options"
//                                 }
//                             </small>
//                         </p>
//                     </div>
//                     <div className="select-question-type p-4">
//                         <Row>
//                             {/* Selection type radio buttons */}
//                             <Col md={12} className="selct-radio-show-hide mb-4">
//                                 <div className='form-group'>
//                                     <label>Selection type</label>
//                                 </div>
//                                 <Row>
//                                     <Col md={6}>
//                                         <div className="radio-select-box d-flex gap-2" onClick={() => setSelectedType("text")}>
//                                             <label className="form-check-label d-flex gap-2" htmlFor="default-radio">
//                                                 <input
//                                                     type="radio"
//                                                     name="select-question-type"
//                                                     id="default-radio"
//                                                     checked={selectedType === "text"}
//                                                     onChange={() => setSelectedType("text")}
//                                                 />
//                                                 <span className="radio-checkmark"></span>
//                                                 <Image src="../images/icons/text.svg" className="img-fluid" width={24} height={24} alt="text" />
//                                                 Text
//                                             </label>
//                                         </div>
//                                     </Col>

//                                     <Col md={6}>
//                                         <div className="radio-select-box d-flex gap-2" onClick={() => setSelectedType("dropdown")}>
//                                             <label className="form-check-label d-flex gap-2" htmlFor="default-radio-1">
//                                                 <input
//                                                     type="radio"
//                                                     name="select-question-type"
//                                                     id="default-radio-1"
//                                                     checked={selectedType === "dropdown"}
//                                                     onChange={() => setSelectedType("dropdown")}
//                                                 />
//                                                 <span className="radio-checkmark"></span>
//                                                 <Image src="../images/icons/menu-fold-fill1.svg" className="img-fluid" width={24} height={24} alt="text" />
//                                                 Options
//                                             </label>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </Col>

//                             {/* Question input - always visible */}
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

//                             {/* Options section - only show when "Options" is selected */}
//                             {selectedType === "dropdown" && (
//                                 <Col md={12}>
//                                     <div className="form-group mb-4">
//                                         <label>Options</label>
//                                         <input
//                                             name='values'
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Add options"
//                                             value={optionInput}
//                                             onChange={e => setOptionInput(e.target.value)}
//                                             onKeyDown={handleOptionKeyDown}
//                                         />
//                                         <div style={{ fontSize: "14px", color: "#73615F", marginTop: "4px" }}>
//                                             Press Enter or Tab key to add a new option.
//                                         </div>
//                                         <span className='text-danger'>{errorMessages?.values}</span>
//                                         <div className="d-flex gap-2 mt-3 flex-wrap">
//                                             {questionData?.values?.map((opt, idx) => (
//                                                 <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
//                                                     {opt}
//                                                     <span
//                                                         style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
//                                                         onClick={() => removeOption(idx)}
//                                                     >
//                                                         <Image src="../images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </Col>
//                             )}

//                             {/* Required switch - always visible */}
//                             <Col md={12}>
//                                 <div className="asd d-flex justify-content-between ">
//                                     <label>Required</label>
//                                     <Form.Check
//                                         type="switch"
//                                         checked={questionData?.is_required == "Required"}
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
//                             <Button onClick={handleSave} className="add-question-btn-green" style={{ padding: "13px 25px", borderRadius: "0", width: "90%" }}>
//                                 Save Changes
//                             </Button>
//                             <Link
//                                 href="#"
//                                 className="d-flex gap-2 me-2"
//                                 style={{ textDecoration: "none", color: "#463527", fontWeight: "500" }}
//                                 onClick={() => {                                
//                                     deleteoptionmodShow();
//                                 }}
//                             >
//                                 <Image src="../images/icons/delete_b.svg" className="img-fluid" alt="delete" width={24} height={24} />
//                             </Link>
//                         </div>
//                     </div>
//                 </Modal.Footer>
//             </Modal>

//             {/* Delete question  */}
//             <Modal show={deleteoptionshow} onHide={deleteoptionmodClose} animation={false} centered className='custom-theme-modal ' >
//                 <Modal.Header className='d-flex align-items-center justify-content-between pb-2' >
//                     <Modal.Title>Delete Question</Modal.Title>
//                     <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={deleteoptionmodClose} />
//                 </Modal.Header>
//                 <Modal.Body>
//                     <p>Are you sure you want to delete this question? This action cannot be undone.</p>
//                 </Modal.Body>

//                 <Modal.Footer className='d-flex align-items-center justify-content-between '>
//                     <Button type='' className='btn-company-add  btn' style={{ padding: '13px 25px' }} onClick={deleteoptionmodClose}>
//                         Cancel
//                     </Button>

//                     <Button variant='' onClick={handleDelete} type='' className='confrim-btn  btn' style={{ padding: '13px 25px', borderRadius: '0' }} >
//                         Yes, Delete
//                     </Button>

//                 </Modal.Footer>
//             </Modal>
//         </>
//     )
// }


"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { CustomFieldValidation } from '@/utils/validation';

export const EditQuestionModel = ({
    editoptionshow, editoptionmodClose,
    selectedType, setSelectedType,
    textmodClose,
    optionshow, setOptionsShow, optionmodClose,
    optionInput, setOptionInput,
    customFields, setCustomFields,
    questionData, setQuestionData,
    editKey, setEditKey,
    deleteoptionshow, deleteoptionmodShow, deleteoptionmodClose,
}) => {

    const [errorMessages, setErrorMessages] = useState({});

    // BUG FIX 1: useEffect watches editoptionshow + editKey so that every time
    // a DIFFERENT row's edit icon is clicked the error state is cleared.
    // Without this, errors from a previous edit session bleed into the new one.
    useEffect(() => {
        if (editoptionshow) {
            setErrorMessages({});
        }
    }, [editoptionshow, editKey]);

    const closeModal = () => {
        editoptionmodClose();
        // BUG FIX 2: reset ALL shared state on close so the next open (add OR edit)
        // always starts clean. Previously only editoptionmodClose was called, leaving
        // questionData/selectedType/optionInput with stale values.
        setSelectedType(null);
        setOptionInput("");
        setErrorMessages({});
        setEditKey(null);
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
            // BUG FIX 3: build newValues first, then validate against it,
            // then write to state — was validating against the OLD values array.
            const newValues = [...(questionData.values || []), optionInput.trim()];
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

    // BUG FIX 4: handleSave was building the saved object from questionData.type
    // but selectedType is what the radios control — they can get out of sync.
    // We now always write selectedType back into questionData before saving and
    // use selectedType as the source of truth for the 'type' field.
    const handleSave = () => {
        // Merge selectedType into questionData so validation sees the correct type
        const dataToSave = { ...questionData, type: selectedType };
        const { errors, isValid } = CustomFieldValidation(dataToSave, selectedType);
        setErrorMessages(errors);
        if (!isValid) return;

        setCustomFields(prev => ({
            ...prev,
            [editKey]: {
                display_name: dataToSave.display_name,
                type:         selectedType,
                is_required:  dataToSave.is_required,
                // Only persist values for dropdown type
                values: selectedType === "dropdown"
                    ? dataToSave.values.map(v => v.trim()).filter(Boolean)
                    : [],
            },
        }));

        closeModal();
    };

    // BUG FIX 5: handleDelete was calling editoptionmodClose() directly but
    // closeModal() also resets questionData/selectedType/editKey — must call
    // closeModal() so parent state is clean after deletion.
    const handleDelete = () => {
        const updated = { ...customFields };
        delete updated[editKey];
        setCustomFields(updated);
        deleteoptionmodClose();
        closeModal();
    };

    // BUG FIX 6: Switching type via radio must also sync questionData.type
    // so handleSave always has consistent data even if the user doesn't type anything.
    const handleTypeChange = (type) => {
        setSelectedType(type);
        setQuestionData(p => ({ ...p, type, values: type === "text" ? [] : p.values }));
    };

    return (
        <>
            {/* ── Main edit modal ── */}
            <Modal show={editoptionshow} onHide={closeModal} animation={false} centered
                className="custom-theme-modal status-height-70">
                <Modal.Header className="d-flex align-items-center justify-content-between pb-2">
                    <Modal.Title>Edit Question</Modal.Title>
                    <Image src="../images/icons/close-circle.svg" width={24} height={24} alt="Close"
                        style={{ cursor:"pointer" }} onClick={closeModal} />
                </Modal.Header>

                <Modal.Body className="p-0">
                    {/* Dynamic header */}
                    <div className="text-form-head">
                        <Image
                            src={selectedType === "text" ? "../images/icons/text.svg" : "../images/icons/menu-fold-fill1.svg"}
                            className="img-fluid" alt="type" width={32} height={32}
                        />
                        <p className="mb-0">{selectedType === "text" ? "Text" : "Options"}</p>
                        <p className="mb-0">
                            <small>{selectedType === "text"
                                ? "Ask for a free-form response"
                                : "Let the guest choose from a list of options"}
                            </small>
                        </p>
                    </div>

                    <div className="select-question-type p-4">
                        <Row>
                            {/* Type radio buttons */}
                            <Col md={12} className="selct-radio-show-hide mb-4">
                                <div className="form-group">
                                    <label>Selection type</label>
                                </div>
                                <Row>
                                    <Col md={6}>
                                        <div className="radio-select-box d-flex gap-2"
                                            onClick={() => handleTypeChange("text")}>
                                            <label className="form-check-label d-flex gap-2" htmlFor="edit-radio-text">
                                                <input type="radio" name="edit-question-type" id="edit-radio-text"
                                                    checked={selectedType === "text"}
                                                    onChange={() => handleTypeChange("text")} />
                                                <span className="radio-checkmark"></span>
                                                <Image src="../images/icons/text.svg" className="img-fluid" width={24} height={24} alt="text" />
                                                Text
                                            </label>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="radio-select-box d-flex gap-2"
                                            onClick={() => handleTypeChange("dropdown")}>
                                            <label className="form-check-label d-flex gap-2" htmlFor="edit-radio-dropdown">
                                                <input type="radio" name="edit-question-type" id="edit-radio-dropdown"
                                                    checked={selectedType === "dropdown"}
                                                    onChange={() => handleTypeChange("dropdown")} />
                                                <span className="radio-checkmark"></span>
                                                <Image src="../images/icons/menu-fold-fill1.svg" className="img-fluid" width={24} height={24} alt="options" />
                                                Options
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            {/* Question label input */}
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

                            {/* Options chips — only when type is dropdown */}
                            {selectedType === "dropdown" && (
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
                                                    <span style={{ marginLeft:8, cursor:"pointer" }}
                                                        onClick={() => removeOption(idx)}>
                                                        <Image src="../images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Col>
                            )}

                            {/* Required toggle */}
                            <Col md={12}>
                                <div className="d-flex justify-content-between">
                                    <label>Required</label>
                                    <Form.Check
                                        type="switch" id="edit-required-switch" className="custom-switch"
                                        checked={questionData.is_required === "Required"}
                                        onChange={e => setQuestionData({
                                            ...questionData,
                                            is_required: e.target.checked ? "Required" : "Optional",
                                        })}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>

                <Modal.Footer className="d-flex align-items-center justify-content-between">
                    <div className="w-100 save-changes-form">
                        <div className="d-flex w-100 align-items-center justify-content-between savechange-btn-footer">
                            <Button onClick={handleSave} className="add-question-btn-green"
                                style={{ padding:"13px 25px", borderRadius:0, width:"90%" }}>
                                Save Changes
                            </Button>
                            <Link href="#" className="d-flex gap-2 me-2"
                                style={{ textDecoration:"none", color:"#463527", fontWeight:500 }}
                                onClick={e => { e.preventDefault(); deleteoptionmodShow(); }}>
                                <Image src="../images/icons/delete_b.svg" className="img-fluid" alt="delete" width={24} height={24} />
                            </Link>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* ── Delete confirmation modal ── */}
            <Modal show={deleteoptionshow} onHide={deleteoptionmodClose} animation={false} centered
                className="custom-theme-modal">
                <Modal.Header className="d-flex align-items-center justify-content-between pb-2">
                    <Modal.Title>Delete Question</Modal.Title>
                    <Image src="../images/icons/close-circle.svg" width={24} height={24} alt="Close"
                        style={{ cursor:"pointer" }} onClick={deleteoptionmodClose} />
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this question? This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-between">
                    <Button className="btn-company-add btn" style={{ padding:"13px 25px" }}
                        onClick={deleteoptionmodClose}>
                        Cancel
                    </Button>
                    <Button variant="" onClick={handleDelete} className="confrim-btn btn"
                        style={{ padding:"13px 25px", borderRadius:0 }}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};