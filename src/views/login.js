import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FormContainer = styled.div`
  background-color: #f7f7f9;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  margin: 150px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  width: 96%;
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
margin-bottom: 40px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 14px;
  text-align: center;
`;

const UserForm = ({ onSubmit }) => {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

  const validate = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters long';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newUser = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:8080/api/profilelogin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User logged in successfully:', result);
        if (onSubmit) {
          onSubmit(result);
        }
        localStorage.setItem("Authenticated", true);
        toast.success('Login successful!'); 
        navigate('/dashboard'); 
      } else {
        console.error('Failed to log in:', response.statusText);
        toast.error('Login failed. Please check your credentials.'); 
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('An error occurred during login.'); 
    }
  };

  return (
    <FormContainer>
      <Title>Login</Title>
      <form onSubmit={handleSubmit}>
        <Label>User Name</Label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}

        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default UserForm;
