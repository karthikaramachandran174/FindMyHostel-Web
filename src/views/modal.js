import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModalOverlay = styled.div`
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

const Div = styled.div`
  display: flex;
`;

const ModalContainer = styled.div`
  background-color: #f7f7f9;
  border-radius: 10px;
  padding: 20px;
  width: 35%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  display: block;
  width: 96%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 16px;
  margin-left: auto;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #555;
  font-size: 20px;
  cursor: pointer;
  margin-left: auto;
  top: 10px;
  right: 10px;

  &:hover {
    color: #000;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const BillFormModal = ({ isOpen, onClose, bill, onRefresh }) => {
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [billType, setBillType] = useState('');

  useEffect(() => {
    if (bill) {
      setAmount(bill.amount);
      setDueDate(new Date(bill.dueDate));
      setStatus(bill.status);
      setUserId(bill.userId);
      setBillType(bill.billType);
    }
  }, [bill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const billData = {
        amount,
        dueDate: dueDate.toISOString().split('T')[0],
        status,
        userId,
        billType
      };

      if (bill) {
        await axios.put(`http://localhost:8080/api/profile/bills/${bill._id}`, billData);
        toast.success('Bill updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/profile/bills', billData);
        toast.success('Bill added successfully');
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <Div>
          <Title>{bill ? 'Update Bill' : 'Create Bill'}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Div>
        <form onSubmit={handleSubmit}>
          <Label>Amount</Label>
          <Input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Label>Due Date</Label>
          <StyledDatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            required
          />

          <Label>Status</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="" disabled>Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </Select>

          <Label>User</Label>
          <Input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />

          <Label>Bill Type</Label>
          <Select
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
            required
          >
            <option value="" disabled>Select Bill Type</option>
            <option value="Security">Utility</option>
            <option value="Rent">Rent</option>
            <option value="Utility">Subscription</option>
          </Select>

          <SubmitButton type="submit">{bill ? 'Update' : 'Add'}</SubmitButton>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default BillFormModal;
