import React from "react";
import Form from "../Form/Form";
import "./Modal.css";

const Modal = ({ isFormOpen, closeForm }) => {
  return (
    isFormOpen && (
      <div className="modal">
        <div className="modal-content">
          <button className="close-button" onClick={closeForm}>
            &times;
          </button>
          <Form />
        </div>
      </div>
    )
  );
};

export default Modal;
