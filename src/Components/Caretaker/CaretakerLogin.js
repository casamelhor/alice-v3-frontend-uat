"use client";
import React, { useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCaretakerLanguage } from '@/context/CaretakerLanguageContext';
import toast, { Toaster } from 'react-hot-toast';
import { CaretakerLoginAPI, CaretakerPropertiesAPI } from '@/services/caretakerProvider';

const CaretakerLogin = () => {
  const router = useRouter();
  const { t, bilingual, language, toggleLanguage } = useCaretakerLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = email, 2 = password

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmailContinue = () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Required' });
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    setStep(2);
  };

  const handleLogin = async () => {
    if (!formData.password.trim()) {
      setErrors({ password: 'Required' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await CaretakerLoginAPI({
        email: formData.email,
        password: formData.password,
      });

      if (response?.data?.success) {
        const data = response.data.response;

        // Store auth data
        localStorage.setItem('caretaker_token', data.access);
        localStorage.setItem('caretaker_refresh', data.refresh);
        localStorage.setItem('caretaker_type', data.caretaker_type);
        localStorage.setItem('caretaker_name', data.name);
        localStorage.setItem('caretaker_uid', data.uid);
        localStorage.setItem('caretaker_email', data.email);
        localStorage.setItem('caretaker_phone', data.phone || '');
        localStorage.setItem('caretaker_gender', data.gender || '');
        localStorage.setItem('caretaker_profile_image', data.profile_image || '');
        localStorage.setItem('caretaker_role', 'caretaker');

        // Store properties
        if (data.properties && data.properties.length > 0) {
          localStorage.setItem('caretaker_properties', JSON.stringify(data.properties));
        }

        toast.success('Login successful');
        router.push('/caretaker/dashboard');
      } else {
        const errorMsg = typeof response?.data?.response === 'string'
          ? response.data.response
          : 'Invalid email or password';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 1) handleEmailContinue();
      else handleLogin();
    }
  };

  return (
    <div className="caretaker-login">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="caretaker-header">
        <Container fluid>
          <Row className="align-items-center py-3">
            <Col xs={6}>
              <div className="logo">
                <span className="logo-text">Alice</span>
              </div>
            </Col>
            <Col xs={6} className="text-end">
              <button
                className="lang-toggle-btn"
                onClick={toggleLanguage}
              >
                {language === 'en' ? 'हिं' : 'EN'}
              </button>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Login Form */}
      <div className="caretaker-login-container">
        <div className="caretaker-login-card">

          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <h1 className="login-title">
                {bilingual('welcomeTo')} <span className="alice-text">Alice</span>
              </h1>

              <div className="form-group mb-4">
                <label>{bilingual('emailOrPhone')}</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control caretaker-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                {errors.email && <span className="text-danger small">{errors.email}</span>}
              </div>

              <Button
                className="caretaker-btn-primary w-100 mb-3"
                onClick={handleEmailContinue}
              >
                {bilingual('continue')}
              </Button>
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <>
              <h1 className="login-title">
                {bilingual('welcomeTo')} <span className="alice-text">Alice</span>
              </h1>

              <p className="mb-3" style={{ color: '#666', fontSize: '14px' }}>
                {formData.email}
              </p>

              <div className="form-group mb-4">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-control caretaker-input ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <span className="text-danger small">{errors.password}</span>}
              </div>

              <Button
                className="caretaker-btn-primary w-100 mb-3"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" /> : 'Login'}
              </Button>

              <button
                className="caretaker-btn-link"
                onClick={() => { setStep(1); setErrors({}); }}
              >
                Back
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default CaretakerLogin;
