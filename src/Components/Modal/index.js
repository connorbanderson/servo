import React from "react";
import MaterialModal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import "./Modal.scss";
import modalWave from "./modalWave.svg";

const Modal = ({
  isVisible,
  toggleModal,
  title,
  children,
  onSubmit,
  secondaryActionName
}) => {
  return (
    <MaterialModal
      aria-labelledby="Servo-Modal"
      aria-describedby="Servo-Modal"
      open={isVisible}
      onClose={() => toggleModal()}
      className="modalContainer"
    >
      <div className="servoModal">
        <img
          src={modalWave}
          className="servoModal__wave"
          alt="Servo Modal Top Wave"
        />
        <div className="servoModal__closeButtonWrapper">
          <IconButton size="small">
            <Close
              onClick={toggleModal}
              className="servoModal__closeIcon"
              fontSize="inherit"
            />
          </IconButton>
        </div>
        <div className="servoModal__body">
          <h2 style={{ fontSize: "1.65rem" }} className="primaryGradientText">
            {title}
          </h2>
          {children}
        </div>
        <div className="servoModal__actionFooter">
          <div className="marginR20">
            {secondaryActionName && (
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => null}
                disabled={false}
                className="servoButton--secondary marginR10"
              >
                <DeleteIcon style={{ fontSize: "22px", color: "#E94057" }} />
                <span
                  className="primaryText"
                  style={{ fontSize: "14px", marginLeft: "5px" }}
                >
                  Delete
                </span>
              </Button>
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSubmit()}
            disabled={false}
            className="servoButton--primary"
          >
            <Add className="servoButton--primary__icon" />
            <span
              className="servoButton--primary__title"
              style={{ fontSize: "14px", marginLeft: "5px" }}
            >
              Add
            </span>
          </Button>
        </div>
      </div>
    </MaterialModal>
  );
};

Modal.defaultProps = {
  isVisible: false,
  toggleModal: () => console.log("Toggle function not declared."),
  title: "Missing a Title",
  children: null,
  primaryActionName: null,
  primaryActionOnClick: () =>
    console.log("primaryActionOnClick function not declared."),
  primaryActionIcon: null,
  secondaryActionName: null,
  secondaryActionOnClick: () =>
    console.log("secondaryActionOnClick function not declared."),
  secondaryActionIcon: null
};

export default Modal;
