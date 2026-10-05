import { toast } from "react-toastify";

export const alert_danger = (message) =>
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton:true
  });

export const alert_success = (message) =>
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton: true,
  });

export const alert_info = (message) =>
  toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const showError = (error) => {  
  const errorMessages = Object.entries(error).map(([field, messages]) => `${messages.join(', ')}`).join('\n');
  alert_danger(errorMessages)
};
export const showErrorMsg = (error) => {  
  const errorMessages = Object.entries(error).map(([field, messages]) => `${messages.join(', ')}`).join('\n');
  return errorMessages;
};
export const showErrorMsgFull = (error) => {  
  const errorMessages = Object.entries(error).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('\n');
  return errorMessages;
};

export const extractErrors = (obj) => {
  const messages = [];

  const traverse = (value) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") {
          messages.push(item);
        } else {
          traverse(item);
        }
      });
      return;
    }

    if (value && typeof value === "object") {
      Object.values(value).forEach(traverse);
    }
  };

  traverse(obj);

  return messages;
};
