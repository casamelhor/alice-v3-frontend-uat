"use client";

import React, { useEffect, useState, useMemo } from "react";
import Header from '../Header/Header';
import ProtectedRoute from '../ProtectedRoute';
import { Col, Container, Row, Card, Table, Spinner, Form } from "react-bootstrap";
import Image from "next/image";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend, LineChart, Line, Area, AreaChart
} from "recharts";
import { useSearchParams } from 'next/navigation';
import { companyDetailAPI, CompanyReportingAPI, companyListAPI } from "@/services/provider";
import { formatYMD, getOneMonthBefore, formatDaysDateMonthYear } from "@/utils/formatTime";
import { getItemLocalStorage } from "@/utils/browserStorage";

// Color palette for charts
const CHART_COLORS = ['#5A8C37', '#3A8C8C', '#8740FF', '#FF5252', '#00C49F', '#BF9039', '#7ED6FF', '#A47FF6', '#FF8F00', '#4CAF50'];
const SAVINGS_COLOR = '#5A8C37';
const HOTEL_COLOR = '#BF9039';
const BR_COLOR = '#3A8C8C';

// Default hotel rates by location (editable)
const DEFAULT_HOTEL_RATES = {
  'Navi Mumbai': 7500,
  'Pune': 6500,
  'Bangalore': 8000,
  'Delhi NCR': 7200,
  'Mumbai': 9000,
  'Hyderabad': 6800,
  'Chennai': 7000,
  'Kolkata': 5500,
};

export default function CompanyReporting() {
  const searchParams = useSearchParams();
  const companyIdFromUrl = searchParams.get("uid");
  
  // Get logged in user info
  const [loginData, setLoginData] = useState(null);
  const [isCMAdmin, setIsCMAdmin] = useState(false);
  
  useEffect(() => {
    const userData = JSON.parse(getItemLocalStorage("userLogin"));
    setLoginData(userData);
    // Check if user is Casa Melhor Admin
    const roleName = userData?.user_role?.role_name?.toLowerCase() || '';
    setIsCMAdmin(roleName.includes('casamelhor') || roleName.includes('casa melhor') || roleName === 'superadmin');
  }, []);
  
  const [isLoading, setIsLoading] = useState(false);
  const [companyDetail, setCompanyDetail] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: getOneMonthBefore(new Date()),
    endDate: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState('3_months');
  
  // Filter states
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [allPropertyOptions, setAllPropertyOptions] = useState([]); // Store all properties for filtering
  
  // Editable hotel rates per location
  const [hotelRates, setHotelRates] = useState(DEFAULT_HOTEL_RATES);
  const [editingRate, setEditingRate] = useState(null);
  const [tempRate, setTempRate] = useState('');
  
  // BR rate controls - toggle occupancy adjustment, editable BR rates per location
  const [useOccupancyAdjustment, setUseOccupancyAdjustment] = useState(true);
  const [brRates, setBRRates] = useState({
    'Navi Mumbai': 3500,
    'Pune': 3200,
    'Bangalore': 4000,
    'Delhi NCR': 3800
  });
  const [editingBRRate, setEditingBRRate] = useState(null);
  const [tempBRRate, setTempBRRate] = useState('');
  
  // Analytics data states
  const [departmentData, setDepartmentData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState([]);
  const [savingsData, setSavingsData] = useState({ totalBRCost: 0, totalHotelCost: 0, totalSavings: 0, savingsPercentage: 0, avgBRRate: 0, avgHotelRate: 0, avgSavingsPerNight: 0, totalNights: 0 });
  const [summaryStats, setSummaryStats] = useState({ total_bookings: 0, total_nights: 0, unique_employees: 0, avg_stay_duration: 0 });
  const [topLocations, setTopLocations] = useState([]);
  const [rawBookingsData, setRawBookingsData] = useState([]);

  const periodOptions = [
    { value: "1_month", label: "Last 1 Month" },
    { value: "3_months", label: "Last 3 Months" },
    { value: "6_months", label: "Last 6 Months" },
    { value: "12_months", label: "Last 12 Months" },
    { value: "custom", label: "Custom Range" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#E5E5E5',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#5A8C37'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#5A8C37" : state.isFocused ? "#5A8C371A" : "inherit",
      color: state.isSelected ? "#fff" : "#000",
      cursor: "pointer"
    })
  };

  // Fetch companies list (only for CM Admin)
  const fetchCompanies = async () => {
    try {
      const response = await companyListAPI("all", 1, "");
      if (response?.data?.success) {
        const results = Array.isArray(response.data.response) ? response.data.response : (response.data.response.results || []);
        const options = results.map(company => ({
          value: company.uid,
          label: company.company_name
        }));
        setCompanyOptions(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch company details
  const getCompanyDetail = async (companyId) => {
    try {
      const response = await companyDetailAPI(companyId);
      if (response?.data?.success) {
        setCompanyDetail(response?.data?.response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate BR room rate with optional occupancy adjustment
  // Formula: room_rate / occupancy_percentage (when adjustment is enabled)
  // Otherwise: use direct room rate
  const calculateBRRate = (roomRate, occupancyPercentage = 80, applyOccupancyAdjustment = useOccupancyAdjustment) => {
    if (!applyOccupancyAdjustment) {
      return Math.round(roomRate);
    }
    const occupancy = occupancyPercentage / 100;
    return Math.round(roomRate / occupancy);
  };

  // Calculate savings based on hotel rates and BR rates
  // Hotel rates are NOT occupancy adjusted (on-demand consumption)
  // BR rates can be occupancy adjusted based on user toggle
  const calculateSavings = (locations, hotelRatesMap, brRatesMap, applyOccupancyAdjustment) => {
    let totalBRCost = 0;
    let totalHotelCost = 0;
    let totalNights = 0;
    
    locations.forEach(loc => {
      // Hotel rate - direct rate, no occupancy adjustment
      const hotelRate = hotelRatesMap[loc.city] || 7000;

      // BR rate - use custom rate if set, or default, with optional occupancy adjustment
      const baseBRRate = brRatesMap[loc.city] || loc.avg_br_rate || loc.avgBRRate || 3500;
      const nights = loc.total_nights || loc.nights || 0;
      const brRate = calculateBRRate(baseBRRate, loc.occupancy || 80, applyOccupancyAdjustment);

      totalBRCost += brRate * nights;
      totalHotelCost += hotelRate * nights; // No occupancy adjustment for hotels
      totalNights += nights;
    });
    
    const totalSavings = totalHotelCost - totalBRCost;
    const savingsPercentage = totalHotelCost > 0 ? ((totalSavings / totalHotelCost) * 100).toFixed(1) : 0;
    const avgBRRate = totalNights > 0 ? Math.round(totalBRCost / totalNights) : 0;
    const avgHotelRate = totalNights > 0 ? Math.round(totalHotelCost / totalNights) : 0;
    
    return {
      totalBRCost,
      totalHotelCost,
      totalSavings,
      savingsPercentage,
      avgBRRate,
      avgHotelRate,
      avgSavingsPerNight: avgHotelRate - avgBRRate,
      totalNights
    };
  };

  // Load analytics data from API
  const loadAnalyticsData = async () => {
    const companyId = selectedCompany?.value || companyIdFromUrl;
    if (!companyId && isCMAdmin) return; // CM Admin must select a company first

    setIsLoading(true);
    try {
      const filters = {
        company_uid: isCMAdmin ? companyId : '',
        location: selectedLocation?.value || '',
        property_uid: selectedProperty?.value || '',
        segment: selectedDepartment?.value || '',
        date_from: formatYMD(dateRange.startDate),
        date_to: formatYMD(dateRange.endDate),
      };

      const response = await CompanyReportingAPI(filters);

      if (response?.data?.success) {
        const data = response.data.response;

        // Populate filter options from API
        setLocationOptions(data.filters.locations || []);
        setAllPropertyOptions(data.filters.properties || []);
        setPropertyOptions((data.filters.properties || []).map(p => ({
          ...p, label: `${p.label} - ${p.location}`
        })));
        setDepartmentOptions(data.filters.segments || []);

        // Set department data
        setDepartmentData(data.department_breakdown || []);

        // Set employee / top travelers data
        setEmployeeData(data.top_travelers || []);

        // Set location data with hotel rates
        const locationsData = data.location_breakdown || [];
        const locationsWithRates = locationsData.map(loc => ({
          ...loc,
          avgHotelPrice: hotelRates[loc.city] || 7000,
          effectiveBRRate: calculateBRRate(loc.avg_br_rate || 3500, loc.occupancy || 80)
        }));
        setTopLocations(locationsWithRates);

        // Set monthly usage (use month_label for chart display)
        setMonthlyUsage((data.monthly_usage || []).map(m => ({
          ...m,
          month: m.month_label || m.month,
        })));

        // Set summary stats
        setSummaryStats(data.summary || {});

        // Set raw bookings data
        setRawBookingsData(data.bookings || []);

        // Calculate savings client-side
        const savings = calculateSavings(locationsData, hotelRates, brRates, useOccupancyAdjustment);
        setSavingsData(savings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Recalculate savings when hotel rates change
  useEffect(() => {
    if (topLocations.length > 0) {
      const savings = calculateSavings(topLocations, hotelRates, brRates, useOccupancyAdjustment);
      setSavingsData(savings);
      
      // Update locations with new hotel rates and BR rates
      const updatedLocations = topLocations.map(loc => ({
        ...loc,
        avgHotelPrice: hotelRates[loc.city] || 7000,
        avg_br_rate: brRates[loc.city] || loc.avg_br_rate || 3500
      }));
      setTopLocations(updatedLocations);
    }
  }, [hotelRates, brRates, useOccupancyAdjustment]);

  // Filter property options when location changes
  useEffect(() => {
    if (selectedLocation) {
      const filtered = allPropertyOptions
        .filter(p => p.location === selectedLocation.value)
        .map(p => ({ ...p, label: `${p.label} - ${p.location}` }));
      setPropertyOptions(filtered);
      // Clear selected property if not in filtered list
      if (selectedProperty && !filtered.some(p => p.value === selectedProperty.value)) {
        setSelectedProperty(null);
      }
    } else {
      // Show all properties when no location selected
      setPropertyOptions(allPropertyOptions.map(p => ({ ...p, label: `${p.label} - ${p.location}` })));
    }
  }, [selectedLocation, allPropertyOptions]);

  useEffect(() => {
    if (isCMAdmin) {
      fetchCompanies();
    }
  }, [isCMAdmin]);

  useEffect(() => {
    const companyId = selectedCompany?.value || companyIdFromUrl;
    if (companyId) {
      getCompanyDetail(companyId);
      loadAnalyticsData();
    } else if (!isCMAdmin && loginData?.user_company) {
      // For company users, backend auto-scopes to their company (user_company is a string name, not object)
      loadAnalyticsData();
    }
  }, [selectedCompany, companyIdFromUrl, selectedPeriod, selectedLocation, selectedProperty, selectedDepartment, dateRange, loginData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount}`;
  };

  // Handle hotel rate edit
  const handleRateEdit = (city) => {
    setEditingRate(city);
    setTempRate(hotelRates[city]?.toString() || '7000');
  };

  const handleRateSave = (city) => {
    const newRate = parseInt(tempRate) || 7000;
    setHotelRates(prev => ({
      ...prev,
      [city]: newRate
    }));
    setEditingRate(null);
    setTempRate('');
  };

  const handleRateCancel = () => {
    setEditingRate(null);
    setTempRate('');
  };

  // Handle BR rate edit
  const handleBRRateEdit = (city) => {
    setEditingBRRate(city);
    setTempBRRate(brRates[city]?.toString() || '3500');
  };

  const handleBRRateSave = (city) => {
    const newRate = parseInt(tempBRRate) || 3500;
    setBRRates(prev => ({
      ...prev,
      [city]: newRate
    }));
    setEditingBRRate(null);
    setTempBRRate('');
  };

  const handleBRRateCancel = () => {
    setEditingBRRate(null);
    setTempBRRate('');
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Cost') || entry.name.includes('Spend') ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Monthly comparison data for bar chart
  const monthlyComparisonData = useMemo(() => {
    return monthlyUsage.map(month => {
      const avgBRRate = savingsData.avgBRRate || 4500;
      const avgHotelRate = savingsData.avgHotelRate || 7000;
      const nights = month.total_nights || month.nights || 0;
      return {
        ...month,
        brCost: nights * avgBRRate,
        hotelCost: nights * avgHotelRate,
        savings: nights * (avgHotelRate - avgBRRate)
      };
    });
  }, [monthlyUsage, savingsData]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Header />
        <div className="dashboardWrapper">
          <Container>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <Spinner animation="border" variant="success" />
            </div>
          </Container>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      <div className="dashboardWrapper reporting-page">
        <Container>
          {/* Page Header */}
          <div className="reporting-header mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h1 className="page-title mb-1">Booking Analytics & Reporting</h1>
                <p className="page-subtitle text-muted mb-0">
                  {companyDetail?.company_name || 'Company'} - Usage insights and cost savings analysis
                </p>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <Select
                  options={periodOptions}
                  value={periodOptions.find(p => p.value === selectedPeriod)}
                  onChange={(selected) => setSelectedPeriod(selected.value)}
                  styles={customStyles}
                  className="period-select"
                  isSearchable={false}
                />
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="filter-card mb-4">
            <Card.Body>
              <Row className="g-3 align-items-end">
                {/* Company Filter - Only for CM Admin */}
                {isCMAdmin && (
                  <Col md={2}>
                    <Form.Label className="filter-label">Company</Form.Label>
                    <Select
                      options={companyOptions}
                      value={selectedCompany}
                      onChange={setSelectedCompany}
                      placeholder="All Companies"
                      styles={customStyles}
                      isClearable
                    />
                  </Col>
                )}
                
                {/* Location Filter */}
                <Col md={isCMAdmin ? 2 : 3}>
                  <Form.Label className="filter-label">Location</Form.Label>
                  <Select
                    options={locationOptions}
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    placeholder="All Locations"
                    styles={customStyles}
                    isClearable
                  />
                </Col>
                
                {/* Property Filter - Filtered by location */}
                <Col md={isCMAdmin ? 2 : 3}>
                  <Form.Label className="filter-label">Property</Form.Label>
                  <Select
                    options={propertyOptions}
                    value={selectedProperty}
                    onChange={setSelectedProperty}
                    placeholder="All Properties"
                    styles={customStyles}
                    isClearable
                    noOptionsMessage={() => selectedLocation ? 'No properties in this location' : 'No properties'}
                  />
                </Col>
                
                {/* Department Filter */}
                <Col md={isCMAdmin ? 2 : 3}>
                  <Form.Label className="filter-label">Department</Form.Label>
                  <Select
                    options={departmentOptions}
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                    placeholder="All Departments"
                    styles={customStyles}
                    isClearable
                  />
                </Col>
                
                {/* Date Range */}
                <Col md={isCMAdmin ? 4 : 3}>
                  <Form.Label className="filter-label">Date Range</Form.Label>
                  <div className="d-flex gap-2">
                    <DatePicker
                      selected={dateRange.startDate}
                      onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                      selectsStart
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      className="form-control date-input"
                      dateFormat="dd MMM yyyy"
                      disabled={selectedPeriod !== 'custom'}
                    />
                    <DatePicker
                      selected={dateRange.endDate}
                      onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                      selectsEnd
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      minDate={dateRange.startDate}
                      className="form-control date-input"
                      dateFormat="dd MMM yyyy"
                      disabled={selectedPeriod !== 'custom'}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Empty state for CM Admin before company selection */}
          {isCMAdmin && !selectedCompany && !companyIdFromUrl ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">Select a company above to view analytics.</p>
            </div>
          ) : <>

          {/* Summary Stats Cards */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={4} lg={2}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <div className="stat-value">{summaryStats.total_bookings}</div>
                  <div className="stat-label">Total Bookings</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={4} lg={2}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <div className="stat-value">{summaryStats.total_nights}</div>
                  <div className="stat-label">Total Nights</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={4} lg={2}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <div className="stat-value">{summaryStats.unique_employees}</div>
                  <div className="stat-label">Employees Traveled</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={4} lg={2}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <div className="stat-value">{summaryStats.avg_stay_duration}</div>
                  <div className="stat-label">Avg Stay (Days)</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={4} lg={2}>
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <div className="stat-value">{savingsData.savingsPercentage || 0}%</div>
                  <div className="stat-label">Savings Rate</div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={4} lg={2}>
              <Card className="stat-card highlight-card">
                <Card.Body className="text-center">
                  <div className="stat-value text-success">{savingsData.savingsPercentage}%</div>
                  <div className="stat-label">Cost Savings</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Cost Savings Analysis Card with Editable Hotel Rate */}
          <Card className="savings-card mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Cost Savings Analysis</h5>
              <span className="badge bg-success">{savingsData.savingsPercentage}% Saved</span>
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Savings Summary */}
                <Col lg={4}>
<div className="savings-summary">
                    <div className="savings-item">
                      <div className="savings-label">Total BR Spend</div>
                      <div className="savings-value br-value">{formatCurrency(savingsData.totalBRCost)}</div>
                      <div className="savings-sub">
                        Avg {formatCurrency(savingsData.avgBRRate)}/night 
                        {useOccupancyAdjustment && <span className="adjustment-tag">(occupancy adjusted)</span>}
                      </div>
                    </div>
                    <div className="savings-item">
                      <div className="savings-label">Equivalent Hotel Cost</div>
                      <div className="savings-value hotel-value">{formatCurrency(savingsData.totalHotelCost)}</div>
                      <div className="savings-sub">Avg {formatCurrency(savingsData.avgHotelRate)}/night (direct rate)</div>
                    </div>
                    <div className="savings-item highlight">
                      <div className="savings-label">Total Savings</div>
                      <div className="savings-value savings-highlight">{formatCurrency(savingsData.totalSavings)}</div>
                      <div className="savings-sub">{formatCurrency(savingsData.avgSavingsPerNight)}/night saved</div>
                    </div>
                  </div>
                  
                  {/* BR Rate Settings */}
                  <div className="br-rate-settings mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="mb-0">BR Rate Settings</h6>
                      <Form.Check
                        type="switch"
                        id="occupancy-adjustment-toggle"
                        label="Occupancy Adjust"
                        checked={useOccupancyAdjustment}
                        onChange={(e) => setUseOccupancyAdjustment(e.target.checked)}
                        className="occupancy-toggle"
                      />
                    </div>
                    <p className="text-muted small mb-2">
                      {useOccupancyAdjustment 
                        ? 'BR rates adjusted by occupancy % (e.g., ₹3,500 / 80% = ₹4,375)' 
                        : 'Using direct BR rates without occupancy adjustment'}
                    </p>
                    {(selectedLocation 
                      ? topLocations.filter(loc => loc.city === selectedLocation.value)
                      : topLocations
                    ).map(loc => (
                      <div key={`br-${loc.city}`} className="rate-edit-row">
                        <span className="city-name">{loc.city}</span>
                        {editingBRRate === loc.city ? (
                          <div className="rate-edit-controls">
                            <Form.Control
                              type="number"
                              value={tempBRRate}
                              onChange={(e) => setTempBRRate(e.target.value)}
                              className="rate-input"
                              size="sm"
                            />
                            <button className="btn btn-sm btn-success" onClick={() => handleBRRateSave(loc.city)}>
                              Save
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={handleBRRateCancel}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="rate-display" onClick={() => handleBRRateEdit(loc.city)}>
                            <span className="rate-value">{formatCurrency(brRates[loc.city] || 3500)}</span>
                            {useOccupancyAdjustment && (
                              <span className="adjusted-rate">
                                → {formatCurrency(calculateBRRate(brRates[loc.city] || 3500, loc.occupancy || 80))}
                              </span>
                            )}
                            <span className="edit-icon-text">Edit</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Editable Hotel Rates Section - Filtered by selected location */}
                  <div className="hotel-rates-editor mt-4">
                    <h6 className="mb-3">
                      {selectedLocation ? `Hotel Rate: ${selectedLocation.label}` : 'Avg Hotel Rates by Location'}
                    </h6>
                    <p className="text-muted small mb-2">Direct hotel rates (not occupancy adjusted)</p>
                    {(selectedLocation 
                      ? topLocations.filter(loc => loc.city === selectedLocation.value)
                      : topLocations
                    ).map(loc => (
                      <div key={loc.city} className="rate-edit-row">
                        <span className="city-name">{loc.city}</span>
                        {editingRate === loc.city ? (
                          <div className="rate-edit-controls">
                            <Form.Control
                              type="number"
                              value={tempRate}
                              onChange={(e) => setTempRate(e.target.value)}
                              className="rate-input"
                              size="sm"
                            />
                            <button className="btn btn-sm btn-success" onClick={() => handleRateSave(loc.city)}>
                              Save
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={handleRateCancel}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="rate-display" onClick={() => handleRateEdit(loc.city)}>
                            <span className="rate-value">{formatCurrency(hotelRates[loc.city] || 7000)}</span>
                            <span className="edit-icon-text">Edit</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Col>
                
                {/* Monthly Comparison Chart */}
                <Col lg={8}>
                  <h6 className="chart-title mb-3">Monthly Cost Comparison: BR vs Hotel</h6>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyComparisonData} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="brCost" name="BR Cost" fill={BR_COLOR} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="hotelCost" name="Hotel Cost" fill={HOTEL_COLOR} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="g-4 mb-4">
            {/* Department Distribution */}
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Department-wise Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={5}>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={departmentData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="bookings_count"
                            nameKey="segment"
                          >
                            {departmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Col>
                    <Col md={7}>
                      <div className="department-bars">
                        {departmentData.map((dept, index) => (
                          <div key={dept.segment} className="dept-bar-item">
                            <div className="dept-info">
                              <span className="dept-color" style={{ backgroundColor: CHART_COLORS[index] }}></span>
                              <span className="dept-name">{dept.segment}</span>
                              <span className="dept-value">{dept.bookings_count} bookings</span>
                            </div>
                            <div className="dept-bar">
                              <div 
                                className="dept-bar-fill" 
                                style={{ 
                                  width: `${dept.percentage}%`,
                                  backgroundColor: CHART_COLORS[index]
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Monthly Usage Trend */}
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Monthly Usage Trend</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyUsage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="total_nights"
                        name="Nights"
                        stroke={SAVINGS_COLOR}
                        fill={SAVINGS_COLOR}
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="bookings_count"
                        name="Bookings"
                        stroke={BR_COLOR}
                        fill={BR_COLOR}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            {/* Top Locations */}
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Top Locations</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="locations-table mb-0">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th className="text-center">Bookings</th>
                        <th className="text-center">Nights</th>
                        <th className="text-end">BR Rate*</th>
                        <th className="text-end">Hotel Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topLocations.map((loc, index) => (
                        <tr key={loc.city}>
                          <td>
                            <span className="location-rank">{index + 1}</span>
                            {loc.city}
                          </td>
                          <td className="text-center">{loc.bookings_count}</td>
                          <td className="text-center">{loc.total_nights}</td>
                          <td className="text-end">{formatCurrency(loc.effectiveBRRate)}</td>
                          <td className="text-end text-muted">{formatCurrency(loc.avgHotelPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="table-footnote px-3 py-2">
                    *BR Rate is occupancy-adjusted (Room Rate / Occupancy %)
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Employee Usage Table */}
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Top Travelers</h5>
                  <span className="text-muted small">By number of trips</span>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="employee-table mb-0">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th className="text-center">Trips</th>
                        <th className="text-center">Nights</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData.slice(0, 6).map((emp, index) => (
                        <tr key={emp.name}>
                          <td>
                            <div className="employee-info">
                              <span className="employee-name">{emp.name}</span>
                            </div>
                          </td>
                          <td><span className="dept-badge">{emp.segment}</span></td>
                          <td className="text-center">{emp.trip_count}</td>
                          <td className="text-center">{emp.total_nights}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Department Details Table */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Department Details</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="department-details-table mb-0">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th className="text-center">Bookings</th>
                    <th className="text-center">Nights</th>
                    <th className="text-end">Total Spend</th>
                    <th className="text-center">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={dept.segment}>
                      <td>
                        <span className="dept-color-dot" style={{ backgroundColor: CHART_COLORS[index] }}></span>
                        {dept.segment}
                      </td>
                      <td className="text-center">{dept.bookings_count}</td>
                      <td className="text-center">{dept.total_nights}</td>
                      <td className="text-end">{formatCurrency(dept.total_spend)}</td>
                      <td className="text-center">
                        <div className="percentage-bar">
                          <div 
                            className="percentage-fill" 
                            style={{ width: `${dept.percentage}%`, backgroundColor: CHART_COLORS[index] }}
                          ></div>
                          <span className="percentage-text">{dept.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td className="text-center"><strong>{summaryStats.total_bookings}</strong></td>
                    <td className="text-center"><strong>{summaryStats.total_nights}</strong></td>
                    <td className="text-end"><strong>{formatCurrency(savingsData.totalBRCost)}</strong></td>
                    <td className="text-center"><strong>100%</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </Card.Body>
          </Card>

          {/* Department-wise Savings Analysis */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Department-wise Savings Analysis</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="dept-savings-table mb-0">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th className="text-center">Room Nights</th>
                    <th className="text-end">BR Cost</th>
                    <th className="text-end">Hotel Equivalent</th>
                    <th className="text-end">Savings</th>
                    <th className="text-center">Savings %</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => {
                    const avgBRRate = savingsData.avgBRRate || 4500;
                    const avgHotelRate = savingsData.avgHotelRate || 7000;
                    const nights = dept.total_nights || 0;
                    const deptBRCost = nights * avgBRRate;
                    const deptHotelCost = nights * avgHotelRate;
                    const deptSavings = deptHotelCost - deptBRCost;
                    const deptSavingsPercent = deptHotelCost > 0 ? ((deptSavings / deptHotelCost) * 100).toFixed(1) : 0;

                    return (
                      <tr key={dept.segment}>
                        <td>
                          <span className="dept-color-dot" style={{ backgroundColor: CHART_COLORS[index] }}></span>
                          {dept.segment}
                        </td>
                        <td className="text-center">{nights}</td>
                        <td className="text-end">{formatCurrency(deptBRCost)}</td>
                        <td className="text-end text-muted">{formatCurrency(deptHotelCost)}</td>
                        <td className="text-end text-success fw-semibold">{formatCurrency(deptSavings)}</td>
                        <td className="text-center">
                          <span className="savings-badge">{deptSavingsPercent}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td className="text-center"><strong>{summaryStats.total_nights}</strong></td>
                    <td className="text-end"><strong>{formatCurrency(savingsData.totalBRCost)}</strong></td>
                    <td className="text-end"><strong>{formatCurrency(savingsData.totalHotelCost)}</strong></td>
                    <td className="text-end text-success"><strong>{formatCurrency(savingsData.totalSavings)}</strong></td>
                    <td className="text-center"><strong>{savingsData.savingsPercentage}%</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </Card.Body>
          </Card>

          {/* Raw Bookings Data Table */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Booking Details (Raw Data)</h5>
                <p className="text-muted small mb-0 mt-1">Day-wise booking records for verification</p>
              </div>
              <span className="badge bg-secondary">{rawBookingsData.length} Records</span>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="raw-bookings-table mb-0">
                  <thead>
                    <tr>
                      <th>Dept</th>
                      <th>Guest</th>
                      <th>Booking ID</th>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th className="text-center">Nights</th>
                      <th className="text-end">BR Rate*</th>
                      <th className="text-end">Hotel Rate</th>
                      <th className="text-end">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawBookingsData
                      .filter(booking => !selectedLocation || booking.property_city === selectedLocation.value)
                      .filter(booking => !selectedProperty || booking.property_name.includes(selectedProperty.label?.split(' - ')[0] || ''))
                      .filter(booking => !selectedDepartment || booking.traveler_segment === selectedDepartment.label)
                      .map((booking) => {
                        // Use custom BR rate if set, otherwise booking's price_per_night
                        const baseBRRate = brRates[booking.property_city] || booking.price_per_night;
                        const brRate = calculateBRRate(baseBRRate, 80, useOccupancyAdjustment);
                        // Hotel rate is direct, no occupancy adjustment
                        const hotelRate = hotelRates[booking.property_city] || 7000;
                        const nights = booking.total_nights || 0;
                        const brCost = brRate * nights;
                        const hotelCost = hotelRate * nights;
                        const savings = hotelCost - brCost;

                        return (
                          <tr key={booking.booking_number}>
                            <td><span className="dept-tag">{booking.traveler_segment}</span></td>
                            <td className="guest-cell">{booking.traveler_name}</td>
                            <td><code className="booking-id">{booking.booking_number}</code></td>
                            <td className="property-cell">{booking.property_name}</td>
                            <td>{booking.property_city}</td>
                            <td>{booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}</td>
                            <td>{booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}</td>
                            <td className="text-center fw-semibold">{nights}</td>
                            <td className="text-end">{formatCurrency(brRate)}</td>
                            <td className="text-end text-muted">{formatCurrency(hotelRate)}</td>
                            <td className="text-end text-success">{formatCurrency(savings)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan={7}><strong>Total</strong></td>
                      <td className="text-center">
                        <strong>
                          {rawBookingsData
                            .filter(booking => !selectedLocation || booking.property_city === selectedLocation.value)
                            .filter(booking => !selectedProperty || booking.property_name.includes(selectedProperty.label?.split(' - ')[0] || ''))
                            .filter(booking => !selectedDepartment || booking.traveler_segment === selectedDepartment.label)
                            .reduce((sum, b) => sum + (b.total_nights || 0), 0)}
                        </strong>
                      </td>
                      <td colSpan={2}></td>
                      <td className="text-end text-success">
                        <strong>
                          {formatCurrency(
                            rawBookingsData
                              .filter(booking => !selectedLocation || booking.property_city === selectedLocation.value)
                              .filter(booking => !selectedProperty || booking.property_name.includes(selectedProperty.label?.split(' - ')[0] || ''))
                              .filter(booking => !selectedDepartment || booking.traveler_segment === selectedDepartment.label)
                              .reduce((sum, b) => {
                                const baseBRRate = brRates[b.property_city] || b.price_per_night;
                                const brRate = calculateBRRate(baseBRRate, 80, useOccupancyAdjustment);
                                const hotelRate = hotelRates[b.property_city] || 7000;
                                return sum + ((hotelRate - brRate) * (b.total_nights || 0));
                              }, 0)
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
              <div className="table-footnote px-3 py-2">
                {useOccupancyAdjustment 
                  ? '*BR Rate is occupancy-adjusted: Base Rate / Occupancy % (e.g., ₹3,500 / 80% = ₹4,375)'
                  : '*BR Rate is direct rate without occupancy adjustment'}
              </div>
            </Card.Body>
          </Card>

          </>}

        </Container>
      </div>

      <style jsx global>{`
        .reporting-page {
          background: #f2eeeb;
          min-height: 100vh;
          padding-bottom: 40px;
        }
        
        .reporting-header {
          padding-top: 24px;
        }
        
        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: #2D3748;
        }
        
        .page-subtitle {
          font-size: 14px;
        }
        
        .period-select {
          min-width: 160px;
        }
        
        .filter-card {
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        
        .filter-label {
          font-size: 13px;
          font-weight: 500;
          color: #4A5568;
          margin-bottom: 6px;
        }
        
        .date-input {
          font-size: 13px;
          padding: 8px 12px;
        }
        
        .stat-card {
          border: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .stat-card.highlight-card {
          background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #2D3748;
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 12px;
          color: #718096;
          margin-top: 4px;
        }
        
        .savings-card {
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .savings-card .card-header {
          background: #fff;
          border-bottom: 1px solid #E2E8F0;
        }
        
        .savings-summary {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .savings-item {
          padding: 16px;
          background: #F7FAFC;
          border-radius: 8px;
        }
        
        .savings-item.highlight {
          background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
        }
        
        .savings-label {
          font-size: 13px;
          color: #718096;
          margin-bottom: 4px;
        }
        
        .savings-value {
          font-size: 24px;
          font-weight: 700;
        }
        
        .savings-value.br-value {
          color: #3A8C8C;
        }
        
        .savings-value.hotel-value {
          color: #BF9039;
        }
        
        .savings-value.savings-highlight {
          color: #2E7D32;
        }
        
        .savings-sub {
          font-size: 12px;
          color: #A0AEC0;
          margin-top: 4px;
        }
        
        .hotel-rates-editor {
          background: #F7FAFC;
          border-radius: 8px;
          padding: 16px;
        }
        
        .rate-edit-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #E2E8F0;
        }
        
        .rate-edit-row:last-child {
          border-bottom: none;
        }
        
        .city-name {
          font-size: 13px;
          color: #4A5568;
        }
        
        .rate-display {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .rate-display:hover {
          background: #E2E8F0;
        }
        
        .rate-value {
          font-weight: 600;
          color: #2D3748;
        }
        
        .edit-icon {
          opacity: 0.5;
        }
        
        .rate-display:hover .edit-icon {
          opacity: 1;
        }
        
        .rate-edit-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .rate-input {
          width: 100px;
          font-size: 13px;
        }
        
        .chart-title {
          font-size: 14px;
          font-weight: 600;
          color: #4A5568;
        }
        
        .custom-chart-tooltip {
          background: #fff;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border: 1px solid #E2E8F0;
        }
        
        .tooltip-label {
          font-weight: 600;
          margin-bottom: 4px;
          color: #2D3748;
        }
        
        .department-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .dept-bar-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .dept-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }
        
        .dept-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .dept-name {
          flex: 1;
          color: #4A5568;
        }
        
        .dept-value {
          color: #718096;
        }
        
        .dept-bar {
          height: 6px;
          background: #E2E8F0;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .dept-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .locations-table,
        .employee-table,
        .department-details-table {
          font-size: 13px;
        }
        
        .locations-table th,
        .employee-table th,
        .department-details-table th {
          background: #F7FAFC;
          font-weight: 600;
          color: #4A5568;
          border-bottom: 2px solid #E2E8F0;
          padding: 12px 16px;
        }
        
        .locations-table td,
        .employee-table td,
        .department-details-table td {
          padding: 12px 16px;
          vertical-align: middle;
          border-bottom: 1px solid #E2E8F0;
        }
        
        .location-rank {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #E2E8F0;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 600;
          margin-right: 8px;
        }
        
        .table-footnote {
          font-size: 11px;
          color: #A0AEC0;
          background: #F7FAFC;
          border-top: 1px solid #E2E8F0;
        }
        
        .employee-info {
          display: flex;
          flex-direction: column;
        }
        
        .employee-name {
          font-weight: 500;
          color: #2D3748;
        }
        
        .employee-designation {
          font-size: 11px;
          color: #A0AEC0;
        }
        
        .dept-badge {
          display: inline-block;
          padding: 2px 8px;
          background: #E2E8F0;
          border-radius: 4px;
          font-size: 11px;
          color: #4A5568;
        }
        
        .dept-color-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .percentage-bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .percentage-fill {
          height: 8px;
          border-radius: 4px;
          min-width: 4px;
        }
        
        .percentage-text {
          font-size: 12px;
          color: #718096;
          min-width: 35px;
        }
        
        .total-row {
          background: #F7FAFC;
        }
        
        .total-row td {
          border-top: 2px solid #CBD5E0;
        }
        
        .edit-icon-text {
          font-size: 11px;
          color: #5A8C37;
          opacity: 0;
          transition: opacity 0.2s;
          margin-left: 8px;
        }
        
        .rate-display:hover .edit-icon-text {
          opacity: 1;
        }
        
        .br-rate-settings {
          background: #F7FAFC;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #E2E8F0;
        }
        
        .occupancy-toggle {
          font-size: 12px;
        }
        
        .occupancy-toggle .form-check-input:checked {
          background-color: #5A8C37;
          border-color: #5A8C37;
        }
        
        .adjusted-rate {
          font-size: 12px;
          color: #718096;
          margin-left: 8px;
        }
        
        .adjustment-tag {
          font-size: 10px;
          color: #5A8C37;
          margin-left: 4px;
        }
        
        .table-footnote {
          background: #F7FAFC;
          border-top: 1px solid #E2E8F0;
          font-size: 12px;
          color: #718096;
        }
        
        .savings-badge {
          display: inline-block;
          padding: 2px 8px;
          background: #E8F5E9;
          color: #2E7D32;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .dept-savings-table th,
        .raw-bookings-table th {
          background: #F7FAFC;
          font-weight: 600;
          color: #4A5568;
          border-bottom: 2px solid #E2E8F0;
          padding: 12px 16px;
          font-size: 12px;
          white-space: nowrap;
        }
        
        .dept-savings-table td,
        .raw-bookings-table td {
          padding: 10px 16px;
          vertical-align: middle;
          border-bottom: 1px solid #E2E8F0;
          font-size: 13px;
        }
        
        .raw-bookings-table {
          min-width: 1100px;
        }
        
        .dept-tag {
          display: inline-block;
          padding: 2px 8px;
          background: #EDF2F7;
          border-radius: 4px;
          font-size: 11px;
          color: #4A5568;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .guest-cell {
          font-weight: 500;
          color: #2D3748;
          white-space: nowrap;
        }
        
        .booking-id {
          font-size: 11px;
          background: #F7FAFC;
          padding: 2px 6px;
          border-radius: 4px;
          color: #718096;
        }
        
        .property-cell {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .fw-semibold {
          font-weight: 600;
        }
      `}</style>
    </ProtectedRoute>
  );
}
