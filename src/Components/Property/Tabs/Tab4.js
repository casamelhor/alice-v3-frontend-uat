import { getItemLocalStorage } from '@/utils/browserStorage'
import { checkPermission } from '@/utils/helper'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'

export const Tab4 = ({ assignments, assignmentRemoveShow, removePropertyAssign, setSelectedAssignmentUid, propertyDetail }) => {
    // const param = useParams();
    // const id = param.id;
    const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
    const permissionPropertyAssign = checkPermission(permissionArray, "property_assignment");

    const canAddAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_add;
    const canRetrieveAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_retrieve;
    const canUpdateAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_update;
    const canDeleteAssignProperty = permissionPropertyAssign === true || permissionPropertyAssign?.can_delete;

    const [id, setId] = useState()
    const searchParams = useSearchParams();
    const [searchText, setSearchText] = useState("");


    // useEffect(() => {
    //     const stateParam = searchParams.get('state');
    //     if (stateParam) {
    //         const state = JSON.parse(decodeURIComponent(stateParam));
    //         setId(state.id)
    //     }
    // }, [searchParams]);


    useEffect(() => {
        const uidParam = searchParams.get('uid');
        if (uidParam) {
            setId(uidParam);
        }
    }, [searchParams]);

    const router = useRouter();
    const [openPicIndex, setOpenPicIndex] = useState(null);

    const togglePicOption1 = (e, idx) => {
        e.preventDefault();
        setOpenPicIndex(openPicIndex === idx ? null : idx);
        if (typeof toggleoptio1 === 'function') {
            toggleoptio1();
        }
    }
    return (
        <>
            <Row>
                <Col md={12}>
                    <div className='general-info d-flex justify-content-between align-items-center mb-4'>
                        <h2 className='page-title'> BR Assignments</h2>
                        {canUpdateAssignProperty && (
                            <Link
                                // href={`/Assignmentedit/${id}`} 
                                href={{
                                    pathname: "/Assignmentedit",
                                    query: { uid: id }
                                }}
                                className='btn-company-add ' style={{ padding: '13px 15px' }} > Assign Property</Link>
                        )}
                    </div>
                </Col>

                <Col md={12}>
                    <div className='search-box mb-4'>
                        <input type='text' placeholder='Search ' className='form-control' value={searchText}
                            onChange={(e) => setSearchText(e.target.value)} />
                        <button className='btn btn-search'>
                            <Image src='/images/icons/search.svg' width={24} height={24} alt='Search' />
                        </button>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <p className='mb-0'> <strong>2 </strong>   Assignments</p>
                    </div>

                    <Table className='company-table' >
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Company Name</th>
                                <th style={{ width: '20%' }}>Assigned dates</th>
                                <th style={{ width: '20%' }}>Assigned by</th>

                                <th style={{ width: '20%' }}>
                                    <Image src='/images/icons/settings.svg' width={16} height={16} alt='Sort' />

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {assignments?.map((assignment, idx) => ( */}
                            {assignments
                                ?.filter((assignment) => {
                                    const today = new Date();
                                    const fromDate = new Date(assignment.date_from);
                                    const toDate = new Date(assignment.date_to);
                                    return (
                                        assignment.property_assignment_status !== "Removed" &&
                                        assignment.assigned_company
                                            ?.toLowerCase()
                                            .includes(searchText.toLowerCase()) &&
                                        today >= fromDate &&
                                        today <= toDate
                                    )
                                })
                                .map((assignment, idx) => (
                                    <tr key={assignment.uid}>
                                        <td>
                                            <div className='d-flex align-items-center gap-3'>

                                                <span style={{ fontWeight: '500' }}> {assignment.assigned_company} <br></br>{assignment.extra} </span>
                                            </div>
                                        </td>

                                        <td>
                                            {/* {assignment.date_from} */}
                                            {new Date(assignment.date_from).toLocaleDateString('en-GB')}
                                        </td>
                                        <td>
                                            {assignment.assigned_by}
                                            <br></br>
                                            {assignment.email}
                                        </td>
                                        <td>
                                            <div className='d-flex align-items-center justify-content-between gap-3'>
                                                <Link 
                                                href={`/CompanyDetails?uid=${assignment?.company_uid}`}
                                                 className='btn-company-add' style={{ textDecoration: 'none', padding: '10px 15px' }} > Company Details </Link>
                                                <div className='bt-abs position-relative'>
                                                    <Link href="#" onClick={e => togglePicOption1(e, idx)} className='btn-table-action-more position-relative ms-auto me-0' >
                                                        <Image src='/images/icons/more-dots-3.svg' width={24} height={24} className='img-fluid  ms-auto me-0' alt="female-icon" />
                                                    </Link>
                                                    <ul className={`change-pic-option ${openPicIndex === idx ? "open" : ""}`}>
                                                        {/* <li><Link href={`/Editassignmentdetail/${assignment?.uid}`} onClick={() => { localStorage.setItem("propertyUid", id) }}>Change Date</Link></li> */}
                                                        {canUpdateAssignProperty && (
                                                            <li>
                                                                <Link
                                                                    href={`/Editassignmentdetail/${assignment.uid}?property_uid=${assignment.property_uid}`}
                                                                >
                                                                    Change Date
                                                                </Link>

                                                            </li>
                                                        )}
                                                        {/* <li onClick={() => router.push(`/ChangeDate/${assignment?.uid}?state=${encodeURIComponent(JSON.stringify({ date_from: assignment.date_from, date_to: assignment.date_to, pId: id }))}`)}>
                                                        <Link href='#'>Change Date</Link>
                                                    </li> */}
                                                        {canDeleteAssignProperty && (
                                                            <li>
                                                                {/* <Link href='#' onClick={assignmentRemoveShow} className={`event-remove ${openPicIndex === idx ? "show" : "hide"}`}>Remove Assigment</Link> */}
                                                                <Link
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setSelectedAssignmentUid(assignments[idx].uid);
                                                                        assignmentRemoveShow();
                                                                    }}
                                                                    className={`event-remove ${openPicIndex === idx ? "show" : "hide"}`}
                                                                >
                                                                    Remove Assignment
                                                                </Link>
                                                            </li>
                                                        )}

                                                    </ul>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}
