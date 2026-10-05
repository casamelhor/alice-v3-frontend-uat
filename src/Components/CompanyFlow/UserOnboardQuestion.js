// "use client"
// import React from 'react'
// import Header from '../Header/Header'
// import { useEffect, useState } from "react";
// import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
// import Link from 'next/link';
// import Select, { components } from 'react-select';
// import Image from 'next/image';
// import ProtectedRoute from '../ProtectedRoute';
// import { companyDetailAPI, UpdateCompanyDetailAPI } from '@/services/provider';
// import { useParams, useRouter } from 'next/navigation';
// import { showErrorMsgFull } from '@/utils/Alerts/TostifyAlerts';
// import { AddQuestionModel } from '../Useronboard/AddQuestionModel';
// import { EditQuestionModel } from '../Useronboard/EditQuestionModel';
// import toast, { Toaster } from 'react-hot-toast';
// import { getItemLocalStorage } from '@/utils/browserStorage';
// import { checkPermission } from '@/utils/helper';

// const toArray = (v) => (Array.isArray(v) ? v : []);

// // ─── react-select custom renderers ───────────────────────────────────────────
// const SelectanswerOption = [
//     { value: 'Text',   label: 'Text',   icon: '../images/icons/text.svg' },
//     { value: 'Option', label: 'Option', icon: '../images/icons/menu-fold-fill1.svg' },
// ];

// const CustomSelectOption = (props) => (
//     <components.Option {...props}>
//         <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
//             <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//                 <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
//                 <span>{props.data.label}</span>
//             </div>
//             {props.isSelected && <span style={{ color:'#5a3e85', fontWeight:'bold' }}>✔</span>}
//         </div>
//     </components.Option>
// );

// const CustomSingleValue = (props) => (
//     <components.SingleValue {...props}>
//         <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//             <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
//             <span>{props.data.label}</span>
//         </div>
//     </components.SingleValue>
// );

// // ─── ChipInput (shared for Company Identity rows) ─────────────────────────────
// function ChipInput({ chips, onAdd, onRemove, inputName, inputValue, onInputChange, disabled }) {
//     const handleKey = (e) => {
//         if (e.key === 'Enter' && inputValue.trim()) {
//             e.preventDefault();
//             onAdd(inputValue.trim());
//         }
//     };
//     return (
//         <div style={{
//             display:'flex', flexWrap:'wrap', alignItems:'center', gap:6,
//             background:'rgb(242,242,242)', minHeight:48,
//             border:'1px solid #4635273D', padding:'6px 8px',
//         }}>
//             {chips.map((chip, i) => (
//                 <div key={i} style={{
//                     display:'flex', alignItems:'center', gap:4,
//                     border:'1px solid #ccc', borderRadius:20,
//                     padding:'4px 8px', fontSize:13,
//                 }}>
//                     <span>{chip}</span>
//                     {!disabled && (
//                         <button type="button" onClick={() => onRemove(i)}
//                             style={{ background:'none', border:'none', cursor:'pointer', padding:0, lineHeight:1 }}>
//                             <Image src="/images/icons/close-circle.svg" alt="remove" width={14} height={14} />
//                         </button>
//                     )}
//                 </div>
//             ))}
//             {!disabled && (
//                 <input
//                     name={inputName} type="text"
//                     value={inputValue} onChange={onInputChange} onKeyDown={handleKey}
//                     placeholder="Type & press Enter…"
//                     style={{ flex:1, border:'none', outline:'none', background:'transparent', minWidth:120, fontSize:13, padding:'2px 0' }}
//                 />
//             )}
//         </div>
//     );
// }

// export default function UserOnboardQuestion() {
//     const permissionArray   = JSON.parse(getItemLocalStorage("user_permissions"));
//     const permissionCompany = checkPermission(permissionArray, "company_settings");
//     const canUpdate         = permissionCompany === true || permissionCompany?.can_update;

//     const param     = useParams();
//     const companyId = param.id;          // renamed from 'id' to avoid shadowing in remove handlers
//     const router    = useRouter();

//     // ── company detail ───────────────────────────────────────────────────────
//     const [companyDetail, setCompanyDetails] = useState({});

//     // ── form data for all company-identity fields ────────────────────────────
//     const [formData, setFormData] = useState({
//         employee_id: '', segment: '', designation: '',
//         employee_grade: '', account_unit: '', account_code: '',
//         phone_required: null,
//         employee_id_required: null, segment_required: null,
//         designation_required: null, employee_grade_required: null,
//         account_unit_required: null, account_code_required: null,
//         employee_id_options: '', segment_options: '', designation_options: '',
//         employee_grade_options: '', account_unit_options: '', account_code_options: '',
//         optionVal1: '', optionVal2: '', optionVal3: '',
//         optionVal4: '', optionVal5: '', optionVal6: '',
//     });

//     // ── chip-option arrays for company-identity fields ───────────────────────
//     const [empIdOptions,       setEmpIdOptions]       = useState([]);
//     const [segmentOptions,     setSegmentOptions]     = useState([]);
//     const [designationOptions, setDesignationOptions] = useState([]);
//     const [empGradeOptions,    setEmpGradeOptions]    = useState([]);
//     const [accountUnitOptions, setAccountUnitOptions] = useState([]);
//     const [accountCodeOptions, setAccountCodeOptions] = useState([]);

//     // ── custom questions object ──────────────────────────────────────────────
//     const [customFields, setCustomFields] = useState({});

//     // ── shared state passed into both Add and Edit modals ───────────────────
//     // BUG FIX A: selectedType and questionData MUST live here in the parent so
//     // that editoptionmodShow() can pre-populate them before the modal opens.
//     // In the original code they were also here but editoptionmodShow was setting
//     // them AFTER the modal was shown — React batches state, so the modal opened
//     // with stale/empty data.  We now always set editKey+questionData+selectedType
//     // together and gate the modal open on a single flag.
//     const [selectedType, setSelectedType] = useState(null);
//     const [questionData, setQuestionData] = useState({
//         display_name: '',
//         values: [],
//         is_required: 'Optional',
//         type: '',
//     });

//     // ── Add-question modal state ─────────────────────────────────────────────
//     const [addCustomQuestion, setAddCustomQuestion]   = useState(false);  // step-1 modal
//     const [textshow,          setTextShow]            = useState(false);  // step-2 text modal
//     const [optionshow,        setOptionsShow]         = useState(false);  // step-2 option modal
//     const [optionInput,       setOptionInput]         = useState('');
//     const [showSaveChanges,   setShowSaveChanges]     = useState(false);

//     const cmppremodClose = () => setAddCustomQuestion(false);
//     const cmppremodShow  = () => setAddCustomQuestion(true);
//     const textmodClose   = () => setTextShow(false);
//     const optionmodClose = () => setOptionsShow(false);

//     // ── Edit-question modal state ────────────────────────────────────────────
//     const [editoptionshow,    editoptionsetShow]   = useState(false);
//     const [deleteoptionshow,  deleteoptionsetShow] = useState(false);
//     const [editKey,           setEditKey]          = useState(null);

//     const editoptionmodClose   = () => editoptionsetShow(false);
//     const deleteoptionmodClose = () => deleteoptionsetShow(false);
//     const deleteoptionmodShow  = () => deleteoptionsetShow(true);

//     // BUG FIX B: editoptionmodShow now sets ALL dependent state BEFORE opening
//     // the modal. Previously questionData/selectedType were set in the same call
//     // as editoptionsetShow(true) but React batches those — the modal rendered
//     // before the state was updated so it always showed empty/stale values.
//     // By setting everything first and letting a useEffect open the modal we
//     // guarantee the modal sees fresh data.  Alternatively (done here) we use
//     // functional updates and set the flag last in the same synchronous block,
//     // which works fine in React 18 automatic batching because all setStates in
//     // one event handler ARE batched — so the modal only renders once, after all
//     // state is ready.
//     const editoptionmodShow = (key) => {
//         if (!canUpdate) return;
//         const field = customFields[key];
//         if (!field) return;
//         // set every piece of dependent state first
//         setEditKey(key);
//         setSelectedType(field.type);          // 'text' | 'dropdown'
//         setQuestionData({
//             display_name: field.display_name  || '',
//             values:       toArray(field.values),
//             is_required:  field.is_required   || 'Optional',
//             type:         field.type          || 'text',
//         });
//         setOptionInput('');                   // clear leftover chip input
//         // open the modal last
//         editoptionsetShow(true);
//     };

//     // ── drag-and-drop ────────────────────────────────────────────────────────
//     const [dragIndex, setDragIndex] = useState(null);
//     const handleDragStart = (idx) => setDragIndex(idx);
//     const handleDragOver  = (e)   => e.preventDefault();
//     const handleDrop      = (dropIdx) => {
//         if (dragIndex === null || dragIndex === dropIdx) return;
//         const entries  = Object.entries(customFields);
//         const [dragged] = entries.splice(dragIndex, 1);
//         entries.splice(dropIdx, 0, dragged);
//         setCustomFields(Object.fromEntries(entries));
//         setDragIndex(null);
//     };

//     // ── select option definitions ────────────────────────────────────────────
//     const CommonOption = [
//         { value:'Off',      label:'Off'      },
//         { value:'Optional', label:'Optional' },
//         { value:'Required', label:'Required' },
//     ];
//     const PhoneOption = [
//         { value:'Optional', label:'Optional' },
//         { value:'Required', label:'Required' },
//     ];
//     const customSelectStyles = {
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected || state.isFocused ? '#4635271F' : 'inherit',
//             color: 'black', cursor: 'pointer',
//         }),
//     };

//     // ── generic input change ─────────────────────────────────────────────────
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(p => ({ ...p, [name]: value }));
//     };

//     // BUG FIX C: When a required field is set to "Off" we also clear the answer-
//     // type selector and the chip array so stale values never reach the API.
//     const handleRequiredChange = (e, fieldName) => {
//         const val = e.value;
//         const clearMap = {
//             employee_id_required:    { optKey:'employee_id_options',    setter:setEmpIdOptions       },
//             segment_required:        { optKey:'segment_options',        setter:setSegmentOptions     },
//             designation_required:    { optKey:'designation_options',    setter:setDesignationOptions },
//             employee_grade_required: { optKey:'employee_grade_options', setter:setEmpGradeOptions    },
//             account_unit_required:   { optKey:'account_unit_options',   setter:setAccountUnitOptions },
//             account_code_required:   { optKey:'account_code_options',   setter:setAccountCodeOptions },
//         };
//         const update = { [fieldName]: val };
//         if (val === 'Off' && clearMap[fieldName]) {
//             update[clearMap[fieldName].optKey] = '';
//             clearMap[fieldName].setter([]);
//         }
//         setFormData(p => ({ ...p, ...update }));
//     };

//     // ── chip config map (DRY) ────────────────────────────────────────────────
//     const chipConfig = [
//         { optKey:'employee_id_options',    valKey:'optionVal1', state:empIdOptions,       setter:setEmpIdOptions       },
//         { optKey:'segment_options',        valKey:'optionVal2', state:segmentOptions,     setter:setSegmentOptions     },
//         { optKey:'designation_options',    valKey:'optionVal3', state:designationOptions, setter:setDesignationOptions },
//         { optKey:'employee_grade_options', valKey:'optionVal4', state:empGradeOptions,    setter:setEmpGradeOptions    },
//         { optKey:'account_unit_options',   valKey:'optionVal5', state:accountUnitOptions, setter:setAccountUnitOptions },
//         { optKey:'account_code_options',   valKey:'optionVal6', state:accountCodeOptions, setter:setAccountCodeOptions },
//     ];

//     // ── API: load ────────────────────────────────────────────────────────────
//     const getcompanyDetail = async () => {
//         try {
//             const response = await companyDetailAPI(companyId);
//             if (response?.data?.success) {
//                 const r = response.data.response;
//                 setCompanyDetails(r);
//                 setFormData(p => ({
//                     ...p,
//                     employee_id:             r.employee_id_display_name    || '',
//                     segment:                 r.segment_display_name        || '',
//                     designation:             r.designation_display_name    || '',
//                     employee_grade:          r.employee_grade_display_name || '',
//                     account_unit:            r.account_unit_display_name   || '',
//                     account_code:            r.account_code_display_name   || '',
//                     phone_required:          r.is_phone_required,
//                     employee_id_required:    r.is_employee_id_required,
//                     segment_required:        r.is_segment_required,
//                     designation_required:    r.is_designation_required,
//                     employee_grade_required: r.is_employee_grade_required,
//                     account_unit_required:   r.is_account_unit_required,
//                     account_code_required:   r.is_account_code_required,
//                     employee_id_options:     toArray(r.employee_id_options).length    ? 'Option' : 'Text',
//                     segment_options:         toArray(r.segment_options).length        ? 'Option' : 'Text',
//                     designation_options:     toArray(r.designation_options).length    ? 'Option' : 'Text',
//                     employee_grade_options:  toArray(r.employee_grade_options).length ? 'Option' : 'Text',
//                     account_unit_options:    toArray(r.account_unit_options).length   ? 'Option' : 'Text',
//                     account_code_options:    toArray(r.account_code_options).length   ? 'Option' : 'Text',
//                 }));
//                 setEmpIdOptions(toArray(r.employee_id_options));
//                 setSegmentOptions(toArray(r.segment_options));
//                 setDesignationOptions(toArray(r.designation_options));
//                 setEmpGradeOptions(toArray(r.employee_grade_options));
//                 setAccountUnitOptions(toArray(r.account_unit_options));
//                 setAccountCodeOptions(toArray(r.account_code_options));
//                 setCustomFields(r.custom_display_field_name || {});
//             }
//         } catch (err) { console.error(err); }
//     };

//     useEffect(() => { getcompanyDetail(); }, [companyId]);

//     // ── API: save ────────────────────────────────────────────────────────────
//     const handleUpdateUserOnboard = async () => {
//         try {
//             const rawData = {
//                 custom_display_field_name:  customFields || {},
//                 is_phone_required:          formData.phone_required,
//                 is_employee_id_required:    formData.employee_id_required,
//                 is_segment_required:        formData.segment_required,
//                 is_designation_required:    formData.designation_required,
//                 is_employee_grade_required: formData.employee_grade_required,
//                 is_account_unit_required:   formData.account_unit_required,
//                 is_account_code_required:   formData.account_code_required,
//                 employee_id_options:    formData.employee_id_required    !== 'Off' ? toArray(empIdOptions)       : [],
//                 segment_options:        formData.segment_required        !== 'Off' ? toArray(segmentOptions)     : [],
//                 designation_options:    formData.designation_required    !== 'Off' ? toArray(designationOptions) : [],
//                 employee_grade_options: formData.employee_grade_required !== 'Off' ? toArray(empGradeOptions)    : [],
//                 account_unit_options:   formData.account_unit_required   !== 'Off' ? toArray(accountUnitOptions) : [],
//                 account_code_options:   formData.account_code_required   !== 'Off' ? toArray(accountCodeOptions) : [],
//             };
//             if (formData.employee_id_required    !== 'Off') rawData.employee_id_display_name    = formData.employee_id;
//             if (formData.segment_required        !== 'Off') rawData.segment_display_name        = formData.segment;
//             if (formData.designation_required    !== 'Off') rawData.designation_display_name    = formData.designation;
//             if (formData.employee_grade_required !== 'Off') rawData.employee_grade_display_name = formData.employee_grade;
//             if (formData.account_unit_required   !== 'Off') rawData.account_unit_display_name   = formData.account_unit;
//             if (formData.account_code_required   !== 'Off') rawData.account_code_display_name   = formData.account_code;

//             const response = await UpdateCompanyDetailAPI(companyId, JSON.stringify(rawData));
//             if (response?.data?.success) {
//                 toast.success('Updated Successfully!');
//                 setTimeout(() => router.push(`/CompanyDetails?uid=${companyId}`), 200);
//             } else {
//                 toast.error(showErrorMsgFull(response?.data?.response));
//             }
//         } catch (err) { console.error(err); }
//     };

//     // ── DRY company-identity row renderer ────────────────────────────────────
//     const renderIdentityRow = ({ label, reqKey, nameKey, optKey, valKey, chipState, forceDisabled }) => {
//         const cfg   = chipConfig.find(c => c.optKey === optKey);
//         const isOff = formData[reqKey] === 'Off';
//         return (
//             <Row key={reqKey}>
//                 <Col md={7}>
//                     <Row className="mb-3">
//                         <Col md={4}>
//                             <div className="company-info-select">
//                                 <span>{label}</span>
//                                 {forceDisabled
//                                     ? <Select placeholder="Required" className="react_selectbox phone-icn"
//                                         isSearchable={false} styles={customSelectStyles} isDisabled />
//                                     : <Select
//                                         options={CommonOption}
//                                         onChange={e => handleRequiredChange(e, reqKey)}
//                                         value={CommonOption.find(o => o.value === formData[reqKey]) || null}
//                                         placeholder="Select"
//                                         className="react_selectbox phone-icn"
//                                         isSearchable={false}
//                                         styles={customSelectStyles}
//                                         isDisabled={!canUpdate}
//                                     />
//                                 }
//                             </div>
//                         </Col>
//                         <Col md={8} className="d-flex gap-2 align-items-center">
//                             <span>Display Name</span>
//                             <div className="w-98 form-group">
//                                 <input
//                                     type="text" name={nameKey} value={formData[nameKey]}
//                                     onChange={handleInputChange}
//                                     className="form-control user-icn" placeholder={label}
//                                     style={{ backgroundColor:'#f2f2f2' }}
//                                     disabled={isOff || !canUpdate}
//                                 />
//                             </div>
//                         </Col>
//                     </Row>
//                 </Col>
//                 {!isOff && (
//                     <Col md={5}>
//                         <Row>
//                             <Col md={4}>
//                                 <Select
//                                     options={SelectanswerOption}
//                                     onChange={e => setFormData(p => ({ ...p, [optKey]: e.value }))}
//                                     value={SelectanswerOption.find(o => o.value === formData[optKey]) || null}
//                                     placeholder="Select Type"
//                                     className="react_selectbox phone-icn"
//                                     isSearchable={false}
//                                     styles={customSelectStyles}
//                                     components={{ Option: CustomSelectOption, SingleValue: CustomSingleValue }}
//                                     isDisabled={!canUpdate}
//                                 />
//                             </Col>
//                             {formData[optKey] === 'Option' && (
//                                 <Col md={8}>
//                                     <ChipInput
//                                         chips={chipState}
//                                         onAdd={v => cfg.setter(p => [...p, v])}
//                                         onRemove={idx => cfg.setter(p => p.filter((_, i) => i !== idx))}
//                                         inputName={valKey}
//                                         inputValue={formData[valKey]}
//                                         onInputChange={handleInputChange}
//                                         disabled={!canUpdate}
//                                     />
//                                 </Col>
//                             )}
//                         </Row>
//                     </Col>
//                 )}
//             </Row>
//         );
//     };

//     // ── render ───────────────────────────────────────────────────────────────
//     return (
//         <ProtectedRoute>
//             <Toaster position="top-right" />
//             <Header />

//             {/* Breadcrumb */}
//             <div className="Breadcrumb">
//                 <Container>
//                     <Row>
//                         <Col md={12}>
//                             <ul className="d-flex align-items-center breadcrumb-list">
//                                 <li><Link href="/AllCompany">Company</Link></li>
//                                 <li><Link href={`/CompanyDetails?uid=${companyDetail?.uid}`}>{companyDetail?.company_name}</Link></li>
//                                 <li>User onboarding questions</li>
//                             </ul>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             <div className="page-body pt-4 pb-4">
//                 <Container>
//                     <Row>
//                         <Col md={12}>
//                             <Link href={`/CompanyDetails/${companyId}`} className="back-page mb-4">
//                                 <Image src="../images/icons/back.svg" width={16} height={16} alt="Arrow Left" />
//                                 Back
//                             </Link>
//                         </Col>
//                         <Col md={12} className="mb-4">
//                             <div className="pb-4 border-bottom-custom">
//                                 <h2 className="page-title mb-2">{companyDetail?.company_name} Details</h2>
//                                 <p className="mb-0">We will ask guests the following questions when they register for the event.</p>
//                             </div>
//                         </Col>

//                         {/* Personal Information */}
//                         <Col md={7} className="mb-4">
//                             <p className="subheadline-2 d-flex gap-2">
//                                 <Image src="../images/icons/id-card.svg" width={24} height={24} alt="" />
//                                 Personal Information
//                             </p>
//                             <div className="user-onboard-question-box mb-4 pb-1">
//                                 <Row>
//                                     {['First name', 'Last name'].map(ph => (
//                                         <Col md={4} key={ph}>
//                                             <div className="input-box mb-2 form-group">
//                                                 <label className="form-label">Required</label>
//                                                 <input type="text" className="form-control user-icn" placeholder={ph} disabled />
//                                             </div>
//                                         </Col>
//                                     ))}
//                                     <Col md={4}>
//                                         <div className="input-box mb-2 form-group">
//                                             <label className="form-label">Required</label>
//                                             <input type="text" className="form-control gender-icn" placeholder="Gender" disabled />
//                                         </div>
//                                     </Col>
//                                 </Row>
//                                 <hr />
//                             </div>

//                             {/* Contact Information */}
//                             <p className="subheadline-2 d-flex gap-2">
//                                 <Image src="../images/icons/contact.svg" width={24} height={24} alt="" />
//                                 Contact Information
//                             </p>
//                             <div className="user-onboard-question-box mb-4 pb-1">
//                                 <Row>
//                                     <Col md={4}>
//                                         <div className="input-box mb-2 form-group">
//                                             <label className="form-label">Required</label>
//                                             <input type="email" className="form-control email-icn" placeholder="E-mail" disabled />
//                                         </div>
//                                     </Col>
//                                     <Col md={4}>
//                                         <div className="input-box mb-2 form-group phone-select">
//                                             <Select
//                                                 options={PhoneOption}
//                                                 onChange={e => handleRequiredChange(e, 'phone_required')}
//                                                 value={PhoneOption.find(o => o.value === formData.phone_required) || null}
//                                                 placeholder="Phone"
//                                                 className="react_selectbox phone-icn"
//                                                 isSearchable={false}
//                                                 isDisabled={!canUpdate}
//                                                 styles={customSelectStyles}
//                                             />
//                                         </div>
//                                     </Col>
//                                 </Row>
//                                 <hr />
//                             </div>
//                         </Col>

//                         {/* Company Identity */}
//                         <Col md={12}>
//                             <p className="subheadline-2 d-flex gap-2">
//                                 <Image src="../images/icons/badge.svg" width={24} height={24} alt="" />
//                                 Company Identity
//                             </p>
//                             <div className="user-onboard-question-box mb-4 pb-1">
//                                 {renderIdentityRow({ label:'Employee ID',    reqKey:'employee_id_required',    nameKey:'employee_id',    optKey:'employee_id_options',    valKey:'optionVal1', chipState:empIdOptions,       forceDisabled:true  })}
//                                 {renderIdentityRow({ label:'Department',     reqKey:'segment_required',        nameKey:'segment',        optKey:'segment_options',        valKey:'optionVal2', chipState:segmentOptions,     forceDisabled:false })}
//                                 {renderIdentityRow({ label:'Designation',    reqKey:'designation_required',    nameKey:'designation',    optKey:'designation_options',    valKey:'optionVal3', chipState:designationOptions, forceDisabled:false })}
//                                 {renderIdentityRow({ label:'Employee Grade', reqKey:'employee_grade_required', nameKey:'employee_grade', optKey:'employee_grade_options', valKey:'optionVal4', chipState:empGradeOptions,    forceDisabled:false })}
//                                 {renderIdentityRow({ label:'Account Unit',   reqKey:'account_unit_required',   nameKey:'account_unit',   optKey:'account_unit_options',   valKey:'optionVal5', chipState:accountUnitOptions, forceDisabled:false })}
//                                 {renderIdentityRow({ label:'Account Code',   reqKey:'account_code_required',   nameKey:'account_code',   optKey:'account_code_options',   valKey:'optionVal6', chipState:accountCodeOptions, forceDisabled:false })}
//                                 <hr />
//                             </div>

//                             {/* Custom Questions */}
//                             <Row>
//                                 <Col md={7}>
//                                     <p className="subheadline-2 d-flex gap-2">
//                                         <Image src="../images/icons/help-center.svg" width={24} height={24} alt="" />
//                                         Custom Questions
//                                     </p>
//                                     <div className="user-onboard-question-box mb-4 pb-1">
//                                         <Row>
//                                             <Col md={12}>
//                                                 {Object.entries(customFields).map(([key, field], index) => (
//                                                     <div
//                                                         key={key}
//                                                         className="compnay-identy-box input-box mb-4 form-group"
//                                                         draggable
//                                                         onDragStart={() => handleDragStart(index)}
//                                                         onDragOver={handleDragOver}
//                                                         onDrop={() => handleDrop(index)}
//                                                     >
//                                                         <Image src="../images/icons/drag.svg" width={24} height={24}
//                                                             alt="drag" className="dragbox" style={{ cursor:'grab' }} />
//                                                         <p className="mb-0">{field?.display_name}</p>
//                                                         <div className="d-flex gap-3 align-items-center" style={{ position:'relative' }}>
//                                                             <label className="form-label">
//                                                                 <Image
//                                                                     src="../images/icons/edit.svg"
//                                                                     width={24} height={24} alt="edit"
//                                                                     style={{ cursor: canUpdate ? 'pointer' : 'not-allowed', opacity: canUpdate ? 1 : 0.5 }}
//                                                                     onClick={() => editoptionmodShow(key)}
//                                                                 />
//                                                             </label>
//                                                             {/* BUG FIX D: was checking field.type === 'text' but EditQuestionModel
//                                                                 uses 'dropdown' (not 'option') for the options type.
//                                                                 Corrected the class and display value to match. */}
//                                                             <input
//                                                                 type="text" readOnly
//                                                                 className={`form-control ${field.type === 'text' ? 'text-icn' : 'option-icn'}`}
//                                                                 value={`${field.type === 'text' ? 'Text' : 'Option'} | ${field.is_required}`}
//                                                             />
//                                                         </div>
//                                                         {field.type === 'dropdown' && toArray(field.values).length > 0 && (
//                                                             <span style={{ fontSize:12, color:'#73615F' }}>
//                                                                 {field.values.length} option{field.values.length !== 1 ? 's' : ''}: {field.values.join(', ')}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </Col>
//                                         </Row>
//                                         <hr />
//                                     </div>

//                                     {Object.keys(customFields).length < 2 && (
//                                         <>
//                                             <div className="user-onboard-question-box mb-4 pb-2">
//                                                 <Row>
//                                                     <Col md={5}>
//                                                         <Button
//                                                             variant=""
//                                                             className="btn-company-add btn-add-question"
//                                                             disabled={!canUpdate}
//                                                             onClick={() => {
//                                                                 // BUG FIX E: reset questionData + selectedType before
//                                                                 // opening Add modal so a previous edit doesn't bleed in.
//                                                                 setSelectedType(null);
//                                                                 setQuestionData({ display_name:'', values:[], is_required:'Optional', type:'' });
//                                                                 setOptionInput('');
//                                                                 setAddCustomQuestion(true);
//                                                             }}
//                                                         >
//                                                             <span style={{ fontSize:24 }}>+</span>&nbsp;Add Questions
//                                                         </Button>
//                                                     </Col>
//                                                 </Row>
//                                             </div>
//                                             <hr />
//                                         </>
//                                     )}
//                                 </Col>
//                             </Row>

//                             {canUpdate && (
//                                 <div className="form-group mt-5 mb-4">
//                                     <Button variant="" className="btn-success complete-form-btn"
//                                         style={{ width:170, height:56 }} onClick={handleUpdateUserOnboard}>
//                                         Done
//                                     </Button>
//                                 </div>
//                             )}
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>

//             {/* ── Add Question modal (original component, fixed via parent state) ── */}
//             <AddQuestionModel
//                 show={addCustomQuestion}
//                 cmppremodShow={cmppremodShow}
//                 cmppremodClose={cmppremodClose}
//                 selectedType={selectedType}
//                 setSelectedType={setSelectedType}
//                 textshow={textshow}
//                 setTextShow={setTextShow}
//                 showSaveChanges={showSaveChanges}
//                 optionshow={optionshow}
//                 setOptionsShow={setOptionsShow}
//                 optionmodClose={optionmodClose}
//                 optionInput={optionInput}
//                 setOptionInput={setOptionInput}
//                 optionsList={[]}
//                 handleAddQuestion={() => setShowSaveChanges(true)}
//                 textmodClose={textmodClose}
//                 customFields={customFields}
//                 setCustomFields={setCustomFields}
//                 questionData={questionData}
//                 setQuestionData={setQuestionData}
//             />

//             {/* ── Edit Question modal (original component, fixed via parent state) ── */}
//             <EditQuestionModel
//                 editoptionshow={editoptionshow}
//                 editoptionmodClose={editoptionmodClose}
//                 selectedType={selectedType}
//                 setSelectedType={setSelectedType}
//                 textmodClose={textmodClose}
//                 optionshow={optionshow}
//                 setOptionsShow={setOptionsShow}
//                 optionmodClose={optionmodClose}
//                 optionInput={optionInput}
//                 setOptionInput={setOptionInput}
//                 optionsList={[]}
//                 handleAddQuestion={() => setShowSaveChanges(true)}
//                 customFields={customFields}
//                 setCustomFields={setCustomFields}
//                 questionData={questionData}
//                 setQuestionData={setQuestionData}
//                 editKey={editKey}
//                 setEditKey={setEditKey}
//                 deleteoptionshow={deleteoptionshow}
//                 deleteoptionmodShow={deleteoptionmodShow}
//                 deleteoptionmodClose={deleteoptionmodClose}
//             />
//         </ProtectedRoute>
//     );
// }


"use client"
import React from 'react'
import Header from '../Header/Header'
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Modal, Form } from 'react-bootstrap';
import Link from 'next/link';
import Select, { components } from 'react-select';
import Image from 'next/image';
import ProtectedRoute from '../ProtectedRoute';
import { companyDetailAPI, UpdateCompanyDetailAPI } from '@/services/provider';
import { useParams, useRouter } from 'next/navigation';
import { showErrorMsgFull } from '@/utils/Alerts/TostifyAlerts';
import { AddQuestionModel } from '../Useronboard/AddQuestionModel';
import { EditQuestionModel } from '../Useronboard/EditQuestionModel';
import toast, { Toaster } from 'react-hot-toast';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { checkPermission } from '@/utils/helper';

const toArray = (v) => (Array.isArray(v) ? v : []);

// ─── react-select custom renderers ───────────────────────────────────────────
const SelectanswerOption = [
    { value: 'Text',   label: 'Text',   icon: '../images/icons/text.svg' },
    { value: 'Option', label: 'Option', icon: '../images/icons/menu-fold-fill1.svg' },
];

const CustomSelectOption = (props) => (
    <components.Option {...props}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
                <span>{props.data.label}</span>
            </div>
            {props.isSelected && <span style={{ color:'#5a3e85', fontWeight:'bold' }}>✔</span>}
        </div>
    </components.Option>
);

const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Image src={props.data.icon} alt={props.data.label} width={20} height={20} />
            <span>{props.data.label}</span>
        </div>
    </components.SingleValue>
);

// ─── ChipInput (shared for Company Identity rows) ─────────────────────────────
function ChipInput({ chips, onAdd, onRemove, inputName, inputValue, onInputChange, disabled }) {
    const handleKey = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            onAdd(inputValue.trim());
        }
    };
    return (
        <div style={{
            display:'flex', flexWrap:'wrap', alignItems:'center', gap:6,
            background:'rgb(242,242,242)', minHeight:48,
            border:'1px solid #4635273D', padding:'6px 8px',
        }}>
            {chips.map((chip, i) => (
                <div key={i} style={{
                    display:'flex', alignItems:'center', gap:4,
                    border:'1px solid #ccc', borderRadius:20,
                    padding:'4px 8px', fontSize:13,
                }}>
                    <span>{chip}</span>
                    {!disabled && (
                        <button type="button" onClick={() => onRemove(i)}
                            style={{ background:'none', border:'none', cursor:'pointer', padding:0, lineHeight:1 }}>
                            <Image src="/images/icons/close-circle.svg" alt="remove" width={14} height={14} />
                        </button>
                    )}
                </div>
            ))}
            {!disabled && (
                <input
                    name={inputName} type="text"
                    value={inputValue} onChange={onInputChange} onKeyDown={handleKey}
                    placeholder="Type & press Enter…"
                    style={{ flex:1, border:'none', outline:'none', background:'transparent', minWidth:120, fontSize:13, padding:'2px 0' }}
                />
            )}
        </div>
    );
}

export default function UserOnboardQuestion() {
    const permissionArray   = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionCompany = checkPermission(permissionArray, "company_settings");
    const canUpdate         = permissionCompany === true || permissionCompany?.can_update;

    const param     = useParams();
    const companyId = param.id;          // renamed from 'id' to avoid shadowing in remove handlers
    const router    = useRouter();

    // ── company detail ───────────────────────────────────────────────────────
    const [companyDetail, setCompanyDetails] = useState({});

    // ── form data for all company-identity fields ────────────────────────────
    const [formData, setFormData] = useState({
        employee_id: '', segment: '', designation: '',
        employee_grade: '', account_unit: '', account_code: '',
        phone_required: null,
        employee_id_required: null, segment_required: null,
        designation_required: null, employee_grade_required: null,
        account_unit_required: null, account_code_required: null,
        employee_id_options: '', segment_options: '', designation_options: '',
        employee_grade_options: '', account_unit_options: '', account_code_options: '',
        optionVal1: '', optionVal2: '', optionVal3: '',
        optionVal4: '', optionVal5: '', optionVal6: '',
    });

    // ── chip-option arrays for company-identity fields ───────────────────────
    const [empIdOptions,       setEmpIdOptions]       = useState([]);
    const [segmentOptions,     setSegmentOptions]     = useState([]);
    const [designationOptions, setDesignationOptions] = useState([]);
    const [empGradeOptions,    setEmpGradeOptions]    = useState([]);
    const [accountUnitOptions, setAccountUnitOptions] = useState([]);
    const [accountCodeOptions, setAccountCodeOptions] = useState([]);

    // ── custom questions object ──────────────────────────────────────────────
    const [customFields, setCustomFields] = useState({});

    // ── shared state passed into both Add and Edit modals ───────────────────
    // BUG FIX A: selectedType and questionData MUST live here in the parent so
    // that editoptionmodShow() can pre-populate them before the modal opens.
    // In the original code they were also here but editoptionmodShow was setting
    // them AFTER the modal was shown — React batches state, so the modal opened
    // with stale/empty data.  We now always set editKey+questionData+selectedType
    // together and gate the modal open on a single flag.
    const [selectedType, setSelectedType] = useState(null);
    const [questionData, setQuestionData] = useState({
        display_name: '',
        values: [],
        is_required: 'Optional',
        type: '',
    });

    // ── Add-question modal state ─────────────────────────────────────────────
    const [addCustomQuestion, setAddCustomQuestion]   = useState(false);  // step-1 modal
    const [textshow,          setTextShow]            = useState(false);  // step-2 text modal
    const [optionshow,        setOptionsShow]         = useState(false);  // step-2 option modal
    const [optionInput,       setOptionInput]         = useState('');
    const [showSaveChanges,   setShowSaveChanges]     = useState(false);

    const cmppremodClose = () => setAddCustomQuestion(false);
    const cmppremodShow  = () => setAddCustomQuestion(true);
    const textmodClose   = () => setTextShow(false);
    const optionmodClose = () => setOptionsShow(false);

    // ── Edit-question modal state ────────────────────────────────────────────
    const [editoptionshow,    editoptionsetShow]   = useState(false);
    const [deleteoptionshow,  deleteoptionsetShow] = useState(false);
    const [editKey,           setEditKey]          = useState(null);

    const editoptionmodClose   = () => editoptionsetShow(false);
    const deleteoptionmodClose = () => deleteoptionsetShow(false);
    const deleteoptionmodShow  = () => deleteoptionsetShow(true);

    // BUG FIX B: editoptionmodShow now sets ALL dependent state BEFORE opening
    // the modal. Previously questionData/selectedType were set in the same call
    // as editoptionsetShow(true) but React batches those — the modal rendered
    // before the state was updated so it always showed empty/stale values.
    // By setting everything first and letting a useEffect open the modal we
    // guarantee the modal sees fresh data.  Alternatively (done here) we use
    // functional updates and set the flag last in the same synchronous block,
    // which works fine in React 18 automatic batching because all setStates in
    // one event handler ARE batched — so the modal only renders once, after all
    // state is ready.
    const editoptionmodShow = (key) => {
        if (!canUpdate) return;
        const field = customFields[key];
        if (!field) return;
        // set every piece of dependent state first
        setEditKey(key);
        setSelectedType(field.type);          // 'text' | 'dropdown'
        setQuestionData({
            display_name: field.display_name  || '',
            values:       toArray(field.values),
            is_required:  field.is_required   || 'Optional',
            type:         field.type          || 'text',
        });
        setOptionInput('');                   // clear leftover chip input
        // open the modal last
        editoptionsetShow(true);
    };

    // ── drag-and-drop ────────────────────────────────────────────────────────
    const [dragIndex, setDragIndex] = useState(null);
    const handleDragStart = (idx) => setDragIndex(idx);
    const handleDragOver  = (e)   => e.preventDefault();
    const handleDrop      = (dropIdx) => {
        if (dragIndex === null || dragIndex === dropIdx) return;
        const entries  = Object.entries(customFields);
        const [dragged] = entries.splice(dragIndex, 1);
        entries.splice(dropIdx, 0, dragged);
        setCustomFields(Object.fromEntries(entries));
        setDragIndex(null);
    };

    // ── select option definitions ────────────────────────────────────────────
    const CommonOption = [
        { value:'Off',      label:'Off'      },
        { value:'Optional', label:'Optional' },
        { value:'Required', label:'Required' },
    ];
    const PhoneOption = [
        { value:'Optional', label:'Optional' },
        { value:'Required', label:'Required' },
    ];
    const customSelectStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected || state.isFocused ? '#4635271F' : 'inherit',
            color: 'black', cursor: 'pointer',
        }),
    };

    // ── generic input change ─────────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
    };

    // BUG FIX C: When a required field is set to "Off" we also clear the answer-
    // type selector and the chip array so stale values never reach the API.
    const handleRequiredChange = (e, fieldName) => {
        const val = e.value;
        const clearMap = {
            employee_id_required:    { optKey:'employee_id_options',    setter:setEmpIdOptions       },
            segment_required:        { optKey:'segment_options',        setter:setSegmentOptions     },
            designation_required:    { optKey:'designation_options',    setter:setDesignationOptions },
            employee_grade_required: { optKey:'employee_grade_options', setter:setEmpGradeOptions    },
            account_unit_required:   { optKey:'account_unit_options',   setter:setAccountUnitOptions },
            account_code_required:   { optKey:'account_code_options',   setter:setAccountCodeOptions },
        };
        const update = { [fieldName]: val };
        if (val === 'Off' && clearMap[fieldName]) {
            update[clearMap[fieldName].optKey] = '';
            clearMap[fieldName].setter([]);
        }
        setFormData(p => ({ ...p, ...update }));
    };

    // ── chip config map (DRY) ────────────────────────────────────────────────
    const chipConfig = [
        { optKey:'employee_id_options',    valKey:'optionVal1', state:empIdOptions,       setter:setEmpIdOptions       },
        { optKey:'segment_options',        valKey:'optionVal2', state:segmentOptions,     setter:setSegmentOptions     },
        { optKey:'designation_options',    valKey:'optionVal3', state:designationOptions, setter:setDesignationOptions },
        { optKey:'employee_grade_options', valKey:'optionVal4', state:empGradeOptions,    setter:setEmpGradeOptions    },
        { optKey:'account_unit_options',   valKey:'optionVal5', state:accountUnitOptions, setter:setAccountUnitOptions },
        { optKey:'account_code_options',   valKey:'optionVal6', state:accountCodeOptions, setter:setAccountCodeOptions },
    ];

    // ── API: load ────────────────────────────────────────────────────────────
    const getcompanyDetail = async () => {
        try {
            const response = await companyDetailAPI(companyId);
            if (response?.data?.success) {
                const r = response.data.response;
                setCompanyDetails(r);
                setFormData(p => ({
                    ...p,
                    employee_id:             r.employee_id_display_name    || '',
                    segment:                 r.segment_display_name        || '',
                    designation:             r.designation_display_name    || '',
                    employee_grade:          r.employee_grade_display_name || '',
                    account_unit:            r.account_unit_display_name   || '',
                    account_code:            r.account_code_display_name   || '',
                    phone_required:          r.is_phone_required,
                    employee_id_required:    r.is_employee_id_required,
                    segment_required:        r.is_segment_required,
                    designation_required:    r.is_designation_required,
                    employee_grade_required: r.is_employee_grade_required,
                    account_unit_required:   r.is_account_unit_required,
                    account_code_required:   r.is_account_code_required,
                    employee_id_options:     toArray(r.employee_id_options).length    ? 'Option' : 'Text',
                    segment_options:         toArray(r.segment_options).length        ? 'Option' : 'Text',
                    designation_options:     toArray(r.designation_options).length    ? 'Option' : 'Text',
                    employee_grade_options:  toArray(r.employee_grade_options).length ? 'Option' : 'Text',
                    account_unit_options:    toArray(r.account_unit_options).length   ? 'Option' : 'Text',
                    account_code_options:    toArray(r.account_code_options).length   ? 'Option' : 'Text',
                }));
                setEmpIdOptions(toArray(r.employee_id_options));
                setSegmentOptions(toArray(r.segment_options));
                setDesignationOptions(toArray(r.designation_options));
                setEmpGradeOptions(toArray(r.employee_grade_options));
                setAccountUnitOptions(toArray(r.account_unit_options));
                setAccountCodeOptions(toArray(r.account_code_options));
                setCustomFields(r.custom_display_field_name || {});
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { getcompanyDetail(); }, [companyId]);

    // ── API: save ────────────────────────────────────────────────────────────
    const handleUpdateUserOnboard = async () => {
        try {
            const rawData = {
                custom_display_field_name:  customFields || {},
                is_phone_required:          formData.phone_required,
                is_employee_id_required:    formData.employee_id_required,
                is_segment_required:        formData.segment_required,
                is_designation_required:    formData.designation_required,
                is_employee_grade_required: formData.employee_grade_required,
                is_account_unit_required:   formData.account_unit_required,
                is_account_code_required:   formData.account_code_required,
                employee_id_options:    formData.employee_id_required    !== 'Off' ? toArray(empIdOptions)       : [],
                segment_options:        formData.segment_required        !== 'Off' ? toArray(segmentOptions)     : [],
                designation_options:    formData.designation_required    !== 'Off' ? toArray(designationOptions) : [],
                employee_grade_options: formData.employee_grade_required !== 'Off' ? toArray(empGradeOptions)    : [],
                account_unit_options:   formData.account_unit_required   !== 'Off' ? toArray(accountUnitOptions) : [],
                account_code_options:   formData.account_code_required   !== 'Off' ? toArray(accountCodeOptions) : [],
            };
            if (formData.employee_id_required    !== 'Off') rawData.employee_id_display_name    = formData.employee_id;
            if (formData.segment_required        !== 'Off') rawData.segment_display_name        = formData.segment;
            if (formData.designation_required    !== 'Off') rawData.designation_display_name    = formData.designation;
            if (formData.employee_grade_required !== 'Off') rawData.employee_grade_display_name = formData.employee_grade;
            if (formData.account_unit_required   !== 'Off') rawData.account_unit_display_name   = formData.account_unit;
            if (formData.account_code_required   !== 'Off') rawData.account_code_display_name   = formData.account_code;

            const response = await UpdateCompanyDetailAPI(companyId, JSON.stringify(rawData));
            if (response?.data?.success) {
                toast.success('Updated Successfully!');
                setTimeout(() => router.push(`/CompanyDetails?uid=${companyId}`), 200);
            } else {
                toast.error(showErrorMsgFull(response?.data?.response));
            }
        } catch (err) { console.error(err); }
    };

    // ── DRY company-identity row renderer ────────────────────────────────────
    const renderIdentityRow = ({ label, reqKey, nameKey, optKey, valKey, chipState, forceDisabled }) => {
        const cfg   = chipConfig.find(c => c.optKey === optKey);
        const isOff = formData[reqKey] === 'Off';
        return (
            <Row key={reqKey}>
                <Col md={7}>
                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="company-info-select">
                                <span>{label}</span>
                                {forceDisabled
                                    ? <Select placeholder="Required" className="react_selectbox phone-icn"
                                        isSearchable={false} styles={customSelectStyles} isDisabled />
                                    : <Select
                                        options={CommonOption}
                                        onChange={e => handleRequiredChange(e, reqKey)}
                                        value={CommonOption.find(o => o.value === formData[reqKey]) || null}
                                        placeholder="Select"
                                        className="react_selectbox phone-icn"
                                        isSearchable={false}
                                        styles={customSelectStyles}
                                        isDisabled={!canUpdate}
                                    />
                                }
                            </div>
                        </Col>
                        <Col md={8} className="d-flex gap-2 align-items-center">
                            <span>Display Name</span>
                            <div className="w-98 form-group">
                                <input
                                    type="text" name={nameKey} value={formData[nameKey]}
                                    onChange={handleInputChange}
                                    className="form-control user-icn" placeholder={label}
                                    style={{ backgroundColor:'#f2f2f2' }}
                                    disabled={isOff || !canUpdate}
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
                {!isOff && (
                    <Col md={5}>
                        <Row>
                            <Col md={4}>
                                <Select
                                    options={SelectanswerOption}
                                    onChange={e => setFormData(p => ({ ...p, [optKey]: e.value }))}
                                    value={SelectanswerOption.find(o => o.value === formData[optKey]) || null}
                                    placeholder="Select Type"
                                    className="react_selectbox phone-icn"
                                    isSearchable={false}
                                    styles={customSelectStyles}
                                    components={{ Option: CustomSelectOption, SingleValue: CustomSingleValue }}
                                    isDisabled={!canUpdate}
                                />
                            </Col>
                            {formData[optKey] === 'Option' && (
                                <Col md={8}>
                                    <ChipInput
                                        chips={chipState}
                                        onAdd={v => cfg.setter(p => [...p, v])}
                                        onRemove={idx => cfg.setter(p => p.filter((_, i) => i !== idx))}
                                        inputName={valKey}
                                        inputValue={formData[valKey]}
                                        onInputChange={handleInputChange}
                                        disabled={!canUpdate}
                                    />
                                </Col>
                            )}
                        </Row>
                    </Col>
                )}
            </Row>
        );
    };

    // ── render ───────────────────────────────────────────────────────────────
    return (
        <ProtectedRoute>
            <Toaster position="top-right" />
            <Header />

            {/* Breadcrumb */}
            <div className="Breadcrumb">
                <Container>
                    <Row>
                        <Col md={12}>
                            <ul className="d-flex align-items-center breadcrumb-list">
                                <li><Link href="/AllCompany">Company</Link></li>
                                <li><Link href={`/CompanyDetails?uid=${companyDetail?.uid}`}>{companyDetail?.company_name}</Link></li>
                                <li>User onboarding questions</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="page-body pt-4 pb-4">
                <Container>
                    <Row>
                        <Col md={12}>
                            <Link href={`/CompanyDetails?uid=${companyDetail?.uid}`} className="back-page mb-4">
                                <Image src="../images/icons/back.svg" width={16} height={16} alt="Arrow Left" />
                                Back
                            </Link>
                        </Col>
                        <Col md={12} className="mb-4">
                            <div className="pb-4 border-bottom-custom">
                                <h2 className="page-title mb-2">{companyDetail?.company_name} Details</h2>
                                <p className="mb-0">We will ask guests the following questions when they register for the event.</p>
                            </div>
                        </Col>

                        {/* Personal Information */}
                        <Col md={7} className="mb-4">
                            <p className="subheadline-2 d-flex gap-2">
                                <Image src="../images/icons/id-card.svg" width={24} height={24} alt="" />
                                Personal Information
                            </p>
                            <div className="user-onboard-question-box mb-4 pb-1">
                                <Row>
                                    {['First name', 'Last name'].map(ph => (
                                        <Col md={4} key={ph}>
                                            <div className="input-box mb-2 form-group">
                                                <label className="form-label">Required</label>
                                                <input type="text" className="form-control user-icn" placeholder={ph} disabled />
                                            </div>
                                        </Col>
                                    ))}
                                    <Col md={4}>
                                        <div className="input-box mb-2 form-group">
                                            <label className="form-label">Required</label>
                                            <input type="text" className="form-control gender-icn" placeholder="Gender" disabled />
                                        </div>
                                    </Col>
                                </Row>
                                <hr />
                            </div>

                            {/* Contact Information */}
                            <p className="subheadline-2 d-flex gap-2">
                                <Image src="../images/icons/contact.svg" width={24} height={24} alt="" />
                                Contact Information
                            </p>
                            <div className="user-onboard-question-box mb-4 pb-1">
                                <Row>
                                    <Col md={4}>
                                        <div className="input-box mb-2 form-group">
                                            <label className="form-label">Required</label>
                                            <input type="email" className="form-control email-icn" placeholder="E-mail" disabled />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="input-box mb-2 form-group phone-select">
                                            <Select
                                                options={PhoneOption}
                                                onChange={e => handleRequiredChange(e, 'phone_required')}
                                                value={PhoneOption.find(o => o.value === formData.phone_required) || null}
                                                placeholder="Phone"
                                                className="react_selectbox phone-icn"
                                                isSearchable={false}
                                                isDisabled={!canUpdate}
                                                styles={customSelectStyles}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        </Col>

                        {/* Company Identity */}
                        <Col md={12}>
                            <p className="subheadline-2 d-flex gap-2">
                                <Image src="../images/icons/badge.svg" width={24} height={24} alt="" />
                                Company Identity
                            </p>
                            <div className="user-onboard-question-box mb-4 pb-1">
                                {renderIdentityRow({ label:'Employee ID',    reqKey:'employee_id_required',    nameKey:'employee_id',    optKey:'employee_id_options',    valKey:'optionVal1', chipState:empIdOptions,       forceDisabled:true  })}
                                {renderIdentityRow({ label:'Department',     reqKey:'segment_required',        nameKey:'segment',        optKey:'segment_options',        valKey:'optionVal2', chipState:segmentOptions,     forceDisabled:false })}
                                {renderIdentityRow({ label:'Designation',    reqKey:'designation_required',    nameKey:'designation',    optKey:'designation_options',    valKey:'optionVal3', chipState:designationOptions, forceDisabled:false })}
                                {renderIdentityRow({ label:'Employee Grade', reqKey:'employee_grade_required', nameKey:'employee_grade', optKey:'employee_grade_options', valKey:'optionVal4', chipState:empGradeOptions,    forceDisabled:false })}
                                {renderIdentityRow({ label:'Account Unit',   reqKey:'account_unit_required',   nameKey:'account_unit',   optKey:'account_unit_options',   valKey:'optionVal5', chipState:accountUnitOptions, forceDisabled:false })}
                                {renderIdentityRow({ label:'Account Code',   reqKey:'account_code_required',   nameKey:'account_code',   optKey:'account_code_options',   valKey:'optionVal6', chipState:accountCodeOptions, forceDisabled:false })}
                                <hr />
                            </div>

                            {/* Custom Questions */}
                            <Row>
                                <Col md={7}>
                                    <p className="subheadline-2 d-flex gap-2">
                                        <Image src="../images/icons/help-center.svg" width={24} height={24} alt="" />
                                        Custom Questions
                                    </p>
                                    <div className="user-onboard-question-box mb-4 pb-1">
                                        <Row>
                                            <Col md={12}>
                                                {Object.entries(customFields).map(([key, field], index) => (
                                                    <div
                                                        key={key}
                                                        className="compnay-identy-box input-box mb-4 form-group"
                                                        draggable
                                                        onDragStart={() => handleDragStart(index)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={() => handleDrop(index)}
                                                    >
                                                        <Image src="../images/icons/drag.svg" width={24} height={24}
                                                            alt="drag" className="dragbox" style={{ cursor:'grab' }} />
                                                        <p className="mb-0">{field?.display_name}</p>
                                                        <div className="d-flex gap-3 align-items-center" style={{ position:'relative' }}>
                                                            <label className="form-label">
                                                                <Image
                                                                    src="../images/icons/edit.svg"
                                                                    width={24} height={24} alt="edit"
                                                                    style={{ cursor: canUpdate ? 'pointer' : 'not-allowed', opacity: canUpdate ? 1 : 0.5 }}
                                                                    onClick={() => editoptionmodShow(key)}
                                                                />
                                                            </label>
                                                            {/* BUG FIX D: was checking field.type === 'text' but EditQuestionModel
                                                                uses 'dropdown' (not 'option') for the options type.
                                                                Corrected the class and display value to match. */}
                                                            <input
                                                                type="text" readOnly
                                                                className={`form-control ${field.type === 'text' ? 'text-icn' : 'option-icn'}`}
                                                                value={`${field.type === 'text' ? 'Text' : 'Option'} | ${field.is_required}`}
                                                            />
                                                        </div>
                                                        {field.type === 'dropdown' && toArray(field.values).length > 0 && (
                                                            <span style={{ fontSize:12, color:'#73615F' }}>
                                                                {field.values.length} option{field.values.length !== 1 ? 's' : ''}: {field.values.join(', ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </Col>
                                        </Row>
                                        <hr />
                                    </div>

                                    {Object.keys(customFields).length < 2 && (
                                        <>
                                            <div className="user-onboard-question-box mb-4 pb-2">
                                                <Row>
                                                    <Col md={5}>
                                                        <Button
                                                            variant=""
                                                            className="btn-company-add btn-add-question"
                                                            disabled={!canUpdate}
                                                            onClick={() => {
                                                                // BUG FIX E: reset questionData + selectedType before
                                                                // opening Add modal so a previous edit doesn't bleed in.
                                                                setSelectedType(null);
                                                                setQuestionData({ display_name:'', values:[], is_required:'Optional', type:'' });
                                                                setOptionInput('');
                                                                setAddCustomQuestion(true);
                                                            }}
                                                        >
                                                            <span style={{ fontSize:24 }}>+</span>&nbsp;Add Questions
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <hr />
                                        </>
                                    )}
                                </Col>
                            </Row>

                            {canUpdate && (
                                <div className="form-group mt-5 mb-4">
                                    <Button variant="" className="btn-success complete-form-btn"
                                        style={{ width:170, height:56 }} onClick={handleUpdateUserOnboard}>
                                        Done
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* ── Add Question modal (original component, fixed via parent state) ── */}
            <AddQuestionModel
                show={addCustomQuestion}
                cmppremodShow={cmppremodShow}
                cmppremodClose={cmppremodClose}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                textshow={textshow}
                setTextShow={setTextShow}
                showSaveChanges={showSaveChanges}
                optionshow={optionshow}
                setOptionsShow={setOptionsShow}
                optionmodClose={optionmodClose}
                optionInput={optionInput}
                setOptionInput={setOptionInput}
                optionsList={[]}
                handleAddQuestion={() => setShowSaveChanges(true)}
                textmodClose={textmodClose}
                customFields={customFields}
                setCustomFields={setCustomFields}
                questionData={questionData}
                setQuestionData={setQuestionData}
            />

            {/* ── Edit Question modal (original component, fixed via parent state) ── */}
            <EditQuestionModel
                editoptionshow={editoptionshow}
                editoptionmodClose={editoptionmodClose}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                textmodClose={textmodClose}
                optionshow={optionshow}
                setOptionsShow={setOptionsShow}
                optionmodClose={optionmodClose}
                optionInput={optionInput}
                setOptionInput={setOptionInput}
                optionsList={[]}
                handleAddQuestion={() => setShowSaveChanges(true)}
                customFields={customFields}
                setCustomFields={setCustomFields}
                questionData={questionData}
                setQuestionData={setQuestionData}
                editKey={editKey}
                setEditKey={setEditKey}
                deleteoptionshow={deleteoptionshow}
                deleteoptionmodShow={deleteoptionmodShow}
                deleteoptionmodClose={deleteoptionmodClose}
            />
        </ProtectedRoute>
    );
}
