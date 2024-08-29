import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import BillFormModal from './modal'; 

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  color: #333;
  padding: 10px;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fff;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #fff;
  text-align: left;
`;

const ActionButton = styled.button`
  background-color: ${(props) => (props.delete ? '#dc3545' : '#ffc107')};
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: ${(props) => (props.delete ? '#c82333' : '#e0a800')};
  }
`;

const Bills = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingBill, setEditingBill] = useState(null); 

  const openModal = (bill = null) => {
    setEditingBill(bill); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingBill(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile/bills');
        setBills(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchBills();
    fetchUsers();
  }, []);

  const handleDelete = async (billId) => {
    try {
      await axios.delete(`http://localhost:8080/api/profile/bills/${billId}`);
      setBills(bills.filter((bill) => bill._id !== billId)); 
      console.log('Bill deleted successfully');
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const handleUpdate = (bill) => {
    openModal(bill);
  };

  const getUsernameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : 'Unknown';
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Container>
      <Button onClick={() => openModal()}>Create New Bill</Button>
      <BillFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        bill={editingBill} 
      />
      <h3>Bills</h3>
      <Table>
        <thead>
          <tr>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Due Date</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Bill Type</TableHeader>
            <TableHeader>Edit</TableHeader>
            <TableHeader>Delete</TableHeader>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <TableRow key={bill._id}>
              <TableCell>{bill.amount}</TableCell>
              <TableCell>{formatDate(bill.dueDate)}</TableCell>
              <TableCell>{bill.status}</TableCell>
              <TableCell>{getUsernameById(bill.userId)}</TableCell>
              <TableCell>{bill.billType}</TableCell>
              <TableCell>
                <ActionButton onClick={() => handleUpdate(bill)}>Update</ActionButton>
              </TableCell>
              <TableCell>
                <ActionButton delete onClick={() => handleDelete(bill._id)}>Delete</ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Bills;
