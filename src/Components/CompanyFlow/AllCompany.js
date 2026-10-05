// "use client"
// import React, { useEffect, useState } from 'react'
// import { Row, Col, Container, Button, Table, Thead } from 'react-bootstrap';
// import Image from 'next/image';
// import Header from '../Header/Header'
// import Link from 'next/link';
// import Select, { AriaOnFocus } from 'react-select';
// import { companyListAPI } from '@/services/provider';
// import ProtectedRoute from '../ProtectedRoute';
// import { getItemLocalStorage } from '@/utils/browserStorage';
// import { checkPermission } from '@/utils/helper';


// export default function AllCompany() {

//   const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
//   const permissionCompany = checkPermission(permissionArray, "company");

//   const canAdd = permissionCompany === true || permissionCompany?.can_add;
//   const canList = permissionCompany === true || permissionCompany?.can_list;
//   const canRetrieve = permissionCompany === true || permissionCompany?.can_retrieve;
//   const canUpdate = permissionCompany === true || permissionCompany?.can_update;
//   const canDelete = permissionCompany === true || permissionCompany?.can_delete;

//   const [searchKey, setSearchKey] = useState("");
//   const [page, setPage] = useState(1);
//   const [sortBy, setSortBy] = useState('');
//   const [companyList, setCompanyList] = useState([])
//   const sortoption = [
//     { value: "company_name", label: "Company Name" },
//     { value: "head_office_city", label: "Head Office City" }
//   ]

//   const [currentPage, setCurrentPage] = useState(1);
//   // const [pageSize, setPageSize] = useState(10);
//   const [pageSize] = useState(10);
//   const [company_count, setCompany_count] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);



//   // const paginatedUsers = userList.slice(
//   //   (currentPage - 1) * pageSize,
//   //   currentPage * pageSize
//   // );

//   const customStyles = {
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? "#4635271F"
//         : state.isFocused
//           ? "#4635271F" // Color on hover
//           : "inherit",
//       color: state.isSelected ? "#000" : "black",
//       cursor: "pointer", // Optional: improves UX on hover
//     }),
//   };

//   const getCompanyList = async () => {
//     try {
//       const response = await companyListAPI(
//         searchKey,
//         currentPage,
//         sortBy,
//         pageSize
//       );

//       if (response?.data?.success) {
//         setCompanyList(response?.data?.response || []);
//         setCompany_count(response?.data?.company_count || 0);
//         setTotalPages(response?.data?.total_page || 1);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };


//   useEffect(() => {
//     setCurrentPage(1); // reset page on search change
//   }, [searchKey]);

//   useEffect(() => {
//     getCompanyList();
//   }, [currentPage, searchKey, sortBy]);



//   // Calculate start and end indices
//   const start = companyList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
//   const end = Math.min(currentPage * pageSize, company_count);
//   // search filter 
//   // const filteredCompanyList = companyList.filter((item) => {
//   //   const key = searchKey.toLowerCase();
//   //   return (
//   //     item?.company_name?.toLowerCase().includes(key) ||
//   //     item?.head_office_city?.toLowerCase().includes(key)
//   //   );
//   // });
//   if (!canList) {
//     return <div className="text-center mt-5">No Permission</div>;
//   }

//   return (
//     <ProtectedRoute>
//       <Header />
//       <div className='page-body All-company pt-5 pb-5'>
//         <Container>
//           <Row>
//             <Col md={12} >
//               <div className='d-flex justify-content-between align-items-center mb-4'>
//                 <h2 className='page-title'>All Companies</h2>
//                 {canAdd && (
//                   <Link href="/AddCompany" className='btn-company-add ' >  <span style={{ fontSize: '24px' }}> + </span>  &nbsp;Add New Company</Link>
//                 )}
//               </div>
//             </Col>
//             <Col md={12}>

//               <div className='search-box mb-4'>
//                 <input
//                   type='text'
//                   value={searchKey}
//                   onChange={(e) => setSearchKey(e.target.value)}
//                   placeholder='Search by company name, or location'
//                   className='form-control'
//                 />
//                 <button className='btn btn-search' onClick={() => setCurrentPage(1)}>
//                   <Image
//                     src='/images/icons/search.svg'
//                     width={24}
//                     height={24}
//                     alt='Search'
//                   />
//                 </button>
//               </div>

//             </Col>
//             <Col md={12} >
//               <div className='d-flex justify-content-between align-items-center mb-4'>
//                 <p className='mb-0'> <strong>{companyList?.length}</strong>  Companies</p>
//                 <div className='filter-right-option d-flex gap-3'>
//                   {/* <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                     <p className='mb-0'>
//                       {company_count > 0
//                         ? `${start}-${end} of ${company_count}`
//                         : "0 results"}
//                     </p>
//                     <Image
//                       src='./images/icons/back.svg'
//                       className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
//                       alt='back'
//                       width={10}
//                       height={10}
//                       onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
//                     />

//                     <Image
//                       src='./images/icons/Arrows-right.svg'
//                       className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
//                       alt='right'
//                       width={29}
//                       height={29}
//                       onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
//                     />
//                   </div> */}

//                   <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
//                     <p className='mb-0'>
//                       {company_count > 0
//                         ? `${start}-${end} of ${company_count}`
//                         : "0 results"}
//                     </p>

//                     <Image
//                       src='./images/icons/back.svg'
//                       className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
//                       alt='back'
//                       width={10}
//                       height={10}
//                       onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
//                       style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
//                     />

//                     <Image
//                       src='./images/icons/Arrows-right.svg'
//                       className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
//                       alt='right'
//                       width={29}
//                       height={29}
//                       onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
//                       style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
//                     />
//                   </div>

//                   <Button variant="" className='btn-sort'> Sort by :
//                     <Select
//                       name="aria-role-select"
//                       options={sortoption}
//                       onChange={(e) => setSortBy(e.value)}
//                       placeholder="Name"
//                       className="react_selectbox"
//                       isSearchable={false}
//                       styles={customStyles}
//                     />
//                   </Button>
//                 </div>
//               </div>
//               <Table className='company-table' responsive>
//                 <thead>
//                   <tr>
//                     <th style={{ width: '25%' }}>Company Name</th>
//                     <th style={{ width: '25%' }}>Headoffice city</th>
//                     <th style={{ width: '25%' }}>Number of users</th>
//                     <th style={{ width: '20%' }}>Number of BRs Assigned</th>
//                     <th style={{ width: '20%' }}>
//                       <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' />

//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {companyList?.map((item, index) => (
//                     <tr key={index}>
//                       {/* <td>{item?.company_name} </td> */}
//                       <td>
//                         {item?.company_name}
//                         {item?.is_company_inactive && (
//                           <span className="text-danger ms-2 " style={{ fontSize: '13px' }} >INACTIVE</span>
//                         )}
//                       </td>
//                       <td>{item?.head_office_city ? item?.head_office_city : '-'}</td>
//                       <td>{item?.number_of_users}</td>
//                       <td>{item?.number_of_BRs_assigned}</td>
//                       <td>
//                         {canRetrieve && (
//                           <Link href={`/CompanyDetails?uid=${item?.uid}`} className='btn-table-action'>
//                             View Details
//                           </Link>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </ProtectedRoute>
//   )
// }

"use client"
import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Button, Table, Thead, Form } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import { companyListAPI, CompanyNotificationUpdateAPI, UpdateCompanyDetailAPI } from '@/services/provider';
import ProtectedRoute from '../ProtectedRoute';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { checkPermission } from '@/utils/helper';
import toast, { Toaster } from 'react-hot-toast';


export default function AllCompany() {

  const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
  const permissionCompany = checkPermission(permissionArray, "company");

  const canAdd = permissionCompany === true || permissionCompany?.can_add;
  const canList = permissionCompany === true || permissionCompany?.can_list;
  const canRetrieve = permissionCompany === true || permissionCompany?.can_retrieve;
  const canUpdate = permissionCompany === true || permissionCompany?.can_update;
  const canDelete = permissionCompany === true || permissionCompany?.can_delete;

  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [companyList, setCompanyList] = useState([]);
  const [openPicIndex, setOpenPicIndex] = useState(null);
  const sortoption = [
    { value: "company_name", label: "Company Name" },
    { value: "head_office_city", label: "Head Office City" },
    { value: "-company_name", label: "Z-A" }
  ]

  const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  const [pageSize] = useState(10);
  const [company_count, setCompany_count] = useState(0);
  const [totalPages, setTotalPages] = useState(1);



  // const paginatedUsers = userList.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );
  const toTitleCase = (str) =>
    str?.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) ?? '-';

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

  const getCompanyList = async () => {
    try {
      const response = await companyListAPI(
        searchKey,
        currentPage,
        sortBy,
        pageSize
      );

      if (response?.data?.success) {
        setCompanyList(response?.data?.response || []);
        setCompany_count(response?.data?.company_count || 0);
        setTotalPages(response?.data?.total_page || 1);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    setCurrentPage(1); // reset page on search change
  }, [searchKey]);

  useEffect(() => {
    getCompanyList();
  }, [currentPage, searchKey, sortBy]);



  const togglePicOption1 = (e, idx) => {
    e.preventDefault();
    setOpenPicIndex(openPicIndex === idx ? null : idx);
    // if (typeof toggleoptio1 === 'function') {
    //     toggleoptio1();
    // }
  }

  const handleNotificationSetting = async (value, key, id) => {
    try {
      const payload = {
        company_uid:id,
        [key]: value
      }
      const response = await CompanyNotificationUpdateAPI(payload);
      if (response.data.success) {        
        getCompanyList();
        toast.success("Success!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Calculate start and end indices
  const start = companyList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, company_count);
  // search filter 
  // const filteredCompanyList = companyList.filter((item) => {
  //   const key = searchKey.toLowerCase();
  //   return (
  //     item?.company_name?.toLowerCase().includes(key) ||
  //     item?.head_office_city?.toLowerCase().includes(key)
  //   );
  // });
  if (!canList) {
    return <div className="text-center mt-5">No Permission</div>;
  }

  return (
    <ProtectedRoute>
      <Header />
      <Toaster position="top-right" />
      <div className='page-body All-company pt-5 pb-5'>
        <Container>
          <Row>
            <Col md={12} >
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='page-title'>All Companies</h2>
                {canAdd && (
                  <Link href="/AddCompany" className='btn-company-add ' >  <span style={{ fontSize: '24px' }}> + </span>  &nbsp;Add New Company</Link>
                )}
              </div>
            </Col>
            <Col md={12}>

              <div className='search-box mb-4'>
                <input
                  type='text'
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder='Search by company name, or location'
                  className='form-control'
                />
                <button className='btn btn-search' onClick={() => setCurrentPage(1)}>
                  <Image
                    src='/images/icons/search.svg'
                    width={24}
                    height={24}
                    alt='Search'
                  />
                </button>
              </div>

            </Col>
            <Col md={12} >
              <div className='d-flex justify-content-between align-items-center mb-4'>
                {/* <p className='mb-0'> <strong>{companyList?.length}</strong>  Companies</p> */}
                <p className='mb-0'>
                  {companyList?.length === 0
                    ? <span className="text-muted">No companies found</span>
                    : <><strong>{companyList?.length}</strong> Companies</>
                  }
                </p>
                <div className='filter-right-option d-flex gap-3'>
                  {/* <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                    <p className='mb-0'>
                      {company_count > 0
                        ? `${start}-${end} of ${company_count}`
                        : "0 results"}
                    </p>
                    <Image
                      src='./images/icons/back.svg'
                      className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
                      alt='back'
                      width={10}
                      height={10}
                      onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                    />

                    <Image
                      src='./images/icons/Arrows-right.svg'
                      className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
                      alt='right'
                      width={29}
                      height={29}
                      onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                    />
                  </div> */}

                  <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>
                    <p className='mb-0'>
                      {company_count > 0
                        ? `${start}-${end} of ${company_count}`
                        : "0 results"}
                    </p>

                    <Image
                      src='./images/icons/back.svg'
                      className={`img-fluid prev-a ${currentPage === 1 ? 'mute' : ''}`}
                      alt='back'
                      width={10}
                      height={10}
                      onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                      style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    />

                    <Image
                      src='./images/icons/Arrows-right.svg'
                      className={`img-fluid next-a ${currentPage === totalPages ? 'mute' : ''}`}
                      alt='right'
                      width={29}
                      height={29}
                      onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                      style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    />
                  </div>

                  <Button variant="" className='btn-sort'> Sort by :
                    <Select
                      name="aria-role-select"
                      options={sortoption}
                      onChange={(e) => setSortBy(e.value)}
                      placeholder="Name"
                      className="react_selectbox"
                      isSearchable={false}
                      styles={customStyles}
                    />
                  </Button>
                </div>
              </div>
              <Table className='company-table' responsive="sm" >
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Company Name</th>
                    <th style={{ width: '15%' }}>Headoffice city</th>
                    <th style={{ width: '15%' }}>Number of users</th>
                    <th style={{ width: '15%' }}>Notification Setting</th>
                    <th style={{ width: '15%' }}>Number of BRs Assigned</th>
                    <th style={{ width: '5%' }}>
                      <Image style={{margin: '0 0 0 auto'}} src='/images/icons/settings.svg' width={16} height={16} alt='Sort' />

                    </th>
                  </tr>
                </thead>
                {/* <tbody>
                  {companyList?.map((item, index) => (
                    <tr key={index}>                      
                      <td>
                        {item?.company_name}
                        {item?.is_company_inactive && (
                          <span className="text-danger ms-2 " style={{ fontSize: '13px' }} >INACTIVE</span>
                        )}
                      </td>
                      <td>{item?.head_office_city ? item?.head_office_city : '-'}</td>
                      <td>{item?.number_of_users}</td>
                      <td>{item?.number_of_BRs_assigned}</td>
                      <td>
                        {canRetrieve && (
                          <Link href={`/CompanyDetails?uid=${item?.uid}`} className='btn-table-action'>
                            View Details
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody> */}
                <tbody>
                  {companyList?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">
                        No companies found
                      </td>
                    </tr>
                  ) : (
                    companyList?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item?.company_name}
                          {item?.is_company_inactive && (
                            <span className="text-danger ms-2" style={{ fontSize: '13px' }}>INACTIVE</span>
                          )}
                        </td>
                        <td>{toTitleCase(item?.head_office_city)}</td>
                        <td>{item?.number_of_users}</td>
                        <td  >
                          <div className='d-flex gap-2'>
                          {(!item?.channel_configuration?.company_email_enabled && !item?.channel_configuration?.company_whatsapp_enabled 
                          && !item?.channel_configuration?.company_sms_enabled && !item?.channel_configuration?.cm_staff_email_enabled && 
                          !item?.channel_configuration?.cm_staff_whatsapp_enabled && !item?.channel_configuration?.cm_staff_sms_enabled) && "N/A"}
                          {item?.channel_configuration?.company_email_enabled && <Image src='./images/icons/Email_sent.svg' width={20} height={20} alt='open' />}
                          {item?.channel_configuration?.company_whatsapp_enabled && <Image src='./images/icons/whatsapp.svg' width={20} height={20} alt='open' />}
                          {item?.channel_configuration?.company_sms_enabled && <Image src='./images/icons/sms.svg' width={20} height={20} alt='open' />}
                          {item?.channel_configuration?.cm_staff_email_enabled && <Image src='./images/icons/cm-email.svg' width={20} height={20} alt='open' />}
                          {item?.channel_configuration?.cm_staff_whatsapp_enabled && <Image src='./images/icons/cm-whatsapp.svg' width={20} height={20} alt='open' />}
                          {item?.channel_configuration?.cm_staff_sms_enabled && <Image src='./images/icons/cm-sms.svg' width={20} height={20} alt='open' />}                          
                          </div>
                        </td>
                        <td>{item?.number_of_BRs_assigned}</td>
                        <td>
                          <div className='d-flex justify-end align-items-center'>
                            <div className='bt-abs position-relative'>
                              <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid' style={{ cursor: 'pointer' }} alt="female-icon" onClick={e => togglePicOption1(e, index)} />
                              <ul className={`change-pic-option ${openPicIndex === index ? "open" : ""}`}>
                                {canRetrieve && (
                                  <>
                                    <li >
                                      <Link className='justify-between'  href={`/CompanyDetails?uid=${item?.uid}`} >
                                        View Details
                                        <Image src='./images/icons/open_in_new.svg' width={24} height={24} alt='open' />
                                      </Link>
                                    </li>
                                    <hr style={{ margin: "6px 0" }} />
                                  </>
                                )}
                                <li className='justify-between d-flex' >
                                  Company Email
                                  <Form.Check
                                    type="switch" id={`edit-required-switch-${index}`} className="custom-switch"
                                    checked={item?.channel_configuration?.company_email_enabled}
                                    onChange={(e) => handleNotificationSetting(e.target.checked, 'company_email_enabled', item?.uid)}
                                  />
                                </li>
                                <li className='justify-between d-flex' >
                                  Company Whatsapp
                                  <Form.Check
                                    type="switch" id="edit-required-switch" className="custom-switch"
                                    checked={item?.channel_configuration?.company_whatsapp_enabled}
                                    onChange={(e) => handleNotificationSetting(e.target.checked, 'company_whatsapp_enabled', item?.uid)}
                                  />
                                </li>
                                <li className='justify-between d-flex' >
                                  Company SMS
                                  <Form.Check
                                    type="switch" id="edit-required-switch" className="custom-switch"
                                    checked={item?.channel_configuration?.company_sms_enabled}
                                    onChange={(e) => handleNotificationSetting(e.target.checked, 'company_sms_enabled', item?.uid)}
                                  />
                                </li>
                                <li className='justify-between d-flex' >
                                  Cm Staff Email
                                  <Form.Check
                                    type="switch" id="edit-required-switch" className="custom-switch"
                                    checked={item?.channel_configuration?.cm_staff_email_enabled}
                                    onChange={(e) => handleNotificationSetting(e.target.checked, 'cm_staff_email_enabled', item?.uid)}
                                  />
                                </li>
                                <li className='justify-between d-flex' >
                                  Cm Staff Whatsapp
                                  <Form.Check
                                    type="switch" id="edit-required-switch" className="custom-switch"
                                    checked={item?.channel_configuration?.cm_staff_whatsapp_enabled}
                                    onChange={(e) => handleNotificationSetting(e.target.checked, 'cm_staff_whatsapp_enabled', item?.uid)}
                                  />
                                </li>
                                <li className='justify-between d-flex' >
                                  Cm Staff SMS
                                  <Form.Check
                                    type="switch" id="edit-required-switch" className="custom-switch"
                                    checked={item?.channel_configuration?.cm_staff_sms_enabled}
                                    onChange={(e) => handleNotificationSetting(e.target.checked, 'cm_staff_sms_enabled', item?.uid)}
                                  />
                                </li>

                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </ProtectedRoute>
  )
}
