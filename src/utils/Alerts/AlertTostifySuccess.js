import { Toast, ToastContainer, Button } from "react-bootstrap";
import { useState } from "react";

function AlertTostifySuccess({show,message}) {
//   const [showSuccess, setShowSuccess] = useState(true);
//   const [showError, setShowError] = useState(true);

  return (
    <>
      <ToastContainer position="top-end" className="p-3">
        {/* ✅ Success Toast */}
        <Toast
          bg="success"
          show={show}
        //   onClose={() => setShowSuccess(false)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {message}
          </Toast.Body>
        </Toast>        
      </ToastContainer>
    </>
  );
}

export default AlertTostifySuccess;
