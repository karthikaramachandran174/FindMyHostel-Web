import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import styled from 'styled-components';


import axios from 'axios';
const ActionButton = styled.button`
  background-color: #535092;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #37347d;
  }
`;
const BillModal = ({ userId,userName }) => {
  const [billData, setBillData] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profile/users/bills/${userId}`);
        console.log('data', response.data);
        setBillData(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, [userId]);

  const renderModalBody = (closeModal) => (
    <div>
      <h4>Bill Details for {userName}</h4>
      {billData.length > 0 ? (
        <ul>
          {billData.filter(item=>item.userId===userId).map((bill) => (
            <li key={bill._id}>
              <strong>Amount:</strong> {bill.amount} <br />
              <strong>Status:</strong> {bill.status} <br />
              <strong>Due Date:</strong> {new Date(bill.dueDate).toLocaleDateString()} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>No bills found for this user.</p>
      )}
    </div>
  );

  return (
    <>
      <ModalWrapper renderModalBody={renderModalBody} modalTitle="User Bills">
        <ActionButton>
          {'View Bills'}
        </ActionButton>
      </ModalWrapper>
    </>
  );
};

export default BillModal;
