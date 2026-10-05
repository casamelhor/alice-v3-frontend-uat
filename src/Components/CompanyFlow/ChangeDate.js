"use client"
import { useEffect, useState } from "react";
import { Row, Col, Container, Button, Table, Thead } from 'react-bootstrap';
import Image from 'next/image';
import Header from '../Header/Header'
import Link from 'next/link';
import Select, { AriaOnFocus } from 'react-select';
import DatePicker from "react-datepicker";
import ProtectedRoute from "../ProtectedRoute";
import { PropertyAssignListApi, UpdatePropertyAssignmentAPI } from "@/services/provider";
import { useParams, useRouter } from "next/navigation";
import { alert_danger, alert_success } from '@/utils/Alerts/TostifyAlerts';
import { ToastContainer } from 'react-toastify';
import toast, { Toaster } from "react-hot-toast";

export default function ChangeDate() {
    const { uid } = useParams();
    const router = useRouter();
    const [companyName, setCompanyName] = useState("");
    const [inactiveFrom, setInactiveFrom] = useState(null);
    const [inactiveTo, setInactiveTo] = useState(null);
    const [companyUid, setCompanyUid] = useState("");
    const [assignmentUid, setAssignmentUid] = useState("");
    const [assignments, setAssignments] = useState([]);

    // helper function 
    const handleDateChange = (index, field, date) => {
        const updated = [...assignments];
        updated[index] = {
            ...updated[index],
            [field]: date,
            isEdited: true
        };
        setAssignments(updated);
    };



    useEffect(() => {
        if (uid) {
            getAssignedPropertyDetails(uid);
        }
    }, [uid]);

    const getAssignedPropertyDetails = async (propertyUid) => {
        try {
            const res = await PropertyAssignListApi(propertyUid);
            console.log("API Response:", res.data);

            // const data = res?.data?.response?.[0];
            const list = res?.data?.response || [];

            // if (!data) return;

            // setAssignmentUid(data.uid); 
            // setCompanyName(data.assigned_company);
            // setInactiveFrom(data.date_from ? new Date(data.date_from) : null);
            // setInactiveTo(data.date_to ? new Date(data.date_to) : null);
            // setCompanyUid(data.company_uid);

            setAssignments(
                list.map(item => ({
                    assignmentUid: item.uid,
                    companyName: item.assigned_company,
                    companyUid: item.company_uid,
                    inactiveFrom: item.date_from ? new Date(item.date_from) : null,
                    inactiveTo: item.date_to ? new Date(item.date_to) : null,
                    isEdited: false
                }))
            );

        } catch (error) {
            console.error("Error fetching property assignment:", error);
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        return date.toISOString().split("T")[0];
    };


    const handleSaveChanges = async () => {
        try {
            const editedAssignments = assignments.filter(a => a.isEdited);

            if (editedAssignments.length === 0) {
                alert("No changes made");
                return;
            }

            const formData = new FormData();

            formData.append(
                "assignment_uids",
                JSON.stringify(editedAssignments.map(a => a.assignmentUid))
            );

            formData.append(
                "company_uids",
                JSON.stringify(editedAssignments.map(a => a.companyUid))
            );

            formData.append(
                "date_from",
                JSON.stringify(editedAssignments.map(a => formatDate(a.inactiveFrom)))
            );

            formData.append(
                "date_to",
                JSON.stringify(editedAssignments.map(a => formatDate(a.inactiveTo)))
            );

            // 🔍 debug
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const res = await UpdatePropertyAssignmentAPI(uid, formData);

            if (res?.data?.success) {

                // alert_success("Changed data successfully");
                toast.success("Changed data successfully")

                setTimeout(() => {
                    router.push("/PropertyListing?tab=assigned");
                }, 2000);
            } else {
                // alert_danger(
                //     response?.data?.message || "Something went wrong"
                // );
                toast.error(response?.data?.message || "Something went wrong")
            }

        } catch (error) {
            // alert_danger(
            //     error?.response?.data?.message ||
            //     error?.message ||
            //     "Server error"
            // );
            toast.error(error?.response?.data?.message || error?.message || "Server error")
        }


        // } catch (error) {
        //     console.error("Update failed:", error);
        // }
    };


    return (
        <ProtectedRoute>
            {/* <ToastContainer /> */}
            <Toaster position="top-right" />
            <Header />
            <div className='Breadcrumb'>
                <Container>
                    <Row>
                        <Col md={12} >
                            <ul className='d-flex align-items-center breadcrumb-list'>

                                <li><Link href='./AllCompany'>Company</Link></li>

                                <li><Link href='./AllCompany'>CasaMelhor</Link></li>

                                <li>Change Dates
                                    {/* <Image src="./images/icons/bottom-arrow.svg" className='img-fluid ms-2' alt='bot-arrow' width={10} height={10} />  */}
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>


            <div className='page-body  pt-4 pb-4'>
                <Container>
                    <Row>
                        <Col md={12} className='mb-4 mt-4' >
                            <Link href="/PropertyListing?tab=assigned" className='back-page'>
                                <Image src='/images/icons/back.svg' width={16} height={16} alt='Arrow Left' />
                                Back</Link>
                        </Col>
                        <Col md={6} className=' mb-4' >
                            <div className=' pb-4  '>
                                <h2 className='page-title'>Assign properties to this company</h2>

                            </div>

                            <div className='assign-property-box '>

                                {assignments.map((item, index) => (
                                    <div className='add-propertu-assign mt-4' key={item.assignmentUid} >
                                        <Row>
                                            <Col md={12}>
                                                <div className='form-group mb-4'>
                                                    <label>Company Name</label>
                                                    <input type="text" className="form-control property-home" value={item.companyName} disabled />
                                                </div>

                                            </Col>
                                            <Col md={6}>
                                                <div className='form-group'>
                                                    <label>Date From</label>
                                                    <DatePicker
                                                        selected={item.inactiveFrom}
                                                        // onChange={(date) => setInactiveFrom(date)}
                                                        onChange={(date) => handleDateChange(index, "inactiveFrom", date)}
                                                        placeholderText="Select Dates"
                                                        className="form-control custom-date-picker"
                                                        dateFormat="dd/MM/yyyy"
                                                        minDate={new Date()}
                                                    // startDate={new Date()}

                                                    />
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className='form-group'>
                                                    <label>Date To</label>
                                                    <DatePicker
                                                        selected={item.inactiveTo}
                                                        // onChange={(date) => setInactiveTo(date)}
                                                        onChange={(date) => handleDateChange(index, "inactiveTo", date)}
                                                        placeholderText="Select Dates"
                                                        className="form-control custom-date-picker"
                                                        dateFormat="dd/MM/yyyy"
                                                        minDate={new Date()}
                                                    // startDate={new Date()}

                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </div>


                            <div className="form-group mt-5 mb-4">
                                <Button variant="" className="btn-success complete-form-btn" style={{ padding: '14px 50px' }} onClick={handleSaveChanges} >Save Changes</Button>
                            </div>



                        </Col>


                    </Row>

                </Container>

            </div>

        </ProtectedRoute>
    )
}