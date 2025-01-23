import React from "react";
import Form from "../Form/Form";
import "./Modal.css";

const Modal = ({ isFormOpen, closeForm, selectedUser, selectedUserId }) => {
  return (
    isFormOpen && (
      <div className="modal">
        <div className="modal-content">
          <button className="close-button" onClick={closeForm}>
            &times;
          </button>
          <Form selectedUser={selectedUser} selectedUserId={selectedUserId}/>
        </div>
      </div>
    )
  );
};

export default Modal;
