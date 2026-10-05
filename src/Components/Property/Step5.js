"use client";
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Image } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { AssignProperty, UpdatePropertyAssignmentAPI, PropertyDataById, companyDetailAPI, companyListAPI, WizardStepUpdateAPI } from '@/services/provider';
import { getItemLocalStorage } from '@/utils/browserStorage';
import { useRouter } from "next/navigation";

export default function Step5({ step5Data, setStep5Data, CompanyListData, activeStep, setActiveStep, saveExit, setSaveExit, assignmentRemoveClose, draft, getRoomList, propertyUid, loadMoreCompany }) {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    setProperties([{
      assigned_company: null,
      date_from: null,
      date_to: null,
      collapsed: false,
    }])
  }, [activeStep])
  const [property, setProperty] = useState({});

  useEffect(() => {
    try {
      const propertyItem = getItemLocalStorage("properyItem");
      if (propertyItem) {
        setProperty(JSON.parse(propertyItem));
      } else if (draft?.uid) {
        setProperty(draft)
      }
    } catch (error) {
      console.error("Error loading property data:", error);
    }
  }, [activeStep]);

  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState("")

  // -----------------------
  // ADD PROPERTY
  // -----------------------
  const handleAddProperty = () => {
    setProperties([
      ...properties,
      {
        assigned_company: null,
        date_from: null,
        date_to: null,
        collapsed: false,
      },
    ]);
  };

  // -----------------------
  // DELETE PROPERTY
  // -----------------------
  const handleDeleteProperty = (idx) => {
    setProperties(properties.filter((_, i) => i !== idx));
  };

  // -----------------------
  // COLLAPSE PROPERTY
  // -----------------------
  const handleCollapseProperty = (idx) => {
    setProperties(
      properties.map((prop, i) =>
        i === idx ? { ...prop, collapsed: !prop.collapsed } : prop
      )
    );
  };

  // -----------------------
  // HANDLE INPUT CHANGE
  // -----------------------
  const handleChange = (idx, field, value) => {
    setProperties(prev =>
      prev.map((prop, i) => {
        if (i !== idx) return prop;

        let newValue = value;

        // Case 1: Select option object {value, label}
        if (value && typeof value === "object" && "value" in value && "label" in value) {
          newValue = value.value; // store only the uid
        }

        // Case 2: Date object
        // if (value instanceof Date) {
        //   newValue = value.toISOString().split("T")[0]; // "YYYY-MM-DD"
        // }

        if (value instanceof Date) {
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, "0");
          const day = String(value.getDate()).padStart(2, "0");
          newValue = `${year}-${month}-${day}`; // "YYYY-MM-DD" 
        }

        return {
          ...prop,
          [field]: newValue,
        };
      })
    );
  };

  // -----------------------
  // VALIDATION LOGIC
  // -----------------------
  const validate = () => {
    let newErrors = {};

    properties.forEach((prop, index) => {
      console.log(prop)
      let propErrors = {};

      if (!prop.assigned_company) propErrors.assigned_company = "Company name is required";
      if (!prop.date_from) propErrors.date_from = "Date From is required";
      if (!prop.date_to) propErrors.date_to = "Date To is required";

      if (prop.date_from && prop.date_to) {
        if (new Date(prop.date_to) < new Date(prop.date_from)) {
          propErrors.date_to = "Date To cannot be earlier than Date From";
        }
      }

      if (Object.keys(propErrors).length > 0) {
        newErrors[index] = propErrors;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getErrorMessage = (errorData) => {
    if (!errorData) return "Something went wrong";

    // String
    if (typeof errorData === "string") {
      return errorData;
    }

    // Array
    if (Array.isArray(errorData)) {
      return errorData.map(item => getErrorMessage(item)).join("\n");
    }

    // Object (🔥 KEY INCLUDED)
    if (typeof errorData === "object") {
      return Object.entries(errorData)
        .map(([key, value]) => {
          return `${key}:\n${getErrorMessage(value)}`;
        })
        .join("\n\n");
    }

    return String(errorData);
  };



  const hasAnyAssignmentValue = () => {
    return properties?.some(p =>
      p?.assigned_company ||
      p?.date_from ||
      p?.date_to
    );
  };


  // -----------------------
  // CONTINUE BUTTON
  // -----------------------
  const handleContinue = async (flag) => {
    // if (!validate()) {
    //   return;
    // }


    // PURE FORM EMPTY → JUST MOVE NEXT
    if (!hasAnyAssignmentValue()) {
      if (flag === "exit") {
        router.push("/PropertyListing");
      } else {
        setActiveStep(prev => prev + 1);
      }
      return;
    }

    try {
      let response;
      setSaveExit(false)
      assignmentRemoveClose()
      // if (validate()) {      
      if (mode != "edit") {

        const fieldData = {};
        fieldData["assigned_property"] = property?.uid;
        fieldData["assignments"] = properties;

        response = await AssignProperty(fieldData);
        // 🔥 HANDLE BACKEND FAILURE HERE
        if (response?.data?.success === false) {
          const message = getErrorMessage(response?.data?.response);
          window.alert(message);
          return;
        }





      } else {
        const fieldData = new FormData();
        fieldData.append("assignment_uids", JSON.stringify(properties.map(prop => prop.uid)))
        fieldData.append("company_uids", JSON.stringify(properties.map(prop => {
          const matched = CompanyListData?.find(c => c.label === prop.assigned_company);
          console.log(prop, matched, CompanyListData)
          return matched ? matched.value : null;   // or matched.uid if needed
        })))
        fieldData.append("date_from", JSON.stringify(properties.map(prop => prop.date_from)))
        fieldData.append("date_to", JSON.stringify(properties.map(prop => prop.date_to)))
        console.log(fieldData)
        response = await UpdatePropertyAssignmentAPI(property?.uid, fieldData);




        // 🔥 HANDLE BACKEND FAILURE HERE
        if (response?.data?.success === false) {
          const message = getErrorMessage(response?.data?.response);
          window.alert(message);
          return;
        }



      }
      if (response?.data?.success) {
        await getRoomList(propertyUid);
        // setActiveStep(activeStep + 1)
        if (flag == "exit") {
          const wizard = new FormData();
          wizard.append("wizard_step_completed", activeStep)
          await WizardStepUpdateAPI(property?.uid, wizard)
          router.push("/PropertyListing")
        } else { setActiveStep(activeStep + 1) }
      }
      // // } else {
      // //   const firstErrorField = Object.keys(errors)[0];
      // //   const element = document.querySelector(`[name="${firstErrorField}"]`);
      // //   if (element) {
      // //     element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // //   }
      // }
    } catch (error) {
      const backendResponse =
        error?.response?.data?.response ||
        error?.response?.data ||
        error?.message;

      const message = getErrorMessage(backendResponse);

      window.alert(message);
    }

  };

  useEffect(() => {
    if (saveExit && activeStep == 5) {
      handleContinue('exit')
    }
  }, [saveExit])

  // -----------------------
  // CUSTOM STYLES
  // -----------------------
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#4635271F"
        : state.isFocused
          ? "#4635271F"
          : "inherit",
      color: state.isSelected ? "#000" : "black",
      cursor: "pointer",
    }),
  };

  const fetchData = async (id) => {
    try {
      const res = await PropertyDataById(id);
      const data = await res.data.response;
      if (data.length > 0) {
        setMode("edit")
      }
      setProperties(data)
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (property?.uid) {
      fetchData(property?.uid);
    }
  }, [mode, property?.uid]);

  // -----------------------------------------------------------------

  return (
    <>
      <Container>
        <Row>
          <Col md={8}>
            <div className="box-input">
              <h3 className="page-title mb-4">Assign this BR to companies</h3>

              {properties.map((property, idx) => (
                <div className="assign-property-box mt-5" key={idx}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      className="pb-4"
                      style={{
                        fontSize: "20px",
                        borderBottom: "1px solid #463527",
                        fontWeight: "500",
                        color: "#463527",
                        marginBottom: 0,
                      }}
                    >
                      {`Company ${idx + 1}`}
                    </p>

                    {/* {idx !== 0 && ( */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span
                        className="d-flex align-items-center"
                        style={{ cursor: "pointer", color: "#463527", fontWeight: 500 }}
                        onClick={() => handleCollapseProperty(idx)}
                      >
                        {property.collapsed ? "Expand" : "Collapse"}
                        <Image
                          src="/images/icons/top-arrow.svg"
                          width={18}
                          height={18}
                          alt="toggle"
                          style={{
                            transform: property.collapsed ? "rotate(180deg)" : "none",
                            marginLeft: "6px",
                          }}
                        />
                      </span>

                      <Button
                        variant="outline"
                        style={{
                          border: "1px solid #463527",
                          background: "none",
                          padding: "8px",
                          borderRadius: "0",
                        }}
                        onClick={() => handleDeleteProperty(idx)}
                      >
                        <Image
                          src="/images/icons/delete_b.svg"
                          width={20}
                          height={20}
                          alt="Delete"
                        />
                      </Button>
                    </div>
                    {/* )} */}
                  </div>

                  <hr style={{ marginTop: 0 }} />

                  {!property.collapsed && (
                    <div
                      className="add-propertu-assign mt-4 p-4"
                      style={{ border: "1px solid #4635271F" }}
                    >
                      <Row>
                        {/* Company Name */}
                        <Col md={12}>
                          <div className="form-group mb-4">
                            <label>Company name</label>

                            <Select
                              className="add-buisness-field"
                              placeholder="Add a Company"
                              isSearchable={true}
                              // full object stored → works
                              options={CompanyListData}
                              value={property.uid ? (CompanyListData?.find(c => c.label === property.assigned_company) || null) : (CompanyListData?.find(c => c.value === property.assigned_company) || null)}
                              onChange={option => handleChange(idx, 'assigned_company', option)}
                              onMenuScrollToBottom={loadMoreCompany}
                              styles={customStyles}
                            />

                            {errors[idx]?.assigned_company && (
                              <p className="text-danger mt-1">{errors[idx].assigned_company}</p>
                            )}
                          </div>
                          <hr />
                        </Col>

                        {/* Date From */}
                        <Col md={6}>
                          <div className="form-group">
                            <label>Date From</label>
                            <DatePicker
                              selected={property.date_from}
                              onChange={(date) => { handleChange(idx, "date_from", date) }}
                              placeholderText="Select Dates"
                              className="form-control custom-date-picker"
                              minDate={new Date()}
                              dateFormat="dd/MM/yyyy"
                            />
                            {errors[idx]?.date_from && (
                              <p className="text-danger mt-1">{errors[idx].date_from}</p>
                            )}
                          </div>
                        </Col>

                        {/* Date To */}
                        <Col md={6}>
                          <div className="form-group">
                            <label>Date To</label>
                            <DatePicker
                              selected={property.date_to}
                              onChange={(date) => { handleChange(idx, "date_to", date) }}
                              placeholderText="Select Dates"
                              className="form-control custom-date-picker"
                              minDate={property.date_from || new Date()}
                              dateFormat="dd/MM/yyyy"
                            />
                            {errors[idx]?.date_to && (
                              <p className="text-danger mt-1">{errors[idx].date_to}</p>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              ))}

              <Button variant="" className="btn-company-add mt-5 mb-5" onClick={handleAddProperty}>
                <span style={{ fontSize: "24px" }}> + </span> Assign Another Company
              </Button>

              <hr />

              {/* Navigation Buttons */}
              <div className="d-flex mt-5">
                <Button
                  variant=""
                  className="btn-white-transparent d-flex gap-2 me-3"
                  style={{ padding: "13px 35px", borderRadius: "0" }}
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  <Image src="./images/icons/double-arrows.svg" className="img-fluid" alt="arrow" />
                  Back
                </Button>

                <Button
                  variant=""
                  className="complete-form-btn"
                  style={{ padding: "13px 35px", borderRadius: "0" }}
                  onClick={() => handleContinue()}
                >
                  Continue
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}