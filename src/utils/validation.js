// import { Finalize } from "../Interfaces/reservationInterface";
// import { IPassword, Login, User } from "../Interfaces/userInterface";

const emailValidation = (userData) => {
    let error = {};
    let valid = true;

    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (userData.email !== undefined && !userData.email) {
        error = "Please enter email";
        valid = false;
    } else if (userData.email !== undefined && !emailregex.test(userData.email)) {
        error = "Please enter valid email";
        valid = false;
    } else if (userData.email) {
        error = '';
    }
    return { error, valid };
};


const passwordRegexValid = (passData) => {
    let error = {};
    let valid = true;

    var PasswordRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,16})"
    );
    if (passData.password !== undefined && !passData.password) {
        error = "Please enter password";
        valid = false;
    } else if (passData.password !== undefined && !PasswordRegex.test(passData.password)) {
        error = "Password must be 8 to 16 long alphanumeric, must contain atleast 1 special character and upper case / lower case letters";
        valid = false;
    } else if (passData.password) {
        error = "";
    }
    return { error, valid };
};


export const addCompanyValidation = (userData) => {
    let errors = {};
    let isValid = true;

    if (userData.companyName !== undefined && !userData.companyName) {
        errors.companyName = "Company name is required";
        isValid = false;
    } else if (userData.companyName !== undefined && userData.companyName.length < 3) {
        errors.companyName = "Minimum 3 character";
        isValid = false;
    } else if (userData.companyName) {
        errors.companyName = '';
    }

    if (userData.headOfficeLocation !== undefined && !userData.headOfficeLocation) {
        errors.headOfficeLocation = "Head office location required";
        isValid = false;
    } else if (userData.headOfficeLocation !== undefined && userData.headOfficeLocation.length < 3) {
        errors.headOfficeLocation = "Minimum 3 character";
        isValid = false;
    } else if (userData.headOfficeLocation) {
        errors.headOfficeLocation = '';
    }

    if (userData.city !== undefined && !userData.city) {
        errors.city = "City is required";
        isValid = false;
    } else if (userData.city !== undefined && userData.city.length < 3) {
        errors.city = "Minimum 3 character";
        isValid = false;
    } else if (userData.city) {
        errors.city = '';
    }

    if (userData.state !== undefined && !userData.state) {
        errors.state = "State is required";
        isValid = false;
    } else if (userData.state !== undefined && userData.state.length < 3) {
        errors.state = "Minimum 3 character";
        isValid = false;
    } else if (userData.state) {
        errors.state = '';
    }

    // ✅ Fixed
    if ("street" in userData && !userData.street?.trim())
        errors.street = "Street and number is required";

    if ("country" in userData && !userData.country?.trim())
        errors.country = "Country is required";

    if (userData.pinCode !== undefined && !userData.pinCode) {
        errors.pinCode = "Please enter PIN";
        isValid = false;
    } else if (userData.pinCode !== undefined && !/^\d{6}$/.test(String(userData.pinCode))) {
        errors.pinCode = "Enter valid 6-digit PIN";
        isValid = false;
    } else if (userData.pinCode) {
        errors.pinCode = '';
    }

    if (userData.firstName !== undefined && !userData.firstName) {
        errors.firstName = "Please enter first name";
        isValid = false;
    } else if (userData.firstName !== undefined && userData.firstName.length < 3) {
        errors.firstName = "Minimum 3 character";
        isValid = false;
    } else if (userData.firstName) {
        errors.firstName = '';
    }

    if (userData.lastName !== undefined && !userData.lastName) {
        errors.lastName = "Please enter last name";
        isValid = false;
    } else if (userData.lastName !== undefined && userData.lastName.length < 3) {
        errors.lastName = "Minimum 3 character";
        isValid = false;
    } else if (userData.lastName) {
        errors.lastName = '';
    }

    if (userData.email !== undefined) {
        const { error, valid } = emailValidation(userData);
        if (!valid) {
            errors.email = error;
            isValid = valid;
        } else {
            errors.email = "";
        }
    }

    if (userData.phone !== undefined && !userData.phone) {
        errors.phone = "Please enter phone number";
        isValid = false;
    } else if (
        userData.phone !== undefined &&
        userData.phone.length < 10
    ) {
        errors.phone = "Please enter valid number";
    } else if (userData.phone) {
        errors.phone = '';
    }

    if (userData.gst !== undefined && !userData.gst) {
        errors.gst = "Please enter GST number";
        isValid = false;
    } else if (userData.gst !== undefined && userData.gst.match(/^[0-9A-Z]{14}$/)) {
        errors.gst = "Enter valid 15-character GST number";
        isValid = false;
    } else if (userData.gst) {
        errors.gst = '';
    }

    if (userData.legalEntity !== undefined && !userData.legalEntity) {
        errors.legalEntity = "Legal entity name is required";
        isValid = false;
    } else if (userData.legalEntity !== undefined && userData.legalEntity.length < 3) {
        errors.legalEntity = "Minimum 3 character";
        isValid = false;
    } else if (userData.legalEntity) {
        errors.legalEntity = '';
    }

    if (userData.currency !== undefined && !userData.currency) {
        errors.currency = "Select a contract currency";
        isValid = false;
    } else if (userData.currency) {
        errors.currency = '';
    }

    return { errors, isValid };
};
export const travellerValidation = (userData, enteredPass, isRequired) => {
    let errors = {};
    let isValid = true;

    if (userData.firstName !== undefined && !userData.firstName) {
        errors.firstName = "Please enter first name";
        isValid = false;
    } else if (userData.firstName !== undefined && userData.firstName.length < 3) {
        errors.firstName = "Minimum 3 character";
        isValid = false;
    } else if (userData.firstName) {
        errors.firstName = '';
    }

    if (userData.lastName !== undefined && !userData.lastName) {
        errors.lastName = "Please enter last name";
        isValid = false;
    } else if (userData.lastName !== undefined && userData.lastName.length < 3) {
        errors.lastName = "Minimum 3 character";
        isValid = false;
    } else if (userData.lastName) {
        errors.lastName = '';
    }

    if (userData.gender !== undefined && !userData.gender) {
        errors.gender = "Please select gender";
        isValid = false;
    } else if (userData.gender) {
        errors.gender = '';
    }

    if (userData.companyName !== undefined && !userData.companyName) {
        errors.companyName = "Please select company";
        isValid = false;
    } else if (userData.companyName) {
        errors.companyName = '';
    }

    if (userData.role !== undefined && !userData.role) {
        errors.role = "Please select role";
        isValid = false;
    } else if (userData.role) {
        errors.role = '';
    }

    if (userData.traveller_type !== undefined && !userData.traveller_type) {
        errors.traveller_type = "Please select traveler category";
        isValid = false;
    } else if (userData.traveller_type) {
        errors.traveller_type = '';
    }

    if (isRequired?.employee_id_required == "Required") {
        if (userData.employee_id !== undefined && !userData.employee_id) {
            errors.employee_id = "Please enter employee ID";
            isValid = false;
        } else if (userData.employee_id) {
            errors.employee_id = '';
        }
    }

    if (isRequired?.segment_required == "Required") {
        if (userData.segment !== undefined && !userData.segment) {
            errors.segment = "Please enter dept./segment";
            isValid = false;
        } else if (userData.segment) {
            errors.segment = '';
        }
    }
    if (isRequired?.designation_required == "Required") {
        if (userData.designation !== undefined && !userData.designation) {
            errors.designation = "Please enter designation";
            isValid = false;
        } else if (userData.designation) {
            errors.designation = '';
        }
    }
    if (isRequired?.employee_grade_required == "Required") {
        if (userData.employee_grade !== undefined && !userData.employee_grade) {
            errors.employee_grade = "Please enter employee_grade";
            isValid = false;
        } else if (userData.employee_grade) {
            errors.employee_grade = '';
        }
    }

    if (isRequired?.account_unit_required == "Required") {
        if (userData.account_unit !== undefined && !userData.account_unit) {
            errors.account_unit = "Please enter account_unit";
            isValid = false;
        } else if (userData.account_unit) {
            errors.account_unit = '';
        }
    }

    if (isRequired?.account_code_required == "Required") {
        if (userData.account_code !== undefined && !userData.account_code) {
            errors.account_code = "Please enter account_code";
            isValid = false;
        } else if (userData.account_code) {
            errors.account_code = '';
        }
    }

    // if (userData.rezo_ticket !== undefined && !userData.rezo_ticket) {
    //     errors.rezo_ticket = "Please enter rezo ticket";
    //     isValid = false;
    // } else if (userData.rezo_ticket !== undefined && userData.rezo_ticket.length < 3) {
    //     errors.rezo_ticket = "Minimum 3 character";
    //     isValid = false;
    // } else if (userData.rezo_ticket) {
    //     errors.rezo_ticket = '';
    // }

    if (userData.email !== undefined) {
        const { error, valid } = emailValidation(userData);
        if (!valid) {
            errors.email = error;
            isValid = valid;
        } else {
            errors.email = "";
        }
    }


    if (isRequired?.phone_required == "Required") {
        if (userData.phone !== undefined && !userData.phone) {
            errors.phone = "Please enter phone number";
            isValid = false;
        } else if (
            userData.phone !== undefined &&
            userData.phone.length < 10
        ) {
            errors.phone = "Please enter valid number";
        } else if (userData.phone) {
            errors.phone = '';
        }
    }

    if (userData.password !== undefined) {
        const { error, valid } = passwordRegexValid(userData);
        if (!valid) {
            errors.password = error;
            isValid = valid;
        } else {
            errors.password = "";
        }
    }

    // if (userData.con_password !== undefined && !userData.con_password) {
    //     errors.con_password = "Please enter confirm password";
    //     isValid = false;
    // } else if (
    //     userData.con_password !== enteredPass &&
    //     userData.con_password
    // ) {
    //     errors.con_password = "Does not match confirm password";
    //     isValid = false;
    // } else if (userData.con_password == enteredPass) {
    //     errors.con_password = "";
    // }

    return { errors, isValid };
};


export const loginValidation = (userData) => {
    let errors = {};
    let isValid = true;

    if (userData.email !== undefined) {
        const { error, valid } = emailValidation(userData);
        if (!valid) {
            errors.email = error;
            isValid = valid;
        } else if (userData.email) {
            errors.email = '';
        }
    }

    if (userData.password !== undefined && !userData.password) {
        errors.password = "Please enter password";
        isValid = false;
    } else if (userData.password) {
        errors.password = '';
    }

    return { errors, isValid };
};


export const passwordValidation = (passData) => {
    let errors = {};
    let isValid = true;

    if (passData.oldPassword !== undefined && !passData.oldPassword) {
        errors.oldPassword = "Please enter password";
        isValid = false;
    } else {
        errors.oldPassword = ""
    }

    if (passData.password !== undefined) {
        const { error, valid } = passwordRegexValid(passData);
        if (!valid) {
            errors.password = error;
            isValid = valid;
        } else {
            errors.password = "";
        }
    }

    if (passData.confirmPassword !== undefined && !passData.confirmPassword) {
        errors.confirmPassword = "Please enter Confirm Password";
        isValid = false;
    } else if (
        passData.confirmPassword !== passData.password &&
        passData.confirmPassword
    ) {
        errors.confirmPassword = "Does not match Confirm Password";
        isValid = false;
    } else if (passData.confirmPassword == passData.password) {
        errors.confirmPassword = "";
    }
    return { errors, isValid };
};


export const finalizerValidation = (userData) => {
    let errors = {};
    let isValid = true;

    if (userData.first_name !== undefined && !userData.first_name) {
        errors.first_name = "Please enter first name";
        isValid = false;
    } else if (userData.first_name) {
        errors.first_name = "";
    }

    if (userData.last_name !== undefined && !userData.last_name) {
        errors.last_name = "Please enter last name";
        isValid = false;
    } else if (userData.last_name) {
        errors.last_name = "";
    }

    if (userData.card_number !== undefined && !userData.card_number) {
        errors.card_number = "Please enter card number";
        isValid = false;
    } else if (userData.card_number !== undefined && /[0-9]/g.test(userData.card_number) == false) {
        errors.card_number = "Please enter valid number"
        isValid = false;
    } else if (userData.card_number) {
        errors.card_number = "";
    }

    if (userData.mm_yy !== undefined && !userData.mm_yy) {
        errors.mm_yy = "Required"
        isValid = false;
    } else if (userData.mm_yy !== undefined && /^(0[1-9]|1[0-2])\/\d{2,3}$/.test(userData.mm_yy) == false) {
        errors.mm_yy = "Please enter valid mm/yy"
        isValid = false;
    } else if (userData.mm_yy) {
        errors.mm_yy = "";
    }

    if (userData.cvc !== undefined && !userData.cvc) {
        errors.cvc = "Required"
        isValid = false;
    } else if (userData.cvc !== undefined && /\d{3}/g.test(userData.cvc) == false) {
        errors.cvc = "Please enter valid cvc"
        isValid = false;
    } else if (userData.cvc) {
        errors.cvc = "";
    }

    if (userData.cancellation === false || userData.venues === false || userData.acknowledge === false) {
        errors.checkbox = "Please check the check boxes"
        isValid = false;
    } else if (userData.acknowledge === true || userData.cancellation === true || userData.venues === true) {
        errors.checkbox = ""
    }

    return { errors, isValid };
}

export const checkboxValidation = (userChecked) => {
    let error = {};
    let isValid = true;
    if (userChecked.terms_and_condition === false) {
        error.terms_and_condition = "Please accept terms and condition "
        isValid = false
    } else if (userChecked.terms_and_condition === true) {
        error.terms_and_condition = ""
    }
    return { error, isValid }
}

export const CompanyStatusValidation = (userData) => {
    let errors = {};
    let isValid = true;

    if (userData.currentStatus !== undefined && !userData.currentStatus) {
        errors.currentStatus = "current status is required";
        isValid = false;
    } else if (userData.currentStatus) {
        errors.currentStatus = '';
    }

    if (userData.inactiveFrom !== undefined && !userData.inactiveFrom) {
        errors.inactiveFrom = "Inactive from date is required";
        isValid = false;
    } else if (userData.inactiveFrom) {
        errors.inactiveFrom = '';
    }

    if (userData.inactiveTo !== undefined && !userData.inactiveTo) {
        errors.inactiveTo = "Inactive to date is required";
        isValid = false;
    } else if (userData.inactiveTo) {
        errors.inactiveTo = '';
    }

    if (userData.reason !== undefined && !userData.reason) {
        errors.reason = "reason is required";
        isValid = false;
    } else if (userData.reason) {
        errors.reason = '';
    }

    if (userData.message !== undefined && !userData.message) {
        errors.message = "message is required";
        isValid = false;
    } else if (userData.message) {
        errors.message = '';
    }

    return { errors, isValid };
};
export const CustomFieldValidation = (customField, type) => {
    let errors = {};
    let isValid = true;

    if (customField.display_name !== undefined && !customField.display_name) {
        errors.display_name = "Question is required";
        isValid = false;
    } else if (customField.display_name) {
        errors.display_name = '';
    }
    if (type == "dropdown") {
        if (customField.values !== undefined && !customField?.values?.length) {
            errors.values = "options are required";
            isValid = false;
        } else if (customField.values) {
            errors.values = '';
        }
    }

    return { errors, isValid };
};

export const propertStepFirstValidation = (userData, showManual, hasManagerData, hasCaretakerData) => {
    let error = {};
    let isValid = true;

    if (userData.propertyName !== undefined && !userData.propertyName) {
        error.propertyName = "Property name is required";
        isValid = false;
    } else if (userData.propertyName !== undefined && userData.propertyName.length > 32) {
        error.propertyName = "Property name must be less than 32 characters";
        isValid = false;
    } else if (userData.propertyName) {
        error.propertyName = '';
    }

    if (userData.propertyAddress !== undefined && !userData.propertyAddress) {
        error.propertyAddress = "Property address is required";
        isValid = false;
    } else if (userData.propertyAddress) {
        error.propertyAddress = '';
    }

    if (userData.operationsManagerName !== undefined && !userData.operationsManagerName) {
        error.operationsManagerName = "Operations manager name is required";
        isValid = false;
    } else if (userData.operationsManagerName) {
        error.operationsManagerName = '';
    }

    if (userData.operationsManagerEmail !== undefined && !userData.operationsManagerEmail) {
        error.operationsManagerEmail = "Operations manager email is required";
        isValid = false;
    } else if (
        userData.operationsManagerEmail !== undefined &&
        // userData.operationsManagerEmail.length < 10 &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.operationsManagerEmail)
    ) {
        error.operationsManagerEmail = "Please enter a valid email";
        isValid = false;
    } else if (userData.operationsManagerEmail) {
        error.operationsManagerEmail = '';
    }

    if (userData.operationsManagerPhone !== undefined && !userData.operationsManagerPhone) {
        error.operationsManagerPhone = "Operations manager phone is required";
        isValid = false;
    } else if (
        userData.operationsManagerPhone !== undefined &&
        userData.operationsManagerPhone.length < 10 &&
        !/^\+?[\d\s-]{10,}$/.test(userData.operationsManagerPhone.replace(/\s/g, ''))
    ) {
        error.operationsManagerPhone = "Please enter a valid phone number";
        isValid = false;
    } else if (userData.operationsManagerPhone) {
        error.operationsManagerPhone = '';
    }

    if (
        userData.operationsManagerAlternatePhone &&
        userData.operationsManagerAlternatePhone.length < 10 &&
        !/^\+?[\d\s-]{10,}$/.test(userData.operationsManagerAlternatePhone.replace(/\s/g, ''))
    ) {
        error.operationsManagerAlternatePhone = "Please enter a valid phone number";
        isValid = false;
    } else {
        error.operationsManagerAlternatePhone = "";
    }

    // Street and number validation (only if manual address is shown)
    if (showManual) {
        if (userData.streetNumber !== undefined && !userData.streetNumber) {
            error.streetNumber = 'Street and number is required';
            isValid = false;
        } else {
            error.streetNumber = '';
        }

        if (userData.city !== undefined && !userData.city) {
            error.city = 'city is required';
            isValid = false;
        } else {
            error.city = '';
        }

        if (userData.state !== undefined && !userData.state) {
            error.state = 'state is required';
            isValid = false;
        } else {
            error.state = '';
        }

        if (userData.country !== undefined && !userData.country) {
            error.country = 'country is required';
            isValid = false;
        } else {
            error.country = '';
        }

        if (userData.pinCode !== undefined && !userData.pinCode) {
            error.pinCode = 'pinCode is required';
            isValid = false;
        } else {
            error.pinCode = '';
        }
    }

    if (hasManagerData != undefined && !hasManagerData) {
        error.managers = 'At least one property manager is required';
        isValid = false;
    } else { error.managers = "" }
    if (hasCaretakerData != undefined && !hasCaretakerData) {
        error.caretakers = 'At least one property caretaker is required';
        isValid = false;
    } else { error.caretakers = "" }

    return { error, isValid };
};

export const propertStepFourthValidation = (inputData) => {
    let error = {};
    let isValid = true;

    if (inputData.roomName !== undefined && !inputData.roomName) {
        error.roomName = "Property name is required";
        isValid = false;
    } else if (inputData.roomName !== undefined && inputData.roomName.length < 3) {
        error.roomName = "Property name must be less than 32 characters";
        isValid = false;
    } else if (inputData.roomName) {
        error.roomName = '';
    }

    if (inputData.roomType !== undefined && !inputData.roomType) {
        error.roomType = "Please select a room type";
        isValid = false;
    } else if (inputData.roomType) {
        error.roomType = '';
    }

    if (inputData.roomDescription !== undefined && !inputData.roomDescription) {
        error.roomDescription = "Room description is required";
        isValid = false;
    } else if (inputData.roomDescription !== undefined && inputData.roomDescription.length > 1500) {
        error.roomDescription = "Description must be less than 1500 characters";
        isValid = false;
    } else if (inputData.roomDescription) {
        error.roomDescription = '';
    }

    if (inputData.nightlyRate !== undefined && !inputData.nightlyRate) {
        error.nightlyRate = "Nightly rate is required";
        isValid = false;
    } else if (inputData.nightlyRate !== undefined && !/^\d+$/.test(inputData.nightlyRate.replace(/[₹,]/g, ''))) {
        error.nightlyRate = "Please enter a valid rate";
        isValid = false;
    } else if (inputData.nightlyRate) {
        error.nightlyRate = '';
    }

    return { error, isValid };
};

export const ArrivalDetailValidation = (inputData) => {
    let error = {};
    let isValid = true;

    if (inputData.dateArrival !== undefined && !inputData.dateArrival) {
        error.dateArrival = "Please select arrival date";
        isValid = false;
    } else if (inputData.dateArrival) {
        error.dateArrival = '';
    }

    if (inputData.timeArrival !== undefined && !inputData.timeArrival) {
        error.timeArrival = "Please select arrival time";
        isValid = false;
    } else if (inputData.timeArrival) {
        error.timeArrival = '';
    }

    if (inputData.modeArrival !== undefined && !inputData.modeArrival) {
        error.modeArrival = "Please select mode arrival";
        isValid = false;
    } else if (inputData.modeArrival) {
        error.modeArrival = '';
    }

    const regex = /^[A-Za-z0-9 #\-]+$/;
    if (inputData.FlightTrainNumber !== undefined && !inputData.FlightTrainNumber) {
        error.FlightTrainNumber = "Flight / Train Number is required";
        isValid = false;
    } else if (inputData.FlightTrainNumber !== undefined && !regex.test(inputData.FlightTrainNumber)) {
        error.FlightTrainNumber = "Please enter a valid Flight / Train Number";
        isValid = false;
    } else if (inputData.FlightTrainNumber) {
        error.FlightTrainNumber = '';
    }

    return { error, isValid };
};