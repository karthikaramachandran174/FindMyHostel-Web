import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import UserFormModal from './userModal'; 
import { Navigate } from 'react-router-dom';
import BillModal from '../components/BillModal';
import VacateModal from '../components/VacateModal';

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

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/profile/deleteuser/${userId}`);
      setUsers(users.filter((user) => user._id !== userId)); 
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = async (userId) => {
    const userToUpdate = users.find((user) => user._id === userId);
    setSelectedUser(userToUpdate);
    openModal();
  };

  return (
    <Container>
      <Button onClick={openModal}>Create New User</Button>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser} 
      />

      <h3>Users List</h3>
      <Table>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Edit</TableHeader>
            <TableHeader>Delete</TableHeader>
            <TableHeader>View Bill</TableHeader>
            <TableHeader>Vacate User</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <ActionButton onClick={() => handleUpdate(user._id)}>Update</ActionButton>
              </TableCell>
              <TableCell>
                <ActionButton delete onClick={() => handleDelete(user._id)}>Delete</ActionButton>
              </TableCell>
              <TableCell><BillModal userId={user._id} userName={user.name}/></TableCell>
              <TableCell><VacateModal userId={user._id} userName={user.name}/></TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Users;
