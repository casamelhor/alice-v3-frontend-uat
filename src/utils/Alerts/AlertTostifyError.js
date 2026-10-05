import { Toast, ToastContainer, Button } from "react-bootstrap";
import { useState } from "react";

function AlertTostifyError({show,message}) {

  return (
    <>
      <ToastContainer position="top-end" className="p-3">        
        <Toast
          bg="danger"
          show={show}
        //   onClose={() => setShowError(false)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default AlertTostifyError;
