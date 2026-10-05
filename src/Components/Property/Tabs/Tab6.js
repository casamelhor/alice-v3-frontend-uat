import { convertTo12Hour } from '@/utils/formatTime'
import Link from 'next/link'
import React from 'react'
import { Col, Row } from 'react-bootstrap'

export const Tab6 = ({ propertyDetail,setIsEditSpaceRule,canUpdateProperty }) => {    
    return (
        <>
            <Row>
                <Col md={6}>
                    <div className='d-flex align-items-start justify-content-between mb-5'>
                        <div className='general-info'>
                            <h2 className='page-title'> General information</h2>
                            <p className='mb-0'>Change or edit all company related general information from here</p>
                        </div>
                        {canUpdateProperty && <Link href="" className='edit-company-btn' style={{ color: '#463527', textDecoration: 'none' }} onClick={()=>setIsEditSpaceRule(true)}> Manage </Link>}
                    </div>
                    <div className='comapny-information-box space-rule-data'>
                        {/* <h4 className='mb-4'>Basic Information</h4>
                        <p style={{ paddingBottom: '10px', borderBottom: '1px solid #4635271F' }}>
                            <span className='w-100 ' style={{ fontSize: '18px', lineHeight: '24px' }} >Nearest airport to this BR / property  </span>
                            <br></br>
                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >{propertyDetail?.nearest_airport} </span>
                        </p> */}
                        <h4 className='mb-2 mt-5'>Space rules</h4>
                        <p style={{ paddingBottom: '10px' }}>
                            <span className='w-100' style={{ fontSize: '14px', lineHeight: '20px' }} >
                                {"Guests are expected to follow your rules and may be removed from space if they don't."} </span>
                        </p>
                        <div className="mt-5">
                            <p className='mb-2 '>
                                <span style={{ fontSize: '18px', lineHeight: '24px', fontWeight: '400' }}> Pets {!propertyDetail?.pets_allowed && 'not'} allowed </span>
                            </p>
                            <p className='mb-2 '>
                                <span style={{ fontSize: '18px', lineHeight: '24px', fontWeight: '400' }}> Smoking, vaping, e‑cigarettes {!propertyDetail?.smoking_allowed && 'not'} allowed </span>
                            </p>
                            <p className='mb-2 '>
                                <span style={{ fontSize: '18px', lineHeight: '24px', fontWeight: '400' }}> Commercial photography and filming {!propertyDetail?.commercial_photography_allowed && 'not'} allowed </span>
                            </p>
                            <p className='mb-2 '>
                                <span style={{ fontSize: '18px', lineHeight: '24px', fontWeight: '400' }}> Check-in: {convertTo12Hour(propertyDetail?.checkin_time)} and checkout: {convertTo12Hour(propertyDetail?.checkout_time)} </span>
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}
