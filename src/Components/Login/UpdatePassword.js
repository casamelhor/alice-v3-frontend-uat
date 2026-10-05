"use client"
import React, { useState } from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter, useSearchParams } from "next/navigation";
import { ResetUserPasswordAPI } from '@/services/provider';
import toast, { Toaster } from 'react-hot-toast';

export default function UpdatePassword() {
  const param = useSearchParams();
  const email = param.get('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inputData, setInputData] = useState({
    password: '', confirmPassword: ''
  })
  const [error, setError] = useState({
    password: '', confirmPassword: ''
  });

  const router = useRouter();

  const handleValidation = (fieldData) => {
    let isValid = true;
    let errors = {};

    const numberRegex = /[0-9]/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const allowedRegex = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/;

    // ✅ Password Validation
    if (fieldData.password !== undefined) {
      if (!fieldData.password) {
        errors.password = "Please enter your new password";
        isValid = false;
      } else if (!allowedRegex.test(fieldData.password)) {
        // 🔧 FIX 1: Check allowed characters BEFORE number/symbol checks
        errors.password = "Password can only contain letters, numbers, and allowed symbols.";
        isValid = false;
      } else if (fieldData.password.length < 8) {
        // 🔧 FIX 2: Safe to check length here since we know it's non-empty
        errors.password = "Password must be at least 8 characters long.";
        isValid = false;
      } else if (!numberRegex.test(fieldData.password) || !symbolRegex.test(fieldData.password)) {
        errors.password = "Password must include at least one number and one symbol.";
        isValid = false;
      } else {
        errors.password = "";
        // 🔧 FIX 3: Don't set isValid = true here — other fields may still fail
      }
    }

    // ✅ Confirm Password Validation
    if (fieldData.confirmPassword !== undefined) {
      if (!fieldData.confirmPassword) {
        errors.confirmPassword = "Please re-enter your password";
        isValid = false;
      } else if (inputData.password !== fieldData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
        isValid = false;
      } else {
        errors.confirmPassword = "";
        // 🔧 FIX 4: Don't reset isValid = true here either
      }
    }

    return { errors, isValid };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { [name]: value }
    const { errors } = handleValidation(newData);
    setInputData({
      ...inputData,
      [name]: value
    })    
    setError({
      ...error,
      ...errors
    })
  }

  const handleUpdate = async () => {
    try {
      const { errors, isValid } = handleValidation(inputData);
      setError(errors)
      if (isValid) {
        const fieldData = new FormData();
        fieldData.append("email", email)
        fieldData.append("password", inputData.password)
        fieldData.append("confirm_password", inputData.confirmPassword)
        const response = await ResetUserPasswordAPI(fieldData);
        if (response?.data?.success) {          
          toast.success(response.data.response);
          setError({});
          router.push("/"); // redirect to login page
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <Toaster position="top-right" />
      <div className='header'>
        <Container fluid>
          <Row>
            <Col xs={6} md={3} className='p-3'>
              <div className='logo ps-5'>
                <Image src='/images/logo.svg' width={157} height={49} className='img-fluid' alt='Logo' />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className='login-module'>
        <Container fluid>
          <Row>
            <Col md={4}>
              <Row className='justify-content-center align-items-center h-100'>
                <Col md={12}>
                  <div className='login-panel h-100 p-5'>
                    <h2 className='page-title mb-2' style={{ fontSize: '24px' }}>Update password</h2>
                    <p className='mb-3'>Must include at least one symbol or number and have at least 8 characters.</p>

                    {/* Password Field */}
                    <div className='form-group mb-4'>
                      <label>Password</label>
                      <input
                        id="password"
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        // className='form-control'
                        className={`form-control ${error.password && error.password.toLowerCase().includes("password") ? "is-invalid" : ""
                          }`}
                        placeholder='Password'
                        autoComplete='off'
                        value={inputData.password}
                        onChange={handleChange}
                      />
                      <span
                        className='show-password'
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowPassword(s => !s)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </span>
                      {inputData.password.length >= 8 && (
                        <p className='mb-0 mt-2'>
                          <small className='d-flex gap-2'>
                            <Image src='/images/icons/verified.svg' className='img-fluid' width={14} height={14} alt='verified' />
                            Password strength: Strong
                          </small>
                        </p>
                      )}
                      <p className="text-danger mb-3">{error.password}</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className='form-group mb-4'>
                      <label>Re-enter password</label>
                      <input
                        id="confirmPassword"
                        name='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        // className='form-control'
                        className={`form-control ${error.confirmPassword && error.confirmPassword.toLowerCase().includes("match") ? "is-invalid" : ""
                          }`}
                        placeholder='Re-enter your password'
                        autoComplete='off'
                        value={inputData.confirmPassword}
                        onChange={handleChange}
                      />
                      <span
                        className='show-password'
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowConfirmPassword(s => !s)}
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </span>
                      {inputData.confirmPassword && inputData.confirmPassword === inputData.password && (
                        <p className='mb-0 mt-2'>
                          <small className='d-flex gap-2'>
                            <Image src='/images/icons/verified.svg' className='img-fluid' width={14} height={14} alt='verified' />
                            Password match
                          </small>
                        </p>
                      )}
                      <p className="text-danger mb-3">{error.confirmPassword}</p>
                    </div>


                    {/* Submit */}
                    <div className='form-group mt-5 pt-4 mb-4'>
                      <Button variant="" className='btn-success complete-form-btn w-100' onClick={handleUpdate}>
                        Update
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={8} className='login-banner forgot-pass-banner'></Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
