import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (role) => {
        let email = 'admin@rescue1122.pk';
        if (role === 'operator') email = 'op1@rescue1122.pk';
        if (role === 'responder') email = 'responder@rescue1122.pk';
        if (role === 'hospital') email = 'dhq@hospital.pk';


        console.log('Attempting login for role:', role, 'with email:', email);
        try {
            const response = await authApi.login({
                email: email,
                password: 'password', // Demo password
                role: role
            });


            console.log('Login response:', response.data);

            if (response.data && response.data.access_token) {
                const userData = { ...response.data.user, token: response.data.access_token };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login Error Detailed:', error.response?.data || error.message);
            throw error; // Rethrow so the UI can catch it
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
