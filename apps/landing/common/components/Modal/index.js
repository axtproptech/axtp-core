import styled from "styled-components";
import colors from "common/theme/cryptoModern/colors";
import React from "react";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";

const ModalFormWrapper = styled.div`
  position: relative;
  border-radius: 4px;
  color: ${colors.textColor};
  border: 2px solid ${colors.yellow};
  background-color: ${colors.secondary};
  filter: drop-shadow(0px 0px 10px ${colors.yellow});
  width: 600px;

  @media (max-width: 575px) {
    width: 100vw;
    border: none;
    filter: none;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
  }
`;

export const Modal = ({ onClose, open = false, children }) => {
  return (
    <Popup
      modal
      open={open}
      onClose={onClose}
      overlayStyle={{ background: "rgba(0,0,0,0.8)" }}
    >
      {(close) => (
        <ModalFormWrapper>
          <div className="close" onClick={close}>
            ✕
          </div>
          {children}
        </ModalFormWrapper>
      )}
    </Popup>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
