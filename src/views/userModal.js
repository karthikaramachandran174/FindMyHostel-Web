import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
  margin-left: auto;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const UserFormModal = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setRole(user.role || 'tenant');
      setStatus(user.status || 'active');
      setPassword('');
      setConfirmPassword('');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newUser = {
      name,
      role,
      status,
      ...(user ? {} : { password, confirmPassword })  
    };
  
    try {
      if (user) {
        const response = await axios.put(`http://localhost:8080/api/profile/updateuser/${user._id}`, newUser);
        if (response.status === 200) {
          console.log('User updated successfully');
        } else {
          console.error('Failed to update user:', response.statusText);
        }
      } else {
        const response = await axios.post('http://localhost:8080/api/profile/adduser', newUser);
        if (response.status === 201) {
          console.log('User created successfully');
        } else {
          console.error('Failed to create user:', response.statusText);
        }
      }
      onClose();
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <Div>
          <Title>{user ? 'Update User' : 'Create a New User'}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Div>

        <form onSubmit={handleSubmit}>
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Label>Role</Label>
          <Select value={role} onChange={(e) => setRole(e.target.value)} required>
  <option value="" disabled>Select a role</option>
  <option value="admin">Admin</option>
  <option value="tenant">Tenant</option>
</Select>
<Label>Status</Label>
<Select value={status} onChange={(e) => setStatus(e.target.value)} required>
  <option value="" disabled>Select a status</option>
  <option value="active">Active</option>
  <option value="vacated">Vacated</option>
</Select>
          {!user && (
            <>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!user} 
          />

          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={!user}
          />
          </>
          )}
          <SubmitButton type="submit">{user ? 'Update' : 'Submit'}</SubmitButton>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default UserFormModal;
