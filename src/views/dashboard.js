import React, { useState } from 'react';
import Bills from './bill';
import Users from './user';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.setItem('Authenticated', false);
        navigate('/');
    };
    return (
        <>
            <Bills />
            <Users />
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    padding: '10px',
                    width: '15%',
                    cursor:'pointer'
                }}
            >
                <button
                    style={{
                        background: 'red',
                        width: '100%',
                        borderRadius: '10px',
                        padding: '10px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor:'pointer'
                    }}
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default Dashboard;
