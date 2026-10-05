"use client"
import React, { useState } from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { CodeVerifyAPI, ForgotPasswordAPI } from '@/services/provider';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPassword() {
  const [showPassBox, setShowPassBox] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const router = useRouter();
  //  Email validation function

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };



  //  Handle Send Confirmation Code

  const handleSendCode = async () => {
    try {
      if (!email.trim()) {
        setError("Please enter your email");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
      const formData = new FormData();
      formData.append("email", email)
      const res = await ForgotPasswordAPI(formData);
      if (res?.data?.success) {
        setError("");
        setShowPassBox(true);
        toast.success(res?.data?.message)
      } else {
        setError(res.data.response)
      }
    } catch (error) {
      console.log(error);
    }
  };



  //  Handle "Next" button (code validation)

  const handleVerifyCode = async () => {
    try {
      if (!/^\d+$/.test(code)) {
        setCodeError("Code must contain only numbers");
        return;
      }
      if (code.length !== 6) {
        setCodeError("Code must be 6 digits long");
        return;
      }
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", code);
      const res = await CodeVerifyAPI(formData);
      if (res.data.success) {
        setCodeError("");
        toast.success(res?.data?.message)
        router.push(`/UpdatePassword?email=${email}`);
      }else{
        toast.error(res.data.response)        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className='header'>
        <Container fluid>
          <Row>
            <Col xs={6} md={3} className='p-3 ' >

              <div className='logo ps-5'>
                <Image src='/images/logo.svg' width={157} height={49} className='img-fluid' alt='Logo' />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="login-module">
        <Container fluid>
          <Row>
            <Col md={4}>
              <Row className="justify-content-center align-items-center h-100">
                <Col md={12}>
                  <div className="login-panel h-100 p-5">

                    {/* ========== EMAIL BOX ========== */}
                    <div
                      className="email-bx-login"
                      style={{ display: showPassBox ? "none" : "block" }}
                    >
                      <Link
                        href="./Login"
                        className="gap-2 d-flex mb-3"
                        style={{ color: "#463527", textDecoration: "none" }}
                      >
                        <Image
                          src="./images/icons/back.svg"
                          className="img-fluid"
                          width={10}
                          height={10}
                          alt="back"
                        />{" "}
                        Back
                      </Link>

                      <h2 className="page-title mb-2" style={{ fontSize: "24px" }}>
                        Forgotten your password?
                      </h2>
                      <p className="mb-3">
                        Enter the email address associated with your account, and
                        we’ll email you a confirmation code to reset your password.
                      </p>

                      <div className="form-group mb-4">
                        <label>Email</label>
                        <input
                          type="email"
                          className={`form-control ${error ? "is-invalid" : ""}`}
                          placeholder="Enter email"
                          autoComplete="off"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                      </div>

                      <div className="form-group mt-5 pt-4 mb-4">
                        <Button
                          variant=""
                          className="btn-success complete-form-btn w-100"
                          onClick={handleSendCode}
                        >
                          Send Confirmation Code
                        </Button>
                      </div>
                    </div>
                    {/* ========== CODE BOX ========== */}
                    <div
                      className="pass-bx-login"
                      style={{ display: showPassBox ? "block" : "none" }}
                    >
                      <Link
                        href="./Login"
                        className="gap-2 d-flex mb-3"
                        style={{ color: "#463527", textDecoration: "none" }}
                      >
                        <Image
                          src="./images/icons/back.svg"
                          className="img-fluid"
                          width={10}
                          height={10}
                          alt="back"
                        />{" "}
                        Back
                      </Link>
                      <h2 className="page-title mb-2" style={{ fontSize: "24px" }}>
                        We sent you a code
                      </h2>
                      <p>
                        Check your email to get your confirmation code. If you need
                        to request a new code, go back and re-request a confirmation code.
                      </p>

                      <div className="form-group mb-4">
                        <label>Code</label>
                        <input
                          type="text"
                          className={`form-control ${codeError ? "is-invalid" : ""}`}
                          placeholder="Enter your code"
                          autoComplete="off"
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // ✅ Only numbers allowed
                          maxLength={6}
                        />
                        {codeError && (
                          <div className="invalid-feedback">{codeError}</div>
                        )}
                      </div>

                      <div className="form-group mt-5 pt-4 mb-4">
                        <Button
                          variant=""
                          className="btn-success complete-form-btn w-100"
                          onClick={handleVerifyCode}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={8} className='login-banner forgot-pass-banner' >
            </Col>
          </Row>
        </Container>
      </div>
    </>

  )
}
