"use client"
import React, { useState } from 'react'
import { Row, Col, Container, Button, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { loginValidation } from '@/utils/validation';
import { LogInUserAPI } from '@/services/provider';
import { setItemLocalStorage } from '@/utils/browserStorage';
import PublicRoute from '../PublicRoute';
import { alert_danger, showErrorMsg } from '@/utils/Alerts/TostifyAlerts';
import { ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [showPassBox, setShowPassBox] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputData, setInputData] = useState({
    email: "",
    password: ""
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [isLoading,setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { [name]: value }
    setInputData({
      ...inputData,
      [name]: value
    })
    const { errors } = loginValidation(newData);
    setErrorMessages({
      ...errorMessages,
      ...errors
    })
  }
  const handlePassBox = () => {
    let newData = { ["email"]: inputData.email }
    const { errors, isValid } = loginValidation(newData);
    setErrorMessages(errors)
    if (isValid) {
      setShowPassBox(true);
    }
  }

  const router = useRouter();
  const handleLogin = async () => {
    try {
      const { errors, isValid } = loginValidation(inputData);
      setErrorMessages(errors)
      if (isValid) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("email", inputData.email);
        formData.append("password", inputData.password);
        const response = await LogInUserAPI(formData)
        if (response?.data?.success) {
          setItemLocalStorage("token", response.data.response.access)
          setItemLocalStorage("role", response.data.response.user_role.role_name)
          setItemLocalStorage("user_permissions", JSON.stringify(response.data.response.user_role.role_permissions))
          setItemLocalStorage("role_icon", response.data.response.user_role.role_icon)
          setItemLocalStorage("userLogin", JSON.stringify(response.data.response))
          router.push("/Home");
          setIsLoading(false)
        } else {
          setIsLoading(false)
          // Object.entries(response?.data?.response).map(([key, value]) => {
          //   alert_danger(value?.[0])
          // })
          toast.error(showErrorMsg(response.data.response))
        }
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }

  };

  return (
    <PublicRoute>
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
      <div className='login-module'>
        <Container fluid>
          <Row>
            <Col md={4}>
              <Row className='justify-content-center align-items-center h-100' >
                <Col md={12} >
                  <div className='login-panel h-100 p-5'>
                    <div className='email-bx-login' style={{ display: showPassBox ? 'none' : 'block' }}>
                      <h2 className='page-title mb-2' style={{ fontSize: '24px' }} >Log in manage your property</h2>
                      <p className='mb-3' >Manage all your company travel. Save time, money, and your sanity on every trip.</p>

                      <div className='form-group mb-4'>
                        <label>Email</label>
                        <input type='email' name='email' className='form-control' placeholder='Enter Email' onChange={handleChange} />
                        <span className='text-danger'>{errorMessages.email}</span>
                      </div>
                      <div className='form-group mt-1 mb-4'>
                        <Button variant="" className='btn-success complete-form-btn w-100' onClick={handlePassBox} >Continue</Button>
                      </div>
                      <p className='mt-5' style={{ borderTop: ' 1px solid #4635273D', paddingTop: '20px' }} >Can’t login? Contact <Link href="#" style={{ color: '#463527' }} >   service@alice.com </Link> </p>
                    </div>
                    <div className='pass-bx-login' style={{ display: showPassBox ? 'block' : 'none' }} >
                      <h2 className='page-title mb-2' style={{ fontSize: '24px' }} >Log in </h2>
                      <div className='form-group mb-4'>
                        <label>Password</label>
                        <input type={showPassword ? 'text' : 'password'} name='password' className='form-control' placeholder='Password' onChange={handleChange} />
                        <span className='text-danger'>{errorMessages.password}</span>
                        <span className='show-password' style={{ cursor: 'pointer' }} onClick={() => setShowPassword(s => !s)}>{showPassword ? 'Hide' : 'Show'}</span>
                      </div>
                      <div className='form-group mt-1 mb-4'>
                        <Button variant="" onClick={handleLogin} className='btn-success complete-form-btn w-100'  >{isLoading?<Spinner animation="border" variant="light" size='sm' />:'Login'} </Button>
                      </div>
                      <p className='mt-1' style={{}} > <Link href="/ForgotPassword" style={{ color: '#463527' }} >   Forgotten your password? </Link> </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={8} className='login-banner' >
            </Col>
          </Row>
        </Container>
      </div>
    </PublicRoute>
  )
}

export default Login