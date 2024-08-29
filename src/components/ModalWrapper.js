import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  position: relative;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: red;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const ModalBody = styled.div`
  margin-top: 20px;
`;

function ModalWrapper({
  renderModalBody = () => {},
  onHiding = () => {},
  modalTitle,
  modalAttrs,
  children,
  disabled,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    onHiding(); // Call the onHiding callback when closing
  };

  return (
    <>
      <div
        role={`${disabled ? '' : 'button'}`}
        className='d-inline-block'
        style={{ opacity: disabled ? '.5' : '1', cursor: disabled ? 'not-allowed' : 'pointer' }}
        onClick={() => {
          if (disabled) return;
          setIsModalOpen(true);
        }}
      >
        {children}
      </div>

      {isModalOpen && (
        <Overlay>
          <ModalContainer {...modalAttrs}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <ModalTitle>{modalTitle}</ModalTitle>
            <ModalBody>
              {renderModalBody(closeModal)}
            </ModalBody>
          </ModalContainer>
        </Overlay>
      )}
    </>
  );
}

export default ModalWrapper;
