import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import styled from 'styled-components';
import axios from 'axios';

const ActionButton = styled.button`
  background-color: #e63946;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #b71c1c;
  }
`;

const VacateModal = ({ userId, userName }) => {
  const [vacateData, setVacateData] = useState(null);
  const [loading, setLoading] = useState(false);

  const vacateUser = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:8080/api/profile/users/vacate/${userId}`);
      setVacateData(response.data);
    } catch (error) {
      console.error('Error vacating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderModalBody = (closeModal) => (
    <div>
      <h4>Vacate Details for {userName}</h4>
      {loading ? (
        <p>Processing...</p>
      ) : vacateData ? (
        <div>
          <p><strong>Total Paid:</strong> {vacateData.totalPaid}</p>
          <p><strong>Total Pending:</strong> {vacateData.totalPending}</p>
          <p><strong>Refund Amount:</strong> {vacateData.refundAmount}</p>
          <p><strong>Status:</strong> {vacateData.message}</p>
        </div>
      ) : (
        <p>No vacate data available.</p>
      )}
    </div>
  );

  return (
    <>
      <ModalWrapper renderModalBody={renderModalBody} modalTitle="Vacate User">
        <ActionButton onClick={vacateUser}>
          {'Vacate User'}
        </ActionButton>
      </ModalWrapper>
    </>
  );
};

export default VacateModal;
