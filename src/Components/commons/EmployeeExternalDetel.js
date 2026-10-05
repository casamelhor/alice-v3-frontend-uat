"use client"
import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export const EmployeeExternalDetel = ({ showsProfileExternal, profileClose, userDetails, editemploye, companyDetail, userCompany }) => {
    console.log('condition', companyDetail)
    console.log('star band', userCompany, userDetails)
    const router = useRouter();
    return (
        <Modal show={showsProfileExternal} onHide={profileClose} animation={false} centered className='custom-theme-modal status-height-70' >
            <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                <p className='d-flex align-items-center gap-3 font-18' style={{ color: '#73615F' }}>
                    External Details <Image src='../images/icons/bottom-arrow.svg' style={{ transform: 'rotate(180deg)', opacity: '.5' }} className='img-fluid' alt='top' width={12} height={12} />
                    <Image src='../images/icons/bottom-arrow.svg' className='img-fluid' alt='top' width={12} height={12} />
                </p>
                <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={profileClose} />
            </Modal.Header>
            <Modal.Body className='pt-4 pb-4'>
                <div className='cmp-employe-box'>
                    <div className='d-flex justify-content-between mb-3'>
                        <Image src={userDetails?.profile_image ? `${userDetails?.profile_image}` : '../images/icons/No-Image.svg'} className='img-fluid' alt='employer' width={64} height={64} />
                        <Button variant="" onClick={() => {
                            profileClose();
                            editemploye();
                        }} className='edit-btn gap-2'>Edit  <Image src='../images/icons/edit.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
                    </div>
                    <p className='mb-1'>{userDetails.user_category}</p>
                    <h4 className='font-24 mb-1'>{userDetails?.first_name} {userDetails?.last_name}</h4>
                    <p className='d-flex gap-2' >
                        <Image src='../images/icons/email.svg' className='img-fluid' alt='email' width={20} height={20} />
                        <Link style={{ color: '#463527', fontWeight: '500' }} href={`mailto:${userDetails?.email}`}>{userDetails?.email}</Link>

                        {userDetails?.phone_number && <Image src='../images/icons/call.svg' className='img-fluid' alt='email' width={20} height={20} />}
                        <Link style={{ color: '#463527', fontWeight: '500' }} href='tell:8390734261'>{userDetails?.phone_number ? userDetails?.phone_number : ''}</Link>
                    </p>
                    <Button variant="" className='edit-btn gap-2' onClick={()=>router.push(`/Bookings?guest_uid=${userDetails?.uid}`)}>View Trips  <Image src='../images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button>
                    <hr style={{ marginTop: '20px', borderColor: '#4635273D' }}></hr>
                    <div className='comapny-information-box-employer'>
                        <p className='subheadine-2'>Personal Information</p>
                        <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Gender  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {userDetails?.gender} </span></p>
                    </div>

                    {/* <div className='comapny-information-box-employer'>
                        <p className='subheadine-2'>Company Identity</p>
                        <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Company  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {userDetails?.company_name}</span></p>
                        {userDetails?.employee_id && (
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >{userCompany?.employee_id_display_name}  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {userDetails?.employee_id} </span></p>
                        )}
                        {userDetails?.segment && (
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >{userCompany?.segment_display_name}  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {userDetails?.segment} </span></p>
                        )}
                        {userDetails?.designation && (
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >{userCompany?.designation_display_name}  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {userDetails?.designation} </span></p>
                        )}
                        {userDetails?.employee_grade && (
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >{userCompany?.employee_grade_display_name}  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {userDetails?.employee_grade} </span></p>
                        )}
                        {userDetails?.account_unit && (
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >{userCompany?.account_unit_display_name}  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {userDetails?.account_unit} </span></p>
                        )}
                        {userDetails?.account_code && (
                            <p style={{ paddingBottom: '10px' }}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >{userCompany?.account_code_display_name}  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {userDetails?.account_code} </span></p>
                        )}                        
                    </div> */}
                    {/* <div className='comapny-information-box-employer' >
                        <p className='subheadine-2'>Custom Question</p>
                        {userDetails?.custom_fields && Object.entries(userDetails?.custom_fields)?.map(([key, field]) => (
                            <p style={{ paddingBottom: '10px' }} key={key}><span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >{userCompany?.[key]}  </span> <br></br> <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} > {field} </span></p>
                        ))}
                    </div> */}
                    {/* <Button variant="" className='edit-btn gap-2'>Change Role/Password  <Image src='../images/icons/open_in_new.svg' className='img-fluid' alt='employer' width={20} height={20} /></Button> */}
                </div>
            </Modal.Body>
        </Modal>
    )
}
